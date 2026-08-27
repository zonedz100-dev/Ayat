import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Trophy, 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Calendar, 
  Check, 
  ChevronLeft,
  Sun,
  Moon,
  BookOpen,
  Heart,
  Compass,
  Clock
} from 'lucide-react';

interface TaatakDeedsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAzkarCategory?: (category: string) => void;
  onOpenQuranReader?: () => void;
}

interface DailyDeed {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  category?: string;
  actionType: 'azkar' | 'quran' | 'tasbeeh' | 'general';
}

const INITIAL_DEEDS: DailyDeed[] = [
  {
    id: 'morning_azkar',
    title: 'أذكار الصباح',
    subtitle: 'حصن نفسك وأكمل ورد ذكرك المبارك',
    points: 5,
    icon: Sun,
    completed: true,
    actionType: 'azkar',
    category: 'morning'
  },
  {
    id: 'quran_wird',
    title: 'ورد القرآن الكريم',
    subtitle: 'قراءة صفحة أو سورة من كتاب الله',
    points: 10,
    icon: BookOpen,
    completed: false,
    actionType: 'quran'
  },
  {
    id: 'evening_azkar',
    title: 'أذكار المساء',
    subtitle: 'حفظ وبركة ليومك وليلتك',
    points: 5,
    icon: Moon,
    completed: false,
    actionType: 'azkar',
    category: 'evening'
  },
  {
    id: 'duha_prayer',
    title: 'صلاة الضحى',
    subtitle: 'ركعتا الأوابين تجزئ عن ٣٦٠ صدقة',
    points: 5,
    icon: Sparkles,
    completed: false,
    actionType: 'general'
  },
  {
    id: 'after_prayer_azkar',
    title: 'أذكار بعد الصلاة',
    subtitle: 'التسبيح والتحميد والتكبير دبر كل صلاة',
    points: 5,
    icon: Compass,
    completed: false,
    actionType: 'azkar',
    category: 'after_prayer'
  },
  {
    id: 'sleep_azkar',
    title: 'أذكار النوم',
    subtitle: 'سنة المصطفى ﷺ لطمأنينة القلب',
    points: 5,
    icon: Clock,
    completed: false,
    actionType: 'azkar',
    category: 'sleep'
  },
  {
    id: 'daily_tasbeeh',
    title: 'مئة تسبيحة واستغفار',
    subtitle: 'تُمحى بها الخطايا ولو كانت مثل زبد البحر',
    points: 5,
    icon: Heart,
    completed: false,
    actionType: 'tasbeeh'
  },
  {
    id: 'qiyam_witr',
    title: 'قيام الليل والوتر',
    subtitle: 'شرف المؤمن وصلته بربه في السحر',
    points: 10,
    icon: Moon,
    completed: false,
    actionType: 'general'
  }
];

