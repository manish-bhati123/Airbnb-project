const Listing = require("./models/Listing");
const ExpressError = require("./util/ExpressError.js");
const { listingSchema, reviewSchema  } = require("./schema.js");
const Review = require("./models/Review.js");


module.exports.isLoggedIn = (req, res, next) => {
      if (!req.isAuthenticated()) {
            req.session.redirectUrl = req.originalUrl;
            req.session.flash.error = ["you must be logged in to create listing"];
            return res.redirect("/login")
      }
      next();
}
module.exports.saveredirectUrl = (req, res, next) => {
      if (req.session.redirectUrl) {
            res.locals.redirectUrl = req.session.redirectUrl;

      }
      next();

}




module.exports.isOwner = async (req, res, next) => {
      try {
            let { id } = req.params; // Changed from req.body to req.params since ID is usually in URL
            let listing = await Listing.findById(id);
                if (!listing) {
            req.session.flash.error = ["Listing not found"];
            return res.redirect("/listings");
        }
            if (!listing.owner.equals(res.locals.curruser._id)) {
                  req.session.flash.error = ["You are not the owner of this listing"];
                  return res.redirect(`/listings/${id}`);
            }
            req.listing =listing;
            next();
      } catch (err) {
            req.session.flash.error = ["Something went wrong"];
            return res.redirect("/listings");
      }
};

module.exports.valdateListing = (req, res, next) => {
      let { error } = listingSchema.validate(req.body);
      if (error) {
            let errMas = error.details.map((el) => el.message).join(",");
            throw new ExpressError(404, errMas)
      } else {
            next();
      }
};


module.exports.valdateReview = (req, res, next) => {
        let { error } = reviewSchema.validate(req.body);
        if (error) {
            let errMas = error.details.map((el) => el.message).join(",");
            throw new ExpressError(404, errMas)
        } else {
            next();
        }

    };


        module.exports.isReviewauthor = async (req, res, next) => {
      try {
            let { id,reviewId } = req.params; // Changed from req.body to req.params since ID is usually in URL
            let review = await Review.findById(reviewId);
            if (!review.author.equals(res.locals.curruser._id)) {
                  req.session.flash.error = ["You are not the author of this review"];
                  return res.redirect(`/listings/${id}`);
            }
            next();
      } catch (err) {
            req.session.flash.error = ["Something went wrong"];
            return res.redirect("/listings");
      }
        };