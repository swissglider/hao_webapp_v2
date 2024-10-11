const express = require("express");
const testController = require("../controllers/testController");

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

/**
  Sample call:
  http://localhost:3000/api/test/labelname/labelname=label1/ob=ob1
*/
Object.keys(testController).forEach((key) => {
  if (typeof testController[key] === "function") {
    // Route ohne Parameter
    router.get(`/${key}`, (req, res) => {
      testController[key](req, res);
    });

    // Route mit beliebigen Parametern als Paare
    router.get(`/${key}/*`, (req, res) => {
      const params = req.params[0] ? req.params[0].split("/") : [];
      const paramsObj = params.reduce((acc, param) => {
        const [key, value] = param.split("=");
        acc[key] = value;
        return acc;
      }, {});
      testController[key](req, res, paramsObj);
    });
  }
});

const printRoutes = (router) => {
  console.log("Definierte Routen:");
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Wenn es eine Route gibt
      const route = middleware.route;
      const method = Object.keys(route.methods)[0].toUpperCase();
      console.log(`${method} /api/test/${route.path}`);
    }
  });
};
// Routen ausgeben
printRoutes(router);

module.exports = router;
