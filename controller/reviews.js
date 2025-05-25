    const Review = require("../models/Review.js");
    const Listing = require("../models/Listing.js");


    module.exports.reviewRoute = async (req, res, next) => {
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
    
        }


        module.exports.destroyRoute =async (req, res) => {
                    let { id, reviewId } = req.params;
                    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
                    await Review.findByIdAndDelete(reviewId);
                       req.session.flash.success = [" Review Delated"];
                    res.redirect(`/listings/${id}`);
                }