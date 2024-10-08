const express = require("express");
const {
  getTemperatureData,
  getMotionData,
  getStatusData,
} = require("../controllers/dataController");

const router = express.Router();

router.get("/temperature", getTemperatureData);
router.get("/motion", getMotionData);
router.get("/status", getStatusData);
router.get("/", getStatusData);

module.exports = router;
