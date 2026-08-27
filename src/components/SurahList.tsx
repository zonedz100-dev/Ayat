import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Play, 
  BookOpen, 
  Flame, 
  Sparkles, 
  Compass, 
  History, 
  CheckCircle2,
  ChevronLeft,
  Volume2,
  Heart,
  Headphones
} from 'lucide-react';
import { SurahMeta, LastRead, Reciter, FavoriteRecitation, ViewMode } from '../types';
import { SURAHS_LIST } from '../data/quranData';
import { normalizeArabic } from '../utils/quranApi';
import { IslamicPrayerHero } from './IslamicPrayerHero';
import { IslamicServicesGrid } from './IslamicServicesGrid';

interface SurahListProps {
  onSelectSurah: (surahNumber: number, initialAyah?: number) => void;
  onPlaySurah: (surahNumber: number) => void;
  lastRead: LastRead | null;
  activeReciter: Reciter;
  playingSurahNumber: number | null;
  isPlayingAudio: boolean;
  favoriteRecitations?: FavoriteRecitation[];
  onToggleFavoriteRecitation?: (surah: SurahMeta, reciter: Reciter) => void;
  onOpenFavoriteRecitationsModal?: () => void;
  onSelectView?: (view: ViewMode) => void;
  onOpenPrayerTimesModal?: () => void;
  onOpenAthkarModal?: () => void;
  onOpenTasbeehModal?: () => void;
  onOpenTaatakModal?: () => void;
  onOpenAsmaaAllahModal?: () => void;
  onOpenRamadanModal?: () => void;
  onOpenArticlesAndDuasModal?: (tab?: 'khatm_dua' | 'prophetic_duas' | 'articles') => void;
  bookmarksCount?: number;
  athkarStreak?: number;
}

