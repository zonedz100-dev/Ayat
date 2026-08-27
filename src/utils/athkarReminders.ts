import { AthkarReminderSettings, AthkarStats, AthkarCompletionRecord } from '../types';

const REMINDER_SETTINGS_KEY = 'ayat_athkar_reminder_settings';
const ATHKAR_STATS_KEY = 'ayat_athkar_stats';
const DISMISSED_DATE_KEY = 'ayat_athkar_dismissed_date';

export const DEFAULT_REMINDER_SETTINGS: AthkarReminderSettings = {
  morningEnabled: true,
  morningTime: '06:30',
  eveningEnabled: true,
  eveningTime: '17:30',
  inAppBannerEnabled: true,
  browserNotificationsEnabled: false,
  soundEnabled: true,
};

export const DEFAULT_ATHKAR_STATS: AthkarStats = {
  morningCompletedCount: 0,
  eveningCompletedCount: 0,
  afterPrayerCompletedCount: 0,
  quranDuasCompletedCount: 0,
  totalCompletedCount: 0,
  currentStreak: 0,
  history: [],
};

export function loadAthkarReminderSettings(): AthkarReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (!raw) return DEFAULT_REMINDER_SETTINGS;
    return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export function saveAthkarReminderSettings(settings: AthkarReminderSettings): void {
  try {
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save Athkar reminder settings:', err);
  }
}

export function loadAthkarStats(): AthkarStats {
  try {
    const raw = localStorage.getItem(ATHKAR_STATS_KEY);
    if (!raw) return DEFAULT_ATHKAR_STATS;
    return { ...DEFAULT_ATHKAR_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ATHKAR_STATS;
  }
}

export function saveAthkarStats(stats: AthkarStats): void {
  try {
    localStorage.setItem(ATHKAR_STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save Athkar stats:', err);
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Record a completion for an Athkar category and update statistics & streaks
 */
export function recordAthkarCompletion(
  category: 'morning' | 'evening' | 'after_prayer' | 'quran_duas',
  currentStats: AthkarStats
): AthkarStats {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const now = Date.now();

  const record: AthkarCompletionRecord = {
    id: `athkar-${category}-${now}`,
    category,
    timestamp: now,
    dateStr: today,
  };

  // Streak calculation
  let newStreak = currentStats.currentStreak;
  if (!currentStats.lastCompletedDate) {
    newStreak = 1;
  } else if (currentStats.lastCompletedDate === today) {
    // Already did an athkar today, maintain streak
    newStreak = Math.max(1, currentStats.currentStreak);
  } else if (currentStats.lastCompletedDate === yesterday) {
    // Continued consecutive day streak
    newStreak = currentStats.currentStreak + 1;
  } else {
    // Streak was broken
    newStreak = 1;
  }

  const updated: AthkarStats = {
    ...currentStats,
    morningCompletedCount:
      category === 'morning' ? currentStats.morningCompletedCount + 1 : currentStats.morningCompletedCount,
    eveningCompletedCount:
      category === 'evening' ? currentStats.eveningCompletedCount + 1 : currentStats.eveningCompletedCount,
    afterPrayerCompletedCount:
      category === 'after_prayer' ? currentStats.afterPrayerCompletedCount + 1 : currentStats.afterPrayerCompletedCount,
    quranDuasCompletedCount:
      category === 'quran_duas' ? currentStats.quranDuasCompletedCount + 1 : currentStats.quranDuasCompletedCount,
    totalCompletedCount: currentStats.totalCompletedCount + 1,
    currentStreak: newStreak,
    lastCompletedDate: today,
    lastMorningCompletedDate: category === 'morning' ? today : currentStats.lastMorningCompletedDate,
    lastEveningCompletedDate: category === 'evening' ? today : currentStats.lastEveningCompletedDate,
    history: [record, ...(currentStats.history || []).slice(0, 100)],
  };

  saveAthkarStats(updated);
  return updated;
}

export type ActiveReminderType = 'morning' | 'evening' | null;

/**
 * Determine if a morning or evening reminder is currently active and unread
 */
export function checkActiveReminder(
  settings: AthkarReminderSettings,
  stats: AthkarStats
): {
  type: ActiveReminderType;
  title: string;
  message: string;
  category: 'morning' | 'evening';
} | null {
  const today = getTodayDateString();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Parse morning time (e.g. 06:30)
  if (settings.morningEnabled) {
    const [mH, mM] = settings.morningTime.split(':').map(Number);
    const morningTarget = mH * 60 + (mM || 0);
    // Morning window: From morningTarget - 30m up to 12:00 PM (noon)
    const morningEnd = 12 * 60; // 12:00 PM
    if (currentMinutes >= morningTarget - 15 && currentMinutes <= morningEnd) {
      if (stats.lastMorningCompletedDate !== today && !isDismissedToday('morning')) {
        return {
          type: 'morning',
          title: '🌤️ حان وقت أذكار الصباح',
          message: 'ابدأ يومك بنور الذكر وحصن نفسك ببركة أذكار الصباح.',
          category: 'morning',
        };
      }
    }
  }

  // Parse evening time (e.g. 17:30)
  if (settings.eveningEnabled) {
    const [eH, eM] = settings.eveningTime.split(':').map(Number);
    const eveningTarget = eH * 60 + (eM || 0);
    // Evening window: From eveningTarget - 15m up to 23:59 PM
    const eveningEnd = 23 * 60 + 59;
    if (currentMinutes >= eveningTarget - 15 && currentMinutes <= eveningEnd) {
      if (stats.lastEveningCompletedDate !== today && !isDismissedToday('evening')) {
        return {
          type: 'evening',
          title: '🌙 حان وقت أذكار المساء',
          message: 'اختم يومك بالسكينة واطمئنان القلب بأذكار المساء وحصن المسلم.',
          category: 'evening',
        };
      }
    }
  }

  return null;
}

export function dismissReminderForToday(type: 'morning' | 'evening'): void {
  try {
    const key = `${DISMISSED_DATE_KEY}_${type}`;
    localStorage.setItem(key, getTodayDateString());
  } catch (err) {
    console.warn(err);
  }
}

export function isDismissedToday(type: 'morning' | 'evening'): boolean {
  try {
    const key = `${DISMISSED_DATE_KEY}_${type}`;
    return localStorage.getItem(key) === getTodayDateString();
  } catch {
    return false;
  }
}

/**
 * Play a peaceful ambient chime sound using Web Audio API
 */
export function playGentleNotificationTone(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Soft chime harmonic frequencies: 528Hz (Love/Peace) + 792Hz harmonic
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now);
    osc1.frequency.exponentialRampToValueAtTime(660, now + 0.3);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(792, now);
    osc2.frequency.exponentialRampToValueAtTime(880, now + 0.4);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
  } catch (err) {
    console.warn('Audio chime error:', err);
  }
}

/**
 * Request permission and trigger browser notification if allowed
 */
export async function requestAndSendBrowserNotification(title: string, body: string): Promise<boolean> {
  if (!('Notification' in window)) return false;

  try {
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        dir: 'rtl',
        lang: 'ar',
      });
      return true;
    }
  } catch (err) {
    console.warn('Browser notification error:', err);
  }

  return false;
}
