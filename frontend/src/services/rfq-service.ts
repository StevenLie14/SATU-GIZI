import { apiPatch, apiPost, listOrFallback, titleCase, tryApi } from "@/services/api-client";
import {
  catalogItems,
  localProducers,
  rfqs,
  type CatalogItem,
  type LocalProducer,
  type Quote,
  type Rfq,
} from "@/mocks/rfq-data";

/* ---------- RFQ + quotes ------------------------------------------- */

interface ApiQuote {
  id: string;
  supplier: string;
  lokasi: string | null;
  jarakKm: number;
  hargaSatuan: number;
  priceIndex: number;
  leadTimeDays: number;
  rating: number;
  reliability: number;
  catatan: string | null;
}

interface ApiRfq {
  id: string;
  kode: string;
  komoditas: string;
  qty: number;
  satuan: string;
  buyer: string;
  deadline: string | null;
  status: "TERBUKA" | "EVALUASI" | "DIPUTUSKAN" | "DITUTUP";
  awardedTo: string | null;
  quotes?: ApiQuote[];
}

const mapQuote = (q: ApiQuote): Quote => ({
  id: q.id,
  supplier: q.supplier,
  lokasi: q.lokasi ?? "—",
  jarakKm: q.jarakKm,
  hargaSatuan: q.hargaSatuan,
  priceIndex: q.priceIndex,
  leadTimeDays: q.leadTimeDays,
  rating: q.rating,
  reliability: q.reliability,
  catatan: q.catatan ?? "",
});

const mapRfq = (r: ApiRfq): Rfq => ({
  id: r.id,
  kode: r.kode,
  komoditas: r.komoditas,
  qty: r.qty,
  satuan: r.satuan,
  buyer: r.buyer,
  deadline: r.deadline ?? "—",
  status: titleCase(r.status) as Rfq["status"],
  awardedTo: r.awardedTo ?? undefined,
  quotes: (r.quotes ?? []).map(mapQuote),
});

export const getRfqs = () => listOrFallback("/api/rfq", mapRfq, rfqs);

export const createRfq = (r: {
  komoditas: string;
  qty: number;
  satuan: string;
  buyer: string;
  deadline?: string;
}) => tryApi(() => apiPost<ApiRfq>("/api/rfq", r));

export const submitQuote = (rfqId: string, q: Omit<Quote, "id">) =>
  tryApi(() => apiPost<ApiQuote>(`/api/rfq/${rfqId}/quotes`, q));

export const awardRfq = async (rfqId: string, supplier: string): Promise<Rfq | null> => {
  const r = await tryApi(() => apiPatch<ApiRfq>(`/api/rfq/${rfqId}/award`, { supplier }));
  return r ? mapRfq(r) : null;
};

/* ---------- Raw-material catalog ------------------------------------ */

interface ApiCatalogItem {
  id: string;
  nama: string;
  kategori: string;
  satuan: string;
  hargaRef: number;
  supplierAktif: number;
  ratingRata: number;
  lokasiTerdekat: string | null;
}

const mapCatalog = (r: ApiCatalogItem): CatalogItem => ({
  id: r.id,
  nama: r.nama,
  kategori: r.kategori,
  satuan: r.satuan,
  hargaRef: r.hargaRef,
  supplierAktif: r.supplierAktif,
  ratingRata: r.ratingRata,
  lokasiTerdekat: r.lokasiTerdekat ?? "—",
});

export const getCatalogItems = () =>
  listOrFallback("/api/catalog", mapCatalog, catalogItems);

/* ---------- Local producers (UMKM) ---------------------------------- */

interface ApiProducer {
  id: string;
  nama: string;
  jenis: string;
  lokasi: string;
  komoditas: string[];
  kapasitasBulanan: string | null;
  isUMKM: boolean;
  rating: number;
  tenagaKerja: number;
  status: string;
}

const mapProducer = (r: ApiProducer): LocalProducer => ({
  id: r.id,
  nama: r.nama,
  jenis: r.jenis,
  lokasi: r.lokasi,
  komoditas: r.komoditas,
  kapasitasBulanan: r.kapasitasBulanan ?? "—",
  isUMKM: r.isUMKM,
  rating: r.rating,
  tenagaKerja: r.tenagaKerja,
  status: (r.status as LocalProducer["status"]) ?? "Calon Mitra",
});

export const getLocalProducers = () =>
  listOrFallback("/api/producers", mapProducer, localProducers);
