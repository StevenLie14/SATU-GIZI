import { useState, useMemo, useEffect } from "react";
import { Truck, Plus, Star, MapPin, Clock, TrendingDown, ShieldCheck, Eye } from "lucide-react";
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
import { suppliers, type Supplier as SupplierType } from "@/mocks/mbg-data";
import { createSupplier, getSuppliers } from "@/services/suppliers-service";

const statusColor: Record<SupplierType["status"], "green" | "amber" | "red"> = {
  Terverifikasi: "green",
  Pending: "amber",
  Diblokir: "red",
};

export default function Supplier() {
  const { toast } = useToast();
  const [list, setList] = useState<SupplierType[]>(suppliers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  useEffect(() => {
    getSuppliers().then((rows) => rows.length && setList(rows));
  }, []);
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<SupplierType | null>(null);
  const [form, setForm] = useState({ nama: "", komoditas: "", lokasi: "" });

  const avgIndex = Math.round(list.reduce((a, s) => a + s.hargaIndex, 0) / list.length);

  const filtered = list.filter((s) => {
    if (status !== "all" && s.status !== status) return false;
    if (query && !`${s.nama} ${s.komoditas.join(" ")} ${s.lokasi}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const cheapest = useMemo(() => [...list].sort((a, b) => a.hargaIndex - b.hargaIndex)[0], [list]);

  const save = () => {
    if (!form.nama) {
      toast("Nama supplier wajib diisi.", "error");
      return;
    }
    const localId = `sp${Date.now()}`;
    const komoditas = form.komoditas ? form.komoditas.split(",").map((c) => c.trim()) : [];
    createSupplier({ nama: form.nama, komoditas, lokasi: form.lokasi || "—", hargaIndex: 100, leadTime: "1 hari" }).then((saved) => {
      if (saved) setList((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setList((prev) => [{ id: localId, nama: form.nama, komoditas, lokasi: form.lokasi || "—", hargaIndex: 100, leadTime: "1 hari", rating: 5, status: "Pending" }, ...prev]);
    setAdding(false);
    setForm({ nama: "", komoditas: "", lokasi: "" });
    toast("Supplier baru ditambahkan (menunggu verifikasi).");
  };

  const columns: Column<SupplierType>[] = [
    { key: "nama", header: "Supplier", render: (s) => <div className="flex items-center gap-3"><Avatar name={s.nama} color="green" /><div><p className="font-semibold text-dark-900">{s.nama}</p><p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> {s.lokasi}</p></div></div> },
    { key: "komoditas", header: "Komoditas", render: (s) => <div className="flex flex-wrap gap-1">{s.komoditas.map((c) => <Badge key={c} color="gray">{c}</Badge>)}</div> },
    { key: "hargaIndex", header: "Indeks Harga", align: "center", render: (s) => <Badge color={s.hargaIndex < 100 ? "green" : s.hargaIndex > 105 ? "red" : "amber"}>{s.hargaIndex} {s.hargaIndex < 100 ? "↓" : s.hargaIndex > 100 ? "↑" : "="}</Badge> },
    { key: "leadTime", header: "Lead Time", align: "center", render: (s) => <span className="inline-flex items-center gap-1 text-sm"><Clock size={13} className="text-gray-400" /> {s.leadTime}</span> },
    { key: "rating", header: "Rating", align: "right", render: (s) => <span className="inline-flex items-center gap-1 font-semibold text-amber-600"><Star size={13} className="fill-current" /> {s.rating}</span> },
    { key: "status", header: "Status", align: "center", render: (s) => <Badge color={statusColor[s.status]} dot>{s.status}</Badge> },
    { key: "action", header: "", align: "right", render: (s) => <button onClick={() => setView(s)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Eye size={16} /></button> },
  ];

  return (
    <div>
      <PageHeader
        title="Supplier"
        subtitle="Direktori supplier bahan baku dengan perbandingan harga, lead time, dan kualitas"
        icon={Truck}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Tambah Supplier</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Supplier" value={list.length} icon={Truck} color="brand" />
        <StatCard label="Terverifikasi" value={list.filter((s) => s.status === "Terverifikasi").length} icon={ShieldCheck} color="green" />
        <StatCard label="Indeks Harga Rata-rata" value={avgIndex} icon={TrendingDown} color="amber" sub="100 = harga pasar" />
        <StatCard label="Termurah" value={cheapest?.nama.split(" ").slice(0, 2).join(" ")} icon={TrendingDown} color="purple" sub={`Indeks ${cheapest?.hargaIndex}`} />
      </div>

      <Card padded={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari supplier / komoditas / lokasi" className="flex-1" />
          <Select value={status} onChange={setStatus} options={[{ value: "all", label: "Semua Status" }, { value: "Terverifikasi", label: "Terverifikasi" }, { value: "Pending", label: "Pending" }, { value: "Diblokir", label: "Diblokir" }]} />
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} /></div>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Tambah Supplier" footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nama Supplier" required><TextInput value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} /></Field>
          <Field label="Komoditas" hint="Pisahkan dengan koma"><TextInput value={form.komoditas} onChange={(v) => setForm({ ...form, komoditas: v })} placeholder="cth. Beras, Sayuran" /></Field>
          <Field label="Lokasi"><TextInput value={form.lokasi} onChange={(v) => setForm({ ...form, lokasi: v })} placeholder="cth. Jakarta Selatan" /></Field>
        </div>
      </Modal>

      <Drawer
        open={!!view}
        onClose={() => setView(null)}
        title={view?.nama || ""}
        subtitle={view?.lokasi}
        footer={view?.status === "Pending" ? <Button className="flex-1" icon={ShieldCheck} onClick={() => { setList((prev) => prev.map((x) => (x.id === view?.id ? { ...x, status: "Terverifikasi" } : x))); toast(`${view?.nama} terverifikasi.`); setView(null); }}>Verifikasi Supplier</Button> : <Badge color="green" dot>Terverifikasi</Badge>}
      >
        {view && (
          <div className="space-y-5">
            <div className="flex items-center gap-3"><Avatar name={view.nama} color="green" /><div><p className="font-bold text-dark-900">{view.nama}</p><Badge color={statusColor[view.status]} dot>{view.status}</Badge></div></div>
            <div className="flex flex-wrap gap-1.5">{view.komoditas.map((c) => <Badge key={c} color="brand">{c}</Badge>)}</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">Lead Time</p><p className="font-semibold">{view.leadTime}</p></div>
              <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400">Rating</p><p className="font-semibold flex items-center gap-1">{view.rating} <Star size={13} className="text-amber-500 fill-current" /></p></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-500">Indeks Harga vs Pasar</span><span className={cn("font-bold", view.hargaIndex < 100 ? "text-emerald-600" : "text-red-600")}>{view.hargaIndex}</span></div>
              <Progress value={view.hargaIndex} color={view.hargaIndex < 100 ? "green" : "red"} />
              <p className="text-xs text-gray-400 mt-1.5">{view.hargaIndex < 100 ? `Lebih murah ${100 - view.hargaIndex}% dari rata-rata pasar` : view.hargaIndex > 100 ? `Lebih mahal ${view.hargaIndex - 100}% dari rata-rata pasar` : "Setara harga pasar"}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
