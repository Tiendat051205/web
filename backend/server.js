// import authRoutes from './routes/authRoutes.js';
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// import cvRoutes from './routes/cvRoutes.js';
// import commentRoutes from './routes/commentRoutes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api', authRoutes);
// app.use('/api', authRoutes);
// app.use('/api', cvRoutes);
// app.use('/api', commentRoutes);


// app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { commentController } from './controllers/commentController.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { trackViews } from './middleware/view.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(trackViews);

const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir, { index: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'home.html'));
});

app.get('/index.html', (req, res) => {
  res.redirect('/home.html');
});
app.get('/api/public/template/:templateId/comments', commentController.getCommentsByTemplate);

app.use('/api', authRoutes);
app.use('/api', templateRoutes);
app.use('/api', cvRoutes);
app.use('/api', commentRoutes);
app.use('/api', contactRoutes);
app.use('/api', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});