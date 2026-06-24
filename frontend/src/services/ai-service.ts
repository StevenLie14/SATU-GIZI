/* ================================================================== */
/* MBG Copilot — lightweight, deterministic "AI" engine                */
/* Produces structured insights, forecasts, match scores & risk        */
/* assessments from local data so the app is fully functional offline.  */
/* The interfaces mirror what a real LLM/ML backend would return, so a  */
/* server can be swapped in later without touching the UI.              */
/* ================================================================== */
import {
  stockItems,
  requirementPlans,
  priceForecast,
  regionBalances,
  kitchens,
  reviews,
} from "@/mocks/mbg-data";
import type { Role } from "@/context/role-context";
import {
  ageLevels,
  foodNutrition,
  fallbackByKind,
  type Nutrients,
  type AgeLevel,
} from "@/mocks/nutrition-db";

export type AiSeverity = "info" | "success" | "warning" | "critical";

export interface AiInsight {
  id: string;
  module: string;
  title: string;
  detail: string;
  severity: AiSeverity;
  confidence: number; // 0-100
  action?: string;
  actionPath?: string;
}

/* ------------------------------------------------------------------ */
/* Insight generation                                                  */
/* ------------------------------------------------------------------ */
export function generateInsights(role: Role): AiInsight[] {
  const out: AiInsight[] = [];

  // Stock criticality
  stockItems
    .filter((s) => s.status !== "Aman")
    .forEach((s, i) =>
      out.push({
        id: `stock-${i}`,
        module: "Rantai Pasok",
        title: `Stok ${s.status.toLowerCase()}: ${s.nama}`,
        detail: `Tersisa ${s.jumlah.toLocaleString("id-ID")} ${s.satuan} di ${s.gudang}. Model memproyeksikan kebutuhan melebihi ketersediaan; segera buat pengadaan.`,
        severity: s.status === "Kritis" ? "critical" : "warning",
        confidence: 92,
        action: "Buat Pengadaan",
        actionPath: "/app/rantai-pasok/procurement",
      }),
    );

  // Reorder point
  requirementPlans
    .filter((r) => r.stokSaatIni <= r.reorderPoint)
    .slice(0, 2)
    .forEach((r, i) =>
      out.push({
        id: `reorder-${i}`,
        module: "Perencanaan",
        title: `${r.komoditas} mendekati titik pesan ulang`,
        detail: `Proyeksi habis dalam ${r.proyeksiHabis}. Disarankan memesan ±${Math.max(0, r.kebutuhanMingguan - r.stokSaatIni).toLocaleString("id-ID")} ${r.satuan}.`,
        severity: parseInt(r.proyeksiHabis) <= 2 ? "critical" : "warning",
        confidence: 88,
        action: "Lihat Perencanaan",
        actionPath: "/app/rantai-pasok/perencanaan",
      }),
    );

  // Price timing
  const naik = priceForecast.filter((p) => p.trend === "naik");
  const turun = priceForecast.filter((p) => p.trend === "turun");
  if (naik.length) {
    out.push({
      id: "price-up",
      module: "Procurement",
      title: `Harga ${naik.map((p) => p.komoditas).join(", ")} diprediksi naik`,
      detail: `Percepat pengadaan minggu ini untuk mengunci harga sebelum kenaikan rata-rata ${Math.round(naik.reduce((a, p) => a + (p.next - p.current) / p.current, 0) / naik.length * 100)}%.`,
      severity: "warning",
      confidence: 84,
      action: "Smart Matching",
      actionPath: "/app/rantai-pasok/procurement",
    });
  }
  if (turun.length) {
    out.push({
      id: "price-down",
      module: "Procurement",
      title: `Harga ${turun.map((p) => p.komoditas).join(", ")} diprediksi turun`,
      detail: `Tunda pembelian besar; potensi penghematan dengan menunggu 3-5 hari.`,
      severity: "success",
      confidence: 81,
    });
  }

  // Inter-regional balancing
  const deficit = regionBalances.filter((r) => r.surplus < 0);
  const surplus = regionBalances.filter((r) => r.surplus > 0).sort((a, b) => b.surplus - a.surplus)[0];
  if (deficit.length && surplus) {
    out.push({
      id: "redistribute",
      module: "Antarwilayah",
      title: `Defisit ${deficit[0].komoditas} di ${deficit[0].region}`,
      detail: `Redistribusi dari ${surplus.region} (surplus ${surplus.surplus.toLocaleString("id-ID")} kg) direkomendasikan untuk menyeimbangkan suplai nasional.`,
      severity: "warning",
      confidence: 90,
      action: "Lihat Rekomendasi",
      actionPath: "/app/rantai-pasok/analitik",
    });
  }

  // Compliance risk
  kitchens.forEach((k, i) => {
    const done = k.checklist.filter((c) => c.done).length;
    const pct = Math.round((done / k.checklist.length) * 100);
    if (k.izinStatus !== "Berlaku" || pct < 100) {
      out.push({
        id: `compliance-${i}`,
        module: "Perizinan",
        title: `Kepatuhan ${k.nama} perlu perhatian`,
        detail: `Status izin: ${k.izinStatus}. Checklist pengawasan ${pct}% (${done}/${k.checklist.length}). ${k.izinStatus !== "Berlaku" ? "Izin operasional belum dapat diterbitkan." : "Lengkapi audit berkala."}`,
        severity: k.izinStatus === "Kadaluarsa" ? "critical" : "warning",
        confidence: 95,
        action: "Buka Pengawasan",
        actionPath: "/app/manajemen-data/dapur-sppg",
      });
    }
  });

  // Sentiment from reviews
  const complaints = reviews.filter((r) => r.tag === "Keluhan");
  if (complaints.length) {
    out.push({
      id: "sentiment",
      module: "Kualitas",
      title: `${complaints.length} keluhan terdeteksi dari ulasan`,
      detail: `Analisis sentimen menyoroti isu pada ${complaints[0].sekolah}: "${complaints[0].komentar}". Disarankan tindak lanjut QC.`,
      severity: "warning",
      confidence: 79,
      action: "Lihat Ulasan",
      actionPath: "/app/laporan/ulasan",
    });
  } else {
    out.push({
      id: "sentiment-ok",
      module: "Kualitas",
      title: "Sentimen ulasan positif",
      detail: "Tidak ada keluhan signifikan minggu ini. Kepuasan penerima manfaat stabil di atas target.",
      severity: "success",
      confidence: 86,
    });
  }

  // Role-aware ordering: surface a relevant insight first.
  const priority: Record<Role, string> = {
    pemerintah: "Perizinan",
    sppg: "Rantai Pasok",
    mitra: "Procurement",
    sekolah: "Kualitas",
  };
  return out.sort((a, b) => {
    const ap = a.module === priority[role] ? -1 : 0;
    const bp = b.module === priority[role] ? -1 : 0;
    if (ap !== bp) return ap - bp;
    const sev = { critical: 0, warning: 1, info: 2, success: 3 };
    return sev[a.severity] - sev[b.severity];
  });
}

