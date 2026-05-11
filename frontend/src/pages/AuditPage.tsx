import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Upload, FileText, CheckCircle, AlertCircle, 
  Link as LinkIcon, Lock, QrCode, Award, Zap, Activity, 
  Search, Download, X, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import kitchenImg from '../assets/kitchen.jpg';

const AUDIT_POINTS = [
  { id: 'bangunan', title: '1.1 Kebersihan Bangunan & Pest Control', desc: 'Gedung bebas dari retakan, ada kawat nyamuk, dan pencahayaan cukup. (ref: ISO 22000:2018 Klausul 8.2 & CPPOB BPOM)' },
  { id: 'fasilitas', title: '1.2 Fasilitas Cuci Tangan & Sanitasi', desc: 'Tersedia wastafel dengan sabun cair, air mengalir, dan pengering tangan. (ref: CPPOB BPOM)' },
  { id: 'peralatan', title: '1.3 Kebersihan Peralatan Produksi', desc: 'Peralatan terbuat dari bahan tara pangan (food grade), utuh, dan disimpan dalam keadaan bersih. (ref: ISO 22000:2018)' },
  { id: 'penyimpanan', title: '1.4 Penyimpanan Bahan Baku (FIFO/FEFO)', desc: 'Bahan baku disimpan rapi pada palet/rak, terpisah dari dinding, pada suhu yang sesuai.' },
  { id: 'suhu', title: '1.5 Pengendalian Suhu (Cold/Dry Storage)', desc: 'Fasilitas pendingin (Chiller/Freezer) memiliki termometer yang berfungsi dan termonitor.' },
  { id: 'karyawan', title: '1.6 Higiene Karyawan (APD)', desc: 'Pekerja menggunakan APD lengkap: Penutup kepala (hairnet), sarung tangan, apron, dan masker.' },
  { id: 'limbah', title: '1.7 Pengelolaan Limbah & Sampah', desc: 'Tempat sampah tertutup rapat, dipisahkan dari area produksi utama, dan rutin dibersihkan.' },
  { id: 'air', title: '1.8 Pasokan Air Bersih', desc: 'Instalasi air bersih memadai untuk pencucian bahan dan peralatan tanpa risiko kontaminasi.' },
  { id: 'label', title: '1.9 Identifikasi & Ketertelusuran (Traceability)', desc: 'Bahan baku dan produk akhir memiliki label yang jelas, mencakup nama, tanggal produksi, dan masa simpan.' },
  { id: 'kontaminasi', title: '1.10 Pencegahan Kontaminasi Silang', desc: 'Pemisahan tegas antara area/peralatan untuk bahan mentah pelengkap dan produk matang (misal beda warna talenan/pisau).' }
];

