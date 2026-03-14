import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardCheck, Save, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { GeoEntity } from '../types';

interface AuditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: GeoEntity | null;
  onSubmit: (vendorId: string, results: any) => void;
}

type AuditStatus = 'pass' | 'fail' | 'na' | null;

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  reference: string;
}

const auditItems: ChecklistItem[] = [
  {
    id: '1.1',
    category: 'Fasilitas Fisik & Lingkungan Penyimpanan',
    title: 'Kebersihan Bangunan & Pest Control',
    description: 'Gedung bebas dari retakan, ada kawat nyamuk, dan pencahayaan cukup.',
    reference: 'ISO 22000:2018 (Klausul 8.2) & CPPOB BPOM',
  },
  {
    id: '1.2',
    category: 'Fasilitas Fisik & Lingkungan Penyimpanan',
    title: 'Suhu & Kelembapan Gudang (Cold Chain)',
    description: 'Freezer berfungsi baik, dilengkapi termometer eksternal, dan dicatat suhunya (Daging < 4°C, Beku < -18°C).',
    reference: 'ISO 22000:2018 (Klausul 8.5.4)',
  },
  {
    id: '1.3',
    category: 'Fasilitas Fisik & Lingkungan Penyimpanan',
    title: 'Pemisahan Bahan (Cross-Contamination)',
    description: 'Pemisahan bahan mentah, matang, alergen, dan bahan kimia.',
    reference: 'ISO 22000:2018 (Klausul 8.2.4)',
  },
  {
    id: '2.1',
    category: 'Logistik, Kendaraan & Pengiriman',
    title: 'Standar Kebersihan Armada Angkut',
    description: 'Kendaraan tidak berbau, bersih, tertutup, bukan ex-angkutan kimia berbahaya.',
    reference: 'ISO 22000:2018 (Klausul 8.2)',
  },
  {
    id: '2.2',
    category: 'Logistik, Kendaraan & Pengiriman',
    title: 'Suhu Terkendali Selama Transit',
    description: 'Kendaraan memiliki pendingin aktif dan termometer untuk transit komoditas rentan.',
    reference: 'HACCP Principle 4',
  },
  {
    id: '3.1',
    category: 'Higiene Karyawan & K3',
    title: 'Penggunaan APD (Alat Pelindung Diri)',
    description: 'Pekerja memakai Masker, Hairnet, Sarung Tangan, dan Celemek bersih.',
    reference: 'ISO 45001:2018 (Klausul 8.1.2) & Kemenkes',
  },
  {
    id: '4.1',
    category: 'Ketertelusuran (Traceability)',
    title: 'Pencatatan Masuk Keluar (FIFO/FEFO)',
    description: 'Penerapan rotasi stok First In First Out atau First Expired First Out.',
    reference: 'ISO 9001:2015 (Klausul 8.5.2)',
  },
  {
    id: '4.3',
    category: 'Ketertelusuran (Traceability)',
    title: 'Izin Usaha & Sertifikasi',
    description: 'Memiliki izin BPOM, PIRT, SLHS, dan Ketetapan Halal untuk hewani.',
    reference: 'UU No. 33 Th 2014 & ISO 22000:2018',
  }
];

