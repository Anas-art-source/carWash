const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
    senderType: String,
    recieverType: String,
    sender: {
        type: mongoose.Types.ObjectId,
        ref:  function () {
            return this.senderType
        }
    },
    reciever: {
        type: mongoose.Types.ObjectId,
        ref:  function () {
            return this.recieverType
        }
    },
    message: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
})


const Chats = mongoose.model("chats", chatSchema);

module.exports = Chats