# Terraform — Infraestrutura GCP para Alluz Tech

## 🔒 Segurança: Variáveis Sensíveis

**Credenciais sensíveis NUNCA são armazenadas em arquivos locais.**

Elas são passadas via **variáveis de ambiente** no momento da execução do Terraform.

---

## 📝 Arquivo `terraform.tfvars`

Contém apenas valores **não-sensíveis**:
- `gcp_project_id` — ID do projeto (público)
- `gcp_region` — Região do GCP
- Configurações de Cloud Run (memória, CPU, etc)
- Modelo Groq padrão

✅ **Seguro commitar este arquivo**

---

## 🔐 Variáveis Sensíveis (Não em Arquivo)

As seguintes variáveis devem ser **passadas via variáveis de ambiente**:

- `groq_api_key` — API Key do Groq
- `resend_api_key` — API Key do Resend
- `contact_email` — Email para contatos

---

## 🚀 Como Executar

### Opção 1: Variáveis de Ambiente (Recomendado)

```bash
export TF_VAR_groq_api_key="gsk_YOUR_KEY"
export TF_VAR_resend_api_key="re_YOUR_KEY"
export TF_VAR_contact_email="seu@email.com"

terraform init
terraform plan
terraform apply
```

### Opção 2: Linha de Comando

```bash
terraform apply \
  -var="groq_api_key=gsk_YOUR_KEY" \
  -var="resend_api_key=re_YOUR_KEY" \
  -var="contact_email=seu@email.com"
```

### Opção 3: Arquivo (Inseguro ⚠️ — Não Recomendado)

Se precisar usar arquivo, crie `terraform.auto.tfvars` (ignorado do git):

```hcl
# terraform.auto.tfvars (NÃO COMMITAR)
groq_api_key   = "gsk_..."
resend_api_key = "re_..."
contact_email  = "seu@email.com"
```

---

## 📦 Estrutura

```
terraform/
├── main.tf              # Configuração dos providers
├── variables.tf         # Definição de todas as variáveis
├── outputs.tf           # Outputs do Terraform
├── terraform.tfvars     # Valores não-sensíveis (SAFE TO COMMIT)
├── gcp_setup.tf         # APIs, IAM, Service Accounts
├── gcp_secrets.tf       # GCP Secret Manager
├── gcp_cloud_run.tf     # Cloud Run Service
└── README.md            # Este arquivo
```

---

## 🔄 Fluxo de Deployment

1. **Terraform** (local ou Cloud Shell)
   - Cria infraestrutura no GCP
   - Armazena credenciais em GCP Secret Manager
   - Configura Cloud Run

2. **GitHub Actions** (em cada push para main)
   - Usa credenciais do GitHub Secrets
   - Autentica com GCP usando Service Account
   - Faz build e deploy da imagem Docker
   - Injeta credenciais do Secret Manager no Cloud Run

---

## ⚠️ Checklist de Segurança

- [x] Credenciais sensíveis não estão no `terraform.tfvars`
- [x] `terraform.tfvars` é seguro commitar
- [x] Variáveis passadas via ambiente no momento da execução
- [x] GitHub Actions não precisa de credenciais no código
- [x] Credenciais são armazenadas em GCP Secret Manager
- [ ] ANTES DE EXECUTAR: Garantir que tem as credenciais (Groq + Resend)

---

## 🎯 Próximos Passos

1. Obter credenciais:
   - Groq: https://console.groq.com/keys
   - Resend: https://resend.com/api-keys

2. Executar Terraform:
   ```bash
   export TF_VAR_groq_api_key="..."
   export TF_VAR_resend_api_key="..."
   export TF_VAR_contact_email="..."
   terraform init && terraform apply
   ```

3. Gerar credenciais GitHub Actions (ver DEPLOY.md PASSO 4)

---

Para mais detalhes, veja [DEPLOY.md](../DEPLOY.md)
