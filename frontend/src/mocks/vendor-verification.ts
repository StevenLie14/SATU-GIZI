/* Vendor verification & BGN compliance (mock).
   Integrates NPWP, izin usaha (NIB) and certification documents. */

export type VerifStatus = "Terverifikasi" | "Proses" | "Dokumen Kurang" | "Ditolak";
export type CertStatus = "Valid" | "Proses" | "Kadaluarsa";

export interface VendorCert {
  type: string; // SLHS, HALAL, HACCP, ISO22000
  nomor: string;
  validUntil: string;
  status: CertStatus;
  docHash?: string;
}

export interface ComplianceItem {
  label: string;
  done: boolean;
}

export interface VendorVerification {
  id: string;
  nama: string;
  jenisUsaha: string;
  lokasi: string;
  pic: string;
  kontak: string;
  npwp: string;
  nib: string;
  isUMKM: boolean;
  bgnApproved: boolean;
  status: VerifStatus;
  foodSafetyScore: number; // 0-100
  certificates: VendorCert[];
  compliance: ComplianceItem[];
}

const baseCompliance = (over: Partial<Record<string, boolean>> = {}): ComplianceItem[] => [
  { label: "NPWP terverifikasi (DJP)", done: over.npwp ?? true },
  { label: "NIB / Izin Usaha aktif (OSS)", done: over.nib ?? true },
  { label: "Sertifikat Laik Higiene Sanitasi (SLHS)", done: over.slhs ?? true },
  { label: "Sertifikat Halal (BPJPH)", done: over.halal ?? true },
  { label: "Standar Keamanan Pangan (HACCP/ISO 22000)", done: over.haccp ?? false },
  { label: "Persetujuan Badan Gizi Nasional (BGN)", done: over.bgn ?? false },
];

export const vendorVerifications: VendorVerification[] = [
  {
    id: "vv1",
    nama: "PT Maju Tani Pangan",
    jenisUsaha: "Pemasok Beras & Sayur",
    lokasi: "Jakarta Selatan",
    pic: "Andi Pratama",
    kontak: "021-1234567",
    npwp: "01.234.567.8-901.000",
    nib: "1234560078901",
    isUMKM: false,
    bgnApproved: true,
    status: "Terverifikasi",
    foodSafetyScore: 94,
    certificates: [
      { type: "SLHS", nomor: "SLHS/2026/JKT/0210", validUntil: "31 Des 2026", status: "Valid" },
      { type: "HALAL", nomor: "ID00410000123", validUntil: "20 Mar 2027", status: "Valid" },
      { type: "ISO22000", nomor: "ISO/22000/2025/118", validUntil: "10 Jan 2027", status: "Valid" },
    ],
    compliance: baseCompliance({ haccp: true, bgn: true }),
  },
  {
    id: "vv2",
    nama: "Koperasi Tani Nusantara",
    jenisUsaha: "Produsen Buah & Sayur",
    lokasi: "Bandung",
    pic: "Bambang S.",
    kontak: "022-9998887",
    npwp: "02.345.678.9-012.000",
    nib: "2345670089012",
    isUMKM: true,
    bgnApproved: true,
    status: "Terverifikasi",
    foodSafetyScore: 90,
    certificates: [
      { type: "SLHS", nomor: "SLHS/2026/BDG/0044", validUntil: "15 Nov 2026", status: "Valid" },
      { type: "HALAL", nomor: "ID00410000455", validUntil: "01 Sep 2026", status: "Valid" },
    ],
    compliance: baseCompliance({ haccp: true, bgn: true }),
  },
  {
    id: "vv3",
    nama: "UMKM Sayur Berkah Ciawi",
    jenisUsaha: "Produsen Lokal Sayuran",
    lokasi: "Bogor",
    pic: "Hj. Aminah",
    kontak: "0251-1112223",
    npwp: "03.456.789.0-123.000",
    nib: "3456780090123",
    isUMKM: true,
    bgnApproved: false,
    status: "Proses",
    foodSafetyScore: 78,
    certificates: [
      { type: "SLHS", nomor: "SLHS/2026/BGR/0099", validUntil: "30 Jun 2026", status: "Valid" },
      { type: "HALAL", nomor: "—", validUntil: "Dalam proses", status: "Proses" },
    ],
    compliance: baseCompliance({ halal: false, haccp: false, bgn: false }),
  },
  {
    id: "vv4",
    nama: "CV Berkah Lauk",
    jenisUsaha: "Pemasok Protein",
    lokasi: "Jakarta Pusat",
    pic: "Siti Aminah",
    kontak: "021-7654321",
    npwp: "04.567.890.1-234.000",
    nib: "4567890012345",
    isUMKM: false,
    bgnApproved: false,
    status: "Dokumen Kurang",
    foodSafetyScore: 71,
    certificates: [
      { type: "HALAL", nomor: "ID00410000789", validUntil: "12 Agu 2026", status: "Valid" },
      { type: "SLHS", nomor: "—", validUntil: "Belum diunggah", status: "Proses" },
    ],
    compliance: baseCompliance({ slhs: false, haccp: false, bgn: false }),
  },
  {
    id: "vv5",
    nama: "UMKM Telur Sehat Mandiri",
    jenisUsaha: "Produsen Lokal Telur",
    lokasi: "Jakarta Barat",
    pic: "Joko Susilo",
    kontak: "021-5556667",
    npwp: "05.678.901.2-345.000",
    nib: "5678900123456",
    isUMKM: true,
    bgnApproved: false,
    status: "Proses",
    foodSafetyScore: 82,
    certificates: [
      { type: "SLHS", nomor: "SLHS/2026/JKT/0301", validUntil: "28 Feb 2027", status: "Valid" },
      { type: "HALAL", nomor: "ID00410000901", validUntil: "05 Jul 2026", status: "Valid" },
    ],
    compliance: baseCompliance({ haccp: false, bgn: false }),
  },
];
