export type ViewMode = 'surahs' | 'juz' | 'reader' | 'reciters' | 'azkar' | 'bookmarks' | 'khatma' | 'learning';

export interface SurahMeta {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  pageStart: number;
  juzStart: number;
}

export interface Ayah {
  number: number; // Global number 1 - 6236
  numberInSurah: number;
  text: string;
  translation?: string;
  tafsir?: string;
  audio?: string;
  page?: number;
  juz?: number;
  hizbQuarter?: number;
  sajda?: boolean;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  subfolder: string;
  surahAudioPattern: (surahNum: number) => string;
  ayahAudioPattern?: (surahNum: number, ayahInSurah: number) => string;
  serverUrl?: string;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  timestamp: number;
  note?: string;
}

export interface FavoriteRecitation {
  id: string;
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  reciterId: string;
  reciterName: string;
  reciterArabicName: string;
  timestamp: number;
  tags?: string[]; // e.g. "خاشعة", "تراويح", "فجر", "يوم الجمعة", "تهجد"
  notes?: string;
}

export interface KhatmaPrayerPortion {
  fromPage: number;
  toPage: number;
  pages: number;
}

export interface KhatmaPrayerBreakdown {
  fajr: KhatmaPrayerPortion;
  dhuhr: KhatmaPrayerPortion;
  asr: KhatmaPrayerPortion;
  maghrib: KhatmaPrayerPortion;
  isha: KhatmaPrayerPortion;
}

export interface KhatmaScheduleDay {
  dayNumber: number;
  dateStr: string;
  fromPage: number;
  toPage: number;
  pageCount: number;
  juzStart: number;
  juzEnd: number;
  surahStartName: string;
  surahEndName: string;
  isCompleted: boolean;
  completedAt?: number;
  prayerBreakdown?: KhatmaPrayerBreakdown;
}

export interface KhatmaReminderSettings {
  enabled: boolean;
  time: string; // "07:30"
  reminderSlot: 'fajr' | 'morning' | 'after_asr' | 'evening' | 'custom';
  soundEnabled: boolean;
  browserNotifications: boolean;
}

export interface KhatmaPlan {
  id: string;
  name: string;
  targetDays: number;
  startDate: string;
  endDate?: string;
  currentPage: number;
  currentJuz: number;
  currentSurah: number;
  currentAyah: number;
  completedPages: number[];
  notes?: string;
  // Smart Planner Additions
  paceStrategy?: 'per_prayer' | 'morning_evening' | 'single_session';
  startFromPage?: number;
  schedule?: KhatmaScheduleDay[];
  reminderSettings?: KhatmaReminderSettings;
  streak?: number;
  lastReadDate?: string;
  isFinished?: boolean;
}

export interface ZikrItem {
  id: string;
  category: 'morning' | 'evening' | 'after_prayer' | 'quran_duas' | 'sleep';
  title: string;
  text: string;
  repeat: number;
  count: number;
  reward?: string;
  source?: string;
}

export type TranslationLangCode = 'en' | 'fr' | 'ur' | 'id' | 'tr' | 'es' | 'de' | 'ru' | 'bn';

export type TTSSyncMode = 'consecutive' | 'simultaneous' | 'only_tts' | 'off';

export interface TTSSettings {
  enabled: boolean;
  language: string; // TranslationLangCode | 'ar_tafsir'
  syncMode: TTSSyncMode; // 'consecutive': تلاوة ثم ترجمة آية بآية, 'simultaneous': متزامن بالتوازي, 'only_tts': ترجمة صوتية فقط, 'off': إيقاف
  speed: number; // 0.75 - 1.5
  volume: number; // 0.1 - 1
  voiceURI?: string;
}

export interface ReadingSettings {
  fontSize: number; // e.g. 24 - 44
  fontFamily: 'quran' | 'amiri' | 'cairo';
  viewType: 'ayah_list' | 'mushaf_page';
  readingScope: 'surah' | 'page'; // Read by Surah or by Page (1-604)
  showTranslation: boolean;
  showTafsir: boolean;
  highlightSpokenWord: boolean; // Real-time word-by-word synchronized audio highlighting
  translationLang: TranslationLangCode;
  tafsirSource: 'muyassar' | 'saadi' | 'ibnkathir';
  autoScroll: boolean;
  theme: 'emerald' | 'dark' | 'parchment';
  readerBackgroundId?: string;
  readerBackgroundType?: 'solid' | 'gradient' | 'nature';
  readerBackgroundOverlay?: number; // Darkness percentage for overlay (e.g. 40 to 90)
  readerWallpaperBlur?: boolean;
  // Text-To-Speech (الترجمة الصوتية)
  ttsEnabled?: boolean;
  ttsSyncMode?: TTSSyncMode;
  ttsLanguage?: string;
  ttsSpeed?: number;
  ttsVolume?: number;
  ttsVoiceURI?: string;
}

export interface PageAyah extends Ayah {
  surahNumber: number;
  surahName: string;
}

export interface PageDetail {
  pageNumber: number;
  juzNumber: number;
  ayahs: PageAyah[];
}

export interface MediaExportConfig {
  type: 'mp4' | 'mp3' | 'audio';
  surahNumber: number;
  surahName: string;
  ayahNumber?: number;
  ayahText?: string;
  reciterName: string;
  reciterId: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  theme: 'dark' | 'emerald' | 'gold' | 'night';
}

export interface LastRead {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  page: number;
  timestamp: number;
}

export interface AthkarReminderSettings {
  morningEnabled: boolean;
  morningTime: string; // HH:mm e.g. "06:30"
  eveningEnabled: boolean;
  eveningTime: string; // HH:mm e.g. "17:30"
  inAppBannerEnabled: boolean;
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface AthkarCompletionRecord {
  id: string;
  category: 'morning' | 'evening' | 'after_prayer' | 'quran_duas';
  timestamp: number;
  dateStr: string;
}

export interface AthkarStats {
  morningCompletedCount: number;
  eveningCompletedCount: number;
  afterPrayerCompletedCount: number;
  quranDuasCompletedCount: number;
  totalCompletedCount: number;
  currentStreak: number;
  lastCompletedDate?: string;
  lastMorningCompletedDate?: string;
  lastEveningCompletedDate?: string;
  history: AthkarCompletionRecord[];
}

export interface UserPrayerLocationType {
  countryCode: string;
  countryName: string;
  stateId: string;
  stateName: string;
  municipalityId: string;
  municipalityName: string;
  locality?: string;
  latitude: number;
  longitude: number;
  isAutoGps: boolean;
  calculationMethod: number;
  juristicMethod: 'standard' | 'hanafi';
}
