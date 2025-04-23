import { FormEvent } from "react";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
  sys: {
    country: string;
  };
  wind: {
    speed: number;
  };
}

interface HourlyForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

interface CacheData {
  weather: WeatherData;
  hourlyForecast: HourlyForecastData;
  timestamp: number;
}

interface CurrentWeatherProps {
  weather: WeatherData;
}

interface FiveDayForecastProps {
  hourlyForecast: HourlyForecastData;
}

interface HourlyForecastProps {
  hourlyForecast: HourlyForecastData;
}

interface WeatherFormProps {
  city: string;
  setCity: (city: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

interface WeatherTabsProps {
  activeTab: "current" | "hourly" | "fiveDay";
  setActiveTab: (tab: "current" | "hourly" | "fiveDay") => void;
}

export type { WeatherData, HourlyForecastData, CacheData, CurrentWeatherProps, WeatherFormProps, FiveDayForecastProps, HourlyForecastProps, WeatherTabsProps }