/* ═══════════════════════════════════════════════
   HERO · Um dia na sua empresa
   Um filme de 40 s (maquete escura, fio verde-água) atravessa três salas.
   Desktop: o scroll é a agulha do vídeo (hero fixado), os textos entram
   por faixa de tempo e o mini-mapa mostra a sala atual.
   Celular, retrato e movimento reduzido: sem vídeo, carrossel das salas (só CSS).
   ═══════════════════════════════════════════════ */

(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const stage = hero.querySelector('.stage');
  const film = hero.querySelector('.film');
  const poster = film.querySelector('.film-poster');
  const video = film.querySelector('.film-video');
  const qEl = film.querySelector('.film-q');
  const chaps = [...hero.querySelectorAll('.chap')];
  const rooms = [...hero.querySelectorAll('.mm-room')];
  const mmNum = hero.querySelector('.mm-num');
  const mmName = hero.querySelector('.mm-name');
  const mmLive = hero.querySelector('.mm-live');
  const mmH = hero.querySelector('.mm-h');
  const cue = hero.querySelector('.cue');

  const SRC = 'assets/hero/salas/hero-salas.mp4';
  const DUR = 961 / 24;                       // 40,04 s, 961 quadros
  const FRAME = { w: 1728, h: 974, line: 0.7608 };   // linha de luz do último quadro, medida
  const Q_BAR = (118 + 12) / 140;             // barra do Q dentro do viewBox "530 -12 120 140"
  // Onde cada sala começa no filme (s) e o quadro "depois" usado enquanto o vídeo carrega
  const ROOM_T = [5.04, 15.04, 25.04, 35.04];
  const STILLS = [
    'assets/hero/salas/hero-salas-poster.jpg',
    'assets/hero/salas/sala-1-atendimento.jpg',
    'assets/hero/salas/sala-2-financeiro.jpg',
    'assets/hero/salas/sala-3-diretoria.jpg',
    'assets/hero/salas/hero-salas-final.jpg'
  ];
  const NAMES = ['Entrada', 'Atendimento', 'Financeiro', 'Diretoria', 'Sua empresa'];
  const HOURS = 9;
  const FADE = 0.8;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (x, e0, e1) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const bands = chaps.map(c => ({ el: c, t0: +c.dataset.t0, t1: +c.dataset.t1, live: null }));

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
  let lastRoom = null, lastHours = '', lastCue = null;

  function roomAt(t) {
    let i = 0;
    while (i < ROOM_T.length && t >= ROOM_T[i]) i++;
    return i;                                  // 0 = entrada, 1..3 = salas, 4 = final
  }

  function render(t) {
    bands.forEach(b => {
      const v = (b.t0 <= 0 ? 1 : smoothstep(t, b.t0 - FADE, b.t0)) * (1 - smoothstep(t, b.t1, b.t1 + FADE));
      setVar(b.el, '--v', v);
      const live = v > 0.5;
      if (live !== b.live) { b.el.classList.toggle('live', live); b.live = live; }
    });

    setVar(qEl, '--q', smoothstep(t, 37.6, 39.8));
    setVar(mmLive, '--m', clamp((t - ROOM_T[0]) / (ROOM_T[3] - ROOM_T[0]), 0, 1));

    const room = roomAt(t);
    if (room !== lastRoom) {
      lastRoom = room;
      mmNum.textContent = room === 0 ? 'Entrada' : `0${room} / 04`;
      mmName.textContent = room === 0 ? '' : NAMES[room];
      rooms.forEach((r, i) => {
        if (i + 1 === room) r.setAttribute('aria-current', 'step'); else r.removeAttribute('aria-current');
        r.classList.toggle('done', i + 1 < room);
      });
      if (!ready) poster.src = STILLS[room];
    }

    const hrs = Math.round(HOURS * smoothstep(t, ROOM_T[0], 37)) + 'h';
    if (hrs !== lastHours) { mmH.textContent = hrs; lastHours = hrs; }

    const gone = t > 0.6;
    if (gone !== lastCue) { cue.classList.toggle('gone', gone); lastCue = gone; }

    seek(t);
  }

  /* ─── Vídeo: Blob na memória, seeks travados (um por vez, sempre o mais recente) ─── */
  let ready = false, loading = false, want = 0;
  function loadFilm() {
    if (loading) return;
    loading = true;
    fetch(SRC)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(blob => {
        video.src = URL.createObjectURL(blob);
        video.addEventListener('loadeddata', () => {
          ready = true;
          video.currentTime = want;
          video.addEventListener('seeked', () => film.classList.add('ready'), { once: true });
        }, { once: true });
        video.load();
      })
      .catch(() => { loading = false; });     // sem vídeo o hero continua completo (quadros fixos)
  }
  function seek(t) {
    want = clamp(t, 0, DUR - 0.02);
    if (!ready || video.seeking) return;
    if (Math.abs(video.currentTime - want) > 1 / 48) video.currentTime = want;
  }
  video.addEventListener('seeked', () => {
    if (Math.abs(video.currentTime - want) > 1 / 48) video.currentTime = want;
  });

  /* ─── O Q pousa na linha de luz, que muda de lugar com o corte "cover" ─── */
  function placeQ() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    const s = Math.max(w / FRAME.w, h / FRAME.h);
    const lineY = (h - FRAME.h * s) / 2 + FRAME.line * FRAME.h * s;
    const qH = qEl.getBoundingClientRect().height || 90;
    qEl.style.setProperty('--qy', Math.round(lineY - Q_BAR * qH) + 'px');
  }

  /* ─── Progresso do scroll → tempo do filme ─── */
  function range() { return Math.max(1, hero.offsetHeight - window.innerHeight); }
  function heroTime() {
    return clamp(-hero.getBoundingClientRect().top / range(), 0, 1) * DUR;
  }
  function scrollToTime(t) {
    const top = hero.getBoundingClientRect().top + window.scrollY + (t / DUR) * range();
    window.scrollTo({ top, behavior: 'smooth' });
  }

  /* ─── Loop rAF que descansa (suavização normalizada por dt) ─── */
  let scrubOn = false, target = 0, shown = 0, rafId = null, lastTick = 0, onScreen = true;
  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    shown += (target - shown) * (1 - Math.pow(1 - 0.14, dt / 16.667));
    if (Math.abs(target - shown) < 0.01) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    render(shown);
  }
  function onScroll() {
    if (!scrubOn) return;
    target = heroTime();
    if (rafId === null && onScreen) rafId = requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) onScroll();
  }).observe(hero);

  // Mini-mapa: clicar numa sala leva o scroll até ela (com o texto já visível)
  rooms.forEach(r => r.addEventListener('click', () => {
    if (!scrubOn) return;
    const b = bands[+r.dataset.chap + 1];
    scrollToTime(b.t0 + 0.4);
  }));
  // Teclado: focar um botão do texto final leva o filme até ele
  hero.addEventListener('focusin', e => {
    if (!scrubOn) return;
    const chap = e.target.closest('.chap');
    if (!chap || chap.classList.contains('live')) return;
    const b = bands.find(x => x.el === chap);
    if (b) scrollToTime(Math.min(DUR, b.t0 + 2));
  });

  /* ─── Os cinco portões, decididos ao vivo (iguais ao CSS) ─── */
  const GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  function resetCache() { cache.clear(); lastRoom = null; lastHours = ''; lastCue = null; bands.forEach(b => (b.live = null)); }
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    addEventListener('scroll', onScroll, { passive: true });
    resetCache();
    placeQ();
    loadFilm();
    target = shown = heroTime();
    render(shown);
  }
  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    // O CSS estático assume o layout; limpa os estados que o JS escreveu
    bands.forEach(b => { b.el.style.removeProperty('--v'); b.el.classList.remove('live'); });
    resetCache();
  }
  function applyMode() {
    if (GATES.some(q => matchMedia(q).matches)) disableScrub();
    else enableScrub();
  }
  GATES.map(q => matchMedia(q)).forEach(m => m.addEventListener('change', applyMode));

  new ResizeObserver(() => { if (scrubOn) { placeQ(); onScroll(); } }).observe(stage);

  applyMode();
})();
