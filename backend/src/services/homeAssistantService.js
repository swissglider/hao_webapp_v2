// backend/services/homeAssistantService.js

const axios = require("axios");
const { setCache, scheduleCacheUpdate } = require("./cacheService");

// Den Intervall aus der Umgebungsvariable lesen oder einen Standardwert verwenden
const CACHE_UPDATE_INTERVAL =
  process.env.CACHE_UPDATE_INTERVAL || 5 * 60 * 1000; // Fallback zu 5 Minuten

const fetchData = async (endpoint) => {
  console.log(`Abrufen von Daten von Endpoint: ${endpoint}`);
  try {
    const response = await axios.get(`${process.env.HA_URL}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.HA_TOKEN}`,
      },
    });
    console.log(`Erfolgreich Daten von ${endpoint} abgerufen`);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Abrufen der Daten von ${endpoint}:`, error);
    throw new Error(`Fehler beim Abrufen der Daten von ${endpoint}.`);
  }
};

// Spezifische Methoden zum Abrufen von Temperatur- und Bewegungsdaten
const fetchTemperatureData = async () => {
  console.log("Abrufen von Temperaturdaten");
  const data = await fetchData("temperature");
  console.log("Temperaturdaten erfolgreich abgerufen");
  return data;
};

const fetchMotionData = async () => {
  console.log("Abrufen von Bewegungsdaten");
  const data = await fetchData("motion");
  console.log("Bewegungsdaten erfolgreich abgerufen");
  return data;
};

const fetchStatusData = async () => {
  console.log("Abrufen von Statusdaten");
  const data = await fetchData("");
  console.log("Statusdaten erfolgreich abgerufen");
  return data;
};

// Automatische Aktualisierung der Daten alle 5 Minuten
//scheduleCacheUpdate("temperature", fetchTemperatureData, CACHE_UPDATE_INTERVAL);
//scheduleCacheUpdate("motion", fetchMotionData, CACHE_UPDATE_INTERVAL);
scheduleCacheUpdate("status", fetchStatusData, CACHE_UPDATE_INTERVAL);
