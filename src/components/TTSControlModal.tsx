import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Languages, 
  Play, 
  Square, 
  Sparkles, 
  Check, 
  Sliders, 
  Gauge, 
  Headphones, 
  Radio, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { ReadingSettings, TTSSyncMode } from '../types';
import { 
  TTS_LANGUAGES, 
  getTTSLangConfig, 
  isTTSSupported, 
  speakText, 
  stopTTS, 
  isTTSSpeaking,
  getSystemVoices
} from '../utils/ttsEngine';

interface TTSControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onUpdateSettings: (newSettings: Partial<ReadingSettings>) => void;
  currentAyahText?: string;
  currentAyahTranslation?: string;
}

export const TTSControlModal: React.FC<TTSControlModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentAyahText,
  currentAyahTranslation
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const supported = isTTSSupported();

  useEffect(() => {
    if (isOpen && supported) {
      getSystemVoices().then((v) => setSystemVoices(v));
    }
  }, [isOpen, supported]);

  if (!isOpen) return null;

  const currentLang = settings.ttsLanguage || settings.translationLang || 'en';
  const currentLangConfig = getTTSLangConfig(currentLang);
  const currentMode: TTSSyncMode = settings.ttsSyncMode || 'consecutive';
  const isEnabled = Boolean(settings.ttsEnabled);

  const handleToggleTTS = () => {
    const nextVal = !isEnabled;
    onUpdateSettings({ ttsEnabled: nextVal });
    if (!nextVal) {
      stopTTS();
      setIsTesting(false);
    }
  };

  const handleTestSpeech = async () => {
    if (isTesting) {
      stopTTS();
      setIsTesting(false);
      return;
    }

    setIsTesting(true);
    let sampleText = currentAyahTranslation;
    if (!sampleText) {
      if (currentLang === 'en') {
        sampleText = 'In the name of Allah, the Entirely Merciful, the Especially Merciful.';
      } else if (currentLang === 'fr') {
        sampleText = 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.';
      } else if (currentLang === 'ur') {
        sampleText = 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔';
      } else if (currentLang === 'id') {
        sampleText = 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.';
      } else if (currentLang === 'tr') {
        sampleText = 'Rahmân ve Rahîm olan Allah\'ın adıyla.';
      } else if (currentLang === 'es') {
        sampleText = 'En el nombre de Alá, el Compasivo, el Misericordioso.';
      } else if (currentLang === 'de') {
        sampleText = 'Im Namen Allahs, des Allerbarmers, des Barmherzigen.';
      } else if (currentLang === 'ru') {
        sampleText = 'Во имя Аллаха, Милостивого, Милосердного!';
      } else if (currentLang === 'bn') {
        sampleText = 'শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।';
      } else {
        sampleText = 'بسم الله الرحمن الرحيم، هذا نموذج لتجربة القراءة الصوتية للتفسير والترجمة.';
      }
    }

    try {
      await speakText({
        text: sampleText,
        languageCode: currentLang,
        rate: settings.ttsSpeed || 1.0,
        volume: settings.ttsVolume !== undefined ? settings.ttsVolume : 1.0,
        voiceURI: settings.ttsVoiceURI,
        onStart: () => setIsTesting(true),
        onEnd: () => setIsTesting(false),
        onError: () => setIsTesting(false)
      });
    } catch (e) {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e0e13] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1e1e2c] flex items-center justify-between bg-[#13131c]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>الترجمة الصوتية الذكية (Text-to-Speech)</span>
                {isEnabled && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    مُفعّلة
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                استمع لترجمة معاني الآيات صوتياً بلغات متعددة وبالتزامن مع تلاوة القارئ
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopTTS();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e1e2c] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if browser does not support Speech Synthesis */}
        {!supported && (
          <div className="p-4 bg-amber-500/10 border-b border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>متصفحك الحالي لا يدعم محرك Web Speech API بالكامل، قد تتطلب الميزة متصفحاً حديثاً كـ Chrome أو Safari.</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-right custom-scrollbar">
          
          {/* Main Activation Master Toggle */}
          <div className="p-4 rounded-2xl bg-[#14141f] border border-indigo-500/25 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-bold text-white block">تفعيل الترجمة الصوتية أثناء الاستماع</span>
              <p className="text-xs text-slate-400">
                تشغيل النطق الصوتي التلقائي لترجمة الآية بالتزامن مع تلاوة القارئ
              </p>
            </div>

            <button
              onClick={handleToggleTTS}
              className={`w-14 h-7 rounded-full transition-colors cursor-pointer relative p-1 shrink-0 ${
                isEnabled ? 'bg-indigo-600' : 'bg-[#252536]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  isEnabled ? 'translate-x-0' : '-translate-x-7'
                }`}
              />
            </button>
          </div>

          {/* Sync Mode Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200">
              نمط المزامنة مع تلاوة القارئ:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Consecutive: Recitation then Translation */}
              <button
                onClick={() => onUpdateSettings({ ttsSyncMode: 'consecutive', ttsEnabled: true })}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-2 relative ${
                  currentMode === 'consecutive' && isEnabled
                    ? 'bg-[#1a1a2b] border-indigo-500 ring-2 ring-indigo-500/25 text-white'
                    : 'bg-[#12121c] border-[#222232] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-indigo-300">التلاوة ثم الترجمة</span>
                  {currentMode === 'consecutive' && isEnabled && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  يتلو القارئ الآية، وفور انتهائها تُقرأ ترجمتها صوتياً، ثم ينتقل للآية التالية تلقائياً.
                </p>
              </button>

              {/* Simultaneous: Background ducking */}
              <button
                onClick={() => onUpdateSettings({ ttsSyncMode: 'simultaneous', ttsEnabled: true })}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-2 relative ${
                  currentMode === 'simultaneous' && isEnabled
                    ? 'bg-[#1a1a2b] border-indigo-500 ring-2 ring-indigo-500/25 text-white'
                    : 'bg-[#12121c] border-[#222232] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-indigo-300">متزامن بالتوازي</span>
                  {currentMode === 'simultaneous' && isEnabled && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  خفض صوت تلاوة القارئ خفيفاً أثناء قراءة الترجمة الصوتية في نفس الوقت.
                </p>
              </button>

              {/* Only TTS */}
              <button
                onClick={() => onUpdateSettings({ ttsSyncMode: 'only_tts', ttsEnabled: true })}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-2 relative ${
                  currentMode === 'only_tts' && isEnabled
                    ? 'bg-[#1a1a2b] border-indigo-500 ring-2 ring-indigo-500/25 text-white'
                    : 'bg-[#12121c] border-[#222232] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-indigo-300">الترجمة الصوتية فقط</span>
                  {currentMode === 'only_tts' && isEnabled && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  الاستماع لنطق معاني الآيات باللغة المختارة آية بآية دون صوت القارئ.
                </p>
              </button>

            </div>
          </div>

          {/* Target Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-400" />
                <span>لغة الترجمة الصوتية:</span>
              </label>
              <span className="text-xs text-indigo-300 font-medium">
                {currentLangConfig.flag} {currentLangConfig.nameArabic}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TTS_LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onUpdateSettings({ 
                        ttsLanguage: lang.code,
                        translationLang: (lang.code !== 'ar_tafsir' ? lang.code : settings.translationLang) as any
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/30'
                        : 'bg-[#12121a] border-[#222230] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{lang.flag}</span>
                      <div className="truncate">
                        <p className="text-xs truncate">{lang.nameArabic}</p>
                        <p className="text-[10px] text-slate-400 truncate">{lang.nameNative}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed & Volume Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#14141f] border border-[#222232]">
            
            {/* Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                  سرعة نطق الترجمة:
                </span>
                <span className="font-mono text-indigo-300 font-bold">
                  {(settings.ttsSpeed || 1.0).toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={settings.ttsSpeed || 1.0}
                onChange={(e) => onUpdateSettings({ ttsSpeed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-[#252536] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.75x بطيء</span>
                <span>1.0x طبيعي</span>
                <span>1.5x سريع</span>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  مستوى صوت الترجمة:
                </span>
                <span className="font-mono text-indigo-300 font-bold">
                  {Math.round((settings.ttsVolume !== undefined ? settings.ttsVolume : 1.0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={settings.ttsVolume !== undefined ? settings.ttsVolume : 1.0}
                onChange={(e) => onUpdateSettings({ ttsVolume: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-[#252536] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>20%</span>
                <span>60%</span>
                <span>100%</span>
              </div>
            </div>

          </div>

          {/* Test Voice Button */}
          <div className="pt-1">
            <button
              onClick={handleTestSpeech}
              className={`w-full py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                isTesting
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                  : 'bg-[#181826] border-indigo-500/30 text-indigo-200 hover:bg-indigo-600/20 hover:border-indigo-400'
              }`}
            >
              {isTesting ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>جاري تشغيل الصوت التجريبي... (انقر للإيقاف)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>تجربة نطق الصوت الحالي ({currentLangConfig.nameArabic})</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e1e2c] bg-[#12121a] flex items-center justify-between text-xs text-slate-400">
          <span>يتم حفظ الإعدادات تلقائياً وتطبيقها فوراً أثناء التلاوة</span>
          <button
            onClick={() => {
              stopTTS();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors cursor-pointer"
          >
            تم الحفظ
          </button>
        </div>

      </div>
    </div>
  );
};
