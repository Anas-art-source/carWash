const Reviews = require("../model/reviewModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError')

exports.getAllReview = catchAsync( async (req, res, next) => {

    const response = await Reviews.find().populate("forVendor")

    if (!response || response.length === 0) return next(new AppError("no review founds", 404))

    res.status(200).json({
        message: "succesfull",
        data: response
    })
})

exports.postReview = catchAsync (async (req, res, next) => {

    const response = await Reviews.create(req.body);

    if (!response || response.length === 0) return next(new AppError("no review founds", 404))

    res.status(200).json({
        message: "succesfull",
        data: response
    })
})


exports.getReviewById = catchAsync (async (req, res, next) => {

    const response = await Reviews.find({_id: req.params.id})

    if (!response || response.length === 0) return next(new AppError("no review founds", 404))

    res.status(200).json({
        message: "succesfull",
        data: response
    })
})

exports.deleteReviewById = catchAsync (async (req, res, next) => {

    const response = await Reviews.deleteOne({_id: req.params.id})

    if (!response || response.length === 0) return next(new AppError("no review founds", 404))

    res.status(200).json({
        message: "succesfull",
        data: response
    })

})


exports.updateReviewById = catchAsync (async (req, res, next) => {

    const response = await Reviews.findByIdAndUpdate(req.params.id, req.body)

    if (!response || response.length === 0 ) return next(new AppError('No reviews found', 404))

    // Cannot set headers after they are sent to the client. Will fix this error later
    res.status(200).json({
        message: "successfully updated review",
        data: response
    }) 
})