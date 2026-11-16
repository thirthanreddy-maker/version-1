import { useEffect, useState } from "react";

const weatherCodes = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Cloudy", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌫️" },
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
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm", icon: "⛈️" },
};

function getWeatherInfo(code) {
  return weatherCodes[code] || { label: "Unknown conditions", icon: "🌍" };
}

function readHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem("weather-search-history") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
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
          <div className="stat-box h-100"><span>{detail.label}</span><strong>{detail.value}</strong></div>
        </div>
      ))}
    </div>
  );
}

function Forecast({ days }) {
  if (!days?.length) return <p className="text-secondary text-center py-4">Forecast is not available right now.</p>;

  return (
    <div className="row g-3" aria-label="Five-day forecast">
      {days.map((day) => {
        const info = getWeatherInfo(day.weatherCode);
        const date = new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
        return (
          <div className="col-6 col-md" key={day.date}>
            <article className="forecast-day h-100 text-center">
              <p className="forecast-date">{date}</p>
              <div className="forecast-icon" aria-hidden="true">{info.icon}</div>
              <p className="forecast-condition">{info.label}</p>
              <strong>{Math.round(day.max)}°</strong><span className="forecast-low"> / {Math.round(day.min)}°</span>
            </article>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("weather-theme") || "light");
  const [history, setHistory] = useState(readHistory);
  const [page, setPage] = useState("today");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("weather-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("weather-search-history", JSON.stringify(history));
  }, [history]);

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
      const response = await fetch(`/api/weather?city=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not fetch weather.");

      setWeather({ ...data, ...getWeatherInfo(data.weatherCode), forecast: data.forecast || [] });
      setCity(data.name);
      setHistory((previous) => [data.name, ...previous.filter((item) => item.toLowerCase() !== data.name.toLowerCase())].slice(0, 5));
      setPage("today");
    } catch (err) {
      setWeather(null);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchWeatherForCity("London"); }, []);

  function handleSubmit(event) {
    event.preventDefault();
    fetchWeatherForCity(city);
  }

  return (
    <main className="app-shell">
      <div className="container py-4 py-lg-5">
        <div className="app-toolbar d-flex justify-content-between align-items-center mb-4">
          <a className="brand text-decoration-none" href="#home" aria-label="Skyline home"><span className="brand-mark">☁</span> skyline</a>
          <button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <section className="card weather-card border-0 shadow-lg">
              <div className="card-body p-4 p-md-5">
                <header className="text-center mb-4">
                  <p className="eyebrow mb-2">YOUR WEATHER, AT A GLANCE</p>
                  <h1 className="display-6 fw-bold mb-2">Weather made simple.</h1>
                  <p className="subtitle mb-0">Search a city to see current conditions and the 5-day outlook.</p>
                </header>

                <form className="search-form d-flex gap-2 mx-auto mb-4" onSubmit={handleSubmit}>
                  <label htmlFor="city-search" className="visually-hidden">City name</label>
                  <input id="city-search" className="form-control form-control-lg" type="search" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Search a city…" autoComplete="off" />
                  <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
                </form>

                {history.length > 0 && (
                  <div className="history-row mx-auto mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2"><span className="history-label">RECENT SEARCHES</span><button className="text-button" type="button" onClick={() => setHistory([])}>Clear</button></div>
                    <div className="d-flex flex-wrap gap-2">
                      {history.map((item) => <button className="history-chip" type="button" key={item} onClick={() => { setCity(item); fetchWeatherForCity(item); }}>{item}</button>)}
                    </div>
                  </div>
                )}

                {loading && <div className="loading-state" role="status"><span className="spinner-border spinner-border-sm me-2" />Loading weather…</div>}
                {error && <div className="alert alert-warning" role="alert">{error}</div>}

                {weather && !loading && (
                  <>
                    <nav className="view-tabs d-flex justify-content-center gap-2 mb-4" aria-label="Weather views">
                      <button className={`view-tab ${page === "today" ? "active" : ""}`} type="button" onClick={() => setPage("today")}>Today</button>
                      <button className={`view-tab ${page === "forecast" ? "active" : ""}`} type="button" onClick={() => setPage("forecast")}>5-day forecast</button>
                    </nav>
                    {page === "today" ? (
                      <section className="weather-result text-center" aria-live="polite">
                        <div className="weather-icon" aria-hidden="true">{weather.icon}</div>
                        <h2 className="h4 mt-3 mb-1">{weather.name}{weather.country ? `, ${weather.country}` : ""}</h2>
                        <p className="temperature mb-0">{Math.round(weather.temperature)}°</p>
                        <p className="condition mb-0">{weather.label}</p>
                        <WeatherDetails weather={weather} />
                        <p className="small muted mt-4 mb-0">Temperature in °C · Wind in km/h · Updated {weather.updatedAt || "just now"}</p>
                      </section>
                    ) : (
                      <section aria-live="polite"><div className="text-center mb-4"><h2 className="h4 fw-bold">5-day forecast</h2><p className="subtitle mb-0">{weather.name}{weather.country ? `, ${weather.country}` : ""}</p></div><Forecast days={weather.forecast} /></section>
                    )}
                  </>
                )}
              </div>
            </section>
            <p className="text-center small muted mt-3">Weather data provided by Open-Meteo.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
