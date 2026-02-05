import { Filter2 } from "@/components/dashboard/ui/svg";
import Footer from "@/components/Footer";
import UserHeader from "@/components/layout/headers/user-header";
import { SearchSectionTwo } from "@/components/SearchSection";
import TableGrid, {
  TableGridThree,
  TableGridTwo,
} from "@/components/Tablegrid";
import Header from "@/components/user/Header";
import {
  cuisineColorPalette,
  getImagesForVenue,
  hasMultipleImages,
  useCarouselLogic,
} from "@/hooks/favorites";
import { SvgIcon, SvgIcon2, SvgIcon3 } from "@/public/icons/icons";
import { restaurantService } from "@/services/rest.services";
import { set } from "date-fns";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FiHeart, FiMapPin } from "react-icons/fi";

const LoadingFallback = () => (
  <div className="min-h-screen mt-[100px] bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    </div>
  </div>
);

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchSectionRef = useRef(null);

  const { currentIndices, handleMouseEnter, handleMouseLeave, handleDotClick } =
    useCarouselLogic();
  const initialSearchDone = useRef(false);
  const normalizeTab = (tab) => (typeof tab === "object" ? tab.value : tab);

  // Function to get current results based on active tab
  const getCurrentResults = () => {
    switch (activeTab) {
      case "restaurants":
        return restaurants;
      case "hotels":
        return hotels;
      case "clubs":
        return clubs;
      default:
        return [];
    }
  };

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

  const getCategories = (venue) => {
    if (activeTab === "restaurants" || activeTab === "hotels") {
      return venue.services || venue.cuisines || [];
    }
    return venue.categories || [];
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "restaurants":
        return "Reserve Table";
      case "clubs":
        return "Book now";
      case "hotels":
        return "Book now";
      default:
        return "View details";
    }
  };

  // Function to handle search
  const handleSearch = useCallback(
    async (searchData) => {
      let query, tab;

      if (typeof searchData === "string") {
        query = searchData;
        tab = activeTab;
      } else if (typeof searchData === "object") {
        query = searchData.query || searchData.search || "";
        tab = searchData.tab || searchData.type || activeTab;
      } else {
        query = "";
        tab = activeTab;
      }

      if (!query) {
        console.log("No query provided, skipping search");
        return;
      }

      setLoading(true);
      console.log("Performing search with:", { query, tab });

      try {
        const response = await restaurantService.searchRestaurants({
          search: query,
          type: tab,
        });

        switch (tab) {
          case "restaurants":
            setRestaurants(response.data || []);
            break;
          case "hotels":
            setHotels(response.data || []);
            break;
          case "clubs":
            setClubs(response.data || []);
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("Search error:", err);
        switch (tab) {
          case "restaurants":
            setRestaurants([]);
            break;
          case "hotels":
            setHotels([]);
            break;
          case "clubs":
            setClubs([]);
            break;
          default:
            break;
        }
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  );

  // Load stored search data on mount
  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem("searchData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSearchData(parsed);
        setSearchQuery(parsed.query || parsed.search || "");
        setActiveTab(normalizeTab(parsed.tab || parsed.type) || "restaurants");

        if ((parsed.query || parsed.search) && !initialSearchDone.current) {
          initialSearchDone.current = true;
          handleSearch(parsed);
        }
      } catch (error) {
        console.error("Error parsing search data:", error);
      }
    }
  }, [handleSearch]);

  // Handle new search from search bar
  const handleNewSearch = useCallback(
    (newSearchData) => {
      const query = newSearchData.query || newSearchData.search || "";
      const tab = newSearchData.tab || activeTab;

      setSearchQuery(query);
      setActiveTab(normalizeTab(tab));

      const updatedSearchData = {
        query: query,
        tab: tab,
        search: query,
        type: tab,
        date: newSearchData.date,
        time: newSearchData.time,
        guests: newSearchData.guests,
        timestamp: new Date().toISOString(),
      };

      setSearchData(updatedSearchData);
      localStorage.setItem("searchData", JSON.stringify(updatedSearchData));

      if (query) {
        handleSearch(updatedSearchData);
      }
    },
    [activeTab, handleSearch],
  );

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(normalizeTab(tab));

    const updatedSearchData = {
      ...searchData,
      tab: tab,
      query: searchQuery || "",
      timestamp: new Date().toISOString(),
    };

    setSearchData(updatedSearchData);
    localStorage.setItem("searchData", JSON.stringify(updatedSearchData));

    if (searchQuery) {
      handleSearch(updatedSearchData);
    }
  };

  // Update localStorage when tab changes
  useEffect(() => {
    if (mounted && searchData) {
      const updatedSearchData = {
        ...searchData,
        tab: activeTab,
      };
      localStorage.setItem("searchData", JSON.stringify(updatedSearchData));
    }
  }, [activeTab, mounted, searchData]);

  const currentResults = getCurrentResults();
  const safeActiveTab =
    typeof activeTab === "string" ? activeTab : activeTab?.value;

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen mt-[90px] bg-gray-50">
      <UserHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Tabs */}
        <div className="hidden sm:block mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const count =
                  tab.value === "restaurants"
                    ? restaurants.length
                    : tab.value === "hotels"
                      ? hotels.length
                      : clubs.length;

                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.value
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                    <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Search Section - Added ref and wrapper for mobile fixes */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:hidden mb-4 ">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[36px] gap-1.5 sm:gap-2.5 cursor-pointer text-[12px] sm:text-sm flex items-center font-medium transition-colors duration-200 ${
                  activeTab === tab.value
                    ? "bg-[#0A6C6D] text-gray-50"
                    : "bg-transparent text-gray-900 hover:bg-white/40"
                }`}
                onClick={() => handleTabChange(tab.value)}
              >
                <figure className="w-4 h-4 sm:w-5 sm:h-5 flex items-center">
                  <Icon isActive={activeTab !== tab.value} />
                </figure>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
        <div className="mb-8 relative" ref={searchSectionRef}>
          <SearchSectionTwo
            onSearch={handleNewSearch}
            searchData={{ ...searchData, tab: safeActiveTab }}
            activeTab={safeActiveTab}
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h1 className="text-2xl px-4 sm:px-6 lg:px-8 font-bold mb-6">
            {searchQuery
              ? `${currentResults.length} ${(safeActiveTab || "").slice(
                  0,
                  -1,
                )}${
                  currentResults.length !== 1 ? "s" : ""
                } found for "${searchQuery}"`
              : `Search for ${safeActiveTab}`}
          </h1>

          <div className="md:hidden">
            <div className="flex items-center justify-end">
              <button
                onClick={() => setIsOpen(true)}
                className="border rounded-lg py-2 px-4 items-center gap-2 flex bg-white "
              >
                <Filter2 /> Filter
              </button>
            </div>
            {isOpen && (
              <div className={`fixed inset-0 bg-white z-100`}>
                <div className="flex items-center justify-end">
                  <button
                    className="rounded-full p-2 border m-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <X />
                  </button>
                </div>
                <h2 className="text-lg font-semibold px-4">Filter Options</h2>
                <div className="px-4">
                  <Filter />
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                Searching {safeActiveTab}...
              </span>
            </div>
          )}

          {!loading && currentResults.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No {(safeActiveTab || "").slice(0, -1)}
                {currentResults.length !== 1 ? "s" : ""} found for "
                {searchQuery}"
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!loading && !searchQuery && currentResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Enter a search query to find {safeActiveTab}
              </p>
            </div>
          )}

          {!loading && currentResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
              {currentResults.map((venue) => {
                const images = getImagesForVenue(venue);
                const venueId = venue._id;
                const currentIndex = currentIndices[venueId] || 0;
                const multipleImages = hasMultipleImages(venue);
                const categories = getCategories(venue);

                return (
                  <div
                    key={venueId}
                    className="cursor-pointer pb-4 flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px-rgba(0,0,0,0.08)] transition-all duration-300"
                    onMouseEnter={() =>
                      handleMouseEnter(
                        venueId,
                        venue,
                        getImagesForVenue,
                        hasMultipleImages,
                      )
                    }
                    onMouseLeave={() => handleMouseLeave(venueId)}
                  >
                    {/* Image Section */}
                    <div className="relative h-40 sm:h-44 w-full cursor-pointer aspect-video">
                      <div className="relative h-full w-full overflow-hidden rounded-t-lg sm:rounded-t-xl bg-gray-100">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${venue.businessName} - Image ${index + 1}`}
                            className={`absolute size-full object-cover transition-all duration-500 ease-in-out ${
                              index === currentIndex
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-105"
                            }`}
                            style={{
                              transform:
                                index === currentIndex
                                  ? "translateX(0) scale(1)"
                                  : "translateX(100%) scale(1.05)",
                            }}
                          />
                        ))}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Badge/Offer */}
                      {(venue.badge || venue.offer) && (
                        <span className="absolute top-2 left-4 bg-yellow-500/95 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white whitespace-nowrap">
                          {venue.badge || venue.offer}
                        </span>
                      )}

                      {/* Heart Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Toggle favorite:", venueId);
                        }}
                        className="absolute top-2 right-4 text-white cursor-pointer text-base sm:text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md"
                      >
                        <FiHeart className="fill-transparent text-white hover:fill-red-500 hover:text-red-500" />
                      </button>

                      {/* Image Dots */}
                      {multipleImages && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => handleDotClick(venueId, index, e)}
                              className={`block rounded-full transition-all duration-300 ease-out cursor-pointer focus:outline-none ${
                                index === currentIndex
                                  ? "bg-white scale-125 w-4 sm:w-6 h-1.5 sm:h-2 shadow-md"
                                  : "bg-white/70 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-white/90"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="pt-3 px-2 sm:px-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex w-full justify-between">
                          <h3 className="text-base sm:text-lg font-semibold capitalize text-gray-900 leading-tight line-clamp-1">
                            {venue.businessName}
                          </h3>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-500 mr-1 text-sm sm:text-base" />
                            <span className="text-sm font-semibold text-gray-900">
                              {venue.rating?.toFixed(1) || "4.5"}
                            </span>
                          </div>
                        </div>

                        {/* Categories/Services */}
                        {categories.length > 0 && (
                          <div className="inline-flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                            {categories.slice(0, 2).map((category, index) => {
                              const classes =
                                cuisineColorPalette[
                                  index % cuisineColorPalette.length
                                ];
                              return (
                                <div
                                  key={index}
                                  className={`px-3 py-2 rounded-full ${classes} text-xs text-zinc-600 font-medium leading-none whitespace-nowrap`}
                                >
                                  {category}
                                </div>
                              );
                            })}

                            {categories.length > 2 && (
                              <div className="px-2 py-1 rounded-sm bg-gray-100 outline-1 outline-gray-200 text-xs text-gray-500 font-medium leading-none">
                                +{categories.length - 2}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Address */}
                        <div className="flex mt-4 items-center gap-1 sm:text-sm text-xs text-gray-500">
                          <FiMapPin />
                          <p className="line-clamp-1">
                            <span>
                              {venue.address || "Address not available"}
                            </span>
                          </p>
                        </div>

                        {/* Price Range for Clubs/Hotels */}
                        {(activeTab === "clubs" || activeTab === "hotels") &&
                          venue.priceRange && (
                            <div className="flex justify-start text-xl mt-4 text-black items-center gap-1">
                              {activeTab === "clubs" && (
                                <div className="text-zinc-00 text-sm font-bold leading-none">
                                  Table from
                                </div>
                              )}
                              <div className="text-sm font-bold leading-none">
                                ₦{venue.priceRange}
                              </div>
                              {activeTab === "hotels" && (
                                <div className="text-zinc-00 text-xs font-normal leading-none">
                                  /night
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 w-full flex justify-center items-center">
                        <button
                          onClick={() =>
                            console.log(
                              `Navigate to: /${safeActiveTab}/${venueId}`,
                            )
                          }
                          className="w-full text-sm font-semibold rounded-full px-3 py-3 tracking-wide text-white cursor-pointer bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C] transition-all duration-200 shadow-sm"
                        >
                          {getButtonText()}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {safeActiveTab === "restaurants" && (
            <div className="mt-36 sm:mt-[65px] mx-a px- py-8">
              <TableGrid title="Popular Searches" />
            </div>
          )}
          {safeActiveTab === "hotels" && (
            <div className="mx-a px- py-8">
              <TableGridTwo title="Popular Searches" />
            </div>
          )}
          {safeActiveTab === "clubs" && (
            <div className="mt-36 sm:mt-[65px] mx-a px- py-8">
              <TableGridThree title="Popular Clubs" />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Filter = () => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-gray-700">Price</h4>
        <ul className="space-y-2">
          {["$", "$$", "$$$", "$$$$"].map((priceLevel) => (
            <li key={priceLevel}>
              <label
                htmlFor={priceLevel}
                className="flex items-center cursor-pointer"
              >
                <input name="price" id={priceLevel} type="radio" />
                <span className="ml-2 text-gray-600">{priceLevel}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchPage;
