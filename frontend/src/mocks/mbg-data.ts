/* ================================================================== */
/* MBG Chain — Mock data for all dashboard modules                     */
/* All figures are illustrative (frontend-only prototype).             */
/* ================================================================== */

/* ---------- Distribusi: Monitoring proses -------------------------- */
export type DistStage = "produksi" | "pengemasan" | "transit" | "tiba" | "selesai";
export interface DistBatch {
  id: string;
  kode: string;
  dapur: string;
  sekolah: string;
  porsi: number;
  menu: string;
  driver: string;
  stage: DistStage;
  suhu: string;
  berangkat: string;
  estimasi: string;
  progress: number;
}

export const distBatches: DistBatch[] = [
  { id: "d1", kode: "MBG-0612-A1", dapur: "SPPG Dapur Pusat Senen", sekolah: "SDN Menteng 01", porsi: 450, menu: "Nasi Ayam Teriyaki + Sayur", driver: "Budi Santoso", stage: "transit", suhu: "62°C", berangkat: "06:40", estimasi: "07:10", progress: 70 },
  { id: "d2", kode: "MBG-0612-A2", dapur: "SPPG Dapur Pusat Senen", sekolah: "SMPN 1 Jakarta", porsi: 800, menu: "Nasi Ayam Teriyaki + Sayur", driver: "Agus Wijaya", stage: "selesai", suhu: "—", berangkat: "06:10", estimasi: "06:45", progress: 100 },
  { id: "d3", kode: "MBG-0612-B1", dapur: "SPPG Dapur Sehat Tebet", sekolah: "SDN Tebet Barat 05", porsi: 320, menu: "Nasi Telur Balado + Tumis", driver: "Dewi Lestari", stage: "pengemasan", suhu: "68°C", berangkat: "—", estimasi: "07:30", progress: 35 },
  { id: "d4", kode: "MBG-0612-B2", dapur: "SPPG Dapur Sehat Tebet", sekolah: "SDN Tebet Timur 03", porsi: 280, menu: "Nasi Telur Balado + Tumis", driver: "Rudi Hartono", stage: "produksi", suhu: "70°C", berangkat: "—", estimasi: "08:00", progress: 15 },
  { id: "d5", kode: "MBG-0612-C1", dapur: "SPPG Dapur Pusat Senen", sekolah: "SDN Cikini 02", porsi: 360, menu: "Nasi Ayam Teriyaki + Sayur", driver: "Sari Indah", stage: "tiba", suhu: "60°C", berangkat: "06:25", estimasi: "07:00", progress: 90 },
  { id: "d6", kode: "MBG-0612-C2", dapur: "SPPG Dapur Sehat Tebet", sekolah: "SMPN 19 Jakarta", porsi: 540, menu: "Nasi Telur Balado + Tumis", driver: "Eko Prasetyo", stage: "transit", suhu: "61°C", berangkat: "06:55", estimasi: "07:25", progress: 60 },
];

/* ---------- Distribusi: Driver & kader ----------------------------- */
export interface Personnel {
  id: string;
  nama: string;
  peran: "Driver" | "Kader" | "Koordinator";
  area: string;
  kontak: string;
  status: "Bertugas" | "Standby" | "Off";
  pengiriman: number;
  rating: number;
}

export const personnel: Personnel[] = [
  { id: "p1", nama: "Budi Santoso", peran: "Driver", area: "Jakarta Pusat", kontak: "0812-1111-001", status: "Bertugas", pengiriman: 312, rating: 4.9 },
  { id: "p2", nama: "Agus Wijaya", peran: "Driver", area: "Jakarta Pusat", kontak: "0812-1111-002", status: "Bertugas", pengiriman: 287, rating: 4.7 },
  { id: "p3", nama: "Dewi Lestari", peran: "Kader", area: "Jakarta Selatan", kontak: "0812-1111-003", status: "Standby", pengiriman: 154, rating: 4.8 },
  { id: "p4", nama: "Rudi Hartono", peran: "Driver", area: "Jakarta Selatan", kontak: "0812-1111-004", status: "Bertugas", pengiriman: 198, rating: 4.6 },
  { id: "p5", nama: "Sari Indah", peran: "Kader", area: "Jakarta Pusat", kontak: "0812-1111-005", status: "Bertugas", pengiriman: 221, rating: 4.9 },
  { id: "p6", nama: "Eko Prasetyo", peran: "Driver", area: "Jakarta Timur", kontak: "0812-1111-006", status: "Standby", pengiriman: 176, rating: 4.5 },
  { id: "p7", nama: "Maya Putri", peran: "Koordinator", area: "Jakarta Pusat", kontak: "0812-1111-007", status: "Bertugas", pengiriman: 0, rating: 4.9 },
  { id: "p8", nama: "Hendra Gunawan", peran: "Kader", area: "Jakarta Timur", kontak: "0812-1111-008", status: "Off", pengiriman: 132, rating: 4.4 },
];

