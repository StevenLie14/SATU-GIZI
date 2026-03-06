import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Map as MapIcon, ChevronRight, Briefcase, Plus } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { AddEntityModal } from '../components/AddEntityModal';
import { mockEntities } from '../data/mockData';
import type { GeoEntity, EntityType } from '../types';

const MapDashboard = () => {
  const [filterType, setFilterType] = useState<EntityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.200000, 106.816666]); // Default Jakarta
  const [mapZoom, setMapZoom] = useState(12);
  const [entities, setEntities] = useState<GeoEntity[]>(mockEntities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchType = filterType === 'all' || entity.type === filterType;
      const term = searchQuery.toLowerCase();
      const matchSearch = entity.name.toLowerCase().includes(term) || 
                          entity.address.toLowerCase().includes(term) ||
                          (entity.type === 'vendor' && entity.commodities?.some(c => c.toLowerCase().includes(term)));
      return matchType && matchSearch;
    });
  }, [entities, filterType, searchQuery]);

  const stats = useMemo(() => ({
    totalVendors: filteredEntities.filter(e => e.type === 'vendor').length,
  }), [filteredEntities]);

  const focusRegion = (lat: number, lng: number, zoom: number = 13) => {
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  };

  const handleAddEntity = (newEntity: GeoEntity) => {
    setEntities([newEntity, ...entities]);
    focusRegion(newEntity.lat, newEntity.lng, 15);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] flex bg-gray-50 flex-col md:flex-row overflow-hidden">
      
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-[380px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-80px)] shrink-0 z-10 shadow-lg"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-dark-900 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-brand-600" />
              Navigasi Sebaran
            </h2>
            <button 
              onClick={() => { setSelectedLocation(null); setIsModalOpen(true); }}
              className="p-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-lg transition-colors group"
              title="Tambah Titik Baru"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Pantau kapasitas dan komoditas Vendor Pemasok di seluruh wilayah.</p>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
              placeholder="Cari nama vendor, lokasi, atau komoditas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 overflow-hidden py-2 text-xs font-medium rounded-lg border transition-all flex justify-center items-center gap-1 bg-amber-50 text-amber-700 border-amber-200`}
            >
              <Briefcase className="w-4 h-4" /> Semua Vendor
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Area Fokus</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { name: 'Jakarta', lat: -6.200000, lng: 106.816666 },
              { name: 'Bandung', lat: -6.917464, lng: 107.619123 },
              { name: 'Surabaya', lat: -7.250445, lng: 112.768845 }
            ].map(region => (
              <button 
                key={region.name}
                onClick={() => focusRegion(region.lat, region.lng)}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-medium text-gray-500">Menampilkan {filteredEntities.length} hasil</span>
            <div className="text-[11px] font-medium flex gap-2 flex-wrap justify-end">
              {stats.totalVendors > 0 && <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{stats.totalVendors} Vendor</span>}
            </div>
          </div>

          {filteredEntities.map(entity => (
            <motion.div 
              key={entity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md bg-white hover:border-amber-300 border-gray-100`}
              onClick={() => focusRegion(entity.lat, entity.lng, 15)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   <div className={`p-1.5 rounded-lg bg-amber-50 text-amber-600`}>
                      <Briefcase size={16}/>
                   </div>
                   <h4 className="font-semibold text-dark-900 text-sm">{entity.name}</h4>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 mt-1" />
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 mb-2">{entity.address}</p>
              
              <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-gray-50">
                <span className={`px-2 py-0.5 rounded-full ${entity.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  Aktif
                </span>
                <span className="font-bold text-dark-900 text-right max-w-[150px] truncate">
                  {entity.commodities?.join(', ')}
                </span>
              </div>
            </motion.div>
          ))}
          
          {filteredEntities.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <Filter className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Tidak ada entitas yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </motion.aside>

      <div className="flex-1 relative bg-gray-100">
        <div className="absolute inset-0 p-4 pb-8 md:p-6 lg:p-8">
           <MapComponent 
             entities={filteredEntities} 
             center={mapCenter} 
             zoom={mapZoom} 
             onMapClick={handleMapClick}
           />
        </div>
      </div>
      
      <AddEntityModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAdd={handleAddEntity}
        initialLocation={selectedLocation}
      />
    </div>
  );
};

export default MapDashboard;
