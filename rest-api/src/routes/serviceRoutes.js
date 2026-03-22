const express = require("express");
const router = express.Router();
const { listServices, createService } = require("../controllers/serviceController");

// GET  /api/v1/services — Hizmet listele (Gereksinim 3)
router.get("/", listServices);

// POST /api/v1/services — Hizmet ekle (yardımcı)
router.post("/", createService);

module.exports = router;
