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

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    const yesterdayUTC = new Date(todayUTC);
    yesterdayUTC.setUTCDate(todayUTC.getUTCDate() - 1);

    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    const targetDates = [
      yesterdayUTC.toISOString().split('T')[0],
      todayUTC.toISOString().split('T')[0],
      tomorrowUTC.toISOString().split('T')[0]
    ];

    const processedData: DailyKpIndexData[] = [];

    const apiDataMap = new Map<string, XrasKpDataEntry>();
    data.data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    data.data.forEach(entry => {
      apiDataMap.set(entry.time, entry);
    });

    targetDates.forEach((dateKey) => {
      const entry = apiDataMap.get(dateKey);
      let maxKp = 0;
      const hourlyKpValues: Array<{ hour: string; kp: number }> = [];
      let label = '';

      const entryDate = new Date(dateKey);
      if (entryDate.toDateString() === yesterdayUTC.toDateString()) {
        label = 'Вчера';
      } else if (entryDate.toDateString() === todayUTC.toDateString()) {
        label = 'Сегодня';
      } else if (entryDate.toDateString() === tomorrowUTC.toDateString()) {
        label = 'Завтра';
      } else {
        label = dateKey;
      }

      if (entry) {
        maxKp = parseFloat(entry.max_kp || '0');
        if (isNaN(maxKp)) maxKp = 0;

        for (let i = 0; i <= 21; i += 3) {
          const hourKey = `h${String(i).padStart(2, '0')}` as keyof XrasKpDataEntry;
          const kpValue = parseFloat(String(entry[hourKey]));
          if (!isNaN(kpValue)) {
            hourlyKpValues.push({ hour: `${String(i).padStart(2, '0')}:00`, kp: kpValue });
          }
        }
      }

      processedData.push({
        date: dateKey,
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