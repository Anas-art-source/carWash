const AppError = require("./utils/AppError");
const express = require("express");
var cookieParser = require('cookie-parser')
const http = require("http");
const socketio = require("socket.io")
const app = express();



// CONTROLLERS
const VendorRouter = require('./router/vendorRouter');
const ReviewRouter = require('./router/reviewRouter');
const UserRouter = require("./router/userRouter")
const authController = require("./controller/authController")

// GOOGLE LOGIN IN DEPENDIENCIES



app.use(express.json())
app.use(cookieParser())


// CARWASH VENDOR ENDPOINT
app.use('/api/v1/vendor', VendorRouter)

// REVIEW ENDPOINT
app.use('/api/v1/reviews', ReviewRouter)






// MESSAGE ENDPOINT
// app.use('/api/v1/message', VendorRouter)


// USER AND AUTHENTICATION ENDPOINT
app.use('/api/v1/users', UserRouter)


// INITIATING SERVER
const server = http.createServer(app);


// SOCKET IO CONNECTION
const io = socketio(server, {
    cors: {
        origin: ["http;//localhost:3000"]
    }
});

// SOCKET IO
io.on("connection", socket => {
    console.log(`one socket is connected...`)
})


app.use("*", (req, res, next) => {

    next(new AppError("No page found",404))
})

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const errMessage = err.message || "something went wrong"


    res.status(statusCode).json({
        message: errMessage,
        statusCode: statusCode
    })

})

module.exports = server