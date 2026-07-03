// auth-ui.js - Quản lý hiển thị đăng nhập/đăng xuất

function updateAuthUI() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Lấy các phần tử
    const userNameSpan = document.getElementById('userNameDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (token && user.fullName) {
      // Đã đăng nhập
      if (userNameSpan) userNameSpan.textContent = `👋 ${user.fullName}`;
      if (loginBtn) loginBtn.style.display = 'none';
      if (signupBtn) signupBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
      // Chưa đăng nhập
      if (userNameSpan) userNameSpan.textContent = '';
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (signupBtn) signupBtn.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
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