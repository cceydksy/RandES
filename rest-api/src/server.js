const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const appointmentRoutes = require("./routes/appointmentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const personnelRoutes = require("./routes/personnelRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const aiRoutes = require("./routes/aiRoutes");
const seedRoutes = require("./routes/seedRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "RandES API - Güzellik Salonu Randevu Yönetim Sistemi",
    version: "1.0.0",
    author: "Ceyda Nur Aksoy",
    endpoints: {
      auth: "/api/v1/auth",
      appointments: "/api/v1/appointments",
      services: "/api/v1/services",
      personnel: "/api/v1/personnel",
      reviews: "/api/v1/reviews",
      ai: "/api/v1/ai",
      seed: "/api/v1/seed",
    },
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/personnel", personnelRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/seed", seedRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Bu endpoint bulunamadı" });
});

if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`RandES API çalışıyor: http://localhost:${PORT}`);
  });
  module.exports = app;
}
