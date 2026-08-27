import React from 'react';
import { X, Sliders, Type, BookOpen, Globe, Moon, Sun, Sparkles, Check, Palette } from 'lucide-react';
import { ReadingSettings } from '../types';
import { ReaderBackgroundSelector } from './ReaderBackgroundSelector';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c0c0c] rounded-2xl w-full max-w-xl overflow-hidden border border-indigo-500/25 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181818] border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">إعدادات القراءة والمظهر</h3>
              <p className="text-xs text-slate-400">تخصيص الخطوط، الخلفيات، والترجمات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1a1a] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-right">
          
          {/* Reader Background Selection (خلفيات المصحف والقراءة) */}
          <div className="p-4 bg-[#0e0e0e] rounded-2xl border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Palette className="w-4 h-4 text-indigo-400" />
              <h4>خلفية شاشة القراءة والتلاوة</h4>
            </div>
            <p className="text-xs text-slate-400">
              اختر خلفية ثابتة، أو تدرج لوني هادئ، أو صور طبيعية مريحة أثناء قراءة وسماع الآيات
            </p>
            <ReaderBackgroundSelector 
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          </div>

          {/* Theme selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">النمط العام للتطبيق</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSettings({ theme: 'emerald' })}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  settings.theme === 'emerald'
                    ? 'border-indigo-500 bg-[#161616] text-white font-medium shadow-xs'
                    : 'border-[#222] bg-[#111] text-slate-400 hover:bg-[#161616] hover:text-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 mx-auto mb-1.5" />
                <span className="text-xs">النهاري الزمردي</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ theme: 'parchment' })}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  settings.theme === 'parchment'
                    ? 'border-indigo-500 bg-[#161616] text-white font-medium shadow-xs'
                    : 'border-[#222] bg-[#111] text-slate-400 hover:bg-[#161616] hover:text-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-200 border border-amber-400 mx-auto mb-1.5" />
                <span className="text-xs">الورقي المريح</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'border-indigo-500 bg-[#161616] text-white font-medium shadow-xs'
                    : 'border-[#222] bg-[#111] text-slate-400 hover:bg-[#161616] hover:text-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-900 border border-indigo-500 mx-auto mb-1.5" />
                <span className="text-xs">التوازن الهندسي (ليلي)</span>
              </button>
            </div>
          </div>

          {/* Font size */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
              <span>حجم خط الآيات القرآنية</span>
              <span className="text-indigo-400 font-mono">{settings.fontSize} بكسل</span>
            </div>
            <input
              type="range"
              min="22"
              max="48"
              step="2"
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="mt-2 p-3 bg-[#111] border border-[#1f1f1f] rounded-xl text-center">
              <p className="font-quran leading-loose text-slate-100" style={{ fontSize: `${settings.fontSize}px` }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">نوع الخط القرآني</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSettings({ fontFamily: 'quran' })}
                className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  settings.fontFamily === 'quran'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#111] text-slate-400 border-[#222] hover:text-slate-200'
                }`}
              >
                الرسم العثماني
              </button>

              <button
                onClick={() => onUpdateSettings({ fontFamily: 'amiri' })}
                className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  settings.fontFamily === 'amiri'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#111] text-slate-400 border-[#222] hover:text-slate-200'
                }`}
              >
                الخط الأميري
              </button>

              <button
                onClick={() => onUpdateSettings({ fontFamily: 'cairo' })}
                className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  settings.fontFamily === 'cairo'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-[#111] text-slate-400 border-[#222] hover:text-slate-200'
                }`}
              >
                خط القاهرة
              </button>
            </div>
          </div>

          {/* Translation Language */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">لغة الترجمة المصاحبة</label>
            <select
              value={settings.translationLang}
              onChange={(e) => onUpdateSettings({ translationLang: e.target.value as any })}
              className="w-full bg-[#141414] text-white border border-[#222] rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="en">الإنجليزية (English - Sahih International)</option>
              <option value="fr">الفرنسية (Français - Muhammad Hamidullah)</option>
              <option value="ur">الأردية (Urdu - Fateh Muhammad Jalandhry)</option>
            </select>
          </div>

          {/* Tafsir source */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">مصدر التفسير المعتمد</label>
            <select
              value={settings.tafsirSource}
              onChange={(e) => onUpdateSettings({ tafsirSource: e.target.value as any })}
              className="w-full bg-[#141414] text-white border border-[#222] rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="muyassar">التفسير الميسر (مجمع الملك فهد)</option>
              <option value="saadi">تيسير الكريم الرحمن (تفسير السعدي)</option>
            </select>
          </div>

          {/* Auto scroll during audio */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
            <div>
              <span className="text-xs font-medium text-slate-200 block">التمرير التلقائي مع التلاوة</span>
              <span className="text-[11px] text-slate-500">تحريك الشاشة تلقائياً للآية التي يتلوها القارئ</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoScroll: !settings.autoScroll })}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${
                settings.autoScroll ? 'bg-indigo-600' : 'bg-[#222]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  settings.autoScroll ? 'left-0.5' : 'right-0.5'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#0e0e0e]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs cursor-pointer transition-colors"
          >
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
