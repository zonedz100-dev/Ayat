import React, { useState } from 'react';
import { 
  X, 
  Moon, 
  Sparkles, 
  Volume2, 
  Clock, 
  Bell, 
  Calendar, 
  Share2, 
  Flame,
  Check
} from 'lucide-react';

interface RamadanImsakiyaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RamadanImsakiyaModal: React.FC<RamadanImsakiyaModalProps> = ({
  isOpen,
  onClose
}) => {
  const [cannonEnabled, setCannonEnabled] = useState(true);
  const [musaharatiEnabled, setMusaharatiEnabled] = useState(false);
  const [musaharatiTime, setMusaharatiTime] = useState('02:30 AM');
  const [isCannonPlaying, setIsCannonPlaying] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Generate 30 days of Ramadan schedule
  const ramadanDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // Slight realistic shifts throughout the month
    const fajrMin = Math.max(20, 35 - Math.floor(i * 0.4));
    const maghribMin = Math.min(59, 30 + Math.floor(i * 0.5));

    return {
      day,
      weekday: ['الخميس', 'الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'][(i + 4) % 7],
      imsak: `04:${String(fajrMin - 10).padStart(2, '0')}`,
      fajr: `04:${String(fajrMin).padStart(2, '0')}`,
      sunrise: '05:52',
      dhuhr: '12:02',
      asr: '03:39',
      maghrib: `06:${String(maghribMin).padStart(2, '0')}`,
      isha: '07:45',
      isCurrentDay: day === 15
    };
  });

  // Sound generator for cannon simulation (Web Audio API)
  const handlePlayCannon = () => {
    setIsCannonPlaying(true);
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        
        // Cannon Boom oscillator
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.3);
      }
    } catch (e) {
      // Ignore
    }

    setTimeout(() => setIsCannonPlaying(false), 1500);
  };

  const handleShare = () => {
    const text = '🌙 إمساكية شهر رمضان المبارك ومواقيت الإفطار والإمساك عبر تطبيق آيات';
    if (navigator.share) {
      navigator.share({ title: 'إمساكية رمضان', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#131d17] via-[#0d1612] to-[#090f0c] rounded-3xl border border-emerald-500/30 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar with Lantern Motif (Inspired by Image 4) */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 border-b border-emerald-500/30 relative text-center">
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>شهر القرآن والبركات</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-quran text-amber-300">
            🌙 إمساكية شهر رمضان المبارك ١٤٤٧ هـ
          </h2>
          <p className="text-xs text-emerald-200 mt-1 max-w-md mx-auto">
            مواقيت الإفطار والإمساك، مدفع الإفطار، وتنبيه المسحراتي طوال الشهر الفضيل
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Iftar Cannon & Musaharati Controls Box (Directly inspired by Image 4 bottom toggles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Cannon Box */}
            <div className="bg-[#15231c] p-4 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                    💥
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">مدفع الإفطار</h4>
                    <p className="text-[11px] text-slate-400">تنبيه صوتي لحظة أذان المغرب</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={cannonEnabled}
                  onChange={(e) => setCannonEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                onClick={handlePlayCannon}
                disabled={isCannonPlaying}
                className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isCannonPlaying ? '💥 صوت المدفع يعمل...' : 'تجربة صوت المدفع'}</span>
              </button>
            </div>

            {/* Musaharati Box */}
            <div className="bg-[#15231c] p-4 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    🥁
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">المسحراتي</h4>
                    <p className="text-[11px] text-slate-400">منبه السحور قبل الفجر</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={musaharatiEnabled}
                  onChange={(e) => setMusaharatiEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <span className="text-slate-400">وقت المنبه:</span>
                <span className="font-mono font-bold text-emerald-300">{musaharatiTime}</span>
              </div>
            </div>

          </div>

          {/* Imsakiya 30-Day Table (Inspired by Image 4 table) */}
          <div className="bg-[#121c17] rounded-2xl border border-emerald-500/20 overflow-hidden">
            
            <div className="p-3.5 bg-[#17261f] border-b border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">جدول أيام رمضان المبارك</span>
              <button
                onClick={handleShare}
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-bold"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>مشاركة الجدول</span>
              </button>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#0b130f] text-slate-400 border-b border-white/10 sticky top-0">
                  <tr>
                    <th className="p-2.5 text-center">اليوم</th>
                    <th className="p-2.5">الإمساك</th>
                    <th className="p-2.5">الفجر</th>
                    <th className="p-2.5">الظهر</th>
                    <th className="p-2.5">العصر</th>
                    <th className="p-2.5 text-amber-300 font-bold">المغرب (الإفطار)</th>
                    <th className="p-2.5">العشاء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {ramadanDays.map((row) => (
                    <tr
                      key={row.day}
                      className={
                        row.isCurrentDay
                          ? 'bg-emerald-600/30 text-emerald-200 font-bold'
                          : 'hover:bg-white/5 text-slate-300'
                      }
                    >
                      <td className="p-2.5 text-center font-sans font-bold">
                        {row.day} ({row.weekday})
                      </td>
                      <td className="p-2.5 text-slate-400">{row.imsak}</td>
                      <td className="p-2.5 text-emerald-300">{row.fajr}</td>
                      <td className="p-2.5">{row.dhuhr}</td>
                      <td className="p-2.5">{row.asr}</td>
                      <td className="p-2.5 text-amber-400 font-bold">{row.maghrib}</td>
                      <td className="p-2.5">{row.isha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
