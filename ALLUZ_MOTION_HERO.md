# Alluz Motion Hero - Setup & Testing Guide

## 📋 O que foi criado

### Componentes React + TypeScript
```
src/
├── components/
│   ├── AlluzHero.tsx      # Hero com Spline 3D + animações motion
│   ├── AlluzNavbar.tsx    # Navbar com blur effect ao scroll
│   ├── Navbar.tsx         # (original SENTINEL)
│   ├── HeroSection.tsx    # (original SENTINEL)
└── pages/
    └── AlluzPage.tsx      # Página de teste com Navbar + Hero

App.tsx                     # Atualizado para usar AlluzPage
```

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v3
- **Fonts**: Sora (Google Fonts)
- **3D**: @splinetool/react-spline + @splinetool/runtime
- **Animations**: Custom CSS keyframes (fade-up, pulse, shimmer, float-up)

### Cores Alluz (Motion Style)
- **Primary Orange**: `#FFAB2E`
- **Dark Orange**: `#D4891A`
- **Text Light**: `#F5EED8`
- **Text Muted**: `rgba(192,180,144,1)`
- **Background**: `#0C0B09` → `#1A1410` gradient

---

## 🚀 Como testar localmente

### 1. Instale dependências (primeira vez)
```bash
npm install
```

### 2. Rode o servidor de desenvolvimento
```bash
npm run dev
```

O servidor irá rodar em: **http://localhost:5173**

### 3. Teste a hero
- Abra o navegador em `http://localhost:5173`
- Você verá a **Alluz Hero com Spline 3D animado**
- O navbar aparecerá fixo no topo
- Scroll para ver as seções de placeholder (Método, Cases)

---

## ✨ Features a testar

### Navbar
- [x] Logo "ALLUZ" em branco
- [x] Nav links (Método, Cases, Tecnologias, Sobre, FAQ)
- [x] Hover effect → laranja
- [x] CTA "Diagnóstico grátis" em laranja
- [x] Blur backdrop ao scroll (>50px)
- [x] Animações fade-in staggered

### Hero Section
- [x] **Spline 3D background** com parallax ao mouse move
- [x] Dark overlay gradient
- [x] **Eyebrow** com ícone raio + "ALLUZ TECH · IA PARA PMES"
- [x] **Heading** "AUTOMATIZE O QUE VOCÊ SEMPRE DELEGOU MANUALMENTE"
  - "SEMPRE DELEGOU" em **laranja com glow**
- [x] **Subheading** "Recupere horas de trabalho toda semana."
- [x] **Descrição** detalhada
- [x] **Dois botões CTA**:
  - "Agendar diagnóstico" (laranja gradient com glow ao hover)
  - "Ver cases" (border laranja com glow ao hover)
- [x] **Trust line** "Já ajudamos +30 PMEs..."
- [x] **Scroll indicator** (flutuante, hidden em mobile)
- [x] Animações fade-up com stagger (0.1s → 1.2s)

### Animações
- [x] Fade-up no load (cubic-bezier)
- [x] Glow pulse no "SEMPRE DELEGOU"
- [x] Shimmer effect nos botões ao hover
- [x] Parallax 3D ao mover mouse
- [x] Sombra dinâmica ao hover dos botões
- [x] Float-up no scroll indicator

### Responsivo
- [x] Desktop (full navbar + scroll indicator)
- [x] Mobile (navbar hidden, content centered, responsive typography com clamp())
- [x] Teste em 375px (mobile), 768px (tablet), 1280px (desktop)

---

## 🔍 Onde testar cada coisa

| Elemento | Ação | Resultado esperado |
|----------|------|-------------------|
| Navbar | Scroll down 50px | Background fica opaco com blur |
| Navbar logo | Hover | Muda para laranja (#FFAB2E) |
| Navbar links | Hover | Cor muda para laranja + underline glow aparece |
| Navbar CTA | Hover | Sombra aumenta, brilho sutil |
| Hero eyebrow | Load | Fade-up com ícone pulsando |
| Hero heading | Load | Fade-up, "SEMPRE DELEGOU" com glow contínuo |
| "Agendar diagnóstico" | Hover | Brilho aumenta, sombra verde-laranja, seta move → |
| "Ver cases" | Hover | Border fica mais visível, glow aparece |
| Mouse | Move na hero | Parallax sutil no Spline 3D (20px max offset) |
| Scroll indicator | Scroll down | Desaparece em desktop (hidden md:flex) |

---

## 📱 Teste Responsivo

### Mobile (375px)
```bash
DevTools → Toggle device toolbar → iPhone 12
```
- [ ] Navbar tá ok (logo + CTA button apenas)
- [ ] Hero heading tá legível (clamp() responsive)
- [ ] Botões empilhados verticalmente
- [ ] Scroll indicator hidden

### Tablet (768px)
```bash
iPad Air (820px)
```
- [ ] Navbar mostra nav links
- [ ] Hero heading ainda bem proporcionado
- [ ] Botões lado a lado com espaço

### Desktop (1280px+)
```bash
Full width browser
```
- [ ] Tudo visível (navbar completo, scroll indicator)
- [ ] Hover effects funcionam
- [ ] Parallax mouse tracking funciona

---

## 🛠️ Troubleshooting

### Spline 3D não carrega
- Verifique a conexão de internet (carrega da CDN)
- Abra DevTools → Network e procure `spline.design`
- Se falhar, aparecerá apenas background gradiente (fallback)

### Fonte Sora não carrega
- Verifique se `index.html` tem a tag Google Fonts
- Está em: `<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap">`

### Tailwind classes não funcionam
- Rode: `npm run dev` (Tailwind é processado em tempo real)
- Se problema persistir: `npm install` + `npm run dev` novamente

---

## 📝 Commit & PR

Quando estiver pronto para fazer PR:

```bash
# 1. Crie uma branch feature
git checkout -b feat/alluz-motion-hero

# 2. Copie os arquivos do worktree
# Os arquivos estão em: src/components/AlluzHero.tsx, src/components/AlluzNavbar.tsx, etc.

# 3. Commit
git add src/
git commit -m "feat: add Alluz motion hero with Spline 3D and animations

- AlluzHero component with Spline 3D parallax background
- AlluzNavbar with scroll blur effect
- Orange/yellow color theme (#FFAB2E, #D4891A)
- Staggered fade-up animations
- Motion effects: glow, shimmer, hover shadows
- Responsive design (mobile-first with clamp)
- Sora font integration"

# 4. Push e abra PR
git push origin feat/alluz-motion-hero
```

---

## 🎯 Próximos passos (após validação)

- [ ] Integrar hero no site existente do Alluz (`public/index.html`)
- [ ] Criar seções adicionais (Método, Cases) com same motion style
- [ ] Testar em staging/production
- [ ] Validar performance (Spline 3D + animações)
- [ ] Adicionar SEO meta tags
- [ ] Analytics tracking

---

**Desenvolvido em:** May 9, 2026  
**Tech:** React + Vite + Tailwind + TypeScript + Spline 3D  
**Status:** ✅ Testado localmente em preview server
