import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

import { useSearchLocation } from "@/hooks/useSearchLocations.jsx";
import { useSearchState }    from "@/hooks/useSearchState";
import { SearchHeader }      from "@/components/SearchHeader";
import { DiscoveryHome }     from "@/components/DiscoveryHome";
import { SearchResults }     from "@/components/SearchResults";
import { FilterDrawer, DesktopFilterSidebar } from "@/components/FilterDrawer";
import { useSearchParams, useNavigate } from 'react-router-dom';

// Strip trailing "s" from plural type names coming from URL/tabs
// e.g. "restaurants" → "restaurant", "hotels" → "hotel", "clubs" → "club"
const normalizeType = (type) => {
  if (!type) return "";
  const MAP = {
    restaurants: "restaurant",
    hotels: "hotel",
    clubs: "club",
    restaurant: "restaurant",
    hotel: "hotel",
    club: "club",
  };
  return MAP[type.toLowerCase()] || type.replace(/s$/, "");
};

const SearchPage = () => {
  const locationState = useSearchLocation();
  const searchState   = useSearchState(locationState.location);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Normalise the ?type= param on mount and whenever it changes
  // e.g. /search?type=restaurants → /search?type=restaurant
  useEffect(() => {
    const rawType = searchParams.get("type");
    if (!rawType) return;
    const clean = normalizeType(rawType);
    if (clean !== rawType) {
      const next = new URLSearchParams(searchParams);
      next.set("type", clean);
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // When user clicks a type tab/chip in the UI,
  // update the URL param (singular form) without resetting the query.
  const handleTypeChange = (rawType) => {
    const type = normalizeType(rawType);
    const next = new URLSearchParams(searchParams);
    if (type) {
      next.set("type", type);
    } else {
      next.delete("type");
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  // Override updateFilter so that type values are always normalised
  const updateFilterSafe = (key, value) => {
    if (key === "type") {
      searchState.updateFilter(key, normalizeType(value));
    } else {
      searchState.updateFilter(key, value);
    }
  };

  const searchBarProps = {
    inputValue:        searchState.inputValue,
    setInputValue:     searchState.setInputValue,
    isFocused:         searchState.isFocused,
    setIsFocused:      searchState.setIsFocused,
    inputRef:          searchState.inputRef,
    submitSearch:      searchState.submitSearch,
    showDropdown:      searchState.showDropdown,
    showRecent:        searchState.showRecent,
    showTrending:      searchState.showTrending,
    showSuggestions:   searchState.showSuggestions,
    recentSearches:    searchState.recentSearches,
    setRecentSearches: searchState.setRecentSearches,
    trending:          searchState.trending,
    isTrendLoading:    searchState.isTrendLoading,
    suggestions:       searchState.suggestions,
    isSugLoading:      searchState.isSugLoading,
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchHeader
        searchProps={searchBarProps}
        filters={searchState.filters}
        updateFilter={updateFilterSafe}
        locationState={locationState}
      />

      {searchState.hasActiveSearch ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 bg-white lg:px-8 py-4 sm:py-6">
          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0">
              <SearchResults
                results={searchState.results}
                isLoading={searchState.isLoading}
                error={searchState.error}
                pagination={searchState.pagination}
                activeQuery={searchState.activeQuery}
                filters={searchState.filters}
                updateFilter={updateFilterSafe}
                clearFilters={searchState.clearFilters}
                hasFilters={searchState.hasFilters}
                facets={searchState.facets}
                goToPage={searchState.goToPage}
                onOpenFilters={() => setIsFilterOpen(true)}
              />
            </div>
          </div>
        </div>
      ) : (
        <DiscoveryHome
          discovery={searchState.discovery}
          isDiscLoading={searchState.isDiscLoading}
          locationState={locationState}
          updateFilter={updateFilterSafe}
          submitSearch={searchState.submitSearch}
          inputRef={searchState.inputRef}
          activeType={normalizeType(searchState.filters.type || "")}
          recentSearches={searchState.recentSearches}
        />
      )}

      {/* Filter drawer (mobile) */}
      {isFilterOpen && (
        <FilterDrawer
          filters={searchState.filters}
          updateFilter={updateFilterSafe}
          clearFilters={searchState.clearFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default SearchPage;