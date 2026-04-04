const express = require("express");
const router = express.Router();
const {
  createAppointment,
  updateAppointment,
  updateAppointmentConfirmation,
  getUnconfirmedAppointments,
  deleteAppointment,
  getAllAppointments,
} = require("../controllers/appointmentController");
const {
  updateAppointmentPersonnel,
} = require("../controllers/personnelController");

// GET  /api/v1/appointments — Tüm randevuları listele
router.get("/", getAllAppointments);

// POST /api/v1/appointments — Randevu oluştur (Gereksinim 1)
router.post("/", createAppointment);

// GET  /api/v1/appointments/unconfirmed — Onaylanmayan randevular (Gereksinim 5)
router.get("/unconfirmed", getUnconfirmedAppointments);

// PUT  /api/v1/appointments/:appointmentId — Randevu düzenle
router.put("/:appointmentId", updateAppointment);

// PUT  /api/v1/appointments/:appointmentId/confirmation — Onay güncelle (Gereksinim 4)
router.put("/:appointmentId/confirmation", updateAppointmentConfirmation);

// PUT  /api/v1/appointments/:appointmentId/personnel — Personel ata (Gereksinim 9)
router.put("/:appointmentId/personnel", updateAppointmentPersonnel);

// DELETE /api/v1/appointments/:appointmentId — Randevu sil (Gereksinim 7)
router.delete("/:appointmentId", deleteAppointment);

module.exports = router;