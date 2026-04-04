const mongoose = require("mongoose");

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://ceydanurr82_db_user:VqjQ9BTX53qlikVG@randes.rf5tirc.mongodb.net/randes?retryWrites=true&w=majority";

// Turkish first names (female-focused for beauty salon)
const turkishFirstNames = [
  "Ayşe", "Fatma", "Zeynep", "Elif", "Merve", "Büşra", "Esra", "Seda", "Derya", "Gamze",
  "Özlem", "Sibel", "Sevgi", "Gül", "Aslı", "Pınar", "Ceren", "İrem", "Ebru", "Deniz",
  "Melek", "Yasemin", "Selin", "Ezgi", "Burcu", "Tuğba", "Hande", "Şeyma", "Beyza", "Cansu",
  "Dilara", "Ece", "Fulya", "Gizem", "Hilal", "İpek", "Kübra", "Lale", "Meltem", "Nalan",
  "Nur", "Özge", "Pembe", "Rabia", "Sema", "Tuba", "Ümit", "Vildan", "Yeliz", "Zehra"
];

// Turkish last names
const turkishLastNames = [
  "Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir",
  "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek",
  "Polat", "Korkmaz", "Acar", "Aktaş", "Tekin", "Güneş", "Erdoğan", "Aksoy", "Taş", "Güler",
  "Bayrak", "Bulut", "Çakır", "Duman", "Erdem", "Gökhan", "Kaplan", "Keskin", "Özer", "Sarı",
  "Türk", "Uçar", "Uzun", "Yavuz", "Zengin", "Akın", "Bilgin", "Candan", "Duran", "Eren"
];

