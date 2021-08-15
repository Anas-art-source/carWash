const dotenv = require('dotenv');
dotenv.config({path: "./config.env"})


const AppError = require('../utils/AppError')
const catchAsync = require("../utils/catchAsync");
const Users = require('../model/userModel');
const jwt = require("jsonwebtoken");
const  sendEmail = require("../utils/sendEmail")
const googleUsers = require('../model/googleUserModel')

const signToken = async (id, model) => {
    const token = await jwt.sign({id : id, model: model}, process.env.JWTR_SECRET_KEY, { expiresIn: '1h'})
    return token
}

const jwtVerify = async (token) => {
    const decoded = jwt.verify(token, process.env.JWTR_SECRET_KEY);
    return decoded

}

exports.signup = catchAsync(async (req, res, next) => {


    // SANITIZING AND CREATING USER
    const profileObj = {
        ...req.body,
        photo: `${process.env.WEBURL}/photo/user/${req.filename}`,
        role: "user"
    }

    const response = await Users.create(profileObj)

    // SIGNING JWT 
    const loginToken = await signToken(response._id, "users")

    // SENDING RESPONSE WITH JWT IN COOKIES
    res.status(200).cookie("jwt", loginToken).json({
        message: "successful",
        data: response
    })

})


exports.login = catchAsync(async (req, res, next) => {

    // IMPORTANT LEARING: if we use users.find({...params})  this will return an array. Therefore, there will not be any instance method available like comparePassword
    // therefore it is better to use findOne as it will return the object with instance method avaialble

    const response = await Users.findOne({email: req.body.email}).select("+password"); 

    // const passwordCorrect = await response.comparePassword(req.body.password, response.password)

    // WE COULD MAKE THIS LOGIN LOOKS MORE READABLE
    // WILL LOOK AT THIS LATER
    if ( !(response && ( await response.comparePassword(req.body.password, response.password)
    )) ) {
         return next(new AppError("Invalid email or password", 400))
    }

    const signupToken = await signToken(response._id, "users")

    res.status(200)
    .cookie("jwt", signupToken)
    .json({
        message: "successful",
        data: response,
        jwt: signupToken
    })
})


exports.protectedRoute = catchAsync(async (req, res, next) => {
   
    console.log(req.cookies)
    if (!req.cookies?.jwt) return next(new AppError("Please login to continue", 400));

    const verifyJwt = await jwtVerify(req.cookies.jwt);
    console.log(verifyJwt, Date.now())

    if (verifyJwt.exp < (Date.now() / 1000)) return next(new AppError("session expired. Please log in again"));

    let user;
    
    if (verifyJwt.model === "users" ) {
     user = await Users.findOne({id: verifyJwt.id})
    }


    if (verifyJwt.model === "googleUser") {
        user = await googleUsers.findOne({_id: verifyJwt.id})
    }

    req.user = user

    next()


})

exports.restrictedTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError("Restricted Route", 400))

    next()
})
}

exports.forgetPassword = catchAsync (async (req, res, next) => {

    const response = await Users.findOne({email: req.body.email});

    if (!response) return next(new AppError("Invalid Email", 400))

    const resetToken = await response.createResetToken()

    const user = await Users.findByIdAndUpdate( response._id ,{passwordChangedAt: Date.now(), passwordResetToken: resetToken}, {runValidators: false}) 

    // const email = await sendEmail.sendEmail(resetToken)

   res.send({
       url: `http://localhost:1000/api/v1/users/resetPassword/${resetToken}`

   })

    
})



exports.resetPassword = catchAsync(async (req, res, next) => {

    if (!req.body.email || !req.body.password || !req.body.passwordConfirm) return next(new AppError("Please provide email, password, and confirm password", 400)) 

    const response = await Users.findOne({email: req.body.email});

    if (!response) return next(new AppError("Invalid Email", 400));
 
    // VALIDATING TOKEN AND ITS TIME LIMIT 
    if (!((response.passwordChangedAt + (1000 * 60 * 5) ) > Date.now()) || 
     response.passwordResetToken !== req.params.token)  return next(new AppError("Token Expired or Invalid reset token", 400))

    response.password = req.body.password;
    response.passwordConfirm = req.body.passwordConfirm;

    await response.save()

    res.send({
        response
    })
    
})