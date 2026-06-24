import { useState } from "react";
import { ClipboardList, ShoppingCart, AlertTriangle, CheckCircle2, Calculator } from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
  Select,
  Progress,
  SectionTitle,
  useToast,
  cn,
  type Column,
} from "../../ui";
import { useNavigate } from "react-router-dom";
import { requirementPlans, type RequirementPlan } from "../../data";

export default function PerencanaanKebutuhan() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [horizon, setHorizon] = useState("minggu");
  const factor = horizon === "minggu" ? 1 : horizon === "2minggu" ? 2 : 4;

  const need = (r: RequirementPlan) => Math.max(0, r.kebutuhanMingguan * factor - r.stokSaatIni);
  const belowReorder = requirementPlans.filter((r) => r.stokSaatIni <= r.reorderPoint);

  const columns: Column<RequirementPlan>[] = [
    { key: "komoditas", header: "Komoditas", render: (r) => <span className="font-semibold text-dark-900">{r.komoditas}</span> },
    { key: "kebutuhan", header: `Kebutuhan (${factor}mg)`, align: "right", render: (r) => <span>{(r.kebutuhanMingguan * factor).toLocaleString("id-ID")} {r.satuan}</span> },
    { key: "stok", header: "Stok Saat Ini", align: "right", render: (r) => <span>{r.stokSaatIni.toLocaleString("id-ID")} {r.satuan}</span> },
    {
      key: "coverage",
      header: "Ketersediaan",
      render: (r) => {
        const pct = Math.min(100, Math.round((r.stokSaatIni / (r.kebutuhanMingguan * factor)) * 100));
        return <div className="w-32"><Progress value={pct} showLabel color={pct < 40 ? "red" : pct < 80 ? "amber" : "green"} /></div>;
      },
    },
    { key: "habis", header: "Proyeksi Habis", align: "center", render: (r) => <Badge color={parseInt(r.proyeksiHabis) <= 2 ? "red" : parseInt(r.proyeksiHabis) <= 4 ? "amber" : "green"} dot>{r.proyeksiHabis}</Badge> },
    { key: "perlu", header: "Perlu Dibeli", align: "right", render: (r) => <span className={cn("font-bold", need(r) > 0 ? "text-brand-600" : "text-gray-300")}>{need(r) > 0 ? `${need(r).toLocaleString("id-ID")} ${r.satuan}` : "Cukup"}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Perencanaan Kebutuhan"
        subtitle="Hitung kebutuhan bahan baku berdasarkan menu, porsi, dan ketersediaan stok"
        icon={ClipboardList}
        actions={
          <>
            <Select value={horizon} onChange={setHorizon} options={[{ value: "minggu", label: "1 Minggu" }, { value: "2minggu", label: "2 Minggu" }, { value: "bulan", label: "1 Bulan" }]} />
            <Button icon={ShoppingCart} onClick={() => { toast("Daftar pengadaan dibuat dari rencana kebutuhan."); navigate("/app/rantai-pasok/procurement"); }}>Buat Pengadaan</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Komoditas Direncanakan" value={requirementPlans.length} icon={ClipboardList} color="brand" />
        <StatCard label="Di Bawah Reorder Point" value={belowReorder.length} icon={AlertTriangle} color="red" sub="Perlu pengadaan" />
        <StatCard label="Stok Aman" value={requirementPlans.length - belowReorder.length} icon={CheckCircle2} color="green" />
        <StatCard label="Horizon Perencanaan" value={horizon === "minggu" ? "1 Minggu" : horizon === "2minggu" ? "2 Minggu" : "1 Bulan"} icon={Calculator} color="blue" />
      </div>

      {belowReorder.length > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <span className="p-2 bg-amber-100 text-amber-600 rounded-xl"><AlertTriangle size={20} /></span>
            <div className="flex-1">
              <p className="font-bold text-dark-900">{belowReorder.length} komoditas perlu segera dipesan ulang</p>
              <p className="text-sm text-gray-500 mt-0.5">{belowReorder.map((r) => r.komoditas).join(", ")} berada di bawah titik pemesanan ulang (reorder point).</p>
            </div>
            <Button size="sm" onClick={() => { toast("PO otomatis dibuat untuk seluruh item kritis."); navigate("/app/rantai-pasok/procurement"); }}>Pesan Otomatis</Button>
          </div>
        </Card>
      )}

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100">
          <SectionTitle>Rencana Kebutuhan Bahan Baku</SectionTitle>
        </div>
        <div className="p-2"><DataTable columns={columns} data={requirementPlans} /></div>
      </Card>
    </div>
  );
}
