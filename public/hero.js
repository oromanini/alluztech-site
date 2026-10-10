/* ═══════════════════════════════════════════════
   HERO · Tudo passa pelo Q
   Fluxograma: as tarefas entram pela esquerda, passam pela Valiqon IA
   e saem resolvidas à direita. Um progresso (0 a 1) comanda tudo.
   Desktop: o progresso vem do scroll (hero fixado).
   Celular: o fluxo roda sozinho uma vez ao aparecer.
   Movimento reduzido: estado final direto.
   ═══════════════════════════════════════════════ */

(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const flow = hero.querySelector('.flow');
  const body = flow.querySelector('.flow-body');
  const svg = flow.querySelector('.wires');
  const ins = [...flow.querySelectorAll('.node-in')];
  const outs = [...flow.querySelectorAll('.node-out')];
  const hubCore = flow.querySelector('.hub-core');
  const status = flow.querySelector('.flow-status');
  const hoursNum = flow.querySelector('.hours-num');
  const cue = hero.querySelector('.cue');
  const SVGNS = 'http://www.w3.org/2000/svg';

  const HOURS = 9;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (p, e0, e1) => {
    const t = clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  // Cada tarefa é dona de uma janela do progresso; a última termina em 0.86.
  const START = 0.04, STEP = 0.13, LEN = 0.17;

  /* ─── Fios: medidos das caixas reais, refeitos a cada resize ─── */
  const wires = ins.map(() => ({ inBase: null, inLive: null, outBase: null, outLive: null }));
  function mk(cls) {
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('class', cls);
    p.setAttribute('pathLength', '1');
    svg.appendChild(p);
    return p;
  }
  wires.forEach(w => {
    w.inBase = mk('wire-base'); w.outBase = mk('wire-base');
    w.inLive = mk('wire-live'); w.outLive = mk('wire-live');
  });

  function layoutWires() {
    const b = body.getBoundingClientRect();
    if (!b.width) return;
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    const h = hubCore.getBoundingClientRect();
    const hx = h.left - b.left, hy = h.top - b.top, hw = h.width, hh = h.height;
    const firstIn = ins[0].getBoundingClientRect();
    const vertical = h.left < firstIn.right;   // telas estreitas: o Q fica embaixo das entradas, não ao lado
    const n = ins.length;

    wires.forEach((w, i) => {
      const a = ins[i].getBoundingClientRect();
      const o = outs[i].getBoundingClientRect();
      const spread = (i - (n - 1) / 2);
      let d1, d2;
      if (!vertical) {
        const x1 = a.right - b.left, y1 = a.top - b.top + a.height / 2;
        const x2 = hx, y2 = hy + hh / 2 + spread * 5;
        const x3 = hx + hw, y3 = y2;
        const x4 = o.left - b.left, y4 = o.top - b.top + o.height / 2;
        const k1 = (x2 - x1) * 0.55, k2 = (x4 - x3) * 0.55;
        d1 = `M${x1} ${y1} C${x1 + k1} ${y1} ${x2 - k1} ${y2} ${x2} ${y2}`;
        d2 = `M${x3} ${y3} C${x3 + k2} ${y3} ${x4 - k2} ${y4} ${x4} ${y4}`;
      } else {
        const x1 = a.left - b.left + a.width / 2, y1 = a.bottom - b.top;
        const x2 = hx + hw / 2 + spread * 5, y2 = hy;
        const x3 = x2, y3 = hy + hh;
        const x4 = o.left - b.left + o.width / 2, y4 = o.top - b.top;
        const k1 = (y2 - y1) * 0.6, k2 = (y4 - y3) * 0.6;
        d1 = `M${x1} ${y1} C${x1} ${y1 + k1} ${x2} ${y2 - k1} ${x2} ${y2}`;
        d2 = `M${x3} ${y3} C${x3} ${y3 + k2} ${x4} ${y4 - k2} ${x4} ${y4}`;
      }
      w.inBase.setAttribute('d', d1); w.inLive.setAttribute('d', d1);
      w.outBase.setAttribute('d', d2); w.outLive.setAttribute('d', d2);
    });
  }

  /* ─── Escritas de DOM só na mudança ─── */
  const cache = new Map();
  function setVar(el, name, v) {
    const r = Math.round(v * 1000) / 1000;
    const m = cache.get(el) || {};
    if (m[name] === r) return;
    m[name] = r;
    cache.set(el, m);
    el.style.setProperty(name, r);
  }
  function setDash(el, v) {
    const r = Math.round(v * 1000) / 1000;
    const m = cache.get(el) || {};
    if (m.dash === r) return;
    m.dash = r;
    cache.set(el, m);
    el.style.strokeDashoffset = r;
  }
  let lastHours = '', lastStatus = '', lastCue = null;

  function render(p) {
    let pending = 0, glow = 0;
    wires.forEach((w, i) => {
      const a0 = START + i * STEP;
      const d = smoothstep(p, a0, a0 + LEN);
      const inP = clamp(d / 0.45, 0, 1);            // pulso da entrada até o Q
      const outP = clamp((d - 0.55) / 0.45, 0, 1);  // do Q até a saída
      setDash(w.inLive, 1 - inP);
      setDash(w.outLive, 1 - outP);
      setVar(ins[i], '--d', d);
      setVar(ins[i], '--a', inP > 0 && outP < 1 ? 1 : 0);
      setVar(outs[i], '--o', outP);
      glow = Math.max(glow, Math.sin(Math.PI * clamp((d - 0.3) / 0.4, 0, 1)));
      if (outP < 0.5) pending++;
    });
    setVar(hubCore, '--g', pending === 0 ? 0.55 : glow);

    const hrs = Math.round(HOURS * smoothstep(p, START, START + 5 * STEP + LEN)) + 'h';
    if (hrs !== lastHours) { hoursNum.textContent = hrs; lastHours = hrs; }

    const st = pending === 0 ? 'Tudo em dia' : pending === 1 ? '1 pendente' : pending + ' pendentes';
    if (st !== lastStatus) { status.textContent = st; lastStatus = st; }

    const gone = p > 0.03;
    if (gone !== lastCue) { cue.classList.toggle('gone', gone); lastCue = gone; }
  }

  /* ─── Progresso do scroll ─── */
  function heroProgress() {
    const range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 1;
    return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scrubOn = false;

  /* ─── Loop rAF que descansa (suavização normalizada por dt) ─── */
  let target = 0, shown = 0, rafId = null, lastTick = 0, onScreen = true;
  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    render(shown);
  }
  function onScroll() {
    if (!scrubOn) return;
    target = heroProgress();
    if (rafId === null && onScreen) rafId = requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) onScroll();
  }).observe(hero);

  /* ─── Celular: roda sozinho uma vez, quando o fluxo aparece ─── */
  let autoPlayed = false, autoRaf = null;
  function autoPlay() {
    if (autoPlayed) return;
    autoPlayed = true;
    const t0 = performance.now(), DUR = 5200;
    (function step(now) {
      const p = clamp((now - t0) / DUR, 0, 1);
      render(p);
      if (p < 1 && !scrubOn) autoRaf = requestAnimationFrame(step);
      else autoRaf = null;
    })(t0);
  }
  // Dispara quando o topo do fluxo passa de 75% da tela (no celular isso já
  // acontece ao abrir a página, com o fluxo logo abaixo do título).
  // O layout ainda pode mudar depois (fontes carregando), então a mesma checagem
  // roda no observador, na rolagem e quando as fontes ficam prontas.
  function maybeAuto() {
    if (autoPlayed || scrubOn || reduced.matches) return;
    const r = flow.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.75 && r.bottom > 0) {
      removeEventListener('scroll', maybeAuto);
      autoPlay();
    }
  }
  const autoIO = new IntersectionObserver(maybeAuto, { threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5] });

  /* ─── Os cinco portões, decididos ao vivo (iguais ao CSS) ─── */
  const GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];

  function resetCache() { cache.clear(); lastHours = lastStatus = ''; lastCue = null; }
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    autoIO.disconnect();
    removeEventListener('scroll', maybeAuto);
    if (autoRaf) { cancelAnimationFrame(autoRaf); autoRaf = null; }
    addEventListener('scroll', onScroll, { passive: true });
    resetCache();
    layoutWires();
    target = shown = heroProgress();
    render(shown);
  }
  function disableScrub() {
    if (scrubOn) {
      scrubOn = false;
      removeEventListener('scroll', onScroll);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }
    resetCache();
    layoutWires();
    if (reduced.matches || autoPlayed) { render(1); return; }
    render(0);
    autoIO.observe(flow);
    addEventListener('scroll', maybeAuto, { passive: true });
    maybeAuto();
  }
  function applyMode() {
    if (GATES.some(q => matchMedia(q).matches)) disableScrub();
    else enableScrub();
  }
  GATES.map(q => matchMedia(q)).forEach(m => m.addEventListener('change', applyMode));

  // Fios acompanham qualquer mudança de tamanho das caixas (fontes, resize, rotação)
  new ResizeObserver(() => layoutWires()).observe(body);
  addEventListener('resize', onScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layoutWires(); maybeAuto(); });

  applyMode();
})();
