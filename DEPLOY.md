# Alluz Tech — Deploy no GCP Cloud Run
# Tempo estimado: 30 minutos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ARQUITETURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  GitHub (push → main)
      │
      ▼
  GitHub Actions
      │  build + push imagem
      ▼
  Google Container Registry
      │  deploy
      ▼
  Cloud Run  ←── GCP Secret Manager (chaves)
      │
      ├── GET  /          → serve index.html
      ├── POST /api/chat  → Groq API (Luz)
      ├── POST /api/contact → SMTP (e-mail)
      └── GET  /health    → health check

  ✅ 1 container único
  ✅ Banco de dados: não necessário
  ✅ Custo free tier: $0/mês


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PASSO 1 — PRÉ-REQUISITOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Conta Google Cloud: https://console.cloud.google.com
- Conta Groq (grátis): https://console.groq.com
- Repositório no GitHub com o código

Instalar gcloud CLI (se não tiver):
  https://cloud.google.com/sdk/docs/install


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PASSO 2 — CRIAR PROJETO GCP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  gcloud projects create alluz-tech --name="Alluz Tech"
  gcloud config set project alluz-tech

  # Ativar APIs necessárias
  gcloud services enable \
    run.googleapis.com \
    containerregistry.googleapis.com \
    secretmanager.googleapis.com


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PASSO 3 — SERVICE ACCOUNT (GitHub Actions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PROJECT_ID=$(gcloud config get-value project)

  # Criar service account
  gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions"

  SA="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"

  # Permissões mínimas necessárias
  for ROLE in roles/run.admin roles/storage.admin \
              roles/secretmanager.secretAccessor \
              roles/iam.serviceAccountUser; do
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${SA}" --role="$ROLE"
  done

  # Gerar chave JSON
  gcloud iam service-accounts keys create key.json \
    --iam-account="$SA"

  cat key.json   # copiar o conteúdo inteiro


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PASSO 4 — SECRETS NO GCP SECRET MANAGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  As chaves sensíveis ficam APENAS aqui.
    Nunca no .env commitado, nunca no código.

  # Chave do Groq (https://console.groq.com → API Keys)
  echo -n "gsk_SUA_CHAVE_GROQ" | \
    gcloud secrets create GROQ_API_KEY --data-file=-

  # SMTP (Gmail: use "Senha de app", não a senha normal)
  # conta.google.com → Segurança → Senhas de app
  echo -n "smtp.gmail.com" | \
    gcloud secrets create SMTP_HOST --data-file=-

  echo -n "587" | \
    gcloud secrets create SMTP_PORT --data-file=-

  echo -n "seuemail@gmail.com" | \
    gcloud secrets create SMTP_USER --data-file=-

  echo -n "xxxx xxxx xxxx xxxx" | \
    gcloud secrets create SMTP_PASS --data-file=-

  echo -n "contato@alluztech.com.br" | \
    gcloud secrets create CONTACT_EMAIL --data-file=-

  # Dar acesso ao service account em cada secret
  for SECRET in GROQ_API_KEY SMTP_HOST SMTP_PORT \
                SMTP_USER SMTP_PASS CONTACT_EMAIL; do
    gcloud secrets add-iam-policy-binding $SECRET \
      --member="serviceAccount:${SA}" \
      --role="roles/secretmanager.secretAccessor"
  done


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PASSO 5 — GITHUB SECRETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No GitHub: Settings → Secrets → Actions → New secret

  GCP_PROJECT_ID  →  alluz-tech
  GCP_SA_KEY      →  (colar conteúdo inteiro do key.json)

Deletar key.json do computador após isso:
  rm key.json


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PASSO 6 — PRIMEIRO DEPLOY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  git add .
  git commit -m "feat: initial deploy"
  git push origin main

  # GitHub Actions executa automaticamente.
  # Acompanhe em: github.com/SEU_USER/SEU_REPO/actions

  # Ao final, pegar a URL do Cloud Run:
  gcloud run services describe alluz-tech \
    --region us-central1 \
    --format 'value(status.url)'


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## DESENVOLVIMENTO LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  # Copiar .env.example e preencher com valores reais
  cp .env.example .env
  # editar .env com suas chaves

  # Instalar dependências
  npm install

  # Rodar localmente
  npm run dev
  # → http://localhost:8080

  # Testar com Docker localmente
  docker build -t alluz-tech .
  docker run --env-file .env -p 8080:8080 alluz-tech


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ONDE FICAM AS CHAVES — RESUMO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  GROQ_API_KEY    → GCP Secret Manager ✅
  SMTP_USER       → GCP Secret Manager ✅
  SMTP_PASS       → GCP Secret Manager ✅
  SMTP_HOST       → GCP Secret Manager ✅
  SMTP_PORT       → GCP Secret Manager ✅
  CONTACT_EMAIL   → GCP Secret Manager ✅
  GCP_PROJECT_ID  → GitHub Secrets ✅
  GCP_SA_KEY      → GitHub Secrets ✅

  ❌ .env nunca commitado (está no .gitignore)
  ❌ Nenhuma chave no HTML ou JS do frontend
  ❌ Nenhuma chave na imagem Docker (.dockerignore)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CUSTO ESTIMADO — FREE TIER GCP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Cloud Run:      2M req/mês gratuitos    → $0
  Secret Manager: 10k acessos/mês grátis → $0
  Container Reg:  ~$0,026/GB             → ~$0
  Groq API:       free tier generoso     → $0
  ─────────────────────────────────────────────
  Total inicial:                           $0/mês
