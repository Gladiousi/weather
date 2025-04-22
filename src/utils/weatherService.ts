import { getWeatherByCity, getHourlyForecast } from "./weatherApi";
import { WeatherData, HourlyForecastData } from "../interface/weatherApi";

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  return await getWeatherByCity(city);
};

export const fetchForecast = async (city: string): Promise<HourlyForecastData> => {
  return await getHourlyForecast(city);
};