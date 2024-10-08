const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const haRoutes = require("./routes/haRoutes");
const dataRoutes = require("./routes/dataRoutes");

require("./services/homeAssistantService");

const app = express();
const port = process.env.PORT || 3000;

// CORS aktivieren
app.use(cors());
app.use(express.json());
app.use("/api/ha", haRoutes);
app.use("/api/data", dataRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
