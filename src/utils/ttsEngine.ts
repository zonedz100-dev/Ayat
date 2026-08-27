// Text-to-Speech (TTS) Engine for Multi-Language Quran Translations
// Powered by the Web Speech API with fallback & system voice pickers

export interface TTSLanguageConfig {
  code: string; // e.g. 'en', 'fr', 'ur', 'id', 'tr', 'es', 'de', 'ru', 'bn', 'ar_tafsir'
  bcp47: string; // e.g. 'en-US', 'fr-FR', 'ur-PK'
  nameArabic: string;
  nameNative: string;
  flag: string;
  defaultEdition: string;
}

export const TTS_LANGUAGES: TTSLanguageConfig[] = [
  {
    code: 'en',
    bcp47: 'en-US',
    nameArabic: 'الإنجليزية',
    nameNative: 'English (Sahih International)',
    flag: '🇬🇧',
    defaultEdition: 'en.sahih'
  },
  {
    code: 'fr',
    bcp47: 'fr-FR',
    nameArabic: 'الفرنسية',
    nameNative: 'Français (Hamidullah)',
    flag: '🇫🇷',
    defaultEdition: 'fr.hamidullah'
  },
  {
    code: 'ur',
    bcp47: 'ur-PK',
    nameArabic: 'الأردية',
    nameNative: 'اردو (Jalandhry)',
    flag: '🇵🇰',
    defaultEdition: 'ur.jalandhry'
  },
  {
    code: 'id',
    bcp47: 'id-ID',
    nameArabic: 'الإندونيسية',
    nameNative: 'Bahasa Indonesia (Kemenag)',
    flag: '🇮🇩',
    defaultEdition: 'id.indonesian'
  },
  {
    code: 'tr',
    bcp47: 'tr-TR',
    nameArabic: 'التركية',
    nameNative: 'Türkçe (Diyanet İşleri)',
    flag: '🇹🇷',
    defaultEdition: 'tr.diyanet'
  },
  {
    code: 'es',
    bcp47: 'es-ES',
    nameArabic: 'الإسبانية',
    nameNative: 'Español (Julio Cortés)',
    flag: '🇪🇸',
    defaultEdition: 'es.cortes'
  },
  {
    code: 'de',
    bcp47: 'de-DE',
    nameArabic: 'الألمانية',
    nameNative: 'Deutsch (Abu Rida)',
    flag: '🇩🇪',
    defaultEdition: 'de.aburida'
  },
  {
    code: 'ru',
    bcp47: 'ru-RU',
    nameArabic: 'الروسية',
    nameNative: 'Русский (Кулиев)',
    flag: '🇷🇺',
    defaultEdition: 'ru.kuliev'
  },
  {
    code: 'bn',
    bcp47: 'bn-BD',
    nameArabic: 'البنغالية',
    nameNative: 'বাংলা (Muhiuddin Khan)',
    flag: '🇧🇩',
    defaultEdition: 'bn.bengali'
  },
  {
    code: 'ar_tafsir',
    bcp47: 'ar-SA',
    nameArabic: 'التفسير الميسر (عربي)',
    nameNative: 'التفسير الصوتي بالعربية',
    flag: '📖',
    defaultEdition: 'ar.muyassar'
  }
];

export function getTTSLangConfig(code: string): TTSLanguageConfig {
  return TTS_LANGUAGES.find((l) => l.code === code) || TTS_LANGUAGES[0];
}

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function getSystemVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isTTSSupported()) return Promise.resolve([]);
  if (cachedVoices.length > 0) return Promise.resolve(cachedVoices);

  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    const onVoicesChanged = () => {
      voices = synth.getVoices();
      cachedVoices = voices;
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(voices);
    };

    synth.addEventListener('voiceschanged', onVoicesChanged);
    // Timeout fallback in case voiceschanged does not fire
    setTimeout(() => {
      const v = synth.getVoices();
      if (v.length > 0) cachedVoices = v;
      resolve(v);
    }, 500);
  });
}

export function findBestVoiceForLang(bcp47: string, voiceURI?: string, voicesList?: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const voices = voicesList || cachedVoices;
  if (!voices || voices.length === 0) return null;

  // 1. If voiceURI matches exactly
  if (voiceURI) {
    const match = voices.find((v) => v.voiceURI === voiceURI);
    if (match) return match;
  }

  const primaryLang = bcp47.split('-')[0].toLowerCase();

  // 2. Look for exact locale match (e.g. 'en-US' or 'fr-FR')
  const exactMatch = voices.find((v) => v.lang.toLowerCase() === bcp47.toLowerCase());
  if (exactMatch) return exactMatch;

  // 3. Look for primary language prefix (e.g. 'en' in 'en-GB' or 'en-US')
  const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(primaryLang));
  if (prefixMatch) return prefixMatch;

  return null;
}

export interface SpeakOptions {
  text: string;
  languageCode: string; // e.g. 'en', 'fr', 'ur', 'ar_tafsir'
  rate?: number; // 0.5 - 2.0 (default: 1.0)
  pitch?: number; // 0.5 - 1.5 (default: 1.0)
  volume?: number; // 0 - 1.0 (default: 1.0)
  voiceURI?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let isSpeakingInternal = false;

export function stopTTS(): void {
  if (!isTTSSupported()) return;
  try {
    window.speechSynthesis.cancel();
    activeUtterance = null;
    isSpeakingInternal = false;
  } catch (err) {
    console.warn('Error stopping TTS:', err);
  }
}

export function pauseTTS(): void {
  if (!isTTSSupported()) return;
  try {
    window.speechSynthesis.pause();
  } catch (err) {}
}

export function resumeTTS(): void {
  if (!isTTSSupported()) return;
  try {
    window.speechSynthesis.resume();
  } catch (err) {}
}

export function isTTSSpeaking(): boolean {
  if (!isTTSSupported()) return false;
  return window.speechSynthesis.speaking || isSpeakingInternal;
}

export async function speakText(options: SpeakOptions): Promise<void> {
  if (!isTTSSupported()) {
    console.warn('Speech Synthesis is not supported in this browser environment.');
    options.onError?.(new Error('Speech Synthesis غير مدعوم في هذا المتصفح'));
    return;
  }

  // Cancel any ongoing speech
  stopTTS();

  const config = getTTSLangConfig(options.languageCode);
  const textToSpeak = options.text?.trim();

  if (!textToSpeak) {
    options.onEnd?.();
    return;
  }

  // Ensure voices are loaded
  const voices = await getSystemVoices();
  const voice = findBestVoiceForLang(config.bcp47, options.voiceURI, voices);

  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      activeUtterance = utterance;

      utterance.lang = config.bcp47;
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      utterance.onstart = () => {
        isSpeakingInternal = true;
        options.onStart?.();
      };

      utterance.onend = () => {
        isSpeakingInternal = false;
        activeUtterance = null;
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        isSpeakingInternal = false;
        activeUtterance = null;
        // Ignore canceled events caused by stopTTS()
        if (event.error === 'canceled' || event.error === 'interrupted') {
          resolve();
          return;
        }
        console.warn('TTS speech error:', event);
        options.onError?.(event);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      isSpeakingInternal = false;
      activeUtterance = null;
      options.onError?.(err);
      reject(err);
    }
  });
}
