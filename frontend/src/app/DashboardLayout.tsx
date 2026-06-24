import { useState, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import Logo from "../assets/logo.jpg";
import { ROLES, navForRole, useRole, type Role } from "./roles";
import { cn } from "./ui";
import { notifications as seedNotifications } from "./data";

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useRole();
  const location = useLocation();
  const groups = useMemo(() => navForRole(role), [role]);

  // open the group that contains the current route by default
  const initialOpen = useMemo(() => {
    const map: Record<string, boolean> = {};
    groups.forEach((g) => {
      map[g.label] = g.items.some((i) => location.pathname.startsWith(i.path));
    });
    return map;
  }, [groups, location.pathname]);

  const [open, setOpen] = useState<Record<string, boolean>>(initialOpen);

  return (
    <div className="flex flex-col h-full bg-dark-900 text-gray-300">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10 shrink-0">
        <img src={Logo} alt="logo" className="h-8 w-8 rounded-lg object-cover" />
        <div className="leading-none">
          <span className="text-base font-bold text-white">SATU</span>
          <span className="text-base font-bold text-brand-500">GIZI</span>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">MBG Chain Platform</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {groups.map((g) => {
          const isOpen = open[g.label] ?? false;
          const hasActive = g.items.some((i) => location.pathname.startsWith(i.path));
          const single = g.items.length === 1;
          if (single) {
            const item = g.items[0];
            return (
              <NavLink
                key={g.label}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )
                }
              >
                <g.icon className="w-[18px] h-[18px] shrink-0" />
                {g.label}
              </NavLink>
            );
          }
          return (
            <div key={g.label}>
              <button
                onClick={() => setOpen((o) => ({ ...o, [g.label]: !isOpen }))}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                  hasActive ? "text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <g.icon className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1 text-left">{g.label}</span>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden ml-4 pl-3 border-l border-white/10 mt-1 space-y-0.5"
                  >
                    {g.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            "block px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                            isActive
                              ? "bg-brand-600/20 text-brand-400"
                              : "text-gray-400 hover:text-white hover:bg-white/5",
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Keluar ke Beranda
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Role switcher                                                       */
/* ------------------------------------------------------------------ */
function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const current = ROLES[role];
  const Icon = current.icon;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
          <Icon className="w-4 h-4" />
        </span>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] text-gray-400 font-medium leading-none">Masuk sebagai</p>
          <p className="text-xs font-bold text-dark-900 leading-tight mt-0.5">{current.label}</p>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-40"
            >
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-3 py-2">
                Ganti Perspektif Stakeholder
              </p>
              {(Object.keys(ROLES) as Role[]).map((r) => {
                const R = ROLES[r];
                const RIcon = R.icon;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer",
                      role === r ? "bg-brand-50" : "hover:bg-gray-50",
                    )}
                  >
                    <span className="p-1.5 bg-gray-100 text-gray-600 rounded-lg">
                      <RIcon className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark-900">{R.label}</p>
                      <p className="text-[11px] text-gray-400">{R.desc}</p>
                    </div>
                    {role === r && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notification bell                                                   */
/* ------------------------------------------------------------------ */
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unread = seedNotifications.filter((n) => !n.dibaca).length;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4 text-gray-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-sm text-dark-900">Notifikasi</p>
                <span className="text-[11px] text-brand-600 font-semibold">{unread} baru</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {seedNotifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors",
                      !n.dibaca && "bg-brand-50/30",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.dibaca && <span className="w-2 h-2 bg-brand-500 rounded-full mt-1.5 shrink-0" />}
                      <div className={cn(!n.dibaca ? "" : "ml-4")}>
                        <p className="text-xs font-semibold text-dark-900">{n.judul}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.pesan}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.waktu}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/app/pengaturan/notifikasi");
                }}
                className="w-full py-3 text-xs font-semibold text-brand-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Lihat Semua Notifikasi
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useRole();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 fixed inset-y-0 left-0 z-20">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-dark-900/50 backdrop-blur-sm"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-64 h-full"
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Cari sekolah, dapur, batch, supplier..."
              className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex-1 md:hidden" />

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden xl:inline-flex text-xs font-semibold text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">
              {ROLES[role].label} · Akses {role === "pemerintah" ? "Penuh" : "Terbatas"}
            </span>
            <NotificationBell />
            <RoleSwitcher />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* close button when mobile open is handled by overlay */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
