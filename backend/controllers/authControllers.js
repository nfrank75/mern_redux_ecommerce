import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';


// register user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    try{
        const {name, email, password} = req.body;
        
        const user = await User.create({
            name, 
            email, 
            password
        });

        sendToken(user, 201, res); //call the token from cookie

        res.status(201).json({
            success: true,
            token,
            length_token : token.length
        });

    }
    catch  (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
    
});


// login user
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return next(new ErrorHandler("Please enter email and password", 400));
        }
        
        //Find user in the database
        const user = await User.findOne({email}).select("+password");

        if (!user){
            return next(new ErrorHandler("Invalid email or password", 401));
        }
        
        //check if the password is correct
        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid password", 401));
        }
        
        sendToken(user, 200, res);

        res.status(200).json({
            success: true,
            token,
            length_token : token.length
        });

    }
    catch  (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
    
});