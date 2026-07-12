CREATE DATABASE  IF NOT EXISTS `new_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `new_database`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--


--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cvId` int DEFAULT NULL,
  `authorName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `templateKey` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templateId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comments_cvs` (`cvId`),
  KEY `fk_comments_users` (`userId`),
  CONSTRAINT `fk_comments_cvs` FOREIGN KEY (`cvId`) REFERENCES `cvs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (8,NULL,'Pham Bac Dai Duong',2,'hehe','2026-06-13 16:18:39','CV2',8),(9,NULL,'John Doe',5,'Excellent template!','2026-07-04 20:11:07',NULL,1),(12,NULL,'Test User',7,'hello','2026-07-04 20:55:33','henry_simple',NULL),(13,NULL,'Test User',7,'debug','2026-07-04 20:56:23','henry_simple',NULL),(14,NULL,'Test User',7,'debug','2026-07-04 21:00:30','henry_simple',NULL),(15,NULL,'Test User',7,'debug','2026-07-04 21:02:05','henry_simple',NULL),(16,NULL,'Test User',7,'verified comment from terminal','2026-07-04 21:12:54','henry_simple',NULL),(17,NULL,'Test User',7,'test from powershell','2026-07-04 21:14:59','henry_simple',NULL),(18,NULL,'Test User',7,'UI verification','2026-07-04 21:15:57','henry_simple',NULL),(22,NULL,'nguyen tien dat',3,'3636','2026-07-05 12:39:00','henry_simple',NULL);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cvs`
--

