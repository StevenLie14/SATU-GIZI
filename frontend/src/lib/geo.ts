import type { GeoEntity } from "@/types";

/* ------------------------------------------------------------------ */
/* Geospatial helpers — real distance math for the map features.       */
/* ------------------------------------------------------------------ */

export type LatLng = { lat: number; lng: number };

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two points in kilometres (Haversine). */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371; // earth radius km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Human-readable distance. */
export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Rough urban driving ETA (avg ~24 km/h incl. stops), floored at 3 min. */
export function etaMinutes(km: number): number {
  return Math.max(3, Math.round((km / 24) * 60));
}

export function formatEta(min: number): string {
  if (min < 60) return `${min} mnt`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} j ${m} mnt` : `${h} jam`;
}

/* ------------------------------------------------------------------ */
/* B2B vendor ↔ kitchen matchmaking                                    */
/* ------------------------------------------------------------------ */

export type RiskLevel = "Rendah" | "Sedang" | "Tinggi";

export interface VendorMatch {
  id: string;
  kitchen: GeoEntity;
  vendor: GeoEntity;
  distanceKm: number;
  etaMin: number;
  /** 0–100 composite match score. */
  score: number;
  rating: number;
  auditScore: number;
  commodities: string[];
  risk: RiskLevel;
}

export interface MatchOptions {
  /** only keep vendors within this radius of the kitchen (km) */
  maxRadiusKm?: number;
  /** minimum vendor rating */
  minRating?: number;
  /** require the vendor to supply at least one of these commodity keywords */
  commodities?: string[];
  /** how many top matches to keep per kitchen (0 = all) */
  perKitchen?: number;
}

function riskFor(rating: number, audit: number): RiskLevel {
  const blended = rating / 5 + audit / 100;
  if (blended >= 1.75) return "Rendah";
  if (blended >= 1.45) return "Sedang";
  return "Tinggi";
}

/**
 * Score a single kitchen→vendor pairing. Weighted by logistics distance (45%),
 * partnership rating (35%) and audit/compliance history (20%) — closer,
 * higher-rated, better-audited vendors rank first.
 */
export function scoreMatch(
  kitchen: GeoEntity,
  vendor: GeoEntity,
  maxRadiusKm = 30,
): VendorMatch {
  const distanceKm = haversineKm(kitchen, vendor);
  const distScore = Math.max(0, 1 - distanceKm / maxRadiusKm);
  const rating = vendor.rating ?? 4.2;
  const audit = vendor.auditScore ?? 80;
  const ratingScore = rating / 5;
  const auditScore = audit / 100;
  const score = Math.round((distScore * 0.45 + ratingScore * 0.35 + auditScore * 0.2) * 100);
  return {
    id: `${kitchen.id}-${vendor.id}`,
    kitchen,
    vendor,
    distanceKm,
    etaMin: etaMinutes(distanceKm),
    score,
    rating,
    auditScore: audit,
    commodities: vendor.commodities ?? [],
    risk: riskFor(rating, audit),
  };
}

/** Build a ranked list of kitchen↔vendor matches from raw entities. */
export function buildMatches(entities: GeoEntity[], opts: MatchOptions = {}): VendorMatch[] {
  const { maxRadiusKm = 30, minRating = 0, commodities = [], perKitchen = 0 } = opts;
  const kitchens = entities.filter((e) => e.type === "kitchen");
  const vendors = entities.filter((e) => e.type === "vendor");
  const wantCommodities = commodities.map((c) => c.toLowerCase());

  const out: VendorMatch[] = [];
  for (const kitchen of kitchens) {
    let candidates = vendors
      .map((v) => scoreMatch(kitchen, v, maxRadiusKm))
      .filter((m) => m.distanceKm <= maxRadiusKm)
      .filter((m) => m.rating >= minRating)
      .filter((m) =>
        wantCommodities.length === 0
          ? true
          : m.commodities.some((c) =>
              wantCommodities.some((w) => c.toLowerCase().includes(w)),
            ),
      )
      .sort((a, b) => b.score - a.score);
    if (perKitchen > 0) candidates = candidates.slice(0, perKitchen);
    out.push(...candidates);
  }
  return out.sort((a, b) => b.score - a.score);
}

/* ------------------------------------------------------------------ */
/* Delivery route optimisation (nearest-neighbour heuristic)           */
/* ------------------------------------------------------------------ */

export interface RouteLeg {
  from: GeoEntity;
  to: GeoEntity;
  distanceKm: number;
  etaMin: number;
}

export interface OptimizedRoute {
  origin: GeoEntity;
  order: GeoEntity[];
  legs: RouteLeg[];
  totalKm: number;
  totalMin: number;
  /** distance if stops were visited in their original (unoptimised) order */
  naiveKm: number;
  /** % distance saved vs. the naive order */
  savingPct: number;
}

/**
 * Order stops with a greedy nearest-neighbour tour starting at `origin`, and
 * compare against the naive (input-order) route to surface the saving.
 */
export function optimizeRoute(origin: GeoEntity, stops: GeoEntity[]): OptimizedRoute {
  const remaining = [...stops];
  const order: GeoEntity[] = [];
  const legs: RouteLeg[] = [];
  let current = origin;
  let totalKm = 0;

  while (remaining.length) {
    let bestIdx = 0;
    let bestD = Infinity;
    remaining.forEach((s, i) => {
      const d = haversineKm(current, s);
      if (d < bestD) {
        bestD = d;
        bestIdx = i;
      }
    });
    const next = remaining.splice(bestIdx, 1)[0];
    legs.push({ from: current, to: next, distanceKm: bestD, etaMin: etaMinutes(bestD) });
    totalKm += bestD;
    current = next;
    order.push(next);
  }

  let naiveKm = 0;
  let c: GeoEntity = origin;
  for (const s of stops) {
    naiveKm += haversineKm(c, s);
    c = s;
  }

  const savingPct = naiveKm > 0 ? Math.max(0, Math.round((1 - totalKm / naiveKm) * 100)) : 0;
  const totalMin = legs.reduce((a, l) => a + l.etaMin, 0);
  return { origin, order, legs, totalKm, totalMin, naiveKm, savingPct };
}

/** Nearest entity of a given type to a point (e.g. nearest kitchen to a school). */
export function nearestOfType(
  point: GeoEntity,
  entities: GeoEntity[],
  type: GeoEntity["type"],
): { entity: GeoEntity; distanceKm: number } | null {
  const candidates = entities.filter((e) => e.type === type && e.id !== point.id);
  if (!candidates.length) return null;
  let best = candidates[0];
  let bestD = haversineKm(point, best);
  for (const e of candidates.slice(1)) {
    const d = haversineKm(point, e);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return { entity: best, distanceKm: bestD };
}
