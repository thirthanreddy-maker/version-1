import { useEffect, useState } from "react";

const weatherCodes = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Cloudy", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Depositing rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Moderate drizzle", icon: "🌦️" },
  55: { label: "Dense drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Heavy freezing drizzle", icon: "🌧️" },
  61: { label: "Slight rain", icon: "🌦️" },
  63: { label: "Moderate rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Slight snow", icon: "🌨️" },
  73: { label: "Moderate snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Slight rain showers", icon: "🌦️" },
  81: { label: "Moderate rain showers", icon: "🌧️" },
  82: { label: "Violent rain showers", icon: "⛈️" },
  85: { label: "Slight snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm", icon: "⛈️" },
};

function getWeatherInfo(code) {
  return weatherCodes[code] || { label: "Unknown conditions", icon: "🌍" };
}

function WeatherDetails({ weather }) {
  const details = [
    { label: "Humidity", value: `${weather.humidity}%` },
    { label: "Wind", value: `${Math.round(weather.wind)} km/h` },
    { label: "Feels like", value: `${Math.round(weather.feelsLike)}°C` },
  ];

  return (
    <div className="row mt-4 g-3">
      {details.map((detail) => (
        <div className="col-12 col-sm-4" key={detail.label}>
          <div className="stat-box h-100">
            <span>{detail.label}</span>
            <strong>{detail.value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeatherForCity(cityName) {
    const query = cityName.trim();
    if (!query) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not fetch weather.");
      }

      const condition = getWeatherInfo(data.weatherCode);
      setWeather({ ...data, ...condition });
    } catch (err) {
      setWeather(null);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeatherForCity("London");
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    fetchWeatherForCity(city);
  }

  return (
    <main className="weather-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">
            <section className="card weather-card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <header className="text-center mb-4">
                  <p className="eyebrow mb-2">LIVE CONDITIONS</p>
                  <h1 className="h2 fw-bold mb-2">Weather App</h1>
                  <p className="text-secondary mb-0">
                    Find current weather for any city.
                  </p>
                </header>

                <form className="d-flex gap-2 mb-4" onSubmit={handleSubmit}>
                  <label htmlFor="city-search" className="visually-hidden">
                    City name
                  </label>
                  <input
                    id="city-search"
                    className="form-control form-control-lg"
                    type="search"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Try Tokyo or Mumbai"
                    autoComplete="off"
                  />
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    disabled={loading}
                  >
                    Search
                  </button>
                </form>

                {loading && (
                  <div className="loading-state" role="status">
                    <span className="spinner-border spinner-border-sm me-2" />
                    Loading weather…
                  </div>
                )}

                {error && (
                  <div className="alert alert-warning" role="alert">
                    {error}
                  </div>
                )}

                {weather && !loading && (
                  <section className="weather-result text-center" aria-live="polite">
                    <div className="weather-icon" aria-hidden="true">
                      {weather.icon}
                    </div>
                    <h2 className="h4 mt-3 mb-1">
                      {weather.name}
                      {weather.country ? `, ${weather.country}` : ""}
                    </h2>
                    <p className="temperature mb-0">
                      {Math.round(weather.temperature)}°
                    </p>
                    <p className="condition mb-0">{weather.label}</p>
                    <WeatherDetails weather={weather} />
                    <p className="small text-secondary mt-4 mb-0">
                      Temperature in °C · Wind in km/h
                    </p>
                  </section>
                )}
              </div>
            </section>
            <p className="text-center small text-secondary mt-3">
              Weather data provided by Open-Meteo.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
