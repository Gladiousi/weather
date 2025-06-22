import {
    WiDaySunny, WiCloud, WiCloudy, WiFog, WiDayShowers, WiDayRain,
    WiThunderstorm, WiSnow, WiSleet, WiDust, WiSmoke, WiTornado,
    WiHail, WiRainMix, WiNa
  } from "react-icons/wi";
  import React from "react";
  
  export const convertPressureToMmHg = (hPa: number): number => {
    return Math.round(hPa * 0.750062);
  };
  
  export const getWeatherIcon = (iconCode: string): React.ComponentType<any> => {
    switch (iconCode) {
      case "01d":
      case "01n":
        return WiDaySunny;
      case "02d":
      case "02n":
        return WiCloud;
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return WiCloudy;
      case "09d":
      case "09n":
        return WiDayShowers;
      case "10d":
      case "10n":
        return WiDayRain;
      case "11d":
      case "11n":
        return WiThunderstorm;
      case "13d":
      case "13n":
        return WiSnow;
      case "50d":
      case "50n":
        return WiFog;
      case "07d":
      case "07n":
        return WiDust;
      case "06d":
      case "06n":
        return WiSmoke;
      case "12d":
      case "12n":
        return WiSleet;
      case "14d":
      case "14n":
        return WiRainMix;
      case "15d":
      case "15n":
        return WiHail;
      case "16d":
      case "16n":
        return WiTornado;
      default:
        return WiNa;
    }
  };
  
  export const getTooltip = (type: string, value: number | string) => {
    switch (type) {
      case "temperature":
        return `Температура: ${Math.round(Number(value))}°C`;
      case "humidity":
        return `Влажность: ${value}%`;
      case "pressure":
        return `Давление: ${value} мм рт. ст.`;
      case "wind":
        return `Скорость ветра: ${value} м/с`;
      default:
        return "";
    }
  };
  
  export const getWeatherBackground = (iconCode: string): string => {
    switch (iconCode.slice(0, 2)) {
      case "01": 
        return "bg-gradient-to-br from-blue-300 via-sky-300 to-indigo-400";
      case "02":
      case "03":
      case "04": 
        return "bg-gradient-to-br from-gray-300 via-blue-300 to-indigo-300";
      case "09":
      case "10": 
        return "bg-gradient-to-br from-gray-500 via-blue-400 to-indigo-400";
      case "11": 
        return "bg-gradient-to-br from-gray-700 via-gray-600 to-blue-500";
      case "13": 
        return "bg-gradient-to-br from-blue-200 via-sky-200 to-white";
      case "50": 
        return "bg-gradient-to-br from-gray-400 via-gray-300 to-blue-200";
      default:
        return "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100";
    }
  };
  
  export const get24HourForecast = (hourlyForecast: any) => {
    if (!hourlyForecast || !hourlyForecast.list) return [];
    
    const now = new Date();
    const currentTimestamp = Math.floor(now.getTime() / 1000);
  
    const filteredList = hourlyForecast.list.filter((item: any) => item.dt >= currentTimestamp);
  
    return filteredList.slice(0, 8);
  };
  
  export const getFiveDayForecast = (hourlyForecast: any) => {
    if (!hourlyForecast || !hourlyForecast.list) return [];
  
    const dailyDataMap = new Map();
    const now = new Date();
    
    hourlyForecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      
      if (date.toDateString() === now.toDateString() && date.getTime() < now.getTime()) {
        return;
      }
  
      const dayKey = date.toLocaleDateString("ru-RU", { weekday: 'short', day: 'numeric', month: 'short' });
  
      if (!dailyDataMap.has(dayKey)) {
        dailyDataMap.set(dayKey, {
          date: dayKey,
          temps: [],
          weather: item.weather[0].description,
          icon: item.weather[0].icon,
        });
      }
      dailyDataMap.get(dayKey).temps.push(item.main.temp);
    });
  
    const fiveDayForecast = Array.from(dailyDataMap.values()).map((day: any) => {
      const temps = day.temps;
      const dayTemp = Math.round(Math.max(...temps));
      const nightTemp = Math.round(Math.min(...temps));
  
      return {
        date: day.date,
        dayTemp: dayTemp,
        nightTemp: nightTemp,
        weather: day.weather,
        icon: day.icon,
      };
    });
  
    return fiveDayForecast.slice(0, 5); 
  };

  export const getCurrentTimeForTimezone = (timezoneOffsetInSeconds: number): string => {
    const now = new Date(); 
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); 
    const targetTime = new Date(utcTime + (timezoneOffsetInSeconds * 1000)); 

    const hours = targetTime.getHours();
    const minutes = targetTime.getMinutes();

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  };
