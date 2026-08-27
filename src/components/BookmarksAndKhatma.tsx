import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ChevronLeft, 
  Calendar, 
  Target, 
  Award, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  BookOpen,
  Share2,
  Headphones,
  Play,
  Pause,
  Tag,
  Heart
} from 'lucide-react';
import { Bookmark as BookmarkType, KhatmaPlan, FavoriteRecitation, Reciter, SurahMeta } from '../types';
import { SURAHS_LIST, RECITERS_LIST } from '../data/quranData';
import { SmartKhatmaPlanner } from './SmartKhatmaPlanner';

interface BookmarksAndKhatmaProps {
  bookmarks: BookmarkType[];
  onRemoveBookmark: (id: string) => void;
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  khatma: KhatmaPlan;
  onUpdateKhatma: (khatma: KhatmaPlan) => void;
  favoriteRecitations?: FavoriteRecitation[];
  onPlayFavoriteRecitation?: (surahNumber: number, reciter: Reciter) => void;
  onToggleFavoriteRecitation?: (surah: SurahMeta, reciter: Reciter) => void;
  onOpenFavoriteRecitationsModal?: () => void;
  activeReciter?: Reciter;
  playingSurahNumber?: number | null;
  isPlayingAudio?: boolean;
  onReadSurah?: (surahNumber: number, initialAyah?: number) => void;
  onOpenKhatmDua?: () => void;
}

