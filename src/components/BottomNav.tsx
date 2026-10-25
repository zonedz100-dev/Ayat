import React from 'react';
import { BookOpen, Layers, BookmarkCheck, Compass, GraduationCap } from 'lucide-react';
import { ViewMode } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  bookmarksCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onSelectView,
  bookmarksCount
}) => {
  const tabs = [
    { id: 'surahs' as ViewMode, label: 'السور', icon: BookOpen },
    { id: 'juz' as ViewMode, label: 'الأجزاء', icon: Layers },
    { id: 'azkar' as ViewMode, label: 'الأذكار', icon: Compass },
    { id: 'khatma' as ViewMode, label: 'الختمة', icon: BookmarkCheck, badge: bookmarksCount },
    { id: 'learning' as ViewMode, label: 'تعلّم', icon: GraduationCap }
  ];

  const handleTabClick = (tabId: ViewMode) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (e) {
        // ignore
      }
    }
    onSelectView(tabId);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-2xl border-t border-[#1a1a1a] px-3 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id || (tab.id === 'surahs' && currentView === 'reader');
          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer relative min-h-[48px] active:scale-95 ${
                isActive
                  ? 'text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20'
                  : 'text-slate-400 font-medium hover:text-slate-200 active:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-indigo-400' : 'text-slate-400'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -left-2.5 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold font-mono rounded-full bg-indigo-600 text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