/* ------------------------------------------------------------------ */
/* Supplier match scoring (B2B matchmaking)                            */
/* ------------------------------------------------------------------ */
export interface MatchInput {
  priceIndex: number; // 100 = market avg, lower is cheaper
  distanceKm: number;
  rating: number; // 0-5
  leadTimeDays: number;
  reliability?: number; // 0-100
}
export interface MatchResult {
  score: number; // 0-100
  reasons: string[];
}

export function scoreSupplierMatch(i: MatchInput): MatchResult {
  const priceScore = Math.max(0, 100 - (i.priceIndex - 90)) ; // cheaper → higher
  const distScore = Math.max(0, 100 - i.distanceKm * 1.5);
  const ratingScore = (i.rating / 5) * 100;
  const leadScore = Math.max(0, 100 - i.leadTimeDays * 18);
  const reliability = i.reliability ?? 85;

  const score = Math.round(
    priceScore * 0.32 + distScore * 0.2 + ratingScore * 0.23 + leadScore * 0.15 + reliability * 0.1,
  );

  const reasons: string[] = [];
  if (i.priceIndex < 100) reasons.push(`Harga ${100 - i.priceIndex}% di bawah pasar`);
  else if (i.priceIndex > 105) reasons.push(`Harga ${i.priceIndex - 100}% di atas pasar`);
  if (i.distanceKm <= 10) reasons.push("Lokasi sangat dekat");
  else if (i.distanceKm > 80) reasons.push("Jarak jauh menambah biaya logistik");
  if (i.rating >= 4.7) reasons.push("Rating performa sangat tinggi");
  if (i.leadTimeDays <= 1) reasons.push("Lead time cepat (≤1 hari)");
  return { score: Math.min(100, score), reasons };
}

