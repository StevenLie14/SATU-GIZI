import { apiPatch, apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { budgetProposals, type BudgetProposal } from "@/mocks/mbg-data";

interface ApiProposal {
  id: string;
  judul: string;
  pengaju: string;
  periode: string;
  nilai: number;
  status: "DISETUJUI" | "MENUNGGU" | "REVISI" | "DITOLAK";
  tanggal: string | null;
}

const STATUS_LABEL: Record<ApiProposal["status"], BudgetProposal["status"]> = {
  MENUNGGU: "Diajukan",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  REVISI: "Revisi",
};

const mapProposal = (r: ApiProposal): BudgetProposal => ({
  id: r.id,
  judul: r.judul,
  pengaju: r.pengaju,
  periode: r.periode,
  nilai: r.nilai,
  status: STATUS_LABEL[r.status] ?? "Diajukan",
  tanggal: r.tanggal ?? "—",
});

export const getBudgetProposals = () =>
  listOrFallback("/api/proposals", mapProposal, budgetProposals);

const STATUS_ENUM: Record<BudgetProposal["status"], ApiProposal["status"]> = {
  Diajukan: "MENUNGGU",
  Disetujui: "DISETUJUI",
  Ditolak: "DITOLAK",
  Revisi: "REVISI",
};

export const createBudgetProposal = (p: Omit<BudgetProposal, "id">) =>
  tryApi(() =>
    apiPost<ApiProposal>("/api/proposals", { ...p, status: STATUS_ENUM[p.status] }),
  );

export const setProposalStatus = (id: string, status: BudgetProposal["status"]) =>
  tryApi(() => apiPatch<ApiProposal>(`/api/proposals/${id}/status`, { status: STATUS_ENUM[status] }));
