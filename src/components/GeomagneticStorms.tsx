import React from "react";
import { WiStrongWind } from "react-icons/wi";
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { GeomagneticStormsProps } from "../interface/solarActivityApi"; 

const getKpIndexColorClass = (kpIndex: number) => {
  if (kpIndex >= 7) return "bg-red-600 text-white"; 
  if (kpIndex >= 5) return "bg-orange-500 text-white"; 
  if (kpIndex >= 3) return "bg-yellow-400 text-gray-800"; 
  return "bg-green-500 text-white"; 
};

const getKpIndexDescription = (kpIndex: number) => {
  if (kpIndex >= 7) return "Сильная/Экстремальная буря. Возможны серьезные сбои в работе техники и нарушения самочувствия.";
  if (kpIndex >= 5) return "Умеренная/Сильная буря. Возможны незначительные сбои и влияние на самочувствие.";
  if (kpIndex >= 3) return "Повышенная активность. Чувствительные люди могут ощущать недомогание.";
  return "Низкая активность. Магнитное поле стабильно.";
};

const getKpIndexIcon = (kpIndex: number) => {
    if (kpIndex >= 5) return <FaExclamationTriangle className="text-lg" />;
    if (kpIndex >= 3) return <FaInfoCircle className="text-lg" />;
    return <FaCheckCircle className="text-lg" />;
};

export const GeomagneticStorms: React.FC<GeomagneticStormsProps> = ({ dailyKpData }) => {

  const hasAnyData = dailyKpData && dailyKpData.some(day => day.maxKp > 0 || day.hourlyKpValues.length > 0);

  return (
    <div className="mb-6 animate-fade-in">
      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center sm:justify-start">
        <WiStrongWind className="text-blue-600 text-3xl mr-2 animate-pulse" />
        Геомагнитные бури (Kp-индекс)
      </h4>

      <div className="flex flex-wrap gap-4">
        {dailyKpData.map(dayData => {
          const kpColorClass = getKpIndexColorClass(dayData.maxKp);
          const kpDescription = getKpIndexDescription(dayData.maxKp);
          const kpIcon = getKpIndexIcon(dayData.maxKp);

          return (
            <div
              key={dayData.date}
              className={`flex flex-col items-start bg-white/70 p-4 rounded-xl shadow-lg border border-gray-200
                          transition-all duration-300 hover:shadow-xl hover:scale-[1.01] text-left
                          ${dayData.maxKp >= 5 ? 'border-orange-500' : ''} ${dayData.maxKp >= 7 ? 'border-red-600' : ''}`}
            >
              <h5 className="text-lg font-semibold text-gray-800 mb-2">
                {dayData.label} ({new Date(dayData.date).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' })})
              </h5>
              
              <div className="flex items-center justify-center mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 ${kpColorClass}`}>
                    {kpIcon}
                </div>
                <p className="text-xl font-bold text-gray-800">
                    Kp: <span className="font-bold">{dayData.maxKp}</span>
                </p>
              </div>

              <p className="text-sm text-gray-700 mb-3">{kpDescription}</p>

              {dayData.hourlyKpValues.length > 0 && (
                <div className="w-full text-left mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Почасовые Kp:</p>
                  <div className="flex flex-wrap gap-1">
                    {dayData.hourlyKpValues.map((hKp, idx) => (
                      <span key={idx} className={`text-xs px-2 py-1 rounded-full ${getKpIndexColorClass(hKp.kp)}`}>
                        {hKp.hour}: {hKp.kp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
               {dayData.hourlyKpValues.length === 0 && dayData.maxKp === 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                      Данные о Kp-индексе отсутствуют.
                  </p>
              )}
            </div>
          );
        })}
      </div>

      {!hasAnyData && (
        <p className="text-gray-600 text-center text-sm sm:text-base mt-4 animate-fade-in">
          Данные о геомагнитных бурях на выбранный период отсутствуют.
        </p>
      )}
    </div>
  );
};