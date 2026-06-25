import {
  LayoutDashboard,
  Truck,
  Wallet,
  UtensilsCrossed,
  FileText,
  Users,
  Database,
  Network,
  Settings,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/context/role-context";

/* ------------------------------------------------------------------ */
/* Navigation config (single source of truth for sidebar + routes)     */
/* ------------------------------------------------------------------ */
export type NavItem = {
  label: string;
  path: string;
  roles: Role[];
  badge?: string;
};
export type NavGroup = {
  label: string;
  icon: LucideIcon;
  roles: Role[];
  items: NavItem[];
};

const ALL: Role[] = ["pemerintah", "mitra", "sekolah", "sppg"];

export const NAV: NavGroup[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ALL,
    items: [{ label: "Ringkasan", path: "/app/dashboard", roles: ALL }],
  },
  {
    label: "AI Copilot",
    icon: Sparkles,
    roles: ALL,
    items: [{ label: "Pusat Insight AI", path: "/app/ai-copilot", roles: ALL, badge: "AI" }],
  },
  {
    label: "Distribusi & Dokumentasi",
    icon: Truck,
    roles: ["pemerintah", "sppg", "sekolah"],
    items: [
      { label: "Monitoring Proses", path: "/app/distribusi/monitoring", roles: ["pemerintah", "sppg", "sekolah"] },
      { label: "Driver & Kader", path: "/app/distribusi/driver-kader", roles: ["pemerintah", "sppg"] },
    ],
  },
  {
    label: "Manajemen Anggaran",
    icon: Wallet,
    roles: ["pemerintah", "sppg"],
    items: [{ label: "Rencana Belanja", path: "/app/anggaran/rencana-belanja", roles: ["pemerintah", "sppg"] }],
  },
  {
    label: "Rencana Menu & Gizi",
    icon: UtensilsCrossed,
    roles: ["pemerintah", "sppg"],
    items: [
      { label: "Rencana Menu", path: "/app/menu/rencana", roles: ["pemerintah", "sppg"] },
      { label: "Bahan Baku & Komposisi", path: "/app/menu/bahan-baku", roles: ["pemerintah", "sppg"] },
      { label: "Gramasi Gizi", path: "/app/menu/gramasi", roles: ["pemerintah", "sppg"] },
    ],
  },
  {
    label: "Laporan",
    icon: FileText,
    roles: ALL,
    items: [
      { label: "Ulasan", path: "/app/laporan/ulasan", roles: ALL },
      { label: "Laporan Operasional", path: "/app/laporan/operasional", roles: ["pemerintah", "sppg"] },
      { label: "Proposal Anggaran", path: "/app/laporan/proposal-anggaran", roles: ["pemerintah", "sppg"] },
    ],
  },
  {
    label: "Data Tim & Mitra MBG",
    icon: Users,
    roles: ["pemerintah", "sppg", "mitra"],
    items: [
      { label: "Mitra", path: "/app/data-tim/mitra", roles: ["pemerintah", "sppg"] },
      { label: "Penerima Manfaat", path: "/app/data-tim/penerima-manfaat", roles: ["pemerintah", "sppg", "sekolah"] },
      { label: "Tim Dapur", path: "/app/data-tim/tim-dapur", roles: ["pemerintah", "sppg"] },
      { label: "Supplier", path: "/app/data-tim/supplier", roles: ["pemerintah", "sppg", "mitra"] },
    ],
  },
  {
    label: "Manajemen Data",
    icon: Database,
    roles: ["pemerintah", "sppg", "mitra"],
    items: [
      { label: "Verifikasi Vendor (BGN)", path: "/app/manajemen-data/verifikasi-vendor", roles: ["pemerintah", "sppg", "mitra"], badge: "BGN" },
      { label: "Perizinan & Pengawasan", path: "/app/manajemen-data/dapur-sppg", roles: ["pemerintah", "sppg"] },
      { label: "Vendor", path: "/app/manajemen-data/vendor", roles: ["pemerintah", "sppg", "mitra"] },
    ],
  },
  {
    label: "Manajemen Rantai Pasok",
    icon: Network,
    roles: ["pemerintah", "sppg", "mitra"],
    items: [
      { label: "Perencanaan Kebutuhan", path: "/app/rantai-pasok/perencanaan", roles: ["pemerintah", "sppg"] },
      { label: "Procurement & Matching", path: "/app/rantai-pasok/procurement", roles: ["pemerintah", "sppg", "mitra"] },
      { label: "B2B Marketplace & RFQ", path: "/app/rantai-pasok/rfq", roles: ["pemerintah", "sppg", "mitra"], badge: "Baru" },
      { label: "Stok", path: "/app/rantai-pasok/stok", roles: ["pemerintah", "sppg", "mitra"] },
      { label: "Distribusi & Transport", path: "/app/rantai-pasok/distribusi", roles: ["pemerintah", "sppg"] },
      { label: "Analitik & Peramalan", path: "/app/rantai-pasok/analitik", roles: ["pemerintah", "sppg", "mitra"] },
    ],
  },
  {
    label: "Blockchain & Audit Trail",
    icon: ShieldCheck,
    roles: ALL,
    items: [
      { label: "Verifikasi On-Chain", path: "/app/blockchain/verifikasi", roles: ALL, badge: "Web3" },
    ],
  },
  {
    label: "Pengaturan",
    icon: Settings,
    roles: ALL,
    items: [
      { label: "Akun", path: "/app/pengaturan/akun", roles: ALL },
      { label: "Notifikasi", path: "/app/pengaturan/notifikasi", roles: ALL },
    ],
  },
];

/** Filter nav groups & items for a given role. */
export function navForRole(role: Role): NavGroup[] {
  return NAV.filter((g) => g.roles.includes(role))
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
}

/** Resolve the nav group + item for a given path (longest-prefix match). */
export function findNavByPath(path: string): { group: NavGroup; item: NavItem } | null {
  let best: { group: NavGroup; item: NavItem; len: number } | null = null;
  for (const group of NAV) {
    for (const item of group.items) {
      if (path === item.path || path.startsWith(item.path + "/") || path.startsWith(item.path)) {
        if (!best || item.path.length > best.len) {
          best = { group, item, len: item.path.length };
        }
      }
    }
  }
  return best ? { group: best.group, item: best.item } : null;
}
