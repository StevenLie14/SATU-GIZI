import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Zap,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  Factory,
  ChefHat,
  ArrowRightLeft,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import { Card, Badge, Button, SearchInput, SectionTitle, cn } from "@/components/ui";
import RouteMap, { type MapNode, type MapLink } from "@/components/common/route-map";
import { getEntities } from "@/services/entities-service";
import { buildMatches, formatKm, formatEta, type VendorMatch, type RiskLevel } from "@/lib/geo";
import type { GeoEntity } from "@/types";

const COMMODITIES = ["Beras", "Sayur", "Daging", "Ayam", "Telur", "Buah"];

const RISK_COLOR: Record<RiskLevel, "green" | "amber" | "red"> = {
  Rendah: "green",
  Sedang: "amber",
  Tinggi: "red",
};

const PRICE_TREND = [
  { label: "Beras Medium", price: "Rp 14.200", trend: "down" as const, val: "-2,4%" },
  { label: "Daging Ayam", price: "Rp 38.500", trend: "up" as const, val: "+5,1%" },
  { label: "Telur Ayam", price: "Rp 27.000", trend: "flat" as const, val: "0,0%" },
];

function ScoreRing({ score }: { score: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const color = score >= 85 ? "#16a34a" : score >= 70 ? "#d97706" : "#dc2626";
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-dark-900">{score}</span>
        <span className="text-[8px] text-gray-400 font-semibold -mt-0.5">SKOR</span>
      </div>
    </div>
  );
}

/**
 * Geographic B2B matchmaking between dapur/SPPG and vendors. Embeddable panel
 * used inside the Procurement page (consolidated from the former standalone page).
 */
