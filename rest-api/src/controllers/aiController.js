const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

// 10) AI – Akıllı Müşteri Kayıp Riski Analizi — POST /api/v1/ai/customer-risk
const analyzeCustomerRisk = async (req, res) => {
  try {
    // Tamamlanmış tüm randevuları al
    const completedAppointments = await Appointment.find({
      status: "tamamlandi",
    })
      .populate("serviceId", "name category renewalDays")
      .sort({ appointmentTime: -1 });

    if (completedAppointments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Analiz edilecek tamamlanmış randevu bulunamadı",
        data: { atRisk: [], safe: [] },
      });
    }

    // Müşteri bazında son randevuyu bul
    const customerLastAppointment = {};

    completedAppointments.forEach((apt) => {
      const key = apt.customerPhone || apt.customerName;
      if (!customerLastAppointment[key]) {
        customerLastAppointment[key] = {
          customerName: apt.customerName,
          customerPhone: apt.customerPhone,
          lastAppointment: apt.appointmentTime,
          lastService: apt.serviceId?.name || "Bilinmiyor",
          lastCategory: apt.serviceId?.category || "Bilinmiyor",
          renewalDays: apt.serviceId?.renewalDays || 30,
        };
      }
    });

    const now = new Date();
    const atRisk = [];
    const safe = [];

    Object.values(customerLastAppointment).forEach((customer) => {
      const daysSinceLastVisit = Math.floor(
        (now - new Date(customer.lastAppointment)) / (1000 * 60 * 60 * 24)
      );

      const isAtRisk = daysSinceLastVisit > customer.renewalDays;

      const record = {
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        lastService: customer.lastService,
        lastVisitDate: customer.lastAppointment,
        daysSinceLastVisit: daysSinceLastVisit,
        renewalDays: customer.renewalDays,
        daysOverdue: isAtRisk ? daysSinceLastVisit - customer.renewalDays : 0,
      };

      if (isAtRisk) {
        // Sıcak ve samimi hatırlatma mesajı oluştur
        record.reminderMessage =
          `Merhaba ${customer.customerName}! Sizi özledik 💛 ` +
          `Son ${customer.lastService} işleminizin üzerinden ${daysSinceLastVisit} gün geçti. ` +
          `Yenileme zamanınız gelmiş olabilir. ` +
          `Size uygun bir randevu ayarlamamızı ister misiniz?`;

        record.riskLevel =
          daysSinceLastVisit > customer.renewalDays * 2
            ? "yuksek"
            : "orta";

        atRisk.push(record);
      } else {
        record.riskLevel = "dusuk";
        record.daysUntilRenewal = customer.renewalDays - daysSinceLastVisit;
        safe.push(record);
      }
    });

    // Risk seviyesine göre sırala (yüksek risk önce)
    atRisk.sort((a, b) => b.daysOverdue - a.daysOverdue);

    res.status(200).json({
      success: true,
      message: "Müşteri kayıp riski analizi tamamlandı",
      summary: {
        totalCustomers: Object.keys(customerLastAppointment).length,
        atRiskCount: atRisk.length,
        safeCount: safe.length,
        riskRate: `${((atRisk.length / Object.keys(customerLastAppointment).length) * 100).toFixed(1)}%`,
      },
      data: {
        atRisk,
        safe,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Müşteri kayıp riski analizi yapılamadı",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeCustomerRisk,
};
