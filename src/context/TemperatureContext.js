import React, { createContext, useState } from "react";
export const TemperatureContext = createContext();
export const TemperatureProvider = ({ children }) => {
const savedUnit = localStorage.getItem("temperatureUnit") || "celsius";
const [unit, setUnit] = useState(savedUnit);
const toggleUnit = () => {
const newUnit = unit === "celsius" ? "fahrenheit" : "celsius";
    setUnit(newUnit);
    localStorage.setItem("temperatureUnit", newUnit);
};
return (
    <TemperatureContext.Provider
value={{
        unit,
        toggleUnit,
    }}
    >
{children}
    </TemperatureContext.Provider>
);
};
