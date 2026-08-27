import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Sun, 
  Award, 
  Plus, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  Vibrate,
  Sliders
} from 'lucide-react';

interface ElectronicTasbeehModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPoints?: (pts: number) => void;
}

interface DhikrOption {
  id: string;
  arabic: string;
  transliteration?: string;
  virtue?: string;
  defaultTarget: number;
}

const DEFAULT_DHIKR_LIST: DhikrOption[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    virtue: 'تُغرس له بها نخلة في الجنة وتُحط عنه خطاياه',
    defaultTarget: 33
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    virtue: 'تملأ الميزان وأحب الكلام إلى الله',
    defaultTarget: 33
  },
  {
    id: 'la_ilaha_illallah',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ',
    virtue: 'أفضل الذكر وخير ما قال النبيون',
    defaultTarget: 33
  },
  {
    id: 'allahu_akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    virtue: 'تملأ ما بين السماء والأرض',
    defaultTarget: 33
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    virtue: 'تفريج الهموم ومغفرة الذنوب وبركة الرزق',
    defaultTarget: 100
  },
  {
    id: 'la_hawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    virtue: 'كنز من كنوز الجنة ودواء لتسعة وتسعين داء',
    defaultTarget: 33
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    virtue: 'من صلى عليّ صلاة صلى الله عليه بها عشراً',
    defaultTarget: 10
  },
  {
    id: 'subhanallah_bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    virtue: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن',
    defaultTarget: 33
  }
];

