import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '@/services/auth.service';
import { setVendor } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import Sidebar from './sidebar/Sidebar';
import Header from './headers/vendor-header';

const DashboardLayout = ({ children, section, settings }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendor = useSelector(state => state.auth.vendor);

  return (
    <ErrorBoundary>
      <div className="flex h-dvh">
        {/* Sidebar */}
        <Sidebar onNavigate={navigate} type={vendor?.vendorType} settings={settings} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Header */}
          <Header section={section} onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        
        {/* Mobile sidebar overlay */}
        {/* {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )} */}
      </div>
    </ErrorBoundary>
  );

};

export default DashboardLayout;
