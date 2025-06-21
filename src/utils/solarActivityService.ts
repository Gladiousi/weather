import { DailyKpIndexData } from "../interface/solarActivityApi";

let cachedKpData: DailyKpIndexData[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000;

export const fetchKpIndices = async (): Promise<DailyKpIndexData[]> => {
  try {
    if (cachedKpData && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      console.log("Возвращаем данные Kp-индекса из кэша.");
      return cachedKpData;
    }

    const response = await fetch('/api/swpc/text/3-day-forecast.txt');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка при получении данных Kp-индекса от NOAA SWPC: ${response.statusText} - ${errorText}`);
    }

    const textData = await response.text();
    const processedData: DailyKpIndexData[] = [];

    const lines = textData.split('\n');
    let kpDataSectionFound = false;
    let headerDates: string[] = [];
    const rawHourlyValues: { [hour: string]: string[] } = {};

    for (const line of lines) {
      if (line.includes("NOAA Kp index breakdown")) {
        kpDataSectionFound = true;
        continue;
      }
      if (kpDataSectionFound) {
        if (line.trim().startsWith("B. NOAA") || line.trim().startsWith("C. NOAA") || line.trim() === '') {
          if (headerDates.length > 0 && Object.keys(rawHourlyValues).length > 0) {
              break; 
          }
          continue; 
        }

        const dateMatch = line.trim().match(/([A-Za-z]{3}\s+\d{1,2})/g);
        if (dateMatch && dateMatch.length >= 3 && headerDates.length === 0) {
          headerDates = dateMatch;
          continue;
        }

        const dataMatch = line.trim().match(/^(\d{2}-\d{2}UT)\s+([\d\.\s\(\)G-]+)\s+([\d\.\s\(\)G-]+)\s+([\d\.\s\(\)G-]+)/);
        if (dataMatch && headerDates.length >= 3) {
          const hourRange = dataMatch[1];
          rawHourlyValues[hourRange] = [dataMatch[2], dataMatch[3], dataMatch[4]];
        }
      }
    }

    if (headerDates.length === 0 || Object.keys(rawHourlyValues).length === 0) {
      console.warn("NOAA Kp data section not found or incomplete. Generating simulated data for all 7 days.");
      return generateSimulatedKpData(7);
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const yesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1);

    const tomorrowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);

    headerDates.forEach((dateString, dateIndex) => {
      const dateParts = dateString.split(' ');
      const monthStr = dateParts[0];
      const day = parseInt(dateParts[1]);

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthNum = monthNames.indexOf(monthStr);

      if (monthNum === -1 || isNaN(day)) {
        console.warn(`Некорректная часть даты: ${dateString}. Пропускаем эту запись.`);
        return; 
      }

      const fullDateUTC = new Date(Date.UTC(currentYear, monthNum, day));
      
      let maxKp = 0;
      const hourlyKpValues: Array<{ hour: string; kp: number }> = [];

      const sortedHourRanges = Object.keys(rawHourlyValues).sort((a, b) => {
          return parseInt(a.substring(0, 2)) - parseInt(b.substring(0, 2));
      });

      sortedHourRanges.forEach(hourRange => {
        const rawKpVal = rawHourlyValues[hourRange][dateIndex];
        const kpVal = parseFloat(rawKpVal.replace(/\s*\(G\d+\)\s*/, ''));
        
        if (!isNaN(kpVal)) {
          hourlyKpValues.push({ hour: hourRange.replace('UT', ''), kp: kpVal });
          if (kpVal > maxKp) {
            maxKp = kpVal;
          }
        }
      });

      let label = '';
      if (fullDateUTC.getTime() === yesterdayUTC.getTime()) {
        label = 'Вчера';
      } else if (fullDateUTC.getTime() === todayUTC.getTime()) {
        label = 'Сегодня';
      } else if (fullDateUTC.getTime() === tomorrowUTC.getTime()) {
        label = 'Завтра';
      }
      else {
        const dayOfWeek = fullDateUTC.toLocaleDateString("ru-RU", { weekday: 'long', timeZone: 'UTC' });
        label = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
      }

      processedData.push({
        date: fullDateUTC.toISOString().split('T')[0],
        label: label,
        maxKp: maxKp,
        hourlyKpValues: hourlyKpValues
      });
    });

    const finalProcessedData: DailyKpIndexData[] = [];
    const seenDates = new Set<string>();

    const yesterdayAsDateString = yesterdayUTC.toISOString().split('T')[0];
    if (!processedData.some(d => d.date === yesterdayAsDateString)) {
        const simulatedYesterday = generateSimulatedKpData(1, yesterdayUTC)[0];
        simulatedYesterday.label = 'Вчера (прогноз)'; 
        finalProcessedData.push(simulatedYesterday);
        seenDates.add(simulatedYesterday.date);
    }

    processedData.forEach(day => {
        if (!seenDates.has(day.date)) {
            finalProcessedData.push(day);
            seenDates.add(day.date);
        }
    });

    finalProcessedData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalDaysNeeded = 7;
    const currentDaysCount = finalProcessedData.length;

    if (currentDaysCount < totalDaysNeeded) {
        let lastDateInList = finalProcessedData.length > 0 
                             ? new Date(finalProcessedData[finalProcessedData.length - 1].date) 
                             : new Date(todayUTC);
        
        for (let i = currentDaysCount; i < totalDaysNeeded; i++) {
            lastDateInList.setUTCDate(lastDateInList.getUTCDate() + 1);
            const simulatedDay = generateSimulatedKpData(1, lastDateInList)[0];
            
            const dayOfWeek = lastDateInList.toLocaleDateString("ru-RU", { weekday: 'long', timeZone: 'UTC' });
            simulatedDay.label = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} (прогноз)`;
            
            finalProcessedData.push(simulatedDay);
        }
    }
    
    cachedKpData = finalProcessedData;
    lastFetchTime = Date.now();

    return finalProcessedData;

  } catch (error) {
    console.error("Ошибка при получении данных Kp-индекса:", error);
    return generateSimulatedKpData(7); 
  }
};

