    const express = require("express");
    const review = express.Router({mergeParams:true});
    const Review = require("../models/Review.js");
    const Listing = require("../models/Listing.js");
    const Wrapasync = require("../util/Wrapasync.js");
    const ExpressError = require("../util/ExpressError.js");
    const {valdateReview, isLoggedIn ,isReviewauthor} =require("../middleware.js")
    const reviewconstroller = require("../controller/reviews.js");
 


 




    //reviews....................................
    //use post   

    review.post("/", isLoggedIn,valdateReview,reviewconstroller.reviewRoute)

    //reviews....................................
    //use Delete

    review.delete( "/:reviewId",isLoggedIn,isReviewauthor, Wrapasync(reviewconstroller.destroyRoute ))


    module.exports = review;