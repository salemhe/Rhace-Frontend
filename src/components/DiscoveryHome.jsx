import { useNavigate } from "react-router-dom";
import {
  Clock,
  ChevronRight,
  MapPin,
  TrendingUp,
  Star,
  Zap,
  Utensils,
  Hotel,
  Music,
  ArrowRight,
} from "lucide-react";
import { DiscoveryListCard, DiscoverySkeletonList } from "./VenueCard";

// ─── Section icon map ──────────────────────────────────────────────────────────
const getSectionIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("near") || t.includes("reach")) return <MapPin className="w-4 h-4" />;
  if (t.includes("trend") || t.includes("popular")) return <TrendingUp className="w-4 h-4" />;
  if (t.includes("hotel") || t.includes("stay") || t.includes("room")) return <Star className="w-4 h-4" />;
  if (t.includes("club") || t.includes("night") || t.includes("bottle") || t.includes("drink")) return <Zap className="w-4 h-4" />;
  if (t.includes("dish") || t.includes("restaurant") || t.includes("food") || t.includes("crav")) return <Utensils className="w-4 h-4" />;
  return <ArrowRight className="w-4 h-4" />;
};

// ─── Section heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ title, subtitle, onAction }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 flex items-center justify-center bg-[#0A6C6D]/10 rounded-lg text-[#0A6C6D]">
        {getSectionIcon(title)}
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-black text-gray-900 leading-none">{title}</h3>
        {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {onAction && (
      <button
        onClick={onAction}
        className="text-xs font-bold text-[#0A6C6D] hover:underline flex items-center gap-0.5 shrink-0"
      >
        See all <ChevronRight className="w-3 h-3" />
      </button>
    )}
  </div>
);

// ─── Divider between list items ────────────────────────────────────────────────
const ListDivider = () => <hr className="border-t border-gray-100 mx-4" />;

