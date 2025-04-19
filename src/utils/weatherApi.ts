import { HourlyForecastData, WeatherData } from "../interface/weatherApi";

const WEATHER_BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL || "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

if (!API_KEY) {
    throw new Error("API ключ не задан в переменных окружения (VITE_WEATHER_API_KEY)");
}

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    try {
        const response = await fetch(
            `${WEATHER_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
        );
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Недействительный API ключ. Проверьте VITE_WEATHER_API_KEY в .env");
            }
            if (response.status === 404) {
                throw new Error("Город не найден");
            }
            throw new Error(`Ошибка API: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error);
        throw error;
    }
};

export const getHourlyForecast = async (city: string): Promise<HourlyForecastData> => {
    try {
        const response = await fetch(
            `${WEATHER_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
        );
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Недействительный API ключ. Проверьте VITE_WEATHER_API_KEY в .env");
            }
            if (response.status === 404) {
                throw new Error("Город не найден");
            }
            throw new Error(`Ошибка API: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при получении почасового прогноза:", error);
        throw error;
    }
};