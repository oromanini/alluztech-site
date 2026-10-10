/* ═══════════════════════════════════════════════
   MAIN · Nav, entradas, contadores, método DRI, o Q de segurar
   ═══════════════════════════════════════════════ */

(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // ─── Nav ───
  const nav = document.querySelector('.nav');
  let navState = null;
  function onScroll() {
    const s = window.scrollY > 24;
    if (s !== navState) { nav.classList.toggle('scrolled', s); navState = s; }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Entradas: o contêiner ganha .in, uma vez ───
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .cut-rule').forEach(el => io.observe(el));

  // ─── Contadores ───
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target;
      const to = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduced.matches || to === 0) { el.textContent = to + suffix; return; }
      const t0 = performance.now();
      let last = '';
      (function step(now) {
        const t = Math.min(1, (now - t0) / 1800);
        const txt = Math.round(to * (1 - Math.pow(1 - t, 3))) + suffix;
        if (txt !== last) { el.textContent = txt; last = txt; }
        if (t < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => {
    if (!reduced.matches) el.textContent = '0' + (el.dataset.suffix || '');
    cio.observe(el);
  });

  // ─── Âncoras com compensação da nav ───
  document.querySelectorAll('a[href^="#"]:not([data-action="contact"])').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - (href === '#top' ? 0 : 64);
      window.scrollTo({ top: y, behavior: reduced.matches ? 'auto' : 'smooth' });
    });
  });

  // ─── Método DRI: abas acessíveis com avanço automático ───
  const tabs = [...document.querySelectorAll('.dri-tab')];
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const stage = document.querySelector('.dri-stage');
  let current = 0, cycleT0 = 0, cycleRaf = null, cyclePaused = false, stageVisible = false;
  const CYCLE = 8000;

  function select(i, focus) {
    current = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n) => {
      const on = n === current;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      t.style.setProperty('--p', 0);
      panels[n].hidden = !on;
      panels[n].classList.remove('drawn');
    });
    requestAnimationFrame(() => requestAnimationFrame(() => panels[current].classList.add('drawn')));
    if (focus) tabs[current].focus();
    cycleT0 = performance.now();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { select(i); cyclePaused = true; });
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select(current + 1, true); cyclePaused = true; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select(current - 1, true); cyclePaused = true; }
    });
  });
  function cycle(now) {
    cycleRaf = null;
    if (cyclePaused || !stageVisible || reduced.matches) return;
    const p = Math.min(1, (now - cycleT0) / CYCLE);
    tabs[current].style.setProperty('--p', p.toFixed(3));
    if (p >= 1) select(current + 1);
    cycleRaf = requestAnimationFrame(cycle);
  }
  if (stage) {
    new IntersectionObserver(([e]) => {
      stageVisible = e.isIntersecting;
      if (stageVisible) {
        panels[current].classList.add('drawn');
        cycleT0 = performance.now() - (parseFloat(tabs[current].style.getPropertyValue('--p')) || 0) * CYCLE;
        if (!cycleRaf) cycleRaf = requestAnimationFrame(cycle);
      }
    }, { threshold: 0.4 }).observe(stage);
    stage.addEventListener('mouseenter', () => { cyclePaused = true; });
    stage.addEventListener('focusin', () => { cyclePaused = true; });
  }

  // ─── O Q de segurar: a pergunta encontra a resposta ───
  const qhold = document.querySelector('.qhold');
  const cta = document.querySelector('.cta');
  if (qhold) {
    let h = 0, holding = false, raf = null, last = 0, done = false;
    const FILL = 1400, DRAIN = 900;
    function render() {
      qhold.style.setProperty('--h', h.toFixed(3));
    }
    function finish() {
      done = true; h = 1; render();
      qhold.classList.add('done');
      cta.classList.add('answered');
      document.getElementById('qhold-hint').textContent = 'A pergunta encontrou a resposta';
    }
    function loop(now) {
      const dt = Math.min(64, now - (last || now));
      last = now;
      h = holding ? Math.min(1, h + dt / FILL) : Math.max(0, h - dt / DRAIN);
      render();
      if (h >= 1 && holding) { finish(); raf = null; last = 0; return; }
      if ((holding && h < 1) || (!holding && h > 0)) raf = requestAnimationFrame(loop);
      else { raf = null; last = 0; }
    }
    function press(e) {
      if (done) return;
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') return;
      if (e.type === 'keydown') { if (e.repeat) return; e.preventDefault(); }
      if (reduced.matches) { finish(); return; }
      holding = true;
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function release() {
      holding = false;
      if (!done && !raf) raf = requestAnimationFrame(loop);
    }
    qhold.addEventListener('pointerdown', press);
    qhold.addEventListener('keydown', press);
    ['pointerup', 'pointerleave', 'pointercancel', 'keyup', 'blur'].forEach(ev => qhold.addEventListener(ev, release));
    qhold.addEventListener('contextmenu', e => e.preventDefault());
    reduced.addEventListener('change', e => { if (e.matches) finish(); });
  }

  // ─── Abas do navegador escondidas pausam os loops ───
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
  });

  // ─── Botão flutuante: some quando o chat está na tela; leva o foco ao campo ───
  const chatSection = document.getElementById('chat');
  const chatInput = document.getElementById('chat-msg');
  if (chatSection) {
    new IntersectionObserver(([e]) => {
      document.body.classList.toggle('chat-visible', e.isIntersecting);
    }, { threshold: 0.25 }).observe(chatSection);
  }
  // Em telas estreitas o topo já tem os botões de ação: o flutuante espera a rolagem
  const narrow = matchMedia('(max-width: 720px)');
  let fabWait = null;
  function updateFabWait() {
    const w = narrow.matches && window.scrollY < window.innerHeight * 0.9;
    if (w !== fabWait) { document.body.classList.toggle('fab-wait', w); fabWait = w; }
  }
  addEventListener('scroll', updateFabWait, { passive: true });
  narrow.addEventListener('change', updateFabWait);
  updateFabWait();

  document.querySelectorAll('[data-chat-link]').forEach(a => {
    a.addEventListener('click', () => {
      if (!chatInput) return;
      // espera a rolagem suave terminar antes de focar, sem pular a página
      setTimeout(() => chatInput.focus({ preventScroll: true }), reduced.matches ? 0 : 700);
    });
  });

  // ─── Ano ───
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
