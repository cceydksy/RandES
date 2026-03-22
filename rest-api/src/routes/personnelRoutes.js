const express = require("express");
const router = express.Router();
const {
  getPersonnelNotifications,
  getPersonnelEarnings,
  updateAppointmentPersonnel,
  createPersonnel,
  getAllPersonnel,
} = require("../controllers/personnelController");

// GET  /api/v1/personnel — Tüm personeli listele (yardımcı)
router.get("/", getAllPersonnel);

// POST /api/v1/personnel — Personel ekle (yardımcı)
router.post("/", createPersonnel);

// GET  /api/v1/personnel/notifications — Bildirimler (Gereksinim 2)
router.get("/notifications", getPersonnelNotifications);

// GET  /api/v1/personnel/earnings — Hak ediş (Gereksinim 8)
router.get("/earnings", getPersonnelEarnings);

module.exports = router;
