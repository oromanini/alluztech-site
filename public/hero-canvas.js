/* ═══════════════════════════════════════════════
   HERO CANVAS — Cinematic 3D background
   Particle field + neural connections + camera drift
   Pure 2D canvas com matemática de perspectiva
   ═══════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, DPR;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const PARTICLE_COUNT = isMobile ? 90 : 160;
  const CONNECT_DIST = isMobile ? 100 : 130;
  const FOCAL = 600;

  const particles = [];
  let camRotX = 0, camRotY = 0;
  let camTargetRotX = 0, camTargetRotY = 0;
  let time = 0;
  let mouseX = 0, mouseY = 0;
  let mouseActive = false;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function init() {
    particles.length = 0;
    // Sphere-ish volumetric distribution with some clustering
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = rand(120, 520);
      const theta = rand(0, Math.PI * 2);
      const phi = Math.acos(rand(-1, 1));
      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: rand(-0.1, 0.1),
        vy: rand(-0.1, 0.1),
        vz: rand(-0.1, 0.1),
        size: rand(0.5, 2.2),
        seed: Math.random() * 100,
        hot: Math.random() < 0.18,
      });
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rotateY(p, a) {
    const cs = Math.cos(a), sn = Math.sin(a);
    return { x: p.x * cs - p.z * sn, y: p.y, z: p.x * sn + p.z * cs };
  }
  function rotateX(p, a) {
    const cs = Math.cos(a), sn = Math.sin(a);
    return { x: p.x, y: p.y * cs - p.z * sn, z: p.y * sn + p.z * cs };
  }

  function project(p) {
    let q = rotateY(p, camRotY);
    q = rotateX(q, camRotX);
    const z = q.z + 900; // camera back
    if (z <= 1) return null;
    const scale = FOCAL / z;
    // Shift focal center to the right (~70% of width) so the network
    // doesn't overlap the hero text on the left.
    const focusX = W < 800 ? 0.5 : 0.72;
    return {
      x: W * focusX + q.x * scale,
      y: H * 0.5 + q.y * scale,
      scale,
      z,
    };
  }

  function step() {
    time += 0.016;

    // Camera idle drift + parallax to mouse
    const idleX = Math.sin(time * 0.12) * 0.08;
    const idleY = Math.cos(time * 0.18) * 0.12;
    camTargetRotX = idleX + (mouseActive ? (mouseY - 0.5) * 0.12 : 0);
    camTargetRotY = idleY + (mouseActive ? (mouseX - 0.5) * 0.18 : 0) + time * 0.025;
    camRotX += (camTargetRotX - camRotX) * 0.05;
    camRotY += (camTargetRotY - camRotY) * 0.05;

    // Particles drift slightly + slow orbit
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      // Soft bounds — pull back if too far
      const r = Math.hypot(p.x, p.y, p.z);
      if (r > 560) {
        p.vx -= (p.x / r) * 0.02;
        p.vy -= (p.y / r) * 0.02;
        p.vz -= (p.z / r) * 0.02;
      } else if (r < 80) {
        p.vx += (p.x / r) * 0.02;
        p.vy += (p.y / r) * 0.02;
        p.vz += (p.z / r) * 0.02;
      }
      // velocity damping
      p.vx *= 0.992; p.vy *= 0.992; p.vz *= 0.992;
    }
  }

  function draw() {
    // Trail-fade: semi-transparent fill instead of clear, creates motion blur
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(2, 5, 11, 0.22)';
    ctx.fillRect(0, 0, W, H);

    // Project all
    const proj = particles.map(project);

    // Lines first — additive
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < particles.length; i++) {
      const a = proj[i];
      if (!a) continue;
      for (let j = i + 1; j < particles.length; j++) {
        const b = proj[j];
        if (!b) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        const limit2 = CONNECT_DIST * CONNECT_DIST;
        if (d2 > limit2) continue;
        const d = Math.sqrt(d2);
        const t = 1 - d / CONNECT_DIST;
        // depth-fade
        const depthFade = Math.min(a.scale, b.scale) * 0.7;
        const alpha = t * t * 0.35 * depthFade;
        if (alpha < 0.01) continue;
        // Color: closer particles -> cyan, further -> deep blue
        const closeness = (a.scale + b.scale) * 0.5;
        const hue = closeness > 0.5 ? '46,234,255' : '0,87,255';
        ctx.strokeStyle = `rgba(${hue},${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const q = proj[i];
      if (!q) continue;
      const s = p.size * q.scale * 1.2;
      const pulse = p.hot ? (0.7 + 0.3 * Math.sin(time * 2 + p.seed)) : 1;
      const a = Math.min(1, q.scale * 0.9) * pulse;

      // Outer glow for hot particles
      if (p.hot && q.scale > 0.4) {
        const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, s * 8);
        g.addColorStop(0, `rgba(46,234,255,${0.5 * a})`);
        g.addColorStop(0.4, `rgba(46,234,255,${0.15 * a})`);
        g.addColorStop(1, 'rgba(46,234,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q.x, q.y, s * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      // Core
      ctx.fillStyle = p.hot
        ? `rgba(46,234,255,${a})`
        : `rgba(180,220,255,${a * 0.6})`;
      ctx.beginPath();
      ctx.arc(q.x, q.y, Math.max(0.3, s), 0, Math.PI * 2);
      ctx.fill();
    }

    // Big cinematic glow orb (off to the right, doesn't compete with text)
    ctx.globalCompositeOperation = 'lighter';
    const orbBaseX = W < 800 ? 0.5 : 0.72;
    const orbX = W * orbBaseX + Math.cos(time * 0.15) * W * 0.08;
    const orbY = H * 0.5 + Math.sin(time * 0.2) * H * 0.08;
    const orbR = Math.min(W, H) * 0.4;
    const og = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbR);
    og.addColorStop(0, 'rgba(0, 87, 255, 0.22)');
    og.addColorStop(0.4, 'rgba(46, 234, 255, 0.06)');
    og.addColorStop(1, 'rgba(0, 87, 255, 0)');
    ctx.fillStyle = og;
    ctx.fillRect(0, 0, W, H);

    // Scanline subtle
    ctx.globalCompositeOperation = 'source-over';
  }

  function loop() {
    if (document.hidden) {
      requestAnimationFrame(loop);
      return;
    }
    step();
    draw();
    requestAnimationFrame(loop);
  }

  function onMouse(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
    mouseActive = true;
  }

  resize();
  init();
  // Prime the canvas with bg fill so trail-fade starts coherent
  ctx.fillStyle = '#02050B';
  ctx.fillRect(0, 0, W, H);
  loop();

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', onMouse, { passive: true });
  window.addEventListener('mouseleave', () => { mouseActive = false; });
})();
