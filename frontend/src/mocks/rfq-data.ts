/* B2B Matchmaking — RFQ, quotations & raw-material catalog (mock). */

export interface CatalogItem {
  id: string;
  nama: string;
  kategori: string;
  satuan: string;
  hargaRef: number;
  supplierAktif: number;
  ratingRata: number;
  lokasiTerdekat: string;
}

export const catalogItems: CatalogItem[] = [
  { id: "c1", nama: "Beras Premium", kategori: "Karbohidrat", satuan: "kg", hargaRef: 13500, supplierAktif: 8, ratingRata: 4.7, lokasiTerdekat: "Jakarta Selatan" },
  { id: "c2", nama: "Daging Ayam", kategori: "Protein", satuan: "kg", hargaRef: 38000, supplierAktif: 6, ratingRata: 4.6, lokasiTerdekat: "Jakarta Pusat" },
  { id: "c3", nama: "Telur Ayam", kategori: "Protein", satuan: "kg", hargaRef: 29000, supplierAktif: 5, ratingRata: 4.5, lokasiTerdekat: "Jakarta Barat" },
  { id: "c4", nama: "Sayur Campuran", kategori: "Sayuran", satuan: "kg", hargaRef: 12000, supplierAktif: 9, ratingRata: 4.8, lokasiTerdekat: "Bogor" },
  { id: "c5", nama: "Pisang", kategori: "Buah", satuan: "buah", hargaRef: 1500, supplierAktif: 4, ratingRata: 4.9, lokasiTerdekat: "Bandung" },
  { id: "c6", nama: "Minyak Goreng", kategori: "Lemak", satuan: "liter", hargaRef: 16000, supplierAktif: 7, ratingRata: 4.4, lokasiTerdekat: "Jakarta Selatan" },
];

export interface LocalProducer {
  id: string;
  nama: string;
  jenis: string;
  lokasi: string;
  komoditas: string[];
  kapasitasBulanan: string;
  isUMKM: boolean;
  rating: number;
  tenagaKerja: number; // jobs supported
  status: "Mitra Aktif" | "Calon Mitra";
}

export const localProducers: LocalProducer[] = [
  { id: "lp1", nama: "Koperasi Tani Nusantara", jenis: "Koperasi Petani", lokasi: "Bandung", komoditas: ["Sayuran", "Buah", "Susu"], kapasitasBulanan: "120 ton", isUMKM: true, rating: 4.9, tenagaKerja: 240, status: "Mitra Aktif" },
  { id: "lp2", nama: "UMKM Sayur Berkah Ciawi", jenis: "Produsen Sayur", lokasi: "Bogor", komoditas: ["Sayuran", "Tomat", "Cabai"], kapasitasBulanan: "45 ton", isUMKM: true, rating: 4.7, tenagaKerja: 35, status: "Mitra Aktif" },
  { id: "lp3", nama: "UMKM Telur Sehat Mandiri", jenis: "Peternak Telur", lokasi: "Jakarta Barat", komoditas: ["Telur Ayam", "Telur Bebek"], kapasitasBulanan: "18 ton", isUMKM: true, rating: 4.6, tenagaKerja: 22, status: "Mitra Aktif" },
  { id: "lp4", nama: "Kelompok Tani Padi Makmur", jenis: "Kelompok Tani", lokasi: "Karawang", komoditas: ["Beras"], kapasitasBulanan: "200 ton", isUMKM: true, rating: 4.8, tenagaKerja: 180, status: "Calon Mitra" },
  { id: "lp5", nama: "UMKM Tempe Higienis Nusantara", jenis: "Produsen Olahan Kedelai", lokasi: "Depok", komoditas: ["Tempe", "Tahu"], kapasitasBulanan: "12 ton", isUMKM: true, rating: 4.5, tenagaKerja: 18, status: "Calon Mitra" },
  { id: "lp6", nama: "Koperasi Nelayan Muara", jenis: "Koperasi Nelayan", lokasi: "Cirebon", komoditas: ["Ikan Segar", "Ikan Beku"], kapasitasBulanan: "60 ton", isUMKM: true, rating: 4.7, tenagaKerja: 95, status: "Calon Mitra" },
];