DROP TABLE IF EXISTS `cvs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cvs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `templateId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'CV chưa có tiêu đề',
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastEditedBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cvs_users` (`userId`),
  CONSTRAINT `fk_cvs_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cvs`
--

LOCK TABLES `cvs` WRITE;
/*!40000 ALTER TABLE `cvs` DISABLE KEYS */;
INSERT INTO `cvs` VALUES (8,2,'CV2','Trần Thị Buoi','\n          <article class=\"cv-page cv-page-cv2\">\n            <section class=\"cv-hero cv-hero-cv2\">\n              <div class=\"cv-intro cv-intro-dark\" bis_skin_checked=\"1\">\n                <p class=\"cv-kicker\">Professional Profile</p>\n                <h1 class=\"cv-title\" data-editable=\"\" data-template-title=\"\" contenteditable=\"true\" spellcheck=\"false\" data-value=\"Trần Thị Buoi\">Trần Thị Buoi</h1>\n                <p class=\"cv-subtitle\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\">Business Analyst</p>\n                <p class=\"file-note\" data-no-export=\"\">\n                  Bấm vào nội dung để chỉnh sửa trực tiếp. Phần trợ giúp và nút thao tác sẽ không nằm trong PDF.\n                </p>\n              </div>\n\n              <div class=\"avatar-wrap avatar-wrap-right\" bis_skin_checked=\"1\">\n                <img class=\"avatar-image avatar-image-cv2\" data-photo-preview=\"\" src=\"https://randomuser.me/api/portraits/women/44.jpg\" alt=\"Ảnh CV\">\n                <label class=\"btn btn-outline photo-input\" data-no-export=\"\">\n                  Thêm ảnh\n                  <input type=\"file\" accept=\"image/*\" data-photo-input=\"\" style=\"width:1px;height:1px;opacity:0;position:absolute;pointer-events:none;\">\n                </label>\n              </div>\n            </section>\n\n            <section class=\"cv-two-col\">\n              <div class=\"cv-left-col\" bis_skin_checked=\"1\">\n                <section class=\"cv-section cv-section-card cv-section-dark\">\n                  <h3>Thông tin liên hệ</h3>\n                  <div class=\"cv-grid-2 cv-grid-compact\" bis_skin_checked=\"1\">\n                    <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">? tranthib@example.com</div>\n                    <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">? 0987 654 321</div>\n                    <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">? TP. Hồ Chí Minh, Việt Nam</div>\n                    <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">? linkedin.com/in/tranthib</div>\n                  </div>\n                </section>\n\n                <section class=\"cv-section cv-section-card cv-section-dark\">\n                  <h3>Kỹ năng</h3>\n                  <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">\n                    <ul class=\"cv-list\">\n                      <li>Phân tích yêu cầu</li>\n                      <li>SQL / Data Reporting</li>\n                      <li>UI/UX Review</li>\n                      <li>Agile / Scrum</li>\n                    </ul>\n                  </div>\n                </section>\n\n                <section class=\"cv-section cv-section-card cv-section-dark\">\n                  <h3>Học vấn</h3>\n                  <div class=\"cv-grid-2 cv-grid-compact\" bis_skin_checked=\"1\">\n                    <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\"><strong>Đại học Kinh tế Quốc dân</strong></div>\n                    <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">Hệ thống thông tin quản lý, 2017 - 2021</div>\n                    <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">GPA: 3.75/4.0</div>\n                  </div>\n                </section>\n              </div>\n\n              <div class=\"cv-right-col\" bis_skin_checked=\"1\">\n                <section class=\"cv-section cv-section-card cv-section-dark\">\n                  <h3>Mục tiêu nghề nghiệp</h3>\n                  <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">\n                    Mong muốn trở thành chuyên viên phân tích nghiệp vụ có khả năng kết nối yêu cầu kinh doanh với giải pháp công nghệ, tối ưu quy trình và nâng cao hiệu quả vận hành.\n                  </div>\n                </section>\n\n                <section class=\"cv-section cv-section-card cv-section-dark\">\n                  <h3>Kinh nghiệm làm việc</h3>\n                  <div class=\"cv-stack\" bis_skin_checked=\"1\">\n                    <div class=\"cv-experience\" bis_skin_checked=\"1\">\n                      <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\"><strong>Công ty DEF</strong> - Business Analyst (2021 - 2024)</div>\n                      <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">Thu thập yêu cầu, phân tích quy trình và phối hợp cùng đội phát triển để triển khai tính năng.</div>\n                    </div>\n                    <div class=\"cv-experience\" bis_skin_checked=\"1\">\n                      <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\"><strong>Công ty XYZ</strong> - Intern Analyst (2020 - 2021)</div>\n                      <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">Hỗ trợ lập tài liệu nghiệp vụ, phân tích dữ liệu và kiểm thử các luồng chính của hệ thống.</div>\n                    </div>\n                  </div>\n                </section>\n\n                <section class=\"cv-section cv-section-card cv-section-dark\">\n                  <h3>Dự án tiêu biểu</h3>\n                  <div class=\"editable\" data-editable=\"\" contenteditable=\"true\" spellcheck=\"false\" bis_skin_checked=\"1\">\n                    Tham gia xây dựng hệ thống quản lý hồ sơ, dashboard dữ liệu và công cụ theo dõi tiến độ cho nhiều nhóm nội bộ.\n                  </div>\n                </section>\n              </div>\n            </section>\n          </article>\n        ',2,'2026-06-13 16:18:32','2026-06-13 16:18:32'),(9,1,'CV1','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\"resume@example.com\",\"phone\":\"(512) 555-0199\",\"address\":\"Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":[\"Strategic Upselling\",\"Visual Merchandising\",\"Inventory Reconciliation\",\"Conflict Resolution\"],\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions, Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp, Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 — May 2015\",\"edu_school\":\"University of Texas at Austin, Austin, TX\"}',NULL,'2026-07-03 08:24:09','2026-07-03 08:24:09'),(10,1,'CV1','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\"resume@example.com\",\"phone\":\"(512) 555-0199\",\"address\":\"Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":[\"Strategic Upselling\",\"Visual Merchandising\",\"Inventory Reconciliation\",\"Conflict Resolution\"],\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions, Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp, Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 — May 2015\",\"edu_school\":\"University of Texas at Austin, Austin, TX\"}',NULL,'2026-07-03 08:24:36','2026-07-03 08:24:36'),(11,1,'CV2','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\"resume@example.com\",\"phone\":\"(512) 555-0199\",\"address\":\"Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":[\"Strategic Upselling\",\"Visual Merchandising\",\"Inventory Reconciliation\",\"Conflict Resolution\"],\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions, Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp, Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 — May 2015\",\"edu_school\":\"University of Texas at Austin, Austin, TX\"}',NULL,'2026-07-03 08:24:57','2026-07-03 08:24:57'),(12,1,'CV1','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\"resume@example.com\",\"phone\":\"(512) 555-0199\",\"address\":\"Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":[\"Strategic Upselling\",\"Visual Merchandising\",\"Inventory Reconciliation\",\"Conflict Resolution\"],\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions, Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp, Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 — May 2015\",\"edu_school\":\"University of Texas at Austin, Austin, TX\"}',NULL,'2026-07-03 09:08:39','2026-07-03 09:08:39'),(13,5,'1','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\"resume@example.com\",\"phone\":\"(512) 555-0199\",\"address\":\"Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":[\"Strategic Upselling\",\"Visual Merchandising\",\"Inventory Reconciliation\",\"Conflict Resolution\"],\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions, Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp, Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 — May 2015\",\"edu_school\":\"University of Texas at Austin, Austin, TX\"}',NULL,'2026-07-04 20:09:29','2026-07-04 20:09:29'),(14,8,'henry_simple','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"phone\":\"(512) 555-0199\",\"email\":\"resume@example.com\",\"location\":\"Austin, TX\",\"skills\":\"Strategic Upselling,Visual Merchandising,Inventory Reconciliation,Conflict Resolution\",\"jobTitle\":\"Lead Sales Operations Manager\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions, Austin, TX\",\"exp1_desc\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp, Austin, TX\",\"exp2_desc\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_degree\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 — May 2015\",\"edu_school\":\"University of Texas at Austin, Austin, TX\"}',NULL,'2026-07-04 21:33:03','2026-07-04 21:39:22'),(15,2,'henry_simple','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\"resume@example.com\",\"phone\":\"(512) 555-0199\",\"address\":\"Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":\"Strategic Upselling Visual Merchandising Inventory Reconciliation Conflict Resolution\",\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions - Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp - Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 - May 2015\",\"edu_school\":\"University of Texas at Austin\",\"location\":\"Austin, TX\",\"jobTitle\":\"Lead Sales Operations Manager\",\"exp1_desc\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_desc\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_degree\":\"Bachelor of Science, Marketing\"}',NULL,'2026-07-04 21:38:25','2026-07-04 21:38:25'),(16,1,'henry_simple','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\"resume@example.com\",\"phone\":\"(512) 555-0199\",\"address\":\"Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":\"Strategic Upselling Visual Merchandising Inventory Reconciliation Conflict Resolution\",\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions - Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp - Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 - May 2015\",\"edu_school\":\"University of Texas at Austin\",\"location\":\"Austin, TX\",\"jobTitle\":\"Lead Sales Operations Manager\",\"exp1_desc\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_desc\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_degree\":\"Bachelor of Science, Marketing\"}',NULL,'2026-07-04 21:38:57','2026-07-04 21:38:57'),(18,2,'henry_simple','CV chưa có tiêu đề','{\"fullName\":\"dduongg\",\"jobTitle\":\"Lead Sales Operations Manager\",\"phone\":\"(512) 555-0199\",\"email\":\"resume@example.com\",\"location\":\"Austin, TX\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership.\",\"skills\":[\"Strategic Upselling Visual Merchandising Inventory Reconciliation Conflict Resolution\"],\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions - Austin, TX\",\"exp1_desc\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp - Austin, TX\",\"exp2_desc\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_degree\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 - May 2015\",\"edu_school\":\"University of Texas at Austin\",\"title\":\"Lead Sales Operations Manager\",\"address\":\"Austin, TX, 78701\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques.\"],\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\"}',NULL,'2026-07-04 21:57:17','2026-07-05 15:21:30'),(20,3,'henry_professional','CV chưa có tiêu đề','{\"fullName\":\"HENRY JONES\",\"title\":\"Lead Sales Operations Manager\",\"email\":\" resume@example.com\",\"phone\":\" (512) 555-0199\",\"address\":\" Austin, TX, 78701\",\"summary\":\"Results-oriented Retail Operations Specialist with over 5 years of experience in high-volume consumer environments. Expert in inventory management, visual merchandising, and team leadership. Proven ability to exceed quarterly sales targets, streamline operational workflows, and enhance customer loyalty through personalized service strategies.\",\"skills\":\"Strategic Upselling\\nVisual Merchandising\\nInventory Reconciliation\\nConflict Resolution\",\"exp1_title\":\"Lead Sales Coordinator\",\"exp1_date\":\"Apr 2022 — Current\",\"exp1_company\":\"HomeGoods Solutions, Austin, TX\",\"exp1_achievements\":[\"Executed comprehensive loss prevention protocols to identify security vulnerabilities and decrease annual inventory shrinkage by 12%.\",\"Facilitated weekly training workshops for 15+ staff members on advanced closing techniques and product technical specifications.\"],\"exp2_title\":\"Retail Sales Specialist\",\"exp2_date\":\"Jul 2021 — Apr 2022\",\"exp2_company\":\"Global Apparel Corp, Austin, TX\",\"exp2_achievements\":[\"Managed inventory replenishment cycles to ensure 100% availability of core product lines during peak seasonal periods.\",\"Direct department aesthetics by implementing corporate style guides to maintain premium brand positioning.\"],\"edu_title\":\"Bachelor of Science, Marketing\",\"edu_date\":\"Sep 2011 — May 2015\",\"edu_school\":\"University of Texas at Austin, Austin, TX\"}',NULL,'2026-07-04 22:12:57','2026-07-04 22:12:57');
/*!40000 ALTER TABLE `cvs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `templateId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPremium` tinyint(1) DEFAULT '0',
  `viewCount` int DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `templateId` (`templateId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (7,'CV1','Mẫu CV 1','Trang 1','Mẫu CV 1 dành cho hồ sơ cơ bản.','https://picsum.photos/id/20/400/280',0,0,'2026-06-12 16:11:21'),(8,'CV2','Mẫu CV 2','Trang 2','Mẫu CV 2 dành cho hồ sơ chuyên nghiệp.','https://picsum.photos/id/21/400/280',0,0,'2026-06-12 16:11:21');
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  subject VARCHAR(100),
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
-- ============================================================
-- BẢNG PAGE_VIEWS (Lượt xem trang)
-- ============================================================
CREATE TABLE IF NOT EXISTS page_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(255) NOT NULL,
  ip VARCHAR(45),
  userAgent TEXT,
  viewedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


UPDATE users 
SET password = '$2b$10$8rkDH9p.cFloiUiacC8wdOWAcsG9QwfqAn7A1l7Lt.Uam5jFHR8.q' 
WHERE email = 'admin@jobgenius.local';



--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@jobgenius.local','$2b$10$WAnNpuTzOg1rdJKPakRwJupbPYHagrRXcyo.uUEiRiwdhzO5TKgpO',1,'2026-06-12 15:31:11','2026-06-12 15:31:11'),(2,'Pham Bac Dai Duong','duong.pbd233846@sis.hust.edu.vn','$2b$10$DpdzjejyPVSnpekSdAH8tOO5k8E07lzisRlViw.ixhJ4UcFBkUxLC',0,'2026-06-12 15:37:51','2026-06-12 15:37:51'),(3,'nguyen tien dat','dat36@gmail.com','$2b$10$e6PZO0LNhQk6n.WyzzDp7uWhme6Gc7X5.TBH1RIFhowaY5T6xUTmO',0,'2026-06-12 15:38:19','2026-06-12 15:38:19'),(4,'Test User','test@test.com','$2b$10$BA.TqBCOklxRZ6h.7Yw7s.DTjZimOw.AZy3cvSztQVD0wn1XpmOOO',0,'2026-07-04 20:07:19','2026-07-04 20:07:19'),(5,'John Doe','john@example.com','$2b$10$Mpne7JG4GgK4CM7ogyU0p.92gr/XcAA.78df5H0krHFOaUcLkotje',0,'2026-07-04 20:08:28','2026-07-04 20:08:28'),(6,'Test User','test2@example.com','$2b$10$2xp/sQDYo6NeLJ5mrCpJQupQpqG28LeTZ6xLmPwcvrdDQZ4PoYc7S',0,'2026-07-04 20:29:24','2026-07-04 20:29:24'),(7,'Test User','verify@example.com','$2b$10$ZusXv6ZcXJjKZdWvWuULbOfq/WWfz3RreO5P73n.JsLCH10iANwM6',0,'2026-07-04 20:31:17','2026-07-04 20:31:17'),(8,'Verifier','verifier@example.com','$2b$10$dSxxiUVrE9eLsaOSHlxkIerg4APCyLh5GX2/fHJt3qgWPMFMXE9Jm',0,'2026-07-04 21:32:58','2026-07-04 21:32:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
SELECT * FROM users
SELECT * FROM templates;
-- Xóa dữ liệu cũ
DELETE FROM templates;
DELETE FROM templates WHERE templateId = 'CV1';
DELETE FROM templates WHERE templateId = 'CV2';

-- Chèn dữ liệu mới
INSERT INTO templates (templateId, name, category, description, thumbnail, isPremium) VALUES
('henry_simple', 'Henry Jones - Simple', 'Đơn giản · 1 cột', 'Mẫu CV bố cục 1 cột, rõ ràng, tập trung vào nội dung.', 'https://picsum.photos/id/20/400/280', 0),
('henry_professional', 'Henry Jones - Professional', 'Chuyên nghiệp · 2 cột', 'Mẫu CV 2 cột, hiện đại, nổi bật kỹ năng và thông tin.', 'https://picsum.photos/id/21/400/280', 0),
('henry_traditional', 'Henry Jones - Traditional', 'Cổ điển · Trang trọng', 'Mẫu CV truyền thống, phù hợp vị trí quản lý cấp cao.', 'https://picsum.photos/id/22/400/280', 1),
('henry_modern', 'Henry Jones - Modern', 'Sáng tạo · Nổi bật', 'Mẫu CV màu sắc nổi bật, phù hợp ngành sáng tạo.', 'https://picsum.photos/id/23/400/280', 1);
ALTER TABLE comments ADD COLUMN rating INT DEFAULT NULL CHECK (rating >= 1 AND rating <= 5);

-- Dump completed on 2026-07-06 23:43:18
