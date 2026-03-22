const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB bağlandı");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error.message);
    throw error;
  }
};

module.exports = connectDB;
