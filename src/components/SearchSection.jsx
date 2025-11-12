import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import { SearchAutocomplete } from "./AutoComplete";
import { DateDropdown } from "./DateDropdown";
import { GuestDropdown } from "./GuestDropdown";
import { TimeDropdown } from "./TimeDropdown";

const SearchSection = ({ activeTab, onSearch }) => {
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const searchData = {
      query: searchQuery,
      tab: activeTab,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      time: time || undefined,
      guests: totalGuests.toString(),
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage
    localStorage.setItem('searchData', JSON.stringify(searchData));

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
      className="bg-white z-50 absolute top-6 sm:top-15 w-[100%] sm:w-[100%] mx-auto left-0 right-0 rounded-2xl sm:rounded-full p-4 pb-0 sm:p-2 justify-center mb-8 shadow-[0px_34px_10px_0px_rgba(122,122,122,0.00)] outline-2 outline-gray-200"
    >
      <div className="grid gap- sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* Row 1: Restaurant/Cuisine */}
        <div className="flex flex-col  border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 px-3 col-span-1 sm:col-span-2 lg:col-span-1">
          <label className="text-xs text-text-secondary text-left mb-1">
            {activeTab === "restaurants" ? "Restaurant/Cuisine" : activeTab === "hotels" ? "Hotels" : "Clubs"}
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
        <div className="grid grid-cols-2 gap- col-span-1 sm:col-span-2 lg:col-span-2">
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
            <TimeDropdown selectedTime={time} onChange={setTime} />
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

export const SearchSectionTwo = ({ onSearch, searchData }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Update state from searchData prop if provided
    if (searchData) {
      if (searchData.query) setSearchQuery(searchData.query);
      if (searchData.date) setDate(new Date(searchData.date));
      if (searchData.time) setTime(searchData.time);
      if (searchData.guests) {
        const guestsNum = parseInt(searchData.guests, 10);
        setGuests({ adults: guestsNum || 2, children: 0, infants: 0 });
      }
    } else {
      // On mount, load from localStorage if available
      const stored = localStorage.getItem('searchData');
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
          console.error('Failed to parse searchData from localStorage');
        }
      }
    }
  }, [searchData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const newSearchData = {
      query: searchQuery,
      tab: 'restaurants',
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      time: time || undefined,
      guests: totalGuests.toString(),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('searchData', JSON.stringify(newSearchData));

    if (onSearch) {
      onSearch(newSearchData);
    } else {
      navigate(`/search`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="mx-auto w-full max-w-3xl">
      {/* Desktop Search Bar */}
      <div className="hidden sm:block">
        <div className="h-16 bg-white rounded-full shadow-lg flex items-center px-2 sm:px-4 gap-2 sm:gap-0">
          {/* Restaurant/Cuisine */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4">
            <label className="text-xs text-text-secondary text-left mb-1">
              Restaurant/Cuisine
            </label>
            {/* <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Restaurant or Cuisine"
              className="w-full bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
            /> */}
            <SearchAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Enter Restaurant or Cuisine"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Date
            </label>
            <DateDropdown selectedDate={date} onChange={(d) => setDate(d)} />
          </div>

          {/* Time */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Time
            </label>
            <TimeDropdown selectedTime={time} onChange={(t) => setTime(t)} />
          </div>

          {/* Guests */}
          <div className="flex flex-col justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              Guests
            </label>
            <GuestDropdown onChange={(counts) => setGuests(counts)} />
          </div>

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
      <div
        onSubmit={handleSearchSubmit}
        className="sm:hidden bg-white z-50  w-[100%] sm:w-[100%] mx-auto left-0 right-0 rounded-2xl sm:rounded-full p-4 pb-0 sm:p-2 justify-center mb-8 shadow-[0px_34px_10px_0px_rgba(122,122,122,0.00)] outline-2 outline-gray-200"
      >
        <div className="grid gap- sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Row 1: Restaurant/Cuisine */}
          <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 px-3 col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="text-xs text-text-secondary text-left mb-1">
              {/* {activeTab === "restaurants" ? "Restaurant/Cuisine" : activeTab === "hotels" ? "Hotels" : "Clubs"} */}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={"Enter Restaurant or Cuisine"
                // activeTab === "restaurants"
                //   ? "Enter Restaurant or Cuisine"
                //   : activeTab === "hotels"
                //   ? "Enter Hotels"
                //   : activeTab === "clubs"
                //   ? "Enter Clubs"
                //   : ""
              }
              className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
            />
          </div>

          {/* Row 2: Date + Time */}
          <div className="grid grid-cols-2 gap- col-span-1 sm:col-span-2 lg:col-span-2">
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
              <TimeDropdown selectedTime={time} onChange={setTime} />
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
                className={`flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-3 transition w-full sm:w-auto justify-center  bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600
              `}
              >
                <FiSearch className="w-5 h-5" />
                <span className="text-sm sm:text-base">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};