import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "@/assets/logo.jpg";
import { useAuth } from "@/context/auth-context";
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Offline-first: auth is mocked so any credentials grant access. The email
  // prefix selects the demo role (e.g. sppg@, mitra@, sekolah@, pemerintah@).
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors font-medium">
           <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 justify-center mb-6">
            <img src={Logo} alt="SATU GIZI" className="h-12 w-auto" />
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-dark-900 tracking-tight leading-none mb-0.5">SATU<span className="text-brand-600">GIZI</span></span>
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Masuk ke Portal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Atau{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
              daftar sebagai Vendor Baru
            </Link>
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all focus:bg-white bg-gray-50/50"
                  placeholder="anda@contoh.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Kata Sandi
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all focus:bg-white bg-gray-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                  Lupa sandi?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-dark-900 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-900 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? 'Masuk...' : <>Masuk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">Masuk cepat sebagai (mode demo)</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Pemerintah", email: "pemerintah@mbgchain.id" },
                { label: "SPPG / Dapur", email: "sppg@mbgchain.id" },
                { label: "Mitra MBG", email: "mitra@mbgchain.id" },
                { label: "Sekolah", email: "sekolah@mbgchain.id" },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={async () => { await login({ email: r.email, password: "demo" }); navigate("/app/dashboard"); }}
                  className="py-2.5 px-3 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-all cursor-pointer"
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-3">Tanpa backend — semua kredensial diterima.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