/* ---------- Anggaran: Rencana belanja ------------------------------ */
export interface BudgetItem {
  id: string;
  kategori: string;
  item: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
  periode: string;
  status: "Disetujui" | "Menunggu" | "Revisi";
}

export const budgetItems: BudgetItem[] = [
  { id: "b1", kategori: "Karbohidrat", item: "Beras Premium", qty: 1200, satuan: "kg", hargaSatuan: 13500, periode: "Juni 2026", status: "Disetujui" },
  { id: "b2", kategori: "Protein Hewani", item: "Daging Ayam", qty: 850, satuan: "kg", hargaSatuan: 38000, periode: "Juni 2026", status: "Disetujui" },
  { id: "b3", kategori: "Protein Hewani", item: "Telur Ayam", qty: 600, satuan: "kg", hargaSatuan: 29000, periode: "Juni 2026", status: "Menunggu" },
  { id: "b4", kategori: "Sayuran", item: "Sayur Campuran", qty: 720, satuan: "kg", hargaSatuan: 12000, periode: "Juni 2026", status: "Disetujui" },
  { id: "b5", kategori: "Buah", item: "Pisang", qty: 5400, satuan: "buah", hargaSatuan: 1500, periode: "Juni 2026", status: "Menunggu" },
  { id: "b6", kategori: "Bumbu", item: "Bumbu Dapur Paket", qty: 200, satuan: "paket", hargaSatuan: 25000, periode: "Juni 2026", status: "Revisi" },
  { id: "b7", kategori: "Operasional", item: "Gas LPG 12kg", qty: 80, satuan: "tabung", hargaSatuan: 180000, periode: "Juni 2026", status: "Disetujui" },
  { id: "b8", kategori: "Kemasan", item: "Ompreng Stainless", qty: 300, satuan: "pcs", hargaSatuan: 35000, periode: "Juni 2026", status: "Disetujui" },
];

/* ---------- Menu: Rencana menu ------------------------------------- */
export interface MenuPlan {
  id: string;
  hari: string;
  tanggal: string;
  menuUtama: string;
  lauk: string;
  sayur: string;
  buah: string;
  kalori: number;
  status: "Terjadwal" | "Disetujui" | "Draft";
}

export const menuPlans: MenuPlan[] = [
  { id: "m1", hari: "Senin", tanggal: "23 Jun", menuUtama: "Nasi Putih", lauk: "Ayam Teriyaki", sayur: "Tumis Buncis Wortel", buah: "Pisang", kalori: 685, status: "Disetujui" },
  { id: "m2", hari: "Selasa", tanggal: "24 Jun", menuUtama: "Nasi Putih", lauk: "Telur Balado", sayur: "Cap Cay", buah: "Jeruk", kalori: 640, status: "Disetujui" },
  { id: "m3", hari: "Rabu", tanggal: "25 Jun", menuUtama: "Nasi Uduk", lauk: "Ikan Tongkol Suwir", sayur: "Tumis Kangkung", buah: "Semangka", kalori: 710, status: "Terjadwal" },
  { id: "m4", hari: "Kamis", tanggal: "26 Jun", menuUtama: "Nasi Putih", lauk: "Daging Semur", sayur: "Sayur Asem", buah: "Pepaya", kalori: 695, status: "Terjadwal" },
  { id: "m5", hari: "Jumat", tanggal: "27 Jun", menuUtama: "Nasi Goreng Gizi", lauk: "Ayam Suwir + Telur", sayur: "Acar Timun", buah: "Melon", kalori: 720, status: "Draft" },
];

/* ---------- Menu: Bahan baku & komposisi --------------------------- */
export interface Ingredient {
  id: string;
  nama: string;
  kategori: string;
  perPorsi: number;
  satuan: string;
  hargaSatuan: number;
  supplier: string;
}

