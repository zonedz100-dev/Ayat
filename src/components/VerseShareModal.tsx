import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Sparkles,
  Sliders,
  Type,
  Maximize2,
  RefreshCw,
  Palette,
  FileText
} from 'lucide-react';
import { SurahDetail, Ayah, Reciter } from '../types';

interface VerseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahData: SurahDetail;
  initialAyah?: Ayah | null;
  activeReciter?: Reciter;
}

type AspectRatio = '1:1' | '9:16' | '16:9';
type CardThemeId = 'midnight_gold' | 'emerald_luxury' | 'parchment_antique' | 'serene_dusk' | 'pure_oled' | 'royal_sapphire';

interface CardTheme {
  id: CardThemeId;
  name: string;
  category: string;
  bgColor: string;
  bgGradient?: string[];
  textColor: string;
  accentColor: string;
  secondaryColor: string;
  borderColor: string;
  glowColor: string;
}

const CARD_THEMES: CardTheme[] = [
  {
    id: 'midnight_gold',
    name: 'الليل المُذهب',
    category: 'داكن فاخر',
    bgColor: '#0a0a0f',
    bgGradient: ['#0f0f18', '#07070b'],
    textColor: '#f8fafc',
    accentColor: '#f59e0b',
    secondaryColor: '#cbd5e1',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    glowColor: 'rgba(245, 158, 11, 0.12)'
  },
  {
    id: 'emerald_luxury',
    name: 'الزمرد الملكي',
    category: 'إسلامي كلاسيكي',
    bgColor: '#032015',
    bgGradient: ['#063826', '#021810'],
    textColor: '#ecfdf5',
    accentColor: '#34d399',
    secondaryColor: '#a7f3d0',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    glowColor: 'rgba(52, 211, 153, 0.15)'
  },
  {
    id: 'parchment_antique',
    name: 'المخطوطة العتيقة',
    category: 'تراثي دافئ',
    bgColor: '#f5efe1',
    bgGradient: ['#faf5ea', '#ede2cf'],
    textColor: '#29180c',
    accentColor: '#92400e',
    secondaryColor: '#5a3d28',
    borderColor: 'rgba(146, 64, 14, 0.35)',
    glowColor: 'rgba(146, 64, 14, 0.08)'
  },
  {
    id: 'royal_sapphire',
    name: 'الياقوت الكحلي',
    category: 'هادئ سماوي',
    bgColor: '#07162c',
    bgGradient: ['#0c2346', '#040d1b'],
    textColor: '#f0f9ff',
    accentColor: '#38bdf8',
    secondaryColor: '#bae6fd',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    glowColor: 'rgba(56, 189, 248, 0.12)'
  },
  {
    id: 'serene_dusk',
    name: 'الشفق الهادئ',
    category: 'تدرج ملهم',
    bgColor: '#180d2b',
    bgGradient: ['#2e1065', '#4c0519'],
    textColor: '#fdf4ff',
    accentColor: '#f472b6',
    secondaryColor: '#fbcfe8',
    borderColor: 'rgba(244, 114, 182, 0.35)',
    glowColor: 'rgba(244, 114, 182, 0.12)'
  },
  {
    id: 'pure_oled',
    name: 'الأسود الحالك النقي',
    category: 'حديث مبسط',
    bgColor: '#000000',
    textColor: '#ffffff',
    accentColor: '#e2e8f0',
    secondaryColor: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    glowColor: 'rgba(255, 255, 255, 0.05)'
  }
];

