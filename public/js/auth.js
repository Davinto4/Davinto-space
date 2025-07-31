// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const messageBox = document.getElementById('message');

  // Handle Signup
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = signupForm.username.value.trim();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value.trim();

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        saveSession(data.user);
        window.location.href = 'dashboard.html';
      } else {
        showMessage(data.error || 'Signup failed');
      }
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        saveSession(data.user);
        window.location.href = 'dashboard.html';
      } else {
        showMessage(data.error || 'Login failed');
      }
    });
  }

  // Helper functions
  function showMessage(msg) {
    if (messageBox) {
      messageBox.textContent = msg;
      messageBox.style.color = 'red';
    }
  }

  function saveSession(user) {
    localStorage.setItem('davintoUser', JSON.stringify(user));
  }
});