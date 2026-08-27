import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Navigation, 
  Sun, 
  Moon, 
  Sunrise, 
  CloudSun, 
  Sunset, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon,
  Search,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sliders,
  Compass,
  Volume2
} from 'lucide-react';
import { 
  COUNTRIES_DATA, 
  CALCULATION_METHODS, 
  searchLocations,
  CountryLocationData,
  StateOrWilayaItem,
  MunicipalityItem
} from '../data/prayerLocationsData';
import { 
  loadUserPrayerLocation, 
  saveUserPrayerLocation, 
  computeAstronomicalPrayerTimes, 
  calculateNextPrayerCountdown, 
  generateMonthPrayerSchedule,
  detectUserLocationViaGPS,
  syncLivePrayerTimesFromApi,
  UserPrayerLocation,
  DayPrayerTimings,
  NextPrayerStatus
} from '../utils/prayerTimes';

interface PrayerTimesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = 'today' | 'location' | 'monthly' | 'settings';

export const PrayerTimesModal: React.FC<PrayerTimesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('today');
  const [userLocation, setUserLocation] = useState<UserPrayerLocation>(loadUserPrayerLocation);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [dayOffset, setDayOffset] = useState<number>(0);
  
  // Location selector state
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(userLocation.countryCode || 'DZ');
  const [selectedStateId, setSelectedStateId] = useState<string>(userLocation.stateId || 'dz-16');
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>(userLocation.municipalityId || 'm-16-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // GPS Detection state
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Month Schedule View
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);

  // Sync on modal open
  useEffect(() => {
    if (isOpen) {
      const loc = loadUserPrayerLocation();
      setUserLocation(loc);
      setSelectedCountryCode(loc.countryCode);
      setSelectedStateId(loc.stateId);
      setSelectedMunicipalityId(loc.municipalityId);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleApiSynced = () => {
      setUserLocation(loadUserPrayerLocation());
    };
    window.addEventListener('prayer_api_synced', handleApiSynced);
    return () => window.removeEventListener('prayer_api_synced', handleApiSynced);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    syncLivePrayerTimesFromApi(userLocation, targetDate).catch(() => {});
  }, [isOpen, userLocation.latitude, userLocation.longitude, userLocation.calculationMethod, dayOffset]);

  // Live timer tick every second
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Active Day calculations
  const activeDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const timings: DayPrayerTimings = useMemo(() => {
    return computeAstronomicalPrayerTimes(userLocation, activeDate);
  }, [userLocation, activeDate]);

  const nextStatus: NextPrayerStatus = useMemo(() => {
    return calculateNextPrayerCountdown(timings, currentTime);
  }, [timings, currentTime]);

  // Monthly table
  const monthSchedule = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + calendarMonthOffset);
    return generateMonthPrayerSchedule(userLocation, d.getFullYear(), d.getMonth());
  }, [userLocation, calendarMonthOffset]);

  if (!isOpen) return null;

  // Selected Country data
  const currentCountry = COUNTRIES_DATA.find(c => c.code === selectedCountryCode) || COUNTRIES_DATA[0];
  const currentState = currentCountry.states.find(s => s.id === selectedStateId) || currentCountry.states[0] || {
    id: 's-01',
    name: 'المنطقة',
    lat: currentCountry.defaultLat,
    lng: currentCountry.defaultLng,
    municipalities: []
  };
  const currentMunicipality = currentState.municipalities.find(m => m.id === selectedMunicipalityId) || currentState.municipalities[0] || {
    id: 'm-01',
    name: currentState.name,
    lat: currentState.lat,
    lng: currentState.lng
  };

  // Search Results
  const searchResults = searchQuery.trim() ? searchLocations(searchQuery) : [];

  // Handlers for Country / State / Municipality
  const handleCountryChange = (cCode: string) => {
    setSelectedCountryCode(cCode);
    const country = COUNTRIES_DATA.find(c => c.code === cCode);
    if (country && country.states.length > 0) {
      const firstState = country.states[0];
      setSelectedStateId(firstState.id);
      const firstMun = firstState.municipalities[0] || { id: 'm-01', name: firstState.name, lat: firstState.lat, lng: firstState.lng };
      setSelectedMunicipalityId(firstMun.id);
    }
  };

  const handleStateChange = (sId: string) => {
    setSelectedStateId(sId);
    const state = currentCountry.states.find(s => s.id === sId);
    if (state && state.municipalities.length > 0) {
      setSelectedMunicipalityId(state.municipalities[0].id);
    }
  };

  const handleMunicipalityChange = (mId: string) => {
    setSelectedMunicipalityId(mId);
  };

  // Apply Manual Location
  const handleApplyManualLocation = () => {
    const updatedLocation: UserPrayerLocation = {
      countryCode: currentCountry.code,
      countryName: currentCountry.name,
      stateId: currentState.id,
      stateName: currentState.name,
      municipalityId: currentMunicipality.id,
      municipalityName: currentMunicipality.name,
      latitude: currentMunicipality.lat,
      longitude: currentMunicipality.lng,
      isAutoGps: false,
      calculationMethod: userLocation.calculationMethod || currentCountry.defaultMethod,
      juristicMethod: userLocation.juristicMethod || 'standard',
      adjustments: userLocation.adjustments || { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
    };

    setUserLocation(updatedLocation);
    saveUserPrayerLocation(updatedLocation);
    window.dispatchEvent(new Event('prayer_location_updated'));
    setActiveTab('today');
  };

  // Select Search Item
  const handleSelectSearchResult = (result: {
    country: CountryLocationData;
    state: StateOrWilayaItem;
    municipality: MunicipalityItem;
  }) => {
    setSelectedCountryCode(result.country.code);
    setSelectedStateId(result.state.id);
    setSelectedMunicipalityId(result.municipality.id);
    setSearchQuery('');

    const updatedLocation: UserPrayerLocation = {
      countryCode: result.country.code,
      countryName: result.country.name,
      stateId: result.state.id,
      stateName: result.state.name,
      municipalityId: result.municipality.id,
      municipalityName: result.municipality.name,
      latitude: result.municipality.lat,
      longitude: result.municipality.lng,
      isAutoGps: false,
      calculationMethod: userLocation.calculationMethod || result.country.defaultMethod,
      juristicMethod: userLocation.juristicMethod || 'standard',
      adjustments: userLocation.adjustments || { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
    };

    setUserLocation(updatedLocation);
    saveUserPrayerLocation(updatedLocation);
    window.dispatchEvent(new Event('prayer_location_updated'));
    setActiveTab('today');
  };

  // Trigger GPS Auto-Detection
  const handleTriggerGPS = async () => {
    setIsGpsLoading(true);
    setGpsMessage(null);
    try {
      const detected = await detectUserLocationViaGPS();
      setUserLocation(detected);
      setSelectedCountryCode(detected.countryCode);
      setSelectedStateId(detected.stateId);
      setSelectedMunicipalityId(detected.municipalityId);
      setGpsMessage({
        type: 'success',
        text: `تم تحديد موقعك بنجاح: ${detected.municipalityName}، ${detected.stateName} (${detected.countryName})`
      });
      window.dispatchEvent(new Event('prayer_location_updated'));
    } catch (err: any) {
      setGpsMessage({
        type: 'error',
        text: err?.message || 'تعذر تحديد الموقع الجغرافي'
      });
    } finally {
      setIsGpsLoading(false);
    }
  };

  // Update Settings (Method / Juristic / Adjustments)
  const handleUpdateCalculation = (key: keyof UserPrayerLocation, val: any) => {
    const updated = { ...userLocation, [key]: val };
    setUserLocation(updated);
    saveUserPrayerLocation(updated);
    window.dispatchEvent(new Event('prayer_location_updated'));
  };

  const handleAdjustmentChange = (prayerKey: keyof UserPrayerLocation['adjustments'], delta: number) => {
    const currentVal = userLocation.adjustments?.[prayerKey] || 0;
    const newVal = Math.max(-30, Math.min(30, currentVal + delta));
    const updated: UserPrayerLocation = {
      ...userLocation,
      adjustments: {
        ...userLocation.adjustments,
        [prayerKey]: newVal
      }
    };
    setUserLocation(updated);
    saveUserPrayerLocation(updated);
    window.dispatchEvent(new Event('prayer_location_updated'));
  };

  const handleShareTimings = () => {
    const text = `🕌 مواقيت الصلاة في ${userLocation.municipalityName} (${userLocation.stateName} - ${userLocation.countryName})\n\n` +
      `🌅 الفجر: ${timings.fajr}\n` +
      `☀️ الشروق: ${timings.sunrise}\n` +
      `🌞 الظهر: ${timings.dhuhr}\n` +
      `⛅ العصر: ${timings.asr}\n` +
      `🌇 المغرب: ${timings.maghrib}\n` +
      `🌙 العشاء: ${timings.isha}\n\n` +
      `📅 ${timings.hijriFormatted} - ${timings.gregorianFormatted}`;

    if (navigator.share) {
      navigator.share({ title: 'مواقيت الصلاة', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b1015] border border-emerald-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-white">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#18232c] flex items-center justify-between bg-gradient-to-r from-[#0d161d] via-[#0b1217] to-[#0d161d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-cairo">مواقيت الصلاة الدقيقة</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                  {userLocation.isAutoGps ? 'موقع دقيق (GPS)' : userLocation.countryName}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-slate-300">
                  {userLocation.municipalityName} • {userLocation.stateName}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#18232c] bg-[#080d12] px-3 pt-2 gap-1.5 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`pb-2.5 px-3 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'today'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>مواقيت اليوم والعد التنازلي</span>
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`pb-2.5 px-3 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'location'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>تحديد البلد والمكان بالتفصيل</span>
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`pb-2.5 px-3 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'monthly'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>الجدول الشهري الكامل</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>طرق الحساب وضبط الدقائق</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* TAB 1: TODAY'S PRAYER TIMINGS & LIVE COUNTDOWN */}
          {activeTab === 'today' && (
            <div className="space-y-5">
              
              {/* Central Countdown Box */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c241d] via-[#091817] to-[#0b1419] border border-emerald-500/30 p-5 text-center space-y-2 shadow-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>الصلاة القادمة: {nextStatus.nextPrayer.name}</span>
                </div>

                <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight drop-shadow-md dir-ltr">
                  {nextStatus.countdownStr}
                </div>

                <p className="text-xs text-slate-300">
                  متبقي على أذان <strong className="text-amber-300">{nextStatus.nextPrayer.name}</strong> في تمام الساعة{' '}
                  <span className="font-mono font-bold text-white">{nextStatus.nextPrayer.time}</span> ({nextStatus.nextPrayer.time12} {nextStatus.nextPrayer.period})
                </p>

                {/* Progress bar */}
                <div className="max-w-md mx-auto pt-2">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-1000"
                      style={{ width: `${nextStatus.percentElapsed}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Date navigator */}
              <div className="flex items-center justify-between bg-[#111922] rounded-xl p-3 border border-white/10 text-xs text-slate-200">
                <button
                  onClick={() => setDayOffset(d => d - 1)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="اليوم السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <div className="font-bold text-amber-300 text-sm font-cairo">{timings.hijriFormatted}</div>
                  <div className="text-slate-400 text-xs">{timings.gregorianFormatted}</div>
                </div>

                <div className="flex items-center gap-1">
                  {dayOffset !== 0 && (
                    <button
                      onClick={() => setDayOffset(0)}
                      className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold cursor-pointer"
                    >
                      اليوم
                    </button>
                  )}
                  <button
                    onClick={handleShareTimings}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                    title="مشاركة"
                  >
                    {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDayOffset(d => d + 1)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="اليوم التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 6 Core Prayers Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timings.prayersList.map((prayer) => {
                  const isCurrent = prayer.id === nextStatus.activePrayerId;
                  const isNext = prayer.id === nextStatus.nextPrayer.id;
                  
                  return (
                    <div
                      key={prayer.id}
                      className={`rounded-2xl p-4 transition-all relative overflow-hidden border flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-gradient-to-b from-emerald-600/30 to-emerald-950/60 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400/30'
                          : isNext
                          ? 'bg-amber-500/15 border-amber-500/50 text-white ring-1 ring-amber-400/30'
                          : 'bg-[#111922] border-[#1e2a36] text-slate-300'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-amber-300" />
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold font-cairo ${isCurrent ? 'text-emerald-300' : isNext ? 'text-amber-300' : 'text-slate-300'}`}>
                          {prayer.name}
                        </span>
                        {isCurrent ? (
                          <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            الوقت الحالي
                          </span>
                        ) : isNext ? (
                          <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            القادمة
                          </span>
                        ) : null}
                      </div>

                      <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                        {prayer.time}
                      </div>

                      <div className="text-xs text-slate-400 font-mono mt-1">
                        {prayer.time12} {prayer.period}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extra Astronomical Islamic Times (Imsak, Duha, Midnight, Last Third) */}
              <div className="bg-[#0e161e] rounded-2xl p-4 border border-[#1b2632] space-y-3">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>أوقات إضافية ومستحبات شرعية</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-center">
                    <div className="text-slate-400">الإمساك (السحور)</div>
                    <div className="text-sm font-bold font-mono text-white pt-1">{timings.imsak}</div>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-center">
                    <div className="text-slate-400">صلاة الضحى</div>
                    <div className="text-sm font-bold font-mono text-white pt-1">{timings.duha}</div>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-center">
                    <div className="text-slate-400">منتصف الليل الشرعي</div>
                    <div className="text-sm font-bold font-mono text-white pt-1">{timings.midnight}</div>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-center">
                    <div className="text-amber-300 font-medium">ثلث الليل الأخير (التهجد)</div>
                    <div className="text-sm font-bold font-mono text-amber-300 pt-1">{timings.lastThird}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DETAILED LOCATION & GPS SELECTOR */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              
              {/* Option A: Automatic GPS Detection Card */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 rounded-2xl p-4 sm:p-5 border border-emerald-500/40 space-y-3 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-sm sm:text-base text-white">تحديد المكان تلقائياً (GPS)</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      استخدام نظام تحديد المواقع الجغرافي لتحديد البلد، الولاية، البلدية، والحي بدقة تلقائية وحساب المواقيت وفق إحداثياتك بالضبط.
                    </p>
                  </div>

                  <button
                    onClick={handleTriggerGPS}
                    disabled={isGpsLoading}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer shrink-0 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isGpsLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري التحديد...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        <span>تفعيل التحديد التلقائي</span>
                      </>
                    )}
                  </button>
                </div>

                {gpsMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    gpsMessage.type === 'success' ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950 border border-rose-500/40 text-rose-200'
                  }`}>
                    {gpsMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                    <span>{gpsMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Option B: Search Any City Worldwide */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>بحث سريع ومباشر عن أي مدينة أو بلدية حول العالم:</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم: مثلاً سطيف، العلمة، المنصورة، مكة، دبي، باريس..."
                    className="w-full bg-[#111922] border border-[#233140] rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>

                {searchResults.length > 0 && (
                  <div className="bg-[#111922] border border-[#233140] rounded-xl max-h-48 overflow-y-auto divide-y divide-white/5 custom-scrollbar shadow-xl">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSearchResult(res)}
                        className="w-full text-right p-2.5 hover:bg-emerald-600/20 text-xs flex items-center justify-between text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{res.country.flag}</span>
                          <div>
                            <span className="font-bold text-white">{res.municipality.name}</span>
                            <span className="text-slate-400 text-[11px] mr-1.5">({res.state.name})</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-medium">اختيار</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Option C: Hierarchical Country > State/Wilaya > Municipality/City */}
              <div className="bg-[#0e161e] rounded-2xl p-4 sm:p-5 border border-[#1e2a36] space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>اختيار يدوي مفصل (البلد › الولاية/المحافظة › البلدية/المدينة):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* 1. Country Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-300 font-semibold">1. الدولة / البلد:</label>
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-[#141e28] text-white border border-[#263747] rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {COUNTRIES_DATA.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0f172a] text-white">
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. State / Wilaya Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-300 font-semibold">2. الولاية / المحافظة:</label>
                    <select
                      value={selectedStateId}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-[#141e28] text-white border border-[#263747] rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {currentCountry.states.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0f172a] text-white">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Municipality / Baladiya Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-300 font-semibold">3. البلدية / المدينة / المركز:</label>
                    <select
                      value={selectedMunicipalityId}
                      onChange={(e) => handleMunicipalityChange(e.target.value)}
                      className="w-full bg-[#141e28] text-white border border-[#263747] rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {currentState.municipalities.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#0f172a] text-white">
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Selected Location Summary & Apply Button */}
                <div className="pt-3 border-t border-[#1e2a36] flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400">الموقع المحدد حالياً: </span>
                    <strong className="text-white font-bold">{currentMunicipality.name}</strong>
                    <span className="text-slate-400"> - {currentState.name} ({currentCountry.name})</span>
                  </div>

                  <button
                    onClick={handleApplyManualLocation}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>تطبيق واعتماد هذا الموقع</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: FULL MONTHLY CALENDAR TABLE */}
          {activeTab === 'monthly' && (
            <div className="space-y-4">
              
              {/* Month Header Switcher */}
              <div className="flex items-center justify-between bg-[#111922] rounded-xl p-3 border border-white/10 text-xs text-slate-200">
                <button
                  onClick={() => setCalendarMonthOffset(m => m - 1)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="الشهر السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="text-center font-bold text-sm text-emerald-300 font-cairo">
                  {monthSchedule[0]?.date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
                </div>

                <div className="flex items-center gap-1">
                  {calendarMonthOffset !== 0 && (
                    <button
                      onClick={() => setCalendarMonthOffset(0)}
                      className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold cursor-pointer"
                    >
                      الشهر الحالي
                    </button>
                  )}
                  <button
                    onClick={() => setCalendarMonthOffset(m => m + 1)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="الشهر التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Monthly Schedule Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#1e2a36] bg-[#0c131a]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#141f2a] text-slate-300 font-bold border-b border-[#1e2a36]">
                    <tr>
                      <th className="p-2.5 sm:p-3">اليوم والتاريخ</th>
                      <th className="p-2.5 sm:p-3 text-center">الهجري</th>
                      <th className="p-2.5 sm:p-3 text-center text-amber-300">الفجر</th>
                      <th className="p-2.5 sm:p-3 text-center">الشروق</th>
                      <th className="p-2.5 sm:p-3 text-center text-emerald-300">الظهر</th>
                      <th className="p-2.5 sm:p-3 text-center text-teal-300">العصر</th>
                      <th className="p-2.5 sm:p-3 text-center text-orange-300">المغرب</th>
                      <th className="p-2.5 sm:p-3 text-center text-indigo-300">العشاء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18232e] text-slate-300 font-mono">
                    {monthSchedule.map((dayItem, idx) => {
                      const isToday = dayItem.dateStr === timings.dateStr;

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-white/5 transition-colors ${
                            isToday ? 'bg-emerald-950/40 text-white font-bold ring-1 ring-emerald-500/40' : ''
                          }`}
                        >
                          <td className="p-2.5 sm:p-3 font-sans whitespace-nowrap">
                            <span className="font-medium">{dayItem.date.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'numeric' })}</span>
                            {isToday && (
                              <span className="mr-1.5 text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                اليوم
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 sm:p-3 text-center font-cairo whitespace-nowrap text-[11px] text-slate-400">
                            {dayItem.hijriDay} {dayItem.hijriMonth}
                          </td>
                          <td className="p-2.5 sm:p-3 text-center font-bold text-amber-200">{dayItem.fajr}</td>
                          <td className="p-2.5 sm:p-3 text-center text-slate-400">{dayItem.sunrise}</td>
                          <td className="p-2.5 sm:p-3 text-center font-bold text-emerald-300">{dayItem.dhuhr}</td>
                          <td className="p-2.5 sm:p-3 text-center font-bold text-teal-300">{dayItem.asr}</td>
                          <td className="p-2.5 sm:p-3 text-center font-bold text-orange-300">{dayItem.maghrib}</td>
                          <td className="p-2.5 sm:p-3 text-center font-bold text-indigo-300">{dayItem.isha}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: CALCULATION METHODS & MANUAL MINUTES ADJUSTMENTS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Calculation Method selector */}
              <div className="bg-[#0e161e] rounded-2xl p-4 sm:p-5 border border-[#1e2a36] space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-amber-300">
                  طريقة الحساب المعتمدة (الهيئة / الوزارة):
                </label>

                <select
                  value={userLocation.calculationMethod}
                  onChange={(e) => handleUpdateCalculation('calculationMethod', Number(e.target.value))}
                  className="w-full bg-[#141e28] text-white border border-[#263747] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {CALCULATION_METHODS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#0f172a] text-white">
                      {m.name} — {m.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Juristic Asr Calculation Method (Shafi vs Hanafi) */}
              <div className="bg-[#0e161e] rounded-2xl p-4 sm:p-5 border border-[#1e2a36] space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-amber-300">
                  المذهب الفقهي لحساب وقت صلاة العصر:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleUpdateCalculation('juristicMethod', 'standard')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      userLocation.juristicMethod !== 'hanafi'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-emerald-300 text-sm">الجمهور (الشافعي، المالكي، الحنبلي)</div>
                    <div className="text-[11px] text-slate-300 pt-1">عندما يصبح ظل كل شيء مثله (المعمول به في غالب العالم الإسلامي)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateCalculation('juristicMethod', 'hanafi')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      userLocation.juristicMethod === 'hanafi'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-emerald-300 text-sm">المذهب الحنفي</div>
                    <div className="text-[11px] text-slate-300 pt-1">عندما يصبح ظل كل شيء مثليه (تركيا، باكستان، الهند، بنغلاديش)</div>
                  </button>
                </div>
              </div>

              {/* Manual Minute Adjustments (Tuning with Local Mosques) */}
              <div className="bg-[#0e161e] rounded-2xl p-4 sm:p-5 border border-[#1e2a36] space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                    الضبط اليدوي للمواقيت بالدقائق (+/- دقيقة للتطابق مع مسجد حيك):
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    يمكنك زيادة أو إنقاص دقائق معدودة لكل صلاة لتتطابق أوقات الأذان بنسبة 100% مع مسجد منطقتك.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  {[
                    { key: 'fajr', label: 'الفجر' },
                    { key: 'sunrise', label: 'الشروق' },
                    { key: 'dhuhr', label: 'الظهر' },
                    { key: 'asr', label: 'العصر' },
                    { key: 'maghrib', label: 'المغرب' },
                    { key: 'isha', label: 'العشاء' }
                  ].map((p) => {
                    const currentAdj = (userLocation.adjustments as any)?.[p.key] || 0;

                    return (
                      <div key={p.key} className="bg-black/30 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
                        <span className="font-bold text-slate-200">{p.label}</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <button
                            onClick={() => handleAdjustmentChange(p.key as any, -1)}
                            className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className={`w-8 text-center font-bold ${currentAdj > 0 ? 'text-emerald-400' : currentAdj < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                            {currentAdj > 0 ? `+${currentAdj}` : currentAdj}
                          </span>
                          <button
                            onClick={() => handleAdjustmentChange(p.key as any, 1)}
                            className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#18232c] bg-[#080d12] flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-400 font-quran">
            «إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا» [النساء: 103]
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
