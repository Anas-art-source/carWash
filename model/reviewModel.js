const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    review: String,
    rating: {
        type: Number,
        min: 0,
        max: 10,
        required: [true, "rating is required"]
    },
    forVendor: {
        type: mongoose.Types.ObjectId,
        ref: "vendors"

    },
    byGoogleUser: {
        type: mongoose.Types.ObjectId,
        ref: "googleUser"       // ref: "users"
    },
    byOwnUser: {
        type: mongoose.Types.ObjectId,
        ref: "users"       // ref: "users"
    },

    date: {
        type: Date,
        default: Date.now
    }
})


const Reviews = mongoose.model("reviews", reviewSchema)

module.exports = Reviews;