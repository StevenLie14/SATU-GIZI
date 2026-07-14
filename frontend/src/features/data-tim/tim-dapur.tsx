import { useState, useEffect } from "react";
import { ChefHat, Plus, BadgeCheck, Pencil, Users } from "lucide-react";
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
  useToast,
  type Column,
} from "@/components/ui";
import { kitchenStaff, type KitchenStaff } from "@/mocks/mbg-data";
import { createKitchenStaff, getKitchenStaff } from "@/services/kitchen-staff-service";

export default function TimDapur() {
  const { toast } = useToast();
  const [list, setList] = useState<KitchenStaff[]>(kitchenStaff);
  useEffect(() => {
    getKitchenStaff().then((rows) => rows.length && setList(rows));
  }, []);
  const [query, setQuery] = useState("");
  const [dapur, setDapur] = useState("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ nama: "", peran: "Juru Masak", dapur: "SPPG Dapur Pusat Senen", sertifikasi: "" });

  const dapurList = Array.from(new Set(kitchenStaff.map((k) => k.dapur)));

  const filtered = list.filter((k) => {
    if (dapur !== "all" && k.dapur !== dapur) return false;
    if (query && !`${k.nama} ${k.peran}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const save = () => {
    if (!form.nama) {
      toast("Nama wajib diisi.", "error");
      return;
    }
    const localId = `ks${Date.now()}`;
    createKitchenStaff({ nama: form.nama, peran: form.peran, sertifikasi: form.sertifikasi || undefined, status: "Aktif" }).then((saved) => {
      if (saved) setList((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setList((prev) => [{ id: localId, nama: form.nama, peran: form.peran, dapur: form.dapur, sertifikasi: form.sertifikasi || "—", status: "Aktif" }, ...prev]);
    setAdding(false);
    setForm({ nama: "", peran: "Juru Masak", dapur: "SPPG Dapur Pusat Senen", sertifikasi: "" });
    toast("Anggota tim dapur ditambahkan.");
  };

  const columns: Column<KitchenStaff>[] = [
    { key: "nama", header: "Nama", render: (k) => <div className="flex items-center gap-3"><Avatar name={k.nama} color="brand" /><div><p className="font-semibold text-dark-900">{k.nama}</p><p className="text-xs text-gray-400">{k.peran}</p></div></div> },
    { key: "dapur", header: "Dapur", render: (k) => <span className="text-sm">{k.dapur}</span> },
    { key: "sertifikasi", header: "Sertifikasi", render: (k) => <div className="flex flex-wrap gap-1">{k.sertifikasi.split(", ").map((s) => <Badge key={s} color="blue"><BadgeCheck size={11} /> {s}</Badge>)}</div> },
    { key: "status", header: "Status", align: "center", render: (k) => <Badge color={k.status === "Aktif" ? "green" : "amber"} dot>{k.status}</Badge> },
    { key: "action", header: "", align: "right", render: (k) => <button onClick={() => toast(`Edit ${k.nama}.`, "info")} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Pencil size={16} /></button> },
  ];

  return (
    <div>
      <PageHeader
        title="Tim Dapur"
        subtitle="Data SDM dapur SPPG: kepala dapur, ahli gizi, juru masak, dan QC"
        icon={ChefHat}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Tambah Anggota</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Staf" value={list.length} icon={Users} color="brand" />
        <StatCard label="Sedang Aktif" value={list.filter((k) => k.status === "Aktif").length} icon={ChefHat} color="green" />
        <StatCard label="Ahli Gizi" value={list.filter((k) => k.peran.includes("Gizi")).length} icon={BadgeCheck} color="purple" />
        <StatCard label="Bersertifikat HACCP" value={list.filter((k) => k.sertifikasi.includes("HACCP")).length} icon={BadgeCheck} color="blue" />
      </div>

      <Card padded={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari nama / peran" className="flex-1" />
          <Select value={dapur} onChange={setDapur} options={[{ value: "all", label: "Semua Dapur" }, ...dapurList.map((d) => ({ value: d, label: d }))]} />
        </div>
        <div className="p-2"><DataTable columns={columns} data={filtered} /></div>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Tambah Anggota Tim Dapur" footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nama Lengkap" required><TextInput value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Peran"><Select value={form.peran} onChange={(v) => setForm({ ...form, peran: v })} options={[{ value: "Kepala Dapur", label: "Kepala Dapur" }, { value: "Ahli Gizi", label: "Ahli Gizi" }, { value: "Juru Masak", label: "Juru Masak" }, { value: "QC Pangan", label: "QC Pangan" }]} /></Field>
            <Field label="Dapur"><Select value={form.dapur} onChange={(v) => setForm({ ...form, dapur: v })} options={dapurList.map((d) => ({ value: d, label: d }))} /></Field>
          </div>
          <Field label="Sertifikasi" hint="Pisahkan dengan koma"><TextInput value={form.sertifikasi} onChange={(v) => setForm({ ...form, sertifikasi: v })} placeholder="cth. Higiene Pangan, HACCP" /></Field>
        </div>
      </Modal>
    </div>
  );
}
