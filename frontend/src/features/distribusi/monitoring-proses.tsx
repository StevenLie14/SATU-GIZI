import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  ChefHat,
  Package,
  MapPin,
  CheckCircle2,
  Thermometer,
  Camera,
  FileText,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Tabs,
  Drawer,
  Progress,
  Select,
  SearchInput,
  useToast,
  cn,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { distBatches, type DistBatch, type DistStage } from "@/mocks/mbg-data";

const STAGES: { id: DistStage; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "produksi", label: "Produksi", icon: ChefHat },
  { id: "pengemasan", label: "Pengemasan", icon: Package },
  { id: "transit", label: "Transit", icon: Truck },
  { id: "tiba", label: "Tiba di Lokasi", icon: MapPin },
  { id: "selesai", label: "Selesai", icon: CheckCircle2 },
];

const stageIndex = (s: DistStage) => STAGES.findIndex((x) => x.id === s);

function StagePill({ stage }: { stage: DistStage }) {
  const map: Record<DistStage, { color: "amber" | "blue" | "green" | "brand"; label: string }> = {
    produksi: { color: "amber", label: "Produksi" },
    pengemasan: { color: "amber", label: "Pengemasan" },
    transit: { color: "blue", label: "Transit" },
    tiba: { color: "blue", label: "Tiba" },
    selesai: { color: "green", label: "Selesai" },
  };
  const m = map[stage];
  return <Badge color={m.color} dot>{m.label}</Badge>;
}

