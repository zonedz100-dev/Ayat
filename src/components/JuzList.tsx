import React, { useState } from 'react';
import { Layers, BookOpen, ChevronLeft, ArrowRight, Play } from 'lucide-react';
import { JUZ_LIST } from '../data/quranData';

interface JuzListProps {
  onSelectSurah: (surahNumber: number, initialAyah?: number) => void;
}

export const JuzList: React.FC<JuzListProps> = ({ onSelectSurah }) => {
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0c0c0c] border border-indigo-500/20 text-white p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-geometric-grid pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>تقسيم القرآن الكريم • ثلاثون جزءاً</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">أجزاء القرآن الكريم</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            تصفح القرآن الكريم مقسماً حسب الأجزاء والأحزاب لتسهيل القراءة اليومية ومتابعة خطط الختمة المباركة.
          </p>
        </div>
      </div>

      {/* Juz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {JUZ_LIST.map((juz) => (
          <div
            key={juz.juzNumber}
            id={`juz-card-${juz.juzNumber}`}
            className="bg-[#0c0c0c] rounded-2xl p-5 border border-[#1a1a1a] hover:border-indigo-500/40 transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#222] text-indigo-400 flex items-center justify-center font-bold text-sm font-mono">
                    {juz.juzNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100">
                      {juz.arabicName}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      يبدأ من صـ {juz.pageStart}
                    </span>
                  </div>
                </div>
              </div>

              {/* Opening Ayah Snippet in Calligraphy */}
              <div className="bg-[#111] rounded-xl p-3.5 mb-4 border border-[#222]">
                <p className="text-xs text-slate-500 mb-1">بداية الجزء:</p>
                <p className="font-quran text-base text-indigo-200 leading-relaxed font-bold">
                  « {juz.startAyahText} »
                </p>
              </div>

              {/* Bounds details */}
              <div className="text-xs text-slate-400 space-y-1.5 mb-4 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">من:</span>
                  <span className="font-bold text-slate-200">
                    سورة {juz.startSurahName} (الآية {juz.startAyahNumber})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">إلى:</span>
                  <span className="font-bold text-slate-200">
                    سورة {juz.endSurahName} (الآية {juz.endAyahNumber})
                  </span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              id={`open-juz-${juz.juzNumber}`}
              onClick={() => onSelectSurah(juz.startSurahNumber, juz.startAyahNumber)}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>قراءة الجزء {juz.juzNumber}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