/* ------------------------------------------------------------------ */
/* Forecasting helpers (linear trend + moving average blend)           */
/* ------------------------------------------------------------------ */
export function forecastNext(series: number[], periods: number): number[] {
  const clean = series.filter((v) => v > 0);
  const n = clean.length;
  if (n < 2) return Array(periods).fill(clean[0] ?? 0);
  // simple linear regression
  const xs = clean.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = clean.reduce((a, b) => a + b, 0) / n;
  const slope =
    xs.reduce((acc, x, i) => acc + (x - meanX) * (clean[i] - meanY), 0) /
    xs.reduce((acc, x) => acc + (x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  return Array.from({ length: periods }, (_, k) => Math.round(intercept + slope * (n + k)));
}

/* ================================================================== */
/* AI Nutrition engine — per school level & age group                  */
/* ================================================================== */
export type MenuComponents = { menuUtama: string; lauk: string; sayur: string; buah: string };

const EMPTY: Nutrients = { energi: 0, protein: 0, lemak: 0, karbohidrat: 0, serat: 0 };
const addN = (a: Nutrients, b: Nutrients): Nutrients => ({
  energi: a.energi + b.energi,
  protein: a.protein + b.protein,
  lemak: a.lemak + b.lemak,
  karbohidrat: a.karbohidrat + b.karbohidrat,
  serat: a.serat + b.serat,
});

function lookup(name: string, kind: keyof typeof fallbackByKind): Nutrients {
  if (!name || name === "—") return EMPTY;
  return foodNutrition[name] ?? fallbackByKind[kind];
}

/** Detect the recommended per-meal nutrition target for a school level/age. */
export function nutritionTargetFor(level: AgeLevel): Nutrients {
  const f = level.mealFraction;
  return {
    energi: Math.round(level.akgHarian.energi * f),
    protein: Math.round(level.akgHarian.protein * f),
    lemak: Math.round(level.akgHarian.lemak * f),
    karbohidrat: Math.round(level.akgHarian.karbohidrat * f),
    serat: Math.round(level.akgHarian.serat * f),
  };
}

/** Estimate the nutrition delivered by a menu (sum of its components). */
export function estimateMenuNutrition(menu: MenuComponents): Nutrients {
  return [
    lookup(menu.menuUtama, "utama"),
    lookup(menu.lauk, "lauk"),
    lookup(menu.sayur, "sayur"),
    lookup(menu.buah, "buah"),
  ].reduce(addN, EMPTY);
}

export interface NutrientAdequacy {
  key: keyof Nutrients;
  label: string;
  unit: string;
  actual: number;
  target: number;
  pct: number;
  status: "kurang" | "ideal" | "berlebih";
}

export interface MenuAnalysis {
  totals: Nutrients;
  target: Nutrients;
  adequacy: NutrientAdequacy[];
  score: number; // 0-100 overall adequacy
  recommendations: string[];
}

const NUTRIENT_META: { key: keyof Nutrients; label: string; unit: string }[] = [
  { key: "energi", label: "Energi", unit: "kkal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "lemak", label: "Lemak", unit: "g" },
  { key: "karbohidrat", label: "Karbohidrat", unit: "g" },
  { key: "serat", label: "Serat", unit: "g" },
];

/** Analyse a menu against the AKG-derived target for a given age level. */
export function analyzeMenu(menu: MenuComponents, level: AgeLevel): MenuAnalysis {
  const totals = estimateMenuNutrition(menu);
  const target = nutritionTargetFor(level);

  const adequacy: NutrientAdequacy[] = NUTRIENT_META.map((m) => {
    const actual = Math.round(totals[m.key]);
    const tgt = target[m.key];
    const pct = tgt ? Math.round((actual / tgt) * 100) : 0;
    const status: NutrientAdequacy["status"] = pct < 90 ? "kurang" : pct > 115 ? "berlebih" : "ideal";
    return { key: m.key, label: m.label, unit: m.unit, actual, target: tgt, pct, status };
  });

  // Score = how close each nutrient is to 100% (penalise both deficit & excess).
  const score = Math.round(
    adequacy.reduce((acc, a) => acc + Math.max(0, 100 - Math.abs(100 - a.pct)), 0) / adequacy.length,
  );

  const recommendations: string[] = [];
  adequacy.forEach((a) => {
    if (a.status === "kurang") {
      const tip: Record<string, string> = {
        protein: "Tambah porsi lauk (ayam/telur/ikan) untuk menutup kebutuhan protein.",
        energi: "Tambah porsi karbohidrat (nasi) atau lauk berenergi.",
        serat: "Tambah sayur atau buah untuk memenuhi serat.",
        karbohidrat: "Tingkatkan porsi nasi/karbohidrat kompleks.",
        lemak: "Tambahkan sumber lemak sehat secukupnya.",
      };
      recommendations.push(`${a.label} baru ${a.pct}% dari target — ${tip[a.key as string] ?? ""}`);
    } else if (a.status === "berlebih" && (a.key === "lemak" || a.key === "energi")) {
      recommendations.push(`${a.label} ${a.pct}% (berlebih) — kurangi porsi gorengan/santan untuk ${level.label}.`);
    }
  });
  if (recommendations.length === 0) {
    recommendations.push(`Komposisi sudah seimbang & sesuai AKG ${level.label} (${level.ageRange}).`);
  }
  return { totals, target, adequacy, score, recommendations };
}

/** AI menu generator: pick components that best meet a level's target. */
export function generateMenuForLevel(level: AgeLevel): MenuComponents {
  const target = nutritionTargetFor(level);
  const pick = (kind: keyof typeof fallbackByKind, names: string[], by: keyof Nutrients, want: number) => {
    let best = names[0];
    let bestDiff = Infinity;
    names.forEach((n) => {
      const v = (foodNutrition[n] ?? fallbackByKind[kind])[by];
      const diff = Math.abs(v - want);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = n;
      }
    });
    return best;
  };
  const utamaList = ["Nasi Putih", "Nasi Uduk", "Nasi Goreng Gizi"];
  const laukList = ["Ayam Teriyaki", "Telur Balado", "Ikan Tongkol Suwir", "Daging Semur", "Ayam Suwir + Telur"];
  const sayurList = ["Tumis Buncis Wortel", "Cap Cay", "Tumis Kangkung", "Sayur Asem"];
  const buahList = ["Pisang", "Jeruk", "Pepaya", "Semangka", "Melon"];
  return {
    menuUtama: pick("utama", utamaList, "karbohidrat", target.karbohidrat * 0.6),
    lauk: pick("lauk", laukList, "protein", target.protein * 0.7),
    sayur: pick("sayur", sayurList, "serat", target.serat * 0.5),
    buah: pick("buah", buahList, "serat", target.serat * 0.3),
  };
}

export { ageLevels };
export type { AgeLevel, Nutrients };

/* ------------------------------------------------------------------ */
/* Natural-language summary                                            */
/* ------------------------------------------------------------------ */
export function summarize(insights: AiInsight[]): string {
  const crit = insights.filter((i) => i.severity === "critical").length;
  const warn = insights.filter((i) => i.severity === "warning").length;
  if (crit) return `${crit} isu kritis & ${warn} peringatan memerlukan tindakan. Prioritaskan pengadaan stok kritis dan kepatuhan perizinan.`;
  if (warn) return `${warn} peringatan terpantau. Operasional sehat namun ada peluang optimasi pengadaan & redistribusi.`;
  return "Seluruh indikator dalam kondisi baik. Tidak ada tindakan mendesak yang diperlukan.";
}
