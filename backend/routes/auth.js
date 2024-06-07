import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword,
    getUserProfile,
    updatePassword,
    updateUserProfile,  } from '../controllers/authControllers.js';




const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateUserProfile);

export default router;

