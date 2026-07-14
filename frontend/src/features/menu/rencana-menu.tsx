import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Plus,
  Flame,
  Check,
  CalendarDays,
  Copy,
  Sparkles,
  GraduationCap,
  Activity,
  Wand2,
} from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  Modal,
  Drawer,
  Field,
  TextInput,
  Select,
  Progress,
  SectionTitle,
  useToast,
  cn,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { menuPlans, type MenuPlan } from "@/mocks/mbg-data";
import { createMenuPlan, getMenuPlans, setMenuPlanStatus } from "@/services/menu-service";
import {
  ageLevels,
  analyzeMenu,
  nutritionTargetFor,
  generateMenuForLevel,
  type MenuAnalysis,
} from "@/services/ai-service";

const statusColor: Record<MenuPlan["status"], "green" | "blue" | "gray"> = {
  Disetujui: "green",
  Terjadwal: "blue",
  Draft: "gray",
};

const adequacyColor = { kurang: "amber", ideal: "green", berlebih: "red" } as const;
const progressColor = { kurang: "amber", ideal: "green", berlebih: "red" } as const;

export default function RencanaMenu() {
  const { role } = useRole();
  const { toast } = useToast();
  const isGov = role === "pemerintah";
  const [plans, setPlans] = useState<MenuPlan[]>(menuPlans);
  useEffect(() => {
    getMenuPlans().then((p) => p.length && setPlans(p));
  }, []);
  const [adding, setAdding] = useState(false);
  const [week] = useState("Minggu 4 Juni 2026");
  const [levelId, setLevelId] = useState<string>("sd13");
  const [analysisFor, setAnalysisFor] = useState<MenuPlan | null>(null);
  const [form, setForm] = useState({ hari: "Senin", tanggal: "", menuUtama: "", lauk: "", sayur: "", buah: "", kalori: "" });

  const level = ageLevels.find((l) => l.id === levelId)!;
  const target = useMemo(() => nutritionTargetFor(level), [level]);

  const analysisOf = (p: MenuPlan): MenuAnalysis => analyzeMenu(p, level);
  const avgScore = Math.round(plans.reduce((a, p) => a + analysisOf(p).score, 0) / plans.length);

  const save = () => {
    if (!form.menuUtama || !form.lauk) {
      toast("Menu utama dan lauk wajib diisi.", "error");
      return;
    }
    const plan: MenuPlan = {
      id: `m${Date.now()}`,
      hari: form.hari,
      tanggal: form.tanggal || "—",
      menuUtama: form.menuUtama,
      lauk: form.lauk,
      sayur: form.sayur || "—",
      buah: form.buah || "—",
      kalori: +form.kalori || 650,
      status: "Draft",
    };
    const { id: localId, ...payload } = plan;
    createMenuPlan(payload).then((saved) => {
      if (saved) setPlans((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setPlans((prev) => [...prev, plan]);
    setAdding(false);
    setForm({ hari: "Senin", tanggal: "", menuUtama: "", lauk: "", sayur: "", buah: "", kalori: "" });
    toast("Menu ditambahkan ke rencana mingguan.");
  };

  const approve = (p: MenuPlan) => {
    setMenuPlanStatus(p.id, "Disetujui");
    setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: "Disetujui" } : x)));
    toast(`Menu hari ${p.hari} disetujui.`);
  };

  const aiGenerate = () => {
    const g = generateMenuForLevel(level);
    const est = analyzeMenu({ ...g }, level);
    setForm({ hari: "Senin", tanggal: "", menuUtama: g.menuUtama, lauk: g.lauk, sayur: g.sayur, buah: g.buah, kalori: String(est.totals.energi) });
    setAdding(true);
    toast(`AI menyusun menu untuk ${level.label} (skor gizi ${est.score}).`);
  };

  return (
    <div>
      <PageHeader
        title="Rencana Menu"
        subtitle="Siklus menu mingguan dengan analisis gizi AI per jenjang & kelompok usia"
        icon={UtensilsCrossed}
        actions={
          <>
            <Button variant="outline" icon={Copy} onClick={() => toast("Menu minggu lalu disalin sebagai draft.", "info")}>Duplikat</Button>
            <Button variant="dark" icon={Wand2} onClick={aiGenerate}>AI Susun Menu</Button>
            <Button icon={Plus} onClick={() => setAdding(true)}>Tambah Menu</Button>
          </>
        }
      />

      {/* AI nutrition target panel — detects need per school level / age */}
      <Card className="mb-6 bg-gradient-to-br from-dark-900 to-dark-800 text-white border-0 overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-start gap-3">
              <span className="p-2.5 bg-white/10 rounded-2xl border border-white/10"><Sparkles className="text-brand-400" size={22} /></span>
              <div>
                <h2 className="font-bold flex items-center gap-2">Sasaran Gizi AI per Jenjang</h2>
                <p className="text-gray-300 text-sm mt-0.5">Kebutuhan gizi 1x makan dihitung dari AKG (Permenkes 28/2019) × porsi MBG ({Math.round(level.mealFraction * 100)}%).</p>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={levelId}
                onChange={setLevelId}
                options={ageLevels.map((l) => ({ value: l.id, label: `${l.label} · ${l.ageRange}` }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Energi", value: target.energi, unit: "kkal" },
              { label: "Protein", value: target.protein, unit: "g" },
              { label: "Lemak", value: target.lemak, unit: "g" },
              { label: "Karbohidrat", value: target.karbohidrat, unit: "g" },
              { label: "Serat", value: target.serat, unit: "g" },
            ].map((t) => (
              <div key={t.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{t.value}<span className="text-xs font-medium text-gray-400 ml-0.5">{t.unit}</span></p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-56 h-56 bg-brand-600 rounded-full blur-[90px] opacity-25 -mr-20 -mt-20" />
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Menu Terjadwal" value={plans.length} icon={CalendarDays} color="brand" sub={week} />
        <StatCard label="Skor Gizi AI Rata-rata" value={`${avgScore}/100`} icon={Activity} color={avgScore >= 85 ? "green" : "amber"} sub={`untuk ${level.label}`} />
        <StatCard label="Disetujui" value={plans.filter((p) => p.status === "Disetujui").length} icon={Check} color="green" />
        <StatCard label="Variasi Lauk" value={new Set(plans.map((p) => p.lauk)).size} icon={UtensilsCrossed} color="purple" sub="Hindari repetisi" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <GraduationCap size={18} className="text-brand-600" />
        <h2 className="font-bold text-dark-900">{week} · Analisis untuk {level.label}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {plans.map((p, i) => {
          const a = analysisOf(p);
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full flex flex-col" padded={false}>
                <div className="p-4 bg-gradient-to-br from-brand-50 to-white border-b border-gray-100 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-dark-900">{p.hari}</p>
                      <p className="text-xs text-gray-400">{p.tanggal}</p>
                    </div>
                    <Badge color={statusColor[p.status]} dot>{p.status}</Badge>
                  </div>
                </div>
                <div className="p-4 space-y-2.5 flex-1 text-sm">
                  <MenuRow label="Utama" value={p.menuUtama} />
                  <MenuRow label="Lauk" value={p.lauk} />
                  <MenuRow label="Sayur" value={p.sayur} />
                  <MenuRow label="Buah" value={p.buah} />
                </div>
                <div className="px-4 pb-4 space-y-2">
                  {/* AI nutrition score */}
                  <button
                    onClick={() => setAnalysisFor(p)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer",
                      a.score >= 85 ? "bg-emerald-50 border-emerald-100 hover:bg-emerald-100/60" : "bg-amber-50 border-amber-100 hover:bg-amber-100/60",
                    )}
                  >
                    <span className={cn("text-xs font-semibold flex items-center gap-1", a.score >= 85 ? "text-emerald-700" : "text-amber-700")}>
                      <Sparkles size={13} /> Gizi AI
                    </span>
                    <span className="text-sm font-bold text-dark-900">{a.score}/100</span>
                  </button>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1"><Flame size={11} /> {a.totals.energi} kkal</span>
                    <span className="text-[11px] text-gray-400">P {a.totals.protein}g</span>
                  </div>
                  {isGov && p.status !== "Disetujui" && (
                    <Button size="sm" className="w-full" icon={Check} onClick={() => approve(p)}>Setujui</Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI analysis drawer */}
      <Drawer
        open={!!analysisFor}
        onClose={() => setAnalysisFor(null)}
        title={analysisFor ? `Analisis Gizi AI — ${analysisFor.hari}` : ""}
        subtitle={`${level.label} · ${level.ageRange}`}
      >
        {analysisFor && (() => {
          const a = analysisOf(analysisFor);
          return (
            <div className="space-y-5">
              <div className={cn("p-4 rounded-2xl border text-center", a.score >= 85 ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100")}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Skor Kecukupan Gizi</p>
                <p className="text-4xl font-bold text-dark-900 mt-1">{a.score}<span className="text-lg text-gray-400">/100</span></p>
                <p className="text-sm text-gray-500 mt-1">{analysisFor.menuUtama} · {analysisFor.lauk} · {analysisFor.sayur} · {analysisFor.buah}</p>
              </div>

              <div>
                <SectionTitle>Pemenuhan vs Target AKG</SectionTitle>
                <div className="space-y-3">
                  {a.adequacy.map((n) => (
                    <div key={n.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-600">{n.label}</span>
                        <span className="text-gray-500">{n.actual}{n.unit} / {n.target}{n.unit} <Badge color={adequacyColor[n.status]}>{n.pct}%</Badge></span>
                      </div>
                      <Progress value={Math.min(100, n.pct)} color={progressColor[n.status]} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle>Rekomendasi AI</SectionTitle>
                <div className="space-y-2">
                  {a.recommendations.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                      <Sparkles size={15} className="text-brand-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </Drawer>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Tambah Menu Harian"
        subtitle="Lengkapi komposisi menu bergizi seimbang"
        footer={
          <>
            <Button variant="outline" onClick={() => setAdding(false)}>Batal</Button>
            <Button onClick={save}>Simpan Menu</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-brand-50 rounded-xl border border-brand-100">
            <Wand2 size={16} className="text-brand-600" />
            <p className="text-xs text-brand-700">Gunakan <b>AI Susun Menu</b> untuk mengisi otomatis sesuai target gizi {level.label}.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hari"><TextInput value={form.hari} onChange={(v) => setForm({ ...form, hari: v })} /></Field>
            <Field label="Tanggal"><TextInput value={form.tanggal} onChange={(v) => setForm({ ...form, tanggal: v })} placeholder="cth. 28 Jun" /></Field>
          </div>
          <Field label="Menu Utama (Karbohidrat)" required><TextInput value={form.menuUtama} onChange={(v) => setForm({ ...form, menuUtama: v })} placeholder="cth. Nasi Putih" /></Field>
          <Field label="Lauk (Protein)" required><TextInput value={form.lauk} onChange={(v) => setForm({ ...form, lauk: v })} placeholder="cth. Ayam Teriyaki" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sayur"><TextInput value={form.sayur} onChange={(v) => setForm({ ...form, sayur: v })} placeholder="cth. Tumis Buncis" /></Field>
            <Field label="Buah"><TextInput value={form.buah} onChange={(v) => setForm({ ...form, buah: v })} placeholder="cth. Pisang" /></Field>
          </div>
          <Field label="Estimasi Kalori (kkal)" hint={`Target ${level.label}: ${target.energi} kkal/porsi`}><TextInput type="number" value={form.kalori} onChange={(v) => setForm({ ...form, kalori: v })} placeholder={String(target.energi)} /></Field>
        </div>
      </Modal>
    </div>
  );
}

function MenuRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className={cn("text-[10px] font-bold uppercase tracking-wider text-gray-400 w-12 shrink-0 mt-0.5")}>{label}</span>
      <span className="text-dark-900 font-medium">{value}</span>
    </div>
  );
}
