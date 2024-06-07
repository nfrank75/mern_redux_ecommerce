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

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler(`Order not found with: ${req.params.id}`));
    };

    res.status(200).json({
        'length_order' : order.length,
        order
    })


});

export const allOrders = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.find();


    res.status(200).json({
        'length_order' : order.length,
        order
    })


});


export const updateOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.find();


    res.status(200).json({
        'length_order' : order.length,
        order
    })


});
