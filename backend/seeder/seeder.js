import mongoose from "mongoose";
import products from  './data.js';
import Product from '../models/products.js';  

const seedProducts = async () => {

    try {
        await mongoose.connect('mongodb://localhost:27017/shopit_v2');

        await Product.deleteMany();
        console.log('product are deleted');

        await Product.insertMany(products);
        console.log('product are added');

    } catch (error) {
        console.log(error.message);
        process.exit();
    }

};

seedProducts();