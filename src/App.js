import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import WeatherPage from "./pages/WeatherPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
