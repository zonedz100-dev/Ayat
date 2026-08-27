import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { SURAHS_LIST } from '../data/quranData';
import { normalizeArabic } from '../utils/quranApi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (surahNumber: number, ayahNumber?: number) => void;
}

interface SearchAyahResult {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [matchingSurahs, setMatchingSurahs] = useState<typeof SURAHS_LIST>([]);
  const [matchingAyahs, setMatchingAyahs] = useState<SearchAyahResult[]>([]);
  const [isSearchingAyahs, setIsSearchingAyahs] = useState(false);
  const [activeTab, setActiveTab] = useState<'surahs' | 'ayahs'>('surahs');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setMatchingSurahs([]);
      setMatchingAyahs([]);
    }
  }, [isOpen]);

  // Local & Remote Search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMatchingSurahs([]);
      setMatchingAyahs([]);
      return;
    }

    const norm = normalizeArabic(trimmed);

    // 1. Search in Surahs
    const foundSurahs = SURAHS_LIST.filter((s) => {
      const sNorm = normalizeArabic(s.name);
      const sArab = normalizeArabic(s.arabicName);
      const sEng = s.englishName.toLowerCase();
      const sNum = String(s.number);
      return sNorm.includes(norm) || sArab.includes(norm) || sEng.includes(trimmed.toLowerCase()) || sNum === trimmed;
    });
    setMatchingSurahs(foundSurahs);

    // 2. Search in Ayahs via Quran Search API if query length >= 3
    if (trimmed.length >= 3) {
      setIsSearchingAyahs(true);
      const timer = setTimeout(async () => {
        try {
          // Search in Quran Cloud API
          const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(trimmed)}/all/quran-simple-clean`);
          if (res.ok) {
            const data = await res.json();
            if (data.data && data.data.matches) {
              const results: SearchAyahResult[] = data.data.matches.slice(0, 40).map((m: any) => ({
                surahNumber: m.surah.number,
                surahName: m.surah.name,
                ayahNumber: m.numberInSurah,
                text: m.text
              }));
              setMatchingAyahs(results);
            }
          }
        } catch (e) {
          console.warn('Ayah search API fallback:', e);
        } finally {
          setIsSearchingAyahs(false);
        }
      }, 350);

      return () => clearTimeout(timer);
    } else {
      setMatchingAyahs([]);
      setIsSearchingAyahs(false);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c0c0c] rounded-2xl w-full max-w-2xl overflow-hidden border border-indigo-500/25 shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center gap-3 bg-[#111]">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="quran-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في أسماء السور أو نص الآيات الكريمة..."
            className="flex-1 bg-transparent text-sm sm:text-base font-sans text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1a1a1a] cursor-pointer transition-colors"
          >
            إلغاء
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0e0e0e] border-b border-[#1a1a1a] text-xs font-medium">
          <button
            onClick={() => setActiveTab('surahs')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'surahs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            السور ({matchingSurahs.length})
          </button>
          <button
            onClick={() => setActiveTab('ayahs')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ayahs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>الآيات ({matchingAyahs.length})</span>
            {isSearchingAyahs && <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />}
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {!query.trim() ? (
            <div className="text-center py-12 text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-400/60" />
              <p className="text-xs">اكتب كلمة، اسم سورة، أو رقم الآية للبحث الفوري</p>
            </div>
          ) : activeTab === 'surahs' ? (
            matchingSurahs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                لم يتم العثور على سورة بهذا الاسم
              </div>
            ) : (
              <div className="space-y-1.5">
                {matchingSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => {
                      onSelectResult(surah.number);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-[#1f1f1f] bg-[#111] hover:border-indigo-500/30 hover:bg-[#141414] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#181818] border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium font-mono">
                        {surah.number}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          سورة {surah.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية • صفحة {surah.pageStart}
                        </p>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            )
          ) : (
            isSearchingAyahs ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <p className="text-xs">جاري البحث في آيات القرآن الكريم...</p>
              </div>
            ) : matchingAyahs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                لم يتم العثور على آيات مطابقة لكلمة البحث
              </div>
            ) : (
              <div className="space-y-2">
                {matchingAyahs.map((result, idx) => (
                  <div
                    key={`${result.surahNumber}-${result.ayahNumber}-${idx}`}
                    onClick={() => {
                      onSelectResult(result.surahNumber, result.ayahNumber);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border border-[#1f1f1f] bg-[#111] hover:border-indigo-500/30 hover:bg-[#141414] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs text-indigo-400 font-medium mb-1.5">
                      <span>سورة {result.surahName} [الآية {result.ayahNumber}]</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                    <p className="font-quran text-base text-slate-100 leading-loose text-right">
                      {result.text}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};
