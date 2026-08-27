import { Ayah, SurahDetail, ReadingSettings, Bookmark, KhatmaPlan, LastRead, PageDetail, PageAyah } from '../types';
import { SURAHS_LIST, OFFLINE_SURAHS } from '../data/quranData';
import { createDefaultSmartKhatma, generateSmartKhatmaSchedule, DEFAULT_KHATMA_REMINDERS } from './khatmaPlanner';

// Arabic search normalization
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Normalize Alefs
    .replace(/[إأآٱ]/g, 'ا')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Normalize Yaa / Alef Maqsura
    .replace(/[ىي]/g, 'ي')
    // Normalize Hamza variants
    .replace(/[ؤئ]/g, 'ء')
    // Remove tatweel / kashida
    .replace(/\u0640/g, '')
    .trim()
    .toLowerCase();
}

// In-memory cache for loaded surahs and pages
const surahCache = new Map<number, SurahDetail>();
const pageCache = new Map<number, PageDetail>();

export function getTranslationEdition(lang: string): string {
  switch (lang) {
    case 'fr':
      return 'fr.hamidullah';
    case 'ur':
      return 'ur.jalandhry';
    case 'id':
      return 'id.indonesian';
    case 'tr':
      return 'tr.diyanet';
    case 'es':
      return 'es.cortes';
    case 'de':
      return 'de.aburida';
    case 'ru':
      return 'ru.kuliev';
    case 'bn':
      return 'bn.bengali';
    case 'en':
    default:
      return 'en.sahih';
  }
}

export async function fetchPageDetail(
  pageNumber: number,
  reciterId: string = 'ar.alafasy',
  translationLang: string = 'en',
  tafsirSource: string = 'muyassar'
): Promise<PageDetail> {
  const safePage = Math.min(Math.max(pageNumber, 1), 604);
  const cacheKey = safePage;
  if (pageCache.has(cacheKey)) {
    return pageCache.get(cacheKey)!;
  }

  try {
    const transEdition = getTranslationEdition(translationLang);
    const tafsirEdition = tafsirSource === 'saadi' ? 'ar.saadi' : 'ar.muyassar';

    const url = `https://api.alquran.cloud/v1/page/${safePage}/editions/quran-uthmani,${reciterId},${transEdition},${tafsirEdition}`;
    const response = await fetch(url, { cache: 'force-cache' });

    if (!response.ok) {
      throw new Error(`فشل تحميل بيانات الصفحة ${safePage}`);
    }

    const json = await response.json();
    if (!json.data || json.data.length === 0) {
      throw new Error('استجابة غير صحيحة');
    }

    const arabicData = json.data[0];
    const audioData = json.data[1] || arabicData;
    const transData = json.data[2] || arabicData;
    const tafsirData = json.data[3] || arabicData;

    const pageAyahs: PageAyah[] = arabicData.ayahs.map((a: any, idx: number) => {
      const surahNum = a.surah?.number || 1;
      const surahMeta = SURAHS_LIST.find((s) => s.number === surahNum);
      let rawText = a.text;

      // Handle bismillah stripping for verse 1 except Fatihah & Tawbah
      if (surahNum !== 1 && surahNum !== 9 && a.numberInSurah === 1 && rawText.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')) {
        rawText = rawText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
        if (!rawText) rawText = a.text;
      }

      return {
        number: a.number,
        numberInSurah: a.numberInSurah,
        surahNumber: surahNum,
        surahName: surahMeta?.name || a.surah?.name || `سورة ${surahNum}`,
        text: rawText,
        translation: transData.ayahs?.[idx]?.text || '',
        tafsir: tafsirData.ayahs?.[idx]?.text || '',
        audio: audioData.ayahs?.[idx]?.audio || `https://cdn.islamic.network/quran/audio/128/${reciterId}/${a.number}.mp3`,
        page: a.page || safePage,
        juz: a.juz || 1,
        hizbQuarter: a.hizbQuarter,
        sajda: Boolean(a.sajda)
      };
    });

    const pageDetail: PageDetail = {
      pageNumber: safePage,
      juzNumber: pageAyahs[0]?.juz || 1,
      ayahs: pageAyahs
    };

    pageCache.set(cacheKey, pageDetail);
    return pageDetail;
  } catch (error) {
    console.warn(`Fallback for page ${safePage}:`, error);
    // If page fetch fails, generate from local surahs or throw friendly error
    throw new Error(`تعذر تحميل الصفحة ${safePage}. يرجى التحقق من اتصالك بالإنترنت.`);
  }
}

