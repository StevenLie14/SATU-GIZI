import { motion } from 'framer-motion';
import { 
  TrendingUp, AlertTriangle, CheckCircle, ArrowRight, BarChart3, 
  PieChart, Activity, Navigation, Truck, 
  Users, Info, Zap, X
} from 'lucide-react';
import { useState } from 'react';

const REGIONAL_DATA = [
  { region: 'Jakarta Selatan', demand: 15000, supply: 12500, deficit: 2500, status: 'warning' },
  { region: 'Jakarta Timur', demand: 18000, supply: 19000, deficit: 0, status: 'success' },
  { region: 'Bandung Kota', demand: 12000, supply: 10000, deficit: 2000, status: 'warning' },
  { region: 'Surabaya Pusat', demand: 16000, supply: 16500, deficit: 0, status: 'success' },
];

export default function ForecastPage() {
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'forecast' | 'allocation'>('forecast');

  const ALLOCATION_MATRIX = [
    { source: 'Dapur Pusat Tebet', target: 'SDN Menteng 01', porsi: 450, time: '12 min', efficiency: 98 },
    { source: 'Dapur Pusat Tebet', target: 'SDN Tebet 05', porsi: 320, time: '8 min', efficiency: 99 },
    { source: 'Dapur Sehat Senen', target: 'SMPN 1 Jakarta', porsi: 800, time: '22 min', efficiency: 94 },
    { source: 'Dapur Sehat Senen', target: 'SDN Senen 03', porsi: 280, time: '5 min', efficiency: 97 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 flex items-center gap-3">
              <TrendingUp className="text-brand-600 w-8 h-8" />
              Demand-Supply Forecasting
            </h1>
            <p className="text-gray-500 mt-1">Estimasi kebutuhan vs ketersediaan pangan antar wilayah.</p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none shadow-sm">
              <option>Semua Komoditas</option>
              <option>Beras</option>
              <option>Daging Ayam</option>
              <option>Sayuran</option>
            </select>
            <button className="px-6 py-2 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-all shadow-md">
              Update Prediksi
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
           <button
             onClick={() => setActiveTab('forecast')}
             className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
               activeTab === 'forecast' ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'
             }`}
           >
             AI Demand Forecasting
           </button>
           <button 
             onClick={() => setActiveTab('allocation')}
             className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
               activeTab === 'allocation' ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'
             }`}
           >
             Dynamic Allocation Matrix
           </button>
        </div>

        {activeTab === 'forecast' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Demand Nasional', value: '61,000', sub: '+5.2% dari bln lalu', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Supply Tersedia', value: '58,000', sub: 'Puncak panen raya', icon: PieChart, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Gap Prediksi (Defisit)', value: '3,000', sub: 'Membutuhkan distribusi antar wilayah', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-500">{stat.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-dark-900">{stat.value}</span>
                <span className="text-xs text-gray-400 mb-1.5">Porsi / Hari</span>
              </div>
              <p className="text-xs font-medium text-gray-400 mt-2">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <h2 className="text-lg font-bold text-dark-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-brand-600 w-5 h-5" />
                Tren Kebutuhan 7 Hari Kedepan
              </h2>
              
              <div className="h-[280px] flex items-end justify-between gap-4 px-4 border-b border-gray-100 pb-2 bg-gray-50/30 rounded-2xl mb-4">
                {[45, 65, 45, 85, 55, 95, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1.5, type: 'spring', bounce: 0.3, delay: i * 0.1 }}
                      className={`w-full max-w-[40px] rounded-t-xl transition-all relative shadow-lg ${
                        h > 80 ? 'bg-brand-600' : 'bg-brand-400 group-hover:bg-brand-500'
                      }`}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-xl whitespace-nowrap z-30">
                        {h * 250} Porsi
                      </div>
                      <div className="absolute inset-0 bg-white/10 rounded-t-xl" />
                    </motion.div>
                    <span className="text-[10px] text-gray-500 mt-3 font-black tracking-tighter uppercase whitespace-nowrap">HARI {i+1}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-600 rounded-full" />
                  <span className="text-xs text-gray-500 font-medium">Demand Tinggi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-200 rounded-full" />
                  <span className="text-xs text-gray-500 font-medium">Batas Aman</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-900 rounded-3xl p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Rangkuman Rekomendasi Distribusi</h3>
                  <p className="text-brand-200 text-sm max-w-md">
                    Berdasarkan AI Forecasting, wilayah **Jakarta Selatan** diprediksi akan mengalami lonjakan permintaan Sayuran sebesar 15% pada 3 hari mendatang. Disarankan alokasi supply dari **Bandung**.
                  </p>
                </div>
                <button className="px-6 py-3 bg-white text-brand-900 font-bold rounded-xl hover:bg-brand-50 transition-all flex items-center gap-2 shrink-0">
                  Lakukan Alokasi <ArrowRight size={18} />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-800 rounded-full -mr-20 -mt-20 opacity-50" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-800 rounded-full -ml-10 -mb-10 opacity-30" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-dark-900 px-2">Breakdown Wilayah</h2>
            {REGIONAL_DATA.map((data, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-dark-900">{data.region}</h3>
                    <p className="text-xs text-gray-400">Status: {data.status === 'success' ? 'Cukup' : 'Butuh Suplai'}</p>
                  </div>
                  {data.status === 'success' ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <AlertTriangle className="text-amber-500 w-5 h-5" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-bold">
                      <span className="text-gray-400">PEMENUHAN SUPLAI</span>
                      <span className={data.deficit > 0 ? 'text-amber-600' : 'text-green-600'}>
                        {Math.round((data.supply / data.demand) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.supply / data.demand) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full ${data.deficit > 0 ? 'bg-amber-500' : 'bg-green-500'}`}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Gap Defisit:</span>
                    <span className={`font-bold ${data.deficit > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {data.deficit > 0 ? `-${data.deficit.toLocaleString()}` : '0'} 
                      <span className="text-[10px] ml-1">Porsi</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-bold hover:border-brand-300 hover:text-brand-600 transition-all">
              + Tambah Wilayah Pantauan
            </button>
          </motion.div>
        </div>
        </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                     <h2 className="text-2xl font-bold text-dark-900 flex items-center gap-2">
                        <Zap className="text-brand-600 fill-current" size={24} />
                        AI-Driven Dynamic Allocation
                     </h2>
                     <p className="text-gray-500 text-sm mt-1">Penentuan otomatis titik masak (SPPG/Dapur) ke titik antar (Sekolah) berdasarkan kapasitas real-time.</p>
                  </div>
                  <button 
                    onClick={() => setIsRouteOpen(true)}
                    className="px-6 py-3 bg-dark-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-xl"
                  >
                     <Navigation size={18} /> Visualize Optimized Routes
                  </button>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-100 text-xs text-gray-400 font-black uppercase tracking-widest">
                           <th className="pb-4 px-4 font-black">Source (Dapur/SPPG)</th>
                           <th className="pb-4 px-4 font-black">Target (Sekolah)</th>
                           <th className="pb-4 px-4 font-black">Alokasi (Porsi)</th>
                           <th className="pb-4 px-4 font-black">ETD (Waktu Antar)</th>
                           <th className="pb-4 px-4 font-black text-right">Efisiensi</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {ALLOCATION_MATRIX.map((row, i) => (
                           <tr key={i} className="group hover:bg-gray-50 transition-colors">
                              <td className="py-5 px-4">
                                 <div className="flex items-center gap-2 font-bold text-dark-900 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                                    {row.source}
                                 </div>
                              </td>
                              <td className="py-5 px-4 font-medium text-gray-600 text-sm">{row.target}</td>
                              <td className="py-5 px-4">
                                 <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-black">
                                    {row.porsi} Porsi
                                 </span>
                              </td>
                              <td className="py-5 px-4">
                                 <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                    <Truck size={14} /> {row.time}
                                 </div>
                              </td>
                              <td className="py-5 px-4 text-right">
                                 <span className="text-sm font-black text-brand-600">{row.efficiency}%</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-blue-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                        <Users className="text-white" size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-2">Demand Logic (By Enrollment)</h3>
                     <p className="text-blue-200 text-sm mb-6">
                        Algoritma alokasi kami menghitung kebutuhan berdasarkan jumlah siswa aktif (DAPODIK) * standar asupan 300g per anak.
                     </p>
                     <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <code className="text-[10px] text-blue-300">
                           Allocation = (Student_Count * Std_Asupan) + 5%_Buffer_Stock
                        </code>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-800 rounded-full blur-[60px] opacity-40 -mr-16 -mt-16" />
               </div>

               <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-dark-900 mb-4 flex items-center gap-2">
                     <Info size={20} className="text-amber-500" /> Status Alokasi Nasional
                  </h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                        <span className="text-sm font-medium text-gray-600">Total Alokasi Aktif</span>
                        <span className="text-lg font-black text-brand-600">128 Titik</span>
                     </div>
                     <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                        <span className="text-sm font-medium text-gray-600">Realisasi Pengiriman</span>
                        <span className="text-lg font-black text-blue-600">92%</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {isRouteOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-4xl w-full relative border-8 border-gray-50"
             >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-dark-900 text-white rounded-2xl"><Navigation /></div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-900">AI Route Optimization</h3>
                        <p className="text-xs text-gray-500 font-medium">Meminimalkan Biaya & Waktu Pengiriman Makanan Segar</p>
                      </div>
                   </div>
                   <button onClick={() => setIsRouteOpen(false)} className="text-gray-400 hover:text-dark-900"><X /></button>
                </div>

                <div className="p-4 grid lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 relative aspect-video bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
                      <div className="absolute inset-0 bg-gray-200 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')]" />
                      
                      <div className="absolute inset-0 p-12">
                         <div className="relative w-full h-full">
                            <div className="absolute left-1/4 top-1/2 -ml-3 -mt-3 w-6 h-6 bg-brand-600 rounded-full border-4 border-white shadow-lg z-20">
                               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-dark-900 text-white text-[8px] px-2 py-0.5 rounded whitespace-nowrap">DAPUR PUSAT</div>
                            </div>
                            
                            {[
                               { x: '70%', y: '20%', label: 'SDN 01' },
                               { x: '80%', y: '50%', label: 'SMPN 87' },
                               { x: '60%', y: '80%', label: 'SDN 05' },
                            ].map((s, i) => (
                               <div key={i} className="absolute w-4 h-4 bg-blue-600 rounded-sm border-2 border-white shadow-md z-20" style={{ left: s.x, top: s.y }}>
                                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500">{s.label}</div>
                               </div>
                            ))}

                            <svg className="absolute inset-0 w-full h-full overflow-visible">
                               <motion.path 
                                 d="M 25% 50% L 70% 20%" 
                                 fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="8 4" 
                                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }}
                               />
                               <motion.path 
                                 d="M 25% 50% L 80% 50%" 
                                 fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="8 4" 
                                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                               />
                               <motion.path 
                                 d="M 25% 50% L 60% 80%" 
                                 fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="8 4" 
                                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                               />
                            </svg>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100">
                         <h4 className="text-xs font-black text-brand-600 uppercase mb-3 tracking-widest">Optimasi Hasil</h4>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <span className="text-sm font-medium text-gray-600">Penghematan Waktu</span>
                               <span className="text-lg font-black text-brand-600">22%</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-sm font-medium text-gray-600">Penghematan BBM</span>
                               <span className="text-lg font-black text-brand-600">15.4%</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                         <h4 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Parameter AI</h4>
                         <ul className="space-y-2 text-[11px] font-bold text-gray-500">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full" /> Live Traffic Congestion</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full" /> Vehicle Capacity Load</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full" /> Food Freshness Window</li>
                         </ul>
                      </div>

                      <button 
                        onClick={() => setIsRouteOpen(false)}
                        className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-lg hover:bg-brand-700 transition-all"
                      >
                        Terapkan Rute
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
