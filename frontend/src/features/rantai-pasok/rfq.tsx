import { useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Plus,
  Sparkles,
  Star,
  MapPin,
  Clock,
  Trophy,
  ShieldCheck,
  Package,
  Send,
} from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  Tabs,
  Modal,
  Field,
  TextInput,
  Select,
  DataTable,
  useToast,
  formatRupiah,
  cn,
  type Column,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { scoreSupplierMatch } from "@/services/ai-service";
import { anchorRecord } from "@/lib/blockchain";
import { rfqs as seedRfqs, catalogItems, localProducers, type Rfq, type Quote, type CatalogItem } from "@/mocks/rfq-data";

const statusColor: Record<Rfq["status"], "blue" | "amber" | "green" | "gray"> = {
  Terbuka: "blue",
  Evaluasi: "amber",
  Diputuskan: "green",
  Ditutup: "gray",
};

function quoteScore(q: Quote) {
  return scoreSupplierMatch({
    priceIndex: q.priceIndex,
    distanceKm: q.jarakKm,
    rating: q.rating,
    leadTimeDays: q.leadTimeDays,
    reliability: q.reliability,
  });
}

export default function Rfq() {
  const { role } = useRole();
  const { toast } = useToast();
  const isBuyer = role === "pemerintah" || role === "sppg";
  const [list, setList] = useState<Rfq[]>(seedRfqs);
  const [tab, setTab] = useState("rfq");
  const [open, setOpen] = useState<Rfq | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ komoditas: catalogItems[0].nama, qty: "", deadline: "" });

  const totalQuotes = list.reduce((a, r) => a + r.quotes.length, 0);

  const award = (rfq: Rfq, q: Quote) => {
    const rec = anchorRecord("ProcurementRFQ", "awardQuote", `${rfq.kode} → ${q.supplier}`);
    setList((prev) => prev.map((r) => (r.id === rfq.id ? { ...r, status: "Diputuskan", awardedTo: q.supplier } : r)));
    setOpen((o) => (o && o.id === rfq.id ? { ...o, status: "Diputuskan", awardedTo: q.supplier } : o));
    toast(`Dimenangkan ${q.supplier}. Tercatat on-chain ${rec.txHash.slice(0, 10)}…`);
  };

  const createRfq = () => {
    if (!form.qty) {
      toast("Jumlah wajib diisi.", "error");
      return;
    }
    const cat = catalogItems.find((c) => c.nama === form.komoditas)!;
    const rec = anchorRecord("ProcurementRFQ", "createRFQ", `${form.komoditas} ${form.qty} ${cat.satuan}`);
    setList((prev) => [
      {
        id: `rfq${Date.now()}`,
        kode: `RFQ-${new Date().toISOString().slice(5, 10).replace("-", "")}-${String(prev.length + 13).padStart(3, "0")}`,
        komoditas: form.komoditas,
        qty: +form.qty,
        satuan: cat.satuan,
        buyer: role === "sppg" ? "SPPG Dapur Pusat Senen" : "Pemerintah Pusat",
        deadline: form.deadline || "—",
        status: "Terbuka",
        quotes: [],
      },
      ...prev,
    ]);
    setCreating(false);
    setForm({ komoditas: catalogItems[0].nama, qty: "", deadline: "" });
    toast(`RFQ diterbitkan & dianchor on-chain ${rec.txHash.slice(0, 10)}…`);
  };

  const catalogColumns: Column<CatalogItem>[] = [
    { key: "nama", header: "Bahan Baku", render: (c) => <div><p className="font-semibold text-dark-900">{c.nama}</p><Badge color="gray">{c.kategori}</Badge></div> },
    { key: "hargaRef", header: "Harga Referensi", align: "right", render: (c) => <span>{formatRupiah(c.hargaRef)}/{c.satuan}</span> },
    { key: "supplierAktif", header: "Supplier Aktif", align: "center", render: (c) => <Badge color="blue">{c.supplierAktif}</Badge> },
    { key: "ratingRata", header: "Rating", align: "right", render: (c) => <span className="inline-flex items-center gap-1 font-semibold text-amber-600"><Star size={13} className="fill-current" /> {c.ratingRata}</span> },
    { key: "lokasiTerdekat", header: "Terdekat", render: (c) => <span className="flex items-center gap-1 text-sm"><MapPin size={12} className="text-gray-400" /> {c.lokasiTerdekat}</span> },
    { key: "action", header: "", align: "right", render: (c) => isBuyer && <Button size="sm" variant="subtle" icon={Send} onClick={() => { setForm({ komoditas: c.nama, qty: "", deadline: "" }); setCreating(true); }}>RFQ</Button> },
  ];

  return (
    <div>
      <PageHeader
        title="B2B Marketplace & RFQ"
        subtitle="Matchmaking bahan baku: katalog terintegrasi, RFQ digital, dan rekomendasi AI"
        icon={Store}
        actions={isBuyer && <Button icon={Plus} onClick={() => setCreating(true)}>Buat RFQ</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="RFQ Aktif" value={list.filter((r) => r.status !== "Diputuskan" && r.status !== "Ditutup").length} icon={Store} color="brand" />
        <StatCard label="Total Penawaran" value={totalQuotes} icon={Package} color="blue" />
        <StatCard label="Item Katalog" value={catalogItems.length} icon={Package} color="amber" />
        <StatCard label="Sudah Diputuskan" value={list.filter((r) => r.status === "Diputuskan").length} icon={Trophy} color="green" />
      </div>

      <div className="mb-5">
        <Tabs
          tabs={[
            { id: "rfq", label: "RFQ & Penawaran", count: list.length },
            { id: "katalog", label: "Katalog Bahan Baku", count: catalogItems.length },
            { id: "umkm", label: "Produsen Lokal & UMKM", count: localProducers.length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "rfq" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((r, i) => {
            const best = r.quotes.length ? [...r.quotes].sort((a, b) => quoteScore(b).score - quoteScore(a).score)[0] : null;
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" >
                  <div onClick={() => setOpen(r)}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold text-brand-600">{r.kode}</p>
                        <h3 className="font-bold text-dark-900">{r.komoditas}</h3>
                      </div>
                      <Badge color={statusColor[r.status]} dot>{r.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Package size={12} /> {r.qty.toLocaleString("id-ID")} {r.satuan}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {r.deadline}</span>
                    </div>
                    {r.awardedTo ? (
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <Trophy size={14} className="text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">{r.awardedTo}</span>
                      </div>
                    ) : best ? (
                      <div className="p-2.5 bg-brand-50 rounded-xl border border-brand-100">
                        <p className="text-[10px] text-brand-700 font-bold uppercase flex items-center gap-1"><Sparkles size={11} /> Rekomendasi AI</p>
                        <p className="text-sm font-semibold text-dark-900 mt-0.5">{best.supplier} · skor {quoteScore(best).score}</p>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">Belum ada penawaran</div>
                    )}
                    <p className="text-[11px] text-gray-400 mt-3">{r.quotes.length} penawaran masuk · klik untuk detail</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "katalog" && (
        <Card padded={false}>
          <div className="p-2"><DataTable columns={catalogColumns} data={catalogItems} /></div>
        </Card>
      )}

      {tab === "umkm" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard label="Produsen Lokal" value={localProducers.length} icon={Store} color="brand" />
            <StatCard label="Mitra Aktif" value={localProducers.filter((p) => p.status === "Mitra Aktif").length} icon={Trophy} color="green" />
            <StatCard label="UMKM Diberdayakan" value={localProducers.filter((p) => p.isUMKM).length} icon={Sparkles} color="amber" />
            <StatCard label="Lapangan Kerja" value={localProducers.reduce((a, p) => a + p.tenagaKerja, 0).toLocaleString("id-ID")} icon={Package} color="purple" sub="tenaga kerja terdukung" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {localProducers.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-dark-900 truncate">{p.nama}</h3>
                      <p className="text-xs text-gray-400">{p.jenis} · {p.lokasi}</p>
                    </div>
                    {p.isUMKM && <Badge color="amber">UMKM</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {p.komoditas.map((k) => <span key={k} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{k}</span>)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="p-2 bg-gray-50 rounded-xl"><p className="text-[10px] text-gray-400 uppercase font-bold">Kapasitas</p><p className="text-xs font-bold text-dark-900">{p.kapasitasBulanan}</p></div>
                    <div className="p-2 bg-gray-50 rounded-xl"><p className="text-[10px] text-gray-400 uppercase font-bold">Rating</p><p className="text-xs font-bold text-amber-600 inline-flex items-center gap-0.5"><Star size={11} className="fill-current" />{p.rating}</p></div>
                    <div className="p-2 bg-gray-50 rounded-xl"><p className="text-[10px] text-gray-400 uppercase font-bold">Pekerja</p><p className="text-xs font-bold text-dark-900">{p.tenagaKerja}</p></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge color={p.status === "Mitra Aktif" ? "green" : "blue"} dot>{p.status}</Badge>
                    {isBuyer && (
                      <Button size="sm" variant="subtle" icon={Send} onClick={() => toast(`Undangan kemitraan dikirim ke ${p.nama}.`)}>
                        {p.status === "Mitra Aktif" ? "Buat RFQ" : "Ajak Bermitra"}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* RFQ detail modal with AI-scored quotes */}
      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? `${open.kode} — ${open.komoditas}` : ""}
        subtitle={open ? `${open.qty.toLocaleString("id-ID")} ${open.satuan} · ${open.buyer} · deadline ${open.deadline}` : ""}
        size="lg"
      >
        {open && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Sparkles size={15} className="text-brand-600" /> Penawaran diperingkat otomatis oleh AI (harga, jarak, rating, lead time, reliabilitas).
            </div>
            {[...open.quotes]
              .sort((a, b) => quoteScore(b).score - quoteScore(a).score)
              .map((q, idx) => {
                const sc = quoteScore(q);
                const isWinner = open.awardedTo === q.supplier;
                return (
                  <div key={q.id} className={cn("p-4 rounded-2xl border", idx === 0 && !open.awardedTo ? "border-brand-500 bg-brand-50/40" : isWinner ? "border-emerald-500 bg-emerald-50/40" : "border-gray-200")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-dark-900">{q.supplier}</h4>
                          {idx === 0 && !open.awardedTo && <Badge color="brand"><Sparkles size={11} /> Terbaik</Badge>}
                          {isWinner && <Badge color="green"><Trophy size={11} /> Pemenang</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1.5">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {q.lokasi} · {q.jarakKm} km</span>
                          <span className="flex items-center gap-1"><Star size={12} className="text-amber-500" /> {q.rating}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {q.leadTimeDays} hari</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {sc.reasons.map((r) => <span key={r} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{r}</span>)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-dark-900">{formatRupiah(q.hargaSatuan)}</p>
                        <p className="text-[10px] text-gray-400">/{open.satuan}</p>
                        <div className="mt-1 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white font-bold">{sc.score}</div>
                      </div>
                    </div>
                    {isBuyer && !open.awardedTo && (
                      <Button size="sm" className="w-full mt-3" icon={ShieldCheck} onClick={() => award(open, q)}>Menangkan & Catat On-Chain</Button>
                    )}
                  </div>
                );
              })}
            {open.quotes.length === 0 && <p className="text-center text-sm text-gray-400 py-8">Belum ada penawaran untuk RFQ ini.</p>}
          </div>
        )}
      </Modal>

      {/* Create RFQ */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Buat RFQ Baru" subtitle="Permintaan penawaran akan dicatat on-chain" footer={<><Button variant="outline" onClick={() => setCreating(false)}>Batal</Button><Button onClick={createRfq}>Terbitkan RFQ</Button></>}>
        <div className="space-y-4">
          <Field label="Komoditas"><Select value={form.komoditas} onChange={(v) => setForm({ ...form, komoditas: v })} options={catalogItems.map((c) => ({ value: c.nama, label: c.nama }))} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Jumlah" required><TextInput type="number" value={form.qty} onChange={(v) => setForm({ ...form, qty: v })} placeholder="0" /></Field>
            <Field label="Deadline"><TextInput value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} placeholder="cth. 30 Jun 2026" /></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
