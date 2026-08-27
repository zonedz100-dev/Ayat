import React, { useState } from 'react';
import { Palette, Image as ImageIcon, Sparkles, Check, Eye, Sliders, SunMedium } from 'lucide-react';
import { ReadingSettings } from '../types';
import { READER_BACKGROUNDS, ReaderBackground, ReaderBackgroundType, getReaderBackground } from '../data/readerBackgrounds';

interface ReaderBackgroundSelectorProps {
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
  compact?: boolean;
}

export const ReaderBackgroundSelector: React.FC<ReaderBackgroundSelectorProps> = ({
  settings,
  onUpdateSettings,
  compact = false
}) => {
  const currentBg = getReaderBackground(settings.readerBackgroundId);
  const [activeTab, setActiveTab] = useState<ReaderBackgroundType>(
    (settings.readerBackgroundType as ReaderBackgroundType) || currentBg.type || 'solid'
  );

  const filteredBackgrounds = READER_BACKGROUNDS.filter((bg) => bg.type === activeTab);

  const handleSelectBackground = (bg: ReaderBackground) => {
    onUpdateSettings({
      readerBackgroundId: bg.id,
      readerBackgroundType: bg.type
    });
  };

  return (
    <div className="space-y-4" dir="rtl">
      
      {/* Type Selector Tabs */}
      <div className="flex items-center p-1 bg-[#111] rounded-xl border border-[#222]">
        <button
          type="button"
          onClick={() => setActiveTab('solid')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'solid'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>خلفيات ثابتة</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gradient')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'gradient'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>تدرجات لونية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nature')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'nature'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>صور طبيعية</span>
        </button>
      </div>

      {/* Background Items Grid */}
      <div className={`grid gap-2.5 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3'}`}>
        {filteredBackgrounds.map((bg) => {
          const isSelected = (settings.readerBackgroundId || 'solid_default') === bg.id;

          return (
            <button
              key={bg.id}
              type="button"
              onClick={() => handleSelectBackground(bg)}
              className={`group relative overflow-hidden rounded-xl border text-right transition-all cursor-pointer p-2.5 flex flex-col justify-between h-24 ${
                isSelected
                  ? 'border-indigo-400 ring-2 ring-indigo-500/50 shadow-lg scale-[1.02]'
                  : 'border-[#222] hover:border-slate-600 bg-[#141414]'
              }`}
            >
              {/* Visual Thumbnail */}
              <div 
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  ...bg.previewStyle,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              {/* Shading layer inside thumb for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Selected Badge */}
              <div className="relative z-10 flex justify-between items-start w-full">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/60 text-slate-300 backdrop-blur-xs border border-white/10">
                  {bg.type === 'solid' ? 'لون' : bg.type === 'gradient' ? 'تدرج' : 'طبيعة'}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title label */}
              <div className="relative z-10">
                <p className="text-xs font-bold text-white drop-shadow-md truncate">
                  {bg.arabicName}
                </p>
                <p className="text-[10px] text-slate-300 drop-shadow-sm font-sans truncate">
                  {bg.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced Fine-Tuning Controls for Nature & Gradient (Overlay Darkness & Blur) */}
      {activeTab === 'nature' && (
        <div className="p-3.5 bg-[#121212] rounded-xl border border-[#222] space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>مستوى تظليل الصورة للقراءة المريحة</span>
            </div>
            <span className="text-indigo-400 font-mono font-bold">
              {settings.readerBackgroundOverlay ?? 60}%
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="90"
            step="5"
            value={settings.readerBackgroundOverlay ?? 60}
            onChange={(e) => onUpdateSettings({ readerBackgroundOverlay: Number(e.target.value) })}
            className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#1e1e1e]">
            <div className="text-xs text-slate-300">
              <span>تأثير غشاوة هادئة على الصورة (Blur)</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ readerWallpaperBlur: !settings.readerWallpaperBlur })}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                settings.readerWallpaperBlur
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-[#181818] border-[#2a2a2a] text-slate-400 hover:text-white'
              }`}
            >
              {settings.readerWallpaperBlur ? 'مفعل' : 'معطل'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
