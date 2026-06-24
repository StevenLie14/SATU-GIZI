/* Knowledge base for the procedure-guidance chatbot (panduan prosedur).
   Simple keyword matcher — works fully offline, no LLM backend required. */

export interface GuideEntry {
  keywords: string[];
  answer: string;
}

export const guideSuggestions = [
  "Cara mendaftar sebagai vendor MBG",
  "Dokumen apa saja yang dibutuhkan?",
  "Bagaimana proses verifikasi BGN?",
  "Apa itu penyimpanan sertifikat blockchain?",
];

export const guideEntries: GuideEntry[] = [
  {
    keywords: ["daftar", "mendaftar", "registrasi", "gabung", "jadi vendor", "menjadi vendor"],
    answer:
      "Untuk mendaftar sebagai vendor MBG: 1) Buat akun di halaman Daftar, 2) Lengkapi profil usaha (NPWP & NIB), 3) Unggah dokumen sertifikasi, 4) Ajukan verifikasi ke Badan Gizi Nasional. Status dapat dipantau di menu Verifikasi Vendor (BGN).",
  },
  {
    keywords: ["dokumen", "syarat", "berkas", "persyaratan", "butuh apa"],
    answer:
      "Dokumen yang dibutuhkan: NPWP, NIB/Izin Usaha (OSS), Sertifikat Laik Higiene Sanitasi (SLHS), Sertifikat Halal (BPJPH), dan standar keamanan pangan (HACCP/ISO 22000). Untuk UMKM, sebagian sertifikat dapat difasilitasi melalui program pendampingan.",
  },
  {
    keywords: ["npwp", "pajak"],
    answer:
      "NPWP divalidasi otomatis ke sistem DJP. Masukkan NPWP pada profil usaha; sistem akan menandai 'terverifikasi' bila data cocok. NPWP wajib untuk semua vendor MBG.",
  },
  {
    keywords: ["nib", "izin usaha", "oss"],
    answer:
      "NIB (Nomor Induk Berusaha) diterbitkan melalui OSS dan divalidasi otomatis di platform. Pastikan NIB aktif dan KBLI sesuai bidang pangan agar verifikasi berhasil.",
  },
  {
    keywords: ["sertifikat", "sertifikasi", "slhs", "halal", "haccp", "iso", "keamanan pangan"],
    answer:
      "Sertifikasi yang dipantau: SLHS (higiene sanitasi), Halal (BPJPH), serta HACCP/ISO 22000 untuk keamanan pangan. Unggah setiap sertifikat pada tab Sertifikat — sistem memantau masa berlaku dan mengingatkan menjelang kedaluwarsa.",
  },
  {
    keywords: ["verifikasi", "bgn", "badan gizi", "proses verifikasi", "status"],
    answer:
      "Proses verifikasi BGN: dokumen Anda divalidasi (DJP, OSS, BPJPH) → skor keamanan pangan dihitung → Badan Gizi Nasional memberi persetujuan → kredensial di-anchor ke blockchain. Statusnya: Proses, Dokumen Kurang, Terverifikasi, atau Ditolak.",
  },
  {
    keywords: ["blockchain", "sertifikat blockchain", "keaslian", "anchor", "on-chain", "web3"],
    answer:
      "Sertifikat disimpan sebagai hash di blockchain (smart contract VendorCredentialRegistry). Ini menjamin keaslian & transparansi — siapa pun dapat memverifikasi dokumen tanpa membukanya. Lihat menu Blockchain → Verifikasi On-Chain.",
  },
  {
    keywords: ["supply", "demand", "antarwilayah", "redistribusi", "surplus", "defisit", "stok"],
    answer:
      "Fitur Matching Supply-Demand Antarwilayah menyeimbangkan stok: wilayah surplus dipasangkan dengan wilayah defisit, lengkap rekomendasi redistribusi otomatis. Lihat menu Rantai Pasok → Analitik & Peramalan.",
  },
  {
    keywords: ["b2b", "matchmaking", "umkm", "produsen lokal", "rfq", "pemasok", "supplier"],
    answer:
      "B2B Matchmaking menghubungkan produsen lokal, UMKM, dan vendor MBG. Buat RFQ, terima penawaran, dan pilih pemasok terbaik berdasarkan skor AI (harga, jarak, rating). Lihat menu Rantai Pasok → B2B Marketplace & RFQ.",
  },
  {
    keywords: ["kedaluwarsa", "kadaluarsa", "masa berlaku", "perpanjang", "expired"],
    answer:
      "Platform memantau masa berlaku izin & sertifikat secara real-time dan mengirim notifikasi menjelang kedaluwarsa beserta langkah tindak lanjut. Cek banner notifikasi di menu Perizinan & Pengawasan.",
  },
];

export function answerGuide(query: string): string {
  const q = query.toLowerCase();
  let best: { entry: GuideEntry; score: number } | null = null;
  for (const entry of guideEntries) {
    const score = entry.keywords.reduce((acc, k) => (q.includes(k) ? acc + k.length : acc), 0);
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  if (best) return best.entry.answer;
  return "Saya bisa memandu prosedur perizinan vendor MBG: pendaftaran, dokumen (NPWP/NIB/sertifikasi), verifikasi BGN, penyimpanan sertifikat blockchain, serta matching supply-demand & B2B. Coba tanyakan salah satu topik tersebut, atau pilih saran di bawah.";
}
