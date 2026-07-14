import { listOrFallback } from "@/services/api-client";
import { nutritionTargets, type NutritionRow } from "@/mocks/mbg-data";

interface ApiNutritionTarget {
  id: string;
  kelompok: string;
  energi: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  serat: number;
  realisasiEnergi: number;
}

const mapTarget = (r: ApiNutritionTarget): NutritionRow => ({
  id: r.id,
  kelompok: r.kelompok,
  energi: r.energi,
  protein: r.protein,
  lemak: r.lemak,
  karbohidrat: r.karbohidrat,
  serat: r.serat,
  realisasiEnergi: r.realisasiEnergi,
});

export const getNutritionTargets = () =>
  listOrFallback("/api/nutrition/targets", mapTarget, nutritionTargets);