export const ingredients: Ingredient[] = [
  { id: "i1", nama: "Beras", kategori: "Karbohidrat", perPorsi: 100, satuan: "gram", hargaSatuan: 13.5, supplier: "PT Maju Tani Pangan" },
  { id: "i2", nama: "Daging Ayam", kategori: "Protein", perPorsi: 75, satuan: "gram", hargaSatuan: 38, supplier: "CV Berkah Lauk" },
  { id: "i3", nama: "Telur Ayam", kategori: "Protein", perPorsi: 55, satuan: "gram", hargaSatuan: 29, supplier: "Agen Telur Berkah" },
  { id: "i4", nama: "Wortel", kategori: "Sayuran", perPorsi: 40, satuan: "gram", hargaSatuan: 10, supplier: "Agen Sayur Segar Ciawi" },
  { id: "i5", nama: "Buncis", kategori: "Sayuran", perPorsi: 35, satuan: "gram", hargaSatuan: 11, supplier: "Agen Sayur Segar Ciawi" },
  { id: "i6", nama: "Minyak Goreng", kategori: "Lemak", perPorsi: 8, satuan: "ml", hargaSatuan: 16, supplier: "Toko Sembako Makmur" },
  { id: "i7", nama: "Pisang", kategori: "Buah", perPorsi: 1, satuan: "buah", hargaSatuan: 1500, supplier: "Koperasi Tani Nusantara" },
  { id: "i8", nama: "Bumbu Teriyaki", kategori: "Bumbu", perPorsi: 12, satuan: "gram", hargaSatuan: 22, supplier: "Toko Sembako Makmur" },
];

/* ---------- Menu: Gramasi gizi ------------------------------------- */
export interface NutritionRow {
  id: string;
  kelompok: string;
  energi: number; // kcal target
  protein: number; // g
  lemak: number; // g
  karbohidrat: number; // g
  serat: number; // g
  realisasiEnergi: number;
}

export const nutritionTargets: NutritionRow[] = [
  { id: "n1", kelompok: "PAUD/TK (4-6 th)", energi: 525, protein: 15, lemak: 18, karbohidrat: 75, serat: 6, realisasiEnergi: 540 },
  { id: "n2", kelompok: "SD Kelas 1-3 (7-9 th)", energi: 650, protein: 20, lemak: 22, karbohidrat: 95, serat: 8, realisasiEnergi: 685 },
  { id: "n3", kelompok: "SD Kelas 4-6 (10-12 th)", energi: 700, protein: 25, lemak: 24, karbohidrat: 100, serat: 9, realisasiEnergi: 695 },
  { id: "n4", kelompok: "SMP (13-15 th)", energi: 750, protein: 28, lemak: 25, karbohidrat: 110, serat: 10, realisasiEnergi: 720 },
  { id: "n5", kelompok: "SMA (16-18 th)", energi: 800, protein: 30, lemak: 27, karbohidrat: 120, serat: 11, realisasiEnergi: 760 },
];

/* ---------- Laporan: Ulasan ---------------------------------------- */
export interface Review {
  id: string;
  sekolah: string;
  penilai: string;
  rating: number;
  rasa: number;
  porsi: number;
  kebersihan: number;
  komentar: string;
  tanggal: string;
  tag: "Positif" | "Netral" | "Keluhan";
}

export const reviews: Review[] = [
  { id: "r1", sekolah: "SDN Menteng 01", penilai: "Ibu Ratna (Guru)", rating: 5, rasa: 5, porsi: 5, kebersihan: 5, komentar: "Anak-anak sangat menyukai ayam teriyaki, porsi pas dan masih hangat.", tanggal: "23 Jun 2026", tag: "Positif" },
  { id: "r2", sekolah: "SMPN 1 Jakarta", penilai: "Pak Hadi (Wakasek)", rating: 4, rasa: 4, porsi: 5, kebersihan: 4, komentar: "Secara umum baik, sayur sedikit kurang matang hari ini.", tanggal: "23 Jun 2026", tag: "Netral" },
  { id: "r3", sekolah: "SDN Tebet Barat 05", penilai: "Ibu Sinta (Guru)", rating: 5, rasa: 5, porsi: 4, kebersihan: 5, komentar: "Pengiriman tepat waktu, kemasan rapi dan higienis.", tanggal: "23 Jun 2026", tag: "Positif" },
  { id: "r4", sekolah: "SDN Cikini 02", penilai: "Pak Doni (Kepsek)", rating: 3, rasa: 3, porsi: 3, kebersihan: 4, komentar: "Nasi agak keras, mohon diperbaiki untuk pengiriman berikutnya.", tanggal: "22 Jun 2026", tag: "Keluhan" },
  { id: "r5", sekolah: "SMPN 19 Jakarta", penilai: "Ibu Wati (Guru)", rating: 5, rasa: 5, porsi: 5, kebersihan: 5, komentar: "Variasi menu sangat baik minggu ini, siswa antusias.", tanggal: "22 Jun 2026", tag: "Positif" },
];

/* ---------- Laporan: Operasional ----------------------------------- */
export interface OpsReport {
  id: string;
  judul: string;
  periode: string;
  dapur: string;
  porsiTerkirim: number;
  porsiTerencana: number;
  realisasiBiaya: number;
  status: "Final" | "Draft" | "Direview";
  tanggal: string;
}

