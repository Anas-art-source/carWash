const express = require('express');
const chatController = require('../controller/chatController')

const chatRouter = express.Router();

chatRouter.route("/:senderId/:recieverId").get(chatController.getChatByClientsIds)

chatRouter.route("/").post(chatController.sendMessage)


module.exports = chatRouter;