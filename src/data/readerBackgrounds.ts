export type ReaderBackgroundType = 'solid' | 'gradient' | 'nature';

export interface ReaderBackground {
  id: string;
  type: ReaderBackgroundType;
  name: string;
  arabicName: string;
  value: string; // Hex color, CSS gradient, or image URL
  previewStyle: {
    background?: string;
    backgroundImage?: string;
    backgroundColor?: string;
  };
  isLight?: boolean;
}

export const READER_BACKGROUNDS: ReaderBackground[] = [
  // --- 1. Solid Colors (خلفيات ثابتة) ---
  {
    id: 'solid_default',
    type: 'solid',
    name: 'Classic Dark',
    arabicName: 'الداكن الكلاسيكي',
    value: '#08090d',
    previewStyle: { backgroundColor: '#08090d' },
    isLight: false
  },
  {
    id: 'solid_emerald',
    type: 'solid',
    name: 'Royal Emerald',
    arabicName: 'الزمردي الملكي',
    value: '#041c14',
    previewStyle: { backgroundColor: '#041c14' },
    isLight: false
  },
  {
    id: 'solid_midnight',
    type: 'solid',
    name: 'Midnight Blue',
    arabicName: 'أزرق الليل الهادئ',
    value: '#07101f',
    previewStyle: { backgroundColor: '#07101f' },
    isLight: false
  },
  {
    id: 'solid_charcoal',
    type: 'solid',
    name: 'Deep Charcoal',
    arabicName: 'الفحم المطفي',
    value: '#131417',
    previewStyle: { backgroundColor: '#131417' },
    isLight: false
  },
  {
    id: 'solid_indigo',
    type: 'solid',
    name: 'Spiritual Violet',
    arabicName: 'البنفسجي الروحاني',
    value: '#110a1f',
    previewStyle: { backgroundColor: '#110a1f' },
    isLight: false
  },
  {
    id: 'solid_parchment',
    type: 'solid',
    name: 'Warm Parchment',
    arabicName: 'الورقي الدافئ',
    value: '#f8f4ea',
    previewStyle: { backgroundColor: '#f8f4ea' },
    isLight: true
  },

  // --- 2. Gradients (تدرجات لونية) ---
  {
    id: 'grad_aurora',
    type: 'gradient',
    name: 'Serene Aurora',
    arabicName: 'الشفق السماوي',
    value: 'linear-gradient(135deg, #051421 0%, #0c2b3d 50%, #030d17 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #051421 0%, #0c2b3d 50%, #030d17 100%)' },
    isLight: false
  },
  {
    id: 'grad_emerald_forest',
    type: 'gradient',
    name: 'Emerald Oasis',
    arabicName: 'واحة الزمرد',
    value: 'linear-gradient(135deg, #031c13 0%, #093826 50%, #02140d 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #031c13 0%, #093826 50%, #02140d 100%)' },
    isLight: false
  },
  {
    id: 'grad_midnight_purple',
    type: 'gradient',
    name: 'Tahajjud Night',
    arabicName: 'ليل التهجد',
    value: 'linear-gradient(135deg, #0a0618 0%, #1a1038 50%, #080314 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #0a0618 0%, #1a1038 50%, #080314 100%)' },
    isLight: false
  },
  {
    id: 'grad_desert_dusk',
    type: 'gradient',
    name: 'Dusk Warmth',
    arabicName: 'شفق الغروب',
    value: 'linear-gradient(135deg, #1f0d14 0%, #2f1722 50%, #12070c 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #1f0d14 0%, #2f1722 50%, #12070c 100%)' },
    isLight: false
  },
  {
    id: 'grad_deep_ocean',
    type: 'gradient',
    name: 'Abyssal Depth',
    arabicName: 'أعماق البحر',
    value: 'linear-gradient(135deg, #031b29 0%, #0a3147 50%, #02111a 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #031b29 0%, #0a3147 50%, #02111a 100%)' },
    isLight: false
  },
  {
    id: 'grad_golden_warmth',
    type: 'gradient',
    name: 'Golden Glow',
    arabicName: 'الضياء الذهبي',
    value: 'linear-gradient(135deg, #1c1507 0%, #2e220a 50%, #120e05 100%)',
    previewStyle: { background: 'linear-gradient(135deg, #1c1507 0%, #2e220a 50%, #120e05 100%)' },
    isLight: false
  },

  // --- 3. Nature Wallpapers (صور طبيعية) ---
  {
    id: 'nature_milky_way',
    type: 'nature',
    name: 'Cosmic Stars',
    arabicName: 'سماء مرصعة بالنجوم',
    value: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  },
  {
    id: 'nature_misty_mountains',
    type: 'nature',
    name: 'Misty Mountains',
    arabicName: 'قمم الجبال والضباب',
    value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  },
  {
    id: 'nature_green_forest',
    type: 'nature',
    name: 'Lush Forest',
    arabicName: 'الغابة الخضراء الوارفة',
    value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  },
  {
    id: 'nature_desert_dunes',
    type: 'nature',
    name: 'Desert Dunes',
    arabicName: 'كثبان الصحراء الذهبية',
    value: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  },
  {
    id: 'nature_calm_ocean',
    type: 'nature',
    name: 'Sunset Ocean',
    arabicName: 'هدوء أمواج البحر',
    value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  },
  {
    id: 'nature_islamic_art',
    type: 'nature',
    name: 'Masjid Architecture',
    arabicName: 'سكينة المسجد والزخرفة',
    value: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  },
  {
    id: 'nature_rain_drops',
    type: 'nature',
    name: 'Calm Rain',
    arabicName: 'سكينة قطرات المطر',
    value: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  },
  {
    id: 'nature_clouds_sunset',
    type: 'nature',
    name: 'Evening Clouds',
    arabicName: 'سحب الأصيل الدافئة',
    value: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600&auto=format&fit=crop',
    previewStyle: { backgroundImage: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=300&auto=format&fit=crop)' },
    isLight: false
  }
];

export function getReaderBackground(id?: string): ReaderBackground {
  return READER_BACKGROUNDS.find((bg) => bg.id === id) || READER_BACKGROUNDS[0];
}
