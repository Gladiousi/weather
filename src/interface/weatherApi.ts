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

export type { WeatherData, HourlyForecastData }