import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MapDashboard from './pages/MapDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuditPage from './pages/AuditPage';
import ForecastPage from './pages/ForecastPage';
import MatchmakingPage from './pages/MatchmakingPage';
import Footer from './components/Footer';
import { ChatBot } from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/matchmaking" element={<MatchmakingPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;
