// edit-cv-common.js - Dùng chung cho tất cả mẫu CV

const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
const urlParams = new URLSearchParams(window.location.search);
let templateId = urlParams.get('templateId');
const cvId = urlParams.get('id');

let currentCVId = cvId;
let isNewCV = !cvId && templateId;

// Kiểm tra đăng nhập
if (!token) {
  alert('Vui lòng đăng nhập');
  window.location.href = 'login.html';
}

// Hàm lấy templateId từ CV (khi chỉ có cvId)
async function getTemplateIdFromCV(cvId) {
  console.log('🔍 getTemplateIdFromCV được gọi với cvId:', cvId);
  try {
    const res = await fetch(`${API_URL}/cv/${cvId}/template`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('🔍 Response status từ /cv/' + cvId + '/template:', res.status);
    const data = await res.json();
    console.log('🔍 Dữ liệu trả về từ /cv/' + cvId + '/template:', data);
    if (data.success) {
      return data.templateId;
    }
    return null;
  } catch (error) {
    console.error('Lỗi lấy templateId từ CV:', error);
    return null;
  }
}

// Hàm kiểm tra CV đã tồn tại
async function getExistingCV(templateId) {
  const token = localStorage.getItem('token');
  if (!templateId || !token) return null;
  
  try {
    const res = await fetch(`${API_URL}/cv/user/${templateId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data.success && data.cv ? data.cv : null;
  } catch (error) {
    console.error('Lỗi kiểm tra CV:', error);
    return null;
  }
}

// Thu thập dữ liệu từ các editable field
function collectCVData() {
  const data = {};
  document.querySelectorAll('[data-field]').forEach(el => {
    const field = el.getAttribute('data-field');
    if (el.classList.contains('skills-bar')) {
      data[field] = Array.from(el.querySelectorAll('.skill-item')).map(s => s.innerText.replace(/\*/g, '').trim());
    } else if (el.classList.contains('exp-list')) {
      data[field] = Array.from(el.querySelectorAll('li')).map(li => li.innerText);
    } else {
      data[field] = el.innerText || '';
    }
  });
  return data;
}

// Tải CV từ server
async function loadCVFromServer() {
  if (!currentCVId || !token) return false;
  try {
    const res = await fetch(`${API_URL}/cv/${currentCVId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success && result.cv.content) {
      const c = result.cv.content;
      document.querySelectorAll('[data-field]').forEach(el => {
        const field = el.getAttribute('data-field');
        if (c[field] !== undefined) {
          if (el.classList.contains('skills-bar') && Array.isArray(c[field])) {
            el.innerHTML = c[field].map(s => `<span class="skill-item"><strong>${s}</strong></span>`).join(' · ');
          } else if (el.classList.contains('exp-list') && Array.isArray(c[field])) {
            el.innerHTML = c[field].map(item => `<li>${item}</li>`).join('');
          } else {
            el.innerText = c[field];
          }
        }
      });
      return true;
    }
  } catch (e) { console.error(e); }
  return false;
}

// LƯU CV
async function saveCV() {
  const cvData = collectCVData();
  
  try {
    if (isNewCV && templateId) {
      const res = await fetch(`${API_URL}/cv/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ templateId, content: cvData })
      });
      const data = await res.json();
      if (data.success) {
        currentCVId = data.cvId;
        isNewCV = false;
        window.history.pushState({}, '', `?id=${currentCVId}`);
        alert('✅ Đã tạo và lưu CV thành công!');
        return true;
      } else {
        alert('Lỗi: ' + (data.error || 'Tạo CV thất bại'));
        return false;
      }
    } else if (currentCVId) {
      const res = await fetch(`${API_URL}/cv/${currentCVId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: cvData })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Đã lưu CV thành công!');
        return true;
      } else {
        alert('Lỗi: ' + (data.error || 'Cập nhật thất bại'));
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    alert('Lỗi kết nối server');
    return false;
  }
}

// Gắn sự kiện chỉnh sửa inline
function attachEditEvents() {
  document.querySelectorAll('.editable').forEach(el => {
    const newEl = el.cloneNode(true);
    el.parentNode?.replaceChild(newEl, el);
    newEl.addEventListener('click', function(e) {
      e.stopPropagation();
      if (this.querySelector('input, textarea')) return;
      const current = this.innerText;
      const isMulti = current.length > 50 || this.querySelector('li');
      const input = document.createElement(isMulti ? 'textarea' : 'input');
      input.value = current;
      input.className = 'edit-input';
      if (isMulti) input.rows = 4;
      this.innerHTML = '';
      this.appendChild(input);
      input.focus();
      const save = async () => {
        this.innerText = input.value;
      };
      input.addEventListener('blur', save);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && input.tagName !== 'TEXTAREA') {
          e.preventDefault();
          save();
        }
      });
    });
  });
}

// ========== BÌNH LUẬN ==========
async function loadComments() {
  console.log('🔍 loadComments bắt đầu');
  console.log('🔍 templateId hiện tại:', templateId);
  console.log('🔍 currentCVId hiện tại:', currentCVId);
  // Nếu chưa có templateId, thử lấy từ URL
  let currentTemplateId = templateId || urlParams.get('templateId');
  
  // Nếu vẫn chưa có và có cvId -> lấy templateId từ CV
  if (!currentTemplateId && currentCVId) {
    console.log('🔍 Đang gọi getTemplateIdFromCV...');
    currentTemplateId = await getTemplateIdFromCV(currentCVId);
    console.log('🔍 currentTemplateId sau khi lấy từ URL:', currentTemplateId);
    // Cập nhật biến templateId để dùng sau
    if (currentTemplateId) {
      templateId = currentTemplateId;
    }
  }
  
  if (!currentTemplateId) {
    console.log('⚠️ Chưa có templateId');
    return;
  }
  
  try {
    
    console.log('📥 Tải bình luận cho template:', currentTemplateId);
   
    const token = localStorage.getItem('token');
    
    
    const res = await fetch(`${API_URL}/template/${currentTemplateId}/comments`);
    
    console.log('📥 Response status:', res.status);
    const data = await res.json();
    console.log('📥 Dữ liệu nhận được:', data);
    
    if (data.success) {
      console.log('📥 Số bình luận:', data.comments.length);
      renderComments(data.comments);

    }
  } catch (e) { 
    console.error('Lỗi tải bình luận:', e); 
  }
}

