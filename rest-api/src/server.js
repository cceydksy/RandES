const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route dosyaları
const appointmentRoutes = require("./routes/appointmentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const personnelRoutes = require("./routes/personnelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Veritabanı bağlantısı
connectDB();

// Ana route - API bilgisi
app.get("/", (req, res) => {
  res.json({
    message: "RandES API - Güzellik Salonu Randevu Yönetim Sistemi",
    version: "1.0.0",
    author: "Ceyda Nur Aksoy",
    endpoints: {
      appointments: "/api/v1/appointments",
      services: "/api/v1/services",
      personnel: "/api/v1/personnel",
      reviews: "/api/v1/reviews",
      ai: "/api/v1/ai",
    },
  });
});

// Route'lar
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/personnel", personnelRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Bu endpoint bulunamadı" });
});

// Hata yakalama
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Sunucu hatası", error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`RandES API çalışıyor: http://localhost:${PORT}`);
});

module.exports = app;
