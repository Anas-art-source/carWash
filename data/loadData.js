const dotenv = require('dotenv')
dotenv.config({ path: "./config.env"})
const fs = require("fs");
const VendorModel = require('../model/vendorModel');
const mongoose = require("mongoose")

const data = JSON.parse(fs.readFileSync("./data/vendor.json", 'utf-8'))

const DB = process.env.DATABASE_URL.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)

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


async function loadData () {
    try {
       await VendorModel.create(data)
        console.log("Data Loaded")

    } catch(err) {
        console.log(err)
    }

    process.exit()
}

async function deleteData () {
    try {
       await VendorModel.deleteMany()
        console.log("Data Deleted")

    } catch(err) {
        console.log(err)
    }
    process.exit()

}


if (process.argv[2] === "--load") {
    loadData()
}

if (process.argv[2]  === "--delete") {
    deleteData()
}



