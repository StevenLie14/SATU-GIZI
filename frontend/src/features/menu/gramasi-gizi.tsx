import { useState, useEffect } from "react";
import { Scale, Beef, Wheat, Droplet, Leaf, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  PageHeader,
  Card,
  Badge,
  Select,
  SectionTitle,
  Progress,
  DataTable,
  cn,
  type Column,
} from "@/components/ui";
import { BarChart } from "@/components/charts";
import { nutritionTargets, type NutritionRow } from "@/mocks/mbg-data";
import { getNutritionTargets } from "@/services/nutrition-service";

export default function GramasiGizi() {
  const [targets, setTargets] = useState<NutritionRow[]>(nutritionTargets);
  const [kelompok, setKelompok] = useState(nutritionTargets[1].id);
  useEffect(() => {
    getNutritionTargets().then((rows) => {
      if (rows.length) {
        setTargets(rows);
        setKelompok((prev) => (rows.some((r) => r.id === prev) ? prev : rows[0].id));
      }
    });
  }, []);
  const active = targets.find((n) => n.id === kelompok) ?? targets[0];

  const compliance = Math.round((active.realisasiEnergi / active.energi) * 100);
  const macros = [
    { label: "Protein", value: active.protein, unit: "g", icon: Beef, color: "brand" as const, pct: Math.round((active.protein * 4 / active.energi) * 100) },
    { label: "Karbohidrat", value: active.karbohidrat, unit: "g", icon: Wheat, color: "blue" as const, pct: Math.round((active.karbohidrat * 4 / active.energi) * 100) },
    { label: "Lemak", value: active.lemak, unit: "g", icon: Droplet, color: "amber" as const, pct: Math.round((active.lemak * 9 / active.energi) * 100) },
    { label: "Serat", value: active.serat, unit: "g", icon: Leaf, color: "green" as const, pct: 0 },
  ];

  const columns: Column<NutritionRow>[] = [
    { key: "kelompok", header: "Kelompok Usia", render: (n) => <span className="font-semibold text-dark-900">{n.kelompok}</span> },
    { key: "energi", header: "Energi (kkal)", align: "right", render: (n) => <span>{n.energi}</span> },
    { key: "protein", header: "Protein (g)", align: "right" },
    { key: "lemak", header: "Lemak (g)", align: "right" },
    { key: "karbohidrat", header: "Karbo (g)", align: "right" },
    { key: "serat", header: "Serat (g)", align: "right" },
    {
      key: "realisasi",
      header: "Realisasi",
      align: "center",
      render: (n) => {
        const c = Math.round((n.realisasiEnergi / n.energi) * 100);
        const ok = c >= 95 && c <= 110;
        return <Badge color={ok ? "green" : c < 95 ? "amber" : "red"}>{c}% AKG</Badge>;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gramasi Gizi"
        subtitle="Standar gramasi & pemenuhan Angka Kecukupan Gizi (AKG) per kelompok usia"
        icon={Scale}
        actions={
          <Select
            value={kelompok}
            onChange={setKelompok}
            options={targets.map((n) => ({ value: n.id, label: n.kelompok }))}
          />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <SectionTitle>Pemenuhan AKG — {active.kelompok}</SectionTitle>
          <div className="flex flex-col items-center py-4">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 -rotate-90">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                <circle
                  cx="80" cy="80" r="68" fill="none"
                  stroke={compliance >= 95 && compliance <= 110 ? "#16a34a" : compliance < 95 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${(Math.min(compliance, 100) / 100) * 2 * Math.PI * 68} ${2 * Math.PI * 68}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-dark-900">{compliance}%</span>
                <span className="text-xs text-gray-400">dari target AKG</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {compliance >= 95 && compliance <= 110 ? (
                <><CheckCircle2 className="text-emerald-500" size={18} /> <span className="text-sm font-semibold text-emerald-600">Sesuai Standar Gizi</span></>
              ) : (
                <><AlertTriangle className="text-amber-500" size={18} /> <span className="text-sm font-semibold text-amber-600">{compliance < 95 ? "Di Bawah Target" : "Melebihi Target"}</span></>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Target {active.energi} kkal · Realisasi {active.realisasiEnergi} kkal</p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle>Komposisi Makronutrien per Porsi</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {macros.map((m) => (
              <div key={m.label} className="p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("p-2 rounded-lg", m.color === "brand" && "bg-brand-50 text-brand-600", m.color === "blue" && "bg-blue-50 text-blue-600", m.color === "amber" && "bg-amber-50 text-amber-600", m.color === "green" && "bg-emerald-50 text-emerald-600")}>
                    <m.icon size={16} />
                  </span>
                  <span className="text-sm font-semibold text-gray-600">{m.label}</span>
                </div>
                <p className="text-2xl font-bold text-dark-900">{m.value}<span className="text-sm text-gray-400 ml-1">{m.unit}</span></p>
                {m.pct > 0 && (
                  <div className="mt-2">
                    <p className="text-[11px] text-gray-400 mb-1">{m.pct}% dari total energi</p>
                    <Progress value={m.pct} color={m.color} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <SectionTitle>Perbandingan Target Energi Antar Kelompok (kkal)</SectionTitle>
        <BarChart
          unit=" kkal"
          data={targets.map((n) => ({
            label: n.kelompok.split(" ")[0] + (n.kelompok.includes("Kelas") ? " " + n.kelompok.split(" ")[2] : ""),
            value: n.energi,
            highlight: n.id === kelompok,
          }))}
        />
      </Card>

      <Card padded={false}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-dark-900">Tabel Standar Gramasi Gizi (per porsi)</h2>
          <p className="text-xs text-gray-400 mt-0.5">Mengacu pada Angka Kecukupan Gizi (AKG) Kemenkes</p>
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={targets} />
        </div>
      </Card>
    </div>
  );
}
