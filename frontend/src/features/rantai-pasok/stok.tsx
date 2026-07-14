import { useState, useMemo, useEffect } from "react";
import { Boxes, Plus, Minus, AlertTriangle, Warehouse, PackageCheck, CalendarClock } from "lucide-react";
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
  cn,
  type Column,
} from "@/components/ui";
import { DonutChart } from "@/components/charts";
import { stockItems, type StockItem } from "@/mocks/mbg-data";
import { adjustStock, getStockItems } from "@/services/stock-service";

const statusColor: Record<StockItem["status"], "green" | "amber" | "red"> = {
  Aman: "green",
  Menipis: "amber",
  Kritis: "red",
};

const palette = ["#16a34a", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];

function computeStatus(jumlah: number): StockItem["status"] {
  if (jumlah <= 150) return "Kritis";
  if (jumlah <= 400) return "Menipis";
  return "Aman";
}

export default function Stok() {
  const { toast } = useToast();
  const [list, setList] = useState<StockItem[]>(stockItems);
  useEffect(() => {
    getStockItems().then(setList);
  }, []);
  const [query, setQuery] = useState("");
  const [gudang, setGudang] = useState("all");
  const [adjust, setAdjust] = useState<{ item: StockItem; dir: "in" | "out" } | null>(null);
  const [amount, setAmount] = useState("");

  const gudangList = useMemo(() => Array.from(new Set(list.map((s) => s.gudang))), [list]);
  const byKategori = useMemo(() => {
    const map: Record<string, number> = {};
    list.forEach((s) => (map[s.kategori] = (map[s.kategori] || 0) + 1));
    return Object.entries(map).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  }, [list]);

  const filtered = list.filter((s) => {
    if (gudang !== "all" && s.gudang !== gudang) return false;
    if (query && !s.nama.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const applyAdjust = () => {
    if (!adjust || !amount) return;
    const delta = (adjust.dir === "in" ? 1 : -1) * (+amount || 0);
    adjustStock(adjust.item.id, delta);
    setList((prev) =>
      prev.map((s) => {
        if (s.id !== adjust.item.id) return s;
        const jumlah = Math.max(0, s.jumlah + delta);
        return { ...s, jumlah, status: computeStatus(jumlah) };
      }),
    );
    toast(`Stok ${adjust.item.nama} ${adjust.dir === "in" ? "ditambah" : "dikurangi"} ${amount} ${adjust.item.satuan}.`);
    setAdjust(null);
    setAmount("");
  };

  const columns: Column<StockItem>[] = [
    { key: "nama", header: "Item", render: (s) => <div><p className="font-semibold text-dark-900">{s.nama}</p><Badge color="gray">{s.kategori}</Badge></div> },
    { key: "jumlah", header: "Jumlah", align: "right", render: (s) => <span className="font-bold text-dark-900">{s.jumlah.toLocaleString("id-ID")} {s.satuan}</span> },
    { key: "gudang", header: "Gudang", render: (s) => <span className="flex items-center gap-1.5 text-sm"><Warehouse size={13} className="text-gray-400" /> {s.gudang}</span> },
    { key: "kadaluarsa", header: "Kadaluarsa", render: (s) => <span className="flex items-center gap-1.5 text-sm"><CalendarClock size={13} className="text-gray-400" /> {s.kadaluarsa}</span> },
    { key: "status", header: "Status", align: "center", render: (s) => <Badge color={statusColor[s.status]} dot>{s.status}</Badge> },
    {
      key: "action",
      header: "Aksi",
      align: "right",
      render: (s) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => { setAdjust({ item: s, dir: "in" }); setAmount(""); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer" title="Stok masuk"><Plus size={16} /></button>
          <button onClick={() => { setAdjust({ item: s, dir: "out" }); setAmount(""); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer" title="Stok keluar"><Minus size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stok"
        subtitle="Manajemen inventori bahan baku, stok masuk/keluar, dan pemantauan kadaluarsa"
        icon={Boxes}
        actions={<Button icon={PackageCheck} variant="outline" onClick={() => toast("Stock opname dijadwalkan.", "info")}>Stock Opname</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Item" value={list.length} icon={Boxes} color="brand" />
        <StatCard label="Stok Kritis" value={list.filter((s) => s.status === "Kritis").length} icon={AlertTriangle} color="red" />
        <StatCard label="Stok Menipis" value={list.filter((s) => s.status === "Menipis").length} icon={AlertTriangle} color="amber" />
        <StatCard label="Gudang" value={gudangList.length} icon={Warehouse} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padded={false}>
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari item stok" className="flex-1" />
            <Select value={gudang} onChange={setGudang} options={[{ value: "all", label: "Semua Gudang" }, ...gudangList.map((g) => ({ value: g, label: g }))]} />
          </div>
          <div className="p-2"><DataTable columns={columns} data={filtered} /></div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle>Komposisi Stok</SectionTitle>
            <DonutChart segments={byKategori} centerLabel={`${list.length}`} centerSub="item" size={140} />
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <p className="font-bold text-dark-900 flex items-center gap-2 mb-2"><CalendarClock size={16} className="text-amber-600" /> Mendekati Kadaluarsa</p>
            <div className="space-y-2">
              {list.filter((s) => ["26 Jun 2026", "28 Jun 2026", "30 Jun 2026", "05 Jul 2026"].includes(s.kadaluarsa)).map((s) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{s.nama}</span>
                  <span className={cn("font-semibold", s.kadaluarsa.includes("26 Jun") ? "text-red-600" : "text-amber-600")}>{s.kadaluarsa}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={!!adjust}
        onClose={() => setAdjust(null)}
        title={adjust?.dir === "in" ? "Stok Masuk" : "Stok Keluar"}
        subtitle={adjust ? `${adjust.item.nama} · saat ini ${adjust.item.jumlah.toLocaleString("id-ID")} ${adjust.item.satuan}` : ""}
        footer={<><Button variant="outline" onClick={() => setAdjust(null)}>Batal</Button><Button onClick={applyAdjust}>Simpan</Button></>}
      >
        {adjust && (
          <Field label={`Jumlah (${adjust.item.satuan})`} required>
            <TextInput type="number" value={amount} onChange={setAmount} placeholder="0" />
          </Field>
        )}
      </Modal>
    </div>
  );
}
