import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { TYPE_CONFIG } from "../utils/constants";
import { delRecent } from "../utils/filterUtils";
import { useEffect, useRef } from "react";

export const SearchBar = ({
  inputValue,
  setInputValue,
  isFocused,
  setIsFocused,
  inputRef,
  submitSearch,
  filters,
  showDropdown,
  showRecent,
  showTrending,
  showSuggestions,
  recentSearches,
  setRecentSearches,
  trending,
  isTrendLoading,
  suggestions,
  isSugLoading,
  onSubmit,
  id,
}) => {
  const handleClearRecent = (e) => {
    e.preventDefault();
    localStorage.removeItem("rhace_recent_searches");
    setRecentSearches([]);
  };

  return (
    <div className="flex-1 relative">
      {/* Input wrapper */}
      <label
        htmlFor={id}
        className={`flex items-center gap-2 cursor-text bg-gray-50 border rounded-full px-3 py-2.5 sm:py-3.5 ${
          showDropdown
            ? "border-[#0A6C6D] ring-2 ring-[#0A6C6D]/10 sm:rounded-t-3xl sm:rounded-b-none"
            : "border-gray-200 hover:border-gray-400"
        }`}
      >
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          id={id}
          autoComplete="off"
          autoFocus
          spellCheck="false"
          placeholder={
            filters.type
              ? TYPE_CONFIG[filters.type]?.searchPlaceholder
              : "Search hotels, restaurants, clubs, cuisines..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 160)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitSearch();
              onSubmit?.(); // close popup
            }
            if (e.key === "Escape") setIsFocused(false);
          }}
          className="flex-1 bg-transparent cursor-text outline-none text-sm text-gray-900 placeholder-gray-400 min-w-0"
        />
        {inputValue && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setInputValue("")}
            className="text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </label>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full bg-white border-2 border-[#0A6C6D] border-t-0 rounded-b-xl shadow-2xl z-[999] max-h-80 sm:max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {showRecent && (
            <div>
              <div className="flex items-center justify-between px-3 sm:px-4 pt-2.5 pb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Recent
                </span>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClearRecent}
                  className="text-[10px] font-bold text-[#0A6C6D]"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((term) => (
                <div
                  key={term}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => submitSearch(term)}
                  className="flex items-center gap-2.5 px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer group"
                >
                  <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {term}
                  </span>
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      delRecent(term);
                      setRecentSearches(getRecent());
                    }}
                    className="text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trending */}
          {showTrending && (
            <div>
              <div className="flex items-center gap-1.5 px-3 sm:px-4 pt-2.5 pb-1">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Trending
                </span>
              </div>
              {isTrendLoading ? (
                <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
                </div>
              ) : (
                trending
                  .slice(0, 6)
                  .map((v) => (
                    <VendorDropdownRow
                      key={v._id}
                      vendor={v}
                      onClick={() => submitSearch(v.businessName)}
                    />
                  ))
              )}
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && (
            <div>
              <div className="px-3 sm:px-4 pt-2.5 pb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Suggestions
                </span>
              </div>
              {isSugLoading ? (
                <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((v) => (
                  <VendorDropdownRow
                    key={v._id}
                    vendor={v}
                    onClick={() => submitSearch(v.businessName)}
                    showArrow
                  />
                ))
              ) : (
                <p className="px-3 py-4 text-center text-sm text-gray-400">
                  No results for "{inputValue}"
                </p>
              )}
              {inputValue.trim() && (
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => submitSearch(inputValue)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50 cursor-pointer text-[#0A6C6D]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold">
                    Search "<strong>{inputValue}</strong>"
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Shared dropdown row ───────────────────────────────────────────────────────
const VendorDropdownRow = ({ vendor, onClick, showArrow }) => {
  const cfg = TYPE_CONFIG[vendor.vendorType];
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer group"
    >
      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {vendor.profileImages?.[0] ? (
          <img
            src={vendor.profileImages[0]}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-xs font-black ${cfg?.light || "text-gray-400"}`}
          >
            {vendor.businessName?.[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {vendor.businessName}
        </p>
        <p className="text-[11px] text-gray-400 capitalize">
          {cfg?.singular}
          {vendor.vendorTypeCategory && vendor.vendorTypeCategory !== "General"
            ? ` · ${vendor.vendorTypeCategory}`
            : ""}
          {vendor.address ? ` · ${vendor.address.split(",")[0]}` : ""}
        </p>
      </div>
      {vendor.rating > 0 && (
        <div className="flex items-center gap-0.5 shrink-0">
          <FaStar className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-xs font-bold text-gray-700">
            {vendor.rating.toFixed(1)}
          </span>
        </div>
      )}
      {showArrow && (
        <ArrowUpRight className="w-3 h-3 text-gray-200 group-hover:text-gray-400 shrink-0" />
      )}
    </div>
  );
};

export const SearchPopup = ({
  show,
  setShow,
  searchProps,
  filters,
  inputRef,
}) => {
  useEffect(() => {
  if (show) {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }
}, [show]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-white z-50 p-4">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShow(false)}
          className="bg-white border hover:bg-gray-50 rounded-full p-2 text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <SearchBar
          inputRef={inputRef}
          {...searchProps}
          showDropdown={false}
          filters={filters}
          onSubmit={() => setShow(false)}
          id="search2"
        />
      </div>
      <div>
        {searchProps.showSuggestions && (
          <div className="mt-4">
            {searchProps.suggestions.length > 0 && (
              <>
                {searchProps.isSugLoading ? (
                  <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                    Searching...
                  </div>
                ) : searchProps.suggestions.length > 0 ? (
                  searchProps.suggestions.map((v) => (
                    <div
                      className="py-2 text-sm text-gray-700 border-b last:border-b-0"
                      key={v._id}
                      onClick={() => {
                        searchProps.submitSearch(v.businessName);
                        setShow(false);
                      }}
                    >
                      {v.businessName}
                    </div>
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-sm text-gray-400">
                    No results for "{inputValue}"
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
