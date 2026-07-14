import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Scale,
  Activity,
  DollarSign,
  Map,
  Sparkles,
  Link2,
  Truck,
} from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  Tabs,
  Select,
  SectionTitle,
  useToast,
  formatRupiah,
  shortHash,
} from "@/components/ui";
import { LineChart } from "@/components/charts";
import {
  demandForecast as seedDemand,
  priceForecast as seedPrice,
  regionBalances as seedBalances,
  redistRecommendations as seedRedist,
  type RedistRec,
  type RegionBalance,
} from "@/mocks/mbg-data";
import {
  getDemandForecast,
  getPriceForecast,
  getRedistRecommendations,
  getRegionBalances,
  type DemandForecast,
  type PriceForecastRow,
} from "@/services/analytics-service";
import { anchorRecord, getAuditTrail } from "@/lib/blockchain";
import RouteOptimizerPanel from "@/features/rantai-pasok/route-optimizer-panel";

export default function AnalitikPeramalan() {
  const { toast } = useToast();
  const [tab, setTab] = useState("demand");
  const [komoditas, setKomoditas] = useState("Sayuran");
  const [demandForecast, setDemand] = useState<DemandForecast>(seedDemand);
  const [priceForecast, setPrice] = useState<PriceForecastRow[]>(seedPrice);
  const [regionBalances, setBalances] = useState<RegionBalance[]>(seedBalances);
  const [redistRecommendations, setRedist] = useState<RedistRec[]>(seedRedist);

  useEffect(() => {
    getDemandForecast().then(setDemand);
    getPriceForecast().then(setPrice);
    getRegionBalances().then(setBalances);
    getRedistRecommendations().then(setRedist);
  }, []);

  const maxAbs = Math.max(...regionBalances.map((r) => Math.abs(r.surplus)));

  return (
    <div>
      <PageHeader
        title="Analitik & Peramalan"
        subtitle="Demand forecasting, price forecasting, dan inter-regional balancing berbasis AI"
        icon={LineChartIcon}
        actions={<Button icon={Sparkles} onClick={() => toast("Model peramalan diperbarui dengan data terbaru.", "info")}>Perbarui Model</Button>}
      />

      <div className="mb-6">
        <Tabs
          tabs={[
            { id: "demand", label: "Demand Forecasting" },
            { id: "price", label: "Price Forecasting" },
            { id: "balancing", label: "Inter-Regional Balancing" },
            { id: "route", label: "Optimasi Rute" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {/* DEMAND */}
      {tab === "demand" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard label="Demand Hari Ini" value="12.100" icon={Activity} color="brand" sub="porsi" trend={{ value: "5.2%", up: true }} />
            <StatCard label="Prediksi Besok" value="12.300" icon={TrendingUp} color="blue" sub="porsi (+1.6%)" />
            <StatCard label="Akurasi Model" value="93%" icon={Scale} color="green" sub="MAPE 7%" />
            <StatCard label="Puncak Mingguan" value="Jumat" icon={Activity} color="purple" sub="12.300 porsi" />
          </div>
          <Card className="mb-6">
            <SectionTitle action={<Badge color="blue" dot>AI Forecast</Badge>}>Prediksi Permintaan Porsi (7 Hari)</SectionTitle>
            <LineChart
              labels={demandForecast.labels}
              series={[
                { name: "Aktual", values: demandForecast.actual.map((v) => v || 0), color: "#dc2626" },
                { name: "Prediksi", values: demandForecast.predicted, color: "#94a3b8" },
              ]}
              height={260}
            />
          </Card>
          <Card className="bg-brand-900 text-white border-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Rekomendasi Persiapan</h3>
                <p className="text-brand-200 text-sm max-w-xl">Permintaan diprediksi meningkat 1,6% besok. Tingkatkan produksi di SPPG Dapur Pusat Senen sebesar 200 porsi dan pastikan stok protein mencukupi.</p>
              </div>
              <Button className="bg-white text-brand-900 hover:bg-brand-50 shrink-0" onClick={() => toast("Rencana produksi disesuaikan dengan prediksi.")}>Sesuaikan Produksi</Button>
            </div>
          </Card>
        </div>
      )}

      {/* PRICE */}
      {tab === "price" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard label="Komoditas Dipantau" value={priceForecast.length} icon={DollarSign} color="brand" />
            <StatCard label="Diprediksi Naik" value={priceForecast.filter((p) => p.trend === "naik").length} icon={TrendingUp} color="red" />
            <StatCard label="Diprediksi Turun" value={priceForecast.filter((p) => p.trend === "turun").length} icon={TrendingDown} color="green" />
            <StatCard label="Akurasi Prediksi" value="85%" icon={Scale} color="blue" />
          </div>
          <Card padded={false}>
            <div className="p-4 border-b border-gray-100"><SectionTitle>Prediksi Harga Komoditas (7 Hari)</SectionTitle></div>
            <div className="divide-y divide-gray-50">
              {priceForecast.map((p, i) => {
                const delta = Math.round(((p.next - p.current) / p.current) * 1000) / 10;
                const TrendIcon = p.trend === "naik" ? TrendingUp : p.trend === "turun" ? TrendingDown : Minus;
                return (
                  <motion.div key={p.komoditas} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-dark-900">{p.komoditas}</p>
                      <p className="text-xs text-gray-400">Keyakinan model: {p.conf}%</p>
                    </div>
                    <div className="text-right mr-6 hidden sm:block">
                      <p className="text-xs text-gray-400">Saat ini</p>
                      <p className="font-semibold text-dark-900">{formatRupiah(p.current)}</p>
                    </div>
                    <div className="text-right mr-6">
                      <p className="text-xs text-gray-400">Prediksi</p>
                      <p className="font-semibold text-dark-900">{formatRupiah(p.next)}</p>
                    </div>
                    <Badge color={p.trend === "naik" ? "red" : p.trend === "turun" ? "green" : "gray"}>
                      <TrendIcon size={12} /> {delta > 0 ? "+" : ""}{delta}%
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </Card>
          <Card className="mt-6 bg-amber-50 border-amber-100">
            <div className="flex items-start gap-3">
              <span className="p-2 bg-amber-100 text-amber-600 rounded-xl"><TrendingUp size={20} /></span>
              <div>
                <p className="font-bold text-dark-900">Saran Pengadaan</p>
                <p className="text-sm text-gray-600 mt-0.5">Harga <b>Daging Ayam</b> diprediksi turun 3,9% — tunda pembelian besar. Sebaliknya, <b>Beras</b> & <b>Telur</b> akan naik — percepat pengadaan minggu ini.</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* BALANCING */}
      {tab === "balancing" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">Keseimbangan surplus & defisit antar wilayah untuk redistribusi optimal.</p>
            <Select value={komoditas} onChange={setKomoditas} options={[{ value: "Sayuran", label: "Sayuran" }, { value: "Beras", label: "Beras" }, { value: "Protein", label: "Protein" }]} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard label="Wilayah Surplus" value={regionBalances.filter((r) => r.surplus > 0).length} icon={TrendingUp} color="green" />
            <StatCard label="Wilayah Defisit" value={regionBalances.filter((r) => r.surplus < 0).length} icon={TrendingDown} color="red" />
            <StatCard label="Total Surplus" value={`${regionBalances.filter((r) => r.surplus > 0).reduce((a, r) => a + r.surplus, 0).toLocaleString("id-ID")} kg`} icon={Scale} color="blue" />
            <StatCard label="Potensi Penghematan" value="Rp 9,3 jt" icon={DollarSign} color="purple" sub="dari redistribusi" />
          </div>

          <Card className="mb-6">
            <SectionTitle>Neraca Surplus / Defisit per Wilayah — {komoditas}</SectionTitle>
            <div className="space-y-3 mt-2">
              {regionBalances.map((r, i) => (
                <motion.div key={r.region} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                  <span className="w-32 text-sm font-medium text-gray-600 shrink-0">{r.region}</span>
                  <div className="flex-1 flex items-center">
                    <div className="w-1/2 flex justify-end">
                      {r.surplus < 0 && (
                        <div className="bg-red-500 h-7 rounded-l-lg flex items-center justify-end pr-2" style={{ width: `${(Math.abs(r.surplus) / maxAbs) * 100}%` }}>
                          <span className="text-[10px] font-bold text-white whitespace-nowrap">{r.surplus.toLocaleString("id-ID")}</span>
                        </div>
                      )}
                    </div>
                    <div className="w-0.5 h-8 bg-gray-300" />
                    <div className="w-1/2">
                      {r.surplus > 0 && (
                        <div className="bg-emerald-500 h-7 rounded-r-lg flex items-center pl-2" style={{ width: `${(r.surplus / maxAbs) * 100}%` }}>
                          <span className="text-[10px] font-bold text-white whitespace-nowrap">+{r.surplus.toLocaleString("id-ID")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-5 pt-4 border-t border-gray-50">
              <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 bg-red-500 rounded" /> Defisit</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 bg-emerald-500 rounded" /> Surplus</span>
            </div>
          </Card>

          <SectionTitle>Rekomendasi Redistribusi</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {redistRecommendations.map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <Badge color="green" dot>Direkomendasikan</Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Map size={12} /> {rec.jarak}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-center p-3 bg-emerald-50 rounded-xl">
                      <p className="text-[10px] text-emerald-600 uppercase font-bold">Surplus</p>
                      <p className="font-bold text-dark-900">{rec.from}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowRight className="text-brand-600" size={20} />
                      <span className="text-[10px] font-bold text-brand-600 mt-1">{rec.jumlah.toLocaleString("id-ID")} {rec.satuan}</span>
                    </div>
                    <div className="flex-1 text-center p-3 bg-red-50 rounded-xl">
                      <p className="text-[10px] text-red-600 uppercase font-bold">Defisit</p>
                      <p className="font-bold text-dark-900">{rec.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="text-sm text-gray-500">Estimasi penghematan</span>
                    <span className="font-bold text-emerald-600">{rec.hemat}</span>
                  </div>
                  <Button className="w-full mt-3" icon={ArrowRight} onClick={() => { const r = anchorRecord("RedistributionLedger", "proposeTransfer", `${rec.from} → ${rec.to}`); toast(`Redistribusi dijadwalkan & dicatat on-chain ${r.txHash.slice(0, 10)}…`); }}>Jadwalkan & Catat On-Chain</Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* On-chain stock transfer monitoring */}
          <div className="mt-8">
            <SectionTitle action={<Badge color="blue" dot>RedistributionLedger</Badge>}>Monitoring Transfer Stok (On-Chain)</SectionTitle>
            <Card padded={false}>
              <div className="divide-y divide-gray-50">
                {getAuditTrail().filter((t) => t.contract === "RedistributionLedger").map((t) => (
                  <div key={t.txHash} className="flex items-center gap-3 p-4">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0"><Truck size={16} /></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark-900 truncate">{t.summary}</p>
                      <p className="text-[11px] text-gray-400 font-mono flex items-center gap-1"><Link2 size={10} /> {shortHash(t.txHash, 8, 6)} · block #{t.blockNumber.toLocaleString("id-ID")}</p>
                    </div>
                    <Badge color={t.status === "confirmed" ? "green" : "amber"} dot>{t.status === "confirmed" ? "Terkonfirmasi" : "Pending"}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "route" && <RouteOptimizerPanel />}
    </div>
  );
}