export const BookmarksAndKhatma: React.FC<BookmarksAndKhatmaProps> = ({
  bookmarks,
  onRemoveBookmark,
  onSelectBookmark,
  khatma,
  onUpdateKhatma,
  favoriteRecitations = [],
  onPlayFavoriteRecitation,
  onToggleFavoriteRecitation,
  onOpenFavoriteRecitationsModal,
  activeReciter,
  playingSurahNumber,
  isPlayingAudio = false,
  onReadSurah,
  onOpenKhatmDua
}) => {
  const [activeTab, setActiveTab] = useState<'khatma' | 'bookmarks' | 'recitations'>('khatma');

  const totalPages = 604;
  const completedCount = (khatma.completedPages || []).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalPages) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0c0c0c] border border-indigo-500/20 text-white p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-geometric-grid pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>متابعة التلاوة والتدبر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">مخطط الختمات والعلامات المرجعية</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            أنشئ خطة ذكية ومخصصة لختم القرآن الكريم مع جدول زمني دقيق وتوزيع للأوراد وتذكيرات يومية عبر الإشعارات.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1a1a1a] pb-2 overflow-x-auto no-scrollbar">
        <button
          id="tab-khatma-btn"
          onClick={() => setActiveTab('khatma')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === 'khatma'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'text-slate-400 hover:text-white bg-[#111] border border-[#222]'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>مخطط الختمة الذكي ({progressPercent}%)</span>
        </button>

        <button
          id="tab-recitations-btn"
          onClick={() => setActiveTab('recitations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === 'recitations'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
              : 'text-slate-400 hover:text-white bg-[#111] border border-[#222]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>تلاوات مختارة ({favoriteRecitations.length})</span>
        </button>

        <button
          id="tab-bookmarks-btn"
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === 'bookmarks'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white bg-[#111] border border-[#222]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>العلامات المرجعية ({bookmarks.length})</span>
        </button>
      </div>

      {/* Tab 1: Smart Khatma Planner */}
      {activeTab === 'khatma' && (
        <SmartKhatmaPlanner
          khatma={khatma}
          onUpdateKhatma={onUpdateKhatma}
          onReadSurah={onReadSurah}
          onOpenKhatmDua={onOpenKhatmDua}
        />
      )}

      {/* Tab 2: Bookmarks List */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4 animate-fade-in">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-[#0c0c0c] rounded-3xl border border-[#1a1a1a] p-8">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300 mb-1">
                لا توجد علامات مرجعية محفوظة بعد
              </h3>
              <p className="text-xs text-slate-500">
                انقر على أيقونة الإشارة المرجعية بجانب أي آية أثناء القراءة لحفظها هنا والعودة إليها لاحقاً.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  id={`bookmark-item-${b.id}`}
                  className="bg-[#0c0c0c] rounded-2xl p-5 border border-[#1a1a1a] hover:border-indigo-500/40 transition-all shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#111] border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono">
                        <Bookmark className="w-3.5 h-3.5 fill-indigo-400" />
                      </span>
                      <h4 className="font-bold text-sm text-white">
                        سورة {b.surahName} • الآية {b.ayahNumber}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const text = `﴿ ${b.ayahText} ﴾ [سورة ${b.surahName}: الآية ${b.ayahNumber}]\nمُشارَك عبر تطبيق آيات للقرآن الكريم\n${window.location.href}`;
                          if (navigator.share) {
                            navigator.share({
                              title: `سورة ${b.surahName} - آية ${b.ayahNumber}`,
                              text: text,
                              url: window.location.href
                            }).catch(() => {});
                          } else {
                            navigator.clipboard.writeText(text);
                            alert('تم نسخ نص الآية للمشاركة!');
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-950/30 cursor-pointer transition-colors"
                        title="مشاركة الآية"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRemoveBookmark(b.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 cursor-pointer transition-colors"
                        title="حذف الإشارة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="font-quran text-base text-slate-100 leading-loose text-right">
                    « {b.ayahText} »
                  </p>

                  <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{new Date(b.timestamp).toLocaleDateString('ar-EG')}</span>
                    <button
                      onClick={() => onSelectBookmark(b.surahNumber, b.ayahNumber)}
                      className="inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                    >
                      <span>الانتقال لموضع الآية</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Favorite Recitations List */}
      {activeTab === 'recitations' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>قائمتك المفضلة للتلاوات</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {favoriteRecitations.length} تلاوة
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تلاوات مخصصة بأصوات الشيوخ للتشغيل الفوري والتدبر
              </p>
            </div>

            {onOpenFavoriteRecitationsModal && (
              <button
                onClick={onOpenFavoriteRecitationsModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>إدارة التلاوات والمقترحات</span>
              </button>
            )}
          </div>

          {favoriteRecitations.length === 0 ? (
            <div className="text-center py-16 bg-[#0c0c0c] rounded-3xl border border-[#1a1a1a] p-8">
              <Headphones className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300 mb-1">
                لا توجد تلاوات مختارة محفوظة بعد
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                احفظ أي سورة مع قارئك المفضل بالضغط على زر النجمة/القلب في مشغل الصوت أو قائمة السور للوصول السريع إليها هنا.
              </p>
              {onOpenFavoriteRecitationsModal && (
                <button
                  onClick={onOpenFavoriteRecitationsModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  استكشاف التلاوات الموصى بها
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {favoriteRecitations.map((item) => {
                const isPlayingThis = 
                  isPlayingAudio && 
                  playingSurahNumber === item.surahNumber && 
                  activeReciter?.id === item.reciterId;

                const surahMeta = SURAHS_LIST.find((s) => s.number === item.surahNumber);
                const reciterMeta = RECITERS_LIST.find((r) => r.id === item.reciterId) || activeReciter;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between group ${
                      isPlayingThis
                        ? 'bg-gradient-to-br from-indigo-950/40 via-[#101222] to-amber-950/20 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                        : 'bg-[#0c0c0c] border-[#1a1a1a] hover:border-indigo-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-[#111] border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0 font-mono">
                            {item.surahNumber}
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white font-quran">
                              سورة {item.surahName}
                            </h4>
                            <p className="text-xs text-amber-300 font-medium flex items-center gap-1 mt-0.5">
                              <Headphones className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>الشيخ {item.reciterArabicName}</span>
                            </p>
                          </div>
                        </div>

                        {onToggleFavoriteRecitation && surahMeta && reciterMeta && (
                          <button
                            onClick={() => onToggleFavoriteRecitation(surahMeta, reciterMeta)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                            title="إزالة من التلاوات المختارة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-400 italic bg-[#111] p-2 rounded-lg border border-[#1f1f1f] mb-3">
                          « {item.notes} »
                        </p>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-[#1a1a1a] gap-2">
                      {onPlayFavoriteRecitation && reciterMeta && (
                        <button
                          onClick={() => onPlayFavoriteRecitation(item.surahNumber, reciterMeta)}
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
                              <span>استماع فوري</span>
                            </>
                          )}
                        </button>
                      )}

                      {onReadSurah && (
                        <button
                          onClick={() => onReadSurah(item.surahNumber)}
                          className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-medium bg-[#111] hover:bg-[#1a1a1a] text-slate-300 hover:text-white border border-[#222] cursor-pointer transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>قراءة</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
