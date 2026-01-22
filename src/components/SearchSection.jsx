import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import { SearchAutocomplete } from "./AutoComplete";
import { DateDropdown } from "./DateDropdown";
import { GuestDropdown } from "./GuestDropdown";
import { TimeDropdown } from "./TimeDropdown";

const SearchSection = ({ activeTab, onSearch }) => {
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const location = localStorage.getItem("userLocation") || "";
    const searchData = {
      query: searchQuery,
      tab: activeTab,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      time: time || undefined,
      guests: totalGuests.toString(),
      timestamp: new Date().toISOString(),
      location: location ? JSON.parse(location) : undefined,
    };

    // Store in localStorage
    localStorage.setItem("searchData", JSON.stringify(searchData));

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(searchData);
    }

    // Navigate to search page
    navigate(`/search`);
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="bg-white z-50 absolute top-6 sm:top-15 w-[100%] sm:w-[100%] mx-auto left-0 right-0 rounded-2xl lg:rounded-full p-4 pb-0 sm:p-2 justify-center mb-8 shadow-[0px_34px_10px_0px_rgba(122,122,122,0.00)] outline-2 outline-gray-200"
    >
      <div className="grid gap-  sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* Row 1: Restaurant/Cuisine */}
        <div className="flex flex-col  border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 lg:px-3 col-span-1 sm:col-span-2 lg:col-span-1">
          <label className="text-xs text-text-secondary text-left mb-1">
            {activeTab === "restaurants"
              ? "Restaurant/Cuisine"
              : activeTab === "hotels"
                ? "Hotels"
                : "Clubs"}
          </label>
          {/* <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "restaurants"
                ? "Enter Restaurant or Cuisine"
                : activeTab === "hotels"
                  ? "Enter Hotels"
                  : activeTab === "clubs"
                    ? "Enter Clubs"
                    : ""
            }
            className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
          /> */}
          <SearchAutocomplete
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={
              activeTab === "restaurants"
                ? "Enter Restaurant or Cuisine"
                : activeTab === "hotels"
                  ? "Enter Hotels"
                  : activeTab === "clubs"
                    ? "Enter Clubs"
                    : ""
            }
          />
        </div>

        {/* Row 2: Date + Time */}
        <div className="grid grid-cols-2  gap- col-span-1 sm:col-span-2 lg:col-span-2">
          {/* Date */}
          <div className="flex flex-col justify-center pt-2 sm:pt-0 border-b sm:border-b-0 border-r border-gray-200 pb-2 sm:pb-0 pr-1 sm:pr-4">
            <label className="text-xs text-text-secondary text-left mb-1">
              Date
            </label>
            <DateDropdown selectedDate={date} onChange={(d) => setDate(d)} />
          </div>

          {/* Time */}
          <div className="flex flex-col justify-center pt-2 sm:pt-0 border-b sm:border-b-0 lg:border-r border-gray-200 pb-2 sm:pb-0 sm:pr-4">
            <label className="text-xs text-text-secondary text-left pl-2 mb-1">
              Time
            </label>
            <TimeDropdown selectedTime={time} slots={activeTab === "restaurants"
              ? ['09:00 AM', '09:30 AM',
                '10:00 AM', '10:30 AM',
                '11:00 AM', '11:30 AM',
                '12:00 PM', '12:30 PM',
                '01:00 PM', '01:30 PM',
                '02:00 PM', '02:30 PM',
                '03:00 PM', '03:30 PM',
                '04:00 PM', '04:30 PM',
                '05:00 PM', '05:30 PM',
                '06:00 PM', '06:30 PM',
                '07:00 PM', '07:30 PM',
                '08:00 PM', '08:30 PM',]
              : activeTab === "hotels"
                ? ['09:00 AM', '09:30 AM', '10:00 AM', '11:30 AM',
                  '01:00 PM', '02:00 PM', '04:00 PM', '04:30 PM',
                  '05:00 PM', '06:00 PM', '06:30 PM', '07:30 PM',
                  '08:00 PM', '09:00 PM',]
                : activeTab === "clubs"
                && ['09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM']} onChange={setTime} />
          </div>
        </div>

        {/* Row 3: Guests + Search button */}
        <div className="grid grid-cols-2 gap- col-span-1 sm:col-span-2 lg:col-span-2">
          {/* Guests */}
          <div className="flex flex-col justify-center pt-2 sm:pt-0 border-b sm:border-b-0 border-r border-gray-200 pb-2 sm:pb-0 sm:pr-4">
            <label className="text-xs text-text-secondary text-left mb-1">
              Guests
            </label>
            <GuestDropdown onChange={(counts) => setGuests(counts)} />
          </div>

          {/* Search button */}
          <div className="flex items-center justify-center ml-2 sm:ml-0 sm:justify-end w-full">
            <button
              type="submit"
              className={`flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-3 transition w-full sm:w-auto justify-center ${activeTab === "restaurants"
                ? "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]"
                : "bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600"
                }`}
            >
              <FiSearch className="w-5 h-5" />
              <span className="text-sm sm:text-base">Search</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchSection;

