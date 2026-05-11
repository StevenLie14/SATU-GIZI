import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import type { GeoEntity, EntityType, AddEntityModalProps } from '../types';
import L from 'leaflet';

const pinIcon = L.divIcon({
  className: 'custom-pin-icon',
  html: `<div class="w-8 h-8 -ml-4 -mt-8 flex items-center justify-center text-brand-600 drop-shadow-md pb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

import type { LeafletMouseEvent, DragEndEvent } from 'leaflet';

function LocationPicker({ position, setPosition, setAddress, setIsGeocoding }: {
  position: L.LatLng | null;
  setPosition: (pos: L.LatLng) => void;
  setAddress: (addr: string) => void;
  setIsGeocoding: (val: boolean) => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e: LeafletMouseEvent) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      reverseGeocode(e.latlng.lat, e.latlng.lng, setAddress, setIsGeocoding);
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={pinIcon as any}
      draggable={true}
      eventHandlers={{
        dragend: (e: DragEndEvent) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          map.flyTo(pos, map.getZoom());
          reverseGeocode(pos.lat, pos.lng, setAddress, setIsGeocoding);
        },
      }}
    />
  );
}

const reverseGeocode = async (lat: number, lng: number, setAddress: (addr: string) => void, setIsGeocoding: (val: boolean) => void) => {
  setIsGeocoding(true);
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    const data = await res.json();
    if (data && data.display_name) {
      setAddress(data.display_name);
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  } finally {
    setIsGeocoding(false);
  }
};



export const AddEntityModal = ({ isOpen, onClose, onAdd, initialLocation }: AddEntityModalProps) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>(initialLocation || { lat: -6.200000, lng: 106.816666 });
  const [pinPosition, setPinPosition] = useState<L.LatLng | null>(initialLocation ? L.latLng(initialLocation.lat, initialLocation.lng) : L.latLng(-6.200000, 106.816666));

  const [formData, setFormData] = useState({
    name: '',
    type: 'school' as EntityType,
    address: '',
    commodities: '',
    capacity: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
  });

  useEffect(() => {
    if (isOpen) {
      const startLat = initialLocation?.lat || -6.200000;
      const startLng = initialLocation?.lng || 106.816666;
      setMapCenter({ lat: startLat, lng: startLng });
      setPinPosition(L.latLng(startLat, startLng));
      
      setFormData({
        name: '',
        type: 'school',
        address: '',
        commodities: '',
        capacity: '',
        status: 'active',
      });
      
      if (initialLocation) {
        reverseGeocode(startLat, startLng, (addr) => setFormData(prev => ({...prev, address: addr})), setIsGeocoding);
      }
    }
  }, [isOpen, initialLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !pinPosition) {
      alert('Mohon isi nama dan pastikan lokasi telah dipilih di peta.');
      return;
    }

    const newEntity: GeoEntity = {
      id: `new-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      address: formData.address,
      lat: pinPosition.lat,
      lng: pinPosition.lng,
      status: formData.status,
      capacity: (formData.type === 'school' || formData.type === 'kitchen') ? parseInt(formData.capacity) : undefined,
      commodities: formData.type === 'vendor' ? formData.commodities.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      rating: 0,
    };

    onAdd(newEntity);
    onClose();
    setFormData({
      name: '',
      type: 'school',
      address: '',
      commodities: '',
      capacity: '',
      status: 'active',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-dark-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-dark-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                Tambah Titik Baru
              </h3>
              <button 
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lokasi *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Contoh: Jl Kemanggisan Utama Raya No. 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as EntityType})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="school">Sekolah</option>
                    <option value="kitchen">Dapur Pusat</option>
                    <option value="vendor">Vendor Pemasok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="pending">Tertunda</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pilih Titik Lokasi *
                    </label>
                    <span className="text-xs text-gray-500">Geser pin biru atau klik peta</span>
                  </div>
                  
                  <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 mb-3 shadow-inner relative z-10">
                    <MapContainer 
                      center={mapCenter} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%', zIndex: 10 }}
                      zoomControl={false}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; Carto'
                      />
                      <LocationPicker 
                        position={pinPosition} 
                        setPosition={setPinPosition} 
                        setAddress={(addr: string) => setFormData(prev => ({...prev, address: addr}))} 
                        setIsGeocoding={setIsGeocoding}
                      />
                    </MapContainer>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap *
                    {isGeocoding && <Loader2 className="w-3 h-3 inline ml-2 animate-spin text-brand-500" />}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[80px]"
                      placeholder="Geser pin di peta untuk mengisi otomatis, atau ketik manual..."
                    />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                     <div>Lat: <span className="font-mono text-gray-700">{pinPosition?.lat.toFixed(6) || '-'}</span></div>
                     <div>Lng: <span className="font-mono text-gray-700">{pinPosition?.lng.toFixed(6) || '-'}</span></div>
                  </div>
                </div>

              {(formData.type === 'school' || formData.type === 'kitchen') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'school' ? 'Jumlah Siswa *' : 'Kapasitas Porsi/Hari *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder={formData.type === 'school' ? "Contoh: 500" : "Contoh: 2000"}
                  />
                </div>
              )}

              {formData.type === 'vendor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Komoditas (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.commodities}
                    onChange={e => setFormData({...formData, commodities: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Contoh: Beras, Sayuran, Daging Ayam"
                  />
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
                >
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
