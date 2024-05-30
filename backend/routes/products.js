import express from 'express';
import { getProducts } from '../controllers/productControllers.js';
import { newProduct } from '../controllers/productControllers.js';
import { getProductDetails } from '../controllers/productControllers.js';
import { updateProduct } from '../controllers/productControllers.js';
import { deleteProduct } from '../controllers/productControllers.js';


const router = express.Router();

router.route('/products').get(getProducts);
router.route('/admin/products').post(newProduct);
router.route('/product/:id').get(getProductDetails);
router.route('/product/:id').put(updateProduct);
router.route('/product/:id').delete(deleteProduct);

export default router;

