// Quran Word-by-Word Audio Synchronization Engine
// Provides real-time word-level timing, phonetic weight distribution, and segment caching

export interface QuranWord {
  index: number;
  text: string;
  cleanText: string;
  startTime: number;
  endTime: number;
}

// In-memory cache for API pre-calculated segments by surah and reciter
const segmentsCache = new Map<string, Record<number, [number, number, number][]>>();

/**
 * Phonetic weight calculation for Arabic word to accurately estimate recitation duration
 */
function calculatePhoneticWeight(word: string): number {
  if (!word) return 1;

  let weight = 0;
  // Base letter weight
  const letters = word.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  weight += Math.max(letters.length * 1.0, 1);

  // Madd letters (Long vowels: Alif, Waw, Yaa, Dagger Alif, Maddah)
  const maddCount = (word.match(/[اآىيو\u0670\u0653]/g) || []).length;
  weight += maddCount * 1.6;

  // Shaddah (Gemination / doubled consonant)
  const shaddahCount = (word.match(/[\u0651]/g) || []).length;
  weight += shaddahCount * 1.3;

  // Tanween / Noon Sakinah (Ghunnah sound)
  const tanweenCount = (word.match(/[\u064B\u064C\u064D]/g) || []).length;
  weight += tanweenCount * 0.9;

  // Waqf / Pause marks (Qaf-Lam, Sad-Lam, Jeem, etc.)
  if (/[ۚۖۗۘۙ۝]/g.test(word)) {
    weight += 1.8;
  }

  return Math.max(weight, 1.2);
}

/**
 * Splits Quranic ayah text into words cleanly
 */
export function splitAyahText(ayahText: string): string[] {
  if (!ayahText) return [];
  return ayahText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * Generates word objects with time boundaries [startTime, endTime] for an Ayah
 */
export function getAyahWordsWithTiming(
  ayahText: string,
  audioDuration: number,
  exactSegments?: [number, number, number][]
): QuranWord[] {
  const rawWords = splitAyahText(ayahText);
  if (rawWords.length === 0) return [];

  // Fallback if audioDuration is not yet known
  const duration = audioDuration > 0 ? audioDuration : rawWords.length * 0.75;

  // 1. If exact segments from Quran.com API exist (format: [word_index, start_ms, end_ms])
  if (exactSegments && exactSegments.length > 0) {
    const result: QuranWord[] = [];
    rawWords.forEach((word, idx) => {
      // Find matching segment by 1-based or 0-based word index
      const seg = exactSegments.find((s) => s[0] === idx + 1 || s[0] === idx);
      if (seg) {
        result.push({
          index: idx,
          text: word,
          cleanText: word.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, ''),
          startTime: seg[1] / 1000,
          endTime: seg[2] / 1000,
        });
      } else {
        // Estimate fallback for this word
        result.push({
          index: idx,
          text: word,
          cleanText: word.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, ''),
          startTime: (idx / rawWords.length) * duration,
          endTime: ((idx + 1) / rawWords.length) * duration,
        });
      }
    });
    return result;
  }

  // 2. High-precision Phonetic Weight Engine
  const weights = rawWords.map(calculatePhoneticWeight);
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);

  let currentStart = 0;
  return rawWords.map((word, idx) => {
    const wordDuration = (weights[idx] / totalWeight) * duration;
    const startTime = currentStart;
    const endTime = currentStart + wordDuration;
    currentStart = endTime;

    return {
      index: idx,
      text: word,
      cleanText: word.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, ''),
      startTime,
      endTime,
    };
  });
}

/**
 * Returns the currently active word index based on currentTime and words array
 */
export function getActiveWordIndex(
  words: QuranWord[],
  currentTime: number,
  totalDuration: number
): number {
  if (!words || words.length === 0) return -1;
  if (currentTime <= 0) return 0;

  // Check if currentTime falls within any word's boundary
  for (let i = 0; i < words.length; i++) {
    if (currentTime >= words[i].startTime && currentTime <= words[i].endTime) {
      return i;
    }
  }

  // If time exceeds last word, return last word
  if (currentTime >= words[words.length - 1].endTime) {
    return words.length - 1;
  }

  // Proportional fallback
  if (totalDuration > 0) {
    const ratio = Math.min(Math.max(currentTime / totalDuration, 0), 0.999);
    return Math.floor(ratio * words.length);
  }

  return 0;
}

/**
 * Map known reciter IDs to Quran.com reciter IDs
 */
const RECITER_API_MAP: Record<string, number> = {
  'ar.alafasy': 7,
  'ar.abdulbasitmurattal': 1,
  'ar.abdulbasitmujawwad': 2,
  'ar.husary': 5,
  'ar.husarymujawwad': 6,
  'ar.minshawi': 8,
  'ar.minshawimujawwad': 9,
  'ar.ghamadi': 4,
  'ar.shuraym': 10,
  'ar.sudais': 3,
  'ar.hudhaify': 11,
};

/**
 * Fetches pre-computed word segments from Quran.com API when available
 */
export async function fetchChapterWordSegments(
  surahNumber: number,
  reciterId: string
): Promise<Record<number, [number, number, number][]> | null> {
  const quranComReciterId = RECITER_API_MAP[reciterId] || 7;
  const cacheKey = `${surahNumber}_${quranComReciterId}`;

  if (segmentsCache.has(cacheKey)) {
    return segmentsCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.qurancdn.com/api/qdc/audio/reciters/${quranComReciterId}/audio_files?chapter=${surahNumber}&segments=true`;
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) return null;

    const data = await response.json();
    const audioFiles = data.audio_files || [];
    const segmentsMap: Record<number, [number, number, number][]> = {};

    audioFiles.forEach((file: any) => {
      const verseKey = file.verse_key; // e.g. "1:1"
      if (verseKey && file.verse_timings) {
        const parts = verseKey.split(':');
        const ayahNum = parseInt(parts[1], 10);
        if (ayahNum && file.verse_timings.segments) {
          segmentsMap[ayahNum] = file.verse_timings.segments;
        }
      } else if (verseKey && file.segments) {
        const parts = verseKey.split(':');
        const ayahNum = parseInt(parts[1], 10);
        if (ayahNum) {
          segmentsMap[ayahNum] = file.segments;
        }
      }
    });

    segmentsCache.set(cacheKey, segmentsMap);
    return segmentsMap;
  } catch (err) {
    console.debug('Segments fetch skipped, using phonetic engine:', err);
    return null;
  }
}
