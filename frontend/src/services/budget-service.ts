import { apiPatch, apiPost, listOrFallback, titleCase, tryApi } from "@/services/api-client";
import { budgetItems, type BudgetItem } from "@/mocks/mbg-data";

interface ApiBudgetItem {
  id: string;
  kategori: string;
  item: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
  periode: string;
  status: "DISETUJUI" | "MENUNGGU" | "REVISI" | "DITOLAK";
}

const mapItem = (r: ApiBudgetItem): BudgetItem => ({
  id: r.id,
  kategori: r.kategori,
  item: r.item,
  qty: r.qty,
  satuan: r.satuan,
  hargaSatuan: r.hargaSatuan,
  periode: r.periode,
  status: titleCase(r.status) as BudgetItem["status"],
});

export const getBudgetItems = () =>
  listOrFallback("/api/budget", mapItem, budgetItems);

export const createBudgetItem = (item: Omit<BudgetItem, "id">) =>
  tryApi(() =>
    apiPost<ApiBudgetItem>("/api/budget", { ...item, status: item.status.toUpperCase() }),
  );

export const setBudgetItemStatus = (id: string, status: BudgetItem["status"]) =>
  tryApi(() => apiPatch<ApiBudgetItem>(`/api/budget/${id}/status`, { status: status.toUpperCase() }));
