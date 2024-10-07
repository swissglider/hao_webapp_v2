const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// CORS aktivieren
app.use(cors());

app.get("/api/ha", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.HA_URL}/api/`, {
      headers: { Authorization: `Bearer ${process.env.HA_TOKEN}` },
    });
    console.log(
      "Erfolgreiche Antwort:",
      JSON.stringify(response.data, null, 2)
    ); // Erfolgsfall
    res.json(response.data);
  } catch (error) {
    console.error(
      "Fehler bei der Anfrage:",
      JSON.stringify(
        error.response ? error.response.data : error.message,
        null,
        2
      )
    ); // Fehlerfall
    res.status(500).json({ error: "Failed to fetch data from Home Assistant" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
