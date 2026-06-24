import { useState } from "react";
import { Users, Plus, Phone, Star, MapPin, Truck } from "lucide-react";
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
import { personnel, type Personnel } from "@/mocks/mbg-data";

const statusColor: Record<Personnel["status"], "green" | "amber" | "gray"> = {
  Bertugas: "green",
  Standby: "amber",
  Off: "gray",
};

export default function DriverKader() {
  const { toast } = useToast();
  const [list, setList] = useState<Personnel[]>(personnel);
  const [query, setQuery] = useState("");
  const [peran, setPeran] = useState("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ nama: "", peran: "Driver", area: "", kontak: "" });

  const filtered = list.filter((p) => {
    if (peran !== "all" && p.peran !== peran) return false;
    if (query && !`${p.nama} ${p.area}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const save = () => {
    if (!form.nama || !form.area) {
      toast("Nama dan area wajib diisi.", "error");
      return;
    }
    setList((prev) => [
      {
        id: `p${Date.now()}`,
        nama: form.nama,
        peran: form.peran as Personnel["peran"],
        area: form.area,
        kontak: form.kontak || "-",
        status: "Standby",
        pengiriman: 0,
        rating: 5,
      },
      ...prev,
    ]);
    setAdding(false);
    setForm({ nama: "", peran: "Driver", area: "", kontak: "" });
    toast("Personel baru ditambahkan.");
  };

  const cycleStatus = (p: Personnel) => {
    const order: Personnel["status"][] = ["Bertugas", "Standby", "Off"];
    const next = order[(order.indexOf(p.status) + 1) % order.length];
    setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    toast(`${p.nama} diperbarui menjadi ${next}.`);
  };

  const columns: Column<Personnel>[] = [
    {
      key: "nama",
      header: "Nama",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar name={p.nama} color={p.peran === "Driver" ? "blue" : p.peran === "Kader" ? "green" : "purple"} />
          <div>
            <p className="font-semibold text-dark-900">{p.nama}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={11} /> {p.kontak}</p>
          </div>
        </div>
      ),
    },
    { key: "peran", header: "Peran", render: (p) => <Badge color={p.peran === "Driver" ? "blue" : p.peran === "Kader" ? "green" : "purple"}>{p.peran}</Badge> },
    { key: "area", header: "Area", render: (p) => <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> {p.area}</span> },
    { key: "pengiriman", header: "Pengiriman", align: "right", render: (p) => <span className="font-semibold">{p.pengiriman}</span> },
    { key: "rating", header: "Rating", align: "right", render: (p) => <span className="inline-flex items-center gap-1 font-semibold text-amber-600"><Star size={13} className="fill-current" /> {p.rating}</span> },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (p) => (
        <button onClick={() => cycleStatus(p)} className="cursor-pointer">
          <Badge color={statusColor[p.status]} dot>{p.status}</Badge>
        </button>
      ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (p) => (
        <Button size="sm" variant="subtle" icon={Truck} onClick={() => toast(`Tugas pengiriman ditugaskan ke ${p.nama}.`)}>
          Tugaskan
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Driver & Kader"
        subtitle="Kelola personel distribusi dan kader pendamping di lapangan"
        icon={Users}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Tambah Personel</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Personel" value={list.length} icon={Users} color="brand" />
        <StatCard label="Sedang Bertugas" value={list.filter((p) => p.status === "Bertugas").length} icon={Truck} color="green" />
        <StatCard label="Driver" value={list.filter((p) => p.peran === "Driver").length} icon={Truck} color="blue" />
        <StatCard label="Kader" value={list.filter((p) => p.peran === "Kader").length} icon={Users} color="purple" />
      </div>

      <Card padded={false}>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari nama atau area" className="flex-1" />
          <Select
            value={peran}
            onChange={setPeran}
            options={[
              { value: "all", label: "Semua Peran" },
              { value: "Driver", label: "Driver" },
              { value: "Kader", label: "Kader" },
              { value: "Koordinator", label: "Koordinator" },
            ]}
          />
        </div>
        <div className="p-2">
          <DataTable columns={columns} data={filtered} empty="Tidak ada personel ditemukan." />
        </div>
      </Card>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Tambah Personel"
        subtitle="Daftarkan driver atau kader baru"
        footer={
          <>
            <Button variant="outline" onClick={() => setAdding(false)}>Batal</Button>
            <Button onClick={save}>Simpan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Nama Lengkap" required>
            <TextInput value={form.nama} onChange={(v) => setForm({ ...form, nama: v })} placeholder="cth. Budi Santoso" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Peran">
              <Select
                value={form.peran}
                onChange={(v) => setForm({ ...form, peran: v })}
                options={[
                  { value: "Driver", label: "Driver" },
                  { value: "Kader", label: "Kader" },
                  { value: "Koordinator", label: "Koordinator" },
                ]}
              />
            </Field>
            <Field label="Area" required>
              <TextInput value={form.area} onChange={(v) => setForm({ ...form, area: v })} placeholder="cth. Jakarta Pusat" />
            </Field>
          </div>
          <Field label="Kontak">
            <TextInput value={form.kontak} onChange={(v) => setForm({ ...form, kontak: v })} placeholder="cth. 0812-xxxx-xxxx" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
