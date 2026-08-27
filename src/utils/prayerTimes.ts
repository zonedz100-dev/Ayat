// Prayer Times Astronomical Engine, API & Geolocation Service
import { COUNTRIES_DATA, CALCULATION_METHODS } from '../data/prayerLocationsData';

export interface UserPrayerLocation {
  countryCode: string;
  countryName: string;
  stateId: string;
  stateName: string;
  municipalityId: string;
  municipalityName: string;
  locality?: string;
  latitude: number;
  longitude: number;
  isAutoGps: boolean;
  calculationMethod: number; // 3: MWL, 4: Makkah, 5: Egypt, 19: Algeria, 20: Morocco, etc.
  juristicMethod: 'standard' | 'hanafi'; // Shafi'i/Maliki/Hanbali (1 shadow) or Hanafi (2 shadow)
  adjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface SinglePrayerTime {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  time: string; // 'HH:MM' 24h
  time12: string; // 'h:mm AM/PM'
  period: 'ص' | 'م';
  iconName: string;
}

export interface DayPrayerTimings {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  gregorianFormatted: string;
  hijriFormatted: string;
  hijriDay: number;
  hijriMonth: string;
  hijriYear: number;
  fajr: string;
  sunrise: string;
  duha: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
  lastThird: string;
  prayersList: SinglePrayerTime[];
  isFromApi?: boolean;
}

export interface NextPrayerStatus {
  currentPrayer: SinglePrayerTime;
  nextPrayer: SinglePrayerTime;
  countdownStr: string; // "HH:MM:SS"
  hours: number;
  minutes: number;
  seconds: number;
  percentElapsed: number; // 0 to 100% progress
  activePrayerId: string;
}

const STORAGE_KEY_LOCATION = 'ayat_user_prayer_location';
const STORAGE_KEY_API_CACHE = 'ayat_prayer_api_cache_v2';

// Default Location: Ali Mendjeli / Constantine or Algiers
export const DEFAULT_USER_LOCATION: UserPrayerLocation = {
  countryCode: 'DZ',
  countryName: 'الجزائر',
  stateId: 'dz-25',
  stateName: '25. قسنطينة (Constantine)',
  municipalityId: 'm-25-03',
  municipalityName: 'علي منجلي (المدينة الجديدة)',
  latitude: 36.2428,
  longitude: 6.5719,
  isAutoGps: false,
  calculationMethod: 19, // Algerian Ministry of Religious Affairs and Endowments
  juristicMethod: 'standard',
  adjustments: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  }
};

// Load saved user location or default
export function loadUserPrayerLocation(): UserPrayerLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCATION);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_USER_LOCATION,
        ...parsed,
        adjustments: {
          ...DEFAULT_USER_LOCATION.adjustments,
          ...(parsed.adjustments || {})
        }
      };
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_USER_LOCATION;
}

// Save user location
export function saveUserPrayerLocation(loc: UserPrayerLocation): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(loc));
  } catch (e) {
    // ignore
  }
}

// Country Timezone mapping
export function getCountryTimezone(countryCode: string, lng?: number): number {
  const tzMap: Record<string, number> = {
    DZ: 1, // Algeria: UTC+1 year-round (CET)
    TN: 1, // Tunisia: UTC+1
    MA: 1, // Morocco: UTC+1
    EG: 2, // Egypt: UTC+2 / +3
    SA: 3, // Saudi Arabia: UTC+3 (Makkah, Riyadh)
    AE: 4, // UAE: UTC+4
    QA: 3, // Qatar: UTC+3
    KW: 3, // Kuwait: UTC+3
    OM: 4, // Oman: UTC+4
    BH: 3, // Bahrain: UTC+3
    JO: 3, // Jordan: UTC+3
    PS: 3, // Palestine: UTC+3
    LB: 3, // Lebanon: UTC+3
    SY: 3, // Syria: UTC+3
    IQ: 3, // Iraq: UTC+3
    YE: 3, // Yemen: UTC+3
    SD: 2, // Sudan: UTC+2
    LY: 2, // Libya: UTC+2
    MR: 0, // Mauritania: UTC+0
    SO: 3, // Somalia: UTC+3
    TR: 3, // Turkey: UTC+3
    FR: 1, // France: UTC+1
    GB: 0, // UK: UTC+0
    DE: 1, // Germany: UTC+1
    ES: 1, // Spain: UTC+1
    IT: 1, // Italy: UTC+1
    ID: 7, // Indonesia: UTC+7
    MY: 8, // Malaysia: UTC+8
    PK: 5, // Pakistan: UTC+5
    IN: 5.5 // India: UTC+5.5
  };

  const code = (countryCode || '').toUpperCase();
  if (code && tzMap[code] !== undefined) {
    return tzMap[code];
  }
  if (lng !== undefined) {
    return Math.round(lng / 15);
  }
  return 1;
}

