import { cn } from '@/lib/utils';
import { Bell, ChevronDown, ChevronUp, Heart, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';


// logo imports — 
import logoWhite from '@/public/images/Rhace-09.png';
import logoBlack from '@/public/images/Rhace-11.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pathname, setPathname] = useState('/');
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigates = useNavigate();

  // Redux user
  const user = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Navbar links
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Bookings / Reservations", href: "/bookings" },
    { name: "Favorites", href: "/favorites" },
  ];

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user.isAuthenticated) {
          setProfile(user.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  // Handle logout (same as Header)
  const handleLogout = async () => {
    console.log("Attempting to logout");
    dispatch(logout());
    setProfile(null);
  };

  // Navigate helper
  const navigate = (path) => {
    setPathname(path);
    navigates(path);
  };

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src={scrolled ? logoBlack : logoWhite}
              alt="Rhace Logo"
              className="h-6 w-auto object-contain transition-all duration-300"
            />
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
                  <span className={`absolute h-2 bg-[#004d43] left-1/2 -translate-x-1/2 bottom-0 rounded-full transition-all duration-300 ${isActive ? 'w-6' : 'w-0 group-hover:w-6'}`} />
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
                {loading ? (
                  <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse" />
                ) : (
                  // <img
                  //   src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  //   alt="Profile"
                  //   className="w-6 h-6 rounded-full object-cover"
                  // />
                  <>
                    {profile ? (

                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage
                          src={profile.profilePic}
                          alt={`${profile.firstName} ${profile.lastName}`}
                        />
                        <AvatarFallback>
                          {profile.firstName[0].toUpperCase()}
                          {profile.lastName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : <User className="w-6 h-6 text-gray-400 bg-gray-200 rounded-full p-1" />}
                  </>
                )}
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
                    isAuthenticated={user.isAuthenticated}
                    handleLogout={handleLogout}
                    user={profile}
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



function UserProfileMenu({ onClose, navigate, isAuthenticated, handleLogout, user }) {
  const handleNavigation = (path) => {
    if (navigate) navigate(path);
    if (onClose) onClose();
  };

  const handleSignIn = () => handleNavigation('/auth/user/login');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {user ? (

            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage
                src={user.profilePic}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {user.firstName[0].toUpperCase()}
                {user.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : <User className="w-6 h-6 text-gray-400 bg-gray-200 rounded-full p-1" />}

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
        <MenuItem text="Bookings/Reservation" onClick={() => handleNavigation('/bookings')} />
        <MenuItem text="Wishlist" onClick={() => handleNavigation('/favorites')} />
        <MenuItem text="Payments/Transaction" onClick={() => handleNavigation('/payments')} />
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Menu Items Section 2 */}
      <div className="py-1">
        <MenuItem text="Account" onClick={() => handleNavigation('/account')} />
        <MenuItem text="Help Center" onClick={() => handleNavigation('/contact')} />
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Sign In / Sign Out */}
      <div className="py-1">
        <button
          onClick={() => {
            if (isAuthenticated) {
              handleLogout();
            } else {
              handleSignIn();
            }
            if (onClose) onClose();
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

function MenuItem({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
    >
      {text}
    </button>
  );
}
