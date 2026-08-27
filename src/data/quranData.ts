import { SurahMeta, Reciter, ZikrItem } from '../types';

export const SURAHS_LIST: SurahMeta[] = [
  { number: 1, name: "الفاتحة", arabicName: "سُورَةُ ٱلْفَاتِحَةِ", englishName: "Al-Faatiha", englishTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", pageStart: 1, juzStart: 1 },
  { number: 2, name: "البقرة", arabicName: "سُورَةُ البَقَرَةِ", englishName: "Al-Baqara", englishTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", pageStart: 2, juzStart: 1 },
  { number: 3, name: "آل عمران", arabicName: "سُورَةُ آلِ عِمْرَانَ", englishName: "Aal-i-Imraan", englishTranslation: "The Family of Imraan", numberOfAyahs: 200, revelationType: "Medinan", pageStart: 50, juzStart: 3 },
  { number: 4, name: "النساء", arabicName: "سُورَةُ النِّسَاءِ", englishName: "An-Nisaa", englishTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan", pageStart: 77, juzStart: 4 },
  { number: 5, name: "المائدة", arabicName: "سُورَةُ المَائِدَةِ", englishName: "Al-Maaida", englishTranslation: "The Table", numberOfAyahs: 120, revelationType: "Medinan", pageStart: 106, juzStart: 6 },
  { number: 6, name: "الأنعام", arabicName: "سُورَةُ الأَنْعَامِ", englishName: "Al-An'aam", englishTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan", pageStart: 128, juzStart: 7 },
  { number: 7, name: "الأعراف", arabicName: "سُورَةُ الأَعْرَافِ", englishName: "Al-A'raaf", englishTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan", pageStart: 151, juzStart: 8 },
  { number: 8, name: "الأنفال", arabicName: "سُورَةُ الأَنْفَالِ", englishName: "Al-Anfaal", englishTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan", pageStart: 177, juzStart: 9 },
  { number: 9, name: "التوبة", arabicName: "سُورَةُ التَّوْبَةِ", englishName: "At-Tawba", englishTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan", pageStart: 187, juzStart: 10 },
  { number: 10, name: "يونس", arabicName: "سُورَةُ يُونُسَ", englishName: "Yunus", englishTranslation: "Jonas", numberOfAyahs: 109, revelationType: "Meccan", pageStart: 208, juzStart: 11 },
  { number: 11, name: "هود", arabicName: "سُورَةُ هُودٍ", englishName: "Hud", englishTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan", pageStart: 221, juzStart: 11 },
  { number: 12, name: "يوسف", arabicName: "سُورَةُ يُوسُفَ", englishName: "Yusuf", englishTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan", pageStart: 235, juzStart: 12 },
  { number: 13, name: "الرعد", arabicName: "سُورَةُ الرَّعْدِ", englishName: "Ar-Ra'd", englishTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan", pageStart: 249, juzStart: 13 },
  { number: 14, name: "إبراهيم", arabicName: "سُورَةُ إِبْرَاهِيمَ", englishName: "Ibrahim", englishTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan", pageStart: 255, juzStart: 13 },
  { number: 15, name: "الحجر", arabicName: "سُورَةُ الحِجْرِ", englishName: "Al-Hijr", englishTranslation: "The Rock", numberOfAyahs: 99, revelationType: "Meccan", pageStart: 262, juzStart: 14 },
  { number: 16, name: "النحل", arabicName: "سُورَةُ النَّحْلِ", englishName: "An-Nahl", englishTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan", pageStart: 267, juzStart: 14 },
  { number: 17, name: "الإسراء", arabicName: "سُورَةُ الإِسْرَاءِ", englishName: "Al-Israa", englishTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan", pageStart: 282, juzStart: 15 },
  { number: 18, name: "الكهف", arabicName: "سُورَةُ الكَهْفِ", englishName: "Al-Kahf", englishTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan", pageStart: 293, juzStart: 15 },
  { number: 19, name: "مريم", arabicName: "سُورَةُ مَرْيَمَ", englishName: "Maryam", englishTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan", pageStart: 305, juzStart: 16 },
  { number: 20, name: "طه", arabicName: "سُورَةُ طه", englishName: "Taa-Haa", englishTranslation: "Taa-Haa", numberOfAyahs: 135, revelationType: "Meccan", pageStart: 312, juzStart: 16 },
  { number: 21, name: "الأنبياء", arabicName: "سُورَةُ الأَنْبِيَاءِ", englishName: "Al-Anbiyaa", englishTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan", pageStart: 322, juzStart: 17 },
  { number: 22, name: "الحج", arabicName: "سُورَةُ الحَجِّ", englishName: "Al-Hajj", englishTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan", pageStart: 332, juzStart: 17 },
  { number: 23, name: "المؤمنون", arabicName: "سُورَةُ المُؤْمِنُونَ", englishName: "Al-Muminoon", englishTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan", pageStart: 342, juzStart: 18 },
  { number: 24, name: "النور", arabicName: "سُورَةُ النُّورِ", englishName: "An-Noor", englishTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan", pageStart: 350, juzStart: 18 },
  { number: 25, name: "الفرقان", arabicName: "سُورَةُ الفُرْقَانِ", englishName: "Al-Furqaan", englishTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan", pageStart: 359, juzStart: 18 },
  { number: 26, name: "الشعراء", arabicName: "سُورَةُ الشُّعَرَاءِ", englishName: "Ash-Shu'araa", englishTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan", pageStart: 367, juzStart: 19 },
  { number: 27, name: "النمل", arabicName: "سُورَةُ النَّمْلِ", englishName: "An-Naml", englishTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan", pageStart: 377, juzStart: 19 },
  { number: 28, name: "القصص", arabicName: "سُورَةُ القَصَصِ", englishName: "Al-Qasas", englishTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan", pageStart: 385, juzStart: 20 },
  { number: 29, name: "العنكبوت", arabicName: "سُورَةُ العَنْكَبُوتِ", englishName: "Al-Ankaboot", englishTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan", pageStart: 396, juzStart: 20 },
  { number: 30, name: "الروم", arabicName: "سُورَةُ الرُّومِ", englishName: "Ar-Room", englishTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan", pageStart: 404, juzStart: 21 },
  { number: 31, name: "لقمان", arabicName: "سُورَةُ لُقْمَانَ", englishName: "Luqman", englishTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", pageStart: 411, juzStart: 21 },
  { number: 32, name: "السجدة", arabicName: "سُورَةُ السَّجْدَةِ", englishName: "As-Sajda", englishTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan", pageStart: 415, juzStart: 21 },
  { number: 33, name: "الأحزاب", arabicName: "سُورَةُ الأَحْزَابِ", englishName: "Al-Ahzaab", englishTranslation: "The Clans", numberOfAyahs: 73, revelationType: "Medinan", pageStart: 418, juzStart: 21 },
  { number: 34, name: "سبأ", arabicName: "سُورَةُ سَبَإٍ", englishName: "Saba", englishTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan", pageStart: 428, juzStart: 22 },
  { number: 35, name: "فاطر", arabicName: "سُورَةُ فَاطِرٍ", englishName: "Faatir", englishTranslation: "The Originator", numberOfAyahs: 45, revelationType: "Meccan", pageStart: 434, juzStart: 22 },
  { number: 36, name: "يس", arabicName: "سُورَةُ يس", englishName: "Yaseen", englishTranslation: "Yaseen", numberOfAyahs: 83, revelationType: "Meccan", pageStart: 440, juzStart: 22 },
  { number: 37, name: "الصافات", arabicName: "سُورَةُ الصَّافَّاتِ", englishName: "As-Saaffaat", englishTranslation: "Those who set the Ranks", numberOfAyahs: 182, revelationType: "Meccan", pageStart: 446, juzStart: 23 },
  { number: 38, name: "ص", arabicName: "سُورَةُ ص", englishName: "Saad", englishTranslation: "The Letter Saad", numberOfAyahs: 88, revelationType: "Meccan", pageStart: 453, juzStart: 23 },
  { number: 39, name: "الزمر", arabicName: "سُورَةُ الزُّمَرِ", englishName: "Az-Zumar", englishTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan", pageStart: 458, juzStart: 23 },
  { number: 40, name: "غافر", arabicName: "سُورَةُ غَافِرٍ", englishName: "Ghafir", englishTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan", pageStart: 467, juzStart: 24 },
  { number: 41, name: "فصلت", arabicName: "سُورَةُ فُصِّلَتْ", englishName: "Fussilat", englishTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan", pageStart: 477, juzStart: 24 },
  { number: 42, name: "الشورى", arabicName: "سُورَةُ الشُّورَى", englishName: "Ash-Shura", englishTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan", pageStart: 483, juzStart: 25 },
  { number: 43, name: "الزخرف", arabicName: "سُورَةُ الزُّخْرُفِ", englishName: "Az-Zukhruf", englishTranslation: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan", pageStart: 489, juzStart: 25 },
  { number: 44, name: "الدخان", arabicName: "سُورَةُ الدُّخَانِ", englishName: "Ad-Dukhaan", englishTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan", pageStart: 496, juzStart: 25 },
  { number: 45, name: "الجاثية", arabicName: "سُورَةُ الجَاثِيَةِ", englishName: "Al-Jaathiya", englishTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan", pageStart: 499, juzStart: 25 },
  { number: 46, name: "الأحقاف", arabicName: "سُورَةُ الأَحْقَافِ", englishName: "Al-Ahqaf", englishTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan", pageStart: 502, juzStart: 26 },
  { number: 47, name: "محمد", arabicName: "سُورَةُ مُحَمَّدٍ", englishName: "Muhammad", englishTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", pageStart: 507, juzStart: 26 },
  { number: 48, name: "الفتح", arabicName: "سُورَةُ الفَتْحِ", englishName: "Al-Fath", englishTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan", pageStart: 511, juzStart: 26 },
  { number: 49, name: "الحجرات", arabicName: "سُورَةُ الحُجُرَاتِ", englishName: "Al-Hujuraat", englishTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan", pageStart: 515, juzStart: 26 },
  { number: 50, name: "ق", arabicName: "سُورَةُ ق", englishName: "Qaaf", englishTranslation: "The Letter Qaaf", numberOfAyahs: 45, revelationType: "Meccan", pageStart: 518, juzStart: 26 },
  { number: 51, name: "الذاريات", arabicName: "سُورَةُ الذَّارِيَاتِ", englishName: "Adh-Dhaariyat", englishTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan", pageStart: 520, juzStart: 26 },
  { number: 52, name: "الطور", arabicName: "سُورَةُ الطُّورِ", englishName: "At-Toor", englishTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan", pageStart: 523, juzStart: 27 },
  { number: 53, name: "النجم", arabicName: "سُورَةُ النَّجْمِ", englishName: "An-Najm", englishTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan", pageStart: 526, juzStart: 27 },
  { number: 54, name: "القمر", arabicName: "سُورَةُ القَمَرِ", englishName: "Al-Qamar", englishTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan", pageStart: 528, juzStart: 27 },
  { number: 55, name: "الرحمن", arabicName: "سُورَةُ الرَّحْمَٰنِ", englishName: "Ar-Rahmaan", englishTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan", pageStart: 531, juzStart: 27 },
  { number: 56, name: "الواقعة", arabicName: "سُورَةُ الوَاقِعَةِ", englishName: "Al-Waaqia", englishTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan", pageStart: 534, juzStart: 27 },
  { number: 57, name: "الحديد", arabicName: "سُورَةُ الحَدِيدِ", englishName: "Al-Hadid", englishTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan", pageStart: 537, juzStart: 27 },
  { number: 58, name: "المجادلة", arabicName: "سُورَةُ المُجَادَلَةِ", englishName: "Al-Mujaadila", englishTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan", pageStart: 542, juzStart: 28 },
  { number: 59, name: "الحشر", arabicName: "سُورَةُ الحَشْرِ", englishName: "Al-Hashr", englishTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan", pageStart: 545, juzStart: 28 },
  { number: 60, name: "الممتحنة", arabicName: "سُورَةُ المُمْتَحَنَةِ", englishName: "Al-Mumtahana", englishTranslation: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan", pageStart: 549, juzStart: 28 },
  { number: 61, name: "الصف", arabicName: "سُورَةُ الصَّفِّ", englishName: "As-Saff", englishTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan", pageStart: 551, juzStart: 28 },
  { number: 62, name: "الجمعة", arabicName: "سُورَةُ الجُمُعَةِ", englishName: "Al-Jumu'a", englishTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan", pageStart: 553, juzStart: 28 },
  { number: 63, name: "المنافقون", arabicName: "سُورَةُ المُنَافِقُونَ", englishName: "Al-Munaafiqoon", englishTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan", pageStart: 554, juzStart: 28 },
  { number: 64, name: "التغابن", arabicName: "سُورَةُ التَّغَابُنِ", englishName: "At-Taghaabun", englishTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan", pageStart: 556, juzStart: 28 },
  { number: 65, name: "الطلاق", arabicName: "سُورَةُ الطَّلَاقِ", englishName: "At-Talaaq", englishTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan", pageStart: 558, juzStart: 28 },
  { number: 66, name: "التحريم", arabicName: "سُورَةُ التَّحْرِيمِ", englishName: "At-Tahrim", englishTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan", pageStart: 560, juzStart: 28 },
  { number: 67, name: "الملك", arabicName: "سُورَةُ المُلْكِ", englishName: "Al-Mulk", englishTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan", pageStart: 562, juzStart: 29 },
  { number: 68, name: "القلم", arabicName: "سُورَةُ القَلَمِ", englishName: "Al-Qalam", englishTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan", pageStart: 564, juzStart: 29 },
  { number: 69, name: "الحاقة", arabicName: "سُورَةُ الحَاقَّةِ", englishName: "Al-Haaqqa", englishTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan", pageStart: 566, juzStart: 29 },
  { number: 70, name: "المعارج", arabicName: "سُورَةُ المَعَارِجِ", englishName: "Al-Ma'aarij", englishTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan", pageStart: 568, juzStart: 29 },
  { number: 71, name: "نوح", arabicName: "سُورَةُ نُوحٍ", englishName: "Nooh", englishTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan", pageStart: 570, juzStart: 29 },
  { number: 72, name: "الجن", arabicName: "سُورَةُ الجِنِّ", englishName: "Al-Jinn", englishTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan", pageStart: 572, juzStart: 29 },
  { number: 73, name: "المزمل", arabicName: "سُورَةُ المُزَّمِّلِ", englishName: "Al-Muzzammil", englishTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan", pageStart: 574, juzStart: 29 },
  { number: 74, name: "المدثر", arabicName: "سُورَةُ المُدَّثِّرِ", englishName: "Al-Muddaththir", englishTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan", pageStart: 575, juzStart: 29 },
  { number: 75, name: "القيامة", arabicName: "سُورَةُ القِيَامَةِ", englishName: "Al-Qiyaama", englishTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan", pageStart: 577, juzStart: 29 },
  { number: 76, name: "الإنسان", arabicName: "سُورَةُ الإِنْسَانِ", englishName: "Al-Insaan", englishTranslation: "Man", numberOfAyahs: 31, revelationType: "Medinan", pageStart: 578, juzStart: 29 },
  { number: 77, name: "المرسلات", arabicName: "سُورَةُ المُرْسَلَاتِ", englishName: "Al-Mursalaat", englishTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan", pageStart: 580, juzStart: 29 },
  { number: 78, name: "النبأ", arabicName: "سُورَةُ النَّبَإِ", englishName: "An-Naba", englishTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan", pageStart: 582, juzStart: 30 },
  { number: 79, name: "النازعات", arabicName: "سُورَةُ النَّازِعَاتِ", englishName: "An-Naazi'aat", englishTranslation: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan", pageStart: 583, juzStart: 30 },
  { number: 80, name: "عبس", arabicName: "سُورَةُ عَبَسَ", englishName: "Abasa", englishTranslation: "He frowned", numberOfAyahs: 42, revelationType: "Meccan", pageStart: 585, juzStart: 30 },
  { number: 81, name: "التكوير", arabicName: "سُورَةُ التَّكْوِيرِ", englishName: "At-Takwir", englishTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan", pageStart: 586, juzStart: 30 },
  { number: 82, name: "الانفطار", arabicName: "سُورَةُ الانْفِطَارِ", englishName: "Al-Infitaar", englishTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan", pageStart: 587, juzStart: 30 },
  { number: 83, name: "المطففين", arabicName: "سُورَةُ المُطَفِّفِينَ", englishName: "Al-Mutaffifin", englishTranslation: "Defrauding", numberOfAyahs: 36, revelationType: "Meccan", pageStart: 587, juzStart: 30 },
  { number: 84, name: "الانشقاق", arabicName: "سُورَةُ الانْشِقَاقِ", englishName: "Al-Inshiqaaq", englishTranslation: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan", pageStart: 589, juzStart: 30 },
  { number: 85, name: "البروج", arabicName: "سُورَةُ البُرُوجِ", englishName: "Al-Burooj", englishTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan", pageStart: 590, juzStart: 30 },
  { number: 86, name: "الطارق", arabicName: "سُورَةُ الطَّارِقِ", englishName: "At-Taariq", englishTranslation: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan", pageStart: 591, juzStart: 30 },
  { number: 87, name: "الأعلى", arabicName: "سُورَةُ الأَعْلَى", englishName: "Al-A'laa", englishTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan", pageStart: 591, juzStart: 30 },
  { number: 88, name: "الغاشية", arabicName: "سُورَةُ الغَاشِيَةِ", englishName: "Al-Ghaashiya", englishTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan", pageStart: 592, juzStart: 30 },
  { number: 89, name: "الفجر", arabicName: "سُورَةُ الفَجْرِ", englishName: "Al-Fajr", englishTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan", pageStart: 593, juzStart: 30 },
  { number: 90, name: "البلد", arabicName: "سُورَةُ البَلَدِ", englishName: "Al-Balad", englishTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan", pageStart: 594, juzStart: 30 },
  { number: 91, name: "الشمس", arabicName: "سُورَةُ الشَّمْسِ", englishName: "Ash-Shams", englishTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan", pageStart: 595, juzStart: 30 },
  { number: 92, name: "الليل", arabicName: "سُورَةُ اللَّيْلِ", englishName: "Al-Layl", englishTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan", pageStart: 595, juzStart: 30 },
  { number: 93, name: "الضحى", arabicName: "سُورَةُ الضُّحَى", englishName: "Ad-Dhuhaa", englishTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan", pageStart: 596, juzStart: 30 },
  { number: 94, name: "الشرح", arabicName: "سُورَةُ الشَّرْحِ", englishName: "Ash-Sharh", englishTranslation: "The Consolation", numberOfAyahs: 8, revelationType: "Meccan", pageStart: 596, juzStart: 30 },
  { number: 95, name: "التين", arabicName: "سُورَةُ التِّينِ", englishName: "At-Teen", englishTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan", pageStart: 597, juzStart: 30 },
  { number: 96, name: "العلق", arabicName: "سُورَةُ العَلَقِ", englishName: "Al-Alaq", englishTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan", pageStart: 597, juzStart: 30 },
  { number: 97, name: "القدر", arabicName: "سُورَةُ القَدْرِ", englishName: "Al-Qadr", englishTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 598, juzStart: 30 },
  { number: 98, name: "البينة", arabicName: "سُورَةُ البَيِّنَةِ", englishName: "Al-Bayyina", englishTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan", pageStart: 598, juzStart: 30 },
  { number: 99, name: "الزلزلة", arabicName: "سُورَةُ الزَّلْزَلَةِ", englishName: "Az-Zalzala", englishTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan", pageStart: 599, juzStart: 30 },
  { number: 100, name: "العاديات", arabicName: "سُورَةُ العَادِيَاتِ", englishName: "Al-Aadiyaat", englishTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan", pageStart: 599, juzStart: 30 },
  { number: 101, name: "القارعة", arabicName: "سُورَةُ القَارِعَةِ", englishName: "Al-Qaari'a", englishTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan", pageStart: 600, juzStart: 30 },
  { number: 102, name: "التكاثر", arabicName: "سُورَةُ التَّكَاثُرِ", englishName: "At-Takaathur", englishTranslation: "The Rivalry in world increase", numberOfAyahs: 8, revelationType: "Meccan", pageStart: 600, juzStart: 30 },
  { number: 103, name: "العصر", arabicName: "سُورَةُ العَصْرِ", englishName: "Al-Asr", englishTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan", pageStart: 601, juzStart: 30 },
  { number: 104, name: "الهمزة", arabicName: "سُورَةُ الهُمَزَةِ", englishName: "Al-Humaza", englishTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan", pageStart: 601, juzStart: 30 },
  { number: 105, name: "الفيل", arabicName: "سُورَةُ الفِيلِ", englishName: "Al-Feel", englishTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 601, juzStart: 30 },
  { number: 106, name: "قريش", arabicName: "سُورَةُ قُرَيْشٍ", englishName: "Quraish", englishTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan", pageStart: 602, juzStart: 30 },
  { number: 107, name: "الماعون", arabicName: "سُورَةُ المَاعُونِ", englishName: "Al-Maa'oon", englishTranslation: "The Small Kindnesses", numberOfAyahs: 7, revelationType: "Meccan", pageStart: 602, juzStart: 30 },
  { number: 108, name: "الكوثر", arabicName: "سُورَةُ الكَوْثَرِ", englishName: "Al-Kawthar", englishTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan", pageStart: 602, juzStart: 30 },
  { number: 109, name: "الكافرون", arabicName: "سُورَةُ الكَافِرُونَ", englishName: "Al-Kaafiroon", englishTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan", pageStart: 603, juzStart: 30 },
  { number: 110, name: "النصر", arabicName: "سُورَةُ النَّصْرِ", englishName: "An-Nasr", englishTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan", pageStart: 603, juzStart: 30 },
  { number: 111, name: "المسد", arabicName: "سُورَةُ المَسَدِ", englishName: "Al-Masad", englishTranslation: "The Palm Fibre", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 603, juzStart: 30 },
  { number: 112, name: "الإخلاص", arabicName: "سُورَةُ الإِخْلَاصِ", englishName: "Al-Ikhlaas", englishTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan", pageStart: 604, juzStart: 30 },
  { number: 113, name: "الفلق", arabicName: "سُورَةُ الفَلَقِ", englishName: "Al-Falaq", englishTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan", pageStart: 604, juzStart: 30 },
  { number: 114, name: "الناس", arabicName: "سُورَةُ النَّاسِ", englishName: "An-Naas", englishTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan", pageStart: 604, juzStart: 30 },
];

export const RECITERS_LIST: Reciter[] = [
  {
    id: "ar.alafasy",
    name: "Mishari Rashid al-Afasy",
    arabicName: "مشاري راشد العفاسي",
    style: "مرتل - حفص عن عاصم",
    subfolder: "Alafasy_128kbps",
    surahAudioPattern: (s) => `https://server8.mp3quran.net/afs/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Alafasy_128kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.abdulbasitmurattal",
    name: "AbdulBaset AbdulSamad",
    arabicName: "عبد الباسط عبد الصمد (مرتل)",
    style: "مرتل",
    subfolder: "Abdul_Basit_Murattal_192kbps",
    surahAudioPattern: (s) => `https://server7.mp3quran.net/basit/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    style: "مرتل - المصحف المعلم",
    subfolder: "Husary_128kbps",
    surahAudioPattern: (s) => `https://server13.mp3quran.net/husr/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Husary_128kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.minshawi",
    name: "Mohamed Siddiq Al-Minshawi",
    arabicName: "محمد صديق المنشاوي",
    style: "مرتل",
    subfolder: "Minshawy_Murattal_128kbps",
    surahAudioPattern: (s) => `https://server10.mp3quran.net/minsh/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Minshawy_Murattal_128kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.mahermuaiqly",
    name: "Maher Al-Muaiqly",
    arabicName: "ماهر المعيقلي",
    style: "إمام الحرم المكي",
    subfolder: "Maher_AlMuaiqly_64kbps",
    surahAudioPattern: (s) => `https://server12.mp3quran.net/maher/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Maher_AlMuaiqly_64kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.ghamadi",
    name: "Saad Al-Ghamdi",
    arabicName: "سعد الغامدي",
    style: "مرتل",
    subfolder: "Ghamadi_40kbps",
    surahAudioPattern: (s) => `https://server7.mp3quran.net/s_gmd/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Ghamadi_40kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.dossari",
    name: "Yasser Al-Dossari",
    arabicName: "ياسر الدوسري",
    style: "إمام المسجد الحرام",
    subfolder: "Yasser_Ad-Dussary_128kbps",
    surahAudioPattern: (s) => `https://server11.mp3quran.net/yasser/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.shuraym",
    name: "Saud Ash-Shuraym",
    arabicName: "سعود الشريم",
    style: "مرتل",
    subfolder: "Saood_ash-Shuraym_128kbps",
    surahAudioPattern: (s) => `https://server7.mp3quran.net/shur/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Saood_ash-Shuraym_128kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.sudais",
    name: "Abdur-Rahman As-Sudais",
    arabicName: "عبد الرحمن السديس",
    style: "إمام وخطيب المسجد الحرام",
    subfolder: "Abdurrahmaan_As-Sudais_192kbps",
    surahAudioPattern: (s) => `https://server11.mp3quran.net/sds/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  },
  {
    id: "ar.hudhaify",
    name: "Ali Al-Hudhaify",
    arabicName: "علي بن عبد الرحمن الحذيفي",
    style: "إمام المسجد النبوي",
    subfolder: "Hudhaify_128kbps",
    surahAudioPattern: (s) => `https://server9.mp3quran.net/hthfi/${String(s).padStart(3, '0')}.mp3`,
    ayahAudioPattern: (s, a) => `https://everyayah.com/data/Hudhaify_128kbps/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`
  }
];

// Helper to compute global ayah number (1 - 6236)
export function getGlobalAyahNumber(surahNum: number, ayahInSurah: number): number {
  let count = 0;
  for (let i = 0; i < surahNum - 1; i++) {
    count += SURAHS_LIST[i].numberOfAyahs;
  }
  return count + ayahInSurah;
}

export interface JuzInfo {
  juzNumber: number;
  arabicName: string;
  startSurahNumber: number;
  startSurahName: string;
  startAyahNumber: number;
  startAyahText: string;
  endSurahNumber: number;
  endSurahName: string;
  endAyahNumber: number;
  pageStart: number;
}

export const JUZ_LIST: JuzInfo[] = [
  { juzNumber: 1, arabicName: "الجزء الأول", startSurahNumber: 1, startSurahName: "الفاتحة", startAyahNumber: 1, startAyahText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", endSurahNumber: 2, endSurahName: "البقرة", endAyahNumber: 141, pageStart: 1 },
  { juzNumber: 2, arabicName: "الجزء الثاني (سَيَقُولُ)", startSurahNumber: 2, startSurahName: "البقرة", startAyahNumber: 142, startAyahText: "سَيَقُولُ السُّفَهَاءُ مِنَ النَّاسِ", endSurahNumber: 2, endSurahName: "البقرة", endAyahNumber: 252, pageStart: 22 },
  { juzNumber: 3, arabicName: "الجزء الثالث (تِلْكَ الرُّسُلُ)", startSurahNumber: 2, startSurahName: "البقرة", startAyahNumber: 253, startAyahText: "تِلْكَ الرُّسُلُ فَضَّلْنَا بَعْضَهُمْ عَلَىٰ بَعْضٍ", endSurahNumber: 3, endSurahName: "آل عمران", endAyahNumber: 92, pageStart: 42 },
  { juzNumber: 4, arabicName: "الجزء الرابع (لَنْ تَنَالُوا)", startSurahNumber: 3, startSurahName: "آل عمران", startAyahNumber: 93, startAyahText: "كُلُّ الطَّعَامِ كَانَ حِلًّا لِبَنِي إِسْرَائِيلَ", endSurahNumber: 4, endSurahName: "النساء", endAyahNumber: 23, pageStart: 62 },
  { juzNumber: 5, arabicName: "الجزء الخامس (وَالْمُحْصَنَاتُ)", startSurahNumber: 4, startSurahName: "النساء", startAyahNumber: 24, startAyahText: "وَالْمُحْصَنَاتُ مِنَ النِّسَاءِ إِلَّا مَا مَلَكَتْ أَيْمَانُكُمْ", endSurahNumber: 4, endSurahName: "النساء", endAyahNumber: 147, pageStart: 82 },
  { juzNumber: 6, arabicName: "الجزء السادس (لَا يُحِبُّ اللَّهُ)", startSurahNumber: 4, startSurahName: "النساء", startAyahNumber: 148, startAyahText: "لَا يُحِبُّ اللَّهُ الْجَهْرَ بِالسُّوءِ مِنَ الْقَوْلِ", endSurahNumber: 5, endSurahName: "المائدة", endAyahNumber: 81, pageStart: 102 },
  { juzNumber: 7, arabicName: "الجزء السابع (وَإِذَا سَمِعُوا)", startSurahNumber: 5, startSurahName: "المائدة", startAyahNumber: 82, startAyahText: "لَتَجِدَنَّ أَشَدَّ النَّاسِ عَدَاوَةً لِلَّذِينَ آمَنُوا الْيَهُودَ", endSurahNumber: 6, endSurahName: "الأنعام", endAyahNumber: 110, pageStart: 121 },
  { juzNumber: 8, arabicName: "الجزء الثامن (وَلَوْ أَنَّنَا)", startSurahNumber: 6, startSurahName: "الأنعام", startAyahNumber: 111, startAyahText: "وَلَوْ أَنَّنَا نَزَّلْنَا إِلَيْهِمُ الْمَلَائِكَةَ", endSurahNumber: 7, endSurahName: "الأعراف", endAyahNumber: 87, pageStart: 142 },
  { juzNumber: 9, arabicName: "الجزء التاسع (قَالَ الْمَلَأُ)", startSurahNumber: 7, startSurahName: "الأعراف", startAyahNumber: 88, startAyahText: "قَالَ الْمَلَأُ الَّذِينَ اسْتَكْبَرُوا مِنْ قَوْمِهِ", endSurahNumber: 8, endSurahName: "الأنفال", endAyahNumber: 40, pageStart: 162 },
  { juzNumber: 10, arabicName: "الجزء العاشر (وَاعْلَمُوا)", startSurahNumber: 8, startSurahName: "الأنفال", startAyahNumber: 41, startAyahText: "وَاعْلَمُوا أَنَّمَا غَنِمْتُمْ مِنْ شَيْءٍ", endSurahNumber: 9, endSurahName: "التوبة", endAyahNumber: 92, pageStart: 182 },
  { juzNumber: 11, arabicName: "الجزء الحادي عشر (يَعْتَذِرُونَ)", startSurahNumber: 9, startSurahName: "التوبة", startAyahNumber: 93, startAyahText: "إِنَّمَا السَّبِيلُ عَلَى الَّذِينَ يَسْتَأْذِنُونَكَ", endSurahNumber: 11, endSurahName: "هود", endAyahNumber: 5, pageStart: 201 },
  { juzNumber: 12, arabicName: "الجزء الثاني عشر (وَمَا مِنْ دَابَّةٍ)", startSurahNumber: 11, startSurahName: "هود", startAyahNumber: 6, startAyahText: "وَمَا مِنْ دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا", endSurahNumber: 12, endSurahName: "يوسف", endAyahNumber: 52, pageStart: 222 },
  { juzNumber: 13, arabicName: "الجزء الثالث عشر (وَمَا أُبَرِّئُ)", startSurahNumber: 12, startSurahName: "يوسف", startAyahNumber: 53, startAyahText: "وَمَا أُبَرِّئُ نَفْسِي إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ", endSurahNumber: 14, endSurahName: "إبراهيم", endAyahNumber: 52, pageStart: 242 },
  { juzNumber: 14, arabicName: "الجزء الرابع عشر (رُبَمَا)", startSurahNumber: 15, startSurahName: "الحجر", startAyahNumber: 1, startAyahText: "الر تِلْكَ آيَاتُ الْكِتَابِ وَقُرْآنٍ مُبِينٍ", endSurahNumber: 16, endSurahName: "النحل", endAyahNumber: 128, pageStart: 262 },
  { juzNumber: 15, arabicName: "الجزء الخامس عشر (سُبْحَانَ الَّذِي)", startSurahNumber: 17, startSurahName: "الإسراء", startAyahNumber: 1, startAyahText: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا", endSurahNumber: 18, endSurahName: "الكهف", endAyahNumber: 74, pageStart: 282 },
  { juzNumber: 16, arabicName: "الجزء السادس عشر (قَالَ أَلَمْ)", startSurahNumber: 18, startSurahName: "الكهف", startAyahNumber: 75, startAyahText: "قَالَ أَلَمْ أَقُلْ لَكَ إِنَّكَ لَنْ تَسْتَطِيعَ مَعِيَ صَبْرًا", endSurahNumber: 20, endSurahName: "طه", endAyahNumber: 135, pageStart: 302 },
  { juzNumber: 17, arabicName: "الجزء السابع عشر (اقْتَرَبَ)", startSurahNumber: 21, startSurahName: "الأنبياء", startAyahNumber: 1, startAyahText: "اقْتَرَبَ لِلنَّاسِ حِسَابُهُمْ وَهُمْ فِي غَفْلَةٍ مُعْرِضُونَ", endSurahNumber: 22, endSurahName: "الحج", endAyahNumber: 78, pageStart: 322 },
  { juzNumber: 18, arabicName: "الجزء الثامن عشر (قَدْ أَفْلَحَ)", startSurahNumber: 23, startSurahName: "المؤمنون", startAyahNumber: 1, startAyahText: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ", endSurahNumber: 25, endSurahName: "الفرقان", endAyahNumber: 20, pageStart: 342 },
  { juzNumber: 19, arabicName: "الجزء التاسع عشر (وَقَالَ الَّذِينَ)", startSurahNumber: 25, startSurahName: "الفرقان", startAyahNumber: 21, startAyahText: "وَقَالَ الَّذِينَ لَا يَرْجُونَ لِقَاءَنَا لَوْلَا أُنْزِلَ عَلَيْنَا الْمَلَائِكَةُ", endSurahNumber: 27, endSurahName: "النمل", endAyahNumber: 55, pageStart: 362 },
  { juzNumber: 20, arabicName: "الجزء العشرون (أَمَّنْ خَلَقَ)", startSurahNumber: 27, startSurahName: "النمل", startAyahNumber: 56, startAyahText: "فَمَا كَانَ جَوَابَ قَوْمِهِ إِلَّا أَنْ قَالُوا أَخْرِجُوا آلَ لُوطٍ", endSurahNumber: 29, endSurahName: "العنكبوت", endAyahNumber: 45, pageStart: 382 },
  { juzNumber: 21, arabicName: "الجزء الحادي والعشرون (اتْلُ مَا أُوحِيَ)", startSurahNumber: 29, startSurahName: "العنكبوت", startAyahNumber: 46, startAyahText: "وَلَا تُجَادِلُوا أَهْلَ الْكِتَابِ إِلَّا بِالَّتِي هِيَ أَحْسَنُ", endSurahNumber: 33, endSurahName: "الأحزاب", endAyahNumber: 30, pageStart: 402 },
  { juzNumber: 22, arabicName: "الجزء الثاني والعشرون (وَمَنْ يَقْنُتْ)", startSurahNumber: 33, startSurahName: "الأحزاب", startAyahNumber: 31, startAyahText: "وَمَنْ يَقْنُتْ مِنْكُنَّ لِلَّهِ وَرَسُولِهِ وَتَعْمَلْ صَالِحًا", endSurahNumber: 36, endSurahName: "يس", endAyahNumber: 27, pageStart: 422 },
  { juzNumber: 23, arabicName: "الجزء الثالث والعشرون (وَمَا أَنْزَلْنَا)", startSurahNumber: 36, startSurahName: "يس", startAyahNumber: 28, startAyahText: "وَمَا أَنْزَلْنَا عَلَىٰ قَوْمِهِ مِنْ بَعْدِهِ مِنْ جُنْدٍ مِنَ السَّمَاءِ", endSurahNumber: 39, endSurahName: "الزمر", endAyahNumber: 31, pageStart: 442 },
  { juzNumber: 24, arabicName: "الجزء الرابع والعشرون (فَمَنْ أَظْلَمُ)", startSurahNumber: 39, startSurahName: "الزمر", startAyahNumber: 32, startAyahText: "فَمَنْ أَظْلَمُ مِمَّنْ كَذَبَ عَلَى اللَّهِ وَكَذَّبَ بِالصِّدْقِ", endSurahNumber: 41, endSurahName: "فصلت", endAyahNumber: 46, pageStart: 462 },
  { juzNumber: 25, arabicName: "الجزء الخامس والعشرون (إِلَيْهِ يُرَدُّ)", startSurahNumber: 41, startSurahName: "فصلت", startAyahNumber: 47, startAyahText: "إِلَيْهِ يُرَدُّ عِلْمُ السَّاعَةِ", endSurahNumber: 45, endSurahName: "الجاثية", endAyahNumber: 37, pageStart: 482 },
  { juzNumber: 26, arabicName: "الجزء السادس والعشرون (حم)", startSurahNumber: 46, startSurahName: "الأحقاف", startAyahNumber: 1, startAyahText: "حم * تَنْزِيلُ الْكِتَابِ مِنَ اللَّهِ الْعَزِيزِ الْحَكِيمِ", endSurahNumber: 51, endSurahName: "الذاريات", endAyahNumber: 30, pageStart: 502 },
  { juzNumber: 27, arabicName: "الجزء السابع والعشرون (قَالَ فَمَا خَطْبُكُمْ)", startSurahNumber: 51, startSurahName: "الذاريات", startAyahNumber: 31, startAyahText: "قَالَ فَمَا خَطْبُكُمْ أَيُّهَا الْمُرْسَلُونَ", endSurahNumber: 57, endSurahName: "الحديد", endAyahNumber: 29, pageStart: 522 },
  { juzNumber: 28, arabicName: "الجزء الثامن والعشرون (قَدْ سَمِعَ)", startSurahNumber: 58, startSurahName: "المجادلة", startAyahNumber: 1, startAyahText: "قَدْ سَمِعَ اللَّهُ قَوْلَ الَّتِي تُجَادِلُكَ فِي زَوْجِهَا", endSurahNumber: 66, endSurahName: "التحريم", endAyahNumber: 12, pageStart: 542 },
  { juzNumber: 29, arabicName: "الجزء التاسع والعشرون (تَبَارَكَ الَّذِي)", startSurahNumber: 67, startSurahName: "الملك", startAyahNumber: 1, startAyahText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", endSurahNumber: 77, endSurahName: "المرسلات", endAyahNumber: 50, pageStart: 562 },
  { juzNumber: 30, arabicName: "الجزء الثلاثون (عَمَّ يَتَسَاءَلُونَ)", startSurahNumber: 78, startSurahName: "النبأ", startAyahNumber: 1, startAyahText: "عَمَّ يَتَسَاءَلُونَ * عَنِ النَّبَإِ الْعَظِيمِ", endSurahNumber: 114, endSurahName: "الناس", endAyahNumber: 6, pageStart: 582 },
];

export const AZKAR_DATA: ZikrItem[] = [
  {
    id: "m_1",
    category: "morning",
    title: "سيد الاستغفار",
    text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
    repeat: 1,
    count: 0,
    reward: "من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة، وكذلك حين يصبح.",
    source: "صحيح البخاري"
  },
  {
    id: "m_2",
    category: "morning",
    title: "آية الكرسي",
    text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    repeat: 1,
    count: 0,
    reward: "من قالها حين يصبح أُجير من الجن حتى يمسي، ومن قالها حين يمسي أُجير منهم حتى يصبح.",
    source: "صحيح الترغيب"
  },
  {
    id: "m_3",
    category: "morning",
    title: "الإخلاص والمعوذتين",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
    repeat: 3,
    count: 0,
    reward: "تكفيك من كل شيء.",
    source: "سنن أبي داود والترمذي"
  },
  {
    id: "m_4",
    category: "morning",
    title: "أصبحنا وأصبح الملك لله",
    text: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا اليَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا اليَوْمِ وَشَرِّ مَا بَعْدَهُ.",
    repeat: 1,
    count: 0,
    reward: "طلب الخير والاستعاذة من الشر والكسل وسوء الكبر.",
    source: "صحيح مسلم"
  },
  {
    id: "m_5",
    category: "morning",
    title: "بسم الله الذي لا يضر مع اسمه شيء",
    text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
    repeat: 3,
    count: 0,
    reward: "لم يضره شيء.",
    source: "سنن أبي داود والترمذي"
  },
  {
    id: "m_6",
    category: "morning",
    title: "رضيت بالله رباً",
    text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.",
    repeat: 3,
    count: 0,
    reward: "كان حقاً على الله أن يرضيه يوم القيامة.",
    source: "مسند أحمد والترمذي"
  },
  {
    id: "m_7",
    category: "morning",
    title: "يا حي يا قيوم",
    text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
    repeat: 1,
    count: 0,
    reward: "صلاح الشأن كله والتبرؤ من الحول والقوة.",
    source: "سنن النسائي"
  },
  {
    id: "m_8",
    category: "morning",
    title: "الصلاة على النبي ﷺ",
    text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.",
    repeat: 10,
    count: 0,
    reward: "من صلى علي حين يصبح عشراً وحين يمسي عشراً أدركته شفاعتي يوم القيامة.",
    source: "رواه الطبراني"
  },
  {
    id: "e_1",
    category: "evening",
    title: "أمسينا وأمسى الملك لله",
    text: "أَمْسَيْنَا وَأَمْسَى المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا.",
    repeat: 1,
    count: 0,
    reward: "حفظ العبد واستعاذته بربه في المساء.",
    source: "صحيح مسلم"
  },
  {
    id: "e_2",
    category: "evening",
    title: "أعوذ بكلمات الله التامات من شر ما خلق",
    text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
    repeat: 3,
    count: 0,
    reward: "لم يضره شيء تلك الليلة.",
    source: "صحيح مسلم"
  },
  {
    id: "p_1",
    category: "after_prayer",
    title: "الاستغفار بعد الصلاة",
    text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ.",
    repeat: 1,
    count: 0,
    reward: "سنة نبوية بعد الفريضة مباشرة.",
    source: "صحيح مسلم"
  },
  {
    id: "p_2",
    category: "after_prayer",
    title: "التسبيح والتحميد والتكبير",
    text: "سُبْحَانَ اللَّهِ (33) ، الحَمْدُ لِلَّهِ (33) ، اللَّهُ أَكْبَرُ (33) ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    repeat: 33,
    count: 0,
    reward: "غفرت خطاياه وإن كانت مثل زبد البحر.",
    source: "صحيح مسلم"
  },
  {
    id: "q_1",
    category: "quran_duas",
    title: "دعاء الهداية والثبات",
    text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
    repeat: 1,
    count: 0,
    reward: "سورة آل عمران، الآية 8",
    source: "القرآن الكريم"
  },
  {
    id: "q_2",
    category: "quran_duas",
    title: "دعاء المغفرة والرحمة",
    text: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    repeat: 1,
    count: 0,
    reward: "سورة الأعراف، الآية 23",
    source: "القرآن الكريم"
  },
  {
    id: "q_3",
    category: "quran_duas",
    title: "دعاء تيسير الأمور والشرح",
    text: "رَبِّ اشْرَحْ لِي صَدْرِي * وَيَسِّرْ لِي أَمْرِي * وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي * يَفْقَهُوا قَوْلِي",
    repeat: 1,
    count: 0,
    reward: "سورة طه، الآيات 25-28",
    source: "القرآن الكريم"
  },
  {
    id: "q_4",
    category: "quran_duas",
    title: "دعاء الذرية الصالحة والزوج",
    text: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    repeat: 1,
    count: 0,
    reward: "سورة الفرقان، الآية 74",
    source: "القرآن الكريم"
  }
];

// Fallback offline Surahs (Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kafirun, Al-Kawthar, Al-Asr)
export const OFFLINE_SURAHS: Record<number, { text: string; translation: string; tafsir: string }[]> = {
  1: [
    { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", tafsir: "أبتدئ قراءتي باسم الله مستعينا به، (الله) علم على الرب تبارك وتعالى، (الرحمن) ذو الرحمة العامة، (الرحيم) ذو الرحمة الخاصة بالمؤمنين." },
    { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "[All] praise is [due] to Allah, Lord of the worlds -", tafsir: "الثناء التام الكامل لله وحده، خالق كل شيء ومدبره ومربيه بنعمه." },
    { text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful,", tafsir: "الذي اتصف بالرحمة الواسعة العظيمة التي وسعت كل شيء." },
    { text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense.", tafsir: "المالك المتصرف في يوم القيامة والجزاء والحساب وحده لا شريك له." },
    { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help.", tafsir: "نخصك وحدك بالعبادة، ونستعين بك وحدك في جميع أمورنا." },
    { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path -", tafsir: "دلنا وأرشدنا وثبتنا على الطريق الواضح المستقيم، وهو دين الإسلام." },
    { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", tafsir: "طريق النبيين والصديقين والشهداء والصالحين، غير طريق المغضوب عليهم (اليهود) ولا الضالين (النصارى)." }
  ],
  112: [
    { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Say, 'He is Allah, [who is] One,", tafsir: "قل أيها الرسول: هو الله الواحد الأحد، الذي لا شبيه له ولا مثيل." },
    { text: "اللَّهُ الصَّمَدُ", translation: "Allah, the Eternal Refuge.", tafsir: "السيد الذي كمل في سؤدده، وتصمد إليه الخلائق في حوائجها." },
    { text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born,", tafsir: "ليس له ولد ولا والد ولا صاحبة، تنزه سبحانه." },
    { text: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", translation: "Nor is there to Him any equivalent.'", tafsir: "ولم يكن له مماثل ولا مكافئ في أسمائه وصفاته وأفعاله." }
  ],
  113: [
    { text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "Say, 'I seek refuge in the Lord of daybreak", tafsir: "قل: أستعيذ وأعتصم برب الصبح وفالقه بنوره." },
    { text: "مِنْ شَرِّ مَا خَلَقَ", translation: "From the evil of that which He created", tafsir: "من شر كل مخلوق فيه شر من إنس وجن وحيوان." },
    { text: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ", translation: "And from the evil of darkness when it settles", tafsir: "ومن شر الليل المظلم إذا دخل واشتدت ظلمته وما ينتشر فيه." },
    { text: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translation: "And from the evil of the blowers in knots", tafsir: "ومن شر السواحر اللاتي ينفثن في العقد طلباً للإضرار." },
    { text: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "And from the evil of an envier when he envies.'", tafsir: "ومن شر الحاسد إذا أظهر حسده وتمنى زوال نعمة المحسود." }
  ],
  114: [
    { text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Say, 'I seek refuge in the Lord of mankind,", tafsir: "قل: ألتجئ وأعتصم برب الناس وخالقهم ومدبر أمورهم." },
    { text: "مَلِكِ النَّاسِ", translation: "The Sovereign of mankind,", tafsir: "ملكهم المتصرف فيهم بما يشاء." },
    { text: "إِلَٰهِ النَّاسِ", translation: "The God of mankind,", tafsir: "معبودهم الحق الذي لا معبود سواه." },
    { text: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", translation: "From the evil of the retreating whisperer -", tafsir: "من شر الشيطان الذي يوسوس عند الغفلة ويخنس ويتأخر عند ذكر الله." },
    { text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", translation: "Who whispers into the breasts of mankind -", tafsir: "الذي يلقي الشكوك والشرور في قلوب الناس." },
    { text: "مِنَ الْجِنَّةِ وَالنَّاسِ", translation: "From among the jinn and mankind.'", tafsir: "سواء كان الوسواس من شياطين الجن أو من شياطين الإنس." }
  ]
};
