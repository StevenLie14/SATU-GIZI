import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* Re-export shared helpers so consumers can keep importing from "@/components/ui". */
export { cn } from "@/lib/cn";
export { formatRupiah, formatNumber, shortHash } from "@/lib/format";
export { useLocalState } from "@/hooks/use-local-state";

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
export function Card({
  children,
  className,
  padded = true,
  hover = false,
  accent,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  /** subtle lift on hover (use for clickable cards) */
  hover?: boolean;
  /** thin colored bar on the left edge */
  accent?: "brand" | "blue" | "amber" | "green" | "purple" | "red";
  onClick?: () => void;
}) {
  const accents: Record<string, string> = {
    brand: "before:bg-brand-500",
    blue: "before:bg-blue-500",
    amber: "before:bg-amber-500",
    green: "before:bg-emerald-500",
    purple: "before:bg-purple-500",
    red: "before:bg-red-500",
  };
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-white rounded-2xl border border-gray-200/80 shadow-sm",
        accent &&
          cn(
            "overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-1",
            accents[accent],
          ),
        hover &&
          "transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        padded && "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: ReactNode;
  /** small uppercase label shown above the title */
  eyebrow?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6"
    >
      <div className="flex items-start gap-3.5">
        {Icon && (
          <span className="p-2.5 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl shadow-sm shadow-brand-500/20 shrink-0">
            <Icon className="w-6 h-6" />
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600 mb-0.5">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold text-dark-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1 text-sm max-w-2xl">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */
const statColors: Record<string, string> = {
  brand: "bg-brand-50 text-brand-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  gray: "bg-gray-100 text-gray-600",
  red: "bg-red-50 text-red-600",
};

const statGlow: Record<string, string> = {
  brand: "from-brand-500/10",
  blue: "from-blue-500/10",
  amber: "from-amber-500/10",
  green: "from-emerald-500/10",
  purple: "from-purple-500/10",
  gray: "from-gray-400/10",
  red: "from-red-500/10",
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = "brand",
  trend,
  onClick,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ size?: number }>;
  color?: keyof typeof statColors;
  trend?: { value: string; up: boolean };
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      hover={!!onClick}
      className="group relative overflow-hidden"
    >
      {/* decorative corner glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br to-transparent blur-2xl opacity-70",
          statGlow[color],
        )}
      />
      <div className="relative flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-105", statColors[color])}>
          <Icon size={22} />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
              trend.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
            )}
          >
            {trend.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="relative text-2xl font-bold text-dark-900 tracking-tight">{value}</p>
      <p className="relative text-sm font-medium text-gray-500 mt-1">{label}</p>
      {sub && <p className="relative text-xs text-gray-400 mt-2">{sub}</p>}
    </Card>
  );
}

/** Consistent responsive grid for KPI/stat cards. */
export function StatGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */
type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "dark" | "outline" | "ghost" | "danger" | "subtle";
  size?: "sm" | "md";
  icon?: React.ComponentType<{ size?: number }>;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  className,
  type = "button",
  disabled,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 active:scale-[0.98]",
    dark: "bg-dark-900 text-white hover:bg-dark-800 shadow-sm active:scale-[0.98]",
    outline: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98]",
    subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm" };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {Icon && <Icon size={size === "sm" ? 15 : 17} />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Badge / status pill                                                 */
/* ------------------------------------------------------------------ */
const badgeVariants: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  red: "bg-red-50 text-red-700 border-red-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
};

export function Badge({
  children,
  color = "gray",
  dot = false,
}: {
  children: ReactNode;
  color?: keyof typeof badgeVariants;
  dot?: boolean;
}) {
  const dotColor: Record<string, string> = {
    green: "bg-emerald-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    gray: "bg-gray-400",
    brand: "bg-brand-500",
    purple: "bg-purple-500",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap",
        badgeVariants[color],
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColor[color])} />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit max-w-full overflow-x-auto">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer",
              isActive ? "text-brand-600" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ type: "spring", duration: 0.4, bounce: 0.18 }}
              />
            )}
            <span className="relative">
              {t.label}
              {t.count !== undefined && (
                <span
                  className={cn(
                    "ml-2 text-xs",
                    isActive ? "text-brand-400" : "text-gray-400",
                  )}
                >
                  {t.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */
export function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 outline-none transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full pl-3 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 outline-none cursor-pointer transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-brand-600">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 focus:bg-white outline-none transition-all"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 focus:bg-white outline-none transition-all resize-none"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Filter bar — consistent toolbar for list pages                      */
/* ------------------------------------------------------------------ */
export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                        */
/* ------------------------------------------------------------------ */
export function Progress({
  value,
  color = "brand",
  showLabel = false,
}: {
  value: number;
  color?: "brand" | "blue" | "amber" | "green" | "red";
  showLabel?: boolean;
}) {
  const colors = {
    brand: "bg-brand-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    green: "bg-emerald-500",
    red: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.8 }}
          className={cn("h-full rounded-full", colors[color])}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-gray-500 w-9 text-right">{Math.round(value)}%</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton — loading placeholder                                      */
/* ------------------------------------------------------------------ */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-gray-200/70", className)} />;
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden",
              sizes[size],
            )}
          >
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-dark-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-dark-900 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">{children}</div>
            {footer && (
              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer (slide from right)                                           */
/* ------------------------------------------------------------------ */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-dark-900/50 backdrop-blur-sm flex justify-end"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl"
          >
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-dark-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-dark-900 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
            {footer && (
              <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50/50">{footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* DataTable                                                           */
/* ------------------------------------------------------------------ */
export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  empty = "Tidak ada data.",
  stickyHeader = false,
}: {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  empty?: string;
  /** keep the header visible while the body scrolls */
  stickyHeader?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr
            className={cn(
              "border-b border-gray-100 text-[11px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50/40",
              stickyHeader && "sticky top-0 z-10 backdrop-blur",
            )}
          >
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "py-3 px-4 first:rounded-l-lg last:rounded-r-lg",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-sm text-gray-400">
                {empty}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "transition-colors",
                  onRowClick
                    ? "cursor-pointer hover:bg-brand-50/40"
                    : "hover:bg-gray-50/70",
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "py-3.5 px-4 text-sm text-gray-600",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.className,
                    )}
                  >
                    {c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-gray-100 rounded-2xl text-gray-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="font-bold text-dark-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */
export function Avatar({ name, color = "brand" }: { name: string; color?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors: Record<string, string> = {
    brand: "bg-brand-100 text-brand-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold shrink-0",
        colors[color] || colors.brand,
      )}
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Toast system                                                        */
/* ------------------------------------------------------------------ */
type Toast = { id: number; message: string; type: "success" | "error" | "info" };
const ToastCtx = createContext<{ toast: (msg: string, type?: Toast["type"]) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const icons = { success: CheckCircle2, error: AlertTriangle, info: Info };
  const styles = {
    success: "border-emerald-200 text-emerald-700",
    error: "border-red-200 text-red-700",
    info: "border-blue-200 text-blue-700",
  };

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                className={cn(
                  "flex items-center gap-3 bg-white pl-4 pr-5 py-3 rounded-xl shadow-lg border-l-4 text-sm font-medium pointer-events-auto",
                  styles[t.type],
                )}
              >
                <Icon size={18} />
                <span className="text-dark-900">{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Section title                                                       */
/* ------------------------------------------------------------------ */
export function SectionTitle({
  children,
  action,
  subtitle,
}: {
  children: ReactNode;
  action?: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-4 gap-3">
      <div>
        <h2 className="font-bold text-dark-900">{children}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page transition wrapper                                             */
/* ------------------------------------------------------------------ */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* re-export for breadcrumb chevrons etc. */
export { ChevronRight };
