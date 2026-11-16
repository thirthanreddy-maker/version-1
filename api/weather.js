import { getWeatherForCity } from "../server/weather.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const weather = await getWeatherForCity(req.query.city);
    return res.status(200).json(weather);
  } catch (error) {
    const status = error.status || 500;
    if (status >= 500) console.error("Weather API error:", error);
    return res.status(status).json({ error: error.message || "Unable to fetch weather right now." });
  }
}
