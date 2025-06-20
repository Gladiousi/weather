import { WeatherForm } from "./components/WeatherForm";
import { WeatherTabs } from "./components/WeatherTabs";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { FiveDayForecast } from "./components/FiveDayForecast";
import { SolarActivity } from "./components/SolarActivity";
import { useWeather } from "./hooks/useWeather";
import { getWeatherBackground } from "./utils/weatherUtils";
import { useState } from "react";

const App = () => {
  const { city, setCity, weather, hourlyForecast, error, isLoading, handleSubmit } =
    useWeather();

  const [activeTab, setActiveTab] = useState<"current" | "hourly" | "fiveDay" | "solarActivity">("current");

  const backgroundClass = weather
    ? getWeatherBackground(weather.weather[0].icon)
    : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100";

  return (
    <div className={`wrapper flex justify-center min-h-screen ${backgroundClass} p-4 sm:p-6 overflow-auto`}>
      <div className="w-full min-w-96 max-w-md text-black bg-white/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-3xl flex flex-col min-h-[450px]">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Погода</h2>
        <WeatherForm city={city} setCity={setCity} handleSubmit={handleSubmit} isLoading={isLoading} />
        <WeatherTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {error && (
          <p className="text-red-500 bg-red-100/80 p-3 rounded-lg mb-4 text-center animate-fade-in text-sm sm:text-base">
            {error}
          </p>
        )}

        <div className="mt-auto flex-grow flex flex-col justify-center"> 
          {activeTab === "current" && weather && <CurrentWeather weather={weather} />}
          {activeTab === "hourly" && hourlyForecast && <HourlyForecast hourlyForecast={hourlyForecast} />}
          {activeTab === "fiveDay" && hourlyForecast && <FiveDayForecast hourlyForecast={hourlyForecast} />}
          {activeTab === "solarActivity" && <SolarActivity />}

          {!weather && !hourlyForecast && !error && !isLoading && activeTab !== "solarActivity" && (
            <p className="text-gray-600 text-center text-sm sm:text-base mt-4 animate-fade-in">
              Введите город, чтобы узнать погоду
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;