import { apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { opsReports, type OpsReport } from "@/mocks/mbg-data";

interface ApiOpsReport {
  id: string;
  judul: string;
  periode: string;
  dapur: string;
  porsiTerkirim: number;
  porsiTerencana: number;
  realisasiBiaya: number;
  status: string;
  tanggal: string | null;
}

const mapReport = (r: ApiOpsReport): OpsReport => ({
  id: r.id,
  judul: r.judul,
  periode: r.periode,
  dapur: r.dapur,
  porsiTerkirim: r.porsiTerkirim,
  porsiTerencana: r.porsiTerencana,
  realisasiBiaya: r.realisasiBiaya,
  status: r.status as OpsReport["status"],
  tanggal: r.tanggal ?? "—",
});

export const getOpsReports = () =>
  listOrFallback("/api/reports", mapReport, opsReports);

export const createOpsReport = (r: Omit<OpsReport, "id">) =>
  tryApi(() => apiPost<ApiOpsReport>("/api/reports", r));
