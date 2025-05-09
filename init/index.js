const mongoose = require('mongoose');
const iniData =require("./data.js");
const Listing =require("../models/Listing.js");


main().then((res)=>
console.log("connected to DB"))
.catch(err =>{ 
    console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB =async() =>{
    await Listing.deleteMany({});
    await Listing.insertMany(iniData.data);
    console.log("data was initialiZed")
};

initDB();