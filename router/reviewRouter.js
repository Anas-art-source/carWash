const express = require("express");
const ReviewController = require("../controller/reviewController")

const reviewRouter = express.Router({mergeParams: true})

reviewRouter.route("/")
.get(ReviewController.getAllReview)
.post(ReviewController.postReview)

reviewRouter.route("/:id")
.delete(ReviewController.deleteReviewById)
.patch(ReviewController.updateReviewById)


module.exports = reviewRouter