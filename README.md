# Skyline Weather

A polished, responsive weather dashboard built with React and Bootstrap. Search worldwide locations for current conditions and a five-day forecast, switch between light and dark themes, and revisit recent searches.

## Features

- Current temperature, feels-like temperature, humidity, wind speed, and condition
- Five-day forecast with daily highs, lows, and condition icons
- City search with clear validation and loading/error states
- Recent city history saved in browser local storage (up to five cities)
- Light/dark theme preference saved in browser local storage
- Responsive layout and accessible form labels/status messages
- Express API for local development and a Vercel serverless API for deployment
- Open-Meteo geocoding and forecast APIs; no API key required

## Tech stack

React, JSX, Bootstrap 5, Vite, Node.js, Express, Open-Meteo REST APIs, Vercel Functions.

## Requirements

Use Node.js 18.18 or newer and npm.

## Run locally

```bash
npm install
npm run dev:full
```

Open the Vite URL shown in the terminal (usually http://localhost:5173). The Vite development server proxies `/api` requests to the Express backend on port 3001.

Useful checks in a second terminal:

```bash
curl http://localhost:3001/api/health
curl "http://localhost:3001/api/weather?city=London"
```

For debugging the processes separately, use two terminals from the project root:

```bash
npm run server
npm run dev
```

If `npm run dev:full` fails, check `node --version` (must be 18.18+), run `npm install` again, and make sure ports 3001 and 5173 are free. The labelled `API` and `WEB` process output identifies which process failed. Stop both processes with Ctrl+C.

## Production build

```bash
npm run build
npm run preview
```

The production frontend files are generated in `dist/`.

## Deploy to Vercel

The repository includes `vercel.json` and `api/weather.js`. The Vercel function exposes the weather endpoint while the Vite build serves the React frontend.

1. Import `thirthanreddy-maker/version-1` in the Vercel dashboard and select Vite if asked, or install the Vercel CLI and run:

   ```bash
   npx vercel
   ```

2. Confirm the project settings: build command `npm run build`, output directory `dist`, and install command `npm install`.
3. Deploy production with:

   ```bash
   npx vercel --prod
   ```

4. Test `<your-deployment-url>/api/weather?city=London`.

The app does not need secrets or environment variables. The Vercel deployment uses the serverless function in `api/weather.js`; local `npm run dev:full` uses Express in `server/index.js`.

## API

`GET /api/weather?city=London` returns current conditions and five daily forecast entries. The backend validates input, resolves the city with Open-Meteo Geocoding, then retrieves its forecast from Open-Meteo.

Local health check: `GET /api/health`.

## Portfolio description

**Skyline Weather — React Weather Dashboard**  
Designed and built a responsive weather dashboard with React, Bootstrap, and Node.js. Integrated Open-Meteo REST APIs through an Express and Vercel serverless backend to provide current conditions and a five-day forecast. Added persistent light/dark mode, recent-city search history, responsive layouts, and loading/error handling.

**Skills:** React, JavaScript, JSX, Bootstrap, REST API integration, Node.js, Express, Vite, Vercel.
