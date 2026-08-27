import React from 'react';
import { 
  BookOpen, 
  Search, 
  Moon, 
  Sun, 
  SlidersHorizontal, 
  Sparkles, 
  Clock, 
  Headphones, 
  Bookmark,
  Share2,
  Bell,
  Layers,
  Compass,
  Flame
} from 'lucide-react';
import { Reciter, ReadingSettings, ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  activeReciter: Reciter;
  onOpenReciters: () => void;
  onOpenSearch: () => void;
  onOpenPrayerTimes: () => void;
  onOpenSettings: () => void;
  onOpenAthkarModal: () => void;
  onOpenFavoriteRecitations?: () => void;
  favoriteRecitationsCount?: number;
  hasActiveAthkarReminder?: boolean;
  athkarStreak?: number;
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  activeReciter,
  onOpenReciters,
  onOpenSearch,
  onOpenPrayerTimes,
  onOpenSettings,
  onOpenAthkarModal,
  onOpenFavoriteRecitations,
  favoriteRecitationsCount = 0,
  hasActiveAthkarReminder = false,
  athkarStreak = 0,
  settings,
  onUpdateSettings,
  bookmarksCount
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'emerald' : settings.theme === 'emerald' ? 'parchment' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'آيات | تطبيق القرآن الكريم',
        text: 'تطبيق آيات التفاعلي لقراءة واستماع وتدبر القرآن الكريم والأذكار',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط التطبيق بنجاح!');
    }
  };

  const reciterShortName = activeReciter.arabicName.split(' ')[0] || 'القارئ';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080808]/95 border-b border-[#1a1a1a] transition-all shadow-xs safe-area-pt">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-1.5 sm:gap-4">
          
          {/* 1. Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => onSelectView('surahs')}
              className="flex items-center gap-2 sm:gap-3 text-right group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-white/10 shrink-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-xs sm:rounded-sm flex items-center justify-center">
                  <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
              
              <div className="flex flex-col text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-xl font-bold text-white tracking-tight font-sans">
                    آيات <span className="text-indigo-400 font-medium hidden xs:inline">القرآن</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden sm:inline-block">
                    تفاعلي
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans hidden md:block">
                  قراءة • استماع • تدبر • أذكار
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 mr-4 border-r border-[#222] pr-4">
              <button
                id="nav-surahs-btn"
                onClick={() => onSelectView('surahs')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'surahs' || currentView === 'reader'
                    ? 'text-white bg-[#1a1a1a] border border-[#333] shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111]'
                }`}
              >
                السور
              </button>
              <button
                id="nav-juz-btn"
                onClick={() => onSelectView('juz')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'juz'
                    ? 'text-white bg-[#1a1a1a] border border-[#333] shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111]'
                }`}
              >
                الأجزاء
              </button>
              <button
                id="nav-azkar-btn"
                onClick={() => onSelectView('azkar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'azkar'
                    ? 'text-white bg-[#1a1a1a] border border-[#333] shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111]'
                }`}
              >
                <span>الأذكار</span>
                {athkarStreak > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    <Flame className="w-2.5 h-2.5 fill-amber-400" />
                    {athkarStreak}
                  </span>
                )}
              </button>
              <button
                id="nav-khatma-btn"
                onClick={() => onSelectView('khatma')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'khatma' || currentView === 'bookmarks'
                    ? 'text-white bg-[#1a1a1a] border border-[#333] shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111]'
                }`}
              >
                <span>الختمة والمفضلة</span>
                {bookmarksCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-500 text-white font-mono">
                    {bookmarksCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* 2. Actions & Utilities Container (Mobile-Optimized & Fully Accessible) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Search Button */}
            <button
              id="search-open-btn"
              onClick={onOpenSearch}
              className="flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl text-slate-300 bg-[#111] hover:bg-[#1a1a1a] border border-[#222] transition-colors cursor-pointer min-w-[36px] sm:min-w-auto"
              title="بحث في الآيات والسور (⌘K)"
              aria-label="بحث في القرآن"
            >
              <Search className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-xs font-medium hidden md:inline text-slate-300">بحث...</span>
              <kbd className="hidden lg:inline-block text-[10px] bg-[#1a1a1a] border border-[#333] rounded px-1.5 py-0.5 text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Athkar & Reminders Bell Button */}
            <button
              id="athkar-reminders-bell-btn"
              onClick={onOpenAthkarModal}
              className={`flex items-center justify-center h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl border transition-all cursor-pointer relative min-w-[36px] sm:min-w-auto ${
                hasActiveAthkarReminder
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20 shadow-xs'
                  : 'bg-[#111] border-[#222] text-slate-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
              title="تذكيرات أذكار الصباح والمساء والعداد"
              aria-label="تذكيرات الأذكار"
            >
              <Bell className="w-4 h-4 shrink-0" />
              {hasActiveAthkarReminder && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse border-2 border-[#080808]" />
              )}
            </button>

            {/* Favorite Recitations Button */}
            {onOpenFavoriteRecitations && (
              <button
                id="favorite-recitations-btn"
                onClick={onOpenFavoriteRecitations}
                className="flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-all cursor-pointer relative min-w-[36px] sm:min-w-auto"
                title="تلاوات مختارة (قائمتك المفضلة للقراء والسور)"
                aria-label="تلاوات مختارة"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400/30" />
                <span className="text-xs font-semibold hidden xl:inline">تلاوات مختارة</span>
                {favoriteRecitationsCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-black font-mono">
                    {favoriteRecitationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Reciter Selector Pill */}
            <button
              id="reciter-selector-btn"
              onClick={onOpenReciters}
              className="flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2 sm:px-3 rounded-xl bg-[#111] text-indigo-300 border border-indigo-500/20 hover:bg-[#1a1a1a] transition-all text-xs font-medium cursor-pointer max-w-[90px] xs:max-w-[120px] sm:max-w-[160px] truncate"
              title={`القارئ الحالي: ${activeReciter.arabicName}`}
              aria-label="اختيار القارئ"
            >
              <Headphones className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">{reciterShortName}</span>
            </button>

            {/* Prayer Times Button */}
            <button
              id="prayer-times-btn"
              onClick={onOpenPrayerTimes}
              className="flex items-center justify-center h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-[#111] border border-[#222] text-slate-300 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
              title="مواقيت الصلاة واتجاه القبلة"
              aria-label="مواقيت الصلاة"
            >
              <Clock className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Theme Switcher (Hidden on extra small screens to conserve space, available in settings) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-[#111] border border-[#222] text-slate-300 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
              title={`تغيير المظهر: ${settings.theme === 'dark' ? 'ليلي' : settings.theme === 'parchment' ? 'ورقي' : 'داكن'}`}
              aria-label="تغيير المظهر"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : settings.theme === 'parchment' ? (
                <Sparkles className="w-4 h-4 text-indigo-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Share button (Desktop / Tablet) */}
            <button
              id="share-app-btn"
              onClick={handleShareApp}
              className="hidden lg:flex items-center justify-center h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-[#111] border border-[#222] text-slate-300 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
              title="مشاركة التطبيق"
              aria-label="مشاركة التطبيق"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Settings button */}
            <button
              id="settings-open-btn"
              onClick={onOpenSettings}
              className="flex items-center justify-center h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-[#111] border border-[#222] text-slate-300 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
              title="إعدادات القراءة والتلاوة"
              aria-label="إعدادات التطبيق"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
