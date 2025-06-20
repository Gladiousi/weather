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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const targetDates = [
      yesterday.toISOString().split('T')[0],
      today.toISOString().split('T')[0],
      tomorrow.toISOString().split('T')[0]
    ];

    const processedData: DailyKpIndexData[] = [];

    const apiDataMap = new Map<string, XrasKpDataEntry>();
    data.data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    data.data.forEach(entry => {
        apiDataMap.set(entry.time, entry);
    });

    targetDates.forEach((dateKey, index) => {
        const entry = apiDataMap.get(dateKey);
        let maxKp = 0;
        const hourlyKpValues: Array<{ hour: string; kp: number }> = [];
        let label = '';

        if (index === 0) label = 'Вчера';
        else if (index === 1) label = 'Сегодня';
        else if (index === 2) label = 'Завтра';

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