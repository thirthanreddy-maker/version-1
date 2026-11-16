# Weather App

A responsive React weather application with an Express backend. Search for a city to view its current temperature, weather condition, humidity, wind speed, and feels-like temperature.

## Stack

- React and JSX
- Bootstrap 5
- Vite
- Node.js and Express
- Open-Meteo geocoding and forecast APIs (no API key required)

## Requirements

Install Node.js 18 or newer, which includes the `fetch` API used by the backend.

## Run locally

```bash
npm install
npm run dev:full
```

Open the Vite URL printed in the terminal (typically http://localhost:5173). The Express API runs on http://localhost:3001 and Vite proxies `/api` requests to it.

To check the backend directly, visit http://localhost:3001/api/health. Example weather request: http://localhost:3001/api/weather?city=London.

## Production build

```bash
npm run build
npm run preview
```

## API endpoint

`GET /api/weather?city={city}` returns location and current weather data. The backend validates the query, geocodes the city, requests its current weather, and responds with JSON.
