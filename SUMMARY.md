# SATU-GIZI — Project Module Summary

> **MBG Chain** — platform gizi terpadu (perizinan vendor, rantai pasok, distribusi, gizi & transparansi blockchain) untuk program Makan Bergizi Gratis.
>
> _Recap terakhir: 2026-07-16_

## Ringkasan Arsitektur

| Layer | Stack | Status |
|-------|-------|--------|
| **Backend** | NestJS + Prisma (PostgreSQL) | ✅ Fungsional — 29 modul, **171 endpoint REST**, JWT + RBAC + throttling |
| **Frontend** | React + Vite + TailwindCSS + React Router | ✅ UI lengkap (31 halaman) — **terhubung ke backend live**, fallback offline (data mock) saat API tak tersedia |
| **Blockchain** | Solidity + Hardhat | ✅ 4 smart contract **terdeploy di Polygon Amoy** + deploy script + test |
| **Data** | Prisma schema: **33 model, 9 enum** + seed (`seed.ts`) | ✅ Skema & seed lengkap — **100 sekolah + 20 pasar nyata dari OpenStreetMap** |
| **Infra** | Docker Compose, Dockerfile (BE/FE), Vercel config | ✅ Siap deploy |

> **Catatan integrasi:** Frontend kini **terhubung ke backend live** lewat service layer per domain (27 dari 28 service memanggil API, pola `tryApi` dengan fallback offline ke data mock). Set `VITE_API_URL` untuk mengaktifkan; tanpa itu aplikasi tetap berfungsi penuh dalam mode offline.

**Legenda status:** ✅ Selesai · 🟢 Live (fallback offline) · 🟡 UI mock (backend siap, belum di-wire) · 🔵 Algoritma sisi-klien · ➖ N/A

---

## Modul Backend (NestJS)

### Inti & Autentikasi
| Modul | Fungsi | Backend | Frontend (halaman) | Sumber Data |
|-------|--------|:------:|--------------------|:-----------:|
| `auth` | Login, register, JWT, guard/role | ✅ | `auth/login`, `auth/register` | 🟢 Live |
| `users` | Manajemen pengguna & akun | ✅ | `pengaturan/akun` | 🟡 Mock |
| `entities` | Entitas geo (sekolah/dapur/vendor), peta | ✅ | `map`, `entity/detail`, `audit` | 🟢 Live |
| `health` | Health check API | ✅ | ➖ | ➖ |
| `blockchain` | Anchor & verifikasi record on-chain | ✅ | `blockchain/verifikasi` | 🟢 Live |

### Menu & Gizi
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `menu` | Rencana menu MBG | ✅ | `menu/rencana` | 🟢 Live |
| `ingredients` | Bahan baku | ✅ | `menu/bahan-baku` | 🟢 Live |
| `nutrition` | Target/analisis gizi (AKG) & gramasi | ✅ | `menu/gramasi` | 🟢 Live |

### Anggaran & Laporan
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `budget` | Item anggaran, rencana belanja | ✅ | `anggaran/rencana-belanja` | 🟢 Live |
| `proposals` | Proposal anggaran | ✅ | `laporan/proposal-anggaran` | 🟢 Live |
| `reports` | Laporan operasional | ✅ | `laporan/operasional` | 🟢 Live |
| `reviews` | Ulasan & sentimen | ✅ | `laporan/ulasan` | 🟢 Live |

### Tim & Mitra
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `partners` | Mitra | ✅ | `data-tim/mitra` | 🟢 Live |
| `suppliers` | Supplier/vendor | ✅ | `data-tim/supplier`, `manajemen-data/vendor` | 🟢 Live |
| `beneficiaries` | Penerima manfaat | ✅ | `data-tim/penerima-manfaat` | 🟢 Live |
| `kitchen-staff` | Tim dapur | ✅ | `data-tim/tim-dapur` | 🟢 Live |

### Master Data & Verifikasi
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `kitchens` | Dapur SPPG, izin, checklist, inspeksi | ✅ | `manajemen-data/dapur-sppg` | 🟢 Live |
| `vendor-verification` | Verifikasi vendor BGN, sertifikat, kepatuhan | ✅ | `manajemen-data/verifikasi-vendor` | 🟢 Live |

