import { XrasKpApiResponse, XrasKpDataEntry, DailyKpIndexData } from "../interface/solarActivityApi";

let cachedKpData: DailyKpIndexData[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000;

export const fetchKpIndices = async (): Promise<DailyKpIndexData[]> => {
  try {
    if (cachedKpData && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      console.log("Возвращаем данные Kp-индекса из кэша.");
      return cachedKpData;
    }

    console.log("Получаем новые данные Kp-индекса от xras.ru...");
    const response = await fetch('/api/xras/txt/kp_RAL5.json');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка при получении данных Kp-индекса от xras.ru: ${response.statusText} - ${errorText}`);
    }

    const data: XrasKpApiResponse = await response.json();

    if (data.error) {
      throw new Error(`API xras.ru вернуло ошибку: ${data.error}`);
    }

    const processedData: DailyKpIndexData[] = [];

    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const yesterdayLocal = new Date(todayLocal);
    yesterdayLocal.setDate(todayLocal.getDate() - 1);

    const tomorrowLocal = new Date(todayLocal);
    tomorrowLocal.setDate(todayLocal.getDate() + 1);

    data.data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    data.data.forEach(entry => {
      let maxKp = 0;
      const hourlyKpValues: Array<{ hour: string; kp: number }> = [];
      let label = '';

      const entryDate = new Date(entry.time);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.toDateString() === yesterdayLocal.toDateString()) {
        label = 'Вчера';
      } else if (entryDate.toDateString() === todayLocal.toDateString()) {
        label = 'Сегодня';
      } else if (entryDate.toDateString() === tomorrowLocal.toDateString()) {
        label = 'Завтра';
      } else {
        label = entryDate.toLocaleDateString("ru-RU", { day: 'numeric', month: 'long' });
      }

      maxKp = parseFloat(entry.max_kp || '0');
      if (isNaN(maxKp)) maxKp = 0;

      for (let i = 0; i <= 21; i += 3) {
        const hourKey = `h${String(i).padStart(2, '0')}` as keyof XrasKpDataEntry;
        const kpValue = parseFloat(String(entry[hourKey]));
        if (!isNaN(kpValue)) {
          hourlyKpValues.push({ hour: `${String(i).padStart(2, '0')}:00`, kp: kpValue });
        }
      }

      processedData.push({
        date: entry.time,
        label: label,
        maxKp: maxKp,
        hourlyKpValues: hourlyKpValues
      });
    });
    
    cachedKpData = processedData;
    lastFetchTime = Date.now();

    return processedData;

  } catch (error) {
    console.error("Ошибка при получении данных Kp-индекса:", error);
    throw error;
  }
};
