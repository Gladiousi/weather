import { HourlyForecastData } from "../interface/weatherApi";
import { getFiveDayForecast, getWeatherIcon } from "../utils/weatherUtils";

interface FiveDayForecastProps {
  hourlyForecast: HourlyForecastData;
}

export const FiveDayForecast = ({ hourlyForecast }: FiveDayForecastProps) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">Прогноз на 5 дней</h3>
      <div className="flex flex-col gap-2">
        {getFiveDayForecast(hourlyForecast).map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.icon);
          return (
            <div
              key={index}
              className="flex items-center bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-all duration-200"
            >
              <WeatherIcon className="text-blue-500 text-3xl sm:text-4xl mr-3 sm:mr-4 icon-hover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{day.date}</p>
                <p className="capitalize text-gray-600 text-sm sm:text-base">{day.weather}</p>
              </div>
              <div className="text-right text-sm sm:text-base">
                <p className="font-semibold text-gray-800">День: {day.dayTemp}°C</p>
                <p className="text-gray-600">Ночь: {day.nightTemp}°C</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};