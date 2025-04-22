import { useState, useCallback } from "react";
import { WeatherData, HourlyForecastData, CacheData } from "../interface/weatherApi";
import { fetchWeather, fetchForecast } from "../utils/weatherService";

const CACHE_TTL = 10 * 60 * 1000;

const getCachedData = (city: string): CacheData | null => {
  try {
    const cached = localStorage.getItem(`weather_${city.toLowerCase()}`);
    if (!cached) return null;
    const data: CacheData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_TTL) {
      localStorage.removeItem(`weather_${city.toLowerCase()}`);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
};

const setCachedData = (city: string, weather: WeatherData, hourlyForecast: HourlyForecastData) => {
  try {
    const data: CacheData = {
      weather,
      hourlyForecast,
      timestamp: Date.now(),
    };
    localStorage.setItem(`weather_${city.toLowerCase()}`, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving cache:", error);
  }
};

const normalizeCityName = (city: string) => {
  return city.trim().replace(/\s+/g, " ").replace(/[<>"&']/g, "");
};

export const useWeather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "hourly" | "fiveDay">("current");

  const fetchWeatherData = useCallback(async (cityName: string) => {
    const normalizedCity = normalizeCityName(cityName);
    if (!normalizedCity) {
      setError("Введите название города");
      return;
    }

    setIsLoading(true);
    setError(null);

    const cachedData = getCachedData(normalizedCity);
    if (cachedData) {
      setWeather(cachedData.weather);
      setHourlyForecast(cachedData.hourlyForecast);
      setIsLoading(false);
      return;
    }

    try {
      const weatherData = await fetchWeather(normalizedCity);
      const forecastData = await fetchForecast(normalizedCity);

      setWeather(weatherData);
      setHourlyForecast(forecastData);
      setCachedData(normalizedCity, weatherData, forecastData);
    } catch (err) {
      const fallbackCache = getCachedData(normalizedCity);
      if (fallbackCache) {
        setWeather(fallbackCache.weather);
        setHourlyForecast(fallbackCache.hourlyForecast);
        setError("Не удалось обновить данные, показаны кэшированные данные");
      } else {
        setError("Не удалось загрузить данные. Проверьте название города или подключение к интернету.");
        setWeather(null);
        setHourlyForecast(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      fetchWeatherData(city);
    },
    [city, fetchWeatherData]
  );

  return {
    city,
    setCity,
    weather,
    hourlyForecast,
    error,
    isLoading,
    activeTab,
    setActiveTab,
    handleSubmit,
  };
};