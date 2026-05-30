import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TemperatureProvider } from "./context/TemperatureContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <TemperatureProvider>
    <App />
  </TemperatureProvider>,
);
