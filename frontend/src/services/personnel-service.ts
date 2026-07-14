import { apiPatch, apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { personnel, type Personnel } from "@/mocks/mbg-data";

interface ApiPersonnel {
  id: string;
  nama: string;
  peran: string;
  area: string;
  kontak: string | null;
  status: string;
  pengiriman: number;
  rating: number;
}

const mapPersonnel = (r: ApiPersonnel): Personnel => ({
  id: r.id,
  nama: r.nama,
  peran: r.peran as Personnel["peran"],
  area: r.area,
  kontak: r.kontak ?? "—",
  status: r.status as Personnel["status"],
  pengiriman: r.pengiriman,
  rating: r.rating,
});

export const getPersonnel = () =>
  listOrFallback("/api/personnel", mapPersonnel, personnel);

export const createPersonnel = (p: Omit<Personnel, "id">) =>
  tryApi(() => apiPost<ApiPersonnel>("/api/personnel", p));

export const updatePersonnel = (id: string, p: Partial<Omit<Personnel, "id">>) =>
  tryApi(() => apiPatch<ApiPersonnel>(`/api/personnel/${id}`, p));