export async function fetchSurahDetail(
  surahNumber: number,
  reciterId: string = 'ar.alafasy',
  translationLang: string = 'en',
  tafsirSource: string = 'muyassar'
): Promise<SurahDetail> {
  const meta = SURAHS_LIST.find((s) => s.number === surahNumber);
  if (!meta) {
    throw new Error(`سورة رقم ${surahNumber} غير موجودة`);
  }

  // Check cache first
  const cacheKey = surahNumber;
  if (surahCache.has(cacheKey)) {
    return surahCache.get(cacheKey)!;
  }

  try {
    // We request arabic uthmanic text, audio edition, translation edition, and tafsir edition in a single unified call
    // AlQuran Cloud API allows multiple editions in one request: /v1/surah/{number}/editions/quran-uthmani,ar.alafasy,en.sahih,ar.muyassar
    const transEdition = getTranslationEdition(translationLang);
    const tafsirEdition = tafsirSource === 'saadi' ? 'ar.saadi' : 'ar.muyassar';

    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${reciterId},${transEdition},${tafsirEdition}`;
    const response = await fetch(url, { cache: 'force-cache' });
    
    if (!response.ok) {
      throw new Error('فشل جلب بيانات السورة من الخادم');
    }

    const json = await response.json();
    if (!json.data || json.data.length === 0) {
      throw new Error('استجابة غير صحيحة');
    }

    const arabicData = json.data[0];
    const audioData = json.data[1] || arabicData;
    const transData = json.data[2] || arabicData;
    const tafsirData = json.data[3] || arabicData;

    const ayahs: Ayah[] = arabicData.ayahs.map((a: any, idx: number) => {
      let rawText = a.text;
      // In surah 1 or with bismillah prefix in verse 1 of other surahs, handle clean display
      if (surahNumber !== 1 && surahNumber !== 9 && idx === 0 && rawText.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")) {
        rawText = rawText.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim();
        if (!rawText) rawText = a.text;
      }

      return {
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: rawText,
        translation: transData.ayahs?.[idx]?.text || '',
        tafsir: tafsirData.ayahs?.[idx]?.text || '',
        audio: audioData.ayahs?.[idx]?.audio || `https://cdn.islamic.network/quran/audio/128/${reciterId}/${a.number}.mp3`,
        page: a.page,
        juz: a.juz,
        hizbQuarter: a.hizbQuarter,
        sajda: Boolean(a.sajda)
      };
    });

    const surahDetail: SurahDetail = {
      ...meta,
      ayahs
    };

    surahCache.set(cacheKey, surahDetail);
    return surahDetail;
  } catch (error) {
    console.warn(`Fallback to offline data or mirror for Surah ${surahNumber}:`, error);

    // If we have offline data for this surah
    if (OFFLINE_SURAHS[surahNumber]) {
      const offlineAyahs: Ayah[] = OFFLINE_SURAHS[surahNumber].map((o, idx) => ({
        number: meta.pageStart + idx,
        numberInSurah: idx + 1,
        text: o.text,
        translation: o.translation,
        tafsir: o.tafsir,
        audio: `https://cdn.islamic.network/quran/audio/128/${reciterId}/${meta.number === 1 ? idx + 1 : idx + 1}.mp3`,
        page: meta.pageStart,
        juz: meta.juzStart
      }));

      const detail: SurahDetail = {
        ...meta,
        ayahs: offlineAyahs
      };
      return detail;
    }

    // Secondary fallback: fetch simple text from Quran API mirror
    try {
      const mirrorUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
      const res = await fetch(mirrorUrl);
      const resJson = await res.json();
      const ayahs: Ayah[] = resJson.data.ayahs.map((a: any) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: a.text,
        audio: `https://cdn.islamic.network/quran/audio/128/${reciterId}/${a.number}.mp3`,
        page: a.page,
        juz: a.juz
      }));

      const detail: SurahDetail = {
        ...meta,
        ayahs
      };
      surahCache.set(cacheKey, detail);
      return detail;
    } catch (e) {
      throw new Error(`تعذر تحميل سورة ${meta.name}. يرجى التحقق من اتصال الإنترنت`);
    }
  }
}

