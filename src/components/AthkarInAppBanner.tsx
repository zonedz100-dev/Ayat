import React from 'react';
import { Sun, Moon, Bell, X, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { AthkarStats } from '../types';

interface AthkarInAppBannerProps {
  type: 'morning' | 'evening';
  title: string;
  message: string;
  stats: AthkarStats;
  onReadNow: () => void;
  onDismiss: () => void;
  onOpenSettings: () => void;
}

export const AthkarInAppBanner: React.FC<AthkarInAppBannerProps> = ({
  type,
  title,
  message,
  stats,
  onReadNow,
  onDismiss,
  onOpenSettings
}) => {
  const isMorning = type === 'morning';

  return (
    <aside 
      aria-label="تنبيه الأذكار"
      className="fixed bottom-18 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp"
    >
      <div className={`rounded-2xl p-4 shadow-2xl border backdrop-blur-xl transition-all ${
        isMorning
          ? 'bg-[#100e05]/95 border-amber-500/40 text-white shadow-amber-500/10'
          : 'bg-[#090a14]/95 border-indigo-500/40 text-white shadow-indigo-500/10'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isMorning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              {isMorning ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white tracking-tight">{title}</h4>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isMorning ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  تذكير
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {message}
              </p>
              {stats.currentStreak > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-400 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>حافظ على سلسلتك: {stats.currentStreak} أيام متتالية</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="إخفاء التنبيه لليوم"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
          <button
            onClick={onReadNow}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isMorning
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            <span>قراءة الأذكار الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDismiss}
            className="py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            لاحقاً
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="ضبط المواعيد"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
