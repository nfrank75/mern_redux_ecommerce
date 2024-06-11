import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js';
import Product from '../models/products.js';

export const addReview = catchAsyncErrors(async (req, res, next) => {
    const review = req.body;

    const add_review = await Product.create(review);

    res.status(201).json({
        add_review
    })


});