export async function getAyahTranslationText(
  surahNumber: number,
  ayahInSurah: number,
  languageCode: string = 'en',
  tafsirSource: string = 'muyassar'
): Promise<string> {
  try {
    if (languageCode === 'ar_tafsir') {
      const detail = await fetchSurahDetail(surahNumber, 'ar.alafasy', 'en', tafsirSource);
      const ayah = detail.ayahs.find((a) => a.numberInSurah === ayahInSurah);
      return ayah?.tafsir || '';
    }

    const detail = await fetchSurahDetail(surahNumber, 'ar.alafasy', languageCode, tafsirSource);
    const ayah = detail.ayahs.find((a) => a.numberInSurah === ayahInSurah);
    return ayah?.translation || '';
  } catch (err) {
    console.warn('Error fetching ayah translation text:', err);
    return '';
  }
}

// Local Storage Keys & Helpers
const SETTINGS_KEY = 'ayat_quran_settings';
const BOOKMARKS_KEY = 'ayat_quran_bookmarks';
const KHATMA_KEY = 'ayat_quran_khatma';
const LAST_READ_KEY = 'ayat_quran_last_read';

export const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 30,
  fontFamily: 'quran',
  viewType: 'ayah_list',
  readingScope: 'surah',
  showTranslation: true,
  showTafsir: false,
  highlightSpokenWord: true,
  translationLang: 'en',
  tafsirSource: 'muyassar',
  autoScroll: true,
  theme: 'emerald',
  readerBackgroundId: 'solid_default',
  readerBackgroundType: 'solid',
  readerBackgroundOverlay: 60,
  readerWallpaperBlur: false,
  ttsEnabled: false,
  ttsSyncMode: 'consecutive',
  ttsLanguage: 'en',
  ttsSpeed: 1.0,
  ttsVolume: 1.0
};

export function loadSettings(): ReadingSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ReadingSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadBookmarks(): Bookmark[] {
  try {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks:', e);
  }
}

export function loadKhatma(): KhatmaPlan {
  try {
    const saved = localStorage.getItem(KHATMA_KEY);
    if (saved) {
      const parsed: KhatmaPlan = JSON.parse(saved);
      // Backfill smart schedule if it was an older static format
      if (!parsed.schedule || parsed.schedule.length === 0) {
        parsed.schedule = generateSmartKhatmaSchedule(
          parsed.targetDays || 30,
          parsed.startDate || new Date().toISOString().split('T')[0],
          parsed.startFromPage || 1
        );
      }
      if (!parsed.reminderSettings) {
        parsed.reminderSettings = DEFAULT_KHATMA_REMINDERS;
      }
      if (parsed.streak === undefined) {
        parsed.streak = 0;
      }
      return parsed;
    }
    return createDefaultSmartKhatma(30, 'ختمة رمضان المباركة', 1);
  } catch {
    return createDefaultSmartKhatma(30, 'ختمة رمضان المباركة', 1);
  }
}

export function saveKhatma(khatma: KhatmaPlan): void {
  try {
    localStorage.setItem(KHATMA_KEY, JSON.stringify(khatma));
  } catch (e) {
    console.error('Failed to save khatma:', e);
  }
}

export function loadLastRead(): LastRead | null {
  try {
    const saved = localStorage.getItem(LAST_READ_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveLastRead(lastRead: LastRead): void {
  try {
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
  } catch (e) {
    console.error('Failed to save last read:', e);
  }
}
