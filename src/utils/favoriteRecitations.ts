import { FavoriteRecitation, Reciter, SurahMeta } from '../types';
import { SURAHS_LIST, RECITERS_LIST } from '../data/quranData';

const FAVORITE_RECITATIONS_STORAGE_KEY = 'ayat_favorite_recitations_v1';

export const CURATED_RECOMMENDED_RECITATIONS: Omit<FavoriteRecitation, 'id' | 'timestamp'>[] = [
  {
    surahNumber: 18,
    surahName: "الكهف",
    surahArabicName: "سُورَةُ الكَهْفِ",
    reciterId: "ar.alafasy",
    reciterName: "Mishari Rashid al-Afasy",
    reciterArabicName: "مشاري راشد العفاسي",
    tags: ["يوم الجمعة", "خاشعة"],
    notes: "تلاوة ندية محببة ليوم الجمعة المبارك"
  },
  {
    surahNumber: 19,
    surahName: "مريم",
    surahArabicName: "سُورَةُ مَرْيَمَ",
    reciterId: "ar.abdulbasitmurattal",
    reciterName: "AbdulBaset AbdulSamad",
    reciterArabicName: "عبد الباسط عبد الصمد (مرتل)",
    tags: ["خاشعة", "تجويد بديع"],
    notes: "تلاوة تاريخية مؤثرة تفيض خشوعاً وسكينة"
  },
  {
    surahNumber: 2,
    surahName: "البقرة",
    surahArabicName: "سُورَةُ البَقَرَةِ",
    reciterId: "ar.ghamadi",
    reciterName: "Saad Al-Ghamdi",
    reciterArabicName: "سعد الغامدي",
    tags: ["تحصين وبركة", "منزل"],
    notes: "تلاوة هادئة ومرتلة لسنام القرآن وبركة البيت"
  },
  {
    surahNumber: 36,
    surahName: "يس",
    surahArabicName: "سُورَةُ يس",
    reciterId: "ar.mahermuaiqly",
    reciterName: "Maher Al-Muaiqly",
    reciterArabicName: "ماهر المعيقلي",
    tags: ["تراويح", "الحرم المكي"],
    notes: "نبرة حجازية مهيبة من إمام الحرم المكي الشريف"
  },
  {
    surahNumber: 55,
    surahName: "الرحمن",
    surahArabicName: "سُورَةُ الرَّحْمَٰنِ",
    reciterId: "ar.minshawi",
    reciterName: "Mohamed Siddiq Al-Minshawi",
    reciterArabicName: "محمد صديق المنشاوي",
    tags: ["خاشعة", "عروس القرآن"],
    notes: "الصوت الباكي ذو النغم المؤثر والتدبر العميق"
  },
  {
    surahNumber: 67,
    surahName: "الملك",
    surahArabicName: "سُورَةُ المُلْكِ",
    reciterId: "ar.dossari",
    reciterName: "Yasser Al-Dossari",
    reciterArabicName: "ياسر الدوسري",
    tags: ["أذكار النوم", "المنجية"],
    notes: "قراءة ليلية خاشعة ومريحة للنفس قبل النوم"
  },
  {
    surahNumber: 50,
    surahName: "ق",
    surahArabicName: "سُورَةُ ق",
    reciterId: "ar.husary",
    reciterName: "Mahmoud Khalil Al-Husary",
    reciterArabicName: "محمود خليل الحصري",
    tags: ["فجر", "إتقان ومخارج"],
    notes: "شيخ المقارئ المصرية بأعلى درجات الضبط والترتيل"
  }
];

export function getInitialFavoriteRecitations(): FavoriteRecitation[] {
  const baseTime = Date.now();
  return CURATED_RECOMMENDED_RECITATIONS.map((item, idx) => ({
    ...item,
    id: `fav-rec-${item.surahNumber}-${item.reciterId}`,
    timestamp: baseTime - (idx * 3600000)
  }));
}

export function loadFavoriteRecitations(): FavoriteRecitation[] {
  try {
    const raw = localStorage.getItem(FAVORITE_RECITATIONS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialFavoriteRecitations();
      saveFavoriteRecitations(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialFavoriteRecitations();
  } catch (err) {
    console.warn('Error loading favorite recitations:', err);
    return getInitialFavoriteRecitations();
  }
}

export function saveFavoriteRecitations(items: FavoriteRecitation[]): void {
  try {
    localStorage.setItem(FAVORITE_RECITATIONS_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Error saving favorite recitations:', err);
  }
}

export function isFavoriteRecitation(
  favorites: FavoriteRecitation[],
  surahNumber: number,
  reciterId: string
): boolean {
  return favorites.some(
    (f) => f.surahNumber === surahNumber && f.reciterId === reciterId
  );
}

export function isRecitationFavorited(
  surahNumber: number,
  reciterId: string
): boolean {
  const current = loadFavoriteRecitations();
  return isFavoriteRecitation(current, surahNumber, reciterId);
}

export function toggleFavoriteRecitation(
  surahNumber: number,
  reciterId: string,
  tags?: string[],
  notes?: string
): FavoriteRecitation[] {
  const current = loadFavoriteRecitations();
  const surah = SURAHS_LIST.find((s) => s.number === surahNumber);
  const reciter = RECITERS_LIST.find((r) => r.id === reciterId);

  if (!surah || !reciter) return current;

  const { updated } = toggleFavoriteRecitationHelper(current, surah, reciter, tags, notes);
  return updated;
}

export function toggleFavoriteRecitationHelper(
  favorites: FavoriteRecitation[],
  surah: SurahMeta,
  reciter: Reciter,
  tags?: string[],
  notes?: string
): { updated: FavoriteRecitation[]; isAdded: boolean } {
  const existingIndex = favorites.findIndex(
    (f) => f.surahNumber === surah.number && f.reciterId === reciter.id
  );

  if (existingIndex >= 0) {
    // Remove
    const updated = favorites.filter((_, idx) => idx !== existingIndex);
    saveFavoriteRecitations(updated);
    return { updated, isAdded: false };
  } else {
    // Add
    const newFav: FavoriteRecitation = {
      id: `fav-rec-${surah.number}-${reciter.id}-${Date.now()}`,
      surahNumber: surah.number,
      surahName: surah.name,
      surahArabicName: surah.arabicName,
      reciterId: reciter.id,
      reciterName: reciter.name,
      reciterArabicName: reciter.arabicName,
      timestamp: Date.now(),
      tags: tags && tags.length > 0 ? tags : ['تلاوة مفضلة'],
      notes: notes || `سورة ${surah.name} بصوت الشيخ ${reciter.arabicName}`
    };
    const updated = [newFav, ...favorites];
    saveFavoriteRecitations(updated);
    return { updated, isAdded: true };
  }
}
