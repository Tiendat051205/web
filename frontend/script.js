const API_BASE = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

function isLoggedIn() {
  return Boolean(getToken());
}

function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect') || 'home.html';
}

function getCurrentPageFile() {
  return window.location.pathname.split('/').pop() || 'home.html';
}

function redirectToLogin(target = getCurrentPageFile()) {
  window.location.href = `login.html?redirect=${encodeURIComponent(target)}`;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'home.html';
}

async function postJson(url, data, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  return response.json();
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  return response.json();
}

async function requestDeleteJson(url, token = null) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers
  });

  return response.json();
}

function initGlobalAuthControls() {
  const loggedOutBlocks = document.querySelectorAll('[data-logged-out]');
  const loggedInBlocks = document.querySelectorAll('[data-logged-in]');
  const userNameEls = document.querySelectorAll('[data-user-name]');
  const logoutBtns = document.querySelectorAll('[data-logout-btn]');
  const user = getCurrentUser();

  if (isLoggedIn() && user.fullName) {
    loggedOutBlocks.forEach(el => {
      el.hidden = true;
      el.style.display = 'none';
    });
    loggedInBlocks.forEach(el => {
      el.hidden = false;
      el.style.display = '';
    });
    userNameEls.forEach(el => {
      el.textContent = user.fullName;
    });
  } else {
    loggedOutBlocks.forEach(el => {
      el.hidden = false;
      el.style.display = '';
    });
    loggedInBlocks.forEach(el => {
      el.hidden = true;
      el.style.display = 'none';
    });
  }

  logoutBtns.forEach(btn => {
    btn.addEventListener('click', logout);
  });
}

function protectAnchors() {
  document.querySelectorAll('[data-protected-link]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      const target = anchor.getAttribute('data-protected-link') || 'home.html';
      if (target !== 'history.html') {
        return;
      }

      if (isLoggedIn()) {
        return;
      }

      event.preventDefault();
      redirectToLogin(target);
    });
  });
}

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!email || !password) {
      alert('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      const result = await postJson(`${API_BASE}/login`, { email, password });
      if (!result.success) {
        alert(result.error || 'Đăng nhập thất bại');
        return;
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user || {}));
      window.location.href = getRedirectTarget();
    } catch (error) {
      alert('Không thể kết nối đến server');
    }
  });
}

function initRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!fullName || !email || !password) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const result = await postJson(`${API_BASE}/register`, { fullName, email, password });
      if (!result.success) {
        alert(result.error || 'Đăng ký thất bại');
        return;
      }

      alert('Đăng ký thành công. Vui lòng đăng nhập.');
      window.location.href = `login.html?redirect=${encodeURIComponent(getRedirectTarget())}`;
    } catch (error) {
      alert('Không thể kết nối đến server');
    }
  });
}

function getPageName() {
  return document.body?.dataset?.page || document.body?.dataset?.template || '';
}

function protectCurrentPage() {
  const page = getPageName();

  if (page === 'history' && !isLoggedIn()) {
    redirectToLogin('history.html');
    return false;
  }

  return true;
}

function getStorageKeyForTemplate(templateName) {
  return `cvState_${templateName}`;
}

function getSavedCVsKey() {
  const user = getCurrentUser();
  return `savedCVs_${user.id || 'guest'}`;
}

function getPageTemplateName() {
  return document.body?.dataset?.template || '';
}

function getTemplateRoot() {
  return document.querySelector('[data-cv-root]');
}

function getEditableElements(root) {
  return root ? Array.from(root.querySelectorAll('[data-editable]')) : [];
}

function makeEditable(element, onChange) {
  if (!element) return;

  element.setAttribute('contenteditable', 'true');
  element.setAttribute('spellcheck', 'false');

  const save = () => {
    element.dataset.value = element.innerHTML;
    onChange();
  };

  element.addEventListener('input', save);
  element.addEventListener('blur', save);
}

