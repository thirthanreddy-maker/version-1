import express from "express";
import { getWeatherForCity } from "./weather.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/weather", async (req, res) => {
  try {
    const weather = await getWeatherForCity(req.query.city);
    return res.json(weather);
  } catch (error) {
    const status = error.status || 500;
    if (status >= 500) console.error("Weather API error:", error);
    return res.status(status).json({ error: error.message || "Unable to fetch weather right now." });
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend running at http://localhost:${PORT}`);
});
