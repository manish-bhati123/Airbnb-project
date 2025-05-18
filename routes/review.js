    const express = require("express");
    const review = express.Router({mergeParams:true});
    const Review = require("../models/Review.js");
    const Listing = require("../models/Listing.js");
    const Wrapasync = require("../util/Wrapasync.js");
    const ExpressError = require("../util/ExpressError.js");
    const {valdateReview, isLoggedIn ,isReviewauthor} =require("../middleware.js")
 


 




    //reviews....................................
    //use post   

    review.post("/", isLoggedIn,valdateReview, async (req, res, next) => {
        try {
            let listing = await Listing.findById(req.params.id);
            let newReview = new Review(req.body.review);
            newReview.author=req.user._id;
            console.log(newReview)
            listing.reviews.push(newReview);

            await newReview.save();
            await listing.save();

          req.session.flash.success = ["New Review Created"];
            res.redirect(`/listings/${listing._id}`);


        } catch (err) {
            next(err)
        }

    })

    //reviews....................................
    //use Delete

    review.delete(
        "/:reviewId",
        isLoggedIn,
        isReviewauthor,
        Wrapasync(async (req, res) => {
            let { id, reviewId } = req.params;
            await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);
               req.session.flash.success = [" Review Delated"];
            res.redirect(`/listings/${id}`);
        })
    )


    module.exports = review;