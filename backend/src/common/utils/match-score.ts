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

/**
 * Weighted supplier-match score (price, distance, rating, lead time, reliability).
 * Mirrors the frontend AI engine so scores are consistent end-to-end.
 */
export function scoreSupplierMatch(i: MatchInput): MatchResult {
  const priceScore = Math.max(0, 100 - (i.priceIndex - 90));
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
  if (i.distanceKm <= 10) reasons.push('Lokasi sangat dekat');
  else if (i.distanceKm > 80) reasons.push('Jarak jauh menambah biaya logistik');
  if (i.rating >= 4.7) reasons.push('Rating performa sangat tinggi');
  if (i.leadTimeDays <= 1) reasons.push('Lead time cepat (≤1 hari)');

  return { score: Math.min(100, score), reasons };
}
