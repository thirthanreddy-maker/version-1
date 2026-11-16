import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/weather", async (req, res) => {
  const city = String(req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({ error: "Please provide a city name." });
  }

  try {
    const geocodingUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/search"
    );
    geocodingUrl.searchParams.set("name", city);
    geocodingUrl.searchParams.set("count", "1");
    geocodingUrl.searchParams.set("language", "en");
    geocodingUrl.searchParams.set("format", "json");

    const geocodingResponse = await fetch(geocodingUrl);
    if (!geocodingResponse.ok) {
      return res.status(502).json({ error: "Could not look up that city." });
    }

    const geocodingData = await geocodingResponse.json();
    const location = geocodingData.results?.[0];

    if (!location) {
      return res.status(404).json({
        error: "City not found. Check the spelling and try again.",
      });
    }

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", location.latitude);
    weatherUrl.searchParams.set("longitude", location.longitude);
    weatherUrl.searchParams.set(
      "current",
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code"
    );
    weatherUrl.searchParams.set("timezone", "auto");

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      return res.status(502).json({ error: "Could not retrieve weather data." });
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    if (!current) {
      return res.status(502).json({ error: "Weather data is unavailable." });
    }

    return res.json({
      name: location.name,
      country: location.country || "",
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      wind: current.wind_speed_10m,
      weatherCode: current.weather_code,
      updatedAt: current.time,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return res.status(500).json({ error: "Unable to fetch weather right now." });
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend running at http://localhost:${PORT}`);
});
