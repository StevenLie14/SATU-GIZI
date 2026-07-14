import { apiPatch, listOrFallback, tryApi } from "@/services/api-client";
import { notifications, type AppNotification } from "@/mocks/mbg-data";

interface ApiNotification {
  id: string;
  judul: string;
  pesan: string;
  kategori: string;
  dibaca: boolean;
  createdAt: string;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

const mapNotification = (r: ApiNotification): AppNotification => ({
  id: r.id,
  judul: r.judul,
  pesan: r.pesan,
  waktu: relativeTime(r.createdAt),
  kategori: (r.kategori as AppNotification["kategori"]) ?? "Sistem",
  dibaca: r.dibaca,
});

export const getNotifications = () =>
  listOrFallback("/api/notifications", mapNotification, notifications);

export const markNotificationRead = (id: string) =>
  tryApi(() => apiPatch(`/api/notifications/${id}/read`));

export const markAllNotificationsRead = () =>
  tryApi(() => apiPatch(`/api/notifications/read-all`));
