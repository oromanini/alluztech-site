/* ═══════════════════════════════════════════════
   CONTACT · Modal de agendamento do diagnóstico
   Integração: POST /api/contact (Resend, backend Express)
   ═══════════════════════════════════════════════ */

(function () {
  const overlay = document.getElementById('contact-modal-overlay');
  const form = document.getElementById('contact-form');
  const closeBtn = document.getElementById('modal-close-btn');
  const successDiv = document.getElementById('form-success');
  const errorDiv = document.getElementById('form-error');
  const errorMessage = document.getElementById('error-message');
  if (!overlay || !form) return;

  let opener = null;
  let closeT = null;

  document.querySelectorAll('[data-action="contact"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      opener = btn;
      openModal();
    });
  });

  function openModal() {
    clearTimeout(closeT);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    form.hidden = false;
    successDiv.hidden = true;
    errorDiv.hidden = true;
    setTimeout(() => document.getElementById('contact-name').focus(), 60);
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    form.reset();
    if (opener) opener.focus();
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // Esc fecha; Tab fica preso dentro do modal
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    const f = [...overlay.querySelectorAll('button, input, a[href]')].filter(el => !el.closest('[hidden]') && !el.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();

    if (!name || !email) { showError('Nome e e-mail são obrigatórios.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('E-mail inválido.'); return; }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando...</span>';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!res.ok) {
        let msg = 'Erro ao enviar. Tente novamente.';
        try { const j = await res.json(); if (j && j.error) msg = j.error; } catch (_) {}
        showError(msg);
        return;
      }
      form.hidden = true;
      errorDiv.hidden = true;
      successDiv.hidden = false;
      closeT = setTimeout(closeModal, 3500);
    } catch (err) {
      console.error('[contact]', err);
      showError('Erro de conexão. Tente novamente.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });

  function showError(msg) {
    errorMessage.textContent = msg;
    errorDiv.hidden = false;
    form.hidden = true;
    successDiv.hidden = true;
    setTimeout(() => {
      errorDiv.hidden = true;
      form.hidden = false;
      document.getElementById('contact-name').focus();
    }, 4000);
  }
})();
