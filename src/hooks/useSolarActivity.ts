import { useState, useEffect } from "react";
import { fetchKpIndices } from "../utils/solarActivityService";
import { SolarActivityData } from "../interface/solarActivityApi";

export const useSolarActivity = () => {
  const [solarActivity, setSolarActivity] = useState<SolarActivityData>({ dailyKpIndices: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSolarActivity = async () => {
      try {
        setIsLoading(true);
        const dailyKpIndices = await fetchKpIndices();
        setSolarActivity({ dailyKpIndices });
        setError(null);
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить данные о геомагнитных бурях.");
        console.error("Ошибка при загрузке данных о геомагнитных бурях:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSolarActivity();
  }, []);

  return { solarActivity, isLoading, error };
};