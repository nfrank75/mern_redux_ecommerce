import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { authorizeRoles, deleteUser, updateUser, registerUser, loginUser, logoutUser, forgotPassword, resetPassword,
    getUserProfile, updatePassword, updateUserProfile, getAllUsers, getUserDetails,  } from '../controllers/authControllers.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateUserProfile);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route('/admin/users/:id').get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);
router.route('/admin/users/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route('/admin/users/:id').put(isAuthenticatedUser, authorizeRoles("admin"), updateUser);

export default router;

