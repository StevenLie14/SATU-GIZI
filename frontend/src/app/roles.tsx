import { createContext, useContext, useState, type ReactNode } from "react";
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
  Building2,
  Landmark,
  School,
  ChefHat,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Roles                                                               */
/* ------------------------------------------------------------------ */
export type Role = "pemerintah" | "mitra" | "sekolah" | "sppg";

export const ROLES: Record<
  Role,
  { label: string; short: string; desc: string; icon: LucideIcon; color: string }
> = {
  pemerintah: {
    label: "Pemerintah",
    short: "Pemerintah",
    desc: "Supervisi & monitoring nasional",
    icon: Landmark,
    color: "blue",
  },
  sppg: {
    label: "SPPG / Dapur",
    short: "SPPG",
    desc: "Operasional dapur & produksi",
    icon: ChefHat,
    color: "brand",
  },
  mitra: {
    label: "Mitra MBG",
    short: "Mitra",
    desc: "Vendor & pemasok bahan baku",
    icon: Building2,
    color: "amber",
  },
  sekolah: {
    label: "Sekolah",
    short: "Sekolah",
    desc: "Penerima manfaat & ulasan",
    icon: School,
    color: "purple",
  },
};

/* ------------------------------------------------------------------ */
/* Navigation config (single source of truth)                          */
/* ------------------------------------------------------------------ */
export type NavItem = {
  label: string;
  path: string;
  roles: Role[];
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
    roles: ["pemerintah", "sppg"],
    items: [
      { label: "Dapur SPPG", path: "/app/manajemen-data/dapur-sppg", roles: ["pemerintah", "sppg"] },
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
      { label: "Stok", path: "/app/rantai-pasok/stok", roles: ["pemerintah", "sppg", "mitra"] },
      { label: "Distribusi & Transport", path: "/app/rantai-pasok/distribusi", roles: ["pemerintah", "sppg"] },
      { label: "Analitik & Peramalan", path: "/app/rantai-pasok/analitik", roles: ["pemerintah", "sppg", "mitra"] },
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

/* Filter nav for a given role */
export function navForRole(role: Role): NavGroup[] {
  return NAV.filter((g) => g.roles.includes(role))
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */
const RoleCtx = createContext<{ role: Role; setRole: (r: Role) => void }>({
  role: "pemerintah",
  setRole: () => {},
});

export function useRole() {
  return useContext(RoleCtx);
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(
    () => (localStorage.getItem("mbg_role") as Role) || "pemerintah",
  );
  const setRole = (r: Role) => {
    localStorage.setItem("mbg_role", r);
    setRoleState(r);
  };
  return <RoleCtx.Provider value={{ role, setRole }}>{children}</RoleCtx.Provider>;
}
