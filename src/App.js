import React, { useState, useContext, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";
import { TemperatureContext } from "./context/TemperatureContext";
const App = () => {
  const { unit, toggleUnit } = useContext(TemperatureContext);
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || [],
  );
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const { data } = await fetchWeather(`${lat},${lon}`);
        setWeatherData(data);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);
  const fetchData = async (e) => {
    if (e.key === "Enter") {
      if (!navigator.onLine) {
  const queuedRequests =
    JSON.parse(
      localStorage.getItem(
        "weatherQueue"
      )
    ) || [];
  queuedRequests.push(cityName);
  localStorage.setItem(
    "weatherQueue",
    JSON.stringify(
      queuedRequests
    )
  );
    setError(
    "You are offline. Request queued."
  );
    return;
}
      try {
        const { data } = await fetchWeather(cityName);
        console.log(data);
        setWeatherData(data);
        const updatedSearches = [
          cityName,
          ...recentSearches.filter(
            (city) => city.toLowerCase() !== cityName.toLowerCase(),
          ),
        ].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        setCityName("");
        setError(null);
      } catch (error) {
        setError(error.message);
      }
    }
  };
  return (
    <div>
      <button onClick={toggleUnit}>
        Switch to {unit === "celsius" ? "Fahrenheit" : "Celsius"}
      </button>
      <br />
      <br />
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <h3>Recent Searches</h3>
      <ul>
        {recentSearches.map((city) => (
          <li
            key={city}
            style={{
              cursor: "pointer",
            }}
            onClick={async () => {
              try {
              const { data } = await fetchWeather(city);

                setWeatherData(data);
              } catch (error) {
                setError(error.message);
              }
            }}
          >
            {city}
          </li>
        ))}
      </ul>
      {weatherData?.location && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <p>
            Lat: {weatherData.location.lat}, Lon: {weatherData.location.lon}
          </p>
          <p>
            Temperature:
            {unit === "celsius"
              ? weatherData.current?.temp_c
              : weatherData.current?.temp_f}
            °{unit === "celsius" ? "C" : "F"}
          </p>
          <p>Condition: {weatherData.current?.condition?.text}</p>
          <img
            src={weatherData.current?.condition?.icon}
            alt={weatherData.current?.condition?.icon}
          />
          <p>Humidity: {weatherData.current?.humidity}</p>
          <p>Pressure: {weatherData.current?.pressure_mb}</p>
        </div>
      )}
    </div>
  );
};
export default App;
