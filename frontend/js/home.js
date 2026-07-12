// // home.js - Dùng cho home.html

// // Kiểm tra đăng nhập
// // const token = localStorage.getItem('token');
// // if (!token) {
// //   window.location.href = 'login.html';
// // }

// // Hiển thị tên user
// const user = JSON.parse(localStorage.getItem('user') || '{}');
// const userNameSpan = document.querySelector('.user-name');
// if (userNameSpan) userNameSpan.innerText = user.fullName || 'User';

// // Xử lý nút login/signup trên header
// document.querySelector('.btn-login')?.addEventListener('click', () => {
//   window.location.href = 'login.html';
// });
// document.querySelector('.btn-signup')?.addEventListener('click', () => {
//   window.location.href = 'register.html';
// });

// // Hàm chọn mẫu CV
// async function selectTemplate(templateId) {
//   try {
//     const res = await fetch('http://localhost:3000/api/cv/create', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({ templateId })
//     });
    
//     const data = await res.json();
    
//     if (data.success) {
//       window.location.href = `CV2.html?id=${data.cvId}`;
//     } else {
//       alert(data.error || 'Tạo CV thất bại');
//     }
//   } catch (error) {
//     alert('Lỗi kết nối server');
//   }
// }

// // Gắn sự kiện cho nút "Tạo CV này"
// document.querySelectorAll('.select-btn').forEach(btn => {
//   btn.addEventListener('click', (e) => {
//     e.stopPropagation();
//     const card = btn.closest('.cv-card');
//     const templateId = card.getAttribute('data-cv-id');
//     selectTemplate(templateId);
//   });
// });

// // Nút Choose later
// document.querySelector('.choose-later-btn')?.addEventListener('click', () => {
//   alert("You can always customize your CV later. Continue building your profile!");
// });

// home.js - Dùng cho home.html

// Lấy token từ localStorage



// Hiển thị tên user
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userNameSpan = document.querySelector('.user-name');
if (userNameSpan) userNameSpan.innerText = user.fullName || 'User';

// Xử lý nút login/signup trên header
document.querySelector('.btn-login')?.addEventListener('click', () => {
  window.location.href = 'login.html';
});
document.querySelector('.btn-signup')?.addEventListener('click', () => {
  window.location.href = 'register.html';
});
document.querySelectorAll('a[href="about.html"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetUrl = this.getAttribute('href');
    
    // Thêm hiệu ứng fade out
    document.body.style.transition = 'opacity 0.3s';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 300);
  });
});

// Hàm chọn mẫu CV


  async function selectTemplate(templateId) {
    // Kiểm tra token trước khi chuyển trang
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Vui lòng đăng nhập để tạo CV');
      window.location.href = 'login.html';
      return;
    }
  
    // Chuyển đến đúng file edit theo templateId (KHÔNG gọi API tạo CV)
    let editFile = '';
    switch (templateId) {
      case 'henry_simple': editFile = 'henry_simple.html'; break;
      case 'henry_professional': editFile = 'henry_professional.html'; break;
      case 'henry_tranditional': editFile = 'henry_tranditional.html'; break;
      case 'henry_modern': editFile = 'henry_modern.html'; break;
      default: editFile = 'henry_simple.html';
    }
    
    // Chuyển trang, gửi kèm templateId (KHÔNG có id)
    window.location.href = `${editFile}?templateId=${templateId}`;
  }


// Gắn sự kiện cho nút "Tạo CV này"
document.querySelectorAll('.select-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.cv-card');
    const templateId = card.getAttribute('data-template-id');
    selectTemplate(templateId);
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.template-chip');
  const cvCards = document.querySelectorAll('.cv-card');
  
  // Hàm lọc CV
  function filterCVs(filterValue) {
    const cvCards = document.querySelectorAll('.cv-card');
    let visibleCount = 0;
    
    cvCards.forEach(card => {
      const templateId = card.getAttribute('data-template-id');
      
      if (filterValue === 'all' || templateId === filterValue) {
        card.style.display = 'block';   // 👈 HIỂN THỊ
        visibleCount++;
      } else {
        card.style.display = 'none';    // 👈 ẨN
      }
    });
    
    console.log(`Hiển thị ${visibleCount}/${cvCards.length} CV`);
  }
  
  // Gắn sự kiện click cho từng nút
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Bỏ active class khỏi tất cả nút
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Thêm active class cho nút được click
      this.classList.add('active');
      
      // Lấy giá trị filter
      const filterValue = this.getAttribute('data-filter');
      
      // Lọc CV
      filterCVs(filterValue);
    });
  });
});
