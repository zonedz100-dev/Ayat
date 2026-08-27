import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ViewMode, 
  ReadingSettings, 
  Reciter, 
  Bookmark, 
  KhatmaPlan, 
  LastRead,
  AthkarReminderSettings,
  AthkarStats,
  ZikrItem,
  FavoriteRecitation,
  SurahMeta
} from './types';
import { 
  RECITERS_LIST, 
  SURAHS_LIST,
  getGlobalAyahNumber 
} from './data/quranData';
import { 
  loadSettings, 
  saveSettings, 
  loadBookmarks, 
  saveBookmarks, 
  loadKhatma, 
  saveKhatma, 
  loadLastRead, 
  saveLastRead 
} from './utils/quranApi';
import {
  loadFavoriteRecitations,
  saveFavoriteRecitations,
  toggleFavoriteRecitation,
  isRecitationFavorited
} from './utils/favoriteRecitations';
import {
  loadAthkarReminderSettings,
  saveAthkarReminderSettings,
  loadAthkarStats,
  recordAthkarCompletion,
  checkActiveReminder,
  dismissReminderForToday,
  playGentleNotificationTone,
  requestAndSendBrowserNotification
} from './utils/athkarReminders';
import {
  checkKhatmaReminder,
  dismissKhatmaReminderToday,
  sendKhatmaBrowserNotification,
  getTodaysWard,
  getSurahForPage
} from './utils/khatmaPlanner';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SurahList } from './components/SurahList';
import { JuzList } from './components/JuzList';
import { SurahReader } from './components/SurahReader';
import { AudioPlayerBar, PlaybackMode, RepeatMode } from './components/AudioPlayerBar';
import { RecitersModal } from './components/RecitersModal';
import { SearchModal } from './components/SearchModal';
import { BookmarksAndKhatma } from './components/BookmarksAndKhatma';
import { AzkarView } from './components/AzkarView';
import { PrayerTimesModal } from './components/PrayerTimesModal';
import { SettingsModal } from './components/SettingsModal';
import { AthkarNotificationModal } from './components/AthkarNotificationModal';
import { AthkarInAppBanner } from './components/AthkarInAppBanner';
import { KhatmaInAppBanner } from './components/KhatmaInAppBanner';
import { FavoriteRecitationsModal } from './components/FavoriteRecitationsModal';
import { ElectronicTasbeehModal } from './components/ElectronicTasbeehModal';
import { TaatakDeedsModal } from './components/TaatakDeedsModal';
import { RamadanImsakiyaModal } from './components/RamadanImsakiyaModal';
import { AsmaaAllahModal } from './components/AsmaaAllahModal';
import { IslamicArticlesAndDuasModal } from './components/IslamicArticlesAndDuasModal';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<ViewMode>('surahs');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [initialAyahNumber, setInitialAyahNumber] = useState<number | undefined>(undefined);
  const [initialAzkarCategory, setInitialAzkarCategory] = useState<ZikrItem['category']>('morning');

  // Configuration & Local Persistence States
  const [settings, setSettings] = useState<ReadingSettings>(loadSettings);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);
  const [khatma, setKhatma] = useState<KhatmaPlan>(loadKhatma);
  const [lastRead, setLastRead] = useState<LastRead | null>(loadLastRead);
  const [activeReciter, setActiveReciter] = useState<Reciter>(RECITERS_LIST[0]);

  // Athkar Reminders & Counter States
  const [athkarSettings, setAthkarSettings] = useState<AthkarReminderSettings>(loadAthkarReminderSettings);
  const [athkarStats, setAthkarStats] = useState<AthkarStats>(loadAthkarStats);
  const [isAthkarModalOpen, setIsAthkarModalOpen] = useState<boolean>(false);
  const [activeReminderAlert, setActiveReminderAlert] = useState<{
    type: 'morning' | 'evening';
    title: string;
    message: string;
    category: 'morning' | 'evening';
  } | null>(null);

  // Khatma Reminders Alert State
  const [activeKhatmaAlert, setActiveKhatmaAlert] = useState<{
    title: string;
    message: string;
    wardPageStart: number;
    wardPageEnd: number;
  } | null>(null);

  // Audio Engine States
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playingSurahNumber, setPlayingSurahNumber] = useState<number | null>(null);
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('ayah_by_ayah');
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showAudioDock, setShowAudioDock] = useState<boolean>(false);

  // Modals States (Islamic Suite Inspired by References)
  const [isRecitersModalOpen, setIsRecitersModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isPrayerTimesModalOpen, setIsPrayerTimesModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isFavoriteRecitationsModalOpen, setIsFavoriteRecitationsModalOpen] = useState<boolean>(false);
  const [isTasbeehModalOpen, setIsTasbeehModalOpen] = useState<boolean>(false);
  const [isTaatakModalOpen, setIsTaatakModalOpen] = useState<boolean>(false);
  const [isRamadanModalOpen, setIsRamadanModalOpen] = useState<boolean>(false);
  const [isAsmaaAllahModalOpen, setIsAsmaaAllahModalOpen] = useState<boolean>(false);
  const [isArticlesAndDuasModalOpen, setIsArticlesAndDuasModalOpen] = useState<boolean>(false);
  const [articlesInitialTab, setArticlesInitialTab] = useState<'khatm_dua' | 'prophetic_duas' | 'articles'>('khatm_dua');
  
  const [favoriteRecitations, setFavoriteRecitations] = useState<FavoriteRecitation[]>(loadFavoriteRecitations);

  // Native HTMLAudioElement Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Theme synchronization with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#050505';
      root.style.color = '#e2e2e2';
    } else if (settings.theme === 'parchment') {
      root.classList.remove('dark');
      root.style.backgroundColor = '#fbf7ee';
      root.style.color = '#2d2417';
    } else {
      // Geometric Balance Emerald / Slate theme
      root.classList.remove('dark');
      root.style.backgroundColor = '#050505';
      root.style.color = '#e2e2e2';
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Athkar & Khatma Reminder Checker Engine
  useEffect(() => {
    const checkReminders = () => {
      // 1. Athkar Reminder Check
      const activeAthkar = checkActiveReminder(athkarSettings, athkarStats);
      if (activeAthkar && athkarSettings.inAppBannerEnabled) {
        setActiveReminderAlert(activeAthkar);
      } else {
        setActiveReminderAlert(null);
      }

      // 2. Khatma Reminder Check
      const khatmaReminder = checkKhatmaReminder(khatma);
      if (khatmaReminder.shouldRemind && khatmaReminder.ward) {
        setActiveKhatmaAlert({
          title: '📖 تذكير ورد القرآن الكريم',
          message: `وردك اليومي: الصفحات ${khatmaReminder.ward.fromPage} إلى ${khatmaReminder.ward.toPage} (${khatmaReminder.ward.surahStartName})`,
          wardPageStart: khatmaReminder.ward.fromPage,
          wardPageEnd: khatmaReminder.ward.toPage
        });

        // Trigger gentle sound chime
        if (khatma.reminderSettings?.soundEnabled) {
          playGentleNotificationTone();
        }

        // Trigger browser push notification if permitted
        if (khatma.reminderSettings?.browserNotifications) {
          sendKhatmaBrowserNotification(
            '📖 تذكير ورد القرآن الكريم',
            `وردك اليوم: الصفحات ${khatmaReminder.ward.fromPage} إلى ${khatmaReminder.ward.toPage}`
          );
        }
      }
    };

    // Check on mount
    checkReminders();

    // Check periodically every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [athkarSettings, athkarStats, khatma]);

  // Save settings when changed
  const handleUpdateSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  // Update Athkar reminder settings
  const handleUpdateAthkarSettings = (newSettings: Partial<AthkarReminderSettings>) => {
    setAthkarSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveAthkarReminderSettings(updated);
      return updated;
    });
  };

  // Record Athkar completion
  const handleRecordAthkarCompletion = (category: 'morning' | 'evening' | 'after_prayer' | 'quran_duas') => {
    setAthkarStats((prev) => {
      const updated = recordAthkarCompletion(category, prev);
      return updated;
    });
    // Dismiss active banner if matching category
    if (category === 'morning' || category === 'evening') {
      dismissReminderForToday(category);
      setActiveReminderAlert(null);
    }
  };

  const handleDismissReminder = () => {
    if (activeReminderAlert) {
      dismissReminderForToday(activeReminderAlert.type);
      setActiveReminderAlert(null);
    }
  };

  const handleReadAthkarFromReminder = (category: 'morning' | 'evening') => {
    setInitialAzkarCategory(category);
    setCurrentView('azkar');
    handleDismissReminder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Khatma Reminder Handlers
  const handleDismissKhatmaAlert = () => {
    dismissKhatmaReminderToday();
    setActiveKhatmaAlert(null);
  };

  const handleReadKhatmaFromAlert = (startPage: number) => {
    const surah = getSurahForPage(startPage);
    handleSelectSurah(surah.number);
    handleDismissKhatmaAlert();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bookmarks handlers
  const handleToggleBookmark = (
    surahNumber: number,
    surahName: string,
    ayahNumber: number,
    ayahText: string
  ) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
      let updated: Bookmark[];
      if (exists) {
        updated = prev.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber));
      } else {
        const newBm: Bookmark = {
          id: `bm-${surahNumber}-${ayahNumber}-${Date.now()}`,
          surahNumber,
          surahName,
          ayahNumber,
          ayahText,
          timestamp: Date.now()
        };
        updated = [newBm, ...prev];
      }
      saveBookmarks(updated);
      return updated;
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveBookmarks(updated);
      return updated;
    });
  };

  // Last read handler
  const handleSaveLastRead = (
    surahNumber: number,
    surahName: string,
    ayahNumber: number,
    page: number
  ) => {
    const lr: LastRead = {
      surahNumber,
      surahName,
      ayahNumber,
      page,
      timestamp: Date.now()
    };
    setLastRead(lr);
    saveLastRead(lr);
  };

  // Khatma plan handler
  const handleUpdateKhatma = (newKhatma: KhatmaPlan) => {
    setKhatma(newKhatma);
    saveKhatma(newKhatma);
  };

  // Favorite Recitations Handlers
  const handleToggleFavoriteRecitation = (surah?: SurahMeta, reciter?: Reciter) => {
    const targetSurahNum = surah ? surah.number : (playingSurahNumber || selectedSurahNumber);
    const targetReciter = reciter || activeReciter;
    const updated = toggleFavoriteRecitation(targetSurahNum, targetReciter.id);
    setFavoriteRecitations(updated);
  };

  const handlePlayFavoriteRecitation = (surahNumber: number, reciter: Reciter) => {
    setActiveReciter(reciter);
    handlePlaySurah(surahNumber);
  };

  // Navigation Handlers
  const handleSelectSurah = (surahNumber: number, initialAyah?: number) => {
    setSelectedSurahNumber(surahNumber);
    setInitialAyahNumber(initialAyah);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Audio Playback Engine
  const playAudioSource = useCallback((url: string) => {
    if (!audioRef.current) return;
    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current
      .play()
      .then(() => {
        setIsPlayingAudio(true);
        setShowAudioDock(true);
      })
      .catch((err) => {
        console.warn('Audio playback error:', err);
      });
  }, [playbackRate]);

  // 1. Play full Surah audio
  const handlePlaySurah = (surahNumber: number) => {
    setPlayingSurahNumber(surahNumber);
    setPlayingAyahNumber(null);
    setPlaybackMode('surah_continuous');
    const audioUrl = activeReciter.surahAudioPattern(surahNumber);
    playAudioSource(audioUrl);
  };

  // 2. Play single Ayah audio & continuous ayah playback
  const handlePlayAyah = (surahNum: number, ayahInSurah: number) => {
    setPlayingSurahNumber(surahNum);
    setPlayingAyahNumber(ayahInSurah);
    setPlaybackMode('ayah_by_ayah');
    const globalAyah = getGlobalAyahNumber(surahNum, ayahInSurah);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${activeReciter.id}/${globalAyah}.mp3`;
    playAudioSource(audioUrl);
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  const handleResumeAudio = () => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    } else if (playingSurahNumber) {
      if (playbackMode === 'ayah_by_ayah' && playingAyahNumber) {
        handlePlayAyah(playingSurahNumber, playingAyahNumber);
      } else {
        handlePlaySurah(playingSurahNumber);
      }
    }
  };

  // Next / Prev Ayah handlers
  const handleNextAyah = () => {
    if (!playingSurahNumber || !playingAyahNumber) return;
    const surahMeta = SURAHS_LIST.find((s) => s.number === playingSurahNumber);
    if (!surahMeta) return;

    if (playingAyahNumber < surahMeta.numberOfAyahs) {
      handlePlayAyah(playingSurahNumber, playingAyahNumber + 1);
    } else if (playingSurahNumber < 114) {
      handlePlayAyah(playingSurahNumber + 1, 1);
    }
  };

  const handlePrevAyah = () => {
    if (!playingSurahNumber || !playingAyahNumber) return;
    if (playingAyahNumber > 1) {
      handlePlayAyah(playingSurahNumber, playingAyahNumber - 1);
    } else if (playingSurahNumber > 1) {
      const prevSurahMeta = SURAHS_LIST.find((s) => s.number === playingSurahNumber - 1);
      if (prevSurahMeta) {
        handlePlayAyah(playingSurahNumber - 1, prevSurahMeta.numberOfAyahs);
      }
    }
  };

  // Next / Prev Surah handlers
  const handleNextSurah = () => {
    if (!playingSurahNumber) return;
    if (playingSurahNumber < 114) {
      handlePlaySurah(playingSurahNumber + 1);
    }
  };

  const handlePrevSurah = () => {
    if (!playingSurahNumber) return;
    if (playingSurahNumber > 1) {
      handlePlaySurah(playingSurahNumber - 1);
    }
  };

  // Audio Ended Auto-Chaining Event Listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleAudioEnded = () => {
      if (repeatMode === 'repeat_ayah' && playingSurahNumber && playingAyahNumber) {
        handlePlayAyah(playingSurahNumber, playingAyahNumber);
        return;
      }

      if (playbackMode === 'ayah_by_ayah' && playingSurahNumber && playingAyahNumber) {
        const surahMeta = SURAHS_LIST.find((s) => s.number === playingSurahNumber);
        if (!surahMeta) return;

        if (playingAyahNumber < surahMeta.numberOfAyahs) {
          handlePlayAyah(playingSurahNumber, playingAyahNumber + 1);
        } else {
          // Finished surah ayahs
          if (repeatMode === 'repeat_surah') {
            handlePlayAyah(playingSurahNumber, 1);
          } else if (playingSurahNumber < 114) {
            handlePlayAyah(playingSurahNumber + 1, 1);
          } else {
            setIsPlayingAudio(false);
          }
        }
      } else if (playbackMode === 'surah_continuous' && playingSurahNumber) {
        if (repeatMode === 'repeat_surah') {
          handlePlaySurah(playingSurahNumber);
        } else if (playingSurahNumber < 114) {
          handlePlaySurah(playingSurahNumber + 1);
        } else {
          setIsPlayingAudio(false);
        }
      }
    };

    audio.addEventListener('ended', handleAudioEnded);
    return () => {
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [playbackMode, repeatMode, playingSurahNumber, playingAyahNumber, activeReciter]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K => Open Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      // Escape => Close any modal
      if (e.key === 'Escape') {
        if (isSearchModalOpen) setIsSearchModalOpen(false);
        else if (isRecitersModalOpen) setIsRecitersModalOpen(false);
        else if (isPrayerTimesModalOpen) setIsPrayerTimesModalOpen(false);
        else if (isSettingsModalOpen) setIsSettingsModalOpen(false);
        else if (isAthkarModalOpen) setIsAthkarModalOpen(false);
        else if (isFavoriteRecitationsModalOpen) setIsFavoriteRecitationsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, isRecitersModalOpen, isPrayerTimesModalOpen, isSettingsModalOpen, isAthkarModalOpen, isFavoriteRecitationsModalOpen]);

  const currentSurahMeta = SURAHS_LIST.find((s) => s.number === (playingSurahNumber || selectedSurahNumber));
  const isCurrentPlayingRecitationFavorite = Boolean(
    playingSurahNumber && isRecitationFavorited(playingSurahNumber, activeReciter.id)
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      
      {/* Hidden Audio Element for Web Audio Playback */}
      <audio ref={audioRef} preload="auto" />

      {/* Top Main Navigation (Mobile-Optimized & Accessible) */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeReciter={activeReciter}
        onOpenReciters={() => setIsRecitersModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenPrayerTimes={() => setIsPrayerTimesModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAthkarModal={() => setIsAthkarModalOpen(true)}
        onOpenFavoriteRecitations={() => setIsFavoriteRecitationsModalOpen(true)}
        favoriteRecitationsCount={favoriteRecitations.length}
        hasActiveAthkarReminder={Boolean(activeReminderAlert)}
        athkarStreak={athkarStats.currentStreak}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        bookmarksCount={bookmarks.length}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* 1. Surahs List View */}
        {currentView === 'surahs' && (
          <SurahList
            onSelectSurah={handleSelectSurah}
            onPlaySurah={handlePlaySurah}
            lastRead={lastRead}
            activeReciter={activeReciter}
            playingSurahNumber={playingSurahNumber}
            isPlayingAudio={isPlayingAudio}
            favoriteRecitations={favoriteRecitations}
            onToggleFavoriteRecitation={handleToggleFavoriteRecitation}
            onOpenFavoriteRecitationsModal={() => setIsFavoriteRecitationsModalOpen(true)}
            onSelectView={setCurrentView}
            onOpenPrayerTimesModal={() => setIsPrayerTimesModalOpen(true)}
            onOpenAthkarModal={() => setIsAthkarModalOpen(true)}
            onOpenTasbeehModal={() => setIsTasbeehModalOpen(true)}
            onOpenTaatakModal={() => setIsTaatakModalOpen(true)}
            onOpenAsmaaAllahModal={() => setIsAsmaaAllahModalOpen(true)}
            onOpenRamadanModal={() => setIsRamadanModalOpen(true)}
            onOpenArticlesAndDuasModal={(tab) => {
              setArticlesInitialTab(tab || 'khatm_dua');
              setIsArticlesAndDuasModalOpen(true);
            }}
            bookmarksCount={bookmarks.length}
            athkarStreak={athkarStats.streakDays}
          />
        )}

        {/* 2. Juz Catalog View */}
        {currentView === 'juz' && (
          <JuzList onSelectSurah={handleSelectSurah} />
        )}

        {/* 3. Surah Mushaf Reader View */}
        {currentView === 'reader' && (
          <SurahReader
            surahNumber={selectedSurahNumber}
            initialAyah={initialAyahNumber}
            onBack={() => setCurrentView('surahs')}
            onSelectSurah={handleSelectSurah}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            activeReciter={activeReciter}
            currentPlayingAyah={playingSurahNumber === selectedSurahNumber ? playingAyahNumber : null}
            isPlayingAudio={isPlayingAudio}
            onPlayAyahAudio={handlePlayAyah}
            onPauseAudio={handlePauseAudio}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSaveLastRead={handleSaveLastRead}
            lastRead={lastRead}
            audioRef={audioRef}
            isFavoriteRecitation={isRecitationFavorited(selectedSurahNumber, activeReciter.id)}
            onToggleFavoriteRecitation={() => handleToggleFavoriteRecitation()}
          />
        )}

        {/* 4. Bookmarks & Khatma Goal Planner View */}
        {currentView === 'khatma' && (
          <BookmarksAndKhatma
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onSelectBookmark={handleSelectSurah}
            khatma={khatma}
            onUpdateKhatma={handleUpdateKhatma}
            favoriteRecitations={favoriteRecitations}
            onPlayFavoriteRecitation={handlePlayFavoriteRecitation}
            onToggleFavoriteRecitation={handleToggleFavoriteRecitation}
            onOpenFavoriteRecitationsModal={() => setIsFavoriteRecitationsModalOpen(true)}
            activeReciter={activeReciter}
            playingSurahNumber={playingSurahNumber}
            isPlayingAudio={isPlayingAudio}
            onReadSurah={handleSelectSurah}
          />
        )}

        {/* 5. Azkar & Duas View */}
        {currentView === 'azkar' && (
          <AzkarView 
            stats={athkarStats}
            onRecordCompletion={handleRecordAthkarCompletion}
            onOpenReminderModal={() => setIsAthkarModalOpen(true)}
            initialCategory={initialAzkarCategory}
          />
        )}

      </main>

      {/* In-App Floating Reminder Alert Banner */}
      {activeReminderAlert && (
        <AthkarInAppBanner
          type={activeReminderAlert.type}
          title={activeReminderAlert.title}
          message={activeReminderAlert.message}
          stats={athkarStats}
          onReadNow={() => handleReadAthkarFromReminder(activeReminderAlert.category)}
          onDismiss={handleDismissReminder}
          onOpenSettings={() => {
            setIsAthkarModalOpen(true);
            handleDismissReminder();
          }}
        />
      )}

      {/* Persistent Audio Player Dock */}
      {showAudioDock && playingSurahNumber && (
        <AudioPlayerBar
          surahNumber={playingSurahNumber}
          currentAyahNumber={playingAyahNumber}
          totalAyahsInSurah={currentSurahMeta?.numberOfAyahs || 7}
          activeReciter={activeReciter}
          isPlaying={isPlayingAudio}
          onPlay={handleResumeAudio}
          onPause={handlePauseAudio}
          onNextAyah={handleNextAyah}
          onPrevAyah={handlePrevAyah}
          onNextSurah={handleNextSurah}
          onPrevSurah={handlePrevSurah}
          onClose={() => {
            handlePauseAudio();
            setShowAudioDock(false);
          }}
          playbackMode={playbackMode}
          repeatMode={repeatMode}
          onSetRepeatMode={setRepeatMode}
          playbackRate={playbackRate}
          onSetPlaybackRate={setPlaybackRate}
          onOpenReciterModal={() => setIsRecitersModalOpen(true)}
          audioRef={audioRef}
          isFavoriteRecitation={isCurrentPlayingRecitationFavorite}
          onToggleFavoriteRecitation={() => handleToggleFavoriteRecitation()}
          onOpenFavoriteRecitationsModal={() => setIsFavoriteRecitationsModalOpen(true)}
        />
      )}

      {/* Mobile Bottom Tab Bar */}
      <BottomNav
        currentView={currentView}
        onSelectView={setCurrentView}
        bookmarksCount={bookmarks.length}
      />

      {/* Athkar Notifications & Counter Modal */}
      <AthkarNotificationModal
        isOpen={isAthkarModalOpen}
        onClose={() => setIsAthkarModalOpen(false)}
        settings={athkarSettings}
        onUpdateSettings={handleUpdateAthkarSettings}
        stats={athkarStats}
        onNavigateToAzkar={(category) => {
          setInitialAzkarCategory(category);
          setCurrentView('azkar');
        }}
      />

      {/* Favorite Recitations Modal */}
      <FavoriteRecitationsModal
        isOpen={isFavoriteRecitationsModalOpen}
        onClose={() => setIsFavoriteRecitationsModalOpen(false)}
        favorites={favoriteRecitations}
        onPlayRecitation={handlePlayFavoriteRecitation}
        onToggleFavorite={handleToggleFavoriteRecitation}
        onReadSurah={handleSelectSurah}
        activeReciter={activeReciter}
        playingSurahNumber={playingSurahNumber}
        isPlayingAudio={isPlayingAudio}
      />

      {/* Reciter Picker Modal */}
      <RecitersModal
        isOpen={isRecitersModalOpen}
        onClose={() => setIsRecitersModalOpen(false)}
        selectedReciter={activeReciter}
        onSelectReciter={(r) => {
          setActiveReciter(r);
          // If audio is currently playing, switch stream to new reciter
          if (isPlayingAudio && playingSurahNumber) {
            if (playbackMode === 'ayah_by_ayah' && playingAyahNumber) {
              handlePlayAyah(playingSurahNumber, playingAyahNumber);
            } else {
              handlePlaySurah(playingSurahNumber);
            }
          }
        }}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectResult={(surahNum, ayahNum) => {
          handleSelectSurah(surahNum, ayahNum);
        }}
      />

      {/* Prayer Times Modal */}
      <PrayerTimesModal
        isOpen={isPrayerTimesModalOpen}
        onClose={() => setIsPrayerTimesModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Electronic Tasbeeh Modal (Inspired by Image 2 & 7) */}
      <ElectronicTasbeehModal
        isOpen={isTasbeehModalOpen}
        onClose={() => setIsTasbeehModalOpen(false)}
      />

      {/* Taatak Daily Deeds & Gamification Modal (Inspired by Image 1 & 7) */}
      <TaatakDeedsModal
        isOpen={isTaatakModalOpen}
        onClose={() => setIsTaatakModalOpen(false)}
        onOpenAzkarCategory={(category) => {
          setIsTaatakModalOpen(false);
          setInitialAzkarCategory(category as ZikrItem['category']);
          setCurrentView('azkar');
        }}
        onOpenQuranReader={() => {
          setIsTaatakModalOpen(false);
          setCurrentView('surahs');
        }}
      />

      {/* Ramadan Imsakiya & Cannon Modal (Inspired by Image 4) */}
      <RamadanImsakiyaModal
        isOpen={isRamadanModalOpen}
        onClose={() => setIsRamadanModalOpen(false)}
      />

      {/* 99 Names of Allah Modal (Inspired by Image 3 & 7) */}
      <AsmaaAllahModal
        isOpen={isAsmaaAllahModalOpen}
        onClose={() => setIsAsmaaAllahModalOpen(false)}
      />

      {/* Islamic Articles, Khatm Dua & Prophetic Duas Modal (Inspired by Image 1 & 6) */}
      <IslamicArticlesAndDuasModal
        isOpen={isArticlesAndDuasModalOpen}
        onClose={() => setIsArticlesAndDuasModalOpen(false)}
        initialTab={articlesInitialTab}
      />

    </div>
  );
}