export const SurahList: React.FC<SurahListProps> = ({
  onSelectSurah,
  onPlaySurah,
  lastRead,
  activeReciter,
  playingSurahNumber,
  isPlayingAudio,
  favoriteRecitations = [],
  onToggleFavoriteRecitation,
  onOpenFavoriteRecitationsModal,
  onSelectView = () => {},
  onOpenPrayerTimesModal = () => {},
  onOpenAthkarModal = () => {},
  onOpenTasbeehModal = () => {},
  onOpenTaatakModal = () => {},
  onOpenAsmaaAllahModal = () => {},
  onOpenRamadanModal = () => {},
  onOpenArticlesAndDuasModal = () => {},
  bookmarksCount = 0,
  athkarStreak = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meccan' | 'medinan' | 'popular' | 'favorites'>('all');

  const popularSurahNumbers = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];

  const filteredSurahs = useMemo(() => {
    return SURAHS_LIST.filter((surah) => {
      // Type filtering
      if (filterType === 'meccan' && surah.revelationType !== 'Meccan') return false;
      if (filterType === 'medinan' && surah.revelationType !== 'Medinan') return false;
      if (filterType === 'popular' && !popularSurahNumbers.includes(surah.number)) return false;
      if (filterType === 'favorites') {
        const isFav = favoriteRecitations.some(
          (f) => f.surahNumber === surah.number && f.reciterId === activeReciter.id
        );
        if (!isFav) return false;
      }

      // Search filtering
      if (!searchQuery.trim()) return true;
      const normalizedQuery = normalizeArabic(searchQuery);
      const normalizedName = normalizeArabic(surah.name);
      const normalizedArabic = normalizeArabic(surah.arabicName);
      const englishMatch = surah.englishName.toLowerCase().includes(searchQuery.toLowerCase());
      const numMatch = String(surah.number) === searchQuery.trim();

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedArabic.includes(normalizedQuery) ||
        englishMatch ||
        numMatch
      );
    });
  }, [searchQuery, filterType, favoriteRecitations, activeReciter.id]);

  return (
    <div className="space-y-6 pb-24">
      
      {/* 1. Grand Islamic Prayer & Mosque Hero (Inspired by Image 7 "المصلي" & Image 3 & Image 5) */}
      <IslamicPrayerHero
        onOpenPrayerTimesModal={onOpenPrayerTimesModal}
        onOpenAthkarModal={onOpenAthkarModal}
        onOpenTasbeehModal={onOpenTasbeehModal}
      />

      {/* 2. Islamic Services Grid (Inspired by Image 3 & Image 7 8-Icon Grid) */}
      <IslamicServicesGrid
        onSelectView={onSelectView}
        onOpenSurah={onSelectSurah}
        onOpenTasbeeh={onOpenTasbeehModal}
        onOpenTaatak={onOpenTaatakModal}
        onOpenAsmaaAllah={onOpenAsmaaAllahModal}
        onOpenRamadan={onOpenRamadanModal}
        onOpenArticlesAndDuas={onOpenArticlesAndDuasModal}
        onOpenPrayerTimes={onOpenPrayerTimesModal}
        bookmarksCount={bookmarksCount}
        athkarStreak={athkarStreak}
      />

      {/* 3. Search & Quran Section Header */}
      <div className="bg-[#0b131a] border border-emerald-500/20 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 mb-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>المصحف الشريف • ١١٤ سورة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-cairo">
              فهرس السور والتلاوات المباركة
            </h2>
          </div>

          <div className="text-xs text-slate-400">
            القارئ الحالي: <strong className="text-amber-300 font-cairo">{activeReciter.arabicName}</strong>
          </div>
        </div>

        {/* Instant Search Bar */}
        <div className="relative">
          <input
            type="text"
            id="hero-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم السورة (مثل: الكهف، البقرة)، رقمها، أو موضوعها..."
            className="w-full bg-black/60 text-white placeholder:text-slate-500 rounded-2xl py-3.5 pr-11 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-emerald-500/30 shadow-inner"
          />
          <Search className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs bg-white/10 text-slate-200 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-white/20 border border-white/10"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* 4. Last Read Quick Jump Banner */}
      {lastRead && (
        <div className="bg-[#0b141d] border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 font-cairo">آخر موضع قرأته</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(lastRead.timestamp).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">
                سورة {lastRead.surahName} • الآية {lastRead.ayahNumber} (صفحة {lastRead.page})
              </h3>
            </div>
          </div>
          <button
            id="continue-reading-btn"
            onClick={() => onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <span>متابعة القراءة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Filters bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 bg-[#0b131a] border border-white/10 p-1.5 rounded-2xl">
          <button
            id="filter-all-btn"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            جميع السور (114)
          </button>
          <button
            id="filter-meccan-btn"
            onClick={() => setFilterType('meccan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'meccan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مكية (86)
          </button>
          <button
            id="filter-medinan-btn"
            onClick={() => setFilterType('medinan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'medinan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مدنية (28)
          </button>
          <button
            id="filter-popular-btn"
            onClick={() => setFilterType('popular')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'popular'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سور شائعة
          </button>
          <button
            id="filter-favorites-btn"
            onClick={() => setFilterType('favorites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'favorites'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>تلاواتي ({favoriteRecitations.filter(f => f.reciterId === activeReciter.id).length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFavoriteRecitationsModal && (
            <button
              onClick={onOpenFavoriteRecitationsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer transition-all shrink-0"
              title="فتح قائمة التلاوات المختارة"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
              <span className="hidden sm:inline">تلاوات مختارة</span>
            </button>
          )}

          <div className="text-xs text-slate-400 hidden lg:block">
            القارئ الحالي: <span className="font-semibold text-emerald-400 font-cairo">{activeReciter.arabicName}</span>
          </div>
        </div>
      </div>

      {/* Surahs Grid */}
      {filteredSurahs.length === 0 ? (
        <div className="text-center py-16 bg-[#0c0c0c] rounded-2xl border border-[#1a1a1a] p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">لا توجد سورة مطابقة للبحث</h3>
          <p className="text-xs text-slate-400 mb-4">جرب البحث بكلمات أخرى أو رقم السورة</p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('all'); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            عرض جميع السور
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSurahs.map((surah) => {
            const isPlayingThis = playingSurahNumber === surah.number && isPlayingAudio;
            
            return (
              <div
                key={surah.number}
                id={`surah-card-${surah.number}`}
                onClick={() => onSelectSurah(surah.number)}
                className={`group relative bg-[#0c0c0c] rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between hover:shadow-lg hover:border-indigo-500/40 cursor-pointer active:scale-[0.99] ${
                  isPlayingThis
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-gradient-to-br from-[#0c0c0c] to-indigo-950/20'
                    : 'border-[#1a1a1a] hover:bg-[#0f0f14]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  
                  {/* Surah Number & Meta */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#222] text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 font-mono shadow-xs group-hover:border-indigo-500/40 group-hover:text-indigo-300 transition-colors">
                      {surah.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors">
                          سورة {surah.name}
                        </h3>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                          surah.revelationType === 'Meccan'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans">
                        {surah.englishName} • {surah.englishTranslation}
                      </p>
                    </div>
                  </div>

                  {/* Arabic Calligraphy Name */}
                  <div className="text-left font-quran text-lg font-bold text-indigo-300 tracking-wide">
                    {surah.name}
                  </div>

                </div>

                {/* Card Footer Details & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a] text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
                    <span>{surah.numberOfAyahs} آية</span>
                    <span className="text-slate-600">•</span>
                    <span>الجزء {surah.juzStart}</span>
                    <span className="text-slate-600">•</span>
                    <span>صـ {surah.pageStart}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Favorite Recitation Toggle */}
                    {onToggleFavoriteRecitation && (
                      <button
                        id={`fav-rec-surah-${surah.number}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteRecitation(surah, activeReciter);
                        }}
                        className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                          favoriteRecitations.some(f => f.surahNumber === surah.number && f.reciterId === activeReciter.id)
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-[#141414] border-[#262626] text-slate-400 hover:text-amber-300 hover:bg-[#202020]'
                        }`}
                        title={
                          favoriteRecitations.some(f => f.surahNumber === surah.number && f.reciterId === activeReciter.id)
                            ? `إزالة سورة ${surah.name} بصوت ${activeReciter.arabicName} من التلاوات المختارة`
                            : `حفظ سورة ${surah.name} بصوت ${activeReciter.arabicName} في التلاوات المختارة`
                        }
                      >
                        <Heart className={`w-3.5 h-3.5 ${
                          favoriteRecitations.some(f => f.surahNumber === surah.number && f.reciterId === activeReciter.id)
                            ? 'fill-amber-400 text-amber-400'
                            : ''
                        }`} />
                      </button>
                    )}

                    {/* Play Audio Button */}
                    <button
                      id={`play-surah-${surah.number}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaySurah(surah.number);
                      }}
                      className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                        isPlayingThis
                          ? 'bg-indigo-600 border-indigo-500 text-white animate-pulse'
                          : 'bg-[#141414] border-[#262626] text-slate-300 hover:bg-[#202020] hover:text-indigo-400 hover:border-indigo-500/30'
                      }`}
                      title="استماع للسورة كاملة"
                    >
                      {isPlayingThis ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    {/* Read Surah Button */}
                    <button
                      id={`read-surah-${surah.number}`}
                      onClick={() => onSelectSurah(surah.number)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>قراءة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
