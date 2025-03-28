const mongoose = require("mongoose");

const connectToMongoDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB successfully connected");
  } catch (error) {
    console.error("Error connecting MongoDB: ", error);
    throw error;
  }
};

module.exports = connectToMongoDB;