const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (!token || !user.fullName) {
      alert('Vui lòng đăng nhập để gửi liên hệ');
      window.location.href = 'login.html';
    }
  
    // Tự động điền tên và email
    document.addEventListener('DOMContentLoaded', function() {
      const fullNameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('email');
      
      if (fullNameInput && user.fullName) {
        fullNameInput.value = user.fullName;
        fullNameInput.disabled = true; // Không cho sửa
      }
      
      if (emailInput && user.email) {
        emailInput.value = user.email;
        emailInput.disabled = true; // Không cho sửa
      }
    });
  
    // Xử lý gửi form
    document.getElementById('contactFormSubmit').addEventListener('submit', async function(e) {
      e.preventDefault();
  
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
  
      if (!message) {
        alert('Vui lòng nhập nội dung!');
        return;
      }
  
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
  
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subject, message })
        });
  
        const data = await res.json();
  
        if (data.success) {
          document.getElementById('successMessage').classList.add('show');
          this.reset();
          // Reset lại các ô đã disable
          document.getElementById('fullName').value = user.fullName;
          document.getElementById('email').value = user.email;
        } else {
          alert(data.error || 'Gửi thất bại');
        }
      } catch (error) {
        alert('Lỗi kết nối server');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi liên hệ';
      }
    });
    // Hàm hiển thị thông tin User & Nút đăng xuất
function updateAuthUI() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authSection = document.getElementById('authSection');

  if (!authSection) return;

  // Nếu đã đăng nhập
  if (token && (user.fullName || user.email)) {
    authSection.innerHTML = `
      <div class="user-info-wrapper">
        <span class="user-name-display">
          <i class="fas fa-user-circle"></i> ${user.fullName || 'Người dùng'}
        </span>
        <button class="btn-logout" onclick="logout()">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    `;

    // Hiển thị nút admin nếu là admin
    const adminLink = document.getElementById('adminLink');
    if (adminLink && (user.role === 'admin' || user.isAdmin)) {
      adminLink.style.display = 'inline-block';
    }
  } else {
    // Nếu chưa đăng nhập
    authSection.innerHTML = `
      <a href="login.html" class="btn-outline">Đăng nhập</a>
      <a href="register.html" class="btn-primary">Đăng ký</a>
    `;
  }
}

// Hàm Đăng xuất
function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}

// Chạy tự động khi trang tải xong
document.addEventListener('DOMContentLoaded', updateAuthUI);