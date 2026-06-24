import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Bar chart                                                           */
/* ------------------------------------------------------------------ */
export function BarChart({
  data,
  height = 220,
  unit = "",
  color = "brand",
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  height?: number;
  unit?: string;
  color?: "brand" | "blue";
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barBase = color === "blue" ? "bg-blue-400" : "bg-brand-400";
  const barHi = color === "blue" ? "bg-blue-600" : "bg-brand-600";
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
          <div className="relative w-full flex justify-center" style={{ height: "100%" }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.9, type: "spring", bounce: 0.25, delay: i * 0.05 }}
              className={cn(
                "w-full max-w-[44px] rounded-t-lg self-end relative",
                d.highlight ? barHi : barBase,
              )}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold whitespace-nowrap z-20">
                {d.value.toLocaleString("id-ID")}
                {unit}
              </div>
            </motion.div>
          </div>
          <span className="text-[10px] text-gray-400 mt-2 font-semibold truncate w-full text-center">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Line chart (single or multi series)                                 */
/* ------------------------------------------------------------------ */
export function LineChart({
  series,
  labels,
  height = 220,
}: {
  series: { name: string; values: number[]; color: string }[];
  labels: string[];
  height?: number;
}) {
  const allValues = series.flatMap((s) => s.values);
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;
  const W = 600;
  const H = height;
  const pad = 10;
  const stepX = (W - pad * 2) / Math.max(labels.length - 1, 1);

  const toPoints = (values: number[]) =>
    values
      .map((v, i) => {
        const x = pad + i * stepX;
        const y = pad + (1 - (v - min) / range) * (H - pad * 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={pad}
            x2={W - pad}
            y1={pad + g * (H - pad * 2)}
            y2={pad + g * (H - pad * 2)}
            stroke="#f1f5f9"
            strokeWidth={1}
          />
        ))}
        {series.map((s) => (
          <g key={s.name}>
            <motion.polyline
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={toPoints(s.values)}
            />
            {s.values.map((v, i) => {
              const x = pad + i * stepX;
              const y = pad + (1 - (v - min) / range) * (H - pad * 2);
              return <circle key={i} cx={x} cy={y} r={2.5} fill={s.color} />;
            })}
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-2 px-1">
        {labels.map((l, i) => (
          <span key={i} className="text-[10px] text-gray-400 font-medium">
            {l}
          </span>
        ))}
      </div>
      {series.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-3 justify-center">
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-xs text-gray-500 font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donut chart                                                         */
/* ------------------------------------------------------------------ */
export function DonutChart({
  segments,
  size = 160,
  centerLabel,
  centerSub,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={14} />
          {segments.map((s, i) => {
            const len = (s.value / total) * c;
            const seg = (
              <motion.circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={14}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: `0 ${c}` }}
                animate={{ strokeDasharray: `${len} ${c - len}` }}
                transition={{ duration: 0.9, delay: i * 0.1 }}
                strokeLinecap="round"
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        {centerLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-dark-900">{centerLabel}</span>
            {centerSub && <span className="text-[10px] text-gray-400 font-medium">{centerSub}</span>}
          </div>
        )}
      </div>
      <div className="space-y-2.5 flex-1 min-w-[140px]">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-sm text-gray-600">{s.label}</span>
            </div>
            <span className="text-sm font-bold text-dark-900">
              {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                           */
/* ------------------------------------------------------------------ */
export function Sparkline({
  values,
  color = "#16a34a",
  width = 120,
  height = 36,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = width / Math.max(values.length - 1, 1);
  const points = values
    .map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth={2} points={points} strokeLinecap="round" />
    </svg>
  );
}
