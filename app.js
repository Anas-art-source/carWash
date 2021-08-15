const AppError = require("./utils/AppError");
const express = require("express");
var cookieParser = require('cookie-parser')
const http = require("http");
const multer = require('multer');
const upload = multer();
const socketio = require("socket.io")
const app = express();




// CONTROLLERS
const VendorRouter = require('./router/vendorRouter');
const ReviewRouter = require('./router/reviewRouter');
const UserRouter = require("./router/userRouter")
const authController = require("./controller/authController");
const googleUsersRouter = require('./router/googleUsersRouter')
const favRouter = require('./router/favRouter');
const chatRouter = require('./router/chatRouter')
const cors = require("cors");


app.use(express.json())
app.use(cookieParser())


app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: "GET, PUT, PATCH, POST, DELETE"
}));

// CARWASH VENDOR ENDPOINT
app.use('/api/v1/vendor', VendorRouter)

// REVIEW ENDPOINT
app.use('/api/v1/reviews', ReviewRouter)




// MESSAGE ENDPOINT
app.use('/api/v1/message', chatRouter)


// USER AND AUTHENTICATION ENDPOINT
app.use('/api/v1/users', UserRouter)

// GOOGLE USER
app.use("/api/v1/google", googleUsersRouter)


// FAVOURITE ROUTE 
app.use('/api/v1/fav', favRouter)


// PHOTO ROUTER AND CONTROLLER

app.use('/photo/:folderName/:picturename', (req, res, next) => {
    
    res.sendFile(`photo/${req.params.folderName}/${req.params.picturename}`, { root: __dirname })

})


// INITIATING SERVER
const server = http.createServer(app);


// SOCKET IO CONNECTION
const io = socketio(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        
        credentials: true,
        allowEIO3: true

    },
    transport: ['websocket']
});

// SOCKET IO
io.on("connection", socket => {
    console.log(`one socket is connected...`)

    socket.on("send_message", messageObj => {
        console.log("here in socket")
        console.log(messageObj)
    })
})


app.use("*", (req, res, next) => {

    next(new AppError("No page found",404))
})

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const errMessage = err.message || "something went wrong"


    console.log(err)

    res.status(statusCode).json({
        message: errMessage,
        statusCode: statusCode
    })

})

module.exports = server