/* =========================================================================
   Astronomical Solar Calculation Algorithm (Jean Meeus / High Precision)
   ========================================================================= */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

function sinD(d: number) { return Math.sin(d * D2R); }
function cosD(d: number) { return Math.cos(d * D2R); }
function tanD(d: number) { return Math.tan(d * D2R); }
function asinD(x: number) { return Math.asin(Math.max(-1, Math.min(1, x))) * R2D; }
function acosD(x: number) { return Math.acos(Math.max(-1, Math.min(1, x))) * R2D; }
function atanD(x: number) { return Math.atan(x) * R2D; }
function atan2D(y: number, x: number) { return Math.atan2(y, x) * R2D; }

function fixAngle(a: number) {
  let b = a - 360 * Math.floor(a / 360);
  return b < 0 ? b + 360 : b;
}

function fixHour(h: number) {
  let b = h - 24 * Math.floor(h / 24);
  return b < 0 ? b + 24 : b;
}

// Calculate Sun position accurately
function sunPosition(julianDate: number) {
  const D = julianDate - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sinD(g) + 0.020 * sinD(2 * g));
  const e = 23.439 - 0.00000036 * D;

  // Quad-safe Right Ascension (RA) using atan2
  const RA = fixHour(fixAngle(atan2D(sinD(L) * cosD(e), cosD(L))) / 15);
  const d = asinD(sinD(e) * sinD(L));
  
  let EqT = q / 15 - RA;
  while (EqT > 12) EqT -= 24;
  while (EqT < -12) EqT += 24;

  return { declination: d, equationOfTime: EqT };
}

