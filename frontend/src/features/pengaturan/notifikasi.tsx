import { useState } from "react";
import {
  Bell,
  Truck,
  Boxes,
  Wallet,
  Settings as SettingsIcon,
  Star,
  CheckCheck,
  Trash2,
} from "lucide-react";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Tabs,
  SectionTitle,
  useToast,
  cn,
} from "@/components/ui";
import { notifications as seed, type AppNotification } from "@/mocks/mbg-data";

const kategoriIcon: Record<AppNotification["kategori"], React.ComponentType<{ size?: number }>> = {
  Distribusi: Truck,
  Stok: Boxes,
  Anggaran: Wallet,
  Sistem: SettingsIcon,
  Ulasan: Star,
};
const kategoriColor: Record<AppNotification["kategori"], "blue" | "amber" | "purple" | "gray" | "brand"> = {
  Distribusi: "blue",
  Stok: "amber",
  Anggaran: "purple",
  Sistem: "gray",
  Ulasan: "brand",
};
const kategoriBg: Record<AppNotification["kategori"], string> = {
  Distribusi: "bg-blue-50 text-blue-600",
  Stok: "bg-amber-50 text-amber-600",
  Anggaran: "bg-purple-50 text-purple-600",
  Sistem: "bg-gray-100 text-gray-600",
  Ulasan: "bg-brand-50 text-brand-600",
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer", on ? "bg-brand-600" : "bg-gray-300")}>
      <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform", on && "translate-x-5")} />
    </button>
  );
}

export default function Notifikasi() {
  const { toast } = useToast();
  const [list, setList] = useState<AppNotification[]>(seed);
  const [tab, setTab] = useState("all");
  const [prefs, setPrefs] = useState({
    Distribusi: true,
    Stok: true,
    Anggaran: true,
    Ulasan: false,
    Sistem: true,
    email: true,
    push: true,
    wa: false,
  });

  const unread = list.filter((n) => !n.dibaca).length;
  const filtered = list.filter((n) => tab === "all" || (tab === "unread" ? !n.dibaca : n.kategori.toLowerCase() === tab));

  const markAll = () => { setList((prev) => prev.map((n) => ({ ...n, dibaca: true }))); toast("Semua notifikasi ditandai dibaca."); };
  const markRead = (id: string) => setList((prev) => prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n)));
  const remove = (id: string) => { setList((prev) => prev.filter((n) => n.id !== id)); toast("Notifikasi dihapus.", "info"); };

  return (
    <div>
      <PageHeader
        title="Notifikasi"
        subtitle="Pusat notifikasi dan preferensi pemberitahuan"
        icon={Bell}
        actions={<Button variant="outline" icon={CheckCheck} onClick={markAll}>Tandai Semua Dibaca</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification list */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Tabs
              tabs={[
                { id: "all", label: "Semua", count: list.length },
                { id: "unread", label: "Belum Dibaca", count: unread },
                { id: "distribusi", label: "Distribusi" },
                { id: "stok", label: "Stok" },
              ]}
              active={tab}
              onChange={setTab}
            />
          </div>
          <Card padded={false}>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">Tidak ada notifikasi.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((n) => {
                  const Icon = kategoriIcon[n.kategori];
                  return (
                    <div key={n.id} className={cn("flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors group", !n.dibaca && "bg-brand-50/30")} onClick={() => markRead(n.id)}>
                      <span className={cn("p-2.5 rounded-xl shrink-0", kategoriBg[n.kategori])}>
                        <Icon size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-dark-900 text-sm">{n.judul}</p>
                          {!n.dibaca && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{n.pesan}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge color={kategoriColor[n.kategori]}>{n.kategori}</Badge>
                          <span className="text-[11px] text-gray-400">{n.waktu}</span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); remove(n.id); }} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <Card>
            <SectionTitle>Kategori Notifikasi</SectionTitle>
            <div className="space-y-3">
              {(["Distribusi", "Stok", "Anggaran", "Ulasan", "Sistem"] as const).map((k) => {
                const Icon = kategoriIcon[k];
                return (
                  <div key={k} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-gray-400"><Icon size={16} /></span>
                      <span className="text-sm text-gray-600">{k}</span>
                    </div>
                    <Toggle on={prefs[k]} onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))} />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionTitle>Saluran Pengiriman</SectionTitle>
            <div className="space-y-3">
              {([["email", "Email"], ["push", "Push Notification"], ["wa", "WhatsApp"]] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <Toggle on={prefs[key]} onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))} />
                </div>
              ))}
            </div>
            <Button className="w-full mt-5" onClick={() => toast("Preferensi notifikasi disimpan.")}>Simpan Preferensi</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
