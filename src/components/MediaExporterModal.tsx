import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Download, 
  Film, 
  Music, 
  Play, 
  Pause, 
  Check, 
  Sparkles, 
  Loader2, 
  Layers, 
  Monitor, 
  Smartphone, 
  Square, 
  Share2,
  Volume2,
  Palette,
  Image as ImageIcon,
  Upload,
  Sliders,
  Sun,
  Moon,
  Mountain,
  Trees,
  CloudSun,
  Eye,
  RefreshCw,
  BookOpen,
  FileText,
  StopCircle
} from 'lucide-react';
import { SurahDetail, Ayah, Reciter } from '../types';
import { getGlobalAyahNumber } from '../data/quranData';

interface MediaExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahData: SurahDetail | null;
  activeReciter: Reciter;
  selectedAyahNumber?: number | null;
}

type ExportTab = 'video_mp4' | 'audio_mp3';
type AspectRatio = '9:16' | '16:9' | '1:1';
type VideoScope = 'ayah' | 'surah';
type BackgroundType = 'gradient' | 'solid' | 'landscape' | 'custom';

interface LandscapePreset {
  id: string;
  name: string;
  url: string;
  category: string;
}

const LANDSCAPE_PRESETS: LandscapePreset[] = [
  {
    id: 'stars',
    name: 'سماء ليلية ونجوم',
    category: 'فضاء',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'mountains',
    name: 'قمم الجبال والضباب',
    category: 'طبيعة',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'desert',
    name: 'كثبان رملية وغروب',
    category: 'صحراء',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'forest',
    name: 'غابات خضراء وأنهار',
    category: 'طبيعة',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'mosque',
    name: 'عمارة إسلامية ومحراب',
    category: 'روحاني',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'ocean',
    name: 'شاطئ هادئ وأفق البحر',
    category: 'بحر',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
  }
];

const GRADIENT_PRESETS = [
  { id: 'indigo', name: 'ليلي إنديجو', colors: ['#06060c', '#0f1026', '#050508'], accent: '#818cf8' },
  { id: 'emerald', name: 'نور الزمرد', colors: ['#021a12', '#053829', '#01120c'], accent: '#34d399' },
  { id: 'gold', name: 'محراب ذهبي', colors: ['#1c1503', '#332709', '#120e02'], accent: '#fbbf24' },
  { id: 'crimson', name: 'أفق العقيق', colors: ['#1a040b', '#380918', '#100206'], accent: '#fb7185' },
  { id: 'royal_blue', name: 'أزرق ملكي', colors: ['#040d1a', '#081f3d', '#02070e'], accent: '#38bdf8' },
  { id: 'obsidian', name: 'أوبسيديان أسود', colors: ['#000000', '#0a0a0f', '#000000'], accent: '#e2e8f0' }
];

const SOLID_COLORS = [
  { id: 'pure_black', name: 'أسود داكن', color: '#09090b', accent: '#f8fafc' },
  { id: 'deep_navy', name: 'كحلي ملكي', color: '#0b132b', accent: '#60a5fa' },
  { id: 'deep_emerald', name: 'زمردي داكن', color: '#062c20', accent: '#34d399' },
  { id: 'deep_burgundy', name: 'عنابي فاخر', color: '#2a0812', accent: '#f43f5e' },
  { id: 'slate_dark', name: 'رمادي حجري', color: '#18181b', accent: '#cbd5e1' },
  { id: 'warm_sepia', name: 'بني عسلي', color: '#1f150d', accent: '#fbbf24' }
];

