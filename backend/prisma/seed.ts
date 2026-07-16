import {
  PrismaClient,
  Role,
  PermitStatus,
  VerificationStatus,
  GenericStatus,
  StockStatus,
  ApprovalStatus,
  RfqStatus,
  DistributionStage,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { REAL_SCHOOLS, REAL_SUPPLIERS } from './seed-data/real-locations';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MBG Chain database...');
  const pw = await bcrypt.hash('password123', 10);

  // ---- Clean (children → parents) ----
  await prisma.notification.deleteMany();
  await prisma.blockchainRecord.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.rfq.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.complianceItem.deleteMany();
  await prisma.vendorVerification.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.distributionBatch.deleteMany();
  await prisma.kitchenStaff.deleteMany();
  await prisma.school.deleteMany();
  await prisma.kitchen.deleteMany();
  await prisma.$transaction([
    prisma.partner.deleteMany(),
    prisma.supplier.deleteMany(),
    prisma.localProducer.deleteMany(),
    prisma.personnel.deleteMany(),
    prisma.vehicle.deleteMany(),
    prisma.menuPlan.deleteMany(),
    prisma.ingredient.deleteMany(),
    prisma.nutritionTarget.deleteMany(),
    prisma.budgetItem.deleteMany(),
    prisma.budgetProposal.deleteMany(),
    prisma.opsReport.deleteMany(),
    prisma.requirementPlan.deleteMany(),
    prisma.purchaseOrder.deleteMany(),
    prisma.stockItem.deleteMany(),
    prisma.catalogItem.deleteMany(),
    prisma.regionBalance.deleteMany(),
    prisma.redistributionRec.deleteMany(),
    prisma.geoRule.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ---- Users (one per role + a vendor) ----
  await prisma.user.createMany({
    data: [
      { email: 'admin@mbgchain.id', password: pw, name: 'Administrator', role: Role.ADMIN },
      { email: 'pemerintah@mbgchain.id', password: pw, name: 'Badan Gizi Nasional', role: Role.PEMERINTAH },
      { email: 'sppg@mbgchain.id', password: pw, name: 'SPPG Dapur Pusat Senen', role: Role.SPPG },
      { email: 'sekolah@mbgchain.id', password: pw, name: 'SDN Menteng 01', role: Role.SEKOLAH },
      { email: 'mitra@mbgchain.id', password: pw, name: 'PT Maju Tani Pangan', role: Role.MITRA, businessName: 'PT Maju Tani Pangan', commodities: 'Beras, Sayuran', latitude: -6.21, longitude: 106.83, address: 'Jakarta Selatan', rating: 4.8, auditScore: 85 },
    ],
  });

  // ---- Kitchens (Dapur SPPG) with checklist ----
  const senen = await prisma.kitchen.create({
    data: {
      name: 'SPPG Dapur Pusat Senen', latitude: -6.192, longitude: 106.845, address: 'Pasar Senen Lt. 4, Jakarta Pusat',
      capacity: 2000, serviceRadiusKm: 8, rating: 4.7, phone: '021-7890001', kepala: 'Chef Wawan',
      izinStatus: PermitStatus.BERLAKU, izinNomor: 'SLHS/2026/JKT/0112', izinBerlaku: 's.d 31 Des 2026', skorPengawasan: 92,
      checklist: { create: [
        { label: 'Sertifikat Laik Higiene Sanitasi (SLHS)', done: true },
        { label: 'Sertifikat Halal', done: true },
        { label: 'Pelatihan Higiene Karyawan', done: true },
        { label: 'Fasilitas Cold Storage', done: true },
        { label: 'Audit HACCP Berkala', done: false },
      ] },
    },
  });
  const tebet = await prisma.kitchen.create({
    data: {
      name: 'SPPG Dapur Sehat Tebet', latitude: -6.225, longitude: 106.855, address: 'Jl. Tebet Barat Dalam, Jakarta Selatan',
      capacity: 1500, rating: 4.5, phone: '021-7890002', kepala: 'Pak Sugeng',
      izinStatus: PermitStatus.PROSES, izinNomor: 'SLHS/2026/JKT/0140 (proses)', izinBerlaku: 'Pengajuan 18 Jun 2026', skorPengawasan: 84,
      checklist: { create: [
        { label: 'Sertifikat Laik Higiene Sanitasi (SLHS)', done: false },
        { label: 'Sertifikat Halal', done: true },
        { label: 'Pelatihan Higiene Karyawan', done: true },
        { label: 'Fasilitas Cold Storage', done: false },
        { label: 'Audit HACCP Berkala', done: true },
      ] },
    },
  });

  // ---- Schools / beneficiaries ----
  const schools = await Promise.all(
    [
      { name: 'SDN Menteng 01', latitude: -6.188, longitude: 106.832, address: 'Jl. Besuki No.4, Menteng', capacity: 450, jenjang: 'SD', students: 450, kitchenId: senen.id, phone: '021-5550001' },
      { name: 'SMPN 1 Jakarta', latitude: -6.175, longitude: 106.82, address: 'Jl. Cikini Raya No.87', capacity: 800, jenjang: 'SMP', students: 800, kitchenId: senen.id, phone: '021-5550002' },
      { name: 'SDN Tebet Barat 05', latitude: -6.235, longitude: 106.85, address: 'Jl. Tebet Barat Dalam', capacity: 320, jenjang: 'SD', students: 320, kitchenId: tebet.id },
      { name: 'SDN Cikini 02', latitude: -6.19, longitude: 106.84, address: 'Jl. Cikini Raya No.40', capacity: 360, jenjang: 'SD', students: 360, kitchenId: senen.id },
      { name: 'SMPN 19 Jakarta', latitude: -6.23, longitude: 106.86, address: 'Jl. Bumi Manti, Tebet', capacity: 540, jenjang: 'SMP', students: 540, kitchenId: tebet.id },
    ].map((s) => prisma.school.create({ data: s })),
  );

  // Sekolah nyata dari OpenStreetMap (lihat prisma/seed-data/real-locations.ts)
  const kitchenIdOf = { senen: senen.id, tebet: tebet.id } as const;
  await prisma.school.createMany({
    data: REAL_SCHOOLS.map(({ kitchen, ...s }) => ({
      ...s,
      kitchenId: kitchen ? kitchenIdOf[kitchen] : null,
    })),
  });

  // ---- Distribution batches ----
  await prisma.distributionBatch.createMany({
    data: [
      { kode: 'MBG-0612-A1', kitchenId: senen.id, schoolId: schools[0].id, porsi: 450, menu: 'Nasi Ayam Teriyaki + Sayur', driver: 'Budi Santoso', stage: DistributionStage.TRANSIT, suhu: '62°C', berangkat: '06:40', estimasi: '07:10', progress: 70 },
      { kode: 'MBG-0612-A2', kitchenId: senen.id, schoolId: schools[1].id, porsi: 800, menu: 'Nasi Ayam Teriyaki + Sayur', driver: 'Agus Wijaya', stage: DistributionStage.SELESAI, berangkat: '06:10', estimasi: '06:45', progress: 100 },
      { kode: 'MBG-0612-B1', kitchenId: tebet.id, schoolId: schools[2].id, porsi: 320, menu: 'Nasi Telur Balado + Tumis', driver: 'Dewi Lestari', stage: DistributionStage.PENGEMASAN, suhu: '68°C', estimasi: '07:30', progress: 35 },
      { kode: 'MBG-0612-C1', kitchenId: senen.id, schoolId: schools[3].id, porsi: 360, menu: 'Nasi Ayam Teriyaki + Sayur', driver: 'Sari Indah', stage: DistributionStage.TIBA, suhu: '60°C', berangkat: '06:25', estimasi: '07:00', progress: 90 },
      { kode: 'MBG-0612-C2', kitchenId: tebet.id, schoolId: schools[4].id, porsi: 540, menu: 'Nasi Telur Balado + Tumis', driver: 'Eko Prasetyo', stage: DistributionStage.TRANSIT, suhu: '61°C', berangkat: '06:55', estimasi: '07:25', progress: 60 },
    ],
  });

  // ---- Reviews ----
  await prisma.review.createMany({
    data: [
      { schoolId: schools[0].id, sekolah: 'SDN Menteng 01', penilai: 'Ibu Ratna (Guru)', rating: 5, rasa: 5, porsi: 5, kebersihan: 5, komentar: 'Anak-anak sangat menyukai ayam teriyaki, porsi pas dan masih hangat.', tanggal: '23 Jun 2026', tag: 'Positif' },
      { schoolId: schools[1].id, sekolah: 'SMPN 1 Jakarta', penilai: 'Pak Hadi (Wakasek)', rating: 4, rasa: 4, porsi: 5, kebersihan: 4, komentar: 'Secara umum baik, sayur sedikit kurang matang hari ini.', tanggal: '23 Jun 2026', tag: 'Netral' },
      { schoolId: schools[3].id, sekolah: 'SDN Cikini 02', penilai: 'Pak Doni (Kepsek)', rating: 3, rasa: 3, porsi: 3, kebersihan: 4, komentar: 'Nasi agak keras, mohon diperbaiki.', tanggal: '22 Jun 2026', tag: 'Keluhan' },
    ],
  });

  // ---- Kitchen staff, personnel, vehicles ----
  await prisma.kitchenStaff.createMany({
    data: [
      { nama: 'Chef Wawan', peran: 'Kepala Dapur', sertifikasi: 'Higiene Pangan, Ahli Gizi', status: 'Aktif', kitchenId: senen.id },
      { nama: 'Ibu Nurul', peran: 'Ahli Gizi', sertifikasi: 'Registered Dietitian', status: 'Aktif', kitchenId: senen.id },
      { nama: 'Ibu Yanti', peran: 'QC Pangan', sertifikasi: 'HACCP', status: 'Aktif', kitchenId: tebet.id },
    ],
  });
  await prisma.personnel.createMany({
    data: [
      { nama: 'Budi Santoso', peran: 'Driver', area: 'Jakarta Pusat', kontak: '0812-1111-001', status: 'Bertugas', pengiriman: 312, rating: 4.9 },
      { nama: 'Dewi Lestari', peran: 'Kader', area: 'Jakarta Selatan', kontak: '0812-1111-003', status: 'Standby', pengiriman: 154, rating: 4.8 },
      { nama: 'Maya Putri', peran: 'Koordinator', area: 'Jakarta Pusat', kontak: '0812-1111-007', status: 'Bertugas', pengiriman: 0, rating: 4.9 },
    ],
  });
  await prisma.vehicle.createMany({
    data: [
      { plat: 'B 9123 ABC', jenis: 'Box Berpendingin', driver: 'Budi Santoso', kapasitas: 600, muatan: 450, rute: 'Senen → Menteng', status: 'Dalam Perjalanan' },
      { plat: 'B 9789 GHI', jenis: 'Pickup Tertutup', driver: 'Rudi Hartono', kapasitas: 400, muatan: 0, rute: '—', status: 'Siap' },
    ],
  });

  // ---- Partners, suppliers, producers ----
  await prisma.partner.createMany({
    data: [
      { nama: 'PT Maju Tani Pangan', jenis: 'Pemasok Beras & Sayur', pic: 'Andi Pratama', kontak: '021-1234567', kontrak: 'Jan 2026 - Des 2026', status: GenericStatus.AKTIF, rating: 4.8 },
      { nama: 'CV Berkah Lauk', jenis: 'Pemasok Protein', pic: 'Siti Aminah', kontak: '021-7654321', kontrak: 'Mar 2026 - Feb 2027', status: GenericStatus.AKTIF, rating: 4.6 },
      { nama: 'Toko Sembako Makmur', jenis: 'Pemasok Sembako', pic: 'Lina Marlina', kontak: '021-3334445', kontrak: 'Apr 2026 - Mar 2027', status: GenericStatus.PENDING, rating: 4.5 },
    ],
  });
  await prisma.supplier.createMany({
    data: [
      { nama: 'PT Maju Tani Pangan', komoditas: ['Beras', 'Sayuran'], lokasi: 'Jakarta Selatan', latitude: -6.244, longitude: 106.8, hargaIndex: 96, leadTime: '1 hari', rating: 4.8, status: GenericStatus.AKTIF },
      { nama: 'CV Berkah Lauk', komoditas: ['Daging Ayam', 'Telur'], lokasi: 'Jakarta Pusat', latitude: -6.186, longitude: 106.837, hargaIndex: 102, leadTime: '1 hari', rating: 4.6, status: GenericStatus.AKTIF },
      { nama: 'Agen Sayur Segar Ciawi', komoditas: ['Sayuran', 'Tomat'], lokasi: 'Bogor', latitude: -6.655, longitude: 106.855, hargaIndex: 98, leadTime: '1 hari', rating: 4.7, status: GenericStatus.AKTIF },
      { nama: 'Koperasi Tani Nusantara', komoditas: ['Buah', 'Sayuran', 'Susu'], lokasi: 'Bandung', latitude: -6.914, longitude: 107.609, hargaIndex: 94, leadTime: '2 hari', rating: 4.9, status: GenericStatus.AKTIF },
    ],
  });
  // Pasar nyata dari OpenStreetMap sebagai supplier tambahan
  await prisma.supplier.createMany({
    data: REAL_SUPPLIERS.map((s) => ({ ...s, status: GenericStatus.AKTIF })),
  });
  await prisma.localProducer.createMany({
    data: [
      { nama: 'Koperasi Tani Nusantara', jenis: 'Koperasi Petani', lokasi: 'Bandung', komoditas: ['Sayuran', 'Buah', 'Susu'], kapasitasBulanan: '120 ton', isUMKM: true, rating: 4.9, tenagaKerja: 240, status: 'Mitra Aktif' },
      { nama: 'UMKM Sayur Berkah Ciawi', jenis: 'Produsen Sayur', lokasi: 'Bogor', komoditas: ['Sayuran', 'Cabai'], kapasitasBulanan: '45 ton', isUMKM: true, rating: 4.7, tenagaKerja: 35, status: 'Mitra Aktif' },
      { nama: 'Kelompok Tani Padi Makmur', jenis: 'Kelompok Tani', lokasi: 'Karawang', komoditas: ['Beras'], kapasitasBulanan: '200 ton', isUMKM: true, rating: 4.8, tenagaKerja: 180, status: 'Calon Mitra' },
    ],
  });

  // ---- Vendor verifications (BGN) ----
  await prisma.vendorVerification.create({
    data: {
      nama: 'PT Maju Tani Pangan', jenisUsaha: 'Pemasok Beras & Sayur', lokasi: 'Jakarta Selatan', pic: 'Andi Pratama', kontak: '021-1234567',
      npwp: '01.234.567.8-901.000', nib: '1234560078901', isUMKM: false, bgnApproved: true, status: VerificationStatus.TERVERIFIKASI, foodSafetyScore: 94,
      certificates: { create: [
        { type: 'SLHS', nomor: 'SLHS/2026/JKT/0210', validUntil: '31 Des 2026', status: 'Valid' },
        { type: 'HALAL', nomor: 'ID00410000123', validUntil: '20 Mar 2027', status: 'Valid' },
      ] },
      compliance: { create: [
        { label: 'NPWP terverifikasi (DJP)', done: true },
        { label: 'NIB / Izin Usaha aktif (OSS)', done: true },
        { label: 'Persetujuan Badan Gizi Nasional (BGN)', done: true },
      ] },
    },
  });
  await prisma.vendorVerification.create({
    data: {
      nama: 'UMKM Sayur Berkah Ciawi', jenisUsaha: 'Produsen Lokal Sayuran', lokasi: 'Bogor', pic: 'Hj. Aminah', kontak: '0251-1112223',
      npwp: '03.456.789.0-123.000', nib: '3456780090123', isUMKM: true, bgnApproved: false, status: VerificationStatus.PROSES, foodSafetyScore: 78,
      certificates: { create: [{ type: 'SLHS', nomor: 'SLHS/2026/BGR/0099', validUntil: '30 Jun 2026', status: 'Valid' }] },
      compliance: { create: [
        { label: 'NPWP terverifikasi (DJP)', done: true },
        { label: 'Sertifikat Halal (BPJPH)', done: false },
        { label: 'Persetujuan Badan Gizi Nasional (BGN)', done: false },
      ] },
    },
  });

  // ---- Menu, ingredients, nutrition ----
  await prisma.menuPlan.createMany({
    data: [
      { hari: 'Senin', tanggal: '23 Jun', week: 'Minggu 4 Juni 2026', menuUtama: 'Nasi Putih', lauk: 'Ayam Teriyaki', sayur: 'Tumis Buncis Wortel', buah: 'Pisang', kalori: 685, status: 'Disetujui' },
      { hari: 'Selasa', tanggal: '24 Jun', week: 'Minggu 4 Juni 2026', menuUtama: 'Nasi Putih', lauk: 'Telur Balado', sayur: 'Cap Cay', buah: 'Jeruk', kalori: 640, status: 'Disetujui' },
      { hari: 'Rabu', tanggal: '25 Jun', week: 'Minggu 4 Juni 2026', menuUtama: 'Nasi Uduk', lauk: 'Ikan Tongkol Suwir', sayur: 'Tumis Kangkung', buah: 'Semangka', kalori: 710, status: 'Terjadwal' },
    ],
  });
  await prisma.ingredient.createMany({
    data: [
      { nama: 'Beras', kategori: 'Karbohidrat', perPorsi: 100, satuan: 'gram', hargaSatuan: 13.5, supplier: 'PT Maju Tani Pangan' },
      { nama: 'Daging Ayam', kategori: 'Protein', perPorsi: 75, satuan: 'gram', hargaSatuan: 38, supplier: 'CV Berkah Lauk' },
      { nama: 'Telur Ayam', kategori: 'Protein', perPorsi: 55, satuan: 'gram', hargaSatuan: 29, supplier: 'Agen Telur Berkah' },
    ],
  });
  await prisma.nutritionTarget.createMany({
    data: [
      { kelompok: 'PAUD/TK (4-6 th)', ageRange: '4-6 tahun', jenjang: 'PAUD', energi: 525, protein: 15, lemak: 18, karbohidrat: 75, serat: 6, realisasiEnergi: 540 },
      { kelompok: 'SD Kelas 1-3 (7-9 th)', ageRange: '7-9 tahun', jenjang: 'SD', energi: 650, protein: 20, lemak: 22, karbohidrat: 95, serat: 8, realisasiEnergi: 685 },
      { kelompok: 'SMP (13-15 th)', ageRange: '13-15 tahun', jenjang: 'SMP', energi: 750, protein: 28, lemak: 25, karbohidrat: 110, serat: 10, realisasiEnergi: 720 },
    ],
  });

  // ---- Budget, proposals, reports ----
  await prisma.budgetItem.createMany({
    data: [
      { kategori: 'Karbohidrat', item: 'Beras Premium', qty: 1200, satuan: 'kg', hargaSatuan: 13500, periode: 'Juni 2026', status: ApprovalStatus.DISETUJUI },
      { kategori: 'Protein Hewani', item: 'Daging Ayam', qty: 850, satuan: 'kg', hargaSatuan: 38000, periode: 'Juni 2026', status: ApprovalStatus.DISETUJUI },
      { kategori: 'Protein Hewani', item: 'Telur Ayam', qty: 600, satuan: 'kg', hargaSatuan: 29000, periode: 'Juni 2026', status: ApprovalStatus.MENUNGGU },
    ],
  });
  await prisma.budgetProposal.createMany({
    data: [
      { judul: 'Proposal Anggaran Operasional Juli 2026', pengaju: 'SPPG Dapur Pusat Senen', periode: 'Juli 2026', nilai: 875000000, status: ApprovalStatus.MENUNGGU, tanggal: '20 Jun 2026' },
      { judul: 'Proposal Pengadaan Cold Storage', pengaju: 'SPPG Dapur Sehat Tebet', periode: 'Q3 2026', nilai: 320000000, status: ApprovalStatus.DISETUJUI, tanggal: '15 Jun 2026' },
    ],
  });
  await prisma.opsReport.createMany({
    data: [
      { judul: 'Laporan Operasional Harian', periode: '23 Jun 2026', dapur: 'SPPG Dapur Pusat Senen', porsiTerkirim: 1610, porsiTerencana: 1650, realisasiBiaya: 28175000, status: 'Final', tanggal: '23 Jun 2026' },
      { judul: 'Laporan Operasional Mingguan', periode: 'Minggu 3 Juni 2026', dapur: 'Semua Dapur', porsiTerkirim: 18900, porsiTerencana: 19250, realisasiBiaya: 330750000, status: 'Direview', tanggal: '22 Jun 2026' },
    ],
  });

  // ---- Supply chain ----
  await prisma.requirementPlan.createMany({
    data: [
      { komoditas: 'Beras', kebutuhanMingguan: 1400, satuan: 'kg', stokSaatIni: 950, reorderPoint: 800, proyeksiHabis: '5 hari' },
      { komoditas: 'Daging Ayam', kebutuhanMingguan: 980, satuan: 'kg', stokSaatIni: 310, reorderPoint: 400, proyeksiHabis: '2 hari' },
      { komoditas: 'Sayur Campuran', kebutuhanMingguan: 850, satuan: 'kg', stokSaatIni: 120, reorderPoint: 250, proyeksiHabis: '1 hari' },
    ],
  });
  await prisma.purchaseOrder.createMany({
    data: [
      { kode: 'PO-2406-001', komoditas: 'Beras', qty: 600, satuan: 'kg', supplier: 'PT Maju Tani Pangan', nilai: 8100000, status: 'Diterima', tanggal: '22 Jun 2026' },
      { kode: 'PO-2406-002', komoditas: 'Daging Ayam', qty: 500, satuan: 'kg', supplier: 'CV Berkah Lauk', nilai: 19000000, status: 'Dikirim', tanggal: '23 Jun 2026' },
    ],
  });
  await prisma.stockItem.createMany({
    data: [
      { nama: 'Beras Premium', kategori: 'Karbohidrat', jumlah: 950, satuan: 'kg', gudang: 'Gudang Senen', kadaluarsa: '12 Des 2026', status: StockStatus.AMAN },
      { nama: 'Daging Ayam Beku', kategori: 'Protein', jumlah: 310, satuan: 'kg', gudang: 'Cold Storage Senen', kadaluarsa: '30 Jun 2026', status: StockStatus.MENIPIS },
      { nama: 'Sayur Campuran', kategori: 'Sayuran', jumlah: 120, satuan: 'kg', gudang: 'Gudang Tebet', kadaluarsa: '26 Jun 2026', status: StockStatus.KRITIS },
    ],
  });
  await prisma.catalogItem.createMany({
    data: [
      { nama: 'Beras Premium', kategori: 'Karbohidrat', satuan: 'kg', hargaRef: 13500, supplierAktif: 8, ratingRata: 4.7, lokasiTerdekat: 'Jakarta Selatan' },
      { nama: 'Daging Ayam', kategori: 'Protein', satuan: 'kg', hargaRef: 38000, supplierAktif: 6, ratingRata: 4.6, lokasiTerdekat: 'Jakarta Pusat' },
      { nama: 'Sayur Campuran', kategori: 'Sayuran', satuan: 'kg', hargaRef: 12000, supplierAktif: 9, ratingRata: 4.8, lokasiTerdekat: 'Bogor' },
    ],
  });

  // ---- RFQ + quotes ----
  const rfq = await prisma.rfq.create({
    data: {
      kode: 'RFQ-2406-011', komoditas: 'Daging Ayam', qty: 500, satuan: 'kg', buyer: 'SPPG Dapur Pusat Senen', deadline: '27 Jun 2026', status: RfqStatus.EVALUASI,
      quotes: { create: [
        { supplier: 'CV Berkah Lauk', lokasi: 'Jakarta Pusat', jarakKm: 4.2, hargaSatuan: 38000, priceIndex: 100, leadTimeDays: 1, rating: 4.6, reliability: 94, catatan: 'Stok siap, bersertifikat halal.' },
        { supplier: 'Distributor Daging Sapi Halal', lokasi: 'Jakarta Utara', jarakKm: 9.1, hargaSatuan: 41000, priceIndex: 108, leadTimeDays: 2, rating: 4.9, reliability: 97, catatan: 'Cold chain terjamin.' },
      ] },
    },
  });

  // ---- Analytics: region balance + redistribution ----
  await prisma.regionBalance.createMany({
    data: [
      { region: 'Jakarta Selatan', surplus: -2500, komoditas: 'Sayuran' },
      { region: 'Jakarta Timur', surplus: 1800, komoditas: 'Sayuran' },
      { region: 'Bandung', surplus: 4200, komoditas: 'Sayuran' },
      { region: 'Bogor', surplus: 2100, komoditas: 'Sayuran' },
    ],
  });
  // Rekomendasi redistribusi kini diturunkan dari RegionBalance + aturan radius
  // (lihat AnalyticsService.redistribution) — tidak lagi di-seed statis.

  // ---- Aturan wilayah (titik pusat + radius) ----
  await prisma.geoRule.createMany({
    data: [
      { scope: 'SCHOOL_ASSIGNMENT', radiusKm: 10 },
      { scope: 'SUPPLIER_MATCH', radiusKm: 60 },
      { scope: 'REDISTRIBUTION', radiusKm: 160 },
    ],
  });

  // ---- Notifications ----
  await prisma.notification.createMany({
    data: [
      { judul: 'Stok Kritis: Sayur Campuran', pesan: 'Stok Sayur Campuran di Gudang Tebet tersisa 120 kg (di bawah reorder point).', kategori: 'Stok', dibaca: false },
      { judul: 'Pengiriman Selesai', pesan: 'Batch MBG-0612-A2 ke SMPN 1 Jakarta telah diterima (800 porsi).', kategori: 'Distribusi', dibaca: false },
      { judul: 'Proposal Disetujui', pesan: 'Proposal Pengadaan Cold Storage telah disetujui pemerintah.', kategori: 'Anggaran', dibaca: true },
    ],
  });

  // ---- Blockchain audit trail ----
  await prisma.blockchainRecord.createMany({
    data: [
      { txHash: '0x' + 'a1'.repeat(32), blockNumber: 19482001, contract: 'PermitRegistry', method: 'issuePermit', actor: 'Dinas Kesehatan', status: 'confirmed', summary: 'Izin diterbitkan untuk SPPG Dapur Pusat Senen' },
      { txHash: '0x' + 'b2'.repeat(32), blockNumber: 19482002, contract: 'VendorCredentialRegistry', method: 'setBGNApproval', actor: 'Badan Gizi Nasional', status: 'confirmed', summary: 'Vendor terverifikasi BGN: PT Maju Tani Pangan' },
      { txHash: '0x' + 'c3'.repeat(32), blockNumber: 19482003, contract: 'ProcurementRFQ', method: 'createRFQ', actor: 'SPPG', status: 'confirmed', summary: `${rfq.kode} — Daging Ayam (500 kg)` },
      { txHash: '0x' + 'd4'.repeat(32), blockNumber: 19482004, contract: 'RedistributionLedger', method: 'proposeTransfer', actor: 'Koordinator Wilayah', status: 'pending', summary: 'Sayuran Bandung → Jakarta Selatan' },
    ],
  });

  console.log('✅ Seeding complete.');
  console.log('   Login (password: password123): admin@ / pemerintah@ / sppg@ / mitra@ / sekolah@ mbgchain.id');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
