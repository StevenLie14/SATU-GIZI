import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MapDashboard from './pages/MapDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuditPage from './pages/AuditPage';
import ForecastPage from './pages/ForecastPage';
import MatchmakingPage from './pages/MatchmakingPage';
import EntityDetailPage from './pages/EntityDetailPage';
import Footer from './components/Footer';
import { ChatBot } from './components/ChatBot';

// Dashboard app
import { ToastProvider } from './app/ui';
import { RoleProvider } from './app/roles';
import DashboardLayout from './app/DashboardLayout';
import DashboardHome from './app/pages/DashboardHome';
import MonitoringProses from './app/pages/distribusi/MonitoringProses';
import DriverKader from './app/pages/distribusi/DriverKader';
import RencanaBelanja from './app/pages/anggaran/RencanaBelanja';
import RencanaMenu from './app/pages/menu/RencanaMenu';
import BahanBaku from './app/pages/menu/BahanBaku';
import GramasiGizi from './app/pages/menu/GramasiGizi';
import Ulasan from './app/pages/laporan/Ulasan';
import LaporanOperasional from './app/pages/laporan/LaporanOperasional';
import ProposalAnggaran from './app/pages/laporan/ProposalAnggaran';
import Mitra from './app/pages/dataTim/Mitra';
import PenerimaManfaat from './app/pages/dataTim/PenerimaManfaat';
import TimDapur from './app/pages/dataTim/TimDapur';
import Supplier from './app/pages/dataTim/Supplier';
import DapurSPPG from './app/pages/manajemenData/DapurSPPG';
import Vendor from './app/pages/manajemenData/Vendor';
import PerencanaanKebutuhan from './app/pages/rantaiPasok/PerencanaanKebutuhan';
import Procurement from './app/pages/rantaiPasok/Procurement';
import Stok from './app/pages/rantaiPasok/Stok';
import DistribusiTransport from './app/pages/rantaiPasok/DistribusiTransport';
import AnalitikPeramalan from './app/pages/rantaiPasok/AnalitikPeramalan';
import Akun from './app/pages/pengaturan/Akun';
import Notifikasi from './app/pages/pengaturan/Notifikasi';

function MarketingLayout() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <RoleProvider>
        <Routes>
          {/* Public / marketing site */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/matchmaking" element={<MatchmakingPage />} />
            <Route path="/detail/:id" element={<EntityDetailPage />} />
          </Route>

          {/* MBG Chain dashboard application */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />

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

            <Route path="manajemen-data/dapur-sppg" element={<DapurSPPG />} />
            <Route path="manajemen-data/vendor" element={<Vendor />} />

            <Route path="rantai-pasok/perencanaan" element={<PerencanaanKebutuhan />} />
            <Route path="rantai-pasok/procurement" element={<Procurement />} />
            <Route path="rantai-pasok/stok" element={<Stok />} />
            <Route path="rantai-pasok/distribusi" element={<DistribusiTransport />} />
            <Route path="rantai-pasok/analitik" element={<AnalitikPeramalan />} />

            <Route path="pengaturan/akun" element={<Akun />} />
            <Route path="pengaturan/notifikasi" element={<Notifikasi />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RoleProvider>
    </ToastProvider>
  );
}

export default App;
