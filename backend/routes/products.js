import express from 'express';
import { createProduct } from '../controllers/productControllers.js';
import { updateProduct } from '../controllers/productControllers.js';
import { deleteProduct } from '../controllers/productControllers.js';
import { getProducts } from '../controllers/productControllers.js';
import { getProductDetails } from '../controllers/productControllers.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { authorizeRoles } from '../controllers/authControllers.js';

const router = express.Router();


router.route('/admin/products').post(isAuthenticatedUser,  authorizeRoles("admin"), createProduct);
router.route('/admin/products/:id').put(isAuthenticatedUser,  authorizeRoles("admin"), updateProduct);
router.route('/admin/products/:id').delete(isAuthenticatedUser,  authorizeRoles("admin"), deleteProduct);


router.route('/products').get(getProducts);
router.route('/products/:id').get(getProductDetails);

export default router;

