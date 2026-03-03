import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { GeoEntity } from '../types';
import { useEffect } from 'react';
import { ChefHat, School, MapPin, Briefcase } from 'lucide-react';
import { schoolIcon, kitchenIcon, vendorIcon } from '../utils/mapIcons';

interface MapComponentProps {
  entities: GeoEntity[];
  center: [number, number];
  zoom: number;
}

const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};



export const MapComponent = ({ entities, center, zoom }: MapComponentProps) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner isolate z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <MapUpdater center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {entities.map((entity) => (
          <Marker 
             key={entity.id} 
             position={[entity.lat, entity.lng]}
             icon={entity.type === 'school' ? schoolIcon : (entity.type === 'kitchen' ? kitchenIcon : vendorIcon)}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                  <div className={`p-1.5 rounded-md ${
                    entity.type === 'school' ? 'bg-blue-50 text-blue-600' : 
                    entity.type === 'kitchen' ? 'bg-brand-50 text-brand-600' : 
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {entity.type === 'school' && <School size={16} />}
                    {entity.type === 'kitchen' && <ChefHat size={16} />}
                    {entity.type === 'vendor' && <Briefcase size={16} />}
                  </div>
                  <h3 className="font-bold text-dark-900 text-sm">{entity.name}</h3>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex items-start gap-1.5 line-clamp-2">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    {entity.address}
                  </p>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-500">
                      {entity.type === 'school' ? 'Siswa' : entity.type === 'kitchen' ? 'Kapasitas' : 'Komoditas'}
                    </span>
                    <span className="font-bold text-dark-900 text-right text-[11px] leading-tight max-w-[120px]">
                      {entity.type === 'vendor' 
                        ? entity.commodities?.join(', ') 
                        : `${entity.capacity?.toLocaleString()} ${entity.type === 'school' ? 'Anak' : 'Porsi'}`
                      }
                    </span>
                  </div>

                  {(entity.type === 'kitchen' || entity.type === 'vendor') && entity.rating && (
                     <div className="flex items-center gap-1 text-amber-500">
                        <span className="text-xs font-bold">{entity.rating}</span>
                        <span>★</span>
                        <span className="text-gray-400 text-[10px] ml-1">Rating {entity.type === 'kitchen' ? 'Higiene' : 'Kemitraan'}</span>
                     </div>
                  )}

                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button className={`w-full py-1.5 rounded text-white font-medium transition-colors ${
                      entity.type === 'school' ? 'bg-blue-600 hover:bg-blue-700' : 
                      entity.type === 'kitchen' ? 'bg-brand-600 hover:bg-brand-700' :
                      'bg-amber-600 hover:bg-amber-700'
                    }`}>
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
