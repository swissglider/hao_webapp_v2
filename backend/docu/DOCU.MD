# DOCU.md

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Technologie-Stack](#technologie-stack)
- [Projektstruktur](#projektstruktur)
- [Konfiguration (.env)](#konfiguration-env)
- [Cache-Mechanismus](#cache-mechanismus)
- [API-Routen](#api-routen)
- [Controller](#controller)
- [Home Assistant Service](#home-assistant-service)
- [Datenfluss: Beispiel /api/data/status](#datenfluss-beispiel-apidatastatus)
- [Automatische Datenaktualisierung](#automatische-datenaktualisierung)

## Überblick

Dieses Backend ist eine Node.js-Express-Anwendung, die Daten von einem Home Assistant Server abruft und in einem einfachen In-Memory-Cache speichert. Es bietet eine API, um diese Daten bereitzustellen und das Cache-Management zu optimieren.

## Technologie-Stack

- **Node.js**: Laufzeitumgebung für JavaScript
- **Express.js**: Web-Framework für Node.js
- **Axios**: HTTP-Client zum Abrufen der Daten von externen APIs
- **dotenv**: Zum Laden von Umgebungsvariablen aus einer `.env`-Datei

## Projektstruktur

```
/backend
|-- /controllers
|   |-- dataController.js
|-- /services
|   |-- homeAssistantService.js
|   |-- cacheService.js
|-- /routes
|   |-- dataRoutes.js
|-- .env
|-- server.js
```

## Konfiguration (.env)

Die `.env`-Datei enthält wichtige Konfigurationswerte wie URL und Token für den Home Assistant sowie den Cache-Update-Intervall. Beispiel:

```env
PORT=3000
HA_URL=http://dein-home-assistant-server
HA_TOKEN=dein-token
CACHE_UPDATE_INTERVAL=300000  # Intervall für die Cache-Aktualisierung in Millisekunden (hier: 5 Minuten)
```

- **PORT**: Der Port, auf dem der Express-Server läuft.
- **HA_URL**: Die Basis-URL des Home Assistant Servers.
- **HA_TOKEN**: Der API-Token für den Zugriff auf den Home Assistant.
- **CACHE_UPDATE_INTERVAL**: Zeitintervall in Millisekunden, nach dem die Daten vom Home Assistant Server erneut abgerufen und der Cache aktualisiert wird.

## Cache-Mechanismus

Der Cache wird in einem einfachen JavaScript-Objekt (`cache`) gespeichert. Er speichert die Daten, das Ablaufdatum und den Status, ob die Daten kürzlich aktualisiert wurden. Der Cache-Mechanismus umfasst folgende Funktionen:

- **`setCache(key, data, ttl)`**: Speichert Daten im Cache unter einem bestimmten Schlüssel mit einer Time-to-Live (TTL).
- **`getCache(key)`**: Gibt die im Cache gespeicherten Daten zurück, wenn sie noch gültig sind.
- **`isCacheUpdated(key)`**: Überprüft, ob die Daten im Cache aktualisiert wurden.
- **`resetCacheUpdateStatus(key)`**: Setzt den Aktualisierungsstatus zurück, nachdem die Daten abgerufen wurden.

## API-Routen

Die Routen befinden sich in der Datei `dataRoutes.js` und definieren die Endpunkte für den Datenzugriff:

```javascript
// backend/routes/dataRoutes.js

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

module.exports = router;
```

Der `/status`-Endpunkt ruft den `getStatusData`-Controller auf, um die Statusdaten bereitzustellen.

## Controller

Der Controller für die Daten befindet sich in `dataController.js` und verarbeitet die Anfragen für den Endpunkt `/api/data/status`.

```javascript
// backend/controllers/dataController.js

const {
  getCache,
  isCacheUpdated,
  resetCacheUpdateStatus,
} = require("../services/cacheService");

const getStatusData = (req, res) => {
  const statusData = getCache("status");

  if (statusData) {
    const isUpdated = isCacheUpdated("status");
    res.json({ data: statusData, isUpdated });
    resetCacheUpdateStatus("status");
  } else {
    res.status(404).json({ message: "Statusdaten nicht verfügbar" });
  }
};

module.exports = {
  getStatusData,
};
```

### Funktionsweise des `getStatusData`-Controllers:

- Ruft die Statusdaten aus dem Cache ab.
- Überprüft, ob die Daten aktualisiert wurden.
- Sendet die Daten im JSON-Format zurück, zusammen mit einem Flag `isUpdated`.
- Setzt den Aktualisierungsstatus nach dem Abruf zurück.

## Home Assistant Service

Der Service `homeAssistantService.js` verwaltet den Abruf der Daten vom Home Assistant Server und die Speicherung im Cache.

```javascript
// backend/services/homeAssistantService.js

const axios = require("axios");
const { setCache, scheduleCacheUpdate } = require("./cacheService");

const CACHE_UPDATE_INTERVAL =
  process.env.CACHE_UPDATE_INTERVAL || 5 * 60 * 1000;

const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${process.env.HA_URL}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.HA_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Abrufen der Daten von ${endpoint}:`, error);
    throw new Error(`Fehler beim Abrufen der Daten von ${endpoint}.`);
  }
};

const fetchStatusData = async () => {
  const data = await fetchData("");
  return data;
};

// Automatische Aktualisierung der Statusdaten
scheduleCacheUpdate("status", fetchStatusData, CACHE_UPDATE_INTERVAL);
```

### Funktionsweise:

- Ruft Daten vom Home Assistant Server ab.
- Speichert die abgerufenen Daten im Cache und plant die automatische Aktualisierung im angegebenen Intervall (`CACHE_UPDATE_INTERVAL`).

## Datenfluss: Beispiel /api/data/status

1. **Start des Servers**: Beim Starten des Servers wird `scheduleCacheUpdate` im `homeAssistantService.js` aufgerufen, um die Daten regelmäßig zu aktualisieren.
2. **Abrufen von Statusdaten**: `fetchStatusData` ruft die Statusdaten vom Home Assistant ab und speichert sie im Cache.
3. **Abruf über API-Endpunkt**: Eine Anfrage an `GET /api/data/status` wird an `getStatusData` weitergeleitet.
4. **Daten aus dem Cache**: `getStatusData` ruft die Daten aus dem Cache ab, überprüft den Aktualisierungsstatus und sendet die Daten als JSON-Antwort an den Client.

## Automatische Datenaktualisierung

Die automatische Aktualisierung der Cache-Daten erfolgt durch die `scheduleCacheUpdate`-Funktion. Sie stellt sicher, dass die Daten regelmäßig vom Home Assistant Server abgerufen und aktualisiert werden.

```javascript
// backend/services/cacheService.js

const scheduleCacheUpdate = (key, fetchFunction, interval) => {
  const updateCache = async () => {
    try {
      const data = await fetchFunction();
      setCache(key, data, interval);
      console.log(`Cache für ${key} aktualisiert.`);
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Caches für ${key}:`, error);
    }
  };

  updateCache(); // Direktes Laden beim Start
  setInterval(updateCache, interval); // Wiederholtes Laden nach dem festgelegten Intervall
};
```

### Ablauf:

- `scheduleCacheUpdate` wird beim Start des Servers aufgerufen, um sofort Daten zu laden und dann in regelmäßigen Intervallen zu aktualisieren.
- Der Intervall wird über die `.env`-Datei konfiguriert (`CACHE_UPDATE_INTERVAL`).
- Bei jedem Intervall werden neue Daten abgerufen und im Cache gespeichert.

---
