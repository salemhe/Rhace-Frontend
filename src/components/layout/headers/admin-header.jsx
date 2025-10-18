import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { LogoutIcon } from '../../../assets/icons/icons';

const AdminHeader = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden mr-4">
          <Menu />
        </button>
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="text-gray-600" />
        <LogoutIcon className="text-gray-600" />
      </div>
    </header>
  );
};

export default AdminHeader;
