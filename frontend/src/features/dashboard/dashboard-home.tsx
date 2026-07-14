import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Utensils,
  School,
  Truck,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Package,
  ArrowRight,
  ArrowUpRight,
  Star,
  ChefHat,
  Building2,
  Sparkles,
  ShieldCheck,
  Network,
  ClipboardCheck,
} from "lucide-react";
import {
  Card,
  StatCard,
  StatGrid,
  Badge,
  Progress,
  SectionTitle,
  formatRupiah,
} from "@/components/ui";
import { BarChart, DonutChart, LineChart } from "@/components/charts";
import { useRole, ROLES } from "@/context/role-context";
import { useState, useEffect } from "react";
import {
  distBatches as seedBatches,
  stockItems as seedStock,
  reviews as seedReviews,
  demandForecast as seedDemand,
  regionBalances as seedBalances,
  beneficiaries as seedBeneficiaries,
  type Beneficiary,
  type DistBatch,
  type RegionBalance,
  type Review,
  type StockItem,
} from "@/mocks/mbg-data";
import { getDistBatches } from "@/services/distribution-service";
import { getStockItems } from "@/services/stock-service";
import { getReviews } from "@/services/reviews-service";
import { getBeneficiaries } from "@/services/beneficiaries-service";
import {
  getDemandForecast,
  getRegionBalances,
  type DemandForecast,
} from "@/services/analytics-service";

/* Brand-aligned chart palette (primary = red). */
const CHART = {
  primary: "#dc2626",
  predicted: "#94a3b8",
  blue: "#3b82f6",
  amber: "#f59e0b",
  purple: "#a855f7",
};

