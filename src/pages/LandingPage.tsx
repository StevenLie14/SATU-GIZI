import { motion } from 'framer-motion';
import { ArrowRight, ChefHat, Map, Briefcase, CheckCircle2, Factory, School } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer } from '../utils/animations';
const LandingPage = () => {
  return (
    <div className="bg-white overflow-hidden pb-20">
      
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-brand-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-medium text-sm mb-6 border border-brand-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                </span>
                Sistem Terpadu MBG Action Plan 2026
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl lg:text-6xl font-extrabold text-dark-900 tracking-tight leading-[1.1] mb-6">
                Ekosistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Makan Bergizi Gratis</span> untuk Generasi Emas.
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Satu platform untuk perizinan vendor, visibilitas real-time distribusi, dan matchmaking UMKM bahan baku menuju standar gizi nasional.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link to="/map" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30 group">
                  <Map className="w-5 h-5" />
                  Buka Peta Sebaran
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-dark-900 font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  Pelajari Dashboard
                </button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative lg:ml-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-200/40 to-transparent rounded-3xl transform -rotate-3 scale-105 z-0" />
              <div className="relative z-10 bg-white p-2 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 rounded-2xl h-[400px] w-full relative overflow-hidden flex flex-col">
                  <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-3">
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
                    <div className="h-6 flex-1 bg-gray-100 rounded-md mx-4 opacity-50"/>
                  </div>
                  <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-brand-50/30 relative">
                     <motion.div 
                        animate={{ y: [0, -10, 0] }} 
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" as const }}
                        className="absolute top-1/4 left-1/4 bg-white p-2 rounded-xl shadow-lg flex items-center gap-2"
                      >
                        <div className="bg-brand-100 p-1.5 rounded-lg"><ChefHat className="w-4 h-4 text-brand-600"/></div>
                        <div className="flex flex-col"><div className="w-16 h-2 bg-gray-200 rounded mb-1"/><div className="w-10 h-1.5 bg-gray-100 rounded"/></div>
                     </motion.div>
                     
                     <motion.div 
                        animate={{ y: [0, -8, 0] }} 
                        transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" as const }}
                        className="absolute bottom-1/3 right-1/4 bg-white p-2 rounded-xl shadow-lg flex items-center gap-2 border-l-2 border-blue-500"
                      >
                        <div className="bg-blue-100 p-1.5 rounded-lg"><School className="w-4 h-4 text-blue-600"/></div>
                        <div className="flex flex-col"><div className="w-20 h-2 bg-gray-200 rounded mb-1"/><div className="w-12 h-1.5 bg-gray-100 rounded"/></div>
                     </motion.div>

                     <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
                        <motion.path 
                          d="M120,120 Q200,80 280,220" 
                          fill="none" 
                          stroke="#22c55e" 
                          strokeWidth="2" 
                          strokeDasharray="4 4"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                        />
                     </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {[
              { label: 'lorem ipsum', value: 'angka', icon: Factory, color: 'text-brand-600', bg: 'bg-brand-50' },
              { label: 'lorem ipsum', value: 'angka', icon: School, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'lorem ipsum', value: 'angka', icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'lorem ipsum', value: 'angka', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center px-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-extrabold text-dark-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-600 font-semibold tracking-wide uppercase text-sm mb-3">Tiga Pilar Utama</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">Lorem ipsum dolor sit amet.</h3>
            <p className="text-gray-600 text-lg">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, fugit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-brand-500/5 transition-all"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                <CheckCircle2 className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-dark-900 mb-3">Perizinan & Pengawasan</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum laborum dicta asperiores illo quas necessitatibus?
              </p>
              <ul className="space-y-2">
                {['lorem ipsum dolor', 'lorem ipsum dolor', 'lorem ipsum dolor'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-md border border-brand-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-16 -mt-16 z-0" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 border border-brand-200">
                  <Map className="w-7 h-7 text-brand-600" />
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-3">Matching Demand-Supply</h4>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi iure repudiandae repellat doloremque, eius quibusdam!
                </p>
                <ul className="space-y-2">
                  {['lorem ipsum dolor', 'lorem ipsum dolor', 'lorem ipsum dolor'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-brand-500/5 transition-all"
            >
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100">
                <Briefcase className="w-7 h-7 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold text-dark-900 mb-3">B2B Matchmaking</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe harum deleniti mollitia est, cumque ex.
              </p>
              <ul className="space-y-2">
                {['lorem ipsum dolor', 'lorem ipsum dolor', 'lorem ipsum dolor'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20" />
             
             <div className="relative z-10">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Menjelajahi Sebaran Vendor-Vendor MBG?</h2>
               <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                 Masuk ke Peta Interaktif kami untuk melihat secara langsung infrastruktur, cakupan, dan kapasitas vendor di seluruh wilayah Indonesia.
               </p>
               <Link to="/map" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                  Mulai Jelajah Peta
                  <Map className="w-5 h-5 ml-1" />
               </Link>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
