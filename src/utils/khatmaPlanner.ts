import { KhatmaPlan, KhatmaScheduleDay, KhatmaReminderSettings, KhatmaPrayerBreakdown } from '../types';
import { SURAHS_LIST, JUZ_LIST } from '../data/quranData';

export const TOTAL_QURAN_PAGES = 604;
export const KHATMA_STORAGE_KEY = 'ayat_quran_khatma_plan_v2';
export const KHATMA_DISMISSED_KEY = 'ayat_khatma_dismissed_date';

export const DEFAULT_KHATMA_REMINDERS: KhatmaReminderSettings = {
  enabled: true,
  time: '08:00',
  reminderSlot: 'morning',
  soundEnabled: true,
  browserNotifications: false
};

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateToString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Format date string to Arabic human readable format
 */
export function formatArabicDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Find Surah name for a given page number (1-604)
 */
export function getSurahForPage(page: number): string {
  if (page <= 1) return SURAHS_LIST[0].name;
  if (page >= 604) return SURAHS_LIST[113].name;

  // Find the last surah that starts on or before this page
  let found = SURAHS_LIST[0];
  for (const s of SURAHS_LIST) {
    if (s.pageStart <= page) {
      found = s;
    } else {
      break;
    }
  }
  return found.name;
}

/**
 * Find Juz number for a given page number (1-604)
 */
export function getJuzForPage(page: number): number {
  if (page <= 1) return 1;
  if (page >= 582) return 30;

  let foundJuz = 1;
  for (const j of JUZ_LIST) {
    if (j.pageStart <= page) {
      foundJuz = j.juzNumber;
    } else {
      break;
    }
  }
  return foundJuz;
}

/**
 * Split a page range across the 5 daily prayers
 */
export function generatePrayerBreakdown(fromPage: number, toPage: number): KhatmaPrayerBreakdown {
  const totalPages = Math.max(1, toPage - fromPage + 1);
  const base = Math.floor(totalPages / 5);
  const remainder = totalPages % 5;

  let current = fromPage;
  const portions: { fromPage: number; toPage: number; pages: number }[] = [];

  for (let i = 0; i < 5; i++) {
    const count = base + (i < remainder ? 1 : 0);
    if (count > 0 && current <= toPage) {
      const end = Math.min(toPage, current + count - 1);
      portions.push({
        fromPage: current,
        toPage: end,
        pages: end - current + 1
      });
      current = end + 1;
    } else {
      portions.push({
        fromPage: current > toPage ? toPage : current,
        toPage: current > toPage ? toPage : current,
        pages: 0
      });
    }
  }

  return {
    fajr: portions[0] || { fromPage, toPage: fromPage, pages: 1 },
    dhuhr: portions[1] || { fromPage, toPage: fromPage, pages: 0 },
    asr: portions[2] || { fromPage, toPage: fromPage, pages: 0 },
    maghrib: portions[3] || { fromPage, toPage: fromPage, pages: 0 },
    isha: portions[4] || { fromPage, toPage: fromPage, pages: 0 }
  };
}

/**
 * Generates a full day-by-day smart schedule
 */
