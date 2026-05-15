/* ═══════════════════════════════════════════════
   CONTACT — Modal de agendamento de diagnóstico
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

  // Abrir modal ao clicar em qualquer botão "Agendar diagnóstico"
  document.querySelectorAll('a[href="#contato"], button[data-action="contact"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' && btn.getAttribute('href') === '#contato') {
        e.preventDefault();
      }
      openModal();
    });
  });

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    form.style.display = 'block';
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    document.getElementById('contact-name').focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = 'auto';
    form.reset();
  }

  closeBtn.addEventListener('click', closeModal);

  // Fechar ao clicar fora do modal (no overlay)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Enviar formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();

    // Validação básica
    if (!name || !email) {
      showError('Nome e e-mail são obrigatórios.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('E-mail inválido.');
      return;
    }

    // Desabilitar botão durante envio
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando...</span>';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!res.ok) {
        let errMsg = 'Erro ao enviar. Tente novamente.';
        try {
          const j = await res.json();
          if (j && j.error) errMsg = j.error;
        } catch (_) {}
        showError(errMsg);
        return;
      }

      // Sucesso!
      form.style.display = 'none';
      errorDiv.style.display = 'none';
      successDiv.style.display = 'block';

      // Fechar modal após 3 segundos
      setTimeout(() => {
        closeModal();
      }, 3000);

    } catch (err) {
      console.error('[contact]', err);
      showError('Erro de conexão. Tente novamente.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  function showError(msg) {
    errorDiv.style.display = 'block';
    errorMessage.textContent = msg;
    form.style.display = 'none';
    successDiv.style.display = 'none';

    // Auto-fechar erro após 4 segundos
    setTimeout(() => {
      errorDiv.style.display = 'none';
      form.style.display = 'block';
    }, 4000);
  }
})();
