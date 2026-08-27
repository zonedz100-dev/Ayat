import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, Heart, BookOpen, Share2, Check } from 'lucide-react';

interface AsmaaAllahModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AllahName {
  id: number;
  name: string;
  transliteration: string;
  meaning: string;
  benefit?: string;
}

export const ASMAA_ALLAH_LIST: AllahName[] = [
  { id: 1, name: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', meaning: 'الذي وسعت رحمته كل شيء في الدنيا والآخرة' },
  { id: 2, name: 'الرَّحِيمُ', transliteration: 'Ar-Raheem', meaning: 'المنعم برحمته على عباده المؤمنين' },
  { id: 3, name: 'المَلِكُ', transliteration: 'Al-Malik', meaning: 'المتصرف في ملكه كيف يشاء، المتفرد بالسلطان والعظمة' },
  { id: 4, name: 'القُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'المنزه والمبرأ عن كل عيب ونقص' },
  { id: 5, name: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'السالم من كل آفة ونقص، وناشر السلام بين خلقه' },
  { id: 6, name: 'المُؤْمِنُ', transliteration: 'Al-Mu\'min', meaning: 'المصدق لرسله بالمعجزات، والمانح لعباده الأمان والاطمئنان' },
  { id: 7, name: 'المُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'المطلع على خفايا الأمور وضمائر الصدور، والرقيب الحافظ' },
  { id: 8, name: 'العَزِيزُ', transliteration: 'Al-Aziz', meaning: 'القوي الغالب الذي لا يُقهر ولا يُغلب' },
  { id: 9, name: 'الجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'الذي يجبر كسر القلوب والضعفاء وينفذ مشيئته في خلقه' },
  { id: 10, name: 'المُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'المتفرد بالعظمة والكبرياء، المتعالي عن صفات الخلق' },
  { id: 11, name: 'الخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'المبدع الموجد للأشياء من العدم على غير مثال سابق' },
  { id: 12, name: 'البَارِئُ', transliteration: 'Al-Bari', meaning: 'الذي خلق النفوس وبرأها وميز بعضها عن بعض' },
  { id: 13, name: 'المُصَوِّرُ', transliteration: 'Al-Musawwir', meaning: 'الذي أعطى كل مخلوق صورته وهيئته الخاصة بحكمته' },
  { id: 14, name: 'الغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'الذي يستر الذنوب ويتجاوز عن الخطايا مرة بعد مرة' },
  { id: 15, name: 'القَهَّارُ', transliteration: 'Al-Qahhar', meaning: 'الذي خضعت له الرقاب وذلت له الجبابرة' },
  { id: 16, name: 'الوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'الذي يجود بالعطاء بلا عوض ولا حاجة' },
  { id: 17, name: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'المتكفل بأقوات العباد وخالق أسباب الرزق' },
  { id: 18, name: 'الفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'الذي يفتح أبواب الرحمة والرزق والنصر لعباده' },
  { id: 19, name: 'العَلِيمُ', transliteration: 'Al-Alim', meaning: 'المحيط بكل شيء علماً، ظاهراً وباطناً، ماضياً ومستقبلاً' },
  { id: 20, name: 'القَابِضُ', transliteration: 'Al-Qabid', meaning: 'الممسك للرزق والنفوس بحكمته وعدله' },
  { id: 21, name: 'البَاسِطُ', transliteration: 'Al-Basit', meaning: 'الموسع للأرزاق والنفوس برحمته وفضله' },
  { id: 22, name: 'الخَافِضُ', transliteration: 'Al-Khafid', meaning: 'الذي يخفض المتكبرين والظالمين' },
  { id: 23, name: 'الرَّافِعُ', transliteration: 'Ar-Rafi', meaning: 'الذي يرفع أولياءه وأهل العلم والإيمان' },
  { id: 24, name: 'المُعِزُّ', transliteration: 'Al-Mu\'izz', meaning: 'الذي يهب العزة لمن يشاء من عباده المخلصين' },
  { id: 25, name: 'المُذِلُّ', transliteration: 'Al-Mudhill', meaning: 'الذي يسلب العزة عمن عصاه واستكبر' },
  { id: 26, name: 'السَّمِيعُ', transliteration: 'As-Sami', meaning: 'الذي يسمع كل صوت وسر ونجوى بلا خفاء' },
  { id: 27, name: 'البَصِيرُ', transliteration: 'Al-Basir', meaning: 'الذي يرى كل حركة وسكون في ظلمات البر والبحر' },
  { id: 28, name: 'الحَكَمُ', transliteration: 'Al-Hakam', meaning: 'العادل الذي لا يجور، والحاكم بين عباده بالحق' },
  { id: 29, name: 'العَدْلُ', transliteration: 'Al-Adl', meaning: 'المنزه عن الظلم والجور في أفعاله وأحكامه' },
  { id: 30, name: 'اللَّطِيفُ', transliteration: 'Al-Latif', meaning: 'البر بعباده الموصل إليهم مصالحهم برفق وتدبير خفي' },
  { id: 31, name: 'الخَبِيرُ', transliteration: 'Al-Khabir', meaning: 'العالم بحقائق الأشياء وخفايا الصدور' },
  { id: 32, name: 'الحَلِيمُ', transliteration: 'Al-Halim', meaning: 'الذي لا يعاجل بالعقوبة بل يمهل ليتوب التائب' },
  { id: 33, name: 'العَظِيمُ', transliteration: 'Al-Azim', meaning: 'ذو المجد والعظمة والجلال الذي تستصغر دونه العقول' },
  { id: 34, name: 'الغَفُورُ', transliteration: 'Al-Ghafur', meaning: 'الواسع المغفرة الذي يغفر الذنوب العظام' },
  { id: 35, name: 'الشَّكُورُ', transliteration: 'Ash-Shakur', meaning: 'الذي يجزي على العمل القليل بالثواب الجزيل' },
  { id: 36, name: 'العَلِيُّ', transliteration: 'Al-Ali', meaning: 'الرفيع القدر والشأن فوق خلقه جميعاً' },
  { id: 37, name: 'الكَبِيرُ', transliteration: 'Al-Kabir', meaning: 'العظيم الجليل الذي كل شيء دونه صغير' },
  { id: 38, name: 'الحَفِيظُ', transliteration: 'Al-Hafiz', meaning: 'الحافظ للسموات والأرض وأعمال العباد' },
  { id: 39, name: 'المُقِيتُ', transliteration: 'Al-Muqit', meaning: 'المتكفل بإيصال القوت لكل حي، والشهيد القدير' },
  { id: 40, name: 'الحَسِيبُ', transliteration: 'Al-Hasib', meaning: 'الكافي لعباده والمتولي حسابهم يوم القيامة' },
  { id: 41, name: 'الجَلِيلُ', transliteration: 'Al-Jalil', meaning: 'الموصوف بنعوت الجلال وكمال الصفات' },
  { id: 42, name: 'الكَرِيمُ', transliteration: 'Al-Karim', meaning: 'الذي يعطي بلا مسألة ولا منة، ويتجاوز عن الزلات' },
  { id: 43, name: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', meaning: 'المراقب لكل وارد وشارد وحركة ولفظ' },
  { id: 44, name: 'المُجِيبُ', transliteration: 'Al-Mujib', meaning: 'الذي يقابل الدعاء بالإجابة والطلب بالعطاء' },
  { id: 45, name: 'الوَاسِعُ', transliteration: 'Al-Wasi', meaning: 'الذي وسع رزقه ورحمته وعلمه كل موجود' },
  { id: 46, name: 'الحَكِيمُ', transliteration: 'Al-Hakim', meaning: 'الذي يضع الأشياء في مواضعها المتقنة بحكمة بالغة' },
  { id: 47, name: 'الوَدُودُ', transliteration: 'Al-Wadud', meaning: 'المحب لعباده الصالحين والمحبوب في قلوبهم' },
  { id: 48, name: 'المَجِيدُ', transliteration: 'Al-Majid', meaning: 'البالغ النهاية في الشرف والكرم والكمال' },
  { id: 49, name: 'البَاعِثُ', transliteration: 'Al-Ba\'ith', meaning: 'المحيي للموتى يوم البعث والنشور' },
  { id: 50, name: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', meaning: 'المطلع على كل شيء الحاضر الذي لا يغيب عنه أمر' },
  { id: 51, name: 'الحَقُّ', transliteration: 'Al-Haqq', meaning: 'الثابت الموجود يقيناً، صاحب الحق والعدل' },
  { id: 52, name: 'الوَكِيلُ', transliteration: 'Al-Wakil', meaning: 'المتكفل بأمور عباده المعتمد عليه في كل شأن' },
  { id: 53, name: 'القَوِيُّ', transliteration: 'Al-Qawi', meaning: 'صاحب القدرة التامة التي لا يلحقها عجز' },
  { id: 54, name: 'المَتِينُ', transliteration: 'Al-Matin', meaning: 'الشديد القوة الذي لا تنقطع قوته ولا يمسه لغوب' },
  { id: 55, name: 'الوَلِيُّ', transliteration: 'Al-Wali', meaning: 'المحب والناصر والمتولي لأمور المؤمنين' },
  { id: 56, name: 'الحَمِيدُ', transliteration: 'Al-Hamid', meaning: 'المستحق لكل حمد وثناء في كل حال' },
  { id: 57, name: 'المُحْصِي', transliteration: 'Al-Muhsi', meaning: 'الذي أحاط بكل شيء عدداً وعلم أجزاءه' },
  { id: 58, name: 'المُبْدِئُ', transliteration: 'Al-Mubdi', meaning: 'الذي أنشأ الخلق وبدأه أول مرة' },
  { id: 59, name: 'المُعِيدُ', transliteration: 'Al-Mu\'id', meaning: 'الذي يعيد الخلق بعد فنائه كهيئته' },
  { id: 60, name: 'المُحْيِي', transliteration: 'Al-Muhyi', meaning: 'الواهب للحياة والمنشئ للأرواح في الأجساد' },
  { id: 61, name: 'المُمِيتُ', transliteration: 'Al-Mumit', meaning: 'المقدر للموت والمسلب للحياة بمشيئته' },
  { id: 62, name: 'الحَيُّ', transliteration: 'Al-Hayy', meaning: 'الدائم الباقي صاحب الحياة الكاملة التي لا موت فيها' },
  { id: 63, name: 'القَيُّومُ', transliteration: 'Al-Qayyum', meaning: 'القائم بنفسه المقيم لكل ما سواه' },
  { id: 64, name: 'الوَاجِدُ', transliteration: 'Al-Wajid', meaning: 'الغني الذي لا يعوزه شيء ولا يفوته مراد' },
  { id: 65, name: 'المَاجِدُ', transliteration: 'Al-Majid', meaning: 'صاحب الشرف والمجد والعطاء العظيم' },
  { id: 66, name: 'الوَاحِدُ', transliteration: 'Al-Wahid', meaning: 'المتفرد في ذاته وصفاته وأفعاله بلا شريك' },
  { id: 67, name: 'الأَحَدُ', transliteration: 'Al-Ahad', meaning: 'المنفرد بالألوهية والربوبية الذي لا مثيل له' },
  { id: 68, name: 'الصَّمَدُ', transliteration: 'As-Samad', meaning: 'السيد المقصود في الحوائج الذي تصمد إليه الخلائق' },
  { id: 69, name: 'القَادِرُ', transliteration: 'Al-Qadir', meaning: 'الذي يقدر على إيجاد ما يشاء وإعدام ما يشاء' },
  { id: 70, name: 'المُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaning: 'التام القدرة الذي لا يمتنع عليه شيء' },
  { id: 71, name: 'المُقَدِّمُ', transliteration: 'Al-Muqaddim', meaning: 'الذي يقدم الأشياء ويضعها في مراتبها بحكمته' },
  { id: 72, name: 'المُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', meaning: 'الذي يؤخر ما يشاء لحكمة بالغة' },
  { id: 73, name: 'الأَوَّلُ', transliteration: 'Al-Awwal', meaning: 'الذي ليس قبله شيء، الأزلي القديم' },
  { id: 74, name: 'الآخِرُ', transliteration: 'Al-Akhir', meaning: 'الذي ليس بعده شيء، الباقي بعد فناء خلقه' },
  { id: 75, name: 'الظَّاهِرُ', transliteration: 'Az-Zahir', meaning: 'الذي ظهرت دلائل عظمته وقدرته في كل مخلوق' },
  { id: 76, name: 'البَاطِنُ', transliteration: 'Al-Batin', meaning: 'المحتجب عن أبصار خلقه، العليم بسائر الأسرار' },
  { id: 77, name: 'الوَالِي', transliteration: 'Al-Wali', meaning: 'المتصرف في الكون والمالك لأمر الخلق' },
  { id: 78, name: 'المُتَعَالِي', transliteration: 'Al-Muta\'ali', meaning: 'المنزه عن صفات المخلوقين ونقائصهم' },
  { id: 79, name: 'البَرُّ', transliteration: 'Al-Barr', meaning: 'العطوف على عباده المحسن إليهم والموفي بعهده' },
  { id: 80, name: 'التَّوَّابُ', transliteration: 'At-Tawwab', meaning: 'الذي يقبل توبة عباده مرة بعد مرة ويفرح بها' },
  { id: 81, name: 'المُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaning: 'المعاقب للظالمين والعاصين بعدل وإنصاف' },
  { id: 82, name: 'العَفُوُّ', transliteration: 'Al-Afuww', meaning: 'الماحي للذنوب والصفوح عن الخطايا' },
  { id: 83, name: 'الرَّءُوفُ', transliteration: 'Ar-Ra\'uf', meaning: 'الشديد الرحمة والشفقة بعباده' },
  { id: 84, name: 'مَالِكُ المُلْكِ', transliteration: 'Malik-ul-Mulk', meaning: 'الذي ينفذ مشيئته في ملكه كيف يشاء متى يشاء' },
  { id: 85, name: 'ذُو الجَلَالِ وَالإِكْرَامِ', transliteration: 'Dhul-Jalali wal-Ikram', meaning: 'صاحب العظمة والكبرياء والإنعام والإحسان' },
  { id: 86, name: 'المُقْسِطُ', transliteration: 'Al-Muqsit', meaning: 'العادل في أحكامه المنصف للمظلوم من الظالم' },
  { id: 87, name: 'الجَامِعُ', transliteration: 'Al-Jami', meaning: 'الجامع للخلائق يوم القيامة للحساب والجزاء' },
  { id: 88, name: 'الغَنِيُّ', transliteration: 'Al-Ghaniyy', meaning: 'المستغني عن كل ما سواه وكل شيء إليه فقير' },
  { id: 89, name: 'المُغْنِي', transliteration: 'Al-Mughni', meaning: 'الذي يسد حاجات عباده ويغنيهم بفضله' },
  { id: 90, name: 'المَانِعُ', transliteration: 'Al-Mani', meaning: 'الذي يحمي أولياءه ويمنع ما يشاء بحكمته' },
  { id: 91, name: 'الضَّارُّ', transliteration: 'Ad-Darr', meaning: 'المقدر للضر بحكمته وابتلائه' },
  { id: 92, name: 'النَّافِعُ', transliteration: 'An-Nafi', meaning: 'المقدر للنفع والخير والبركة في الكون' },
  { id: 93, name: 'النُّورُ', transliteration: 'An-Nur', meaning: 'الهادي المنير للسموات والأرض وقلوب المؤمنين' },
  { id: 94, name: 'الهَادِي', transliteration: 'Al-Hadi', meaning: 'الموفق لعباده إلى طريق الحق والاستقامة' },
  { id: 95, name: 'البَدِيعُ', transliteration: 'Al-Badi', meaning: 'الذي خلق الكون في غاية الإتقان والإبداع' },
  { id: 96, name: 'البَاقِي', transliteration: 'Al-Baqi', meaning: 'الدائم الوجود الذي لا نهاية لذاته' },
  { id: 97, name: 'الوَارِثُ', transliteration: 'Al-Warith', meaning: 'الباقي بعد فناء خلقه وإليه يرجع الملك كله' },
  { id: 98, name: 'الرَّشِيدُ', transliteration: 'Ar-Rashid', meaning: 'الذي يرشد خلقه إلى مصالحهم بحكمته وتدبيره' },
  { id: 99, name: 'الصَّبُورُ', transliteration: 'As-Sabur', meaning: 'الذي لا يعاجل العصاة بالعقوبة بل يمهلهم' }
];

export const AsmaaAllahModal: React.FC<AsmaaAllahModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<AllahName | null>(null);

  const filteredNames = useMemo(() => {
    if (!searchQuery.trim()) return ASMAA_ALLAH_LIST;
    const q = searchQuery.toLowerCase().trim();
    return ASMAA_ALLAH_LIST.filter(
      (n) => n.name.includes(q) || n.meaning.includes(q) || n.transliteration.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#131d24] via-[#0d161c] to-[#0a1015] rounded-3xl border border-amber-500/30 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/80 via-[#1c2833] to-amber-950/80 border-b border-amber-500/30 text-center relative">
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>«إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ»</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-quran text-amber-300">
            أسماء الله الحسنى ٩٩
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            تأمل وتدبر معاني أسماء الله جل جلاله وفضائلها
          </p>

          {/* Search Input */}
          <div className="relative max-w-md mx-auto mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم من أسماء الله أو معناه..."
              className="w-full bg-black/50 text-white placeholder:text-slate-500 rounded-xl py-2.5 pr-10 pl-4 text-xs border border-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <Search className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 99 Names Grid */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredNames.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedName(item)}
                className="bg-[#15232d] hover:bg-[#1a2e3d] border border-amber-500/20 hover:border-amber-500/50 p-3.5 rounded-2xl cursor-pointer transition-all text-center flex flex-col items-center justify-between group shadow-sm hover:scale-[1.02]"
              >
                <span className="text-[10px] font-mono font-bold text-amber-400/70 mb-1">
                  #{item.id}
                </span>

                <h3 className="text-xl font-bold font-quran text-amber-300 group-hover:text-amber-200 my-1">
                  {item.name}
                </h3>

                <span className="text-[11px] text-slate-400 font-mono">
                  {item.transliteration}
                </span>

                <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-tight">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Selected Name Detail Modal Overlay */}
        {selectedName && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-gradient-to-b from-[#192834] to-[#101b24] p-6 rounded-3xl border border-amber-500/40 text-white text-center space-y-4 relative shadow-2xl">
              
              <button
                onClick={() => setSelectedName(null)}
                className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                الاسم رقم #{selectedName.id}
              </span>

              <h3 className="text-3xl font-extrabold font-quran text-amber-300 mt-2">
                {selectedName.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{selectedName.transliteration}</p>

              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-right">
                <h4 className="text-xs font-bold text-amber-300 mb-1">المعنى والدلالة:</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedName.meaning}</p>
              </div>

              <button
                onClick={() => setSelectedName(null)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
