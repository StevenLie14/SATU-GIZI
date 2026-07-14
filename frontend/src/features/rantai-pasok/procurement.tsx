import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Sparkles,
  Star,
  MapPin,
  CheckCircle2,
  Truck,
  Package,
  Zap,
} from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
  Tabs,
  Modal,
  Field,
  TextInput,
  Select,
  SectionTitle,
  useToast,
  formatRupiah,
  cn,
  type Column,
} from "@/components/ui";
import { purchaseOrders, matchRecommendations, type PurchaseOrder, type MatchRec } from "@/mocks/mbg-data";
import {
  createPurchaseOrder,
  getMatchRecommendations,
  getPurchaseOrders,
  updatePurchaseOrder,
} from "@/services/procurement-service";
import MatchmakingPanel from "@/features/rantai-pasok/matchmaking-panel";

const statusColor: Record<PurchaseOrder["status"], "green" | "blue" | "amber" | "gray"> = {
  Diterima: "green",
  Dikirim: "blue",
  "Menunggu Konfirmasi": "amber",
  Draft: "gray",
};

const matchKeys = Object.keys(matchRecommendations);

export default function Procurement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<PurchaseOrder[]>(purchaseOrders);
  const [tab, setTab] = useState("po");
  const [matching, setMatching] = useState(false);
  const [komoditas, setKomoditas] = useState(matchKeys[0]);
  const [qty, setQty] = useState("400");
  const [chosen, setChosen] = useState<MatchRec | null>(null);
  const [recs, setRecs] = useState<MatchRec[]>(matchRecommendations[komoditas] || []);

  useEffect(() => {
    getPurchaseOrders().then(setOrders);
  }, []);
  useEffect(() => {
    getMatchRecommendations(komoditas).then(setRecs);
  }, [komoditas]);

  const totalNilai = orders.reduce((a, o) => a + o.nilai, 0);

  const advance = (o: PurchaseOrder) => {
    const flow: PurchaseOrder["status"][] = ["Draft", "Menunggu Konfirmasi", "Dikirim", "Diterima"];
    const next = flow[Math.min(flow.indexOf(o.status) + 1, flow.length - 1)];
    updatePurchaseOrder(o.id, { status: next });
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: next } : x)));
    toast(`${o.kode} → ${next}`);
  };

  const createPO = () => {
    if (!chosen) {
      toast("Pilih supplier rekomendasi terlebih dahulu.", "error");
      return;
    }
    const q = +qty || 0;
    const po: PurchaseOrder = {
      id: `po${Date.now()}`,
      kode: `PO-${new Date().toISOString().slice(5, 10).replace("-", "")}-${String(orders.length + 1).padStart(3, "0")}`,
      komoditas,
      qty: q,
      satuan: chosen.satuan,
      supplier: chosen.supplier,
      nilai: q * chosen.harga,
      status: "Menunggu Konfirmasi",
      tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    };
    const { id: localId, ...payload } = po;
    createPurchaseOrder(payload).then((saved) => {
      if (saved) setOrders((prev) => prev.map((x) => (x.id === localId ? { ...x, id: saved.id } : x)));
    });
    setOrders((prev) => [po, ...prev]);
    setMatching(false);
    setChosen(null);
    setTab("po");
    toast(`PO untuk ${komoditas} dibuat dengan ${chosen.supplier}.`);
  };

  const columns: Column<PurchaseOrder>[] = [
    { key: "kode", header: "Kode PO", render: (o) => <div><p className="font-bold text-brand-600">{o.kode}</p><p className="text-xs text-gray-400">{o.tanggal}</p></div> },
    { key: "komoditas", header: "Komoditas", render: (o) => <div><p className="font-semibold text-dark-900">{o.komoditas}</p><p className="text-xs text-gray-400">{o.qty.toLocaleString("id-ID")} {o.satuan}</p></div> },
    { key: "supplier", header: "Supplier", render: (o) => <span className="text-sm">{o.supplier}</span> },
    { key: "nilai", header: "Nilai", align: "right", render: (o) => <span className="font-bold text-dark-900">{formatRupiah(o.nilai)}</span> },
    { key: "status", header: "Status", align: "center", render: (o) => <Badge color={statusColor[o.status]} dot>{o.status}</Badge> },
    { key: "action", header: "", align: "right", render: (o) => o.status !== "Diterima" ? <Button size="sm" variant="subtle" onClick={() => advance(o)}>Proses</Button> : <CheckCircle2 className="text-emerald-500 ml-auto" size={18} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Procurement & Supplier Matching"
        subtitle="Kelola pengadaan dan dapatkan rekomendasi supplier terbaik secara cerdas"
        icon={ShoppingCart}
        actions={<Button icon={Sparkles} onClick={() => setMatching(true)}>Smart Matching</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total PO" value={orders.length} icon={ShoppingCart} color="brand" />
        <StatCard label="Menunggu Konfirmasi" value={orders.filter((o) => o.status === "Menunggu Konfirmasi").length} icon={Package} color="amber" />
        <StatCard label="Dalam Pengiriman" value={orders.filter((o) => o.status === "Dikirim").length} icon={Truck} color="blue" />
        <StatCard label="Total Nilai PO" value={formatRupiah(totalNilai)} icon={ShoppingCart} color="purple" />
      </div>

      <div className="mb-5">
        <Tabs
          tabs={[
            { id: "po", label: "Purchase Orders", count: orders.length },
            { id: "match", label: "Supplier Matching" },
            { id: "matchmaking", label: "Peta Matchmaking" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "matchmaking" && <MatchmakingPanel />}

      {tab === "po" && (
        <Card padded={false}>
          <div className="p-2"><DataTable columns={columns} data={orders} /></div>
        </Card>
      )}

      {tab === "match" && (
        <div>
          <Card className="mb-5">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <Field label="Komoditas Dibutuhkan"><Select value={komoditas} onChange={(v) => { setKomoditas(v); setChosen(null); }} options={matchKeys.map((k) => ({ value: k, label: k }))} /></Field>
              <Field label="Jumlah (kg)"><TextInput type="number" value={qty} onChange={setQty} /></Field>
              <Button icon={Zap} onClick={() => toast("Algoritma mencocokkan supplier berdasarkan harga, jarak, dan rating.", "info")}>Jalankan Matching</Button>
            </div>
          </Card>
          <SectionTitle>Rekomendasi Supplier untuk {komoditas}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recs.map((r, i) => (
              <motion.div key={r.supplier} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className={cn("h-full relative", i === 0 && "ring-2 ring-brand-500")}>
                  {i === 0 && <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center gap-1"><Sparkles size={11} /> REKOMENDASI TERBAIK</span>}
                  <div className="flex items-start justify-between mb-3 mt-1">
                    <h3 className="font-bold text-dark-900">{r.supplier}</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-brand-600">{r.skor}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Skor</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-gray-500">Harga</span><span className="font-bold text-dark-900">{formatRupiah(r.harga)}/{r.satuan}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 flex items-center gap-1"><MapPin size={13} /> Jarak</span><span className="font-semibold">{r.jarak}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 flex items-center gap-1"><Star size={13} /> Rating</span><span className="font-semibold text-amber-600">{r.rating}</span></div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl mb-3"><p className="text-xs text-gray-500">{r.alasan}</p></div>
                  <Button className="w-full" variant={chosen?.supplier === r.supplier ? "primary" : "outline"} icon={chosen?.supplier === r.supplier ? CheckCircle2 : undefined} onClick={() => { setChosen(r); setMatching(true); }}>
                    {chosen?.supplier === r.supplier ? "Dipilih" : "Pilih & Buat PO"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={matching}
        onClose={() => setMatching(false)}
        title="Buat Purchase Order"
        subtitle="Konfirmasi pengadaan berdasarkan rekomendasi matching"
        footer={<><Button variant="outline" onClick={() => setMatching(false)}>Batal</Button><Button onClick={createPO}>Terbitkan PO</Button></>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Komoditas"><Select value={komoditas} onChange={(v) => { setKomoditas(v); setChosen(null); }} options={matchKeys.map((k) => ({ value: k, label: k }))} /></Field>
            <Field label="Jumlah (kg)"><TextInput type="number" value={qty} onChange={setQty} /></Field>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Supplier Terpilih</p>
            <div className="space-y-2">
              {recs.map((r) => (
                <button key={r.supplier} onClick={() => setChosen(r)} className={cn("w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors cursor-pointer", chosen?.supplier === r.supplier ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50")}>
                  <div><p className="font-semibold text-dark-900 text-sm">{r.supplier}</p><p className="text-xs text-gray-400">{formatRupiah(r.harga)}/{r.satuan} · skor {r.skor}</p></div>
                  {chosen?.supplier === r.supplier && <CheckCircle2 className="text-brand-600" size={18} />}
                </button>
              ))}
            </div>
          </div>
          {chosen && qty && (
            <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
              <span className="text-sm text-gray-500">Estimasi Total</span>
              <span className="font-bold text-dark-900">{formatRupiah((+qty || 0) * chosen.harga)}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