function bindPhotoUpload(root, onChange) {
  const input = root?.querySelector('[data-photo-input]');
  const preview = root?.querySelector('[data-photo-preview]');
  if (!input || !preview) return;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một file ảnh hợp lệ');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = String(reader.result || '');
      onChange();
    };
    reader.readAsDataURL(file);
  });
}

function loadTemplateState(templateName) {
  const root = getTemplateRoot();
  if (!root) return;

  const raw = localStorage.getItem(getStorageKeyForTemplate(templateName));
  if (!raw) return;

  try {
    const state = JSON.parse(raw);
    if (state?.html) {
      root.innerHTML = state.html;
    }
  } catch {
    // ignore invalid stored data
  }
}

function saveTemplateState(templateName) {
  const root = getTemplateRoot();
  if (!root) return;

  const state = {
    html: root.innerHTML,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(getStorageKeyForTemplate(templateName), JSON.stringify(state));
}

function cloneTemplateForExport(root) {
  const clone = root.cloneNode(true);

  clone.querySelectorAll('[data-no-export]').forEach(node => {
    node.remove();
  });

  clone.querySelectorAll('[contenteditable="true"]').forEach(node => {
    node.removeAttribute('contenteditable');
  });

  clone.querySelectorAll('input, button, textarea, select, label').forEach(node => {
    node.remove();
  });

  return clone;
}

function initTemplateEditor() {
  const templateName = getPageTemplateName();
  const root = getTemplateRoot();
  if (!templateName || !root) return;

  loadTemplateState(templateName);

  const persist = () => saveTemplateState(templateName);

  getEditableElements(root).forEach(element => {
    makeEditable(element, persist);
  });

  bindPhotoUpload(root, persist);

  const exportBtn = document.querySelector('[data-export-pdf]');
  if (exportBtn) {
    if (!isLoggedIn()) {
      exportBtn.disabled = true;
      exportBtn.textContent = 'Đăng nhập để tải PDF';
    }
    exportBtn.addEventListener('click', () => exportCurrentTemplatePdf(templateName));
  }

  const saveBtn = document.querySelector('[data-save-cv]');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveToHistory(templateName);
      alert('Đã lưu CV vào lịch sử');
    });
  }

  const resetBtn = document.querySelector('[data-reset-cv]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(getStorageKeyForTemplate(templateName));
      window.location.reload();
    });
  }

  const homeBtn = document.querySelector('[data-home-link]');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = 'home.html';
    });
  }

  const historyBtn = document.querySelector('[data-history-link]');
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      window.location.href = 'history.html';
    });
  }

  const commentForm = document.querySelector('[data-comment-form]');
  if (commentForm) {
    const commentInput = commentForm.querySelector('[data-comment-input]');
    const submitBtn = commentForm.querySelector('button[type="submit"]');
    const loggedIn = isLoggedIn();

    if (commentInput) {
      commentInput.disabled = !loggedIn;
      commentInput.placeholder = loggedIn ? 'Viết bình luận của bạn...' : 'Đăng nhập để bình luận';
    }

    if (submitBtn) {
      submitBtn.disabled = !loggedIn;
      submitBtn.textContent = loggedIn ? 'Gửi bình luận' : 'Đăng nhập để bình luận';
    }

    commentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      addComment(templateName);
    });
  }

  loadComments(templateName);
}

function getTemplateTitle(root) {
  const heading = root?.querySelector('[data-template-title]') || root?.querySelector('h1') || root?.querySelector('h2');
  return heading ? heading.textContent.trim() : 'CV';
}

