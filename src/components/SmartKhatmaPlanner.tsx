import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  Clock, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  RotateCcw, 
  Play, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Flame, 
  Award, 
  Check, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Compass, 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  Layers,
  ArrowRight,
  Filter,
  Info,
  CalendarCheck
} from 'lucide-react';
import { KhatmaPlan, KhatmaScheduleDay, KhatmaReminderSettings } from '../types';
import { 
  TOTAL_QURAN_PAGES,
  formatDateToString, 
  formatArabicDate, 
  getSurahForPage, 
  getJuzForPage,
  calculateKhatmaStats, 
  getTodaysWard, 
  toggleKhatmaDayCompletion, 
  rebalanceKhatmaSchedule, 
  createDefaultSmartKhatma,
  generateSmartKhatmaSchedule,
  sendKhatmaBrowserNotification
} from '../utils/khatmaPlanner';
import { playGentleNotificationTone } from '../utils/athkarReminders';
import { SURAHS_LIST } from '../data/quranData';

interface SmartKhatmaPlannerProps {
  khatma: KhatmaPlan;
  onUpdateKhatma: (khatma: KhatmaPlan) => void;
  onReadSurah?: (surahNumber: number, initialAyah?: number) => void;
  onOpenKhatmDua?: () => void;
}

export const SmartKhatmaPlanner: React.FC<SmartKhatmaPlannerProps> = ({
  khatma,
  onUpdateKhatma,
  onReadSurah,
  onOpenKhatmDua
}) => {
  // UI & Drawer States
  const [filterMode, setFilterMode] = useState<'all' | 'remaining' | 'completed'>('all');
  const [isCustomizingPlan, setIsCustomizingPlan] = useState(false);
  const [isRebalanceModalOpen, setIsRebalanceModalOpen] = useState(false);
  const [isRemindersDrawerOpen, setIsRemindersDrawerOpen] = useState(false);
  const [expandedDayNumber, setExpandedDayNumber] = useState<number | null>(null);
  const [notificationStatusMsg, setNotificationStatusMsg] = useState<string | null>(null);

  // New Plan / Customization Form State
  const [customName, setCustomName] = useState(khatma.name || 'ختمة القرآن الكريم');
  const [customDays, setCustomDays] = useState(khatma.targetDays || 30);
  const [customStartPage, setCustomStartPage] = useState(khatma.startFromPage || 1);
  const [customPace, setCustomPace] = useState<'per_prayer' | 'morning_evening' | 'single_session'>(
    khatma.paceStrategy || 'per_prayer'
  );
  const [customReminderTime, setCustomReminderTime] = useState(khatma.reminderSettings?.time || '08:00');
  const [customReminderEnabled, setCustomReminderEnabled] = useState(khatma.reminderSettings?.enabled ?? true);

  // Calculate metrics
  const stats = calculateKhatmaStats(khatma);
  const todaysWard = getTodaysWard(khatma);

  // Quick preset targets in days
  const PRESET_DAYS = [
    { days: 3, label: '3 أيام', desc: 'ختمة سريعة (201 ص/يوم)' },
    { days: 7, label: 'أسبوع (7 أيام)', desc: 'ختمة أسبوعية (86 ص/يوم)' },
    { days: 10, label: '10 أيام', desc: 'العشر الأواخر (60 ص/يوم)' },
    { days: 15, label: '15 يوماً', desc: 'نصف شهر (40 ص/يوم)' },
    { days: 30, label: 'شهر (30 يوماً)', desc: 'ختمة الشهر (20 ص/يوم)' },
    { days: 60, label: 'شهران (60 يوماً)', desc: 'ختمة ميسرة (10 ص/يوم)' },
    { days: 90, label: '3 أشهر (90 يوماً)', desc: 'ختمة تدبر (7 ص/يوم)' }
  ];

  // Helper to open reader at a specific page
  const handleOpenPageInReader = (page: number) => {
    if (!onReadSurah) return;
    // Find Surah that contains this page
    let foundSurah = SURAHS_LIST[0];
    for (const s of SURAHS_LIST) {
      if (s.pageStart <= page) {
        foundSurah = s;
      } else {
        break;
      }
    }
    onReadSurah(foundSurah.number);
  };

  // Toggle day completion
  const handleToggleDay = (dayNum: number, currentStatus: boolean) => {
    const updated = toggleKhatmaDayCompletion(khatma, dayNum, !currentStatus);
    onUpdateKhatma(updated);

    if (!currentStatus) {
      // If marking as completed, play gentle sound
      playGentleNotificationTone();
    }
  };

  // Save new or customized plan
  const handleSaveCustomPlan = () => {
    const todayStr = formatDateToString(new Date());
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + customDays);

    const newSchedule = generateSmartKhatmaSchedule(
      customDays,
      todayStr,
      customStartPage,
      customPace
    );

    const updatedPlan: KhatmaPlan = {
      ...khatma,
      id: `khatma-${Date.now()}`,
      name: customName.trim() || 'ختمة القرآن الكريم',
      targetDays: customDays,
      startDate: todayStr,
      endDate: formatDateToString(endDate),
      startFromPage: customStartPage,
      currentPage: customStartPage,
      currentJuz: getJuzForPage(customStartPage),
      completedPages: customStartPage > 1 ? Array.from({ length: customStartPage - 1 }, (_, i) => i + 1) : [],
      paceStrategy: customPace,
      schedule: newSchedule,
      reminderSettings: {
        ...khatma.reminderSettings,
        enabled: customReminderEnabled,
        time: customReminderTime,
        reminderSlot: 'morning',
        soundEnabled: true,
        browserNotifications: khatma.reminderSettings?.browserNotifications ?? false
      },
      streak: 0,
      isFinished: false
    };

    onUpdateKhatma(updatedPlan);
    setIsCustomizingPlan(false);
  };

  // Perform smart rebalancing
  const handleExecuteRebalance = (newDays?: number) => {
    const rebalanced = rebalanceKhatmaSchedule(khatma, newDays);
    onUpdateKhatma(rebalanced);
    setIsRebalanceModalOpen(false);
    playGentleNotificationTone();
  };

  // Toggle reminders
  const handleToggleReminderSetting = (key: keyof KhatmaReminderSettings, val: any) => {
    const current = khatma.reminderSettings || {
      enabled: true,
      time: '08:00',
      reminderSlot: 'morning',
      soundEnabled: true,
      browserNotifications: false
    };
    const updated = {
      ...khatma,
      reminderSettings: {
        ...current,
        [key]: val
      }
    };
    onUpdateKhatma(updated);
  };

  // Test Notification Trigger
  const handleTestNotification = async () => {
    playGentleNotificationTone();
    const ok = await sendKhatmaBrowserNotification(
      '📖 تذكير ورد القرآن الكريم',
      todaysWard
        ? `وردك اليوم: الصفحات ${todaysWard.fromPage} إلى ${todaysWard.toPage} (${todaysWard.surahStartName})`
        : 'حان وقت قراءة وردك اليومي من القرآن الكريم'
    );
    if (ok) {
      setNotificationStatusMsg('تم إرسال إشعار المتصفح بنجاح!');
      handleToggleReminderSetting('browserNotifications', true);
    } else {
      setNotificationStatusMsg('يرجى السماح بالإشعارات في المتصفح لتفعيل التنبيهات.');
    }
    setTimeout(() => setNotificationStatusMsg(null), 4000);
  };

  // Filter schedule days
  const scheduleDays = (khatma.schedule || []).filter((day) => {
    if (filterMode === 'remaining') return !day.isCompleted;
    if (filterMode === 'completed') return day.isCompleted;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Main Khatma Status & Progress Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#11161d] to-[#0c0f13] border border-indigo-500/20 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Plan Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>مخطط الختمة الذكي</span>
              </span>

              {stats.streak > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{stats.streak} أيام التزام متتالية</span>
                </span>
              )}

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                stats.paceStatus === 'ahead' 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : stats.paceStatus === 'behind'
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-700/30 text-slate-300 border border-slate-600/30'
              }`}>
                {stats.paceStatus === 'ahead' && '⚡ متقدم عن الجدول'}
                {stats.paceStatus === 'on_track' && '✓ متوافق مع الخطة'}
                {stats.paceStatus === 'behind' && '⏳ متأخر عن الخطة'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{khatma.name}</span>
              {stats.percent === 100 && (
                <Award className="w-7 h-7 text-amber-400 animate-bounce" />
              )}
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              المدة: <span className="font-bold text-white font-mono">{khatma.targetDays} يوماً</span> • 
              تاريخ البدء: <span className="text-slate-300 font-mono">{khatma.startDate}</span>
              {khatma.endDate && (
                <> • الختم المستهدف: <span className="text-indigo-300 font-bold font-mono">{khatma.endDate}</span></>
              )}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              id="khatma-reminders-settings-btn"
              onClick={() => setIsRemindersDrawerOpen(!isRemindersDrawerOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181d24] hover:bg-[#202731] text-slate-200 border border-slate-700/60 text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-xs"
              title="إعدادات التذكير اليومي"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>التذكير اليومي</span>
              {khatma.reminderSettings?.enabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              id="khatma-rebalance-btn"
              onClick={() => setIsRebalanceModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-500/40 text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-xs"
              title="إعادة موازنة وتوزيع الورد"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>إعادة موازنة ذكية</span>
            </button>

            <button
              id="customize-khatma-plan-btn"
              onClick={() => setIsCustomizingPlan(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-md shadow-indigo-600/20"
            >
              <Sliders className="w-4 h-4" />
              <span>تخصيص الخطة</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Indicators */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <span>الصفحات المقروءة:</span>
              <span className="font-bold text-white text-base">{stats.completedPagesCount}</span>
              <span className="text-slate-500">/ {stats.totalQuranPages} صفحة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">الإنجاز:</span>
              <span className="text-lg font-extrabold text-indigo-400 font-mono">{stats.percent}%</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-3.5 bg-[#141920] rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
            <div
              className="h-full bg-gradient-to-l from-emerald-400 via-indigo-500 to-indigo-600 rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>البداية (ص {khatma.startFromPage || 1})</span>
            <span>الهدف اليومي: ~{stats.dailyAverageTarget} صفحة/يوم</span>
            <span>الختام (ص 604)</span>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-[#12161d] border border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">الأيام المكتملة</p>
            <p className="text-lg font-bold text-white font-mono">
              {stats.completedDaysCount} <span className="text-xs text-slate-500 font-normal">/ {stats.totalDays}</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#12161d] border border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">المتبقي للختم</p>
            <p className="text-lg font-bold text-indigo-400 font-mono">
              {stats.remainingPages} <span className="text-xs text-slate-500 font-normal">صفحة</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#12161d] border border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">الأيام المتبقية</p>
            <p className="text-lg font-bold text-emerald-400 font-mono">
              {stats.remainingDays} <span className="text-xs text-slate-500 font-normal">يوماً</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#12161d] border border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">معدل الإنجاز</p>
            <p className="text-lg font-bold text-amber-400 font-mono">
              {stats.dailyAverageTarget} <span className="text-xs text-slate-500 font-normal">ص/يوم</span>
            </p>
          </div>
        </div>

      </div>

      {/* 2. Khatmah Completion Celebration Banner (If 100%) */}
      {stats.percent === 100 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-indigo-950/50 to-emerald-950/40 border border-amber-500/40 text-center space-y-4 shadow-xl">
          <Award className="w-14 h-14 text-amber-400 mx-auto animate-pulse" />
          <div>
            <h3 className="text-2xl font-extrabold text-amber-300">مبارك إتمام ختمة القرآن الكريم! 🌟</h3>
            <p className="text-sm text-slate-200 mt-1 max-w-xl mx-auto leading-relaxed">
              هنيئاً لك ختم كتاب الله عز وجل، نسأل الله أن يجعله شفيعاً لك ونوراً في قلبك ودربك. يُستحب عقب الختمة الدعاء والتضرع.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onOpenKhatmDua && (
              <button
                onClick={onOpenKhatmDua}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm cursor-pointer shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                قراءة دعاء ختم القرآن الكريم
              </button>
            )}

            <button
              onClick={() => setIsCustomizingPlan(true)}
              className="px-5 py-2.5 rounded-xl bg-[#1c232d] hover:bg-[#252f3d] text-white font-medium text-sm border border-slate-700 cursor-pointer transition-all"
            >
              بدء ختمة جديدة
            </button>
          </div>
        </div>
      )}

      {/* 3. Today's Smart Assigned Ward Card (ورد اليوم المطلوب) */}
      {todaysWard && stats.percent < 100 && (
        <div className="rounded-3xl bg-[#0e1217] border-2 border-indigo-500/40 p-6 sm:p-7 shadow-xl space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-emerald-500" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                  اليوم {todaysWard.dayNumber} من {khatma.targetDays}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {formatArabicDate(todaysWard.dateStr)}
                </span>
                {todaysWard.isCompleted && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>تم إنجاز ورد اليوم</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                <span>ورد اليوم المطلوب:</span>
                <span className="text-indigo-400 font-mono">
                  الصفحات {todaysWard.fromPage} إلى {todaysWard.toPage}
                </span>
              </h3>

              <p className="text-xs text-slate-300 mt-1">
                {todaysWard.surahStartName === todaysWard.surahEndName ? (
                  <>سورة {todaysWard.surahStartName}</>
                ) : (
                  <>من سورة {todaysWard.surahStartName} إلى سورة {todaysWard.surahEndName}</>
                )}
                {' • '}
                الجزء {todaysWard.juzStart}
                {todaysWard.juzEnd !== todaysWard.juzStart && ` إلى ${todaysWard.juzEnd}`}
                {' • '}
                <span className="text-indigo-300 font-mono">({todaysWard.pageCount} صفحة)</span>
              </p>
            </div>

            {/* Ward Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                id="read-todays-ward-btn"
                onClick={() => handleOpenPageInReader(todaysWard.fromPage)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>قراءة الورد الآن</span>
              </button>

              <button
                id="toggle-todays-ward-complete-btn"
                onClick={() => handleToggleDay(todaysWard.dayNumber, todaysWard.isCompleted)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  todaysWard.isCompleted
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40'
                    : 'bg-[#181e28] text-slate-300 border-slate-700 hover:bg-[#202734] hover:text-white'
                }`}
              >
                {todaysWard.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>مكتمل</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>تحديد كمكتمل</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 5-Prayer Breakdown for Today */}
          {todaysWard.prayerBreakdown && (
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>توزيع الورد الموصى به بعد الصلوات الخمس:</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="p-2.5 rounded-xl bg-[#131821] border border-slate-800/80 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-medium mb-1">
                    <Sunrise className="w-3 h-3" />
                    <span>الفجر</span>
                  </div>
                  <p className="text-xs font-bold text-white font-mono">
                    ص {todaysWard.prayerBreakdown.fajr.fromPage}-{todaysWard.prayerBreakdown.fajr.toPage}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">({todaysWard.prayerBreakdown.fajr.pages} ص)</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#131821] border border-slate-800/80 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-yellow-400 font-medium mb-1">
                    <Sun className="w-3 h-3" />
                    <span>الظهر</span>
                  </div>
                  <p className="text-xs font-bold text-white font-mono">
                    ص {todaysWard.prayerBreakdown.dhuhr.fromPage}-{todaysWard.prayerBreakdown.dhuhr.toPage}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">({todaysWard.prayerBreakdown.dhuhr.pages} ص)</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#131821] border border-slate-800/80 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-500 font-medium mb-1">
                    <Sun className="w-3 h-3" />
                    <span>العصر</span>
                  </div>
                  <p className="text-xs font-bold text-white font-mono">
                    ص {todaysWard.prayerBreakdown.asr.fromPage}-{todaysWard.prayerBreakdown.asr.toPage}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">({todaysWard.prayerBreakdown.asr.pages} ص)</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#131821] border border-slate-800/80 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-orange-400 font-medium mb-1">
                    <Sunset className="w-3 h-3" />
                    <span>المغرب</span>
                  </div>
                  <p className="text-xs font-bold text-white font-mono">
                    ص {todaysWard.prayerBreakdown.maghrib.fromPage}-{todaysWard.prayerBreakdown.maghrib.toPage}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">({todaysWard.prayerBreakdown.maghrib.pages} ص)</p>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#131821] border border-slate-800/80 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-indigo-400 font-medium mb-1">
                    <Moon className="w-3 h-3" />
                    <span>العشاء</span>
                  </div>
                  <p className="text-xs font-bold text-white font-mono">
                    ص {todaysWard.prayerBreakdown.isha.fromPage}-{todaysWard.prayerBreakdown.isha.toPage}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">({todaysWard.prayerBreakdown.isha.pages} ص)</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. Daily Reminders & Notification Settings Drawer */}
      {isRemindersDrawerOpen && (
        <div className="rounded-3xl bg-[#0f131a] border border-amber-500/30 p-6 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">إعدادات التذكير اليومي بالورد</h3>
            </div>
            <button
              onClick={() => setIsRemindersDrawerOpen(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              إغلاق
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            يُرسل لك التطبيق إشعاراً يومياً في الوقت المفضل لتذكيرك بقراءة وردك وإتمام جدول الختمة.
          </p>

          {notificationStatusMsg && (
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200 font-medium">
              {notificationStatusMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Toggle reminders */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141a24] border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">تفعيل التذكير اليومي</p>
                <p className="text-[11px] text-slate-400">تنبيه بالورد غير المكتمل</p>
              </div>
              <button
                onClick={() => handleToggleReminderSetting('enabled', !khatma.reminderSettings?.enabled)}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${
                  khatma.reminderSettings?.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    khatma.reminderSettings?.enabled ? 'left-1' : 'right-1'
                  }`}
                />
              </button>
            </div>

            {/* Time Picker */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141a24] border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">وقت التنبيه المفضل</p>
                <p className="text-[11px] text-slate-400">ساعة إرسال التذكير</p>
              </div>
              <input
                type="time"
                value={khatma.reminderSettings?.time || '08:00'}
                onChange={(e) => handleToggleReminderSetting('time', e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0e1217] border border-slate-700 text-sm font-mono text-white focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quick Slot Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">أوقات مقترحة:</span>
            {[
              { time: '06:00', label: 'بعد صلاة الفجر (06:00)' },
              { time: '08:30', label: 'الصباح (08:30)' },
              { time: '17:00', label: 'بعد صلاة العصر (17:00)' },
              { time: '21:30', label: 'المساء قبل النوم (21:30)' }
            ].map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleToggleReminderSetting('time', slot.time)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  khatma.reminderSettings?.time === slot.time
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#181f2c] text-slate-300 hover:bg-[#202838]'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleTestNotification}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c2432] hover:bg-[#253042] text-amber-300 border border-amber-500/30 text-xs font-medium cursor-pointer transition-all active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>تجربة إرسال إشعار فوري</span>
            </button>

            <button
              onClick={() => setIsRemindersDrawerOpen(false)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all ml-auto"
            >
              حفظ وتطبيق
            </button>
          </div>
        </div>
      )}

      {/* 5. Schedule Table / Day-by-Day Timeline */}
      <div className="space-y-4">
        
        {/* Filter and Schedule Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1015] p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">الجدول الزمني للختمة ({khatma.schedule?.length || 0} يوماً)</h3>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-[#131821] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({khatma.schedule?.length || 0})
            </button>
            <button
              onClick={() => setFilterMode('remaining')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterMode === 'remaining'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              المتبقي ({stats.remainingDays})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterMode === 'completed'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              المكتمل ({stats.completedDaysCount})
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-2.5">
          {scheduleDays.length === 0 ? (
            <div className="text-center py-12 bg-[#0c0f14] rounded-2xl border border-slate-800 p-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">لا توجد أيام في هذه التصفية</h4>
              <p className="text-xs text-slate-400 mt-1">لقد أكملت جميع الأوراد المطلوبة أو لا توجد أيام مطابقة.</p>
            </div>
          ) : (
            scheduleDays.map((day) => {
              const isExpanded = expandedDayNumber === day.dayNumber;
              const isToday = todaysWard?.dayNumber === day.dayNumber;

              return (
                <div
                  key={day.dayNumber}
                  id={`schedule-day-${day.dayNumber}`}
                  className={`rounded-2xl border transition-all ${
                    day.isCompleted
                      ? 'bg-[#0a0f0d] border-emerald-500/20'
                      : isToday
                      ? 'bg-[#101622] border-indigo-500/50 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                      : 'bg-[#0c0f14] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Day Info */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleDay(day.dayNumber, day.isCompleted)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          day.isCompleted
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : 'bg-[#141a24] border border-slate-700 text-transparent hover:border-indigo-400'
                        }`}
                        title={day.isCompleted ? 'إلغاء التحديد' : 'تحديد كمكتمل'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${day.isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                            اليوم {day.dayNumber}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {formatArabicDate(day.dateStr)}
                          </span>
                          {isToday && (
                            <span className="px-2 py-0.2 rounded-md bg-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                              اليوم
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 mt-0.5">
                          <span className="font-mono font-bold text-white">الصفحات {day.fromPage} - {day.toPage}</span>
                          {' '}({day.pageCount} صفحة) • 
                          {' '}{day.surahStartName === day.surahEndName ? day.surahStartName : `${day.surahStartName} إلى ${day.surahEndName}`} • 
                          {' '}الجزء {day.juzStart}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => setExpandedDayNumber(isExpanded ? null : day.dayNumber)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#141a24] hover:bg-[#1a2230] text-slate-300 text-xs font-medium border border-slate-800 cursor-pointer flex items-center gap-1 transition-colors"
                        title="عرض توزيع الصلوات الخمس"
                      >
                        <span>توزيع الصلوات</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleOpenPageInReader(day.fromPage)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>قراءة</span>
                      </button>
                    </div>

                  </div>

                  {/* Expanded 5 Prayers Breakdown */}
                  {isExpanded && day.prayerBreakdown && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-[#090d12]/50 rounded-b-2xl">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                        <div className="p-2 rounded-lg bg-[#11161f] border border-slate-800">
                          <span className="text-amber-400 text-[10px] block font-medium">الفجر</span>
                          <span className="font-mono text-white text-xs font-bold">ص {day.prayerBreakdown.fajr.fromPage}-{day.prayerBreakdown.fajr.toPage}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#11161f] border border-slate-800">
                          <span className="text-yellow-400 text-[10px] block font-medium">الظهر</span>
                          <span className="font-mono text-white text-xs font-bold">ص {day.prayerBreakdown.dhuhr.fromPage}-{day.prayerBreakdown.dhuhr.toPage}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#11161f] border border-slate-800">
                          <span className="text-amber-500 text-[10px] block font-medium">العصر</span>
                          <span className="font-mono text-white text-xs font-bold">ص {day.prayerBreakdown.asr.fromPage}-{day.prayerBreakdown.asr.toPage}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#11161f] border border-slate-800">
                          <span className="text-orange-400 text-[10px] block font-medium">المغرب</span>
                          <span className="font-mono text-white text-xs font-bold">ص {day.prayerBreakdown.maghrib.fromPage}-{day.prayerBreakdown.maghrib.toPage}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-[#11161f] border border-slate-800">
                          <span className="text-indigo-400 text-[10px] block font-medium">العشاء</span>
                          <span className="font-mono text-white text-xs font-bold">ص {day.prayerBreakdown.isha.fromPage}-{day.prayerBreakdown.isha.toPage}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* 6. Plan Customization Modal / Wizard */}
      {isCustomizingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0d1117] border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">تخصيص مخطط الختمة الذكي</h3>
              </div>
              <button
                onClick={() => setIsCustomizingPlan(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                إلغاء
              </button>
            </div>

            {/* Plan Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">اسم الختمة</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="مثال: ختمة رمضان المباركة"
                className="w-full px-4 py-2.5 rounded-xl bg-[#141a24] border border-slate-700 text-sm text-white focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Duration Presets */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-300">اختر مدة الختمة المستهدفة:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_DAYS.map((p) => (
                  <button
                    key={p.days}
                    type="button"
                    onClick={() => setCustomDays(p.days)}
                    className={`p-2.5 rounded-xl text-start transition-all cursor-pointer border ${
                      customDays === p.days
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xs'
                        : 'bg-[#141a24] border-slate-800 text-slate-300 hover:bg-[#1a2230]'
                    }`}
                  >
                    <p className="text-xs font-bold font-mono">{p.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Days Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">أو حدد عدد الأيام يدوياً:</span>
                <span className="font-bold text-indigo-400 font-mono">{customDays} يوماً (~{Math.ceil(604 / customDays)} ص/يوم)</span>
              </div>
              <input
                type="range"
                min="1"
                max="180"
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Start From Page */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">نقطة البداية:</span>
                <span className="font-mono text-slate-400">الصفحة {customStartPage}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomStartPage(1)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer border ${
                    customStartPage === 1
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-[#141a24] border-slate-800 text-slate-300'
                  }`}
                >
                  من بداية المصحف (ص 1)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomStartPage(khatma.currentPage || 1)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer border ${
                    customStartPage === khatma.currentPage && customStartPage !== 1
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-[#141a24] border-slate-800 text-slate-300'
                  }`}
                >
                  من موضع قراءتي (ص {khatma.currentPage || 1})
                </button>
              </div>
            </div>

            {/* Pace Strategy */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">نمط توزيع الورد اليومي:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCustomPace('per_prayer')}
                  className={`p-2 rounded-xl text-center cursor-pointer border text-xs ${
                    customPace === 'per_prayer'
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-[#141a24] border-slate-800 text-slate-300'
                  }`}
                >
                  بعد الصلوات الخمس
                </button>
                <button
                  type="button"
                  onClick={() => setCustomPace('morning_evening')}
                  className={`p-2 rounded-xl text-center cursor-pointer border text-xs ${
                    customPace === 'morning_evening'
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-[#141a24] border-slate-800 text-slate-300'
                  }`}
                >
                  صباحاً ومساءً
                </button>
                <button
                  type="button"
                  onClick={() => setCustomPace('single_session')}
                  className={`p-2 rounded-xl text-center cursor-pointer border text-xs ${
                    customPace === 'single_session'
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-[#141a24] border-slate-800 text-slate-300'
                  }`}
                >
                  جلسة واحدة
                </button>
              </div>
            </div>

            {/* Reminder Time */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141a24] border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">وقت التذكير اليومي:</span>
              <input
                type="time"
                value={customReminderTime}
                onChange={(e) => setCustomReminderTime(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-slate-700 text-xs font-mono text-white"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCustomizingPlan(false)}
                className="px-4 py-2.5 rounded-xl bg-[#141a24] hover:bg-[#1a2230] text-slate-300 text-xs font-medium cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSaveCustomPlan}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
              >
                إنشاء وتطبيق الخطة
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. Smart Rebalance Modal */}
      {isRebalanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0d1117] border border-indigo-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center gap-2.5 text-indigo-400">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">إعادة الموازنة الذكية</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              إذا فاتتك بعض الأيام أو كنت قد قرأت صفحات إضافية، تقوم ميزة <strong className="text-white">إعادة الموازنة الذكية</strong> بحساب الصفحات المتبقية وإعادة توزيعها بتوازن على الأيام المتبقية تلقائياً حتى لا تشعر بأي ضغط.
            </p>

            <div className="p-4 rounded-2xl bg-[#131821] border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">الصفحات المقروءة حالياً:</span>
                <span className="font-bold text-white font-mono">{stats.completedPagesCount} صفحة</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الصفحات المتبقية:</span>
                <span className="font-bold text-indigo-400 font-mono">{stats.remainingPages} صفحة</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الأيام المتبقية المقترحة:</span>
                <span className="font-bold text-emerald-400 font-mono">{stats.remainingDays || 10} يوماً</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsRebalanceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#141a24] text-slate-300 text-xs font-medium cursor-pointer"
              >
                إلغاء
              </button>

              <button
                onClick={() => handleExecuteRebalance()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة التوزيع الآن</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
