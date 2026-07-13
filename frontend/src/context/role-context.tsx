import { createContext, useContext, useState, type ReactNode } from "react";
import { Landmark, ChefHat, Building2, School, type LucideIcon } from "lucide-react";
import { getCookie, setCookie } from "@/lib/session";

/* ------------------------------------------------------------------ */
/* Stakeholder roles                                                   */
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

const RoleCtx = createContext<{ role: Role; setRole: (r: Role) => void }>({
  role: "pemerintah",
  setRole: () => {},
});

export function useRole() {
  return useContext(RoleCtx);
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(
    () => (getCookie("mbg_role") as Role) || "pemerintah"
  );
  const setRole = (r: Role) => {
    setCookie("mbg_role", r, 7);
    setRoleState(r);
  };
  return <RoleCtx.Provider value={{ role, setRole }}>{children}</RoleCtx.Provider>;
}
