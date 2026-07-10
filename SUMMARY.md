# SATU-GIZI — Project Module Summary

> **MBG Chain** — platform gizi terpadu (perizinan vendor, rantai pasok, distribusi, gizi & transparansi blockchain) untuk program Makan Bergizi Gratis.
>
> _Recap terakhir: 2026-07-10_

## Ringkasan Arsitektur

| Layer | Stack | Status |
|-------|-------|--------|
| **Backend** | NestJS + Prisma (PostgreSQL) | ✅ Fungsional — 28 modul, **168 endpoint REST**, JWT + RBAC + throttling |
| **Frontend** | React + Vite + TailwindCSS + React Router | ✅ UI lengkap (30 halaman) — **offline-first** dengan data mock, integrasi backend parsial |
| **Blockchain** | Solidity + Hardhat | ✅ 4 smart contract + deploy script + test |
| **Data** | Prisma schema: **32 model, 8 enum** + seed (`seed.ts`) | ✅ Skema & seed lengkap |
| **Infra** | Docker Compose, Dockerfile (BE/FE), Vercel config | ✅ Siap deploy |

> **Catatan integrasi:** Frontend berjalan dalam **offline mode** secara default (`VITE_OFFLINE_MODE=true`) memakai data mock. Backend penuh sudah tersedia dan siap diaktifkan (`VITE_API_URL=http://localhost:3000`). Wiring API live saat ini lewat 3 service: **auth**, **entities**, **ai**.

**Legenda status:** ✅ Selesai · 🟡 UI mock (backend siap, belum di-wire) · 🔵 Algoritma sisi-klien · ➖ N/A

---

## Modul Backend (NestJS)

### Inti & Autentikasi
| Modul | Fungsi | Backend | Frontend (halaman) | Sumber Data |
|-------|--------|:------:|--------------------|:-----------:|
| `auth` | Login, register, JWT, guard/role | ✅ | `auth/login`, `auth/register` | 🟢 Live |
| `users` | Manajemen pengguna & akun | ✅ | `pengaturan/akun` | 🟡 Mock |
| `entities` | Entitas geo (sekolah/dapur/vendor), peta | ✅ | `map`, `entity/detail`, `audit` | 🟢 Live |
| `health` | Health check API | ✅ | ➖ | ➖ |
| `blockchain` | Anchor & verifikasi record on-chain | ✅ | `blockchain/verifikasi` | 🟡 Mock |

### Menu & Gizi
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `menu` | Rencana menu MBG | ✅ | `menu/rencana` | 🟡 Mock |
| `ingredients` | Bahan baku | ✅ | `menu/bahan-baku` | 🟡 Mock |
| `nutrition` | Target/analisis gizi (AKG) & gramasi | ✅ | `menu/gramasi` | 🟡 Mock |

### Anggaran & Laporan
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `budget` | Item anggaran, rencana belanja | ✅ | `anggaran/rencana-belanja` | 🟡 Mock |
| `proposals` | Proposal anggaran | ✅ | `laporan/proposal-anggaran` | 🟡 Mock |
| `reports` | Laporan operasional | ✅ | `laporan/operasional` | 🟡 Mock |
| `reviews` | Ulasan & sentimen | ✅ | `laporan/ulasan` | 🟡 Mock |

### Tim & Mitra
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `partners` | Mitra | ✅ | `data-tim/mitra` | 🟡 Mock |
| `suppliers` | Supplier/vendor | ✅ | `data-tim/supplier`, `manajemen-data/vendor` | 🟡 Mock |
| `beneficiaries` | Penerima manfaat | ✅ | `data-tim/penerima-manfaat` | 🟡 Mock |
| `kitchen-staff` | Tim dapur | ✅ | `data-tim/tim-dapur` | 🟡 Mock |

### Master Data & Verifikasi
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `kitchens` | Dapur SPPG, izin, checklist, inspeksi | ✅ | `manajemen-data/dapur-sppg` | 🟡 Mock |
| `vendor-verification` | Verifikasi vendor BGN, sertifikat, kepatuhan | ✅ | `manajemen-data/verifikasi-vendor` | 🟡 Mock |

### Distribusi
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `distribution` | Batch distribusi & tahapan | ✅ | `distribusi/monitoring` | 🟡 Mock |
| `personnel` | Driver/kader | ✅ | `distribusi/driver-kader` | 🟡 Mock |
| `logistics` | Kendaraan, transport, optimasi rute | ✅ | `rantai-pasok/distribusi` | 🟡 Mock |

### Rantai Pasok
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `requirements` | Perencanaan kebutuhan | ✅ | `rantai-pasok/perencanaan` | 🟡 Mock |
| `procurement` | Pengadaan / purchase order | ✅ | `rantai-pasok/procurement` | 🟡 Mock |
| `marketplace` | Katalog, produsen lokal, RFQ, matchmaking B2B | ✅ (catalog/producer/rfq) | `rantai-pasok/rfq`, `matchmaking-panel` | 🔵 Klien + 🟡 Mock |
| `stock` | Stok gudang & status | ✅ | `rantai-pasok/stok` | 🟡 Mock |
| `analytics` | Analitik & peramalan, neraca antarwilayah, redistribusi | ✅ | `rantai-pasok/analitik`, `route-optimizer-panel` | 🔵 Klien + 🟡 Mock |

### Cross-cutting
| Modul | Fungsi | Backend | Frontend | Sumber Data |
|-------|--------|:------:|----------|:-----------:|
| `ai` | Insight lintas-domain, asisten prosedur, supplier matching | ✅ (heuristik offline) | `ai-copilot`, `dashboard` | 🟢 Live |
| `notifications` | Notifikasi | ✅ | `pengaturan/notifikasi` | 🟡 Mock |

---

## Smart Contracts (Blockchain)

| Kontrak | Fungsi | Status |
|---------|--------|:------:|
| `PermitRegistry.sol` | Registry izin (dapur/SPPG) | ✅ |
| `VendorCredentialRegistry.sol` | Kredensial & sertifikat vendor on-chain | ✅ |
| `ProcurementRFQ.sol` | RFQ pengadaan transparan | ✅ |
| `RedistributionLedger.sol` | Ledger redistribusi antarwilayah | ✅ |
| Deploy + Test | `scripts/deploy.ts`, `test/contracts.test.ts` | ✅ |

---

## Rekap Progres Keseluruhan

| Area | Progres | Keterangan |
|------|:-------:|------------|
| **Backend API** | ✅ ~100% | 28 modul, 168 endpoint, semua Prisma-backed + seed |
| **Skema data** | ✅ ~100% | 32 model, 8 enum, seed lengkap |
| **Frontend UI** | ✅ ~100% | 30 halaman + layout marketing & dashboard |
| **Smart contracts** | ✅ ~100% | 4 kontrak + deploy + test |
| **Integrasi FE ↔ BE (live)** | 🟡 ~15% | Live: auth, entities, ai. Sisanya masih mock (offline-first) |
| **Infra/Deploy** | ✅ Siap | Docker Compose, Dockerfile, Vercel |

### Langkah lanjut yang tersisa
1. **Wiring API live** untuk modul yang masih memakai mock (mayoritas 🟡) — buat service layer per domain & set `VITE_OFFLINE_MODE=false`.
2. **Anchoring blockchain nyata** — hubungkan `blockchain` module & `lib/blockchain` ke kontrak yang sudah di-deploy.
3. **Autentikasi end-to-end** di seluruh halaman (proteksi route dashboard).
4. **Uji integrasi & seeding DB** pada environment staging.
