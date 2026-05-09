# Docker Setup - Alluz Motion Hero Local Testing

## 📦 O que mudou no `docker-compose.yml`

Agora temos **dois serviços**:

```yaml
services:
  api:          # Express backend (porta 8080)
  vite:         # React + Vite (porta 5173) ← NOVO
```

---

## 🚀 Como rodar localmente com Docker

### 1. Certifique que tá na branch correta
```bash
git status
# Você deve estar em: .claude/worktrees/optimistic-khorana-f85630
```

### 2. Rode o docker-compose
```bash
docker-compose up
```

Isso vai:
- ✅ Instalar dependências (`npm install`)
- ✅ Rodar o Vite dev server na porta **5173**
- ✅ Rodar o Express API na porta **8080**

### 3. Abra no navegador

**Para a nova hero do Alluz:**
```
http://localhost:5173
```

**Para o backend (se precisar testar APIs):**
```
http://localhost:8080
```

---

## 📝 Logs em tempo real

Quando rodar `docker-compose up`, verá algo assim:

```
vite_1         |   VITE v8.0.11  ready in 1234 ms
vite_1         |   ➜  Local:   http://localhost:5173/
vite_1         |   ➜  Network: use --host to expose

api_1          | Server running on port 8080
api_1          | GET /health 200
```

---

## 🔄 Hot Reload

- **Vite** (frontend): qualquer mudança em `src/` recarrega automaticamente no navegador ✨
- **Express** (backend): reinicie o container para ver mudanças

---

## 🛑 Parar e limpar

```bash
# Parar containers
docker-compose down

# Limpar tudo (volumes, images)
docker-compose down -v

# Rebuild (se mudou Dockerfile ou dependências)
docker-compose up --build
```

---

## 🧪 Checklist de testes

Quando `docker-compose up` estiver rodando:

### Navbar
- [ ] Abra http://localhost:5173
- [ ] Logo "ALLUZ" em branco
- [ ] CTA "Diagnóstico grátis" em laranja
- [ ] Scroll down → navbar fica opaco com blur
- [ ] Hover em links → laranja com underline

### Hero
- [ ] Heading "AUTOMATIZE..." com "SEMPRE DELEGOU" em laranja
- [ ] Spline 3D renderizando no background (grid pattern)
- [ ] Subheading e descrição visíveis
- [ ] Botões animados:
  - "Agendar diagnóstico" (laranja) - hover → glow
  - "Ver cases" (border laranja) - hover → glow

### Animações
- [ ] Fade-up no load
- [ ] Glow pulsando no texto destacado
- [ ] Mova mouse → parallax no Spline 3D
- [ ] Scroll indicator flutuando (desktop)

### Responsivo
```bash
# DevTools → Toggle device toolbar
```
- [ ] Mobile (375px): layout ok, botões empilhados
- [ ] Tablet (768px): navbar com nav links
- [ ] Desktop (1280px): tudo visível, hover effects

---

## ⚡ Performance

O Vite é **super rápido** pra desenvolvimento:
- ✅ HMR (Hot Module Replacement) instantâneo
- ✅ Build otimizado para dev (sem minify)
- ✅ Debugging fácil (source maps)

---

## 🔧 Troubleshooting

### Porta 5173 já está em uso
```bash
# Mude a porta no docker-compose.yml
ports:
  - "5174:5173"  # Agora acessa http://localhost:5174
```

### node_modules grande demais (slow mount)
Isso é normal. O Docker faz cache automático com a linha:
```yaml
volumes:
  - /app/node_modules  # cache
```

### Vite não detecta mudanças (HMR)
```bash
# Reinicie o container
docker-compose restart vite
```

### Erro "Cannot find module @splinetool/react-spline"
```bash
# Certifique que npm install rodou
docker-compose up --build

# ou manualmente no container
docker-compose exec vite npm install
```

---

## 📋 Arquitetura

```
http://localhost:5173  (Vite Dev Server)
       ↓
  [React App]
       ↓
  - AlluzHero.tsx
  - AlluzNavbar.tsx
  - App.tsx
       ↓
  Spline 3D → https://prod.spline.design/... (CDN)
  Google Fonts (Sora)
  Tailwind CSS

http://localhost:8080  (Express API)
       ↓
  [Backend]
       ↓
  - /api/chat
  - /api/contact
  - /health
```

---

## ✅ Quando tiver validado tudo

```bash
# Saia do container
docker-compose down

# Crie a branch feature
git checkout -b feat/alluz-motion-hero

# Copie os arquivos (src/components, src/pages, App.tsx, etc)
# Commit e abra PR

git add src/ docker-compose.yml ALLUZ_MOTION_HERO.md
git commit -m "feat: add Alluz motion hero with Spline 3D

- AlluzHero component with Spline 3D parallax
- AlluzNavbar with scroll effects
- Orange/yellow motion theme
- Docker setup for local development
- Responsive design with Tailwind"

git push origin feat/alluz-motion-hero
```

---

**Happy testing! 🚀**