export default function MonitoringProses() {
  const { role } = useRole();
  const { toast } = useToast();
  const [batches, setBatches] = useState<DistBatch[]>(distBatches);
  const [tab, setTab] = useState("all");
  const [dapur, setDapur] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DistBatch | null>(null);

  const dapurOptions = useMemo(
    () => ["all", ...Array.from(new Set(distBatches.map((b) => b.dapur)))],
    [],
  );

  const filtered = batches.filter((b) => {
    if (tab === "active" && b.stage === "selesai") return false;
    if (tab === "done" && b.stage !== "selesai") return false;
    if (dapur !== "all" && b.dapur !== dapur) return false;
    if (query && !`${b.sekolah} ${b.kode} ${b.driver}`.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

  const advance = (b: DistBatch) => {
    const idx = stageIndex(b.stage);
    if (idx >= STAGES.length - 1) return;
    const next = STAGES[idx + 1].id;
    const updated = { ...b, stage: next, progress: Math.round(((idx + 2) / STAGES.length) * 100) };
    setBatches((prev) => prev.map((x) => (x.id === b.id ? updated : x)));
    setSelected(updated);
    toast(`${b.kode} → ${STAGES[idx + 1].label}`);
  };

  const confirmReceipt = (b: DistBatch) => {
    const updated = { ...b, stage: "selesai" as DistStage, progress: 100 };
    setBatches((prev) => prev.map((x) => (x.id === b.id ? updated : x)));
    setSelected(updated);
    toast("Penerimaan dikonfirmasi sekolah. Terima kasih!");
  };

  return (
    <div>
      <PageHeader
        title="Monitoring Proses Distribusi"
        subtitle="Pantau alur produksi hingga penerimaan makanan secara real-time"
        icon={Truck}
        actions={<Button icon={FileText} variant="outline" onClick={() => toast("Laporan distribusi diekspor (PDF).", "info")}>Ekspor Laporan</Button>}
      />

      {/* Pipeline summary */}
      <Card className="mb-6">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {STAGES.map((s, i) => {
            const count = batches.filter((b) => b.stage === s.id).length;
            return (
              <div key={s.id} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-1.5 px-3">
                  <div className="p-3 bg-gray-100 text-gray-600 rounded-2xl relative">
                    <s.icon size={20} />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">{s.label}</span>
                </div>
                {i < STAGES.length - 1 && <div className="w-8 sm:w-16 h-0.5 bg-gray-200 shrink-0" />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <Tabs
          tabs={[
            { id: "all", label: "Semua", count: batches.length },
            { id: "active", label: "Berjalan", count: batches.filter((b) => b.stage !== "selesai").length },
            { id: "done", label: "Selesai", count: batches.filter((b) => b.stage === "selesai").length },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="flex-1" />
        <SearchInput value={query} onChange={setQuery} placeholder="Cari batch / sekolah / driver" className="md:w-64" />
        <Select
          value={dapur}
          onChange={setDapur}
          options={dapurOptions.map((d) => ({ value: d, label: d === "all" ? "Semua Dapur" : d }))}
        />
      </div>

      {/* Batch cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" >
              <div onClick={() => setSelected(b)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-brand-600">{b.kode}</p>
                    <h3 className="font-bold text-dark-900 mt-0.5">{b.sekolah}</h3>
                  </div>
                  <StagePill stage={b.stage} />
                </div>
                <p className="text-sm text-gray-500 mb-3">{b.menu}</p>
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Package size={13} /> {b.porsi} porsi
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Truck size={13} /> {b.driver}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Thermometer size={13} /> {b.suhu}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={13} /> ETA {b.estimasi}
                  </div>
                </div>
                <Progress value={b.progress} showLabel color={b.stage === "selesai" ? "green" : "brand"} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detail drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.sekolah || ""}
        subtitle={selected ? `${selected.kode} · ${selected.porsi} porsi` : ""}
        footer={
          selected && selected.stage !== "selesai" ? (
            role === "sekolah" && (selected.stage === "tiba" || selected.stage === "transit") ? (
              <Button icon={CheckCircle2} className="flex-1" onClick={() => confirmReceipt(selected)}>
                Konfirmasi Penerimaan
              </Button>
            ) : (
              <>
                <Button variant="outline" icon={AlertCircle} onClick={() => toast("Laporan kendala dikirim ke koordinator.", "info")}>
                  Lapor Kendala
                </Button>
                <Button icon={Truck} className="flex-1" onClick={() => advance(selected)}>
                  Lanjut ke Tahap Berikutnya
                </Button>
              </>
            )
          ) : (
            <Badge color="green" dot>Distribusi Selesai</Badge>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            {/* Timeline */}
            <div>
              <h4 className="text-sm font-bold text-dark-900 mb-3">Alur Proses</h4>
              <div className="space-y-1">
                {STAGES.map((s, i) => {
                  const current = stageIndex(selected.stage);
                  const done = i < current;
                  const active = i === current;
                  return (
                    <div key={s.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            done && "bg-emerald-100 text-emerald-600",
                            active && "bg-brand-600 text-white",
                            !done && !active && "bg-gray-100 text-gray-400",
                          )}
                        >
                          <s.icon size={15} />
                        </div>
                        {i < STAGES.length - 1 && (
                          <div className={cn("w-0.5 h-8", done ? "bg-emerald-300" : "bg-gray-200")} />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className={cn("text-sm font-semibold", active ? "text-brand-600" : "text-dark-900")}>
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {done ? "Selesai" : active ? "Sedang berlangsung" : "Menunggu"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Temperature & logistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 flex items-center gap-1.5"><Thermometer size={13} /> Suhu Makanan</p>
                <p className="text-lg font-bold text-dark-900 mt-1">{selected.suhu}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 flex items-center gap-1.5"><Clock size={13} /> Estimasi Tiba</p>
                <p className="text-lg font-bold text-dark-900 mt-1">{selected.estimasi}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 flex items-center gap-1.5"><Truck size={13} /> Driver</p>
                <p className="text-sm font-bold text-dark-900 mt-1">{selected.driver}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 flex items-center gap-1.5"><ChefHat size={13} /> Dapur</p>
                <p className="text-sm font-bold text-dark-900 mt-1">{selected.dapur}</p>
              </div>
            </div>

            {/* Documentation */}
            <div>
              <h4 className="text-sm font-bold text-dark-900 mb-3">Dokumentasi</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Produksi", "Pengemasan", "Serah Terima"].map((label) => (
                  <div key={label} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-brand-300 hover:text-brand-500 cursor-pointer transition-colors" onClick={() => toast(`Unggah foto ${label}`, "info")}>
                    <Camera size={20} />
                    <span className="text-[10px] mt-1 text-center px-1">{label}</span>
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
