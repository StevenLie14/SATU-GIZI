import { apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { mitraList, type Mitra } from "@/mocks/mbg-data";

interface ApiPartner {
  id: string;
  nama: string;
  jenis: string;
  pic: string | null;
  kontak: string | null;
  kontrak: string | null;
  status: "AKTIF" | "PENDING" | "NONAKTIF";
  rating: number;
}

const STATUS_LABEL: Record<ApiPartner["status"], Mitra["status"]> = {
  AKTIF: "Aktif",
  PENDING: "Tinjau Ulang",
  NONAKTIF: "Nonaktif",
};

const mapPartner = (r: ApiPartner): Mitra => ({
  id: r.id,
  nama: r.nama,
  jenis: r.jenis,
  pic: r.pic ?? "—",
  kontak: r.kontak ?? "—",
  kontrak: r.kontrak ?? "—",
  status: STATUS_LABEL[r.status] ?? "Aktif",
  rating: r.rating,
});

export const getPartners = () =>
  listOrFallback("/api/partners", mapPartner, mitraList);

export const createPartner = (m: Omit<Mitra, "id" | "rating" | "status">) =>
  tryApi(() => apiPost<ApiPartner>("/api/partners", m));