export const AuditVendorModal = ({ isOpen, onClose, vendor, onSubmit }: AuditVendorModalProps) => {
  const [results, setResults] = useState<Record<string, AuditStatus>>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  if (!vendor) return null;

  const handleStatusChange = (id: string, status: AuditStatus) => {
    setResults(prev => ({ ...prev, [id]: status }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Group items by category initially
  const groupedItems = auditItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Initialize expanded categories on first load to show all
  if (expandedCategories.length === 0 && Object.keys(results).length === 0 && isOpen) {
     setExpandedCategories(Object.keys(groupedItems));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(vendor.id, results);
    
    // reset
    setResults({});
    onClose();
  };

  const calculateScore = () => {
    const scoredIds = Object.keys(results).filter(id => results[id] !== null && results[id] !== 'na');
    if (scoredIds.length === 0) return 0;
    
    const passed = scoredIds.filter(id => results[id] === 'pass').length;
    return Math.round((passed / scoredIds.length) * 100);
  };

  const score = calculateScore();

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
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-brand-50">
              <div>
                <h3 className="text-xl font-bold text-dark-900 flex items-center gap-2">
                  <ClipboardCheck className="w-6 h-6 text-brand-600" />
                  Inspeksi & Audit Mutu Vendor
                </h3>
                <p className="text-sm border-l-2 border-brand-300 pl-2 mt-1 font-medium text-brand-700">Vendor: {vendor.name}</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="hidden md:flex flex-col items-end">
                   <span className="text-xs text-gray-500 font-medium">Compliance Score</span>
                   <div className="flex items-center gap-1">
                      <span className={`text-xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                         {score}%
                      </span>
                   </div>
                 </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Checklist Body */}
            <form id="audit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-6 space-y-6">
               
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 flex gap-3 items-start">
                 <ShieldAlert className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                 <p>Gunakan checklist ini untuk mengaudit standar kualitas vendor. Pastikan untuk menanyakan bukti lisensi atau foto instalasi aktual kepada pengelola {vendor.name} saat memilih <b>[Pass]</b>. Hasil pengawasan ini diacu berdasarkan ISO 22000 & 9001.</p>
              </div>

              {Object.entries(groupedItems).map(([category, items]) => {
                const isExpanded = expandedCategories.includes(category);
                const categoryScore = items.filter(i => results[i.id] === 'pass').length;
                const totalScored = items.filter(i => results[i.id] === 'pass' || results[i.id] === 'fail').length;

                return (
                  <div key={category} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Accordion Header */}
                    <button 
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-bold text-gray-800 text-left">{category}</h4>
                      <div className="flex items-center gap-3">
                        {totalScored > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            categoryScore === totalScored ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {categoryScore}/{items.length} Lulus
                          </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </button>

                    {/* Accordion Body */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="divide-y divide-gray-100 border-t border-gray-100"
                        >
                          {items.map((item) => (
                            <div key={item.id} className="p-4 md:p-5 flex flex-col lg:flex-row gap-4 lg:gap-6 hover:bg-gray-50/50 transition-colors">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                   <span className="text-xs font-bold text-gray-400">{item.id}</span>
                                   <h5 className="font-semibold text-dark-900 text-sm">{item.title}</h5>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded text-[11px] font-medium text-gray-500">
                                   <ShieldAlert className="w-3 h-3" /> ref: {item.reference}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 shrink-0">
                                <label className={`flex items-center justify-center h-10 px-4 rounded-lg font-medium text-sm border cursor-pointer transition-all ${
                                  results[item.id] === 'pass' 
                                    ? 'bg-green-500 text-white border-green-500 shadow-md shadow-green-500/20' 
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}>
                                  <input 
                                    type="radio" 
                                    name={`audit-${item.id}`} 
                                    className="hidden"
                                    checked={results[item.id] === 'pass'}
                                    onChange={() => handleStatusChange(item.id, 'pass')}
                                  />
                                  Pass
                                </label>
                                
                                <label className={`flex items-center justify-center h-10 px-4 rounded-lg font-medium text-sm border cursor-pointer transition-all ${
                                  results[item.id] === 'fail' 
                                    ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20' 
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}>
                                  <input 
                                    type="radio" 
                                    name={`audit-${item.id}`} 
                                    className="hidden"
                                    checked={results[item.id] === 'fail'}
                                    onChange={() => handleStatusChange(item.id, 'fail')}
                                  />
                                  Fail
                                </label>
                                
                                <label className={`flex items-center justify-center h-10 px-3 rounded-lg font-medium text-sm border cursor-pointer transition-all ${
                                  results[item.id] === 'na' 
                                    ? 'bg-gray-600 text-white border-gray-600' 
                                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                }`}>
                                  <input 
                                    type="radio" 
                                    name={`audit-${item.id}`} 
                                    className="hidden"
                                    checked={results[item.id] === 'na'}
                                    onChange={() => handleStatusChange(item.id, 'na')}
                                  />
                                  N/A
                                </label>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

            </form>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                <span>Pastikan hasil audit diisi dengan cermat.</span>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  form="audit-form"
                  disabled={Object.keys(results).length === 0}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Simpan Hasil Audit
                </button>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
