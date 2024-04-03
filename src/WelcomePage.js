import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cloudIcon from "./asset/wfLogo.png";
import axios from "axios";
import "./WelcomePage.css";

function WelcomePage() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [citiesList, setCitiesList] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=928b916fd33a31ae13bc9f5c43fee8af&units=metric`
        );
        if (response.data.cod === 200) {
          navigate(`/weather?city=${city}`);
        } else {
          setError("There is no such city. Please enter a valid city name.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      }
    }
  };

  const handleGeoLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=928b916fd33a31ae13bc9f5c43fee8af&units=metric`
            );
            const cityName = response.data.name;
            navigate(`/weather?city=${cityName}`);
          } catch (error) {
            console.error("Error fetching data:", error);
            setError(
              "An error occurred while fetching data. Please try again later."
            );
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setError("Geolocation is not available or permission is denied.");
        }
      );
    } else {
      setError("Geolocation is not supported in this browser.");
    }
  };

  return (
    <div className="welcome-page">
      <img src={cloudIcon} alt="Cloud Icon" className="cloud-icon" />
      <div className="welcome-content">
        <h1>
          Welcome to <span className="bold">Weather App</span>
        </h1>
        <p>Get accurate weather forecasts for any city worldwide.</p>
        <form onSubmit={handleSubmit} className="city-form">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError("");
            }}
          />
          <button type="submit">Get Weather</button>
        </form>
        <p>Or use your current location:</p>
        <button onClick={handleGeoLocation}>
          Get Weather from My Location
        </button>

        <div className="cities-list">
          {citiesList.map((cityName) => (
            <div key={cityName} className="city-item">
              <p>{cityName}</p>
              <button onClick={() => navigate(`/weather?city=${cityName}`)}>
                View Weather
              </button>
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default WelcomePage;
