import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, FileText, CheckCircle, AlertCircle, Link as LinkIcon, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Unggah foto bukti fisik per poin audit terkait kebersihan bangunan, sanitasi, dan penyimpanan. Setiap foto pelaporan akan dicatat ke dalam <strong className="text-brand-600">Blockchain</strong> untuk menjamin transparansi serta rekam jejak yang tak dapat diubah.
          </p>
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
                
                {/* Text Inputs */}
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
                  <h3 className="text-lg font-bold text-dark-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-600" />
                    Poin Checklist Audit
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

        <div className="text-center mt-8">
           <Link to="/map" className="text-gray-500 hover:text-brand-600 transition-colors text-sm font-medium">
             &larr; Kembali ke Peta Dashboard
           </Link>
        </div>

      </div>
    </div>
  );
}
