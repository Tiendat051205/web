// const catItems = document.querySelectorAll('.category-list li');
// catItems.forEach(item => {
//   item.addEventListener('click', function(e) {
//     catItems.forEach(li => li.classList.remove('active'));
//     this.classList.add('active');
//     // Bạn có thể thay đổi nội dung preview dựa trên template, nhưng vì thuần frontend giữ demo
//     const templateName = this.innerText;
//     const previewCard = document.querySelector('.cv-card');
//     if(previewCard) {
//       // chỉ thêm hiệu ứng nhỏ không làm mất nội dung gốc, giữ nguyên mẫu đẹp.
//       previewCard.style.transform = 'scale(0.99)';
//       setTimeout(() => { previewCard.style.transform = ''; }, 150);
//     }
//     console.log(`Template switched to ${templateName} (demo UI)`);
//   });
// });
// // Nút choose later hiển thị thông báo
// const laterBtn = document.querySelector('.choose-later-btn');
// if(laterBtn) {
//   laterBtn.addEventListener('click', () => {
//     alert("You can always customize your CV later. Continue building your profile!");
//   });
// }
// //sự kiên cho nút login và signup, chuyển hướng đến trang tương ứng
// const loginBtn = document.querySelector(".btn-login");  // Dùng querySelector
// if(loginBtn) {
//   loginBtn.addEventListener('click', function(){
//     window.location.href = "login.html";
//   });
// }

// // 4. Nút Signup - CÁCH SỬA ĐÚNG
// const signupBtn = document.querySelector(".btn-signup");  // Đổi tên cho đúng
// if(signupBtn) {
//   signupBtn.addEventListener('click', function(){
//     window.location.href = "signup.html";
//   });
// }

// const RegisterBtn = document.querySelector(".btn-signup",".register-text");
// if(RegisterBtn) {
//     RegisterBtn.addEventListener('click', function(){
//         window.location.href = "register.html";
//     });
// }
// ========== SCRIPT.JS HOÀN CHỈNH ==========

// 1. XỬ LÝ LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Đăng nhập thành công!');
        if (data.user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'home.html';
        }
      } else {
        alert(data.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối server');
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
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        window.location.href = 'login.html';
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





