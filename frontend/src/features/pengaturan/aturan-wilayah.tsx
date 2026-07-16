import { useEffect, useState } from "react";
import { Radar, School, Handshake, ArrowRightLeft, MapPin } from "lucide-react";
import { PageHeader, Card, Badge, Button, SectionTitle, useToast, cn } from "@/components/ui";
import {
  DEFAULT_RULES,
  getGeoRules,
  updateGeoRule,
  type GeoRule,
  type GeoRuleScope,
} from "@/services/geo-rules-service";

interface ScopeMeta {
  scope: GeoRuleScope;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  min: number;
  max: number;
}

const SCOPES: ScopeMeta[] = [
  {
    scope: "SCHOOL_ASSIGNMENT",
    title: "Penugasan Sekolah → Dapur",
    desc: "Sekolah baru otomatis direkomendasikan ke dapur terdekat yang jaraknya masih di dalam radius layanan. Dapur dapat memiliki radius khusus yang menimpa aturan global ini.",
    icon: School,
    min: 1,
    max: 50,
  },
  {
    scope: "SUPPLIER_MATCH",
    title: "Pencocokan Supplier",
    desc: "Rekomendasi supplier pada pengadaan difilter berdasarkan jarak nyata (haversine) dari dapur peminta; supplier di luar radius tidak diprioritaskan.",
    icon: Handshake,
    min: 5,
    max: 200,
  },
  {
    scope: "REDISTRIBUTION",
    title: "Redistribusi Antarwilayah",
    desc: "Rekomendasi transfer stok hanya memasangkan wilayah surplus dan defisit yang jaraknya di dalam radius. Penjadwalan transfer di luar radius akan ditolak sistem.",
    icon: ArrowRightLeft,
    min: 20,
    max: 500,
  },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer", on ? "bg-brand-600" : "bg-gray-300")}>
      <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform", on && "translate-x-5")} />
    </button>
  );
}

export default function AturanWilayah() {
  const { toast } = useToast();
  const [rules, setRules] = useState<GeoRule[]>(DEFAULT_RULES);
  useEffect(() => {
    getGeoRules().then((r) => r.length && setRules(r));
  }, []);

  const ruleOf = (scope: GeoRuleScope) =>
    rules.find((r) => r.scope === scope) ?? DEFAULT_RULES.find((r) => r.scope === scope)!;

  const patchLocal = (scope: GeoRuleScope, patch: Partial<GeoRule>) =>
    setRules((prev) => prev.map((r) => (r.scope === scope ? { ...r, ...patch } : r)));

  const save = (scope: GeoRuleScope, title: string) => {
    const r = ruleOf(scope);
    updateGeoRule(scope, { radiusKm: r.radiusKm, active: r.active });
    toast(`Aturan "${title}" diperbarui.`);
  };

  return (
    <div>
      <PageHeader
        title="Aturan Wilayah"
        subtitle="Aturan berbasis titik pusat + radius untuk penugasan sekolah, pengadaan, dan redistribusi"
        icon={Radar}
        actions={<Badge color="brand" dot>{rules.filter((r) => r.active).length}/{rules.length} aturan aktif</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SCOPES.map((meta) => {
          const rule = ruleOf(meta.scope);
          return (
            <Card key={meta.scope}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <SectionTitle>
                  <span className="flex items-center gap-2">
                    <meta.icon size={16} className="text-brand-600" /> {meta.title}
                  </span>
                </SectionTitle>
                <Toggle on={rule.active} onClick={() => patchLocal(meta.scope, { active: !rule.active })} />
              </div>
              <p className="text-xs text-gray-500 mb-5">{meta.desc}</p>

              <div className={cn(!rule.active && "opacity-40 pointer-events-none")}>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><MapPin size={12} /> Radius</span>
                  <span className="text-brand-600">{rule.radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min={meta.min}
                  max={meta.max}
                  value={rule.radiusKm}
                  onChange={(e) => patchLocal(meta.scope, { radiusKm: +e.target.value })}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1">
                  <span>{meta.min} km</span>
                  <span>{meta.max} km</span>
                </div>
              </div>

              <Button className="w-full mt-5" onClick={() => save(meta.scope, meta.title)}>
                Simpan
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <SectionTitle>Cara Kerja</SectionTitle>
        <p className="text-sm text-gray-500">
          Setiap aturan memakai <span className="font-semibold text-dark-900">titik pusat + radius</span>:
          untuk penugasan sekolah, titik pusatnya adalah lokasi tiap dapur SPPG; untuk pencocokan supplier,
          titik pusatnya dapur yang meminta pengadaan; untuk redistribusi, jarak dihitung antar titik pusat
          wilayah. Jarak dihitung dengan formula haversine (garis lingkar bumi). Menonaktifkan aturan membuat
          semua kandidat dianggap berada dalam radius.
        </p>
      </Card>
    </div>
  );
}
