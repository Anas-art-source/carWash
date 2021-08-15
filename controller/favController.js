 const Favourites = require('../model/favouriteModel');
 const AppError = require("../utils/AppError");
 const catchAsync = require('../utils/catchAsync');


 exports.getFavouritesByUserId = catchAsync(async (req, res, next) => {

    const response = await Favourites.find({byUsers: req.params.userid})

    if (!response || response.length === 0) next(new AppError("no favouites found", 404))

    res.status(200).json({
        message: "successful",
        data: response
    })
 })

 
 exports.deleteAllFavouritesByUserId = catchAsync(async (req, res, next) => {

    const response = await Favourites.deleteMany({byUsers: req.params.userid})

    if (!response || response.length === 0 || response.deletedCount === 0) return next(new AppError("no favouites found", 404))

    res.status(200).json({
        message: "successful",
        data: response
    })
 })

 exports.saveFav = catchAsync(async (req, res, next) => {

    const response = await Favourites.create(req.body);

    if (!response) next(new AppError("failed to save as favourites", 400));

    res.status(200).json({
        message: "successful",
        data: PaymentResponse
    })

}) 


 exports.deleteFavourite = catchAsync( async (req, res, next) => {

    const response = await Favourites.findOneAndRemove({"vendor.id": req.params.id, byUsers: req.params.userid})

    if (!response) next(new AppError("No Favourites with this ID found", 404))

    res.status(200).json({
        message: 'successful',
        data: response
    })


 })