import { apiPatch, listOrFallback, titleCase, tryApi } from "@/services/api-client";
import { kitchens, type Kitchen } from "@/mocks/mbg-data";

interface ApiKitchen {
  id: string;
  name: string;
  address: string;
  capacity: number;
  kepala: string | null;
  izinStatus: "BERLAKU" | "PROSES" | "KADALUARSA";
  izinNomor: string | null;
  izinBerlaku: string | null;
  skorPengawasan: number;
  checklist?: { id: string; label: string; done: boolean }[];
}

const mapKitchen = (r: ApiKitchen): Kitchen => ({
  id: r.id,
  nama: r.name,
  alamat: r.address,
  kapasitas: r.capacity,
  kepala: r.kepala ?? "—",
  izinStatus: titleCase(r.izinStatus) as Kitchen["izinStatus"],
  izinNomor: r.izinNomor ?? "—",
  izinBerlaku: r.izinBerlaku ?? "—",
  skorPengawasan: r.skorPengawasan,
  checklist: (r.checklist ?? []).map((c) => ({ label: c.label, done: c.done })),
});

export const getKitchens = () =>
  listOrFallback("/api/kitchens", mapKitchen, kitchens);

export const issuePermit = (id: string, izinNomor: string, izinBerlaku: string) =>
  tryApi(() =>
    apiPatch<ApiKitchen>(`/api/kitchens/${id}/issue-permit`, { izinNomor, izinBerlaku }),
  );
