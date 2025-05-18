const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const passport = require("passport");
const {saveredirectUrl}=require("../middleware.js")

router.get("/signup", (req, res) => {
    res.render("listings/users/signup.ejs")

});


router.post("/signup", async (req, res, next) => {
    try {
        let { username, Email, password } = req.body;
        const newUser = new User({ Email, username });
        const registeredUSER = await User.register(newUser, password);
        console.log(registeredUSER);
      req.login(registeredUSER, (err) => {
            if (err) {
                return next(err);
            }
            // Initialize flash if it doesn't exist
            if (!req.session.flash) {
                req.session.flash = {};
            }
            req.session.flash.success = ["Welcome to Wanderlust"];
            res.redirect("/listings");
        });
       
    } catch (err) {
        if (!req.session.flash) req.session.flash = {};
        req.session.flash.error = [err.message];
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("listings/users/login.ejs")

});



router.post("/login",saveredirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
    async (req, res) => {
        if (!req.session.flash) req.session.flash = {}; // Add this line
        req.session.flash.success = [" Welcome to Wanderlust"];

   // Change req.locals to res.locals
        const redirectUrl = res.locals.redirectUrl || "/listings"; // Add fallback URL
        res.redirect(redirectUrl);
    });


    router.get("/logout",(req,res)=>{
        req.logOut((err)=>{
            if(err){
                return next()
            }
             req.flash("success","you are log out")
            res.redirect("/listings")
        })
    });


module.exports = router;