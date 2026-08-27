import React, { useState } from 'react';
import { 
  Compass, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  Heart, 
  Flame, 
  Bell, 
  CheckCircle2,
  Calendar,
  Award
} from 'lucide-react';
import { ZikrItem, AthkarStats } from '../types';
import { AZKAR_DATA } from '../data/quranData';
import { getTodayDateString, playGentleNotificationTone } from '../utils/athkarReminders';

interface AzkarViewProps {
  stats: AthkarStats;
  onRecordCompletion: (category: 'morning' | 'evening' | 'after_prayer' | 'quran_duas') => void;
  onOpenReminderModal: () => void;
  initialCategory?: ZikrItem['category'];
}

export const AzkarView: React.FC<AzkarViewProps> = ({
  stats,
  onRecordCompletion,
  onOpenReminderModal,
  initialCategory = 'morning'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ZikrItem['category']>(initialCategory);
  const [azkarState, setAzkarState] = useState<Record<string, number>>({});
  const [justCompletedCelebration, setJustCompletedCelebration] = useState(false);

  const categories = [
    { id: 'morning' as const, label: 'أذكار الصباح', icon: Sun },
    { id: 'evening' as const, label: 'أذكار المساء', icon: Moon },
    { id: 'after_prayer' as const, label: 'بعد الصلاة', icon: Compass },
    { id: 'quran_duas' as const, label: 'أدعية قرآنية', icon: Heart }
  ];

  const currentList = AZKAR_DATA.filter((z) => z.category === selectedCategory);
  const today = getTodayDateString();

  const isCategoryCompletedToday = 
    selectedCategory === 'morning' ? stats.lastMorningCompletedDate === today :
    selectedCategory === 'evening' ? stats.lastEveningCompletedDate === today : false;

  const handleIncrement = (id: string, maxRepeat: number) => {
    const current = azkarState[id] || 0;
    if (current < maxRepeat) {
      if (navigator.vibrate) {
        navigator.vibrate(25);
      }
      const nextVal = current + 1;
      const nextState = {
        ...azkarState,
        [id]: nextVal
      };
      setAzkarState(nextState);

      // Check if all items in current category are now completed
      const allDone = currentList.every((z) => {
        const val = z.id === id ? nextVal : (nextState[z.id] || 0);
        return val >= z.repeat;
      });

      if (allDone && !isCategoryCompletedToday) {
        handleMarkCategoryComplete();
      }
    }
  };

  const handleMarkCategoryComplete = () => {
    playGentleNotificationTone();
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 80]);
    }
    onRecordCompletion(selectedCategory);
    setJustCompletedCelebration(true);
    setTimeout(() => setJustCompletedCelebration(false), 4000);
  };

  const handleReset = (id: string) => {
    setAzkarState((prev) => ({
      ...prev,
      [id]: 0
    }));
  };

  const handleResetAll = () => {
    setAzkarState({});
  };

  // Calculate overall category progress percentage
  const totalTargetTaps = currentList.reduce((acc, curr) => acc + curr.repeat, 0);
  const currentTotalTaps = currentList.reduce((acc, curr) => acc + Math.min(curr.repeat, azkarState[curr.id] || 0), 0);
  const categoryProgress = totalTargetTaps > 0 ? Math.round((currentTotalTaps / totalTargetTaps) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-28">
      
      {/* 1. Header & Stats Counter Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0c0c] via-[#121216] to-[#09090c] border border-indigo-500/20 text-white p-5 sm:p-7 shadow-2xl">
        <div className="absolute inset-0 opacity-15 bg-geometric-grid pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>حصن المسلم • أدعية وأذكار</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              الأذكار والأدعية اليومية
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              أذكار الصباح والمساء وأدعية الصلوات مع تذكيرات ذكية وعداد لمتابعة وردك اليومي.
            </p>
          </div>

          {/* Reminder Settings Trigger Button */}
          <button
            id="azkar-reminder-settings-trigger-btn"
            onClick={onOpenReminderModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>مواعيد التذكير والعداد</span>
          </button>
        </div>

        {/* Persistent Stats Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-black/40 rounded-2xl p-2.5 sm:p-3 border border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Sun className="w-3.5 h-3.5" />
              <span className="text-[11px] text-slate-400">أذكار الصباح</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {stats.morningCompletedCount} <span className="text-xs font-sans text-slate-500 font-normal">مرة</span>
            </div>
          </div>

          <div className="bg-black/40 rounded-2xl p-2.5 sm:p-3 border border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-400 mb-1">
              <Moon className="w-3.5 h-3.5" />
              <span className="text-[11px] text-slate-400">أذكار المساء</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {stats.eveningCompletedCount} <span className="text-xs font-sans text-slate-500 font-normal">مرة</span>
            </div>
          </div>

          <div className="bg-black/40 rounded-2xl p-2.5 sm:p-3 border border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span className="text-[11px] text-slate-400">سلسلة الأيام</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-300">
              {stats.currentStreak} <span className="text-xs font-sans text-slate-500 font-normal">يوم متتالي</span>
            </div>
          </div>

          <div className="bg-black/40 rounded-2xl p-2.5 sm:p-3 border border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[11px] text-slate-400">إجمالي الختمات</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
              {stats.totalCompletedCount} <span className="text-xs font-sans text-slate-500 font-normal">جلسة</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Category Selector & Action Tools */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          const isDone = 
            cat.id === 'morning' ? stats.lastMorningCompletedDate === today :
            cat.id === 'evening' ? stats.lastEveningCompletedDate === today : false;

          return (
            <button
              key={cat.id}
              id={`azkar-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-[#111] border-[#222] text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              {isDone && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
              )}
            </button>
          );
        })}

        <button
          onClick={handleResetAll}
          className="mr-auto px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-[#111] border border-[#222] cursor-pointer flex items-center gap-1.5 transition-colors"
          title="تصفير جميع عدادات الصفحة"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تصفير العداد</span>
        </button>
      </div>

      {/* 3. Category Completion & Progress Banner */}
      <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isCategoryCompletedToday || justCompletedCelebration
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
          : 'bg-[#111] border-[#222] text-slate-300'
      }`}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`p-2.5 rounded-xl ${
            isCategoryCompletedToday || justCompletedCelebration
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-indigo-500/10 text-indigo-400'
          }`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {selectedCategory === 'morning' ? 'أذكار الصباح' : selectedCategory === 'evening' ? 'أذكار المساء' : 'الأذكار المحددة'}
              </span>
              {isCategoryCompletedToday && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  تمت قراءتها اليوم ✓
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              نسبة التقدم: {categoryProgress}% ({currentTotalTaps} من {totalTargetTaps} تسبيحة)
            </p>
          </div>
        </div>

        {/* Complete Today Button */}
        <button
          onClick={handleMarkCategoryComplete}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isCategoryCompletedToday
              ? 'bg-[#1a1a1a] hover:bg-[#252525] text-emerald-400 border border-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{isCategoryCompletedToday ? 'تسجيل قراءة إضافية في العداد (+1)' : 'إتمام القراءة وتسجيل الإنجاز'}</span>
        </button>
      </div>

      {/* 4. Azkar Cards List */}
      <div className="space-y-4">
        {currentList.map((zikr) => {
          const count = azkarState[zikr.id] || 0;
          const isDone = count >= zikr.repeat;
          const progress = (count / zikr.repeat) * 100;

          return (
            <div
              key={zikr.id}
              id={`zikr-card-${zikr.id}`}
              className={`bg-[#0c0c0c] rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-xs flex flex-col justify-between gap-4 ${
                isDone
                  ? 'border-emerald-500/40 bg-gradient-to-br from-[#0c0c0c] to-emerald-950/10'
                  : 'border-[#1a1a1a] hover:border-indigo-500/30'
              }`}
            >
              {/* Zikr Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-400 shadow-xs shadow-emerald-400/50' : 'bg-indigo-500'}`} />
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {zikr.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#111] border border-[#222] text-slate-300">
                    التكرار: {zikr.repeat}
                  </span>
                  {count > 0 && (
                    <button
                      onClick={() => handleReset(zikr.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white bg-[#111] border border-[#222] cursor-pointer transition-colors"
                      title="إعادة ضبط"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Zikr Text */}
              <p className="font-quran text-lg sm:text-xl text-slate-100 leading-loose text-right">
                {zikr.text}
              </p>

              {/* Reward and Hadith note */}
              {zikr.reward && (
                <div className="p-3 rounded-xl bg-[#111] border border-[#222] text-xs text-slate-300 leading-relaxed font-cairo">
                  <span className="font-bold text-indigo-400">الفضل: </span>
                  {zikr.reward} {zikr.source && <span className="text-slate-500 font-mono">({zikr.source})</span>}
                </div>
              )}

              {/* Interactive Counter Tap Button (Accessible >= 44px) */}
              <div className="pt-1">
                <button
                  id={`zikr-tap-${zikr.id}`}
                  onClick={() => handleIncrement(zikr.id, zikr.repeat)}
                  disabled={isDone}
                  className={`w-full min-h-[48px] py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all cursor-pointer relative overflow-hidden ${
                    isDone
                      ? 'bg-emerald-600 text-white cursor-default shadow-md shadow-emerald-600/20'
                      : 'bg-[#121216] text-indigo-300 border border-indigo-500/30 hover:bg-indigo-950/20 active:scale-[0.99]'
                  }`}
                >
                  {/* Progress background fill */}
                  {!isDone && (
                    <div
                      className="absolute inset-y-0 right-0 bg-indigo-600/30 transition-all duration-300 pointer-events-none"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <span className="relative z-10 font-medium">
                    {isDone ? (
                      <span className="flex items-center gap-1.5 font-mono font-bold">
                        <Check className="w-4 h-4" />
                        <span>تم الانتهاء ({zikr.repeat} / {zikr.repeat})</span>
                      </span>
                    ) : (
                      <span className="font-mono font-bold">انقر للتسبيح ({count} / {zikr.repeat})</span>
                    )}
                  </span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
