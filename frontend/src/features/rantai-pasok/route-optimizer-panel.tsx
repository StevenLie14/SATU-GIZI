import { useEffect, useMemo, useState } from "react";
import {
  Route,
  Navigation,
  Truck,
  Fuel,
  Clock,
  MapPin,
  Gauge,
} from "lucide-react";
import { Card, Badge, SectionTitle, Select } from "@/components/ui";
import RouteMap, { type MapNode, type MapLink } from "@/components/common/route-map";
import { getEntities } from "@/services/entities-service";
import { optimizeRoute, formatKm, formatEta, haversineKm } from "@/lib/geo";
import type { GeoEntity } from "@/types";

/**
 * Delivery route optimisation panel — real Leaflet map of the nearest-neighbour
 * tour from a dapur to its nearest schools. Embedded in Analitik & Peramalan
 * (consolidated from the former standalone Forecast page).
 */
export default function RouteOptimizerPanel() {
  const [entities, setEntities] = useState<GeoEntity[]>([]);
  const [originId, setOriginId] = useState("");

  useEffect(() => {
    getEntities().then((data) => {
      setEntities(data);
      const firstKitchen = data.find((e) => e.type === "kitchen");
      if (firstKitchen) setOriginId(firstKitchen.id);
    });
  }, []);

  const kitchens = useMemo(() => entities.filter((e) => e.type === "kitchen"), [entities]);
  const schools = useMemo(() => entities.filter((e) => e.type === "school"), [entities]);
  const origin = useMemo(
    () => kitchens.find((k) => k.id === originId) ?? kitchens[0],
    [kitchens, originId],
  );

  const stops = useMemo(() => {
    if (!origin) return [];
    return [...schools].sort((a, b) => haversineKm(origin, a) - haversineKm(origin, b)).slice(0, 5);
  }, [origin, schools]);

  const route = useMemo(
    () => (origin && stops.length ? optimizeRoute(origin, stops) : null),
    [origin, stops],
  );

  const mapNodes: MapNode[] = useMemo(() => {
    if (!route) return [];
    return [
      { id: route.origin.id, lat: route.origin.lat, lng: route.origin.lng, type: "kitchen", label: route.origin.name, sub: "Titik masak (asal)" },
      ...route.order.map((s, i) => ({
        id: s.id,
        lat: s.lat,
        lng: s.lng,
        type: "school" as const,
        label: s.name,
        sub: `Perhentian ${i + 1} · ${s.capacity ?? 0} porsi`,
        order: i + 1,
      })),
    ];
  }, [route]);

  const mapLinks: MapLink[] = useMemo(() => {
    if (!route) return [];
    return route.legs.map((l) => ({
      from: [l.from.lat, l.from.lng] as [number, number],
      to: [l.to.lat, l.to.lng] as [number, number],
      color: "#dc2626",
      dashed: true,
      label: `${l.from.name} → ${l.to.name} · ${formatKm(l.distanceKm)} · ${formatEta(l.etaMin)}`,
    }));
  }, [route]);

  return (
    <div>
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
              <Route className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-dark-900">Optimasi Rute Pengantaran</h2>
              <p className="text-sm text-gray-500">
                Rute nearest-neighbour dari dapur ke sekolah terdekat — meminimalkan jarak &amp; waktu tempuh.
              </p>
            </div>
          </div>
          <div className="w-full md:w-72">
            <Select
              value={originId}
              onChange={setOriginId}
              options={kitchens.map((k) => ({ value: k.id, label: k.name }))}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padded={false} className="overflow-hidden">
            {mapNodes.length > 0 ? (
              <RouteMap nodes={mapNodes} links={mapLinks} height={460} />
            ) : (
              <div className="h-[460px] flex items-center justify-center text-sm text-gray-400">
                Memuat peta rute…
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {route && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Card padded={false} className="p-3 text-center">
                  <p className="text-lg font-bold text-dark-900">{route.totalKm.toFixed(1)}</p>
                  <p className="text-[10px] text-gray-400 font-medium">km total</p>
                </Card>
                <Card padded={false} className="p-3 text-center">
                  <p className="text-lg font-bold text-dark-900">{formatEta(route.totalMin)}</p>
                  <p className="text-[10px] text-gray-400 font-medium">estimasi</p>
                </Card>
                <Card padded={false} className="p-3 text-center">
                  <p className="text-lg font-bold text-emerald-600">{route.savingPct}%</p>
                  <p className="text-[10px] text-gray-400 font-medium">hemat jarak</p>
                </Card>
              </div>

              <Card>
                <SectionTitle action={<Badge color="brand" dot>{route.legs.length} segmen</Badge>}>
                  Urutan Pengantaran
                </SectionTitle>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-brand-50/60">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      <Navigation size={13} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark-900 truncate">{route.origin.name}</p>
                      <p className="text-[11px] text-gray-400">Titik masak (asal)</p>
                    </div>
                  </div>
                  {route.legs.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-dark-900 truncate">{l.to.name}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-2">
                          <span className="flex items-center gap-1"><MapPin size={11} /> {formatKm(l.distanceKm)}</span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {formatEta(l.etaMin)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          <Card className="bg-dark-900 text-white border-0">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="text-brand-400" size={18} />
              <h3 className="font-bold">Parameter Optimasi</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2"><Truck size={14} className="text-brand-400" /> Kapasitas &amp; beban kendaraan</li>
              <li className="flex items-center gap-2"><Fuel size={14} className="text-brand-400" /> Efisiensi bahan bakar</li>
              <li className="flex items-center gap-2"><Clock size={14} className="text-brand-400" /> Jendela kesegaran makanan</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
