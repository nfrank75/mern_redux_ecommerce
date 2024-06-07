import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js';
import { response } from 'express';
import Order from '../models/orders.js';

export const newOrder = catchAsyncErrors(async (req, res, next) => {
    
    const {
        orderItems,
        shippingInfo,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        orderStatus,
        } = req.body; 

    const order = await Order.create({
        orderItems,
        shippingInfo,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        orderStatus,
        user: req.user._id,
    });

    res.status(201).json({
        order,
    });
});

