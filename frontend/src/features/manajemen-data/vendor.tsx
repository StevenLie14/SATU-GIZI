import { useState, useEffect } from "react";
import { Store, Plus, ShieldCheck, FileCheck2, Star, Eye, TrendingUp, Clock } from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
  SearchInput,
  Select,
  Modal,
  Field,
  TextInput,
  Drawer,
  Avatar,
  Progress,
  useToast,
  cn,
  type Column,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { suppliers, type Supplier } from "@/mocks/mbg-data";
import { getSuppliers } from "@/services/suppliers-service";

/* Vendor master uses the supplier dataset with onboarding/document framing */
interface VendorRow extends Supplier {
  onboarding: number; // 0-100 onboarding completeness
  dokumen: { label: string; done: boolean }[];
}

const toVendorRows = (rows: Supplier[]): VendorRow[] =>
  rows.map((s, i) => ({
    ...s,
    onboarding: s.status === "Terverifikasi" ? 100 : 60 - i * 5,
    dokumen: [
      { label: "Akta / NIB Perusahaan", done: s.status === "Terverifikasi" },
      { label: "NPWP", done: s.status === "Terverifikasi" },
      { label: "Sertifikat Halal / Mutu", done: s.status === "Terverifikasi" || i % 2 === 0 },
      { label: "Kontrak Kerjasama", done: s.status === "Terverifikasi" },
    ],
  }));

const seedVendors: VendorRow[] = toVendorRows(suppliers);

const statusColor: Record<Supplier["status"], "green" | "amber" | "red"> = {
  Terverifikasi: "green",
  Pending: "amber",
  Diblokir: "red",
};

