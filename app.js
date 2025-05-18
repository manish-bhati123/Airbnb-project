const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require("./util/ExpressError.js");
const listingsroutes = require("./routes/listing.js");
const reviewsroutes = require("./routes/review.js");
const Userroutes =require("./routes/User.js")
const session = require("express-session");
const flash = require('connect-flash');
const User =require("./models/User.js")
const passport =require("passport");
const LocalStrategy =require("passport-local");



main().then((res) =>
    console.log("connected to DB"))
    .catch(err => {
        console.log(err)
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', engine);




const sessionoption ={
    secret:"mysupersecrtingstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 *60 * 60* 100,
        maxAge: 7 * 24 *60 * 60* 100,
        httpOnly:true,

    }

}

app.get("/", (req, res) => {
    res.send("working")
});

app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
     res.locals.error =req.flash("error");
     res.locals.curruser =req.user;

    next();

})

//listing route
app.use("/listings", listingsroutes);
app.use("/listings/:id/reviews", reviewsroutes);
app.use("/",Userroutes)




    app.all("*path", (req, res, next) => {
        next(new ExpressError(404, "Page Not Found!"));
    });





//handel to the error
app.use((err, req, res, next) => {
    const { statuscode = 500, message = "somthin want rong" } = err;
    res.status(statuscode).render("listings/error.ejs", { message })
});


app.listen("8080", () => {
    console.log("server i listening to port 8080")
})
