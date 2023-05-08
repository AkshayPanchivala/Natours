const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { use } = require('passport');
const AppError = require('../utills/appError');
const sendEmail = require('../utills/email');
const User = require('./../models/usermodel');
const catchAsync = require('./../utills/catchasync');
const { fail } = require('assert');


const createsendtoken=(user,statuscode,res)=>{
    const token=signtoken(user._id);
    
    res.status(statuscode).json({
        status:'success',
        token,
        data:{
            user
        }
    });
}



const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        passwordchangeat: req.body.passwordchangeat,
    });
    const token = jwt.sign({ id: newUser._id }, 'secret',
        { expiresIn: process.env.expires_in });
        res.cookie('jwt',token,{
            expires:new date(Date.now()+process.env.cookie_expires_in*24*60*60*1000),
           
            httpOnly:true
            
        }),
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })

});



const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('password or email does not exist', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    console.log(user.password);


    const verifypassword = await bcrypt.compare(req.body.password, user.password);
    console.log(verifypassword);
    console.log(process.argv);
    if (verifypassword) {
        const token = jwt.sign({ id: user._id }, 'secret',
            { expiresIn: process.env.expires_in });
        res.status(200).json({
            status: 'success',
            token: token
        })
    }



});


const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

    }
    console.log(token);
    if (!token) {
        return next(new AppError('you are not logged in', 401));

    }
    const decoded = jwt.verify(token, 'secret');
    console.log(decoded);
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser);

    if (!currentUser) {
        return next(new AppError('The token this user not exist', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('user recently change password', 401));
    };
    req.user = currentUser;
    next()
});

const restrictto = (...roles) => {
    // console.log(...roles);
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('you do not have permission', 403));
        }
        next();
    }

}

const forgotpassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with email address.', 404))
    }

    const resetToken = user.createpaswordresettoken();
    await user.save({ validateBeforeSave: false });


    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
    const message = `Forgot your password? submit a patch request with your new password and password confirm to: ${resetUrl}  . \n if you didn't forgot your password,please ignore this email!`;
    try {
        await sendEmail({
            email: user.email,
            subject: "reset token",
            message

        });
        res.status(200).json({
            email: user.email,
            subject: 'Your Password reset token ',
            message
        });
    } catch (err) {
        user.passwordResetToken = undefined;

    }


}


const resetpassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        return next(new AppError('Token is invalid or has error'));
    }

    user.password = req.body.password
    user.confirmpassword = req.body.confirmpassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordchangeat = new Date();
    await user.save();

    res.status(200).json({
        status: 'success'
    })
});

const updatePassword =catchAsync(async (req,res,next)=>{
    
const user=await User.findOne({email: req.body.email});
console.log(`${user.password}`);
const password_varification=await bcrypt.compare(req.body.password,user.password);
console.log('ak');
if(!user || !password_varification){
    res.status(404).json({status:'fail',message:'User not'});

}
const newpassword=await req.body.newpassword;
user.password=newpassword;
await user.save({ validateBeforeSave: false });
 res.status(200).json({status:'success',message:"user save"});
})



module.exports = { signup, login, protect, restrictto, forgotpassword, resetpassword,updatePassword};