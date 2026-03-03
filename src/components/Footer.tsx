import { Utensils, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-900 pt-16 pb-8 border-t border-dark-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <img src="/src/assets/logo.png" alt="SATU GIZI Logo" className="h-12 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Platform modern perizinan, pengawasan, dan distribusi pasokan untuk ekosistem Makan Bergizi Gratis di seluruh Indonesia.
            </p>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors cursor-pointer">
                  <span className="text-xs">IG</span>
               </div>
               <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors cursor-pointer">
                  <span className="text-xs">TW</span>
               </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Platform Utama</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/map" className="hover:text-brand-400 transition-colors">Peta Sebaran Interaktif</Link></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Perizinan Vendor MBG</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Matching Demand-Supply</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">B2B Matchmaking UMKM</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Dukungan</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Panduan Registrasi Dapur</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Standar Gizi BGN</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>Binus Kemanggisan,<br/>Jakarta Barat, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>seseorang</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>seseorang@binus.edu</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} SATU GIZI. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-red-500 mx-1 mb-[1px]" /> untuk Indonesia
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
