import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Sun, 
  Moon, 
  Flame, 
  CheckCircle2, 
  Volume2, 
  Clock, 
  Compass, 
  Sparkles, 
  RotateCcw,
  Calendar,
  Sliders,
  Check
} from 'lucide-react';
import { AthkarReminderSettings, AthkarStats } from '../types';
import { 
  playGentleNotificationTone, 
  requestAndSendBrowserNotification,
  getTodayDateString 
} from '../utils/athkarReminders';

interface AthkarNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AthkarReminderSettings;
  onUpdateSettings: (newSettings: Partial<AthkarReminderSettings>) => void;
  stats: AthkarStats;
  onResetStats?: () => void;
  onNavigateToAzkar: (category: 'morning' | 'evening') => void;
}

export const AthkarNotificationModal: React.FC<AthkarNotificationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  stats,
  onNavigateToAzkar
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'settings' | 'history'>('status');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const today = getTodayDateString();
  const morningDoneToday = stats.lastMorningCompletedDate === today;
  const eveningDoneToday = stats.lastEveningCompletedDate === today;

  const handleTestNotification = async () => {
    playGentleNotificationTone();
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);

    if (settings.browserNotificationsEnabled) {
      await requestAndSendBrowserNotification(
        '🕌 تجربة تذكير الأذكار',
        'تطبيق آيات: تذكير مبارك بقراءة الأذكار والاستغفار في وقتها.'
      );
    }
  };

  const handleRequestBrowserPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        onUpdateSettings({ browserNotificationsEnabled: true });
        new Notification('آيات | تم تفعيل الإشعارات', {
          body: 'سيصلك تذكير بأذكار الصباح والمساء في مواعيدها المحددة.',
          icon: '/favicon.ico',
        });
      } else {
        onUpdateSettings({ browserNotificationsEnabled: false });
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#0c0c0c] border border-[#222] rounded-3xl shadow-2xl overflow-hidden text-white animate-scaleUp max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1e1e1e] bg-gradient-to-r from-indigo-950/40 to-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>تذكيرات الأذكار والعداد</span>
                {stats.currentStreak > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {stats.currentStreak} يوم متتالي
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                متابعة قراءة أذكار الصباح والمساء وإعداد المواعيد
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1e1e1e] bg-[#080808] px-4 pt-2 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            عداد القراءة واليوم
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            مواعيد التذكير
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            سجل الإنجاز
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: Status & Counters */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              
              {/* Daily Streak & Total Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#121212] border border-[#222] rounded-2xl p-3 text-center">
                  <div className="flex justify-center mb-1 text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {stats.morningCompletedCount}
                  </div>
                  <div className="text-[11px] text-slate-400">أذكار الصباح</div>
                </div>

                <div className="bg-[#121212] border border-[#222] rounded-2xl p-3 text-center">
                  <div className="flex justify-center mb-1 text-indigo-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {stats.eveningCompletedCount}
                  </div>
                  <div className="text-[11px] text-slate-400">أذكار المساء</div>
                </div>

                <div className="bg-[#121212] border border-[#222] rounded-2xl p-3 text-center">
                  <div className="flex justify-center mb-1 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {stats.totalCompletedCount}
                  </div>
                  <div className="text-[11px] text-slate-400">إجمالي الختمات</div>
                </div>

                <div className="bg-[#121212] border border-[#222] rounded-2xl p-3 text-center">
                  <div className="flex justify-center mb-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {stats.currentStreak} <span className="text-xs">يوم</span>
                  </div>
                  <div className="text-[11px] text-slate-400">السلسلة المستمرة</div>
                </div>
              </div>

              {/* Today Status Cards */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 px-1">حالة أذكار اليوم:</h4>
                
                {/* Morning Card */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  morningDoneToday 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white' 
                    : 'bg-[#121212] border-[#222]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${morningDoneToday ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 text-amber-400'}`}>
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">أذكار الصباح</span>
                        {morningDoneToday ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                            أُنجزت اليوم ✓
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                            لم تُقرأ بعد
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        وقت التذكير: {settings.morningTime} (صباحاً)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigateToAzkar('morning');
                      onClose();
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      morningDoneToday
                        ? 'bg-[#1a1a1a] hover:bg-[#222] text-slate-300'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-md shadow-amber-500/20'
                    }`}
                  >
                    {morningDoneToday ? 'مراجعة الأذكار' : 'ابدأ القراءة الآن'}
                  </button>
                </div>

                {/* Evening Card */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  eveningDoneToday 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white' 
                    : 'bg-[#121212] border-[#222]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${eveningDoneToday ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">أذكار المساء</span>
                        {eveningDoneToday ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                            أُنجزت اليوم ✓
                          </span>
                        ) : (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                            لم تُقرأ بعد
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        وقت التذكير: {settings.eveningTime} (مساءً)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigateToAzkar('evening');
                      onClose();
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      eveningDoneToday
                        ? 'bg-[#1a1a1a] hover:bg-[#222] text-slate-300'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {eveningDoneToday ? 'مراجعة الأذكار' : 'ابدأ القراءة الآن'}
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Reminder Timings & Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              
              {/* Morning Timing Settings */}
              <div className="bg-[#121212] border border-[#222] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">تذكير أذكار الصباح</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.morningEnabled}
                      onChange={(e) => onUpdateSettings({ morningEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                  </label>
                </div>

                {settings.morningEnabled && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e1e1e] text-xs">
                    <span className="text-slate-400">وقت التنبيه اليومي:</span>
                    <input
                      type="time"
                      value={settings.morningTime}
                      onChange={(e) => onUpdateSettings({ morningTime: e.target.value })}
                      className="bg-[#080808] border border-[#333] rounded-xl px-3 py-1.5 text-indigo-400 font-mono font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Evening Timing Settings */}
              <div className="bg-[#121212] border border-[#222] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-sm text-white">تذكير أذكار المساء</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.eveningEnabled}
                      onChange={(e) => onUpdateSettings({ eveningEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                  </label>
                </div>

                {settings.eveningEnabled && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e1e1e] text-xs">
                    <span className="text-slate-400">وقت التنبيه اليومي:</span>
                    <input
                      type="time"
                      value={settings.eveningTime}
                      onChange={(e) => onUpdateSettings({ eveningTime: e.target.value })}
                      className="bg-[#080808] border border-[#333] rounded-xl px-3 py-1.5 text-indigo-400 font-mono font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Sound & In-App Alerts */}
              <div className="bg-[#121212] border border-[#222] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <span>نغمة تنبيه هادئة داخل التطبيق</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1e1e1e]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>شريط تنبيه لطيف عائم (In-App Banner)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.inAppBannerEnabled}
                    onChange={(e) => onUpdateSettings({ inAppBannerEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1e1e1e]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span>إشعارات المتصفح والنظام (Push Notifications)</span>
                  </div>
                  <button
                    onClick={handleRequestBrowserPermission}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {settings.browserNotificationsEnabled ? 'مفعلة ✓' : 'تفعيل'}
                  </button>
                </div>
              </div>

              {/* Instant Test Tone Button */}
              <button
                onClick={handleTestNotification}
                className="w-full py-2.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] text-xs font-bold text-indigo-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{testNotificationSent ? 'تم إرسال نغمة التجربة ✓' : 'تجربة نغمة الإشعار الصوتي الآن'}</span>
              </button>

            </div>
          )}

          {/* TAB 3: History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {stats.history && stats.history.length > 0 ? (
                <div className="space-y-2">
                  {stats.history.slice(0, 15).map((record) => (
                    <div
                      key={record.id}
                      className="p-3 rounded-xl bg-[#121212] border border-[#222] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${
                          record.category === 'morning' 
                            ? 'bg-amber-500/10 text-amber-400'
                            : record.category === 'evening'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {record.category === 'morning' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="font-bold text-white">
                            {record.category === 'morning'
                              ? 'إتمام أذكار الصباح'
                              : record.category === 'evening'
                              ? 'إتمام أذكار المساء'
                              : record.category === 'after_prayer'
                              ? 'أذكار بعد الصلاة'
                              : 'أدعية قرآنية'}
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(record.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 bg-[#181818] px-2 py-0.5 rounded border border-[#282828]">
                        {record.dateStr}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>لا توجد جلسات أذكار مسجلة بعد.</p>
                  <p className="text-[11px] mt-1 text-slate-600">عند إتمام قراءة أذكار الصباح أو المساء ستظهر هنا تلقائياً.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1e1e1e] bg-[#080808] flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            {stats.lastCompletedDate ? `آخر إتمام: ${stats.lastCompletedDate}` : 'لم تُسجل قراءات سابقة'}
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
