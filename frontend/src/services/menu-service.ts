import { apiPatch, apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { menuPlans, type MenuPlan } from "@/mocks/mbg-data";

interface ApiMenuPlan {
  id: string;
  hari: string;
  tanggal: string | null;
  menuUtama: string;
  lauk: string;
  sayur: string | null;
  buah: string | null;
  kalori: number;
  status: string;
}

const mapPlan = (r: ApiMenuPlan): MenuPlan => ({
  id: r.id,
  hari: r.hari,
  tanggal: r.tanggal ?? "—",
  menuUtama: r.menuUtama,
  lauk: r.lauk,
  sayur: r.sayur ?? "—",
  buah: r.buah ?? "—",
  kalori: r.kalori,
  status: r.status as MenuPlan["status"],
});

export const getMenuPlans = () =>
  listOrFallback("/api/menu", mapPlan, menuPlans);

export const createMenuPlan = (p: Omit<MenuPlan, "id">) =>
  tryApi(() => apiPost<ApiMenuPlan>("/api/menu", p));

export const setMenuPlanStatus = (id: string, status: MenuPlan["status"]) =>
  tryApi(() => apiPatch<ApiMenuPlan>(`/api/menu/${id}/status`, { status }));
