import { env } from "@/config/env";
import { apiGet, apiPatch, apiPost, listOrFallback, tryApi } from "@/services/api-client";
import {
  matchRecommendations,
  purchaseOrders,
  type MatchRec,
  type PurchaseOrder,
} from "@/mocks/mbg-data";

interface ApiPurchaseOrder {
  id: string;
  kode: string;
  komoditas: string;
  qty: number;
  satuan: string;
  supplier: string;
  nilai: number;
  status: string;
  tanggal: string | null;
}

const mapPo = (r: ApiPurchaseOrder): PurchaseOrder => ({
  id: r.id,
  kode: r.kode,
  komoditas: r.komoditas,
  qty: r.qty,
  satuan: r.satuan,
  supplier: r.supplier,
  nilai: r.nilai,
  status: r.status as PurchaseOrder["status"],
  tanggal: r.tanggal ?? "—",
});

export const getPurchaseOrders = () =>
  listOrFallback("/api/procurement", mapPo, purchaseOrders);

export const createPurchaseOrder = (po: Omit<PurchaseOrder, "id">) =>
  tryApi(() => apiPost<ApiPurchaseOrder>("/api/procurement", po));

export const updatePurchaseOrder = (id: string, po: Partial<Omit<PurchaseOrder, "id">>) =>
  tryApi(() => apiPatch<ApiPurchaseOrder>(`/api/procurement/${id}`, po));

interface ApiMatchRec {
  supplier: string;
  lokasi: string;
  hargaIndex: number;
  rating: number;
  leadTime: string | null;
  distanceKm: number;
  skor: number;
  alasan: string;
}

/**
 * AI supplier matching. The API scores by price index rather than absolute
 * price, so `harga` is approximated from the mock market reference when one
 * exists for the commodity.
 */
export async function getMatchRecommendations(komoditas: string): Promise<MatchRec[]> {
  const mock = matchRecommendations[komoditas] ?? [];
  if (!env.offlineMode) {
    try {
      const rows = await apiGet<ApiMatchRec[]>(
        `/api/procurement/match?komoditas=${encodeURIComponent(komoditas)}`,
      );
      if (rows.length) {
        const refHarga = mock[0]?.harga ?? 0;
        return rows.map((r) => ({
          supplier: r.supplier,
          harga: refHarga ? Math.round((refHarga * r.hargaIndex) / 100) : r.hargaIndex,
          satuan: mock[0]?.satuan ?? "kg",
          jarak: `${r.distanceKm} km`,
          rating: r.rating,
          skor: r.skor,
          alasan: r.alasan,
        }));
      }
    } catch {
      /* fall through */
    }
  }
  return mock;
}
