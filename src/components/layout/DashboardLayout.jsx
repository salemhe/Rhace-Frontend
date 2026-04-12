import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import VendorHeader from './headers/vendor-header';

const DashboardLayout = ({ children, type }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">

      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar
          isOpen={false}
          onClose={() => {}}
          onNavigate={(path) => navigate(path)}
          type={type}
        />
      </div>

      <div className="flex flex-1 relative overfow-hidden flex-col w-full">
        <VendorHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto lg:mb-14">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
  </div>
  );
};

export default DashboardLayout;

