import { useState, useEffect } from "react";
import { FileText, FilePlus2, Download, Eye, TrendingUp, Package } from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
  Select,
  Modal,
  Field,
  TextInput,
  Drawer,
  Progress,
  SectionTitle,
  useToast,
  formatRupiah,
  type Column,
} from "@/components/ui";
import { LineChart } from "@/components/charts";
import { opsReports, type OpsReport } from "@/mocks/mbg-data";
import { createOpsReport, getOpsReports } from "@/services/reports-service";

const statusColor: Record<OpsReport["status"], "green" | "gray" | "blue"> = {
  Final: "green",
  Draft: "gray",
  Direview: "blue",
};

export default function LaporanOperasional() {
  const { toast } = useToast();
  const [list, setList] = useState<OpsReport[]>(opsReports);
  useEffect(() => {
    getOpsReports().then((rows) => rows.length && setList(rows));
  }, []);
  const [periode, setPeriode] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [view, setView] = useState<OpsReport | null>(null);
  const [form, setForm] = useState({ judul: "Laporan Operasional Harian", dapur: "SPPG Dapur Pusat Senen", periode: "" });

  const totalPorsi = list.reduce((a, r) => a + r.porsiTerkirim, 0);
  const realisasi = list.reduce((a, r) => a + r.realisasiBiaya, 0);
  const fulfillment = Math.round((totalPorsi / list.reduce((a, r) => a + r.porsiTerencana, 0)) * 100);

  const filtered = list.filter((r) => periode === "all" || r.judul.includes(periode));

  const generate = () => {
    if (!form.periode) {
      toast("Tentukan periode laporan.", "error");
      return;
    }
    const report: OpsReport = { id: `o${Date.now()}`, judul: form.judul, periode: form.periode, dapur: form.dapur, porsiTerkirim: 1580, porsiTerencana: 1650, realisasiBiaya: 27650000, status: "Draft", tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) };
    const { id: localId, ...payload } = report;
    createOpsReport(payload).then((saved) => {
      if (saved) setList((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setList((prev) => [report, ...prev]);
    setGenerating(false);
    setForm({ judul: "Laporan Operasional Harian", dapur: "SPPG Dapur Pusat Senen", periode: "" });
    toast("Laporan operasional dibuat sebagai draft.");
  };

  const columns: Column<OpsReport>[] = [
    { key: "judul", header: "Laporan", render: (r) => <div><p className="font-semibold text-dark-900">{r.judul}</p><p className="text-xs text-gray-400">{r.periode} · {r.dapur}</p></div> },
    { key: "porsi", header: "Porsi (kirim/rencana)", align: "right", render: (r) => <span>{r.porsiTerkirim.toLocaleString("id-ID")} / {r.porsiTerencana.toLocaleString("id-ID")}</span> },
    { key: "fulfillment", header: "Pemenuhan", align: "center", render: (r) => { const f = Math.round((r.porsiTerkirim / r.porsiTerencana) * 100); return <Badge color={f >= 98 ? "green" : f >= 90 ? "amber" : "red"}>{f}%</Badge>; } },
    { key: "biaya", header: "Realisasi Biaya", align: "right", render: (r) => formatRupiah(r.realisasiBiaya) },
    { key: "status", header: "Status", align: "center", render: (r) => <Badge color={statusColor[r.status]} dot>{r.status}</Badge> },
    { key: "action", header: "", align: "right", render: (r) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => setView(r)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Eye size={16} /></button>
        <button onClick={() => toast("Laporan diunduh (PDF).", "info")} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Download size={16} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader
        title="Laporan Operasional"
        subtitle="Rekap kinerja produksi, distribusi, dan realisasi biaya operasional dapur"
        icon={FileText}
        actions={<Button icon={FilePlus2} onClick={() => setGenerating(true)}>Buat Laporan</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Laporan" value={list.length} icon={FileText} color="brand" />
        <StatCard label="Porsi Terkirim" value={totalPorsi.toLocaleString("id-ID")} icon={Package} color="blue" />
        <StatCard label="Pemenuhan Rata-rata" value={`${fulfillment}%`} icon={TrendingUp} color="green" />
        <StatCard label="Total Realisasi Biaya" value={formatRupiah(realisasi)} icon={FileText} color="purple" />
      </div>

      <Card className="mb-6">
        <SectionTitle>Tren Porsi Terkirim vs Terencana</SectionTitle>
        <LineChart
          labels={["Sen", "Sel", "Rab", "Kam", "Jum"]}
          series={[
            { name: "Terencana", values: [2750, 2750, 2790, 2750, 2820], color: "#94a3b8" },
            { name: "Terkirim", values: [2700, 2750, 2750, 2710, 2780], color: "#16a34a" },
          ]}
        />
      </Card>

      <Card padded={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100 sm:items-center justify-between">
          <h2 className="font-bold text-dark-900">Daftar Laporan</h2>
          <Select value={periode} onChange={setPeriode} options={[{ value: "all", label: "Semua Periode" }, { value: "Harian", label: "Harian" }, { value: "Mingguan", label: "Mingguan" }, { value: "Bulanan", label: "Bulanan" }]} />
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} /></div>
      </Card>

      <Modal
        open={generating}
        onClose={() => setGenerating(false)}
        title="Buat Laporan Operasional"
        footer={<><Button variant="outline" onClick={() => setGenerating(false)}>Batal</Button><Button onClick={generate}>Generate</Button></>}
      >
        <div className="space-y-4">
          <Field label="Jenis Laporan">
            <Select value={form.judul} onChange={(v) => setForm({ ...form, judul: v })} options={[{ value: "Laporan Operasional Harian", label: "Harian" }, { value: "Laporan Operasional Mingguan", label: "Mingguan" }, { value: "Laporan Operasional Bulanan", label: "Bulanan" }]} />
          </Field>
          <Field label="Dapur">
            <Select value={form.dapur} onChange={(v) => setForm({ ...form, dapur: v })} options={[{ value: "SPPG Dapur Pusat Senen", label: "SPPG Dapur Pusat Senen" }, { value: "SPPG Dapur Sehat Tebet", label: "SPPG Dapur Sehat Tebet" }, { value: "Semua Dapur", label: "Semua Dapur" }]} />
          </Field>
          <Field label="Periode" required><TextInput value={form.periode} onChange={(v) => setForm({ ...form, periode: v })} placeholder="cth. 24 Jun 2026" /></Field>
        </div>
      </Modal>

      <Drawer
        open={!!view}
        onClose={() => setView(null)}
        title={view?.judul || ""}
        subtitle={view ? `${view.periode} · ${view.dapur}` : ""}
        footer={<Button icon={Download} className="flex-1" onClick={() => toast("Laporan diunduh (PDF).", "info")}>Unduh PDF</Button>}
      >
        {view && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">Porsi Terkirim</p><p className="text-lg font-bold text-dark-900">{view.porsiTerkirim.toLocaleString("id-ID")}</p></div>
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">Porsi Terencana</p><p className="text-lg font-bold text-dark-900">{view.porsiTerencana.toLocaleString("id-ID")}</p></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-dark-900 mb-2">Tingkat Pemenuhan</p>
              <Progress value={(view.porsiTerkirim / view.porsiTerencana) * 100} showLabel color="green" />
            </div>
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
              <p className="text-xs text-brand-700 font-semibold">Realisasi Biaya Operasional</p>
              <p className="text-2xl font-bold text-dark-900 mt-1">{formatRupiah(view.realisasiBiaya)}</p>
              <p className="text-xs text-gray-500 mt-1">≈ {formatRupiah(Math.round(view.realisasiBiaya / view.porsiTerkirim))} per porsi</p>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed p-4 border border-gray-100 rounded-xl">
              <p className="font-semibold text-dark-900 mb-1">Ringkasan</p>
              Operasional berjalan dengan tingkat pemenuhan {Math.round((view.porsiTerkirim / view.porsiTerencana) * 100)}%.
              {view.porsiTerkirim < view.porsiTerencana ? " Terdapat selisih akibat penyesuaian kehadiran siswa dan kendala logistik minor." : " Seluruh target tercapai sesuai rencana."}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
