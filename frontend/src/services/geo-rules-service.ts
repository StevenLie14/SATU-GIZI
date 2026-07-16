import { env } from "@/config/env";
import { apiGet, apiPatch, tryApi } from "@/services/api-client";

/* ---------- Aturan wilayah (titik pusat + radius) ------------------- */

export type GeoRuleScope = "SCHOOL_ASSIGNMENT" | "SUPPLIER_MATCH" | "REDISTRIBUTION";

export interface GeoRule {
  scope: GeoRuleScope;
  radiusKm: number;
  centerLat: number | null;
  centerLng: number | null;
  active: boolean;
}

export const DEFAULT_RULES: GeoRule[] = [
  { scope: "SCHOOL_ASSIGNMENT", radiusKm: 10, centerLat: null, centerLng: null, active: true },
  { scope: "SUPPLIER_MATCH", radiusKm: 60, centerLat: null, centerLng: null, active: true },
  { scope: "REDISTRIBUTION", radiusKm: 160, centerLat: null, centerLng: null, active: true },
];

export async function getGeoRules(): Promise<GeoRule[]> {
  if (!env.offlineMode) {
    try {
      return await apiGet<GeoRule[]>("/api/geo-rules");
    } catch {
    }
  }
  return DEFAULT_RULES;
}

export const updateGeoRule = (
  scope: GeoRuleScope,
  patch: Partial<Pick<GeoRule, "radiusKm" | "centerLat" | "centerLng" | "active">>,
) => tryApi(() => apiPatch<GeoRule>(`/api/geo-rules/${scope}`, patch));
