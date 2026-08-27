import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Bookmark as BookmarkIcon, 
  Copy, 
  Share2, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Sliders, 
  Globe, 
  RotateCcw,
  Check,
  Info,
  Maximize2,
  Minimize2,
  Film,
  Download,
  Layers,
  FileText,
  Compass,
  Palette,
  Image as ImageIcon,
  Languages,
  Activity,
  Heart,
  Search,
  ZoomIn,
  ZoomOut,
  X,
  BookmarkCheck,
  Pin,
  Loader2,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { Ayah, SurahDetail, PageDetail, PageAyah, ReadingSettings, Reciter, Bookmark, LastRead } from '../types';
import { fetchSurahDetail, fetchPageDetail, normalizeArabic } from '../utils/quranApi';
import { SURAHS_LIST } from '../data/quranData';
import { getReaderBackground } from '../data/readerBackgrounds';
import { MediaExporterModal } from './MediaExporterModal';
import { ImmersiveReaderModal } from './ImmersiveReaderModal';
import { VerseShareModal } from './VerseShareModal';
import { TTSControlModal } from './TTSControlModal';
import { QuranWordHighlighter } from './QuranWordHighlighter';
import { ReaderBackgroundSelector } from './ReaderBackgroundSelector';
import { fetchChapterWordSegments } from '../utils/audioSync';
import { speakText, stopTTS, getTTSLangConfig } from '../utils/ttsEngine';

interface SearchAyahResult {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
  page: number;
  juz: number;
}

interface SurahReaderProps {
  surahNumber: number;
  initialAyah?: number;
  onBack: () => void;
  onSelectSurah: (surahNumber: number, initialAyah?: number) => void;
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
  activeReciter: Reciter;
  currentPlayingAyah: number | null;
  isPlayingAudio: boolean;
  onPlayAyahAudio: (surahNum: number, ayahInSurah: number) => void;
  onPauseAudio: () => void;
  bookmarks: Bookmark[];
  onToggleBookmark: (surahNumber: number, surahName: string, ayahNumber: number, ayahText: string) => void;
  onSaveLastRead: (surahNumber: number, surahName: string, ayahNumber: number, page: number) => void;
  lastRead?: LastRead | null;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  onOpenTTSModal?: () => void;
  isTTSSpeaking?: boolean;
  isFavoriteRecitation?: boolean;
  onToggleFavoriteRecitation?: () => void;
}