export const SearchSectionTwo = ({ onSearch, searchData, activeTab }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchInputRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (searchData) {
      if (searchData.query) setSearchQuery(searchData.query);
      if (searchData.date) setDate(new Date(searchData.date));
      if (searchData.time) setTime(searchData.time);
      if (searchData.guests) {
        const guestsNum = parseInt(searchData.guests, 10);
        setGuests({ adults: guestsNum || 2, children: 0, infants: 0 });
      }
    } else {
      const stored = localStorage.getItem("searchData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.query) setSearchQuery(parsed.query);
          if (parsed.date) setDate(new Date(parsed.date));
          if (parsed.time) setTime(parsed.time);
          if (parsed.guests) {
            const guestsNum = parseInt(parsed.guests, 10);
            setGuests({ adults: guestsNum || 2, children: 0, infants: 0 });
          }
        } catch {
          console.error("Failed to parse searchData");
        }
      }
    }
  }, [searchData]);

  // Focus input when expanded on mobile
  useEffect(() => {
    if (isExpanded && isMobile && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isExpanded, isMobile]);

  // Close expanded view when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isExpanded &&
        isMobile &&
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded, isMobile]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const newSearchData = {
      query: searchQuery,
      tab: activeTab || "restaurants",
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      time: time || undefined,
      guests: totalGuests.toString(),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("searchData", JSON.stringify(newSearchData));

    if (onSearch) {
      onSearch(newSearchData);
    } else {
      navigate(`/search`);
    }

    // Collapse on mobile after search
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "restaurants":
        return "Search restaurants or cuisines";
      case "hotels":
        return "Search hotels";
      case "clubs":
        return "Search clubs";
      default:
        return "Search...";
    }
  };

  const handleMobileInputFocus = () => {
    if (isMobile && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleMobileInputChange = (value) => {
    setSearchQuery(value);
    if (isMobile && !isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSearchSubmit}
      className="mx-auto w-full max-w-3xl"
    >
      {/* Desktop Search Bar */}
      <div className="hidden sm:block relative">
        <div className="h-16 bg-white rounded-full justify-between shadow-lg flex items-center px-2 sm:px-4 gap-2 sm:gap-0">
          {/* Search Input */}
          <div className="flex flex-col flex-1 justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              {activeTab === "restaurants"
                ? "Restaurant/Cuisine"
                : activeTab === "hotels"
                ? "Hotels"
                : "Clubs"}
            </label>
            <div className="relative">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={
                  activeTab === "restaurants"
                    ? "Enter Restaurant or Cuisine"
                    : activeTab === "hotels"
                    ? "Enter Hotels"
                    : activeTab === "clubs"
                    ? "Enter Clubs"
                    : ""
                }
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* Date */}
          {/* <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Date
            </label>
            <DateDropdown selectedDate={date} onChange={(d) => setDate(d)} />
          </div> */}

          {/* Time */}
          {/* <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Time
            </label>
            <TimeDropdown selectedTime={time} onChange={(t) => setTime(t)} />
          </div> */}

          {/* Guests */}
          {/* <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Guests
            </label>
            <GuestDropdown onChange={(counts) => setGuests(counts)} />
          </div> */}

          {/* Search Button */}
          <div className="flex items-center justify-center pl-2 pr-1">
            <button
              type="submit"
              className="flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-2 transition bg-gradient-to-r from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 focus:outline-none shadow-md"
            >
              <FiSearch className="w-5 h-5" />
              <span className="text-sm sm:text-base">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden">
        {/* Collapsed View - Just Search Input */}
        {!isExpanded && (
          <div
            onClick={() => setIsExpanded(true)}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 cursor-pointer">
              <FiSearch className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleMobileInputChange(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm bg-transparent"
                  onFocus={handleMobileInputFocus}
                  readOnly={!isExpanded}
                  style={{
                    WebkitUserSelect: "text",
                    userSelect: "text",
                    touchAction: "manipulation",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expanded View - Full Form */}
        {isExpanded && (
          <div className="fixe  flex items-start justify-center ">
            <div className="bg-white rounded-2xl w-full  shadow-xl animate-in slide-in-from-bottom-5 duration-200">
              <div className="p-4">
                {/* Close Button */}
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex flex-col mb-4 pb-4 border-b border-gray-200">
                  <label className="text-xs text-text-secondary text-left mb-2">
                    {activeTab === "restaurants"
                      ? "Restaurant/Cuisine"
                      : activeTab === "hotels"
                      ? "Hotels"
                      : "Clubs"}
                  </label>
                  <div className="relative">
                    <SearchAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder={
                        activeTab === "restaurants"
                          ? "Enter Restaurant or Cuisine"
                          : activeTab === "hotels"
                          ? "Enter Hotels"
                          : activeTab === "clubs"
                          ? "Enter Clubs"
                          : ""
                      }
                      isMobile={isMobile}
                      autoFocus={isExpanded}
                    />
                  </div>
                </div>

                {/* Date and Time Row - Uncomment if needed */}
                {/* <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex flex-col">
                    <label className="text-xs text-text-secondary text-left mb-2">
                      Date
                    </label>
                    <DateDropdown
                      selectedDate={date}
                      onChange={(d) => setDate(d)}
                      isMobile={isMobile}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-text-secondary text-left mb-2">
                      Time
                    </label>
                    <TimeDropdown 
                      selectedTime={time} 
                      onChange={setTime}
                      isMobile={isMobile}
                    />
                  </div>
                </div> */}

                {/* Guests - Uncomment if needed */}
                {/* <div className="flex flex-col mb-6">
                  <label className="text-xs text-text-secondary text-left mb-2">
                    Guests
                  </label>
                  <GuestDropdown 
                    onChange={(counts) => setGuests(counts)}
                    isMobile={isMobile}
                  />
                </div> */}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 text-white rounded-xl transition font-medium"
                  >
                    <FiSearch className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
