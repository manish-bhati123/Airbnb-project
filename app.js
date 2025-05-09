        const express =require("express");
        const app =express();
        const mongoose = require('mongoose');
        const Listing =require("./models/Listing.js");
        const path =require("path");
        const methodOverride = require('method-override');
        const engine = require('ejs-mate');
        const Wrapasync = require("./util/Wrapasync.js");
        const ExpressError = require("./util/ExpressError.js");
        const {listingSchema } = require("./schema.js");
        app.set("view engine","ejs");
        app.set("views",path.join(__dirname,"views"));
        app.use(express.static(path.join(__dirname,"public")));
        app.use(express.urlencoded({extended:true}));
        app.use(express.json());
        app.use(methodOverride('_method'));
        app.engine('ejs', engine);
        main().then((res)=>
            console.log("connected to DB"))
            .catch(err =>{ 
                console.log(err)});
            
            async function main() {
            await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
            }
            
            app.get("/",(req,res)=>{
                res.send("working")
            });


            const valdateListing =(req,res,next)=>{
              let {error} = listingSchema.validate(req.body);
              if(error){
                let errMas =error.details.map((el)=>el.message).join(",");
                throw new ExpressError(404,errMas)
              }else{
                next();
              }
               
            }
        //index route  ............................
            app.get("/listings",async(req,res)=>{
            let allListings= await Listing.find()
            // console.log(allListings);
                res.render("listings/index.ejs",{allListings})
            });

            //new route............................

            app.get("/listings/new",(req,res)=>{
                res.render("listings/new.ejs")
            });

            //show route..................................

            app.get("/listings/:id",async(req,res,next) =>{
                try{  
                      let {id} =req.params;
                const listing =await Listing.findById(id);
                res.render("listings/show.ejs",{listing});
            }catch(err){
                next(err);
            }
             
            })

            //create route (POST)...................
    app.post("/listings",valdateListing,
         Wrapasync(async(req, res, next) => {
            try{
    const listing = req.body.listing;
    const newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
            }catch(err){
                next(err)
            }
}));

            //edit route
        
            app.get("/listings/:id/edit",async(req,res,next)=>{
                try{
                let {id} =req.params;
                const listing =await Listing.findById(id);
                res.render("listings/edit.ejs",{listing})
                }catch(err){
                    next(err)
                }
            })

            //update route

            app.put("/listings/:id",valdateListing
                ,async(req,res,next)=>{
                try{
                let {id} =req.params;
                await Listing.findByIdAndUpdate(id,{ ...req.body.listing})
                res.redirect(`/listings/${id}`);
                }catch(err){
                    next(err)
                }
            })
            //delete route

            app.delete("/listings/:id",async(req,res,next)=>{
                try{
                let {id} =req.params; 
                const deletelist =await Listing.findByIdAndDelete(id);
                console.log(deletelist);
                res.redirect("/listings");
                }catch(err){
                    next(err)
                }
        });


      

        app.all("*path", (req, res, next) => {
            next(new ExpressError( 404,"Page Not Found!"));
        }); 
        
        

        
    
         //handel to the error
        app.use((err, req, res, next) => {
            const { statuscode = 500, message = "somthin want rong" } = err;
            res.status(statuscode).render("listings/error.ejs",{message})
        });
        

            app.listen("8080",()=>{
                console.log("server i listening to port 8080")
            })








                // app.get("/testlisting", async(req,res)=>{
            //     let sempleListing =new Listing({
            //         title:"My new villa",
            //         description:"By the beach", 
            //         price:1200,
            //         location:"Calangute",
            //         country: "india", 
            //     });
            
            //     await sempleListing.save(); 
            //     console.log("sample was saved");
            //     res.send("working list");
            // })


            //image data
                  // // Ensure image object exists
                    // if (!listing.image) {
                    //     listing.image = {};
                    // }
                    // // Handle the nested url property
                    // if (listing['image.url']) {
                    //     listing.image.url = listing['image.url'];
                    //     delete listing['image.url'];
                    // }