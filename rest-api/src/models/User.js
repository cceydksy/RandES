const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ad soyad zorunludur"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "E-posta zorunludur"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
