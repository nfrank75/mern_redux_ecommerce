import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import sendEmail from '../utils/sendEmail.js';
import {getResetPasswordTemplate} from '../utils/emailTemplates.js';
import crypto from 'crypto';


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
    catch (error) {
        res.status(400).json({
            error
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

// Reset password   =>  /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash the URL Token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Password reset token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Passwords does not match", 400));
    }
  
    // Set the new password
    user.password = req.body.password;
  
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

// Get Current User profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);

    
    res.status(200).json({
        user
    });
})


// Update password => /api/v1/update/password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Old password is incorrect', 400))
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true,
    });

})


// Update User profile => /api/v1/update/user/profile
export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
      };
    const user = await User.findByIdAndUpdate(req?.user?._id, newUserData, { new: true });

    res.status(200).json({
        user,
    });

})

// Get All User ADMIN => /api/v1/admin/users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    if(!users){
        return next(new ErrorHandler(`Users doest not exist`));
    }

    res.status(200).json({
        'length_users': users.length,
        users,
        
    });

})


// Get User Details ADMIN => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
    }

    res.status(200).json({
        user,
    });
})

// Update User Details - ADMIN => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
    });

    res.status(200).json({
        user,
    });

})

// Delete User - ADMIN => /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
    }

    // TODO - Remove user avatar from cloud

    await user.deleteOne();

    res.status(200).json({
        message: `user deleted successfully : ${req.params.id}`,
    });
})

