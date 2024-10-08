// backend/services/cacheService.js

let cache = {};

const scheduleCacheUpdate = (key, fetchFunction, interval) => {
  // Führt die fetchFunction sofort aus und speichert die Daten im Cache
  const updateCache = async () => {
    try {
      const data = await fetchFunction();
      setCache(key, data, interval);
      console.log(`Cache aktualisiert: key=${key}`);
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
  console.log(`Setze Cache: key=${key}, ttl=${ttl}, expiry=${expiry}`);
};

/**
 * Daten aus dem Cache abrufen.
 * @param {string} key - Der Schlüssel für den Cache-Eintrag.
 * @returns {any} - Die gespeicherten Daten oder null, wenn der Cache abgelaufen ist.
 */
const getCache = (key) => {
  const cacheEntry = cache[key];
  if (cacheEntry && Date.now() < cacheEntry.expiry) {
    console.log(`Cache-Hit: key=${key}`);
    return cacheEntry.data;
  }
  console.log(`Cache-Miss oder abgelaufen: key=${key}`);
  return null;
};

/**
 * Prüfen, ob die Daten aktualisiert wurden.
 * @param {string} key - Der Schlüssel für den Cache-Eintrag.
 * @returns {boolean} - True, wenn die Daten aktualisiert wurden.
 */
const isCacheUpdated = (key) => {
  const updated = cache[key]?.isUpdated || false;
  console.log(`Cache-Update-Status: key=${key}, isUpdated=${updated}`);
  return updated;
};

/**
 * Markieren, dass die Daten nicht mehr aktualisiert sind.
 * @param {string} key - Der Schlüssel für den Cache-Eintrag.
 */
const resetCacheUpdateStatus = (key) => {
  if (cache[key]) {
    cache[key].isUpdated = false;
    console.log(`Cache-Update-Status zurückgesetzt: key=${key}`);
  }
};

module.exports = {
  setCache,
  getCache,
  isCacheUpdated,
  resetCacheUpdateStatus,
  scheduleCacheUpdate,
};
