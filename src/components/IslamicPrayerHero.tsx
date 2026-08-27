import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Sun, 
  Moon, 
  Sunrise, 
  CloudSun, 
  Sunset, 
  Clock, 
  Sparkles,
  Calendar,
  Navigation,
  Loader2,
  Settings,
  Check,
  Compass
} from 'lucide-react';
import { 
  loadUserPrayerLocation, 
  saveUserPrayerLocation,
  computeAstronomicalPrayerTimes, 
  calculateNextPrayerCountdown, 
  detectUserLocationViaGPS,
  syncLivePrayerTimesFromApi,
  UserPrayerLocation,
  DayPrayerTimings,
  NextPrayerStatus
} from '../utils/prayerTimes';
import { COUNTRIES_DATA } from '../data/prayerLocationsData';

interface IslamicPrayerHeroProps {
  onOpenPrayerTimesModal: () => void;
  onOpenAthkarModal?: () => void;
  onOpenTasbeehModal?: () => void;
}

export const IslamicPrayerHero: React.FC<IslamicPrayerHeroProps> = ({
  onOpenPrayerTimesModal,
  onOpenAthkarModal
}) => {
  const [userLocation, setUserLocation] = useState<UserPrayerLocation>(loadUserPrayerLocation);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState<string | null>(null);
  const [gpsErrorMessage, setGpsErrorMessage] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Sync location on mount and listen to changes from modal
  useEffect(() => {
    const handleLocationChange = () => {
      setUserLocation(loadUserPrayerLocation());
    };
    const handleApiSynced = () => {
      // Force refresh when API data is ready
      setUserLocation(loadUserPrayerLocation());
    };
    window.addEventListener('prayer_location_updated', handleLocationChange);
    window.addEventListener('prayer_api_synced', handleApiSynced);
    return () => {
      window.removeEventListener('prayer_location_updated', handleLocationChange);
      window.removeEventListener('prayer_api_synced', handleApiSynced);
    };
  }, []);

  // Background sync with live official API for ultimate accuracy
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    syncLivePrayerTimesFromApi(userLocation, targetDate).catch(() => {});
  }, [userLocation.latitude, userLocation.longitude, userLocation.calculationMethod, dayOffset]);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute timings for the active day
  const activeDate = new Date();
  activeDate.setDate(activeDate.getDate() + dayOffset);
  const timings: DayPrayerTimings = computeAstronomicalPrayerTimes(userLocation, activeDate);

  // Compute Next Prayer and Live Countdown
  const nextStatus: NextPrayerStatus = calculateNextPrayerCountdown(timings, currentTime);

  // Handle GPS Auto-detect
  const handleAutoDetectGPS = async () => {
    setIsDetectingGps(true);
    setGpsErrorMessage(null);
    setGpsSuccessMessage(null);

    try {
      const detected = await detectUserLocationViaGPS();
      setUserLocation(detected);
      setGpsSuccessMessage(`تم تحديد موقعك بدقة: ${detected.municipalityName}، ${detected.stateName}`);
      window.dispatchEvent(new Event('prayer_location_updated'));
      setTimeout(() => setGpsSuccessMessage(null), 4000);
    } catch (err: any) {
      setGpsErrorMessage(err?.message || 'تعذر تحديد الموقع تلقائياً');
      setTimeout(() => setGpsErrorMessage(null), 5000);
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleShare = () => {
    const text = `🕌 مواقيت الصلاة في ${userLocation.municipalityName} (${userLocation.stateName} - ${userLocation.countryName})\nالصلاة القادمة: ${nextStatus.nextPrayer.name} بعد ${nextStatus.countdownStr}\n${timings.hijriFormatted} - ${timings.gregorianFormatted}`;
    if (navigator.share) {
      navigator.share({ title: 'مواقيت الصلاة', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Quick switch between popular regional presets
  const handleQuickCountrySelect = (countryCode: string) => {
    const country = COUNTRIES_DATA.find(c => c.code === countryCode);
    if (country && country.states.length > 0) {
      const firstState = country.states[0];
      const firstMun = firstState.municipalities[0] || { id: 'm-01', name: firstState.name, lat: firstState.lat, lng: firstState.lng };
      
      const newLoc: UserPrayerLocation = {
        countryCode: country.code,
        countryName: country.name,
        stateId: firstState.id,
        stateName: firstState.name,
        municipalityId: firstMun.id,
        municipalityName: firstMun.name,
        latitude: firstMun.lat,
        longitude: firstMun.lng,
        isAutoGps: false,
        calculationMethod: country.defaultMethod,
        juristicMethod: 'standard',
        adjustments: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
      };

      setUserLocation(newLoc);
      saveUserPrayerLocation(newLoc);
      window.dispatchEvent(new Event('prayer_location_updated'));
    }
  };

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#08201a] via-[#09151c] to-[#0a0e14] border border-emerald-500/25 text-white shadow-2xl transition-all">
      
      {/* 1. Islamic Mosque Silhouette & Mihrab Arch Graphic Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
        <div className="absolute inset-0 bg-geometric-grid opacity-15" />
        
        {/* Subtle Dome & Minaret SVG Silhouette */}
        <svg 
          className="absolute -bottom-2 left-0 right-0 w-full h-44 text-emerald-600/20 preserve-3d" 
          viewBox="0 0 800 200" 
          fill="currentColor"
        >
          <path d="M 0 200 L 0 160 L 50 160 L 60 40 L 70 40 L 80 160 L 150 160 Q 200 80 250 160 L 320 160 L 330 30 L 340 30 L 350 160 L 400 160 Q 450 60 500 160 L 580 160 L 590 50 L 600 50 L 610 160 L 680 160 Q 720 100 760 160 L 800 160 L 800 200 Z" />
          <circle cx="450" cy="50" r="10" fill="currentColor" opacity="0.7" />
          <circle cx="453" cy="48" r="8" fill="#08201a" />
        </svg>

        {/* Ambient Top Glows */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-7 space-y-4 sm:space-y-5">
        
        {/* Top Bar: Golden Title Badge + Location Details & GPS Trigger */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          
          {/* Brand/Title Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 animate-pulse" />
            <span className="font-cairo">مواقيت الصلاة الدقيقة والعد التنازلي</span>
          </div>

          {/* Location Details & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* GPS Auto-Detect Button */}
            <button
              onClick={handleAutoDetectGPS}
              disabled={isDetectingGps}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                userLocation.isAutoGps
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="تحديد الموقع الجغرافي تلقائياً عبر نظام GPS"
            >
              {isDetectingGps ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span className="text-[11px]">جاري التحديد...</span>
                </>
              ) : (
                <>
                  <Navigation className={`w-3.5 h-3.5 ${userLocation.isAutoGps ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-400'}`} />
                  <span className="text-[11px]">تحديد تلقائي (GPS)</span>
                </>
              )}
            </button>

            {/* Change Location Button (Opens detailed modal with Country > Wilaya > Baladiya) */}
            <button
              onClick={onOpenPrayerTimesModal}
              className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs font-bold text-amber-200 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all cursor-pointer"
              title="تغيير البلد والولاية والبلدية والمنطقة بالتفصيل"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate">
                {userLocation.municipalityName} ({userLocation.countryName})
              </span>
              <Settings className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            <button
              onClick={onOpenPrayerTimesModal}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="عرض جدول الشهر الكامل وإعدادات الحساب"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* GPS Notifications Toast */}
        {gpsSuccessMessage && (
          <div className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 animate-fade-in shadow-lg">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{gpsSuccessMessage}</span>
          </div>
        )}

        {gpsErrorMessage && (
          <div className="bg-rose-950/90 border border-rose-500/40 text-rose-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 animate-fade-in shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{gpsErrorMessage}</span>
          </div>
        )}

        {/* Central Prayer Countdown Card */}
        <div className="text-center py-2 sm:py-3 space-y-1.5">
          <div className="text-sm sm:text-base font-semibold text-emerald-300 font-cairo flex items-center justify-center gap-2">
            <span>الصلاة القادمة: <strong>{nextStatus.nextPrayer.name}</strong> بعد</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          </div>

          <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-mono text-white drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)] dir-ltr">
            {nextStatus.countdownStr}
          </div>

          {/* Location & Time breadcrumb */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1 text-amber-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{userLocation.countryName}</span>
              <span className="text-slate-500">›</span>
              <span>{userLocation.stateName}</span>
              <span className="text-slate-500">›</span>
              <strong className="text-white font-bold">{userLocation.municipalityName}</strong>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="text-emerald-300 font-mono">
              أذان {nextStatus.nextPrayer.name}: <strong>{nextStatus.nextPrayer.time}</strong> ({nextStatus.nextPrayer.time12} {nextStatus.nextPrayer.period})
            </div>
          </div>

          {/* Mini progress bar between prayers */}
          <div className="max-w-md mx-auto pt-2 px-4">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${nextStatus.percentElapsed}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
              <span>{nextStatus.currentPrayer.name} ({nextStatus.currentPrayer.time})</span>
              <span>{nextStatus.nextPrayer.name} ({nextStatus.nextPrayer.time})</span>
            </div>
          </div>
        </div>

        {/* Dual Date Bar with Day Navigator */}
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 text-xs text-slate-200">
          
          <button
            onClick={() => setDayOffset((d) => d - 1)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="اليوم السابق"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-center flex-wrap justify-center">
            <span className="font-bold text-amber-300 font-cairo">{timings.hijriFormatted}</span>
            <span className="text-slate-500 hidden sm:inline">-</span>
            <span className="text-slate-300 hidden sm:inline">{timings.gregorianFormatted}</span>
            {dayOffset !== 0 && (
              <button
                onClick={() => setDayOffset(0)}
                className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold cursor-pointer"
              >
                اليوم
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
              title="مشاركة المواقيت"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setDayOffset((d) => d + 1)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="اليوم التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Spiritual Status Notification Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="font-medium">
              {nextStatus.activePrayerId === 'fajr' && '🌅 وقت أذكار الصباح وسنة الفجر العظيمة'}
              {nextStatus.activePrayerId === 'sunrise' && '☀️ وقت صلاة الضحى والاستغفار'}
              {nextStatus.activePrayerId === 'dhuhr' && '🌞 وقت صلاة الظهر ونافلة الراتبة'}
              {nextStatus.activePrayerId === 'asr' && '⛅ حافظ على الصلاة الوسطى وأذكار المساء'}
              {nextStatus.activePrayerId === 'maghrib' && '🌇 ساعة إجابة وسنة المغرب وأذكار المساء'}
              {nextStatus.activePrayerId === 'isha' && '🌙 صلاة العشاء وقيام الليل والوتر نور للمؤمن'}
            </span>
          </div>

          {onOpenAthkarModal && (
            <button
              onClick={onOpenAthkarModal}
              className="text-[11px] font-bold text-amber-300 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>ركن الأذكار</span>
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 6-Prayer Timeline Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {timings.prayersList.map((p) => {
            const isSelected = p.id === nextStatus.activePrayerId;
            const isNext = p.id === nextStatus.nextPrayer.id;

            return (
              <div
                key={p.id}
                className={`p-2.5 rounded-2xl text-center transition-all relative overflow-hidden border ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-600/30 to-emerald-900/50 border-emerald-400 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : isNext
                    ? 'bg-amber-500/15 border-amber-500/50 text-slate-100 ring-1 ring-amber-400/30'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:bg-black/40'
                }`}
              >
                {/* Active Indicator Top Light */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-amber-300" />
                )}

                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : isNext ? 'text-amber-300' : 'text-slate-300'}`}>
                    {p.name}
                  </span>
                </div>

                <div className="text-sm sm:text-base font-bold font-mono text-white">
                  {p.time}
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  {p.time12} {p.period}
                </div>

                {isSelected && (
                  <div className="text-[10px] font-semibold text-emerald-300 mt-0.5">
                    الآن
                  </div>
                )}
                {!isSelected && isNext && (
                  <div className="text-[9px] font-semibold text-amber-400 mt-0.5">
                    القادمة
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Night Calculations Bar (Midnight & Last Third) + Imsak & Duha */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-white/5 rounded-xl px-3.5 py-2 border border-white/5 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">🥣</span>
            <span>الإمساك: <strong className="font-mono text-slate-200">{timings.imsak}</strong></span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span>الضحى: <strong className="font-mono text-slate-200">{timings.duha}</strong></span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
            <span>منتصف الليل: <strong className="font-mono text-slate-200">{timings.midnight}</strong></span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>الثلث الأخير: <strong className="font-mono text-amber-300">{timings.lastThird}</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
