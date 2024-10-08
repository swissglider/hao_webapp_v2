const {
  getCache,
  isCacheUpdated,
  resetCacheUpdateStatus,
} = require("../services/cacheService");

// Generische Funktion zum Abrufen von Daten aus dem Cache
const getData = (cacheKey, res) => {
  const data = getCache(cacheKey);
  if (data) {
    const updated = isCacheUpdated(cacheKey);
    resetCacheUpdateStatus(cacheKey);
    return res.json({ data, updated });
  }
  res.status(404).json({ error: `Keine ${cacheKey}daten im Cache verfügbar.` });
};

const getTemperatureData = (req, res) => {
  getData("temperature", res);
};

const getMotionData = (req, res) => {
  getData("motion", res);
};

const getStatusData = (req, res) => {
  console.log("dataController::getStatusData");
  getData("status", res);
};

module.exports = {
  getTemperatureData,
  getMotionData,
  getStatusData,
};