function saveToHistory(templateName) {
  const root = getTemplateRoot();
  if (!root) return;

  const savedCVs = JSON.parse(localStorage.getItem(getSavedCVsKey()) || '[]');
  const now = new Date().toISOString();
  const id = new URLSearchParams(window.location.search).get('loadId') || `cv_${Date.now()}`;
  const entry = {
    id,
    templateName,
    templatePage: `${templateName}.html`,
    title: getTemplateTitle(root),
    updatedAt: now,
    contentHtml: root.innerHTML
  };

  const index = savedCVs.findIndex(item => item.id === id);
  if (index >= 0) {
    savedCVs[index] = entry;
  } else {
    savedCVs.unshift(entry);
  }

  localStorage.setItem(getSavedCVsKey(), JSON.stringify(savedCVs));
}

function loadHistoryEntryIfAny(templateName) {
  const loadId = new URLSearchParams(window.location.search).get('loadId');
  if (!loadId) return;

  const savedCVs = JSON.parse(localStorage.getItem(getSavedCVsKey()) || '[]');
  const entry = savedCVs.find(item => item.id === loadId);
  if (!entry) return;

  if (entry.templatePage !== `${templateName}.html`) {
    window.location.href = `${entry.templatePage}?loadId=${encodeURIComponent(loadId)}`;
    return;
  }

  const root = getTemplateRoot();
  if (!root) return;

  root.innerHTML = entry.contentHtml;
}