export const VerseShareModal: React.FC<VerseShareModalProps> = ({
  isOpen,
  onClose,
  surahData,
  initialAyah,
  activeReciter
}) => {
  const [selectedAyahNumber, setSelectedAyahNumber] = useState<number>(
    initialAyah?.numberInSurah || 1
  );
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedThemeId, setSelectedThemeId] = useState<CardThemeId>('midnight_gold');
  
  // Customization Toggles
  const [showBismillah, setShowBismillah] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [showTafsir, setShowTafsir] = useState<boolean>(false);
  const [showFrame, setShowFrame] = useState<boolean>(true);
  const [showBranding, setShowBranding] = useState<boolean>(true);
  const [fontScale, setFontScale] = useState<number>(1);
  const [fontFamily, setFontFamily] = useState<'amiri' | 'scheherazade' | 'cairo'>('amiri');

  // Action status states
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update target ayah when initialAyah changes
  useEffect(() => {
    if (initialAyah?.numberInSurah) {
      setSelectedAyahNumber(initialAyah.numberInSurah);
    }
  }, [initialAyah]);

  const currentAyah = surahData.ayahs.find(
    (a) => a.numberInSurah === selectedAyahNumber
  ) || surahData.ayahs[0];

  const currentTheme = CARD_THEMES.find((t) => t.id === selectedThemeId) || CARD_THEMES[0];

  // Canvas Drawing
  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentAyah) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions based on Aspect Ratio (High-Res 2X for crystal clear sharing)
    let width = 1080;
    let height = 1080;

    if (aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background
    if (currentTheme.bgGradient && currentTheme.bgGradient.length >= 2) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, currentTheme.bgGradient[0]);
      grad.addColorStop(1, currentTheme.bgGradient[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = currentTheme.bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Subtle Glow & Background Texture
    const centerGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.7);
    centerGrad.addColorStop(0, currentTheme.glowColor);
    centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = centerGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Islamic Frame / Borders (if enabled)
    if (showFrame) {
      const margin = width * 0.04;
      const innerMargin = margin + 12;

      // Outer border
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      // Inner subtle border
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

      // Corner ornaments
      const cornerSize = width * 0.05;
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = currentTheme.accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(cornerSize, 0);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, cornerSize);
        ctx.stroke();

        ctx.fillStyle = currentTheme.accentColor;
        ctx.beginPath();
        ctx.arc(cornerSize * 0.5, cornerSize * 0.5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawCorner(innerMargin, innerMargin, 0);
      drawCorner(width - innerMargin, innerMargin, Math.PI / 2);
      drawCorner(width - innerMargin, height - innerMargin, Math.PI);
      drawCorner(innerMargin, height - innerMargin, -Math.PI / 2);
    }

    // Font Family selection
    let fontName = '"Amiri Quran", "Amiri", serif';
    if (fontFamily === 'scheherazade') {
      fontName = '"Scheherazade New", serif';
    } else if (fontFamily === 'cairo') {
      fontName = '"Cairo", sans-serif';
    }

    // 4. Header: Surah Name & Ayah details
    const headerY = height * 0.12;
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';

    // Surah Badge / Ornament Header
    ctx.fillStyle = currentTheme.accentColor;
    ctx.font = 'bold 36px "Cairo", sans-serif';
    ctx.fillText(`سورة ${surahData.name}`, width / 2, headerY);

    ctx.fillStyle = currentTheme.secondaryColor;
    ctx.font = '24px "Cairo", sans-serif';
    ctx.fillText(
      `${surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • الآية رقم ${currentAyah.numberInSurah} من ${surahData.numberOfAyahs}`,
      width / 2,
      headerY + 44
    );

    // Decorative divider under header
    const divWidth = width * 0.35;
    ctx.strokeStyle = currentTheme.borderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - divWidth / 2, headerY + 70);
    ctx.lineTo(width / 2 + divWidth / 2, headerY + 70);
    ctx.stroke();

    ctx.fillStyle = currentTheme.accentColor;
    ctx.beginPath();
    ctx.arc(width / 2, headerY + 70, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. Bismillah (if enabled and applicable)
    let currentY = headerY + 120;
    if (showBismillah && surahData.number !== 9 && (currentAyah.numberInSurah === 1 || aspectRatio === '9:16')) {
      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = '36px "Amiri Quran", "Amiri", serif';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, currentY);
      currentY += 60;
    }

    // 6. Quranic Ayah Text Calculation & Multiline Wrapping
    const baseFontSize = aspectRatio === '9:16' ? 44 : aspectRatio === '16:9' ? 38 : 42;
    const computedFontSize = Math.round(baseFontSize * fontScale);
    const lineHeight = Math.round(computedFontSize * 1.85);
    const maxTextWidth = width * 0.82;

    ctx.font = `bold ${computedFontSize}px ${fontName}`;
    ctx.fillStyle = currentTheme.textColor;

    const words = currentAyah.text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Center vertical placement if space allows
    const totalAyahHeight = lines.length * lineHeight;
    let textStartY = currentY + 30;

    if (aspectRatio === '1:1' || aspectRatio === '9:16') {
      const availableSpace = height * 0.7 - currentY;
      if (availableSpace > totalAyahHeight) {
        textStartY = currentY + (availableSpace - totalAyahHeight) / 3;
      }
    }

    // Render Quran Lines
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], width / 2, textStartY + i * lineHeight);
    }

    let endOfAyahY = textStartY + (lines.length - 1) * lineHeight + computedFontSize + 20;

    // 7. End of Ayah Ornament Symbol: ﴿ رقم ﴾
    ctx.font = 'bold 30px "Cairo", "Amiri", sans-serif';
    ctx.fillStyle = currentTheme.accentColor;
    ctx.fillText(`﴿ ${currentAyah.numberInSurah} ﴾`, width / 2, endOfAyahY);
    endOfAyahY += 45;

    // 8. Optional Tafsir or Translation
    if (showTranslation && currentAyah.translation) {
      endOfAyahY += 15;
      ctx.fillStyle = currentTheme.secondaryColor;
      ctx.font = 'italic 24px "Cairo", Arial, sans-serif';
      
      const transWords = currentAyah.translation.split(' ');
      let transLine = '';
      const transLines: string[] = [];
      const maxTransWidth = width * 0.8;

      for (const word of transWords) {
        const testLine = transLine ? `${transLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxTransWidth && transLine) {
          transLines.push(transLine);
          transLine = word;
        } else {
          transLine = testLine;
        }
      }
      if (transLine) transLines.push(transLine);

      // Max 3 lines of translation
      const shownTransLines = transLines.slice(0, 3);
      for (let i = 0; i < shownTransLines.length; i++) {
        ctx.fillText(shownTransLines[i], width / 2, endOfAyahY + i * 36);
      }
      endOfAyahY += shownTransLines.length * 36;
    } else if (showTafsir && currentAyah.tafsir) {
      endOfAyahY += 15;
      ctx.fillStyle = currentTheme.secondaryColor;
      ctx.font = '22px "Cairo", sans-serif';
      
      const tafsirWords = currentAyah.tafsir.split(' ');
      let tafLine = '';
      const tafLines: string[] = [];
      const maxTafWidth = width * 0.82;

      for (const word of tafsirWords) {
        const testLine = tafLine ? `${tafLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxTafWidth && tafLine) {
          tafLines.push(tafLine);
          tafLine = word;
        } else {
          tafLine = testLine;
        }
      }
      if (tafLine) tafLines.push(tafLine);

      const shownTafLines = tafLines.slice(0, 3);
      for (let i = 0; i < shownTafLines.length; i++) {
        ctx.fillText(shownTafLines[i], width / 2, endOfAyahY + i * 34);
      }
      endOfAyahY += shownTafLines.length * 34;
    }

    // 9. Footer: App Branding & Reciter (if enabled)
    if (showBranding) {
      const footerY = height - (width * 0.07);
      
      ctx.fillStyle = currentTheme.secondaryColor;
      ctx.font = '20px "Cairo", sans-serif';
      const brandingText = activeReciter
        ? `تطبيق آيات للقرآن الكريم • تلاوة: ${activeReciter.name}`
        : 'تطبيق آيات للقرآن الكريم • Ayat Quran App';
      ctx.fillText(brandingText, width / 2, footerY);
    }

    ctx.restore();
  };

  // Re-draw whenever relevant state changes
  useEffect(() => {
    if (isOpen && activeTab === 'image') {
      // Small timeout to ensure font loaded/DOM ready
      const timer = setTimeout(() => {
        drawCard();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    activeTab,
    selectedAyahNumber,
    aspectRatio,
    selectedThemeId,
    showBismillah,
    showTranslation,
    showTafsir,
    showFrame,
    showBranding,
    fontScale,
    fontFamily
  ]);

  if (!isOpen) return null;

  // Pre-formatted text for sharing
  const formattedShareText = `﴿ ${currentAyah.text} ﴾\n\n[سورة ${surahData.name}: الآية ${currentAyah.numberInSurah}]\n${
    showTranslation && currentAyah.translation ? `"${currentAyah.translation}"\n` : ''
  }${
    showTafsir && currentAyah.tafsir ? `التفسير: ${currentAyah.tafsir}\n` : ''
  }\nمُشارَك عبر تطبيق آيات للقرآن الكريم\n${window.location.href}`;

  // Copy Plain Text
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopiedText(true);
      setStatusMessage({ text: 'تم نسخ نص الآية بنجاح!', type: 'success' });
      setTimeout(() => {
        setCopiedText(false);
        setStatusMessage(null);
      }, 3000);
    } catch (err) {
      setStatusMessage({ text: 'تعذر النسخ إلى الحافظة', type: 'error' });
    }
  };

  // Social Share Handlers
  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedShareText)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
      `﴿ ${currentAyah.text} ﴾\n[سورة ${surahData.name}: الآية ${currentAyah.numberInSurah}]`
    )}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const tweetText = `﴿ ${currentAyah.text} ﴾\n[سورة ${surahData.name}: ${currentAyah.numberInSurah}]`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}&quote=${encodeURIComponent(`﴿ ${currentAyah.text} ﴾ [سورة ${surahData.name}: الآية ${currentAyah.numberInSurah}]`)}`;
    window.open(url, '_blank');
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    setIsSharing(true);
    try {
      const canvas = canvasRef.current;
      if (activeTab === 'image' && canvas && navigator.canShare) {
        // Attempt to share as image file
        canvas.toBlob(async (blob) => {
          if (!blob) {
            await navigator.share({
              title: `سورة ${surahData.name} - الآية ${currentAyah.numberInSurah}`,
              text: formattedShareText,
              url: window.location.href
            });
            return;
          }
          const file = new File([blob], `Ayah_${surahData.number}_${currentAyah.numberInSurah}.png`, {
            type: 'image/png'
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `سورة ${surahData.name} - الآية ${currentAyah.numberInSurah}`,
              text: `﴿ ${currentAyah.text} ﴾ [سورة ${surahData.name}: الآية ${currentAyah.numberInSurah}]`,
              files: [file]
            });
          } else {
            await navigator.share({
              title: `سورة ${surahData.name} - الآية ${currentAyah.numberInSurah}`,
              text: formattedShareText,
              url: window.location.href
            });
          }
          setStatusMessage({ text: 'تمت المشاركة بنجاح!', type: 'success' });
          setTimeout(() => setStatusMessage(null), 3000);
        }, 'image/png');
      } else if (navigator.share) {
        await navigator.share({
          title: `سورة ${surahData.name} - الآية ${currentAyah.numberInSurah}`,
          text: formattedShareText,
          url: window.location.href
        });
        setStatusMessage({ text: 'تمت المشاركة بنجاح!', type: 'success' });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        handleCopyText();
      }
    } catch (err) {
      console.log('Share canceled or error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  // Direct Image Download (PNG)
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloading(true);
    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Ayah_Surah_${surahData.number}_${currentAyah.numberInSurah}_${currentTheme.id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusMessage({ text: 'تم تنزيل بطاقة الآية بنجاح!', type: 'success' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setStatusMessage({ text: 'تعذر تنزيل الصورة، يرجى المحاولة مرة أخرى', type: 'error' });
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Blob creation failed');
        if (navigator.clipboard && (window as any).ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedImage(true);
          setStatusMessage({ text: 'تم نسخ صورة الآية للحافظة! يمكنك لصقها الآن في أي محادثة.', type: 'success' });
          setTimeout(() => {
            setCopiedImage(false);
            setStatusMessage(null);
          }, 3500);
        } else {
          // Fallback to downloading
          handleDownloadImage();
        }
      }, 'image/png');
    } catch (err) {
      setStatusMessage({ text: 'متصفحك لا يدعم نسخ الصور مباشرة، يمكنك تنزيلها أو نسخ النص.', type: 'error' });
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0f0f14] border border-indigo-500/25 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#222230] bg-[#14141d]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-sans flex items-center gap-2">
                <span>مشاركة الآيات القرآنية</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
                  سورة {surahData.name}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                أنشئ بطاقات قرآنية مصممة بأناقة أو شارك النص مباشرة عبر منصات التواصل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#222230] transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Message */}
        {statusMessage && (
          <div
            className={`px-4 py-2.5 text-xs text-center font-medium transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-b border-red-500/30'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Tab Switcher & Ayah Selector Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-[#222230] bg-[#111118] flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1a1a24] rounded-xl border border-[#2c2c3e]">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === 'image'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>صانع بطاقات الصور</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>مشاركة نصية سريعة</span>
            </button>
          </div>

          {/* Ayah Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">الآية:</span>
            <select
              value={selectedAyahNumber}
              onChange={(e) => setSelectedAyahNumber(Number(e.target.value))}
              className="bg-[#181822] border border-[#2a2a3c] text-white rounded-xl px-3 py-1.5 text-xs font-sans focus:border-indigo-500 focus:outline-none cursor-pointer max-w-[220px] sm:max-w-xs"
            >
              {surahData.ayahs.map((a) => (
                <option key={a.numberInSurah} value={a.numberInSurah}>
                  الآية {a.numberInSurah}: {a.text.slice(0, 36)}...
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {activeTab === 'image' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Live Visual Preview */}
              <div className="lg:col-span-6 flex flex-col items-center gap-4">
                <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    معاينة حية للبطاقة
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {aspectRatio === '1:1' ? '1080 × 1080 (Square)' : aspectRatio === '9:16' ? '1080 × 1920 (Story)' : '1920 × 1080 (Landscape)'}
                  </span>
                </div>

                {/* Canvas Container with dynamic aspect ratio */}
                <div
                  className={`w-full max-w-sm sm:max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/20 bg-[#07070a] flex items-center justify-center transition-all ${
                    aspectRatio === '9:16'
                      ? 'aspect-[9/16] max-h-[520px]'
                      : aspectRatio === '16:9'
                      ? 'aspect-[16/9]'
                      : 'aspect-square'
                  }`}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Quick Aspect Ratio Selector */}
                <div className="w-full grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      aspectRatio === '1:1'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#14141e] border-[#222230] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>1:1 مربع</span>
                    <span className="text-[10px] text-slate-500">(منشور)</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      aspectRatio === '9:16'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#14141e] border-[#222230] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>9:16 طولي</span>
                    <span className="text-[10px] text-slate-500">(ستوري/حالة)</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      aspectRatio === '16:9'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold'
                        : 'bg-[#14141e] border-[#222230] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>16:9 عرضي</span>
                    <span className="text-[10px] text-slate-500">(تويتر/يوتيوب)</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Customization Controls & Actions */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* 1. Themes Palette */}
                <div className="p-4 bg-[#14141e] border border-[#222232] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-indigo-400" />
                      طابع التصميم والألوان:
                    </span>
                    <span className="text-[11px] text-indigo-300 font-mono">
                      {currentTheme.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CARD_THEMES.map((theme) => {
                      const isSelected = theme.id === selectedThemeId;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedThemeId(theme.id)}
                          className={`p-2.5 rounded-xl border text-right cursor-pointer transition-all flex flex-col gap-1.5 relative overflow-hidden ${
                            isSelected
                              ? 'border-indigo-400 ring-2 ring-indigo-500/30 bg-[#1c1c2b]'
                              : 'border-[#262638] bg-[#11111a] hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div
                              className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                              style={{
                                background: theme.bgGradient
                                  ? `linear-gradient(135deg, ${theme.bgGradient[0]}, ${theme.bgGradient[1]})`
                                  : theme.bgColor
                              }}
                            />
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{theme.name}</p>
                            <p className="text-[10px] text-slate-400">{theme.category}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Typography & Font Size Controls */}
                <div className="p-4 bg-[#14141e] border border-[#222232] rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-indigo-400" />
                    الخط وتنسيق النص:
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFontFamily('amiri')}
                      className={`p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        fontFamily === 'amiri'
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-[#11111a] border-[#262638] text-slate-400 hover:text-white'
                      }`}
                    >
                      مصحف أميري
                    </button>
                    <button
                      onClick={() => setFontFamily('scheherazade')}
                      className={`p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        fontFamily === 'scheherazade'
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-[#11111a] border-[#262638] text-slate-400 hover:text-white'
                      }`}
                    >
                      شهرزاد النَسخي
                    </button>
                    <button
                      onClick={() => setFontFamily('cairo')}
                      className={`p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        fontFamily === 'cairo'
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-[#11111a] border-[#262638] text-slate-400 hover:text-white'
                      }`}
                    >
                      كايرو الحديث
                    </button>
                  </div>

                  {/* Font Scale Slider */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>حجم الخط:</span>
                      <span className="font-mono text-indigo-300">{Math.round(fontScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.4"
                      step="0.05"
                      value={fontScale}
                      onChange={(e) => setFontScale(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#252536] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Elements Display Toggles */}
                <div className="p-4 bg-[#14141e] border border-[#222232] rounded-2xl space-y-2.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    عناصر البطاقة:
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-[#11111a] border border-[#262638] cursor-pointer hover:border-slate-600">
                      <input
                        type="checkbox"
                        checked={showBismillah}
                        onChange={(e) => setShowBismillah(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-500"
                      />
                      <span>البسملة الكريمة</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-[#11111a] border border-[#262638] cursor-pointer hover:border-slate-600">
                      <input
                        type="checkbox"
                        checked={showFrame}
                        onChange={(e) => setShowFrame(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-500"
                      />
                      <span>الإطار والزخرفة</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-[#11111a] border border-[#262638] cursor-pointer hover:border-slate-600">
                      <input
                        type="checkbox"
                        checked={showTranslation}
                        onChange={(e) => {
                          setShowTranslation(e.target.checked);
                          if (e.target.checked) setShowTafsir(false);
                        }}
                        className="rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-500"
                      />
                      <span>الترجمة الإنجليزية</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-[#11111a] border border-[#262638] cursor-pointer hover:border-slate-600">
                      <input
                        type="checkbox"
                        checked={showTafsir}
                        onChange={(e) => {
                          setShowTafsir(e.target.checked);
                          if (e.target.checked) setShowTranslation(false);
                        }}
                        className="rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-500"
                      />
                      <span>التفسير الميسر</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-[#11111a] border border-[#262638] cursor-pointer hover:border-slate-600 col-span-2">
                      <input
                        type="checkbox"
                        checked={showBranding}
                        onChange={(e) => setShowBranding(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-500"
                      />
                      <span>تذييل اسم التطبيق والقارئ</span>
                    </label>
                  </div>
                </div>

                {/* 4. Action Buttons for Image */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  
                  {/* Download PNG Button */}
                  <button
                    onClick={handleDownloadImage}
                    disabled={isDownloading}
                    className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الصورة (PNG)</span>
                  </button>

                  {/* Copy Image Button */}
                  <button
                    onClick={handleCopyImageToClipboard}
                    className="py-3 px-4 rounded-xl bg-[#1c1c2b] border border-indigo-500/30 hover:border-indigo-400 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                    title="نسخ الصورة مباشرة للصقها في واتساب وتيليجرام"
                  >
                    {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedImage ? 'تم نسخ الصورة!' : 'نسخ الصورة'}</span>
                  </button>

                  {/* Native Share */}
                  <button
                    onClick={handleNativeShare}
                    disabled={isSharing}
                    className="py-3 px-4 rounded-xl bg-[#14141e] border border-[#2c2c3e] hover:border-slate-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    <span>مشاركة عبر الجهاز</span>
                  </button>

                </div>

              </div>

            </div>
          ) : (
            /* Quick Text & Social Media Share Tab */
            <div className="max-w-2xl mx-auto space-y-6 py-2">
              
              {/* Formatted Text Preview Box */}
              <div className="p-5 rounded-2xl bg-[#14141e] border border-[#262638] space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>معاينة النص القرآني المنسق للمشاركة:</span>
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'تم النسخ!' : 'نسخ النص'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0b0b10] border border-[#1f1f2e] text-right font-arabic space-y-3 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  <p className="text-base sm:text-lg font-bold text-amber-300 font-quran leading-loose">
                    ﴿ {currentAyah.text} ﴾
                  </p>
                  <p className="text-xs text-slate-400 font-sans">
                    [سورة {surahData.name}: الآية {currentAyah.numberInSurah}]
                  </p>
                  {showTranslation && currentAyah.translation && (
                    <p className="text-xs text-slate-300 italic border-t border-[#1f1f2e] pt-2 font-sans">
                      "{currentAyah.translation}"
                    </p>
                  )}
                </div>
              </div>

              {/* Direct Social Media Channels */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-300">
                  مشاركة فورية عبر تطبيقات التواصل:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  {/* WhatsApp */}
                  <button
                    onClick={handleShareWhatsApp}
                    className="p-3.5 rounded-2xl bg-[#075e54]/20 border border-[#25d366]/30 hover:border-[#25d366] text-white flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-[#075e54]/30 active:scale-[0.98]"
                  >
                    <div className="p-2 rounded-full bg-[#25d366] text-white">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold">واتساب</span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={handleShareTelegram}
                    className="p-3.5 rounded-2xl bg-[#0088cc]/20 border border-[#0088cc]/30 hover:border-[#0088cc] text-white flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-[#0088cc]/30 active:scale-[0.98]"
                  >
                    <div className="p-2 rounded-full bg-[#0088cc] text-white">
                      <Send className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold">تيليجرام</span>
                  </button>

                  {/* X (Twitter) */}
                  <button
                    onClick={handleShareTwitter}
                    className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-slate-500 text-white flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-slate-800/60 active:scale-[0.98]"
                  >
                    <div className="p-2 rounded-full bg-slate-900 text-white border border-slate-700">
                      <Twitter className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold">منصة X</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={handleShareFacebook}
                    className="p-3.5 rounded-2xl bg-[#1877f2]/20 border border-[#1877f2]/30 hover:border-[#1877f2] text-white flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-[#1877f2]/30 active:scale-[0.98]"
                  >
                    <div className="p-2 rounded-full bg-[#1877f2] text-white">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold">فيسبوك</span>
                  </button>

                </div>
              </div>

              {/* Native System Share */}
              <div className="pt-2">
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر قائمة تطبيقات الهاتف / الجهاز</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 border-t border-[#222230] bg-[#14141d]/90 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>قال رسول الله ﷺ: «بَلِّغُوا عَنِّي وَلَوْ آيَةً»</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#222230] hover:bg-[#2c2c3e] text-slate-200 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
