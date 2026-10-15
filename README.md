# Site Valiqon

**Este repositório (`oromanini/alluztech-site`) é a fonte oficial do site da Valiqon.**
Todo push em `main` faz build e deploy em produção.

| | |
|---|---|
| Projeto GCP | `alluztech-site` (nº 728965450469) |
| Serviço Cloud Run | `alluz-tech` · região `us-central1` |
| Imagem | `us-central1-docker.pkg.dev/alluztech-site/alluz-tech/alluz-tech` |
| Service account de runtime | `cloud-run-app@728965450469.iam.gserviceaccount.com` |
| URL | https://alluz-tech-5pdoktydja-uc.a.run.app |
| Workflow | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |
| Secrets do GitHub | `GCP_SA_KEY`, `GCP_PROJECT_ID`, `GCP_GROQ_API_KEY`, `GCP_RESEND_API_KEY`, `GCP_CONTACT_EMAIL` |

O nome do repositório e do serviço ainda são `alluz-tech` por histórico; o conteúdo servido é o site Valiqon.

## Repositório `oromanini/valiqon-site`

`oromanini/valiqon-site` **não faz deploy** (Actions desligado, sem secrets, sem workflow).
É só um espelho antigo — não abra PRs lá. Mudanças no site vão neste repositório.

## Rodar localmente

```bash
npm install
npm start
```

Detalhes de infraestrutura e primeiro setup: [DEPLOY.md](DEPLOY.md).
