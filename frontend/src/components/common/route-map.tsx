import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { ChefHat, School, Briefcase } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Reusable map for routes & matches (markers + connecting polylines)  */
/* ------------------------------------------------------------------ */

export type MapNodeType = "kitchen" | "school" | "vendor";

export interface MapNode {
  id: string;
  lat: number;
  lng: number;
  type: MapNodeType;
  label: string;
  sub?: string;
  /** optional sequence number rendered inside the marker (route stops) */
  order?: number;
}

export interface MapLink {
  from: [number, number];
  to: [number, number];
  color?: string;
  dashed?: boolean;
  label?: string;
}

const TYPE_COLOR: Record<MapNodeType, string> = {
  kitchen: "#dc2626",
  school: "#2563eb",
  vendor: "#d97706",
};

function typeIcon(node: MapNode) {
  const color = TYPE_COLOR[node.type];
  // numbered pin for ordered route stops
  if (node.order !== undefined) {
    const markup = renderToStaticMarkup(
      <div
        style={{ background: color }}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
      >
        {node.order}
      </div>,
    );
    return L.divIcon({
      html: markup,
      className: "route-node-icon",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  }
  const Icon = node.type === "school" ? School : node.type === "kitchen" ? ChefHat : Briefcase;
  const markup = renderToStaticMarkup(
    <div
      style={{ background: color }}
      className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
    >
      <Icon size={18} />
    </div>,
  );
  return L.divIcon({
    html: markup,
    className: "route-node-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [48, 48] });
    }
  }, [points, map]);
  return null;
}

export default function RouteMap({
  nodes,
  links = [],
  height = 420,
  className = "",
}: {
  nodes: MapNode[];
  links?: MapLink[];
  height?: number;
  className?: string;
}) {
  const points: [number, number][] = [
    ...nodes.map((n) => [n.lat, n.lng] as [number, number]),
    ...links.flatMap((l) => [l.from, l.to]),
  ];
  const center: [number, number] = points[0] ?? [-6.2, 106.816];

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-gray-100 ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <FitBounds points={points} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {links.map((link, i) => (
          <Polyline
            key={i}
            positions={[link.from, link.to]}
            pathOptions={{
              color: link.color ?? "#dc2626",
              weight: 3,
              opacity: 0.8,
              dashArray: link.dashed ? "8 6" : undefined,
            }}
          >
            {link.label && (
              <Tooltip sticky direction="top" className="!text-xs">
                {link.label}
              </Tooltip>
            )}
          </Polyline>
        ))}

        {nodes.map((node) => (
          <Marker key={node.id} position={[node.lat, node.lng]} icon={typeIcon(node)}>
            <Tooltip direction="top" offset={[0, -16]}>
              <div className="text-xs">
                <p className="font-bold text-dark-900">{node.label}</p>
                {node.sub && <p className="text-gray-500">{node.sub}</p>}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
