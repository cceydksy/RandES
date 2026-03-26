const express = require("express");
const router = express.Router();
const { listServices, createService, updateService, deleteService } = require("../controllers/serviceController");

router.get("/", listServices);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
