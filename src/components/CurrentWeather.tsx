import { WeatherData } from "../interface/weatherApi";
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind } from "react-icons/wi";
import { convertPressureToMmHg, getTooltip, getWeatherIcon } from "../utils/weatherUtils";

interface CurrentWeatherProps {
  weather: WeatherData;
}

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
  const WeatherIcon = getWeatherIcon(weather.weather[0].icon);

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center">
        {weather.name}, {weather.sys.country}
      </h3>
      <WeatherIcon className="mx-auto text-blue-500 text-5xl sm:text-6xl icon-hover" />
      <p className="text-base sm:text-lg capitalize text-gray-600 mb-4 text-center">{weather.weather[0].description}</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
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