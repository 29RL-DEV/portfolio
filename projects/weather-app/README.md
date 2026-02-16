🌤️ Weather Application

A simple React application that displays real-time weather information for a selected city.

This project was built to practice working with external APIs, asynchronous data fetching, and basic UI state management.

📌 What This App Does

Allows users to search for a city

Fetches current weather data from a public API

Displays:

temperature

weather conditions

city name

Updates instantly when a new search is made

✨ Key Features

Real-time weather data

City-based search

API integration using fetch

Clean and responsive UI

Basic loading and error handling

🛠 Tech Stack

React

Vite

JavaScript

CSS

Public Weather API (e.g. OpenWeatherMap)

📂 Project Structure
weather-app/
├── src/
│   ├── components/
│   │   ├── Search.jsx
│   │   └── WeatherCard.jsx
│   ├── lib/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md

🔐 Environment Variables

⚠️ Do not commit .env

Create a local .env file using the example below:

VITE_WEATHER_API_KEY=

⚙️ How It Works

The user enters a city name

The app sends a request to the weather API

Weather data is returned and stored in state

The UI updates automatically

Errors are handled gracefully if the city is not found

▶️ Run Locally
npm install
npm run dev


The app will be available at:

http://localhost:5173

📊 Project Status

Fully functional

Stable for local use

Built for learning and portfolio purposes

Not intended as a production system

🔒 Security Notes

API keys are stored in .env

.env is ignored via .gitignore

No user data is stored

🚀 Possible Improvements

5-day weather forecast

Location-based weather

Improved UI animations

Better error messages

📄 License

MIT License