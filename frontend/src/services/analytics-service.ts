import { env } from "@/config/env";
import { apiGet, listOrFallback } from "@/services/api-client";
import {
  demandForecast,
  priceForecast,
  redistRecommendations,
  regionBalances,
  type RedistRec,
  type RegionBalance,
} from "@/mocks/mbg-data";

/* ---------- Demand forecast ----------------------------------------- */

export interface DemandForecast {
  labels: string[];
  actual: number[];
  predicted: number[];
  accuracy?: number;
}

export async function getDemandForecast(): Promise<DemandForecast> {
  if (!env.offlineMode) {
    try {
      return await apiGet<DemandForecast>("/api/analytics/demand-forecast");
    } catch {
      /* fall through */
    }
  }
  return demandForecast;
}

/* ---------- Price forecast ------------------------------------------ */

export type PriceForecastRow = (typeof priceForecast)[number];

export async function getPriceForecast(): Promise<PriceForecastRow[]> {
  if (!env.offlineMode) {
    try {
      return await apiGet<PriceForecastRow[]>("/api/analytics/price-forecast");
    } catch {
      /* fall through */
    }
  }
  return priceForecast;
}

/* ---------- Region balance & redistribution -------------------------- */

interface ApiRegionBalance {
  id: string;
  region: string;
  surplus: number;
  komoditas: string;
}

export const getRegionBalances = () =>
  listOrFallback<ApiRegionBalance, RegionBalance>(
    "/api/analytics/region-balance",
    (r) => ({ region: r.region, surplus: r.surplus, komoditas: r.komoditas }),
    regionBalances,
  );

interface ApiRedistRec {
  id: string;
  fromRegion: string;
  toRegion: string;
  komoditas: string;
  jumlah: number;
  satuan: string;
  jarak: string | null;
  hemat: string | null;
}

export const getRedistRecommendations = () =>
  listOrFallback<ApiRedistRec, RedistRec>(
    "/api/analytics/redistribution",
    (r) => ({
      from: r.fromRegion,
      to: r.toRegion,
      komoditas: r.komoditas,
      jumlah: r.jumlah,
      satuan: r.satuan,
      jarak: r.jarak ?? "—",
      hemat: r.hemat ?? "—",
    }),
    redistRecommendations,
  );

/* ---------- National dashboard KPIs ---------------------------------- */

export interface DashboardKpis {
  porsiTerdistribusi: number;
  sekolah: number;
  dapur: number;
  supplier: number;
  stokKritis: number;
  batchAktif: number;
  kepuasan: number;
}

export async function getDashboardKpis(): Promise<DashboardKpis | null> {
  if (env.offlineMode) return null;
  try {
    return await apiGet<DashboardKpis>("/api/analytics/dashboard");
  } catch {
    return null;
  }
}
