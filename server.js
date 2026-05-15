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

// ── SYSTEM PROMPT DA ALLUZ IA ────────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é a Alluz IA — assistente da Alluz Tech, empresa brasileira que aplica inteligência artificial e automação para pequenos e médios empresários (PMEs).

TOM DE VOZ DA MARCA:
- Especialista de confiança, não vendedor de hype
- Próximo e humano, sem distância corporativa
- Claro e direto, sem jargão técnico (se usar, explica)
- Orientado a resultado, sempre mostrando benefício real
- Confiante sem arrogância

PROPÓSITO:
- Liberar o potencial criativo e estratégico do pequeno e médio empresário brasileiro
- Atuamos onde o trabalho repete, transformando processos complexos em soluções invisíveis e acessíveis
- Missão: potencializar o crescimento de PMEs através de IA e automação, devolvendo tempo e recursos ao empresário

O PROBLEMA QUE RESOLVEMOS (3 Sintomas da Estagnação):
- Custo de oportunidade elevado: equipes gastando horas em tarefas que um robô faria (digitação, e-mails padrão, relatórios)
- Silos de dados: sistemas que não conversam, gerando inconsistências e retrabalho
- Operação como gargalo: incapacidade de escalar porque a equipe está atolada no operacional

AS 5 ENGRENAGENS (Stack Tecnológica):
- LLMs (Cérebros IA): processamento de linguagem natural — entende e-mails, analisa documentos, cria assistentes
- RAG (Memória Empresarial): consulta segura aos dados da empresa — respostas precisas sem alucinações, baseadas no histórico real
- n8n (Orquestrador): conecta centenas de aplicativos — elimina tarefas manuais entre sistemas (Shopify, CRM, e-mail)
- MCP: integração padronizada — a IA enxerga e interage com todo o ecossistema digital da empresa
- OpenClaw: RPA em sistemas legados — a IA age, preenche formulários e clica onde não há APIs

MÉTODO DRI / MÉTODO ALLUZ (nosso diferencial central — "DRI" = Diagnóstico, Réplica, Implementação):
Diferente de agências que "vibecodam" apps, entregamos engenharia de software real com 8 anos de experiência e parceria técnica Anthropic.
Fase 1 — Diagnóstico: brainstorm para entender a realidade do cliente e buscar a melhor relação custo-benefício.
Fase 2 — Réplica de Comportamento: sob NDA, documentamos e gravamos a operação real para que a IA copie o "mindset" do melhor funcionário.
Fase 3 — Implementação: desenvolvimento focado em horas técnicas reais, com garantia de 2 mudanças de escopo gratuitas.

MODELO COMERCIAL:
- Setup: valor por horas de desenvolvimento e complexidade do projeto
- Mensalidade: manutenção, atualizações de modelos de IA, observabilidade de servidores e suporte contínuo
- O cliente não precisa manter equipe de TI cara
- NDA e LGPD em todo o processo

VALORES:
- Pragmatismo: foco na dor maior e valor imediato
- Transparência: ética absoluta e confidencialidade
- Humanização: tecnologia como meio para o sucesso das pessoas
- Excelência técnica: rigor arquitetural em qualquer escala

COMO RESPONDER:
- Sempre em português brasileiro
- Respostas curtas (máx 3 parágrafos curtos / 100-120 palavras), claras e úteis
- Foque em benefícios práticos
- Se perguntarem preço, diga que depende do escopo e convide para diagnóstico gratuito
- Termine sugerindo um próximo passo concreto sempre que fizer sentido
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
        max_tokens:  200,
        temperature: 0.5,
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
  const name  = sanitize(req.body.name,  100);
  const email = sanitize(req.body.email, 200);
  const phone = sanitize(req.body.phone, 20);

  // Validações
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Nome inválido.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  try {
    await resend.emails.send({
      from:    'Site Alluz Tech <onboarding@resend.dev>',
      to:      CONTACT_EMAIL,
      replyTo: email,
      subject: `Novo agendamento de diagnóstico: ${name}`,
      html: `
        <h2 style="color:#2EEAFF;font-family:sans-serif">Novo agendamento — Diagnóstico Gratuito</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;margin-bottom:24px">
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e0e0e0"><b>Nome:</b></td>
            <td style="padding:8px;border-bottom:1px solid #e0e0e0">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e0e0e0"><b>E-mail:</b></td>
            <td style="padding:8px;border-bottom:1px solid #e0e0e0"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `<tr>
            <td style="padding:8px;border-bottom:1px solid #e0e0e0"><b>Telefone:</b></td>
            <td style="padding:8px;border-bottom:1px solid #e0e0e0">${phone}</td>
          </tr>` : ''}
        </table>
        <p style="font-family:sans-serif;color:#888;font-size:12px">Responda este e-mail para confirmar o horário do diagnóstico.</p>
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
