const Vendors = require('../model/vendorModel.js')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

const multer = require('multer');
const sharp = require('sharp');
const slugify = require('slugify')


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    // THIS WILL ONLY ACCEPT THE FILE THAT IS JPEG, JPG, PNG AND IS IMAGE
    const acceptedExtension = ['jpg', "jpeg", "png"]
    const fileExtension = file.mimetype.split('/')[1]
    const isImage = file.mimetype.split('/')[0]

    if (isImage === "image" && acceptedExtension.includes(fileExtension)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


const upload = multer({storage: storage, fileFilter: fileFilter});


exports.uploadBothTeamAndVendorPhotos = upload.fields([
    { name: "photos", maxCount: 6 },
    { name: 'teamPhotos', maxCount: 3 }
])


exports.resizeAndSaveVendorPhotos = (req, res, next) => {

    if (!req.files) return next(new AppError("Please upload photos of team members and business", 400))

    const {teamPhotos, photos} = req.files;

    const teamPhotoName = teamPhotos.map( (photo,index) => `team-${slugify(req.body.name, "-")}-${req.body.owner}-${index}.png`);

    const  photoName = photos.map((photo, index) => `business-${slugify(req.body.name, "-")}-${req.body.owner}-${index}.png`);

    teamPhotos.forEach( async (file, index) => {
        await sharp(file.buffer)
        .resize(540, 540)
        .toFormat('png')
        .toFile(`photo/team/${teamPhotoName[index]}`)
    });

    photos.forEach( async (file, index) => {
        await sharp(file.buffer)
        .resize(540, 540)
        .toFormat('png')
        .toFile(`photo/vendor/${photoName[index]}`)
    });


    req.filenames = {
        photos: photoName,
        teamPhotos: teamPhotoName
    }

    next()

}

exports.getAllAcceptedVendor = catchAsync(async (req, res, next) => {

    const response = await Vendors.find({accepted: true}).populate("reviews");

    if (!response || response.length === 0) return next(new AppError("No Vendor Found", 404));

    res.status(200).json({
        message: "successful",
        length: response.length,
        data: response
    })

})

exports.getAcceptedVendorById = catchAsync(async (req, res, next) => {


    // IN ORDER TO FILTER OUT ALL THE REQUEST THAT IS NOT ACCEPTED WE HAVE TO INSERT ACCEPTED=TRUE 
    // WE ALSO HAVE TO ENSURE THAT REQUEST FOR REGISTRATION BY VENDOR SHOULD BE SANITIZE. ACCEPT SHOULD ALWAY BE BE SET TO FALSE
    const response = await Vendors.find({_id: req.params.id, accepted: true});

    if (!response || response.length === 0) return next(new AppError("No Vendor Found", 404));

    res.status(200).json({
        message: "successful",
        data: response
    })

})


exports.registerVendor = catchAsync(async (req, res, next) => {

    //CHECK FOR EMPTY DATA SHOULD BE DONE HERE

    // GIVING NAME TO PHOTOS
    const photos = req.filenames.photos.map(name => `${process.env.WEBURL}/photo/vendor/${name}`)
    const teamPhotos = req.filenames.teamPhotos.map(name => `${process.env.WEBURL}/photo/team/${name}`)

    // SANITIZING RECIEVED DATA

    const vendorObj = {
        ...req.body,
        location: JSON.parse(req.body.location),
        services: JSON.parse(req.body.services),
        photos: photos,
        teamPhotos: teamPhotos,
        accepted: false
    }

    const response = await Vendors.create(vendorObj)

    console.log(response, "RESPONSE")
    if (!response || response.length === 0) return next(new AppError(`Error`, 400))


    res.status(200).json({
        message: "Successfully submitted",
        data: response
    })

})

exports.getAllNotAcceptedVendor = catchAsync(async (req, res, next) => {

    const response = await Vendors.find({accepted: false})

    if (!response || response.length === 0 ) return next(new AppError("no vendor found", 404));

    res.status(200).json({
        status: "successful",
        length: response.length,
        data: response
    })
})

exports.getNotAcceptedVendorById = catchAsync(async (req, res, next) => {

    const response = await Vendors.find({_id: req.params.id, accepted: false});

    if (!response || response.length === 0) return next(new AppError("No Vendor Found", 404));

    res.status(200).json({
        message: "successful",
        data: response
    })
    
})

exports.deleteVendorById = catchAsync(async (req, res, next) => {

    const response = await Vendors.deleteOne({_id: req.params.id})

    if (!response || response.length === 0) return next(new AppError("No vendor found to delete", 404))

    res.status(204).json({
        message: "successfully deleted",
        data: response
    })
})

exports.acceptVendorRequest = catchAsync(async (req, res, next) => {

    const response = await Vendors.findByIdAndUpdate(req.params.id, { accepted: true})
    console.log(response, "RESPONSE")

    if (!response || response.length === 0) return next (new AppError("No Vendor Found to Accept"));

    res.status(200).json({
        message: "Accepted successfully",
        data: response
    })


})

exports.updateVendor = catchAsync(async (req, res, next) => {

    const updateObj = {
        ...req.body,
        accepted: false
    }
    const response = await Vendors.findByIdAndUpdate(req.params.id, updateObj)

    if (!response || response.length == 0) return (new AppError("No Vendor found to update", 404));

    res.status(200).json({
        message: "vendor updated",
        data: response
    })
})


exports.inactiveVendor = catchAsync(async (req, res, next) => {

    const response = await Vendors.findByIdAndUpdate(req.params.id, { accepted: false});

    if (!response || response.length === 0) return next (new AppError("No vendor found to inactivate", 404))

    res.status(200).json({
        message: "vendor is successfully inactived",
        data: response
    })
})