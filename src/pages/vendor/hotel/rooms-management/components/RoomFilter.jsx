import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState, forwardRef, useImperativeHandle } from "react";
import ViewToggle from "./ViewToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RoomFilter = forwardRef(({ onFilterChange, view, setView }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Advanced filter states
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [capacityFilter, setCapacityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const categories = [
    { value: "all", label: "All Category" },
    { value: "standard", label: "Standard Rooms" },
    { value: "deluxe", label: "Deluxe Rooms" },
    { value: "suite", label: "Suite Rooms" },
    { value: "penthouse", label: "Penthouse" },
  ];

  const amenitiesList = [
    "WiFi",
    "AC",
    "TV",
    "Mini Bar",
    "Sea View",
    "Balcony",
    "Kitchen",
  ];

  const applyFilters = (updates = {}) => {
    const filters = {
      search: updates.search !== undefined ? updates.search : searchTerm,
      category:
        updates.category !== undefined ? updates.category : selectedCategory,
      priceRange:
        updates.priceRange !== undefined ? updates.priceRange : priceRange,
      capacity:
        updates.capacity !== undefined ? updates.capacity : capacityFilter,
      status: updates.status !== undefined ? updates.status : statusFilter,
      amenities:
        updates.amenities !== undefined ? updates.amenities : selectedAmenities,
    };
    onFilterChange?.(filters);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters({ search: value });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryDropdownOpen(false);
    applyFilters({ category: value });
  };

  const toggleAmenity = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updated);
  };

  const applyAdvancedFilters = () => {
    applyFilters();
    setShowAdvancedFilter(false);
  };

  const resetAdvancedFilters = () => {
    setPriceRange({ min: "", max: "" });
    setCapacityFilter("");
    setStatusFilter("all");
    setSelectedAmenities([]);

    const resetFilters = {
      search: searchTerm,
      category: selectedCategory,
      priceRange: { min: "", max: "" },
      capacity: "",
      status: "all",
      amenities: [],
    };
    onFilterChange?.(resetFilters);
  };

  // Reset all filters function
  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setCapacityFilter("");
    setStatusFilter("all");
    setSelectedAmenities([]);

    const resetFilters = {
      search: "",
      category: "all",
      priceRange: { min: "", max: "" },
      capacity: "",
      status: "all",
      amenities: [],
    };
    onFilterChange?.(resetFilters);
  };

  // Expose reset function to parent component
  useImperativeHandle(ref, () => ({
    resetFilters: resetAllFilters,
  }));

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "all" ||
    priceRange.min !== "" ||
    priceRange.max !== "" ||
    capacityFilter !== "" ||
    statusFilter !== "all" ||
    selectedAmenities.length > 0;

  return (
    <div className="mb-6">
      {/* Main Filter Bar */}
      <div className="flex justify-between items-center">
        {/* Search Input */}
        <div className=" relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="gap-3 flex items-center">
          {/* Category Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center gap-2 min-w-[160px] justify-between transition-colors"
            >
              <span className="text-gray-700 text-sm">
                {categories.find((c) => c.value === selectedCategory)?.label}
              </span>
              <ChevronDown size={18} className="text-gray-500" />
            </Button>

            {categoryDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setCategoryDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-1 border border-gray-100">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedCategory === cat.value
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Advanced Filter Button */}
          <Button
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className={`px-4 -3 border rounded-lg flex items-center gap-2 transition-colors ${
              showAdvancedFilter
                ? "bg-teal-50 border-teal-200 text-teal-600"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm">Advanced filter</span>
          </Button>

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="px-4 py-3 border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors"
              title="Clear all filters"
            >
              <X size={18} />
              <span className="text-sm">Clear</span>
            </button>
          )}
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showAdvancedFilter && (
        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Capacity
              </label>
              <input
                type="number"
                placeholder="Number of guests"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedAmenities.includes(amenity)
                        ? "bg-teal-50 border-teal-200 text-teal-600"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={resetAdvancedFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Reset Advanced
            </button>
            <button
              onClick={applyAdvancedFilters}
              className="px-6 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

RoomFilter.displayName = "RoomFilter";

export default RoomFilter;
