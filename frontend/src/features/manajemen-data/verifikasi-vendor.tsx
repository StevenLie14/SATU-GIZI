import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  ShieldCheck,
  FileText,
  Link2,
  Landmark,
  Store,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Eye,
  MapPin,
  User,
  CreditCard,
  ScrollText,
  Sparkles,
} from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  Tabs,
  Drawer,
  Progress,
  SearchInput,
  SectionTitle,
  useToast,
  cn,
  shortHash,
} from "@/components/ui";
import { useRole } from "@/context/role-context";
import { verifyHash } from "@/lib/blockchain";
import {
  type VendorVerification,
  type VerifStatus,
} from "@/mocks/vendor-verification";
import {
  getVendors,
  approveVendor,
  addCertificate,
} from "@/services/vendor-verification-service";

const statusColor: Record<VerifStatus, "green" | "amber" | "blue" | "red"> = {
  Terverifikasi: "green",
  Proses: "blue",
  "Dokumen Kurang": "amber",
  Ditolak: "red",
};

const certColor = { Valid: "green", Proses: "amber", Kadaluarsa: "red" } as const;

export default function VerifikasiVendor() {
  const { role } = useRole();
  const { toast } = useToast();
  const isBGN = role === "pemerintah";
  const [list, setList] = useState<VendorVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendors().then((data) => {
      setList(data);
      setLoading(false);
    });
  }, []);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [view, setView] = useState<VendorVerification | null>(null);
  const [drawerTab, setDrawerTab] = useState("usaha");

  const stats = useMemo(
    () => ({
      total: list.length,
      verified: list.filter((v) => v.status === "Terverifikasi").length,
      proses: list.filter((v) => v.status === "Proses" || v.status === "Dokumen Kurang").length,
      umkm: list.filter((v) => v.isUMKM).length,
      compliance: Math.round((list.filter((v) => v.bgnApproved).length / list.length) * 100),
    }),
    [list],
  );

  const filtered = list.filter((v) => {
    if (tab === "verified" && v.status !== "Terverifikasi") return false;
    if (tab === "proses" && !(v.status === "Proses" || v.status === "Dokumen Kurang")) return false;
    if (tab === "umkm" && !v.isUMKM) return false;
    if (query && !`${v.nama} ${v.npwp} ${v.nib} ${v.lokasi}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const compliancePct = (v: VendorVerification) =>
    Math.round((v.compliance.filter((c) => c.done).length / v.compliance.length) * 100);

  const openView = (v: VendorVerification) => {
    setView(v);
    setDrawerTab("usaha");
  };

  const approveBGN = async (v: VendorVerification) => {
    try {
      const updated = await approveVendor(v.id);
      setList((prev) => prev.map((x) => (x.id === v.id ? updated : x)));
      setView(updated);
      toast(`${v.nama} disetujui BGN & dicatat on-chain.`);
    } catch (err: any) {
      toast(err.message || "Gagal menyetujui vendor", "error");
    }
  };

  const anchorCert = async (v: VendorVerification, certType: string) => {
    const cert = v.certificates.find((c) => c.type === certType);
    if (!cert) return;
    try {
      const res = await addCertificate(v.id, {
        type: cert.type,
        nomor: cert.nomor,
        validUntil: cert.validUntil,
        status: cert.status,
      });

      const updatedCerts = v.certificates.map((c) =>
        c.type === certType ? { ...c, docHash: res.docHash } : c
      );
      const updatedVendor = { ...v, certificates: updatedCerts };

      setList((prev) => prev.map((x) => (x.id === v.id ? updatedVendor : x)));
      setView(updatedVendor);

      toast(`Sertifikat ${certType} disimpan ke blockchain: ${res.docHash?.slice(0, 10)}…`);
    } catch (err: any) {
      toast(err.message || "Gagal menyimpan sertifikat", "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Verifikasi Vendor (BGN)"
        subtitle="Integrasi NPWP, izin usaha & sertifikasi — terhubung Badan Gizi Nasional, tersimpan di blockchain"
        icon={BadgeCheck}
        actions={<Button icon={ShieldCheck} variant="outline" onClick={() => toast("Sinkronisasi data DJP, OSS & BGN dijalankan.", "info")}>Sinkron BGN</Button>}
      />

      {/* BGN integration banner */}
      <Card className="mb-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 overflow-hidden relative">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-white/15 rounded-2xl border border-white/10"><Landmark size={24} /></span>
            <div>
              <h2 className="font-bold flex items-center gap-2">Terintegrasi Badan Gizi Nasional <CheckCircle2 size={16} className="text-emerald-300" /></h2>
              <p className="text-blue-100 text-sm mt-0.5 max-w-xl">Validasi otomatis NPWP (DJP), NIB (OSS), Sertifikat Halal (BPJPH) & standar keamanan pangan. Sertifikat di-anchor ke blockchain untuk menjamin keaslian.</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="text-center px-4 py-2 bg-white/10 rounded-xl"><p className="text-2xl font-bold">{stats.compliance}%</p><p className="text-[10px] uppercase text-blue-200">Compliance</p></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400 rounded-full blur-[80px] opacity-30 -mr-16 -mt-16" />
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Vendor" value={stats.total} icon={Building2} color="brand" />
        <StatCard label="Terverifikasi BGN" value={stats.verified} icon={BadgeCheck} color="green" sub={`${stats.proses} dalam proses`} />
        <StatCard label="Produsen Lokal / UMKM" value={stats.umkm} icon={Store} color="amber" sub="diberdayakan" />
        <StatCard label="Tingkat Kepatuhan" value={`${stats.compliance}%`} icon={ShieldCheck} color="blue" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <Tabs
          tabs={[
            { id: "all", label: "Semua", count: list.length },
            { id: "verified", label: "Terverifikasi", count: stats.verified },
            { id: "proses", label: "Perlu Tindak Lanjut", count: stats.proses },
            { id: "umkm", label: "UMKM", count: stats.umkm },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="flex-1" />
        <SearchInput value={query} onChange={setQuery} placeholder="Cari vendor / NPWP / NIB" className="md:w-72" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-sm text-gray-500">Memuat data vendor...</div>
      ) : filtered.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-sm text-gray-500">Tidak ada vendor ditemukan.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-2.5 bg-brand-50 text-brand-600 rounded-2xl shrink-0"><Building2 size={20} /></span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-dark-900 truncate flex items-center gap-1.5">{v.nama}{v.bgnApproved && <BadgeCheck size={14} className="text-blue-500 shrink-0" />}</h3>
                      <p className="text-xs text-gray-400 truncate">{v.jenisUsaha}</p>
                    </div>
                  </div>
                  {v.isUMKM && <Badge color="amber">UMKM</Badge>}
                </div>

                <div className="space-y-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-2 text-gray-500"><CreditCard size={13} className="text-gray-400" /> NPWP {v.npwp}</div>
                  <div className="flex items-center gap-2 text-gray-500"><FileText size={13} className="text-gray-400" /> NIB {v.nib}</div>
                  <div className="flex items-center gap-2 text-gray-500"><MapPin size={13} className="text-gray-400" /> {v.lokasi}</div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500">Kepatuhan Dokumen</span><span className="font-semibold text-dark-900">{compliancePct(v)}%</span></div>
                  <Progress value={compliancePct(v)} color={compliancePct(v) >= 80 ? "green" : "amber"} />
                </div>

                <div className="flex items-center justify-between">
                  <Badge color={statusColor[v.status]} dot>{v.status}</Badge>
                  <button onClick={() => openView(v)} className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1 cursor-pointer"><Eye size={13} /> Detail</button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Verification drawer */}
      <Drawer
        open={!!view}
        onClose={() => setView(null)}
        title={view?.nama || ""}
        subtitle={view?.jenisUsaha}
        footer={
          view && (
            !view.bgnApproved && isBGN ? (
              <Button className="flex-1" icon={BadgeCheck} onClick={() => approveBGN(view)}>Setujui & Verifikasi BGN</Button>
            ) : view.bgnApproved ? (
              <Badge color="green" dot>Terverifikasi & Tersertifikasi On-Chain</Badge>
            ) : (
              <Button variant="outline" className="flex-1" icon={AlertTriangle} onClick={() => toast("Permintaan kelengkapan dokumen dikirim ke vendor.", "info")}>Minta Kelengkapan Dokumen</Button>
            )
          )
        }
      >
        {view && (
          <div>
            <Tabs
              tabs={[
                { id: "usaha", label: "Data Usaha" },
                { id: "sertifikat", label: "Sertifikat" },
                { id: "kepatuhan", label: "Kepatuhan" },
                { id: "blockchain", label: "Blockchain" },
              ]}
              active={drawerTab}
              onChange={setDrawerTab}
            />

            <div className="mt-5">
              {drawerTab === "usaha" && (
                <div className="space-y-3">
                  <Row icon={CreditCard} label="NPWP (DJP)" value={view.npwp} verified />
                  <Row icon={FileText} label="NIB / Izin Usaha (OSS)" value={view.nib} verified />
                  <Row icon={User} label="Penanggung Jawab" value={view.pic} />
                  <Row icon={MapPin} label="Lokasi" value={view.lokasi} />
                  <Row icon={Store} label="Klasifikasi" value={view.isUMKM ? "Produsen Lokal / UMKM" : "Vendor Korporat"} />
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700 font-semibold flex items-center gap-1.5"><ShieldCheck size={14} /> Skor Keamanan Pangan</p>
                    <div className="flex items-end gap-2 mt-1"><span className="text-3xl font-bold text-dark-900">{view.foodSafetyScore}</span><span className="text-sm text-gray-400 mb-1">/ 100</span></div>
                    <Progress value={view.foodSafetyScore} color={view.foodSafetyScore >= 85 ? "green" : "amber"} />
                  </div>
                </div>
              )}

              {drawerTab === "sertifikat" && (
                <div className="space-y-3">
                  {view.certificates.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-dark-900 flex items-center gap-2"><ScrollText size={15} className="text-brand-600" /> {c.type}</span>
                        <Badge color={certColor[c.status]} dot>{c.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">No. {c.nomor}</p>
                      <p className="text-xs text-gray-400">Berlaku s.d {c.validUntil}</p>
                      {c.status === "Valid" && (
                        c.docHash ? (
                          <div className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500" /> Tersimpan di Blockchain
                          </div>
                        ) : (
                          <button onClick={() => anchorCert(view, c.type)} className="mt-2 text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer">
                            <Link2 size={12} /> Simpan ke Blockchain
                          </button>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === "kepatuhan" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <SectionTitle>Checklist Kepatuhan</SectionTitle>
                    <span className="text-sm font-bold text-brand-600">{compliancePct(view)}%</span>
                  </div>
                  <div className="space-y-2">
                    {view.compliance.map((c, idx) => (
                      <div key={idx} className={cn("flex items-center gap-3 p-3 rounded-xl border", c.done ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-200")}>
                        {c.done ? <CheckCircle2 className="text-emerald-500 shrink-0" size={18} /> : <Circle className="text-gray-300 shrink-0" size={18} />}
                        <span className={cn("text-sm", c.done ? "text-dark-900 font-medium" : "text-gray-500")}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === "blockchain" && (
                <div className="space-y-3">
                  {(() => {
                    const npwpChain = verifyHash(view.npwp);
                    const nibChain = verifyHash(view.nib);
                    return (
                      <>
                        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-blue-700 flex items-center gap-1.5"><Link2 size={15} /> VendorCredentialRegistry</span>
                            <Badge color={view.bgnApproved ? "green" : "amber"} dot>{view.bgnApproved ? "Verified" : "Pending"}</Badge>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between"><span>NPWP hash</span><span className="font-mono">{shortHash(npwpChain.txHash, 8, 6)}</span></div>
                            <div className="flex justify-between"><span>NIB hash</span><span className="font-mono">{shortHash(nibChain.txHash, 8, 6)}</span></div>
                            <div className="flex justify-between"><span>Block</span><span className="font-mono">#{npwpChain.block.toLocaleString("id-ID")}</span></div>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500 flex items-start gap-2">
                          <Sparkles size={14} className="text-brand-600 shrink-0 mt-0.5" />
                          Semua sertifikat ({view.certificates.length} dokumen) di-hash & disimpan immutable. Keaslian dapat diverifikasi publik tanpa membuka dokumen asli.
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Row({ icon: Icon, label, value, verified }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; verified?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <Icon size={16} className="text-gray-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-dark-900 truncate">{value}</p>
      </div>
      {verified && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
    </div>
  );
}
