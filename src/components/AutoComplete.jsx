import { useEffect, useRef, useState } from "react";
import { MapPin, Flame, Star, Bell, Clock } from "lucide-react";


export const SearchAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter Restaurant or Cuisine",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Mock data - replace with actual API call or Supabase query
  const suggestionGroups = [
    {
      title: "Nearby Restaurant",
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      iconBgColor: "bg-blue-100",
      restaurants: [
        { id: "1", name: "Aduke's place", location: "VI" },
        { id: "2", name: "Papa's Grill", location: "Lekki" },
      ],
    },
    {
      title: "Popular Restaurant",
      icon: <Flame className="w-5 h-5 text-red-500" />,
      iconBgColor: "bg-red-100",
      restaurants: [
        { id: "3", name: "Aduke's place", location: "VI" },
        { id: "4", name: "Papa's Grill", location: "Lekki" },
      ],
    },
    {
      title: "Top-Rated Restaurants",
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      iconBgColor: "bg-yellow-100",
      restaurants: [
        { id: "5", name: "Aduke's place", location: "VI" },
        { id: "6", name: "Papa's Grill", location: "Lekki" },
      ],
    },
    {
      title: "Trending Now",
      icon: <Bell className="w-5 h-5 text-purple-500" />,
      iconBgColor: "bg-purple-100",
      restaurants: [
        { id: "7", name: "Aduke's place", location: "VI" },
        { id: "8", name: "Papa's Grill", location: "Lekki" },
        { id: "9", name: "Papa's Grill", location: "Lekki" },
      ],
    },
    {
      title: "Recently Viewed",
      icon: <Clock className="w-5 h-5 text-gray-600" />,
      iconBgColor: "bg-gray-100",
      restaurants: [
        { id: "10", name: "Aduke's place", location: "VI" },
      ],
    },
  ];

  useEffect(() => {
    if (value.trim() === "") {
      setFilteredSuggestions(suggestionGroups);
    } else {
      const filtered = suggestionGroups
        .map((group) => ({
          ...group,
          restaurants: group.restaurants.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(value.toLowerCase())
          ),
        }))
        .filter((group) => group.restaurants.length > 0);
      setFilteredSuggestions(filtered);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleRestaurantClick = (restaurant) => {
    onChange(`${restaurant.name}${restaurant.location ? ` - ${restaurant.location}` : ""}`);
    setIsOpen(false);
    if (onSelect) {
      onSelect(restaurant);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left- w-64 right-1 mt-2 bg-white rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto w hide-scrollbar whitespace-nowrap border border-gray-100">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Suggested Restaurants
            </h3>

            {filteredSuggestions.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4 last:mb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${group.iconBgColor} flex items-center justify-center`}>
                    {group.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">{group.title}</h4>
                </div>

                <div className="ml-0 space-y-2">
                  {group.restaurants.map((restaurant, index) => (
                    <button
                      key={restaurant.id}
                      onClick={() => handleRestaurantClick(restaurant)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 group-hover:text-gray-900">
                          {restaurant.name}
                          {restaurant.location && ` - ${restaurant.location}`}
                        </span>
                        {group.title === "Popular Restaurant" && index === 0 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
