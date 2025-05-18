const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing.js");
const Wrapasync = require("../util/Wrapasync.js");
const {isLoggedIn,isOwner,valdateListing} =require("../middleware.js")







//index route  ............................
router.get("/", async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings })
});


//new route............................
router.get("/new",isLoggedIn, (req, res, next) => {
    try {
        res.render("listings/new.ejs");
    } catch (err) {
        next(err);
    }
});

// ...existing code...

//show route..................................

router.get("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{
                path:"author" 
            },
        })
        .populate("owner");
        console.log(listing)
        if (!listing) {
            req.session.flash.error = ["Listing you rejected for does not exit"];
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        next(err);
    }

})




//create route (POST)...................
router.post("/", valdateListing,
    Wrapasync(async (req, res, next) => {
        try {
            const listing = req.body.listing;
            //image data
            // Ensure image object exists
            if (!listing.image) {
                listing.image = {};
            }
            // Handle the nested url property
            if (listing['image.url']) {
                listing.image.url = listing['image.url'];
                delete listing['image.url'];
            }
            const newlisting = new Listing(listing);
                newlisting.owner=req.user._id;
            await newlisting.save();

            req.session.flash.success = ["New listing Created"];

            res.redirect("/listings");
        } catch (err) {
            next(err)
        }
    }));

//edit route

router.get("/:id/edit",isLoggedIn,isOwner ,valdateListing, async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.session.flash.error = ["Listing you rejected for does not exit"];
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing })

        
        console.log(id)
    } catch (err) {
        next(err)
    }

})

//update route

router.put("/:id", isLoggedIn,isOwner ,valdateListing,async (req, res, next) => {
        try {
            let { id } = req.params;
            await Listing.findByIdAndUpdate(id, { ...req.body.listing })
            req.session.flash.success = [" listing updated"];
            res.redirect(`/listings/${id}`);
        } catch (err) {
            next(err)
        }
    })
//delete route

router.delete("/:id",isLoggedIn,isOwner,async (req, res, next) => {
    try {
        let { id } = req.params;
        const deletelist = await Listing.findByIdAndDelete(id);
        console.log(deletelist);
        req.session.flash.success = [" listing Delated"];
        res.redirect("/listings");
    } catch (err) {
        next(err)
    }
});

module.exports = router;
