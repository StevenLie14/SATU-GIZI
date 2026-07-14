import { apiPost, listOrFallback, tryApi } from "@/services/api-client";
import { reviews, type Review } from "@/mocks/mbg-data";

interface ApiReview {
  id: string;
  penilai: string;
  rating: number;
  rasa: number;
  porsi: number;
  kebersihan: number;
  komentar: string | null;
  tanggal: string | null;
  tag: string;
  sekolah: string | null;
  school?: { name: string } | null;
}

const mapReview = (r: ApiReview): Review => ({
  id: r.id,
  sekolah: r.sekolah ?? r.school?.name ?? "—",
  penilai: r.penilai,
  rating: r.rating,
  rasa: r.rasa,
  porsi: r.porsi,
  kebersihan: r.kebersihan,
  komentar: r.komentar ?? "",
  tanggal: r.tanggal ?? "—",
  tag: r.tag as Review["tag"],
});

export const getReviews = () =>
  listOrFallback("/api/reviews", mapReview, reviews);

export const createReview = (r: Omit<Review, "id">) =>
  tryApi(() => apiPost<ApiReview>("/api/reviews", r));
