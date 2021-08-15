const express = require('express');
const userController = require("../controller/userController");
const authController = require('../controller/authController')

const userRouter = express.Router();


userRouter.route("/").get(userController.getAllUsers)
userRouter.route("/:id").get(userController.getUserById)

userRouter.route("/signup").post(userController.uploadOne, userController.resizeAndSave ,authController.signup)
userRouter.route("/login").post(authController.login)

userRouter.route("/forgetPassword").post(authController.forgetPassword)

userRouter.route("/resetPassword/:token").post(authController.resetPassword)


module.exports = userRouter