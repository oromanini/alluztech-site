/* ═══════════════════════════════════════════════
   DRI METHOD — Visualização animada
   Cada fase do método tem sua própria animação
   no canvas do lado direito
   ═══════════════════════════════════════════════ */

(function () {
  const stage = document.querySelector('.dri-stage');
  if (!stage) return;

  const tabs = stage.querySelectorAll('.dri-tab');
  const slides = stage.querySelectorAll('.dri-slide');
  const canvas = stage.querySelector('.dri-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, DPR;
  let activeIdx = 0;
  let time = 0;
  let phase = 0; // morphing progress between scenes
  let autoTimer;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function setActive(i, fromAuto) {
    activeIdx = i;
    tabs.forEach((t, idx) => t.setAttribute('aria-current', idx === i ? 'true' : 'false'));
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    phase = 0;
    if (!fromAuto) {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => setActive((activeIdx + 1) % slides.length, true), 8000);
    }
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => setActive(i)));

  // ─── Scene drawers ───
  function drawDiagnostico(t, cx, cy) {
    // Scanning radar-style across a target. Lines emanate, dots reveal
    const r = Math.min(W, H) * 0.32;
    // Rings
    for (let i = 0; i < 4; i++) {
      const ringR = r * (0.25 + i * 0.25);
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(46,234,255,${0.08 + i * 0.04})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Scanning line (radar sweep)
    const sweepAngle = (t * 0.7) % (Math.PI * 2);
    const grad = ctx.createConicGradient
      ? ctx.createConicGradient(sweepAngle, cx, cy)
      : null;
    if (grad) {
      grad.addColorStop(0, 'rgba(46,234,255,0.45)');
      grad.addColorStop(0.05, 'rgba(46,234,255,0.18)');
      grad.addColorStop(0.2, 'rgba(46,234,255,0)');
      grad.addColorStop(1, 'rgba(46,234,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Scan ray
    ctx.strokeStyle = 'rgba(46,234,255,0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
    ctx.stroke();

    // Data points being discovered
    const seeds = [
      [0.4, 1.2], [1.1, 0.7], [2.3, 0.9], [3.2, 1.05], [4.1, 0.6], [5.2, 1.1],
      [0.8, 0.55], [1.9, 1.15], [2.8, 0.45], [3.7, 0.85], [4.7, 1.0], [5.7, 0.65],
    ];
    for (const [a, rf] of seeds) {
      const x = cx + Math.cos(a) * r * rf * 0.8;
      const y = cy + Math.sin(a) * r * rf * 0.8;
      // "Detected" when sweep recently passed
      let delta = (sweepAngle - a) % (Math.PI * 2);
      if (delta < 0) delta += Math.PI * 2;
      const fresh = Math.max(0, 1 - delta / 1.2);
      const pulse = 0.4 + 0.6 * fresh;
      ctx.fillStyle = `rgba(46,234,255,${pulse})`;
      ctx.beginPath();
      ctx.arc(x, y, 2 + fresh * 3, 0, Math.PI * 2);
      ctx.fill();
      if (fresh > 0.3) {
        ctx.strokeStyle = `rgba(46,234,255,${fresh * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 6 + fresh * 12, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Center target
    ctx.strokeStyle = 'rgba(245,249,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(46,234,255,0.9)';
    ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();

    // Cross-hairs
    ctx.strokeStyle = 'rgba(245,249,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.1, cy); ctx.lineTo(cx + r * 1.1, cy);
    ctx.moveTo(cx, cy - r * 1.1); ctx.lineTo(cx, cy + r * 1.1);
    ctx.stroke();
  }

  function drawReplica(t, cx, cy) {
    // Human silhouette on the left, AI silhouette on the right, particles flow
    const r = Math.min(W, H) * 0.32;
    const gap = r * 0.9;

    // Two "nodes" (human / AI)
    function nodeIcon(x, y, label, isAI, glow) {
      ctx.save();
      // Outer ring
      ctx.strokeStyle = `rgba(46,234,255,${0.3 + glow * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, 38, 0, Math.PI * 2); ctx.stroke();

      // Inner hex/circle
      ctx.fillStyle = isAI
        ? `rgba(46,234,255,${0.08 + glow * 0.12})`
        : `rgba(245,249,255,${0.04 + glow * 0.06})`;
      ctx.beginPath();
      if (isAI) {
        // hex
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const px = x + Math.cos(a) * 26;
          const py = y + Math.sin(a) * 26;
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = `rgba(46,234,255,${0.6 + glow * 0.4})`;
        ctx.stroke();
      } else {
        ctx.arc(x, y, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(245,249,255,${0.5 + glow * 0.3})`;
        ctx.stroke();
      }
      // Label
      ctx.fillStyle = `rgba(${isAI ? '46,234,255' : '245,249,255'},${0.7 + glow * 0.3})`;
      ctx.font = '500 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y + 60);
      ctx.restore();
    }

    const x1 = cx - gap, x2 = cx + gap;
    nodeIcon(x1, cy, 'HUMANO', false, 0.6 + 0.4 * Math.sin(t * 1.5));
    nodeIcon(x2, cy, 'IA', true, 0.6 + 0.4 * Math.sin(t * 1.5 + Math.PI));

    // Connection: flowing particles from human → AI
    const N = 14;
    for (let i = 0; i < N; i++) {
      const phase = (t * 0.35 + i / N) % 1;
      const px = x1 + 38 + (x2 - 38 - x1 - 38) * phase;
      const py = cy + Math.sin(phase * Math.PI * 3 + t) * 8;
      const a = Math.sin(phase * Math.PI) * 0.9;
      // packet
      const g = ctx.createRadialGradient(px, py, 0, px, py, 12);
      g.addColorStop(0, `rgba(46,234,255,${a * 0.8})`);
      g.addColorStop(1, 'rgba(46,234,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(46,234,255,${a})`;
      ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill();
    }

    // Connecting curve baseline
    ctx.strokeStyle = 'rgba(46,234,255,0.18)';
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1 + 38, cy);
    ctx.lineTo(x2 - 38, cy);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawImplementacao(t, cx, cy) {
    // Building blocks assembling into a structure
    const grid = 5;
    const cellW = Math.min(W, H) * 0.08;
    const totalW = grid * cellW;
    const startX = cx - totalW / 2;
    const startY = cy + totalW / 2;

    // Pyramid of blocks
    const pyramid = [];
    for (let row = 0; row < 4; row++) {
      const count = 4 - row;
      const rowX = cx - (count * cellW) / 2;
      const y = startY - (row + 1) * cellW * 0.7;
      for (let c = 0; c < count; c++) {
        pyramid.push({
          x: rowX + c * cellW,
          y,
          delay: row * 0.4 + c * 0.15,
          row, c,
        });
      }
    }

    pyramid.forEach((b, i) => {
      const localT = t - b.delay;
      const appearProg = Math.min(1, Math.max(0, localT * 0.8));
      if (appearProg <= 0) return;
      const drop = (1 - appearProg) * -60;
      const alpha = appearProg;
      const pulse = 0.6 + 0.4 * Math.sin(t * 1.2 + i);

      // Block as isometric square
      const x = b.x, y = b.y + drop;
      ctx.save();
      ctx.globalAlpha = alpha;

      // Block face
      ctx.fillStyle = `rgba(46,234,255,${0.05 + pulse * 0.05})`;
      ctx.strokeStyle = `rgba(46,234,255,${0.4 + pulse * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(x - cellW * 0.4, y - cellW * 0.4, cellW * 0.8, cellW * 0.8);
      ctx.fill();
      ctx.stroke();

      // Inner detail (circuit-ish)
      ctx.strokeStyle = `rgba(46,234,255,${0.3 * pulse})`;
      ctx.beginPath();
      ctx.moveTo(x - cellW * 0.2, y);
      ctx.lineTo(x + cellW * 0.2, y);
      ctx.moveTo(x, y - cellW * 0.2);
      ctx.lineTo(x, y + cellW * 0.2);
      ctx.stroke();
      ctx.fillStyle = `rgba(46,234,255,${0.7 * pulse})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Top sparkle when pyramid complete
    if (t > 2.5) {
      const sx = cx, sy = startY - 4 * cellW * 0.7 - cellW * 0.2;
      const sparkA = Math.sin(t * 2) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(46,234,255,${sparkA})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + sparkA * 4, 0, Math.PI * 2);
      ctx.fill();
      // rays
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.3;
        const r1 = 10 + sparkA * 4;
        const r2 = 20 + sparkA * 10;
        ctx.strokeStyle = `rgba(46,234,255,${sparkA * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1);
        ctx.lineTo(sx + Math.cos(a) * r2, sy + Math.sin(a) * r2);
        ctx.stroke();
      }
    }
  }

  function draw() {
    time += 0.016;
    phase += 0.016;

    // BG
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(2, 5, 11, 0.3)';
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = 'rgba(46,234,255,0.04)';
    ctx.lineWidth = 1;
    const gs = 40;
    for (let x = 0; x < W; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Slide right area is the right half
    const cx = W * 0.75;
    const cy = H * 0.5;

    ctx.globalCompositeOperation = 'lighter';
    if (activeIdx === 0) drawDiagnostico(phase, cx, cy);
    else if (activeIdx === 1) drawReplica(phase, cx, cy);
    else drawImplementacao(phase, cx, cy);

    if (!document.hidden) requestAnimationFrame(draw);
    else setTimeout(() => requestAnimationFrame(draw), 300);
  }

  resize();
  ctx.fillStyle = '#02050B';
  ctx.fillRect(0, 0, W, H);
  draw();
  setActive(0);

  window.addEventListener('resize', resize);
})();
