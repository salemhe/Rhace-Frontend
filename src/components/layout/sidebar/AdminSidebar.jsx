import React from 'react';
import { useLocation } from 'react-router-dom';
import { AdminList } from './SideMenuList';
import { X } from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose, onNavigate }) => {
  const location = useLocation();

  const isActiveRoute = (itemPath) => {
    return location.pathname === itemPath;
  };

  const handleItemClick = (item) => {
    if (onNavigate) {
      onNavigate(item.path);
    }
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  const menuItems = AdminList.topItems.map(item => ({
    ...item,
    active: isActiveRoute(item.path)
  }));

  const bottomItems = AdminList.bottomItems.map(item => ({
    ...item,
    active: isActiveRoute(item.path)
  }));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-emerald-950 text-white">
          <div className="flex items-center h-16 px-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-slate-300 rounded-full mr-3"></div>
              <span className="text-xl font-bold">Rhace Admin</span>
            </div>
          </div>

          <nav className="flex-1 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-[90%] flex items-center pl-7 py-2 gap-3 rounded-tr-[36px] rounded-br-[36px] text-left transition-colors duration-200 ${
                  item.active
                    ? 'bg-teal-700 text-white shadow-[0px_1px_3px_0px_rgba(122,122,122,0.10)]'
                    : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px py-4 space-y-1">
            {bottomItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-[90%] flex items-center pl-7 py-2 rounded-tr-[36px] rounded-br-[36px] text-left transition-colors duration-200 ${
                  item.active
                    ? 'bg-teal-700 text-white shadow-[0px_1px_3px_0px_rgba(122,122,122,0.10)]'
                    : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-emerald-950 text-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-teal-900">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <div className="w-6 h-6 bg-teal-800 rounded-full"></div>
            </div>
            <span className="text-xl font-bold">Rhace Admin</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-teal-700 p-1 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                item.active
                  ? 'bg-teal-700 text-white'
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-teal-700 space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                item.active
                  ? 'bg-teal-700 text-white'
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
