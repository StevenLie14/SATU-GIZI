import { apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { kitchenStaff, type KitchenStaff } from "@/mocks/mbg-data";

interface ApiKitchenStaff {
  id: string;
  nama: string;
  peran: string;
  sertifikasi: string | null;
  status: string;
  kitchen?: { name: string } | null;
}

const mapStaff = (r: ApiKitchenStaff): KitchenStaff => ({
  id: r.id,
  nama: r.nama,
  peran: r.peran,
  dapur: r.kitchen?.name ?? "—",
  sertifikasi: r.sertifikasi ?? "—",
  status: r.status as KitchenStaff["status"],
});

export const getKitchenStaff = () =>
  listOrFallback("/api/kitchen-staff", mapStaff, kitchenStaff);

export const createKitchenStaff = (s: { nama: string; peran: string; sertifikasi?: string; status?: string }) =>
  tryApi(() => apiPost<ApiKitchenStaff>("/api/kitchen-staff", s));
