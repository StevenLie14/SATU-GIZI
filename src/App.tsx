import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MapDashboard from './pages/MapDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-dark-900 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
