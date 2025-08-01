const express = require("express");
const router = express.Router();
const Wrapasync = require("../util/Wrapasync.js");
const { isLoggedIn, isOwner, valdateListing } = require("../middleware.js")
const listingconstroller = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router.get("/search", isLoggedIn, listingconstroller.searchRoute);
router.get("/filter", isLoggedIn, listingconstroller.filterRoute);

router.get("/", listingconstroller.indexRoute)//index route  ............................
router.get("/new", isLoggedIn, listingconstroller.newRoute);
router.post("/", isLoggedIn, upload.single('listing[image]'), valdateListing, Wrapasync(listingconstroller.Createroute))//create route (POST)...................

//new route............................

router.route("/:id")
    .get(listingconstroller.showRoute)//show route..................................
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), valdateListing, listingconstroller.updateRoute)//update route
    .delete(isLoggedIn, isOwner, listingconstroller.distroyRoute);//delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, valdateListing, listingconstroller.editRoute)


module.exports = router;
