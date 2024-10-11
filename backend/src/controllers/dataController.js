const cacheService = require("../services/cacheService");

const getShellyButtonLabelData = (req, res) => {
  let updated = false;

  // get shelly buttons
  const shellyButtonDeviceIDs = cacheService
    .getCache("labels")
    ["shelly_button"].replace(/[\[\]']/g, "")
    .split(",")
    .map((item) => item.trim());
  cacheService.resetCacheUpdateStatus("labels");
  updated = updated && cacheService.isCacheUpdated("labels");

  // get states
  const states = cacheService.getCache("states");
  cacheService.resetCacheUpdateStatus("states");
  updated = updated && cacheService.isCacheUpdated("states");
  const shellyButtonDevices = states.filter((entity) =>
    shellyButtonDeviceIDs.includes(entity.entity_id)
  );

  // get rooms and zones with lights
  let hue_types = {};
  states.forEach((entity) => {
    if (
      entity.attributes &&
      entity.attributes.hue_type &&
      entity.attributes.hue_type != "" &&
      entity.attributes.is_hue_group === true &&
      entity.attributes.entity_id &&
      entity.attributes.entity_id.length > 0 &&
      entity.attributes.hue_scenes &&
      entity.attributes.hue_scenes.length > 0
    ) {
      // füge hue_type zum hue_types
      if (!hue_types.hasOwnProperty(entity.attributes.hue_type)) {
        hue_types[entity.attributes.hue_type] = [];
      }

      // füge entity zu hue_types hinzu
      hue_types[entity.attributes.hue_type].push({
        hue_area_name: entity.attributes.friendly_name,
        hue_light_enities: entity.attributes.entity_id,
        hue_light_names: entity.attributes.lights,
        hue_scenes: entity.attributes.hue_scenes
          .map((scene) =>
            states.find(
              (s) =>
                s.attributes &&
                s.attributes.group_name &&
                s.attributes.group_name === entity.attributes.friendly_name &&
                s.attributes.name &&
                s.attributes.name === scene
            )
          )
          .filter((scene) => scene !== null && scene !== undefined)
          .map((scene) => ({
            scene_name: scene.attributes.name,
            scene_entity_id: scene.entity_id,
          })),
      });
    }
  });
  return [updated, shellyButtonDevices, hue_types];
};

const shellybuttonlabeld = (req, res) => {
  try {
    [updated, shellyButtonDevices, hue_types] = getShellyButtonLabelData(
      req,
      res
    );
    // return
    return res.json({
      data: {
        shelly_buttons: shellyButtonDevices.map((device) => ({
          friendly_name: device.attributes.friendly_name,
          entity_id: device.entity_id,
        })),
        hue_areas: hue_types,
      },
      updated,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(404)
      .json({ error: `Keine Label Daten im Cache verfügbar.` });
  }
};

// Generische Funktion zum Abrufen von Daten aus dem Cache
const shellybutton_huearea_automation = (req, res) => {
  const cacheKey = "shellybutton_huearea_automation";
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

module.exports = {
  shellybuttonlabeld,
  shellybutton_huearea_automation,
};
