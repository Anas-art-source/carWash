const express = require("express");
const favController = require('../controller/favController')
const favRouter = express.Router();

favRouter.route('/:userid')
.get(favController.getFavouritesByUserId)
.post(favController.saveFav)
.delete(favController.deleteAllFavouritesByUserId)

favRouter.route('/:userid/:id').delete(favController.deleteFavourite)

module.exports = favRouter