import { CVModel } from '../models/CVModel.js';
import puppeteer from 'puppeteer';

export const cvController = {
  // Lấy danh sách CV của user (lịch sử)
  async getMyCVs(req, res) {
    try {
      const userId = req.userId;
      const cvs = await CVModel.findByUserId(userId);
      
      res.json({
        success: true,
        count: cvs.length,
        cvs: cvs
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi lấy danh sách CV' 
      });
    }
  },
  async getTemplateIdByCvId(req, res) {
    try {
      const { cvId } = req.params;
      console.log('🔍 getTemplateIdByCvId, cvId:', cvId);
      const [rows] = await db.execute(
        'SELECT templateId FROM cvs WHERE id = ?',
        [cvId]
      );
      console.log('🔍 Kết quả từ DB:', rows);
      if (rows.length > 0) {
        res.json({ success: true, templateId: rows[0].templateId });
      } else {
        res.status(404).json({ success: false, error: 'Không tìm thấy CV' });
      }
    } catch (error) {
      console.error(error);
      console.error('❌ Lỗi getTemplateIdByCvId:', error);
      res.status(500).json({ success: false, error: 'Lỗi server' });
    }
  },

  // ✅ Lấy CV theo userId + templateId (kiểm tra CV cũ) - DÙNG MODEL
  async getCVByUserAndTemplate(req, res) {
    try {
      const userId = req.userId;
      const { templateId } = req.params;

      const cv = await CVModel.findByUserAndTemplate(userId, templateId);

      if (cv) {
        res.json({ success: true, cv });
      } else {
        res.json({ success: true, cv: null });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi lấy CV' });
    }
  },

  // Lấy chi tiết 1 CV
  async getCVById(req, res) {
    try {
      const cvId = req.params.id;
      const userId = req.userId;
      
      const cv = await CVModel.findById(cvId, userId);
      
      if (!cv) {
        return res.status(404).json({ 
          success: false, 
          error: 'Không tìm thấy CV' 
        });
      }
      
      res.json({
        success: true,
        cv: cv
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi lấy chi tiết CV' 
      });
    }
  },

  // Cập nhật CV
  async updateCV(req, res) {
    try {
      const cvId = req.params.id;
      const userId = req.userId;
      const updateData = req.body;
      
      const updated = await CVModel.update(cvId, userId, updateData);
      
      if (!updated) {
        return res.status(404).json({ 
          success: false, 
          error: 'Không tìm thấy CV hoặc không có quyền sửa' 
        });
      }
      
      res.json({
        success: true,
        message: 'Cập nhật CV thành công'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi cập nhật CV' 
      });
    }
  },

  // Tạo CV mới
  async createCV(req, res) {
    try {
      const { templateId } = req.body;
      const userId = req.userId;
      
      const defaultContent = {
        fullName: 'HENRY JONES',
        title: 'Lead Sales Operations Manager',
        email: 'resume@example.com',
        phone: '(512) 555-0199',
        address: 'Austin, TX, 78701',
        summary: 'Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.',
        skills: ['Strategic Upselling', 'Visual Merchandising', 'Inventory Reconciliation', 'Conflict Resolution'],
        exp1_title: 'Lead Sales Coordinator',
        exp1_date: 'Apr 2022 — Current',
        exp1_company: 'HomeGoods Solutions, Austin, TX',
        exp1_achievements: [
          'Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.',
          'Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.'
        ],
        exp2_title: 'Retail Sales Specialist',
        exp2_date: 'Jul 2021 — Apr 2022',
        exp2_company: 'Global Apparel Corp, Austin, TX',
        exp2_achievements: [
          'Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.',
          'Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.'
        ],
        edu_title: 'Bachelor of Science, Marketing',
        edu_date: 'Sep 2011 — May 2015',
        edu_school: 'University of Texas at Austin, Austin, TX'
      };
      
      const newCV = await CVModel.create(userId, templateId, defaultContent);
      
      res.status(201).json({
        success: true,
        message: 'Tạo CV thành công',
        cvId: newCV.id
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi tạo CV' });
    }
  },

  // Xuất PDF
  async exportPDF(req, res) {
    try {
      const cvId = req.params.id;
      const userId = req.userId;
      
      const cv = await CVModel.findById(cvId, userId);
      if (!cv) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy CV' });
      }
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .name { font-size: 28px; font-weight: bold; }
            .title { font-size: 18px; color: #2C7DA0; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #2C7DA0; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="name">${cv.content.fullName || ''}</div>
          <div class="title">${cv.content.title || ''}</div>
          <div class="section">
            <div class="section-title">Thông tin liên hệ</div>
            <div>Email: ${cv.content.email || ''}</div>
            <div>Điện thoại: ${cv.content.phone || ''}</div>
            <div>Địa chỉ: ${cv.content.address || ''}</div>
          </div>
          <div class="section">
            <div class="section-title">Tóm tắt</div>
            <div>${cv.content.summary || ''}</div>
          </div>
          <div class="section">
            <div class="section-title">Kinh nghiệm</div>
            <div><strong>${cv.content.exp1_title || ''}</strong> - ${cv.content.exp1_date || ''}</div>
            <div>${cv.content.exp1_company || ''}</div>
            <ul>${(cv.content.exp1_achievements || []).map(a => `<li>${a}</li>`).join('')}</ul>
          </div>
        </body>
        </html>
      `;
      
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4' });
      await browser.close();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="CV_${cvId}.pdf"`);
      res.send(pdf);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi tạo PDF' });
    }
  }
};