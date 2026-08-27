// Comprehensive Worldwide & Arab / Islamic Prayer Locations Database
// Featuring full States/Wilayas/Governorates and Municipalities/Cities

export interface MunicipalityItem {
  id: string;
  name: string; // Arabic name
  nameEn?: string;
  lat: number;
  lng: number;
}

export interface StateOrWilayaItem {
  id: string;
  name: string; // e.g. '01. أدرار' or 'القاهرة'
  code?: string;
  lat: number;
  lng: number;
  municipalities: MunicipalityItem[];
}

export interface CountryLocationData {
  code: string;
  name: string;
  flag: string;
  defaultMethod: number; // Aladhan method ID
  defaultLat: number;
  defaultLng: number;
  states: StateOrWilayaItem[];
}

// Aladhan Calculation Methods Metadata
export interface CalculationMethodMeta {
  id: number;
  name: string;
  description: string;
  fajrAngle: number;
  ishaAngle?: number;
  ishaInterval?: number;
}

export const CALCULATION_METHODS: CalculationMethodMeta[] = [
  { id: 3, name: 'رابطة العالم الإسلامي (MWL)', description: 'فجر 18° ، عشاء 17° - شائعة في العالم الإسلامي وأوروبا', fajrAngle: 18, ishaAngle: 17 },
  { id: 4, name: 'جامعة أم القرى - مكة المكرمة', description: 'فجر 18.5° ، عشاء بعد المغرب بـ 90 دقيقة (السعودية والخليج)', fajrAngle: 18.5, ishaInterval: 90 },
  { id: 5, name: 'الهيئة المصرية العامة للمساحة', description: 'فجر 19.5° ، عشاء 17.5° (مصر، السودان، فلسطين، الشام)', fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 19, name: 'وزارة الشؤون الدينية والأوقاف (الجزائر)', description: 'فجر 18° ، عشاء 17° مخصص للجزائر والمغرب العربي', fajrAngle: 18, ishaAngle: 17 },
  { id: 20, name: 'وزارة الأوقاف والشؤون الإسلامية (المغرب)', description: 'فجر 19° ، عشاء 17° للمملكة المغربية', fajrAngle: 19, ishaAngle: 17 },
  { id: 16, name: 'الهيئة العامة للشؤون الإسلامية والأوقاف (الإمارات)', description: 'فجر 18.2° ، عشاء 18.2° (دولة الإمارات العربية المتحدة)', fajrAngle: 18.2, ishaAngle: 18.2 },
  { id: 2, name: 'الاتحاد الإسلامي لأمريكا الشمالية (ISNA)', description: 'فجر 15° ، عشاء 15° (أمريكا، كندا)', fajrAngle: 15, ishaAngle: 15 },
  { id: 13, name: 'رئاسة الشؤون الدينية التركية (Diyanet)', description: 'فجر 18° ، عشاء 17° (تركيا وأوروبا الشرقية)', fajrAngle: 18, ishaAngle: 17 },
  { id: 12, name: 'اتحاد المنظمات الإسلامية بفرنسا (UOIF)', description: 'فجر 12° ، عشاء 12° (فرنسا وأوروبا الغربية)', fajrAngle: 12, ishaAngle: 12 },
  { id: 11, name: 'مجلس الشؤون الإسلامية بسنغافورة (MUIS)', description: 'فجر 20° ، عشاء 18° (سنغافورة، ماليزيا، إندونيسيا)', fajrAngle: 20, ishaAngle: 18 }
];

