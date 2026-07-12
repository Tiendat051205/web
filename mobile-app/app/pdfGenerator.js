export const getCVHtml = (templateId, data) => {
  // Hàm hỗ trợ chuyển đổi dữ liệu xuống dòng thành các thẻ <li>
  const renderList = (text) => {
    if (!text) return '';
    const arr = Array.isArray(text) ? text : text.split('\n');
    return arr.filter(Boolean).map(item => `<li>${item.trim()}</li>`).join('');
  };

  // Hàm hỗ trợ render kỹ năng (ngăn cách bằng dấu phẩy)
  const renderSkills = (text, isSimple) => {
    if (!text) return '';
    const arr = Array.isArray(text) ? text : text.split(',');
    if (isSimple) {
      return arr.filter(Boolean).map(s => `<span class="skill-item"><strong>${s.trim()}</strong></span>`).join(' · ');
    }
    return arr.filter(Boolean).map(s => `<li>${s.trim()}</li>`).join('');
  };

  // --- 1. MẪU PROFESSIONAL (2 CỘT) ---
  const professionalHtml = `
    <style>
      .cv-card { display: flex; width: 100%; max-width: 800px; margin: 0 auto; background: white; }
      .cv-left { width: 35%; background: #1a3a4a; color: white; padding: 30px; }
      .cv-right { width: 65%; padding: 30px; }
      .cv-name-left { font-size: 24px; font-weight: 700; margin-bottom: 20px; border-bottom: 2px solid #2C7DA0; padding-bottom: 10px; }
      .section-left { margin-bottom: 25px; }
      .section-title-left { font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; color: #2C7DA0; }
      .contact-item-left { font-size: 12px; margin-bottom: 10px; }
      .cv-name-right { font-size: 28px; font-weight: 700; color: #1a3a4a; margin-bottom: 5px; }
      .cv-title-right { font-size: 16px; color: #2C7DA0; margin-bottom: 20px; border-bottom: 2px solid #2C7DA0; padding-bottom: 10px; }
      .section-right { margin-bottom: 20px; }
      .section-title-right { font-size: 16px; font-weight: 700; color: #2C7DA0; margin-bottom: 10px; }
      .exp-header { display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 5px;}
      .exp-date { color: #2C7DA0; font-size: 12px; }
      .exp-list { padding-left: 18px; margin-top: 5px; font-size: 13px; color: #555; }
    </style>
    <div class="cv-card">
      <div class="cv-left">
        <div class="cv-name-left">${data.fullName || 'TÊN CỦA BẠN'}</div>
        <div class="section-left">
          <div class="section-title-left">CONTACTS</div>
          <div class="contact-item-left"><i class="fas fa-phone"></i> ${data.phone || ''}</div>
          <div class="contact-item-left"><i class="fas fa-envelope"></i> ${data.email || ''}</div>
          <div class="contact-item-left"><i class="fas fa-map-marker-alt"></i> ${data.location || ''}</div>
        </div>
        <div class="section-left">
          <div class="section-title-left">SKILLS</div>
          <ul style="padding-left: 15px; font-size: 12px;">${renderSkills(data.skills, false)}</ul>
        </div>
      </div>
      <div class="cv-right">
        <div class="cv-name-right">${data.fullName || 'TÊN CỦA BẠN'}</div>
        <div class="cv-title-right">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
        <div class="section-right">
          <div class="section-title-right">SUMMARY</div>
          <div style="font-size: 13px; color: #444; line-height: 1.5;">${data.summary || ''}</div>
        </div>
        <div class="section-right">
          <div class="section-title-right">EXPERIENCE</div>
          <div style="margin-bottom: 15px;">
            <div class="exp-header"><span>${data.exp1_title || ''}</span><span class="exp-date">${data.exp1_date || ''}</span></div>
            <div style="font-size: 13px; color: #666;">${data.exp1_company || ''}</div>
            <ul class="exp-list">${renderList(data.exp1_desc)}</ul>
          </div>
          <div style="margin-bottom: 15px;">
            <div class="exp-header"><span>${data.exp2_title || ''}</span><span class="exp-date">${data.exp2_date || ''}</span></div>
            <div style="font-size: 13px; color: #666;">${data.exp2_company || ''}</div>
            <ul class="exp-list">${renderList(data.exp2_desc)}</ul>
          </div>
        </div>
        <div class="section-right">
          <div class="section-title-right">EDUCATION</div>
          <div class="exp-header"><span>${data.edu_degree || ''}</span><span class="exp-date">${data.edu_date || ''}</span></div>
          <div style="font-size: 13px; color: #666;">${data.edu_school || ''}</div>
        </div>
      </div>
    </div>
  `;

  // --- 2. MẪU SIMPLE (TỪ FILE HENRY_SIMPLE.HTML) ---
  const simpleHtml = `
    <style>
      .cv-card { max-width: 800px; margin: 0 auto; background: white; padding: 40px; }
      .cv-name { font-size: 32px; font-weight: 700; color: #1a3a4a; margin-bottom: 5px; }
      .cv-title { font-size: 18px; color: #2C7DA0; font-weight: 500; margin-bottom: 15px; }
      .contact-bar { display: flex; gap: 20px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; font-size: 14px; color: #555; }
      .section { margin-bottom: 25px; }
      .section-title { font-size: 18px; font-weight: 700; color: #2C7DA0; margin-bottom: 12px; border-left: 3px solid #2C7DA0; padding-left: 12px; }
      .exp-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
      .exp-title { font-weight: 700; color: #1a3a4a; font-size: 15px; }
      .exp-date { color: #2C7DA0; font-size: 13px; }
      .exp-location { color: #666; font-size: 13px; font-style: italic; }
      .exp-list { padding-left: 18px; margin-top: 6px; font-size: 13px; color: #555; }
      .skills-bar { display: flex; flex-wrap: wrap; gap: 10px; font-size: 14px; }
      .skill-item strong { color: #2C7DA0; }
    </style>
    <div class="cv-card">
      <div class="cv-name">${data.fullName || 'TÊN CỦA BẠN'}</div>
      <div class="cv-title">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
      <div class="contact-bar">
        <div><i class="fas fa-map-marker-alt" style="color:#2C7DA0"></i> ${data.location || ''}</div>
        <div><i class="fas fa-envelope" style="color:#2C7DA0"></i> ${data.email || ''}</div>
        <div><i class="fas fa-phone" style="color:#2C7DA0"></i> ${data.phone || ''}</div>
      </div>
      <div class="section">
        <div class="section-title">SUMMARY</div>
        <div style="font-size: 14px; line-height: 1.6; color: #444;">${data.summary || ''}</div>
      </div>
      <div class="section">
        <div class="section-title">EXPERIENCE</div>
        <div style="margin-bottom: 20px;">
          <div class="exp-header">
            <span class="exp-title">${data.exp1_title || ''}</span>
            <span class="exp-date">${data.exp1_date || ''}</span>
          </div>
          <div class="exp-location">${data.exp1_company || ''}</div>
          <ul class="exp-list">${renderList(data.exp1_desc)}</ul>
        </div>
        <div style="margin-bottom: 20px;">
          <div class="exp-header">
            <span class="exp-title">${data.exp2_title || ''}</span>
            <span class="exp-date">${data.exp2_date || ''}</span>
          </div>
          <div class="exp-location">${data.exp2_company || ''}</div>
          <ul class="exp-list">${renderList(data.exp2_desc)}</ul>
        </div>
      </div>
      <div class="section">
        <div class="section-title">EDUCATION</div>
        <div class="exp-header">
          <span class="exp-title">${data.edu_degree || ''}</span>
          <span class="exp-date">${data.edu_date || ''}</span>
        </div>
        <div class="exp-location">${data.edu_school || ''}</div>
      </div>
      <div class="section">
        <div class="section-title">SKILLS</div>
        <div class="skills-bar">${renderSkills(data.skills, true)}</div>
      </div>
    </div>
  `;

  // --- 3. MẪU CLASSIC (TỪ FILE TRADITIONAL.HTML) ---
  const classicHtml = `
    <style>
      .cv-card { max-width: 800px; margin: 0 auto; background: white; padding: 40px; }
      .cv-name { font-size: 28px; font-weight: 700; color: #1a3a4a; margin-bottom: 5px; letter-spacing: 1px; text-align: center; }
      .cv-title { font-size: 16px; color: #2C7DA0; font-weight: 500; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; text-align: center; }
      .contact-row { display: flex; justify-content: center; gap: 25px; margin-bottom: 25px; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 13px; color: #555; }
      .section { margin-bottom: 25px; }
      .section-title { font-size: 16px; font-weight: 700; color: #1a3a4a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
      .skills-list { list-style: none; padding-left: 0; display: flex; flex-wrap: wrap; gap: 15px; }
      .skills-list li { font-size: 14px; color: #555; }
      .exp-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
      .exp-title { font-weight: 700; color: #1a3a4a; font-size: 15px; }
      .exp-date { color: #2C7DA0; font-size: 13px; font-weight: 500; }
      .exp-company { color: #666; font-size: 13px; margin-bottom: 8px; font-style: italic; }
      .exp-list { padding-left: 18px; margin-top: 6px; font-size: 13px; color: #555; }
    </style>
    <div class="cv-card">
      <div class="cv-name">${data.fullName || 'TÊN CỦA BẠN'}</div>
      <div class="cv-title">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
      <div class="contact-row">
        <div><i class="fas fa-envelope" style="color:#2C7DA0"></i> ${data.email || ''}</div>
        <div><i class="fas fa-phone" style="color:#2C7DA0"></i> ${data.phone || ''}</div>
        <div><i class="fas fa-map-marker-alt" style="color:#2C7DA0"></i> ${data.location || ''}</div>
      </div>
      <div class="section">
        <div class="section-title">SKILLS</div>
        <ul class="skills-list">${renderSkills(data.skills, false)}</ul>
      </div>
      <div class="section">
        <div class="section-title">SUMMARY</div>
        <div style="font-size: 14px; line-height: 1.6; color: #444;">${data.summary || ''}</div>
      </div>
      <div class="section">
        <div class="section-title">EXPERIENCE</div>
        <div style="margin-bottom: 20px;">
          <div class="exp-header"><span class="exp-title">${data.exp1_title || ''}</span><span class="exp-date">${data.exp1_date || ''}</span></div>
          <div class="exp-company">${data.exp1_company || ''}</div>
          <ul class="exp-list">${renderList(data.exp1_desc)}</ul>
        </div>
        <div style="margin-bottom: 20px;">
          <div class="exp-header"><span class="exp-title">${data.exp2_title || ''}</span><span class="exp-date">${data.exp2_date || ''}</span></div>
          <div class="exp-company">${data.exp2_company || ''}</div>
          <ul class="exp-list">${renderList(data.exp2_desc)}</ul>
        </div>
      </div>
      <div class="section">
        <div class="section-title">EDUCATION</div>
        <div class="exp-header"><span class="exp-title">${data.edu_degree || ''}</span><span class="exp-date">${data.edu_date || ''}</span></div>
        <div class="exp-company">${data.edu_school || ''}</div>
      </div>
    </div>
  `;

  // --- 4. MẪU MODERN (TỪ FILE HENRY_MODERN.HTML) ---
  const modernHtml = `
    <style>
      .cv-card { max-width: 800px; margin: 0 auto; background: white; padding: 40px; }
      .cv-name { font-size: 36px; font-weight: 700; color: #1a3a4a; margin-bottom: 8px; }
      .cv-title { font-size: 18px; color: #2C7DA0; font-weight: 500; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #2C7DA0; }
      .contact-column { margin-bottom: 25px; background: #f8f9fa; padding: 15px 20px; border-radius: 8px; display: flex; gap: 20px; font-size: 14px; color: #555; }
      .section { margin-bottom: 25px; }
      .section-title { font-size: 18px; font-weight: 700; color: #2C7DA0; margin-bottom: 12px; border-left: 3px solid #2C7DA0; padding-left: 12px; }
      .skills-list { padding-left: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; color: #555; }
      .exp-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
      .exp-title { font-weight: 700; color: #1a3a4a; font-size: 16px; }
      .exp-date { color: #2C7DA0; font-size: 13px; }
      .exp-company { color: #666; font-size: 14px; margin-bottom: 8px; font-style: italic; }
      .exp-list { padding-left: 20px; margin-top: 6px; font-size: 13px; color: #555; }
    </style>
    <div class="cv-card">
      <div class="cv-name">${data.fullName || 'TÊN CỦA BẠN'}</div>
      <div class="cv-title">${data.jobTitle || 'Vị trí ứng tuyển'}</div>
      <div class="contact-column">
        <div><i class="fas fa-map-marker-alt" style="color:#2C7DA0"></i> ${data.location || ''}</div>
        <div><i class="fas fa-envelope" style="color:#2C7DA0"></i> ${data.email || ''}</div>
        <div><i class="fas fa-phone" style="color:#2C7DA0"></i> ${data.phone || ''}</div>
      </div>
      <div class="section">
        <div class="section-title">SUMMARY</div>
        <div style="font-size: 14px; line-height: 1.6; color: #444;">${data.summary || ''}</div>
      </div>
      <div class="section">
        <div class="section-title">SKILLS</div>
        <ul class="skills-list">${renderSkills(data.skills, false)}</ul>
      </div>
      <div class="section">
        <div class="section-title">EXPERIENCE</div>
        <div style="margin-bottom: 20px;">
          <div class="exp-header"><span class="exp-title">${data.exp1_title || ''}</span><span class="exp-date">${data.exp1_date || ''}</span></div>
          <div class="exp-company">${data.exp1_company || ''}</div>
          <ul class="exp-list">${renderList(data.exp1_desc)}</ul>
        </div>
        <div style="margin-bottom: 20px;">
          <div class="exp-header"><span class="exp-title">${data.exp2_title || ''}</span><span class="exp-date">${data.exp2_date || ''}</span></div>
          <div class="exp-company">${data.exp2_company || ''}</div>
          <ul class="exp-list">${renderList(data.exp2_desc)}</ul>
        </div>
      </div>
      <div class="section">
        <div class="section-title">EDUCATION</div>
        <div class="exp-header"><span class="exp-title">${data.edu_degree || ''}</span><span class="exp-date">${data.edu_date || ''}</span></div>
        <div class="exp-company">${data.edu_school || ''}</div>
      </div>
    </div>
  `;

  // CHỌN MẪU DỰA TRÊN TEMPLATE ID
  let selectedBody = simpleHtml; // Mặc định
  if (templateId === 'henry_professional') selectedBody = professionalHtml;
  if (templateId === 'henry_traditional') selectedBody = classicHtml;
  if (templateId === 'henry_modern') selectedBody = modernHtml;

  // BỌC TRONG KHUNG HTML HOÀN CHỈNH
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>
          body { font-family: 'Inter', sans-serif; background: #f0f2f5; padding: 20px; }
          /* Reset lề khi in PDF */
          @page { margin: 0; }
        </style>
      </head>
      <body>
        ${selectedBody}
      </body>
    </html>
  `;
};