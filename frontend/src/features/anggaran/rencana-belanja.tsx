import { useState, useMemo, useEffect } from "react";
import { Wallet, Plus, Check, X, Pencil, Trash2, FileDown, PieChart } from "lucide-react";
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
} from "@/components/ui";
import { DonutChart } from "@/components/charts";
import { useRole } from "@/context/role-context";
import { budgetItems, type BudgetItem } from "@/mocks/mbg-data";
import { createBudgetItem, getBudgetItems, setBudgetItemStatus } from "@/services/budget-service";

const statusColor: Record<BudgetItem["status"], "green" | "amber" | "red"> = {
  Disetujui: "green",
  Menunggu: "amber",
  Revisi: "red",
};

const palette = ["#16a34a", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4", "#ef4444"];

export default function RencanaBelanja() {
  const { role } = useRole();
  const { toast } = useToast();
  const isGov = role === "pemerintah";
  const [items, setItems] = useState<BudgetItem[]>(budgetItems);
  useEffect(() => {
    getBudgetItems().then((rows) => rows.length && setItems(rows));
  }, []);
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("all");
  const [modal, setModal] = useState<{ mode: "add" | "edit"; data?: BudgetItem } | null>(null);
  const [form, setForm] = useState({ kategori: "", item: "", qty: "", satuan: "kg", hargaSatuan: "" });

  const total = (b: BudgetItem) => b.qty * b.hargaSatuan;
  const grandTotal = items.reduce((a, b) => a + total(b), 0);
  const approved = items.filter((b) => b.status === "Disetujui").reduce((a, b) => a + total(b), 0);
  const pending = items.filter((b) => b.status === "Menunggu").reduce((a, b) => a + total(b), 0);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.kategori))), [items]);

  const donutSegments = useMemo(() => {
    const byCat: Record<string, number> = {};
    items.forEach((i) => (byCat[i.kategori] = (byCat[i.kategori] || 0) + total(i)));
    return Object.entries(byCat).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  }, [items]);

  const filtered = items.filter((b) => {
    if (kategori !== "all" && b.kategori !== kategori) return false;
    if (query && !b.item.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const openAdd = () => {
    setForm({ kategori: "", item: "", qty: "", satuan: "kg", hargaSatuan: "" });
    setModal({ mode: "add" });
  };
  const openEdit = (b: BudgetItem) => {
    setForm({ kategori: b.kategori, item: b.item, qty: String(b.qty), satuan: b.satuan, hargaSatuan: String(b.hargaSatuan) });
    setModal({ mode: "edit", data: b });
  };

  const save = () => {
    if (!form.item || !form.qty || !form.hargaSatuan) {
      toast("Lengkapi item, qty, dan harga.", "error");
      return;
    }
    if (modal?.mode === "edit" && modal.data) {
      setItems((prev) =>
        prev.map((x) =>
          x.id === modal.data!.id
            ? { ...x, kategori: form.kategori || x.kategori, item: form.item, qty: +form.qty, satuan: form.satuan, hargaSatuan: +form.hargaSatuan, status: "Menunggu" }
            : x,
        ),
      );
      toast("Item belanja diperbarui.");
    } else {
      const item: BudgetItem = { id: `b${Date.now()}`, kategori: form.kategori || "Lainnya", item: form.item, qty: +form.qty, satuan: form.satuan, hargaSatuan: +form.hargaSatuan, periode: "Juni 2026", status: "Menunggu" };
      const { id: localId, ...payload } = item;
      createBudgetItem(payload).then((saved) => {
        if (saved) setItems((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
      });
      setItems((prev) => [item, ...prev]);
      toast("Item belanja ditambahkan.");
    }
    setModal(null);
  };

  const setStatus = (b: BudgetItem, status: BudgetItem["status"]) => {
    setBudgetItemStatus(b.id, status);
    setItems((prev) => prev.map((x) => (x.id === b.id ? { ...x, status } : x)));
    toast(`${b.item} ditandai "${status}".`);
  };

  const remove = (b: BudgetItem) => {
    setItems((prev) => prev.filter((x) => x.id !== b.id));
    toast("Item dihapus.", "info");
  };

  const columns: Column<BudgetItem>[] = [
    { key: "item", header: "Item", render: (b) => <div><p className="font-semibold text-dark-900">{b.item}</p><p className="text-xs text-gray-400">{b.kategori}</p></div> },
    { key: "qty", header: "Qty", align: "right", render: (b) => <span>{b.qty.toLocaleString("id-ID")} {b.satuan}</span> },
    { key: "harga", header: "Harga Satuan", align: "right", render: (b) => formatRupiah(b.hargaSatuan) },
    { key: "total", header: "Total", align: "right", render: (b) => <span className="font-bold text-dark-900">{formatRupiah(total(b))}</span> },
    { key: "status", header: "Status", align: "center", render: (b) => <Badge color={statusColor[b.status]} dot>{b.status}</Badge> },
    {
      key: "action",
      header: "Aksi",
      align: "right",
      render: (b) => (
        <div className="flex items-center justify-end gap-1">
          {isGov && b.status !== "Disetujui" && (
            <button onClick={() => setStatus(b, "Disetujui")} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer" title="Setujui"><Check size={16} /></button>
          )}
          {isGov && b.status !== "Revisi" && (
            <button onClick={() => setStatus(b, "Revisi")} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer" title="Minta Revisi"><X size={16} /></button>
          )}
          <button onClick={() => openEdit(b)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer" title="Ubah"><Pencil size={16} /></button>
          <button onClick={() => remove(b)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer" title="Hapus"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Rencana Belanja"
        subtitle="Susun dan ajukan rencana belanja bahan baku & operasional dapur"
        icon={Wallet}
        actions={
          <>
            <Button variant="outline" icon={FileDown} onClick={() => toast("Rencana belanja diekspor ke Excel.", "info")}>Ekspor</Button>
            <Button icon={Plus} onClick={openAdd}>Tambah Item</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Rencana" value={formatRupiah(grandTotal)} icon={Wallet} color="brand" sub="Periode Juni 2026" />
        <StatCard label="Disetujui" value={formatRupiah(approved)} icon={Check} color="green" sub={`${Math.round((approved / grandTotal) * 100)}% dari total`} />
        <StatCard label="Menunggu Persetujuan" value={formatRupiah(pending)} icon={PieChart} color="amber" />
        <StatCard label="Jumlah Item" value={items.length} icon={Plus} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padded={false}>
            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
              <SearchInput value={query} onChange={setQuery} placeholder="Cari item belanja" className="flex-1" />
              <Select value={kategori} onChange={setKategori} options={[{ value: "all", label: "Semua Kategori" }, ...categories.map((c) => ({ value: c, label: c }))]} />
            </div>
            <div className="p-2">
              <DataTable columns={columns} data={filtered} empty="Belum ada item belanja." />
            </div>
          </Card>
        </div>

        <Card>
          <SectionTitle>Alokasi per Kategori</SectionTitle>
          <DonutChart segments={donutSegments} centerLabel={`${categories.length}`} centerSub="kategori" />
          <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-100">
            <p className="text-xs font-semibold text-brand-700">Biaya per Porsi (estimasi)</p>
            <p className="text-2xl font-bold text-dark-900 mt-1">{formatRupiah(Math.round(grandTotal / 2750 / 20))}</p>
            <p className="text-xs text-gray-500 mt-1">Berdasarkan ±2.750 porsi/hari × 20 hari kerja</p>
          </div>
        </Card>
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "edit" ? "Ubah Item Belanja" : "Tambah Item Belanja"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>Batal</Button>
            <Button onClick={save}>Simpan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Nama Item" required>
            <TextInput value={form.item} onChange={(v) => setForm({ ...form, item: v })} placeholder="cth. Beras Premium" />
          </Field>
          <Field label="Kategori">
            <TextInput value={form.kategori} onChange={(v) => setForm({ ...form, kategori: v })} placeholder="cth. Karbohidrat" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Qty" required>
              <TextInput type="number" value={form.qty} onChange={(v) => setForm({ ...form, qty: v })} placeholder="0" />
            </Field>
            <Field label="Satuan">
              <TextInput value={form.satuan} onChange={(v) => setForm({ ...form, satuan: v })} placeholder="kg" />
            </Field>
            <Field label="Harga Satuan" required>
              <TextInput type="number" value={form.hargaSatuan} onChange={(v) => setForm({ ...form, hargaSatuan: v })} placeholder="0" />
            </Field>
          </div>
          {form.qty && form.hargaSatuan && (
            <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="font-bold text-dark-900">{formatRupiah(+form.qty * +form.hargaSatuan)}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
