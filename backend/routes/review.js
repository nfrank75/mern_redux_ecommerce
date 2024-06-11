import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { authorizeRoles } from '../controllers/authControllers.js';

import {  createProductReview, deleteReview, getProductReviews } from '../controllers/reviewControllers.js';


const router = express.Router();

router.route('/reviews').put(isAuthenticatedUser, createProductReview),
router.route('/reviews').get(isAuthenticatedUser, getProductReviews),

router.route('/admin/reviews').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteReview)

export default router;