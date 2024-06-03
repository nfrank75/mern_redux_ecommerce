import express from 'express';
import { newProduct } from '../controllers/productControllers.js';
import { getProductDetails } from '../controllers/productControllers.js';
import { updateProduct } from '../controllers/productControllers.js';
import { deleteProduct } from '../controllers/productControllers.js';
import { getProductKeyword } from '../controllers/productControllers.js';
import { getProducts } from '../controllers/productControllers.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { authorizeRoles } from '../controllers/authControllers.js';



const router = express.Router();


router.route('/admin/products').post(isAuthenticatedUser,  authorizeRoles("admin"), newProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser,  authorizeRoles("admin"), updateProduct);
router.route('/admin/product/:id').delete(isAuthenticatedUser,  authorizeRoles("admin"), deleteProduct);

router.route('/product/:id').get(isAuthenticatedUser, getProductDetails);
router.route('/products').get(isAuthenticatedUser, getProductKeyword);
router.route('/products').get(isAuthenticatedUser, getProducts);

export default router;