export const TaatakDeedsModal: React.FC<TaatakDeedsModalProps> = ({
  isOpen,
  onClose,
  onOpenAzkarCategory,
  onOpenQuranReader
}) => {
  const [deeds, setDeeds] = useState<DailyDeed[]>(() => {
    const saved = localStorage.getItem('ayat_taatak_deeds_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_DEEDS.map((d) => ({
          ...d,
          completed: Boolean(parsed[d.id])
        }));
      } catch (e) {
        return INITIAL_DEEDS;
      }
    }
    return INITIAL_DEEDS;
  });

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('ayat_taatak_points');
    return saved ? parseInt(saved, 10) : 4005;
  });

  const [justCelebrated, setJustCelebrated] = useState<string | null>(null);

  // Save deeds state to localStorage
  useEffect(() => {
    const map: Record<string, boolean> = {};
    deeds.forEach((d) => {
      map[d.id] = d.completed;
    });
    localStorage.setItem('ayat_taatak_deeds_v1', JSON.stringify(map));
  }, [deeds]);

  // Save points to localStorage
  useEffect(() => {
    localStorage.setItem('ayat_taatak_points', String(points));
  }, [points]);

  const handleToggleDeed = (id: string, deedPoints: number) => {
    setDeeds((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.completed;
          if (nextState) {
            setPoints((p) => p + deedPoints);
            setJustCelebrated(id);
            setTimeout(() => setJustCelebrated(null), 2000);
            if (navigator.vibrate) navigator.vibrate([40, 60]);
          } else {
            setPoints((p) => Math.max(0, p - deedPoints));
          }
          return { ...d, completed: nextState };
        }
        return d;
      })
    );
  };

  if (!isOpen) return null;

  const completedCount = deeds.filter((d) => d.completed).length;
  const totalCount = deeds.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // 7 Days of the week for streak row
  const weekDays = [
    { name: 'السبت', date: '٦/١٢', done: true },
    { name: 'الأحد', date: '٦/١٣', done: true },
    { name: 'الإثنين', date: '٦/١٤', done: true },
    { name: 'الثلاثاء', date: '٦/١٥', done: true, isToday: true },
    { name: 'الأربعاء', date: '٦/١٦', done: false },
    { name: 'الخميس', date: '٦/١٧', done: false },
    { name: 'الجمعة', date: '٦/١٨', done: false }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-lg bg-[#0a111a] rounded-3xl border border-sky-500/30 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Decorative Gradient Arch (Inspired by Image 1) */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 p-6 text-white text-center relative shadow-lg">
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>نافس بالطاعة وسابق للخيرات</span>
          </div>

          <h2 className="text-2xl font-extrabold font-cairo">طاعاتك اليومية</h2>
          <p className="text-xs text-sky-100 mt-0.5">
            سجل أورادك اليومية واكسب النقاط والأوسمة الإيمانية
          </p>

          {/* 3 Major Stats Card (Inspired by Image 1 top row) */}
          <div className="grid grid-cols-3 gap-2 mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            
            {/* Badges */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Award className="w-4 h-4" />
                <span className="text-lg font-bold font-mono text-white">12</span>
              </div>
              <div className="text-[11px] text-sky-100">الأوسمة</div>
            </div>

            {/* Rank */}
            <div className="text-center border-x border-white/20">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Trophy className="w-4 h-4" />
                <span className="text-lg font-bold font-mono text-white">#1</span>
              </div>
              <div className="text-[11px] text-sky-100">الترتيب</div>
            </div>

            {/* Points */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                <Coins className="w-4 h-4" />
                <span className="text-lg font-bold font-mono text-white">{points}</span>
              </div>
              <div className="text-[11px] text-sky-100">نقاط الطاعة</div>
            </div>

          </div>

          {/* Level Progress Bar (Inspired by Image 1) */}
          <div className="mt-3 bg-black/20 rounded-xl p-2 text-right">
            <div className="flex items-center justify-between text-xs text-white mb-1.5 font-cairo">
              <span>المستوى رقم 3</span>
              <span className="font-mono text-amber-300">{progressPercent}% مكتمل</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-300 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Week Streak Tracker (Inspired by Image 1 middle row) */}
          <div className="bg-[#101b2b] p-3.5 rounded-2xl border border-sky-500/20">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2.5 font-bold">
              <span>أيام الأسبوع</span>
              <span className="text-sky-400 font-mono">{completedCount} من {totalCount} مهام اليوم</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                    day.isToday
                      ? 'bg-amber-500 text-black font-bold ring-2 ring-amber-300'
                      : day.done
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <span className="text-[10px]">{day.name}</span>
                  <div className="my-1">
                    {day.done ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 block" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono opacity-80">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Tasks List (Directly inspired by Image 1 "مهام اليوم") */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 px-1">مهام اليوم والطاعات الموصى بها</h3>

            {deeds.map((deed) => {
              const Icon = deed.icon;
              const isJustDone = justCelebrated === deed.id;

              return (
                <div
                  key={deed.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    deed.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-[#101b2b] border-[#1e293b] hover:border-sky-500/30'
                  } ${isJustDone ? 'ring-2 ring-amber-400 scale-[1.01]' : ''}`}
                >
                  {/* Deed Icon & Details */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        deed.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{deed.title}</h4>
                        {/* Coin badge */}
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                          +{deed.points} 🪙
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{deed.subtitle}</p>
                    </div>
                  </div>

                  {/* Complete/Action Button (Inspired by Image 1 buttons "تمت" or "سابق إلى الخير") */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleDeed(deed.id, deed.points)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        deed.completed
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                      }`}
                    >
                      {deed.completed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تمت ✓</span>
                        </>
                      ) : (
                        <span>سابق للخير</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
