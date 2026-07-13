import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Link2,
  FileCheck2,
  Search,
  CheckCircle2,
  Boxes,
  ScrollText,
  Copy,
  Star,
} from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
  SectionTitle,
  Field,
  TextInput,
  useToast,
  shortHash,
  type Column,
} from "@/components/ui";
import { env } from "@/config/env";
import {
  connectWallet,
  getSupplierReputation,
  CONTRACT_ADDRESSES,
  type OnChainRecord,
  type WalletState,
} from "@/lib/blockchain";
import { fetchAuditTrail, verifyOnChain } from "@/services/blockchain-service";

const CONTRACTS = [
  { key: "vendorCredentialRegistry", name: "VendorCredentialRegistry", desc: "NPWP, NIB & sertifikat vendor (BGN)", icon: FileCheck2 },
  { key: "permitRegistry", name: "PermitRegistry", desc: "Registry izin & inspeksi vendor/dapur", icon: ShieldCheck },
  { key: "redistributionLedger", name: "RedistributionLedger", desc: "Ledger transfer stok antarwilayah", icon: Boxes },
  { key: "procurementRFQ", name: "ProcurementRFQ", desc: "RFQ, quote & rating supplier", icon: ScrollText },
] as const;

export default function BlockchainVerifikasi() {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [trail, setTrail] = useState<OnChainRecord[]>([]);
  const reputation = useMemo(() => getSupplierReputation(), []);

  useEffect(() => {
    fetchAuditTrail().then(setTrail);
  }, []);
  const [docInput, setDocInput] = useState("");
  const [docResult, setDocResult] = useState<{ verified: boolean; txHash: string; block: number } | null>(null);

  const addresses = CONTRACT_ADDRESSES[env.chainId] ?? {};

  const connect = async () => {
    setConnecting(true);
    const w = await connectWallet();
    setWallet(w);
    setConnecting(false);
    toast(w.simulated ? "Wallet simulasi terhubung." : `Terhubung: ${shortHash(w.address ?? "")}`);
  };

  const verify = async () => {
    if (!docInput.trim()) {
      toast("Masukkan ID dokumen / hash.", "error");
      return;
    }
    try {
      const res = await verifyOnChain(docInput.trim());
      setDocResult(res);
      toast("Verifikasi selesai — dokumen ditemukan on-chain.");
    } catch {
      toast("Gagal melakukan verifikasi dokumen.", "error");
    }
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast("Disalin ke clipboard.", "info");
  };

  const columns: Column<OnChainRecord & { id: string }>[] = [
    { key: "txHash", header: "Tx Hash", render: (r) => <button onClick={() => copy(r.txHash)} className="font-mono text-xs text-brand-600 hover:underline inline-flex items-center gap-1 cursor-pointer">{shortHash(r.txHash, 8, 6)} <Copy size={11} /></button> },
    { key: "contract", header: "Kontrak", render: (r) => <Badge color="blue">{r.contract}</Badge> },
    { key: "method", header: "Method", render: (r) => <span className="font-mono text-xs text-gray-600">{r.method}()</span> },
    { key: "summary", header: "Keterangan", render: (r) => <div><p className="text-sm text-dark-900">{r.summary}</p><p className="text-[11px] text-gray-400">{r.actor} · {r.timestamp}</p></div> },
    { key: "blockNumber", header: "Block", align: "right", render: (r) => <span className="font-mono text-xs">#{r.blockNumber.toLocaleString("id-ID")}</span> },
    { key: "status", header: "Status", align: "center", render: (r) => <Badge color={r.status === "confirmed" ? "green" : "amber"} dot>{r.status === "confirmed" ? "Terkonfirmasi" : "Pending"}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Verifikasi On-Chain"
        subtitle="Rekam jejak izin, redistribusi & procurement yang tak dapat diubah (immutable) di blockchain"
        icon={ShieldCheck}
        actions={
          wallet ? (
            <Badge color="green" dot>{shortHash(wallet.address ?? "")} {wallet.simulated && "· simulasi"}</Badge>
          ) : (
            <Button icon={Wallet} onClick={connect} disabled={connecting}>{connecting ? "Menghubungkan..." : "Connect Wallet"}</Button>
          )
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Transaksi" value={trail.length} icon={Link2} color="brand" sub={env.chainName} />
        <StatCard label="Smart Contract" value={CONTRACTS.length} icon={ScrollText} color="blue" />
        <StatCard label="Terkonfirmasi" value={trail.filter((t) => t.status === "confirmed").length} icon={CheckCircle2} color="green" />
        <StatCard label="Block Terkini" value={trail.length > 0 ? `#${Math.max(...trail.map((t) => t.blockNumber)).toLocaleString("id-ID")}` : "-"} icon={Boxes} color="purple" />
      </div>

      {/* Smart contracts */}
      <SectionTitle>Smart Contracts Terdeploy</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {CONTRACTS.map((c, i) => (
          <motion.div key={c.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2.5 bg-brand-50 text-brand-600 rounded-xl"><c.icon size={20} /></span>
                <div>
                  <h3 className="font-bold text-dark-900">{c.name}</h3>
                  <Badge color="gray">Solidity ^0.8.24</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">{c.desc}</p>
              <button onClick={() => copy(addresses[c.key] ?? "")} className="w-full flex items-center justify-between gap-2 p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="font-mono text-xs text-gray-600">{shortHash(addresses[c.key] ?? "0x0", 10, 8)}</span>
                <Copy size={13} className="text-gray-400" />
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Document verifier */}
        <Card className="lg:col-span-1">
          <SectionTitle>Verifikasi Dokumen</SectionTitle>
          <p className="text-sm text-gray-500 mb-3">Cek keaslian sertifikat/izin dengan ID atau hash dokumen.</p>
          <Field label="ID Dokumen / Hash">
            <TextInput value={docInput} onChange={setDocInput} placeholder="cth. SLHS/2026/JKT/0112" />
          </Field>
          <Button icon={Search} className="w-full mt-3" onClick={verify}>Verifikasi On-Chain</Button>
          {docResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2"><FileCheck2 className="text-emerald-600" size={18} /><span className="font-bold text-emerald-700 text-sm">Dokumen Terverifikasi</span></div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between"><span>Tx Hash</span><span className="font-mono">{shortHash(docResult.txHash, 8, 6)}</span></div>
                <div className="flex justify-between"><span>Block</span><span className="font-mono">#{docResult.block.toLocaleString("id-ID")}</span></div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Supplier reputation on-chain */}
        <Card className="lg:col-span-2">
          <SectionTitle action={<Badge color="purple" dot>On-Chain Rating</Badge>}>Reputasi Supplier Terverifikasi</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reputation.slice(0, 6).map((r) => (
              <div key={r.supplier} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                <div className="min-w-0">
                  <p className="font-semibold text-dark-900 text-sm truncate">{r.supplier}</p>
                  <p className="font-mono text-[10px] text-gray-400">{shortHash(r.txHash, 6, 4)}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="inline-flex items-center gap-1 font-bold text-amber-600 text-sm"><Star size={13} className="fill-current" /> {r.onChainRating}</p>
                  <p className="text-[10px] text-gray-400">{r.fulfilledOrders} order</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Audit trail */}
      <Card padded={false}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <SectionTitle>Audit Trail (Immutable Ledger)</SectionTitle>
          <Badge color="brand" dot>Live</Badge>
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={trail.map((t) => ({ ...t, id: t.txHash }))} />
        </div>
      </Card>

      <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
        <ShieldCheck size={13} className="text-emerald-500" />
        Mode {wallet?.simulated !== false ? "simulasi" : "live"} — kontrak Solidity tersedia di /blockchain. Hubungkan RPC & deploy untuk data on-chain nyata.
      </p>
    </div>
  );
}