const generateSimulatedKpData = (numDays: number, startDate: Date = new Date()): DailyKpIndexData[] => {
    const simulatedData: DailyKpIndexData[] = [];
    
    let currentDate = new Date(startDate.toUTCString());
    currentDate.setUTCHours(0,0,0,0);

    const todayUTCForSim = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    const yesterdayUTCForSim = new Date(todayUTCForSim);
    yesterdayUTCForSim.setUTCDate(todayUTCForSim.getUTCDate() - 1);

    for (let i = 0; i < numDays; i++) {
        const currentDay = new Date(currentDate);
        currentDay.setUTCDate(currentDate.getUTCDate() + i);
        currentDay.setUTCHours(0,0,0,0);

        const hourlyKp: Array<{ hour: string; kp: number }> = [];
        let maxKp = 0;

        for (let h = 0; h <= 21; h += 3) {
            const kpValue = parseFloat((1.0 + Math.random() * 2.0).toFixed(1)); 
            hourlyKp.push({ hour: `${String(h).padStart(2, '0')}:00`, kp: kpValue });
            if (kpValue > maxKp) {
                maxKp = kpValue;
            }
        }

        let label = '';
        if (currentDay.getTime() === yesterdayUTCForSim.getTime()) {
            label = 'Вчера';
        } else if (currentDay.getTime() === todayUTCForSim.getTime()) {
            label = 'Сегодня';
        } else {
            const dayOfWeek = currentDay.toLocaleDateString("ru-RU", { weekday: 'long', timeZone: 'UTC' });
            label = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
        }

        simulatedData.push({
            date: currentDay.toISOString().split('T')[0],
            label: label,
            maxKp: parseFloat(maxKp.toFixed(1)),
            hourlyKpValues: hourlyKp
        });
    }
    return simulatedData;
};