### Distribusi
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `distribution` | Batch distribusi & tahapan | ✅ | `distribusi/monitoring` | 🟢 Live |
| `personnel` | Driver/kader | ✅ | `distribusi/driver-kader` | 🟢 Live |
| `logistics` | Kendaraan, transport, optimasi rute | ✅ | `rantai-pasok/distribusi` | 🟢 Live |

### Rantai Pasok
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `requirements` | Perencanaan kebutuhan | ✅ | `rantai-pasok/perencanaan` | 🟢 Live |
| `procurement` | Pengadaan / purchase order | ✅ | `rantai-pasok/procurement` | 🟢 Live |
| `marketplace` | Katalog, produsen lokal, RFQ, matchmaking B2B | ✅ (catalog/producer/rfq) | `rantai-pasok/rfq`, `matchmaking-panel` | 🔵 Klien + 🟢 Live |
| `stock` | Stok gudang & status | ✅ | `rantai-pasok/stok` | 🟢 Live |
| `analytics` | Analitik & peramalan, neraca antarwilayah, redistribusi | ✅ | `rantai-pasok/analitik`, `route-optimizer-panel` | 🔵 Klien + 🟢 Live |

### Cross-cutting
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `ai` | Insight lintas-domain, asisten prosedur, supplier matching | ✅ (heuristik offline) | `ai-copilot`, `dashboard` | 🟢 Live |
| `notifications` | Notifikasi | ✅ | `pengaturan/notifikasi` | 🟢 Live |
| `geo-rules` | Aturan wilayah (titik pusat + radius): penugasan sekolah→dapur, matching supplier, redistribusi | ✅ | `pengaturan/aturan-wilayah`, map picker di `data-tim/penerima-manfaat` | 🟢 Live |

---

## Smart Contracts (Blockchain)

Keempat kontrak sudah **terdeploy di Polygon Amoy testnet** — alamat lengkap di `blockchain/deployments/amoy.json` dan `frontend/src/lib/blockchain/abis.ts`.

| Kontrak | Fungsi | Status |
|---------|--------|:------:|
| `PermitRegistry.sol` | Registry izin (dapur/SPPG) | ✅ Deployed (Amoy) |
| `VendorCredentialRegistry.sol` | Kredensial & sertifikat vendor on-chain | ✅ Deployed (Amoy) |
| `ProcurementRFQ.sol` | RFQ pengadaan transparan | ✅ Deployed (Amoy) |
| `RedistributionLedger.sol` | Ledger redistribusi antarwilayah | ✅ Deployed (Amoy) |
| Deploy + Test | `scripts/deploy.ts`, `test/contracts.test.ts` | ✅ |

---

## Rekap Progres Keseluruhan

| Area | Progres | Keterangan |
|------|:-------:|------------|
| **Backend API** | ✅ ~100% | 29 modul, 171 endpoint, semua Prisma-backed + seed |
| **Skema data** | ✅ ~100% | 33 model, 9 enum; seed berisi data nyata OSM (100 sekolah + 20 pasar) & aturan wilayah default (10/60/160 km) |
| **Frontend UI** | ✅ ~100% | 31 halaman + layout marketing & dashboard |
| **Smart contracts** | ✅ ~100% | 4 kontrak terdeploy di Polygon Amoy + test |
| **Integrasi FE ↔ BE (live)** | ✅ ~95% | 27/28 service memanggil API dengan fallback offline; sisa: halaman akun (`users`) |
| **Infra/Deploy** | ✅ Siap | Docker Compose, Dockerfile, Vercel; DB PostgreSQL live (pgbouncer) |

### Langkah lanjut yang tersisa
1. **Wiring halaman akun** (`pengaturan/akun`) ke modul `users`.
2. **Uji anchoring on-chain end-to-end** dari UI (kontrak & alamat sudah siap di Amoy).
3. **Uji integrasi menyeluruh** pada environment production (Vercel + VPS DB).
