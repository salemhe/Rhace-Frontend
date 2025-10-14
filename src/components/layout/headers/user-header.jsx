import { cn } from '@/lib/utils';
import { Bell, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pathname, setPathname] = useState('/');
  const dropdownRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigates = useNavigate()
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Bookings / Reservations", href: "/bookings" },
    { name: "Offers", href: "#" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Initialize auth state from localStorage and listen for cross-tab changes
  useEffect(() => {
    const readAuthFromStorage = () => {
      try {
        // common keys the app might use
        const candidateKeys = ['auth', 'authToken', 'authUser', 'authData'];
        for (const key of candidateKeys) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          // If value is JSON (object with user/isAuthenticated), parse it
          try {
            const parsed = JSON.parse(raw);
            return { key, parsed };
          } catch {
            // not JSON -> treat as token string
            return { key, token: raw };
          }
        }
      } catch {
        // ignore
      }
      return null;
    };

    const init = () => {
      const auth = readAuthFromStorage();
      if (!auth) {
        setIsAuthenticated(false);
        setAuthUser(null);
        return;
      }

      if (auth.token) {
        // token-only storage implies authenticated
        setIsAuthenticated(true);
        setAuthUser(null);
        return;
      }

      const parsed = auth.parsed;
      // if the stored object uses nested 'user' or direct fields
      const user = parsed?.user || parsed?.userData || parsed;
      const isAuthFlag = parsed?.isAuthenticated || parsed?.isAuth || false;

      setIsAuthenticated(!!(isAuthFlag || user));
      setAuthUser(user || null);
    };

    init();

    const handleStorage = (e) => {
      if (!e.key) {
        // some browsers send null key for clear() events; re-init
        init();
        return;
      }
      const watched = ['auth', 'authToken', 'authUser', 'authData'];
      if (watched.includes(e.key)) {
        init();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navigate = (path) => {
    setPathname(path);
    navigates(path);
    console.log('Navigating to:', path);
  };

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-[26px] h-[26px] bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg"></span>
            </div>
            <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>Rhace</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, idx) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              return (
                <a
                  href={item.href}
                  key={idx}
                  className={`transition-colors duration-200 text-base font-bold px-3 py-2 relative group ${scrolled ? 'text-gray-900' : 'text-white'}`}
                >
                  {item.name}
                  <span className={`absolute h-0.5 bg-blue-500 left-1/2 -translate-x-1/2 bottom-0 rounded-full transition-all duration-300 ${isActive ? 'w-6' : 'w-0 group-hover:w-6'}`} />
                </a>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className={`hidden md:flex p-2 rounded-full transition-colors duration-200 ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
              <Heart className="w-5 h-5" />
            </button>
            <button className={`hidden md:flex p-2 rounded-full transition-colors duration-200 ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${scrolled ? 'outline outline-gray-200 hover:bg-gray-50' : 'outline outline-white/30 hover:bg-white/10'}`}
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
                {isMenuOpen ? (
                  <ChevronUp className={`w-5 h-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                )}
              </button>

              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 z-50">
                  <UserProfileMenu
                    onClose={() => setIsMenuOpen(false)}
                    navigate={navigate}
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                    user={authUser}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

function UserProfileMenu ({ onClose, navigate, isAuthenticated, setIsAuthenticated, user }) {
  const handleNavigation = (path) => {
    if (navigate) {
      navigate(path);
      if (onClose) onClose();
    }
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    try {
      // clear common auth keys — adapt to your app's real keys
      const keys = ['auth', 'authToken', 'authUser', 'authData', 'token'];
      for (const k of keys) {
        try { localStorage.removeItem(k); } catch { /* ignore */ }
      }
    } catch {
      // ignore storage errors
    }
    if (typeof setIsAuthenticated === 'function') setIsAuthenticated(false);
    if (onClose) onClose();
    // optionally navigate to homepage after sign out
    if (navigate) navigate('/');
  };

  const handleSignIn = () => {
    // direct the user to the sign-in page
    handleNavigation('/auth/user/login');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Hi, {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest'}
            </h2>
            <p className="text-xs text-gray-600">
              {user?.email || 'Not signed in'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items Section 1 */}
      <div className="py-1">
        <MenuItem text="Messages" onClick={() => handleNavigation('/messages')} />
        <MenuItem text="Bookings/Reservation" onClick={() => handleNavigation('/bookings')} />
        <MenuItem text="Wishlist" onClick={() => handleNavigation('/wishlist')} />
        <MenuItem text="Payments/Transaction" onClick={() => handleNavigation('/payments')} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Menu Items Section 2 */}
      <div className="py-1">
        <MenuItem text="Account" onClick={() => handleNavigation('/account')} />
        <MenuItem text="Help Center" onClick={() => handleNavigation('/help')} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Sign In / Sign Out */}
      <div className="py-1">
        <button
          onClick={() => {
            if (isAuthenticated) {
              handleSignOut();
            } else {
              handleSignIn();
            }
          }}
          className={cn(
            "w-full text-left px-4 py-3 font-medium hover:bg-red-50 transition-colors text-sm",
            isAuthenticated ? 'text-red-500' : 'text-gray-700'
          )}
        >
          {isAuthenticated ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

function MenuItem ({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
    >
      {text}
    </button>
  );
}