export const MediaExporterModal: React.FC<MediaExporterModalProps> = ({
  isOpen,
  onClose,
  surahData,
  activeReciter,
  selectedAyahNumber
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('video_mp4');
  const [videoScope, setVideoScope] = useState<VideoScope>('ayah');
  const [targetAyahNum, setTargetAyahNum] = useState<number>(selectedAyahNumber || 1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  
  // Background Customization States
  const [bgType, setBgType] = useState<BackgroundType>('gradient');
  const [selectedGradient, setSelectedGradient] = useState<string>('indigo');
  const [selectedSolidColor, setSelectedSolidColor] = useState<string>('#09090b');
  const [selectedLandscape, setSelectedLandscape] = useState<string>('stars');
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [bgDarknessOverlay, setBgDarknessOverlay] = useState<number>(0.65); // 0.2 to 0.9
  const [includeTranslation, setIncludeTranslation] = useState<boolean>(true);
  const [includeAudioVisualizer, setIncludeAudioVisualizer] = useState<boolean>(true);

  // Recording / Generating States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);
  const [totalVideoDuration, setTotalVideoDuration] = useState<number>(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string>('');
  const [isAudioDownloading, setIsAudioDownloading] = useState<boolean>(false);
  const [audioDownloadSuccess, setAudioDownloadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio & Recording active references
  const recordingDurationRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordIntervalRef = useRef<any>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Update target Ayah if prop changes
  useEffect(() => {
    if (selectedAyahNumber) {
      setTargetAyahNum(selectedAyahNumber);
    }
  }, [selectedAyahNumber]);

  // Load Image when background changes
  useEffect(() => {
    let active = true;
    let urlToLoad: string | null = null;

    if (bgType === 'landscape') {
      const preset = LANDSCAPE_PRESETS.find((p) => p.id === selectedLandscape);
      if (preset) urlToLoad = preset.url;
    } else if (bgType === 'custom' && customImageSrc) {
      urlToLoad = customImageSrc;
    }

    if (urlToLoad) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (active) {
          loadedImageRef.current = img;
        }
      };
      img.onerror = () => {
        if (active) {
          loadedImageRef.current = null;
        }
      };
      img.src = urlToLoad;
    } else {
      loadedImageRef.current = null;
    }

    return () => {
      active = false;
    };
  }, [bgType, selectedLandscape, customImageSrc]);

  // Handle custom image upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCustomImageSrc(objectUrl);
    setBgType('custom');
  };

  if (!isOpen || !surahData) return null;

  const currentAyah = surahData.ayahs.find((a) => a.numberInSurah === targetAyahNum) || surahData.ayahs[0];
  const globalAyahNumber = getGlobalAyahNumber(surahData.number, currentAyah.numberInSurah);
  const surah3Digits = String(surahData.number).padStart(3, '0');
  const ayah3Digits = String(currentAyah.numberInSurah).padStart(3, '0');

  const singleAyahAudioUrl = activeReciter.ayahAudioPattern 
    ? activeReciter.ayahAudioPattern(surahData.number, currentAyah.numberInSurah)
    : `https://everyayah.com/data/Alafasy_128kbps/${surah3Digits}${ayah3Digits}.mp3`;
  const fullSurahAudioUrl = activeReciter.surahAudioPattern(surahData.number);

  // Render video frame on canvas
  const drawFrame = (ctx: CanvasRenderingContext2D, width: number, height: number, timeProgress: number) => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Determine which Ayah to draw based on videoScope
    let ayahToDraw = currentAyah;
    if (videoScope === 'surah' && surahData.ayahs.length > 0) {
      const totalAyahs = surahData.ayahs.length;
      if (isRecording && recordingDurationRef.current > 0) {
        const progressRatio = Math.min(Math.max(timeProgress / recordingDurationRef.current, 0), 0.999);
        const ayahIdx = Math.floor(progressRatio * totalAyahs);
        ayahToDraw = surahData.ayahs[ayahIdx] || surahData.ayahs[0];
      } else {
        // In live preview: cycle smoothly every 5 seconds across ayahs
        const previewIdx = Math.floor(timeProgress / 5) % totalAyahs;
        ayahToDraw = surahData.ayahs[previewIdx] || surahData.ayahs[0];
      }
    }

    // 1. Draw Selected Background
    if (bgType === 'solid') {
      // Solid Color Background
      ctx.fillStyle = selectedSolidColor;
      ctx.fillRect(0, 0, width, height);

      // Subtle delicate frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 16, width - 32, height - 32);

    } else if (bgType === 'gradient') {
      // Gradient Background
      const gradConfig = GRADIENT_PRESETS.find((g) => g.id === selectedGradient) || GRADIENT_PRESETS[0];
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, gradConfig.colors[0]);
      grad.addColorStop(0.5, gradConfig.colors[1]);
      grad.addColorStop(1, gradConfig.colors[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle geometric grid
      ctx.strokeStyle = `${gradConfig.accent}15`;
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

    } else if ((bgType === 'landscape' || bgType === 'custom') && loadedImageRef.current) {
      // Draw Landscape or Custom Image (Cover fit)
      const img = loadedImageRef.current;
      const hRatio = width / img.width;
      const vRatio = height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - img.width * ratio) / 2;
      const centerShiftY = (height - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
      );

      // Dark Overlay on top for crystal clear text readability
      ctx.fillStyle = `rgba(0, 0, 0, ${bgDarknessOverlay})`;
      ctx.fillRect(0, 0, width, height);

    } else {
      // Fallback deep dark background
      ctx.fillStyle = '#0a0a10';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Decorative Top/Bottom Islamic Border Arcs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // 3. Soundwave Bars Animation (Audio Visualizer)
    if (includeAudioVisualizer) {
      const barCount = 36;
      const barWidth = width / (barCount * 1.7);
      const waveY = height * 0.84;
      
      const activeAccent = bgType === 'gradient' 
        ? (GRADIENT_PRESETS.find(g => g.id === selectedGradient)?.accent || '#818cf8')
        : '#fbbf24';

      ctx.fillStyle = activeAccent;

      for (let i = 0; i < barCount; i++) {
        const waveHeight = Math.sin(timeProgress * 5 + i * 0.35) * 18 + 22;
        const x = width / 2 + (i - barCount / 2) * (barWidth + 3.5);
        ctx.beginPath();
        ctx.roundRect(x, waveY - waveHeight / 2, barWidth, waveHeight, 3);
        ctx.fill();
      }
    }

    // 4. Header: Surah & Reciter Name Badge
    const headerY = height * 0.11;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Amiri", "Amiri Quran", Arial';
    if (videoScope === 'surah') {
      ctx.fillText(`سورة ${surahData.name} • الآية ${ayahToDraw.numberInSurah} من ${surahData.numberOfAyahs}`, width / 2, headerY);
    } else {
      ctx.fillText(`سورة ${surahData.name} • الآية ${ayahToDraw.numberInSurah}`, width / 2, headerY);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '14px "Cairo", Arial, sans-serif';
    ctx.fillText(`بصوت القارئ: ${activeReciter.arabicName}`, width / 2, headerY + 28);

    // 5. Bismillah (if applicable)
    if (surahData.number !== 9 && ayahToDraw.numberInSurah === 1 && surahData.number !== 1) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '24px "Amiri Quran", "Amiri", serif';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, height * 0.23);
    }

    // 6. Quranic Ayah Text (Word wrapped & beautifully centered)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Amiri Quran", "Amiri", serif';
    const textMaxWidth = width * 0.84;
    const words = ayahToDraw.text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > textMaxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = height * 0.44 - (lines.length * 24);
    lines.forEach((l, idx) => {
      ctx.fillText(l.trim(), width / 2, startY + idx * 52);
    });

    // 7. Verse number ornament
    const ornamentY = startY + lines.length * 52 + 12;
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`﴿ ${ayahToDraw.numberInSurah} ﴾`, width / 2, ornamentY);

    // 8. Optional Translation
    if (includeTranslation && ayahToDraw.translation) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '13px "Cairo", sans-serif';
      const transWords = ayahToDraw.translation.split(' ');
      let transLine = '';
      const transLines: string[] = [];
      for (let n = 0; n < transWords.length; n++) {
        const testLine = transLine + transWords[n] + ' ';
        if (ctx.measureText(testLine).width > textMaxWidth && n > 0) {
          transLines.push(transLine);
          transLine = transWords[n] + ' ';
        } else {
          transLine = testLine;
        }
      }
      transLines.push(transLine);
      transLines.slice(0, 3).forEach((tl, idx) => {
        ctx.fillText(tl.trim(), width / 2, ornamentY + 34 + idx * 22);
      });
    }

    // 9. Footer Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '12px "Cairo", sans-serif';
    ctx.fillText('تطبيق آيات للقرآن الكريم • Ayat Quran App', width / 2, height * 0.94);

    ctx.restore();
  };

  // Preview animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();
    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      const elapsed = isRecording && recordingStartTimeRef.current > 0
        ? (Date.now() - recordingStartTimeRef.current) / 1000
        : (Date.now() - startTime) / 1000;
      drawFrame(ctx, canvas.width, canvas.height, elapsed);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    currentAyah, 
    videoScope,
    aspectRatio, 
    bgType, 
    selectedGradient, 
    selectedSolidColor, 
    selectedLandscape, 
    customImageSrc, 
    bgDarknessOverlay, 
    includeTranslation, 
    includeAudioVisualizer, 
    activeReciter,
    isRecording
  ]);

  // Set canvas dimensions based on aspect ratio
  const getCanvasDimensions = () => {
    if (aspectRatio === '9:16') return { width: 540, height: 960 };
    if (aspectRatio === '16:9') return { width: 960, height: 540 };
    return { width: 640, height: 640 };
  };

  // Safe Decode Audio Data Helper supporting all browsers
  const decodeAudioBuffer = (audioCtx: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
    return new Promise((resolve, reject) => {
      audioCtx.decodeAudioData(
        arrayBuffer,
        (decoded) => resolve(decoded),
        (err) => reject(err)
      );
    });
  };

  // Helper to fetch audio buffer with multi-source fallback for either Ayah or full Surah
  const fetchAudioBuffer = async (audioContext: AudioContext, scope: VideoScope): Promise<AudioBuffer> => {
    let candidateUrls: string[] = [];
    
    if (scope === 'surah') {
      candidateUrls = [
        activeReciter.surahAudioPattern(surahData.number),
        `https://server8.mp3quran.net/afs/${surah3Digits}.mp3`,
        `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahData.number}.mp3`
      ].filter(Boolean);
    } else {
      candidateUrls = [
        activeReciter.ayahAudioPattern ? activeReciter.ayahAudioPattern(surahData.number, currentAyah.numberInSurah) : '',
        activeReciter.subfolder ? `https://everyayah.com/data/${activeReciter.subfolder}/${surah3Digits}${ayah3Digits}.mp3` : '',
        `https://everyayah.com/data/Alafasy_128kbps/${surah3Digits}${ayah3Digits}.mp3`,
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`
      ].filter(Boolean);
    }

    let arrayBuffer: ArrayBuffer | null = null;
    let lastError: any = null;

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          const buf = await blob.arrayBuffer();
          if (buf && buf.byteLength > 1000) {
            arrayBuffer = buf;
            break;
          }
        }
      } catch (err) {
        lastError = err;
        console.warn(`Audio fetch fallback from ${url}:`, err);
      }
    }

    if (!arrayBuffer) {
      throw new Error(
        scope === 'surah'
          ? 'تعذر تحميل الملف الصوتي للسورة كاملة من الخوادم. يرجى التحقق من اتصال الإنترنت.'
          : 'تعذر تحميل الملف الصوتي للآية من الخوادم المتاحة. يرجى التحقق من اتصال الإنترنت.'
      );
    }

    return await decodeAudioBuffer(audioContext, arrayBuffer);
  };

  // Robust Video Generation and Recording via Canvas + Web Audio + MediaRecorder
  const handleGenerateVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecording(true);
      setRecordProgress(5);
      setRecordedSeconds(0);
      setGeneratedVideoUrl(null);
      setErrorMessage(null);

      // 1. Setup AudioContext and fetch decoded audio
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      setRecordProgress(15);
      const audioBuffer = await fetchAudioBuffer(audioContext, videoScope);
      const duration = audioBuffer.duration;
      recordingDurationRef.current = duration;
      setTotalVideoDuration(Math.round(duration));

      // 2. Create audio destination stream
      const audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSourceNodeRef.current = audioSource;
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      audioSource.connect(mediaStreamDestination);

      // 3. Capture canvas stream at smooth 30 FPS
      const canvasStream = canvas.captureStream(30);
      const combinedTracks = [
        ...canvasStream.getVideoTracks(),
        ...mediaStreamDestination.stream.getAudioTracks()
      ];
      const combinedStream = new MediaStream(combinedTracks);

      // 4. Select best supported MIME type
      const candidateTypes = [
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4;codecs=h264,aac',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
      ];
      const selectedMime = candidateTypes.find((t) => {
        try {
          return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t);
        } catch {
          return false;
        }
      }) || 'video/webm';
      const isMp4Format = selectedMime.includes('mp4');

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 2500000 // 2.5 Mbps high quality
      });
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (recordIntervalRef.current) {
          clearInterval(recordIntervalRef.current);
          recordIntervalRef.current = null;
        }
        const fileExt = isMp4Format ? 'mp4' : 'mp4';
        const videoBlob = new Blob(chunks, { type: selectedMime });
        const url = URL.createObjectURL(videoBlob);
        const filename = videoScope === 'surah'
          ? `Ayat_Surah_${surahData.number}_Full_${activeReciter.name}.${fileExt}`
          : `Ayat_Surah_${surahData.number}_Ayah_${currentAyah.numberInSurah}_${activeReciter.name}.${fileExt}`;

        setGeneratedVideoUrl(url);
        setGeneratedFilename(filename);
        setIsRecording(false);
        setRecordProgress(100);

        // Auto trigger download
        try {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (downloadErr) {
          console.warn('Auto download blocked, user can click download button:', downloadErr);
        }

        try {
          audioContext.close();
        } catch (e) {}
      };

      // Start recording and audio buffer playback
      recordingStartTimeRef.current = Date.now();
      recorder.start();
      audioSource.start(0);

      // Update progress bar
      const startTime = Date.now();
      recordIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setRecordedSeconds(Math.floor(elapsed));
        const pct = Math.min(Math.round((elapsed / duration) * 95), 95);
        setRecordProgress(pct);
      }, 150);

      audioSource.onended = () => {
        if (recordIntervalRef.current) {
          clearInterval(recordIntervalRef.current);
          recordIntervalRef.current = null;
        }
        setTimeout(() => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }, 400);
      };

    } catch (err: any) {
      console.error('Video generation error:', err);
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
        recordIntervalRef.current = null;
      }
      setIsRecording(false);
      setErrorMessage(
        err.message || 'حدث تعذر أثناء معالجة الفيديو في المتصفح. يمكنك حفظ الصورة كبطاقة أو تحميل الصوت MP3 مباشرة.'
      );
    }
  };

  // Stop video recording early if desired
  const handleStopRecordingEarly = () => {
    if (audioSourceNodeRef.current) {
      try {
        audioSourceNodeRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  };

  // Direct Image/Card Download (PNG)
  const handleDownloadSnapshotImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imgUrl = canvas.toDataURL('image/png');
      const filename = `Ayat_Card_Surah_${surahData.number}_Ayah_${currentAyah.numberInSurah}.png`;
      const a = document.createElement('a');
      a.href = imgUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Snapshot download error:', err);
      alert('تعذر تنزيل الصورة بسبب قيود المتصفح.');
    }
  };

  // Direct MP3 Download
  const handleDownloadAudio = async (type: 'surah' | 'ayah') => {
    setIsAudioDownloading(true);
    setAudioDownloadSuccess(false);
    try {
      const primaryUrl = type === 'surah' ? fullSurahAudioUrl : singleAyahAudioUrl;
      const fallbackUrls = type === 'ayah' ? [
        primaryUrl,
        activeReciter.subfolder ? `https://everyayah.com/data/${activeReciter.subfolder}/${surah3Digits}${ayah3Digits}.mp3` : '',
        `https://everyayah.com/data/Alafasy_128kbps/${surah3Digits}${ayah3Digits}.mp3`
      ].filter(Boolean) : [primaryUrl];

      const filename = type === 'surah' 
        ? `Surah_${surahData.number}_${surahData.englishName}_${activeReciter.name}.mp3`
        : `Ayah_${surahData.number}_${currentAyah.numberInSurah}_${activeReciter.name}.mp3`;

      let fetchedBlob: Blob | null = null;
      for (const url of fallbackUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            fetchedBlob = await response.blob();
            break;
          }
        } catch {
          // continue fallback
        }
      }

      if (fetchedBlob) {
        const blobUrl = URL.createObjectURL(fetchedBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Fallback: direct download link
        const a = document.createElement('a');
        a.href = primaryUrl;
        a.target = '_blank';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setIsAudioDownloading(false);
      setAudioDownloadSuccess(true);
      setTimeout(() => setAudioDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Audio download error:', e);
      // Fallback: direct window download
      const directUrl = type === 'surah' ? fullSurahAudioUrl : singleAyahAudioUrl;
      const a = document.createElement('a');
      a.href = directUrl;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsAudioDownloading(false);
    }
  };

  const { width, height } = getCanvasDimensions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c0c0c] rounded-3xl w-full max-w-4xl overflow-hidden border border-indigo-500/30 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1c1c24] flex items-center justify-between bg-[#111116]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-quran">
                استوديو تصميم وتصدير المقاطع المرئية والصوتية
              </h3>
              <p className="text-xs text-slate-400">
                سورة {surahData.name} • بصوت القارئ: {activeReciter.arabicName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#1c1c24] bg-[#0e0e12] text-xs font-medium">
          <button
            onClick={() => setActiveTab('video_mp4')}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors border-b-2 ${
              activeTab === 'video_mp4'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>تصميم وتوليد فيديو (MP4 / تيك توك / ريلز)</span>
          </button>
          <button
            onClick={() => setActiveTab('audio_mp3')}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors border-b-2 ${
              activeTab === 'audio_mp3'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>تحميل ملفات صوتية (MP3 عالية النقاء)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: MP4 Video Generator */}
          {activeTab === 'video_mp4' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Live Canvas Preview & Fast Actions */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-3 bg-[#08080c] p-4 rounded-2xl border border-[#1e1e28]">
                <div className="text-xs text-slate-400 flex items-center justify-between w-full">
                  <span className="font-medium flex items-center gap-1.5 text-indigo-300">
                    <Eye className="w-3.5 h-3.5" />
                    معاينة الفيديو والتصميم المباشر
                  </span>
                  <span className="text-indigo-400 font-mono text-[11px] bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                    {aspectRatio}
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 shadow-2xl max-h-[360px] w-full flex items-center justify-center bg-black">
                  <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="max-h-[350px] max-w-full object-contain rounded-xl"
                  />
                </div>

                {/* Progress Bar when recording */}
                {isRecording && (
                  <div className="w-full space-y-2 p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/30 pt-2 animate-fade-in">
                    <div className="flex justify-between items-center text-xs font-mono text-indigo-300">
                      <span className="flex items-center gap-1.5 font-sans">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        {videoScope === 'surah' ? 'جاري تسجيل تلاوة السورة كاملة...' : 'جاري تسجيل إطارات الفيديو...'}
                      </span>
                      <span className="font-bold text-indigo-200">{recordProgress}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-[#181822] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 transition-all duration-200 rounded-full"
                        style={{ width: `${recordProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono text-slate-400">
                        {Math.floor(recordedSeconds / 60)}:{(recordedSeconds % 60).toString().padStart(2, '0')} / {Math.floor(totalVideoDuration / 60)}:{(totalVideoDuration % 60).toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={handleStopRecordingEarly}
                        className="px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        title="إنهاء التسجيل الآن وحفظ الفيديو المكتمل حتى هذه اللحظة"
                      >
                        <StopCircle className="w-3.5 h-3.5" />
                        <span>إنهاء وحفظ الآن</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Video Generation Result Message */}
                {generatedVideoUrl && !isRecording && (
                  <div className="w-full p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex flex-col gap-2 animate-fade-in">
                    <div className="flex items-center gap-2 font-bold">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>تم تجهيز الفيديو بنجاح!</span>
                    </div>
                    <a
                      href={generatedVideoUrl}
                      download={generatedFilename}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center rounded-lg shadow cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>تنزيل ملف الفيديو مجدداً ({generatedFilename.split('.').pop()?.toUpperCase()})</span>
                    </a>
                  </div>
                )}

                {errorMessage && (
                  <div className="w-full p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Snapshot Image Card Quick Action */}
                <button
                  onClick={handleDownloadSnapshotImage}
                  className="w-full py-2 px-3 rounded-xl bg-[#14141c] hover:bg-[#1e1e2c] border border-[#252535] text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  title="تنزيل التصميم كصورة ثابتة بجودة عالية"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>حفظ التصميم الحالي كبطاقة صورة (PNG)</span>
                </button>
              </div>

              {/* Right Column: Complete Background & Customization Studio */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Scope Selector: Ayah vs Full Surah */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    نطاق تصدير الفيديو:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setVideoScope('ayah');
                        setGeneratedVideoUrl(null);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                        videoScope === 'ayah'
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md font-bold'
                          : 'bg-[#111118] border-[#222230] text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>تصدير بالآية المحددة</span>
                    </button>
                    <button
                      onClick={() => {
                        setVideoScope('surah');
                        setGeneratedVideoUrl(null);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                        videoScope === 'surah'
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md font-bold'
                          : 'bg-[#111118] border-[#222230] text-slate-400 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>تصدير بالسورة كاملة ({surahData.numberOfAyahs} آية)</span>
                    </button>
                  </div>
                </div>

                {/* 1.1 Specific Ayah Selection (if scope === 'ayah') or Surah details note */}
                {videoScope === 'ayah' ? (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      الآية المراد تصديرها:
                    </label>
                    <select
                      value={targetAyahNum}
                      onChange={(e) => {
                        setTargetAyahNum(Number(e.target.value));
                        setGeneratedVideoUrl(null);
                      }}
                      className="w-full bg-[#111118] border border-[#222230] text-white rounded-xl p-2.5 text-xs font-sans focus:border-indigo-500 focus:outline-none"
                    >
                      {surahData.ayahs.map((a) => (
                        <option key={a.numberInSurah} value={a.numberInSurah}>
                          الآية {a.numberInSurah}: {a.text.slice(0, 48)}...
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/25 text-xs text-indigo-300 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>سيتم إنتاج فيديو بتلاوة سورة {surahData.name} كاملة مع تناوب الآيات تلقائياً.</span>
                    </div>
                    <span className="font-bold text-white px-2 py-0.5 bg-indigo-900/60 rounded border border-indigo-500/30 shrink-0 text-[11px]">
                      {surahData.numberOfAyahs} آية
                    </span>
                  </div>
                )}

                {/* 2. Aspect Ratio Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    أبعاد الفيديو حسب منصة النشر:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs cursor-pointer transition-all ${
                        aspectRatio === '9:16'
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-[#111118] border-[#222230] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>طولي (9:16) تيك توك / ريلز</span>
                    </button>
                    <button
                      onClick={() => setAspectRatio('16:9')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs cursor-pointer transition-all ${
                        aspectRatio === '16:9'
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-[#111118] border-[#222230] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>عرضي (16:9) يوتيوب</span>
                    </button>
                    <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs cursor-pointer transition-all ${
                        aspectRatio === '1:1'
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-[#111118] border-[#222230] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Square className="w-4 h-4" />
                      <span>مربع (1:1) إنستغرام</span>
                    </button>
                  </div>
                </div>

                {/* 3. Background Category Selector (Gradients, Solid, Landscapes, Custom Upload) */}
                <div className="space-y-2 pt-1 border-t border-[#1c1c24]">
                  <label className="block text-xs font-semibold text-indigo-300">
                    نوع وخلفية الفيديو:
                  </label>
                  
                  {/* Category Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#111118] border border-[#222230] rounded-xl text-[11px] font-medium">
                    <button
                      onClick={() => setBgType('gradient')}
                      className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                        bgType === 'gradient'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      لون متدرج
                    </button>
                    <button
                      onClick={() => setBgType('solid')}
                      className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                        bgType === 'solid'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      لون موحد
                    </button>
                    <button
                      onClick={() => setBgType('landscape')}
                      className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                        bgType === 'landscape'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      مناظر طبيعية
                    </button>
                    <button
                      onClick={() => setBgType('custom')}
                      className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                        bgType === 'custom'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      صورة مخصصة
                    </button>
                  </div>

                  {/* Sub-Panel: Gradients */}
                  {bgType === 'gradient' && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 animate-fade-in">
                      {GRADIENT_PRESETS.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGradient(g.id)}
                          className={`p-2 rounded-xl border text-[11px] font-medium cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                            selectedGradient === g.id
                              ? 'border-indigo-400 bg-indigo-950/50 text-white ring-2 ring-indigo-500/50'
                              : 'border-[#222230] bg-[#14141c] text-slate-400 hover:text-white'
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                            style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}
                          />
                          <span className="truncate w-full text-center">{g.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sub-Panel: Solid Colors */}
                  {bgType === 'solid' && (
                    <div className="space-y-2 pt-1 animate-fade-in">
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {SOLID_COLORS.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSolidColor(s.color)}
                            className={`p-2 rounded-xl border text-[11px] font-medium cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                              selectedSolidColor === s.color
                                ? 'border-indigo-400 bg-indigo-950/50 text-white ring-2 ring-indigo-500/50'
                                : 'border-[#222230] bg-[#14141c] text-slate-400 hover:text-white'
                            }`}
                          >
                            <div 
                              className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                              style={{ backgroundColor: s.color }}
                            />
                            <span className="truncate w-full text-center">{s.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Custom Hex Color Picker */}
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#14141c] border border-[#252535]">
                        <input
                          type="color"
                          value={selectedSolidColor}
                          onChange={(e) => setSelectedSolidColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                          title="اختر لوناً مخصصاً"
                        />
                        <span className="text-xs text-slate-300">أو اختر أي لون مخصص عبر لوحة الألوان</span>
                        <span className="text-xs font-mono text-indigo-400 mr-auto font-bold">{selectedSolidColor}</span>
                      </div>
                    </div>
                  )}

                  {/* Sub-Panel: Landscapes Presets */}
                  {bgType === 'landscape' && (
                    <div className="space-y-3 pt-1 animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {LANDSCAPE_PRESETS.map((lp) => (
                          <button
                            key={lp.id}
                            onClick={() => setSelectedLandscape(lp.id)}
                            className={`relative h-20 rounded-xl overflow-hidden border text-right p-2 cursor-pointer transition-all group ${
                              selectedLandscape === lp.id
                                ? 'border-indigo-400 ring-2 ring-indigo-500/60 shadow-lg'
                                : 'border-[#222230] opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={lp.url}
                              alt={lp.name}
                              crossOrigin="anonymous"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="relative z-10 flex flex-col justify-end h-full">
                              <span className="text-xs font-bold text-white drop-shadow">
                                {lp.name}
                              </span>
                              <span className="text-[10px] text-indigo-300">{lp.category}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Darkness Overlay Slider for Nature Scenery */}
                      <div className="p-3 rounded-xl bg-[#14141c] border border-[#252535] space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>درجة تعتيم الخلفية (لوضوح الآية):</span>
                          <span className="font-mono text-indigo-400 font-bold">{Math.round(bgDarknessOverlay * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="0.9"
                          step="0.05"
                          value={bgDarknessOverlay}
                          onChange={(e) => setBgDarknessOverlay(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-[#252535] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Sub-Panel: Custom Upload Image */}
                  {bgType === 'custom' && (
                    <div className="space-y-3 pt-1 animate-fade-in">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer bg-[#14141c]/50 hover:bg-[#14141c] transition-all"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCustomImageUpload}
                          className="hidden"
                        />
                        <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-white mb-1">
                          {customImageSrc ? 'تم رفع الصورة - انقر للتغيير' : 'انقر لرفع صورة من جهازك'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          يدعم صور JPG, PNG, WebP بجودة عالية
                        </p>
                      </div>

                      {customImageSrc && (
                        <div className="p-3 rounded-xl bg-[#14141c] border border-[#252535] space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>درجة تعتيم صورتك المخصصة:</span>
                            <span className="font-mono text-indigo-400 font-bold">{Math.round(bgDarknessOverlay * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="0.9"
                            step="0.05"
                            value={bgDarknessOverlay}
                            onChange={(e) => setBgDarknessOverlay(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-[#252535] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Display Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#111118] border border-[#222230] cursor-pointer">
                    <span className="text-xs text-slate-300">إظهار ترجمة الآية</span>
                    <input
                      type="checkbox"
                      checked={includeTranslation}
                      onChange={(e) => setIncludeTranslation(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#111118] border border-[#222230] cursor-pointer">
                    <span className="text-xs text-slate-300">أمواج صوتية متحركة (EQ)</span>
                    <input
                      type="checkbox"
                      checked={includeAudioVisualizer}
                      onChange={(e) => setIncludeAudioVisualizer(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {/* 5. Main Action Button: Generate & Download Video */}
                <button
                  onClick={handleGenerateVideo}
                  disabled={isRecording}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all transform active:scale-98 border border-indigo-400/30"
                >
                  {isRecording ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري معالجة وتصدير الفيديو... ({recordProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-5 h-5" />
                      <span>
                        {videoScope === 'surah'
                          ? `توليد وتنزيل فيديو MP4 لسورة ${surahData.name} كاملة`
                          : `توليد وتنزيل فيديو MP4 للآية ${currentAyah.numberInSurah}`}
                      </span>
                    </>
                  )}
                </button>

              </div>
            </div>
          )}

          {/* TAB 2: MP3 & Audio Direct Downloader */}
          {activeTab === 'audio_mp3' && (
            <div className="space-y-6">
              
              {/* Option A: Full Surah MP3 */}
              <div className="p-5 rounded-2xl bg-[#111118] border border-indigo-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                    <Music className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white font-quran">
                      تحميل سورة {surahData.name} كاملة (MP3)
                    </h4>
                    <p className="text-xs text-slate-400">
                      تلاوة مرتلة كاملة ({surahData.numberOfAyahs} آية) بصوت {activeReciter.arabicName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadAudio('surah')}
                  disabled={isAudioDownloading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAudioDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>تحميل السورة كاملة MP3</span>
                </button>
              </div>

              {/* Option B: Single Ayah MP3 */}
              <div className="p-5 rounded-2xl bg-[#111118] border border-[#1f1f2a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-bold text-sm text-white">
                      تحميل صوت آية محددة (MP3)
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">جودة 128kbps HQ</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={targetAyahNum}
                    onChange={(e) => setTargetAyahNum(Number(e.target.value))}
                    className="flex-1 bg-[#181822] border border-[#282835] text-white rounded-xl p-2.5 text-xs font-sans focus:border-indigo-500 focus:outline-none"
                  >
                    {surahData.ayahs.map((a) => (
                      <option key={a.numberInSurah} value={a.numberInSurah}>
                        الآية {a.numberInSurah}: {a.text.slice(0, 50)}...
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDownloadAudio('ayah')}
                    disabled={isAudioDownloading}
                    className="px-5 py-2.5 rounded-xl bg-[#1f1f2a] hover:bg-[#252535] border border-indigo-500/30 text-indigo-300 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>تحميل الآية {targetAyahNum} بصيغة MP3</span>
                  </button>
                </div>

                {audioDownloadSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>تم بدء تحميل الملف الصوتي بنجاح!</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1c1c24] bg-[#0e0e12] flex items-center justify-between text-xs text-slate-400">
          <span>التلاوات مستضافة من خوادم المصحف الشريف الرسمية بأعلى نقاء وجودة.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#181822] text-slate-300 hover:text-white cursor-pointer font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
