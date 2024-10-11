// backend/services/cacheService.js

let cache = {};

const scheduleCacheUpdate = (key, fetchFunction, interval) => {
  // Führt die fetchFunction sofort aus und speichert die Daten im Cache
  const updateCache = async () => {
    try {
      const data = await fetchFunction();
      setCache(key, data, interval);
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Caches: key=${key}`, error);
    }
  };

  // Ruft die Funktion sofort auf
  updateCache();

  // Setzt ein Intervall, um die Daten regelmäßig zu aktualisieren
  setInterval(updateCache, interval);
};

/**
 * Daten in den Cache setzen.
 * @param {string} key - Der Schlüssel für den Cache-Eintrag.
 * @param {any} data - Die zu speichernden Daten.
 * @param {number} ttl - Time-to-Live in Millisekunden.
 */
const setCache = (key, data, ttl) => {
  const expiry = Date.now() + ttl;
  cache[key] = { data, expiry, isUpdated: true };
};

/**
 * Daten aus dem Cache abrufen.
 * @param {string} key - Der Schlüssel für den Cache-Eintrag.
 * @returns {any} - Die gespeicherten Daten oder null, wenn der Cache abgelaufen ist.
 */
const getCache = (key) => {
  const cacheEntry = cache[key];
  if (cacheEntry && Date.now() < cacheEntry.expiry) {
    return cacheEntry.data;
  }
  return null;
};

/**
 * Prüfen, ob die Daten aktualisiert wurden.
 * @param {string} key - Der Schlüssel für den Cache-Eintrag.
 * @returns {boolean} - True, wenn die Daten aktualisiert wurden.
 */
const isCacheUpdated = (key) => {
  const updated = cache[key]?.isUpdated || false;
  return updated;
};

/**
 * Markieren, dass die Daten nicht mehr aktualisiert sind.
 * @param {string} key - Der Schlüssel für den Cache-Eintrag.
 */
const resetCacheUpdateStatus = (key) => {
  if (cache[key]) {
    cache[key].isUpdated = false;
  }
};

module.exports = {
  setCache,
  getCache,
  isCacheUpdated,
  resetCacheUpdateStatus,
  scheduleCacheUpdate,
};
