import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import VendorHeader from './headers/vendor-header';

const DashboardLayout = ({ children, type }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(path) => navigate(path)}
        type={type}
      />

      <div className="min-h-screen lg:pl-64">
        <VendorHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 py-4 lg:px-6 lg:py-6">
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

