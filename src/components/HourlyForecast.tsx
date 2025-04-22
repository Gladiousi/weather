import { HourlyForecastData } from "../interface/weatherApi";
import { get24HourForecast } from "../utils/weatherUtils";

interface HourlyForecastProps {
  hourlyForecast: HourlyForecastData;
}

export const HourlyForecast = ({ hourlyForecast }: HourlyForecastProps) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
        Почасовой прогноз на 24 часа
      </h3>
      <div className="flex flex-col gap-2 sm:overflow-x-auto">
        {get24HourForecast(hourlyForecast).map((item, index) => (
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
  );
};