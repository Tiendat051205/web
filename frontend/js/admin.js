const API_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) { alert('Vui lòng đăng nhập'); window.location.href = 'login.html'; }

    document.getElementById('authSection').innerHTML = `
      <span class="user-name-display"><i class="fas fa-user-circle"></i> ${user.fullName || 'Admin'}</span>
      <button class="btn-logout" onclick="logout()">Đăng xuất</button>
    `;

    function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }

    // ===== LOAD STATS =====
    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('totalUsers').textContent = data.stats.totalUsers;
          document.getElementById('totalCVs').textContent = data.stats.totalCVs;
          document.getElementById('totalComments').textContent = data.stats.totalComments;
          document.getElementById('totalViews').textContent = data.stats.totalViews;
        }
      } catch (e) { console.error(e); }
    }

    // ===== TEMPLATES =====
    async function loadTemplates() {
      try {
        const res = await fetch(`${API_URL}/admin/templates`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const container = document.getElementById('templateList');
          if (data.templates.length === 0) {
            container.innerHTML = '<p style="color:#999;">Chưa có mẫu CV</p>';
            return;
          }
          container.innerHTML = data.templates.map(tpl => `
            <div class="template-row">
              <input type="text" id="name_${tpl.templateId}" value="${tpl.name}">
              <input type="text" id="desc_${tpl.templateId}" value="${tpl.description || ''}" style="flex:2;">
              <button class="btn-save-template" onclick="updateTemplate('${tpl.templateId}')">
                <i class="fas fa-save"></i> Lưu
              </button>
            </div>
          `).join('');
        }
      } catch (e) { console.error(e); }
    }

    window.updateTemplate = async (templateId) => {
      const name = document.getElementById(`name_${templateId}`).value.trim();
      const description = document.getElementById(`desc_${templateId}`).value.trim();
      if (!name) { alert('Tên không được để trống'); return; }
      try {
        const res = await fetch(`${API_URL}/admin/template/${templateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name, description })
        });
        const data = await res.json();
        if (data.success) alert('✅ Cập nhật thành công');
        else alert('❌ ' + data.error);
      } catch (e) { alert('Lỗi server'); }
    };

    // ===== COMMENTS =====
    async function loadComments() {
      try {
        const res = await fetch(`${API_URL}/admin/comments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const container = document.getElementById('commentsList');
          if (data.comments.length === 0) {
            container.innerHTML = '<p style="color:#999;">Chưa có bình luận</p>';
            return;
          }
          container.innerHTML = `
            <table class="admin-table">
              <thead><tr><th>Người dùng</th><th>Nội dung</th><th>Ngày</th><th>Hành động</th></tr></thead>
              <tbody>
                ${data.comments.map(c => `
                  <tr>
                    <td>${c.fullName || 'Ẩn danh'}</td>
                    <td>${c.content}</td>
                    <td>${new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td><button class="btn-delete" onclick="deleteComment(${c.id})">Xóa</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        }
      } catch (e) { console.error(e); }
    }

    window.deleteComment = async (id) => {
      if (!confirm('Xóa bình luận này?')) return;
      try {
        const res = await fetch(`${API_URL}/admin/comments/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) { alert('✅ Xóa thành công'); loadComments(); loadStats(); }
        else alert('❌ ' + data.error);
      } catch (e) { alert('Lỗi server'); }
    };

    // ===== CONTACTS =====
    async function loadContacts() {
      try {
        const res = await fetch(`${API_URL}/admin/contacts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const container = document.getElementById('contactsList');
          if (data.contacts.length === 0) {
            container.innerHTML = '<p style="color:#999;">Chưa có liên hệ</p>';
            return;
          }
          container.innerHTML = `
            <table class="admin-table">
              <thead><tr><th>Người gửi</th><th>Chủ đề</th><th>Nội dung</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
              <tbody>
                ${data.contacts.map(c => `
                  <tr>
                    <td>${c.fullName || 'Ẩn danh'}</td>
                    <td>${c.subject || 'Khác'}</td>
                    <td>${c.message}</td>
                    <td><span class="${c.isRead ? 'badge-read' : 'badge-unread'}">${c.isRead ? 'Đã đọc' : 'Chưa đọc'}</span></td>
                    <td>
                      ${!c.isRead ? `<button class="btn-delete" onclick="markRead(${c.id})" style="background:#28a745;">Đọc</button>` : ''}
                      <button class="btn-delete" onclick="deleteContact(${c.id})">Xóa</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        }
      } catch (e) { console.error(e); }
    }

    window.markRead = async (id) => {
      try {
        const res = await fetch(`${API_URL}/admin/contacts/${id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) loadContacts();
      } catch (e) { console.error(e); }
    };

    window.deleteContact = async (id) => {
      if (!confirm('Xóa liên hệ này?')) return;
      try {
        const res = await fetch(`${API_URL}/admin/contacts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) { alert('✅ Xóa thành công'); loadContacts(); }
        else alert('❌ ' + data.error);
      } catch (e) { alert('Lỗi server'); }
    };

    // ===== INIT =====
    loadStats();
    loadTemplates();
    loadComments();
    loadContacts();