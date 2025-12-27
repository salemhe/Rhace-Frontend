import { useEffect, useRef, useState } from "react";
import { MapPin, Flame, Star, Bell, Clock, Search } from "lucide-react";
import { restaurantService } from "@/services/rest.services";

export const SearchAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter Restaurant or Cuisine",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const suggestionCategories = {
    nearby: {
      title: "Nearby ",
      icon: <MapPin className="w-4 h-4" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    popular: {
      title: "Popular ",
      icon: <Flame className="w-4 h-4" />,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    topRated: {
      title: "Top-Rated ",
      icon: <Star className="w-4 h-4" />,
      iconBgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    trending: {
      title: "Trending Now",
      icon: <Bell className="w-4 h-4" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    recentlyViewed: {
      title: "Recently Viewed",
      icon: <Clock className="w-4 h-4" />,
      iconBgColor: "bg-gray-50",
      iconColor: "text-gray-600",
    },
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const location = localStorage.getItem("userLocation");
        const loc = JSON.parse(location);
        console.log("User location from localStorage:", loc);
        const res = await restaurantService.getSuggestions({
          lat: loc.lat,
          lng: loc.lng,
        });
        console.log("Full API response:", res);

        // Safely extract the correct layer
        const fetched = res?.data?.data || res?.data || {};
        setSuggestions(fetched);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchSuggestions();
  }, [isOpen]);

  console.log(suggestions);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // const handleRestaurantClick = (restaurant) => {
  //   const displayValue = `${restaurant.name}${restaurant.location ? ` - ${restaurant.location}` : ""}`;
  //   onChange(displayValue);
  //   setIsOpen(false);
  //   if (onSelect) {
  //     onSelect(restaurant);
  //   }
  // };

  const handleRestaurantClick = (restaurant) => {
    const displayValue = `${restaurant.businessName}`; // ✅ Changed from 'name' to 'businessName'
    onChange(displayValue);
    setIsOpen(false);
    if (onSelect) {
      onSelect(restaurant);
    }
  };

  // ✅ Use suggestions directly, no reduce needed
  const groupedSuggestions = suggestions || {};

  // ✅ Calculate total count
  const totalCount = Object.values(groupedSuggestions).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0
  );
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base mt-1"
      />

      {isOpen && (
        <div className="absolute top-full w-[22rem] left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl z-[100] max-h-[420px] overflow-y-auto border border-gray-100">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">
                Loading suggestions...
              </p>
            </div>
          ) : totalCount === 0 ? ( // ✅ Check total count
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {value ? "No restaurants found" : "Start typing to search"}
              </p>
            </div>
          ) : (
            <div className="p-3">
              <h3 className="text-base font-semibold text-left text-gray-900 mb-3 px-2">
                Suggestions
              </h3>

              {Object.entries(groupedSuggestions).map(
                ([category, restaurants]) => {
                  // ✅ Skip empty categories
                  if (!Array.isArray(restaurants) || restaurants.length === 0)
                    return null;

                  const categoryConfig =
                    suggestionCategories[category] ||
                    suggestionCategories.nearby;

                  return (
                    <div key={category} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${categoryConfig.iconBgColor} flex items-center justify-center ${categoryConfig.iconColor}`}
                        >
                          {categoryConfig.icon}
                        </div>
                        <h4 className="text-sm font-medium text-gray-700">
                          {categoryConfig.title}
                        </h4>
                      </div>

                      <div className="space-y-0.5">
                        {restaurants.map((restaurant) => (
                          <button
                            key={restaurant._id} // ✅ Changed from 'id' to '_id'
                            onClick={() => handleRestaurantClick(restaurant)}
                            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                                  {restaurant.businessName}{" "}
                                  {/* ✅ Changed from 'name' */}
                                </span>
                                {restaurant.location && (
                                  <span className="text-sm text-gray-500 ml-1">
                                    • {restaurant.location}
                                  </span>
                                )}
                              </div>
                              <svg
                                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
