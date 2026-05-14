/* ═══════════════════════════════════════════════
   CHAT IA — Widget conversacional
   Integração: POST /api/chat (Groq, backend Express)
   ═══════════════════════════════════════════════ */

(function () {
  const shell = document.querySelector('.chat-shell');
  if (!shell) return;

  const log = shell.querySelector('.chat-log');
  const input = shell.querySelector('.chat-input input');
  const sendBtn = shell.querySelector('.chat-send');
  const suggests = shell.querySelectorAll('.chat-suggest');

  const history = [];

  function addMsg(role, text) {
    const el = document.createElement('div');
    el.className = role === 'user' ? 'msg msg-user' : 'msg msg-ai';
    if (role === 'ai') {
      const tag = document.createElement('span');
      tag.className = 'msg-tag';
      tag.textContent = 'Alluz IA';
      el.appendChild(tag);
    }
    const body = document.createElement('div');
    body.textContent = text;
    el.appendChild(body);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return { el, body };
  }

  function addThinking() {
    const el = document.createElement('div');
    el.className = 'msg msg-ai msg-thinking';
    el.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  async function sendMessage(userText) {
    if (!userText.trim()) return;

    addMsg('user', userText);
    history.push({ role: 'user', content: userText });
    input.value = '';
    sendBtn.disabled = true;

    const thinking = addThinking();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-10) }),
      });

      if (!res.ok) {
        let errMsg = 'Tive um problema pra responder agora.';
        try {
          const j = await res.json();
          if (j && j.error) errMsg = j.error;
        } catch (_) {}
        thinking.remove();
        addMsg('ai', `${errMsg} Você pode escrever pra contato@alluz.tech que retorno em até 1 dia útil.`);
        return;
      }

      const data = await res.json();
      const reply = (data.reply || '').trim() ||
        'Posso te conectar com nosso time para uma conversa rápida — qual seu maior gargalo operacional hoje?';

      thinking.remove();
      addMsg('ai', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      thinking.remove();
      addMsg('ai', 'Tive um problema pra responder agora. Você pode escrever pra contato@alluz.tech que retorno em até 1 dia útil.');
      console.error('[chat]', err);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });
  suggests.forEach(s => {
    s.addEventListener('click', () => sendMessage(s.textContent.trim()));
  });
})();
