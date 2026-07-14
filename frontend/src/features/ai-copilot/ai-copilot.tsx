import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  ArrowRight,
  Bot,
  Wand2,
} from "lucide-react";
import { PageHeader, Card, Badge, Button, SectionTitle, cn } from "@/components/ui";
import { LineChart } from "@/components/charts";
import { useRole, ROLES } from "@/context/role-context";
import { generateInsights, summarize, forecastNext, type AiInsight, type AiSeverity } from "@/services/ai-service";
import { demandForecast as seedDemand } from "@/mocks/mbg-data";
import { getDemandForecast, type DemandForecast } from "@/services/analytics-service";

const sevStyle: Record<AiSeverity, { color: "red" | "amber" | "blue" | "green"; icon: React.ComponentType<{ size?: number }> }> = {
  critical: { color: "red", icon: AlertTriangle },
  warning: { color: "amber", icon: AlertTriangle },
  info: { color: "blue", icon: Info },
  success: { color: "green", icon: CheckCircle2 },
};

const SUGGESTED = [
  "Apa risiko terbesar minggu ini?",
  "Komoditas mana yang harus saya beli sekarang?",
  "Bagaimana keseimbangan suplai antarwilayah?",
  "Ringkas kepatuhan perizinan dapur.",
];

export default function AiCopilot() {
  const { role } = useRole();
  const navigate = useNavigate();
  const insights = useMemo(() => generateInsights(role), [role]);
  const summary = useMemo(() => summarize(insights), [insights]);

  const [demandForecast, setDemand] = useState<DemandForecast>(seedDemand);
  useEffect(() => {
    getDemandForecast().then(setDemand);
  }, []);

  const forecast = useMemo(() => {
    const actual = demandForecast.actual.filter((v) => v > 0);
    const next = forecastNext(actual, 4);
    return { actual, next };
  }, [demandForecast]);

  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `Halo! Saya MBG Copilot. ${summary}` },
  ]);
  const [input, setInput] = useState("");

  const answer = (q: string): string => {
    const ql = q.toLowerCase();
    if (ql.includes("risiko")) {
      const crit = insights.filter((i) => i.severity === "critical");
      return crit.length
        ? `Risiko kritis: ${crit.map((c) => c.title).join("; ")}. Saya sarankan menanganinya lebih dulu.`
        : "Tidak ada risiko kritis. Fokus pada peluang optimasi pengadaan.";
    }
    if (ql.includes("beli") || ql.includes("procure") || ql.includes("harga")) {
      const p = insights.find((i) => i.id === "price-up");
      return p ? p.detail : "Harga relatif stabil; lanjutkan jadwal pengadaan normal.";
    }
    if (ql.includes("wilayah") || ql.includes("suplai") || ql.includes("redistribu")) {
      const r = insights.find((i) => i.id === "redistribute");
      return r ? r.detail : "Suplai antarwilayah seimbang saat ini.";
    }
    if (ql.includes("izin") || ql.includes("perizinan") || ql.includes("kepatuhan")) {
      const c = insights.filter((i) => i.module === "Perizinan");
      return c.length ? c.map((x) => x.detail).join(" ") : "Seluruh perizinan dapur dalam status berlaku.";
    }
    return `Berdasarkan data terkini: ${summary}`;
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "ai", text: answer(text) }]);
    setInput("");
  };

  const counts = {
    critical: insights.filter((i) => i.severity === "critical").length,
    warning: insights.filter((i) => i.severity === "warning").length,
  };

  return (
    <div>
      <PageHeader
        title="AI Copilot"
        subtitle={`Asisten cerdas & pusat insight — disesuaikan untuk ${ROLES[role].label}`}
        icon={Sparkles}
        actions={<Badge color="brand" dot>{insights.length} insight aktif</Badge>}
      />

      {/* Hero summary */}
      <Card className="mb-6 bg-gradient-to-br from-dark-900 to-dark-800 text-white border-0 overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-start gap-4">
            <span className="p-3 bg-white/10 rounded-2xl border border-white/10"><Wand2 className="text-brand-400" size={26} /></span>
            <div>
              <h2 className="text-lg font-bold">Ringkasan Eksekutif AI</h2>
              <p className="text-gray-300 text-sm mt-1 max-w-2xl">{summary}</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10"><p className="text-2xl font-bold text-red-400">{counts.critical}</p><p className="text-[10px] uppercase text-gray-400">Kritis</p></div>
            <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10"><p className="text-2xl font-bold text-amber-400">{counts.warning}</p><p className="text-[10px] uppercase text-gray-400">Peringatan</p></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-56 h-56 bg-brand-600 rounded-full blur-[80px] opacity-30 -mr-20 -mt-20" />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights */}
        <div className="lg:col-span-2 space-y-4">
          <SectionTitle>Insight & Rekomendasi</SectionTitle>
          {insights.map((ins: AiInsight, i) => {
            const s = sevStyle[ins.severity];
            return (
              <motion.div key={ins.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <span className={cn("p-2.5 rounded-xl shrink-0", s.color === "red" && "bg-red-50 text-red-600", s.color === "amber" && "bg-amber-50 text-amber-600", s.color === "blue" && "bg-blue-50 text-blue-600", s.color === "green" && "bg-emerald-50 text-emerald-600")}>
                      <s.icon size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-dark-900">{ins.title}</h3>
                        <Badge color="gray">{ins.module}</Badge>
                        <span className="text-[11px] text-gray-400">keyakinan {ins.confidence}%</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{ins.detail}</p>
                      {ins.action && ins.actionPath && (
                        <button onClick={() => navigate(ins.actionPath!)} className="mt-2 text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1 cursor-pointer">
                          {ins.action} <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Chat + forecast */}
        <div className="space-y-6">
          <Card padded={false} className="overflow-hidden flex flex-col h-[460px]">
            <div className="flex items-center gap-2 p-4 border-b border-gray-100">
              <span className="p-1.5 bg-brand-50 text-brand-600 rounded-lg"><Bot size={16} /></span>
              <span className="font-bold text-dark-900 text-sm">Tanya Copilot</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[85%] px-3 py-2 rounded-2xl text-sm", m.role === "user" ? "bg-brand-600 text-white rounded-br-sm" : "bg-gray-100 text-dark-900 rounded-bl-sm")}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SUGGESTED.slice(0, 2).map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-[11px] px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 cursor-pointer">{s}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Tanya apa saja..."
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <Button icon={Send} onClick={() => send(input)} size="sm">Kirim</Button>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle action={<Badge color="blue" dot>Prediksi</Badge>}>Proyeksi Permintaan AI</SectionTitle>
            <LineChart
              labels={[...demandForecast.labels.slice(0, forecast.actual.length), "P+1", "P+2", "P+3", "P+4"]}
              series={[
                { name: "Aktual", values: [...forecast.actual, ...Array(4).fill(forecast.actual[forecast.actual.length - 1])], color: "#16a34a" },
                { name: "Prediksi AI", values: [...forecast.actual.map(() => NaN).map(() => forecast.actual[0]), ...forecast.next], color: "#3b82f6" },
              ]}
              height={160}
            />
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><TrendingUp size={12} /> Model regresi linier · MAPE ±7%</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
