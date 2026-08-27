import React from 'react';
import { BookOpen, X, Sparkles, Flame, CheckCircle2, ChevronLeft } from 'lucide-react';

interface KhatmaInAppBannerProps {
  title: string;
  message: string;
  wardPageStart: number;
  wardPageEnd: number;
  streak?: number;
  onReadNow: () => void;
  onDismiss: () => void;
  onOpenPlanner: () => void;
}

export const KhatmaInAppBanner: React.FC<KhatmaInAppBannerProps> = ({
  title,
  message,
  wardPageStart,
  wardPageEnd,
  streak = 0,
  onReadNow,
  onDismiss,
  onOpenPlanner
}) => {
  return (
    <aside 
      aria-label="تنبيه ورد الختمة"
      className="fixed bottom-18 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp"
    >
      <div className="rounded-2xl p-4 shadow-2xl border backdrop-blur-xl bg-[#0c1017]/95 border-indigo-500/40 text-white shadow-indigo-500/15">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl shrink-0 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white tracking-tight">{title}</h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-indigo-500/20 text-indigo-300">
                  ورد اليوم
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {message}
              </p>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-400 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>سلسلة الالتزام: {streak} أيام متتالية</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="إخفاء التنبيه لليوم"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-slate-800">
          <button
            onClick={onOpenPlanner}
            className="text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
          >
            عرض مخطط الختمة
          </button>

          <button
            onClick={onReadNow}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
          >
            <span>قراءة الورد الآن (ص {wardPageStart})</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
