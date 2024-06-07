import express from 'express';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import { 
    allOrders,
    getOrderDetails,
    newOrder } from '../controllers/orderControllers.js';


const router = express.Router();

router.route('/orders/new').post(isAuthenticatedUser, newOrder),

router.route('/orders').get(isAuthenticatedUser, allOrders),

router.route('/orders/:id').get(isAuthenticatedUser, getOrderDetails)


export default router;