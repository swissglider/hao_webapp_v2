const cacheService = require("../services/cacheService");

// Generische Funktion zum Abrufen von Daten aus dem Cache
const getData = (cacheKey, res) => {
  const data = cacheService.getCache(cacheKey);
  if (data) {
    const updated = cacheService.isCacheUpdated(cacheKey);
    cacheService.resetCacheUpdateStatus(cacheKey);
    return res.json({ data, updated });
  }
  res
    .status(404)
    .json({ error: `Keine ${cacheKey} Daten im Cache verfügbar.` });
};

const getStatesData = (req, res) => {
  getData("states", res);
};

const labels = (req, res, paramsObj) => {
  const cacheKey = "labels";
  const data = cacheService.getCache(cacheKey);
  if (data) {
    const updated = cacheService.isCacheUpdated(cacheKey);
    cacheService.resetCacheUpdateStatus(cacheKey);
    if (paramsObj && Object.keys(paramsObj).includes("labelname")) {
      result = data[paramsObj["labelname"]]
        .replace(/[\[\]']/g, "")
        .split(",")
        .map((item) => item.trim());
      return res.json({ data: result, updated: true });
    }
    return res.json({ data: Object.keys(data), updated });
  }
  res.status(404).json({ error: `Keine Label Daten im Cache verfügbar.` });
};

// not finished and not sure if we should use it like this....
const hue_devices = (req, res) => {
  const cacheKey = "states";
  const states = cacheService.getCache(cacheKey);
  if (!states) {
    res.status(404).json({ error: `Keine Hue Devices im Cache verfügbar.` });
  }
  const updated = cacheService.isCacheUpdated(cacheKey);
  cacheService.resetCacheUpdateStatus(cacheKey);

  const data = {};
  const hue_devices = {};

  const scenes = states
    .filter((entity) => entity.entity_id.startsWith("scene."))
    .map((entity) => entity);

  const lights = states
    .filter((entity) => entity.entity_id.startsWith("light."))
    .map((entity) => entity);

  states
    .filter((entity) => entity.attributes.includes("hue_type"))
    .forEach((entity) => {
      hue_type = entity.attributes.includes("hue_type");
      if (hue_devices.includes(hue_type)) {
        hue_devices[hue_type] = [];
      }
      hue_devices[hue_type].push(entity.attributes.frinedly_name);
    });

  //console.log(scenes.map((scene) => ({ ...scene })));
  //console.log(lights.map((light) => ({ ...light })));
  console.log(hue_devices);

  return res.json({ data, updated });
};

module.exports = {
  states: getStatesData,
  status: (req, res) => getData("status", res),
  config: (req, res) => getData("config", res),
  areas: (req, res) => getData("areas", res),
  test: (req, res) => getData("shellybutton_huearea_automation", res),
  labels,
  shellydetachedbereichlabeled: (req, res) =>
    labels(req, res, { labelname: "shellybutton_huearea_automation" }),
  hue_devices,
};
