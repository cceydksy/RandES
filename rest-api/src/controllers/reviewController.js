const Appointment = require("../models/Appointment");

// 6) Otomatik Google Değerlendirme Mesajı — POST /api/v1/reviews/request
const sendReviewRequest = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate("serviceId", "name category")
      .populate("personnelId", "name");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }

    if (appointment.status !== "tamamlandi") {
      return res.status(400).json({
        success: false,
        message: "Sadece tamamlanmış randevular için değerlendirme isteği gönderilebilir",
      });
    }

    // Değerlendirme mesajı oluştur
    const googleReviewLink = "https://g.page/r/SALON_ID/review";
    const message = `Merhaba ${appointment.customerName}, ` +
      `bugün ${appointment.serviceId?.name || ""} hizmetimizden yararlandığınız için teşekkür ederiz. ` +
      `Deneyiminizi Google üzerinden değerlendirmeniz bizi çok mutlu eder: ${googleReviewLink}`;

    // Gönderim zamanını kaydet
    appointment.reviewSentAt = new Date();
    appointment.status = "tamamlandi";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Değerlendirme isteği başarıyla gönderildi",
      data: {
        customerName: appointment.customerName,
        customerPhone: appointment.customerPhone,
        serviceName: appointment.serviceId?.name,
        reviewMessage: message,
        googleReviewLink: googleReviewLink,
        sentAt: appointment.reviewSentAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Değerlendirme isteği gönderilemedi",
      error: error.message,
    });
  }
};

module.exports = {
  sendReviewRequest,
};
