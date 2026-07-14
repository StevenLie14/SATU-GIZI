import { useState, useMemo, useEffect } from "react";
import { School, Plus, Users, MapPin, Pencil, GraduationCap } from "lucide-react";
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
  SectionTitle,
  useToast,
  type Column,
} from "@/components/ui";
import { BarChart } from "@/components/charts";
import { beneficiaries, type Beneficiary } from "@/mocks/mbg-data";
import { createBeneficiary, getBeneficiaries } from "@/services/beneficiaries-service";

export default function PenerimaManfaat() {
  const { toast } = useToast();
  const [list, setList] = useState<Beneficiary[]>(beneficiaries);
  useEffect(() => {
    getBeneficiaries().then((rows) => rows.length && setList(rows));
  }, []);
  const [query, setQuery] = useState("");
  const [jenjang, setJenjang] = useState("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ sekolah: "", jenjang: "SD", alamat: "", siswa: "", dapur: "SPPG Dapur Pusat Senen" });

  const totalSiswa = list.reduce((a, b) => a + b.siswa, 0);
  const dapurList = useMemo(() => Array.from(new Set(list.map((b) => b.dapur))), [list]);

  const byDapur = useMemo(() => {
    const map: Record<string, number> = {};
    list.forEach((b) => (map[b.dapur] = (map[b.dapur] || 0) + b.siswa));
    return Object.entries(map).map(([label, value]) => ({ label: label.replace("SPPG Dapur ", ""), value }));
  }, [list]);

  const filtered = list.filter((b) => {
    if (jenjang !== "all" && b.jenjang !== jenjang) return false;
    if (query && !`${b.sekolah} ${b.alamat}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const save = () => {
    if (!form.sekolah || !form.siswa) {
      toast("Nama sekolah dan jumlah siswa wajib diisi.", "error");
      return;
    }
    const localId = `be${Date.now()}`;
    // Koordinat default Jakarta — form ini tidak meminta lat/lng.
    createBeneficiary({
      name: form.sekolah,
      address: form.alamat || "—",
      jenjang: form.jenjang,
      students: +form.siswa,
      latitude: -6.2,
      longitude: 106.816666,
      capacity: +form.siswa,
    }).then((saved) => {
      if (saved) setList((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setList((prev) => [{ id: localId, sekolah: form.sekolah, jenjang: form.jenjang, alamat: form.alamat || "—", siswa: +form.siswa, dapur: form.dapur, status: "Pending" }, ...prev]);
    setAdding(false);
    setForm({ sekolah: "", jenjang: "SD", alamat: "", siswa: "", dapur: "SPPG Dapur Pusat Senen" });
    toast("Sekolah penerima manfaat ditambahkan.");
  };

  const columns: Column<Beneficiary>[] = [
    { key: "sekolah", header: "Sekolah", render: (b) => <div className="flex items-center gap-3"><span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><School size={16} /></span><div><p className="font-semibold text-dark-900">{b.sekolah}</p><p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> {b.alamat}</p></div></div> },
    { key: "jenjang", header: "Jenjang", align: "center", render: (b) => <Badge color="blue">{b.jenjang}</Badge> },
    { key: "siswa", header: "Jumlah Siswa", align: "right", render: (b) => <span className="font-bold text-dark-900">{b.siswa.toLocaleString("id-ID")}</span> },
    { key: "dapur", header: "Dapur Pelayan", render: (b) => <span className="text-xs">{b.dapur}</span> },
    { key: "status", header: "Status", align: "center", render: (b) => <Badge color={b.status === "Aktif" ? "green" : "amber"} dot>{b.status}</Badge> },
    { key: "action", header: "", align: "right", render: (b) => <button onClick={() => toast(`Edit ${b.sekolah}.`, "info")} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Pencil size={16} /></button> },
  ];

  return (
    <div>
      <PageHeader
        title="Penerima Manfaat"
        subtitle="Data sekolah dan siswa penerima Makan Bergizi Gratis"
        icon={School}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Tambah Sekolah</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Sekolah Penerima" value={list.length} icon={School} color="brand" />
        <StatCard label="Total Siswa" value={totalSiswa.toLocaleString("id-ID")} icon={Users} color="blue" sub="Penerima manfaat aktif" />
        <StatCard label="Jenjang SD" value={list.filter((b) => b.jenjang === "SD").length} icon={GraduationCap} color="green" />
        <StatCard label="Jenjang SMP" value={list.filter((b) => b.jenjang === "SMP").length} icon={GraduationCap} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padded={false}>
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari sekolah / alamat" className="flex-1" />
            <Select value={jenjang} onChange={setJenjang} options={[{ value: "all", label: "Semua Jenjang" }, { value: "SD", label: "SD" }, { value: "SMP", label: "SMP" }, { value: "SMA", label: "SMA" }]} />
          </div>
          <div className="p-2"><DataTable columns={columns} data={filtered} /></div>
        </Card>

        <Card>
          <SectionTitle>Distribusi Siswa per Dapur</SectionTitle>
          <BarChart data={byDapur} unit=" siswa" />
          <div className="mt-4 space-y-2">
            {dapurList.map((d) => (
              <div key={d} className="flex justify-between text-sm">
                <span className="text-gray-500">{d.replace("SPPG Dapur ", "")}</span>
                <span className="font-semibold text-dark-900">{list.filter((b) => b.dapur === d).length} sekolah</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Tambah Sekolah Penerima" footer={<><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
        <div className="space-y-4">
          <Field label="Nama Sekolah" required><TextInput value={form.sekolah} onChange={(v) => setForm({ ...form, sekolah: v })} placeholder="cth. SDN Menteng 01" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Jenjang"><Select value={form.jenjang} onChange={(v) => setForm({ ...form, jenjang: v })} options={[{ value: "SD", label: "SD" }, { value: "SMP", label: "SMP" }, { value: "SMA", label: "SMA" }]} /></Field>
            <Field label="Jumlah Siswa" required><TextInput type="number" value={form.siswa} onChange={(v) => setForm({ ...form, siswa: v })} placeholder="0" /></Field>
          </div>
          <Field label="Alamat"><TextInput value={form.alamat} onChange={(v) => setForm({ ...form, alamat: v })} /></Field>
          <Field label="Dapur Pelayan"><Select value={form.dapur} onChange={(v) => setForm({ ...form, dapur: v })} options={dapurList.map((d) => ({ value: d, label: d }))} /></Field>
        </div>
      </Modal>
    </div>
  );
}
