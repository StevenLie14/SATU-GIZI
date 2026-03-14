import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle, ArrowRight, BarChart3, PieChart, Activity } from 'lucide-react';

const REGIONAL_DATA = [
  { region: 'Jakarta Selatan', demand: 15000, supply: 12500, deficit: 2500, status: 'warning' },
  { region: 'Jakarta Timur', demand: 18000, supply: 19000, deficit: 0, status: 'success' },
  { region: 'Bandung Kota', demand: 12000, supply: 10000, deficit: 2000, status: 'warning' },
  { region: 'Surabaya Pusat', demand: 16000, supply: 16500, deficit: 0, status: 'success' },
];

export default function ForecastPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
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
              
              <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-gray-100 pb-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`w-full rounded-t-lg transition-all relative ${
                        h > 75 ? 'bg-brand-600' : 'bg-brand-200 group-hover:bg-brand-400'
                      }`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h * 200}
                      </div>
                    </motion.div>
                    <span className="text-[10px] text-gray-400 mt-2 font-bold tracking-tighter">DAY {i+1}</span>
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

      </div>
    </div>
  );
}