export const ElectronicTasbeehModal: React.FC<ElectronicTasbeehModalProps> = ({
  isOpen,
  onClose,
  onRecordPoints
}) => {
  const [selectedDhikrIndex, setSelectedDhikrIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [targetCount, setTargetCount] = useState(33);
  const [totalToday, setTotalToday] = useState(() => {
    const saved = localStorage.getItem('ayat_tasbeeh_today_total');
    return saved ? parseInt(saved, 10) : 16;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [customDhikrModalOpen, setCustomDhikrModalOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [dhikrList, setDhikrList] = useState<DhikrOption[]>(DEFAULT_DHIKR_LIST);

  const activeDhikr = dhikrList[selectedDhikrIndex] || dhikrList[0];

  // Web Audio click tone generator
  const playClickSound = (isFinish: boolean = false) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isFinish ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(isFinish ? 880 : 520, ctx.currentTime);
      if (isFinish) {
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
      }

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (isFinish ? 0.25 : 0.08));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (isFinish ? 0.3 : 0.1));
    } catch (e) {
      // Audio context not allowed or failed
    }
  };

  // Perform Count Tap
  const handleTap = () => {
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(30);
    }

    const nextCount = currentCount + 1;
    const isTargetReached = targetCount > 0 && nextCount >= targetCount;

    setCurrentCount(isTargetReached ? 0 : nextCount);
    
    const newTotal = totalToday + 1;
    setTotalToday(newTotal);
    localStorage.setItem('ayat_tasbeeh_today_total', String(newTotal));

    if (onRecordPoints && nextCount % 10 === 0) {
      onRecordPoints(1); // Give points for consistent tasbeeh
    }

    if (isTargetReached) {
      playClickSound(true);
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([60, 40, 100]);
      }
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
      if (onRecordPoints) onRecordPoints(5); // Bonus 5 points for finishing a full round
    } else {
      playClickSound(false);
    }
  };

  const handleReset = () => {
    setCurrentCount(0);
  };

  const handleNextDhikr = () => {
    setSelectedDhikrIndex((prev) => (prev + 1) % dhikrList.length);
    setCurrentCount(0);
  };

  const handlePrevDhikr = () => {
    setSelectedDhikrIndex((prev) => (prev - 1 + dhikrList.length) % dhikrList.length);
    setCurrentCount(0);
  };

  const handleAddCustomDhikr = () => {
    if (!customText.trim()) return;
    const newDhikr: DhikrOption = {
      id: `custom_${Date.now()}`,
      arabic: customText.trim(),
      virtue: 'ذكر مبارك مخصص',
      defaultTarget: 33
    };
    setDhikrList([...dhikrList, newDhikr]);
    setSelectedDhikrIndex(dhikrList.length);
    setCurrentCount(0);
    setCustomText('');
    setCustomDhikrModalOpen(false);
  };

  if (!isOpen) return null;

  // Calculate Progress Percentage for the ring
  const progressRatio = targetCount > 0 ? Math.min(1, currentCount / targetCount) : 0.5;
  const strokeDashoffset = 440 - (440 * progressRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#052219] via-[#062d22] to-[#041a13] rounded-3xl border border-emerald-500/40 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Subtle Geometric Arabesque Pattern Overlay (Inspired by Image 2 & Image 3) */}
        <div className="absolute inset-0 bg-geometric-grid opacity-15 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header Bar */}
        <div className="relative z-10 p-4 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-white font-cairo">السبحة الإلكترونية المطورة</h2>
          </div>

          {/* Today's Tally Badge (Directly inspired by Image 2 top right "إنجازات اليوم 16") */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>إنجازات اليوم:</span>
            <span className="font-mono text-sm text-white">{totalToday}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-5 overflow-y-auto space-y-5 flex-1 flex flex-col items-center justify-between">
          
          {/* Dhikr Selector Bar with Arrows */}
          <div className="w-full flex items-center justify-between gap-2 bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-emerald-500/20">
            <button
              onClick={handlePrevDhikr}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="الذكر السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <span className="text-xs text-emerald-300 font-medium">
              الذكر ({selectedDhikrIndex + 1} من {dhikrList.length})
            </span>

            <button
              onClick={handleNextDhikr}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="الذكر التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Golden Dhikr Card (Directly inspired by Image 2 central card) */}
          <div className="w-full bg-[#053225]/80 border border-emerald-400/30 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden transition-all">
            
            {/* Top Ornamental Divider */}
            <div className="flex items-center justify-center gap-2 mb-3 text-emerald-400/60">
              <span className="w-8 h-[1px] bg-emerald-400/40" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="w-8 h-[1px] bg-emerald-400/40" />
            </div>

            {/* Dhikr Arabic Title in Golden Color */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-quran leading-relaxed drop-shadow-sm mb-2">
              {activeDhikr.arabic}
            </h3>

            {activeDhikr.virtue && (
              <p className="text-xs text-emerald-200/80 font-cairo leading-normal max-w-sm mx-auto">
                {activeDhikr.virtue}
              </p>
            )}

            {/* Total count of current session */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-slate-300 font-mono">
              <span>الدورة الحالية:</span>
              <strong className="text-amber-400">{currentCount}</strong>
              <span>/</span>
              <span>{targetCount === 0 ? '∞' : targetCount}</span>
            </div>
          </div>

          {/* Interactive Circular Tasbeeh Bead Ring (Directly inspired by Image 2 circular clicker) */}
          <div className="relative my-2 flex items-center justify-center">
            
            {/* SVG Circular Progress Ring */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              
              {/* Outer Decorative Pattern Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 shadow-inner" />
              
              <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(16, 185, 129, 0.15)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-200"
                />
              </svg>

              {/* Central Giant Clickable Button */}
              <button
                id="tasbeeh-tap-btn"
                onClick={handleTap}
                className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 text-white flex flex-col items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)] border-4 border-emerald-300/40 active:scale-95 transition-transform cursor-pointer group select-none"
              >
                <div className="text-3xl font-extrabold font-mono text-white drop-shadow-md">
                  {targetCount > 0 ? `${currentCount}/${targetCount}` : currentCount}
                </div>
                <span className="text-[11px] font-bold text-emerald-200 mt-1 group-hover:scale-105 transition-transform">
                  اضغط للتسبيح
                </span>
              </button>
            </div>

            {/* Celebration Floating Overlay */}
            {showCelebration && (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/90 rounded-full animate-bounce z-20">
                <div className="text-center p-3">
                  <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-1 animate-spin-slow" />
                  <div className="text-sm font-extrabold text-white font-cairo">تقبل الله طاعتكم!</div>
                  <div className="text-[11px] text-amber-300 font-mono">+5 نقاط طاعة</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Target Selectors (33 / 99 / 100 / ∞) */}
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs">
            <span className="text-[11px] text-slate-400 px-2">الهدف:</span>
            {[33, 99, 100, 0].map((tgt) => (
              <button
                key={tgt}
                onClick={() => {
                  setTargetCount(tgt);
                  setCurrentCount(0);
                }}
                className={`px-3 py-1 rounded-xl font-bold font-mono transition-colors cursor-pointer ${
                  targetCount === tgt
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tgt === 0 ? 'مفتوح ∞' : tgt}
              </button>
            ))}
          </div>

          {/* Bottom Utility Controls (Sound, Vibrate, Reset, Add Custom) */}
          <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-emerald-500/20">
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  soundEnabled 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}
                title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  vibrationEnabled 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}
                title={vibrationEnabled ? 'إيقاف الاهتزاز' : 'تفعيل الاهتزاز'}
              >
                <Vibrate className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setCustomDhikrModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ذِكر</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors cursor-pointer"
              title="تصفير العداد"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Add Custom Dhikr Modal */}
      {customDhikrModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0a1a14] p-5 rounded-3xl border border-emerald-500/40 text-white space-y-4">
            <h4 className="text-base font-bold font-cairo text-white">إضافة ذِكر جديد للسبحة</h4>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="مثال: لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ"
              className="w-full bg-black/50 text-white placeholder:text-slate-500 border border-emerald-500/30 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setCustomDhikrModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-bold hover:bg-white/10"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddCustomDhikr}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>إضافة الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