function renderComments(comments) {
  const container = document.getElementById('commentsList');
  if (!container) return;
  console.log('📝 renderComments được gọi, comments:', comments);
  
  if (!comments || comments.length === 0) {
    container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">Chưa có bình luận nào</div>';
    return;
  }
  
  container.innerHTML = comments.map(c => {
    const displayName = c.authorName || 'Người dùng';
    const avatar = displayName.charAt(0).toUpperCase();
    
    return `
    <div class="comment-item">
      <div class="comment-author">
        <div class="comment-avatar">${avatar}</div>
        <div>
          <div class="comment-name">${escapeHtml(displayName)}</div>
          <div class="comment-time">${formatTime(c.createdAt)}</div>
        </div>
      </div>
      <div class="comment-text">${escapeHtml(c.content)}</div>
    </div>
    `;
  }).join('');
}

async function addComment() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Vui lòng đăng nhập để bình luận');
    return;
  }

  const input = document.getElementById('commentContent');
  if (!input) return;
  
  const text = input.value.trim();
  if (!text) {
    alert('Vui lòng nhập nội dung bình luận');
    return;
  }

  // Lấy templateId hiện tại
  let currentTemplateId = templateId || urlParams.get('templateId');
  
  // Nếu chưa có templateId và có cvId, lấy từ CV
  if (!currentTemplateId && currentCVId) {
    currentTemplateId = await getTemplateIdFromCV(currentCVId);
    if (currentTemplateId) {
      templateId = currentTemplateId;
    }
  }
  
  if (!currentTemplateId) {
    alert('Không tìm thấy template');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/template/${currentTemplateId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    
    const data = await res.json();
    
    if (data.success) {
      input.value = '';
      await loadComments();
    } else {
      alert(data.error || 'Gửi bình luận thất bại');
    }
  } catch (error) {
    console.error('Lỗi gửi bình luận:', error);
    alert('Lỗi kết nối server');
  }
}

function escapeHtml(t) { const div = document.createElement('div'); div.textContent = t; return div.innerHTML; }
function formatTime(t) {
  const d = new Date(t);
  const diff = Math.floor((new Date() - d) / 86400000);
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  if (diff < 7) return `${diff} ngày trước`;
  return d.toLocaleDateString('vi-VN');
}

// ========== NÚT LƯU CV ==========
const saveBtn = document.getElementById('saveCVBtn');
if (saveBtn) {
  saveBtn.addEventListener('click', async () => {
    saveBtn.textContent = '⏳ Đang lưu...';
    saveBtn.disabled = true;
    const success = await saveCV();
    if (success) {
      saveBtn.textContent = '✅ Đã lưu!';
      setTimeout(() => {
        saveBtn.textContent = '💾 Lưu CV';
        saveBtn.disabled = false;
      }, 2000);
    } else {
      saveBtn.textContent = '💾 Lưu CV';
      saveBtn.disabled = false;
    }
  });
}

// ========== NÚT TẢI PDF ==========
const downloadBtn = document.getElementById('downloadCVBtn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', async () => {
    if (!currentCVId) {
      alert('Vui lòng lưu CV trước khi tải PDF');
      return;
    }
    downloadBtn.textContent = '⏳ Đang tạo PDF...';
    downloadBtn.disabled = true;
    try {
      const response = await fetch(`${API_URL}/cv/${currentCVId}/export-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_${currentCVId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Lỗi tạo PDF');
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      downloadBtn.textContent = '📄 Tải CV (PDF)';
      downloadBtn.disabled = false;
    }
  });
}

// ========== KHỞI TẠO ==========
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');
  const cvId = urlParams.get('id');

  // Nếu có cvId → dùng luôn
  if (cvId) {
    currentCVId = cvId;
    await loadCVFromServer();
  } 
  // Nếu có templateId → kiểm tra CV cũ
  else if (templateId && token) {
    const existingCV = await getExistingCV(templateId);
    if (existingCV) {
      currentCVId = existingCV.id;
      window.history.pushState({}, '', `?id=${currentCVId}`);
      await loadCVFromServer();
    }
  }

  // ✅ Tải bình luận sau khi có templateId (từ URL hoặc từ CV)
  await loadComments();

  // HIỂN THỊ FORM BÌNH LUẬN
  const commentInputArea = document.getElementById('commentInputArea');
  const loginPrompt = document.getElementById('loginPrompt');
  const submitBtn = document.getElementById('submitCommentBtn');
  
  if (token) {
    if (commentInputArea) commentInputArea.style.display = 'block';
    if (loginPrompt) loginPrompt.style.display = 'none';
    if (submitBtn) {
      submitBtn.addEventListener('click', addComment);
    }
    const commentInput = document.getElementById('commentContent');
    if (commentInput) {
      commentInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          addComment();
        }
      });
    }
  } else {
    if (commentInputArea) commentInputArea.style.display = 'none';
    if (loginPrompt) loginPrompt.style.display = 'block';
  }
  
  attachEditEvents();
});