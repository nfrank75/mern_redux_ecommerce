import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';


// register user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    try{
        const {name, email, password} = req.body;
        
        const user = await User.create({
            name, 
            email, 
            password
        });

        const token = user.getJwtToken();

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