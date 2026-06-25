import { Routes, Route, Navigate } from "react-router-dom";

import MarketingLayout from "@/components/layout/marketing-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";

// Marketing
import LandingPage from "@/features/landing/landing-page";
import MapDashboard from "@/features/map/map-dashboard";
import LoginPage from "@/features/auth/login-page";
import RegisterPage from "@/features/auth/register-page";
import AuditPage from "@/features/audit/audit-page";
import EntityDetailPage from "@/features/entity/entity-detail-page";

// Dashboard
import DashboardHome from "@/features/dashboard/dashboard-home";
import AiCopilot from "@/features/ai-copilot/ai-copilot";
import MonitoringProses from "@/features/distribusi/monitoring-proses";
import DriverKader from "@/features/distribusi/driver-kader";
import RencanaBelanja from "@/features/anggaran/rencana-belanja";
import RencanaMenu from "@/features/menu/rencana-menu";
import BahanBaku from "@/features/menu/bahan-baku";
import GramasiGizi from "@/features/menu/gramasi-gizi";
import Ulasan from "@/features/laporan/ulasan";
import LaporanOperasional from "@/features/laporan/laporan-operasional";
import ProposalAnggaran from "@/features/laporan/proposal-anggaran";
import Mitra from "@/features/data-tim/mitra";
import PenerimaManfaat from "@/features/data-tim/penerima-manfaat";
import TimDapur from "@/features/data-tim/tim-dapur";
import Supplier from "@/features/data-tim/supplier";
import VerifikasiVendor from "@/features/manajemen-data/verifikasi-vendor";
import DapurSPPG from "@/features/manajemen-data/dapur-sppg";
import Vendor from "@/features/manajemen-data/vendor";
import PerencanaanKebutuhan from "@/features/rantai-pasok/perencanaan-kebutuhan";
import Procurement from "@/features/rantai-pasok/procurement";
import Rfq from "@/features/rantai-pasok/rfq";
import Stok from "@/features/rantai-pasok/stok";
import DistribusiTransport from "@/features/rantai-pasok/distribusi-transport";
import AnalitikPeramalan from "@/features/rantai-pasok/analitik-peramalan";
import BlockchainVerifikasi from "@/features/blockchain/blockchain-verifikasi";
import Akun from "@/features/pengaturan/akun";
import Notifikasi from "@/features/pengaturan/notifikasi";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public / marketing site */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/detail/:id" element={<EntityDetailPage />} />
      </Route>

      {/* Legacy public links — consolidated into the dashboard */}
      <Route path="/map" element={<Navigate to="/app/peta" replace />} />
      <Route path="/forecast" element={<Navigate to="/app/rantai-pasok/analitik" replace />} />
      <Route path="/matchmaking" element={<Navigate to="/app/rantai-pasok/procurement" replace />} />

      {/* MBG Chain dashboard application */}
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="ai-copilot" element={<AiCopilot />} />
        <Route path="peta" element={<MapDashboard />} />

        <Route path="distribusi/monitoring" element={<MonitoringProses />} />
        <Route path="distribusi/driver-kader" element={<DriverKader />} />

        <Route path="anggaran/rencana-belanja" element={<RencanaBelanja />} />

        <Route path="menu/rencana" element={<RencanaMenu />} />
        <Route path="menu/bahan-baku" element={<BahanBaku />} />
        <Route path="menu/gramasi" element={<GramasiGizi />} />

        <Route path="laporan/ulasan" element={<Ulasan />} />
        <Route path="laporan/operasional" element={<LaporanOperasional />} />
        <Route path="laporan/proposal-anggaran" element={<ProposalAnggaran />} />

        <Route path="data-tim/mitra" element={<Mitra />} />
        <Route path="data-tim/penerima-manfaat" element={<PenerimaManfaat />} />
        <Route path="data-tim/tim-dapur" element={<TimDapur />} />
        <Route path="data-tim/supplier" element={<Supplier />} />

        <Route path="manajemen-data/verifikasi-vendor" element={<VerifikasiVendor />} />
        <Route path="manajemen-data/dapur-sppg" element={<DapurSPPG />} />
        <Route path="manajemen-data/vendor" element={<Vendor />} />

        <Route path="rantai-pasok/perencanaan" element={<PerencanaanKebutuhan />} />
        <Route path="rantai-pasok/procurement" element={<Procurement />} />
        <Route path="rantai-pasok/rfq" element={<Rfq />} />
        <Route path="rantai-pasok/stok" element={<Stok />} />
        <Route path="rantai-pasok/distribusi" element={<DistribusiTransport />} />
        <Route path="rantai-pasok/analitik" element={<AnalitikPeramalan />} />

        <Route path="blockchain/verifikasi" element={<BlockchainVerifikasi />} />

        <Route path="pengaturan/akun" element={<Akun />} />
        <Route path="pengaturan/notifikasi" element={<Notifikasi />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
