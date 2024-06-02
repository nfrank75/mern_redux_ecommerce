import express from 'express';
import { newProduct } from '../controllers/productControllers.js';
import { getProductDetails } from '../controllers/productControllers.js';
import { updateProduct } from '../controllers/productControllers.js';
import { deleteProduct } from '../controllers/productControllers.js';
import { getProductKeyword } from '../controllers/productControllers.js';
import { getProducts } from '../controllers/productControllers.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';



const router = express.Router();


router.route('/admin/products').post(isAuthenticatedUser, newProduct);
router.route('/product/:id').get(isAuthenticatedUser, getProductDetails);
router.route('/product/:id').put(isAuthenticatedUser, updateProduct);
router.route('/product/:id').delete(isAuthenticatedUser, deleteProduct);
router.route('/products').get(isAuthenticatedUser, getProductKeyword);
router.route('/products').get(isAuthenticatedUser, getProducts);

export default router;

