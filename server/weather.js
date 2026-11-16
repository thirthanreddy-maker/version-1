export async function getWeatherForCity(cityInput) {
  const city = String(cityInput || "").trim();
  if (!city) {
    const error = new Error("Please provide a city name.");
    error.status = 400;
    throw error;
  }

  const geocodingUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geocodingUrl.searchParams.set("name", city);
  geocodingUrl.searchParams.set("count", "1");
  geocodingUrl.searchParams.set("language", "en");
  geocodingUrl.searchParams.set("format", "json");

  const geocodingResponse = await fetch(geocodingUrl);
  if (!geocodingResponse.ok) {
    const error = new Error("Could not look up that city.");
    error.status = 502;
    throw error;
  }

  const geocodingData = await geocodingResponse.json();
  const location = geocodingData.results?.[0];
  if (!location) {
    const error = new Error("City not found. Check the spelling and try again.");
    error.status = 404;
    throw error;
  }

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", location.latitude);
  weatherUrl.searchParams.set("longitude", location.longitude);
  weatherUrl.searchParams.set("current", "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code");
  weatherUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
  weatherUrl.searchParams.set("forecast_days", "5");
  weatherUrl.searchParams.set("timezone", "auto");

  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) {
    const error = new Error("Could not retrieve weather data.");
    error.status = 502;
    throw error;
  }

  const weatherData = await weatherResponse.json();
  const current = weatherData.current;
  if (!current) {
    const error = new Error("Weather data is unavailable.");
    error.status = 502;
    throw error;
  }

  const daily = weatherData.daily || {};
  const forecast = (daily.time || []).map((date, index) => ({
    date,
    weatherCode: daily.weather_code?.[index],
    max: daily.temperature_2m_max?.[index],
    min: daily.temperature_2m_min?.[index],
  }));

  return {
    name: location.name,
    country: location.country || "",
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    wind: current.wind_speed_10m,
    weatherCode: current.weather_code,
    updatedAt: current.time,
    forecast,
  };
}