export default function Vendor() {
  const { role } = useRole();
  const { toast } = useToast();
  const isGov = role === "pemerintah" || role === "sppg";
  const [list, setList] = useState<VendorRow[]>(seedVendors);
  useEffect(() => {
    getSuppliers().then((rows) => rows.length && setList(toVendorRows(rows)));
  }, []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<VendorRow | null>(null);
  const [form, setForm] = useState({ nama: "", komoditas: "", lokasi: "" });

  const filtered = list.filter((v) => {
    if (status !== "all" && v.status !== status) return false;
    if (query && !`${v.nama} ${v.lokasi}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const save = () => {
    if (!form.nama) {
      toast("Nama vendor wajib diisi.", "error");
      return;
    }
    setList((prev) => [
      {
        id: `vd${Date.now()}`,
        nama: form.nama,
        komoditas: form.komoditas ? form.komoditas.split(",").map((c) => c.trim()) : [],
        lokasi: form.lokasi || "—",
        hargaIndex: 100,
        leadTime: "—",
        rating: 0,
        status: "Pending",
        onboarding: 25,
        dokumen: [
          { label: "Akta / NIB Perusahaan", done: false },
          { label: "NPWP", done: false },
          { label: "Sertifikat Halal / Mutu", done: false },
          { label: "Kontrak Kerjasama", done: false },
        ],
      },
      ...prev,
    ]);
    setAdding(false);
    setForm({ nama: "", komoditas: "", lokasi: "" });
    toast("Vendor baru ditambahkan ke proses onboarding.");
  };

  const toggleDoc = (vendorId: string, idx: number) => {
    const recalc = (v: VendorRow) => {
      const dokumen = v.dokumen.map((d, i) => (i === idx ? { ...d, done: !d.done } : d));
      const onboarding = Math.round((dokumen.filter((d) => d.done).length / dokumen.length) * 100);
      return { ...v, dokumen, onboarding };
    };
    setList((prev) => prev.map((v) => (v.id === vendorId ? recalc(v) : v)));
    setView((v) => (v && v.id === vendorId ? recalc(v) : v));
  };

  const columns: Column<VendorRow>[] = [
    { key: "nama", header: "Vendor", render: (v) => <div className="flex items-center gap-3"><Avatar name={v.nama} color="blue" /><div><p className="font-semibold text-dark-900">{v.nama}</p><p className="text-xs text-gray-400">{v.lokasi}</p></div></div> },
    { key: "komoditas", header: "Komoditas", render: (v) => <div className="flex flex-wrap gap-1">{v.komoditas.slice(0, 2).map((c) => <Badge key={c} color="gray">{c}</Badge>)}{v.komoditas.length > 2 && <Badge color="gray">+{v.komoditas.length - 2}</Badge>}</div> },
    { key: "onboarding", header: "Onboarding", render: (v) => <div className="w-28"><Progress value={v.onboarding} showLabel color={v.onboarding === 100 ? "green" : "amber"} /></div> },
    { key: "rating", header: "Rating", align: "right", render: (v) => v.rating ? <span className="inline-flex items-center gap-1 font-semibold text-amber-600"><Star size={13} className="fill-current" /> {v.rating}</span> : <span className="text-gray-300">—</span> },
    { key: "status", header: "Status", align: "center", render: (v) => <Badge color={statusColor[v.status]} dot>{v.status}</Badge> },
    { key: "action", header: "", align: "right", render: (v) => <button onClick={() => setView(v)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Eye size={16} /></button> },
  ];

  return (
    <div>
      <PageHeader
        title="Vendor"
        subtitle="Master data vendor, onboarding, verifikasi dokumen, dan penilaian kinerja"
        icon={Store}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Tambah Vendor</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Vendor" value={list.length} icon={Store} color="brand" />
        <StatCard label="Terverifikasi" value={list.filter((v) => v.status === "Terverifikasi").length} icon={ShieldCheck} color="green" />
        <StatCard label="Dalam Onboarding" value={list.filter((v) => v.onboarding < 100).length} icon={Clock} color="amber" />
        <StatCard label="Kinerja Rata-rata" value={`${(list.filter((v) => v.rating).reduce((a, v) => a + v.rating, 0) / list.filter((v) => v.rating).length).toFixed(1)}/5`} icon={TrendingUp} color="purple" />
      </div>

      <Card padded={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari vendor / lokasi" className="flex-1" />
          <Select value={status} onChange={setStatus} options={[{ value: "all", label: "Semua Status" }, { value: "Terverifikasi", label: "Terverifikasi" }, { value: "Pending", label: "Pending" }, { value: "Diblokir", label: "Diblokir" }]} />
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} /></div>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Tambah Vendor" subtitle="Vendor baru akan masuk ke proses onboarding" footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nama Vendor" required><TextInput value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} /></Field>
          <Field label="Komoditas" hint="Pisahkan dengan koma"><TextInput value={form.komoditas} onChange={(v) => setForm({ ...form, komoditas: v })} placeholder="cth. Beras, Sayuran" /></Field>
          <Field label="Lokasi"><TextInput value={form.lokasi} onChange={(v) => setForm({ ...form, lokasi: v })} /></Field>
        </div>
      </Modal>

      <Drawer
        open={!!view}
        onClose={() => setView(null)}
        title={view?.nama || ""}
        subtitle={view?.lokasi}
        footer={
          view && view.status !== "Terverifikasi" && isGov ? (
            <Button className="flex-1" icon={ShieldCheck} disabled={view.onboarding < 100} onClick={() => { setList((prev) => prev.map((x) => (x.id === view.id ? { ...x, status: "Terverifikasi" } : x))); toast(`${view.nama} diverifikasi.`); setView(null); }}>
              {view.onboarding < 100 ? "Lengkapi Dokumen Dahulu" : "Verifikasi Vendor"}
            </Button>
          ) : (
            <Badge color="green" dot>Vendor Terverifikasi</Badge>
          )
        }
      >
        {view && (
          <div className="space-y-5">
            <div className="flex items-center gap-3"><Avatar name={view.nama} color="blue" /><div><p className="font-bold text-dark-900">{view.nama}</p><Badge color={statusColor[view.status]} dot>{view.status}</Badge></div></div>
            <div className="flex flex-wrap gap-1.5">{view.komoditas.map((c) => <Badge key={c} color="brand">{c}</Badge>)}</div>
            <div>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-500">Progres Onboarding</span><span className="font-bold text-dark-900">{view.onboarding}%</span></div>
              <Progress value={view.onboarding} color={view.onboarding === 100 ? "green" : "amber"} />
            </div>
            <div>
              <p className="text-sm font-bold text-dark-900 mb-2 flex items-center gap-1.5"><FileCheck2 size={15} /> Verifikasi Dokumen</p>
              <div className="space-y-2">
                {view.dokumen.map((d, idx) => (
                  <button key={idx} onClick={() => toggleDoc(view.id, idx)} className={cn("w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors cursor-pointer", d.done ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-200 hover:bg-gray-50")}>
                    <span className={cn("text-sm", d.done ? "text-dark-900 font-medium" : "text-gray-500")}>{d.label}</span>
                    <Badge color={d.done ? "green" : "gray"}>{d.done ? "Terverifikasi" : "Belum"}</Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