// Generate random Turkish phone number
function generatePhoneNumber() {
  const prefixes = ["530", "531", "532", "533", "534", "535", "536", "537", "538", "539",
                    "540", "541", "542", "543", "544", "545", "546", "547", "548", "549",
                    "550", "551", "552", "553", "554", "555", "556", "557", "558", "559"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
  return `0${prefix}${number}`;
}

// Generate random name
function generateName() {
  const firstName = turkishFirstNames[Math.floor(Math.random() * turkishFirstNames.length)];
  const lastName = turkishLastNames[Math.floor(Math.random() * turkishLastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate random date within range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Set appointment time to business hours (9:00 - 19:00)
function setBusinessHours(date) {
  const hours = 9 + Math.floor(Math.random() * 10); // 9-18
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Notes for appointments
const appointmentNotes = [
  "", "", "", // Most appointments have no notes
  "İlk randevu",
  "Düğün hazırlığı",
  "Özel gün",
  "Hızlı işlem isteniyor",
  "Alerjisi var, dikkat edilmeli",
  "Önceki randevudan memnun kaldı",
  "Arkadaş tavsiyesi ile geldi",
  "Sosyal medyadan gördü",
  "Hassas cilt",
  "Doğal görünüm istiyor",
  "Yoğun bakım tercih ediyor"
];

async function seedAppointments() {
  try {
    // Connect to MongoDB
    console.log("MongoDB'ye bağlanılıyor...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB bağlantısı başarılı!\n");

    // Get collections
    const Service = mongoose.model("Service", new mongoose.Schema({}, { strict: false }), "services");
    const Personnel = mongoose.model("Personnel", new mongoose.Schema({}, { strict: false }), "personnels");
    const Appointment = mongoose.model("Appointment", new mongoose.Schema({}, { strict: false }), "appointments");

    // Fetch services and staff
    console.log("Hizmetler ve personel verileri çekiliyor...\n");

    const services = await Service.find({});
    const staffs = await Personnel.find({});

    console.log("=== HİZMETLER ===");
    services.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} - ${s.category} - ${s.price}₺ - ${s.durationMinutes} dk`);
    });

    console.log("\n=== PERSONELLER ===");
    staffs.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - Uzmanlık: ${p.specialties?.join(", ") || "Belirtilmemiş"}`);
    });

    if (services.length === 0 || staffs.length === 0) {
      console.log("\nHizmet veya personel bulunamadı! Önce bu verileri eklemelisiniz.");
      await mongoose.disconnect();
      return;
    }

    // Date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastStart = new Date(today);
    pastStart.setDate(pastStart.getDate() - 30); // 30 days ago

    const pastEnd = new Date(today);
    pastEnd.setDate(pastEnd.getDate() - 1); // Yesterday

    const futureEnd = new Date(today);
    futureEnd.setDate(futureEnd.getDate() + 7); // Next week

    // Generate 100 appointments
    console.log("\n100 örnek randevu oluşturuluyor...\n");

    const appointments = [];

    // Distribution: 50 past, 10 today, 40 future
    const distribution = [
      { count: 50, type: "past", statuses: ["tamamlandi", "tamamlandi", "tamamlandi", "iptal"] },
      { count: 10, type: "today", statuses: ["onaylandi", "onaylandi", "beklemede"] },
      { count: 40, type: "future", statuses: ["onaylandi", "beklemede", "beklemede"] }
    ];

    for (const dist of distribution) {
      for (let i = 0; i < dist.count; i++) {
        let appointmentDate;

        if (dist.type === "past") {
          appointmentDate = setBusinessHours(randomDate(pastStart, pastEnd));
        } else if (dist.type === "today") {
          appointmentDate = new Date(today);
          appointmentDate = setBusinessHours(appointmentDate);
        } else {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          appointmentDate = setBusinessHours(randomDate(tomorrow, futureEnd));
        }

        // Random service and matching personnel
        const service = services[Math.floor(Math.random() * services.length)];

        // Try to match personnel with service category
        let personnel;
        const matchingStaff = staffs.filter(s =>
          s.specialties && s.specialties.includes(service.category)
        );

        if (matchingStaff.length > 0) {
          personnel = matchingStaff[Math.floor(Math.random() * matchingStaff.length)];
        } else {
          personnel = staffs[Math.floor(Math.random() * staffs.length)];
        }

        const status = dist.statuses[Math.floor(Math.random() * dist.statuses.length)];
        const note = appointmentNotes[Math.floor(Math.random() * appointmentNotes.length)];

        const appointment = {
          customerName: generateName(),
          customerPhone: generatePhoneNumber(),
          serviceId: service._id,
          personnelId: personnel._id,
          appointmentTime: appointmentDate,
          status: status,
          notes: note,
          createdAt: new Date(appointmentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          updatedAt: appointmentDate
        };

        // Add confirmation sent for approved/completed appointments
        if (status === "onaylandi" || status === "tamamlandi") {
          appointment.confirmationSentAt = new Date(appointment.createdAt.getTime() + 60000);
        }

        // Add review sent for completed appointments (some of them)
        if (status === "tamamlandi" && Math.random() > 0.5) {
          appointment.reviewSentAt = new Date(appointmentDate.getTime() + 2 * 60 * 60 * 1000);
        }

        appointments.push(appointment);
      }
    }

    // Insert appointments
    const result = await Appointment.insertMany(appointments);

    console.log(`✅ ${result.length} randevu başarıyla eklendi!\n`);

    // Summary
    const summary = {
      "Geçmiş (tamamlandi/iptal)": appointments.filter(a => a.appointmentTime < today).length,
      "Bugün": appointments.filter(a => {
        const d = new Date(a.appointmentTime);
        return d.toDateString() === today.toDateString();
      }).length,
      "Gelecek": appointments.filter(a => a.appointmentTime > today).length
    };

    const statusSummary = {};
    appointments.forEach(a => {
      statusSummary[a.status] = (statusSummary[a.status] || 0) + 1;
    });

    console.log("=== ÖZET ===");
    console.log("Tarih dağılımı:", summary);
    console.log("Durum dağılımı:", statusSummary);

    // Show some sample appointments
    console.log("\n=== ÖRNEK RANDEVULAR ===");
    for (let i = 0; i < 5; i++) {
      const apt = appointments[i];
      const svc = services.find(s => s._id.toString() === apt.serviceId.toString());
      const prs = staffs.find(p => p._id.toString() === apt.personnelId.toString());
      console.log(`${apt.customerName} - ${svc?.name} - ${prs?.name} - ${apt.appointmentTime.toLocaleString("tr-TR")} - ${apt.status}`);
    }

    await mongoose.disconnect();
    console.log("\nMongoDB bağlantısı kapatıldı.");

  } catch (error) {
    console.error("Hata:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAppointments();
