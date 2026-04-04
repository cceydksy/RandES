const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Personnel = require("../models/Personnel");
const Appointment = require("../models/Appointment");
const connectDB = require("../config/db");

// POST /api/v1/seed — Veritabanına örnek veri yükle
router.post("/", async (req, res) => {
  try {
    await connectDB();

    // Mevcut verileri temizle
    await Appointment.deleteMany({});
    await Personnel.deleteMany({});
    await Service.deleteMany({});

    // Hizmetler
    const services = [
      { name: "İpek Kirpik", category: "Kirpik", price: 800, durationMinutes: 90, renewalDays: 21, description: "Doğal görünümlü ipek kirpik uygulaması" },
      { name: "Mega Volume Kirpik", category: "Kirpik", price: 1200, durationMinutes: 120, renewalDays: 21, description: "Yoğun hacimli volume kirpik" },
      { name: "Kirpik Dolgu", category: "Kirpik", price: 500, durationMinutes: 60, renewalDays: 14, description: "Mevcut kirpik dolgu işlemi" },
      { name: "Saç Kesim", category: "Saç", price: 300, durationMinutes: 45, renewalDays: 30, description: "Kadın saç kesimi" },
      { name: "Saç Boyama", category: "Saç", price: 900, durationMinutes: 120, renewalDays: 45, description: "Tek renk saç boyama" },
      { name: "Fön", category: "Saç", price: 200, durationMinutes: 30, renewalDays: 7, description: "Fön çekim işlemi" },
      { name: "Günlük Makyaj", category: "Makyaj", price: 500, durationMinutes: 60, renewalDays: 30, description: "Günlük doğal makyaj" },
      { name: "Gelin Makyajı", category: "Makyaj", price: 3000, durationMinutes: 180, renewalDays: 365, description: "Profesyonel gelin makyajı" },
      { name: "Manikür", category: "Tırnak", price: 250, durationMinutes: 45, renewalDays: 14, description: "Klasik manikür uygulaması" },
      { name: "Pedikür", category: "Tırnak", price: 300, durationMinutes: 60, renewalDays: 21, description: "Klasik pedikür uygulaması" },
      { name: "Protez Tırnak", category: "Tırnak", price: 700, durationMinutes: 90, renewalDays: 21, description: "Protez tırnak uygulaması" },
      { name: "Cilt Bakımı", category: "Cilt Bakımı", price: 600, durationMinutes: 60, renewalDays: 30, description: "Derin cilt bakım uygulaması" },
      { name: "Hydrafacial", category: "Cilt Bakımı", price: 1500, durationMinutes: 75, renewalDays: 30, description: "Hydrafacial cilt yenileme" },
    ];

    const createdServices = await Service.insertMany(services);

    // Personel
    const personnelList = [
      { name: "Ayşe Yılmaz", phone: "05301234567", specialties: ["Kirpik", "Makyaj"], commissionRate: 30 },
      { name: "Fatma Demir", phone: "05309876543", specialties: ["Saç", "Cilt Bakımı"], commissionRate: 35 },
      { name: "Zeynep Kaya", phone: "05305556677", specialties: ["Tırnak", "Cilt Bakımı"], commissionRate: 25 },
      { name: "Elif Çelik", phone: "05301112233", specialties: ["Kirpik", "Saç", "Makyaj"], commissionRate: 40 },
    ];

    const createdPersonnel = await Personnel.insertMany(personnelList);

    // Randevular
    const now = new Date();
    const appointments = [
      { customerName: "Selin Acar", customerPhone: "05421110022", serviceId: createdServices[0]._id, personnelId: createdPersonnel[0]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0), status: "onaylandı" },
      { customerName: "Merve Özkan", customerPhone: "05422220033", serviceId: createdServices[3]._id, personnelId: createdPersonnel[1]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30), status: "beklemede" },
      { customerName: "Deniz Yıldız", customerPhone: "05423330044", serviceId: createdServices[8]._id, personnelId: createdPersonnel[2]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0), status: "beklemede" },
      { customerName: "Büşra Kılıç", customerPhone: "05424440055", serviceId: createdServices[6]._id, personnelId: createdPersonnel[3]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0), status: "beklemede" },
      { customerName: "Selin Acar", customerPhone: "05421110022", serviceId: createdServices[0]._id, personnelId: createdPersonnel[0]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 25), status: "tamamlandı" },
      { customerName: "Merve Özkan", customerPhone: "05422220033", serviceId: createdServices[4]._id, personnelId: createdPersonnel[1]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 50), status: "tamamlandı" },
      { customerName: "Deniz Yıldız", customerPhone: "05423330044", serviceId: createdServices[8]._id, personnelId: createdPersonnel[2]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7), status: "tamamlandı" },
      { customerName: "Aylin Demir", customerPhone: "05425550066", serviceId: createdServices[11]._id, personnelId: createdPersonnel[1]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 40), status: "tamamlandı" },
      { customerName: "Gamze Şahin", customerPhone: "05426660077", serviceId: createdServices[1]._id, personnelId: createdPersonnel[3]._id, appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3), status: "tamamlandı" },
    ];

    const createdAppointments = await Appointment.insertMany(appointments);

    res.status(200).json({
      success: true,
      message: "Seed verileri başarıyla yüklendi!",
      data: {
        services: createdServices.length,
        personnel: createdPersonnel.length,
        appointments: createdAppointments.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Seed işlemi başarısız",
      error: error.message,
    });
  }
});

module.exports = router;