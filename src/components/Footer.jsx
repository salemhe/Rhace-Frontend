import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#E7F0F0] border border-[#DDE1ED] text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6.5 h-6.5 bg-[#60A5FA] rounded-full flex items-center justify-center">
                {/* <span className="text-white font-bold text-lg">R</span> */}
              </div>
              <span className="text-2xl text-[#111827] font-bold">Rhace</span>
            </div>
            <p className="text-[#111827] leading-relaxed font-normal ">
              Making restaurant reservations simple and enjoyable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#111827] font-normal leading-normal hover:text-white transition-colors duration-200">Restaurants</a></li>
              <li><a href="#" className="text-[#111827] font-normal leading-normal hover:text-white transition-colors duration-200">Hotels</a></li>
              <li><a href="#" className="text-[#111827] font-normal leading-normal hover:text-white transition-colors duration-200">Top Restaurant </a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#111827] hover:text-white font-normal leading-normal transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-[#111827] hover:text-white font-normal leading-normal transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-[#111827] hover:text-white font-normal leading-normal transition-colors duration-200">Faq</a></li>
              <li><a href="#" className="text-[#111827] hover:text-white font-normal leading-normal transition-colors duration-200">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#111827] flex-shrink-0" />
                <span className="text-[#111827] font-normal leading-normal ">+23412345678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#111827] flex-shrink-0" />
                <span className="text-[#111827] font-normal leading-normal">Kapadoccia@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#111827] flex-shrink-0" />
                <span className="text-[#111827] font-normal leading-normal">16, Idowu Taylor Street, Victoria Island 101241 Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 sm:flex sm:items-center sm:justify-between">
          <p className="text-[#111827]">
            © 2024 Bookme. All rights reserved. 
          </p>
          <div className="flex justify-start items-center gap-8">
            <div className="justify-start text-gray-900 text-base font-normal font-['Inter'] leading-normal">Privacy Policy</div>
            <div className="justify-start text-gray-900 text-base font-normal font-['Inter'] leading-normal">Terms of Service</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;