// Julian date calculation
function julian(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Sun hour angle for specific angle below horizon (e.g. 18° for Fajr, 0.833° for Sunrise/Sunset, 17° for Isha)
function sunAngleTime(angleBelowHorizon: number, lat: number, dec: number, isMorning: boolean) {
  const alt = -angleBelowHorizon;
  const cosH = (sinD(alt) - sinD(lat) * sinD(dec)) / (cosD(lat) * cosD(dec));
  if (cosH > 1) return isMorning ? 0 : 24;
  if (cosH < -1) return isMorning ? 0 : 24;
  const H = acosD(cosH) / 15;
  return isMorning ? -H : H;
}

// Asr hour angle (Shafi: shadow factor 1, Hanafi: shadow factor 2)
function asrHourAngle(shadowFactor: number, lat: number, dec: number) {
  const alt = atanD(1 / (shadowFactor + tanD(Math.abs(lat - dec))));
  const cosH = (sinD(alt) - sinD(lat) * sinD(dec)) / (cosD(lat) * cosD(dec));
  if (cosH > 1 || cosH < -1) return 3.5;
  return acosD(cosH) / 15;
}

// Format fractional hours to "HH:MM"
export function formatHourMinutes(hours: number): string {
  const fixed = fixHour(hours);
  const h = Math.floor(fixed);
  const m = Math.round((fixed - h) * 60);
  const adjustedH = m === 60 ? (h + 1) % 24 : h;
  const adjustedM = m === 60 ? 0 : m;
  return `${String(adjustedH).padStart(2, '0')}:${String(adjustedM).padStart(2, '0')}`;
}

export function to12HourFormat(time24: string): { formatted: string; period: 'ص' | 'م' } {
  if (!time24) return { formatted: '--:--', period: 'ص' };
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const period: 'ص' | 'م' = h >= 12 ? 'م' : 'ص';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { formatted: `${h}:${m}`, period };
}

// Approximate Hijri date converter
export function getHijriDate(date: Date, dayOffset = 0): {
  day: number;
  month: string;
  year: number;
  formatted: string;
} {
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  
  const gYear = date.getFullYear();
  const gMonth = date.getMonth();
  const gDay = date.getDate() + dayOffset;
  
  const m = gMonth + 1;
  const y = gYear;
  let jd = julian(y, m, gDay);
  
  const l = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const l2 = Math.floor(l - 10631 * n + 354);
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay = l3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  const validMonthIdx = Math.max(0, Math.min(11, hMonth - 1));
  const monthName = hijriMonths[validMonthIdx] || 'صفر';
  const validDay = Math.max(1, Math.min(30, hDay));

  return {
    day: validDay,
    month: monthName,
    year: hYear,
    formatted: `${validDay} ${monthName} ${hYear} هـ`
  };
}

/* =========================================================================
   Live Aladhan API Service & Cache Handler
   ========================================================================= */

interface CachedTimingsMap {
  [cacheKey: string]: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
      Imsak: string;
      Midnight: string;
      Firstthird: string;
      Lastthird: string;
    };
    date: string;
    hijri: any;
    timestamp: number;
  };
}

function getApiCache(): CachedTimingsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_API_CACHE);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function setApiCache(key: string, data: any) {
  try {
    const cache = getApiCache();
    cache[key] = { ...data, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY_API_CACHE, JSON.stringify(cache));
  } catch (e) {
    // ignore
  }
}

// Clean string time (e.g. "04:08 (EET)" -> "04:08")
function cleanTimeStr(raw: string): string {
  if (!raw) return '00:00';
  const match = raw.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return `${match[1].padStart(2, '0')}:${match[2]}`;
  }
  return raw.trim().slice(0, 5);
}

// Fetch verified official prayer times from Aladhan API with automatic fallback
export async function syncLivePrayerTimesFromApi(
  location: UserPrayerLocation,
  date: Date = new Date()
): Promise<DayPrayerTimings | null> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  const lat = location.latitude;
  const lng = location.longitude;
  const method = location.calculationMethod || 19;
  const school = location.juristicMethod === 'hanafi' ? 1 : 0;
  
  const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${dateStr}_m${method}_s${school}`;

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`
    );

    if (response.ok) {
      const json = await response.json();
      if (json && json.data && json.data.timings) {
        const timings = json.data.timings;
        setApiCache(cacheKey, { timings, date: dateStr, hijri: json.data.date?.hijri });
        
        // Notify app that updated official timings are ready
        window.dispatchEvent(new CustomEvent('prayer_api_synced', { detail: { dateStr } }));
        return formatDayPrayerTimingsFromApi(location, date, timings, json.data.date?.hijri);
      }
    }
  } catch (e) {
    // network error or offline - will use offline mathematical engine
  }

  return null;
}

