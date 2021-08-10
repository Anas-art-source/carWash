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
    byUser: {
        type: mongoose.Types.ObjectId,
        // ref: "users"
    },
    date: {
        type: Date,
        default: Date.now
    }
})


const Reviews = mongoose.model("reviews", reviewSchema)

module.exports = Reviews;