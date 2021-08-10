const dotenv = require('dotenv');
dotenv.config({ path: "./config.env"});
const server = require('./app')
const mongoose = require('mongoose')

const DB = process.env.DATABASE_URL.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(res => {
    console.log('CONNECTED TO CARWASH DATABASE')
}).catch(err => {
    console.log(`Database connection failed. ${err}`)
})

const PORT = process.env.PORT || 1000;

server.listen(PORT, () => console.log(`listening to server ${PORT}`))

