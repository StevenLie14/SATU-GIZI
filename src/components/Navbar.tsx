import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Home, Menu, X, TrendingUp, Handshake } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from "../assets/logo.jpg";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Peta Sebaran', path: '/map', icon: Map },
    { name: 'Forecast', path: '/forecast', icon: TrendingUp },
    { name: 'Matchmaking', path: '/matchmaking', icon: Handshake },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="SATU GIZI Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-dark-900 tracking-tight leading-none">SATU</span>
              <span className="text-xl font-bold text-brand-600 tracking-tight leading-none">GIZI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group py-2"
                >
                  <span className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'
                  }`}>
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"
                    />
                  )}
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                  )}
                </Link>
              );
            })}
            
            <Link 
              to="/login"
              className="ml-4 px-6 py-2.5 bg-dark-900 text-white text-sm font-medium rounded-full hover:bg-dark-800 transition-all shadow-md hover:shadow-lg"
            >
              Masuk / Daftar
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-brand-600 focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-white border-b border-gray-100"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
          <div className="pt-4 px-4">
             <Link 
               to="/login"
               onClick={() => setIsOpen(false)}
               className="block text-center w-full py-3 bg-dark-900 text-white font-medium rounded-xl hover:bg-dark-800 transition-all"
             >
                Masuk / Daftar
             </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
