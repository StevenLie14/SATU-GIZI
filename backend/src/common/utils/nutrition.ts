/* AKG (Permenkes RI 28/2019) reference + AI menu-nutrition analysis.
   Shared by the nutrition & AI modules; mirrors the frontend engine. */

export interface Nutrients {
  energi: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  serat: number;
}

export interface AgeLevel {
  id: string;
  label: string;
  ageRange: string;
  jenjang: string;
  mealFraction: number;
  akgHarian: Nutrients;
}

export const AGE_LEVELS: AgeLevel[] = [
  { id: 'paud', label: 'PAUD / TK', ageRange: '4-6 tahun', jenjang: 'PAUD', mealFraction: 0.3, akgHarian: { energi: 1400, protein: 25, lemak: 50, karbohidrat: 215, serat: 20 } },
  { id: 'sd13', label: 'SD Kelas 1-3', ageRange: '7-9 tahun', jenjang: 'SD', mealFraction: 0.3, akgHarian: { energi: 1650, protein: 40, lemak: 55, karbohidrat: 250, serat: 23 } },
  { id: 'sd46', label: 'SD Kelas 4-6', ageRange: '10-12 tahun', jenjang: 'SD', mealFraction: 0.3, akgHarian: { energi: 2000, protein: 50, lemak: 65, karbohidrat: 300, serat: 27 } },
  { id: 'smp', label: 'SMP', ageRange: '13-15 tahun', jenjang: 'SMP', mealFraction: 0.32, akgHarian: { energi: 2275, protein: 70, lemak: 80, karbohidrat: 340, serat: 31 } },
  { id: 'sma', label: 'SMA', ageRange: '16-18 tahun', jenjang: 'SMA', mealFraction: 0.32, akgHarian: { energi: 2475, protein: 75, lemak: 80, karbohidrat: 375, serat: 34 } },
];

export const FOOD_NUTRITION: Record<string, Nutrients> = {
  'Nasi Putih': { energi: 260, protein: 5, lemak: 1, karbohidrat: 57, serat: 1 },
  'Nasi Uduk': { energi: 320, protein: 6, lemak: 9, karbohidrat: 52, serat: 1 },
  'Nasi Goreng Gizi': { energi: 340, protein: 9, lemak: 12, karbohidrat: 48, serat: 2 },
  'Ayam Teriyaki': { energi: 220, protein: 23, lemak: 12, karbohidrat: 6, serat: 0 },
  'Telur Balado': { energi: 180, protein: 13, lemak: 13, karbohidrat: 4, serat: 1 },
  'Ikan Tongkol Suwir': { energi: 170, protein: 25, lemak: 6, karbohidrat: 2, serat: 0 },
  'Daging Semur': { energi: 240, protein: 22, lemak: 15, karbohidrat: 5, serat: 0 },
  'Ayam Suwir + Telur': { energi: 250, protein: 26, lemak: 14, karbohidrat: 4, serat: 0 },
  'Tumis Buncis Wortel': { energi: 90, protein: 3, lemak: 5, karbohidrat: 9, serat: 4 },
  'Cap Cay': { energi: 110, protein: 4, lemak: 6, karbohidrat: 11, serat: 4 },
  'Tumis Kangkung': { energi: 80, protein: 3, lemak: 5, karbohidrat: 7, serat: 3 },
  'Sayur Asem': { energi: 95, protein: 3, lemak: 3, karbohidrat: 14, serat: 5 },
  'Acar Timun': { energi: 45, protein: 1, lemak: 1, karbohidrat: 8, serat: 2 },
  Pisang: { energi: 105, protein: 1, lemak: 0, karbohidrat: 27, serat: 3 },
  Jeruk: { energi: 62, protein: 1, lemak: 0, karbohidrat: 15, serat: 3 },
  Semangka: { energi: 46, protein: 1, lemak: 0, karbohidrat: 11, serat: 1 },
  Pepaya: { energi: 59, protein: 1, lemak: 0, karbohidrat: 15, serat: 3 },
  Melon: { energi: 54, protein: 1, lemak: 0, karbohidrat: 13, serat: 1 },
};

const FALLBACK: Record<string, Nutrients> = {
  utama: { energi: 280, protein: 6, lemak: 4, karbohidrat: 55, serat: 1 },
  lauk: { energi: 210, protein: 22, lemak: 12, karbohidrat: 4, serat: 0 },
  sayur: { energi: 90, protein: 3, lemak: 5, karbohidrat: 10, serat: 4 },
  buah: { energi: 70, protein: 1, lemak: 0, karbohidrat: 17, serat: 2 },
};

const EMPTY: Nutrients = { energi: 0, protein: 0, lemak: 0, karbohidrat: 0, serat: 0 };
const add = (a: Nutrients, b: Nutrients): Nutrients => ({
  energi: a.energi + b.energi,
  protein: a.protein + b.protein,
  lemak: a.lemak + b.lemak,
  karbohidrat: a.karbohidrat + b.karbohidrat,
  serat: a.serat + b.serat,
});

const lookup = (name: string, kind: keyof typeof FALLBACK): Nutrients =>
  !name || name === '—' ? EMPTY : FOOD_NUTRITION[name] ?? FALLBACK[kind];

