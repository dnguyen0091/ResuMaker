import express from "express";
import { registerUser, loginUser } from '../controllers/authController.js';
import checkExists from '../controllers/checkExists.js'

const router = express.Router();

// Post register and login from authController.js
router.post('/register', registerUser);
router.post('/login', loginUser);

// Post checkExists from checkExists.js
router.post('/checkExists', checkExists);

export default router;