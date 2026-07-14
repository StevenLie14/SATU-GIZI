import { useState, useEffect } from "react";
import { Handshake, Plus, Star, Phone, FileText, Pencil, Eye } from "lucide-react";
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
  Avatar,
  Drawer,
  useToast,
  type Column,
} from "@/components/ui";
import { mitraList, type Mitra as MitraType } from "@/mocks/mbg-data";
import { createPartner, getPartners } from "@/services/partners-service";

const statusColor: Record<MitraType["status"], "green" | "amber" | "gray"> = {
  Aktif: "green",
  "Tinjau Ulang": "amber",
  Nonaktif: "gray",
};

export default function Mitra() {
  const { toast } = useToast();
  const [list, setList] = useState<MitraType[]>(mitraList);
  useEffect(() => {
    getPartners().then((rows) => rows.length && setList(rows));
  }, []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<MitraType | null>(null);
  const [form, setForm] = useState({ nama: "", jenis: "", pic: "", kontak: "", kontrak: "" });

  const filtered = list.filter((m) => {
    if (status !== "all" && m.status !== status) return false;
    if (query && !`${m.nama} ${m.jenis} ${m.pic}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const save = () => {
    if (!form.nama || !form.jenis) {
      toast("Nama dan jenis mitra wajib diisi.", "error");
      return;
    }
    const localId = `mt${Date.now()}`;
    createPartner({ nama: form.nama, jenis: form.jenis, pic: form.pic || "—", kontak: form.kontak || "—", kontrak: form.kontrak || "—" }).then((saved) => {
      if (saved) setList((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setList((prev) => [{ id: localId, nama: form.nama, jenis: form.jenis, pic: form.pic || "—", kontak: form.kontak || "—", kontrak: form.kontrak || "—", status: "Tinjau Ulang", rating: 5 }, ...prev]);
    setAdding(false);
    setForm({ nama: "", jenis: "", pic: "", kontak: "", kontrak: "" });
    toast("Mitra baru terdaftar (menunggu verifikasi).");
  };

  const columns: Column<MitraType>[] = [
    { key: "nama", header: "Mitra", render: (m) => <div className="flex items-center gap-3"><Avatar name={m.nama} color="amber" /><div><p className="font-semibold text-dark-900">{m.nama}</p><p className="text-xs text-gray-400">{m.jenis}</p></div></div> },
    { key: "pic", header: "PIC", render: (m) => <div><p className="text-sm">{m.pic}</p><p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={11} /> {m.kontak}</p></div> },
    { key: "kontrak", header: "Periode Kontrak", render: (m) => <span className="text-xs">{m.kontrak}</span> },
    { key: "rating", header: "Rating", align: "right", render: (m) => <span className="inline-flex items-center gap-1 font-semibold text-amber-600"><Star size={13} className="fill-current" /> {m.rating}</span> },
    { key: "status", header: "Status", align: "center", render: (m) => <Badge color={statusColor[m.status]} dot>{m.status}</Badge> },
    { key: "action", header: "", align: "right", render: (m) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => setView(m)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Eye size={16} /></button>
        <button onClick={() => toast(`Edit data ${m.nama}.`, "info")} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Pencil size={16} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader
        title="Mitra MBG"
        subtitle="Direktori mitra MBG: vendor bahan baku, koperasi, dan rekanan resmi"
        icon={Handshake}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Daftarkan Mitra</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Mitra" value={list.length} icon={Handshake} color="brand" />
        <StatCard label="Mitra Aktif" value={list.filter((m) => m.status === "Aktif").length} icon={Handshake} color="green" />
        <StatCard label="Perlu Ditinjau" value={list.filter((m) => m.status === "Tinjau Ulang").length} icon={FileText} color="amber" />
        <StatCard label="Rating Rata-rata" value={(list.reduce((a, m) => a + m.rating, 0) / list.length).toFixed(1)} icon={Star} color="purple" />
      </div>

      <Card padded={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari mitra / jenis / PIC" className="flex-1" />
          <Select value={status} onChange={setStatus} options={[{ value: "all", label: "Semua Status" }, { value: "Aktif", label: "Aktif" }, { value: "Tinjau Ulang", label: "Tinjau Ulang" }, { value: "Nonaktif", label: "Nonaktif" }]} />
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} /></div>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Daftarkan Mitra Baru" footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nama Mitra" required><TextInput value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} placeholder="cth. PT Maju Tani Pangan" /></Field>
          <Field label="Jenis Mitra" required><TextInput value={form.jenis} onChange={(v) => setForm({ ...form, jenis: v })} placeholder="cth. Pemasok Beras & Sayur" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="PIC"><TextInput value={form.pic} onChange={(v) => setForm({ ...form, pic: v })} /></Field>
            <Field label="Kontak"><TextInput value={form.kontak} onChange={(v) => setForm({ ...form, kontak: v })} /></Field>
          </div>
          <Field label="Periode Kontrak"><TextInput value={form.kontrak} onChange={(v) => setForm({ ...form, kontrak: v })} placeholder="cth. Jan 2026 - Des 2026" /></Field>
        </div>
      </Modal>

      <Drawer open={!!view} onClose={() => setView(null)} title={view?.nama || ""} subtitle={view?.jenis} footer={<Button className="flex-1" onClick={() => { toast(`${view?.nama} diverifikasi sebagai mitra aktif.`); setList((prev) => prev.map((x) => (x.id === view?.id ? { ...x, status: "Aktif" } : x))); setView(null); }}>Verifikasi sebagai Aktif</Button>}>
        {view && (
          <div className="space-y-4">
            <div className="flex items-center gap-3"><Avatar name={view.nama} color="amber" /><div><p className="font-bold text-dark-900">{view.nama}</p><Badge color={statusColor[view.status]} dot>{view.status}</Badge></div></div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">PIC</p><p className="font-semibold">{view.pic}</p></div>
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">Kontak</p><p className="font-semibold">{view.kontak}</p></div>
              <div className="p-3 bg-gray-50 rounded-xl col-span-2"><p className="text-xs text-gray-400">Periode Kontrak</p><p className="font-semibold">{view.kontrak}</p></div>
              <div className="p-3 bg-amber-50 rounded-xl col-span-2"><p className="text-xs text-amber-700">Rating Kinerja</p><p className="font-bold text-lg flex items-center gap-1">{view.rating} <Star size={15} className="text-amber-500 fill-current" /></p></div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
