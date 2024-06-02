import express from 'express';
import { loginUser } from '../controllers/authControllers.js';
import { logoutUser, registerUser } from '../controllers/authControllers.js';




const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

export default router;

