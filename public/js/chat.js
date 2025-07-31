document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('chat-message');
  const user = JSON.parse(localStorage.getItem('davintoUser'));

  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Show username in header
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay) {
    usernameDisplay.textContent = `Logged in as: ${user.username}`;
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('davintoUser');
      window.location.href = 'index.html';
    });
  }

  // Fetch messages every 5 seconds
  async function fetchMessages() {
    const res = await fetch('/api/chat/fetch');
    const data = await res.json();

    if (res.ok) {
      chatBox.innerHTML = '';
      data.messages.forEach(msg => {
        const p = document.createElement('p');
        p.innerHTML = `<span>${msg.username}</span>: ${msg.text}`;
        chatBox.appendChild(p);
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  fetchMessages();
  setInterval(fetchMessages, 5000); // Poll every 5 seconds

  // Send message
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        text
      })
    });

    if (res.ok) {
      messageInput.value = '';
      fetchMessages();
    }
  });
});