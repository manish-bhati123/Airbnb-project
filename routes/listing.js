const express = require("express");
const router = express.Router();
const Wrapasync = require("../util/Wrapasync.js");
const { isLoggedIn, isOwner, valdateListing } = require("../middleware.js")
const listingconstroller = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

// Fixed order of routes - more specific routes first
router.get("/search", isLoggedIn, listingconstroller.searchRoute);
router.get("/filter", isLoggedIn, listingconstroller.filterRoute);
router.get("/new", isLoggedIn, listingconstroller.newRoute);

// Main routes
router.get("/", listingconstroller.indexRoute);
router.post("/", isLoggedIn, upload.single('listing[image]'), valdateListing, Wrapasync(listingconstroller.Createroute));

// ID-specific routes last
router.get("/:id/edit", isLoggedIn, isOwner, valdateListing, listingconstroller.editRoute);

router.route("/:id")
    .get(listingconstroller.showRoute)
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), valdateListing, listingconstroller.updateRoute)
    .delete(isLoggedIn, isOwner, listingconstroller.distroyRoute);

module.exports = router;
