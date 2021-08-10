const express = require("express");
const VendorController = require('../controller/vendorController')
const authController = require("../controller/authController")
const ReviewRouter = require('../router/reviewRouter')

const vendorRouter = express.Router();

vendorRouter.use("/:id/reviews", ReviewRouter )

// ADMIN ROUTES
// NEED VALIDATION HERE
vendorRouter.route('/admin')
.get(authController.protectedRoute, authController.restrictedTo("admin"), VendorController.getAllNotAcceptedVendor)

vendorRouter.route("/admin/:id")
.get(VendorController.getNotAcceptedVendorById)
.delete(VendorController.deleteVendorById)
.patch(VendorController.acceptVendorRequest)

vendorRouter.route("/admin/inactive/:id")
.patch(VendorController.inactiveVendor)


vendorRouter.route('/')
.get(VendorController.getAllAcceptedVendor)
.post(VendorController.registerVendor)

vendorRouter.route('/:id')
.get(VendorController.getAcceptedVendorById)
.patch(VendorController.updateVendor)
.delete(VendorController.deleteVendorById) // WE NEED TO CHECK THAT DELETE REQUEST IS COMMING FROM RIGHT PERSON



module.exports = vendorRouter