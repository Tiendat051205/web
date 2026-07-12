const API_URL = 'http://localhost:3000/api';

// Cập nhật header
function updateAuthUI() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authSection = document.getElementById('authSection');
  
  if (token && user.fullName) {
    authSection.innerHTML = `
      <span class="user-name-display"><i class="fas fa-user-circle"></i> ${user.fullName}</span>
      <button class="btn-logout" onclick="logout()">Đăng xuất</button>
    `;
  } else {
    authSection.innerHTML = `
      <a href="login.html" class="btn-outline">Đăng nhập</a>
      <a href="register.html" class="btn-primary">Đăng ký</a>
    `;
  }
}

function logout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}

// Kiểm tra đăng nhập
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Vui lòng đăng nhập để xem lịch sử CV');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Format ngày
function formatDate(dateString) {
  if (!dateString) return 'Chưa cập nhật';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Lấy danh sách CV
async function loadCVHistory() {
  const container = document.getElementById('cvList');
  const token = localStorage.getItem('token');
  
  if (!checkAuth()) return;

  try {
    const response = await fetch(`${API_URL}/cvs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();

    if (result.success) {
      if (result.cvs.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-file-alt"></i>
            <h3>Bạn chưa có CV nào</h3>
            <p>Hãy tạo CV đầu tiên từ các mẫu có sẵn</p>
            <button class="btn-create" onclick="window.location.href='home.html'">+ Tạo CV ngay</button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="cv-grid">
            ${result.cvs.map(cv => {
              const content = typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content;
              return `
                <div class="cv-card" data-cv-id="${cv.id}">
                  <div class="cv-header-info">
                    <span class="cv-template-badge">📄 ${cv.templateId || 'Mẫu CV'}</span>
                    <span class="cv-date">🕒 ${formatDate(cv.updatedAt || cv.createdAt)}</span>
                  </div>
                  <div class="cv-name">${content.fullName || 'Chưa có tên'}</div>
                  <div class="cv-title">${content.title || 'Chưa có tiêu đề'}</div>
                  <div class="cv-preview">${(content.summary || '').substring(0, 120)}${(content.summary || '').length > 120 ? '...' : ''}</div>
                  <div class="cv-actions">
                    <button class="btn-edit" onclick="event.stopPropagation(); editCV(${cv.id}, '${cv.templateId || ''}')">✏️ Chỉnh sửa</button>
                    <button class="btn-view" onclick="event.stopPropagation(); viewCV(${cv.id}, '${cv.templateId || ''}')">👁️ Xem</button>
                    <button class="btn-delete" onclick="event.stopPropagation(); deleteCV(${cv.id})">🗑️ Xóa</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;

        // Click vào card để chỉnh sửa
        document.querySelectorAll('.cv-card').forEach(card => {
          card.addEventListener('click', function() {
            const cvId = this.dataset.cvId;
            editCV(cvId);
          });
        });
      }
    } else {
      container.innerHTML = `<div class="empty-state">❌ ${result.error || 'Lỗi tải danh sách'}</div>`;
    }
  } catch (error) {
    console.error('Error:', error);
    container.innerHTML = `<div class="empty-state">❌ Lỗi kết nối server</div>`;
  }
}

// Chỉnh sửa CV
function editCV(cvId, templateId = '') {
  const templateFileMap = {
    'henry_simple': 'henry_simple.html',
    'henry_professional': 'Henry_professional.html',
    'henry_traditional': 'henry_tranditional.html',
    'henry_modern': 'henry_modern.html'
  };
  const file = templateFileMap[templateId] || 'henry_simple.html';
  window.location.href = `${file}?id=${cvId}`;
}

// Xem CV (preview)
function viewCV(cvId, templateId = '') {
  const templateFileMap = {
    'henry_simple': 'henry_simple.html',
    'henry_professional': 'Henry_professional.html',
    'henry_traditional': 'henry_tranditional.html',
    'henry_modern': 'henry_modern.html'
  };
  const file = templateFileMap[templateId] || 'henry_simple.html';
  window.open(`${file}?id=${cvId}`, '_blank');
}

// Xóa CV
async function deleteCV(cvId) {
  if (!confirm('Bạn có chắc muốn xóa CV này?')) return;
  
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/cv/${cvId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (result.success) {
      alert('Đã xóa CV');
      loadCVHistory(); // Tải lại danh sách
    } else {
      alert(result.error || 'Xóa thất bại');
    }
  } catch (error) {
    alert('Lỗi kết nối server');
  }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  loadCVHistory();
});