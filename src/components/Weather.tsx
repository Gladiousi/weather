import { useState, useEffect } from "react";
import { getWeatherByCity, getHourlyForecast } from "../utils/weatherApi";
import { HourlyForecastData, WeatherData } from "../interface/weatherApi"
import { FaThermometerHalf, FaTint, FaTachometerAlt, FaWind } from "react-icons/fa";

const Weather = () => {
  const [city, setCity] = useState("Moscow");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "hourly" | "fiveDay" | "historical">("current");

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
    const dailyData: { [key: string]: { temp: number[]; weather: string; icon: string } } = {};
    hourlyForecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" });
      if (!dailyData[date]) {
        dailyData[date] = { temp: [], weather: item.weather[0].description, icon: item.weather[0].icon };
      }
      dailyData[date].temp.push(item.main.temp);
    });
    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      temp: Math.round(data.temp.reduce((a, b) => a + b, 0) / data.temp.length),
      weather: data.weather,
      icon: data.icon,
    }));
  };

  return (
    <div className="min-h-screen w-screen overflow-clip flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Погода</h2>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Введите город"
              className="flex-1 p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-gray-800"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 mx-1 rounded-lg ${activeTab === "current" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition-all duration-200`}
            onClick={() => setActiveTab("current")}
          >
            Текущая
          </button>
          <button
            className={`px-4 py-2 mx-1 rounded-lg ${activeTab === "hourly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition-all duration-200`}
            onClick={() => setActiveTab("hourly")}
          >
            Почасовой
          </button>
          <button
            className={`px-4 py-2 mx-1 rounded-lg ${activeTab === "fiveDay" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition-all duration-200`}
            onClick={() => setActiveTab("fiveDay")}
          >
            5 дней
          </button>
        </div>

        {error && (
          <p className="text-red-500 bg-red-100/80 p-3 rounded-lg mb-4 text-center animate-fade-in">
            {error}
          </p>
        )}

        {activeTab === "current" && weather && (
          <div className="text-center animate-fade-in">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {weather.name}, {weather.sys.country}
            </h3>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className="mx-auto w-20 h-20"
            />
            <p className="text-lg capitalize text-gray-600 mb-4">{weather.weather[0].description}</p>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                <FaThermometerHalf className="text-blue-500 mr-2" />
                <p>
                  Температура: <span className="font-semibold">{Math.round(weather.main.temp)}°C</span>
                </p>
              </div>
              <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                <FaTint className="text-blue-500 mr-2" />
                <p>
                  Влажность: <span className="font-semibold">{weather.main.humidity}%</span>
                </p>
              </div>
              <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                <FaTachometerAlt className="text-blue-500 mr-2" />
                <p>
                  Давление: <span className="font-semibold">{weather.main.pressure} гПа</span>
                </p>
              </div>
              <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                <FaWind className="text-blue-500 mr-2" />
                <p>
                  Ветер: <span className="font-semibold">{weather.wind.speed} м/с</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "hourly" && hourlyForecast && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Почасовой прогноз на 24 часа
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-gray-700">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-2">Время</th>
                    <th className="p-2">Температура</th>
                    <th className="p-2">Погода</th>
                    <th className="p-2">Иконка</th>
                  </tr>
                </thead>
                <tbody>
                  {get24HourForecast().map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 text-center">
                        {new Date(item.dt * 1000).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-2 text-center">{Math.round(item.main.temp)}°C</td>
                      <td className="p-2 text-center capitalize">{item.weather[0].description}</td>
                      <td className="p-2 text-center">
                        <img
                          src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt="Weather icon"
                          className="w-8 h-8 mx-auto"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "fiveDay" && hourlyForecast && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Прогноз на 5 дней
            </h3>
            <div className="grid gap-4">
              {getFiveDayForecast().map((day, index) => (
                <div key={index} className="flex items-center bg-blue-50 p-3 rounded-lg">
                  <img
                    src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                    alt="Weather icon"
                    className="w-10 h-10 mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{day.date}</p>
                    <p className="capitalize text-gray-600">{day.weather}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{day.temp}°C</p>
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