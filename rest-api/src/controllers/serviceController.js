const Service = require("../models/Service");

// 3) Kategori Bazlı Hizmet Listeleme — GET /api/v1/services
const listServices = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = { isActive: true };
    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter).sort({ category: 1, name: 1 });

    // Kategorilere göre grupla
    const grouped = services.reduce((acc, service) => {
      const cat = service.category;
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push({
        _id: service._id,
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
        renewalDays: service.renewalDays,
        description: service.description,
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: "Hizmetler başarıyla listelendi",
      totalCount: services.length,
      categories: Object.keys(grouped),
      data: grouped,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hizmetler getirilemedi",
      error: error.message,
    });
  }
};

// Hizmet ekleme (seed data için yardımcı)
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      message: "Hizmet başarıyla eklendi",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Hizmet eklenemedi",
      error: error.message,
    });
  }
};

module.exports = {
  listServices,
  createService,
};