export interface MenuComponents {
  menuUtama: string;
  lauk: string;
  sayur?: string;
  buah?: string;
}

export function getLevel(levelId: string): AgeLevel {
  return AGE_LEVELS.find((l) => l.id === levelId) ?? AGE_LEVELS[1];
}

export function nutritionTargetFor(level: AgeLevel): Nutrients {
  const f = level.mealFraction;
  return {
    energi: Math.round(level.akgHarian.energi * f),
    protein: Math.round(level.akgHarian.protein * f),
    lemak: Math.round(level.akgHarian.lemak * f),
    karbohidrat: Math.round(level.akgHarian.karbohidrat * f),
    serat: Math.round(level.akgHarian.serat * f),
  };
}

export function estimateMenuNutrition(menu: MenuComponents): Nutrients {
  return [
    lookup(menu.menuUtama, 'utama'),
    lookup(menu.lauk, 'lauk'),
    lookup(menu.sayur ?? '', 'sayur'),
    lookup(menu.buah ?? '', 'buah'),
  ].reduce(add, EMPTY);
}

export interface MenuAnalysis {
  level: { id: string; label: string; ageRange: string };
  totals: Nutrients;
  target: Nutrients;
  adequacy: {
    key: keyof Nutrients;
    label: string;
    unit: string;
    actual: number;
    target: number;
    pct: number;
    status: 'kurang' | 'ideal' | 'berlebih';
  }[];
  score: number;
  recommendations: string[];
}

const META: { key: keyof Nutrients; label: string; unit: string }[] = [
  { key: 'energi', label: 'Energi', unit: 'kkal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'lemak', label: 'Lemak', unit: 'g' },
  { key: 'karbohidrat', label: 'Karbohidrat', unit: 'g' },
  { key: 'serat', label: 'Serat', unit: 'g' },
];

export function analyzeMenu(menu: MenuComponents, level: AgeLevel): MenuAnalysis {
  const totals = estimateMenuNutrition(menu);
  const target = nutritionTargetFor(level);
  const adequacy = META.map((m) => {
    const actual = Math.round(totals[m.key]);
    const tgt = target[m.key];
    const pct = tgt ? Math.round((actual / tgt) * 100) : 0;
    const status: 'kurang' | 'ideal' | 'berlebih' = pct < 90 ? 'kurang' : pct > 115 ? 'berlebih' : 'ideal';
    return { key: m.key, label: m.label, unit: m.unit, actual, target: tgt, pct, status };
  });
  const score = Math.round(
    adequacy.reduce((acc, a) => acc + Math.max(0, 100 - Math.abs(100 - a.pct)), 0) / adequacy.length,
  );
  const recommendations: string[] = [];
  adequacy.forEach((a) => {
    if (a.status === 'kurang') {
      const tip: Record<string, string> = {
        protein: 'Tambah porsi lauk (ayam/telur/ikan).',
        energi: 'Tambah porsi karbohidrat atau lauk berenergi.',
        serat: 'Tambah sayur atau buah.',
        karbohidrat: 'Tingkatkan porsi nasi/karbohidrat kompleks.',
        lemak: 'Tambah sumber lemak sehat secukupnya.',
      };
      recommendations.push(`${a.label} baru ${a.pct}% dari target — ${tip[a.key as string] ?? ''}`);
    } else if (a.status === 'berlebih' && (a.key === 'lemak' || a.key === 'energi')) {
      recommendations.push(`${a.label} ${a.pct}% (berlebih) — kurangi porsi gorengan/santan.`);
    }
  });
  if (!recommendations.length) recommendations.push(`Komposisi seimbang & sesuai AKG ${level.label}.`);
  return {
    level: { id: level.id, label: level.label, ageRange: level.ageRange },
    totals,
    target,
    adequacy,
    score,
    recommendations,
  };
}

export function generateMenuForLevel(level: AgeLevel): MenuComponents {
  const target = nutritionTargetFor(level);
  const pick = (kind: keyof typeof FALLBACK, names: string[], by: keyof Nutrients, want: number) => {
    let best = names[0];
    let diff = Infinity;
    names.forEach((n) => {
      const v = (FOOD_NUTRITION[n] ?? FALLBACK[kind])[by];
      if (Math.abs(v - want) < diff) {
        diff = Math.abs(v - want);
        best = n;
      }
    });
    return best;
  };
  return {
    menuUtama: pick('utama', ['Nasi Putih', 'Nasi Uduk', 'Nasi Goreng Gizi'], 'karbohidrat', target.karbohidrat * 0.6),
    lauk: pick('lauk', ['Ayam Teriyaki', 'Telur Balado', 'Ikan Tongkol Suwir', 'Daging Semur', 'Ayam Suwir + Telur'], 'protein', target.protein * 0.7),
    sayur: pick('sayur', ['Tumis Buncis Wortel', 'Cap Cay', 'Tumis Kangkung', 'Sayur Asem'], 'serat', target.serat * 0.5),
    buah: pick('buah', ['Pisang', 'Jeruk', 'Pepaya', 'Semangka', 'Melon'], 'serat', target.serat * 0.3),
  };
}
