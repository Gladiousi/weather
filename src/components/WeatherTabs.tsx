interface WeatherTabsProps {
  activeTab: "current" | "hourly" | "fiveDay";
  setActiveTab: (tab: "current" | "hourly" | "fiveDay") => void;
}

export const WeatherTabs = ({ activeTab, setActiveTab }: WeatherTabsProps) => {
  const tabs = [
    { id: "current", label: "Текущая" },
    { id: "hourly", label: "Почасовой" },
    { id: "fiveDay", label: "5 дней" },
  ];

  return (
    <div className="flex flex-wrap justify-center mb-4 sm:mb-6 gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-3 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${
            activeTab === tab.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab(tab.id as "current" | "hourly" | "fiveDay")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};