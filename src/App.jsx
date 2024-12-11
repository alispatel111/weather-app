import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "./assets/background-Image.jpg";
import locationIcon from "./assets/location-icon.png";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;


  useEffect(() => {
    const currentDate = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    setDay(days[currentDate.getDay()]);
    setDate(currentDate.toDateString());
  }, []);

  const getCountryName = (countryCode) => {
    const countryDisplayNames = new Intl.DisplayNames(["en"], {
      type: "region",
    });
    return countryDisplayNames.of(countryCode);
  };

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setCountryName(getCountryName(response.data.sys.country));
      setError(null);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeatherData(null);
    }
  };

  return (
    <div
      className="weather-app"
      style={{ backgroundImage: `url(${backgroundImage})`, paddingTop: "20px" }}
    >
      <div className="overlay"></div>

      <div className="weather-card">
        <div className="left-section">
          <h1 className="day">{day}</h1>
          <p className="date">{date}</p>
          {weatherData ? (
            <div className="temperature-section">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="weather-icon"
                style={{
                  width: "90px",
                  height: "90px",
                }}
              />
              <div>
                <h2 className="temperature">{weatherData.main.temp}°C</h2>
                <p className="description">
                  {weatherData.weather[0].description}
                </p>
              </div>
            </div>
          ) : (
            <p className="description">No data available</p>
          )}
        </div>

        <div className="right-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Location..."
              className="search-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="search-button" onClick={fetchWeather}>
              Search
            </button>
          </div>

          {weatherData && (
            <div className="weather-details">
              <h3
                className="location"
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  marginBottom: "10px",
                  position: "relative",
                }}
              >
                {weatherData.name}, {countryName}
                <img
                  src={locationIcon}
                  alt="location icon"
                  style={{
                    width: "36px",
                    position: "absolute",
                    right: "0",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </h3>

              <div className="detail-row">
                <div
                  className="detail"
                  style={{
                    border: "2px solid #ff9800",
                    borderRadius: "10px",
                    padding: "5px",
                  }}
                >
                  <p
                    className="value"
                    style={{
                      color: "#ff9800",
                      fontWeight: "bold",
                    }}
                  >
                    {weatherData.main.temp_max}°C
                  </p>
                  <p className="label">Max Temperature</p>
                </div>
                <div
                  className="detail"
                  style={{
                    border: "2px solid #00CDDA",
                    borderRadius: "10px",
                    padding: "5px",
                  }}
                >
                  <p
                    className="value"
                    style={{
                      color: "#00CDDA",
                      fontWeight: "bold",
                    }}
                  >
                    {weatherData.main.temp_min}°C
                  </p>
                  <p className="label">Min Temperature</p>
                </div>
              </div>

              <div className="detail-row justify-center">
                <div className="detail">
                  <p className="value">{weatherData.main.feels_like}°C</p>
                  <p className="label">Feels Like</p>
                </div>
                <div className="detail">
                  <p className="value">{weatherData.main.humidity}%</p>
                  <p className="label">Humidity</p>
                </div>
                <div className="detail">
                  <p className="value">{weatherData.wind.speed} m/s</p>
                  <p className="label">Wind</p>
                </div>
              </div>
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
