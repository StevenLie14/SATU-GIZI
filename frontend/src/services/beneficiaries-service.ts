import { apiGet, apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { beneficiaries, type Beneficiary } from "@/mocks/mbg-data";

interface ApiBeneficiary {
  id: string;
  name: string;
  address: string;
  jenjang: string | null;
  students: number | null;
  status: string;
  kitchen?: { id: string; name: string } | null;
}

const mapBeneficiary = (r: ApiBeneficiary): Beneficiary => ({
  id: r.id,
  sekolah: r.name,
  jenjang: r.jenjang ?? "—",
  alamat: r.address,
  siswa: r.students ?? 0,
  dapur: r.kitchen?.name ?? "—",
  status: r.status?.toLowerCase() === "active" || r.status === "Aktif" ? "Aktif" : "Pending",
});

export const getBeneficiaries = () =>
  listOrFallback("/api/beneficiaries", mapBeneficiary, beneficiaries);

export const createBeneficiary = (b: {
  name: string;
  address: string;
  jenjang?: string;
  students?: number;
  latitude: number;
  longitude: number;
  capacity: number;
  kitchenId?: string;
}) => tryApi(() => apiPost<ApiBeneficiary>("/api/beneficiaries", b));

/* ---------- Rekomendasi dapur berbasis aturan radius ----------------- */

export interface KitchenRecommendation {
  kitchenId: string;
  name: string;
  address: string;
  distanceKm: number;
  radiusKm: number;
  inRadius: boolean;
}

export interface RecommendKitchenResult {
  rule: { radiusKm: number; active: boolean };
  recommendations: KitchenRecommendation[];
}

export const recommendKitchen = (lat: number, lng: number) =>
  tryApi(() =>
    apiGet<RecommendKitchenResult>(`/api/beneficiaries/recommend-kitchen?lat=${lat}&lng=${lng}`),
  );