export function generateSmartKhatmaSchedule(
  targetDays: number,
  startDateStr: string = formatDateToString(new Date()),
  startFromPage: number = 1,
  paceStrategy: 'per_prayer' | 'morning_evening' | 'single_session' = 'per_prayer'
): KhatmaScheduleDay[] {
  const safeDays = Math.max(1, Math.min(365, targetDays));
  const safeStartPage = Math.max(1, Math.min(TOTAL_QURAN_PAGES, startFromPage));
  const totalPagesToRead = TOTAL_QURAN_PAGES - safeStartPage + 1;

  const baseDate = new Date(startDateStr);
  const schedule: KhatmaScheduleDay[] = [];

  let accumulatedPages = 0;

  for (let dayIndex = 0; dayIndex < safeDays; dayIndex++) {
    const dayNumber = dayIndex + 1;
    const dayDate = new Date(baseDate);
    dayDate.setDate(baseDate.getDate() + dayIndex);
    const dateStr = formatDateToString(dayDate);

    // Calculate start and end page for this day
    const pagesBefore = Math.round((dayIndex * totalPagesToRead) / safeDays);
    const pagesIncludingToday = Math.round(((dayIndex + 1) * totalPagesToRead) / safeDays);
    
    const fromPage = safeStartPage + pagesBefore;
    const toPage = Math.min(TOTAL_QURAN_PAGES, safeStartPage + pagesIncludingToday - 1);
    const pageCount = Math.max(1, toPage - fromPage + 1);

    const juzStart = getJuzForPage(fromPage);
    const juzEnd = getJuzForPage(toPage);
    const surahStartName = getSurahForPage(fromPage);
    const surahEndName = getSurahForPage(toPage);

    const prayerBreakdown = generatePrayerBreakdown(fromPage, toPage);

    schedule.push({
      dayNumber,
      dateStr,
      fromPage,
      toPage,
      pageCount,
      juzStart,
      juzEnd,
      surahStartName,
      surahEndName,
      isCompleted: false,
      prayerBreakdown
    });
  }

  return schedule;
}

/**
 * Create a new default smart Khatma plan
 */
export function createDefaultSmartKhatma(
  targetDays: number = 30,
  name: string = 'ختمة رمضان المباركة',
  startFromPage: number = 1
): KhatmaPlan {
  const todayStr = formatDateToString(new Date());
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + targetDays);
  const endDateStr = formatDateToString(endDate);

  const schedule = generateSmartKhatmaSchedule(targetDays, todayStr, startFromPage);

  return {
    id: `khatma-${Date.now()}`,
    name,
    targetDays,
    startDate: todayStr,
    endDate: endDateStr,
    currentPage: startFromPage,
    currentJuz: getJuzForPage(startFromPage),
    currentSurah: 1,
    currentAyah: 1,
    completedPages: startFromPage > 1 ? Array.from({ length: startFromPage - 1 }, (_, i) => i + 1) : [],
    paceStrategy: 'per_prayer',
    startFromPage,
    schedule,
    reminderSettings: DEFAULT_KHATMA_REMINDERS,
    streak: 0,
    isFinished: false
  };
}

/**
 * Intelligently rebalance remaining schedule from current unread page
 */
export function rebalanceKhatmaSchedule(plan: KhatmaPlan, remainingDays?: number): KhatmaPlan {
  const todayStr = formatDateToString(new Date());
  
  // Find highest completed page or current page
  const completed = plan.completedPages || [];
  const maxCompleted = completed.length > 0 ? Math.max(...completed) : plan.currentPage - 1;
  const nextStartPage = Math.min(TOTAL_QURAN_PAGES, maxCompleted + 1);

  if (nextStartPage >= TOTAL_QURAN_PAGES) {
    return {
      ...plan,
      isFinished: true
    };
  }

  // Calculate remaining days
  let daysToUse = remainingDays;
  if (!daysToUse) {
    if (plan.endDate) {
      const today = new Date();
      const end = new Date(plan.endDate);
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      daysToUse = Math.max(1, diffDays);
    } else {
      const completedDaysCount = (plan.schedule || []).filter((d) => d.isCompleted).length;
      daysToUse = Math.max(1, plan.targetDays - completedDaysCount);
    }
  }

  const newSchedule = generateSmartKhatmaSchedule(
    daysToUse,
    todayStr,
    nextStartPage,
    plan.paceStrategy || 'per_prayer'
  );

  const newEndDate = new Date();
  newEndDate.setDate(newEndDate.getDate() + daysToUse);

  return {
    ...plan,
    targetDays: daysToUse,
    startDate: todayStr,
    endDate: formatDateToString(newEndDate),
    startFromPage: nextStartPage,
    currentPage: nextStartPage,
    currentJuz: getJuzForPage(nextStartPage),
    schedule: newSchedule,
    isFinished: false
  };
}

/**
 * Mark a day in the schedule as complete/incomplete
 */
