import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  RotateCw,
  Volume2, 
  Volume1,
  VolumeX, 
  Repeat, 
  Repeat1, 
  Clock, 
  X, 
  Maximize2, 
  Minimize2, 
  Headphones, 
  SlidersHorizontal,
  Gauge,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw as ResetIcon,
  Layers,
  Film,
  Download,
  Share2,
  Bookmark,
  Radio,
  Languages,
  Activity,
  Heart
} from 'lucide-react';
import { Reciter, ReadingSettings } from '../types';
import { SURAHS_LIST } from '../data/quranData';
import { fetchChapterWordSegments } from '../utils/audioSync';
import { getTTSLangConfig } from '../utils/ttsEngine';

export type PlaybackMode = 'surah_continuous' | 'ayah_by_ayah';
export type RepeatMode = 'off' | 'repeat_ayah' | 'repeat_surah';

interface AudioPlayerBarProps {
  surahNumber: number;
  currentAyahNumber: number | null;
  totalAyahsInSurah: number;
  activeReciter: Reciter;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  onClose: () => void;
  playbackMode: PlaybackMode;
  repeatMode: RepeatMode;
  onSetRepeatMode: (mode: RepeatMode) => void;
  playbackRate: number;
  onSetPlaybackRate: (rate: number) => void;
  onOpenReciterModal: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  settings?: ReadingSettings;
  onUpdateSettings?: (newSettings: Partial<ReadingSettings>) => void;
  onOpenTTSModal?: () => void;
  isTTSSpeaking?: boolean;
  isFavoriteRecitation?: boolean;
  onToggleFavoriteRecitation?: () => void;
  onOpenFavoriteRecitationsModal?: () => void;
}

