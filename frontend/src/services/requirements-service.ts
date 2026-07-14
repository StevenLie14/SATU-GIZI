import { apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { requirementPlans, type RequirementPlan } from "@/mocks/mbg-data";

interface ApiRequirementPlan {
  id: string;
  komoditas: string;
  kebutuhanMingguan: number;
  satuan: string;
  stokSaatIni: number;
  reorderPoint: number;
  proyeksiHabis: string | null;
}

const mapPlan = (r: ApiRequirementPlan): RequirementPlan => ({
  id: r.id,
  komoditas: r.komoditas,
  kebutuhanMingguan: r.kebutuhanMingguan,
  satuan: r.satuan,
  stokSaatIni: r.stokSaatIni,
  reorderPoint: r.reorderPoint,
  proyeksiHabis: r.proyeksiHabis ?? "—",
});

export const getRequirementPlans = () =>
  listOrFallback("/api/requirements", mapPlan, requirementPlans);

export const createRequirementPlan = (p: Omit<RequirementPlan, "id">) =>
  tryApi(() => apiPost<ApiRequirementPlan>("/api/requirements", p));
