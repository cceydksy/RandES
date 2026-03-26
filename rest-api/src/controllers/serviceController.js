const Service = require("../models/Service");

// GET /api/v1/services
const listServices = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isActive: true };
    if (category) filter.category = category;
    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    const grouped = services.reduce((acc, s) => {
      const c = s.category;
      if (!acc[c]) acc[c] = [];
      acc[c].push({ _id: s._id, name: s.name, price: s.price, durationMinutes: s.durationMinutes, renewalDays: s.renewalDays, description: s.description });
      return acc;
    }, {});
    res.status(200).json({ success: true, message: "Hizmetler başarıyla listelendi", totalCount: services.length, categories: Object.keys(grouped), data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: "Hizmetler getirilemedi", error: error.message });
  }
};

// POST /api/v1/services
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, message: "Hizmet başarıyla eklendi", data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: "Hizmet eklenemedi", error: error.message });
  }
};

// PUT /api/v1/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: "Hizmet bulunamadı" });
    res.status(200).json({ success: true, message: "Hizmet güncellendi", data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: "Hizmet güncellenemedi", error: error.message });
  }
};

// DELETE /api/v1/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Hizmet bulunamadı" });
    res.status(200).json({ success: true, message: "Hizmet silindi", data: { deletedId: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Hizmet silinemedi", error: error.message });
  }
};

module.exports = { listServices, createService, updateService, deleteService };
