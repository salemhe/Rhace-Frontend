import { AlertCircle, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { VenueCard, SkeletonCard } from "./VenueCard";
import { FilterChips } from "./FilterPanel";
import { countActiveFilters } from "../utils/filterUtils";

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ pagination, onPage }) => {
  const { currentPage, totalPages, totalCount, hasNextPage, hasPrevPage } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) pages.push(i);
    else if (Math.abs(i - currentPage) === 2) pages.push("...");
  }
  const deduped = pages.filter((p, i) => !(p === "..." && pages[i - 1] === "..."));

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-5 border-t border-gray-100">
      <p className="text-xs text-gray-500 order-2 sm:order-1">
        <span className="font-semibold text-gray-800">{totalCount}</span> results · Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button disabled={!hasPrevPage} onClick={() => onPage(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {deduped.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">…</span>
          ) : (
            <button key={p} onClick={() => onPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold border transition-all ${p === currentPage ? "bg-[#0A6C6D] border-[#0A6C6D] text-white" : "border-gray-200 text-gray-600 hover:border-gray-800"}`}>
              {p}
            </button>
          )
        )}
        <button disabled={!hasNextPage} onClick={() => onPage(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── Main SearchResults ────────────────────────────────────────────────────────
export const SearchResults = ({
  results, isLoading, error,
  pagination, activeQuery,
  filters, updateFilter, clearFilters, hasFilters,
  facets, goToPage,
  onOpenFilters,
}) => {
  const activeFilterCount = countActiveFilters(filters);
  const hasResults = results.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

      {/* Mobile filter button */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        {!isLoading && (
          <p className="text-sm text-gray-600">
            {pagination.totalCount > 0 ? (
              <><span className="font-bold text-gray-900">{pagination.totalCount}</span> results for "<span className="font-semibold text-[#0A6C6D]">{activeQuery}</span>"</>
            ) : (
              <>No results for "<span className="font-semibold">{activeQuery}</span>"</>
            )}
          </p>
        )}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 text-xs font-semibold transition-colors relative"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 w-4 h-4 bg-[#0A6C6D] text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      <FilterChips filters={filters} onChange={updateFilter} onClear={clearFilters} />

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="w-9 h-9 text-red-400" />
          <p className="text-red-600 font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Skeleton grid */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Results grid */}
      {!isLoading && hasResults && (
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          {results.map(v => <VenueCard key={v._id} vendor={v} activeType={filters.type} />)}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && !hasResults && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Search className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">No vendors found</h3>
            <p className="text-gray-500 text-sm">Try different keywords or adjust your filters</p>
          </div>
          {hasFilters && (
            <button onClick={clearFilters}
              className="px-4 py-2 bg-[#0A6C6D] text-white text-sm font-semibold rounded-xl hover:bg-[#084F4F] transition-colors">
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && hasResults && (
        <Pagination pagination={pagination} onPage={goToPage} />
      )}
    </div>
  );
};