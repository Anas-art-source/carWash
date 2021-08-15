const Users = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");
const sharp = require("sharp")

// LIBRARY FOR PROCESSING MULTIPART FORM DATA 
// OR IN OTHER WORD FILES 
const multer = require('multer');

// STORAGE FOR MULTER
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
const upload = multer({storage: storage, fileFilter: fileFilter})

exports.uploadOne = upload.single('photo')

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

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const response = await Users.find();

    if (!response || response.length === 0 ) return next(new AppError("no user found", 404))

    res.status(200).json({
        message: "successful",
        length: response.length,
        data: response
    })
}) 

exports.getUserById = catchAsync(async (req, res, next) => {

    const response = await Users.findById(req.params.id);
    if (!response) return next(new AppError("no user found", 404))

    res.status(200).json({
        message: "successful",
        data: response
    })
}) 

