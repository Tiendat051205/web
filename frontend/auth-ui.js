// auth-ui.js - Quản lý hiển thị đăng nhập/đăng xuất

function isAdminUser(user = {}) {
  const role = String(user.role || '').toLowerCase();
  const isAdminFlag = user.isAdmin === true || user.isAdmin === 1 || user.isAdmin === '1';
  return role === 'admin' || isAdminFlag;
}

function ensureAdminNavLink() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  if (document.getElementById('adminNavLink')) return;

  const adminLink = document.createElement('a');
  adminLink.id = 'adminNavLink';
  adminLink.href = 'admin.html';
  adminLink.className = 'site-nav__link';
  adminLink.innerHTML = '<i class="fas fa-user-shield"></i> Quản trị';

  const loginLink = nav.querySelector('a[href="login.html"]');
  if (loginLink) {
    nav.insertBefore(adminLink, loginLink);
  } else {
    nav.appendChild(adminLink);
  }
}

function removeAdminNavLink() {
  const adminLink = document.getElementById('adminNavLink');
  if (adminLink) adminLink.remove();
}

function updateAuthUI() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Lấy các phần tử
    const userNameSpan = document.getElementById('userNameDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (token && (user.fullName || isAdminUser(user))) {
      // Đã đăng nhập
      if (userNameSpan) userNameSpan.textContent = `👋 ${user.fullName || 'Admin'}`;
      if (loginBtn) loginBtn.style.display = 'none';
      if (signupBtn) signupBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';

      if (isAdminUser(user)) {
        ensureAdminNavLink();
      } else {
        removeAdminNavLink();
      }
    } else {
      // Chưa đăng nhập
      if (userNameSpan) userNameSpan.textContent = '';
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (signupBtn) signupBtn.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      removeAdminNavLink();
    }
  }
  
  // Hàm đăng xuất
  function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  }
  
  // Gắn sự kiện khi trang load
  document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  });