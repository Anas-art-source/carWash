const Chats = require("../model/chatModel");
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')


exports.getChatByClientsIds = catchAsync (async (req, res, next) => {

    const response = await Chats.find({
        $and: [
            { $or: [ {sender: req.params.senderId  }, { sender: req.params.recieverId} ] },
            { $or: [ {reciever: req.params.senderId  }, { reciever: req.params.recieverId} ] }
        ]
    } ).populate({ path: "sender", select: "name photo _id"})
    .populate({ path: "reciever", select: "name photo _id"})

    console.log("here", response)
    res.status(200).json({
        message: "successful",
        data: response
    })

})


exports.sendMessage = catchAsync(async (req, res, next) => {

    const response = await Chats.create(req.body)

    if (!response) return next(new AppError("Cant send Message", 400))

    res.status(200).json({
        message: "successful",
        data: response
    })
})