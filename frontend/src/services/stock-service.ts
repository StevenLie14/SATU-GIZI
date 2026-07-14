import { apiPatch, apiPost, listOrFallback, titleCase, tryApi } from "@/services/api-client";
import { stockItems, type StockItem } from "@/mocks/mbg-data";

interface ApiStockItem {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
  satuan: string;
  gudang: string;
  kadaluarsa: string | null;
  status: "AMAN" | "MENIPIS" | "KRITIS";
}

const mapStock = (r: ApiStockItem): StockItem => ({
  id: r.id,
  nama: r.nama,
  kategori: r.kategori,
  jumlah: r.jumlah,
  satuan: r.satuan,
  gudang: r.gudang,
  kadaluarsa: r.kadaluarsa ?? "—",
  status: titleCase(r.status) as StockItem["status"],
});

export const getStockItems = () =>
  listOrFallback("/api/stock", mapStock, stockItems);

export const createStockItem = (item: Omit<StockItem, "id" | "status">) =>
  tryApi(() => apiPost<ApiStockItem>("/api/stock", item));

export const adjustStock = (id: string, delta: number) =>
  tryApi(() => apiPatch<ApiStockItem>(`/api/stock/${id}/adjust`, { delta }));
