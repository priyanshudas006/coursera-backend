const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    const URI =
      process.env.URI ||
      "mongodb+srv://glancegamingyt_db_user:dTazI7OqTUUYOlDH@cluster0.lwxj9fy.mongodb.net/";

    if (!URI) {
      console.log("Mongo URI missing");
      return;
    }

    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
  }
};

module.exports = mongoDB;
