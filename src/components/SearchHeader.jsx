import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { Bell, ChevronDown, ChevronUp, Heart, LogIn, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileMenu } from "@/components/layout/headers/user-header";
import { SvgIcon, SvgIcon2, SvgIcon3 } from "@/public/icons/icons";
import logoBlack from "@/public/images/Rhace-11.png";
import { logout } from "@/redux/slices/authSlice";
import { SearchBar } from "./SearchBar";
import { LocationPill } from "./LocationPill";

const TABS = [
  { val: "", label: "All" },
  { val: "restaurant", label: "Restaurants", icon: (active) => <SvgIcon isActive={!active} /> },
  { val: "hotel",      label: "Hotels",      icon: (active) => <SvgIcon2 className="text-amber-200" /> },
  { val: "club",       label: "Clubs",       icon: (active) => <SvgIcon3 isActive={!active} /> },
];

export const SearchHeader = ({
  searchProps,
  filters, updateFilter,
  locationState,
}) => {
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const user        = useSelector(s => s.auth);
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profile = user.isAuthenticated ? user.user : null;

  const handleLogout = () => { dispatch(logout()); };

  return (
    <div className="z-40 relative bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">

        {/* ── Row 1: Logo + Search + User ──────────────────────────── */}
        <div className="flex z-10 gap-2 flex-wrap justify-between">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="flex items-center cursor-pointer space-x-2">
            <img src={logoBlack} alt="Rhace Logo" className="h-6 w-auto object-contain" />
          </div>

          {/* Search bar + button */}
          <div className="flex flex-1 mt-4 sm:mt-0 sm:flex-1 sm:w-auto sm:max-w-2xl sm:mx-auto gap-1.5 sm:gap-3 order-last sm:order-none">
            <SearchBar {...searchProps} filters={filters} />
            <button
              onClick={() => searchProps.submitSearch()}
              className="px-5 sm:px-5 py-0.5 sm:py-2.5 bg-[#0A6C6D] text-white text-sm sm:text-base font-semibold rounded-full hover:bg-[#084F4F] transition-colors shrink-0"
            >
              Search
            </button>
          </div>

          {/* User area */}
          {profile ? (
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="hidden md:flex p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative text-gray-700" ref={dropdownRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 px-2 py-2 rounded-full outline outline-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile.profilePic} alt={`${profile.firstName} ${profile.lastName}`} />
                    <AvatarFallback>
                      {profile.firstName[0].toUpperCase()}{profile.lastName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isMenuOpen ? <ChevronUp className="w-5 h-5 text-gray-700" /> : <ChevronDown className="w-5 h-5 text-gray-700" />}
                </button>
                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 z-50">
                    <UserProfileMenu
                      onClose={() => setIsMenuOpen(false)} navigate={navigate}
                      isAuthenticated={user.isAuthenticated}
                      handleLogout={handleLogout} user={profile}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth/user/login")}
              className="text-xs flex gap-2 items-center sm:text-sm rounded-full py-2 px-4 sm:px-6 sm:py-3 tracking-wide text-white bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C] transition-all duration-200 shadow-sm"
            >
              Login <LogIn className="size-4" />
            </button>
          )}
        </div>

        {/* ── Row 2: Type Tabs + Location pill ─────────────────────── */}
        <div className="flex items-end justify-between mt-1">
          {/* Tabs */}
          <div className="flex relative h-14 hide-scrollbar overflow-x-auto scrollbar-hide flex-1">
            <div className="flex h-full">
              {TABS.map(({ val, label, icon }) => (
                <button
                  key={val}
                  onClick={() => updateFilter("type", val)}
                  className="relative cursor-pointer h-full hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className={`flex items-center px-[18px] md:px-10 lg:px-16 gap-1.5 w-full h-full whitespace-nowrap transition-all ${
                    filters.type === val ? "text-[#0A6C6D] font-bold" : "text-gray-500 hover:text-[#0A6C6D] font-medium"
                  }`}>
                    {icon && (
                      <figure className="w-3 h-3 flex items-center shrink-0">
                        {icon(filters.type === val)}
                      </figure>
                    )}
                    {label}
                  </div>
                  <div className={`h-1 w-full absolute bottom-0 z-30 rounded bg-[#0A6C6D] transition-opacity ${
                    filters.type === val ? "opacity-100" : "opacity-0"
                  }`} />
                </button>
              ))}
            </div>
            <div className="w-full absolute rounded bottom-0 bg-gray-100 h-1" />
          </div>

          {/* Location pill — shows detected city */}
          <div className="hidden sm:flex shrink-0 pb-2 ml-4">
            <LocationPill {...locationState} />
          </div>
        </div>
      </div>
    </div>
  );
};