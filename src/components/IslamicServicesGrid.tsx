import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Compass, 
  Award, 
  Heart, 
  BookmarkCheck, 
  Sun, 
  Moon, 
  Grid, 
  HelpCircle,
  Trophy
} from 'lucide-react';
import { ViewMode } from '../types';

interface IslamicServicesGridProps {
  onSelectView: (view: ViewMode) => void;
  onOpenSurah?: (surahNumber: number, initialAyah?: number) => void;
  onOpenTasbeeh: () => void;
  onOpenTaatak: () => void;
  onOpenAsmaaAllah: () => void;
  onOpenRamadan: () => void;
  onOpenArticlesAndDuas: (tab?: 'khatm_dua' | 'prophetic_duas' | 'articles') => void;
  onOpenPrayerTimes: () => void;
  bookmarksCount?: number;
  athkarStreak?: number;
}

export const IslamicServicesGrid: React.FC<IslamicServicesGridProps> = ({
  onSelectView,
  onOpenSurah,
  onOpenTasbeeh,
  onOpenTaatak,
  onOpenAsmaaAllah,
  onOpenRamadan,
  onOpenArticlesAndDuas,
  onOpenPrayerTimes,
  bookmarksCount = 0,
  athkarStreak = 0
}) => {
  const services = [
    {
      id: 'quran',
      title: 'المصحف',
      subtitle: 'سورة الفاتحة والسور',
      badge: 'الفاتحة مباشرة 📖',
      iconEmoji: '📖',
      gradient: 'from-emerald-500 to-teal-700',
      border: 'border-emerald-500/30',
      action: () => {
        if (onOpenSurah) {
          onOpenSurah(1, 1);
        } else {
          onSelectView('reader');
        }
      }
    },
    {
      id: 'tasbeeh',
      title: 'السبحة',
      subtitle: 'إلكترونية مطورة',
      badge: 'تسبيحات اليوم',
      iconEmoji: '📿',
      gradient: 'from-amber-500 to-orange-600',
      border: 'border-amber-500/30',
      action: onOpenTasbeeh
    },
    {
      id: 'azkar',
      title: 'الأذكار',
      subtitle: 'صباح ومساء ونوم',
      badge: athkarStreak > 0 ? `${athkarStreak} أيام 🔥` : 'حصن المسلم',
      iconEmoji: '🤲',
      gradient: 'from-blue-600 to-indigo-700',
      border: 'border-blue-500/30',
      action: () => onSelectView('azkar')
    },
    {
      id: 'taatak',
      title: 'طاعاتك',
      subtitle: 'نافس بالطاعة',
      badge: 'المستوى ٣ 🏆',
      iconEmoji: '🥇',
      gradient: 'from-purple-600 to-pink-600',
      border: 'border-purple-500/30',
      action: onOpenTaatak
    },
    {
      id: 'qibla',
      title: 'مواقيت الصلاة',
      subtitle: 'المسجد الأقصى ومكة',
      badge: 'حي على الصلاة',
      iconEmoji: '🕋',
      gradient: 'from-amber-600 to-yellow-600',
      border: 'border-amber-500/30',
      action: onOpenPrayerTimes
    },
    {
      id: 'duas',
      title: 'الدعاء',
      subtitle: 'دعاء ختم القرآن',
      badge: 'جوامع الكلم',
      iconEmoji: '✨',
      gradient: 'from-sky-500 to-cyan-600',
      border: 'border-sky-500/30',
      action: () => onOpenArticlesAndDuas('khatm_dua')
    },
    {
      id: 'khatma',
      title: 'الختمة',
      subtitle: 'متابعة الورد',
      badge: bookmarksCount > 0 ? `${bookmarksCount} مواضع` : 'خطة الختمة',
      iconEmoji: '📑',
      gradient: 'from-rose-500 to-red-600',
      border: 'border-rose-500/30',
      action: () => onSelectView('khatma')
    },
    {
      id: 'asmaa',
      title: 'أسماء الله ٩٩',
      subtitle: 'المعاني والفضائل',
      badge: 'من أحصاها دخل الجنة',
      iconEmoji: '🌟',
      gradient: 'from-teal-500 to-emerald-700',
      border: 'border-teal-500/30',
      action: onOpenAsmaaAllah
    },
    {
      id: 'ramadan',
      title: 'إمساكية رمضان',
      subtitle: 'المدفع والمسحراتي',
      badge: 'رمضان كريم 🌙',
      iconEmoji: '🏮',
      gradient: 'from-emerald-700 to-green-900',
      border: 'border-emerald-500/30',
      action: onOpenRamadan
    },
    {
      id: 'articles',
      title: 'الفوائد الشرعية',
      subtitle: 'فقه الصيام والأحكام',
      badge: 'علم نافع',
      iconEmoji: '📜',
      gradient: 'from-slate-700 to-slate-900',
      border: 'border-slate-500/30',
      action: () => onOpenArticlesAndDuas('articles')
    }
  ];

  return (
    <div className="space-y-3">
      
      {/* Section Title Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm sm:text-base font-bold text-white font-cairo">
            الخدمات والأركان الإسلامية
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          استكشف رفقاء الإيمان والذكر
        </span>
      </div>

      {/* Grid of Rounded Services (Directly inspired by Image 3 & Image 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {services.map((item) => (
          <button
            key={item.id}
            id={`service-grid-${item.id}`}
            onClick={item.action}
            className="group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-[#0c131a] hover:bg-[#111c26] border border-white/10 hover:border-emerald-500/40 text-center transition-all cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-95"
          >
            {/* Top Badge Pill */}
            {item.badge && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-white/10 text-slate-300 border border-white/10 mb-2 truncate max-w-full">
                {item.badge}
              </span>
            )}

            {/* Circular Colorful Icon Ring (Inspired by Image 7 icon style) */}
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl sm:text-3xl shadow-lg border-2 border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              <span className="select-none filter drop-shadow-md">{item.iconEmoji}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-2.5 text-center w-full">
              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-cairo">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
