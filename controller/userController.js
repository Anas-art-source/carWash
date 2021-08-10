const Users = require('../model/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError")

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