export default function MatchmakingPanel() {
  const [entities, setEntities] = useState<GeoEntity[]>([]);
  const [radiusKm, setRadiusKm] = useState(30);
  const [minRating, setMinRating] = useState(0);
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [ran, setRan] = useState(true);

  useEffect(() => {
    getEntities().then(setEntities);
  }, []);

  const matches = useMemo(() => {
    if (!ran) return [];
    const all = buildMatches(entities, {
      maxRadiusKm: radiusKm,
      minRating,
      commodities: selectedCommodities,
      perKitchen: 3,
    });
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(
      (m) =>
        m.kitchen.name.toLowerCase().includes(q) ||
        m.vendor.name.toLowerCase().includes(q) ||
        m.commodities.some((c) => c.toLowerCase().includes(q)),
    );
  }, [entities, radiusKm, minRating, selectedCommodities, query, ran]);

  const topMatches = useMemo(() => matches.slice(0, 6), [matches]);

  const mapNodes: MapNode[] = useMemo(() => {
    const seen = new Set<string>();
    const nodes: MapNode[] = [];
    for (const m of topMatches) {
      if (!seen.has(m.kitchen.id)) {
        seen.add(m.kitchen.id);
        nodes.push({ id: m.kitchen.id, lat: m.kitchen.lat, lng: m.kitchen.lng, type: "kitchen", label: m.kitchen.name, sub: "Dapur / SPPG" });
      }
      if (!seen.has(m.vendor.id)) {
        seen.add(m.vendor.id);
        nodes.push({ id: m.vendor.id, lat: m.vendor.lat, lng: m.vendor.lng, type: "vendor", label: m.vendor.name, sub: `Vendor · ${m.commodities.slice(0, 2).join(", ")}` });
      }
    }
    return nodes;
  }, [topMatches]);

  const mapLinks: MapLink[] = useMemo(
    () =>
      topMatches.map((m) => ({
        from: [m.kitchen.lat, m.kitchen.lng] as [number, number],
        to: [m.vendor.lat, m.vendor.lng] as [number, number],
        color: m.score >= 85 ? "#16a34a" : m.score >= 70 ? "#d97706" : "#dc2626",
        label: `${m.kitchen.name} ↔ ${m.vendor.name} · skor ${m.score} · ${formatKm(m.distanceKm)}`,
      })),
    [topMatches],
  );

  const toggleCommodity = (c: string) =>
    setSelectedCommodities((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const runMatch = () => {
    setIsMatching(true);
    setRan(false);
    setTimeout(() => {
      setIsMatching(false);
      setRan(true);
    }, 1400);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <p className="text-sm text-gray-500 max-w-xl">
          Penjodohan dapur ↔ vendor berbasis jarak logistik, rating kemitraan, dan riwayat audit.
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari dapur / vendor / komoditas" className="flex-1 sm:w-60" />
          <Button icon={Zap} onClick={runMatch}>Smart Match</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <div className="lg:col-span-1 space-y-5">
          <Card>
            <SectionTitle><span className="flex items-center gap-2"><SlidersHorizontal size={16} className="text-brand-600" /> Filter Cerdas</span></SectionTitle>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                  <span>Radius Distribusi</span>
                  <span className="text-brand-600">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(+e.target.value)}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">Minimum Rating</p>
                <div className="flex gap-2">
                  {[0, 4, 4.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setMinRating(s)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                        minRating === s
                          ? "bg-brand-50 border-brand-200 text-brand-700"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50",
                      )}
                    >
                      {s === 0 ? "Semua" : `${s}★`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">Jenis Komoditas</p>
                <div className="flex flex-wrap gap-2">
                  {COMMODITIES.map((c) => {
                    const on = selectedCommodities.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCommodity(c)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                          on
                            ? "bg-brand-600 text-white border-brand-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle><span className="flex items-center gap-2"><BarChart3 size={16} className="text-blue-600" /> Prediksi Harga</span></SectionTitle>
            <div className="space-y-2.5">
              {PRICE_TREND.map((p) => (
                <div key={p.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{p.label}</p>
                    <p className="text-sm font-bold text-dark-900">{p.price}</p>
                  </div>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-bold",
                    p.trend === "up" ? "text-red-500" : p.trend === "down" ? "text-emerald-600" : "text-gray-400",
                  )}>
                    {p.trend === "up" ? <TrendingUp size={13} /> : p.trend === "down" ? <TrendingDown size={13} /> : null}
                    {p.val}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main: map + matches */}
        <div className="lg:col-span-3 space-y-6">
          <Card padded={false} className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <SectionTitle>Peta Penjodohan Terdekat</SectionTitle>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand-600" /> Dapur</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Vendor</span>
              </div>
            </div>
            {mapNodes.length > 0 ? (
              <RouteMap nodes={mapNodes} links={mapLinks} height={360} />
            ) : (
              <div className="h-[360px] flex items-center justify-center text-sm text-gray-400">
                {isMatching ? "Menjalankan algoritma…" : "Tidak ada kecocokan untuk filter ini."}
              </div>
            )}
          </Card>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-dark-900 flex items-center gap-2">
              <Handshake className="text-brand-600" size={20} /> Rekomendasi Penjodohan
            </h2>
            {ran && !isMatching && <Badge color="green" dot>{matches.length} kecocokan</Badge>}
          </div>

          {isMatching ? (
            <Card className="py-16">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute inset-0 border-4 border-brand-100 rounded-full animate-ping" />
                  <div className="absolute inset-0 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-brand-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-dark-900">Menjalankan algoritma matchmaking…</h3>
                <p className="text-gray-500 text-sm mt-1">Menganalisis jarak, rating &amp; audit vendor di sekitar dapur.</p>
              </div>
            </Card>
          ) : matches.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-sm text-gray-500">Tidak ada vendor yang cocok. Perlebar radius atau longgarkan filter.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {matches.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match: m, index }: { match: VendorMatch; index: number }) {
  const [connected, setConnected] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card hover className="overflow-hidden" padded={false}>
        <div className="p-5 flex flex-col md:flex-row items-center gap-5">
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="p-2 bg-brand-50 text-brand-600 rounded-lg"><ChefHat size={16} /></span>
              <span className="text-[10px] font-bold text-brand-600 tracking-wider uppercase">Dapur / SPPG</span>
            </div>
            <h3 className="font-bold text-dark-900">{m.kitchen.name}</h3>
            <p className="text-xs text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-0.5">
              <MapPin size={12} /> {m.kitchen.address}
            </p>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <ScoreRing score={m.score} />
            <ArrowRightLeft size={16} className="text-brand-400 mt-2" />
          </div>

          <div className="flex-1 w-full text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase">Vendor Pemasok</span>
              <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Factory size={16} /></span>
            </div>
            <h3 className="font-bold text-dark-900">{m.vendor.name}</h3>
            <div className="flex items-center justify-center md:justify-end gap-3 mt-0.5">
              <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={12} /> {m.vendor.address.split(",")[0]}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500"><Star size={12} className="fill-current" /> {m.rating}</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {formatKm(m.distanceKm)}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {formatEta(m.etaMin)}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-gray-400" /> Audit {m.auditScore}%</span>
            <span className="flex items-center gap-1.5">Risiko: <Badge color={RISK_COLOR[m.risk]}>{m.risk}</Badge></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] font-semibold text-gray-400 max-w-[160px] truncate">
              {m.commodities.join(", ")}
            </span>
            <Button
              size="sm"
              variant={connected ? "subtle" : "primary"}
              icon={connected ? CheckCircle2 : Handshake}
              onClick={() => setConnected((v) => !v)}
            >
              {connected ? "Terkoneksi" : "Hubungkan"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