export type RfqStatus = "Terbuka" | "Evaluasi" | "Diputuskan" | "Ditutup";

export interface Quote {
  id: string;
  supplier: string;
  lokasi: string;
  jarakKm: number;
  hargaSatuan: number;
  priceIndex: number;
  leadTimeDays: number;
  rating: number;
  reliability: number;
  catatan: string;
}

export interface Rfq {
  id: string;
  kode: string;
  komoditas: string;
  qty: number;
  satuan: string;
  buyer: string;
  deadline: string;
  status: RfqStatus;
  quotes: Quote[];
  awardedTo?: string;
}

export const rfqs: Rfq[] = [
  {
    id: "rfq1",
    kode: "RFQ-2406-011",
    komoditas: "Daging Ayam",
    qty: 500,
    satuan: "kg",
    buyer: "SPPG Dapur Pusat Senen",
    deadline: "27 Jun 2026",
    status: "Evaluasi",
    quotes: [
      { id: "q1", supplier: "CV Berkah Lauk", lokasi: "Jakarta Pusat", jarakKm: 4.2, hargaSatuan: 38000, priceIndex: 100, leadTimeDays: 1, rating: 4.6, reliability: 94, catatan: "Stok siap, bersertifikat halal." },
      { id: "q2", supplier: "Distributor Daging Sapi Halal", lokasi: "Jakarta Utara", jarakKm: 9.1, hargaSatuan: 41000, priceIndex: 108, leadTimeDays: 2, rating: 4.9, reliability: 97, catatan: "Cold chain terjamin." },
      { id: "q3", supplier: "Toko Sembako Makmur", lokasi: "Jakarta Selatan", jarakKm: 6.0, hargaSatuan: 39500, priceIndex: 104, leadTimeDays: 1, rating: 4.5, reliability: 88, catatan: "Bisa pengiriman bertahap." },
    ],
  },
  {
    id: "rfq2",
    kode: "RFQ-2406-012",
    komoditas: "Sayur Campuran",
    qty: 400,
    satuan: "kg",
    buyer: "SPPG Dapur Sehat Tebet",
    deadline: "26 Jun 2026",
    status: "Terbuka",
    quotes: [
      { id: "q4", supplier: "Agen Sayur Segar Ciawi", lokasi: "Bogor", jarakKm: 55, hargaSatuan: 12000, priceIndex: 100, leadTimeDays: 1, rating: 4.7, reliability: 92, catatan: "Farm-to-table harian." },
      { id: "q5", supplier: "PT Maju Tani Pangan", lokasi: "Jakarta Selatan", jarakKm: 3.8, hargaSatuan: 12500, priceIndex: 104, leadTimeDays: 1, rating: 4.8, reliability: 95, catatan: "Terdekat, kualitas terjaga." },
    ],
  },
  {
    id: "rfq3",
    kode: "RFQ-2406-009",
    komoditas: "Beras Premium",
    qty: 600,
    satuan: "kg",
    buyer: "SPPG Dapur Pusat Senen",
    deadline: "22 Jun 2026",
    status: "Diputuskan",
    awardedTo: "PT Maju Tani Pangan",
    quotes: [
      { id: "q6", supplier: "PT Maju Tani Pangan", lokasi: "Jakarta Selatan", jarakKm: 3.8, hargaSatuan: 13350, priceIndex: 96, leadTimeDays: 1, rating: 4.8, reliability: 96, catatan: "Pemenang — harga terbaik." },
      { id: "q7", supplier: "Toko Sembako Makmur", lokasi: "Jakarta Selatan", jarakKm: 6.0, hargaSatuan: 13800, priceIndex: 102, leadTimeDays: 1, rating: 4.5, reliability: 88, catatan: "Alternatif." },
    ],
  },
];
