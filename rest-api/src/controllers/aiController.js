const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

const analyzeCustomerRisk = async (req, res) => {
  try {
    // Tamamlanmış randevuları getir
    const appointments = await Appointment.find({ status: "tamamlandi" })
      .populate("serviceId", "name category renewalDays price")
      .populate("personnelId", "name")
      .sort({ appointmentTime: -1 });

    if (appointments.length === 0) {
      return res.status(200).json({ success: true, summary: { totalCustomers: 0, atRiskCount: 0, safeCount: 0, riskRate: "0%" }, data: { atRisk: [], safe: [] } });
    }

    // Müşteri bazında son randevuları grupla
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

    // Her müşteri için risk analizi
    for (const [phone, customer] of Object.entries(customerMap)) {
      const lastApt = customer.lastAppointment;
      const renewalDays = lastApt.serviceId?.renewalDays || 30;
      const daysSince = Math.floor((now - new Date(lastApt.appointmentTime)) / (1000 * 60 * 60 * 24));
      const daysOverdue = daysSince - renewalDays;

      if (daysOverdue > 0 && renewalDays < 365) {
        let riskLevel = "orta";
        if (daysOverdue > renewalDays * 0.5) riskLevel = "yuksek";

        let reminderMessage = "";

        // Anthropic API ile kişiselleştirilmiş mesaj oluştur
        try {
          const apiKey = process.env.ANTHROPIC_API_KEY;
          if (apiKey) {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
              body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 200,
                messages: [{ role: "user", content: `Bir güzellik salonu müşterisine sıcak ve samimi bir hatırlatma mesajı yaz. Müşteri adı: ${customer.customerName}. Son yaptırdığı hizmet: ${lastApt.serviceId?.name || "bilinmiyor"}. Son ziyaretinden ${daysSince} gün geçti, normalde ${renewalDays} günde yenileme yapılmalıydı. Mesaj kısa, samimi ve WhatsApp'tan gönderilecek gibi olsun. Sadece mesajı yaz, başka bir şey ekleme.` }]
              })
            });
            const data = await response.json();
            reminderMessage = data.content?.[0]?.text || "";
          }
        } catch (aiError) {
          console.log("AI mesaj oluşturulamadı, varsayılan kullanılıyor");
        }

        if (!reminderMessage) {
          reminderMessage = `Merhaba ${customer.customerName}! 🌸 Son ${lastApt.serviceId?.name || "işlem"} hizmetinizin üzerinden ${daysSince} gün geçti. Yenileme zamanınız ${daysOverdue} gün geçmiş durumda. Sizi tekrar salonumuzda görmek isteriz!`;
        }

        atRisk.push({ customerName: customer.customerName, customerPhone: customer.customerPhone, lastService: lastApt.serviceId?.name || "Bilinmiyor", lastVisitDate: lastApt.appointmentTime, daysSinceLastVisit: daysSince, renewalDays, daysOverdue, riskLevel, reminderMessage, totalVisits: customer.appointments.length });
      } else if (renewalDays < 365) {
        safe.push({ customerName: customer.customerName, customerPhone: customer.customerPhone, lastService: lastApt.serviceId?.name || "Bilinmiyor", daysSinceLastVisit: daysSince, renewalDays, daysUntilRenewal: Math.max(0, renewalDays - daysSince), totalVisits: customer.appointments.length });
      }
    }

    atRisk.sort((a, b) => b.daysOverdue - a.daysOverdue);
    const total = atRisk.length + safe.length;

    res.status(200).json({
      success: true,
      message: "Müşteri kayıp riski analizi tamamlandı",
      summary: { totalCustomers: total, atRiskCount: atRisk.length, safeCount: safe.length, riskRate: total > 0 ? `%${Math.round((atRisk.length / total) * 100)}` : "0%" },
      data: { atRisk, safe },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Analiz yapılamadı", error: error.message });
  }
};

module.exports = { analyzeCustomerRisk };
