import Footer from "@/components/Footer";
import UserHeader from "@/components/layout/headers/user-header";
import SearchSection from "@/components/SearchSection";
import TableGrid, { TableGridFour, TableGridThree, TableGridTwo } from "@/components/Tablegrid";
import { useEffect, useState } from "react";
import Restaurant from "../../public/images/find.png";
import Hotel from "../../public/images/find-hotel.jpg";
import Club from "../../public/images/find-club.png";
import LocationModal from "@/components/LocationModal";

function ReservationHomePage() {
  const [mounted, setMounted] = useState(false);
  // console.log(setMounted(true));

  useEffect(() => {
    setMounted(true);
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab && ["restaurants", "hotels", "clubs"].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);


  const [activeTab, setActiveTab] = useState("restaurants");
  const SvgIcon = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
      <path
        fill={isActive ? "#111827" : "#ffffff"}
        fillRule="evenodd"
        d="M5.5 1.333A.833.833 0 0 1 6.333.5h3.334a.833.833 0 0 1 0 1.667h-.834v.862c4.534.409 7.509 5.11 5.775 9.447a.83.83 0 0 1-.775.524H2.167a.83.83 0 0 1-.774-.524c-1.735-4.337 1.24-9.038 5.774-9.447v-.862h-.834a.833.833 0 0 1-.833-.834m2.308 3.334c-3.521 0-5.986 3.377-5.047 6.666h10.478c.94-3.289-1.526-6.666-5.047-6.666zm-7.308 10a.833.833 0 0 1 .833-.834h13.334a.833.833 0 0 1 0 1.667H1.333a.833.833 0 0 1-.833-.833"
        clipRule="evenodd"
      />
    </svg>
  );

  const SvgIcon2 = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path
        fill={isActive ? "#111827" : "#ffffff"}
        fillRule="evenodd"
        d="M7.96.83a1.67 1.67 0 0 0-1.384.153l-3.433 2.06a1.67 1.67 0 0 0-.81 1.429v11.195H1.5a.833.833 0 0 0 0 1.666h15a.833.833 0 1 0 0-1.666h-.833V4.6a1.67 1.67 0 0 0-1.14-1.58zM14 15.668V4.6L8.167 2.657v13.01zM6.5 2.972 4 4.472v11.195h2.5z"
        clipRule="evenodd"
      />
    </svg>
  );

  const SvgIcon3 = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
      <path
        fill={isActive ? "#111827" : "#ffffff"}
        fillRule="evenodd"
        d="M11.1666 0.666992C11.8296 0.666992 12.4655 0.930384 12.9344 1.39923C13.4032 1.86807 13.6666 2.50395 13.6666 3.16699V14.8337C13.6666 15.4967 13.4032 16.1326 12.9344 16.6014C12.4655 17.0703 11.8296 17.3337 11.1666 17.3337H2.83325C2.17021 17.3337 1.53433 17.0703 1.06549 16.6014C0.596644 16.1326 0.333252 15.4967 0.333252 14.8337V3.16699C0.333252 2.50395 0.596644 1.86807 1.06549 1.39923C1.53433 0.930384 2.17021 0.666992 2.83325 0.666992H11.1666ZM11.1666 2.33366H2.83325C2.61224 2.33366 2.40028 2.42146 2.244 2.57774C2.08772 2.73402 1.99992 2.94598 1.99992 3.16699V14.8337C1.99992 15.0547 2.08772 15.2666 2.244 15.4229C2.40028 15.5792 2.61224 15.667 2.83325 15.667H11.1666C11.3876 15.667 11.5996 15.5792 11.7558 15.4229C11.9121 15.2666 11.9999 15.0547 11.9999 14.8337V3.16699C11.9999 2.94598 11.9121 2.73402 11.7558 2.57774C11.5996 2.42146 11.3876 2.33366 11.1666 2.33366ZM6.99992 7.33366C7.88397 7.33366 8.73182 7.68485 9.35694 8.30997C9.98206 8.93509 10.3333 9.78294 10.3333 10.667C10.3333 11.551 9.98206 12.3989 9.35694 13.024C8.73182 13.6491 7.88397 14.0003 6.99992 14.0003C6.11586 14.0003 5.26802 13.6491 4.6429 13.024C4.01777 12.3989 3.66659 11.551 3.66659 10.667C3.66659 9.78294 4.01777 8.93509 4.6429 8.30997C5.26802 7.68485 6.11586 7.33366 6.99992 7.33366ZM6.99992 9.00033C6.55789 9.00033 6.13397 9.17592 5.82141 9.48848C5.50885 9.80104 5.33325 10.225 5.33325 10.667C5.33325 11.109 5.50885 11.5329 5.82141 11.8455C6.13397 12.1581 6.55789 12.3337 6.99992 12.3337C7.44195 12.3337 7.86587 12.1581 8.17843 11.8455C8.49099 11.5329 8.66658 11.109 8.66658 10.667C8.66658 10.225 8.49099 9.80104 8.17843 9.48848C7.86587 9.17592 7.44195 9.00033 6.99992 9.00033ZM6.99992 4.00033C7.33144 4.00033 7.64938 4.13202 7.8838 4.36644C8.11822 4.60086 8.24992 4.9188 8.24992 5.25033C8.24992 5.58185 8.11822 5.89979 7.8838 6.13421C7.64938 6.36863 7.33144 6.50033 6.99992 6.50033C6.6684 6.50033 6.35046 6.36863 6.11603 6.13421C5.88161 5.89979 5.74992 5.58185 5.74992 5.25033C5.74992 4.9188 5.88161 4.60086 6.11603 4.36644C6.35046 4.13202 6.6684 4.00033 6.99992 4.00033Z"
        clipRule="evenodd"
      />
    </svg>
  );

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
  }
  return (
    <div
      className="max-h-[500px] h-[500px]"
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
                Discover and reserve the best restaurants in your city
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
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-1 sm:mt-4 mb-2 sm:mb-[-40px]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[36px] gap-1.5 sm:gap-2.5 cursor-pointer text-[12px] sm:text-sm flex items-center font-medium transition-colors duration-200 ${activeTab === tab.value
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
          <div className="relative w-full mt-4 sm:mt-5 lg:mt-6 px-1  sm:px-0 z-[20]">
            <SearchSection activeTab={activeTab} onSearch={() => { }} />
          </div>


        </div>
      </div>

      {activeTab === "restaurants" && (
        <div className=" mt-36 sm:mt-[65px] mx-auto lg:px-8 py-8">
          <TableGrid title="Popular Restaurants" />
          <TableGrid title="Top-Rated Restaurants" type="top-rate" />
          <TableGrid title="Nearby Restaurants" type="nearby" />
          <TableGridFour title="Offers" type="offers" />
        </div>

      )}
      {activeTab === "hotels" && (
        <div className=" mt-36 sm:mt-[65px] mx-auto lg:px-8 py-8">
          <TableGridTwo title="Popular Hotels" />
          <TableGridTwo title="Top-Rated Hotels" type="top-rate" />
          <TableGridTwo title="Nearby Hotels" type="nearby" />
        </div>
      )}
      {activeTab === "clubs" && (
        <div className=" mt-36 sm:mt-[65px] mx-auto lg:px-8 py-8">
          <TableGridThree title="Popular Clubs" />
          <TableGridThree title="Top-Rated Clubs" type="top-rate" />
          <TableGridThree title="Nearby Clubs" type="nearby" />
        </div>
      )}

      <Footer />
      <LocationModal />
    </div>
  );
}

export default ReservationHomePage;
