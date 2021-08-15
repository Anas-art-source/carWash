const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    photo: String,
    role: {
        type: String,
        default : "user",
        enum: ["user", "admin"]
    }
},  {
    toObject: {
        virtuals: true
        },
    toJSON: {
        virtuals: true 
        }
})


googleUserSchema.virtual("business", {
    ref: "vendors",
    localField: "_id",
    foreignField: "owner"
})



const googleUsers = mongoose.model("googleUser", googleUserSchema)

module.exports = googleUsers;