import { apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { suppliers, type Supplier } from "@/mocks/mbg-data";

interface ApiSupplier {
  id: string;
  nama: string;
  komoditas: string[];
  lokasi: string;
  hargaIndex: number;
  leadTime: string | null;
  rating: number;
  status: "AKTIF" | "PENDING" | "NONAKTIF";
}

const STATUS_LABEL: Record<ApiSupplier["status"], Supplier["status"]> = {
  AKTIF: "Terverifikasi",
  PENDING: "Pending",
  NONAKTIF: "Diblokir",
};

const mapSupplier = (r: ApiSupplier): Supplier => ({
  id: r.id,
  nama: r.nama,
  komoditas: r.komoditas,
  lokasi: r.lokasi,
  hargaIndex: r.hargaIndex,
  leadTime: r.leadTime ?? "—",
  rating: r.rating,
  status: STATUS_LABEL[r.status] ?? "Pending",
});

export const getSuppliers = () =>
  listOrFallback("/api/suppliers", mapSupplier, suppliers);

export const createSupplier = (s: Omit<Supplier, "id" | "rating" | "status">) =>
  tryApi(() => apiPost<ApiSupplier>("/api/suppliers", s));
