const express = require("express");
const googleUserController = require('../controller/googleUsersController')

const googleRouter = express.Router();
googleRouter.route('/')
.get(googleUserController.getGoogleUsers)
// .post(googleUserController.uploadOne, googleUserController.resizeAndSave, googleUserController.postUsers)
.post(googleUserController.postUsers)

googleRouter.route('/:id').get(googleUserController.getGoogleUserById)

module.exports = googleRouter