const SPEED_PRESETS = [0.5, 0.75, 0.9, 1.0, 1.25, 1.5, 1.75, 2.0];

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  surahNumber,
  currentAyahNumber,
  totalAyahsInSurah,
  activeReciter,
  isPlaying,
  onPlay,
  onPause,
  onNextAyah,
  onPrevAyah,
  onNextSurah,
  onPrevSurah,
  onClose,
  playbackMode,
  repeatMode,
  onSetRepeatMode,
  playbackRate,
  onSetPlaybackRate,
  onOpenReciterModal,
  audioRef,
  settings,
  onUpdateSettings,
  onOpenTTSModal,
  isTTSSpeaking,
  isFavoriteRecitation = false,
  onToggleFavoriteRecitation,
  onOpenFavoriteRecitationsModal
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Interactive Speed Popover & Controls
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  // Sleep Timer Popover & Controls
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // Word synchronization state
  const [chapterSegments, setChapterSegments] = useState<Record<number, [number, number, number][]> | null>(null);

  const speedMenuRef = useRef<HTMLDivElement | null>(null);
  const timerMenuRef = useRef<HTMLDivElement | null>(null);

  const surahMeta = SURAHS_LIST.find((s) => s.number === surahNumber);

  // Fetch word segments for current surah
  useEffect(() => {
    let isMounted = true;
    fetchChapterWordSegments(surahNumber, activeReciter.id).then((segs) => {
      if (isMounted && segs) setChapterSegments(segs);
    });
    return () => {
      isMounted = false;
    };
  }, [surahNumber, activeReciter.id]);

  // Compute active spoken word text for live display
  const currentWordText = React.useMemo(() => {
    if (!isPlaying || !currentAyahNumber || !chapterSegments || !chapterSegments[currentAyahNumber]) return null;
    const segs = chapterSegments[currentAyahNumber];
    const activeSeg = segs.find(([_, start, end]) => {
      const sSec = start / 1000;
      const eSec = end / 1000;
      return currentTime >= sSec && currentTime <= eSec;
    });
    if (!activeSeg) return null;
    return `الكلمة (${activeSeg[0]})`;
  }, [isPlaying, currentAyahNumber, chapterSegments, currentTime]);

  // Time & duration updater
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef]);

  // Sync playback rate with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, audioRef]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
      if (timerMenuRef.current && !timerMenuRef.current.contains(e.target as Node)) {
        setShowTimerMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sleep timer interval
  useEffect(() => {
    if (!sleepTimerMinutes) {
      setSleepTimerRemaining(null);
      return;
    }

    setSleepTimerRemaining(sleepTimerMinutes * 60);
    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          onPause();
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes, onPause]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  // Jump 5 seconds back / forward
  const handleSkipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(0, Math.min(duration || 100, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
    if (vol > 0 && isMuted) {
      audio.muted = false;
      setIsMuted(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const cycleRepeatMode = () => {
    if (repeatMode === 'off') onSetRepeatMode('repeat_ayah');
    else if (repeatMode === 'repeat_ayah') onSetRepeatMode('repeat_surah');
    else onSetRepeatMode('off');
  };

  const handleSelectSpeed = (rate: number) => {
    const rounded = Math.round(rate * 100) / 100;
    const clamped = Math.max(0.5, Math.min(2.0, rounded));
    onSetPlaybackRate(clamped);
    if (audioRef.current) {
      audioRef.current.playbackRate = clamped;
    }
  };

  const handleSpeedSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    handleSelectSpeed(rate);
  };

  const adjustSpeedDelta = (delta: number) => {
    const newRate = playbackRate + delta;
    handleSelectSpeed(newRate);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* 1. Main Floating Modern Audio Player Dock */}
      <div className="fixed bottom-[calc(3.75rem+max(0.25rem,env(safe-area-inset-bottom)))] md:bottom-4 left-0 right-0 z-40 max-w-4xl mx-auto px-2 sm:px-4 pointer-events-none transition-all duration-300">
        <div className="pointer-events-auto relative bg-[#090a12]/95 backdrop-blur-2xl text-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-indigo-500/35 shadow-2xl shadow-black/95 transition-all hover:border-indigo-500/55 ring-1 ring-white/10">
          
          {/* Subtle top animated ambient glow line */}
          {isPlaying ? (
            <div className="absolute -top-[1px] left-8 right-8 sm:left-12 sm:right-12 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" />
          ) : null}

          {/* Interactive Progress Seekbar with smooth gradient */}
          <div className="relative mb-2 sm:mb-3 group px-0.5 sm:px-1">
            <div className="relative h-1.5 sm:h-2 w-full bg-[#181a28] rounded-full overflow-hidden cursor-pointer">
              {/* Filled progress bar with vivid gradient */}
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400 rounded-full transition-all duration-75 relative"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Glowing Thumb on edge */}
                <span className="absolute -top-0.5 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg shadow-indigo-500/80 border border-indigo-400 transform translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <input
              id="audio-progress-slider"
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer z-20"
              title="التقديم والتأخير في التلاوة"
            />

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 px-0.5 mt-1 font-mono">
              <span className="text-indigo-300 font-bold">{formatTime(currentTime)}</span>
              <span className="text-slate-500">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1.5 sm:gap-4">
            
            {/* Left: Surah & Reciter Details + Live Waveform Visualizer */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              
              {/* Reciter Avatar / Icon with Waveform */}
              <div 
                onClick={onOpenReciterModal}
                className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#181828] via-[#10101e] to-[#0c0c16] border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg cursor-pointer hover:border-indigo-300 hover:scale-105 transition-all group"
                title="تغيير القارئ والتلاوة"
              >
                {isPlaying ? (
                  /* Animated EQ Soundwave Bars */
                  <div className="flex items-end gap-0.5 sm:gap-1 h-4 sm:h-5 px-0.5 sm:px-1">
                    <span className="w-0.5 sm:w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3 sm:h-4" />
                    <span className="w-0.5 sm:w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.1s] h-4 sm:h-5" />
                    <span className="w-0.5 sm:w-1 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.4s] h-2.5 sm:h-3.5" />
                    <span className="w-0.5 sm:w-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.2s] h-3.5 sm:h-4.5" />
                  </div>
                ) : (
                  <Headphones className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                )}
                {isPlaying && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#090a12] rounded-full animate-ping" />
                )}
              </div>

              {/* Title, Surah Name, Ayah Tag & Reciter */}
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setIsExpanded(true)} title="انقر لتكبير الاستوديو">
                <div className="flex items-center gap-1.5 truncate">
                  <h4 className="font-bold text-xs sm:text-base text-white truncate font-quran">
                    سورة {surahMeta?.name || ''}
                  </h4>
                  {currentAyahNumber && (
                    <span className="text-[9px] sm:text-[11px] font-mono px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg bg-indigo-500/25 border border-indigo-500/40 text-indigo-200 font-bold shrink-0">
                      {currentAyahNumber}
                    </span>
                  )}
                  {currentWordText && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold shrink-0 animate-fade-in">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span>{currentWordText}</span>
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 truncate font-sans mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50 shrink-0" />
                  <span className="font-medium text-slate-200 truncate">{activeReciter.arabicName}</span>
                </p>
              </div>

              {/* Quick Favorite Recitation Button (Dock) */}
              {onToggleFavoriteRecitation && (
                <button
                  id="audio-quick-favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavoriteRecitation();
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer shrink-0 border ${
                    isFavoriteRecitation
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30 shadow-xs'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-amber-300 hover:bg-white/10'
                  }`}
                  title={isFavoriteRecitation ? 'إزالة من التلاوات المختارة' : 'إضافة إلى تلاواتي المختارة'}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavoriteRecitation ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              )}

            </div>

            {/* Center: Modern Playback Controls (Jump 5s, Prev, Glowing Play/Pause, Next, Jump 5s) */}
            <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
              
              {/* Rewind 5 seconds */}
              <button
                onClick={() => handleSkipTime(-5)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-300 hover:bg-white/10 rounded-xl transition-all cursor-pointer hidden md:flex items-center justify-center border border-transparent hover:border-indigo-500/20"
                title="رجوع 5 ثوانٍ للخلف"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[9px] font-mono -mr-1 font-bold">5</span>
              </button>

              {/* Prev (Ayah or Surah) */}
              <button
                id="audio-prev-btn"
                onClick={playbackMode === 'ayah_by_ayah' ? onPrevAyah : onPrevSurah}
                className="p-1.5 sm:p-2.5 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl sm:rounded-2xl transition-all cursor-pointer active:scale-90 border border-white/5 hover:border-indigo-500/30"
                title={playbackMode === 'ayah_by_ayah' ? 'الآية السابقة' : 'السورة السابقة'}
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Central High-Impact Glowing Play / Pause Button */}
              <div className="relative group mx-0.5 sm:mx-1">
                {isPlaying && (
                  <div className="absolute -inset-1 sm:-inset-1.5 bg-indigo-500 rounded-2xl sm:rounded-3xl blur-md sm:blur-lg opacity-70 animate-pulse pointer-events-none" />
                )}
                <button
                  id="audio-play-pause-btn"
                  onClick={isPlaying ? onPause : onPlay}
                  className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center justify-center font-bold shadow-xl sm:shadow-2xl shadow-indigo-600/50 transition-all transform active:scale-90 cursor-pointer border border-indigo-300/40 ring-2 ring-indigo-500/30"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-6 sm:h-6 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-white translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Next (Ayah or Surah) */}
              <button
                id="audio-next-btn"
                onClick={playbackMode === 'ayah_by_ayah' ? onNextAyah : onNextSurah}
                className="p-1.5 sm:p-2.5 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl sm:rounded-2xl transition-all cursor-pointer active:scale-90 border border-white/5 hover:border-indigo-500/30"
                title={playbackMode === 'ayah_by_ayah' ? 'الآية التالية' : 'السورة التالية'}
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Forward 5 seconds */}
              <button
                onClick={() => handleSkipTime(5)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-300 hover:bg-white/10 rounded-xl transition-all cursor-pointer hidden md:flex items-center justify-center border border-transparent hover:border-indigo-500/20"
                title="تقديم 5 ثوانٍ للأمام"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-[9px] font-mono -ml-1 font-bold">5</span>
              </button>

            </div>

            {/* Right: Quick Tools (Interactive Speed Slider, Repeat, Timer, Volume, Expand, Close) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* 1. Interactive Playback Speed Popover with Slider (0.5x - 2.0x) */}
              <div className="relative" ref={speedMenuRef}>
                <button
                  id="audio-speed-btn"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border shadow-sm ${
                    playbackRate !== 1.0
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400 text-white shadow-indigo-600/40 ring-2 ring-indigo-400/30'
                      : 'bg-[#151624] border-[#292b42] text-slate-200 hover:text-white hover:bg-[#1f2136] hover:border-indigo-500/40'
                  }`}
                  title="التحكم التفاعلي في سرعة التلاوة (0.5x - 2.0x)"
                >
                  <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                  <span>{playbackRate.toFixed(playbackRate % 1 === 0 ? 1 : 2)}x</span>
                </button>

                {/* Modern Interactive Speed Control Drawer / Popover (Mobile-safe viewport centered) */}
                {showSpeedMenu && (
                  <div className="fixed sm:absolute bottom-28 sm:bottom-14 left-4 right-4 sm:left-auto sm:right-0 max-w-xs mx-auto sm:w-72 bg-[#0e0f1a] border border-indigo-500/40 rounded-3xl p-4 shadow-2xl z-50 animate-fade-in backdrop-blur-2xl ring-1 ring-white/10 space-y-3.5">
                    
                    {/* Header with live speed and reset */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                          <Gauge className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white">سرعة التلاوة</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-extrabold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-lg border border-indigo-500/40">
                          {playbackRate.toFixed(playbackRate % 1 === 0 ? 1 : 2)}x
                        </span>
                        {playbackRate !== 1.0 && (
                          <button
                            onClick={() => handleSelectSpeed(1.0)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                            title="إعادة ضبط السرعة إلى 1.0x"
                          >
                            <ResetIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Interactive Slider Bar (0.5x to 2.0x) */}
                    <div className="space-y-2 bg-[#141524] p-3 rounded-2xl border border-[#262840]">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => adjustSpeedDelta(-0.1)}
                          disabled={playbackRate <= 0.5}
                          className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center disabled:opacity-30 cursor-pointer transition-all active:scale-95"
                          title="إنقاص السرعة 0.1x"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex-1 px-1">
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.05"
                            value={playbackRate}
                            onChange={handleSpeedSliderChange}
                            className="w-full h-2.5 bg-[#252842] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>

                        <button
                          onClick={() => adjustSpeedDelta(0.1)}
                          disabled={playbackRate >= 2.0}
                          className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center disabled:opacity-30 cursor-pointer transition-all active:scale-95"
                          title="زيادة السرعة 0.1x"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
                        <span>0.5x (أبطأ)</span>
                        <span>1.0x (طبيعي)</span>
                        <span>2.0x (أسرع)</span>
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-slate-400 block text-right">خيارات سريعة:</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {SPEED_PRESETS.map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handleSelectSpeed(rate)}
                            className={`py-1.5 px-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                              playbackRate === rate
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400'
                                : 'bg-[#161726] border border-[#282a44] text-slate-300 hover:text-white hover:bg-[#202238]'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* 2. Repeat Mode Cycle Button */}
              <button
                id="audio-repeat-btn"
                onClick={cycleRepeatMode}
                className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer border shadow-sm ${
                  repeatMode !== 'off'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400 text-white shadow-indigo-600/40 ring-2 ring-indigo-400/30'
                    : 'bg-[#151624] border-[#292b42] text-slate-400 hover:text-white hover:bg-[#1f2136] hover:border-indigo-500/40'
                }`}
                title={
                  repeatMode === 'repeat_ayah'
                    ? 'تكرار الآية الحالية (نشط)'
                    : repeatMode === 'repeat_surah'
                    ? 'تكرار السورة كاملة (نشط)'
                    : 'تكرار متوقف'
                }
              >
                {repeatMode === 'repeat_ayah' ? (
                  <Repeat1 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-100" />
                ) : (
                  <Repeat className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${repeatMode === 'repeat_surah' ? 'text-indigo-100' : ''}`} />
                )}
              </button>

              {/* TTS Quick Access Button */}
              {onOpenTTSModal && (
                <button
                  id="audio-tts-btn"
                  onClick={onOpenTTSModal}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer border shadow-sm relative ${
                    settings?.ttsEnabled
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-emerald-600/40 ring-2 ring-emerald-400/30'
                      : 'bg-[#151624] border-[#292b42] text-slate-400 hover:text-white hover:bg-[#1f2136] hover:border-indigo-500/40'
                  }`}
                  title={
                    settings?.ttsEnabled
                      ? `الترجمة الصوتية مفعلة: ${getTTSLangConfig(settings.ttsLanguage || 'en').nameArabic}`
                      : 'الترجمة الصوتية الذكية (Text-to-Speech)'
                  }
                >
                  <Languages className="w-4 h-4" />
                  {isTTSSpeaking && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              )}

              {/* 3. Sleep Timer Popover Button */}
              <div className="relative hidden sm:block" ref={timerMenuRef}>
                <button
                  id="audio-timer-btn"
                  onClick={() => setShowTimerMenu(!showTimerMenu)}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1 border shadow-sm ${
                    sleepTimerMinutes
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400 text-white shadow-indigo-600/40 ring-2 ring-indigo-400/30'
                      : 'bg-[#151624] border-[#292b42] text-slate-400 hover:text-white hover:bg-[#1f2136] hover:border-indigo-500/40'
                  }`}
                  title={
                    sleepTimerMinutes 
                      ? `مؤقت النوم نشط: متبقي ${Math.ceil((sleepTimerRemaining || 0) / 60)} دقيقة` 
                      : 'ضبط مؤقت إيقاف التلاوة'
                  }
                >
                  <Clock className="w-4 h-4" />
                  {sleepTimerRemaining && (
                    <span className="text-[10px] font-mono font-bold text-indigo-100">{Math.ceil(sleepTimerRemaining / 60)}د</span>
                  )}
                </button>

                {showTimerMenu && (
                  <div className="absolute bottom-14 right-0 w-48 bg-[#0e0f1a] border border-indigo-500/40 rounded-3xl p-3 shadow-2xl z-50 animate-fade-in backdrop-blur-2xl ring-1 ring-white/10">
                    <div className="text-[11px] font-bold text-slate-300 px-2 py-1 border-b border-white/10 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>مؤقت إيقاف التلاوة</span>
                    </div>
                    <div className="space-y-1">
                      {[15, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => {
                            setSleepTimerMinutes(mins);
                            setShowTimerMenu(false);
                          }}
                          className={`w-full py-2 px-2.5 rounded-xl text-xs font-sans transition-colors cursor-pointer text-right flex items-center justify-between ${
                            sleepTimerMinutes === mins
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{mins} دقيقة</span>
                          <span className="font-mono text-[11px] opacity-70">{mins}m</span>
                        </button>
                      ))}
                      {sleepTimerMinutes && (
                        <button
                          onClick={() => {
                            setSleepTimerMinutes(null);
                            setShowTimerMenu(false);
                          }}
                          className="w-full py-1.5 px-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 text-right cursor-pointer mt-1"
                        >
                          إلغاء المؤقت
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Desktop Volume Control */}
              <div className="hidden lg:flex items-center gap-2 bg-[#151624] border border-[#292b42] px-2.5 py-1.5 rounded-2xl shadow-sm">
                <button
                  onClick={toggleMute}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer transition-colors"
                  title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 bg-[#282b42] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* 5. Expand Full Sheet View Button */}
              <button
                onClick={() => setIsExpanded(true)}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors cursor-pointer hidden md:flex border border-transparent hover:border-white/10"
                title="عرض استوديو التلاوة بكامل الشاشة"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* 6. Close Dock Button */}
              <button
                id="audio-close-btn"
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-red-500/30"
                title="إغلاق المشغل"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* 2. Full-Screen / Modal Audio Studio View (when expanded) */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c0c16] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col items-center text-center space-y-6 ring-1 ring-white/10">
            
            {/* Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                  استوديو التلاوة المتقدم
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Glowing Quran Emblem */}
            <div className="relative my-2">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-600/50 border-4 border-indigo-400/40">
                <Headphones className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-pulse" />
              </div>
              {isPlaying && (
                <div className="absolute -inset-4 rounded-full border border-indigo-500/30 animate-ping pointer-events-none" />
              )}
            </div>

            {/* Surah & Reciter Details */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-quran text-indigo-200">
                سورة {surahMeta?.name || ''}
              </h2>
              {currentAyahNumber && (
                <p className="text-sm font-mono text-indigo-400 font-bold">
                  الآية رقم {currentAyahNumber} من {totalAyahsInSurah}
                </p>
              )}
              <p className="text-sm text-slate-300 font-sans">
                بصوت القارئ: {activeReciter.arabicName}
              </p>
            </div>

            {/* Interactive Seek Bar */}
            <div className="w-full space-y-1.5">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2.5 bg-[#1f2136] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono px-1">
                <span className="text-indigo-400 font-bold">{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Central Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
              <button
                onClick={() => handleSkipTime(-5)}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer border border-white/5 transition-all"
                title="تأخير 5 ثوانٍ"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={playbackMode === 'ayah_by_ayah' ? onPrevAyah : onPrevSurah}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95 border border-white/10"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={isPlaying ? onPause : onPlay}
                className="w-16 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 cursor-pointer active:scale-95 border border-indigo-400/40"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white translate-x-0.5" />}
              </button>

              <button
                onClick={playbackMode === 'ayah_by_ayah' ? onNextAyah : onNextSurah}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95 border border-white/10"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleSkipTime(5)}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 cursor-pointer border border-white/5 transition-all"
                title="تقديم 5 ثوانٍ"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Speed Slider in Modal View */}
            <div className="w-full pt-4 border-t border-white/10 space-y-3 bg-[#131424] p-4 rounded-2xl border border-[#262840]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  التحكم في سرعة التلاوة:
                </span>
                <span className="font-mono text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                  {playbackRate.toFixed(playbackRate % 1 === 0 ? 1 : 2)}x
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={playbackRate}
                onChange={handleSpeedSliderChange}
                className="w-full h-2.5 bg-[#252844] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {SPEED_PRESETS.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleSelectSpeed(rate)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                      playbackRate === rate
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* TTS Status & Quick Configuration Card in Modal */}
            {onOpenTTSModal && (
              <div className="w-full bg-[#131424] p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between gap-3 text-right">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">الترجمة الصوتية (TTS)</span>
                      {settings?.ttsEnabled ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          مفعلة
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          متوقفة
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {settings?.ttsEnabled
                        ? `${getTTSLangConfig(settings?.ttsLanguage || 'en').flag} ${getTTSLangConfig(settings?.ttsLanguage || 'en').nameArabic} • ${
                            settings?.ttsSyncMode === 'consecutive'
                              ? 'التلاوة ثم الترجمة'
                              : settings?.ttsSyncMode === 'simultaneous'
                              ? 'متزامن بالتوازي'
                              : 'الترجمة فقط'
                          }`
                        : 'انقر لتخصيص لغة الترجمة ونمط النطق المتزامن'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenTTSModal}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  إعدادات
                </button>
              </div>
            )}

            {/* Favorite Recitation Card in Expanded Modal */}
            <div className="w-full bg-[#131424] p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3 text-right">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${isFavoriteRecitation ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                  <Heart className={`w-4 h-4 ${isFavoriteRecitation ? 'fill-amber-400' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">التلاوات المختارة</span>
                    {isFavoriteRecitation && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        محفوظة بالمفضلة
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isFavoriteRecitation
                      ? 'هذه السورة محفوظة في قائمتك الخاصة مع هذا القارئ'
                      : 'احفظ هذه السورة مع الشيخ في تلاواتك المفضلة'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {onToggleFavoriteRecitation && (
                  <button
                    onClick={onToggleFavoriteRecitation}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFavoriteRecitation
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    {isFavoriteRecitation ? 'إزالة' : 'حفظ'}
                  </button>
                )}

                {onOpenFavoriteRecitationsModal && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      onOpenFavoriteRecitationsModal();
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="فتح قائمة التلاوات المختارة"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
