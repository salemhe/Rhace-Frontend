import React, { useEffect, useState } from 'react';
import { Search, MapPin, User, Menu, X, Heart, Clock, Bell } from 'lucide-react';

import { useLocation } from "react-router-dom";

const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {pathname } = useLocation();
   const navItems = [
    { name: "Home", href: "/" },
    // { name: "Restaurants", href: "/userDashboard/search" },
    { name: "Bookings / Reservations", href: "/bookings" },
    { name: "Offers", href: "#" },
  ];

    useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`fixed top-0 z-90 w-full transition-all duration-300 ${scrolled ? 'bg-[#F9FAFB] ' : 'bg-transparent text-white '}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-[26px]  h-[26px] bg-[#60A5FA] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-2xl font-bold">Rhace</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, idx) => {
              const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname?.startsWith(item.href);
              return (
            <a href={item.href} key={idx} className="transition-colors duration-200  text-[1rem]  font-bold px-3 py-2 
                          relative group">{item.name}
              <span
                          className={`absolute h-0.5 w-0 bg-blue-500 left-1/2 -translate-x-1/2 bottom-0 rounded-full
                          ${isActive ? 'w-[24px] h-2' : 'group-hover:w-[24px] h-2'} transition-all duration-300`}
                        />
            </a>)})}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:bg-purple-700 rounded-full transition-colors duration-200">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-purple-700 rounded-full transition-colors duration-200">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 outline  outline-offset-[-1px] outline-gray-200 px-4 py-2 rounded-full transition-colors duration-200">
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-purple-700 rounded-full transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-700">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="hover:text-purple-300 transition-colors duration-200">Home</a>
              <a href="#" className="hover:text-purple-300 transition-colors duration-200">Restaurants</a>
              <a href="#" className="hover:text-purple-300 transition-colors duration-200">Reservations</a>
              <a href="#" className="hover:text-purple-300 transition-colors duration-200">About</a>
              <button className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-full transition-colors duration-200 w-fit">
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default UserHeader;
