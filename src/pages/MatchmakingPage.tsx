import { motion } from 'framer-motion';
import { Handshake, Search, ArrowRightLeft, Star, Clock, MapPin, CheckCircle2, Factory, ChefHat } from 'lucide-react';

const MATCHES = [
  {
    id: 1,
    kitchen: { name: 'Dapur Pusat Tebet', location: 'Tebet, Jaksel' },
    vendor: { name: 'PT Maju Tani Pangan', location: 'Tebet Timur', rating: 4.8 },
    matchScore: 98,
    commodity: 'Beras & Sayur',
    distance: '1.2 km',
    status: 'connected'
  },
  {
    id: 2,
    kitchen: { name: 'Dapur Sehat Kebayoran', location: 'Kebayoran Baru, Jaksel' },
    vendor: { name: 'Agen Telur Berkah', location: 'Palmerah', rating: 4.6 },
    matchScore: 92,
    commodity: 'Telur Ayam',
    distance: '4.5 km',
    status: 'suggested'
  },
  {
    id: 3,
    kitchen: { name: 'Kitchen Hub Senen', location: 'Senen, Jakpus' },
    vendor: { name: 'CV Berkah Lauk', location: 'Pasar Senen', rating: 4.7 },
    matchScore: 95,
    commodity: 'Daging & Ikan',
    distance: '0.8 km',
    status: 'pending'
  }
];

export default function MatchmakingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 flex items-center gap-3">
              <Handshake className="text-brand-600 w-9 h-9" />
              B2B Matchmaking
            </h1>
            <p className="text-gray-500 mt-1">Sistem penjodohan cerdas antara Dapur Pusat dan Vendor bahan baku terdekat.</p>
          </div>
          
          <div className="relative min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari Dapur atau Vendor..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-dark-900 mb-4 flex items-center gap-2">
                <Search size={18} className="text-brand-600" /> Filter Cerdas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Radius Distribusi</label>
                  <input type="range" className="w-full accent-brand-600" />
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                    <span>1 KM</span>
                    <span>10 KM</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[3, 4, 5].map(s => (
                      <button key={s} className="flex-1 py-2 border border-gray-100 rounded-xl text-xs font-bold hover:bg-brand-50 hover:border-brand-200 transition-all">
                        {s}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Jenis Bahan Baku</label>
                  <div className="space-y-2">
                    {['Protein Hewani', 'Karbohidrat', 'Sayuran', 'Bumbu Dapur'].map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                        <span className="text-sm text-gray-600 group-hover:text-dark-900 transition-colors">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-900 p-6 rounded-3xl text-white">
              <h4 className="font-bold text-lg mb-2">Algoritma Matchmaking</h4>
              <p className="text-xs text-brand-200 leading-relaxed mb-4">
                Sistem kami menggunakan jarak logistik, kapasitas vendor, dan histori audit blockchain untuk menentukan kecocokan terbaik.
              </p>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
                <CheckCircle2 className="text-brand-400" size={20} />
                <span className="text-[10px] font-bold">SMART MATCHING ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-bold text-dark-900 flex items-center gap-2 px-2">
              <Handshake className="text-brand-600" size={24} />
              Rekomendasi Penjodohan Terkini
            </h2>

            {MATCHES.map((match, i) => (
              <motion.div 
                key={match.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                        <ChefHat size={20} />
                      </div>
                      <span className="text-xs font-bold text-brand-600 tracking-wider">DAPUR PUSAT</span>
                    </div>
                    <h3 className="text-lg font-bold text-dark-900">{match.kitchen.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                      <MapPin size={14} /> {match.kitchen.location}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-gray-50 flex items-center justify-center">
                        <span className="text-xl font-black text-brand-600">{match.matchScore}%</span>
                      </div>
                      <svg className="absolute top-0 left-0 w-20 h-20 -rotate-90">
                        <circle 
                          cx="40" cy="40" r="38" 
                          fill="none" stroke="currentColor" strokeWidth="4" 
                          className="text-brand-600"
                          strokeDasharray={239}
                          strokeDashoffset={239 - (239 * match.matchScore) / 100}
                        />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">Match Score</span>
                    <div className="mt-4 text-brand-600 animate-pulse hidden md:block">
                      <ArrowRightLeft size={24} />
                    </div>
                  </div>

                  <div className="flex-1 w-full text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end gap-3 mb-3">
                      <span className="text-xs font-bold text-amber-600 tracking-wider">VENDOR PEMASOK</span>
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                        <Factory size={20} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-dark-900">{match.vendor.name}</h3>
                    <div className="flex items-center justify-center md:justify-end gap-3 mt-1">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <MapPin size={14} /> {match.vendor.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star size={14} fill="currentColor" /> {match.vendor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">Estimasi Kirim: <strong className="text-dark-900">15-30 Menit</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                       <MapPin size={16} className="text-gray-400" />
                       <span className="text-xs text-gray-500 font-medium">Jarak: <strong className="text-dark-900">{match.distance}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-brand-600 mr-2">Fokus Komoditas: {match.commodity}</span>
                    <button className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      match.status === 'connected' 
                        ? 'bg-green-100 text-green-700 border border-green-200 cursor-default flex items-center gap-1' 
                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'
                    }`}>
                      {match.status === 'connected' ? (
                        <>
                          <CheckCircle2 size={14} /> Sudah Terkoneksi
                        </>
                      ) : match.status === 'pending' ? 'Menunggu Persetujuan' : 'Mulai Matchmaking'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <button className="w-full py-5 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-brand-300 hover:text-brand-600 transition-all">
              + Cari Match Baru Secara Manual
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
