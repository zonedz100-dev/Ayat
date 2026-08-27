import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Search, 
  Bookmark, 
  Share2, 
  Check, 
  Eye, 
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

interface IslamicArticlesAndDuasModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'khatm_dua' | 'prophetic_duas' | 'articles';
}

const KHATM_QURAN_DUA = `اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً.
اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.
اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ.
اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ وَخَيْرَ عَمَلِي خَوَاتِمَهُ وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً هَنِيَّةً وَمِيتَةً سَوِيَّةً وَمَرَدًّا غَيْرَ مُخْزٍ وَلاَ فَاضِحٍ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ المَسْأَلَةِ وَخَيْرَ الدُّعَاءِ وَخَيْرَ النَّجَاحِ وَخَيْرَ العِلْمِ وَخَيْرَ العَمَلِ وَخَيْرَ الثَّوَابِ وَخَيْرَ الحَيَاةِ وَخَيْرَ المَمَاتِ وَثَبِّتْنِي وَثَقِّلْ مَوَازِينِي وَحَقِّقْ إِيمَانِي وَارْفَعْ دَرَجَاتِي وَتَقَبَّلْ صَلاَتِي وَاغْفِرْ خَطِيئَاتِي وَأَسْأَلُكَ العُلاَ مِنَ الجَنَّةِ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمِ مَغْفِرَتِكَ وَالسَّلاَمَةَ مِنْ كُلِّ إِثْمٍ وَالغَنِيمَةَ مِنْ كُلِّ بِرٍّ وَالفَوْزَ بِالجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ.
اللَّهُمَّ لاَ تَدَعْ لَنَا ذَنْباً إِلاَّ غَفَرْتَهُ وَلاَ هَمًّا إِلاَّ فَرَّجْتَهُ وَلاَ دَيْناً إِلاَّ قَضَيْتَهُ وَلاَ حَاجَةً مِنْ حَوَائِجِ الدُّنْيَا وَالآخِرَةِ إِلاَّ قَضَيْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ.
رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.
وَصَلَّى اللهُ عَلَى سَيِّدِنَا وَنَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَأَصْحَابِهِ الأَخْيَارِ وَسَلَّمَ تَسْلِيماً كَثِيراً.`;

const PROPHETIC_DUAS = [
  {
    title: 'سيد الاستغفار',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
    reward: 'من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة'
  },
  {
    title: 'دعاء كشف الكرب والهم',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ.',
    reward: 'تفريج الهموم وقضاء الديون والنجاة من العجز'
  },
  {
    title: 'دعاء جامع لخيري الدنيا والآخرة',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ.',
    reward: 'شمل جميع الأدعية التي دعا بها النبي ﷺ'
  },
  {
    title: 'دعاء الهداية والتقوى والعفاف والغنى',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى.',
    reward: 'أجمع الدعاء لراحة النفس والبركة في الرزق'
  },
  {
    title: 'دعاء الثبات على الدين',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ، وَيَا مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ.',
    reward: 'كان من أكثر دعاء النبي ﷺ'
  }
];

const ISLAMIC_ARTICLES = [
  {
    id: 1,
    category: 'دورة فقه الصيام',
    title: 'الدرس الثاني: سنن ومبطلات الصيام وآدابه الرفيعة',
    snippet: 'تعرف على أحكام الصيام الصحيح، والسنن المستحبة عند الإفطار والسحور، وما يفسد الصوم وما لا يفسده.',
    views: '12.5K',
    likes: 320,
    comments: 19,
    date: 'أمس'
  },
  {
    id: 2,
    category: 'فضل القرآن',
    title: 'كيف تختم القرآن الكريم بتدبر وخشوع في شهر رمضان؟',
    snippet: 'جدول عملي مقترح لتقسيم الأوراد اليومية مع ربط الآيات بالعمل والتأمل الإيماني.',
    views: '18.2K',
    likes: 540,
    comments: 42,
    date: 'منذ يومين'
  },
  {
    id: 3,
    category: 'أذكار وأدعية',
    title: 'أسرار أذكار الصباح والمساء وكيف تحفظ العبد من كل سوء',
    snippet: 'بيان المعاني العميقة للأذكار المأثورة وكيف تجلب السكينة وتدفع وساوس الشيطان.',
    views: '9.8K',
    likes: 280,
    comments: 14,
    date: 'منذ ٣ أيام'
  }
];

