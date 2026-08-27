import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Headphones, 
  Play, 
  Pause, 
  BookOpen, 
  Trash2, 
  Plus, 
  Search, 
  Tag, 
  Share2, 
  Check, 
  Heart, 
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { FavoriteRecitation, Reciter, SurahMeta } from '../types';
import { SURAHS_LIST, RECITERS_LIST } from '../data/quranData';
import { CURATED_RECOMMENDED_RECITATIONS } from '../utils/favoriteRecitations';

interface FavoriteRecitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteRecitation[];
  onToggleFavorite: (surah: SurahMeta, reciter: Reciter, tags?: string[], notes?: string) => void;
  onPlayRecitation: (surahNumber: number, reciter: Reciter) => void;
  onReadSurah: (surahNumber: number, reciter?: Reciter) => void;
  activeReciter: Reciter;
  playingSurahNumber: number | null;
  isPlayingAudio: boolean;
}

const COMMON_TAGS = [
  'الكل',
  'خاشعة',
  'يوم الجمعة',
  'تراويح',
  'فجر',
  'تحصين وبركة',
  'أذكار النوم',
  'تجويد بديع'
];

export const FavoriteRecitationsModal: React.FC<FavoriteRecitationsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onPlayRecitation,
  onReadSurah,
  activeReciter,
  playingSurahNumber,
  isPlayingAudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('الكل');
  const [selectedReciterFilter, setSelectedReciterFilter] = useState<string>('all');
  
  // Custom Add Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSurahNumber, setNewSurahNumber] = useState<number>(1);
  const [newReciterId, setNewReciterId] = useState<string>(activeReciter.id);
  const [newTag, setNewTag] = useState<string>('خاشعة');
  const [newNote, setNewNote] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered Favorites list
  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      // Search
      const matchesSearch = 
        !searchQuery.trim() ||
        item.surahName.includes(searchQuery.trim()) ||
        item.surahArabicName.includes(searchQuery.trim()) ||
        item.reciterArabicName.includes(searchQuery.trim()) ||
        (item.notes && item.notes.includes(searchQuery.trim())) ||
        (item.tags && item.tags.some(t => t.includes(searchQuery.trim())));

      // Tag filter
      const matchesTag = 
        selectedTag === 'الكل' || 
        (item.tags && item.tags.includes(selectedTag));

      // Reciter filter
      const matchesReciter = 
        selectedReciterFilter === 'all' || 
        item.reciterId === selectedReciterFilter;

      return matchesSearch && matchesTag && matchesReciter;
    });
  }, [favorites, searchQuery, selectedTag, selectedReciterFilter]);

  // Recommended recitations not yet in favorites
  const recommendedUnadded = useMemo(() => {
    return CURATED_RECOMMENDED_RECITATIONS.filter(
      (rec) => !favorites.some((f) => f.surahNumber === rec.surahNumber && f.reciterId === rec.reciterId)
    );
  }, [favorites]);

  if (!isOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const surahMeta = SURAHS_LIST.find((s) => s.number === newSurahNumber);
    const reciterMeta = RECITERS_LIST.find((r) => r.id === newReciterId);
    if (surahMeta && reciterMeta) {
      onToggleFavorite(surahMeta, reciterMeta, [newTag], newNote);
      setShowAddForm(false);
      setNewNote('');
    }
  };

  const handleShare = (item: FavoriteRecitation) => {
    const text = `استمع إلى تلاوة مباركة لسورة ${item.surahName} بصوت الشيخ ${item.reciterArabicName}\nعبر تطبيق آيات للقرآن الكريم\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: `تلاوة سورة ${item.surahName} - ${item.reciterArabicName}`,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0b0c14] border border-indigo-500/30 rounded-3xl shadow-2xl shadow-black text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#1b1d2e] bg-[#0e101b]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-indigo-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  تلاوات مختارة
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {favorites.length} تلاوة
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                قائمتك المفضلة للسور بأصوات القراء للوصول السريع والاستماع الخاشع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-add-recitation-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                showAddForm
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                  : 'bg-[#151726] border-[#25283f] text-slate-200 hover:text-white hover:bg-[#1d2036]'
              }`}
            >
              <Plus className={`w-4 h-4 transition-transform ${showAddForm ? 'rotate-45' : ''}`} />
              <span className="hidden sm:inline">إضافة تلاوة</span>
            </button>

            <button
              id="close-favorite-recitations-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* Add New Custom Recitation Accordion / Form */}
          {showAddForm && (
            <form 
              onSubmit={handleAddNew}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#141624] to-[#0f101b] border border-indigo-500/30 space-y-4 animate-fade-in shadow-xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-indigo-400" />
                  حفظ تلاوة جديدة في المفضلة
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  إلغاء
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Select Surah */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    اختر السورة:
                  </label>
                  <select
                    id="new-favorite-surah-select"
                    value={newSurahNumber}
                    onChange={(e) => setNewSurahNumber(Number(e.target.value))}
                    className="w-full bg-[#1c1f33] border border-[#2e3250] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-400 cursor-pointer"
                  >
                    {SURAHS_LIST.map((s) => (
                      <option key={s.number} value={s.number}>
                        {s.number}. سورة {s.name} ({s.numberOfAyahs} آية)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Reciter */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    اختر القارئ:
                  </label>
                  <select
                    id="new-favorite-reciter-select"
                    value={newReciterId}
                    onChange={(e) => setNewReciterId(e.target.value)}
                    className="w-full bg-[#1c1f33] border border-[#2e3250] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-400 cursor-pointer"
                  >
                    {RECITERS_LIST.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.arabicName} ({r.style})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    التصنيف / المناسبة:
                  </label>
                  <select
                    id="new-favorite-tag-select"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-[#1c1f33] border border-[#2e3250] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-400 cursor-pointer"
                  >
                    {COMMON_TAGS.filter(t => t !== 'الكل').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Note */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    ملاحظة خاصة (اختياري):
                  </label>
                  <input
                    type="text"
                    id="new-favorite-note-input"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="مثلاً: قراءة الفجر، هدوء وسكينة..."
                    className="w-full bg-[#1c1f33] border border-[#2e3250] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  id="submit-add-favorite-recitation"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ في المفضلة</span>
                </button>
              </div>
            </form>
          )}

          {/* Search Bar & Tag Filter Pills */}
          <div className="space-y-3">
            
            <div className="flex flex-col sm:flex-row gap-2.5">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="search-favorites-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم السورة، القارئ، أو التصنيف..."
                  className="w-full bg-[#141624] border border-[#25283f] rounded-2xl pr-9 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Reciter Filter Dropdown */}
              <div className="sm:w-48">
                <select
                  id="reciter-filter-select"
                  value={selectedReciterFilter}
                  onChange={(e) => setSelectedReciterFilter(e.target.value)}
                  className="w-full bg-[#141624] border border-[#25283f] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-indigo-400 cursor-pointer"
                >
                  <option value="all">جميع القراء</option>
                  {RECITERS_LIST.map((r) => (
                    <option key={r.id} value={r.id}>{r.arabicName}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Tags Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  id={`tag-filter-${tag}`}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                    selectedTag === tag
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs font-bold'
                      : 'bg-[#121422] border-[#222538] text-slate-400 hover:text-white hover:bg-[#181a2c]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Favorites List Cards */}
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredFavorites.map((item) => {
                const isPlayingThis = 
                  isPlayingAudio && 
                  playingSurahNumber === item.surahNumber && 
                  activeReciter.id === item.reciterId;
                
                const surahMeta = SURAHS_LIST.find((s) => s.number === item.surahNumber);
                const reciterMeta = RECITERS_LIST.find((r) => r.id === item.reciterId) || activeReciter;

                return (
                  <div
                    key={item.id}
                    id={`favorite-recitation-card-${item.id}`}
                    className={`relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between group ${
                      isPlayingThis
                        ? 'bg-gradient-to-br from-indigo-950/40 via-[#101222] to-amber-950/20 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                        : 'bg-[#101220] border-[#212438] hover:border-indigo-500/40 hover:bg-[#131528]'
                    }`}
                  >
                    
                    {/* Top Row: Surah & Reciter Details */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#181a2c] to-[#0e101c] border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0 font-mono shadow-inner group-hover:border-indigo-400 transition-colors">
                          {item.surahNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white font-quran">
                              سورة {item.surahName}
                            </h3>
                            {isPlayingThis && (
                              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                قيد التشغيل
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-amber-300/90 font-medium flex items-center gap-1 mt-0.5">
                            <Headphones className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>الشيخ {item.reciterArabicName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={() => {
                          if (surahMeta && reciterMeta) {
                            onToggleFavorite(surahMeta, reciterMeta);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                        title="إزالة من التلاوات المختارة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                    {/* Middle: Notes & Tags */}
                    {(item.notes || (item.tags && item.tags.length > 0)) && (
                      <div className="mb-3 space-y-1.5 bg-[#0a0b12] p-2.5 rounded-xl border border-[#1c1e30]">
                        {item.notes && (
                          <p className="text-xs text-slate-300 italic leading-relaxed">
                            « {item.notes} »
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((t, idx) => (
                              <span
                                key={idx}
                                onClick={() => setSelectedTag(t)}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.2 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 cursor-pointer hover:bg-indigo-500/25"
                              >
                                <Tag className="w-2.5 h-2.5 text-indigo-400" />
                                <span>{t}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#1e2136] gap-2">
                      
                      {/* Play Button */}
                      <button
                        id={`play-favorite-${item.id}`}
                        onClick={() => onPlayRecitation(item.surahNumber, reciterMeta)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isPlayingThis
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400'
                            : 'bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30'
                        }`}
                      >
                        {isPlayingThis ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-white" />
                            <span>إيقاف مؤقت</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-indigo-300 hover:fill-white translate-x-0.5" />
                            <span>استماع الآن</span>
                          </>
                        )}
                      </button>

                      {/* Read in Mushaf */}
                      <button
                        id={`read-favorite-${item.id}`}
                        onClick={() => {
                          onReadSurah(item.surahNumber, reciterMeta);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-medium bg-[#16182a] hover:bg-[#20233c] text-slate-300 hover:text-white border border-[#292c46] cursor-pointer transition-colors"
                        title="فتح السورة في القارئ"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden xs:inline">قراءة</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(item)}
                        className="p-2 rounded-xl bg-[#16182a] hover:bg-[#20233c] text-slate-400 hover:text-indigo-300 border border-[#292c46] cursor-pointer transition-colors"
                        title="مشاركة التلاوة"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#101220] rounded-3xl border border-[#212438] p-6">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-bold text-slate-200 mb-1">
                {searchQuery || selectedTag !== 'الكل' ? 'لا توجد نتائج مطابقة لخيارات البحث' : 'لم تقم بحفظ أي تلاوات بعد'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                اختر سورة وقارئ من القائمة أدناه أو انقر على زر "إضافة تلاوة" لحفظ تلاواتك المفضلة هنا.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('الكل');
                  setSelectedReciterFilter('all');
                  setShowAddForm(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                إضافة أول تلاوة مختارة
              </button>
            </div>
          )}

          {/* Recommended Curated Recitations Section */}
          {recommendedUnadded.length > 0 && (
            <div className="pt-4 border-t border-[#1b1d2e] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  تلاوات مباركة مقترحة للتدبر (إضافة سريعة)
                </span>
                <span className="text-[11px] text-slate-500">
                  {recommendedUnadded.length} مقترحات
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recommendedUnadded.map((rec, idx) => {
                  const surahMeta = SURAHS_LIST.find((s) => s.number === rec.surahNumber);
                  const reciterMeta = RECITERS_LIST.find((r) => r.id === rec.reciterId);
                  
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#0e101c] border border-[#1f2237] hover:border-indigo-500/30 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-white truncate font-quran">
                            سورة {rec.surahName}
                          </h4>
                          {rec.tags && rec.tags[0] && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/25">
                              {rec.tags[0]}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {rec.reciterArabicName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            if (surahMeta && reciterMeta) {
                              onPlayRecitation(rec.surahNumber, reciterMeta);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 cursor-pointer transition-colors"
                          title="استماع سريع"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => {
                            if (surahMeta && reciterMeta) {
                              onToggleFavorite(surahMeta, reciterMeta, rec.tags, rec.notes);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                          title="إضافة إلى تلاواتي المفضلة"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>حفظ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#080910] border-t border-[#1a1c2d] flex items-center justify-between text-[11px] text-slate-500 px-4">
          <span>✨ انقر على زر الاستماع للتشغيل المباشر أو القراءة لفتح المصحف</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
