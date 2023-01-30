/* Connecting to the database. */
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, () => {
    console.log("connected to db");
  });
};

module.exports = connectDB;
