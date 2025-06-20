export interface XrasKpDataEntry {
  time: string; 
  f10: string; 
  sn: string; 
  ap: string; 
  max_kp: string; 
  h00: string | "null"; 
  h03: string | "null"; 
  h06: string | "null";
  h09: string | "null";
  h12: string | "null";
  h15: string | "null";
  h18: string | "null";
  h21: string | "null";
}

export interface XrasKpApiResponse {
  version: string;
  type: string;
  error: string;
  tzone: string;
  stime: string; 
  etime: string; 
  kp_type: string;
  kp_step: string;
  kp_min: string;
  N: string; 
  data: XrasKpDataEntry[];
}

export interface DailyKpIndexData {
  date: string; 
  label: string;
  maxKp: number;
  hourlyKpValues: Array<{ hour: string; kp: number }>; 
}

export interface GeomagneticStormsProps {
  dailyKpData: DailyKpIndexData[]; 
}

export interface SolarActivityData {
  dailyKpIndices: DailyKpIndexData[];
}

export interface WeatherTabsProps {
  activeTab: "current" | "hourly" | "fiveDay" | "solarActivity"; 
  setActiveTab: (tab: "current" | "hourly" | "fiveDay" | "solarActivity") => void; 
}