export const opsReports: OpsReport[] = [
  { id: "o1", judul: "Laporan Operasional Harian", periode: "23 Jun 2026", dapur: "SPPG Dapur Pusat Senen", porsiTerkirim: 1610, porsiTerencana: 1650, realisasiBiaya: 28175000, status: "Final", tanggal: "23 Jun 2026" },
  { id: "o2", judul: "Laporan Operasional Harian", periode: "23 Jun 2026", dapur: "SPPG Dapur Sehat Tebet", porsiTerkirim: 1140, porsiTerencana: 1140, realisasiBiaya: 19950000, status: "Final", tanggal: "23 Jun 2026" },
  { id: "o3", judul: "Laporan Operasional Mingguan", periode: "Minggu 3 Juni 2026", dapur: "Semua Dapur", porsiTerkirim: 18900, porsiTerencana: 19250, realisasiBiaya: 330750000, status: "Direview", tanggal: "22 Jun 2026" },
  { id: "o4", judul: "Laporan Operasional Bulanan", periode: "Mei 2026", dapur: "Semua Dapur", porsiTerkirim: 78400, porsiTerencana: 80000, realisasiBiaya: 1372000000, status: "Final", tanggal: "01 Jun 2026" },
];

/* ---------- Laporan: Proposal anggaran ----------------------------- */
export interface BudgetProposal {
  id: string;
  judul: string;
  pengaju: string;
  periode: string;
  nilai: number;
  status: "Diajukan" | "Disetujui" | "Ditolak" | "Revisi";
  tanggal: string;
}

export const budgetProposals: BudgetProposal[] = [
  { id: "bp1", judul: "Proposal Anggaran Operasional Juli 2026", pengaju: "SPPG Dapur Pusat Senen", periode: "Juli 2026", nilai: 875000000, status: "Diajukan", tanggal: "20 Jun 2026" },
  { id: "bp2", judul: "Proposal Pengadaan Cold Storage", pengaju: "SPPG Dapur Sehat Tebet", periode: "Q3 2026", nilai: 320000000, status: "Disetujui", tanggal: "15 Jun 2026" },
  { id: "bp3", judul: "Proposal Penambahan Armada Distribusi", pengaju: "SPPG Dapur Pusat Senen", periode: "Q3 2026", nilai: 540000000, status: "Revisi", tanggal: "12 Jun 2026" },
  { id: "bp4", judul: "Proposal Anggaran Operasional Juni 2026", pengaju: "SPPG Dapur Sehat Tebet", periode: "Juni 2026", nilai: 610000000, status: "Disetujui", tanggal: "28 Mei 2026" },
];

/* ---------- Data tim: Mitra ---------------------------------------- */
export interface Mitra {
  id: string;
  nama: string;
  jenis: string;
  pic: string;
  kontak: string;
  kontrak: string;
  status: "Aktif" | "Tinjau Ulang" | "Nonaktif";
  rating: number;
}

export const mitraList: Mitra[] = [
  { id: "mt1", nama: "PT Maju Tani Pangan", jenis: "Pemasok Beras & Sayur", pic: "Andi Pratama", kontak: "021-1234567", kontrak: "Jan 2026 - Des 2026", status: "Aktif", rating: 4.8 },
  { id: "mt2", nama: "CV Berkah Lauk", jenis: "Pemasok Protein", pic: "Siti Aminah", kontak: "021-7654321", kontrak: "Mar 2026 - Feb 2027", status: "Aktif", rating: 4.6 },
  { id: "mt3", nama: "Koperasi Tani Nusantara", jenis: "Pemasok Buah & Sayur", pic: "Bambang S.", kontak: "022-9998887", kontrak: "Jan 2026 - Des 2026", status: "Aktif", rating: 4.9 },
  { id: "mt4", nama: "Toko Sembako Makmur", jenis: "Pemasok Sembako", pic: "Lina Marlina", kontak: "021-3334445", kontrak: "Apr 2026 - Mar 2027", status: "Tinjau Ulang", rating: 4.5 },
  { id: "mt5", nama: "Distributor Daging Sapi Halal", jenis: "Pemasok Daging", pic: "Yusuf Hakim", kontak: "021-6667778", kontrak: "Feb 2026 - Jan 2027", status: "Aktif", rating: 4.9 },
];

/* ---------- Data tim: Penerima manfaat ----------------------------- */
export interface Beneficiary {
  id: string;
  sekolah: string;
  jenjang: string;
  alamat: string;
  siswa: number;
  dapur: string;
  status: "Aktif" | "Pending";
}

