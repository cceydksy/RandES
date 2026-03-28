const Appointment = require("../models/Appointment");

const analyzeCustomerRisk = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "tamamlandi" })
      .populate("serviceId", "name category renewalDays price")
      .populate("personnelId", "name")
      .sort({ appointmentTime: -1 });

    if (appointments.length === 0) {
      return res.status(200).json({ success: true, summary: { totalCustomers: 0, atRiskCount: 0, safeCount: 0, riskRate: "0%" }, data: { atRisk: [], safe: [] } });
    }

    const customerMap = {};
    appointments.forEach((apt) => {
      const key = apt.customerPhone;
      if (!customerMap[key]) {
        customerMap[key] = { customerName: apt.customerName, customerPhone: apt.customerPhone, lastAppointment: apt, appointments: [] };
      }
      customerMap[key].appointments.push(apt);
    });

    const now = new Date();
    const atRisk = [];
    const safe = [];

    for (const [phone, customer] of Object.entries(customerMap)) {
      const lastApt = customer.lastAppointment;
      const renewalDays = lastApt.serviceId?.renewalDays || 30;
      const daysSince = Math.floor((now - new Date(lastApt.appointmentTime)) / (1000 * 60 * 60 * 24));
      const daysOverdue = daysSince - renewalDays;

      if (daysOverdue > 0 && renewalDays < 365) {
        let riskLevel = "orta";
        if (daysOverdue > renewalDays * 0.5) riskLevel = "yuksek";

        let reminderMessage = "";

        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (apiKey) {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: `Bir güzellik salonu müşterisine sıcak ve samimi bir hatırlatma mesajı yaz. Türkçe olsun. WhatsApp mesajı formatında olsun, kısa ve öz.
Müşteri adı: ${customer.customerName}
Son hizmet: ${lastApt.serviceId?.name || "bilinmiyor"}
Son ziyaretten bu yana geçen gün: ${daysSince}
Normal yenileme süresi: ${renewalDays} gün
Gecikme: ${daysOverdue} gün
Sadece mesajı yaz, başka açıklama ekleme.`
                    }]
                  }]
                }),
              }
            );
            const geminiData = await geminiRes.json();
            reminderMessage = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          }
        } catch (aiError) {
          console.log("Gemini API hatası:", aiError.message);
        }

        if (!reminderMessage) {
          reminderMessage = `Merhaba ${customer.customerName}! 🌸 Son ${lastApt.serviceId?.name || "işlem"} hizmetinizin üzerinden ${daysSince} gün geçti. Yenileme zamanınız ${daysOverdue} gün geçmiş durumda. Sizi tekrar salonumuzda görmek isteriz!`;
        }

        atRisk.push({
          customerName: customer.customerName,
          customerPhone: customer.customerPhone,
          lastService: lastApt.serviceId?.name || "Bilinmiyor",
          lastVisitDate: lastApt.appointmentTime,
          daysSinceLastVisit: daysSince,
          renewalDays,
          daysOverdue,
          riskLevel,
          reminderMessage,
          totalVisits: customer.appointments.length,
        });
      } else if (renewalDays < 365) {
        safe.push({
          customerName: customer.customerName,
          customerPhone: customer.customerPhone,
          lastService: lastApt.serviceId?.name || "Bilinmiyor",
          daysSinceLastVisit: daysSince,
          renewalDays,
          daysUntilRenewal: Math.max(0, renewalDays - daysSince),
          totalVisits: customer.appointments.length,
        });
      }
    }

    atRisk.sort((a, b) => b.daysOverdue - a.daysOverdue);
    const total = atRisk.length + safe.length;

    res.status(200).json({
      success: true,
      message: "Müşteri kayıp riski analizi tamamlandı (Gemini AI destekli)",
      summary: {
        totalCustomers: total,
        atRiskCount: atRisk.length,
        safeCount: safe.length,
        riskRate: total > 0 ? `%${Math.round((atRisk.length / total) * 100)}` : "0%",
      },
      data: { atRisk, safe },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Analiz yapılamadı", error: error.message });
  }
};

module.exports = { analyzeCustomerRisk };
