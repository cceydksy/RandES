const express = require("express");
const router = express.Router();
const { analyzeCustomerRisk } = require("../controllers/aiController");

// POST /api/v1/ai/customer-risk — Müşteri kayıp riski analizi (Gereksinim 10)
router.post("/customer-risk", analyzeCustomerRisk);

module.exports = router;
