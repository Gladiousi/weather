import { WiCloudRefresh } from "react-icons/wi";
import { useSolarActivity } from "../hooks/useSolarActivity";
import { GeomagneticStorms } from "./GeomagneticStorms";

export const SolarActivity = () => {
  const { solarActivity, isLoading, error } = useSolarActivity();

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <WiCloudRefresh className="animate-spin text-4xl mx-auto text-gray-500" />
        <p className="text-gray-600 mt-2">Загрузка данных о солнечной активности...</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 bg-red-100/80 p-3 rounded-lg mb-4 text-center animate-fade-in text-sm sm:text-base">
        {error}
      </p>
    );
  }

  if (!solarActivity || solarActivity.dailyKpIndices.length === 0) {
    return (
      <p className="text-gray-600 text-center text-sm sm:text-base mb-4 animate-fade-in">
        Данные о геомагнитных бурях на данный момент отсутствуют.
      </p>
    );
  }

  return (
    <div className="p-4 rounded-xl mt-4 animate-fade-in">
      <GeomagneticStorms dailyKpData={solarActivity.dailyKpIndices} />
    </div>
  );
};