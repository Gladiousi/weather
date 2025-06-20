import React from "react";
import { WeatherTabsProps } from "../interface/solarActivityApi";

export const WeatherTabs: React.FC<WeatherTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "current", label: "Сейчас" },
    { id: "hourly", label: "Почасовой" },
    { id: "fiveDay", label: "5 дней" },
    { id: "solarActivity", label: "Бури" }, 
  ];

  return (
    <div className="flex justify-between items-center bg-gray-100/60 backdrop-blur-md rounded-xl p-1 mb-6 shadow-inner">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-2 px-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 ease-in-out
            ${activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md transform scale-105"
              : "text-gray-700 hover:bg-gray-200/80 hover:text-blue-800"
            }`}
          onClick={() => setActiveTab(tab.id as "current" | "hourly" | "fiveDay" | "solarActivity")} // Приведение типов
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};