export const beneficiaries: Beneficiary[] = [
  { id: "be1", sekolah: "SDN Menteng 01", jenjang: "SD", alamat: "Jl. Besuki No.4, Menteng", siswa: 450, dapur: "SPPG Dapur Pusat Senen", status: "Aktif" },
  { id: "be2", sekolah: "SMPN 1 Jakarta", jenjang: "SMP", alamat: "Jl. Cikini Raya No.87", siswa: 800, dapur: "SPPG Dapur Pusat Senen", status: "Aktif" },
  { id: "be3", sekolah: "SDN Tebet Barat 05", jenjang: "SD", alamat: "Jl. Tebet Barat Dalam", siswa: 320, dapur: "SPPG Dapur Sehat Tebet", status: "Aktif" },
  { id: "be4", sekolah: "SDN Tebet Timur 03", jenjang: "SD", alamat: "Jl. Tebet Timur Raya", siswa: 280, dapur: "SPPG Dapur Sehat Tebet", status: "Aktif" },
  { id: "be5", sekolah: "SDN Cikini 02", jenjang: "SD", alamat: "Jl. Cikini Raya No.40", siswa: 360, dapur: "SPPG Dapur Pusat Senen", status: "Aktif" },
  { id: "be6", sekolah: "SMPN 19 Jakarta", jenjang: "SMP", alamat: "Jl. Bumi Manti, Tebet", siswa: 540, dapur: "SPPG Dapur Sehat Tebet", status: "Aktif" },
  { id: "be7", sekolah: "SDN Manggarai 01", jenjang: "SD", alamat: "Jl. Manggarai Utara", siswa: 410, dapur: "SPPG Dapur Sehat Tebet", status: "Pending" },
];

/* ---------- Data tim: Tim dapur ------------------------------------ */
export interface KitchenStaff {
  id: string;
  nama: string;
  peran: string;
  dapur: string;
  sertifikasi: string;
  status: "Aktif" | "Cuti";
}

export const kitchenStaff: KitchenStaff[] = [
  { id: "ks1", nama: "Chef Wawan", peran: "Kepala Dapur", dapur: "SPPG Dapur Pusat Senen", sertifikasi: "Higiene Pangan, Ahli Gizi", status: "Aktif" },
  { id: "ks2", nama: "Ibu Nurul", peran: "Ahli Gizi", dapur: "SPPG Dapur Pusat Senen", sertifikasi: "Registered Dietitian", status: "Aktif" },
  { id: "ks3", nama: "Pak Tono", peran: "Juru Masak", dapur: "SPPG Dapur Pusat Senen", sertifikasi: "Higiene Pangan", status: "Aktif" },
  { id: "ks4", nama: "Ibu Yanti", peran: "QC Pangan", dapur: "SPPG Dapur Sehat Tebet", sertifikasi: "HACCP", status: "Aktif" },
  { id: "ks5", nama: "Pak Sugeng", peran: "Kepala Dapur", dapur: "SPPG Dapur Sehat Tebet", sertifikasi: "Higiene Pangan", status: "Cuti" },
  { id: "ks6", nama: "Ibu Dina", peran: "Juru Masak", dapur: "SPPG Dapur Sehat Tebet", sertifikasi: "Higiene Pangan", status: "Aktif" },
];

/* ---------- Data tim / Manajemen: Supplier & Vendor ---------------- */
export interface Supplier {
  id: string;
  nama: string;
  komoditas: string[];
  lokasi: string;
  hargaIndex: number; // relative price index, 100 = market avg
  leadTime: string;
  rating: number;
  status: "Terverifikasi" | "Pending" | "Diblokir";
}

export const suppliers: Supplier[] = [
  { id: "sp1", nama: "PT Maju Tani Pangan", komoditas: ["Beras", "Sayuran"], lokasi: "Jakarta Selatan", hargaIndex: 96, leadTime: "1 hari", rating: 4.8, status: "Terverifikasi" },
  { id: "sp2", nama: "CV Berkah Lauk", komoditas: ["Daging Ayam", "Telur"], lokasi: "Jakarta Pusat", hargaIndex: 102, leadTime: "1 hari", rating: 4.6, status: "Terverifikasi" },
  { id: "sp3", nama: "Koperasi Tani Nusantara", komoditas: ["Buah", "Sayuran", "Susu"], lokasi: "Bandung", hargaIndex: 94, leadTime: "2 hari", rating: 4.9, status: "Terverifikasi" },
  { id: "sp4", nama: "Agen Sayur Segar Ciawi", komoditas: ["Sayuran", "Tomat"], lokasi: "Bogor", hargaIndex: 98, leadTime: "1 hari", rating: 4.7, status: "Terverifikasi" },
  { id: "sp5", nama: "Toko Sembako Makmur", komoditas: ["Beras", "Minyak", "Gula"], lokasi: "Jakarta Selatan", hargaIndex: 105, leadTime: "1 hari", rating: 4.5, status: "Pending" },
  { id: "sp6", nama: "Distributor Daging Sapi Halal", komoditas: ["Daging Sapi"], lokasi: "Jakarta Utara", hargaIndex: 110, leadTime: "2 hari", rating: 4.9, status: "Terverifikasi" },
];

