const axios = require("axios");
const Listing = require("../models/Listing.js");

//search
module.exports.searchRoute = async(req, res, next) => {
    try {
        const { country } = req.query;
        let listings;

        if(country) {
            // Using case-insensitive search with regex
            listings = await Listing.find({ 
                country: { $regex: country, $options: 'i' }
            });
        } else {
            listings = await Listing.find({});
        }

        res.render("listings/index", { allListings: listings });
    } catch (err) {
        console.error(err);
          req.session.flash.error =["Error in searching listings"]
        res.redirect("/listings");
    }
};

//add filter
module.exports.filterRoute = async (req, res, next) => {
    try {
        const { category } = req.query; // Get category from query parameters
        let filteredListings;
        
        if (category) {
            // Find listings matching the selected category
            filteredListings = await Listing.find({ category: category });
        } else {
            // If no category selected, get all listings
            filteredListings = await Listing.find({});
        }
        
        res.render("listings/index.ejs", { allListings: filteredListings });

    } catch (err) {
        next(err);
    }
}


module.exports.indexRoute = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings })
}

module.exports.newRoute = (req, res, next) => {
    try {
        res.render("listings/new.ejs");
    } catch (err) {
        next(err);
    }
},

module.exports.showRoute = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                },
            })
            .populate("owner");

        if (!listing) {
            req.session.flash.error = ["Listing you rejected for does not exit"];
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        next(err);
    }

}





module.exports.Createroute = async (req, res, next) => {
  try {
    // Get address from form
    const address = req.body.listing.location;
    // Call OpenStreetMap Nominatim API
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const geoResponse = await axios.get(geocodeUrl, { headers: {
        'User-Agent': 'MyAirbnbApp/1.0 (example@email.com)' // Replace with your email
      }
    });
    // Check if valid data is returned
    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error("Location not found!");
    }

    // Extract coordinates
    const geoData = geoResponse.data[0];
    const longitude = parseFloat(geoData.lon);
     const latitude = parseFloat(geoData.lat);

    // Create new listing
    const listing = req.body.listing;
    const url = req.file.path;
    const filename = req.file.filename;
    const newlisting = new Listing(listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    console.log(listing)

    // Save geolocation as GeoJSON Point
    newlisting.geometry = {
      type: "Point",
      coordinates: [longitude, latitude]
    };
    let savedlisting = await newlisting.save();
  
    
    req.session.flash.success = ["New listing Created"];
    res.redirect("/listings");

  } catch (err) {
    console.log(" Error in CreateRoute:", err.message);
    next(err);
  }
};




module.exports.editRoute = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.session.flash.error = ["Listing you rejected for does not exit"];
            return res.redirect("/listings");
        }
    let orignalimageUel= listing.image.url;
    orignalimageUel =orignalimageUel.replace("/upload","/upload/h_300,w_250");
        res.render("listings/edit.ejs", { listing,orignalimageUel })


        console.log(id)
    } catch (err) {
        next(err)
    }

}

module.exports.updateRoute = async (req, res, next) => {
    try {
       
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing,category: req.body.listing.category })
         if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
        }
        req.session.flash.success = [" listing updated"];
        res.redirect(`/listings/${id}`);

    } catch (err) {
        next(err)
    }
}

module.exports.distroyRoute = async (req, res, next) => {
    try {
        let { id } = req.params;
        const deletelist = await Listing.findByIdAndDelete(id);
        console.log(deletelist);
        req.session.flash.success = [" listing Delated"];
        res.redirect("/listings");
    } catch (err) {
        next(err)
    }
}

