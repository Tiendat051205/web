// import express from 'express'
// import {authControllers} from '../controllers/authControllers.js'
// const router = express.Router() 
// router.post('/register', authControllers.register)
// router.post('/login', authControllers.login)

// export default router

import express from 'express';
import { authController } from '../controllers/authControllers.js'; // Bỏ 's' ở tên object

const router = express.Router(); 
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;