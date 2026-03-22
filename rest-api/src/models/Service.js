const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hizmet adı zorunludur"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Kategori zorunludur"],
      enum: ["Kirpik", "Saç", "Makyaj", "Tırnak", "Cilt Bakımı", "Diğer"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Fiyat zorunludur"],
      min: 0,
    },
    durationMinutes: {
      type: Number,
      required: [true, "İşlem süresi zorunludur"],
      min: 1,
    },
    renewalDays: {
      type: Number,
      required: [true, "Ortalama yenileme süresi zorunludur"],
      min: 1,
    },
    description: {
      type: String,
      trim: true,
      default: "",
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

module.exports = mongoose.model("Service", serviceSchema);
