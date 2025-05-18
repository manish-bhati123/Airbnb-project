const mongoose = require('mongoose');
const Review =require("./Review.js")
const Schema = mongoose.Schema;
const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1745508823793-e19654f8085a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: function (v) {
                return v === "" ? "https://images.unsplash.com/photo-1745508823793-e19654f8085a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v;
            },
        },
    },

    price: {
        type: Number,
    },
    location: {
        type: String,

    },
    country: {
        type: String
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review",
        
        },

    ],
    owner:{
              type:Schema.Types.ObjectId,
        ref:"User",
    },

});

listSchema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}})
    }
})


const Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;