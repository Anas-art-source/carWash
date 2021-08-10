const dotenv = require("dotenv");
dotenv.config({ path: "./config.env"})

const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
const crypto = require("crypto")



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, "user name is required"]
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Invalid Email"],
        unique: true
    },
    password: {
        type: String,
        // required: [true, "password is required"],
        select: false
    },
    passwordConfirm: {
        type: String,
        // required: [true, "you must confirm the password"],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: "Password doesnot match"
        }
    },
    photo: String,
    passwordChangedAt: {
        type: Number,
        select: true
    },
    passwordResetToken: String,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    location: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        city: String
    },
    googleId: String,
    secret: String
}, {
    toObject: {
        virtuals: true
        },
    toJSON: {
        virtuals: true 
        }
})


// HASHING PASSWORD BEFORE SIGNUP
userSchema.pre("save", async function(next) {
    
    console.log(this.password)
    const encryptedPassword = await bcrypt.hash(this.password, 8)
    this.password = encryptedPassword;
    this.passwordConfirm = ""
    console.log(this.password)
    next()
})

// COMPARING PASSWORD ON LOGIN
userSchema.methods.comparePassword = async function (password, hashPassword) {

    console.log(password, hashPassword)
    const match = await bcrypt.compare(password, hashPassword);
    console.log(match)
    return match
}

userSchema.methods.createResetToken = async function () {

    const hash = await crypto.createHash('sha256', "reseting password like always brother")
    // updating data
    .update('How are you?')
    // Encoding to be used
    .digest('hex');
    
    return hash
}



const Users = mongoose.model("users", userSchema)



module.exports = Users