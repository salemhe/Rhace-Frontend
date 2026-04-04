import Footer from "@/components/Footer";
import UserHeader, {
  UserProfileMenu,
} from "@/components/layout/headers/user-header";
import SearchSection from "@/components/SearchSection";
import TableGrid, {
  TableGridFour,
  TableGridThree,
  TableGridTwo,
} from "@/components/Tablegrid";
import { useEffect, useRef, useState } from "react";
import Club from "../../public/images/find-club.png";
import Hotel from "../../public/images/find-hotel.jpg";
import Restaurant from "../../public/images/find.png";
// import LocationModal from "@/components/LocationModal";
import { SvgIcon, SvgIcon2, SvgIcon3 } from "@/public/icons/icons";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Home,
  Search,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";

function ReservationHomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    setMounted(true);
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab && ["restaurants", "hotels", "clubs"].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  const tabs = [
    {
      name: "Restaurants",
      value: "restaurants",
      icon: SvgIcon,
    },
    {
      name: "Hotels",
      value: "hotels",
      icon: SvgIcon2,
    },
    {
      name: "Clubs",
      value: "clubs",
      icon: SvgIcon3,
    },
  ];
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (mounted) {
      localStorage.setItem("activeTab", tab);
    }
  };
  return (
    <div
    // className="min-h-[500px] h-[500px]"
    >
      <UserHeader />
      <div className="relative min-h-[400px] sm:min-h-[400px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-br-[20px] rounded-bl-[20px]"
          style={{
            backgroundImage:
              activeTab === "restaurants"
                ? ` url(${Restaurant})`
                : activeTab === "hotels"
                  ? ` url(${Hotel})`
                  : `url(${Club})`,
          }}
        />
        <div className="absolute inset-0 bg-black/50 rounded-br-[20px] rounded-bl-[20px]" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 min-h-[420px] sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col justify-center items-center text-center">
          {/* Headings */}
          {activeTab === "restaurants" ? (
            <>
              <h1 className=" text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-1 leading-snug mt-4[40px] sm:mt-6 lg:mt-8">
                Find your Perfect Table
              </h1>
              <p className="text-xs font-normal sm:text-base md:text-xl text-white/90 mb-5 sm:mb-8 leading-relaxed">
                Discover and reserve the best restaurants in your citysss
              </p>
            </>
          ) : activeTab === "hotels" ? (
            <>
              <h1 className=" text-3xl  md:text-5xl font-bold text-white mb-2 sm:mb-4 leading-snug mt-[40px] sm:mt-6 lg:mt-8">
                Start Living Your Dream
              </h1>
              <p className="text-xs font-normal sm:text-base md:text-xl text-white/90 mb-5 sm:mb-8 leading-relaxed">
                Discover and reserve the best hotels in your city
              </p>
            </>
          ) : (
            <>
              <h1 className=" text-gray-50 font-bold leading-relaxed text-3xl md:text-5xl  sm:text-white mb-2 sm:mb-4 sm:leading-snug mt-[40px] sm:mt-6 lg:mt-8">
                Get Your Groove On
              </h1>
              <p className="text-xs sm:text-base font-normal md:text-xl text-white/90 mb-5 sm:mb-8 leading-relaxed">
                Discover and reserve the best clubs in your city
              </p>
            </>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-1 sm:mt-4 mb-2 sm:-mb-10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[36px] gap-1.5 sm:gap-2.5 cursor-pointer text-[12px] sm:text-sm flex items-center font-medium transition-colors duration-200 ${
                    activeTab === tab.value
                      ? "bg-slate-200 text-gray-900"
                      : "bg-transparent text-gray-50 hover:bg-white/10"
                  }`}
                  onClick={() => handleTabChange(tab.value)}
                >
                  <figure className="w-4 h-4 sm:w-5 sm:h-5 flex items-center">
                    <Icon isActive={activeTab === tab.value} />
                  </figure>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Section */}
          <div className="relative w-full mt-4 sm:mt-5 lg:mt-6 px-1  sm:px-0 z-20">
            <SearchSection activeTab={activeTab} onSearch={() => {}} />
          </div>
        </div>
      </div>

      {activeTab === "restaurants" && (
        <div className=" mt-16 sm:mt-[65px] mx-auto lg:px-8 py-8">
          {/* <TableGridFour title="Offers" type="offers" /> */}
          <TableGrid title="Popular Restaurants" />
          <TableGrid title="Top-Rated Restaurants" type="top-rate" />
          <TableGrid title="Nearby Restaurants" type="nearby" />
        </div>
      )}
      {activeTab === "hotels" && (
        <div className=" mt-16 sm:mt-[65px] mx-auto lg:px-8 py-8">
          <TableGridTwo title="Popular Hotels" />
          <TableGridTwo title="Top-Rated Hotels" type="top-rate" />
          <TableGridTwo title="Nearby Hotels" type="nearby" />
        </div>
      )}
      {activeTab === "clubs" && (
        <div className=" mt-16 sm:mt-[65px] mx-auto lg:px-8 py-8">
          <TableGridThree title="Popular Clubs" />
          <TableGridThree title="Top-Rated Clubs" type="top-rate" />
          <TableGridThree title="Nearby Clubs" type="nearby" />
        </div>
      )}

      <Footer />
      {/* <LocationModal /> */}
    </div>
  );
}

export default ReservationHomePage;