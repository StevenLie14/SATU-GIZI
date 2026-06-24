import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Phone, Globe, Star, ShieldCheck, 
  ChefHat, School, Briefcase, Calendar, Users, Package, 
  CheckCircle2, AlertCircle, Info, ExternalLink, FileText
} from 'lucide-react';
import type { GeoEntity } from '@/types';
import schoolImg from '@/assets/school.jpg';
import kitchenImg from '@/assets/kitchen.jpg';
import vendorImg from '@/assets/vendor.jpg';
import importantDoc from '@/assets/DOKUMEN PENTING.pdf';
import { getEntity } from '@/services/entities-service';

const EntityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<GeoEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getEntity(id)
      .then(setEntity)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Memuat detail entitas...</p>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-dark-900 mb-2">Entitas Tidak Ditemukan</h1>
        <p className="text-gray-500 mb-6 text-center">Maaf, entitas yang Anda cari tidak tersedia di sistem kami.</p>
        <button 
          onClick={() => navigate('/map')}
          className="px-6 py-2 bg-brand-600 text-white font-bold rounded-full hover:bg-brand-700 transition-all shadow-md"
        >
          Kembali ke Peta
        </button>
      </div>
    );
  }

  const isVendor = entity.type === 'vendor';
  const isSchool = entity.type === 'school';
  const isKitchen = entity.type === 'kitchen';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-600 font-medium transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        <div className="grid lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-white mb-6"
            >
              <img 
                src={entity.image || (isSchool ? schoolImg : isKitchen ? kitchenImg : vendorImg)} 
                alt={entity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 ${
                  isSchool ? 'bg-blue-600 text-white' : 
                  isKitchen ? 'bg-brand-600 text-white' : 
                  'bg-amber-500 text-white'
                }`}>
                  {isSchool && <School size={14} />}
                  {isKitchen && <ChefHat size={14} />}
                  {isVendor && <Briefcase size={14} />}
                  {entity.type.toUpperCase()}
                </div>
              </div>
            </motion.div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                <div className="bg-gray-100 p-2.5 rounded-xl text-gray-500"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lokasi</p>
                  <p className="text-sm text-dark-900 font-medium">{entity.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                <div className="bg-gray-100 p-2.5 rounded-xl text-gray-500"><Phone size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kontak</p>
                  <p className="text-sm text-dark-900 font-medium">{entity.phone || "Belum Tersedia"}</p>
                </div>
              </div>

              {entity.website && (
                <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="bg-gray-100 p-2.5 rounded-xl text-gray-500"><Globe size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Website</p>
                    <a href="#" className="text-sm text-brand-600 font-bold flex items-center gap-1">
                      {entity.website} <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-10"
             >
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-4xl font-extrabold text-dark-900">{entity.name}</h1>
                  {entity.rating && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                      <Star size={18} fill="currentColor" />
                      <span className="font-bold">{entity.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {entity.description || "Data deskripsi untuk entitas ini sedang diperbarui untuk akurasi yang lebih baik dalam mendukung program Makan Bergizi Gratis."}
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                    <ShieldCheck className="text-green-500" size={24} />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Status Verifikasi</p>
                      <p className="text-sm font-bold text-dark-900">{entity.status === 'active' ? 'Terverifikasi' : 'Dalam Proses'}</p>
                    </div>
                  </div>
                  
                  {entity.capacity && (
                    <div className="px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                      {isSchool ? <Users className="text-blue-500" size={24} /> : <Package className="text-brand-500" size={24} />}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{isSchool ? 'Jumlah Siswa' : 'Kapasitas Produksi'}</p>
                        <p className="text-sm font-bold text-dark-900">{entity.capacity.toLocaleString()} {isSchool ? 'Anak' : 'Porsi/Hari'}</p>
                      </div>
                    </div>
                  )}

                  {entity.auditScore !== undefined && (
                    <div className="px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-500" size={24} />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Skor Audit</p>
                        <p className="text-sm font-bold text-dark-900">{entity.auditScore}%</p>
                      </div>
                    </div>
                  )}
                </div>
             </motion.div>

             <div className="grid md:grid-cols-2 gap-6">
                
                {isVendor && (
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm md:col-span-2">
                    <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                      <Package size={20} className="text-brand-600" /> Komoditas Utama
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {entity.commodities?.map((c, i) => (
                        <div key={i} className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl border border-gray-100">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-600" /> Jam Operasional
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between font-medium"><span>Senin - Jumat</span> <span>07:00 - 15:00</span></div>
                    <div className="flex justify-between font-medium text-gray-400"><span>Sabtu - Minggu</span> <span>Tutup</span></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                    <Info size={20} className="text-amber-600" /> Info Tambahan
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Memenuhi SNI</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Akses Kendaraan Besar</li>
                  </ul>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-white to-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
                        <FileText size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-900 flex items-center gap-2">
                          Blockchain Verified Documents
                          <ShieldCheck size={18} className="text-blue-500" />
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-md">
                          {isSchool && "Sertifikat pendaftaran sekolah, data siswa (DAPODIK), dan laporan kelayakan gedung terverifikasi blockchain."}
                          {isVendor && "Izin usaha (NIB), sertifikasi halal, dan laporan audit rantai pasok yang tersimpan secara permanen."}
                          {isKitchen && "Hasil verifikasi pengawasan, sertifikat higienitas, dan kelayakan operasional dapur pusat."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <div className="px-3 py-1 bg-blue-100/50 rounded-lg border border-blue-200 flex items-center gap-2">
                             <span className="text-[10px] font-black text-blue-700 uppercase">TX Hash</span>
                             <code className="text-[11px] font-mono text-blue-900 font-bold">0x74a2...9bfe</code>
                          </div>
                          <div className="px-3 py-1 bg-emerald-100/50 rounded-lg border border-emerald-200 flex items-center gap-2">
                             <span className="text-[10px] font-black text-emerald-700 uppercase">Block</span>
                             <code className="text-[11px] font-mono text-emerald-900 font-bold">#19,482,103</code>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <a 
                      href={importantDoc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white border-2 border-gray-100 text-dark-900 font-bold rounded-xl hover:bg-gray-50 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm flex items-center gap-2 shrink-0 group-hover:shadow-md"
                    >
                      <ExternalLink size={18} /> View Document
                    </a>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-[60px] opacity-20 -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-100 rounded-full blur-[40px] opacity-20 -ml-12 -mb-12" />
                </div>

                <div className="md:col-span-2 pt-6">
                   <div className="bg-dark-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-1">Mulai Koordinasi Distribusi</h3>
                        <p className="text-gray-400 text-sm">Hubungkan entitas ini ke dalam rantai pasok wilayah Anda.</p>
                      </div>
                      <button className="relative z-10 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-all shadow-lg flex items-center gap-2">
                        Hubungi Pengelola <ExternalLink size={18} />
                      </button>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[60px] opacity-20 -mr-16 -mt-16" />
                   </div>
                </div>

             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EntityDetailPage;
