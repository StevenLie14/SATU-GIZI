import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  ShieldCheck,
  ClipboardCheck,
  FileBadge,
  MapPin,
  User,
  Users as UsersIcon,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Eye,
  Link2,
  BellRing,
} from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  Modal,
  Field,
  TextInput,
  Drawer,
  Tabs,
  Progress,
  SectionTitle,
  useToast,
  cn,
  shortHash,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { kitchens as seed, type Kitchen } from "@/mocks/mbg-data";
import { getKitchens } from "@/services/kitchens-service";
import { verifyHash, anchorRecord } from "@/lib/blockchain";

const izinColor: Record<Kitchen["izinStatus"], "green" | "amber" | "red"> = {
  Berlaku: "green",
  Proses: "amber",
  Kadaluarsa: "red",
};

export default function DapurSPPG() {
  const { role } = useRole();
  const { toast } = useToast();
  const isGov = role === "pemerintah";
  const [list, setList] = useState<Kitchen[]>(seed);
  useEffect(() => {
    getKitchens().then((rows) => rows.length && setList(rows));
  }, []);
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<Kitchen | null>(null);
  const [tab, setTab] = useState("profil");
  const [form, setForm] = useState({ nama: "", alamat: "", kapasitas: "", kepala: "" });

  const avgSkor = Math.round(list.reduce((a, k) => a + k.skorPengawasan, 0) / list.length);
  const berlaku = list.filter((k) => k.izinStatus === "Berlaku").length;

  const checklistProgress = (k: Kitchen) =>
    k.checklist.length
      ? Math.round((k.checklist.filter((c) => c.done).length / k.checklist.length) * 100)
      : 0;

  const toggleChecklist = (kitchenId: string, idx: number) => {
    setList((prev) =>
      prev.map((k) =>
        k.id === kitchenId
          ? { ...k, checklist: k.checklist.map((c, i) => (i === idx ? { ...c, done: !c.done } : c)) }
          : k,
      ),
    );
    setView((v) =>
      v && v.id === kitchenId
        ? { ...v, checklist: v.checklist.map((c, i) => (i === idx ? { ...c, done: !c.done } : c)) }
        : v,
    );
  };

  const save = () => {
    if (!form.nama || !form.kapasitas) {
      toast("Nama dan kapasitas wajib diisi.", "error");
      return;
    }
    setList((prev) => [
      ...prev,
      {
        id: `kt${Date.now()}`,
        nama: form.nama,
        alamat: form.alamat || "—",
        kapasitas: +form.kapasitas,
        kepala: form.kepala || "—",
        izinStatus: "Proses",
        izinNomor: "Dalam pengajuan",
        izinBerlaku: "—",
        skorPengawasan: 0,
        checklist: [
          { label: "Sertifikat Laik Higiene Sanitasi (SLHS)", done: false },
          { label: "Sertifikat Halal", done: false },
          { label: "Pelatihan Higiene Karyawan", done: false },
          { label: "Fasilitas Cold Storage", done: false },
          { label: "Audit HACCP Berkala", done: false },
        ],
      },
    ]);
    setAdding(false);
    setForm({ nama: "", alamat: "", kapasitas: "", kepala: "" });
    toast("Dapur SPPG didaftarkan (perizinan dalam proses).");
  };

  const openView = (k: Kitchen) => {
    setView(k);
    setTab("profil");
  };

  return (
    <div>
      <PageHeader
        title="Dapur SPPG"
        subtitle="Pengawasan & perizinan dapur: profil, status izin, dan checklist kelaikan"
        icon={Building2}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Daftarkan Dapur</Button>}
      />

      {/* Real-time license & finding notifications */}
      {(() => {
        const needAttention = list.filter((k) => k.izinStatus !== "Berlaku" || checklistProgress(k) < 100);
        if (needAttention.length === 0) return null;
        return (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl border border-amber-200 bg-amber-50 flex items-start gap-3">
            <span className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0"><BellRing size={18} /></span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">Notifikasi Perizinan & Tindak Lanjut Temuan</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {needAttention.map((k) => (
                  <button key={k.id} onClick={() => openView(k)} className="text-xs px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer">
                    {k.nama} · {k.izinStatus === "Berlaku" ? `checklist ${checklistProgress(k)}%` : `izin ${k.izinStatus.toLowerCase()}`}
                  </button>
                ))}
              </div>
            </div>
            <Badge color="amber" dot>{needAttention.length} perlu tindak lanjut</Badge>
          </motion.div>
        );
      })()}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Dapur SPPG" value={list.length} icon={Building2} color="brand" />
        <StatCard label="Izin Berlaku" value={berlaku} icon={ShieldCheck} color="green" sub={`${list.length - berlaku} dalam proses`} />
        <StatCard label="Skor Pengawasan Rata-rata" value={avgSkor} icon={ClipboardCheck} color="blue" sub="dari 100" />
        <StatCard label="Total Kapasitas" value={list.reduce((a, k) => a + k.kapasitas, 0).toLocaleString("id-ID")} icon={UsersIcon} color="purple" sub="porsi/hari" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {list.map((k, i) => (
          <motion.div key={k.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="p-3 bg-brand-50 text-brand-600 rounded-2xl"><Building2 size={22} /></span>
                  <div>
                    <h3 className="font-bold text-dark-900">{k.nama}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> {k.alamat}</p>
                  </div>
                </div>
                <Badge color={izinColor[k.izinStatus]} dot>{k.izinStatus}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2.5 bg-gray-50 rounded-xl"><p className="text-[10px] text-gray-400 uppercase font-bold">Kapasitas</p><p className="text-sm font-bold text-dark-900">{k.kapasitas.toLocaleString("id-ID")}</p></div>
                <div className="text-center p-2.5 bg-gray-50 rounded-xl"><p className="text-[10px] text-gray-400 uppercase font-bold">Skor</p><p className="text-sm font-bold text-dark-900">{k.skorPengawasan}/100</p></div>
                <div className="text-center p-2.5 bg-gray-50 rounded-xl"><p className="text-[10px] text-gray-400 uppercase font-bold">Checklist</p><p className="text-sm font-bold text-dark-900">{checklistProgress(k)}%</p></div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500">Kelengkapan Perizinan</span><span className="font-semibold text-dark-900">{checklistProgress(k)}%</span></div>
                <Progress value={checklistProgress(k)} color={checklistProgress(k) >= 80 ? "green" : "amber"} />
              </div>

              <Button variant="outline" icon={Eye} className="w-full" onClick={() => openView(k)}>Detail Pengawasan</Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add modal */}
      <Modal open={adding} onClose={() => setAdding(false)} title="Daftarkan Dapur SPPG" subtitle="Lengkapi profil dapur untuk memulai proses perizinan" footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nama Dapur" required><TextInput value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} placeholder="cth. SPPG Dapur Pusat Senen" /></Field>
          <Field label="Alamat"><TextInput value={form.alamat} onChange={(v) => setForm({ ...form, alamat: v })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kapasitas (porsi/hari)" required><TextInput type="number" value={form.kapasitas} onChange={(v) => setForm({ ...form, kapasitas: v })} placeholder="0" /></Field>
            <Field label="Kepala Dapur"><TextInput value={form.kepala} onChange={(v) => setForm({ ...form, kepala: v })} /></Field>
          </div>
        </div>
      </Modal>

      {/* Detail drawer */}
      <Drawer
        open={!!view}
        onClose={() => setView(null)}
        title={view?.nama || ""}
        subtitle={view?.alamat}
        footer={
          view && view.izinStatus !== "Berlaku" && isGov ? (
            <Button className="flex-1" icon={ShieldCheck} onClick={() => { const rec = anchorRecord("PermitRegistry", "issuePermit", `Izin ${view.nama}`); setList((prev) => prev.map((x) => (x.id === view.id ? { ...x, izinStatus: "Berlaku", izinBerlaku: "s.d 31 Des 2026" } : x))); toast(`Izin ${view.nama} diterbitkan & dicatat on-chain ${rec.txHash.slice(0, 10)}…`); setView(null); }}>Terbitkan Izin Operasional</Button>
          ) : (
            <Button variant="outline" className="flex-1" icon={ClipboardCheck} onClick={() => toast("Jadwal inspeksi lapangan dibuat.", "info")}>Jadwalkan Inspeksi</Button>
          )
        }
      >
        {view && (
          <div>
            <Tabs
              tabs={[
                { id: "profil", label: "Profil" },
                { id: "izin", label: "Perizinan" },
                { id: "checklist", label: "Checklist" },
              ]}
              active={tab}
              onChange={setTab}
            />

            <div className="mt-5">
              {tab === "profil" && (
                <div className="space-y-3">
                  <DetailRow icon={MapPin} label="Alamat" value={view.alamat} />
                  <DetailRow icon={UsersIcon} label="Kapasitas Produksi" value={`${view.kapasitas.toLocaleString("id-ID")} porsi/hari`} />
                  <DetailRow icon={User} label="Kepala Dapur" value={view.kepala} />
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700 font-semibold flex items-center gap-1.5"><ClipboardCheck size={14} /> Skor Pengawasan</p>
                    <div className="flex items-end gap-2 mt-1">
                      <span className="text-3xl font-bold text-dark-900">{view.skorPengawasan}</span>
                      <span className="text-sm text-gray-400 mb-1">/ 100</span>
                    </div>
                    <Progress value={view.skorPengawasan} color={view.skorPengawasan >= 85 ? "green" : "amber"} />
                  </div>
                </div>
              )}

              {tab === "izin" && (
                <div className="space-y-4">
                  <div className={cn("p-4 rounded-xl border", view.izinStatus === "Berlaku" ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100")}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-dark-900 flex items-center gap-2"><FileBadge size={16} /> Status Izin</span>
                      <Badge color={izinColor[view.izinStatus]} dot>{view.izinStatus}</Badge>
                    </div>
                  </div>
                  <DetailRow icon={FileBadge} label="Nomor Izin (SLHS)" value={view.izinNomor} />
                  <DetailRow icon={ShieldCheck} label="Masa Berlaku" value={view.izinBerlaku} />
                  {/* On-chain anchoring of the permit */}
                  {(() => {
                    const chain = verifyHash(view.izinNomor);
                    return (
                      <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-blue-700 flex items-center gap-1.5"><Link2 size={15} /> Terverifikasi On-Chain</span>
                          <Badge color="blue" dot>PermitRegistry</Badge>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between"><span>Tx Hash</span><span className="font-mono">{shortHash(chain.txHash, 8, 6)}</span></div>
                          <div className="flex justify-between"><span>Block</span><span className="font-mono">#{chain.block.toLocaleString("id-ID")}</span></div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-400">
                    <FileBadge className="mx-auto mb-2" size={24} />
                    Dokumen izin (SLHS, Sertifikat Halal, HACCP) tersimpan di arsip digital.
                    <button className="block mx-auto mt-2 text-brand-600 font-semibold text-xs cursor-pointer" onClick={() => toast("Membuka arsip dokumen izin.", "info")}>Lihat Dokumen</button>
                  </div>
                </div>
              )}

              {tab === "checklist" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <SectionTitle>Checklist Pengawasan</SectionTitle>
                    <span className="text-sm font-bold text-brand-600">{checklistProgress(view)}%</span>
                  </div>
                  <div className="space-y-2">
                    {view.checklist.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleChecklist(view.id, idx)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors cursor-pointer",
                          c.done ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-200 hover:bg-gray-50",
                        )}
                      >
                        {c.done ? <CheckCircle2 className="text-emerald-500 shrink-0" size={18} /> : <Circle className="text-gray-300 shrink-0" size={18} />}
                        <span className={cn("text-sm", c.done ? "text-dark-900 font-medium" : "text-gray-500")}>{c.label}</span>
                      </button>
                    ))}
                  </div>
                  {checklistProgress(view) < 100 && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                      <p className="text-xs text-amber-700">Terdapat item belum terpenuhi. Lengkapi seluruh checklist sebelum izin operasional dapat diterbitkan.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <Icon size={16} className="text-gray-400 shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-dark-900">{value}</p>
      </div>
    </div>
  );
}
