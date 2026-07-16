import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { MapClickListener } from "@/components/common/map-helper";

const pinIcon = L.divIcon({
  className: "custom-pin-icon",
  html: `<div class="w-8 h-8 -ml-4 -mt-8 flex items-center justify-center text-brand-600 drop-shadow-md pb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export interface LocationPickerProps {
  value: { lat: number; lng: number };
  onChange: (pos: { lat: number; lng: number }) => void;
  height?: number;
}

/** Small embeddable map to pick a coordinate — click or drag the pin. */
export default function LocationPicker({ value, onChange, height = 200 }: LocationPickerProps) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner relative z-10"
      style={{ height }}
    >
      <MapContainer
        center={[value.lat, value.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; Carto'
        />
        <MapClickListener onMapClick={(lat, lng) => onChange({ lat, lng })} />
        <Marker
          position={[value.lat, value.lng]}
          icon={pinIcon as never}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const pos = (e.target as L.Marker).getLatLng();
              onChange({ lat: pos.lat, lng: pos.lng });
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
