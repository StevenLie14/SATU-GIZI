import { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Plus, Flame, Check, CalendarDays, Copy } from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  Modal,
  Field,
  TextInput,
  useToast,
  cn,
} from "../../ui";
import { useRole } from "../../roles";
import { menuPlans, type MenuPlan } from "../../data";

const statusColor: Record<MenuPlan["status"], "green" | "blue" | "gray"> = {
  Disetujui: "green",
  Terjadwal: "blue",
  Draft: "gray",
};

export default function RencanaMenu() {
  const { role } = useRole();
  const { toast } = useToast();
  const isGov = role === "pemerintah";
  const [plans, setPlans] = useState<MenuPlan[]>(menuPlans);
  const [adding, setAdding] = useState(false);
  const [week, setWeek] = useState("Minggu 4 Juni 2026");
  const [form, setForm] = useState({ hari: "Senin", tanggal: "", menuUtama: "", lauk: "", sayur: "", buah: "", kalori: "" });

  const avgKalori = Math.round(plans.reduce((a, p) => a + p.kalori, 0) / plans.length);

  const save = () => {
    if (!form.menuUtama || !form.lauk) {
      toast("Menu utama dan lauk wajib diisi.", "error");
      return;
    }
    setPlans((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        hari: form.hari,
        tanggal: form.tanggal || "—",
        menuUtama: form.menuUtama,
        lauk: form.lauk,
        sayur: form.sayur || "—",
        buah: form.buah || "—",
        kalori: +form.kalori || 650,
        status: "Draft",
      },
    ]);
    setAdding(false);
    setForm({ hari: "Senin", tanggal: "", menuUtama: "", lauk: "", sayur: "", buah: "", kalori: "" });
    toast("Menu ditambahkan ke rencana mingguan.");
  };

  const approve = (p: MenuPlan) => {
    setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: "Disetujui" } : x)));
    toast(`Menu hari ${p.hari} disetujui.`);
  };

  return (
    <div>
      <PageHeader
        title="Rencana Menu"
        subtitle="Susun siklus menu mingguan bergizi seimbang untuk penerima manfaat"
        icon={UtensilsCrossed}
        actions={
          <>
            <Button variant="outline" icon={Copy} onClick={() => toast("Menu minggu lalu disalin sebagai draft.", "info")}>Duplikat Minggu Lalu</Button>
            <Button icon={Plus} onClick={() => setAdding(true)}>Tambah Menu</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Menu Terjadwal" value={plans.length} icon={CalendarDays} color="brand" sub={week} />
        <StatCard label="Rata-rata Kalori" value={`${avgKalori} kkal`} icon={Flame} color="amber" sub="Target 650-720 kkal" />
        <StatCard label="Disetujui" value={plans.filter((p) => p.status === "Disetujui").length} icon={Check} color="green" />
        <StatCard label="Variasi Lauk" value={new Set(plans.map((p) => p.lauk)).size} icon={UtensilsCrossed} color="purple" sub="Hindari repetisi" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-dark-900 flex items-center gap-2"><CalendarDays size={18} className="text-brand-600" /> {week}</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setWeek("Minggu 3 Juni 2026")}>‹ Sebelumnya</Button>
          <Button size="sm" variant="outline" onClick={() => setWeek("Minggu 5 Juni 2026")}>Berikutnya ›</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {plans.map((p, i) => (
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
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl">
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1"><Flame size={13} /> Kalori</span>
                  <span className="text-sm font-bold text-dark-900">{p.kalori} kkal</span>
                </div>
                {isGov && p.status !== "Disetujui" && (
                  <Button size="sm" className="w-full mt-2" icon={Check} onClick={() => approve(p)}>Setujui</Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

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
          <Field label="Estimasi Kalori (kkal)" hint="Standar AKG anak SD: 650-700 kkal"><TextInput type="number" value={form.kalori} onChange={(v) => setForm({ ...form, kalori: v })} placeholder="650" /></Field>
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
