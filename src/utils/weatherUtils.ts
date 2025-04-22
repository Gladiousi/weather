import { HourlyForecastData } from "../interface/weatherApi";

export const convertPressureToMmHg = (hPa: number) => Math.round(hPa * 0.750062);

export const getTooltip = (type: string, value: number) => {
  switch (type) {
    case "temperature":
      if (value >= 18 && value <= 25) return "Норма: 18–25°C. Комфортная температура.";
      if (value < 18) return "Норма: 18–25°C. Холодно, оденьтесь теплее.";
      return "Норма: 18–25°C. Жарко, пейте больше воды.";
    case "humidity":
      if (value >= 30 && value <= 60) return "Норма: 30–60%. Комфортная влажность.";
      if (value < 30) return "Норма: 30–60%. Слишком сухо, возможен дискомфорт.";
      return "Норма: 30–60%. Высокая влажность, может быть душно.";
    case "pressure":
      const mmHg = convertPressureToMmHg(value);
      if (mmHg >= 740 && mmHg <= 760) return "Норма: 740–760 мм рт. ст. Нормальное давление.";
      if (mmHg < 740) return "Норма: 740–760 мм рт. ст. Пониженное давление, возможны головные боли.";
      return "Норма: 740–760 мм рт. ст. Повышенное давление, будьте осторожны.";
    case "wind":
      if (value <= 5) return "Норма: до 5 м/с. Легкий ветер, комфортно.";
      if (value <= 10) return "Норма: до 5 м/с. Умеренный ветер, возможны порывы.";
      return "Норма: до 5 м/с. Сильный ветер, будьте осторожны.";
    default:
      return "";
  }
};

export const get24HourForecast = (hourlyForecast: HourlyForecastData | null) => {
  if (!hourlyForecast) return [];
  const now = new Date();
  const next24Hours = now.getTime() / 1000 + 24 * 60 * 60;
  return hourlyForecast.list.filter((item) => item.dt <= next24Hours).slice(0, 8);
};

export const getFiveDayForecast = (hourlyForecast: HourlyForecastData | null) => {
  if (!hourlyForecast) return [];
  const dailyData: {
    [key: string]: { dayTemp: number[]; nightTemp: number[]; weather: string; icon: string };
  } = {};
  hourlyForecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const hour = new Date(item.dt * 1000).getHours();
    if (!dailyData[date]) {
      dailyData[date] = { dayTemp: [], nightTemp: [], weather: item.weather[0].description, icon: item.weather[0].icon };
    }
    if (hour >= 6 && hour <= 18) {
      dailyData[date].dayTemp.push(item.main.temp);
    } else {
      dailyData[date].nightTemp.push(item.main.temp);
    }
  });
  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    dayTemp: data.dayTemp.length ? Math.round(data.dayTemp.reduce((a, b) => a + b, 0) / data.dayTemp.length) : 0,
    nightTemp: data.nightTemp.length ? Math.round(data.nightTemp.reduce((a, b) => a + b, 0) / data.nightTemp.length) : 0,
    weather: data.weather,
    icon: data.icon,
  }));
};