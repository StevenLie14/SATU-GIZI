import { apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { ingredients, type Ingredient } from "@/mocks/mbg-data";

interface ApiIngredient {
  id: string;
  nama: string;
  kategori: string;
  perPorsi: number;
  satuan: string;
  hargaSatuan: number;
  supplier: string | null;
}

const mapIngredient = (r: ApiIngredient): Ingredient => ({
  id: r.id,
  nama: r.nama,
  kategori: r.kategori,
  perPorsi: r.perPorsi,
  satuan: r.satuan,
  hargaSatuan: r.hargaSatuan,
  supplier: r.supplier ?? "—",
});

export const getIngredients = () =>
  listOrFallback("/api/ingredients", mapIngredient, ingredients);

export const createIngredient = (i: Omit<Ingredient, "id">) =>
  tryApi(() => apiPost<ApiIngredient>("/api/ingredients", i));
