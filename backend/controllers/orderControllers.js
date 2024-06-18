import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js';
import Order from '../models/orders.js';
import Product from '../models/products.js';


// Create new Order  =>  /api/v1/orders/new
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



// Get current user orders  =>  /api/v1/me/orders
export const myorders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id});

    if(!orders){
        return next(new ErrorHandler(`There is not orders`));
    }

    res.status(200).json({
        'length_orders': orders.length,
        orders
    })

});


// Get current user order details  =>  /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler(`No Order found with this ID: ${req.params.id}`, 404));
    };

    res.status(200).json({
        success: true,
        order
    })


});


// Get all orders - ADMIN  =>  /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.find();


    res.status(200).json({
        'length_order' : order.length,
        order
    })


});


// Update Order - ADMIN  =>  /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler('No order found', 404))
    }

    if(order?.orderStatus === 'Delivered'){
        return next(new ErrorHandler('you have already delivered this order', 404))
    }

    // Update products stock
    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString());
        if(!product){
            return next(new ErrorHandler('No product found with this ID', 404));
        }
        product.stock = product.stock - item.quantity;
        await product.save({ validateBeforeSave: false });
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    order.save()

    res.status(200).json({
        success: true,
    });
});


// Delete order -ADMIN  =>  /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`No Order found with this ID ${req.params.id}`, 404));
      }

    await order.deleteOne()


    res.status(200).json({
        success: true,
    })


});



/**
* @swagger
* tags:
* name: Orders
* description: Gestion des commandes
*
* /api/v1/orders/new:
* post:
* summary: Créer une nouvelle commande
* tags: [Orders]
* requestBody:
* required: true
* content:
* application/json:
* schema:
* $ref: '#/components/schemas/NewOrder'
* responses:
* '201':
* description: Succès
* content:
* application/json:
* schema:
* $ref: '#/components/schemas/Order'
*
* /api/v1/me/orders:
* get:
* summary: Récupérer les commandes de l'utilisateur connecté
* tags: [Orders]
* responses:
* '200':
* description: Succès
* content:
* application/json:
* schema:
* type: object
* properties:
* length_orders:
* type: integer
* orders:
* type: array
* items:
* $ref: '#/components/schemas/Order'
*
* /api/v1/orders/{id}:
* get:
* summary: Récupérer les détails d'une commande
* tags: [Orders]
* parameters:
* - in: path
* name: id
* required: true
* schema:
* type: string
* responses:
* '200':
* description: Succès
* content:
* application/json:
* schema:
* $ref: '#/components/schemas/Order'
*
* /api/v1/admin/orders:
* get:
* summary: Récupérer toutes les commandes (admin)
* tags: [Orders]
* responses:
* '200':
* description: Succès
* content:
* application/json:
* schema:
* type: object
* properties:
* length_order:
* type: integer
* order:
* type: array
* items:
* $ref: '#/components/schemas/Order'
*
* /api/v1/admin/orders/{id}:
* put:
* summary: Mettre à jour une commande (admin)
* tags: [Orders]
* parameters:
* - in: path
* name: id
* required: true
* schema:
* type: string
* requestBody:
* required: true
* content:
* application/json:
* schema:
* $ref: '#/components/schemas/UpdateOrder'
* responses:
* '200':
* description: Succès
* content:
* application/json:
* schema:
* $ref: '#/components/schemas/SuccessMessage'
*
* /api/v1/admin/orders/{id}:
* delete:
* summary: Supprimer une commande (admin)
* tags: [Orders]
* parameters:
* - in: path
* name: id
* required: true
* schema:
* type: string
* responses:
* '200':
* description: Succès
* content:
* application/json:
* schema:
* $ref: '#/components/schemas/SuccessMessage'
*
* components:
* schemas:
* NewOrder:
* type: object
* properties:
* orderItems:
* type: array
* items:
* type: object
* shippingInfo:
* $ref: '#/components/schemas/ShippingInfo'
* paymentMethod:
* type: string
* paymentInfo:
* type: object
* itemsPrice:
* type: number
* taxAmount:
* type: number
* shippingAmount:
* type: number
* totalAmount:
* type: number
* orderStatus:
* type: string
* Order:
* type: object
* properties:
* id:
* type: string
* orderItems:
* type: array
* items:
* type: object
* shippingInfo:
* $ref: '#/components/schemas/ShippingInfo'
* paymentMethod:
* type: string
* paymentInfo:
* type: object
* itemsPrice:
* type: number
* taxAmount:
* type: number
* shippingAmount:
* type: number
* totalAmount:
* type: number
* orderStatus:
* type: string
* user:
* $ref: '#/components/schemas/User'
* ShippingInfo:
* type: object
* properties:
* address:
* type: string
* city:
* type: string
* postalCode:
* type: string
* country:
* type: string
* User:
* type: object
* properties:
* name:
* type: string
* email:
* type: string
* UpdateOrder:
* type: object
* properties:
* status:
* type: string
* SuccessMessage:
* type: object
* properties:
* success:
* type: boolean
*/
