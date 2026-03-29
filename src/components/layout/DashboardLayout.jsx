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

  // Refresh token on window focus
  const handleFocus = useCallback(async () => {
    try {
      await authService.vendorRefresh();
    } catch (error) {
      console.error('Focus refresh failed:', error);
    }
  }, []);

  // Auto-refresh token every 10 minutes
  useEffect(() => {
    if (!vendor?._id) return;

    const refreshInterval = setInterval(async () => {
      try {
        console.log('DashboardLayout: Auto-refreshing vendor token...');
        const data = await authService.vendorRefresh();
        // Update Redux if vendor data returned (optional backend vendor refresh)
        if (data.vendor) {
          dispatch(setVendor(data.vendor));
        }
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Don't logout automatically - let axios handle
      }
    }, 10 * 60 * 1000); // 10 minutes

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [vendor?._id, dispatch]);

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
