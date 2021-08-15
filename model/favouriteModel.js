const mongoose = require('mongoose')

const FavSchema = new mongoose.Schema({
    byUsers: mongoose.Types.ObjectId,
    vendor: {
        name: String,
        photo: String, 
        location: String,
        id: mongoose.Types.ObjectId
    }
})


const Favourites = mongoose.model("favourites", FavSchema);

module.exports = Favourites