const dotenv = require('dotenv');
dotenv.config({path: "./config.env"})


const googleUsers = require("../model/googleUserModel")
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync')
const sharp = require("sharp")
const multer = require('multer')
const jwt = require("jsonwebtoken");
const { Cookie } = require('express-session');


const signToken = async (id, model) => {
    console.log(id, model)
    const token = await jwt.sign({id : id, model: model}, process.env.JWTR_SECRET_KEY, { expiresIn: '1h'})
    return token
}

const jwtVerify = async (token) => {
    const decoded = jwt.verify(token, process.env.JWTR_SECRET_KEY);
    return decoded

}


const storage = multer.memoryStorage();

// FILTER FILTER TO DEFINE THE CRITERIA FOR ACCEPTING THE FILE
const fileFilter = (req, file, cb) => {

    // THIS WILL ONLY ACCEPT THE FILE THAT IS JPEG, JPG, PNG AND IS IMAGE
    const acceptedExtension = ['jpg', "jpeg", "png"]
    const fileExtension = file.mimetype.split('/')[1]
    const isImage = file.mimetype.split('/')[0]

    if (isImage === "image" && acceptedExtension.includes(fileExtension)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// DEFINING THE UPLOAD VARIABLE
// UPLOAD.SINGLE AND UPLOAD.ARRAY
const upload = multer({storage: storage, fileFilter: fileFilter});

exports.uploadOne = upload.single("photo")


exports.resizeAndSave = async (req, res, next) => {

    if (!req.file) return next()
    const imageName = `${req.body.email}.png`
    req.filename = imageName;

    await sharp(req.file.buffer)
    .resize({width: 640, height: 640, fit: "cover"})
    .toFormat('png')
    .toFile(`photo/user/${imageName}`).catch((err) => console.log(err))

    next()
}


 
exports.getGoogleUsers = catchAsync( async (req, res, next) => {

    const response = await googleUsers.find();

    if(!response || response.length === 0) return next(new AppError("No users found", 404))

    res.status(200).json({
        message: "successful",
        length: response.length,
        data: response
    })
})


exports.postUsers = catchAsync (async (req, res, next) => {

    // HAVE TO SEND GOOGLE PROFILE OBJ IN REQ.BODY
    const profile = {
        ...req.body,
        role: "user",
    }


    const response = await googleUsers.create(profile);


    if (!response) return next (new AppError("Failed to register user", 400));

    // ISSUING JWT TOKEN AND STORING IT AS COOKIE
    // IT WILL BE CHECKED AND VERIFIED IN PROTECTED AND RESTRICTED ROUTES

    const issueJWT = await signToken(response._id, "googleUser")

    res.status(200).cookie("jwt", issueJWT).json({
        message: "successful",
        jwt: issueJWT,
        data: response
    })
})

exports.getGoogleUserById = catchAsync(async (req, res, next) => {

    const response = await googleUsers.findById(req.params.id)

    if (!response) return next (new AppError("Failed to register user", 400));

    res.status(200).json({
        message: "successful",
        data: response
    })

})