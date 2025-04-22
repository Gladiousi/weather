import { useState, useEffect } from "react";
import { WeatherData, HourlyForecastData } from "../interface/weatherApi";
import { fetchWeather, fetchForecast } from "../utils/weatherService";

export const useWeather = () => {
  const [city, setCity] = useState("Moscow");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "hourly" | "fiveDay">("current");

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const weatherData = await fetchWeather(city);
      setWeather(weatherData);
    } catch (err: any) {
      setError(err.message || "Не удалось получить данные о погоде. Проверьте название города.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecastData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const forecastData = await fetchForecast(city);
      setHourlyForecast(forecastData);
    } catch (err: any) {
      setError(err.message || "Не удалось получить прогноз погоды.");
      setHourlyForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    fetchForecastData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData();
    fetchForecastData();
  };

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