export default function AuditPage() {
  const [formData, setFormData] = useState({
    vendorName: '',
  });
  const [files, setFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | any>(null);

  const triggerFileInput = (id: string) => {
    document.getElementById(`file-upload-${id}`)?.click();
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => ({ ...prev, [id]: e.target.files![0] }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => ({ ...prev, [id]: e.dataTransfer.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingFiles = AUDIT_POINTS.filter(p => !files[p.id]);

    if (!formData.vendorName || missingFiles.length > 0) {
      alert("Mohon lengkapi nama vendor dan unggah dokumen bukti untuk semua poin audit.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setTxHash('0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''));
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ShieldCheck className="w-10 h-10 text-brand-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-dark-900 mb-4">Inspeksi & Audit Fisik Vendor</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Unggah foto bukti fisik per poin audit terkait kebersihan bangunan, sanitasi, dan penyimpanan. Setiap foto pelaporan akan dicatat ke dalam <strong className="text-brand-600">Blockchain</strong> untuk menjamin transparansi serta rekam jejak yang tak dapat diubah.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Activity size={18} /></div>
                 <span className="text-xs font-bold text-gray-400 uppercase">AI Vendor Trust Score</span>
              </div>
              <div className="flex items-end gap-2">
                 <span className="text-3xl font-extrabold text-dark-900">92.8</span>
                 <span className="text-xs font-bold text-green-500 mb-1.5 flex items-center gap-1">
                   <TrendingUp size={12} /> High Trust
                 </span>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CheckCircle size={18} /></div>
                 <span className="text-xs font-bold text-gray-400 uppercase">Kualitas Makanan</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                 <div className="w-[95%] h-full bg-blue-500 rounded-full" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-wide uppercase">Score: 95/100</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><LinkIcon size={18} /></div>
                 <span className="text-xs font-bold text-gray-400 uppercase">Ketepatan Kirim</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                 <div className="w-[88%] h-full bg-amber-500 rounded-full" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-wide uppercase">Score: 88/100</p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {submissionSuccess ? (
            <div className="p-10 text-center">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-dark-900 mb-2">Audit Berhasil Terkirim!</h2>
              <p className="text-gray-600 mb-6">Seluruh sertifikat Anda telah berhasil diverifikasi dan direkam ke dalam buku besar Blockchain.</p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 inline-block text-left">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hash Transaksi Blockchain
                </p>
                <code className="text-sm font-mono text-brand-600 break-all">{txHash}</code>
              </div>

              <div>
                <button 
                  onClick={() => {
                    setSubmissionSuccess(false);
                    setFormData({ vendorName: '' });
                    setFiles({});
                  }}
                  className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition"
                >
                  Kirim Audit Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div>
                  <label htmlFor="vendorName" className="block text-sm font-semibold text-gray-700 mb-2">Nama Vendor / Koperasi</label>
                  <input
                    id="vendorName"
                    type="text"
                    required
                    value={formData.vendorName}
                    onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                    placeholder="Masukkan nama resmi perusahaan atau koperasi"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-dark-900 border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <CheckCircle className="w-5 h-5 text-brand-600" />
                       Poin Checklist Audit
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsCVOpen(true)}
                      className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 flex items-center gap-2 hover:bg-brand-100 transition-all"
                    >
                      <Zap size={14} className="fill-current" /> Coba Computer Vision Scan
                    </button>
                  </h3>
                  
                  <div className="space-y-4">
                    {AUDIT_POINTS.map(point => (
                      <div key={point.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{point.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed mt-1">{point.desc}</p>
                          </div>
                          
                          <div className="sm:w-64 shrink-0">
                            <div 
                              onClick={() => triggerFileInput(point.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(point.id, e)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  triggerFileInput(point.id);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                                files[point.id] ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
                              }`}
                            >
                              {files[point.id] ? (
                                <>
                                  <FileText className="h-6 w-6 text-brand-600 mb-2" />
                                  <span className="text-xs font-bold text-brand-600 text-center truncate w-full px-2" title={files[point.id].name}>
                                    {files[point.id].name}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                  <span className="text-xs text-brand-600 font-medium text-center">
                                    Unggah Foto (JPG/PNG)
                                  </span>
                                </>
                              )}
                            </div>
                            <input 
                              id={`file-upload-${point.id}`}
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(point.id, e)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong>Peringatan Immutabilitas:</strong> Dengan menekan tombol kirim, file-file ini akan di-hash dan direkam ke dalam Smart Contract. Data tidak dapat dihapus atau diubah setelah berhasil terkirim.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.vendorName || AUDIT_POINTS.some(p => !files[p.id])}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LinkIcon className="w-5 h-5 animate-spin" />
                      Membuat Blok Transaksi...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Simpan & Sertifikasi ke Blockchain
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>

        <div className="text-center mt-8 space-x-6">
           <Link to="/map" className="text-gray-500 hover:text-brand-600 transition-colors text-sm font-medium">
             &larr; Kembali ke Peta Dashboard
           </Link>
           <button 
             onClick={() => setIsCertOpen(true)}
             className="text-brand-600 hover:text-brand-700 transition-colors text-sm font-bold flex items-center gap-2 mx-auto mt-4 inline-flex"
           >
             <Award size={18} /> Lihat Digital Certificate
           </button>
        </div>


        {isCertOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-md w-full relative border-8 border-gray-50"
             >
                <div className="bg-brand-600 h-40 flex items-center justify-center relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400 rounded-full blur-[60px] opacity-30 -mr-16 -mt-16" />
                   <Award size={80} className="text-white relative z-10" />
                </div>
                
                <div className="px-10 pb-10 pt-16 -mt-12 text-center">
                   <div className="bg-white rounded-2xl shadow-lg p-3 inline-block mb-6 relative z-20 border border-gray-100">
                      <QrCode size={120} />
                   </div>
                   
                   <h3 className="text-2xl font-black text-dark-900 mb-2 mt-4 tracking-tight">VENDOR MBG CERTIFIED</h3>
                   <p className="text-gray-500 text-sm mb-6 font-medium">Digital ID: SEC-MBG-992-X1</p>
                   
                   <div className="space-y-4 mb-8">
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                         <span className="text-xs text-gray-400 font-bold uppercase">Status Gizi</span>
                         <span className="text-xs text-brand-600 font-black">EXCELLENT (A+)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                         <span className="text-xs text-gray-400 font-bold uppercase">Masa Berlaku</span>
                         <span className="text-xs text-dark-900 font-bold">2026 - 2027</span>
                      </div>
                   </div>

                   <button 
                     onClick={() => setIsCertOpen(false)}
                     className="w-full py-4 bg-dark-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2"
                   >
                     <Download size={18} /> Download Certificate
                   </button>
                </div>
                
                <button 
                  onClick={() => setIsCertOpen(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all z-[110]"
                >
                  <X size={20} />
                </button>
             </motion.div>
          </div>
        )}

        {isCVOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full relative border border-gray-100"
             >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                         <Zap size={20} className="fill-current" />
                      </div>
                      <div>
                         <h3 className="font-bold text-dark-900 leading-none">CV Audit Simulation</h3>
                         <span className="text-xs text-gray-500">AI Dapur Hygiene Verification</span>
                      </div>
                   </div>
                   <button onClick={() => { setIsCVOpen(false); setScanResult(null); setIsScanning(false); }} className="text-gray-400 hover:text-dark-900"><X /></button>
                </div>

                <div className="p-8">
                   {!scanResult && !isScanning ? (
                      <div className="flex flex-col items-center justify-center space-y-6">
                         <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 group overflow-hidden relative">
                            <img src={kitchenImg} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Kitchen Demo" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900/40">
                               <Upload className="w-10 h-10 text-white mb-2" />
                               <span className="text-white font-bold">Pilih Foto Dapur / Peralatan</span>
                            </div>
                         </div>
                         <button 
                           onClick={() => {
                             setIsScanning(true);
                             setTimeout(() => {
                               setIsScanning(false);
                               setScanResult({
                                 points: [
                                   { x: '20%', y: '30%', label: 'Kebersihan Lantai', score: 98 },
                                   { x: '60%', y: '45%', label: 'Hairnet Karyawan', score: 100 },
                                   { x: '40%', y: '70%', label: 'Sanitasi Wadah', score: 92 },
                                 ],
                                 total: 96
                               });
                             }, 3000);
                           }}
                           className="px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
                         >
                            <Search size={18} /> Start AI Analysis
                         </button>
                      </div>
                   ) : isScanning ? (
                      <div className="py-20 flex flex-col items-center justify-center">
                         <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-brand-100 rounded-full animate-ping" />
                            <div className="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Search className="w-8 h-8 text-brand-600" />
                            </div>
                         </div>
                         <h4 className="font-bold text-dark-900 mb-2 animate-pulse">Scanning Visual Points...</h4>
                         <p className="text-sm text-gray-500">Mendeteksi Standar Higienitas MBG 2.0</p>
                      </div>
                   ) : (
                      <div className="space-y-6">
                         <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-brand-500 shadow-xl">
                            <img src={kitchenImg} className="w-full h-full object-cover" alt="Scanned Result" />
                            <div className="absolute inset-0 bg-brand-600/10" />
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                               <div className="w-full h-[2px] bg-brand-500 absolute top-0 animate-scanning-line shadow-[0_0_15px_#22c55e]" />
                            </div>
                            
                            {scanResult.points.map((p: any, i: number) => (
                               <motion.div 
                                 key={i}
                                 initial={{ scale: 0, opacity: 0 }}
                                 animate={{ scale: 1, opacity: 1 }}
                                 transition={{ delay: 0.5 + i * 0.3 }}
                                 className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
                                 style={{ left: p.x, top: p.y }}
                                >
                                   <div className="w-full h-full bg-brand-600/30 border-2 border-brand-500 rounded-full animate-pulse" />
                                   <div className="absolute top-full mt-2 bg-dark-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold shadow-xl">
                                      {p.label}: {p.score}%
                                   </div>
                                </motion.div>
                            ))}
                         </div>
                         
                         <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-4 border-green-100 shadow-sm">
                                  <span className="text-2xl font-black text-green-600">{scanResult.total}%</span>
                               </div>
                               <div>
                                  <h4 className="font-bold text-dark-900 uppercase text-sm tracking-wide">Hygiene Score Terdeteksi</h4>
                                  <p className="text-green-700 text-xs font-bold flex items-center gap-1">
                                     <CheckCircle size={14} /> Memenuhi Standar ISO 22000
                                  </p>
                               </div>
                            </div>
                            <button 
                              onClick={() => { setScanResult(null); setIsScanning(false); }}
                              className="px-6 py-3 bg-dark-900 text-white font-bold rounded-xl hover:bg-black transition-all"
                            >
                               Selesai Audit AI
                            </button>
                         </div>
                      </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
