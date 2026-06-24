import { useState } from "react";
import { FileSignature, Plus, Check, X, Eye, Wallet, Clock, CheckCircle2 } from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
  Tabs,
  Modal,
  Field,
  TextInput,
  TextArea,
  Drawer,
  useToast,
  formatRupiah,
  cn,
  type Column,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { budgetProposals, type BudgetProposal } from "@/mocks/mbg-data";

const statusColor: Record<BudgetProposal["status"], "green" | "amber" | "red" | "blue"> = {
  Disetujui: "green",
  Diajukan: "blue",
  Ditolak: "red",
  Revisi: "amber",
};

export default function ProposalAnggaran() {
  const { role } = useRole();
  const { toast } = useToast();
  const isGov = role === "pemerintah";
  const [list, setList] = useState<BudgetProposal[]>(budgetProposals);
  const [tab, setTab] = useState("all");
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<BudgetProposal | null>(null);
  const [form, setForm] = useState({ judul: "", periode: "", nilai: "", catatan: "" });

  const totalDiajukan = list.filter((p) => p.status === "Diajukan").reduce((a, p) => a + p.nilai, 0);
  const totalDisetujui = list.filter((p) => p.status === "Disetujui").reduce((a, p) => a + p.nilai, 0);

  const filtered = list.filter((p) => tab === "all" || p.status.toLowerCase() === tab);

  const submit = () => {
    if (!form.judul || !form.nilai) {
      toast("Judul dan nilai wajib diisi.", "error");
      return;
    }
    setList((prev) => [
      { id: `bp${Date.now()}`, judul: form.judul, pengaju: role === "sppg" ? "SPPG Dapur Pusat Senen" : "SPPG", periode: form.periode || "—", nilai: +form.nilai, status: "Diajukan", tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) },
      ...prev,
    ]);
    setAdding(false);
    setForm({ judul: "", periode: "", nilai: "", catatan: "" });
    toast("Proposal anggaran diajukan ke pemerintah.");
  };

  const decide = (p: BudgetProposal, status: BudgetProposal["status"]) => {
    setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)));
    setView((v) => (v && v.id === p.id ? { ...v, status } : v));
    toast(`Proposal "${p.judul}" ${status.toLowerCase()}.`);
  };

  const columns: Column<BudgetProposal>[] = [
    { key: "judul", header: "Proposal", render: (p) => <div><p className="font-semibold text-dark-900">{p.judul}</p><p className="text-xs text-gray-400">{p.pengaju} · {p.tanggal}</p></div> },
    { key: "periode", header: "Periode" },
    { key: "nilai", header: "Nilai", align: "right", render: (p) => <span className="font-bold text-dark-900">{formatRupiah(p.nilai)}</span> },
    { key: "status", header: "Status", align: "center", render: (p) => <Badge color={statusColor[p.status]} dot>{p.status}</Badge> },
    { key: "action", header: "Aksi", align: "right", render: (p) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => setView(p)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Eye size={16} /></button>
        {isGov && p.status === "Diajukan" && (
          <>
            <button onClick={() => decide(p, "Disetujui")} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"><Check size={16} /></button>
            <button onClick={() => decide(p, "Ditolak")} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><X size={16} /></button>
          </>
        )}
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader
        title="Proposal Anggaran"
        subtitle="Pengajuan dan persetujuan proposal anggaran operasional & pengadaan"
        icon={FileSignature}
        actions={(role === "sppg" || role === "pemerintah") && <Button icon={Plus} onClick={() => setAdding(true)}>Ajukan Proposal</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Proposal" value={list.length} icon={FileSignature} color="brand" />
        <StatCard label="Menunggu Keputusan" value={list.filter((p) => p.status === "Diajukan").length} icon={Clock} color="amber" sub={formatRupiah(totalDiajukan)} />
        <StatCard label="Disetujui" value={list.filter((p) => p.status === "Disetujui").length} icon={CheckCircle2} color="green" sub={formatRupiah(totalDisetujui)} />
        <StatCard label="Total Nilai Disetujui" value={formatRupiah(totalDisetujui)} icon={Wallet} color="purple" />
      </div>

      <div className="mb-5">
        <Tabs
          tabs={[
            { id: "all", label: "Semua", count: list.length },
            { id: "diajukan", label: "Diajukan", count: list.filter((p) => p.status === "Diajukan").length },
            { id: "disetujui", label: "Disetujui", count: list.filter((p) => p.status === "Disetujui").length },
            { id: "revisi", label: "Revisi", count: list.filter((p) => p.status === "Revisi").length },
            { id: "ditolak", label: "Ditolak", count: list.filter((p) => p.status === "Ditolak").length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <Card padded={false}>
        <div className="p-2"><DataTable columns={columns} data={filtered} empty="Tidak ada proposal." /></div>
      </Card>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Ajukan Proposal Anggaran"
        subtitle="Proposal akan dikirim ke pemerintah untuk ditinjau"
        footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={submit}>Ajukan</Button></>}
      >
        <div className="space-y-4">
          <Field label="Judul Proposal" required><TextInput value={form.judul} onChange={(v) => setForm({ ...form, judul: v })} placeholder="cth. Proposal Anggaran Operasional Juli 2026" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Periode"><TextInput value={form.periode} onChange={(v) => setForm({ ...form, periode: v })} placeholder="cth. Juli 2026" /></Field>
            <Field label="Nilai (Rp)" required><TextInput type="number" value={form.nilai} onChange={(v) => setForm({ ...form, nilai: v })} placeholder="0" /></Field>
          </div>
          <Field label="Catatan / Justifikasi"><TextArea value={form.catatan} onChange={(v) => setForm({ ...form, catatan: v })} placeholder="Jelaskan kebutuhan dan rincian anggaran..." rows={4} /></Field>
        </div>
      </Modal>

      <Drawer
        open={!!view}
        onClose={() => setView(null)}
        title={view?.judul || ""}
        subtitle={view ? view.pengaju : ""}
        footer={
          view && isGov && view.status === "Diajukan" ? (
            <>
              <Button variant="outline" icon={X} onClick={() => decide(view, "Revisi")}>Minta Revisi</Button>
              <Button icon={Check} className="flex-1" onClick={() => decide(view, "Disetujui")}>Setujui</Button>
            </>
          ) : (
            <Badge color={view ? statusColor[view.status] : "gray"} dot>{view?.status}</Badge>
          )
        }
      >
        {view && (
          <div className="space-y-5">
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
              <p className="text-xs text-brand-700 font-semibold">Nilai Diajukan</p>
              <p className="text-3xl font-bold text-dark-900 mt-1">{formatRupiah(view.nilai)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">Periode</p><p className="font-semibold text-dark-900">{view.periode}</p></div>
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">Tanggal Pengajuan</p><p className="font-semibold text-dark-900">{view.tanggal}</p></div>
            </div>
            <div>
              <p className="text-sm font-bold text-dark-900 mb-3">Riwayat Status</p>
              <div className="space-y-3">
                {["Diajukan", view.status !== "Diajukan" ? view.status : null].filter(Boolean).map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full", i === 0 ? "bg-blue-500" : view.status === "Disetujui" ? "bg-emerald-500" : view.status === "Ditolak" ? "bg-red-500" : "bg-amber-500")} />
                    <span className="text-sm text-gray-600">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
