import { useState } from "react";
import Footer from "@/components/Footer";

import { useSearchLocation } from "@/hooks/useSearchLocations.jsx";
import { useSearchState }    from "@/hooks/useSearchState";
import { SearchHeader }      from "@/components/SearchHeader";
import { DiscoveryHome }     from "@/components/DiscoveryHome";
import { SearchResults }     from "@/components/SearchResults";
import { FilterDrawer, DesktopFilterSidebar } from "@/components/FilterDrawer";

const SearchPage = () => {
  // ── Location (industry-standard: silent geo → IP fallback) ─────────────────
  const locationState = useSearchLocation();

  // ── All search state (one hook to rule them all) ───────────────────────────
  const searchState = useSearchState(locationState.location);

  // ── Filter drawer (mobile) ─────────────────────────────────────────────────
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ── Show location banner only when location is still unknown & no active search
  const showLocationBanner =
    !searchState.hasActiveSearch &&
    locationState.status !== "granted" &&
    locationState.status !== "detecting";

  // ── Props to pass to SearchBar (keeps SearchHeader lean) ──────────────────
  const searchBarProps = {
    inputValue:     searchState.inputValue,
    setInputValue:  searchState.setInputValue,
    isFocused:      searchState.isFocused,
    setIsFocused:   searchState.setIsFocused,
    inputRef:       searchState.inputRef,
    submitSearch:   searchState.submitSearch,
    showDropdown:   searchState.showDropdown,
    showRecent:     searchState.showRecent,
    showTrending:   searchState.showTrending,
    showSuggestions:searchState.showSuggestions,
    recentSearches: searchState.recentSearches,
    setRecentSearches: searchState.setRecentSearches,
    trending:       searchState.trending,
    isTrendLoading: searchState.isTrendLoading,
    suggestions:    searchState.suggestions,
    isSugLoading:   searchState.isSugLoading,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header (search + tabs) ──────────────────────────────────── */}
      <SearchHeader
        searchProps={searchBarProps}
        filters={searchState.filters}
        updateFilter={searchState.updateFilter}
        locationState={locationState}
      />

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      {searchState.hasActiveSearch ? (
        /* ── Search results layout (sidebar + results) ── */
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex gap-5 items-start">
            {/* Desktop sidebar */}
            <DesktopFilterSidebar
              filters={searchState.filters}
              onChange={searchState.updateFilter}
              onClear={searchState.clearFilters}
              facets={searchState.facets}
              hasFilters={searchState.hasFilters}
            />

            {/* Results */}
            <div className="flex-1 min-w-0">
              <SearchResults
                results={searchState.results}
                isLoading={searchState.isLoading}
                error={searchState.error}
                pagination={searchState.pagination}
                activeQuery={searchState.activeQuery}
                filters={searchState.filters}
                updateFilter={searchState.updateFilter}
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
        /* ── Discovery home (no query) ── */
        <DiscoveryHome
          discovery={searchState.discovery}
          isDiscLoading={searchState.isDiscLoading}
          locationState={locationState}
          updateFilter={searchState.updateFilter}
          submitSearch={searchState.submitSearch}
          inputRef={searchState.inputRef}
          showLocationBanner={showLocationBanner}
        />
      )}

      {/* ── Mobile filter drawer ─────────────────────────────────────────────── */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={searchState.filters}
        onChange={searchState.updateFilter}
        onClear={searchState.clearFilters}
        facets={searchState.facets}
        hasFilters={searchState.hasFilters}
        pagination={searchState.pagination}
      />

      <Footer />
    </div>
  );
};

export default SearchPage;