/**
 * WeatherSync - Global Weather Intelligence
 * Modern, real-time weather application with 5-day forecast
 * Built with Open-Meteo + Nominatim (both free, unlimited APIs)
 */

import {
  searchCities,
  fetchWeatherByCoords,
  getWeatherDescription,
  getWeatherIcon,
} from "./src/api.js";

import {
  addToSearchHistory,
  getTemperatureUnit,
  setTemperatureUnit,
  saveLastCity,
  getLastCity,
} from "./src/storage.js";

import {
  formatDate,
  showSpinner,
  showErrorMsg,
  hideError,
  showData,
  displaySuggestions,
  clearSuggestions,
  displayCurrentWeather,
  displayForecast,
  updateUnitDisplay,
  getSearchInput,
  setSearchInput,
  clearSearchInput,
  focusSearchInput,
} from "./src/ui.js";

// App state
let useCelsius = getTemperatureUnit();
let searchTimeout;
let searchAbortController = null;
let currentCityData = null;

// DOM elements
const btn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const switchUnitBtn = document.getElementById("toggleUnit");
const homeBtn = document.getElementById("homeBtn");
const errorCloseBtn = document.getElementById("errorCloseBtn");
const searchForm = document.getElementById("searchForm");

/**
 * #init
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("WeatherSync initialized");

  // #listeners
  btn.addEventListener("click", handleSearch);

  // Fix pentru form submit
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch();
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  input.addEventListener("input", handleInputChange);

  switchUnitBtn.addEventListener("click", handleUnitToggle);

  if (homeBtn) {
    homeBtn.addEventListener("click", () => location.reload());
  }

  if (errorCloseBtn) {
    errorCloseBtn.addEventListener("click", hideError);
  }

  // #click_outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) {
      clearSuggestions();
    }
  });

  // #focus
  focusSearchInput();

  // Load last viewed city if exists
  loadLastCity();
});

/**
 * #search_input
 */
async function handleInputChange(e) {
  const query = e.target.value.trim();

  if (!query) {
    clearSuggestions();
    return;
  }

  // Cancel previous request if still pending
  if (searchAbortController) {
    searchAbortController.abort();
  }
  searchAbortController = new AbortController();

  clearTimeout(searchTimeout);

  // #searching
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML =
    '<li style="color: var(--muted); font-style: italic;">🔍 Searching...</li>';

  // #debounce
  searchTimeout = setTimeout(async () => {
    try {
      const cities = await searchCities(query, searchAbortController.signal);
      displaySuggestions(cities, selectCity);
    } catch (err) {
      // Don't show error if request was aborted (user typed more)
      if (err.name !== "AbortError") {
        suggestions.innerHTML =
          '<li style="color: var(--danger);">⚠️ Error loading suggestions</li>';
      }
    }
  }, 300);
}

/* #search_button */
async function handleSearch() {
  const query = getSearchInput();

  if (!query) {
    showErrorMsg("Please type a city name");
    return;
  }

  clearSuggestions();
  hideError();
  showSpinner(true);

  try {
    const cities = await searchCities(query);

    if (!cities || cities.length === 0) {
      showErrorMsg("City not found. Try another search.");
      showData(false);
      showSpinner(false);
      return;
    }

    const firstCity = cities[0];
    const displayName = firstCity.name
      ? `${firstCity.name}${firstCity.state ? ", " + firstCity.state : ""}, ${firstCity.country}`
      : query;

    currentCityData = {
      city: firstCity.name || query,
      lat: firstCity.lat,
      lon: firstCity.lon,
      country: firstCity.country,
    };

    await selectCity(firstCity, displayName);
  } catch (err) {
    showErrorMsg("Error: " + (err.message || "Unable to search cities"));
    showData(false);
    showSpinner(false);
  }
}

/**
 * #city_selection
 */
async function selectCity(city, displayName) {
  setSearchInput(displayName);
  hideError();
  showSpinner(true);

  currentCityData = {
    city: city.name || displayName.split(",")[0],
    lat: city.lat,
    lon: city.lon,
    country: city.country || "Unknown",
  };

  try {
    // #fetch_weather
    const weatherData = await fetchWeatherByCoords(city.lat, city.lon);

    // #display
    displayCurrentWeather(weatherData, displayName, useCelsius);
    displayForecast(weatherData, useCelsius);

    // #map
    const temp = useCelsius
      ? Math.round(weatherData.current.temperature_2m)
      : Math.round((weatherData.current.temperature_2m * 9) / 5 + 32);
    updateWeatherMap(city.lat, city.lon, temp);

    // #show_data
    showData(true);

    // #history
    addToSearchHistory(displayName);
    saveLastCity(
      currentCityData.city,
      currentCityData.lat,
      currentCityData.lon,
    );

    console.log("Weather loaded for:", displayName);
  } catch (err) {
    showErrorMsg(err.message || "Could not fetch weather data");
    showData(false);
  } finally {
    showSpinner(false);
  }
}

/**
 * #temperature_toggle
 */
function handleUnitToggle() {
  useCelsius = !useCelsius;
  setTemperatureUnit(useCelsius);
  updateUnitDisplay(useCelsius);

  // #refresh - folosește orașul curent sau ultimul salvat
  const cityData = currentCityData || getLastCity();
  if (cityData && cityData.lat && cityData.lon) {
    showSpinner(true);
    fetchWeatherByCoords(cityData.lat, cityData.lon)
      .then((data) => {
        const displayName = cityData.city
          ? `${cityData.city}, ${cityData.country || ""}`
          : "Current Location";
        displayCurrentWeather(data, displayName, useCelsius);
        displayForecast(data, useCelsius);
        const temp = useCelsius
          ? Math.round(data.current.temperature_2m)
          : Math.round((data.current.temperature_2m * 9) / 5 + 32);
        updateWeatherMap(cityData.lat, cityData.lon, temp);
      })
      .catch((err) => showErrorMsg(err.message))
      .finally(() => showSpinner(false));
  }
}

/**
 * Load last viewed city on app start
 */
async function loadLastCity() {
  const lastCity = getLastCity();
  if (lastCity && lastCity.lat && lastCity.lon) {
    try {
      showSpinner(true);
      const weatherData = await fetchWeatherByCoords(
        lastCity.lat,
        lastCity.lon,
      );
      const displayName = lastCity.city
        ? `${lastCity.city}, ${lastCity.country || ""}`
        : "Saved Location";

      displayCurrentWeather(weatherData, displayName, useCelsius);
      displayForecast(weatherData, useCelsius);
      updateWeatherMap(
        lastCity.lat,
        lastCity.lon,
        useCelsius
          ? Math.round(weatherData.current.temperature_2m)
          : Math.round((weatherData.current.temperature_2m * 9) / 5 + 32),
      );
      showData(true);
      currentCityData = lastCity;
    } catch (err) {
      console.log("Could not load last city:", err.message);
    } finally {
      showSpinner(false);
    }
  }
}

/**
 * #map_display
 */
function updateWeatherMap(lat, lon, temp) {
  const mapContainer = document.getElementById("map");

  if (!mapContainer) return;

  mapContainer.innerHTML =
    '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--muted); font-style: italic;">Loading weather map...</div>';

  setTimeout(() => {
    // #windymap
    const windyUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=10&level=surface&overlay=wind&product=ecmwf&message=true`;

    const iframe = document.createElement("iframe");
    iframe.src = windyUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "10px";
    iframe.frameBorder = "0";
    iframe.allow = "fullscreen";

    mapContainer.innerHTML = "";
    mapContainer.appendChild(iframe);

    console.log("Windy map loaded for:", { lat, lon, temp });
  }, 200);
}