// ─── Large card layout (vendor cards) ─────────────────────────────────────────
const LargeCardsSection = ({ items, isLoading, skeletonCount = 4 }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i}>
            <DiscoverySkeletonList />
            {i < skeletonCount - 1 && <ListDivider />}
          </div>
        ))}
      </div>
    );
  }

  if (!items?.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {items.map((item, i) => (
        <div key={item.id || i}>
          {/* If item is a vendor shape, use DiscoveryListCard; else render a simple row */}
          {item.name && item.image !== undefined ? (
            <div
              onClick={() => navigate(item.target || "#")}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-black text-xl"
                    style={{ background: `hsl(${((item.name?.charCodeAt(0) || 65) * 5) % 360}, 60%, 50%)` }}
                  >
                    {item.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</p>
                {item.badge && (
                  <span className="text-[10px] font-semibold text-[#0A6C6D] bg-[#0A6C6D]/10 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.description && (
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </div>
          ) : (
            <DiscoveryListCard vendor={item} navigate={navigate} />
          )}
          {i < items.length - 1 && <ListDivider />}
        </div>
      ))}
    </div>
  );
};

// ─── Product scroll layout ─────────────────────────────────────────────────────
const ProductScrollSection = ({ items }) => {
  const navigate = useNavigate();
  if (!items?.length) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {items.map((item, i) => (
        <div
          key={item.id || i}
          onClick={() => navigate(item.target || "#")}
          className="flex-shrink-0 w-36 cursor-pointer group"
        >
          <div className="w-36 h-28 rounded-xl overflow-hidden bg-gray-100 mb-2">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-black text-2xl"
                style={{ background: `hsl(${((item.name?.charCodeAt(0) || 65) * 5) % 360}, 55%, 50%)` }}
              >
                {item.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
          <p className="text-[10px] text-gray-400 line-clamp-1">{item.vendorName}</p>
          {item.price && (
            <p className="text-xs font-semibold text-[#0A6C6D] mt-0.5">{item.price}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Horizontal chips layout (recent searches) ─────────────────────────────────
const HorizontalChipsSection = ({ items }) => {
  const navigate = useNavigate();
  if (!items?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => navigate(item.target || "#")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#0A6C6D] hover:text-[#0A6C6D] hover:bg-[#0A6C6D]/5 transition-all font-medium"
        >
          <Clock className="w-2.5 h-2.5" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

// ─── Circular chips layout (discovery funnel) ──────────────────────────────────
const CircularChipsSection = ({ items }) => {
  const navigate = useNavigate();
  if (!items?.length) return null;

  const chipColors = [
    "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
    "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100",
    "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100",
    "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100",
    "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => navigate(item.target || "#")}
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold transition-all ${chipColors[i % chipColors.length]}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

// ─── Recent searches pill row (from local state) ───────────────────────────────
const RecentSearchPills = ({ recentSearches = [], onSearch }) => {
  if (!recentSearches.length) return null;
  return (
    <section>
      <div className="flex items-center gap-1.5 mb-3">
        <Clock className="w-3.5 h-3.5 text-gray-400" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Recent Searches
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.slice(0, 8).map((s) => (
          <button
            key={s}
            onClick={() => onSearch(s)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#0A6C6D] hover:text-[#0A6C6D] hover:bg-[#0A6C6D]/5 transition-all font-medium"
          >
            <Clock className="w-2.5 h-2.5" />
            {s}
          </button>
        ))}
      </div>
    </section>
  );
};

// ─── Skeleton for a whole section ─────────────────────────────────────────────
const SectionSkeleton = ({ count = 3 }) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <DiscoverySkeletonList />
        {i < count - 1 && <ListDivider />}
      </div>
    ))}
  </div>
);

// ─── Render a single section by layout type ────────────────────────────────────
const Section = ({ section, isLoading }) => {
  const { title, subtitle, layout, items } = section;

  const renderContent = () => {
    switch (layout) {
      case "large_cards":
        return <LargeCardsSection items={items} isLoading={isLoading} />;
      case "product_scroll":
        return <ProductScrollSection items={items} />;
      case "horizontal_chips":
        return <HorizontalChipsSection items={items} />;
      case "circular_chips":
        return <CircularChipsSection items={items} />;
      default:
        return <LargeCardsSection items={items} isLoading={isLoading} />;
    }
  };

  return (
    <section className="space-y-0">
      <SectionHeading title={title} subtitle={subtitle} />
      {isLoading && (layout === "large_cards" || !layout) ? (
        <SectionSkeleton />
      ) : (
        renderContent()
      )}
    </section>
  );
};

// ─── Main DiscoveryHome ────────────────────────────────────────────────────────
export const DiscoveryHome = ({
  discovery = {},
  isDiscLoading,
  locationState,
  updateFilter,
  submitSearch,
  inputRef,
  activeType = "",
  recentSearches = [],
}) => {
  // Backend returns: { success, vendorType, sections: [...] }
  const sections = discovery.sections || [];

  // Split sections into two columns for desktop
  const leftSections = sections.filter((_, i) => i % 2 === 0);
  const rightSections = sections.filter((_, i) => i % 2 !== 0);

  // Show skeleton sections while loading
  const skeletonSections = [
    { title: "Near You", layout: "large_cards", items: [] },
    { title: "Trending Now", layout: "large_cards", items: [] },
    { title: "Featured Picks", layout: "large_cards", items: [] },
    { title: "Explore", layout: "circular_chips", items: [] },
  ];

  const displaySections = isDiscLoading && sections.length === 0 ? skeletonSections : sections;
  const displayLeft = displaySections.filter((_, i) => i % 2 === 0);
  const displayRight = displaySections.filter((_, i) => i % 2 !== 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-8">

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <RecentSearchPills
          recentSearches={recentSearches}
          onSearch={submitSearch}
        />
      )}

      {/* Location banner */}
      {locationState.status !== "granted" &&
        locationState.status !== "detecting" &&
        locationState.status !== "ip" && (
          <div className="flex items-center justify-between bg-[#0A6C6D]/5 border border-[#0A6C6D]/20 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0A6C6D]" />
              <p className="text-sm text-gray-700">
                Enable location for nearby results
              </p>
            </div>
            <button
              onClick={locationState.requestLocation}
              className="text-xs font-bold text-[#0A6C6D] border border-[#0A6C6D]/30 px-3 py-1.5 rounded-lg hover:bg-[#0A6C6D] hover:text-white transition-all"
            >
              Allow
            </button>
          </div>
        )}

      {/* No sections yet */}
      {!isDiscLoading && sections.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No discoveries available yet. Try searching above!
        </div>
      )}

      {/* Two-column grid on desktop */}
      {(isDiscLoading || sections.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            {displayLeft.map((section, i) => (
              <Section key={i} section={section} isLoading={isDiscLoading && !section.items?.length} />
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {displayRight.map((section, i) => (
              <Section key={i} section={section} isLoading={isDiscLoading && !section.items?.length} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};