export const COUNTRIES_DATA: CountryLocationData[] = [
  // 1. ALGERIA (الجزائر) - Complete 58 Wilayas with Major Municipalities
  {
    code: 'DZ',
    name: 'الجزائر',
    flag: '🇩🇿',
    defaultMethod: 19,
    defaultLat: 36.7538,
    defaultLng: 3.0588,
    states: [
      {
        id: 'dz-01',
        name: '01. أدرار (Adrar)',
        lat: 27.8743,
        lng: -0.2939,
        municipalities: [
          { id: 'm-01-01', name: 'أدرار (المركز)', lat: 27.8743, lng: -0.2939 },
          { id: 'm-01-02', name: 'فنوغيل', lat: 27.6521, lng: -0.3211 },
          { id: 'm-01-03', name: 'رقان', lat: 26.7167, lng: 0.1667 },
          { id: 'm-01-04', name: 'زاوية كنتة', lat: 27.2167, lng: -0.2167 },
          { id: 'm-01-05', name: 'أولف', lat: 27.5667, lng: 1.0833 }
        ]
      },
      {
        id: 'dz-02',
        name: '02. الشلف (Chlef)',
        lat: 36.1652,
        lng: 1.3345,
        municipalities: [
          { id: 'm-02-01', name: 'الشلف (المركز)', lat: 36.1652, lng: 1.3345 },
          { id: 'm-02-02', name: 'تنس', lat: 36.5167, lng: 1.3000 },
          { id: 'm-02-03', name: 'بوقادير', lat: 36.0667, lng: 1.1333 },
          { id: 'm-02-04', name: 'وادي الفضة', lat: 36.1833, lng: 1.5333 },
          { id: 'm-02-05', name: 'عين مران', lat: 36.1667, lng: 0.9667 }
        ]
      },
      {
        id: 'dz-03',
        name: '03. الأغواط (Laghouat)',
        lat: 33.8000,
        lng: 2.8651,
        municipalities: [
          { id: 'm-03-01', name: 'الأغواط (المركز)', lat: 33.8000, lng: 2.8651 },
          { id: 'm-03-02', name: 'أفلو', lat: 34.1167, lng: 2.1000 },
          { id: 'm-03-03', name: 'قصر الحيران', lat: 33.6833, lng: 3.1167 },
          { id: 'm-03-04', name: 'حاسي الرمل', lat: 32.9333, lng: 3.2667 }
        ]
      },
      {
        id: 'dz-04',
        name: '04. أم البواقي (Oum El Bouaghi)',
        lat: 35.8755,
        lng: 7.1135,
        municipalities: [
          { id: 'm-04-01', name: 'أم البواقي (المركز)', lat: 35.8755, lng: 7.1135 },
          { id: 'm-04-02', name: 'عين البيضاء', lat: 35.7964, lng: 7.3928 },
          { id: 'm-04-03', name: 'عين مليلة', lat: 36.0333, lng: 6.5667 },
          { id: 'm-04-04', name: 'مسكيانة', lat: 35.6333, lng: 7.6667 }
        ]
      },
      {
        id: 'dz-05',
        name: '05. باتنة (Batna)',
        lat: 35.5559,
        lng: 6.1741,
        municipalities: [
          { id: 'm-05-01', name: 'باتنة (المركز)', lat: 35.5559, lng: 6.1741 },
          { id: 'm-05-02', name: 'بريكة', lat: 35.3333, lng: 5.3667 },
          { id: 'm-05-03', name: 'عين التوتة', lat: 35.3833, lng: 5.9000 },
          { id: 'm-05-04', name: 'مروانة', lat: 35.6167, lng: 5.9167 },
          { id: 'm-05-05', name: 'أريس', lat: 35.2667, lng: 6.1667 }
        ]
      },
      {
        id: 'dz-06',
        name: '06. بجاية (Béjaïa)',
        lat: 36.7511,
        lng: 5.0567,
        municipalities: [
          { id: 'm-06-01', name: 'بجاية (المركز)', lat: 36.7511, lng: 5.0567 },
          { id: 'm-06-02', name: 'أقبو', lat: 36.4500, lng: 4.5333 },
          { id: 'm-06-03', name: 'أميزور', lat: 36.6500, lng: 4.9000 },
          { id: 'm-06-04', name: 'سيدي عيش', lat: 36.6167, lng: 4.6833 },
          { id: 'm-06-05', name: 'خراطة', lat: 36.4833, lng: 5.2833 }
        ]
      },
      {
        id: 'dz-07',
        name: '07. بسكرة (Biskra)',
        lat: 34.8504,
        lng: 5.7281,
        municipalities: [
          { id: 'm-07-01', name: 'بسكرة (المركز)', lat: 34.8504, lng: 5.7281 },
          { id: 'm-07-02', name: 'طولقة', lat: 34.7167, lng: 5.3833 },
          { id: 'm-07-03', name: 'سيدي عقبة', lat: 34.7500, lng: 5.9000 },
          { id: 'm-07-04', name: 'الزيبان', lat: 34.8333, lng: 5.7167 }
        ]
      },
      {
        id: 'dz-08',
        name: '08. بشار (Béchar)',
        lat: 31.6167,
        lng: -2.2167,
        municipalities: [
          { id: 'm-08-01', name: 'بشار (المركز)', lat: 31.6167, lng: -2.2167 },
          { id: 'm-08-02', name: 'القنادسة', lat: 31.5667, lng: -2.4167 },
          { id: 'm-08-03', name: 'العبادلة', lat: 31.0167, lng: -2.7333 },
          { id: 'm-08-04', name: 'تاغيث', lat: 30.9167, lng: -2.0333 }
        ]
      },
      {
        id: 'dz-09',
        name: '09. البليدة (Blida)',
        lat: 36.4700,
        lng: 2.8300,
        municipalities: [
          { id: 'm-09-01', name: 'البليدة (المركز)', lat: 36.4700, lng: 2.8300 },
          { id: 'm-09-02', name: 'بوفاريك', lat: 36.5767, lng: 2.9128 },
          { id: 'm-09-03', name: 'العفرون', lat: 36.4667, lng: 2.6333 },
          { id: 'm-09-04', name: 'الأربعاء', lat: 36.5667, lng: 3.1500 },
          { id: 'm-09-05', name: 'أولاد يعيش', lat: 36.5000, lng: 2.8500 }
        ]
      },
      {
        id: 'dz-10',
        name: '10. البويرة (Bouira)',
        lat: 36.3749,
        lng: 3.9020,
        municipalities: [
          { id: 'm-10-01', name: 'البويرة (المركز)', lat: 36.3749, lng: 3.9020 },
          { id: 'm-10-02', name: 'الأخضرية', lat: 36.5667, lng: 3.5833 },
          { id: 'm-10-03', name: 'عين بسام', lat: 36.3000, lng: 3.6667 },
          { id: 'm-10-04', name: 'سور الغزلان', lat: 36.1500, lng: 3.7000 }
        ]
      },
      {
        id: 'dz-11',
        name: '11. تمنراست (Tamanrasset)',
        lat: 22.7850,
        lng: 5.5228,
        municipalities: [
          { id: 'm-11-01', name: 'تمنراست (المركز)', lat: 22.7850, lng: 5.5228 },
          { id: 'm-11-02', name: 'أبلسة', lat: 22.8833, lng: 4.8500 },
          { id: 'm-11-03', name: 'تاظروك', lat: 23.4000, lng: 6.2833 }
        ]
      },
      {
        id: 'dz-12',
        name: '12. تبسة (Tébessa)',
        lat: 35.4042,
        lng: 8.1242,
        municipalities: [
          { id: 'm-12-01', name: 'تبسة (المركز)', lat: 35.4042, lng: 8.1242 },
          { id: 'm-12-02', name: 'الشريعة', lat: 35.2667, lng: 7.7500 },
          { id: 'm-12-03', name: 'الونزة', lat: 35.9667, lng: 8.0833 },
          { id: 'm-12-04', name: 'بئر العاتر', lat: 34.7500, lng: 8.0667 }
        ]
      },
      {
        id: 'dz-13',
        name: '13. تلمسان (Tlemcen)',
        lat: 34.8783,
        lng: -1.3150,
        municipalities: [
          { id: 'm-13-01', name: 'تلمسان (المركز)', lat: 34.8783, lng: -1.3150 },
          { id: 'm-13-02', name: 'مغنية', lat: 34.8500, lng: -1.7333 },
          { id: 'm-13-03', name: 'منصورة', lat: 34.8667, lng: -1.3333 },
          { id: 'm-13-04', name: 'سبدو', lat: 34.5167, lng: -1.3333 },
          { id: 'm-13-05', name: 'الغزوات', lat: 35.1000, lng: -1.8667 }
        ]
      },
      {
        id: 'dz-14',
        name: '14. تيارت (Tiaret)',
        lat: 35.3710,
        lng: 1.3170,
        municipalities: [
          { id: 'm-14-01', name: 'تيارت (المركز)', lat: 35.3710, lng: 1.3170 },
          { id: 'm-14-02', name: 'السوقر', lat: 35.1833, lng: 1.5000 },
          { id: 'm-14-03', name: 'فرندة', lat: 35.0667, lng: 1.0500 },
          { id: 'm-14-04', name: 'قصر الشلالة', lat: 35.1667, lng: 2.3167 }
        ]
      },
      {
        id: 'dz-15',
        name: '15. تيزي وزو (Tizi Ouzou)',
        lat: 36.7118,
        lng: 4.0459,
        municipalities: [
          { id: 'm-15-01', name: 'تيزي وزو (المركز)', lat: 36.7118, lng: 4.0459 },
          { id: 'm-15-02', name: 'عزازقة', lat: 36.7500, lng: 4.3667 },
          { id: 'm-15-03', name: 'ذراع الميزان', lat: 36.5500, lng: 3.8333 },
          { id: 'm-15-04', name: 'الأربعاء نايث إيراثن', lat: 36.6333, lng: 4.2000 },
          { id: 'm-15-05', name: 'بوغني', lat: 36.5333, lng: 3.9667 }
        ]
      },
      {
        id: 'dz-16',
        name: '16. الجزائر العاصمة (Algiers)',
        lat: 36.7538,
        lng: 3.0588,
        municipalities: [
          { id: 'm-16-01', name: 'الجزائر الوسطى', lat: 36.7753, lng: 3.0592 },
          { id: 'm-16-02', name: 'باب الوادي', lat: 36.7900, lng: 3.0500 },
          { id: 'm-16-03', name: 'سيدي امحمد', lat: 36.7600, lng: 3.0600 },
          { id: 'm-16-04', name: 'القبة', lat: 36.7264, lng: 3.0844 },
          { id: 'm-16-05', name: 'حيدرة', lat: 36.7486, lng: 3.0381 },
          { id: 'm-16-06', name: 'بئر مراد رايس', lat: 36.7333, lng: 3.0500 },
          { id: 'm-16-07', name: 'الشراقة', lat: 36.7667, lng: 2.9500 },
          { id: 'm-16-08', name: 'الدار البيضاء', lat: 36.7117, lng: 3.2125 },
          { id: 'm-16-09', name: 'برج الكيفان', lat: 36.7500, lng: 3.1833 },
          { id: 'm-16-10', name: 'زرالدة', lat: 36.7167, lng: 2.8500 },
          { id: 'm-16-11', name: 'الرويبة', lat: 36.7333, lng: 3.2833 },
          { id: 'm-16-12', name: 'بئر توتة', lat: 36.6333, lng: 3.0000 },
          { id: 'm-16-13', name: 'الحراش', lat: 36.7167, lng: 3.1333 }
        ]
      },
      {
        id: 'dz-17',
        name: '17. الجلفة (Djelfa)',
        lat: 34.6728,
        lng: 3.2630,
        municipalities: [
          { id: 'm-17-01', name: 'الجلفة (المركز)', lat: 34.6728, lng: 3.2630 },
          { id: 'm-17-02', name: 'عين وسارة', lat: 35.4500, lng: 2.9000 },
          { id: 'm-17-03', name: 'مسعد', lat: 34.1667, lng: 3.5000 },
          { id: 'm-17-04', name: 'حاسي بحبح', lat: 35.0833, lng: 3.0333 },
          { id: 'm-17-05', name: 'الشارف', lat: 34.6167, lng: 2.7667 }
        ]
      },
      {
        id: 'dz-18',
        name: '18. جيجل (Jijel)',
        lat: 36.8206,
        lng: 5.7667,
        municipalities: [
          { id: 'm-18-01', name: 'جيجل (المركز)', lat: 36.8206, lng: 5.7667 },
          { id: 'm-18-02', name: 'الطاهير', lat: 36.7667, lng: 5.9000 },
          { id: 'm-18-03', name: 'الميلية', lat: 36.7500, lng: 6.2667 },
          { id: 'm-18-04', name: 'العوانة', lat: 36.7833, lng: 5.6167 }
        ]
      },
      {
        id: 'dz-19',
        name: '19. سطيف (Sétif)',
        lat: 36.1906,
        lng: 5.4137,
        municipalities: [
          { id: 'm-19-01', name: 'سطيف (المركز)', lat: 36.1906, lng: 5.4137 },
          { id: 'm-19-02', name: 'العلمة', lat: 36.1500, lng: 5.7000 },
          { id: 'm-19-03', name: 'عين ولمان', lat: 35.9167, lng: 5.3000 },
          { id: 'm-19-04', name: 'عين أزال', lat: 35.8333, lng: 5.5167 },
          { id: 'm-19-05', name: 'بوقاعة', lat: 36.3333, lng: 5.0833 },
          { id: 'm-19-06', name: 'عين الكبيرة', lat: 36.3667, lng: 5.5000 }
        ]
      },
      {
        id: 'dz-20',
        name: '20. سعيدة (Saïda)',
        lat: 34.8303,
        lng: 0.1517,
        municipalities: [
          { id: 'm-20-01', name: 'سعيدة (المركز)', lat: 34.8303, lng: 0.1517 },
          { id: 'm-20-02', name: 'يوب', lat: 34.8833, lng: -0.0500 },
          { id: 'm-20-03', name: 'الحساسنة', lat: 34.8333, lng: 0.3500 }
        ]
      },
      {
        id: 'dz-21',
        name: '21. سكيكدة (Skikda)',
        lat: 36.8663,
        lng: 6.9048,
        municipalities: [
          { id: 'm-21-01', name: 'سكيكدة (المركز)', lat: 36.8663, lng: 6.9048 },
          { id: 'm-21-02', name: 'القل', lat: 37.0000, lng: 6.5667 },
          { id: 'm-21-03', name: 'عزابة', lat: 36.7333, lng: 7.1000 },
          { id: 'm-21-04', name: 'الحروش', lat: 36.7333, lng: 6.8333 },
          { id: 'm-21-05', name: 'تمالوس', lat: 36.8333, lng: 6.6333 }
        ]
      },
      {
        id: 'dz-22',
        name: '22. سيدي بلعباس (Sidi Bel Abbès)',
        lat: 35.1899,
        lng: -0.6308,
        municipalities: [
          { id: 'm-22-01', name: 'سيدي بلعباس (المركز)', lat: 35.1899, lng: -0.6308 },
          { id: 'm-22-02', name: 'تلاغ', lat: 34.7833, lng: -0.5667 },
          { id: 'm-22-03', name: 'سفيزف', lat: 35.2333, lng: -0.2333 },
          { id: 'm-22-04', name: 'بن باديس', lat: 35.1833, lng: -0.8000 }
        ]
      },
      {
        id: 'dz-23',
        name: '23. عنابة (Annaba)',
        lat: 36.9000,
        lng: 7.7667,
        municipalities: [
          { id: 'm-23-01', name: 'عنابة (المركز)', lat: 36.9000, lng: 7.7667 },
          { id: 'm-23-02', name: 'البوني', lat: 36.8667, lng: 7.7333 },
          { id: 'm-23-03', name: 'برحال', lat: 36.8333, lng: 7.4500 },
          { id: 'm-23-04', name: 'الحجار', lat: 36.8000, lng: 7.7333 },
          { id: 'm-23-05', name: 'سيدي عمار', lat: 36.8167, lng: 7.7000 }
        ]
      },
      {
        id: 'dz-24',
        name: '24. قالمة (Guelma)',
        lat: 36.4621,
        lng: 7.4261,
        municipalities: [
          { id: 'm-24-01', name: 'قالمة (المركز)', lat: 36.4621, lng: 7.4261 },
          { id: 'm-24-02', name: 'وادي الزناتي', lat: 36.3167, lng: 7.0500 },
          { id: 'm-24-03', name: 'بوشقوف', lat: 36.4667, lng: 7.7167 },
          { id: 'm-24-04', name: 'حمام دباغ', lat: 36.4500, lng: 7.2667 }
        ]
      },
      {
        id: 'dz-25',
        name: '25. قسنطينة (Constantine)',
        lat: 36.3650,
        lng: 6.6147,
        municipalities: [
          { id: 'm-25-01', name: 'قسنطينة (المركز)', lat: 36.3650, lng: 6.6147 },
          { id: 'm-25-02', name: 'الخروب', lat: 36.2631, lng: 6.6942 },
          { id: 'm-25-03', name: 'علي منجلي (المدينة الجديدة)', lat: 36.2428, lng: 6.5719 },
          { id: 'm-25-04', name: 'حامة بوزيان', lat: 36.4167, lng: 6.6000 },
          { id: 'm-25-05', name: 'ديدوش مراد', lat: 36.4500, lng: 6.6333 },
          { id: 'm-25-06', name: 'زيغود يوسف', lat: 36.5333, lng: 6.7167 }
        ]
      },
      {
        id: 'dz-26',
        name: '26. المدية (Médéa)',
        lat: 36.2642,
        lng: 2.7539,
        municipalities: [
          { id: 'm-26-01', name: 'المدية (المركز)', lat: 36.2642, lng: 2.7539 },
          { id: 'm-26-02', name: 'البرواقية', lat: 36.1333, lng: 2.9167 },
          { id: 'm-26-03', name: 'قصر البخاري', lat: 35.8833, lng: 2.7500 },
          { id: 'm-26-04', name: 'تابلاط', lat: 36.4167, lng: 3.3167 }
        ]
      },
      {
        id: 'dz-27',
        name: '27. مستغانم (Mostaganem)',
        lat: 35.9311,
        lng: 0.0892,
        municipalities: [
          { id: 'm-27-01', name: 'مستغانم (المركز)', lat: 35.9311, lng: 0.0892 },
          { id: 'm-27-02', name: 'عين تادلس', lat: 35.9833, lng: 0.3000 },
          { id: 'm-27-03', name: 'سيدي علي', lat: 36.1333, lng: 0.4167 },
          { id: 'm-27-04', name: 'حاسي مماش', lat: 35.8667, lng: 0.0500 }
        ]
      },
      {
        id: 'dz-28',
        name: '28. المسيلة (M\'Sila)',
        lat: 35.7058,
        lng: 4.5419,
        municipalities: [
          { id: 'm-28-01', name: 'المسيلة (المركز)', lat: 35.7058, lng: 4.5419 },
          { id: 'm-28-02', name: 'بوسعادة', lat: 35.2167, lng: 4.1833 },
          { id: 'm-28-03', name: 'مقرة', lat: 35.6000, lng: 5.0667 },
          { id: 'm-28-04', name: 'سيدي عيسى', lat: 35.8833, lng: 3.6167 }
        ]
      },
      {
        id: 'dz-29',
        name: '29. معسكر (Mascara)',
        lat: 35.3966,
        lng: 0.1403,
        municipalities: [
          { id: 'm-29-01', name: 'معسكر (المركز)', lat: 35.3966, lng: 0.1403 },
          { id: 'm-29-02', name: 'سيق', lat: 35.5333, lng: -0.2000 },
          { id: 'm-29-03', name: 'المحمدية', lat: 35.5833, lng: 0.0667 },
          { id: 'm-29-04', name: 'تيغنيف', lat: 35.4167, lng: 0.3333 }
        ]
      },
      {
        id: 'dz-30',
        name: '30. ورقلة (Ouargla)',
        lat: 31.9493,
        lng: 5.3250,
        municipalities: [
          { id: 'm-30-01', name: 'ورقلة (المركز)', lat: 31.9493, lng: 5.3250 },
          { id: 'm-30-02', name: 'حاسي مسعود', lat: 31.6800, lng: 6.0700 },
          { id: 'm-30-03', name: 'الرويسات', lat: 31.9167, lng: 5.3500 }
        ]
      },
      {
        id: 'dz-31',
        name: '31. وهران (Oran)',
        lat: 35.6976,
        lng: -0.6337,
        municipalities: [
          { id: 'm-31-01', name: 'وهران (المركز)', lat: 35.6976, lng: -0.6337 },
          { id: 'm-31-02', name: 'السانية', lat: 35.6500, lng: -0.6333 },
          { id: 'm-31-03', name: 'بئر الجير', lat: 35.7167, lng: -0.5500 },
          { id: 'm-31-04', name: 'أرزيو', lat: 35.8500, lng: -0.3167 },
          { id: 'm-31-05', name: 'عين الترك', lat: 35.7500, lng: -0.7500 },
          { id: 'm-31-06', name: 'بطيوة', lat: 35.8000, lng: -0.2667 }
        ]
      },
      {
        id: 'dz-32',
        name: '32. البيض (El Bayadh)',
        lat: 33.6832,
        lng: 1.0193,
        municipalities: [
          { id: 'm-32-01', name: 'البيض (المركز)', lat: 33.6832, lng: 1.0193 },
          { id: 'm-32-02', name: 'بوقطب', lat: 33.8833, lng: 0.1500 },
          { id: 'm-32-03', name: 'الأبيض سيدي الشيخ', lat: 32.9000, lng: 0.5500 }
        ]
      },
      {
        id: 'dz-33',
        name: '33. إليزي (Illizi)',
        lat: 26.4833,
        lng: 8.4667,
        municipalities: [
          { id: 'm-33-01', name: 'إليزي (المركز)', lat: 26.4833, lng: 8.4667 },
          { id: 'm-33-02', name: 'إن أمناس', lat: 27.9333, lng: 9.1333 }
        ]
      },
      {
        id: 'dz-34',
        name: '34. برج بوعريريج (Bordj Bou Arréridj)',
        lat: 36.0732,
        lng: 4.7611,
        municipalities: [
          { id: 'm-34-01', name: 'برج بوعريريج (المركز)', lat: 36.0732, lng: 4.7611 },
          { id: 'm-34-02', name: 'رأس الوادي', lat: 35.9500, lng: 5.0333 },
          { id: 'm-34-03', name: 'برج زمورة', lat: 36.2667, lng: 4.8500 },
          { id: 'm-34-04', name: 'المنصورة', lat: 36.0833, lng: 4.4500 }
        ]
      },
      {
        id: 'dz-35',
        name: '35. بومرداس (Boumerdès)',
        lat: 36.7599,
        lng: 3.4729,
        municipalities: [
          { id: 'm-35-01', name: 'بومرداس (المركز)', lat: 36.7599, lng: 3.4729 },
          { id: 'm-35-02', name: 'برج منايل', lat: 36.7500, lng: 3.7167 },
          { id: 'm-35-03', name: 'دلس', lat: 36.9167, lng: 3.9000 },
          { id: 'm-35-04', name: 'خميس الخشنة', lat: 36.6500, lng: 3.3333 },
          { id: 'm-35-05', name: 'بودواو', lat: 36.7333, lng: 3.4000 }
        ]
      },
      {
        id: 'dz-36',
        name: '36. الطارف (El Tarf)',
        lat: 36.7672,
        lng: 8.3138,
        municipalities: [
          { id: 'm-36-01', name: 'الطارف (المركز)', lat: 36.7672, lng: 8.3138 },
          { id: 'm-36-02', name: 'القالة', lat: 36.9000, lng: 8.4333 },
          { id: 'm-36-03', name: 'بوثلجة', lat: 36.8333, lng: 8.2167 },
          { id: 'm-36-04', name: 'الذرعان', lat: 36.6833, lng: 7.7500 }
        ]
      },
      {
        id: 'dz-37',
        name: '37. تندوف (Tindouf)',
        lat: 27.6711,
        lng: -8.1474,
        municipalities: [
          { id: 'm-37-01', name: 'تندوف (المركز)', lat: 27.6711, lng: -8.1474 },
          { id: 'm-37-02', name: 'أم العسل', lat: 28.3833, lng: -7.0500 }
        ]
      },
      {
        id: 'dz-38',
        name: '38. تيسمسيلت (Tissemsilt)',
        lat: 35.6072,
        lng: 1.8108,
        municipalities: [
          { id: 'm-38-01', name: 'تيسمسيلت (المركز)', lat: 35.6072, lng: 1.8108 },
          { id: 'm-38-02', name: 'ثنية الحد', lat: 35.8167, lng: 2.0333 },
          { id: 'm-38-03', name: 'برج بونعامة', lat: 35.8500, lng: 1.6333 }
        ]
      },
      {
        id: 'dz-39',
        name: '39. الوادي (El Oued)',
        lat: 33.3683,
        lng: 6.8674,
        municipalities: [
          { id: 'm-39-01', name: 'الوادي (المركز)', lat: 33.3683, lng: 6.8674 },
          { id: 'm-39-02', name: 'قمار', lat: 33.5000, lng: 6.8000 },
          { id: 'm-39-03', name: 'الدبيلة', lat: 33.5167, lng: 7.0000 },
          { id: 'm-39-04', name: 'الرقيبة', lat: 33.6000, lng: 6.7167 }
        ]
      },
      {
        id: 'dz-40',
        name: '40. خنشلة (Khenchela)',
        lat: 35.4358,
        lng: 7.1433,
        municipalities: [
          { id: 'm-40-01', name: 'خنشلة (المركز)', lat: 35.4358, lng: 7.1433 },
          { id: 'm-40-02', name: 'ششار', lat: 35.0833, lng: 7.0333 },
          { id: 'm-40-03', name: 'قايس', lat: 35.5333, lng: 6.8667 },
          { id: 'm-40-04', name: 'بابار', lat: 35.1667, lng: 7.1000 }
        ]
      },
      {
        id: 'dz-41',
        name: '41. سوق أهراس (Souk Ahras)',
        lat: 36.2864,
        lng: 7.9511,
        municipalities: [
          { id: 'm-41-01', name: 'سوق أهراس (المركز)', lat: 36.2864, lng: 7.9511 },
          { id: 'm-41-02', name: 'سدراتة', lat: 36.1333, lng: 7.5333 },
          { id: 'm-41-03', name: 'مداوروش', lat: 36.0667, lng: 7.8167 },
          { id: 'm-41-04', name: 'تاورة', lat: 36.1667, lng: 8.0500 }
        ]
      },
      {
        id: 'dz-42',
        name: '42. تيبازة (Tipaza)',
        lat: 36.5897,
        lng: 2.4475,
        municipalities: [
          { id: 'm-42-01', name: 'تيبازة (المركز)', lat: 36.5897, lng: 2.4475 },
          { id: 'm-42-02', name: 'شرشال', lat: 36.6000, lng: 2.1833 },
          { id: 'm-42-03', name: 'القليعة', lat: 36.6333, lng: 2.7667 },
          { id: 'm-42-04', name: 'بواسماعيل', lat: 36.6500, lng: 2.7000 },
          { id: 'm-42-05', name: 'حجوط', lat: 36.5167, lng: 2.4167 }
        ]
      },
      {
        id: 'dz-43',
        name: '43. ميلة (Mila)',
        lat: 36.4503,
        lng: 6.2644,
        municipalities: [
          { id: 'm-43-01', name: 'ميلة (المركز)', lat: 36.4503, lng: 6.2644 },
          { id: 'm-43-02', name: 'شلغوم العيد', lat: 36.1667, lng: 6.1667 },
          { id: 'm-43-03', name: 'تاجنانت', lat: 36.1167, lng: 6.0000 },
          { id: 'm-43-04', name: 'فرجيوة', lat: 36.4000, lng: 5.9500 }
        ]
      },
      {
        id: 'dz-44',
        name: '44. عين الدفلى (Aïn Defla)',
        lat: 36.2647,
        lng: 1.9679,
        municipalities: [
          { id: 'm-44-01', name: 'عين الدفلى (المركز)', lat: 36.2647, lng: 1.9679 },
          { id: 'm-44-02', name: 'خميس مليانة', lat: 36.2667, lng: 2.2333 },
          { id: 'm-44-03', name: 'مليانة', lat: 36.3000, lng: 2.2333 },
          { id: 'm-44-04', name: 'العطاف', lat: 36.2167, lng: 1.6667 }
        ]
      },
      {
        id: 'dz-45',
        name: '45. النعامة (Naâma)',
        lat: 33.2667,
        lng: -0.3167,
        municipalities: [
          { id: 'm-45-01', name: 'النعامة (المركز)', lat: 33.2667, lng: -0.3167 },
          { id: 'm-45-02', name: 'المشرية', lat: 33.5500, lng: -0.2833 },
          { id: 'm-45-03', name: 'عين الصفراء', lat: 32.7500, lng: -0.5833 }
        ]
      },
      {
        id: 'dz-46',
        name: '46. عين تموشنت (Aïn Témouchent)',
        lat: 35.2975,
        lng: -1.1404,
        municipalities: [
          { id: 'm-46-01', name: 'عين تموشنت (المركز)', lat: 35.2975, lng: -1.1404 },
          { id: 'm-46-02', name: 'بني صاف', lat: 35.3000, lng: -1.3833 },
          { id: 'm-46-03', name: 'حمام بوحجر', lat: 35.3833, lng: -0.9667 }
        ]
      },
      {
        id: 'dz-47',
        name: '47. غرداية (Ghardaïa)',
        lat: 32.4833,
        lng: 3.6667,
        municipalities: [
          { id: 'm-47-01', name: 'غرداية (المركز)', lat: 32.4833, lng: 3.6667 },
          { id: 'm-47-02', name: 'متليلي', lat: 32.2667, lng: 3.6333 },
          { id: 'm-47-03', name: 'القرارة', lat: 32.7833, lng: 4.5000 },
          { id: 'm-47-04', name: 'بريان', lat: 32.8333, lng: 3.7667 }
        ]
      },
      {
        id: 'dz-48',
        name: '48. غليزان (Relizane)',
        lat: 35.7408,
        lng: 0.5558,
        municipalities: [
          { id: 'm-48-01', name: 'غليزان (المركز)', lat: 35.7408, lng: 0.5558 },
          { id: 'm-48-02', name: 'وادي ارهيو', lat: 35.9667, lng: 0.9167 },
          { id: 'm-48-03', name: 'مازونة', lat: 36.1333, lng: 0.8833 },
          { id: 'm-48-04', name: 'زمورة', lat: 35.7167, lng: 0.7500 }
        ]
      },
      {
        id: 'dz-49',
        name: '49. تيميمون (Timimoun)',
        lat: 29.2639,
        lng: 0.2311,
        municipalities: [
          { id: 'm-49-01', name: 'تيميمون (المركز)', lat: 29.2639, lng: 0.2311 },
          { id: 'm-49-02', name: 'أوقروت', lat: 28.7500, lng: 0.2500 }
        ]
      },
      {
        id: 'dz-50',
        name: '50. برج باجي مختار (Bordj Badji Mokhtar)',
        lat: 21.3281,
        lng: 0.9547,
        municipalities: [
          { id: 'm-50-01', name: 'برج باجي مختار (المركز)', lat: 21.3281, lng: 0.9547 },
          { id: 'm-50-02', name: 'تيمياوين', lat: 20.4333, lng: 1.8167 }
        ]
      },
      {
        id: 'dz-51',
        name: '51. أولاد جلال (Ouled Djellal)',
        lat: 34.4167,
        lng: 5.0667,
        municipalities: [
          { id: 'm-51-01', name: 'أولاد جلال (المركز)', lat: 34.4167, lng: 5.0667 },
          { id: 'm-51-02', name: 'سيدي خالد', lat: 34.3833, lng: 4.9833 }
        ]
      },
      {
        id: 'dz-52',
        name: '52. بني عباس (Béni Abbès)',
        lat: 30.1333,
        lng: -2.1667,
        municipalities: [
          { id: 'm-52-01', name: 'بني عباس (المركز)', lat: 30.1333, lng: -2.1667 },
          { id: 'm-52-02', name: 'إقلي', lat: 30.6833, lng: -2.3000 },
          { id: 'm-52-03', name: 'الواتة', lat: 29.8667, lng: -1.7500 }
        ]
      },
      {
        id: 'dz-53',
        name: '53. عين صالح (In Salah)',
        lat: 27.2000,
        lng: 2.4667,
        municipalities: [
          { id: 'm-53-01', name: 'عين صالح (المركز)', lat: 27.2000, lng: 2.4667 },
          { id: 'm-53-02', name: 'إفقيرن', lat: 27.2167, lng: 2.5000 }
        ]
      },
      {
        id: 'dz-54',
        name: '54. عين قزام (In Guezzam)',
        lat: 19.5667,
        lng: 5.7667,
        municipalities: [
          { id: 'm-54-01', name: 'عين قزام (المركز)', lat: 19.5667, lng: 5.7667 },
          { id: 'm-54-02', name: 'تين زواتين', lat: 19.9500, lng: 2.9667 }
        ]
      },
      {
        id: 'dz-55',
        name: '55. تقرت (Touggourt)',
        lat: 33.1000,
        lng: 6.0667,
        municipalities: [
          { id: 'm-55-01', name: 'تقرت (المركز)', lat: 33.1000, lng: 6.0667 },
          { id: 'm-55-02', name: 'الطيبات', lat: 33.0833, lng: 6.3000 },
          { id: 'm-55-03', name: 'تماسين', lat: 33.0167, lng: 6.0333 }
        ]
      },
      {
        id: 'dz-56',
        name: '56. جانت (Djanet)',
        lat: 24.5542,
        lng: 9.4847,
        municipalities: [
          { id: 'm-56-01', name: 'جانت (المركز)', lat: 24.5542, lng: 9.4847 },
          { id: 'm-56-02', name: 'برج الحواس', lat: 25.0833, lng: 8.4500 }
        ]
      },
      {
        id: 'dz-57',
        name: '57. المغير (El M\'Ghair)',
        lat: 33.9500,
        lng: 5.9167,
        municipalities: [
          { id: 'm-57-01', name: 'المغير (المركز)', lat: 33.9500, lng: 5.9167 },
          { id: 'm-57-02', name: 'جامعة', lat: 33.5167, lng: 5.9833 }
        ]
      },
      {
        id: 'dz-58',
        name: '58. المنيعة (El Menia)',
        lat: 30.5833,
        lng: 2.8833,
        municipalities: [
          { id: 'm-58-01', name: 'المنيعة (المركز)', lat: 30.5833, lng: 2.8833 },
          { id: 'm-58-02', name: 'حاسي القارة', lat: 30.5500, lng: 2.9167 }
        ]
      }
    ]
  },

  // 2. EGYPT (مصر) - Governorates & Major Municipalities / Markaz
  {
    code: 'EG',
    name: 'مصر',
    flag: '🇪🇬',
    defaultMethod: 5,
    defaultLat: 30.0444,
    defaultLng: 31.2357,
    states: [
      {
        id: 'eg-cairo',
        name: 'محافظة القاهرة',
        lat: 30.0444,
        lng: 31.2357,
        municipalities: [
          { id: 'eg-cairo-01', name: 'وسط القاهرة / التحرير', lat: 30.0444, lng: 31.2357 },
          { id: 'eg-cairo-02', name: 'مدينة نصر', lat: 30.0600, lng: 31.3300 },
          { id: 'eg-cairo-03', name: 'مصر الجديدة', lat: 30.0900, lng: 31.3200 },
          { id: 'eg-cairo-04', name: 'التجمع الخامس / القاهرة الجديدة', lat: 30.0100, lng: 31.4700 },
          { id: 'eg-cairo-05', name: 'المعادي', lat: 29.9600, lng: 31.2600 },
          { id: 'eg-cairo-06', name: 'شبرا', lat: 30.0700, lng: 31.2400 },
          { id: 'eg-cairo-07', name: 'حلوان', lat: 29.8400, lng: 31.3300 }
        ]
      },
      {
        id: 'eg-giza',
        name: 'محافظة الجيزة',
        lat: 30.0131,
        lng: 31.2089,
        municipalities: [
          { id: 'eg-giza-01', name: 'الجيزة (المركز)', lat: 30.0131, lng: 31.2089 },
          { id: 'eg-giza-02', name: 'الدقي والمهندسين', lat: 30.0500, lng: 31.2000 },
          { id: 'eg-giza-03', name: 'مدينة 6 أكتوبر', lat: 29.9700, lng: 30.9500 },
          { id: 'eg-giza-04', name: 'الشيخ زايد', lat: 30.0500, lng: 30.9800 },
          { id: 'eg-giza-05', name: 'الهرم وفيصل', lat: 29.9900, lng: 31.1400 },
          { id: 'eg-giza-06', name: 'البدرشين', lat: 29.8100, lng: 31.2700 }
        ]
      },
      {
        id: 'eg-alex',
        name: 'محافظة الإسكندرية',
        lat: 31.2001,
        lng: 29.9187,
        municipalities: [
          { id: 'eg-alex-01', name: 'الإسكندرية (المركز)', lat: 31.2001, lng: 29.9187 },
          { id: 'eg-alex-02', name: 'سيدي جابر وسموحة', lat: 31.2200, lng: 29.9500 },
          { id: 'eg-alex-03', name: 'المنتزه والعصافرة', lat: 31.2700, lng: 30.0100 },
          { id: 'eg-alex-04', name: 'العجمي والدخيلة', lat: 31.1200, lng: 29.7700 },
          { id: 'eg-alex-05', name: 'برج العرب', lat: 30.9200, lng: 29.5400 }
        ]
      },
      {
        id: 'eg-dakahlia',
        name: 'محافظة الدقهلية (المنصورة)',
        lat: 31.0409,
        lng: 31.3785,
        municipalities: [
          { id: 'eg-dak-01', name: 'المنصورة (المركز)', lat: 31.0409, lng: 31.3785 },
          { id: 'eg-dak-02', name: 'طلخا', lat: 31.0550, lng: 31.3750 },
          { id: 'eg-dak-03', name: 'ميت غمر', lat: 30.7167, lng: 31.2500 },
          { id: 'eg-dak-04', name: 'السنبلاوين', lat: 30.8833, lng: 31.4833 },
          { id: 'eg-dak-05', name: 'دكرنس', lat: 31.0833, lng: 31.6000 },
          { id: 'eg-dak-06', name: 'بلقاس', lat: 31.2333, lng: 31.3667 },
          { id: 'eg-dak-07', name: 'شربين', lat: 31.2000, lng: 31.5167 },
          { id: 'eg-dak-08', name: 'أجا', lat: 30.9333, lng: 31.2833 },
          { id: 'eg-dak-09', name: 'المنزلة', lat: 31.1667, lng: 31.9333 },
          { id: 'eg-dak-10', name: 'نبروه', lat: 31.0833, lng: 31.3000 }
        ]
      },
      {
        id: 'eg-sharqia',
        name: 'محافظة الشرقية (الزقازيق)',
        lat: 30.5877,
        lng: 31.5020,
        municipalities: [
          { id: 'eg-sha-01', name: 'الزقازيق (المركز)', lat: 30.5877, lng: 31.5020 },
          { id: 'eg-sha-02', name: 'العاشر من رمضان', lat: 30.3000, lng: 31.7400 },
          { id: 'eg-sha-03', name: 'بلبيس', lat: 30.4167, lng: 31.5667 },
          { id: 'eg-sha-04', name: 'فاقوس', lat: 30.7333, lng: 31.8000 },
          { id: 'eg-sha-05', name: 'منيا القمح', lat: 30.5167, lng: 31.3500 },
          { id: 'eg-sha-06', name: 'أبو حماد', lat: 30.5500, lng: 31.6833 }
        ]
      },
      {
        id: 'eg-gharbia',
        name: 'محافظة الغربية (طنطا / المحلة)',
        lat: 30.7865,
        lng: 31.0004,
        municipalities: [
          { id: 'eg-gha-01', name: 'طنطا (المركز)', lat: 30.7865, lng: 31.0004 },
          { id: 'eg-gha-02', name: 'المحلة الكبرى', lat: 30.9700, lng: 31.1700 },
          { id: 'eg-gha-03', name: 'كفر الزيات', lat: 30.8167, lng: 30.8167 },
          { id: 'eg-gha-04', name: 'زفتى', lat: 30.7167, lng: 31.2500 },
          { id: 'eg-gha-05', name: 'سمنود', lat: 30.9667, lng: 31.2500 },
          { id: 'eg-gha-06', name: 'بسيون', lat: 30.9333, lng: 30.8167 }
        ]
      },
      {
        id: 'eg-qalubia',
        name: 'محافظة القليوبية (بنها)',
        lat: 30.4600,
        lng: 31.1800,
        municipalities: [
          { id: 'eg-qal-01', name: 'بنها (المركز)', lat: 30.4600, lng: 31.1800 },
          { id: 'eg-qal-02', name: 'شبرا الخيمة', lat: 30.1286, lng: 31.2422 },
          { id: 'eg-qal-03', name: 'قليوب', lat: 30.1833, lng: 31.2000 },
          { id: 'eg-qal-04', name: 'طوخ', lat: 30.3500, lng: 31.2000 },
          { id: 'eg-qal-05', name: 'العبور', lat: 30.2300, lng: 31.4700 }
        ]
      },
      {
        id: 'eg-menofia',
        name: 'محافظة المنوفية (شبين الكوم)',
        lat: 30.5500,
        lng: 31.0100,
        municipalities: [
          { id: 'eg-men-01', name: 'شبين الكوم', lat: 30.5500, lng: 31.0100 },
          { id: 'eg-men-02', name: 'منوف', lat: 30.4667, lng: 30.9333 },
          { id: 'eg-men-03', name: 'أشمون', lat: 30.2900, lng: 30.9800 },
          { id: 'eg-men-04', name: 'السادات', lat: 30.3800, lng: 30.5200 },
          { id: 'eg-men-05', name: 'قويسنا', lat: 30.5600, lng: 31.1400 },
          { id: 'eg-men-06', name: 'بركة السبع', lat: 30.6300, lng: 31.0800 }
        ]
      },
      {
        id: 'eg-beheira',
        name: 'محافظة البحيرة (دمنهور)',
        lat: 31.0379,
        lng: 30.4725,
        municipalities: [
          { id: 'eg-beh-01', name: 'دمنهور (المركز)', lat: 31.0379, lng: 30.4725 },
          { id: 'eg-beh-02', name: 'كفر الدوار', lat: 31.1333, lng: 30.1333 },
          { id: 'eg-beh-03', name: 'إيتاي البارود', lat: 30.8833, lng: 30.6667 },
          { id: 'eg-beh-04', name: 'رشيد', lat: 31.4000, lng: 30.4167 },
          { id: 'eg-beh-05', name: 'أبو حمص', lat: 31.1000, lng: 30.3167 }
        ]
      },
      {
        id: 'eg-domiat',
        name: 'محافظة دمياط',
        lat: 31.4175,
        lng: 31.8144,
        municipalities: [
          { id: 'eg-dom-01', name: 'دمياط (المركز)', lat: 31.4175, lng: 31.8144 },
          { id: 'eg-dom-02', name: 'رأس البر', lat: 31.5167, lng: 31.8167 },
          { id: 'eg-dom-03', name: 'دمياط الجديدة', lat: 31.4400, lng: 31.6600 },
          { id: 'eg-dom-04', name: 'فارسكور', lat: 31.3333, lng: 31.7167 },
          { id: 'eg-dom-05', name: 'الزرقا', lat: 31.2333, lng: 31.6333 }
        ]
      },
      {
        id: 'eg-portsaid',
        name: 'محافظة بورسعيد',
        lat: 31.2653,
        lng: 32.3019,
        municipalities: [
          { id: 'eg-ps-01', name: 'بورسعيد (المركز)', lat: 31.2653, lng: 32.3019 },
          { id: 'eg-ps-02', name: 'بورفؤاد', lat: 31.2500, lng: 32.3300 }
        ]
      },
      {
        id: 'eg-ismailia',
        name: 'محافظة الإسماعيلية',
        lat: 30.5965,
        lng: 32.2715,
        municipalities: [
          { id: 'eg-ism-01', name: 'الإسماعيلية (المركز)', lat: 30.5965, lng: 32.2715 },
          { id: 'eg-ism-02', name: 'فايد', lat: 30.3333, lng: 32.3000 },
          { id: 'eg-ism-03', name: 'القنطرة غرب', lat: 30.8500, lng: 32.3167 }
        ]
      },
      {
        id: 'eg-suez',
        name: 'محافظة السويس',
        lat: 29.9668,
        lng: 32.5498,
        municipalities: [
          { id: 'eg-suz-01', name: 'السويس (المركز)', lat: 29.9668, lng: 32.5498 },
          { id: 'eg-suz-02', name: 'العين السخنة', lat: 29.6000, lng: 32.3167 }
        ]
      },
      {
        id: 'eg-aswan',
        name: 'محافظة أسوان',
        lat: 24.0889,
        lng: 32.8998,
        municipalities: [
          { id: 'eg-asw-01', name: 'أسوان (المركز)', lat: 24.0889, lng: 32.8998 },
          { id: 'eg-asw-02', name: 'إدفو', lat: 24.9833, lng: 32.8667 },
          { id: 'eg-asw-03', name: 'كوم أمبو', lat: 24.4667, lng: 32.9500 }
        ]
      },
      {
        id: 'eg-luxor',
        name: 'محافظة الأقصر',
        lat: 25.6872,
        lng: 32.6396,
        municipalities: [
          { id: 'eg-lux-01', name: 'الأقصر (المركز)', lat: 25.6872, lng: 32.6396 },
          { id: 'eg-lux-02', name: 'إسنا', lat: 25.2933, lng: 32.5539 },
          { id: 'eg-lux-03', name: 'أرمنت', lat: 25.6167, lng: 32.5500 }
        ]
      },
      {
        id: 'eg-asyut',
        name: 'محافظة أسيوط',
        lat: 27.1809,
        lng: 31.1837,
        municipalities: [
          { id: 'eg-asy-01', name: 'أسيوط (المركز)', lat: 27.1809, lng: 31.1837 },
          { id: 'eg-asy-02', name: 'ديروط', lat: 27.5500, lng: 30.8167 },
          { id: 'eg-asy-03', name: 'منفلوط', lat: 27.3167, lng: 30.9667 },
          { id: 'eg-asy-04', name: 'أبوتيج', lat: 27.0400, lng: 31.3100 }
        ]
      },
      {
        id: 'eg-sohag',
        name: 'محافظة سوهاج',
        lat: 26.5569,
        lng: 31.6948,
        municipalities: [
          { id: 'eg-soh-01', name: 'سوهاج (المركز)', lat: 26.5569, lng: 31.6948 },
          { id: 'eg-soh-02', name: 'طهطا', lat: 26.7667, lng: 31.5000 },
          { id: 'eg-soh-03', name: 'جرجا', lat: 26.3333, lng: 31.8833 }
        ]
      },
      {
        id: 'eg-redsea',
        name: 'محافظة البحر الأحمر (الغردقة)',
        lat: 27.2579,
        lng: 33.8116,
        municipalities: [
          { id: 'eg-red-01', name: 'الغردقة', lat: 27.2579, lng: 33.8116 },
          { id: 'eg-red-02', name: 'سفاجا', lat: 26.7333, lng: 33.9333 },
          { id: 'eg-red-03', name: 'مرسى علم', lat: 25.0667, lng: 34.9000 },
          { id: 'eg-red-04', name: 'الجونة', lat: 27.3900, lng: 33.6800 }
        ]
      },
      {
        id: 'eg-sinai-s',
        name: 'محافظة جنوب سيناء (شرم الشيخ)',
        lat: 27.9158,
        lng: 34.3299,
        municipalities: [
          { id: 'eg-ssin-01', name: 'شرم الشيخ', lat: 27.9158, lng: 34.3299 },
          { id: 'eg-ssin-02', name: 'طور سيناء', lat: 28.2333, lng: 33.6167 },
          { id: 'eg-ssin-03', name: 'دهب', lat: 28.5000, lng: 34.5167 },
          { id: 'eg-ssin-04', name: 'نويبع', lat: 29.0333, lng: 34.6667 },
          { id: 'eg-ssin-05', name: 'سانت كاترين', lat: 28.5600, lng: 33.9700 }
        ]
      }
    ]
  },

  // 3. SAUDI ARABIA (المملكة العربية السعودية)
  {
    code: 'SA',
    name: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    defaultMethod: 4,
    defaultLat: 24.7136,
    defaultLng: 46.6753,
    states: [
      {
        id: 'sa-makkah',
        name: 'منطقة مكة المكرمة',
        lat: 21.4225,
        lng: 39.8262,
        municipalities: [
          { id: 'sa-mak-01', name: 'مكة المكرمة (الحرم الشريف)', lat: 21.4225, lng: 39.8262 },
          { id: 'sa-mak-02', name: 'جدة', lat: 21.4858, lng: 39.1925 },
          { id: 'sa-mak-03', name: 'الطائف', lat: 21.2854, lng: 40.4244 },
          { id: 'sa-mak-04', name: 'رابغ', lat: 22.7986, lng: 39.0347 },
          { id: 'sa-mak-05', name: 'القنفذة', lat: 19.1281, lng: 41.0786 }
        ]
      },
      {
        id: 'sa-madinah',
        name: 'منطقة المدينة المنورة',
        lat: 24.5247,
        lng: 39.5692,
        municipalities: [
          { id: 'sa-mad-01', name: 'المدينة المنورة (المسجد النبوي)', lat: 24.5247, lng: 39.5692 },
          { id: 'sa-mad-02', name: 'ينبع', lat: 24.0895, lng: 38.0618 },
          { id: 'sa-mad-03', name: 'العلا', lat: 26.6167, lng: 37.9167 },
          { id: 'sa-mad-04', name: 'بدر', lat: 23.7833, lng: 38.7833 }
        ]
      },
      {
        id: 'sa-riyadh',
        name: 'منطقة الرياض',
        lat: 24.7136,
        lng: 46.6753,
        municipalities: [
          { id: 'sa-riy-01', name: 'مدينة الرياض (المركز)', lat: 24.7136, lng: 46.6753 },
          { id: 'sa-riy-02', name: 'الدرعية', lat: 24.7333, lng: 46.5833 },
          { id: 'sa-riy-03', name: 'الخرج', lat: 24.1500, lng: 47.3000 },
          { id: 'sa-riy-04', name: 'المجمعة', lat: 25.9000, lng: 45.3333 },
          { id: 'sa-riy-05', name: 'الدوادمي', lat: 24.5000, lng: 44.4000 },
          { id: 'sa-riy-06', name: 'وادي الدواسر', lat: 20.4500, lng: 44.8333 }
        ]
      },
      {
        id: 'sa-eastern',
        name: 'المنطقة الشرقية',
        lat: 26.4207,
        lng: 50.0888,
        municipalities: [
          { id: 'sa-eas-01', name: 'الدمام', lat: 26.4207, lng: 50.0888 },
          { id: 'sa-eas-02', name: 'الخبر', lat: 26.2172, lng: 50.1971 },
          { id: 'sa-eas-03', name: 'الظهران', lat: 26.2361, lng: 50.0393 },
          { id: 'sa-eas-04', name: 'الهفوف / الأحساء', lat: 25.3800, lng: 49.5800 },
          { id: 'sa-eas-05', name: 'الجبيل', lat: 27.0000, lng: 49.6500 },
          { id: 'sa-eas-06', name: 'القطيف', lat: 26.5600, lng: 50.0200 },
          { id: 'sa-eas-07', name: 'حفر الباطن', lat: 28.4333, lng: 45.9667 }
        ]
      },
      {
        id: 'sa-asir',
        name: 'منطقة عسير (أبها)',
        lat: 18.2164,
        lng: 42.5053,
        municipalities: [
          { id: 'sa-asi-01', name: 'أبها', lat: 18.2164, lng: 42.5053 },
          { id: 'sa-asi-02', name: 'خميس مشيط', lat: 18.3000, lng: 42.7333 },
          { id: 'sa-asi-03', name: 'النماص', lat: 19.1167, lng: 42.1333 }
        ]
      },
      {
        id: 'sa-qassim',
        name: 'منطقة القصيم (بريدة)',
        lat: 26.3260,
        lng: 43.9750,
        municipalities: [
          { id: 'sa-qas-01', name: 'بريدة', lat: 26.3260, lng: 43.9750 },
          { id: 'sa-qas-02', name: 'عنيزة', lat: 26.0833, lng: 43.9833 },
          { id: 'sa-qas-03', name: 'الرس', lat: 25.8667, lng: 43.5000 }
        ]
      },
      {
        id: 'sa-tabuk',
        name: 'منطقة تبوك',
        lat: 28.3835,
        lng: 36.5662,
        municipalities: [
          { id: 'sa-tab-01', name: 'تبوك', lat: 28.3835, lng: 36.5662 },
          { id: 'sa-tab-02', name: 'نيوم / شرما', lat: 28.0000, lng: 35.2000 },
          { id: 'sa-tab-03', name: 'ضباء', lat: 27.3500, lng: 35.7000 }
        ]
      }
    ]
  },

  // 4. MOROCCO (المملكة المغربية)
  {
    code: 'MA',
    name: 'المغرب',
    flag: '🇲🇦',
    defaultMethod: 20,
    defaultLat: 33.5731,
    defaultLng: -7.5898,
    states: [
      {
        id: 'ma-casablanca',
        name: 'جهة الدار البيضاء - سطات',
        lat: 33.5731,
        lng: -7.5898,
        municipalities: [
          { id: 'ma-cas-01', name: 'الدار البيضاء (المركز)', lat: 33.5731, lng: -7.5898 },
          { id: 'ma-cas-02', name: 'المحمدية', lat: 33.6866, lng: -7.3828 },
          { id: 'ma-cas-03', name: 'سطات', lat: 33.0000, lng: -7.6167 },
          { id: 'ma-cas-04', name: 'الجديدة', lat: 33.2500, lng: -8.5000 }
        ]
      },
      {
        id: 'ma-rabat',
        name: 'جهة الرباط - سلا - القنيطرة',
        lat: 34.0209,
        lng: -6.8416,
        municipalities: [
          { id: 'ma-rab-01', name: 'الرباط (العاصمة)', lat: 34.0209, lng: -6.8416 },
          { id: 'ma-rab-02', name: 'سلا', lat: 34.0333, lng: -6.8167 },
          { id: 'ma-rab-03', name: 'تمارة', lat: 33.9167, lng: -6.9167 },
          { id: 'ma-rab-04', name: 'القنيطرة', lat: 34.2500, lng: -6.5833 }
        ]
      },
      {
        id: 'ma-marrakech',
        name: 'جهة مراكش - آسفي',
        lat: 31.6295,
        lng: -7.9811,
        municipalities: [
          { id: 'ma-mar-01', name: 'مراكش (المدينة الحمراء)', lat: 31.6295, lng: -7.9811 },
          { id: 'ma-mar-02', name: 'آسفي', lat: 32.3000, lng: -9.2333 },
          { id: 'ma-mar-03', name: 'الصويرة', lat: 31.5085, lng: -9.7595 }
        ]
      },
      {
        id: 'ma-fes',
        name: 'جهة فاس - مكناس',
        lat: 34.0331,
        lng: -5.0003,
        municipalities: [
          { id: 'ma-fes-01', name: 'فاس (المركز)', lat: 34.0331, lng: -5.0003 },
          { id: 'ma-fes-02', name: 'مكناس', lat: 33.8950, lng: -5.5547 },
          { id: 'ma-fes-03', name: 'تازة', lat: 34.2167, lng: -4.0167 }
        ]
      },
      {
        id: 'ma-tangier',
        name: 'جهة طنجة - تطوان - الحسيمة',
        lat: 35.7595,
        lng: -5.8340,
        municipalities: [
          { id: 'ma-tan-01', name: 'طنجة (عروس الشمال)', lat: 35.7595, lng: -5.8340 },
          { id: 'ma-tan-02', name: 'تطوان', lat: 35.5667, lng: -5.3667 },
          { id: 'ma-tan-03', name: 'الحسيمة', lat: 35.2500, lng: -3.9333 },
          { id: 'ma-tan-04', name: 'شفشاون', lat: 35.1667, lng: -5.2667 }
        ]
      },
      {
        id: 'ma-agadir',
        name: 'جهة سوس - ماسة (أكادير)',
        lat: 30.4278,
        lng: -9.5981,
        municipalities: [
          { id: 'ma-aga-01', name: 'أكادير', lat: 30.4278, lng: -9.5981 },
          { id: 'ma-aga-02', name: 'إنزكان', lat: 30.3500, lng: -9.5333 },
          { id: 'ma-aga-03', name: 'تارودانت', lat: 30.4667, lng: -8.8667 },
          { id: 'ma-aga-04', name: 'تيزنيت', lat: 29.7000, lng: -9.7333 }
        ]
      },
      {
        id: 'ma-oriental',
        name: 'جهة الشرق (وجدة)',
        lat: 34.6867,
        lng: -1.9114,
        municipalities: [
          { id: 'ma-ori-01', name: 'وجدة', lat: 34.6867, lng: -1.9114 },
          { id: 'ma-ori-02', name: 'الناظور', lat: 35.1667, lng: -2.9333 },
          { id: 'ma-ori-03', name: 'بركان', lat: 34.9167, lng: -2.3167 }
        ]
      }
    ]
  },

  // 5. TUNISIA (تونس)
  {
    code: 'TN',
    name: 'تونس',
    flag: '🇹🇳',
    defaultMethod: 3,
    defaultLat: 36.8065,
    defaultLng: 10.1815,
    states: [
      {
        id: 'tn-tunis',
        name: 'تونس العاصمة',
        lat: 36.8065,
        lng: 10.1815,
        municipalities: [
          { id: 'tn-tun-01', name: 'تونس (المركز)', lat: 36.8065, lng: 10.1815 },
          { id: 'tn-tun-02', name: 'المرسى', lat: 36.8783, lng: 10.3247 },
          { id: 'tn-tun-03', name: 'سيدي بوسعيد', lat: 36.8700, lng: 10.3400 },
          { id: 'tn-tun-04', name: 'باردو', lat: 36.8100, lng: 10.1300 }
        ]
      },
      {
        id: 'tn-sfax',
        name: 'ولاية صفاقس',
        lat: 34.7406,
        lng: 10.7603,
        municipalities: [
          { id: 'tn-sfx-01', name: 'صفاقس (المركز)', lat: 34.7406, lng: 10.7603 },
          { id: 'tn-sfx-02', name: 'ساقية الزيت', lat: 34.7833, lng: 10.7667 }
        ]
      },
      {
        id: 'tn-sousse',
        name: 'ولاية سوسة',
        lat: 35.8256,
        lng: 10.6084,
        municipalities: [
          { id: 'tn-sou-01', name: 'سوسة (الجوهرة)', lat: 35.8256, lng: 10.6084 },
          { id: 'tn-sou-02', name: 'مساكن', lat: 35.7333, lng: 10.5833 }
        ]
      },
      {
        id: 'tn-kairouan',
        name: 'ولاية القيروان',
        lat: 35.6781,
        lng: 10.0963,
        municipalities: [
          { id: 'tn-kai-01', name: 'القيروان (جامع عقبة)', lat: 35.6781, lng: 10.0963 },
          { id: 'tn-kai-02', name: 'بوحجلة', lat: 35.4167, lng: 10.0500 }
        ]
      },
      {
        id: 'tn-bizerte',
        name: 'ولاية بنزرت',
        lat: 37.2744,
        lng: 9.8739,
        municipalities: [
          { id: 'tn-biz-01', name: 'بنزرت', lat: 37.2744, lng: 9.8739 },
          { id: 'tn-biz-02', name: 'منزل بورقيبة', lat: 37.1500, lng: 9.7833 }
        ]
      }
    ]
  },

  // 6. PALESTINE (دولة فلسطين)
  {
    code: 'PS',
    name: 'فلسطين',
    flag: '🇵🇸',
    defaultMethod: 5,
    defaultLat: 31.7683,
    defaultLng: 35.2137,
    states: [
      {
        id: 'ps-jerusalem',
        name: 'محافظة القدس الشريف',
        lat: 31.7683,
        lng: 35.2137,
        municipalities: [
          { id: 'ps-jer-01', name: 'القدس (المسجد الأقصى المبارك)', lat: 31.7683, lng: 35.2137 },
          { id: 'ps-jer-02', name: 'أبو ديس والعيزرية', lat: 31.7600, lng: 35.2600 },
          { id: 'ps-jer-03', name: 'الرام وضاحية البريد', lat: 31.8500, lng: 35.2300 }
        ]
      },
      {
        id: 'ps-gaza',
        name: 'محافظات قطاع غزة',
        lat: 31.5017,
        lng: 34.4668,
        municipalities: [
          { id: 'ps-gaz-01', name: 'مدينة غزة', lat: 31.5017, lng: 34.4668 },
          { id: 'ps-gaz-02', name: 'خان يونس', lat: 31.3462, lng: 34.3063 },
          { id: 'ps-gaz-03', name: 'رفح', lat: 31.2968, lng: 34.2455 },
          { id: 'ps-gaz-04', name: 'دير البلح', lat: 31.4178, lng: 34.3533 },
          { id: 'ps-gaz-05', name: 'شمال غزة / جباليا', lat: 31.5300, lng: 34.4900 }
        ]
      },
      {
        id: 'ps-ramallah',
        name: 'محافظة رام الله والبيرة',
        lat: 31.9038,
        lng: 35.2034,
        municipalities: [
          { id: 'ps-ram-01', name: 'رام الله', lat: 31.9038, lng: 35.2034 },
          { id: 'ps-ram-02', name: 'البيرة', lat: 31.9080, lng: 35.2150 }
        ]
      },
      {
        id: 'ps-nablus',
        name: 'محافظة نابلس',
        lat: 32.2211,
        lng: 35.2544,
        municipalities: [
          { id: 'ps-nab-01', name: 'نابلس (جبل النار)', lat: 32.2211, lng: 35.2544 }
        ]
      },
      {
        id: 'ps-hebron',
        name: 'محافظة الخليل',
        lat: 31.5326,
        lng: 35.0998,
        municipalities: [
          { id: 'ps-heb-01', name: 'الخليل (الحرم الإبراهيمي)', lat: 31.5326, lng: 35.0998 }
        ]
      }
    ]
  },

  // 7. UAE (الإمارات العربية المتحدة)
  {
    code: 'AE',
    name: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    defaultMethod: 16,
    defaultLat: 25.2048,
    defaultLng: 55.2708,
    states: [
      {
        id: 'ae-dubai',
        name: 'إمارة دبي',
        lat: 25.2048,
        lng: 55.2708,
        municipalities: [
          { id: 'ae-dub-01', name: 'دبي (المركز)', lat: 25.2048, lng: 55.2708 },
          { id: 'ae-dub-02', name: 'ديرة', lat: 25.2697, lng: 55.3094 },
          { id: 'ae-dub-03', name: 'بر دبي', lat: 25.2500, lng: 55.3000 },
          { id: 'ae-dub-04', name: 'حتا', lat: 24.8000, lng: 56.1200 }
        ]
      },
      {
        id: 'ae-abudhabi',
        name: 'إمارة أبوظبي',
        lat: 24.4539,
        lng: 54.3773,
        municipalities: [
          { id: 'ae-abu-01', name: 'أبوظبي (العاصمة)', lat: 24.4539, lng: 54.3773 },
          { id: 'ae-abu-02', name: 'العين', lat: 24.2075, lng: 55.7447 },
          { id: 'ae-abu-03', name: 'الظفرة', lat: 23.6500, lng: 53.7000 }
        ]
      },
      {
        id: 'ae-sharjah',
        name: 'إمارة الشارقة',
        lat: 25.3573,
        lng: 55.4033,
        municipalities: [
          { id: 'ae-sha-01', name: 'الشارقة (المركز)', lat: 25.3573, lng: 55.4033 },
          { id: 'ae-sha-02', name: 'خورفكان', lat: 25.3333, lng: 56.3500 }
        ]
      }
    ]
  },

  // 8. OTHER ARAB & WORLD COUNTRIES
  {
    code: 'KW',
    name: 'الكويت',
    flag: '🇰🇼',
    defaultMethod: 4,
    defaultLat: 29.3759,
    defaultLng: 47.9774,
    states: [
      {
        id: 'kw-capital',
        name: 'العاصمة ومحافظات الكويت',
        lat: 29.3759,
        lng: 47.9774,
        municipalities: [
          { id: 'kw-01', name: 'مدينة الكويت (العاصمة)', lat: 29.3759, lng: 47.9774 },
          { id: 'kw-02', name: 'حولي', lat: 29.3328, lng: 48.0282 },
          { id: 'kw-03', name: 'السالمية', lat: 29.3344, lng: 48.0772 },
          { id: 'kw-04', name: 'الفروانية', lat: 29.2778, lng: 47.9589 },
          { id: 'kw-05', name: 'الأحمدي', lat: 29.0769, lng: 48.0839 },
          { id: 'kw-06', name: 'الجهراء', lat: 29.3375, lng: 47.6581 }
        ]
      }
    ]
  },
  {
    code: 'QA',
    name: 'قطر',
    flag: '🇶🇦',
    defaultMethod: 4,
    defaultLat: 25.2854,
    defaultLng: 51.5310,
    states: [
      {
        id: 'qa-all',
        name: 'دولة قطر',
        lat: 25.2854,
        lng: 51.5310,
        municipalities: [
          { id: 'qa-01', name: 'الدوحة (العاصمة)', lat: 25.2854, lng: 51.5310 },
          { id: 'qa-02', name: 'الريان', lat: 25.2919, lng: 51.4244 },
          { id: 'qa-03', name: 'الوكرة', lat: 25.1768, lng: 51.6048 },
          { id: 'qa-04', name: 'الخور', lat: 25.6839, lng: 51.5058 }
        ]
      }
    ]
  },
  {
    code: 'TR',
    name: 'تركيا (Türkiye)',
    flag: '🇹🇷',
    defaultMethod: 13,
    defaultLat: 41.0082,
    defaultLng: 28.9784,
    states: [
      {
        id: 'tr-istanbul',
        name: 'إسطنبول (Istanbul)',
        lat: 41.0082,
        lng: 28.9784,
        municipalities: [
          { id: 'tr-ist-01', name: 'إسطنبول (الفاتح / السلطان أحمد)', lat: 41.0082, lng: 28.9784 },
          { id: 'tr-ist-02', name: 'إسطنبول (كاديكوي / الجانب الآسيوي)', lat: 40.9900, lng: 29.0200 },
          { id: 'tr-ist-03', name: 'إسطنبول (باشاك شهير)', lat: 41.0900, lng: 28.8000 }
        ]
      },
      {
        id: 'tr-ankara',
        name: 'أنقرة (Ankara)',
        lat: 39.9334,
        lng: 32.8597,
        municipalities: [
          { id: 'tr-ank-01', name: 'أنقرة (المركز)', lat: 39.9334, lng: 32.8597 }
        ]
      }
    ]
  },
  {
    code: 'FR',
    name: 'فرنسا (France)',
    flag: '🇫🇷',
    defaultMethod: 12,
    defaultLat: 48.8566,
    defaultLng: 2.3522,
    states: [
      {
        id: 'fr-idf',
        name: 'إيل دو فرانس (باريس وضواحيها)',
        lat: 48.8566,
        lng: 2.3522,
        municipalities: [
          { id: 'fr-par-01', name: 'باريس (Paris)', lat: 48.8566, lng: 2.3522 },
          { id: 'fr-par-02', name: 'سان دوني (Saint-Denis)', lat: 48.9362, lng: 2.3574 },
          { id: 'fr-par-03', name: 'نانتير (Nanterre)', lat: 48.8924, lng: 2.2071 }
        ]
      },
      {
        id: 'fr-marseille',
        name: 'مارسيليا وضواحيها',
        lat: 43.2965,
        lng: 5.3698,
        municipalities: [
          { id: 'fr-mar-01', name: 'مارسيليا (Marseille)', lat: 43.2965, lng: 5.3698 },
          { id: 'fr-mar-02', name: 'ليون (Lyon)', lat: 45.7640, lng: 4.8357 }
        ]
      }
    ]
  },
  {
    code: 'DE',
    name: 'ألمانيا (Germany)',
    flag: '🇩🇪',
    defaultMethod: 3,
    defaultLat: 52.5200,
    defaultLng: 13.4050,
    states: [
      {
        id: 'de-berlin',
        name: 'برلين (Berlin)',
        lat: 52.5200,
        lng: 13.4050,
        municipalities: [
          { id: 'de-ber-01', name: 'برلين (Berlin)', lat: 52.5200, lng: 13.4050 },
          { id: 'de-ber-02', name: 'كولونيا (Köln)', lat: 50.9375, lng: 6.9603 },
          { id: 'de-ber-03', name: 'فرانكفورت (Frankfurt)', lat: 50.1109, lng: 8.6821 },
          { id: 'de-ber-04', name: 'ميونخ (München)', lat: 48.1351, lng: 11.5820 }
        ]
      }
    ]
  },
  {
    code: 'GB',
    name: 'المملكة المتحدة (UK)',
    flag: '🇬🇧',
    defaultMethod: 3,
    defaultLat: 51.5074,
    defaultLng: -0.1278,
    states: [
      {
        id: 'gb-all',
        name: 'إنجلترا وبقية المملكة',
        lat: 51.5074,
        lng: -0.1278,
        municipalities: [
          { id: 'gb-01', name: 'لندن (London)', lat: 51.5074, lng: -0.1278 },
          { id: 'gb-02', name: 'برمنغهام (Birmingham)', lat: 52.4862, lng: -1.8904 },
          { id: 'gb-03', name: 'مانشستر (Manchester)', lat: 53.4808, lng: -2.2426 },
          { id: 'gb-04', name: 'ليدز (Leeds)', lat: 53.8008, lng: -1.5491 }
        ]
      }
    ]
  },
  {
    code: 'US',
    name: 'الولايات المتحدة (USA)',
    flag: '🇺🇸',
    defaultMethod: 2,
    defaultLat: 40.7128,
    defaultLng: -74.0060,
    states: [
      {
        id: 'us-all',
        name: 'الولايات والمدن الرئيسية',
        lat: 40.7128,
        lng: -74.0060,
        municipalities: [
          { id: 'us-01', name: 'نيويورك (New York)', lat: 40.7128, lng: -74.0060 },
          { id: 'us-02', name: 'شيكاغو (Chicago)', lat: 41.8781, lng: -87.6298 },
          { id: 'us-03', name: 'ديربورن / ديترويت (Dearborn / Detroit)', lat: 42.3223, lng: -83.1763 },
          { id: 'us-04', name: 'دالاس / هيوستن (Texas)', lat: 32.7767, lng: -96.7970 },
          { id: 'us-05', name: 'لوس أنجلوس (Los Angeles)', lat: 34.0522, lng: -118.2437 }
        ]
      }
    ]
  },
  {
    code: 'CA',
    name: 'كندا (Canada)',
    flag: '🇨🇦',
    defaultMethod: 2,
    defaultLat: 43.6532,
    defaultLng: -79.3832,
    states: [
      {
        id: 'ca-all',
        name: 'المدن الكندية',
        lat: 43.6532,
        lng: -79.3832,
        municipalities: [
          { id: 'ca-01', name: 'تورونتو (Toronto)', lat: 43.6532, lng: -79.3832 },
          { id: 'ca-02', name: 'مونتريال (Montreal)', lat: 45.5017, lng: -73.5673 },
          { id: 'ca-03', name: 'أوتاوا (Ottawa)', lat: 45.4215, lng: -75.6972 },
          { id: 'ca-04', name: 'فانكوفر (Vancouver)', lat: 49.2827, lng: -123.1207 }
        ]
      }
    ]
  }
];

// Helper: Search locations worldwide (Country, State, or Municipality)
export function searchLocations(query: string): Array<{
  country: CountryLocationData;
  state: StateOrWilayaItem;
  municipality: MunicipalityItem;
  fullLabel: string;
}> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{
    country: CountryLocationData;
    state: StateOrWilayaItem;
    municipality: MunicipalityItem;
    fullLabel: string;
  }> = [];

  for (const country of COUNTRIES_DATA) {
    for (const state of country.states) {
      for (const mun of state.municipalities) {
        const matchMun = mun.name.toLowerCase().includes(q) || (mun.nameEn && mun.nameEn.toLowerCase().includes(q));
        const matchState = state.name.toLowerCase().includes(q);
        const matchCountry = country.name.toLowerCase().includes(q);

        if (matchMun || matchState || matchCountry) {
          results.push({
            country,
            state,
            municipality: mun,
            fullLabel: `${mun.name} - ${state.name} (${country.name})`
          });
        }
        if (results.length >= 25) return results;
      }
    }
  }

  return results;
}
