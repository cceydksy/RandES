const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB bağlandı");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error.message);
  }
};

module.exports = connectDB;
