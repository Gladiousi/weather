import { useState, useEffect } from "react";
import { getWeatherByCity, getHourlyForecast } from "../utils/weatherApi";
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind } from "react-icons/wi";
import { HourlyForecastData, WeatherData } from "../interface/weatherApi";
import {convertPressureToMmHg, getTooltip} from "../utils/weather"

const Weather = () => {
  const [city, setCity] = useState("Moscow");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "hourly" | "fiveDay">("current");

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Не удалось получить данные о погоде. Проверьте название города.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecast = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHourlyForecast(city);
      setHourlyForecast(data);
    } catch (err: any) {
      setError(err.message || "Не удалось получить прогноз погоды.");
      setHourlyForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    fetchForecast();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
    fetchForecast();
  };

  const get24HourForecast = () => {
    if (!hourlyForecast) return [];
    const now = new Date();
    const next24Hours = now.getTime() / 1000 + 24 * 60 * 60;
    return hourlyForecast.list.filter((item) => item.dt <= next24Hours).slice(0, 8);
  };

  const getFiveDayForecast = () => {
    if (!hourlyForecast) return [];
    const dailyData: {
      [key: string]: { dayTemp: number[]; nightTemp: number[]; weather: string; icon: string };
    } = {};
    hourlyForecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("ru-RU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const hour = new Date(item.dt * 1000).getHours();
      if (!dailyData[date]) {
        dailyData[date] = { dayTemp: [], nightTemp: [], weather: item.weather[0].description, icon: item.weather[0].icon };
      }
      if (hour >= 6 && hour <= 18) {
        dailyData[date].dayTemp.push(item.main.temp);
      } else {
        dailyData[date].nightTemp.push(item.main.temp);
      }
    });
    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      dayTemp: data.dayTemp.length ? Math.round(data.dayTemp.reduce((a, b) => a + b, 0) / data.dayTemp.length) : 0,
      nightTemp: data.nightTemp.length ? Math.round(data.nightTemp.reduce((a, b) => a + b, 0) / data.nightTemp.length) : 0,
      weather: data.weather,
      icon: data.icon,
    }));
  };

  return (
    <div className="wrapper bg-gradient-to-br text-black from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-6">
      <div className="min-w-96 max-w-[450px] bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Погода</h2>
        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Введите город"
              className="flex-1 p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-gray-800 text-sm sm:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Узнать"
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center mb-4 sm:mb-6 gap-2">
          {["current", "hourly", "fiveDay"].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              onClick={() => setActiveTab(tab as "current" | "hourly" | "fiveDay")}
            >
              {tab === "current" ? "Текущая" : tab === "hourly" ? "Почасовой" : "5 дней"}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 bg-red-100/80 p-3 rounded-lg mb-4 text-center animate-fade-in text-sm sm:text-base">
            {error}
          </p>
        )}

        {activeTab === "current" && weather && (
          <div className="animate-fade-in">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
              {weather.name}, {weather.sys.country}
            </h3>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20"
            />
            <p className="text-base sm:text-lg capitalize text-gray-600 mb-4 text-center">
              {weather.weather[0].description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                className="flex items-center bg-blue-50 p-3 rounded-lg tooltip"
                data-tooltip={getTooltip("temperature", weather.main.temp)}
              >
                <WiThermometer className="text-blue-500 text-2xl sm:text-3xl mr-2 icon-hover" />
                <p className="text-sm sm:text-base">
                  Температура: <span className="font-semibold">{Math.round(weather.main.temp)}°C</span>
                </p>
              </div>
              <div
                className="flex items-center bg-blue-50 p-3 rounded-lg tooltip"
                data-tooltip={getTooltip("humidity", weather.main.humidity)}
              >
                <WiHumidity className="text-blue-500 text-2xl sm:text-3xl mr-2 icon-hover" />
                <p className="text-sm sm:text-base">
                  Влажность: <span className="font-semibold">{weather.main.humidity}%</span>
                </p>
              </div>
              <div
                className="flex items-center bg-blue-50 p-3 rounded-lg tooltip"
                data-tooltip={getTooltip("pressure", weather.main.pressure)}
              >
                <WiBarometer className="text-blue-500 text-2xl sm:text-3xl mr-2 icon-hover" />
                <p className="text-sm sm:text-base">
                  Давление:{" "}
                  <span className="font-semibold">{convertPressureToMmHg(weather.main.pressure)} мм рт. ст.</span>
                </p>
              </div>
              <div
                className="flex items-center bg-blue-50 p-3 rounded-lg tooltip"
                data-tooltip={getTooltip("wind", weather.wind.speed)}
              >
                <WiStrongWind className="text-blue-500 text-2xl sm:text-3xl mr-2 icon-hover" />
                <p className="text-sm sm:text-base">
                  Ветер: <span className="font-semibold">{weather.wind.speed} м/с</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "hourly" && hourlyForecast && (
          <div className="animate-fade-in">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
              Почасовой прогноз на 24 часа
            </h3>
            <div className="flex flex-col gap-2 sm:overflow-x-auto">
              {get24HourForecast().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-around bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-all duration-200"
                >
                  <span className="w-1/4 text-center text-sm sm:text-base">
                    {new Date(item.dt * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="w-1/4 text-center text-sm sm:text-base">{Math.round(item.main.temp)}°C</span>
                  <div className="w-1/2 flex items-center justify-start gap-4 text-sm sm:text-base capitalize">
                    <img
                      src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt="Weather icon"
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                    <span>{item.weather[0].description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "fiveDay" && hourlyForecast && (
          <div className="animate-fade-in">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
              Прогноз на 5 дней
            </h3>
            <div className="flex flex-col gap-2">
              {getFiveDayForecast().map((day, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-all duration-200"
                >
                  <img
                    src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                    alt="Weather icon"
                    className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{day.date}</p>
                    <p className="capitalize text-gray-600 text-sm sm:text-base">{day.weather}</p>
                  </div>
                  <div className="text-right text-sm sm:text-base">
                    <p className="font-semibold text-gray-800">{day.dayTemp}°C</p>
                    <p className="text-gray-600">{day.nightTemp}°C</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;