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
  Star,
  ChefHat,
  Building2,
} from "lucide-react";
import { Card, StatCard, PageHeader, Badge, Progress, Button, SectionTitle, formatRupiah } from "../ui";
import { BarChart, DonutChart, LineChart } from "../charts";
import { useRole, ROLES } from "../roles";
import {
  distBatches,
  stockItems,
  reviews,
  demandForecast,
  regionBalances,
  beneficiaries,
} from "../data";

export default function DashboardHome() {
  const { role } = useRole();
  const R = ROLES[role];

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

  return (
    <div>
      <PageHeader
        title={`Selamat Datang, ${R.label}`}
        subtitle={R.desc + " · " + new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        actions={
          <Link to="/app/distribusi/monitoring">
            <Button icon={Truck}>Pantau Distribusi</Button>
          </Link>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">{statsByRole[role]}</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <SectionTitle action={<Badge color="green" dot>Live</Badge>}>
              Tren Distribusi Porsi (7 Hari)
            </SectionTitle>
            <LineChart
              labels={demandForecast.labels}
              series={[
                { name: "Aktual", values: demandForecast.actual.map((v) => v || NaN).map((v) => (isNaN(v) ? 0 : v)), color: "#16a34a" },
                { name: "Prediksi", values: demandForecast.predicted, color: "#94a3b8" },
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
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
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
        </div>

        {/* Right: composition + alerts */}
        <div className="space-y-6">
          <Card>
            <SectionTitle>Komposisi Anggaran Bahan</SectionTitle>
            <DonutChart
              centerLabel="Rp 28jt"
              centerSub="per hari"
              segments={[
                { label: "Protein", value: 42, color: "#16a34a" },
                { label: "Karbohidrat", value: 23, color: "#3b82f6" },
                { label: "Sayur & Buah", value: 20, color: "#f59e0b" },
                { label: "Bumbu & Operasional", value: 15, color: "#a855f7" },
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

          <Card className="bg-dark-900 text-white border-0">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-brand-400" size={18} />
              <h3 className="font-bold">Rekomendasi AI</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {regionBalances.find((r) => r.surplus < 0)?.region} mengalami defisit sayuran. Redistribusi
              dari <span className="text-brand-400 font-semibold">Bandung (surplus 4.200 kg)</span> dapat
              menghemat ±Rp 6,2 jt.
            </p>
            <Link to="/app/rantai-pasok/analitik">
              <button className="mt-4 w-full py-2.5 bg-white text-dark-900 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                Lihat Analitik <ArrowRight size={16} />
              </button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Bottom: quality + production bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <SectionTitle>Produksi per Dapur (porsi/hari)</SectionTitle>
          <BarChart
            data={[
              { label: "Senen", value: 1610, highlight: true },
              { label: "Tebet", value: 1140 },
              { label: "Cikini", value: 720 },
              { label: "Manggarai", value: 410 },
            ]}
          />
        </Card>
        <Card>
          <SectionTitle action={<Link to="/app/laporan/ulasan" className="text-xs font-semibold text-brand-600 hover:underline">Semua Ulasan</Link>}>
            Ulasan Terbaru
          </SectionTitle>
          <div className="space-y-3">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-dark-900">{r.sekolah}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={13} className="fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{r.komentar}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge color={r.tag === "Positif" ? "green" : r.tag === "Keluhan" ? "red" : "gray"}>{r.tag}</Badge>
                  <span className="text-[11px] text-gray-400">{r.penilai}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1.5">
        <CheckCircle2 size={13} className="text-emerald-500" /> Data prototipe — semua angka bersifat ilustratif untuk demo frontend.
      </p>
    </div>
  );
}
