/**
 * API Module
 * Handles all external API calls (Geocoding + Weather)
 * Uses Open-Meteo APIs (free, no key required)
 */

// 🌍 Geocoding (city search)
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

// 🌦️ Weather forecast
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Search cities by name
 * @param {string} query
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function searchCities(query, signal) {
  const url = `${GEO_URL}?name=${encodeURIComponent(
    query,
  )}&count=10&language=en&format=json`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error("Failed to fetch city data");
  }

  const data = await res.json();
  return data.results || [];
}

/**
 * Fetch weather data by coordinates
 * Returns data structured EXACTLY as your UI expects:
 *  - data.current.temperature_2m
 *  - data.current.apparent_temperature
 *  - data.current.relative_humidity_2m
 *  - data.current.pressure_msl
 *  - data.current.visibility
 *  - data.daily.temperature_2m_max
 *  - data.daily.temperature_2m_min
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
export async function fetchWeatherByCoords(lat, lon) {
  const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&timezone=auto&current=temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,visibility&daily=temperature_2m_max,temperature_2m_min`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return await res.json();
}

/**
 * Get human-readable weather description
 * (Open-Meteo uses weather codes; this is optional but kept
 * because app.js imports it)
 *
 * @param {number} code
 * @returns {string}
 */
export function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
  };

  return descriptions[code] || "Unknown weather";
}

/**
 * Get weather icon (emoji-based fallback)
 * Kept for compatibility with existing imports
 *
 * @param {number} code
 * @returns {string}
 */
export function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code <= 3) return "☁️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}
