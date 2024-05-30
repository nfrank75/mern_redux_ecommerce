import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/products.js'  
import ErrorHandler from '../utils/errorHandler.js';


export const newProduct = catchAsyncErrors (async (req, res) => {
    const {name, price, description, category, seller, stock} = req.body;
    console.log(name, price, description, category, seller, stock)
    if(!name || !price || !description || !category || !seller || !stock){
        res.status(400).json({
            message: 'fill product name, price, description, category, seller, stock'
        });
    }
    // const product0 = await Product.find(req.body);
    // if(product0){
    //     res.status(404).json({
    //         message: 'There is another product in the system with the same caracteristics'
    //     });
    // }

    const product = await Product.create(req.body);

    res.status(201).json({
        new_product: product,
        status: 201,
        message: 'product create successfully'
    })
});


export const getProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find();

    if(!products) {
        return next(new ErrorHandler('products not found', 422));
    }

    res.status(200).json({
        list_of_product: products,
        message: 'Get all the product',
        length_of_product: products.length,
        status: 200
    });
});

// Get single product details => /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const productId = await Product.findById(req?.params?.id);

    if(!productId) {
        return next(new ErrorHandler('product not found', 422));
    }

    res.status(200).json({
        productId,
        message: 'product',
        status: 200
    });
});


// Update product details => /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if(!product) {
        return next(new ErrorHandler('product not found', 422));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new: true})
    res.status(200).json({
        product,
        message: 'product update successfully',
        status: 200
    });
});


// delete product => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if(!product) {
        return next(new ErrorHandler('product not found', 422));
    }

    await product.deleteOne();

    res.status(200).json({
        message: 'product deleted successfully',
        status: 200
    });
});