# Alluz Tech — Deploy no GCP Cloud Run

**Tempo estimado**: 45 minutos (incluindo configuração Terraform)

---

## 🏗️ Arquitetura

```
GitHub (push → main)
    ↓
GitHub Actions (build + push)
    ↓
Google Container Registry (GCR)
    ↓
Cloud Run Service ← Secret Manager (credenciais)
    ├── GET  /          → serve index.html (SPA)
    ├── POST /api/chat  → Groq API (IA Luz)
    ├── POST /api/contact → SMTP (envio de email)
    └── GET  /health    → health check
```

**Infraestrutura**: Terraform automatiza tudo (APIs, Service Accounts, Secrets, Cloud Run)

---

## 📋 Pré-requisitos

- [x] Projeto GCP criado (ID: `728965450469`)
- [ ] Conta Groq ativa com API Key (grátis em https://console.groq.com)
- [ ] Credenciais SMTP prontas:
  - Hostname (ex: `smtp.gmail.com`)
  - Usuario (ex: `seu@email.com`)
  - Senha (Gmail: use "Senha de app" em myaccount.google.com → Security)
- [ ] Email para receber contatos (ex: `contato@alluztech.com`)
- [ ] Terraform >= 1.0 instalado localmente OU usar GCP Cloud Shell
- [ ] gcloud CLI autenticado (`gcloud auth login`)
- [ ] GitHub Secrets configurados depois

---

## ⚡ PASSO 1 — Adicionar GitHub Secrets

No repositório GitHub, adicionar os segredos sensíveis em:

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Adicionar **5 secrets**:

| Nome | Valor |
|------|-------|
| `GCP_GROQ_API_KEY` | `gsk_...` (de https://console.groq.com/keys) |
| `GCP_SMTP_HOST` | `smtp.gmail.com` |
| `GCP_SMTP_USER` | `seu@email.com` |
| `GCP_SMTP_PASS` | `xxxx xxxx xxxx xxxx` (Gmail app password) |
| `GCP_CONTACT_EMAIL` | `contato@alluztech.com` |
| `GCP_PROJECT_ID` | `728965450469` |
| `GCP_SA_KEY` | (adicionaremos depois) |

---

## ⚡ PASSO 2 — Preparar Variáveis Terraform

Script para copiar dos GitHub Secrets para `terraform.tfvars`:

```bash
cd terraform

# Usar variáveis de ambiente (você pode colar do GitHub Secrets)
cat > terraform.tfvars <<EOF
gcp_project_id = "728965450469"
gcp_region     = "us-central1"
groq_api_key   = "$GCP_GROQ_API_KEY"
smtp_host      = "$GCP_SMTP_HOST"
smtp_user      = "$GCP_SMTP_USER"
smtp_pass      = "$GCP_SMTP_PASS"
contact_email  = "$GCP_CONTACT_EMAIL"
EOF
```

Ou editar manualmente:

```bash
nano terraform.tfvars
```

⚠️ **IMPORTANTE**: `terraform.tfvars` nunca é commitado (está no `.gitignore`)

---

## 🚀 PASSO 3 — Executar Terraform (Cloud Shell do GCP)

Usar terminal do GCP no navegador (é mais fácil):

```bash
# Navegue até a pasta do terraform
cd terraform

# Inicialize o Terraform
terraform init

# Valide a configuração
terraform plan

# Aplique a infraestrutura
terraform apply
```

Terraform vai:
1. ✅ Ativar APIs necessárias (Cloud Run, GCR, Secret Manager, IAM)
2. ✅ Criar Service Account `github-actions-deployer`
3. ✅ Armazenar segredos no GCP Secret Manager
4. ✅ Preparar Cloud Run (ainda sem imagem Docker)

Salve a saída, especialmente:
- `service_account_email` → necessário para gerar chave
- `github_actions_setup` → instruções para próximos passos

---

## 🔑 PASSO 4 — Gerar Credenciais para GitHub Actions

No **Cloud Shell do GCP** (ou localmente com `gcloud` autenticado):

```bash
# Variáveis de ajuda
PROJECT_ID="728965450469"
SA_EMAIL="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

# Gerar chave JSON (válida por 10 anos)
gcloud iam service-accounts keys create sa-key.json \
  --iam-account="$SA_EMAIL"

# Mostrar conteúdo (vai usar no GitHub)
cat sa-key.json
```

Copiar todo o conteúdo JSON que aparecer.

---

## 🐙 PASSO 5 — Adicionar GitHub Secrets

No repositório GitHub:

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Adicionar dois secrets:

| Nome | Valor |
|------|-------|
| `GCP_PROJECT_ID` | `728965450469` |
| `GCP_SA_KEY` | (cola inteiro o conteúdo JSON gerado) |

---

## 📦 PASSO 6 — Primeiro Deploy

Fazer push para main (vai triggar GitHub Actions automaticamente):

```bash
git add .
git commit -m "feat: infrastructure setup with Terraform"
git push origin main
```

Acompanhe o deploy em: **GitHub** → **Actions**

O workflow vai:
1. Fazer checkout do código
2. Autenticar com Google Cloud (usando os secrets)
3. Build Docker image
4. Push para GCR
5. Deploy para Cloud Run
6. Health check

**Primeira vez**: pode levar 5-10 minutos.

---

## ✅ PASSO 7 — Validar Deploy

Após sucesso no GitHub Actions:

### 1. Pegar URL do Cloud Run

```bash
gcloud run services describe alluz-tech \
  --region us-central1 \
  --format 'value(status.url)'
```

Ou ver em: **GCP Console** → **Cloud Run** → `alluz-tech`

### 2. Testar Health Check

```bash
curl https://alluz-tech-XXXX.run.app/health
# Esperado: {"status":"ok"}
```

### 3. Testar Chat API

```bash
curl -X POST https://alluz-tech-XXXX.run.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Olá, como você está?"}
    ]
  }'
```

### 4. Testar Contact Form

```bash
curl -X POST https://alluz-tech-XXXX.run.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@example.com",
    "message": "Teste de contato"
  }'
```

---

## 🛠️ Desenvolvimento Local

Para testar localmente **sem Cloud Run**:

```bash
# Copiar template de env
cp .env.example .env

# Preencher com valores reais (mesmos de terraform.tfvars)
# editar .env

# Instalar dependências
npm install

# Rodar localmente com hot-reload
npm run dev
# → http://localhost:8080

# Testar com Docker localmente
docker-compose up
# → http://localhost:8080
```

---

## 🔄 Atualizações Futuras

### Atualizar código ou dependências

```bash
# Fazer alterações no código
# ...

# Commit e push
git add .
git commit -m "feat: update feature"
git push origin main

# GitHub Actions redeploya automaticamente
```

### Atualizar credenciais (SMTP, Groq, etc)

```bash
# Editar terraform/terraform.tfvars
vim terraform/terraform.tfvars

# Aplicar mudanças
cd terraform
terraform apply

# Não precisa fazer rebuild/redeploy da imagem,
# apenas atualiza os secrets no GCP
```

### Escalar ou mudar configuração

```bash
# Editar terraform/terraform.tfvars
# Aumentar cloud_run_max_instances, memory, etc

terraform apply

# Aplicado automaticamente na próxima requisição
```

---

## 📊 Monitoramento

### Logs em Tempo Real

```bash
gcloud run logs read alluz-tech --region us-central1 --follow
```

### Dashboard do Cloud Run

**GCP Console** → **Cloud Run** → `alluz-tech` → **Logs** ou **Metrics**

- Requisições por segundo
- Latência (P50, P95, P99)
- Erros
- CPU e memória

---

## 🧹 Limpeza (se necessário)

### Deletar tudo

```bash
cd terraform
terraform destroy
```

Isso remove:
- Cloud Run service
- Service accounts
- Secrets
- **MAS NÃO deleta**: APIs ativadas, GCR images (deletar manualmente se desejar economizar)

---

## 💰 Custo

**Free Tier GCP** (quando aplicável):

| Serviço | Limite Grátis | Custo Extra |
|---------|---------------|------------|
| Cloud Run | 2M req/mês | $0.40/1M req |
| Secret Manager | 10k accesses/mês | $0.06/10k |
| Container Registry | 1GB/mês | $0.026/GB |
| Groq API | Generoso | $0.14/1k tokens |

**Estimado para site pequeno**: **$0-5/mês** (freqüentemente $0)

---

## 🆘 Troubleshooting

### Erro: "API Cloud Run not enabled"

```bash
gcloud services enable run.googleapis.com
```

(Terraform deveria ter feito isso, mas garanta manualmente)

### Deploy falha: "Image not found"

Certificar que Docker build passou e imagem foi enviada a GCR:

```bash
gcloud container images list --repository=gcr.io/728965450469
```

### Cloud Run returns 500

Verificar logs:

```bash
gcloud run logs read alluz-tech --region us-central1 --limit=50
```

Procurar por erros de variáveis de ambiente (secrets não configurados).

### SMTP não funciona

Validar que a senha SMTP está correta:
- Gmail: usar "Senha de app" (Settings → Security → App passwords)
- Não a senha comum da conta

---

## 📚 Mais Informação

- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GCP Secret Manager](https://cloud.google.com/secret-manager)
- [Groq API](https://console.groq.com)