export const SurahReader: React.FC<SurahReaderProps> = ({
  surahNumber,
  initialAyah,
  onBack,
  onSelectSurah,
  settings,
  onUpdateSettings,
  activeReciter,
  currentPlayingAyah,
  isPlayingAudio,
  onPlayAyahAudio,
  onPauseAudio,
  bookmarks,
  onToggleBookmark,
  onSaveLastRead,
  lastRead,
  audioRef,
  onOpenTTSModal,
  isTTSSpeaking: globalTTSSpeaking,
  isFavoriteRecitation = false,
  onToggleFavoriteRecitation
}) => {
  // Reading Mode State: 'surah' (السورة كاملة) or 'page' (بالصفحة)
  const [readingScope, setReadingScope] = useState<'surah' | 'page'>(settings.readingScope || 'surah');
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(() => {
    const meta = SURAHS_LIST.find((s) => s.number === surahNumber);
    return meta?.pageStart || 1;
  });

  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [pageData, setPageData] = useState<PageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTafsirAyah, setActiveTafsirAyah] = useState<Ayah | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [copiedTranslation, setCopiedTranslation] = useState<number | null>(null);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showBackgroundDrawer, setShowBackgroundDrawer] = useState(false);

  // Active Reader Background
  const activeBg = getReaderBackground(settings.readerBackgroundId);

  // Real-time audio time & word segments state
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [chapterSegments, setChapterSegments] = useState<Record<number, [number, number, number][]> | null>(null);

  // Modals
  const [isImmersiveOpen, setIsImmersiveOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [exportTargetAyah, setExportTargetAyah] = useState<number | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetAyah, setShareTargetAyah] = useState<Ayah | null>(null);
  const [isTTSModalOpen, setIsTTSModalOpen] = useState(false);
  const [localTTSAyahNumber, setLocalTTSAyahNumber] = useState<number | null>(null);

  // Quran Search inside Reader (words, verses, surahs)
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<'all' | 'surahs' | 'ayahs'>('all');
  const [matchingSurahs, setMatchingSurahs] = useState<typeof SURAHS_LIST>([]);
  const [matchingAyahs, setMatchingAyahs] = useState<SearchAyahResult[]>([]);
  const [isSearchingAyahs, setIsSearchingAyahs] = useState(false);
  const [highlightedAyahNumber, setHighlightedAyahNumber] = useState<number | null>(initialAyah || null);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  // Toast feedback & font size quick presets
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Real-time search effect for Surahs, Verses, and Words
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setMatchingSurahs([]);
      setMatchingAyahs([]);
      setIsSearchingAyahs(false);
      return;
    }

    const norm = normalizeArabic(trimmed);

    // 1. Match Surahs
    const foundSurahs = SURAHS_LIST.filter((s) => {
      const sNorm = normalizeArabic(s.name);
      const sArab = normalizeArabic(s.arabicName);
      const sEng = s.englishName.toLowerCase();
      const sNum = String(s.number);
      return sNorm.includes(norm) || sArab.includes(norm) || sEng.includes(trimmed.toLowerCase()) || sNum === trimmed;
    });
    setMatchingSurahs(foundSurahs);

    // 2. Match Verses & Words from API (if query length >= 2)
    if (trimmed.length >= 2) {
      setIsSearchingAyahs(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(trimmed)}/all/quran-simple-clean`);
          if (res.ok) {
            const data = await res.json();
            if (data.data && data.data.matches) {
              const results: SearchAyahResult[] = data.data.matches.slice(0, 40).map((m: any) => ({
                surahNumber: m.surah.number,
                surahName: m.surah.name,
                ayahNumber: m.numberInSurah,
                text: m.text,
                page: m.page || 1,
                juz: m.juz || 1
              }));
              setMatchingAyahs(results);
            }
          }
        } catch (e) {
          console.warn('Quran reader search error:', e);
        } finally {
          setIsSearchingAyahs(false);
        }
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setMatchingAyahs([]);
      setIsSearchingAyahs(false);
    }
  }, [searchQuery]);

  // Fetch chapter segments for word-by-word timing
  useEffect(() => {
    let isMounted = true;
    fetchChapterWordSegments(surahNumber, activeReciter.id).then((segs) => {
      if (isMounted && segs) {
        setChapterSegments(segs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [surahNumber, activeReciter.id]);

  // Audio element timeupdate listener for precise 60fps word tracking
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

  // Sync initial page with surah when surah changes
  useEffect(() => {
    const meta = SURAHS_LIST.find((s) => s.number === surahNumber);
    if (meta) {
      setCurrentPageNumber(meta.pageStart);
    }
  }, [surahNumber]);

  // Fetch Surah Details
  useEffect(() => {
    let isMounted = true;
    if (readingScope === 'surah') {
      setIsLoading(true);
      setError(null);

      fetchSurahDetail(surahNumber, activeReciter.id, settings.translationLang, settings.tafsirSource)
        .then((data) => {
          if (isMounted) {
            setSurahData(data);
            setIsLoading(false);

            // Save last read position
            const targetAyah = initialAyah || 1;
            const page = data.ayahs.find(a => a.numberInSurah === targetAyah)?.page || data.pageStart;
            onSaveLastRead(surahNumber, data.name, targetAyah, page);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message || 'حدث خطأ أثناء تحميل السورة');
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [surahNumber, readingScope, activeReciter.id, settings.translationLang, settings.tafsirSource]);

  // Fetch Page Details when readingScope === 'page'
  useEffect(() => {
    let isMounted = true;
    if (readingScope === 'page') {
      setIsLoading(true);
      setError(null);

      fetchPageDetail(currentPageNumber, activeReciter.id, settings.translationLang, settings.tafsirSource)
        .then((data) => {
          if (isMounted) {
            setPageData(data);
            setIsLoading(false);
            if (data.ayahs.length > 0) {
              const firstAyah = data.ayahs[0];
              onSaveLastRead(firstAyah.surahNumber, firstAyah.surahName, firstAyah.numberInSurah, currentPageNumber);
            }
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message || 'حدث خطأ أثناء تحميل الصفحة');
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [currentPageNumber, readingScope, activeReciter.id, settings.translationLang, settings.tafsirSource]);

  // Scroll to initial ayah or active playing ayah
  useEffect(() => {
    const targetAyahNum = currentPlayingAyah || initialAyah;
    if (targetAyahNum && ayahRefs.current[targetAyahNum] && settings.autoScroll) {
      setTimeout(() => {
        ayahRefs.current[targetAyahNum]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 200);
    }
  }, [currentPlayingAyah, initialAyah, surahData, pageData]);

  const handleScopeChange = (scope: 'surah' | 'page') => {
    setReadingScope(scope);
    onUpdateSettings({ readingScope: scope });
  };

  const isBookmarked = (ayahNum: number, surahNum: number) => {
    return bookmarks.some((b) => b.surahNumber === surahNum && b.ayahNumber === ayahNum);
  };

  const handleCopyAyah = (ayah: Ayah, currentSurahName: string) => {
    const text = `﴿ ${ayah.text} ﴾ [سورة ${currentSurahName}: الآية ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const handleCopyTranslation = (ayah: Ayah, currentSurahName: string) => {
    if (!ayah.translation) return;
    const text = `"${ayah.translation}" - [Surah ${currentSurahName || surahData?.englishName || ''}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    setCopiedTranslation(ayah.numberInSurah);
    setTimeout(() => setCopiedTranslation(null), 2000);
  };

  const handleShareAyah = (ayah: Ayah, currentSurahName?: string) => {
    setShareTargetAyah(ayah);
    setIsShareModalOpen(true);
  };

  const handleOpenExporter = (ayahNum?: number) => {
    setExportTargetAyah(ayahNum || currentPlayingAyah || 1);
    setIsExporterOpen(true);
  };

  const handleToggleAyahTTS = (ayah: Ayah, surahNum: number) => {
    if (localTTSAyahNumber === ayah.numberInSurah) {
      stopTTS();
      setLocalTTSAyahNumber(null);
      return;
    }

    // Stop current speech
    stopTTS();

    const lang = settings.ttsLanguage || settings.translationLang || 'en';
    let textToSpeak = ayah.translation || '';
    if (lang === 'ar_tafsir') {
      textToSpeak = ayah.tafsir || ayah.translation || '';
    }

    if (!textToSpeak) {
      textToSpeak = ayah.text;
    }

    setLocalTTSAyahNumber(ayah.numberInSurah);
    speakText({
      text: textToSpeak,
      languageCode: lang,
      rate: settings.ttsSpeed || 1.0,
      volume: settings.ttsVolume ?? 1.0,
      voiceURI: settings.ttsVoiceURI,
      onStart: () => setLocalTTSAyahNumber(ayah.numberInSurah),
      onEnd: () => setLocalTTSAyahNumber(null),
      onError: () => setLocalTTSAyahNumber(null)
    });
  };

  const getFontFamilyClass = () => {
    if (settings.fontFamily === 'quran') return 'font-quran';
    if (settings.fontFamily === 'amiri') return 'font-amiri';
    return 'font-cairo';
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Font size handlers (A- / A+ / Presets)
  const handleFontSizeIncrease = () => {
    const current = settings.fontSize || 30;
    const next = Math.min(56, current + 3);
    onUpdateSettings({ fontSize: next });
    showToast(`🔍 حجم الخط: ${next}px (تكبير)`);
  };

  const handleFontSizeDecrease = () => {
    const current = settings.fontSize || 30;
    const next = Math.max(18, current - 3);
    onUpdateSettings({ fontSize: next });
    showToast(`🔍 حجم الخط: ${next}px (تصغير)`);
  };

  const handleSelectFontSize = (size: number) => {
    onUpdateSettings({ fontSize: size });
    setShowFontSizePicker(false);
    showToast(`🔍 تم ضبط حجم الخط: ${size}px`);
  };

  // Save stopping point (Bookmark current reading place)
  const handleSaveStoppingPoint = (targetAyahNum?: number) => {
    const ayahNum = targetAyahNum || highlightedAyahNumber || initialAyah || currentPlayingAyah || (readingScope === 'page' ? pageData?.ayahs[0]?.numberInSurah : 1) || 1;
    const targetSurahNum = readingScope === 'page' ? (pageData?.ayahs.find(a => a.numberInSurah === ayahNum)?.surahNumber || surahNumber) : surahNumber;
    const targetSurahName = readingScope === 'page' ? (pageData?.ayahs.find(a => a.numberInSurah === ayahNum)?.surahName || surahData?.name || '') : (surahData?.name || SURAHS_LIST[surahNumber - 1]?.name || '');
    const targetPage = readingScope === 'page' ? currentPageNumber : (surahData?.ayahs.find(a => a.numberInSurah === ayahNum)?.page || surahData?.pageStart || currentPageNumber);

    onSaveLastRead(targetSurahNum, targetSurahName, ayahNum, targetPage);
    setHighlightedAyahNumber(ayahNum);
    showToast(`📌 تم حفظ موضع التوقف: سورة ${targetSurahName} • الآية ${ayahNum} (صفحة ${targetPage})`);
  };

  // Jump to saved stopping point
  const handleJumpToSavedStoppingPoint = () => {
    if (!lastRead) return;
    if (lastRead.surahNumber === surahNumber) {
      if (readingScope === 'page' && lastRead.page) {
        setCurrentPageNumber(lastRead.page);
      }
      setHighlightedAyahNumber(lastRead.ayahNumber);
      setTimeout(() => {
        ayahRefs.current[lastRead.ayahNumber]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      showToast(`📍 الانتقال لموضع التوقف: سورة ${lastRead.surahName} • الآية ${lastRead.ayahNumber}`);
    } else {
      onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber);
    }
  };

  // Select a search result
  const handleSelectSearchResult = (targetSurahNum: number, targetAyahNum: number, targetPage?: number, matchedWord?: string) => {
    setIsSearchDrawerOpen(false);
    setHighlightedWord(matchedWord || searchQuery.trim());
    setHighlightedAyahNumber(targetAyahNum);

    if (readingScope === 'page' && targetPage) {
      setCurrentPageNumber(targetPage);
    }

    if (targetSurahNum === surahNumber) {
      setTimeout(() => {
        ayahRefs.current[targetAyahNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    } else {
      onSelectSurah(targetSurahNum, targetAyahNum);
    }

    const targetMeta = SURAHS_LIST.find(s => s.number === targetSurahNum);
    showToast(`📖 تم الانتقال إلى سورة ${targetMeta?.name || targetSurahNum} • الآية ${targetAyahNum}`);
  };

  const nextSurahMeta = SURAHS_LIST.find((s) => s.number === surahNumber + 1);
  const prevSurahMeta = SURAHS_LIST.find((s) => s.number === surahNumber - 1);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <p className="text-sm font-bold text-slate-300">
          {readingScope === 'page'
            ? `جاري تحميل الصفحة ${currentPageNumber} من المصحف...`
            : `جاري تحميل سورة ${SURAHS_LIST[surahNumber - 1]?.name || ''}...`}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-[#111] border border-red-500/30 rounded-2xl text-center">
        <p className="text-sm font-bold text-red-400 mb-3">{error}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
        >
          العودة لقائمة السور
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-6rem)] -mx-2 sm:-mx-4 md:-mx-6 px-2 sm:px-4 md:px-6 py-2 sm:py-4 rounded-3xl overflow-hidden transition-all duration-700">
      
      {/* 0. Dynamic Reader Background Layers */}
      {activeBg.type === 'nature' && (
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-700 ${
            settings.readerWallpaperBlur ? 'blur-[3px] scale-105' : ''
          }`}
          style={{ backgroundImage: `url(${activeBg.value})` }}
        />
      )}
      {activeBg.type === 'gradient' && (
        <div 
          className="absolute inset-0 transition-all duration-700"
          style={{ background: activeBg.value }}
        />
      )}
      {activeBg.type === 'solid' && (
        <div 
          className="absolute inset-0 transition-all duration-700"
          style={{ backgroundColor: activeBg.value }}
        />
      )}

      {/* Background Overlay (Opacity Control for Nature & Gradients) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: activeBg.isLight ? '#fbf8ee' : '#000000',
          opacity: activeBg.type === 'nature'
            ? (settings.readerBackgroundOverlay ?? 65) / 100
            : activeBg.type === 'gradient'
            ? (settings.readerBackgroundOverlay ?? 30) / 100
            : 0
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6 pb-28">
      
      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#0e1622]/95 border border-emerald-500/50 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-fade-in ring-1 ring-emerald-400/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Reading Toolbar with Scope Toggle, Backgrounds & Immersive Studio Trigger */}
      <div className="sticky top-14 sm:top-16 md:top-20 z-30 bg-[#080808]/95 backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 border border-white/10 shadow-2xl space-y-2.5">
        
        {/* Row 1: Navigation & Main Mode Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          
          {/* Back Button & Scope Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="reader-back-btn"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#111]/90 hover:bg-[#1a1a1a] border border-[#222] cursor-pointer transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-indigo-400" />
              <span>السور</span>
            </button>

            {/* Reading Scope Toggle: بالسورة vs بالصفحة */}
            <div className="flex items-center p-1 bg-[#111]/90 rounded-xl border border-[#222] text-xs">
              <button
                id="scope-surah-btn"
                onClick={() => handleScopeChange('surah')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  readingScope === 'surah'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                السورة كاملة
              </button>
              <button
                id="scope-page-btn"
                onClick={() => handleScopeChange('page')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  readingScope === 'page'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                بالصفحة (1-604)
              </button>
            </div>
          </div>

          {/* Page Selector (when reading by page) */}
          {readingScope === 'page' && (
            <div className="flex items-center gap-2 bg-[#111]/90 px-3 py-1 rounded-xl border border-[#222] text-xs font-mono">
              <button
                onClick={() => setCurrentPageNumber(Math.max(1, currentPageNumber - 1))}
                disabled={currentPageNumber <= 1}
                className="p-1 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-slate-400">صفحة:</span>
              <select
                value={currentPageNumber}
                onChange={(e) => setCurrentPageNumber(Number(e.target.value))}
                className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 604 }, (_, i) => i + 1).map((pg) => (
                  <option key={pg} value={pg} className="bg-[#111] text-white">
                    {pg}
                  </option>
                ))}
              </select>
              <span className="text-slate-500">/ 604</span>
              <button
                onClick={() => setCurrentPageNumber(Math.min(604, currentPageNumber + 1))}
                disabled={currentPageNumber >= 604}
                className="p-1 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Right Action Tools: Background Selector, Immersive Mode, Exporter, Quick Settings */}
          <div className="flex items-center gap-2">
            
            {/* Reader Background Selector Toggle Button */}
            <button
              id="reader-background-btn"
              onClick={() => setShowBackgroundDrawer(!showBackgroundDrawer)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                showBackgroundDrawer
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-[#111]/90 hover:bg-[#1a1a1a] border-[#222] text-slate-300 hover:text-white'
              }`}
              title="تغيير خلفية القراءة (ثابتة، تدرج لوني، صور طبيعية)"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">الخلفية: {activeBg.arabicName}</span>
              <span className="sm:hidden">الخلفية</span>
            </button>

            {/* Prominent Immersive Reading Studio Button ("وضع القراءة الجذاب") */}
            <button
              id="immersive-mode-trigger-btn"
              onClick={() => setIsImmersiveOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer transition-all active:scale-95 border border-indigo-400/30"
              title="فتح وضع القراءة الجذاب والخاشع"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
              <span>وضع القراءة الجذاب</span>
            </button>

            {/* Download & Export MP4 / MP3 */}
            <button
              id="open-media-exporter-btn"
              onClick={() => handleOpenExporter()}
              className="px-3 py-1.5 rounded-xl bg-[#111]/90 hover:bg-[#1a1a1a] border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              title="تصدير وتحميل فيديو MP4 أو صوت MP3"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تحميل MP4 / MP3</span>
            </button>

            {/* Favorite Recitation Toggle in Reader */}
            {onToggleFavoriteRecitation && (
              <button
                id="reader-favorite-recitation-btn"
                onClick={onToggleFavoriteRecitation}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isFavoriteRecitation
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-xs'
                    : 'bg-[#111]/90 border-[#222] text-slate-400 hover:text-amber-300 hover:bg-[#1a1a1a]'
                }`}
                title={
                  isFavoriteRecitation
                    ? `إزالة سورة ${surahData?.name} بصوت ${activeReciter.arabicName} من التلاوات المختارة`
                    : `حفظ سورة ${surahData?.name} بصوت ${activeReciter.arabicName} في التلاوات المختارة`
                }
              >
                <Heart className={`w-4 h-4 ${isFavoriteRecitation ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            )}

            {/* Quick Settings Drawer Toggle */}
            <button
              id="reader-quick-settings-btn"
              onClick={() => setShowQuickSettings(!showQuickSettings)}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                showQuickSettings
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-[#111]/90 border-[#222] text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
              title="تخصيص الخط والخيارات"
            >
              <Sliders className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Row 2: Search Input, Font Size Scaler (A-/A+), and Stopping Point Mark */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
          
          {/* Quick Search Button / Bar */}
          <div className="flex-1 min-w-[200px] relative">
            <button
              id="reader-search-trigger-btn"
              onClick={() => setIsSearchDrawerOpen(!isSearchDrawerOpen)}
              className={`w-full py-1.5 px-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                isSearchDrawerOpen
                  ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300 shadow-inner'
                  : 'bg-[#111]/90 hover:bg-[#181818] border-[#252525] text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">
                  {searchQuery ? `البحث عن: "${searchQuery}"` : 'ابحث عن كلمة، آية، أو سورة...'}
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-400">
                {isSearchDrawerOpen ? 'إغلاق ✕' : 'بحث ↵'}
              </span>
            </button>
          </div>

          {/* Font Size Scaler Controls (A- / Indicator / A+) */}
          <div className="flex items-center gap-1 bg-[#111]/90 p-1 rounded-xl border border-[#222] relative">
            <button
              id="decrease-font-btn"
              onClick={handleFontSizeDecrease}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold"
              title="تصغير الخط (A-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {/* Current Font Size Indicator & Preset Menu Toggle */}
            <button
              id="font-size-picker-btn"
              onClick={() => setShowFontSizePicker(!showFontSizePicker)}
              className="px-2 py-0.5 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30 cursor-pointer"
              title="اختيار حجم الخط المناسب"
            >
              <span>{settings.fontSize || 30}px</span>
            </button>

            <button
              id="increase-font-btn"
              onClick={handleFontSizeIncrease}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold"
              title="تكبير الخط للرؤية الجيدة (A+)"
            >
              <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* Font Size Presets Dropdown */}
            {showFontSizePicker && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-[#0e1218] border border-indigo-500/40 rounded-2xl p-2 shadow-2xl space-y-1 w-44 backdrop-blur-2xl animate-fade-in">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 border-b border-white/10">
                  أحجام الخط المتاحة:
                </div>
                {[
                  { label: 'صغير (22px)', size: 22 },
                  { label: 'متوسط (28px)', size: 28 },
                  { label: 'كبير (34px)', size: 34 },
                  { label: 'واضح جداً (42px)', size: 42 },
                  { label: 'مريح للمسنين (52px)', size: 52 },
                ].map((item) => (
                  <button
                    key={item.size}
                    onClick={() => handleSelectFontSize(item.size)}
                    className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      settings.fontSize === item.size
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {settings.fontSize === item.size && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stopping Point Controls (Save & Jump) */}
          <div className="flex items-center gap-1.5">
            
            {/* Save Current Stopping Place Button */}
            <button
              id="save-stopping-point-btn"
              onClick={() => handleSaveStoppingPoint()}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 border border-amber-400/30 cursor-pointer transition-all active:scale-95"
              title="حفظ مكان التوقف عند القراءة"
            >
              <Pin className="w-3.5 h-3.5 fill-white" />
              <span>حفظ مكان التوقف</span>
            </button>

            {/* Jump to Saved Stopping Place (if exists) */}
            {lastRead && (
              <button
                id="jump-to-last-read-btn"
                onClick={handleJumpToSavedStoppingPoint}
                className="px-2.5 py-1.5 rounded-xl bg-[#111]/90 hover:bg-[#1a1a1a] text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                title={`الانتقال لموضع التوقف: سورة ${lastRead.surahName} آية ${lastRead.ayahNumber}`}
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span className="hidden sm:inline font-cairo">موضعك: {lastRead.surahName} ({lastRead.ayahNumber})</span>
                <span className="sm:hidden font-cairo">موضعك</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* 2. Full Quran Search Drawer (Words, Verses, and Surahs) */}
      {isSearchDrawerOpen && (
        <div className="bg-[#0b1219]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-4 sm:p-5 transition-all animate-fade-in space-y-4 shadow-2xl ring-1 ring-white/10">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm sm:text-base font-bold text-white font-cairo">
                البحث المباشر في القرآن الكريم (كلمات، آيات، سور)
              </h4>
            </div>
            <button
              onClick={() => setIsSearchDrawerOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 cursor-pointer"
            >
              إغلاق ✕
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <input
              type="text"
              id="reader-inline-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="اكتب كلمة، آية، أو اسم سورة (مثل: الحمد، الكوثر، الله نور السموات)..."
              autoFocus
              className="w-full bg-black/60 text-white placeholder:text-slate-500 rounded-2xl py-3 pr-11 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-emerald-500/30 shadow-inner font-cairo"
            />
            <Search className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-md cursor-pointer hover:bg-white/20"
              >
                مسح
              </button>
            )}
          </div>

          {/* Scope Tabs: الكل | سور (١١٤) | آيات وكلمات */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setSearchTab('all')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                searchTab === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              الكل ({matchingSurahs.length + matchingAyahs.length})
            </button>
            <button
              onClick={() => setSearchTab('surahs')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                searchTab === 'surahs'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              السور ({matchingSurahs.length})
            </button>
            <button
              onClick={() => setSearchTab('ayahs')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                searchTab === 'ayahs'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              الآيات والكلمات ({matchingAyahs.length})
            </button>
          </div>

          {/* Search Loading Indicator */}
          {isSearchingAyahs && (
            <div className="flex items-center justify-center py-4 gap-2 text-xs text-emerald-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري البحث في نص المصحف الشريف كاملاً...</span>
            </div>
          )}

          {/* Search Results Container */}
          <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
            
            {/* 1. Surah Results */}
            {(searchTab === 'all' || searchTab === 'surahs') && matchingSurahs.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 font-cairo">
                  نتائج السور ({matchingSurahs.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchingSurahs.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => handleSelectSearchResult(surah.number, 1, surah.pageStart)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-right transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center text-xs border border-emerald-500/30">
                          {surah.number}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors font-cairo">
                            سورة {surah.name} ({surah.arabicName})
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آيات • صفحة {surah.pageStart}
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Ayah & Word Results */}
            {(searchTab === 'all' || searchTab === 'ayahs') && matchingAyahs.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 font-cairo">
                  نتائج الآيات والكلمات المطابقة ({matchingAyahs.length}):
                </div>
                {matchingAyahs.map((res, idx) => (
                  <button
                    key={`${res.surahNumber}-${res.ayahNumber}-${idx}`}
                    onClick={() => handleSelectSearchResult(res.surahNumber, res.ayahNumber, res.page, searchQuery.trim())}
                    className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-right transition-all cursor-pointer group space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 font-cairo">
                        سورة {res.surahName} • الآية {res.ayahNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        صفحة {res.page} • الجزء {res.juz}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-quran text-slate-100 leading-relaxed text-right group-hover:text-white">
                      {res.text}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Empty Result */}
            {searchQuery.trim().length >= 2 && !isSearchingAyahs && matchingSurahs.length === 0 && matchingAyahs.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-cairo">
                لم يتم العثور على نتائج مطابقة لكلمة "{searchQuery}". تأكد من صحة الكلمة وحاول مجدداً.
              </div>
            )}

          </div>

        </div>
      )}

      {/* Reader Background Quick Selector Drawer */}
      {showBackgroundDrawer && (
        <div className="bg-[#0c0c0c]/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 sm:p-5 transition-all animate-fade-in space-y-3 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">خلفية المصحف والقراءة</h4>
            </div>
            <button
              onClick={() => setShowBackgroundDrawer(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-[#181818] cursor-pointer"
            >
              إغلاق
            </button>
          </div>
          <ReaderBackgroundSelector 
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        </div>
      )}

      {/* Quick Settings Inline Drawer */}
      {showQuickSettings && (
        <div className="bg-[#0c0c0c]/95 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-4 transition-all animate-fade-in space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Font Size slider */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5 font-mono">
                <span>حجم خط المصحف</span>
                <span className="text-indigo-400 font-bold">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="56"
                step="2"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Font Family selector */}
            <div>
              <span className="block text-xs font-medium text-slate-300 mb-1.5">نوع الخط</span>
              <div className="flex items-center gap-1 bg-[#111] p-1 rounded-lg border border-[#222]">
                <button
                  onClick={() => onUpdateSettings({ fontFamily: 'quran' })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    settings.fontFamily === 'quran' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الرسم العثماني
                </button>
                <button
                  onClick={() => onUpdateSettings({ fontFamily: 'amiri' })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    settings.fontFamily === 'amiri' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الخط الأميري
                </button>
                <button
                  onClick={() => onUpdateSettings({ fontFamily: 'cairo' })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    settings.fontFamily === 'cairo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  خط القاهرة
                </button>
              </div>
            </div>

            {/* Translation, Tafsir, & Word Highlight Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateSettings({ highlightSpokenWord: !settings.highlightSpokenWord })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  settings.highlightSpokenWord !== false
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
                    : 'bg-[#111] text-slate-400 border-[#222] hover:bg-[#1a1a1a]'
                }`}
                title="تمييز الكلمة المنطوقة لحظياً باللون الذهبي"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>مزامنة الكلمات</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ showTranslation: !settings.showTranslation })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  settings.showTranslation
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#111] text-slate-300 border-[#222] hover:bg-[#1a1a1a]'
                }`}
              >
                الترجمة
              </button>
              <button
                onClick={() => onUpdateSettings({ showTafsir: !settings.showTafsir })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  settings.showTafsir
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#111] text-slate-300 border-[#222] hover:bg-[#1a1a1a]'
                }`}
              >
                التفسير الميسر
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Surah / Page Header Frame */}
      {readingScope === 'surah' && surahData && (
        <div className="relative overflow-hidden rounded-3xl bg-[#0c0c0c]/85 backdrop-blur-md border border-indigo-500/20 text-white p-6 sm:p-8 text-center shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-geometric-grid pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium font-mono">
              <span>{surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
              <span>•</span>
              <span>{surahData.numberOfAyahs} آية</span>
              <span>•</span>
              <span>الجزء {surahData.juzStart}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-quran text-indigo-200 tracking-wide py-1">
              {surahData.arabicName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              {surahData.englishName} — {surahData.englishTranslation}
            </p>

            {surahData.number !== 9 && surahData.number !== 1 && (
              <div className="pt-4 mt-4 border-t border-[#1a1a1a]">
                <p className="font-quran text-xl sm:text-2xl text-slate-100 leading-loose">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {readingScope === 'page' && pageData && (
        <div className="relative overflow-hidden rounded-3xl bg-[#0c0c0c]/85 backdrop-blur-md border border-indigo-500/20 text-white p-6 text-center shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-geometric-grid pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium font-mono">
              <span>مصحف المدينة المنورة</span>
              <span>•</span>
              <span>الصفحة {currentPageNumber}</span>
              <span>•</span>
              <span>الجزء {pageData.juzNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-quran text-indigo-200">
              صفحة {currentPageNumber}
            </h1>
          </div>
        </div>
      )}

      {/* Main Verses Rendering List */}
      <div className="space-y-4">
        {(readingScope === 'page' ? pageData?.ayahs : surahData?.ayahs)?.map((ayah) => {
          const surahNum = (ayah as any).surahNumber || surahData?.number || 1;
          const surahName = (ayah as any).surahName || surahData?.name || '';
          const isPlaying = currentPlayingAyah === ayah.numberInSurah && isPlayingAudio;
          const isBooked = isBookmarked(ayah.numberInSurah, surahNum);
          const isLastReadAyah = lastRead && lastRead.surahNumber === surahNum && lastRead.ayahNumber === ayah.numberInSurah;
          const isHighlighted = highlightedAyahNumber === ayah.numberInSurah;

          return (
            <div
              key={`${surahNum}-${ayah.numberInSurah}`}
              ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)}
              id={`ayah-card-${ayah.numberInSurah}`}
              className={`rounded-2xl p-5 sm:p-6 border transition-all duration-200 backdrop-blur-md ${
                isLastReadAyah
                  ? 'border-amber-400/90 ring-2 ring-amber-400/40 bg-gradient-to-br from-[#121008]/95 to-amber-950/30 shadow-2xl'
                  : isHighlighted
                  ? 'border-emerald-400/90 ring-2 ring-emerald-400/30 bg-[#0e161f]/95 shadow-xl'
                  : isPlaying
                  ? 'border-indigo-400 ring-2 ring-indigo-500/30 bg-gradient-to-br from-[#0e0f1a]/95 to-indigo-950/40 shadow-xl'
                  : 'bg-[#0c0c0c]/90 border-[#1a1a1a]/80 hover:border-indigo-500/40 shadow-md'
              }`}
            >
              {/* Ayah Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-8 h-8 rounded-lg bg-[#111] text-indigo-400 border border-[#222] flex items-center justify-center text-xs font-bold font-mono">
                    {ayah.numberInSurah}
                  </span>
                  <span className="text-xs text-slate-400 font-sans">
                    {surahName ? `سورة ${surahName}` : ''} • (صفحة {ayah.page || currentPageNumber})
                  </span>

                  {/* Ribbon tag for Saved Stopping Place */}
                  {isLastReadAyah && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold shadow-xs">
                      <BookmarkCheck className="w-3.5 h-3.5 fill-amber-400" />
                      <span>موضع التوقف المحفوظ ⭐</span>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 flex-wrap justify-end">
                  
                  {/* Mark Stopping Point at this exact Ayah */}
                  <button
                    onClick={() => handleSaveStoppingPoint(ayah.numberInSurah)}
                    className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors cursor-pointer border flex items-center gap-1 text-xs ${
                      isLastReadAyah
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-[#111] border-[#222] text-slate-400 hover:bg-[#1a1a1a] hover:text-amber-300'
                    }`}
                    title="حفظ موضع التوقف عند هذه الآية"
                  >
                    <Pin className={`w-3.5 h-3.5 ${isLastReadAyah ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span className="hidden md:inline text-[11px]">حفظ التوقف</span>
                  </button>

                  {/* Play Ayah Audio */}
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        onPauseAudio();
                      } else {
                        onPlayAyahAudio(surahNum, ayah.numberInSurah);
                      }
                    }}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer border ${
                      isPlaying
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-[#111] border-[#222] text-slate-300 hover:bg-[#1a1a1a] hover:text-indigo-400'
                    }`}
                    title={isPlaying ? 'إيقاف التلاوة' : 'استماع لهذه الآية'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>

                  {/* Bookmark Toggle */}
                  <button
                    onClick={() => onToggleBookmark(surahNum, surahName, ayah.numberInSurah, ayah.text)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer border ${
                      isBooked
                        ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
                        : 'bg-[#111] border-[#222] text-slate-400 hover:bg-[#1a1a1a] hover:text-indigo-400'
                    }`}
                    title={isBooked ? 'إزالة من العلامات المرجعية' : 'إضافة إلى العلامات المرجعية'}
                  >
                    <BookmarkIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBooked ? 'fill-indigo-400' : ''}`} />
                  </button>

                  {/* Video & Audio Exporter Button for this Ayah */}
                  <button
                    onClick={() => handleOpenExporter(ayah.numberInSurah)}
                    className="p-1.5 sm:p-2 rounded-lg bg-[#111] border border-[#222] text-slate-400 hover:text-indigo-400 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                    title="تصدير فيديو MP4 أو صوت MP3 للآية"
                  >
                    <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Tafsir Trigger */}
                  <button
                    onClick={() => setActiveTafsirAyah(activeTafsirAyah?.numberInSurah === ayah.numberInSurah ? null : ayah)}
                    className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer ${
                      activeTafsirAyah?.numberInSurah === ayah.numberInSurah
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-[#111] border-[#222] text-slate-400 hover:bg-[#1a1a1a] hover:text-white'
                    }`}
                    title="عرض تفسير الآية"
                  >
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Copy Ayah */}
                  <button
                    onClick={() => handleCopyAyah(ayah, surahName)}
                    className="p-1.5 sm:p-2 rounded-lg bg-[#111] border border-[#222] text-slate-400 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
                    title="نسخ نص الآية"
                  >
                    {copiedAyah === ayah.numberInSurah ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>

                  {/* Share Ayah */}
                  <button
                    onClick={() => handleShareAyah(ayah, surahName)}
                    className="p-1.5 sm:p-2 rounded-lg bg-[#111] border border-[#222] text-slate-400 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
                    title="مشاركة الآية"
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                </div>
              </div>

              {/* Ayah Quranic Text with Real-Time Word Highlight */}
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
                  theme={settings.theme || 'dark'}
                  fontFamilyClass={getFontFamilyClass()}
                  fontSize={settings.fontSize}
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

              {/* Inline Tafsir Drawer */}
              {(activeTafsirAyah?.numberInSurah === ayah.numberInSurah || settings.showTafsir) && ayah.tafsir && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-indigo-950/20 dark:bg-indigo-950/30 border border-indigo-500/25 text-slate-200 leading-relaxed animate-fade-in shadow-inner">
                  <div className="flex items-center justify-between font-bold mb-2 text-indigo-400">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs sm:text-sm font-semibold">التفسير الميسر • الآية {ayah.numberInSurah}</span>
                    </div>
                  </div>
                  <p className="font-cairo text-base sm:text-lg leading-relaxed text-slate-100 dark:text-slate-100 font-normal select-text">
                    {ayah.tafsir}
                  </p>
                </div>
              )}

              {/* Inline Translation (Enlarged, High Contrast & Maximum Legibility) */}
              {settings.showTranslation && ayah.translation && (
                <div 
                  className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0d0f1a] to-[#121526] border border-indigo-500/30 border-l-4 border-l-indigo-400 text-left transition-all shadow-xl ring-1 ring-white/10" 
                  dir="ltr"
                >
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-indigo-500/20">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 font-mono text-xs sm:text-sm font-bold shadow-xs">
                        Verse {ayah.numberInSurah}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-indigo-300 font-medium tracking-wide">
                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                        <span>English Translation</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyTranslation(ayah, surahName)}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-400/40 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title="Copy English Translation"
                    >
                      {copiedTranslation === ayah.numberInSurah ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline text-[11px] text-emerald-300 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px] font-medium">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-lg sm:text-xl md:text-2xl text-slate-50 font-sans font-normal leading-relaxed sm:leading-loose tracking-wide select-text antialiased selection:bg-indigo-600 selection:text-white">
                    {ayah.translation}
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Navigation Footer (Next/Prev Page or Surah) */}
      <div className="pt-6 border-t border-[#1a1a1a] flex items-center justify-between gap-4">
        {readingScope === 'page' ? (
          <>
            <button
              onClick={() => setCurrentPageNumber(Math.max(1, currentPageNumber - 1))}
              disabled={currentPageNumber <= 1}
              className="flex-1 p-4 rounded-2xl bg-[#0c0c0c] border border-[#1a1a1a] hover:border-indigo-500/40 text-right transition-all flex items-center gap-3 cursor-pointer disabled:opacity-40"
            >
              <div className="w-9 h-9 rounded-xl bg-[#111] border border-[#222] text-indigo-400 flex items-center justify-center shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">الصفحة السابقة</span>
                <span className="text-sm font-bold text-white">
                  صفحة {currentPageNumber - 1}
                </span>
              </div>
            </button>

            <button
              onClick={() => setCurrentPageNumber(Math.min(604, currentPageNumber + 1))}
              disabled={currentPageNumber >= 604}
              className="flex-1 p-4 rounded-2xl bg-[#0c0c0c] border border-[#1a1a1a] hover:border-indigo-500/40 text-left transition-all flex items-center justify-end gap-3 cursor-pointer disabled:opacity-40"
            >
              <div>
                <span className="text-[11px] text-slate-500 block">الصفحة التالية</span>
                <span className="text-sm font-bold text-white">
                  صفحة {currentPageNumber + 1}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#111] border border-[#222] text-indigo-400 flex items-center justify-center shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </button>
          </>
        ) : (
          <>
            {prevSurahMeta ? (
              <button
                id="prev-surah-btn"
                onClick={() => onSelectSurah(prevSurahMeta.number)}
                className="flex-1 p-4 rounded-2xl bg-[#0c0c0c] border border-[#1a1a1a] hover:border-indigo-500/40 text-right transition-all flex items-center gap-3 cursor-pointer shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#111] border border-[#222] text-indigo-400 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">السورة السابقة</span>
                  <span className="text-sm font-bold text-white">
                    سورة {prevSurahMeta.name}
                  </span>
                </div>
              </button>
            ) : <div className="flex-1" />}

            {nextSurahMeta ? (
              <button
                id="next-surah-btn"
                onClick={() => onSelectSurah(nextSurahMeta.number)}
                className="flex-1 p-4 rounded-2xl bg-[#0c0c0c] border border-[#1a1a1a] hover:border-indigo-500/40 text-left transition-all flex items-center justify-end gap-3 cursor-pointer shadow-xs"
              >
                <div>
                  <span className="text-[11px] text-slate-500 block">السورة التالية</span>
                  <span className="text-sm font-bold text-white">
                    سورة {nextSurahMeta.name}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#111] border border-[#222] text-indigo-400 flex items-center justify-center shrink-0">
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </button>
            ) : <div className="flex-1" />}
          </>
        )}
      </div>

      {/* Immersive Reader Modal */}
      {isImmersiveOpen && (
        <ImmersiveReaderModal
          isOpen={isImmersiveOpen}
          onClose={() => setIsImmersiveOpen(false)}
          surahData={surahData}
          pageData={pageData}
          readingScope={readingScope}
          onChangeReadingScope={handleScopeChange}
          currentPageNumber={currentPageNumber}
          onSelectPage={setCurrentPageNumber}
          onSelectSurah={onSelectSurah}
          activeReciter={activeReciter}
          currentPlayingAyah={currentPlayingAyah}
          isPlayingAudio={isPlayingAudio}
          onPlayAyahAudio={onPlayAyahAudio}
          onPauseAudio={onPauseAudio}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          bookmarks={bookmarks}
          onToggleBookmark={onToggleBookmark}
          onOpenExporter={handleOpenExporter}
          onOpenShare={handleShareAyah}
          audioRef={audioRef}
        />
      )}

      {/* Media Exporter Modal (MP4 / MP3) */}
      {isExporterOpen && surahData && (
        <MediaExporterModal
          isOpen={isExporterOpen}
          onClose={() => setIsExporterOpen(false)}
          surahData={surahData}
          activeReciter={activeReciter}
          selectedAyahNumber={exportTargetAyah}
        />
      )}

      {/* Verse Share & Image Card Generator Modal */}
      {isShareModalOpen && surahData && (
        <VerseShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setShareTargetAyah(null);
          }}
          surahData={surahData}
          initialAyah={shareTargetAyah}
          activeReciter={activeReciter}
        />
      )}

      </div>
    </div>
  );
};
