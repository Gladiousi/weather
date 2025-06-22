import React, { useState, useEffect, useRef } from "react";
import { WeatherFormProps } from "../interface/weatherApi";
import { fetchCitySuggestions } from "../utils/weatherApi"; 

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>; 
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const normalizeInput = (value: string) => {
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.replace(/[<>"&']/g, ""); 
};

export const WeatherForm = ({ city, setCity, handleSubmit, isLoading }: WeatherFormProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formRef = useRef<HTMLFormElement>(null); 

  const debouncedFetchSuggestions = useRef(
    debounce(async (query: string) => {
      if (query.length < 2) { 
        setSuggestions([]);
        return;
      }
      try {
        const data = await fetchCitySuggestions(query);
        const uniqueSuggestions = Array.from(new Map(data.map((item: any) => [`${item.name}-${item.country}`, item])).values());
        setSuggestions(uniqueSuggestions);
        setShowSuggestions(true); 
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
        setSuggestions([]); 
      }
    }, 300) 
  ).current;

  useEffect(() => {
    if (city) {
      debouncedFetchSuggestions(city);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [city, debouncedFetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedValue = normalizeInput(e.target.value);
    setCity(normalizedValue);
    if (normalizedValue.length >= 2) {
        setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const fullCityName = suggestion.state 
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setCity(fullCityName);
    setSuggestions([]); 
    setShowSuggestions(false); 
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 sm:mb-6 relative" ref={formRef}>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          onFocus={() => city.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Введите город"
          className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base
                     bg-white border-gray-300 text-gray-800
                     focus:ring-blue-500 placeholder:text-gray-400"
          disabled={isLoading}
          autoComplete="off" 
          onContextMenu={(e) => e.preventDefault()}
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base
                     bg-blue-500 text-white hover:opacity-80"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Узнать"
          )}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto city-suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-3 cursor-pointer hover:bg-gray-100 text-gray-800 text-sm sm:text-base border-b border-gray-200 last:border-b-0"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}
              {suggestion.state && `, ${suggestion.state}`} 
              {suggestion.country && `, ${suggestion.country}`} 
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