export const IslamicArticlesAndDuasModal: React.FC<IslamicArticlesAndDuasModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'khatm_dua'
}) => {
  const [activeTab, setActiveTab] = useState<'khatm_dua' | 'prophetic_duas' | 'articles'>(initialTab);
  const [copiedText, setCopiedText] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleCopyDua = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#111922] via-[#0d141b] to-[#0a0f14] rounded-3xl border border-teal-500/30 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header & Navigation Tabs (Inspired by Image 1 & Image 6) */}
        <div className="p-5 bg-gradient-to-r from-teal-950/80 via-[#13222e] to-teal-950/80 border-b border-teal-500/30 relative">
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-3">
            <h2 className="text-xl font-bold font-cairo text-white">ركن الأدعية والفوائد الشرعية</h2>
            <p className="text-xs text-teal-200 mt-0.5">دعاء ختم القرآن، جوامع الدعاء، ومقالات فقهية نافعة</p>
          </div>

          {/* 3 Top Tabs (Inspired by Image 1 & Image 6 top banners) */}
          <div className="grid grid-cols-3 gap-2 bg-black/40 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('khatm_dua')}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'khatm_dua'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>دعاء ختم القرآن</span>
            </button>

            <button
              onClick={() => setActiveTab('prophetic_duas')}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'prophetic_duas'
                  ? 'bg-teal-500 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>جوامع الدعاء</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'articles'
                  ? 'bg-sky-500 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>الفوائد والمقالات</span>
            </button>
          </div>

        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Tab 1: دعاء ختم القرآن الكريم */}
          {activeTab === 'khatm_dua' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300 font-bold">الدعاء المأثور لختم القرآن الكريم:</span>
                <button
                  onClick={() => handleCopyDua(KHATM_QURAN_DUA)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/30"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'تم النسخ' : 'نسخ الدعاء'}</span>
                </button>
              </div>

              <div className="bg-[#15232d] p-5 rounded-3xl border border-amber-500/30 text-slate-100 font-quran text-base sm:text-lg leading-loose text-justify shadow-inner">
                {KHATM_QURAN_DUA}
              </div>
            </div>
          )}

          {/* Tab 2: جوامع الدعاء النبوي */}
          {activeTab === 'prophetic_duas' && (
            <div className="space-y-3">
              {PROPHETIC_DUAS.map((dua, i) => (
                <div
                  key={i}
                  className="bg-[#15232d] border border-teal-500/20 p-4 rounded-2xl space-y-2 hover:border-teal-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-teal-300">{dua.title}</h3>
                    <button
                      onClick={() => handleCopyDua(dua.arabic)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                      title="نسخ الدعاء"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-base font-quran text-slate-100 leading-relaxed">
                    {dua.arabic}
                  </p>

                  <div className="text-[11px] text-amber-300/90 font-cairo bg-black/30 px-3 py-1 rounded-xl border border-white/5">
                    ✨ {dua.reward}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: الفوائد والمقالات (Inspired by Image 1 Left Tab) */}
          {activeTab === 'articles' && (
            <div className="space-y-3">
              {ISLAMIC_ARTICLES.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#15232d] border border-sky-500/20 p-4 rounded-2xl space-y-3 hover:border-sky-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{article.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {article.snippet}
                  </p>

                  {/* Article Stats Bar (Views, Likes, Comments, Bookmark) directly inspired by Image 1 */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>{article.views}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>{article.likes}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{article.comments}</span>
                      </span>
                    </div>

                    <button className="text-slate-400 hover:text-amber-300 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