/* ---------- Manajemen data: Dapur SPPG (perizinan) ----------------- */
export interface ChecklistItem {
  label: string;
  done: boolean;
}
export interface Kitchen {
  id: string;
  nama: string;
  alamat: string;
  kapasitas: number;
  kepala: string;
  izinStatus: "Berlaku" | "Proses" | "Kadaluarsa";
  izinNomor: string;
  izinBerlaku: string;
  skorPengawasan: number;
  checklist: ChecklistItem[];
}

export const kitchens: Kitchen[] = [
  {
    id: "kt1",
    nama: "SPPG Dapur Pusat Senen",
    alamat: "Pasar Senen Lt. 4, Jakarta Pusat",
    kapasitas: 2000,
    kepala: "Chef Wawan",
    izinStatus: "Berlaku",
    izinNomor: "SLHS/2026/JKT/0112",
    izinBerlaku: "s.d 31 Des 2026",
    skorPengawasan: 92,
    checklist: [
      { label: "Sertifikat Laik Higiene Sanitasi (SLHS)", done: true },
      { label: "Sertifikat Halal", done: true },
      { label: "Pelatihan Higiene Karyawan", done: true },
      { label: "Fasilitas Cold Storage", done: true },
      { label: "Audit HACCP Berkala", done: false },
    ],
  },
  {
    id: "kt2",
    nama: "SPPG Dapur Sehat Tebet",
    alamat: "Jl. Tebet Barat Dalam, Jakarta Selatan",
    kapasitas: 1500,
    kepala: "Pak Sugeng",
    izinStatus: "Proses",
    izinNomor: "SLHS/2026/JKT/0140 (proses)",
    izinBerlaku: "Pengajuan 18 Jun 2026",
    skorPengawasan: 84,
    checklist: [
      { label: "Sertifikat Laik Higiene Sanitasi (SLHS)", done: false },
      { label: "Sertifikat Halal", done: true },
      { label: "Pelatihan Higiene Karyawan", done: true },
      { label: "Fasilitas Cold Storage", done: false },
      { label: "Audit HACCP Berkala", done: true },
    ],
  },
];

/* ---------- Rantai pasok: Perencanaan kebutuhan -------------------- */
export interface RequirementPlan {
  id: string;
  komoditas: string;
  kebutuhanMingguan: number;
  satuan: string;
  stokSaatIni: number;
  reorderPoint: number;
  proyeksiHabis: string;
}

export const requirementPlans: RequirementPlan[] = [
  { id: "rp1", komoditas: "Beras", kebutuhanMingguan: 1400, satuan: "kg", stokSaatIni: 950, reorderPoint: 800, proyeksiHabis: "5 hari" },
  { id: "rp2", komoditas: "Daging Ayam", kebutuhanMingguan: 980, satuan: "kg", stokSaatIni: 310, reorderPoint: 400, proyeksiHabis: "2 hari" },
  { id: "rp3", komoditas: "Telur Ayam", kebutuhanMingguan: 700, satuan: "kg", stokSaatIni: 520, reorderPoint: 350, proyeksiHabis: "5 hari" },
  { id: "rp4", komoditas: "Sayur Campuran", kebutuhanMingguan: 850, satuan: "kg", stokSaatIni: 120, reorderPoint: 250, proyeksiHabis: "1 hari" },
  { id: "rp5", komoditas: "Pisang", kebutuhanMingguan: 6300, satuan: "buah", stokSaatIni: 4100, reorderPoint: 2000, proyeksiHabis: "4 hari" },
  { id: "rp6", komoditas: "Minyak Goreng", kebutuhanMingguan: 220, satuan: "liter", stokSaatIni: 180, reorderPoint: 100, proyeksiHabis: "6 hari" },
];

/* ---------- Rantai pasok: Procurement & matching ------------------- */
export interface PurchaseOrder {
  id: string;
  kode: string;
  komoditas: string;
  qty: number;
  satuan: string;
  supplier: string;
  nilai: number;
  status: "Draft" | "Dikirim" | "Diterima" | "Menunggu Konfirmasi";
  tanggal: string;
}

