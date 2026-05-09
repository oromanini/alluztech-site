'use strict';

const express   = require('express');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');
const path      = require('path');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── VALIDAÇÃO DE AMBIENTE ────────────────────────────────────────────────────
const REQUIRED_ENV = ['GROQ_API_KEY', 'RESEND_API_KEY', 'CONTACT_EMAIL'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`[FATAL] Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  process.exit(1);
}

const GROQ_API_KEY    = process.env.GROQ_API_KEY;
const GROQ_MODEL      = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const RESEND_API_KEY  = process.env.RESEND_API_KEY;
const CONTACT_EMAIL   = process.env.CONTACT_EMAIL;
const ALLOWED_ORIGIN  = process.env.ALLOWED_ORIGIN || '*';

// Inicializar Resend
const resend = new Resend(RESEND_API_KEY);

// ── SYSTEM PROMPT DA LUZ ────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é a Luz, assistente virtual da Alluz Tech, empresa de inteligência artificial para pequenas e médias empresas brasileiras.

SOBRE A ALLUZ TECH:
- Empresa fundada por empresários que entendem os desafios reais das PMEs
- Parte do grupo Alluz (também opera a Alluz Energia)
- Nasceu de uma apresentação para o grupo Elite, rede de empresários
- Missão: democratizar a IA para PMEs brasileiras
- Localizada em Maringá, Paraná

SERVIÇOS:
- Chatbots inteligentes para atendimento ao cliente 24h
- Automação de processos repetitivos (financeiro, RH, atendimento, logística)
- Análise de dados e geração de relatórios automáticos
- Integração com WhatsApp, e-mail e sistemas existentes
- Treinamento de equipes em ferramentas de IA
- Consultoria estratégica em IA para PMEs

DIFERENCIAIS:
- Implementação rápida (2 semanas da conversa ao resultado)
- Sem necessidade de equipe de TI
- ROI mensurável e documentado
- Conformidade com LGPD
- Suporte próximo e contínuo
- Escala no ritmo do cliente

COMO RESPONDER:
- Sempre em português brasileiro, tom próximo e profissional
- Máximo 3 parágrafos curtos por resposta
- Foque em benefícios práticos, não jargão técnico
- Se perguntarem preço, diga que depende do escopo e convide para conversa
- Para orçamentos: direcione para o formulário ou WhatsApp
- Finalize com uma pergunta para engajar
- Nunca invente informações — se não souber, diga que vai verificar`;

// ── TRUST PROXY (necessário para Cloud Run / load balancers) ────────────────
// Cloud Run coloca um proxy na frente da aplicação e envia X-Forwarded-For.
// Sem isso o express-rate-limit não consegue identificar o IP real do cliente.
app.set('trust proxy', 1);

// ── SEGURANÇA: HELMET (OWASP headers) ───────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      scriptSrcAttr:  ["'unsafe-inline'"],           // permite onclick inline
      styleSrc:       ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:        ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      imgSrc:         ["'self'", "data:"],
      connectSrc:     ["'self'", "https://api.groq.com", "https://unpkg.com"],
      objectSrc:      ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Remove header que revela stack
app.disable('x-powered-by');

// ── RATE LIMITING (OWASP — prevenção de brute force / abuso) ────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 15,
  message: { error: 'Limite de mensagens atingido. Aguarde 1 minuto.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: { error: 'Limite de envios atingido. Tente novamente em 1 hora.' },
});

app.use(globalLimiter);

// ── BODY PARSER (limite anti-payload-bombing) ────────────────────────────────
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

// ── STATIC FILES (frontend HTML) ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  maxAge: '1h',
  index: 'index.html',
}));

// ── HELPERS ───────────────────────────────────────────────────────────────────

// Sanitização básica de string (anti-XSS nos logs e e-mails)
function sanitize(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .slice(0, maxLen)
    .replace(/[<>]/g, '')
    .trim();
}

// Validação de e-mail simples
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── ROTA: CHAT (Luz via Groq) ─────────────────────────────────────────────────
app.post('/api/chat', chatLimiter, async (req, res) => {
  const { messages } = req.body;

  // Validação de entrada
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Campo messages inválido.' });
  }

  if (messages.length > 20) {
    return res.status(400).json({ error: 'Histórico muito longo.' });
  }

  // Valida e sanitiza cada mensagem
  const safeMessages = [];
  for (const msg of messages) {
    if (!msg || typeof msg.role !== 'string' || typeof msg.content !== 'string') {
      return res.status(400).json({ error: 'Formato de mensagem inválido.' });
    }
    if (!['user', 'assistant'].includes(msg.role)) {
      return res.status(400).json({ error: 'Role inválido.' });
    }
    safeMessages.push({
      role: msg.role,
      content: sanitize(msg.content, 2000),
    });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        max_tokens:  500,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...safeMessages.slice(-10),
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Groq error]', response.status, err);
      return res.status(502).json({ error: 'Serviço de IA indisponível.' });
    }

    const data  = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({ error: 'Resposta inesperada da IA.' });
    }

    res.json({ reply });

  } catch (err) {
    console.error('[Chat error]', err.message);
    res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

// ── ROTA: FORMULÁRIO DE CONTATO ───────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const name    = sanitize(req.body.name,    100);
  const email   = sanitize(req.body.email,   200);
  const company = sanitize(req.body.company, 100);
  const message = sanitize(req.body.message, 2000);

  // Validações
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Nome inválido.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!message || message.length < 10) {
    return res.status(400).json({ error: 'Mensagem muito curta.' });
  }

  try {
    await resend.emails.send({
      from:    'Site Alluz Tech <onboarding@resend.dev>',
      to:      CONTACT_EMAIL,
      replyTo: email,
      subject: `Novo contato: ${name}${company ? ` — ${company}` : ''}`,
      html: `
        <h2 style="color:#FFAB2E">Novo contato — Alluz Tech</h2>
        <table style="font-family:sans-serif;font-size:14px">
          <tr><td><b>Nome:</b></td><td>${name}</td></tr>
          <tr><td><b>E-mail:</b></td><td>${email}</td></tr>
          <tr><td><b>Empresa:</b></td><td>${company || '—'}</td></tr>
        </table>
        <h3>Mensagem:</h3>
        <p style="font-family:sans-serif">${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error('[Contact error]', err.message);
    res.status(500).json({ error: 'Erro ao enviar e-mail. Tente novamente.' });
  }
});

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'alluz-tech', ts: new Date().toISOString() });
});

// ── 404 — qualquer rota não mapeada serve o index (SPA safe) ─────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Unhandled error]', err.message);
  res.status(500).json({ error: 'Erro interno.' });
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Alluz Tech rodando na porta ${PORT}`);
});
