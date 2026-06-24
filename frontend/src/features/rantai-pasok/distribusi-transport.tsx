import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Navigation, Gauge, Wrench, MapPin, Route, Fuel } from "lucide-react";
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
  DataTable,
  Modal,
  Progress,
  SectionTitle,
  useToast,
  type Column,
} from "@/components/ui";
import { vehicles as seed, type Vehicle } from "@/mocks/mbg-data";

const statusColor: Record<Vehicle["status"], "blue" | "green" | "amber"> = {
  "Dalam Perjalanan": "blue",
  Siap: "green",
  Maintenance: "amber",
};

export default function DistribusiTransport() {
  const { toast } = useToast();
  const [list] = useState<Vehicle[]>(seed);
  const [routeOpen, setRouteOpen] = useState(false);

  const totalKapasitas = list.reduce((a, v) => a + v.kapasitas, 0);
  const totalMuatan = list.reduce((a, v) => a + v.muatan, 0);
  const utilization = Math.round((totalMuatan / totalKapasitas) * 100);

  const columns: Column<Vehicle>[] = [
    { key: "plat", header: "Kendaraan", render: (v) => <div className="flex items-center gap-3"><span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Truck size={16} /></span><div><p className="font-bold text-dark-900">{v.plat}</p><p className="text-xs text-gray-400">{v.jenis}</p></div></div> },
    { key: "driver", header: "Driver", render: (v) => <span className="text-sm">{v.driver}</span> },
    { key: "muatan", header: "Muatan", render: (v) => <div className="w-32"><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{v.muatan}/{v.kapasitas}</span><span className="font-semibold">{Math.round((v.muatan / v.kapasitas) * 100)}%</span></div><Progress value={(v.muatan / v.kapasitas) * 100} color={v.muatan / v.kapasitas > 0.85 ? "red" : "brand"} /></div> },
    { key: "rute", header: "Rute", render: (v) => <span className="flex items-center gap-1.5 text-sm">{v.rute !== "—" ? <><MapPin size={13} className="text-gray-400" /> {v.rute}</> : <span className="text-gray-300">—</span>}</span> },
    { key: "status", header: "Status", align: "center", render: (v) => <Badge color={statusColor[v.status]} dot>{v.status}</Badge> },
    { key: "action", header: "", align: "right", render: (v) => v.status === "Siap" ? <Button size="sm" variant="subtle" onClick={() => toast(`${v.plat} ditugaskan rute baru.`)}>Tugaskan</Button> : v.status === "Maintenance" ? <Button size="sm" variant="ghost" onClick={() => toast(`${v.plat} ditandai siap operasi.`)}>Selesai Servis</Button> : <Button size="sm" variant="ghost" icon={Navigation} onClick={() => setRouteOpen(true)}>Lacak</Button> },
  ];

  return (
    <div>
      <PageHeader
        title="Distribusi & Transport Manajemen"
        subtitle="Kelola armada, muatan, dan optimasi rute pengiriman makanan"
        icon={Truck}
        actions={
          <>
            <Button variant="outline" icon={Navigation} onClick={() => setRouteOpen(true)}>Optimasi Rute</Button>
            <Button icon={Plus} onClick={() => toast("Form tambah kendaraan dibuka.", "info")}>Tambah Armada</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Armada" value={list.length} icon={Truck} color="brand" />
        <StatCard label="Dalam Perjalanan" value={list.filter((v) => v.status === "Dalam Perjalanan").length} icon={Navigation} color="blue" />
        <StatCard label="Utilisasi Muatan" value={`${utilization}%`} icon={Gauge} color="green" sub={`${totalMuatan}/${totalKapasitas} porsi`} />
        <StatCard label="Maintenance" value={list.filter((v) => v.status === "Maintenance").length} icon={Wrench} color="amber" />
      </div>

      <Card padded={false} className="mb-6">
        <div className="p-4 border-b border-gray-100"><SectionTitle>Daftar Armada</SectionTitle></div>
        <div className="p-2"><DataTable columns={columns} data={list} /></div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-dark-900 text-white border-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><Route className="text-brand-400" size={18} /> Optimasi Rute AI</h3>
            <Badge color="green" dot>Aktif</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10"><Fuel className="text-brand-400 mb-2" size={18} /><p className="text-2xl font-bold">15.4%</p><p className="text-xs text-gray-400">Penghematan BBM</p></div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10"><Gauge className="text-brand-400 mb-2" size={18} /><p className="text-2xl font-bold">22%</p><p className="text-xs text-gray-400">Penghematan Waktu</p></div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10"><MapPin className="text-brand-400 mb-2" size={18} /><p className="text-2xl font-bold">128</p><p className="text-xs text-gray-400">Titik Antar</p></div>
          </div>
          <Button className="mt-4 w-full bg-white text-dark-900 hover:bg-gray-100" onClick={() => setRouteOpen(true)}>Lihat Visualisasi Rute</Button>
        </Card>

        <Card>
          <SectionTitle>Efisiensi per Driver</SectionTitle>
          <div className="space-y-3">
            {[{ n: "Budi Santoso", e: 98 }, { n: "Agus Wijaya", e: 94 }, { n: "Eko Prasetyo", e: 91 }, { n: "Rudi Hartono", e: 88 }].map((d) => (
              <div key={d.n}>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{d.n}</span><span className="font-semibold">{d.e}%</span></div>
                <Progress value={d.e} color={d.e >= 95 ? "green" : "brand"} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={routeOpen} onClose={() => setRouteOpen(false)} title="Visualisasi Optimasi Rute" subtitle="Rute teroptimasi untuk meminimalkan waktu & biaya" size="lg" footer={<Button onClick={() => { setRouteOpen(false); toast("Rute teroptimasi diterapkan ke armada."); }}>Terapkan Rute</Button>}>
        <div className="aspect-video bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 p-10">
            <div className="relative w-full h-full">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute left-[15%] top-1/2 -ml-3 -mt-3 w-6 h-6 bg-brand-600 rounded-full border-4 border-white shadow-lg z-20">
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap text-dark-900">DAPUR SPPG</span>
              </motion.div>
              {[{ x: "65%", y: "15%", l: "SDN 01" }, { x: "80%", y: "45%", l: "SMPN 1" }, { x: "70%", y: "75%", l: "SDN 05" }, { x: "45%", y: "60%", l: "SDN 03" }].map((s, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="absolute w-4 h-4 bg-blue-600 rounded-sm border-2 border-white shadow-md z-20" style={{ left: s.x, top: s.y }}>
                  <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 whitespace-nowrap">{s.l}</span>
                </motion.div>
              ))}
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                {["M 15% 50% L 65% 15%", "M 15% 50% L 80% 45%", "M 15% 50% L 70% 75%", "M 15% 50% L 45% 60%"].map((d, i) => (
                  <motion.path key={i} d={d} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="8 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                ))}
              </svg>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 bg-brand-50 rounded-xl text-center"><p className="text-lg font-bold text-brand-600">22%</p><p className="text-xs text-gray-500">Hemat Waktu</p></div>
          <div className="p-3 bg-brand-50 rounded-xl text-center"><p className="text-lg font-bold text-brand-600">15.4%</p><p className="text-xs text-gray-500">Hemat BBM</p></div>
          <div className="p-3 bg-brand-50 rounded-xl text-center"><p className="text-lg font-bold text-brand-600">4</p><p className="text-xs text-gray-500">Titik Optimal</p></div>
        </div>
      </Modal>
    </div>
  );
}