export const purchaseOrders: PurchaseOrder[] = [
  { id: "po1", kode: "PO-2406-001", komoditas: "Beras", qty: 600, satuan: "kg", supplier: "PT Maju Tani Pangan", nilai: 8100000, status: "Diterima", tanggal: "22 Jun 2026" },
  { id: "po2", kode: "PO-2406-002", komoditas: "Daging Ayam", qty: 500, satuan: "kg", supplier: "CV Berkah Lauk", nilai: 19000000, status: "Dikirim", tanggal: "23 Jun 2026" },
  { id: "po3", kode: "PO-2406-003", komoditas: "Sayur Campuran", qty: 400, satuan: "kg", supplier: "Agen Sayur Segar Ciawi", nilai: 4800000, status: "Menunggu Konfirmasi", tanggal: "24 Jun 2026" },
  { id: "po4", kode: "PO-2406-004", komoditas: "Pisang", qty: 3000, satuan: "buah", supplier: "Koperasi Tani Nusantara", nilai: 4500000, status: "Draft", tanggal: "24 Jun 2026" },
];

/* Supplier match recommendations for a needed commodity */
export interface MatchRec {
  supplier: string;
  harga: number;
  satuan: string;
  jarak: string;
  rating: number;
  skor: number;
  alasan: string;
}

export const matchRecommendations: Record<string, MatchRec[]> = {
  "Daging Ayam": [
    { supplier: "CV Berkah Lauk", harga: 38000, satuan: "kg", jarak: "4.2 km", rating: 4.6, skor: 94, alasan: "Harga kompetitif + lead time 1 hari" },
    { supplier: "Distributor Daging Sapi Halal", harga: 41000, satuan: "kg", jarak: "9.1 km", rating: 4.9, skor: 88, alasan: "Rating tertinggi, harga sedikit di atas pasar" },
    { supplier: "Toko Sembako Makmur", harga: 39500, satuan: "kg", jarak: "6.0 km", rating: 4.5, skor: 80, alasan: "Stok terbatas, verifikasi pending" },
  ],
  "Sayur Campuran": [
    { supplier: "Agen Sayur Segar Ciawi", harga: 12000, satuan: "kg", jarak: "5.5 km", rating: 4.7, skor: 96, alasan: "Farm-to-table, kesegaran terbaik" },
    { supplier: "PT Maju Tani Pangan", harga: 12500, satuan: "kg", jarak: "3.8 km", rating: 4.8, skor: 93, alasan: "Terdekat, rating tinggi" },
    { supplier: "Koperasi Tani Nusantara", harga: 11500, satuan: "kg", jarak: "120 km", rating: 4.9, skor: 85, alasan: "Termurah namun jarak jauh" },
  ],
};

/* ---------- Rantai pasok: Stok ------------------------------------- */
export interface StockItem {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
  satuan: string;
  gudang: string;
  kadaluarsa: string;
  status: "Aman" | "Menipis" | "Kritis";
}

export const stockItems: StockItem[] = [
  { id: "st1", nama: "Beras Premium", kategori: "Karbohidrat", jumlah: 950, satuan: "kg", gudang: "Gudang Senen", kadaluarsa: "12 Des 2026", status: "Aman" },
  { id: "st2", nama: "Daging Ayam Beku", kategori: "Protein", jumlah: 310, satuan: "kg", gudang: "Cold Storage Senen", kadaluarsa: "30 Jun 2026", status: "Menipis" },
  { id: "st3", nama: "Telur Ayam", kategori: "Protein", jumlah: 520, satuan: "kg", gudang: "Gudang Tebet", kadaluarsa: "05 Jul 2026", status: "Aman" },
  { id: "st4", nama: "Sayur Campuran", kategori: "Sayuran", jumlah: 120, satuan: "kg", gudang: "Gudang Tebet", kadaluarsa: "26 Jun 2026", status: "Kritis" },
  { id: "st5", nama: "Pisang", kategori: "Buah", jumlah: 4100, satuan: "buah", gudang: "Gudang Senen", kadaluarsa: "28 Jun 2026", status: "Aman" },
  { id: "st6", nama: "Minyak Goreng", kategori: "Lemak", jumlah: 180, satuan: "liter", gudang: "Gudang Senen", kadaluarsa: "10 Nov 2026", status: "Aman" },
  { id: "st7", nama: "Bumbu Dapur Paket", kategori: "Bumbu", jumlah: 40, satuan: "paket", gudang: "Gudang Tebet", kadaluarsa: "15 Agu 2026", status: "Menipis" },
];

/* ---------- Rantai pasok: Distribusi & transport ------------------- */
export interface Vehicle {
  id: string;
  plat: string;
  jenis: string;
  driver: string;
  kapasitas: number;
  muatan: number;
  rute: string;
  status: "Dalam Perjalanan" | "Siap" | "Maintenance";
}