function exportCurrentTemplatePdf(templateName) {
  const root = getTemplateRoot();
  if (!root) {
    alert('Không tìm thấy nội dung CV');
    return;
  }

  if (!isLoggedIn()) {
    redirectToLogin(`${templateName}.html`);
    return;
  }

  if (typeof html2pdf === 'undefined') {
    alert('Chưa tải được thư viện PDF');
    return;
  }

  const exportRoot = cloneTemplateForExport(root);
  const wrapper = document.createElement('div');
  wrapper.className = 'pdf-export-root';
  wrapper.appendChild(exportRoot);

  const title = getTemplateTitle(root).replace(/[\\/:*?"<>|]+/g, '_');
  html2pdf().set({
    margin: 0.3,
    filename: `${templateName}_${title || 'cv'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).from(wrapper).save();
}

async function loadComments(templateName) {
  const list = document.querySelector('[data-comment-list]');
  if (!list) return;

  try {
    const headers = {};
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const result = await requestJson(`${API_BASE}/comments/${encodeURIComponent(templateName)}`, { headers });
    if (!result.success) {
      throw new Error(result.error || 'Không tải được bình luận');
    }

    renderCommentList(list, result.comments || []);
  } catch (error) {
    list.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'comment-empty';
    empty.textContent = isLoggedIn() ? 'Không thể tải bình luận.' : 'Đăng nhập để xem bình luận.';
    list.appendChild(empty);
  }
}

function renderCommentList(list, comments) {
  const currentUser = getCurrentUser();
  list.innerHTML = '';

  if (!comments.length) {
    const empty = document.createElement('div');
    empty.className = 'comment-empty';
    empty.textContent = 'Chưa có bình luận nào.';
    list.appendChild(empty);
    return;
  }

  comments.forEach(comment => {
    const userName = comment.userName || comment.author || 'Người dùng';
    const item = document.createElement('article');
    item.className = 'comment-item';

    const meta = document.createElement('div');
    meta.className = 'comment-meta';

    const avatar = document.createElement('div');
    avatar.className = 'comment-avatar';
    avatar.textContent = getInitials(userName);

    const authorWrap = document.createElement('div');
    const author = document.createElement('strong');
    author.textContent = userName;
    const time = document.createElement('div');
    time.className = 'comment-time';
    time.textContent = formatTime(comment.createdAt);

    authorWrap.appendChild(author);
    authorWrap.appendChild(time);
    meta.appendChild(avatar);
    meta.appendChild(authorWrap);

    const text = document.createElement('p');
    text.className = 'comment-text';
    text.textContent = comment.text;

    item.appendChild(meta);
    item.appendChild(text);

    if (currentUser?.id && Number(currentUser.id) === Number(comment.userId)) {
      const actions = document.createElement('div');
      actions.className = 'comment-actions';

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-outline comment-delete-btn';
      deleteBtn.textContent = 'Xóa';
      deleteBtn.addEventListener('click', async () => {
        await deleteComment(comment.id, comment.templateName);
      });

      actions.appendChild(deleteBtn);
      item.appendChild(actions);
    }

    list.appendChild(item);
  });
}

function getInitials(name) {
  const value = (name || '').trim();
  if (!value) return 'U';
  const parts = value.split(/\s+/);
  if (parts.length === 1) {
    return value.slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

async function addComment(templateName) {
  if (!isLoggedIn()) {
    redirectToLogin(`${templateName}.html`);
    return;
  }

  const textarea = document.querySelector('[data-comment-input]');
  if (!textarea || textarea.disabled) return;

  const text = textarea.value.trim();
  if (!text) {
    alert('Vui lòng nhập nội dung bình luận');
    return;
  }

  try {
    const result = await postJson(`${API_BASE}/comments`, { templateName, text }, getToken());
    if (!result.success) {
      alert(result.error || 'Không gửi được bình luận');
      return;
    }

    textarea.value = '';
    await loadComments(templateName);
  } catch (error) {
    alert('Không thể kết nối đến server');
  }
}

async function deleteComment(commentId, templateName) {
  if (!isLoggedIn()) {
    redirectToLogin(`${templateName}.html`);
    return;
  }

  if (!window.confirm('Xóa bình luận này?')) {
    return;
  }

  try {
    const result = await requestDeleteJson(`${API_BASE}/comments/${commentId}`, getToken());
    if (!result.success) {
      alert(result.error || 'Không xóa được bình luận');
      return;
    }

    await loadComments(templateName);
  } catch (error) {
    alert('Không thể kết nối đến server');
  }
}

function initTemplatePage() {
  const templateName = getPageTemplateName();
  if (!templateName) return;

  loadHistoryEntryIfAny(templateName);
  initTemplateEditor();
}

function initHistoryPage() {
  const list = document.querySelector('[data-history-list]');
  if (!list) return;

  const savedCVs = JSON.parse(localStorage.getItem(getSavedCVsKey()) || '[]');
  list.innerHTML = '';

  if (!savedCVs.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Bạn chưa lưu CV nào.';
    list.appendChild(empty);
    return;
  }

  savedCVs.forEach(entry => {
    const card = document.createElement('article');
    card.className = 'history-card';

    const title = document.createElement('h3');
    title.textContent = entry.title || entry.templateName;

    const meta = document.createElement('p');
    meta.textContent = `${entry.templateName} • ${formatTime(entry.updatedAt)}`;

    const actions = document.createElement('div');
    actions.className = 'history-actions';

    const openBtn = document.createElement('button');
    openBtn.className = 'btn btn-primary';
    openBtn.type = 'button';
    openBtn.textContent = 'Mở lại';
    openBtn.addEventListener('click', () => {
      window.location.href = `${entry.templatePage}?loadId=${encodeURIComponent(entry.id)}`;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-outline';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Xóa';
    deleteBtn.addEventListener('click', () => {
      const next = savedCVs.filter(item => item.id !== entry.id);
      localStorage.setItem(getSavedCVsKey(), JSON.stringify(next));
      initHistoryPage();
    });

    actions.appendChild(openBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

function initHomePage() {
  initGlobalAuthControls();
  protectAnchors();
}

function initPage() {
  initGlobalAuthControls();
  protectAnchors();
  initLoginForm();
  initRegisterForm();

  const page = getPageName();
  if (page === 'home') {
    initHomePage();
  }

  if (!protectCurrentPage()) {
    return;
  }

  if (page === 'history') {
    initHistoryPage();
  }

  if (page === 'CV1' || page === 'CV2') {
    initTemplatePage();
  }
}

document.addEventListener('DOMContentLoaded', initPage);