/* Quick shortcuts to the most-used modules. */
const SHORTCUTS = [
  { label: "Monitoring", to: "/app/distribusi/monitoring", icon: Truck, color: "bg-brand-50 text-brand-600" },
  { label: "AI Copilot", to: "/app/ai-copilot", icon: Sparkles, color: "bg-purple-50 text-purple-600" },
  { label: "B2B & RFQ", to: "/app/rantai-pasok/rfq", icon: Network, color: "bg-blue-50 text-blue-600" },
  { label: "Verifikasi BGN", to: "/app/manajemen-data/verifikasi-vendor", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600" },
  { label: "Analitik", to: "/app/rantai-pasok/analitik", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  { label: "On-Chain", to: "/app/blockchain/verifikasi", icon: ClipboardCheck, color: "bg-gray-100 text-gray-700" },
];

export default function DashboardHome() {
  const { role } = useRole();
  const R = ROLES[role];

  const [distBatches, setBatches] = useState<DistBatch[]>(seedBatches);
  const [stockItems, setStock] = useState<StockItem[]>(seedStock);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(seedBeneficiaries);
  const [demandForecast, setDemand] = useState<DemandForecast>(seedDemand);
  const [regionBalances, setBalances] = useState<RegionBalance[]>(seedBalances);

  useEffect(() => {
    getDistBatches().then((rows) => rows.length && setBatches(rows));
    getStockItems().then((rows) => rows.length && setStock(rows));
    getReviews().then((rows) => rows.length && setReviews(rows));
    getBeneficiaries().then((rows) => rows.length && setBeneficiaries(rows));
    getDemandForecast().then(setDemand);
    getRegionBalances().then((rows) => rows.length && setBalances(rows));
  }, []);

  const totalPorsi = distBatches.reduce((a, b) => a + b.porsi, 0);
  const selesai = distBatches.filter((b) => b.stage === "selesai").length;
  const kritis = stockItems.filter((s) => s.status === "Kritis").length;
  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const totalSiswa = beneficiaries.reduce((a, b) => a + b.siswa, 0);

  // Role-specific stat configuration
  const statsByRole: Record<string, React.ReactNode> = {
    pemerintah: (
      <>
        <StatCard label="Porsi Terdistribusi Hari Ini" value={totalPorsi.toLocaleString("id-ID")} icon={Utensils} color="brand" trend={{ value: "5.2%", up: true }} sub="Target harian 2.750 porsi" />
        <StatCard label="Sekolah Penerima Aktif" value={beneficiaries.filter((b) => b.status === "Aktif").length} icon={School} color="blue" sub={`${totalSiswa.toLocaleString("id-ID")} siswa terlayani`} />
        <StatCard label="Realisasi Anggaran (Jun)" value={formatRupiah(1372000000)} icon={Wallet} color="purple" trend={{ value: "2%", up: false }} sub="98% dari pagu bulanan" />
        <StatCard label="Skor Kepuasan Nasional" value={`${avgRating}/5`} icon={Star} color="amber" trend={{ value: "0.3", up: true }} sub={`${reviews.length} ulasan minggu ini`} />
      </>
    ),
    sppg: (
      <>
        <StatCard label="Porsi Diproduksi Hari Ini" value={totalPorsi.toLocaleString("id-ID")} icon={ChefHat} color="brand" trend={{ value: "3%", up: true }} sub={`${selesai} batch selesai`} />
        <StatCard label="Batch Dalam Proses" value={distBatches.filter((b) => b.stage !== "selesai").length} icon={Truck} color="blue" sub="Pantau status real-time" />
        <StatCard label="Item Stok Kritis" value={kritis} icon={AlertTriangle} color="red" sub="Perlu pengadaan segera" />
        <StatCard label="Rating Dapur" value={`${avgRating}/5`} icon={Star} color="amber" sub={`${reviews.length} ulasan terbaru`} />
      </>
    ),
    mitra: (
      <>
        <StatCard label="PO Aktif" value={4} icon={Package} color="brand" sub="2 menunggu konfirmasi" />
        <StatCard label="Nilai Transaksi (Jun)" value={formatRupiah(36400000)} icon={Wallet} color="purple" trend={{ value: "8%", up: true }} sub="Akumulasi bulan berjalan" />
        <StatCard label="Rating Sebagai Supplier" value="4.8/5" icon={Star} color="amber" sub="Performa pengiriman 98%" />
        <StatCard label="Komoditas Dipasok" value={5} icon={Building2} color="blue" sub="Beras, sayur, protein" />
      </>
    ),
    sekolah: (
      <>
        <StatCard label="Porsi Diterima Hari Ini" value="450" icon={Utensils} color="brand" sub="SDN Menteng 01" />
        <StatCard label="Siswa Penerima" value="450" icon={School} color="blue" sub="100% kehadiran terlayani" />
        <StatCard label="Status Pengiriman" value="Dalam Perjalanan" icon={Truck} color="amber" sub="Estimasi tiba 07:10" />
        <StatCard label="Rating Anda Berikan" value="4.6/5" icon={Star} color="purple" sub="3 ulasan minggu ini" />
      </>
    ),
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Hero band */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-dark-900 text-white p-6 sm:p-8 mb-6"
      >
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistem aktif · {today}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat Datang, {R.label}
            </h1>
            <p className="text-gray-300 mt-2 text-sm max-w-xl">{R.desc}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/app/distribusi/monitoring">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-dark-900 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                <Truck size={17} /> Pantau Distribusi
              </button>
            </Link>
            <Link to="/app/ai-copilot">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-colors cursor-pointer ring-1 ring-white/15">
                <Sparkles size={17} /> Tanya AI
              </button>
            </Link>
          </div>
        </div>

        {/* quick shortcuts */}
        <div className="relative mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition-colors text-center"
            >
              <span className={`p-2 rounded-xl ${s.color}`}>
                <s.icon size={18} />
              </span>
              <span className="text-[11px] font-semibold text-gray-200 group-hover:text-white leading-tight">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* KPI cards */}
      <StatGrid>{statsByRole[role]}</StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <SectionTitle
              subtitle="Perbandingan distribusi aktual vs prediksi permintaan"
              action={<Badge color="green" dot>Live</Badge>}
            >
              Tren Distribusi Porsi (7 Hari)
            </SectionTitle>
            <LineChart
              labels={demandForecast.labels}
              series={[
                { name: "Aktual", values: demandForecast.actual.map((v) => v || NaN).map((v) => (isNaN(v) ? 0 : v)), color: CHART.primary },
                { name: "Prediksi", values: demandForecast.predicted, color: CHART.predicted },
              ]}
            />
          </Card>

          <Card>
            <SectionTitle
              action={
                <Link to="/app/distribusi/monitoring" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
                  Lihat Semua <ArrowRight size={14} />
                </Link>
              }
            >
              Distribusi Berjalan
            </SectionTitle>
            <div className="space-y-3">
              {distBatches.slice(0, 4).map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
                >
                  <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl shrink-0">
                    <Truck size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark-900 truncate">{b.sekolah}</p>
                    <p className="text-xs text-gray-400">{b.kode} · {b.porsi} porsi · {b.driver}</p>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <Progress value={b.progress} showLabel />
                  </div>
                  {b.stage === "selesai" ? (
                    <Badge color="green" dot>Selesai</Badge>
                  ) : b.stage === "transit" || b.stage === "tiba" ? (
                    <Badge color="blue" dot>Pengiriman</Badge>
                  ) : (
                    <Badge color="amber" dot>Produksi</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle subtitle="Output produksi harian per dapur SPPG">Produksi per Dapur (porsi/hari)</SectionTitle>
            <BarChart
              data={[
                { label: "Senen", value: 1610, highlight: true },
                { label: "Tebet", value: 1140 },
                { label: "Cikini", value: 720 },
                { label: "Manggarai", value: 410 },
              ]}
            />
          </Card>
        </div>

        {/* Right: composition + alerts */}
        <div className="space-y-6">
          <Card>
            <SectionTitle>Komposisi Anggaran Bahan</SectionTitle>
            <DonutChart
              centerLabel="Rp 28jt"
              centerSub="per hari"
              segments={[
                { label: "Protein", value: 42, color: CHART.primary },
                { label: "Karbohidrat", value: 23, color: CHART.blue },
                { label: "Sayur & Buah", value: 20, color: CHART.amber },
                { label: "Bumbu & Operasional", value: 15, color: CHART.purple },
              ]}
            />
          </Card>

          <Card>
            <SectionTitle
              action={
                <Link to="/app/rantai-pasok/stok" className="text-xs font-semibold text-brand-600 hover:underline">
                  Kelola
                </Link>
              }
            >
              Peringatan Stok
            </SectionTitle>
            <div className="space-y-2.5">
              {stockItems
                .filter((s) => s.status !== "Aman")
                .map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className={s.status === "Kritis" ? "text-red-500" : "text-amber-500"} size={16} />
                      <div>
                        <p className="text-sm font-semibold text-dark-900">{s.nama}</p>
                        <p className="text-xs text-gray-400">{s.jumlah} {s.satuan} · {s.gudang}</p>
                      </div>
                    </div>
                    <Badge color={s.status === "Kritis" ? "red" : "amber"}>{s.status}</Badge>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="bg-dark-900 text-white border-0 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-600/20 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-brand-500/20 rounded-lg">
                  <TrendingUp className="text-brand-400" size={16} />
                </span>
                <h3 className="font-bold">Rekomendasi AI</h3>
                <Badge color="brand">AI</Badge>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {regionBalances.find((r) => r.surplus < 0)?.region} mengalami defisit sayuran. Redistribusi
                dari <span className="text-brand-400 font-semibold">Bandung (surplus 4.200 kg)</span> dapat
                menghemat ±Rp 6,2 jt.
              </p>
              <Link to="/app/rantai-pasok/analitik">
                <button className="mt-4 w-full py-2.5 bg-white text-dark-900 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  Lihat Analitik <ArrowUpRight size={16} />
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom: recent reviews full width */}
      <Card className="mt-6">
        <SectionTitle action={<Link to="/app/laporan/ulasan" className="text-xs font-semibold text-brand-600 hover:underline">Semua Ulasan</Link>}>
          Ulasan Terbaru
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold text-dark-900 truncate">{r.sekolah}</p>
                <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">{r.komentar}</p>
              <div className="flex items-center gap-2 mt-2.5">
                <Badge color={r.tag === "Positif" ? "green" : r.tag === "Keluhan" ? "red" : "gray"}>{r.tag}</Badge>
                <span className="text-[11px] text-gray-400 truncate">{r.penilai}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1.5">
        <CheckCircle2 size={13} className="text-emerald-500" /> Data prototipe — semua angka bersifat ilustratif untuk demo frontend.
      </p>
    </div>
  );
}
