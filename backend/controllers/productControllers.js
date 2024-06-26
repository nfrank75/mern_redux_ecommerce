import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/products.js'  
import APIFilters from '../utils/apiFilters.js';
import ErrorHandler from '../utils/errorHandler.js';



// create new product endpoint => /api/v1/products/
export const createProduct = catchAsyncErrors (async (req, res) => {
    req.body.user = req.user._id;
    
    const {name, price, description, category, seller, stock} = req.body;
    
    if(!name || !price || !description || !category || !seller || !stock){
        res.status(400).json({
            message: 'fill product name, price, description, category, seller, stock'
        });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
        new_product: product,
        status: 201,
        message: 'product create successfully'
    })
});



// get all the products =>  /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
    
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query; // filter product
    let filteredProductsCount = products.length;

    // return next(new ErrorHandler('hello', 400)) // testing the toast action

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone()
    let pageProduct = products.length;

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        pageProduct,
        products
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
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
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
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
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