const mongoose = require("mongoose");

const personnelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Personel adı zorunludur"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Telefon numarası zorunludur"],
      trim: true,
    },
    specialties: [
      {
        type: String,
        enum: ["Kirpik", "Saç", "Makyaj", "Tırnak", "Cilt Bakımı", "Diğer"],
      },
    ],
    commissionRate: {
      type: Number,
      required: [true, "Prim oranı zorunludur"],
      min: 0,
      max: 100,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Personnel", personnelSchema);
