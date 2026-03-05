import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import type { GeoEntity, EntityType } from '../types';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entity: GeoEntity) => void;
}

export const AddEntityModal = ({ isOpen, onClose, onAdd }: AddEntityModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'vendor' as EntityType,
    address: '',
    lat: '',
    lng: '',
    commodities: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.lat || !formData.lng) {
      alert('Mohon isi semua field yang wajib.');
      return;
    }

    const newEntity: GeoEntity = {
      id: `new-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      address: formData.address,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      status: formData.status,
      commodities: formData.commodities.split(',').map(c => c.trim()).filter(Boolean),
      rating: 0,
    };

    onAdd(newEntity);
    onClose();
    setFormData({
      name: '',
      type: 'vendor',
      address: '',
      lat: '',
      lng: '',
      commodities: '',
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                  <input
                    type="text"
                    value="Vendor"
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                  />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="Alamat lengkap..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.lat}
                    onChange={e => setFormData({...formData, lat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                    placeholder="-6.200000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.lng}
                    onChange={e => setFormData({...formData, lng: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                    placeholder="106.816666"
                  />
                </div>
              </div>

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
