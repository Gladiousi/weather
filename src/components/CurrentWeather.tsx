import { WeatherData } from "../interface/weatherApi";
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind } from "react-icons/wi";
import { convertPressureToMmHg, getTooltip } from "../utils/weatherUtils";

interface CurrentWeatherProps {
  weather: WeatherData;
}

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
        {weather.name}, {weather.sys.country}
      </h3>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
        className="mx-auto w-16 h-16 sm:w-20 sm:h-20"
      />
      <p className="text-base sm:text-lg capitalize text-gray-600 mb-4 text-center">{weather.weather[0].description}</p>
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
            Давление: <span className="font-semibold">{convertPressureToMmHg(weather.main.pressure)} мм рт. ст.</span>
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
  );
};