import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Bookmark as BookmarkIcon, 
  Copy, 
  Share2, 
  Sliders, 
  Download, 
  Film, 
  Music, 
  RotateCcw,
  Check,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';
import { SurahDetail, Ayah, PageDetail, ReadingSettings, Reciter, Bookmark } from '../types';
import { SURAHS_LIST, getGlobalAyahNumber } from '../data/quranData';
import { QuranWordHighlighter } from './QuranWordHighlighter';
import { fetchChapterWordSegments } from '../utils/audioSync';

interface ImmersiveReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahData: SurahDetail | null;
  pageData: PageDetail | null;
  readingScope: 'surah' | 'page';
  onChangeReadingScope: (scope: 'surah' | 'page') => void;
  currentPageNumber: number;
  onSelectPage: (page: number) => void;
  onSelectSurah: (surahNum: number) => void;
  activeReciter: Reciter;
  currentPlayingAyah: number | null;
  isPlayingAudio: boolean;
  onPlayAyahAudio: (surahNum: number, ayahInSurah: number) => void;
  onPauseAudio: () => void;
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
  bookmarks: Bookmark[];
  onToggleBookmark: (surahNum: number, surahName: string, ayahNum: number, ayahText: string) => void;
  onOpenExporter: (ayahNum?: number) => void;
  onOpenShare?: (ayah?: Ayah) => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export const ImmersiveReaderModal: React.FC<ImmersiveReaderModalProps> = ({
  isOpen,
  onClose,
  surahData,
  pageData,
  readingScope,
  onChangeReadingScope,
  currentPageNumber,
  onSelectPage,
  onSelectSurah,
  activeReciter,
  currentPlayingAyah,
  isPlayingAudio,
  onPlayAyahAudio,
  onPauseAudio,
  settings,
  onUpdateSettings,
  bookmarks,
  onToggleBookmark,
  onOpenExporter,
  onOpenShare,
  audioRef
}) => {
  const [activeAyahFocus, setActiveAyahFocus] = useState<number>(currentPlayingAyah || 1);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showTafsir, setShowTafsir] = useState<boolean>(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [ambientTheme, setAmbientTheme] = useState<'deep' | 'emerald' | 'gold'>('deep');

  // Real-time audio time & word segments
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [chapterSegments, setChapterSegments] = useState<Record<number, [number, number, number][]> | null>(null);

  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch word segments for current surah
  useEffect(() => {
    let isMounted = true;
    const currentSurahNum = surahData?.number || 1;
    fetchChapterWordSegments(currentSurahNum, activeReciter.id).then((segs) => {
      if (isMounted && segs) {
        setChapterSegments(segs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [surahData?.number, activeReciter.id]);

  // Listen to audio time updates
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
      setAudioDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleTimeUpdate);
    };
  }, [audioRef]);

  // Sync focus with playing ayah
  useEffect(() => {
    if (currentPlayingAyah) {
      setActiveAyahFocus(currentPlayingAyah);
      if (ayahRefs.current[currentPlayingAyah]) {
        ayahRefs.current[currentPlayingAyah]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentPlayingAyah]);

  // Handle user activity to show/hide controls
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      // Don't hide if paused or hovering
    }, 4000);
  };

  if (!isOpen) return null;

  const currentAyahsList = readingScope === 'page' 
    ? (pageData?.ayahs || []) 
    : (surahData?.ayahs || []);

  const activeAyahObj = currentAyahsList.find((a) => a.numberInSurah === activeAyahFocus) || currentAyahsList[0];
  const isBookmarked = (ayahNum: number, surahNum: number) => {
    return bookmarks.some((b) => b.surahNumber === surahNum && b.ayahNumber === ayahNum);
  };

  const handleCopy = (ayah: Ayah, surahName: string) => {
    const text = `﴿ ${ayah.text} ﴾ [سورة ${surahName}: الآية ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  // Main Play / Pause toggle for the prominent button
  const handleMainPlayToggle = () => {
    if (isPlayingAudio) {
      onPauseAudio();
    } else {
      if (surahData) {
        onPlayAyahAudio(surahData.number, activeAyahFocus || 1);
      }
    }
  };

  const currentSurahName = surahData?.name || (pageData?.ayahs[0]?.surahName) || '';

  return (
    <div 
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      className={`fixed inset-0 z-50 overflow-hidden flex flex-col transition-all duration-500 animate-fade-in ${
        ambientTheme === 'emerald'
          ? 'bg-[#03150e] text-[#e3fcf0]'
          : ambientTheme === 'gold'
          ? 'bg-[#140e02] text-[#fef9e7]'
          : 'bg-[#050508] text-slate-100'
      }`}
    >
      
      {/* Background Geometric Atmosphere */}
      <div className="absolute inset-0 bg-geometric-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. Top Immersive Header Bar */}
      <header className={`relative z-20 flex items-center justify-between p-4 sm:p-5 border-b backdrop-blur-md transition-opacity duration-300 ${
        ambientTheme === 'emerald'
          ? 'bg-[#042016]/90 border-emerald-500/20'
          : ambientTheme === 'gold'
          ? 'bg-[#1f1603]/90 border-yellow-500/20'
          : 'bg-[#09090f]/90 border-[#1a1a1a]'
      } ${showControls ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}>
        
        {/* Left: Reading Scope Selector (السورة كاملة / بالصفحة) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-[#141414] border border-[#242424]">
            <button
              onClick={() => onChangeReadingScope('surah')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                readingScope === 'surah'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              قراءة بالسورة كاملة
            </button>
            <button
              onClick={() => onChangeReadingScope('page')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                readingScope === 'page'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              قراءة بالصفحة ({currentPageNumber}/604)
            </button>
          </div>

          {/* Quick Page Jumper (when in page mode) */}
          {readingScope === 'page' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#242424] rounded-xl text-xs font-mono">
              <span className="text-slate-400">صفحة:</span>
              <select
                value={currentPageNumber}
                onChange={(e) => onSelectPage(Number(e.target.value))}
                className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 604 }, (_, i) => i + 1).map((pg) => (
                  <option key={pg} value={pg} className="bg-[#111] text-white">
                    {pg}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Center: Title & Current Location */}
        <div className="text-center hidden md:block">
          <h2 className="text-base font-bold text-white font-quran">
            {readingScope === 'page' ? `مصحف المدينة - الصفحة ${currentPageNumber}` : `سورة ${surahData?.name || ''}`}
          </h2>
          <span className="text-xs text-slate-400 font-sans">
            القارئ: {activeReciter.arabicName}
          </span>
        </div>

        {/* Right: Actions & Theme Palette & Close */}
        <div className="flex items-center gap-2">
          
          {/* Export MP4 / MP3 Trigger */}
          <button
            onClick={() => onOpenExporter(activeAyahFocus)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="تحميل وتصدير MP4 / MP3"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحميل MP4 / MP3</span>
          </button>

          {/* Ambient Tone Selector */}
          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#242424]">
            <button
              onClick={() => setAmbientTheme('deep')}
              className={`w-5 h-5 rounded-full bg-[#050508] border ${ambientTheme === 'deep' ? 'ring-2 ring-indigo-500' : 'border-slate-700'}`}
              title="الوضع الليلي المركز"
            />
            <button
              onClick={() => setAmbientTheme('emerald')}
              className={`w-5 h-5 rounded-full bg-[#042f22] border ${ambientTheme === 'emerald' ? 'ring-2 ring-emerald-400' : 'border-emerald-800'}`}
              title="نور الزمرد"
            />
            <button
              onClick={() => setAmbientTheme('gold')}
              className={`w-5 h-5 rounded-full bg-[#2b2108] border ${ambientTheme === 'gold' ? 'ring-2 ring-yellow-400' : 'border-yellow-800'}`}
              title="المحراب الذهبي"
            />
          </div>

          {/* Exit / Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="الخروج من وضع القراءة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* 2. Main Reader Viewport */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex flex-col items-center max-w-4xl mx-auto w-full space-y-8">
        
        {/* Page / Surah Heading Header Frame */}
        <div className="w-full text-center py-4 border-b border-white/10 space-y-2">
          {readingScope === 'page' ? (
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 block mb-1">
                الجزء {pageData?.juzNumber || 1} • الحزب {Math.ceil((pageData?.juzNumber || 1) * 2)}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-quran">
                الصفحة {currentPageNumber} من المصحف الشريف
              </h1>
            </div>
          ) : (
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 block mb-1">
                سورة {surahData?.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surahData?.numberOfAyahs} آية
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-quran text-indigo-200">
                {surahData?.arabicName}
              </h1>
              {surahData?.number !== 9 && surahData?.number !== 1 && (
                <p className="font-quran text-xl sm:text-2xl text-slate-200 pt-3">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
            </div>
          )}
        </div>

        {/* Verses Flow Container */}
        <div className="w-full space-y-6">
          {currentAyahsList.map((ayah) => {
            const isPlaying = currentPlayingAyah === ayah.numberInSurah && isPlayingAudio;
            const isFocused = activeAyahFocus === ayah.numberInSurah;
            const surahNum = (ayah as any).surahNumber || surahData?.number || 1;
            const surahName = (ayah as any).surahName || surahData?.name || '';
            const isBooked = isBookmarked(ayah.numberInSurah, surahNum);

            return (
              <div
                key={`${surahNum}-${ayah.numberInSurah}`}
                ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)}
                onClick={() => setActiveAyahFocus(ayah.numberInSurah)}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative group cursor-pointer ${
                  isPlaying
                    ? 'bg-gradient-to-b from-indigo-950/40 to-indigo-900/20 border-indigo-500 shadow-2xl ring-2 ring-indigo-500/30'
                    : isFocused
                    ? 'bg-white/5 border-indigo-500/30 shadow-lg'
                    : 'bg-black/20 border-white/5 hover:border-white/15'
                }`}
              >
                
                {/* Top Mini Bar in Card */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-white/10 text-indigo-300 flex items-center justify-center font-mono font-bold">
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-slate-400 font-sans">
                      {surahName ? `سورة ${surahName}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    {/* Play single ayah */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPlaying) onPauseAudio();
                        else onPlayAyahAudio(surahNum, ayah.numberInSurah);
                      }}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isPlaying
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                      title="استماع لهذه الآية"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(surahNum, surahName, ayah.numberInSurah, ayah.text);
                      }}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isBooked
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                          : 'bg-white/10 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title="إضافة للمفضلة"
                    >
                      <BookmarkIcon className={`w-3.5 h-3.5 ${isBooked ? 'fill-indigo-400' : ''}`} />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(ayah, surahName);
                      }}
                      className="p-2 rounded-lg bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="نسخ الآية"
                    >
                      {copiedAyah === ayah.numberInSurah ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Video / Audio Export */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenExporter(ayah.numberInSurah);
                      }}
                      className="p-2 rounded-lg bg-white/10 border border-white/10 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                      title="تصدير فيديو MP4 أو صوت MP3"
                    >
                      <Film className="w-3.5 h-3.5" />
                    </button>

                    {/* Verse Share & Image Generator */}
                    {onOpenShare && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenShare(ayah);
                        }}
                        className="p-2 rounded-lg bg-white/10 border border-white/10 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                        title="مشاركة الآية أو تصميم صورة"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quran Text with Live Word Highlight */}
                <div className="py-2 text-right">
                  <QuranWordHighlighter
                    ayahText={ayah.text}
                    ayahNumberInSurah={ayah.numberInSurah}
                    surahNumber={surahNum}
                    isPlaying={isPlaying}
                    currentTime={audioCurrentTime}
                    duration={audioDuration}
                    segments={chapterSegments?.[ayah.numberInSurah]}
                    highlightEnabled={settings.highlightSpokenWord !== false}
                    theme={ambientTheme}
                    fontFamilyClass="font-quran"
                    fontSize={settings.fontSize + 4}
                    showAyahNumberBadge={true}
                    onWordClick={(startTime) => {
                      if (isPlaying && audioRef?.current) {
                        audioRef.current.currentTime = startTime;
                      } else {
                        onPlayAyahAudio(surahNum, ayah.numberInSurah);
                        setTimeout(() => {
                          if (audioRef?.current) {
                            audioRef.current.currentTime = startTime;
                          }
                        }, 100);
                      }
                    }}
                  />
                </div>

                {/* Translation & Tafsir */}
                {settings.showTranslation && ayah.translation && (
                  <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0d0f1a] to-[#121526] border border-indigo-500/30 border-l-4 border-l-indigo-400 text-left transition-all shadow-xl ring-1 ring-white/10" dir="ltr">
                    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-indigo-500/20">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 font-mono text-xs sm:text-sm font-bold shadow-xs">
                        Verse {ayah.numberInSurah}
                      </span>
                      <span className="text-xs sm:text-sm text-indigo-300 font-medium tracking-wide">
                        English Translation
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-50 font-sans font-normal leading-relaxed sm:leading-loose tracking-wide select-text antialiased selection:bg-indigo-600 selection:text-white">
                      {ayah.translation}
                    </p>
                  </div>
                )}

                {showTafsir && ayah.tafsir && (
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 text-slate-100 leading-relaxed animate-fade-in font-cairo shadow-inner">
                    <div className="flex items-center gap-2 font-bold text-indigo-400 mb-2 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>التفسير الميسر • الآية {ayah.numberInSurah}</span>
                    </div>
                    <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-normal">
                      {ayah.tafsir}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Page / Surah Pagination Switcher at bottom of text */}
        <div className="w-full flex items-center justify-between gap-4 pt-6 pb-24 border-t border-white/10">
          {readingScope === 'page' ? (
            <>
              <button
                onClick={() => onSelectPage(Math.max(1, currentPageNumber - 1))}
                disabled={currentPageNumber <= 1}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الصفحة السابقة ({currentPageNumber - 1})</span>
              </button>
              <button
                onClick={() => onSelectPage(Math.min(604, currentPageNumber + 1))}
                disabled={currentPageNumber >= 604}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 transition-all"
              >
                <span>الصفحة التالية ({currentPageNumber + 1})</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            surahData && (
              <>
                {surahData.number > 1 && (
                  <button
                    onClick={() => onSelectSurah(surahData.number - 1)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السورة السابقة</span>
                  </button>
                )}
                {surahData.number < 114 && (
                  <button
                    onClick={() => onSelectSurah(surahData.number + 1)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>السورة التالية</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </>
            )
          )}
        </div>

      </div>

      {/* 3. Dedicated Floating Bottom Control Dock with Glowing Play & Pause Button */}
      <footer className={`relative z-30 p-4 sm:p-5 border-t backdrop-blur-2xl transition-all duration-300 ${
        ambientTheme === 'emerald'
          ? 'bg-[#042016]/95 border-emerald-500/20'
          : ambientTheme === 'gold'
          ? 'bg-[#1f1603]/95 border-yellow-500/20'
          : 'bg-[#09090f]/95 border-[#1a1a1a]'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Tafsir & Translation & Word Sync Tooltips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateSettings({ highlightSpokenWord: !settings.highlightSpokenWord })}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                settings.highlightSpokenWord !== false
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-xs'
                  : 'bg-white/10 text-slate-400 border-white/10 hover:bg-white/15'
              }`}
              title="تظليل وتتبع الكلمة المنطوقة لحظياً"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">مزامنة الكلمات</span>
            </button>

            <button
              onClick={() => setShowTafsir(!showTafsir)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                showTafsir
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/15'
              }`}
            >
              {showTafsir ? 'إخفاء التفسير' : 'عرض التفسير'}
            </button>

            {/* Font size adjustment */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
              <span className="text-slate-400">الخط:</span>
              <button 
                onClick={() => onUpdateSettings({ fontSize: Math.max(22, settings.fontSize - 2) })}
                className="px-1.5 py-0.5 hover:text-indigo-400 cursor-pointer font-bold"
              >
                -
              </button>
              <span className="text-indigo-300 font-bold">{settings.fontSize}px</span>
              <button 
                onClick={() => onUpdateSettings({ fontSize: Math.min(48, settings.fontSize + 2) })}
                className="px-1.5 py-0.5 hover:text-indigo-400 cursor-pointer font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Central Glowing Play & Pause Controls ("زر القراءة والإيقاف الجذاب") */}
          <div className="flex items-center gap-3">
            
            {/* Prev Ayah */}
            <button
              onClick={() => {
                const prev = Math.max(1, activeAyahFocus - 1);
                setActiveAyahFocus(prev);
                if (isPlayingAudio && surahData) onPlayAyahAudio(surahData.number, prev);
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
              title="الآية السابقة"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Prominent Glowing Play & Pause Button */}
            <div className="relative group">
              {isPlayingAudio && (
                <div className="absolute -inset-2 bg-indigo-500 rounded-2xl blur-lg opacity-70 animate-pulse pointer-events-none" />
              )}
              <button
                id="immersive-play-pause-btn"
                onClick={handleMainPlayToggle}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/50 transition-all transform active:scale-95 cursor-pointer border border-indigo-400/40"
                title={isPlayingAudio ? 'إيقاف التلاوة' : 'بدء القراءة والتلاوة'}
              >
                {isPlayingAudio ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Next Ayah */}
            <button
              onClick={() => {
                const total = surahData?.numberOfAyahs || 7;
                const next = Math.min(total, activeAyahFocus + 1);
                setActiveAyahFocus(next);
                if (isPlayingAudio && surahData) onPlayAyahAudio(surahData.number, next);
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
              title="الآية التالية"
            >
              <SkipBack className="w-5 h-5" />
            </button>

          </div>

          {/* Right: Quick Action to Export MP4/MP3 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenExporter(activeAyahFocus)}
              className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="تصدير الفيديو والصوت"
            >
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">تصدير MP4</span>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
};
