import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Mail, Lock, Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { vendorIcon } from '../utils/mapIcons';

const LocationPicker = ({ onSelect }: { onSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    password: '',
    commodities: '',
    lat: -6.200000,
    lng: 106.816666,
  });
  
  const [locationSelected, setLocationSelected] = useState(false);
  const navigate = useNavigate();

  const handleDragEnd = (e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setFormData({ ...formData, lat: position.lat, lng: position.lng });
    setLocationSelected(true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData({ ...formData, lat, lng });
    setLocationSelected(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering Vendor:', formData);
    alert('lorem15');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8 pt-24 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors font-medium">
           <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Menjadi Mitra Pemasok</h2>
          <p className="mt-2 text-sm text-gray-600 mb-8">
            Daftarkan bisnis atau koperasi Anda untuk mensuplai rantai pasok Gizi Nasional. Lengkapi detail serta tandai lokasi fasilitas penyimpanan Anda.
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-4xl flex flex-col lg:flex-row gap-6"
      >
        <div className="flex-1 bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 relative z-10">
          <form className="space-y-5" onSubmit={handleRegister}>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Badan Usaha / Koperasi</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="Contoh: PT. Pangan Segar Nusantara"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daftar Komoditas (Pemisah Koma)</label>
              <textarea
                required
                rows={2}
                value={formData.commodities}
                onChange={(e) => setFormData({...formData, commodities: e.target.value})}
                className="block w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all bg-gray-50/50 focus:bg-white resize-none"
                placeholder="Daging Ayam Beku, Telur, Beras, Sayuran Hidroponik..."
              />
            </div>

            <div className="hidden">
               <input required value={locationSelected ? 'yes' : ''} readOnly />
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2 items-center text-sm font-medium">
                 {locationSelected ? (
                   <span className="text-green-600 flex items-center gap-1.5"><MapPin className="w-5 h-5"/> Lokasi Tersimpan</span>
                 ) : (
                   <span className="text-amber-500 flex items-center gap-1.5"><MapPin className="w-5 h-5"/> Silakan tentukan lokasi di peta 👉</span>
                 )}
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 transition-all hover:-translate-y-0.5"
              >
                Kirim Pendaftaran <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="flex-1 bg-white p-2 shadow-xl shadow-gray-200/50 sm:rounded-2xl border border-gray-100 h-[400px] lg:h-auto overflow-hidden flex flex-col relative z-0">
          <div className="px-4 py-3 bg-gray-50 rounded-t-xl border-b border-gray-100 text-sm">
             <span className="font-bold text-dark-900 block mb-0.5">Tandai Fasilitas Gudang / Distribusi Anda</span>
             <span className="text-gray-500 text-xs">Geser ujung pin kuning atau klik di manapun pada peta.</span>
          </div>
          <div className="flex-1 relative isolate">
             <MapContainer 
               center={[formData.lat, formData.lng]} 
               zoom={13} 
               style={{ height: '100%', width: '100%' }}
               className="rounded-b-xl z-0"
             >
               <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
               />
               <LocationPicker onSelect={handleMapClick} />
               <Marker 
                  position={[formData.lat, formData.lng]} 
                  icon={vendorIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend: handleDragEnd,
                  }}
               />
             </MapContainer>
          </div>
        </div>
        
      </motion.div>
    </div>
  );
};

export default RegisterPage;
