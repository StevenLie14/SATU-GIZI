/* ================================================================== */
/* Nutrition reference data for the AI menu-planning engine.            */
/* AKG = Angka Kecukupan Gizi (Permenkes RI No. 28/2019), daily values  */
/* averaged across L/P. The MBG meal targets a fraction of daily AKG.    */
/* ================================================================== */

export interface Nutrients {
  energi: number; // kcal
  protein: number; // g
  lemak: number; // g
  karbohidrat: number; // g
  serat: number; // g
}

export interface AgeLevel {
  id: string;
  label: string; // school level
  ageRange: string;
  jenjang: "PAUD" | "SD" | "SMP" | "SMA";
  /** fraction of daily AKG the single MBG meal should cover */
  mealFraction: number;
  akgHarian: Nutrients;
}

export const ageLevels: AgeLevel[] = [
  { id: "paud", label: "PAUD / TK", ageRange: "4-6 tahun", jenjang: "PAUD", mealFraction: 0.3, akgHarian: { energi: 1400, protein: 25, lemak: 50, karbohidrat: 215, serat: 20 } },
  { id: "sd13", label: "SD Kelas 1-3", ageRange: "7-9 tahun", jenjang: "SD", mealFraction: 0.3, akgHarian: { energi: 1650, protein: 40, lemak: 55, karbohidrat: 250, serat: 23 } },
  { id: "sd46", label: "SD Kelas 4-6", ageRange: "10-12 tahun", jenjang: "SD", mealFraction: 0.3, akgHarian: { energi: 2000, protein: 50, lemak: 65, karbohidrat: 300, serat: 27 } },
  { id: "smp", label: "SMP", ageRange: "13-15 tahun", jenjang: "SMP", mealFraction: 0.32, akgHarian: { energi: 2275, protein: 70, lemak: 80, karbohidrat: 340, serat: 31 } },
  { id: "sma", label: "SMA", ageRange: "16-18 tahun", jenjang: "SMA", mealFraction: 0.32, akgHarian: { energi: 2475, protein: 75, lemak: 80, karbohidrat: 375, serat: 34 } },
];

/** Per-portion nutrition for common MBG menu components (estimated). */
export const foodNutrition: Record<string, Nutrients> = {
  // Karbohidrat utama
  "Nasi Putih": { energi: 260, protein: 5, lemak: 1, karbohidrat: 57, serat: 1 },
  "Nasi Uduk": { energi: 320, protein: 6, lemak: 9, karbohidrat: 52, serat: 1 },
  "Nasi Goreng Gizi": { energi: 340, protein: 9, lemak: 12, karbohidrat: 48, serat: 2 },
  // Lauk / protein
  "Ayam Teriyaki": { energi: 220, protein: 23, lemak: 12, karbohidrat: 6, serat: 0 },
  "Telur Balado": { energi: 180, protein: 13, lemak: 13, karbohidrat: 4, serat: 1 },
  "Ikan Tongkol Suwir": { energi: 170, protein: 25, lemak: 6, karbohidrat: 2, serat: 0 },
  "Daging Semur": { energi: 240, protein: 22, lemak: 15, karbohidrat: 5, serat: 0 },
  "Ayam Suwir + Telur": { energi: 250, protein: 26, lemak: 14, karbohidrat: 4, serat: 0 },
  // Sayur
  "Tumis Buncis Wortel": { energi: 90, protein: 3, lemak: 5, karbohidrat: 9, serat: 4 },
  "Cap Cay": { energi: 110, protein: 4, lemak: 6, karbohidrat: 11, serat: 4 },
  "Tumis Kangkung": { energi: 80, protein: 3, lemak: 5, karbohidrat: 7, serat: 3 },
  "Sayur Asem": { energi: 95, protein: 3, lemak: 3, karbohidrat: 14, serat: 5 },
  "Acar Timun": { energi: 45, protein: 1, lemak: 1, karbohidrat: 8, serat: 2 },
  // Buah
  "Pisang": { energi: 105, protein: 1, lemak: 0, karbohidrat: 27, serat: 3 },
  "Jeruk": { energi: 62, protein: 1, lemak: 0, karbohidrat: 15, serat: 3 },
  "Semangka": { energi: 46, protein: 1, lemak: 0, karbohidrat: 11, serat: 1 },
  "Pepaya": { energi: 59, protein: 1, lemak: 0, karbohidrat: 15, serat: 3 },
  "Melon": { energi: 54, protein: 1, lemak: 0, karbohidrat: 13, serat: 1 },
};

/** Heuristic fallback when a component is not in the table. */
export const fallbackByKind = {
  utama: { energi: 280, protein: 6, lemak: 4, karbohidrat: 55, serat: 1 },
  lauk: { energi: 210, protein: 22, lemak: 12, karbohidrat: 4, serat: 0 },
  sayur: { energi: 90, protein: 3, lemak: 5, karbohidrat: 10, serat: 4 },
  buah: { energi: 70, protein: 1, lemak: 0, karbohidrat: 17, serat: 2 },
} as const;
