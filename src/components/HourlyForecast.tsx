import { HourlyForecastData } from "../interface/weatherApi";
import { get24HourForecast, getWeatherIcon } from "../utils/weatherUtils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyForecastProps {
  hourlyForecast: HourlyForecastData;
}

export const HourlyForecast = ({ hourlyForecast }: HourlyForecastProps) => {
  const forecastData = get24HourForecast(hourlyForecast).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    temp: Math.round(item.main.temp),
    weather: item.weather[0].description,
    icon: item.weather[0].icon,
  }));

  return (
    <div className="animate-fade-in container-scroll">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
        Почасовой прогноз на 24 часа
      </h3>
      <div className="mb-6 sm:mb-8 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={forecastData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "#4B5563" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#4B5563" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const WeatherIcon = getWeatherIcon(data.icon);
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <div className="flex items-center gap-2">
                        <WeatherIcon className="text-blue-500 text-xl" />
                        <p className="text-sm capitalize text-gray-600">{data.weather}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">Температура: {data.temp}°C</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#tempGradient)"
              activeDot={{ r: 6, fill: "#3B82F6", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 snap-x snap-mandatory container-scroll">
        {forecastData.map((item, index) => {
          const WeatherIcon = getWeatherIcon(item.icon);
          return (
            <div
              key={index}
              className="hourly-card flex-none w-32 sm:w-36 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 snap-center"
            >
              <p className="text-sm sm:text-base font-semibold text-gray-800 text-center">{item.time}</p>
              <WeatherIcon className="text-blue-500 text-3xl sm:text-4xl mx-auto my-2 icon-hover" />
              <p className="text-sm sm:text-base font-medium text-gray-800 text-center">{item.temp}°C</p>
              <p className="text-xs sm:text-sm capitalize text-gray-600 text-center truncate">{item.weather}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};