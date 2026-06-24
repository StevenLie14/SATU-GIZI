import { useState, useMemo } from "react";
import { Carrot, Plus, Calculator, Trash2, Pencil, Package } from "lucide-react";
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
  formatRupiah,
  type Column,
} from "../../ui";
import { DonutChart } from "../../charts";
import { ingredients, type Ingredient } from "../../data";

const palette = ["#16a34a", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];

export default function BahanBaku() {
  const { toast } = useToast();
  const [list, setList] = useState<Ingredient[]>(ingredients);
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("all");
  const [porsi, setPorsi] = useState(2750);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data?: Ingredient } | null>(null);
  const [form, setForm] = useState({ nama: "", kategori: "", perPorsi: "", satuan: "gram", hargaSatuan: "", supplier: "" });

  const categories = useMemo(() => Array.from(new Set(list.map((i) => i.kategori))), [list]);
  const costPerPortion = list.reduce((a, i) => a + i.perPorsi * i.hargaSatuan, 0);

  const donut = useMemo(() => {
    const byCat: Record<string, number> = {};
    list.forEach((i) => (byCat[i.kategori] = (byCat[i.kategori] || 0) + i.perPorsi * i.hargaSatuan));
    return Object.entries(byCat).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  }, [list]);

  const filtered = list.filter((i) => {
    if (kategori !== "all" && i.kategori !== kategori) return false;
    if (query && !i.nama.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const save = () => {
    if (!form.nama || !form.perPorsi || !form.hargaSatuan) {
      toast("Lengkapi nama, takaran, dan harga.", "error");
      return;
    }
    if (modal?.mode === "edit" && modal.data) {
      setList((prev) => prev.map((x) => (x.id === modal.data!.id ? { ...x, nama: form.nama, kategori: form.kategori || x.kategori, perPorsi: +form.perPorsi, satuan: form.satuan, hargaSatuan: +form.hargaSatuan, supplier: form.supplier || x.supplier } : x)));
      toast("Bahan baku diperbarui.");
    } else {
      setList((prev) => [...prev, { id: `i${Date.now()}`, nama: form.nama, kategori: form.kategori || "Lainnya", perPorsi: +form.perPorsi, satuan: form.satuan, hargaSatuan: +form.hargaSatuan, supplier: form.supplier || "—" }]);
      toast("Bahan baku ditambahkan.");
    }
    setModal(null);
  };

  const openAdd = () => { setForm({ nama: "", kategori: "", perPorsi: "", satuan: "gram", hargaSatuan: "", supplier: "" }); setModal({ mode: "add" }); };
  const openEdit = (i: Ingredient) => { setForm({ nama: i.nama, kategori: i.kategori, perPorsi: String(i.perPorsi), satuan: i.satuan, hargaSatuan: String(i.hargaSatuan), supplier: i.supplier }); setModal({ mode: "edit", data: i }); };

  const columns: Column<Ingredient>[] = [
    { key: "nama", header: "Bahan", render: (i) => <div><p className="font-semibold text-dark-900">{i.nama}</p><Badge color="gray">{i.kategori}</Badge></div> },
    { key: "perPorsi", header: "Takaran/Porsi", align: "right", render: (i) => <span>{i.perPorsi} {i.satuan}</span> },
    { key: "harga", header: "Harga/Satuan", align: "right", render: (i) => formatRupiah(i.hargaSatuan) },
    { key: "biaya", header: "Biaya/Porsi", align: "right", render: (i) => <span className="font-bold text-dark-900">{formatRupiah(i.perPorsi * i.hargaSatuan)}</span> },
    { key: "kebutuhan", header: `Kebutuhan (${porsi.toLocaleString("id-ID")} porsi)`, align: "right", render: (i) => <span className="text-brand-600 font-semibold">{(i.perPorsi * porsi).toLocaleString("id-ID")} {i.satuan}</span> },
    { key: "supplier", header: "Supplier", render: (i) => <span className="text-xs">{i.supplier}</span> },
    { key: "action", header: "", align: "right", render: (i) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => openEdit(i)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"><Pencil size={15} /></button>
        <button onClick={() => { setList((prev) => prev.filter((x) => x.id !== i.id)); toast("Bahan dihapus.", "info"); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={15} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader
        title="Bahan Baku & Komposisi"
        subtitle="Kelola resep, takaran per porsi, dan kalkulasi kebutuhan bahan baku"
        icon={Carrot}
        actions={<Button icon={Plus} onClick={openAdd}>Tambah Bahan</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Jenis Bahan" value={list.length} icon={Carrot} color="brand" />
        <StatCard label="Biaya per Porsi" value={formatRupiah(costPerPortion)} icon={Calculator} color="amber" sub="Total komposisi" />
        <StatCard label="Estimasi Biaya Harian" value={formatRupiah(costPerPortion * porsi)} icon={Package} color="purple" sub={`${porsi.toLocaleString("id-ID")} porsi`} />
        <StatCard label="Kategori Bahan" value={categories.length} icon={Carrot} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padded={false}>
            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
              <SearchInput value={query} onChange={setQuery} placeholder="Cari bahan baku" className="flex-1" />
              <Select value={kategori} onChange={setKategori} options={[{ value: "all", label: "Semua Kategori" }, ...categories.map((c) => ({ value: c, label: c }))]} />
            </div>
            <div className="p-2">
              <DataTable columns={columns} data={filtered} empty="Belum ada bahan baku." />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <SectionTitle>Kalkulator Kebutuhan</SectionTitle>
            <Field label="Jumlah Porsi Target">
              <TextInput type="number" value={porsi} onChange={(v) => setPorsi(+v || 0)} />
            </Field>
            <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
              <p className="text-xs text-brand-700 font-semibold">Total Biaya Bahan</p>
              <p className="text-2xl font-bold text-dark-900 mt-1">{formatRupiah(costPerPortion * porsi)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatRupiah(costPerPortion)} × {porsi.toLocaleString("id-ID")} porsi</p>
            </div>
          </Card>
          <Card>
            <SectionTitle>Komposisi Biaya</SectionTitle>
            <DonutChart segments={donut} centerLabel={formatRupiah(costPerPortion).replace("Rp", "")} centerSub="/porsi" size={140} />
          </Card>
        </div>
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Ubah Bahan Baku" : "Tambah Bahan Baku"}
        footer={<><Button variant="outline" onClick={() => setModal(null)}>Batal</Button><Button onClick={save}>Simpan</Button></>}
      >
        <div className="space-y-4">
          <Field label="Nama Bahan" required><TextInput value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} placeholder="cth. Beras" /></Field>
          <Field label="Kategori"><TextInput value={form.kategori} onChange={(v) => setForm({ ...form, kategori: v })} placeholder="cth. Karbohidrat" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Per Porsi" required><TextInput type="number" value={form.perPorsi} onChange={(v) => setForm({ ...form, perPorsi: v })} placeholder="0" /></Field>
            <Field label="Satuan"><TextInput value={form.satuan} onChange={(v) => setForm({ ...form, satuan: v })} /></Field>
            <Field label="Harga/Satuan" required><TextInput type="number" value={form.hargaSatuan} onChange={(v) => setForm({ ...form, hargaSatuan: v })} placeholder="0" /></Field>
          </div>
          <Field label="Supplier"><TextInput value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} placeholder="cth. PT Maju Tani Pangan" /></Field>
        </div>
      </Modal>
    </div>
  );
}