export function toggleKhatmaDayCompletion(
  plan: KhatmaPlan,
  dayNumber: number,
  isComplete?: boolean
): KhatmaPlan {
  const schedule = [...(plan.schedule || [])];
  const targetIndex = schedule.findIndex((d) => d.dayNumber === dayNumber);
  if (targetIndex === -1) return plan;

  const targetDay = schedule[targetIndex];
  const newStatus = isComplete !== undefined ? isComplete : !targetDay.isCompleted;

  schedule[targetIndex] = {
    ...targetDay,
    isCompleted: newStatus,
    completedAt: newStatus ? Date.now() : undefined
  };

  // Update completed pages array
  const currentCompleted = new Set(plan.completedPages || []);
  for (let p = targetDay.fromPage; p <= targetDay.toPage; p++) {
    if (newStatus) {
      currentCompleted.add(p);
    } else {
      currentCompleted.delete(p);
    }
  }

  const completedPagesArray = Array.from(currentCompleted).sort((a, b) => a - b);
  const maxPage = completedPagesArray.length > 0 ? Math.max(...completedPagesArray) : 1;
  const isFinished = completedPagesArray.length >= TOTAL_QURAN_PAGES;

  // Calculate streak
  const todayStr = formatDateToString(new Date());
  let newStreak = plan.streak || 0;
  if (newStatus) {
    if (!plan.lastReadDate) {
      newStreak = 1;
    } else if (plan.lastReadDate === todayStr) {
      newStreak = Math.max(1, newStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (plan.lastReadDate === formatDateToString(yesterday)) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }
  }

  return {
    ...plan,
    schedule,
    completedPages: completedPagesArray,
    currentPage: Math.min(TOTAL_QURAN_PAGES, maxPage + 1),
    currentJuz: getJuzForPage(Math.min(TOTAL_QURAN_PAGES, maxPage + 1)),
    streak: newStreak,
    lastReadDate: newStatus ? todayStr : plan.lastReadDate,
    isFinished
  };
}

/**
 * Mark a single page as completed
 */
export function toggleKhatmaPageCompletion(plan: KhatmaPlan, pageNumber: number): KhatmaPlan {
  const currentCompleted = new Set(plan.completedPages || []);
  const willBeCompleted = !currentCompleted.has(pageNumber);

  if (willBeCompleted) {
    currentCompleted.add(pageNumber);
  } else {
    currentCompleted.delete(pageNumber);
  }

  const completedPagesArray = Array.from(currentCompleted).sort((a, b) => a - b);
  const isFinished = completedPagesArray.length >= TOTAL_QURAN_PAGES;
  const maxPage = completedPagesArray.length > 0 ? Math.max(...completedPagesArray) : 1;

  // Update schedule day completion state if all its pages are completed
  const updatedSchedule = (plan.schedule || []).map((day) => {
    let allDayPagesDone = true;
    for (let p = day.fromPage; p <= day.toPage; p++) {
      if (!currentCompleted.has(p)) {
        allDayPagesDone = false;
        break;
      }
    }
    return {
      ...day,
      isCompleted: allDayPagesDone,
      completedAt: allDayPagesDone ? (day.completedAt || Date.now()) : undefined
    };
  });

  return {
    ...plan,
    completedPages: completedPagesArray,
    currentPage: Math.min(TOTAL_QURAN_PAGES, maxPage + 1),
    currentJuz: getJuzForPage(Math.min(TOTAL_QURAN_PAGES, maxPage + 1)),
    schedule: updatedSchedule,
    isFinished
  };
}

/**
 * Get the current day's ward from schedule
 */
export function getTodaysWard(plan: KhatmaPlan): KhatmaScheduleDay | null {
  if (!plan.schedule || plan.schedule.length === 0) return null;
  const todayStr = formatDateToString(new Date());

  // 1. Try exact date match
  const dateMatch = plan.schedule.find((d) => d.dateStr === todayStr);
  if (dateMatch) return dateMatch;

  // 2. Otherwise return the first uncompleted day
  const firstUncompleted = plan.schedule.find((d) => !d.isCompleted);
  return firstUncompleted || plan.schedule[plan.schedule.length - 1];
}

/**
 * Calculate comprehensive progress metrics
 */
export function calculateKhatmaStats(plan: KhatmaPlan) {
  const completedPagesCount = (plan.completedPages || []).length;
  const percent = Math.min(100, Math.round((completedPagesCount / TOTAL_QURAN_PAGES) * 100));
  
  const schedule = plan.schedule || [];
  const completedDaysCount = schedule.filter((d) => d.isCompleted).length;
  const totalDays = schedule.length || plan.targetDays || 30;

  // Days elapsed from start date
  const startDate = new Date(plan.startDate);
  const now = new Date();
  const elapsedDays = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const remainingDays = Math.max(0, totalDays - completedDaysCount);
  const remainingPages = Math.max(0, TOTAL_QURAN_PAGES - completedPagesCount);

  // Expected vs actual
  const expectedPages = Math.round((elapsedDays / totalDays) * TOTAL_QURAN_PAGES);
  const difference = completedPagesCount - expectedPages;
  const paceStatus: 'ahead' | 'on_track' | 'behind' =
    difference > 5 ? 'ahead' : difference < -5 ? 'behind' : 'on_track';

  const dailyAverageTarget = totalDays > 0 ? Math.ceil(TOTAL_QURAN_PAGES / totalDays) : 20;

  return {
    completedPagesCount,
    totalQuranPages: TOTAL_QURAN_PAGES,
    percent,
    completedDaysCount,
    totalDays,
    remainingDays,
    remainingPages,
    elapsedDays,
    paceStatus,
    pagesDifference: Math.abs(difference),
    dailyAverageTarget,
    streak: plan.streak || 0
  };
}

/**
 * Check if daily Khatma reminder is active
 */
export function checkKhatmaReminder(plan: KhatmaPlan): {
  title: string;
  message: string;
  wardPageStart: number;
  wardPageEnd: number;
} | null {
  const settings = plan.reminderSettings;
  if (!settings || !settings.enabled) return null;

  const todayStr = formatDateToString(new Date());
  
  // Check if already dismissed today
  try {
    const dismissed = localStorage.getItem(`${KHATMA_DISMISSED_KEY}_${plan.id}`);
    if (dismissed === todayStr) return null;
  } catch {
    // Ignore
  }

  // Check if today's ward is already completed
  const todaysWard = getTodaysWard(plan);
  if (todaysWard && todaysWard.isCompleted) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [tH, tM] = (settings.time || '08:00').split(':').map(Number);
  const targetMinutes = (tH || 8) * 60 + (tM || 0);

  // Active window: from target time up to end of the day
  if (currentMinutes >= targetMinutes) {
    const pagesText = todaysWard 
      ? `وردك اليوم: الصفحات ${todaysWard.fromPage} إلى ${todaysWard.toPage} (${todaysWard.surahStartName})` 
      : 'لا تنسَ نصيبك من قراءة القرآن اليوم';

    return {
      title: '📖 تذكير ورد القرآن الكريم',
      message: `حان وقت قراءة وردك من ختمة "${plan.name}". ${pagesText}. بادر بالقراءة لتنال البركة والأجر.`,
      wardPageStart: todaysWard?.fromPage || 1,
      wardPageEnd: todaysWard?.toPage || 20
    };
  }

  return null;
}

/**
 * Dismiss reminder for today
 */
export function dismissKhatmaReminderToday(planId: string): void {
  try {
    localStorage.setItem(`${KHATMA_DISMISSED_KEY}_${planId}`, formatDateToString(new Date()));
  } catch {
    // Ignore
  }
}

/**
 * Request notification permission and trigger browser alert
 */
export async function sendKhatmaBrowserNotification(title: string, body: string): Promise<boolean> {
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
        lang: 'ar'
      });
      return true;
    }
  } catch (err) {
    console.warn('Browser notification error:', err);
  }

  return false;
}
