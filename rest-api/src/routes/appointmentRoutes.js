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

// POST /api/v1/appointments — Randevu oluştur
router.post("/", createAppointment);

// GET  /api/v1/appointments/unconfirmed — Onaylanmayan randevular
router.get("/unconfirmed", getUnconfirmedAppointments);

// PUT  /api/v1/appointments/:appointmentId/confirmation — Onay güncelle
router.put("/:appointmentId/confirmation", updateAppointmentConfirmation);

// PUT  /api/v1/appointments/:appointmentId/personnel — Personel ata
router.put("/:appointmentId/personnel", updateAppointmentPersonnel);

// PUT  /api/v1/appointments/:appointmentId — Randevu düzenle
router.put("/:appointmentId", updateAppointment);

// DELETE /api/v1/appointments/:appointmentId — Randevu sil
router.delete("/:appointmentId", deleteAppointment);

module.exports = router;
