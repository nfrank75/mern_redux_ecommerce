import bcrypt from "bcryptjs";
import mongoose from "mongoose";


const userSchema =  new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please enter your name"],
            maxLength: [50, "Your name can not exceed 50 characters"],
        },
        email: {
            type: String,
            require: [true, "Please enter your email"],
            unique: true,
        },
        password: {
            type: String,
            require: [true, "Please enter your password"],
            maxLength: [6, "Your password must be longer than 6 characters"],
            select: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },
        resetPasswordToken: String,
        resetPasswordExpire: String,
    
    }, 
    { timestamps: true }
);

// Encrypting the password before save it on the database
userSchema.pre("save", async function (next) {

    if(!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);

});

export default mongoose.model("User", userSchema);