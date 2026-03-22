const Appointment = require("../models/Appointment");

// 1) Randevu Kaydı Oluşturma — POST /api/v1/appointments
const createAppointment = async (req, res) => {
  try {
    const { customerName, customerPhone, serviceId, personnelId, appointmentTime, notes } = req.body;

    const appointment = await Appointment.create({
      customerName,
      customerPhone,
      serviceId,
      personnelId,
      appointmentTime,
      notes,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("serviceId", "name category price durationMinutes")
      .populate("personnelId", "name phone");

    res.status(201).json({
      success: true,
      message: "Randevu başarıyla oluşturuldu",
      data: populated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Randevu oluşturulamadı",
      error: error.message,
    });
  }
};

// 4) Müşteri Randevu Onay Güncelleme — PUT /api/v1/appointments/:appointmentId/confirmation
const updateAppointmentConfirmation = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body; // "onaylandi" veya "iptal"

    if (!["onaylandi", "iptal"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz durum. 'onaylandi' veya 'iptal' olmalıdır",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status, confirmationSentAt: new Date() },
      { new: true }
    )
      .populate("serviceId", "name category price")
      .populate("personnelId", "name phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }

    res.status(200).json({
      success: true,
      message: `Randevu durumu '${status}' olarak güncellendi`,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Randevu durumu güncellenemedi",
      error: error.message,
    });
  }
};

// 5) Onaylanmayan Randevu Teşhisi — GET /api/v1/appointments/unconfirmed
const getUnconfirmedAppointments = async (req, res) => {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const unconfirmed = await Appointment.find({
      status: "beklemede",
      appointmentTime: { $lte: tomorrow },
    })
      .populate("serviceId", "name category price")
      .populate("personnelId", "name phone")
      .sort({ appointmentTime: 1 });

    res.status(200).json({
      success: true,
      message: `${unconfirmed.length} adet onaylanmayan randevu bulundu`,
      count: unconfirmed.length,
      data: unconfirmed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Onaylanmayan randevular getirilemedi",
      error: error.message,
    });
  }
};

// 7) İptal Edilen Randevu Kaydını Silme — DELETE /api/v1/appointments/:appointmentId
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }

    await Appointment.findByIdAndDelete(appointmentId);

    res.status(200).json({
      success: true,
      message: "Randevu başarıyla silindi",
      data: { deletedId: appointmentId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Randevu silinemedi",
      error: error.message,
    });
  }
};

// Tüm randevuları listeleme (yardımcı endpoint)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("serviceId", "name category price durationMinutes")
      .populate("personnelId", "name phone")
      .sort({ appointmentTime: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Randevular getirilemedi",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  updateAppointmentConfirmation,
  getUnconfirmedAppointments,
  deleteAppointment,
  getAllAppointments,
};
