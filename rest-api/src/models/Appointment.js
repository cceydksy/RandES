const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Müşteri adı zorunludur"],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Müşteri telefon numarası zorunludur"],
      trim: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Hizmet seçimi zorunludur"],
    },
    personnelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personnel",
      required: [true, "Personel seçimi zorunludur"],
    },
    appointmentTime: {
      type: Date,
      required: [true, "Randevu saati zorunludur"],
    },
    status: {
      type: String,
      enum: ["beklemede", "onaylandı", "iptal", "tamamlandı"],
      default: "beklemede",
    },
    confirmationSentAt: {
      type: Date,
      default: null,
    },
    reviewSentAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);