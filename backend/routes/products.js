import express from 'express';
import { newProduct } from '../controllers/productControllers.js';
import { getProductDetails } from '../controllers/productControllers.js';
import { updateProduct } from '../controllers/productControllers.js';
import { deleteProduct } from '../controllers/productControllers.js';
import { getProductKeyword } from '../controllers/productControllers.js';



const router = express.Router();


router.route('/admin/products').post(newProduct);
router.route('/product/:id').get(getProductDetails);
router.route('/product/:id').put(updateProduct);
router.route('/product/:id').delete(deleteProduct);
router.route('/products').get(getProductKeyword);

export default router;

