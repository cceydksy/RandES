const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Service = require("../models/Service");
const Personnel = require("../models/Personnel");
const Appointment = require("../models/Appointment");

dotenv.config();

const services = [
  // Kirpik
  { name: "İpek Kirpik", category: "Kirpik", price: 800, durationMinutes: 90, renewalDays: 21, description: "Doğal görünümlü ipek kirpik uygulaması" },
  { name: "Mega Volume Kirpik", category: "Kirpik", price: 1200, durationMinutes: 120, renewalDays: 21, description: "Yoğun hacimli volume kirpik" },
  { name: "Kirpik Dolgu", category: "Kirpik", price: 500, durationMinutes: 60, renewalDays: 14, description: "Mevcut kirpik dolgu işlemi" },
  // Saç
  { name: "Saç Kesim", category: "Saç", price: 300, durationMinutes: 45, renewalDays: 30, description: "Kadın saç kesimi" },
  { name: "Saç Boyama", category: "Saç", price: 900, durationMinutes: 120, renewalDays: 45, description: "Tek renk saç boyama" },
  { name: "Fön", category: "Saç", price: 200, durationMinutes: 30, renewalDays: 7, description: "Fön çekim işlemi" },
  // Makyaj
  { name: "Günlük Makyaj", category: "Makyaj", price: 500, durationMinutes: 60, renewalDays: 30, description: "Günlük doğal makyaj" },
  { name: "Gelin Makyajı", category: "Makyaj", price: 3000, durationMinutes: 180, renewalDays: 365, description: "Profesyonel gelin makyajı" },
  // Tırnak
  { name: "Manikür", category: "Tırnak", price: 250, durationMinutes: 45, renewalDays: 14, description: "Klasik manikür uygulaması" },
  { name: "Pedikür", category: "Tırnak", price: 300, durationMinutes: 60, renewalDays: 21, description: "Klasik pedikür uygulaması" },
  { name: "Protez Tırnak", category: "Tırnak", price: 700, durationMinutes: 90, renewalDays: 21, description: "Protez tırnak uygulaması" },
  // Cilt Bakımı
  { name: "Cilt Bakımı", category: "Cilt Bakımı", price: 600, durationMinutes: 60, renewalDays: 30, description: "Derin cilt bakım uygulaması" },
  { name: "Hydrafacial", category: "Cilt Bakımı", price: 1500, durationMinutes: 75, renewalDays: 30, description: "Hydrafacial cilt yenileme" },
];

const personnelList = [
  { name: "Ayşe Yılmaz", phone: "05301234567", specialties: ["Kirpik", "Makyaj"], commissionRate: 30 },
  { name: "Fatma Demir", phone: "05309876543", specialties: ["Saç", "Cilt Bakımı"], commissionRate: 35 },
  { name: "Zeynep Kaya", phone: "05305556677", specialties: ["Tırnak", "Cilt Bakımı"], commissionRate: 25 },
  { name: "Elif Çelik", phone: "05301112233", specialties: ["Kirpik", "Saç", "Makyaj"], commissionRate: 40 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB bağlantısı başarılı");

    // Mevcut verileri temizle
    await Service.deleteMany({});
    await Personnel.deleteMany({});
    await Appointment.deleteMany({});
    console.log("Mevcut veriler temizlendi");

    // Hizmetleri ekle
    const createdServices = await Service.insertMany(services);
    console.log(`${createdServices.length} hizmet eklendi`);

    // Personelleri ekle
    const createdPersonnel = await Personnel.insertMany(personnelList);
    console.log(`${createdPersonnel.length} personel eklendi`);

    // Örnek randevular oluştur
    const now = new Date();
    const appointments = [
      // Bugünkü randevular
      {
        customerName: "Selin Acar",
        customerPhone: "05421110022",
        serviceId: createdServices[0]._id, // İpek Kirpik
        personnelId: createdPersonnel[0]._id, // Ayşe
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
        status: "onaylandi",
      },
      {
        customerName: "Merve Özkan",
        customerPhone: "05422220033",
        serviceId: createdServices[3]._id, // Saç Kesim
        personnelId: createdPersonnel[1]._id, // Fatma
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30),
        status: "beklemede",
      },
      {
        customerName: "Deniz Yıldız",
        customerPhone: "05423330044",
        serviceId: createdServices[8]._id, // Manikür
        personnelId: createdPersonnel[2]._id, // Zeynep
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
        status: "beklemede",
      },
      // Yarınki randevular
      {
        customerName: "Büşra Kılıç",
        customerPhone: "05424440055",
        serviceId: createdServices[6]._id, // Günlük Makyaj
        personnelId: createdPersonnel[3]._id, // Elif
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0),
        status: "beklemede",
      },
      // Geçmiş tamamlanmış randevular (hak ediş ve AI analizi için)
      {
        customerName: "Selin Acar",
        customerPhone: "05421110022",
        serviceId: createdServices[0]._id, // İpek Kirpik
        personnelId: createdPersonnel[0]._id,
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 25),
        status: "tamamlandi",
      },
      {
        customerName: "Merve Özkan",
        customerPhone: "05422220033",
        serviceId: createdServices[4]._id, // Saç Boyama
        personnelId: createdPersonnel[1]._id,
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 50),
        status: "tamamlandi",
      },
      {
        customerName: "Deniz Yıldız",
        customerPhone: "05423330044",
        serviceId: createdServices[8]._id, // Manikür
        personnelId: createdPersonnel[2]._id,
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        status: "tamamlandi",
      },
      {
        customerName: "Aylin Demir",
        customerPhone: "05425550066",
        serviceId: createdServices[11]._id, // Cilt Bakımı
        personnelId: createdPersonnel[1]._id,
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 40),
        status: "tamamlandi",
      },
      {
        customerName: "Gamze Şahin",
        customerPhone: "05426660077",
        serviceId: createdServices[1]._id, // Mega Volume
        personnelId: createdPersonnel[3]._id,
        appointmentTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        status: "tamamlandi",
      },
    ];

    const createdAppointments = await Appointment.insertMany(appointments);
    console.log(`${createdAppointments.length} randevu eklendi`);

    console.log("\n✅ Seed işlemi tamamlandı!");
    console.log("---");
    console.log("Hizmetler:", createdServices.length);
    console.log("Personel:", createdPersonnel.length);
    console.log("Randevular:", createdAppointments.length);

    process.exit(0);
  } catch (error) {
    console.error("Seed hatası:", error.message);
    process.exit(1);
  }
};

seedDB();
