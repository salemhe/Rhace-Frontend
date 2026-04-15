import Footer from "@/components/Footer";
import UserHeader from "@/components/layout/headers/user-header";
import SearchSection from "@/components/SearchSection";
import { useEffect, useRef, useState } from "react";
import Club from "../../public/images/find-club.png";
import Hotel from "../../public/images/find-hotel.jpg";
import Restaurant from "../../public/images/find.png";
import { SvgIcon, SvgIcon2, SvgIcon3 } from "@/public/icons/icons";

function DiscoverPage() {
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
      <div className="relative min-h-[260px] sm:min-h-[240px]">
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
        <div className="relative max-w-7xl mx-auto px-4 min-h-[220px] sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col justify-center items-center text-center">

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
          <div className="relative w-full mt-4 sm:mt-5 lg:mt-6 px-1  sm:px-0 z-50">
            <SearchSection activeTab={activeTab} onSearch={() => {}} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DiscoverPage;