import {
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAsync } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendor = useSelector((state) => state.auth.vendor);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      if (vendor) {
        setProfile(vendor);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error(error);
      setProfile(null);
    }
  }, [vendor]);

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/auth/vendor/login');
  };

  const handleProfile = () => {
    navigate(`/dashboard/${vendor?.vendorType}/profile`);
  };

  const handleSettings = () => {
    navigate(`/dashboard/${vendor?.vendorType}/settings`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 hidden md:flex items-center px-6 relative">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors z-10"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Right side items */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {profile?.logo ? (
              <img src={profile.logo} alt="Vendor Logo" className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200" />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-gray-200">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-32">
                {profile?.businessName ?? 'Vendor'}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {profile?.vendorType ?? ''}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  {profile?.logo ? (
                    <img src={profile.logo} alt="Vendor Logo" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {profile?.businessName ?? 'Vendor'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {profile?.email ?? profile?.vendorType}
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
              <div className="border-t border-gray-100 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
