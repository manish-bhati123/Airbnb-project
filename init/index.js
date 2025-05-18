const mongoose = require('mongoose');
const iniData = require("./data.js");
const Listing = require("../models/Listing.js");



main().then((res) =>
  console.log("connected to DB"))
  .catch(err => {
    console.log(err)
  });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDB = async () => {
  await Listing.deleteMany({});
  iniData.data = iniData.data.map((obj) => ({ ...obj, owner: "68281f32a90d389404e8d730" }));
  await Listing.insertMany(iniData.data);
  console.log("data was initialiZed")
};

initDB();