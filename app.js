
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require("./util/expressError.js")
const listingsroutes = require("./routes/listing.js");
const reviewsroutes = require("./routes/review.js");
const Userroutes = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require("./models/User.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");

// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

const dbURL = process.env.ATLASDB_URL;


main().then((res) =>
    console.log("connected to DB"))
    .catch(err => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});


const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});


store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err)

})

const sessionoption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    }

}

// app.get("/", (req, res) => {
//     res.send("working")
// });

app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user || null;

    next();
});



//listing route
app.use("/",listingsroutes);
app.use("/listings", listingsroutes);
app.use("/listings/:id/reviews", reviewsroutes);
app.use("/", Userroutes)




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
