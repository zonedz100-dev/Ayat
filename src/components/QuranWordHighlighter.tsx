import React, { useMemo } from 'react';
import { QuranWord, getAyahWordsWithTiming, getActiveWordIndex } from '../utils/audioSync';

interface QuranWordHighlighterProps {
  ayahText: string;
  ayahNumberInSurah: number;
  surahNumber: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  segments?: [number, number, number][];
  highlightEnabled?: boolean;
  theme?: 'emerald' | 'dark' | 'gold' | 'night' | 'deep';
  fontFamilyClass?: string;
  fontSize?: number;
  onWordClick?: (startTime: number) => void;
  showAyahNumberBadge?: boolean;
  className?: string;
}

export const QuranWordHighlighter: React.FC<QuranWordHighlighterProps> = ({
  ayahText,
  ayahNumberInSurah,
  isPlaying,
  currentTime,
  duration,
  segments,
  highlightEnabled = true,
  theme = 'emerald',
  fontFamilyClass = 'font-quran',
  fontSize,
  onWordClick,
  showAyahNumberBadge = false,
  className = ''
}) => {
  // Generate word segments with timing
  const words: QuranWord[] = useMemo(() => {
    return getAyahWordsWithTiming(ayahText, duration, segments);
  }, [ayahText, duration, segments]);

  // Determine active word index during playback
  const activeWordIdx = useMemo(() => {
    if (!isPlaying || !highlightEnabled) return -1;
    return getActiveWordIndex(words, currentTime, duration);
  }, [isPlaying, highlightEnabled, words, currentTime, duration]);

  // Highlight color classes according to ambient theme
  const getHighlightClasses = () => {
    switch (theme) {
      case 'emerald':
        return 'bg-emerald-400/25 text-emerald-200 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/25 font-bold scale-[1.08]';
      case 'gold':
        return 'bg-amber-400/30 text-amber-200 ring-2 ring-amber-400/70 shadow-lg shadow-amber-500/30 font-bold scale-[1.08]';
      case 'night':
      case 'deep':
      case 'dark':
      default:
        return 'bg-amber-400/25 text-amber-300 ring-2 ring-amber-400/60 shadow-lg shadow-amber-500/20 font-bold scale-[1.08]';
    }
  };

  return (
    <span
      className={`${fontFamilyClass} ${className} inline leading-[2.6] sm:leading-[2.8] tracking-wide`}
      style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
    >
      {words.map((w) => {
        const isWordActive = isPlaying && highlightEnabled && w.index === activeWordIdx;
        return (
          <span
            key={w.index}
            onClick={(e) => {
              if (onWordClick) {
                e.stopPropagation();
                onWordClick(w.startTime);
              }
            }}
            title={isPlaying ? `الكلمة: ${w.text} (انقر للاستماع من هنا)` : undefined}
            className={`inline-block px-1 py-0.5 mx-0.5 rounded-lg transition-all duration-150 select-text ${
              isWordActive
                ? `${getHighlightClasses()} z-10 relative`
                : 'text-slate-100 hover:text-amber-200 hover:bg-white/5 cursor-pointer'
            }`}
          >
            {w.text}
          </span>
        );
      })}

      {/* Optional End-of-Ayah Badge */}
      {showAyahNumberBadge && (
        <span className="inline-flex items-center justify-center w-8 h-8 mx-1.5 text-xs font-bold rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 select-none align-middle font-mono shadow-xs">
          {ayahNumberInSurah}
        </span>
      )}
    </span>
  );
};
