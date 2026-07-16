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

export const round1 = (km: number) => Math.round(km * 10) / 10;

/**
 * Centroid wilayah untuk data lokasi berbasis teks (Supplier.lokasi,
 * RegionBalance.region). Cukup untuk demo — bukan geocoding sungguhan.
 */
export const REGION_CENTROIDS: Record<string, LatLng> = {
  'Jakarta Pusat': { lat: -6.186, lng: 106.834 },
  'Jakarta Selatan': { lat: -6.261, lng: 106.811 },
  'Jakarta Utara': { lat: -6.121, lng: 106.774 },
  'Jakarta Barat': { lat: -6.168, lng: 106.758 },
  'Jakarta Timur': { lat: -6.225, lng: 106.9 },
  Bogor: { lat: -6.595, lng: 106.816 },
  Bandung: { lat: -6.914, lng: 107.609 },
  Karawang: { lat: -6.301, lng: 107.305 },
};

/** Lookup centroid: exact dulu, lalu case-insensitive / substring. */
export function regionCentroid(name: string): LatLng | null {
  if (!name) return null;
  if (REGION_CENTROIDS[name]) return REGION_CENTROIDS[name];
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(REGION_CENTROIDS)) {
    const k = key.toLowerCase();
    if (k === lower || lower.includes(k) || k.includes(lower)) return val;
  }
  return null;
}
