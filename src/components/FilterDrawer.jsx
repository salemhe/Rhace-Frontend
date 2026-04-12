import { FilterPanel } from "./FilterPanel";

/**
 * FilterDrawer
 * - Mobile: bottom sheet overlay
 * - Desktop (lg+): sticky sidebar (rendered by parent layout)
 */
export const FilterDrawer = ({
  isOpen, onClose,
  filters, onChange, onClear,
  facets, hasFilters,
  pagination,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            onClear={onClear}
            facets={facets}
            hasFilters={hasFilters}
            onClose={onClose}
          />
        </div>

        {/* CTA footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0A6C6D] text-white text-sm font-semibold rounded-xl hover:bg-[#084F4F] transition-colors"
          >
            Show {pagination?.totalCount > 0 ? `${pagination.totalCount} Results` : "Results"}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * DesktopFilterSidebar — sticky sidebar shown on lg+ screens
 */
export const DesktopFilterSidebar = ({ filters, onChange, onClear, facets, hasFilters }) => (
  <aside className="hidden lg:block w-60 xl:w-64 shrink-0 sticky top-[130px] max-h-[calc(100vh-145px)] overflow-y-auto">
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <FilterPanel
        filters={filters}
        onChange={onChange}
        onClear={onClear}
        facets={facets}
        hasFilters={hasFilters}
      />
    </div>
  </aside>
);