// backend/services/homeAssistantService.js

const axios = require("axios");
const { scheduleCacheUpdate } = require("./cacheService");

// Den Intervall aus der Umgebungsvariable lesen oder einen Standardwert verwenden
const CACHE_UPDATE_INTERVAL =
  process.env.CACHE_UPDATE_INTERVAL || 5 * 60 * 1000; // Fallback zu 5 Minuten

const fetchData = async ({ method, endpoint, data = null }) => {
  try {
    const url = `${process.env.HA_URL}/api/${endpoint}`;
    const options = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${process.env.HA_TOKEN}`,
        "Content-Type": "application/json",
      },
      data,
    };

    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error(
      `Fehler beim Abrufen der Daten von ${endpoint} mit Methode: ${method}:`,
      error
    );
    throw new Error(
      `Fehler beim Abrufen der Daten von ${endpoint} mit Methode: ${method}.`
    );
  }
};

const fetchStatusData = async () => {
  const data = await fetchData({ method: "get", endpoint: "" });
  return data;
};

const fetchStatesData = async () => {
  const data = await fetchData({ method: "get", endpoint: "states" });
  return data;
};

const fetchConfigData = async () => {
  const data = await fetchData({
    method: "get",
    endpoint: "config",
  });
  return data;
};

const fetchShellyButton_HueArea_AutomationData = async () => {
  const states = await fetchData({ method: "get", endpoint: "states" });
  const _sbhaAutomations = await fetchData({
    method: "post",
    endpoint: "template",
    data: {
      template: `{{ label_entities('shellybutton_huearea_automation')}}`,
    },
  });
  const sbhaAutomations = _sbhaAutomations
    .replace(/[\[\]']/g, "")
    .split(",")
    .map((item) => item.trim());
  const auotmationIDs = states
    .filter((entity) => sbhaAutomations.includes(entity.entity_id))
    .map((entity) => entity.attributes.id);

  const automations = await Promise.all(
    auotmationIDs.map(async (id) =>
      fetchData({ method: "get", endpoint: `config/automation/config/${id}` })
    )
  );
  return automations;
};

const fetchAreasData = async () => {
  const data = await fetchData({
    method: "post",
    endpoint: "template",
    data: { template: "{{ areas() }}" },
  });
  return data;
};

const fetchLabelsData = async () => {
  const data = await fetchData({
    method: "post",
    endpoint: "template",
    data: { template: "{{ labels()}}" },
  });
  // wenn data ein arrey ist müssen wir ein for über das arrey machen
  if (typeof data === "string") {
    const cleanedStr = data.replace(/[\[\]']/g, "");
    const array = cleanedStr.split(",").map((item) => item.trim());
    newReturn = {};
    if (Array.isArray(array)) {
      for (let i = 0; i < array.length; i++) {
        newReturn[array[i]] = await fetchData({
          method: "post",
          endpoint: "template",
          data: { template: `{{ label_entities('${array[i]}')}}` },
        });
      }
      return newReturn;
    }
  }
  return data;
};

scheduleCacheUpdate("status", fetchStatusData, CACHE_UPDATE_INTERVAL);
scheduleCacheUpdate("states", fetchStatesData, CACHE_UPDATE_INTERVAL);
scheduleCacheUpdate("config", fetchConfigData, CACHE_UPDATE_INTERVAL);
scheduleCacheUpdate("areas", fetchAreasData, CACHE_UPDATE_INTERVAL);
scheduleCacheUpdate("labels", fetchLabelsData, CACHE_UPDATE_INTERVAL);
scheduleCacheUpdate(
  "shellybutton_huearea_automation",
  fetchShellyButton_HueArea_AutomationData,
  CACHE_UPDATE_INTERVAL
);
//scheduleCacheUpdate("automations", fetchLabelsData, CACHE_UPDATE_INTERVAL);
