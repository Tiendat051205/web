
// 1. XỬ LÝ LOGIN
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
    
//     try {
//       const res = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         alert('Đăng nhập thành công!');
//         if (data.user.role === 'admin') {
//           window.location.href = 'admin.html';
//         } else {
//           window.location.href = 'home.html';
//         }
//       } else {
//         alert(data.error || 'Đăng nhập thất bại');
//       }
//     } catch (error) {
//       alert('Lỗi kết nối server');
//     }
//   });
// }
// 1. XỬ LÝ LOGIN
const loginForm = document.getElementById('loginForm');
const loginSuccess = document.getElementById('loginSuccess');
const loginBtnSubmit = document.getElementById('loginBtnSubmit');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Vô hiệu hóa nút để tránh spam
    if (loginBtnSubmit) {
      loginBtnSubmit.disabled = true;
      loginBtnSubmit.textContent = '⏳ Đang đăng nhập...';
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Lưu thông tin
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // ✅ HIỂN THỊ THÔNG BÁO THÀNH CÔNG (KHÔNG ALERT)
        if (loginSuccess) {
          loginSuccess.classList.add('show');
        }
        
        // Đổi text nút
        if (loginBtnSubmit) {
          loginBtnSubmit.textContent = '✅ Đã đăng nhập!';
        }
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          if (data.user.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'home.html';
          }
        }, 2000);
        
      } else {
        alert(data.error || 'Đăng nhập thất bại');
        // Reset nút
        if (loginBtnSubmit) {
          loginBtnSubmit.disabled = false;
          loginBtnSubmit.textContent = 'Login';
        }
      }
    } catch (error) {
      alert('Lỗi kết nối server');
      // Reset nút
      if (loginBtnSubmit) {
        loginBtnSubmit.disabled = false;
        loginBtnSubmit.textContent = 'Login';
      }
    }
  });
}

// 2. XỬ LÝ REGISTER (thêm sau)
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // ✅ HIỂN THỊ THÔNG BÁO (KHÔNG ALERT)
        document.getElementById('registerSuccess').classList.add('show');
        document.querySelector('.register').textContent = '✅ Đã đăng ký!';
        
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Lỗi kết nối server');
    }
  });
}

// 3. KIỂM TRA ĐĂNG NHẬP (cho các trang cần bảo vệ)
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// 4. HIỂN THỊ TÊN USER (nếu có)
function showUserName() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(el => {
    el.innerText = user.fullName || 'User';
  });
}

// 5. LOGOUT
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// 6. GẮN LOGOUT CHO NÚT (nếu có)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// 7. KHỞI TẠO KHI TRANG LOAD
document.addEventListener('DOMContentLoaded', () => {
  showUserName();
  
  // Nếu là trang home.html hoặc edit-cv.html, kiểm tra đăng nhập
  if (window.location.pathname.includes('home.html') || 
      window.location.pathname.includes('edit-cv.html')) {
    checkAuth();
  }
});

// 8. XỬ LÝ CÁC NÚT TRÊN HOME.HTML (giữ code cũ của bạn)
const catItems = document.querySelectorAll('.category-list li');
catItems.forEach(item => {
  item.addEventListener('click', function(e) {
    catItems.forEach(li => li.classList.remove('active'));
    this.classList.add('active');
    const templateName = this.innerText;
    const previewCard = document.querySelector('.cv-card');
    if(previewCard) {
      previewCard.style.transform = 'scale(0.99)';
      setTimeout(() => { previewCard.style.transform = ''; }, 150);
    }
    console.log(`Template switched to ${templateName} (demo UI)`);
  });
});

const laterBtn = document.querySelector('.choose-later-btn');
if(laterBtn) {
  laterBtn.addEventListener('click', () => {
    alert("You can always customize your CV later. Continue building your profile!");
  });
}

// Sửa lại nút login/signup trên home.html
const loginBtn = document.querySelector(".btn-login");
if(loginBtn) {
  loginBtn.addEventListener('click', function(){
    window.location.href = "login.html";
  });
}

const signupBtn = document.querySelector(".btn-signup");
if(signupBtn) {
  signupBtn.addEventListener('click', function(){
    window.location.href = "register.html";
  });
}





