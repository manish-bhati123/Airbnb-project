const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const passport = require("passport");
const {saveredirectUrl}=require("../middleware.js")
const userconstroller = require("../controller/users.js");


router.route("/signup")
.get(userconstroller.signupGetRoute)
.post(userconstroller.signupPostRoute);


router.route("/login")
.get(userconstroller.loginGetRoute)
.post(saveredirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),userconstroller.loginPostRoute);

    router.get("/logout",userconstroller.logoutRoute);


module.exports = router;