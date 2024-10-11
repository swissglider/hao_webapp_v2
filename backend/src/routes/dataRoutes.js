// backend/routes/dataRoutes.js

const express = require("express");
const dataController = require("../controllers/dataController");

const router = express.Router();

// Middleware zum Ausgeben aller Routenpunkte
router.use((req, res, next) => {
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Wenn es eine Route gibt
      const route = middleware.route;
      const method = Object.keys(route.methods)[0].toUpperCase();
      console.log(`${method} ${route.path}`);
    }
  });
  next();
});

// Dynamisch alle Funktionen aus dataController verwenden
Object.keys(dataController).forEach((key) => {
  if (typeof dataController[key] === "function") {
    // Beispiel: GET /api/data/temperature
    router.get(`/${key}`, dataController[key]);
  }
});

const printRoutes = (router) => {
  console.log("Definierte Routen:");
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Wenn es eine Route gibt
      const route = middleware.route;
      const method = Object.keys(route.methods)[0].toUpperCase();
      console.log(`${method} /api/data/${route.path}`);
    }
  });
};
// Routen ausgeben
printRoutes(router);

module.exports = router;
