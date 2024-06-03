import mongoose from "mongoose";


const productSchema =  new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter product name"],
        maxLength: [200, "Product name can not exceed 200 characters"],
    },
    price: {
        type: Number,
        require: [true, "Please enter product price"],
        maxLength: [5, "Product price can not exceed 5 digits"],
        min: [1, "Price cannot be negative"],
        max: [100000, "Price cannot exceed 1 million"]
    },
    description: {
        type: String,
        require: [true, "Please enter product description"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id : {
                type: String,
                require: true,
            },
            url: {
                type: String,
                require: true,
            },
        },
    ],
    category: {
        type: String,
        require: [true, "Please enter product category"],
        enum: {
            values: [
                "Laptops",
                "Headphones",
                "Electronics",
                "Cameras",
                "Phones",
                "Books",
                "Outdoor",
                "Food",
                "Accessories",
                "Home",
            ],
            message: "Please select correct category",
        },
    },
    seller: {
        type: String,
        require: [true, "Please enter product seller"],
    },
    stock: {
        type: Number,
        require: [true, "Please enter product stock"],

    },
    numOfReviews: {
        type: Number,
        default: 0,

    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                require: true,
            },
            rating: {
                type: Number,
                require: true,
            },
            comment: {
                type: String,
                require: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    }
    
}, { timestamps: true }
);

export default mongoose.model("Product", productSchema);