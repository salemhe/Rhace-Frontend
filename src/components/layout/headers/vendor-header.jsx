import React from 'react';
import { Search, Bell, Menu, User, ChevronDown } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6 relative">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors z-10"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Search bar */}
      <div
        className="
          flex-1 max-w-xs
          lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:max-w-2xl
        "
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full sm:w-[520px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Right side items */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-900">Joseph Eyebiokin</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