export const vehicles: Vehicle[] = [
  { id: "vh1", plat: "B 9123 ABC", jenis: "Box Berpendingin", driver: "Budi Santoso", kapasitas: 600, muatan: 450, rute: "Senen → Menteng", status: "Dalam Perjalanan" },
  { id: "vh2", plat: "B 9456 DEF", jenis: "Box Berpendingin", driver: "Agus Wijaya", kapasitas: 1000, muatan: 800, rute: "Senen → Cikini", status: "Dalam Perjalanan" },
  { id: "vh3", plat: "B 9789 GHI", jenis: "Pickup Tertutup", driver: "Rudi Hartono", kapasitas: 400, muatan: 0, rute: "—", status: "Siap" },
  { id: "vh4", plat: "B 9012 JKL", jenis: "Box Berpendingin", driver: "Eko Prasetyo", kapasitas: 700, muatan: 540, rute: "Tebet → SMPN 19", status: "Dalam Perjalanan" },
  { id: "vh5", plat: "B 9345 MNO", jenis: "Pickup Tertutup", driver: "—", kapasitas: 400, muatan: 0, rute: "—", status: "Maintenance" },
];

/* ---------- Rantai pasok: Analitik & peramalan --------------------- */
export const demandForecast = {
  labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  actual: [11200, 11500, 11300, 11800, 12100, 0, 0],
  predicted: [11250, 11480, 11350, 11900, 12300, 6200, 4800],
};

export const priceForecast: { komoditas: string; current: number; next: number; trend: "naik" | "turun" | "stabil"; conf: number }[] = [
  { komoditas: "Beras", current: 13500, next: 13800, trend: "naik", conf: 88 },
  { komoditas: "Daging Ayam", current: 38000, next: 36500, trend: "turun", conf: 82 },
  { komoditas: "Telur Ayam", current: 29000, next: 30500, trend: "naik", conf: 79 },
  { komoditas: "Sayur Campuran", current: 12000, next: 12000, trend: "stabil", conf: 91 },
  { komoditas: "Minyak Goreng", current: 16000, next: 16800, trend: "naik", conf: 85 },
];

export interface RegionBalance {
  region: string;
  surplus: number; // positive surplus, negative deficit (porsi-equivalent kg)
  komoditas: string;
}

export const regionBalances: RegionBalance[] = [
  { region: "Jakarta Selatan", surplus: -2500, komoditas: "Sayuran" },
  { region: "Jakarta Timur", surplus: 1800, komoditas: "Sayuran" },
  { region: "Bandung", surplus: 4200, komoditas: "Sayuran" },
  { region: "Bogor", surplus: 2100, komoditas: "Sayuran" },
  { region: "Jakarta Pusat", surplus: -1500, komoditas: "Sayuran" },
];

export interface RedistRec {
  from: string;
  to: string;
  komoditas: string;
  jumlah: number;
  satuan: string;
  jarak: string;
  hemat: string;
}

export const redistRecommendations: RedistRec[] = [
  { from: "Bandung", to: "Jakarta Selatan", komoditas: "Sayuran", jumlah: 2500, satuan: "kg", jarak: "150 km", hemat: "Rp 6,2 jt" },
  { from: "Bogor", to: "Jakarta Pusat", komoditas: "Sayuran", jumlah: 1500, satuan: "kg", jarak: "60 km", hemat: "Rp 3,1 jt" },
];

/* ---------- Notifikasi --------------------------------------------- */
export interface AppNotification {
  id: string;
  judul: string;
  pesan: string;
  waktu: string;
  kategori: "Distribusi" | "Stok" | "Anggaran" | "Sistem" | "Ulasan";
  dibaca: boolean;
}

export const notifications: AppNotification[] = [
  { id: "nt1", judul: "Stok Kritis: Sayur Campuran", pesan: "Stok Sayur Campuran di Gudang Tebet tersisa 120 kg (di bawah reorder point).", waktu: "5 menit lalu", kategori: "Stok", dibaca: false },
  { id: "nt2", judul: "Pengiriman Selesai", pesan: "Batch MBG-0612-A2 ke SMPN 1 Jakarta telah diterima (800 porsi).", waktu: "32 menit lalu", kategori: "Distribusi", dibaca: false },
  { id: "nt3", judul: "Proposal Disetujui", pesan: "Proposal Pengadaan Cold Storage telah disetujui pemerintah.", waktu: "2 jam lalu", kategori: "Anggaran", dibaca: false },
  { id: "nt4", judul: "Ulasan Baru", pesan: "SDN Cikini 02 memberikan ulasan dengan keluhan tekstur nasi.", waktu: "1 hari lalu", kategori: "Ulasan", dibaca: true },
  { id: "nt5", judul: "Izin Akan Kadaluarsa", pesan: "SLHS SPPG Dapur Sehat Tebet dalam proses perpanjangan.", waktu: "1 hari lalu", kategori: "Sistem", dibaca: true },
];
