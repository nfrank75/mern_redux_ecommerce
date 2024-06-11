import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { authorizeRoles } from '../controllers/authControllers.js';
import { addReview } from '../controllers/reviewControllers.js';


const router = express.Router();

router.route('/review').post(isAuthenticatedUser, addReview)

export default router;