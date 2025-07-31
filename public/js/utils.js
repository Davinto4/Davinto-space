// utils.js

// Load user session from localStorage
function getLoggedInUser() {
  const user = localStorage.getItem('davintoUser');
  return user ? JSON.parse(user) : null;
}

// Redirect to login if not logged in
function requireAuth() {
  const user = getLoggedInUser();
  if (!user) {
    window.location.href = 'index.html';
  }
  return user;
}

// Display username if present
function showUsername() {
  const user = getLoggedInUser();
  const usernameEl = document.getElementById('username-display');
  if (user && usernameEl) {
    usernameEl.textContent = `Logged in as: ${user.username}`;
  }
}

// Handle logout
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('davintoUser');
      window.location.href = 'index.html';
    });
  }
}

// Call this at top of your protected pages
function initPage() {
  const user = requireAuth();
  showUsername();
  setupLogout();
  return user;
}