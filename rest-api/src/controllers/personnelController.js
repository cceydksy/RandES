const Appointment = require("../models/Appointment");
const Personnel = require("../models/Personnel");

// 2) Personel Randevu Bildirimi — GET /api/v1/personnel/notifications
const getPersonnelNotifications = async (req, res) => {
  try {
    const { personnelId } = req.query;

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    let filter = {
      appointmentTime: { $gte: now, $lte: endOfDay },
      status: { $in: ["beklemede", "onaylandi"] },
    };

    if (personnelId) {
      filter.personnelId = personnelId;
    }

    const appointments = await Appointment.find(filter)
      .populate("serviceId", "name category durationMinutes")
      .populate("personnelId", "name phone")
      .sort({ appointmentTime: 1 });

    const notifications = appointments.map((apt) => {
      const saat = new Date(apt.appointmentTime).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        appointmentId: apt._id,
        personnelName: apt.personnelId?.name || "Bilinmiyor",
        customerName: apt.customerName,
        serviceName: apt.serviceId?.name || "Bilinmiyor",
        time: saat,
        message: `Saat ${saat}'da ${apt.customerName} adlı müşterinin ${apt.serviceId?.name || ""} işleminiz vardır.`,
        status: apt.status,
      };
    });

    res.status(200).json({
      success: true,
      message: `${notifications.length} adet bildirim bulundu`,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bildirimler getirilemedi",
      error: error.message,
    });
  }
};

// 8) Aylık Personel Hak Ediş Takibi — GET /api/v1/personnel/earnings
const getPersonnelEarnings = async (req, res) => {
  try {
    const { personnelId, month, year } = req.query;

    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    let filter = {
      appointmentTime: { $gte: startDate, $lte: endDate },
      status: "tamamlandi",
    };

    if (personnelId) {
      filter.personnelId = personnelId;
    }

    const appointments = await Appointment.find(filter)
      .populate("serviceId", "name category price")
      .populate("personnelId", "name commissionRate");

    // Personel bazlı grupla
    const earningsMap = {};

    appointments.forEach((apt) => {
      const pId = apt.personnelId?._id?.toString();
      if (!pId) return;

      if (!earningsMap[pId]) {
        earningsMap[pId] = {
          personnelId: pId,
          personnelName: apt.personnelId.name,
          commissionRate: apt.personnelId.commissionRate,
          totalAppointments: 0,
          totalRevenue: 0,
          totalEarnings: 0,
          services: [],
        };
      }

      const price = apt.serviceId?.price || 0;
      const commission = (price * apt.personnelId.commissionRate) / 100;

      earningsMap[pId].totalAppointments += 1;
      earningsMap[pId].totalRevenue += price;
      earningsMap[pId].totalEarnings += commission;
      earningsMap[pId].services.push({
        date: apt.appointmentTime,
        serviceName: apt.serviceId?.name || "Bilinmiyor",
        customerName: apt.customerName,
        price: price,
        commission: commission,
      });
    });

    const earnings = Object.values(earningsMap);

    res.status(200).json({
      success: true,
      message: "Personel hak ediş bilgileri getirildi",
      period: {
        month: targetMonth + 1,
        year: targetYear,
      },
      data: earnings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hak ediş bilgileri getirilemedi",
      error: error.message,
    });
  }
};

// 9) Personel Atama ve Güncelleme — PUT /api/v1/appointments/:appointmentId/personnel
const updateAppointmentPersonnel = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { personnelId } = req.body;

    // Personel var mı kontrol et
    const personnel = await Personnel.findById(personnelId);
    if (!personnel) {
      return res.status(404).json({
        success: false,
        message: "Atanmak istenen personel bulunamadı",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { personnelId },
      { new: true }
    )
      .populate("serviceId", "name category price")
      .populate("personnelId", "name phone specialties");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }

    res.status(200).json({
      success: true,
      message: `Personel '${personnel.name}' olarak güncellendi`,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Personel ataması yapılamadı",
      error: error.message,
    });
  }
};

// Personel ekleme (seed data için yardımcı)
const createPersonnel = async (req, res) => {
  try {
    const personnel = await Personnel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Personel başarıyla eklendi",
      data: personnel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Personel eklenemedi",
      error: error.message,
    });
  }
};

// Tüm personel listeleme
const getAllPersonnel = async (req, res) => {
  try {
    const personnel = await Personnel.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: personnel.length,
      data: personnel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Personeller getirilemedi",
      error: error.message,
    });
  }
};

module.exports = {
  getPersonnelNotifications,
  getPersonnelEarnings,
  updateAppointmentPersonnel,
  createPersonnel,
  getAllPersonnel,
};
