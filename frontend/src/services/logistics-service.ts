import { apiPatch, apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { vehicles, type Vehicle } from "@/mocks/mbg-data";

interface ApiVehicle {
  id: string;
  plat: string;
  jenis: string;
  driver: string | null;
  kapasitas: number;
  muatan: number;
  rute: string | null;
  status: string;
}

const mapVehicle = (r: ApiVehicle): Vehicle => ({
  id: r.id,
  plat: r.plat,
  jenis: r.jenis,
  driver: r.driver ?? "—",
  kapasitas: r.kapasitas,
  muatan: r.muatan,
  rute: r.rute ?? "—",
  status: r.status as Vehicle["status"],
});

export const getVehicles = () =>
  listOrFallback("/api/vehicles", mapVehicle, vehicles);

export const createVehicle = (v: Omit<Vehicle, "id">) =>
  tryApi(() => apiPost<ApiVehicle>("/api/vehicles", v));

export const updateVehicle = (id: string, v: Partial<Omit<Vehicle, "id">>) =>
  tryApi(() => apiPatch<ApiVehicle>(`/api/vehicles/${id}`, v));
