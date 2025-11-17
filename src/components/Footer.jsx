// logo imports — 
import logoBlack from '@/assets/Rhace-11.png';
import { Mail, MapPin, Phone, ArrowUpRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <footer className="bg-gradient-to-br from-[#E9EBF3] via-[#F3F4F8] to-[#E9EBF3] text-[#111827] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <a href="/" className="flex items-center space-x-2">
                  <img
                    src={logoBlack}
                    alt="Rhace Logo"
                    className="h-6 w-auto object-contain transition-all duration-300"
                  />
                </a>
              </div>
            </div>
            <p className="text-[#111827] leading-relaxed font-normal text-sm">
              Making restaurant reservations simple and enjoyable.
            </p>
          </div>

          {/* Quick Links - Explore */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Explore
            </h3>
            <ul className="space-y-3">
              {['Restaurants', 'Hotels', 'Top Restaurant'].map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    onMouseEnter={() => setHoveredLink(`explore-${idx}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group flex items-center text-[#111827] font-normal hover:text-blue-600 transition-all duration-200"
                  >
                    <span className={`transform transition-transform duration-200 ${hoveredLink === `explore-${idx}` ? 'translate-x-2' : ''}`}>
                      {item}
                    </span>
                    <ArrowUpRight className={`w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'FAQ', href: '/faq' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setHoveredLink(`quick-${idx}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group flex items-center text-[#111827] font-normal hover:text-blue-600 transition-all duration-200"
                  >
                    <span className={`transform transition-transform duration-200 ${hoveredLink === `quick-${idx}` ? 'translate-x-2' : ''}`}>
                      {item.name}
                    </span>
                    <ArrowUpRight className={`w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Contact
            </h3>
            <div className="space-y-4">
              <a href="tel:+23412345678" className="group flex items-start space-x-3 hover:bg-white/50 p-3 rounded-lg transition-all duration-200 -ml-3">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg group-hover:shadow-lg transition-shadow">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#111827] font-normal text-sm pt-2">+23412345678</span>
              </a>
              
              <a href="mailto:Kapadoccia@gmail.com" className="group flex items-start space-x-3 hover:bg-white/50 p-3 rounded-lg transition-all duration-200 -ml-3">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg group-hover:shadow-lg transition-shadow">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#111827] font-normal text-sm pt-2 break-all">Kapadoccia@gmail.com</span>
              </a>
              
              <div className="group flex items-start space-x-3 hover:bg-white/50 p-3 rounded-lg transition-all duration-200 -ml-3">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg group-hover:shadow-lg transition-shadow flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-[#111827] font-normal text-sm pt-2">
                  16, Idowu Taylor Street, Victoria Island 101241 Nigeria
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="text-[#111827] text-sm text-center lg:text-left">
              © 2024 Bookme. All rights reserved.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' }
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="p-2 bg-white rounded-full hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-600 text-gray-700 hover:text-white transform hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <a href="#" className="text-[#111827] hover:text-teal-600 font-normal transition-colors duration-200 relative group">
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-[#111827] hover:text-teal-600 font-normal transition-colors duration-200 relative group">
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;