import { FormEvent } from "react";

interface WeatherFormProps {
  city: string;
  setCity: (city: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export const WeatherForm = ({ city, setCity, handleSubmit, isLoading }: WeatherFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город"
          className="flex-1 p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-gray-800 text-sm sm:text-base"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
    </form>
  );
};