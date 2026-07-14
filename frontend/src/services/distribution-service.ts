import { apiPatch, listOrFallback, tryApi } from "@/services/api-client";
import { distBatches, type DistBatch, type DistStage } from "@/mocks/mbg-data";

interface ApiBatch {
  id: string;
  kode: string;
  porsi: number;
  menu: string;
  driver: string | null;
  stage: "PRODUKSI" | "PENGEMASAN" | "TRANSIT" | "TIBA" | "SELESAI";
  suhu: string | null;
  berangkat: string | null;
  estimasi: string | null;
  progress: number;
  kitchen?: { name: string } | null;
  school?: { name: string } | null;
}

const mapBatch = (r: ApiBatch): DistBatch => ({
  id: r.id,
  kode: r.kode,
  dapur: r.kitchen?.name ?? "—",
  sekolah: r.school?.name ?? "—",
  porsi: r.porsi,
  menu: r.menu,
  driver: r.driver ?? "—",
  stage: r.stage.toLowerCase() as DistStage,
  suhu: r.suhu ?? "—",
  berangkat: r.berangkat ?? "—",
  estimasi: r.estimasi ?? "—",
  progress: r.progress,
});

export const getDistBatches = () =>
  listOrFallback("/api/distribution", mapBatch, distBatches);

/** Move a batch to the next pipeline stage. Returns the updated batch or null offline. */
export const advanceBatchStage = async (id: string): Promise<DistBatch | null> => {
  const r = await tryApi(() => apiPatch<ApiBatch>(`/api/distribution/${id}/advance`));
  return r ? mapBatch(r) : null;
};

export const confirmBatchReceipt = async (id: string): Promise<DistBatch | null> => {
  const r = await tryApi(() => apiPatch<ApiBatch>(`/api/distribution/${id}/confirm-receipt`));
  return r ? mapBatch(r) : null;
};
