import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Map as MapIcon, ChevronRight, Briefcase, Plus, ChefHat, School, Navigation, Users, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '@/components/common/map-component';
import { AddEntityModal } from '@/components/common/add-entity-modal';
import { PageHeader, Button } from '@/components/ui';
import type { GeoEntity, EntityType } from '@/types';
import { getEntities, createEntity } from '@/services/entities-service';
import { nearestOfType, formatKm } from '@/lib/geo';

const REGIONS = [
  { name: 'Jakarta', lat: -6.2, lng: 106.816666 },
  { name: 'Bandung', lat: -6.917464, lng: 107.619123 },
  { name: 'Surabaya', lat: -7.250445, lng: 112.768845 },
];

const MapDashboard = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<EntityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2, 106.816666]);
  const [mapZoom, setMapZoom] = useState(12);
  const [entities, setEntities] = useState<GeoEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getEntities()
      .then(setEntities)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredEntities = useMemo(() => {
    return entities.filter((entity) => {
      const matchType = filterType === 'all' || entity.type === filterType;
      const term = searchQuery.toLowerCase();
      const matchSearch =
        entity.name.toLowerCase().includes(term) ||
        entity.address.toLowerCase().includes(term) ||
        (entity.type === 'vendor' && entity.commodities?.some((c) => c.toLowerCase().includes(term)));
      return matchType && matchSearch;
    });
  }, [entities, filterType, searchQuery]);

  const stats = useMemo(
    () => ({
      totalVendors: filteredEntities.filter((e) => e.type === 'vendor').length,
      totalSchools: filteredEntities.filter((e) => e.type === 'school').length,
      totalKitchens: filteredEntities.filter((e) => e.type === 'kitchen').length,
      students: filteredEntities.filter((e) => e.type === 'school').reduce((a, e) => a + (e.capacity ?? 0), 0),
      porsi: filteredEntities.filter((e) => e.type === 'kitchen').reduce((a, e) => a + (e.capacity ?? 0), 0),
    }),
    [filteredEntities],
  );

  const focusRegion = (lat: number, lng: number, zoom = 13) => {
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  };

  const handleAddEntity = async (newEntity: GeoEntity) => {
    const createdEntity = await createEntity(newEntity);
    setEntities((prev) => [createdEntity, ...prev]);
    focusRegion(createdEntity.lat, createdEntity.lng, 15);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const filters: { id: EntityType | 'all'; label: string; icon?: typeof School; active: string }[] = [
    { id: 'all', label: 'Semua', active: 'bg-brand-50 text-brand-700 border-brand-200' },
    { id: 'school', label: 'Sekolah', icon: School, active: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'kitchen', label: 'Dapur', icon: ChefHat, active: 'bg-brand-50 text-brand-700 border-brand-200' },
    { id: 'vendor', label: 'Vendor', icon: Briefcase, active: 'bg-amber-50 text-amber-700 border-amber-200' },
  ];

  return (
    <div>
      <PageHeader
        title="Peta Sebaran"
        subtitle="Pantau sebaran Sekolah, Dapur/SPPG, dan Vendor pemasok beserta jangkauan logistiknya"
        icon={MapIcon}
        actions={
          <Button icon={Plus} onClick={() => { setSelectedLocation(null); setIsModalOpen(true); }}>
            Tambah Titik
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:h-[calc(100vh-13rem)] lg:min-h-[580px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-[360px] shrink-0 bg-white border border-gray-200/80 rounded-2xl flex flex-col overflow-hidden lg:h-full">
          <div className="p-4 border-b border-gray-100 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1"><Users size={14} /><span className="text-[10px] font-bold uppercase tracking-wide">Siswa</span></div>
                <p className="text-lg font-bold text-dark-900 leading-none">{stats.students.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-100">
                <div className="flex items-center gap-1.5 text-brand-600 mb-1"><Utensils size={14} /><span className="text-[10px] font-bold uppercase tracking-wide">Kapasitas</span></div>
                <p className="text-lg font-bold text-dark-900 leading-none">{stats.porsi.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 text-sm transition-all"
                placeholder="Cari nama, lokasi, atau komoditas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                    filterType === f.id ? f.active : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f.icon && <f.icon className="w-4 h-4" />} {f.label}
                </button>
              ))}
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Area Fokus</h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {REGIONS.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => focusRegion(region.lat, region.lng)}
                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 lg:overflow-y-auto p-3 space-y-2.5">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-medium text-gray-500">{filteredEntities.length} hasil</span>
              <div className="text-[11px] font-medium flex gap-1.5 flex-wrap justify-end">
                {stats.totalSchools > 0 && <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{stats.totalSchools} Sekolah</span>}
                {stats.totalKitchens > 0 && <span className="text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">{stats.totalKitchens} Dapur</span>}
                {stats.totalVendors > 0 && <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{stats.totalVendors} Vendor</span>}
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="mt-2 text-xs text-gray-500 font-medium">Memuat data...</p>
              </div>
            ) : (
              filteredEntities.map((entity) => {
                const nearest = entity.type !== 'kitchen' ? nearestOfType(entity, entities, 'kitchen') : null;
                return (
                  <motion.div
                    key={entity.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md bg-white group border-gray-100 ${
                      entity.type === 'school' ? 'hover:border-blue-300' : entity.type === 'kitchen' ? 'hover:border-brand-300' : 'hover:border-amber-300'
                    }`}
                    onClick={() => navigate(`/detail/${entity.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          entity.type === 'school' ? 'bg-blue-50 text-blue-600' : entity.type === 'kitchen' ? 'bg-brand-50 text-brand-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {entity.type === 'school' && <School size={16} />}
                          {entity.type === 'kitchen' && <ChefHat size={16} />}
                          {entity.type === 'vendor' && <Briefcase size={16} />}
                        </div>
                        <h4 className="font-semibold text-dark-900 text-sm truncate">{entity.name}</h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-1">{entity.address}</p>

                    {nearest && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                        <Navigation size={11} className="text-brand-500 shrink-0" />
                        Dapur terdekat: <span className="font-semibold text-dark-900 truncate">{nearest.entity.name}</span>
                        <span className="text-gray-400 shrink-0">· {formatKm(nearest.distanceKm)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-gray-50">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Aktif</span>
                      <span className="font-bold text-dark-900 text-right max-w-[150px] truncate">
                        {entity.type === 'vendor'
                          ? entity.auditScore !== undefined
                            ? <span className={entity.auditScore >= 80 ? 'text-emerald-600' : entity.auditScore >= 60 ? 'text-amber-600' : 'text-red-600'}>Audit: {entity.auditScore}%</span>
                            : entity.commodities?.join(', ')
                          : `${entity.capacity?.toLocaleString('id-ID')} ${entity.type === 'school' ? 'Anak' : 'Porsi'}`}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}

            {!isLoading && filteredEntities.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <Filter className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Tidak ada entitas yang sesuai.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-200/80 h-[440px] lg:h-full">
          <MapComponent
            entities={filteredEntities}
            center={mapCenter}
            zoom={mapZoom}
            onMapClick={handleMapClick}
            onAuditClick={() => navigate('/audit')}
            onDetailClick={(entity) => navigate(`/detail/${entity.id}`)}
          />

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-4 pointer-events-none">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Legenda</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-blue-500" /> Sekolah <span className="text-gray-400">· {stats.totalSchools}</span></div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-brand-500" /> Dapur / SPPG <span className="text-gray-400">· {stats.totalKitchens}</span></div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-amber-500" /> Vendor <span className="text-gray-400">· {stats.totalVendors}</span></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1 max-w-[170px] leading-tight"><Plus size={11} /> Klik peta untuk menambah titik</p>
          </div>
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