function formatDayPrayerTimingsFromApi(
  location: UserPrayerLocation,
  date: Date,
  apiTimings: any,
  hijriData?: any
): DayPrayerTimings {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const adj = location.adjustments || { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };

  const applyAdj = (timeStr: string, minDelta: number) => {
    if (!minDelta) return timeStr;
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m + minDelta;
    const newH = Math.floor(((total % 1440) + 1440) % 1440 / 60);
    const newM = Math.floor(((total % 1440) + 1440) % 1440 % 60);
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  const fajrFinal = applyAdj(cleanTimeStr(apiTimings.Fajr), adj.fajr);
  const sunriseFinal = applyAdj(cleanTimeStr(apiTimings.Sunrise), adj.sunrise);
  const dhuhrFinal = applyAdj(cleanTimeStr(apiTimings.Dhuhr), adj.dhuhr);
  const asrFinal = applyAdj(cleanTimeStr(apiTimings.Asr), adj.asr);
  const maghribFinal = applyAdj(cleanTimeStr(apiTimings.Maghrib), adj.maghrib);
  const ishaFinal = applyAdj(cleanTimeStr(apiTimings.Isha), adj.isha);

  const imsakFinal = cleanTimeStr(apiTimings.Imsak || '');
  const midnightFinal = cleanTimeStr(apiTimings.Midnight || '');
  const lastThirdFinal = cleanTimeStr(apiTimings.Lastthird || '');

  // Duha ~20 mins after sunrise
  const [sH, sM] = sunriseFinal.split(':').map(Number);
  const duhaMins = sH * 60 + sM + 20;
  const duhaFinal = `${String(Math.floor(duhaMins / 60) % 24).padStart(2, '0')}:${String(duhaMins % 60).padStart(2, '0')}`;

  const hijri = hijriData ? {
    day: parseInt(hijriData.day, 10) || 1,
    month: hijriData.month?.ar || hijriData.month?.en || 'صفر',
    year: parseInt(hijriData.year, 10) || 1448,
    formatted: `${hijriData.day} ${hijriData.month?.ar || hijriData.month?.en} ${hijriData.year} هـ`
  } : getHijriDate(date);

  const gregorianFormatted = date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const prayersList: SinglePrayerTime[] = [
    {
      id: 'fajr',
      name: 'الفجر',
      time: fajrFinal,
      time12: to12HourFormat(fajrFinal).formatted,
      period: to12HourFormat(fajrFinal).period,
      iconName: 'Sunrise'
    },
    {
      id: 'sunrise',
      name: 'الشروق',
      time: sunriseFinal,
      time12: to12HourFormat(sunriseFinal).formatted,
      period: to12HourFormat(sunriseFinal).period,
      iconName: 'Sun'
    },
    {
      id: 'dhuhr',
      name: 'الظهر',
      time: dhuhrFinal,
      time12: to12HourFormat(dhuhrFinal).formatted,
      period: to12HourFormat(dhuhrFinal).period,
      iconName: 'Sun'
    },
    {
      id: 'asr',
      name: 'العصر',
      time: asrFinal,
      time12: to12HourFormat(asrFinal).formatted,
      period: to12HourFormat(asrFinal).period,
      iconName: 'CloudSun'
    },
    {
      id: 'maghrib',
      name: 'المغرب',
      time: maghribFinal,
      time12: to12HourFormat(maghribFinal).formatted,
      period: to12HourFormat(maghribFinal).period,
      iconName: 'Sunset'
    },
    {
      id: 'isha',
      name: 'العشاء',
      time: ishaFinal,
      time12: to12HourFormat(ishaFinal).formatted,
      period: to12HourFormat(ishaFinal).period,
      iconName: 'Moon'
    }
  ];

  return {
    date,
    dateStr,
    gregorianFormatted,
    hijriFormatted: hijri.formatted,
    hijriDay: hijri.day,
    hijriMonth: hijri.month,
    hijriYear: hijri.year,
    fajr: fajrFinal,
    sunrise: sunriseFinal,
    duha: duhaFinal,
    dhuhr: dhuhrFinal,
    asr: asrFinal,
    maghrib: maghribFinal,
    isha: ishaFinal,
    imsak: imsakFinal || '04:00',
    midnight: midnightFinal || '23:30',
    lastThird: lastThirdFinal || '02:30',
    prayersList,
    isFromApi: true
  };
}

// Compute accurate prayer times mathematically (Offline High-Precision Engine)
export function computeAstronomicalPrayerTimes(
  location: UserPrayerLocation,
  date: Date = new Date()
): DayPrayerTimings {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Check if we have cached official API timings first
  const lat = location.latitude;
  const lng = location.longitude;
  const method = location.calculationMethod || 19;
  const school = location.juristicMethod === 'hanafi' ? 1 : 0;
  const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${dateStr}_m${method}_s${school}`;

  const cache = getApiCache();
  if (cache[cacheKey] && cache[cacheKey].timings) {
    return formatDayPrayerTimingsFromApi(location, date, cache[cacheKey].timings, cache[cacheKey].hijri);
  }

  // Exact Timezone of selected Country
  const timezone = getCountryTimezone(location.countryCode, lng);

  // Julian Day for standard noon
  const jd = julian(year, month, day) - lng / (15 * 24);

  const { declination, equationOfTime } = sunPosition(jd);
  
  // Exact Solar Noon in local time
  const noon = fixHour(12 + timezone - lng / 15 - equationOfTime);

  // Method angles
  const methodMeta = CALCULATION_METHODS.find(m => m.id === location.calculationMethod) || CALCULATION_METHODS[0];
  const fajrAngle = methodMeta.fajrAngle || 18;
  const ishaAngle = methodMeta.ishaAngle || 17;
  const ishaInterval = methodMeta.ishaInterval;

  // Sunrise and Sunset (Sun at 0.8333 degrees below horizon)
  const sunriseOffset = sunAngleTime(0.8333, lat, declination, true);
  const sunsetOffset = sunAngleTime(0.8333, lat, declination, false);

  const sunriseHour = noon + sunriseOffset;
  const sunsetHour = noon + sunsetOffset;

  // Fajr
  const fajrOffset = sunAngleTime(fajrAngle, lat, declination, true);
  const fajrHour = noon + fajrOffset;

  // Dhuhr: Solar noon + 2 minutes safety margin (standard Zawal)
  const dhuhrHour = noon + 2 / 60;

  // Asr
  const shadowFactor = location.juristicMethod === 'hanafi' ? 2 : 1;
  const asrOffset = asrHourAngle(shadowFactor, lat, declination);
  const asrHour = noon + asrOffset;

  // Maghrib
  const maghribHour = sunsetHour;

  // Isha
  let ishaHour = 0;
  if (ishaInterval) {
    ishaHour = maghribHour + ishaInterval / 60;
  } else {
    const ishaOffset = sunAngleTime(ishaAngle, lat, declination, false);
    ishaHour = noon + ishaOffset;
  }

  // Adjustments in minutes
  const adj = location.adjustments || { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  const fajrFinal = formatHourMinutes(fajrHour + (adj.fajr || 0) / 60);
  const sunriseFinal = formatHourMinutes(sunriseHour + (adj.sunrise || 0) / 60);
  const dhuhrFinal = formatHourMinutes(dhuhrHour + (adj.dhuhr || 0) / 60);
  const asrFinal = formatHourMinutes(asrHour + (adj.asr || 0) / 60);
  const maghribFinal = formatHourMinutes(maghribHour + (adj.maghrib || 0) / 60);
  const ishaFinal = formatHourMinutes(ishaHour + (adj.isha || 0) / 60);

  // Duha (approx 20 mins after sunrise)
  const duhaHour = sunriseHour + 20 / 60;
  const duhaFinal = formatHourMinutes(duhaHour);

  // Imsak (10 mins before fajr)
  const imsakHour = fajrHour - 10 / 60;
  const imsakFinal = formatHourMinutes(imsakHour);

  // Midnight and Last Third of Night (between Maghrib and Next Fajr)
  const nightDuration = fixHour(24 - maghribHour + fajrHour);
  const midnightDec = fixHour(maghribHour + nightDuration / 2);
  const midnightFinal = formatHourMinutes(midnightDec);

  const lastThirdDec = fixHour(maghribHour + (2 / 3) * nightDuration);
  const lastThirdFinal = formatHourMinutes(lastThirdDec);

  // Hijri
  const hijri = getHijriDate(date);

  const gregorianFormatted = date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const prayersList: SinglePrayerTime[] = [
    {
      id: 'fajr',
      name: 'الفجر',
      time: fajrFinal,
      time12: to12HourFormat(fajrFinal).formatted,
      period: to12HourFormat(fajrFinal).period,
      iconName: 'Sunrise'
    },
    {
      id: 'sunrise',
      name: 'الشروق',
      time: sunriseFinal,
      time12: to12HourFormat(sunriseFinal).formatted,
      period: to12HourFormat(sunriseFinal).period,
      iconName: 'Sun'
    },
    {
      id: 'dhuhr',
      name: 'الظهر',
      time: dhuhrFinal,
      time12: to12HourFormat(dhuhrFinal).formatted,
      period: to12HourFormat(dhuhrFinal).period,
      iconName: 'Sun'
    },
    {
      id: 'asr',
      name: 'العصر',
      time: asrFinal,
      time12: to12HourFormat(asrFinal).formatted,
      period: to12HourFormat(asrFinal).period,
      iconName: 'CloudSun'
    },
    {
      id: 'maghrib',
      name: 'المغرب',
      time: maghribFinal,
      time12: to12HourFormat(maghribFinal).formatted,
      period: to12HourFormat(maghribFinal).period,
      iconName: 'Sunset'
    },
    {
      id: 'isha',
      name: 'العشاء',
      time: ishaFinal,
      time12: to12HourFormat(ishaFinal).formatted,
      period: to12HourFormat(ishaFinal).period,
      iconName: 'Moon'
    }
  ];

  return {
    date,
    dateStr,
    gregorianFormatted,
    hijriFormatted: hijri.formatted,
    hijriDay: hijri.day,
    hijriMonth: hijri.month,
    hijriYear: hijri.year,
    fajr: fajrFinal,
    sunrise: sunriseFinal,
    duha: duhaFinal,
    dhuhr: dhuhrFinal,
    asr: asrFinal,
    maghrib: maghribFinal,
    isha: ishaFinal,
    imsak: imsakFinal,
    midnight: midnightFinal,
    lastThird: lastThirdFinal,
    prayersList,
    isFromApi: false
  };
}

// Calculate remaining time countdown to next prayer
export function calculateNextPrayerCountdown(
  timings: DayPrayerTimings,
  now: Date = new Date()
): NextPrayerStatus {
  // Convert current time to local timezone minutes
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentTotalSeconds = currentMinutes * 60 + currentSeconds;

  const parseToSeconds = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60 + m) * 60;
  };

  const sequence = [
    { id: 'fajr', name: 'الفجر', sec: parseToSeconds(timings.fajr), item: timings.prayersList[0] },
    { id: 'sunrise', name: 'الشروق', sec: parseToSeconds(timings.sunrise), item: timings.prayersList[1] },
    { id: 'dhuhr', name: 'الظهر', sec: parseToSeconds(timings.dhuhr), item: timings.prayersList[2] },
    { id: 'asr', name: 'العصر', sec: parseToSeconds(timings.asr), item: timings.prayersList[3] },
    { id: 'maghrib', name: 'المغرب', sec: parseToSeconds(timings.maghrib), item: timings.prayersList[4] },
    { id: 'isha', name: 'العشاء', sec: parseToSeconds(timings.isha), item: timings.prayersList[5] }
  ];

  let nextIdx = -1;
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].sec > currentTotalSeconds) {
      nextIdx = i;
      break;
    }
  }

  let prevPrayer: SinglePrayerTime;
  let nextPrayer: SinglePrayerTime;
  let remainingSeconds = 0;
  let windowDuration = 0;
  let activeId = 'isha';

  if (nextIdx !== -1) {
    nextPrayer = sequence[nextIdx].item;
    prevPrayer = nextIdx === 0 ? sequence[sequence.length - 1].item : sequence[nextIdx - 1].item;
    activeId = prevPrayer.id;
    remainingSeconds = sequence[nextIdx].sec - currentTotalSeconds;
    
    const prevSec = nextIdx === 0 ? sequence[sequence.length - 1].sec - 24 * 3600 : sequence[nextIdx - 1].sec;
    windowDuration = sequence[nextIdx].sec - prevSec;
  } else {
    // Next is Fajr tomorrow
    nextPrayer = sequence[0].item;
    prevPrayer = sequence[sequence.length - 1].item;
    activeId = 'isha';
    const fajrTomorrowSec = 24 * 3600 + sequence[0].sec;
    remainingSeconds = fajrTomorrowSec - currentTotalSeconds;
    windowDuration = fajrTomorrowSec - sequence[sequence.length - 1].sec;
  }

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const countdownStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const elapsed = windowDuration > 0 ? (windowDuration - remainingSeconds) / windowDuration : 0;
  const percentElapsed = Math.min(100, Math.max(0, Math.round(elapsed * 100)));

  return {
    currentPrayer: prevPrayer,
    nextPrayer,
    countdownStr,
    hours,
    minutes,
    seconds,
    percentElapsed,
    activePrayerId: activeId
  };
}

// Generate Month Prayer Times Schedule
export function generateMonthPrayerSchedule(
  location: UserPrayerLocation,
  year: number,
  monthIndex: number // 0-11
): DayPrayerTimings[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const schedule: DayPrayerTimings[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const targetDate = new Date(year, monthIndex, d);
    const timings = computeAstronomicalPrayerTimes(location, targetDate);
    schedule.push(timings);
  }

  return schedule;
}

// GPS / Geolocation Automatic Detection with Reverse Geocoding
export async function detectUserLocationViaGPS(): Promise<UserPrayerLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('متصفحك لا يدعم نظام تحديد المواقع (GPS)'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&accept-language=ar`
          );
          
          if (resp.ok) {
            const data = await resp.json();
            const addr = data.address || {};
            const countryCode = (addr.country_code || 'dz').toUpperCase();
            const countryName = addr.country || 'الجزائر';
            const stateName = addr.state || addr.province || addr.region || 'قسنطينة';
            const munName = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || 'علي منجلي';
            const locality = addr.suburb || addr.neighbourhood || addr.road || '';

            const matchedCountry = COUNTRIES_DATA.find(c => c.code === countryCode);
            const defaultMethod = matchedCountry ? matchedCountry.defaultMethod : (countryCode === 'DZ' ? 19 : 3);

            const detectedLocation: UserPrayerLocation = {
              countryCode,
              countryName,
              stateId: `gps-${countryCode.toLowerCase()}`,
              stateName,
              municipalityId: `gps-mun`,
              municipalityName: munName,
              locality,
              latitude: lat,
              longitude: lng,
              isAutoGps: true,
              calculationMethod: defaultMethod,
              juristicMethod: 'standard',
              adjustments: {
                fajr: 0,
                sunrise: 0,
                dhuhr: 0,
                asr: 0,
                maghrib: 0,
                isha: 0
              }
            };

            saveUserPrayerLocation(detectedLocation);
            resolve(detectedLocation);
            return;
          }
        } catch (e) {
          // Fallback if reverse geocode fails
        }

        const fallbackGpsLocation: UserPrayerLocation = {
          countryCode: 'DZ',
          countryName: 'موقعك الحالي (GPS)',
          stateId: 'gps-state',
          stateName: `إحداثيات (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
          municipalityId: 'gps-mun',
          municipalityName: 'علي منجلي / قسنطينة',
          latitude: lat,
          longitude: lng,
          isAutoGps: true,
          calculationMethod: 19,
          juristicMethod: 'standard',
          adjustments: {
            fajr: 0,
            sunrise: 0,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0
          }
        };

        saveUserPrayerLocation(fallbackGpsLocation);
        resolve(fallbackGpsLocation);
      },
      (err) => {
        let msg = 'تعذر الحصول على إحداثيات الموقع الحالي';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'تم رفض الإذن بالوصول للموقع. يرجى تفعيل إذن الموقع من إعدادات المتصفح أو اختيار المدينة يدوياً.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'معلومات الموقع غير متاحة حالياً.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'انتهت مهلة طلب تحديد الموقع.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
}
