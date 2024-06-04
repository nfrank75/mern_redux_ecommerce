import express from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword,  } from '../controllers/authControllers.js';




const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

router.route('/password/forgot').post(forgotPassword);

export default router;

