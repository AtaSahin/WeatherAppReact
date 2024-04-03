import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const city = new URLSearchParams(location.search).get("city");
  const [activities, setActivities] = useState([]);
  const API_KEY = "928b916fd33a31ae13bc9f5c43fee8af";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchWeatherData = async (cityName) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data);
        setError("");
        generateActivities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("City not found. Please enter a valid city name.");
        setWeatherData(null);
      }
    };

    const fetchForecastData = async (cityName) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        setForecastData(response.data.list);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
        setForecastData(null);
      }
    };

    if (city) {
      fetchWeatherData(city);
      fetchForecastData(city);
    }
  }, [city]);

  const generateActivities = (weatherData) => {
    const activities = [];

    if (weatherData.main.temp > 30) {
      activities.push("Go for a swim at the beach.");
      activities.push("Have a barbecue with friends.");
      activities.push("Visit an outdoor water park.");
    } else if (weatherData.main.temp > 20) {
      activities.push("Go for a hike in the mountains.");
      activities.push("Take a bike ride around the city.");
      activities.push("Play outdoor sports like soccer or basketball.");
    } else if (weatherData.main.temp > 10) {
      activities.push("Take a walk in the park.");
      activities.push("Visit a museum or art gallery.");
      activities.push("Have a picnic with family.");
    } else {
      activities.push("Stay indoors and watch a movie.");
      activities.push("Read a book at home.");
      activities.push("Bake cookies or other treats.");
    }

    if (weatherData.wind.speed > 10) {
      activities.push("Avoid outdoor activities due to strong winds.");
    }

    if (weatherData.clouds.all > 50) {
      activities.push("Bring an umbrella and take a walk in the rain.");
      activities.push("Stay indoors and watch the rain from your window.");
    }

    setActivities(activities);
  };

  return (
    <div className="weather-page">
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="current-weather">
          <button className="back-button" onClick={() => navigate("/")}>
            &#43; Search for more city
          </button>
          <h2>{weatherData.name} Weather</h2>
          <p className="date">
            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <div className="weather-info">
            <div className="weather-icon">
              <img
                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                alt="weather icon"
              />
            </div>
            <div className="temperature">
              <p className="temperature-value">{weatherData.main.temp}°C</p>
            </div>
          </div>
          <p>Description: {weatherData.weather[0].description}</p>
          <div className="extra-info">
            <div className="info-item">
              <p>Thermal Sensation:</p>
              <p>{weatherData.main.feels_like}°C</p>
            </div>
            <div className="info-item">
              <p>Probability of Rain:</p>
              <p>{weatherData.clouds.all}%</p>
            </div>
            <div className="info-item">
              <p>Wind Speed:</p>
              <p>{weatherData.wind.speed} m/s</p>
            </div>
            <div className="info-item">
              <p>Air Humidity:</p>
              <p>{weatherData.main.humidity}%</p>
            </div>
          </div>
        </div>
      )}
      {forecastData && (
        <div className="forecast">
          <h2>5 Day Weather Forecast</h2>
          <div className="forecast-icons">
            {forecastData.slice(0, 5).map((forecast, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const dayNames = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ];
              const dayName = dayNames[date.getDay()];

              return (
                <div key={index} className="forecast-item">
                  <p>{dayName}</p>
                  <img
                    src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                    alt="weather icon"
                  />
                  <p>{forecast.main.temp}°C</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activities.length > 0 && (
        <div className="activities">
          <h2>Potential Activities</h2>
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeatherPage;
