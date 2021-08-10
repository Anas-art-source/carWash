const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "vendor must have a name"]
    },
    services: [{
        title: {
            type: String,
            required: [true, "service must have a title"]
        },
        description: {
            type: String,
            minlength: 5,
            maxlength: 60,
            required: [true, "services must have a description text longer than 5 characters and shorter tha 30 character"]
        },
        price: {
            type: Number,
            min: 0,
            required: [true, 'service must have a price']
        }
    }],
    // Virtual Population of reviews
    date: {
        type: Date,
        default: Date.now,
    },
    experience: {
        type: Number,
        default: 1,
        required: [true, "Vendor must have enter years of experience"]
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ["Point"]
        },
        coordinates: [Number], // longitude , latitude
        city: String,
        address: String
    },
    photos: [String],
    teamPhotos: [String],
    contactNumber: String,
    averageRating: Number,
    ratingCount: Number,
    accepted: {
        type: Boolean,
        default: false
    }
}, {
    toObject: {
        virtuals: true
        },
    toJSON: {
        virtuals: true 
        }
})


VendorSchema.virtual("reviews", {
    ref: "reviews",
    localField: "_id",
    foreignField: "forVendor"
})

const Vendors = mongoose.model("vendors", VendorSchema);

module.exports = Vendors