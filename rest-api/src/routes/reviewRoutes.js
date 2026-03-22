const express = require("express");
const router = express.Router();
const { sendReviewRequest } = require("../controllers/reviewController");

// POST /api/v1/reviews/request — Google değerlendirme mesajı (Gereksinim 6)
router.post("/request", sendReviewRequest);

module.exports = router;
