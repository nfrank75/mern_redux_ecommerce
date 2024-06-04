import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import sendEmail from '../utils/sendEmail.js';
import {getResetPasswordTemplate} from '../utils/emailTemplates.js';


// Register user => /api/v1/register  
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


// Login user => /api/v1/login 
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

        if(!isPasswordMatched){getResetPasswordTemplate
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


// Logout user => /api/v1/logout 
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
        res.status(200).json({
            success: true,
            code: 200,
            message: "Logged Out successfully"
        });
});

// Authorize user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not allowed to access this resource !`, 403
                )
            )
        };
        next();
    }
};


// Forgot password      =>  /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    // find user
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }
    
    // Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // create reset password url 
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        
        await sendEmail({
            email: user.email,
            subject: "Nfrank's Ecomerce password recovery",
            message,
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new ErrorHandler(error?.message, 500));        
    }

});
   
