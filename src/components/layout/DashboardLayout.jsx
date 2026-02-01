import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './headers/vendor-header';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const DashboardLayout = ({ children, type, section, settings }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate()
  const vendor = useSelector(state => state.auth.vendor)


  return (
    <div className="flex h-dvh bg-white">
      {/* Sidebar */}
      <Sidebar  onNavigate={navigate} type={vendor.vendorType} section={section} settings={settings} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;