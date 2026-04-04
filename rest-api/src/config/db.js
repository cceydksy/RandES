const mongoose = require("mongoose");

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB bağlandı");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB bağlantı hatası:", error.message);
    throw error;
  }
};

module.exports = connectDB;