export const getCVHtml = (templateId, data) => {
  // Hàm xử lý xuống dòng thành danh sách Bullet
  const renderList = (text) => {
    if (!text) return '';
    const arr = Array.isArray(text) ? text : text.split('\n');
    return arr.filter(Boolean).map(item => `<li style="margin-bottom: 6px;">${item.trim()}</li>`).join('');
  };

  // Hàm xử lý render kỹ năng theo nhiều định dạng (dấu phẩy, bullet, hoặc khối div)
  const renderSkills = (text, format) => {
    if (!text) return '';
    const arr = Array.isArray(text) ? text : text.split(',');
    
    if (format === 'comma') {
      return arr.filter(Boolean).map(s => s.trim()).join(' <span style="color:#2C7DA0; margin: 0 5px;">•</span> ');
    } else if (format === 'bullet') {
      return arr.filter(Boolean).map(s => `<li style="margin-bottom: 8px;">${s.trim()}</li>`).join('');
    } else if (format === 'div') {
      return arr.filter(Boolean).map(s => `<div style="margin-bottom: 6px;">${s.trim()}</div>`).join('');
    }
    return arr.filter(Boolean).map(s => `${s.trim()}`).join(', ');
  };

  // ==========================================
  // 1. MẪU SIMPLE (CỘT ĐƠN - ĐƯỜNG KẺ NGANG)
  // ==========================================
  const simpleHtml = `
    <style>
      .simple-cv { width: 100%; max-width: 210mm; min-height: 297mm; margin: 0 auto; background: white; padding: 12mm 15mm; box-sizing: border-box; }
      .simple-name { font-size: 34px; font-weight: 800; color: #1a3a4a; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 1px; }
      .simple-title { font-size: 16px; color: #2C7DA0; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #2C7DA0; margin-bottom: 15px; }
      .simple-contact { display: flex; gap: 25px; font-size: 12px; color: #555; margin-bottom: 25px; }
      .simple-section { margin-bottom: 22px; }
      .simple-sec-title { font-size: 15px; font-weight: 800; color: #1a3a4a; text-transform: uppercase; letter-spacing: 1.5px; padding-top: 15px; border-top: 1px solid #ddd; margin-bottom: 12px; }
      .simple-text { font-size: 13px; color: #444; line-height: 1.6; text-align: justify; }
      .simple-item { margin-bottom: 18px; }
      .simple-item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px; }
      .simple-item-title { font-size: 15px; font-weight: 700; color: #1a3a4a; }
      .simple-item-date { font-size: 13px; color: #2C7DA0; font-weight: 600; }
      .simple-item-subtitle { font-size: 13px; color: #666; font-style: italic; margin-bottom: 6px; }
      .simple-list { padding-left: 20px; margin: 0; font-size: 13px; color: #444; line-height: 1.6; }
    </style>
    <div class="simple-cv">
      <div class="simple-name">${data.fullName || 'TÊN CỦA BẠN'}</div>
      <div class="simple-title">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
      <div class="simple-contact">
        ${data.email ? `<div>${data.email}</div>` : ''}
        ${data.phone ? `<div>${data.phone}</div>` : ''}
        ${data.location ? `<div>${data.location}</div>` : ''}
      </div>
      
      <div class="simple-section">
        <div class="simple-sec-title">Skills</div>
        <div class="simple-text" style="font-weight: 600;">${renderSkills(data.skills, 'comma')}</div>
      </div>
      
      <div class="simple-section">
        <div class="simple-sec-title">Summary</div>
        <div class="simple-text">${data.summary || ''}</div>
      </div>
      
      <div class="simple-section">
        <div class="simple-sec-title">Experience</div>
        <div class="simple-item">
          <div class="simple-item-header">
            <span class="simple-item-title">${data.exp1_title || ''}</span>
            <span class="simple-item-date">${data.exp1_date || ''}</span>
          </div>
          <div class="simple-item-subtitle">${data.exp1_company || ''}</div>
          <ul class="simple-list">${renderList(data.exp1_desc)}</ul>
        </div>
        <div class="simple-item">
          <div class="simple-item-header">
            <span class="simple-item-title">${data.exp2_title || ''}</span>
            <span class="simple-item-date">${data.exp2_date || ''}</span>
          </div>
          <div class="simple-item-subtitle">${data.exp2_company || ''}</div>
          <ul class="simple-list">${renderList(data.exp2_desc)}</ul>
        </div>
      </div>
      
      <div class="simple-section" style="margin-bottom: 0;">
        <div class="simple-sec-title">Education</div>
        <div class="simple-item-header">
          <span class="simple-item-title">${data.edu_degree || ''}</span>
          <span class="simple-item-date">${data.edu_date || ''}</span>
        </div>
        <div class="simple-item-subtitle">${data.edu_school || ''}</div>
      </div>
    </div>
  `;

  // ==========================================
  // 2. MẪU PROFESSIONAL (2 CỘT - THANH DỌC XANH)
  // ==========================================
  const professionalHtml = `
    <style>
      .pro-cv { display: flex; width: 100%; max-width: 210mm; min-height: 297mm; margin: 0 auto; background: white; }
      .pro-left { width: 32%; background-color: #1a3a4a; color: white; padding: 12mm 8mm; box-sizing: border-box; }
      .pro-right { width: 68%; padding: 12mm 12mm; box-sizing: border-box; }
      
      .pro-left-title { font-size: 13px; font-weight: 700; color: #8bb1c5; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; margin-top: 28px; }
      .pro-left-text { font-size: 12px; color: #e0e0e0; margin-bottom: 10px; line-height: 1.5; }
      
      .pro-name { font-size: 36px; font-weight: 800; color: #1a3a4a; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px; }
      .pro-title { font-size: 16px; color: #2C7DA0; font-weight: 600; padding-bottom: 15px; border-bottom: 1px solid #2C7DA0; margin-bottom: 25px; }
      
      .pro-sec-title { font-size: 15px; font-weight: 800; color: #1a3a4a; text-transform: uppercase; letter-spacing: 1px; border-left: 3px solid #2C7DA0; padding-left: 10px; margin-bottom: 15px; margin-top: 25px; }
      .pro-text { font-size: 13px; color: #444; line-height: 1.6; text-align: justify; }
      
      .pro-item { margin-bottom: 20px; }
      .pro-item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
      .pro-item-title { font-size: 15px; font-weight: 700; color: #222; }
      .pro-item-date { font-size: 13px; color: #2C7DA0; font-weight: 600; }
      .pro-item-subtitle { font-size: 13px; color: #666; font-style: italic; margin-bottom: 8px; }
      .pro-list { padding-left: 18px; margin: 0; font-size: 13px; color: #444; line-height: 1.6; }
    </style>
    <div class="pro-cv">
      <div class="pro-left">
        <div class="pro-left-title" style="margin-top:0;">Contacts</div>
        ${data.phone ? `<div class="pro-left-text">${data.phone}</div>` : ''}
        ${data.email ? `<div class="pro-left-text">${data.email}</div>` : ''}
        ${data.location ? `<div class="pro-left-text">${data.location}</div>` : ''}
        
        <div class="pro-left-title">Skills</div>
        <ul style="padding-left:15px; margin:0; font-size: 12px; color: #e0e0e0;">${renderSkills(data.skills, 'bullet')}</ul>
      </div>
      
      <div class="pro-right">
        <div class="pro-name">${data.fullName || 'TÊN CỦA BẠN'}</div>
        <div class="pro-title">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
        
        <div class="pro-sec-title">Summary</div>
        <div class="pro-text">${data.summary || ''}</div>
        
        <div class="pro-sec-title">Experience</div>
        <div class="pro-item">
          <div class="pro-item-header">
            <span class="pro-item-title">${data.exp1_title || ''}</span>
            <span class="pro-item-date">${data.exp1_date || ''}</span>
          </div>
          <div class="pro-item-subtitle">${data.exp1_company || ''}</div>
          <ul class="pro-list">${renderList(data.exp1_desc)}</ul>
        </div>
        <div class="pro-item">
          <div class="pro-item-header">
            <span class="pro-item-title">${data.exp2_title || ''}</span>
            <span class="pro-item-date">${data.exp2_date || ''}</span>
          </div>
          <div class="pro-item-subtitle">${data.exp2_company || ''}</div>
          <ul class="pro-list">${renderList(data.exp2_desc)}</ul>
        </div>
        
        <div class="pro-sec-title">Education</div>
        <div class="pro-item" style="margin-bottom: 0;">
          <div class="pro-item-header">
            <span class="pro-item-title">${data.edu_degree || ''}</span>
            <span class="pro-item-date">${data.edu_date || ''}</span>
          </div>
          <div class="pro-item-subtitle">${data.edu_school || ''}</div>
        </div>
      </div>
    </div>
  `;

  // ==========================================
  // 3. MẪU TRADITIONAL (CỔ ĐIỂN - CĂN GIỮA)
  // ==========================================
  const traditionalHtml = `
    <style>
      .trad-cv { width: 100%; max-width: 210mm; min-height: 297mm; margin: 0 auto; background: white; padding: 15mm; box-sizing: border-box; }
      .trad-name { font-size: 34px; font-weight: 800; color: #111; text-transform: uppercase; text-align: center; margin-bottom: 6px; letter-spacing: 2px; }
      .trad-title { font-size: 15px; color: #555; text-align: center; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
      .trad-contact { display: flex; justify-content: center; gap: 20px; font-size: 12px; color: #666; margin-bottom: 30px; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 12px 0; }
      .trad-section { margin-bottom: 25px; }
      .trad-sec-title { font-size: 16px; font-weight: 800; color: #222; text-transform: uppercase; text-align: center; margin-bottom: 15px; letter-spacing: 1.5px; }
      .trad-text { font-size: 13px; color: #444; line-height: 1.6; text-align: justify; }
      .trad-item { margin-bottom: 18px; }
      .trad-item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
      .trad-item-title { font-size: 15px; font-weight: 700; color: #222; }
      .trad-item-date { font-size: 13px; color: #555; font-weight: 600; }
      .trad-item-subtitle { font-size: 13px; color: #666; font-style: italic; margin-bottom: 6px; }
      .trad-list { padding-left: 20px; margin: 0; font-size: 13px; color: #444; line-height: 1.6; }
    </style>
    <div class="trad-cv">
      <div class="trad-name">${data.fullName || 'TÊN CỦA BẠN'}</div>
      <div class="trad-title">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
      <div class="trad-contact">
        ${data.email ? `<span>${data.email}</span>` : ''}
        ${data.phone ? `<span>${data.phone}</span>` : ''}
        ${data.location ? `<span>${data.location}</span>` : ''}
      </div>
      
      <div class="trad-section">
        <div class="trad-sec-title">Summary</div>
        <div class="trad-text">${data.summary || ''}</div>
      </div>
      
      <div class="trad-section">
        <div class="trad-sec-title">Experience</div>
        <div class="trad-item">
          <div class="trad-item-header">
            <span class="trad-item-title">${data.exp1_company || ''}</span>
            <span class="trad-item-date">${data.exp1_date || ''}</span>
          </div>
          <div class="trad-item-subtitle">${data.exp1_title || ''}</div>
          <ul class="trad-list">${renderList(data.exp1_desc)}</ul>
        </div>
        <div class="trad-item">
          <div class="trad-item-header">
            <span class="trad-item-title">${data.exp2_company || ''}</span>
            <span class="trad-item-date">${data.exp2_date || ''}</span>
          </div>
          <div class="trad-item-subtitle">${data.exp2_title || ''}</div>
          <ul class="trad-list">${renderList(data.exp2_desc)}</ul>
        </div>
      </div>
      
      <div class="trad-section">
        <div class="trad-sec-title">Education</div>
        <div class="trad-item-header">
          <span class="trad-item-title">${data.edu_school || ''}</span>
          <span class="trad-item-date">${data.edu_date || ''}</span>
        </div>
        <div class="trad-item-subtitle" style="margin-bottom:0;">${data.edu_degree || ''}</div>
      </div>
      
      <div class="trad-section">
        <div class="trad-sec-title" style="margin-top: 30px;">Skills</div>
        <div style="text-align: center; font-size: 13px; font-weight: 600; color: #444;">${renderSkills(data.skills, 'comma')}</div>
      </div>
    </div>
  `;

  // ==========================================
  // 4. MẪU MODERN (2 CỘT - ĐIỂM NHẤN XANH SÁNG)
  // ==========================================
  const modernHtml = `
    <style>
      .mod-cv { display: flex; width: 100%; max-width: 210mm; min-height: 297mm; margin: 0 auto; background: white; }
      .mod-left { width: 30%; background-color: #243c4f; color: white; padding: 12mm 8mm; box-sizing: border-box; text-align: right; }
      .mod-right { width: 70%; padding: 12mm 12mm; box-sizing: border-box; }
      
      .mod-left-title { font-size: 13px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; margin-top: 30px; border-bottom: 1px solid #3d586d; padding-bottom: 6px; }
      .mod-left-text { font-size: 12px; color: #cfd8dc; margin-bottom: 10px; line-height: 1.5; }
      
      .mod-name { font-size: 40px; font-weight: 800; color: #243c4f; text-transform: uppercase; margin-bottom: 5px; line-height: 1.1; letter-spacing: 1px; }
      .mod-title { font-size: 16px; color: #2C7DA0; font-weight: 700; margin-bottom: 25px; }
      
      .mod-sec-title { font-size: 15px; font-weight: 800; color: #2C7DA0; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; border-bottom: 2px solid #2C7DA0; padding-bottom: 5px; display: inline-block; }
      .mod-text { font-size: 13px; color: #444; line-height: 1.6; text-align: justify; }
      
      .mod-item { margin-bottom: 22px; }
      .mod-item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
      .mod-item-title { font-size: 15px; font-weight: 800; color: #243c4f; }
      .mod-item-date { font-size: 12px; color: #2C7DA0; font-weight: 700; background: #e3f2fd; padding: 4px 10px; border-radius: 4px; }
      .mod-item-subtitle { font-size: 13px; color: #666; font-weight: 600; margin-bottom: 6px; }
      .mod-list { padding-left: 20px; margin: 0; font-size: 13px; color: #444; line-height: 1.6; }
    </style>
    <div class="mod-cv">
      <div class="mod-left">
        <div class="mod-left-title" style="margin-top:0;">Contact</div>
        ${data.phone ? `<div class="mod-left-text">${data.phone}</div>` : ''}
        ${data.email ? `<div class="mod-left-text">${data.email}</div>` : ''}
        ${data.location ? `<div class="mod-left-text">${data.location}</div>` : ''}
        
        <div class="mod-left-title">Skills</div>
        <div style="text-align: right; color:#cfd8dc; font-size: 12px; line-height:1.8;">
           ${renderSkills(data.skills, 'div')}
        </div>
      </div>
      
      <div class="mod-right">
        <div class="mod-name">${data.fullName || 'TÊN CỦA BẠN'}</div>
        <div class="mod-title">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
        
        <div class="mod-sec-title">Summary</div>
        <div class="mod-text">${data.summary || ''}</div>
        
        <div class="mod-sec-title">Experience</div>
        <div class="mod-item">
          <div class="mod-item-header">
            <span class="mod-item-title">${data.exp1_title || ''}</span>
            <span class="mod-item-date">${data.exp1_date || ''}</span>
          </div>
          <div class="mod-item-subtitle">${data.exp1_company || ''}</div>
          <ul class="mod-list">${renderList(data.exp1_desc)}</ul>
        </div>
        <div class="mod-item">
          <div class="mod-item-header">
            <span class="mod-item-title">${data.exp2_title || ''}</span>
            <span class="mod-item-date">${data.exp2_date || ''}</span>
          </div>
          <div class="mod-item-subtitle">${data.exp2_company || ''}</div>
          <ul class="mod-list">${renderList(data.exp2_desc)}</ul>
        </div>
        
        <div class="mod-sec-title">Education</div>
        <div class="mod-item" style="margin-bottom:0;">
          <div class="mod-item-header">
            <span class="mod-item-title">${data.edu_degree || ''}</span>
            <span class="mod-item-date">${data.edu_date || ''}</span>
          </div>
          <div class="mod-item-subtitle">${data.edu_school || ''}</div>
        </div>
      </div>
    </div>
  `;

  // ==========================================
  // XÁC ĐỊNH MẪU ĐƯỢC CHỌN (DỰA VÀO TEMPLATE ID)
  // ==========================================
  let selectedBody = simpleHtml; // Mặc định là Simple
  
  if (templateId === 'henry_professional') {
    selectedBody = professionalHtml;
  } else if (templateId === 'henry_traditional') {
    selectedBody = traditionalHtml;
  } else if (templateId === 'henry_modern') {
    selectedBody = modernHtml;
  }

  // BỌC TRONG KHUNG HTML HOÀN CHỈNH (LOẠI BỎ PADDING THỪA ĐỂ KHÔNG TRÀN VIỀN PDF)
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: 'Inter', sans-serif; 
            background: #fff; 
            margin: 0; 
            padding: 0; 
            -webkit-print-color-adjust: exact; 
          }
          @page { margin: 0; size: A4; }
        </style>
      </head>
      <body>
        ${selectedBody}
      </body>
    </html>
  `;
};