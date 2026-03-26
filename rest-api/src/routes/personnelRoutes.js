const express = require("express");
const router = express.Router();
const { getPersonnelNotifications, getPersonnelEarnings, createPersonnel, getAllPersonnel, updatePersonnelInfo, deletePersonnel } = require("../controllers/personnelController");

router.get("/", getAllPersonnel);
router.post("/", createPersonnel);
router.put("/:id", updatePersonnelInfo);
router.delete("/:id", deletePersonnel);
router.get("/notifications", getPersonnelNotifications);
router.get("/earnings", getPersonnelEarnings);

module.exports = router;
