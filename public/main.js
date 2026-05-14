/* ═══════════════════════════════════════════════
   MAIN — Nav, scroll reveals, micro-interactions
   ═══════════════════════════════════════════════ */

(function () {
  // ─── Nav scroll state ───
  const nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Reveal on scroll (scroll + rAF polling for max compat) ───
  let allDone = false;
  function revealVisible() {
    if (allDone) return;
    const vh = window.innerHeight;
    let remaining = 0;
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add('in');
      } else {
        remaining++;
      }
    });
    if (remaining === 0) allDone = true;
  }
  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('resize', revealVisible);
  // Continuous rAF poll until everything has been revealed at least once
  (function pollReveal() {
    revealVisible();
    if (!allDone) requestAnimationFrame(pollReveal);
  })();

  // ─── Animated metric counters ───
  const started = new WeakSet();
  function tickMetrics() {
    const vh = window.innerHeight;
    document.querySelectorAll('[data-count]').forEach(el => {
      if (started.has(el)) return;
      const r = el.getBoundingClientRect();
      if (r.top > vh * 0.9 || r.bottom < 0) return;
      started.add(el);
      const to = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const dur = 1800;
      const t0 = performance.now();
      (function step(now) {
        const t = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (to * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
      })(t0);
    });
  }
  window.addEventListener('scroll', tickMetrics, { passive: true });
  setTimeout(tickMetrics, 200);

  // ─── Smooth anchor offset (account for fixed nav) ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ─── Year in footer ───
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
