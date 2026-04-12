import { useNavigate } from "react-router-dom";
import { ArrowUpRight, TrendingUp, Star, MapPin, Zap } from "lucide-react";
import { SvgIcon, SvgIcon2, SvgIcon3 } from "@/public/icons/icons";
import { TYPE_CONFIG, POPULAR_SEARCHES } from "../utils/constants";
import { VenueCard, SkeletonCard } from "./VenueCard";
import { LocationBanner } from "./LocationPill";

// ── Section heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-6 h-6 flex items-center justify-center text-[#0A6C6D]">{icon}</div>
    <div>
      <h3 className="text-sm sm:text-base font-black text-gray-900 leading-none">{title}</h3>
      {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ── Horizontal scroll row of cards ───────────────────────────────────────────
const CardRow = ({ vendors = [], isLoading, type, skeletonCount = 4 }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  if (!vendors.length) return (
    <p className="text-sm text-gray-400 py-4 text-center">No listings available yet.</p>
  );
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {vendors.map(v => <VenueCard key={v._id} vendor={v} activeType={type} />)}
    </div>
  );
};

// ── Category hero cards ───────────────────────────────────────────────────────
const CategoryCard = ({ type, label, sub, icon, onClick }) => {
  const cfg = TYPE_CONFIG[type];
  return (
    <button
      onClick={onClick}
      className="group relative h-32 sm:h-40 overflow-hidden rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <img src={cfg.image} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-3.5">
        <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <figure className="w-3.5 h-3.5 flex items-center">{icon}</figure>
        </div>
        <div>
          <p className="text-white font-bold text-sm sm:text-base leading-tight">{label}</p>
          <p className="text-white/65 text-xs mt-0.5">{sub}</p>
        </div>
      </div>
      <div className="absolute top-3 right-3 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-3 h-3 text-white" />
      </div>
    </button>
  );
};

// ── Main discovery home ───────────────────────────────────────────────────────
export const DiscoveryHome = ({
  discovery, isDiscLoading, locationState,
  updateFilter, submitSearch, inputRef,
  showLocationBanner,
}) => {
  const { nearby = [], topRated = [], restaurants = [], hotels = [], clubs = [] } = discovery;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-10">

      {/* Location banner (shown until location is known) */}
      {showLocationBanner && (
        <LocationBanner
          requestLocation={locationState.requestLocation}
          isDetecting={locationState.isDetecting}
        />
      )}

      {/* Hero: Category cards */}
      <section>
        <div className="text-center mb-5">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1">Discover Vendors</h2>
          <p className="text-gray-400 text-sm">Find and book the best spots near you</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CategoryCard type="restaurant" label="Restaurants" sub="Reserve your table"
            icon={<SvgIcon isActive={false} />}
            onClick={() => { updateFilter("type", "restaurant"); setTimeout(() => inputRef.current?.focus(), 50); }} />
          <CategoryCard type="hotel"      label="Hotels"      sub="Book your stay"
            icon={<SvgIcon2 isActive={false} />}
            onClick={() => { updateFilter("type", "hotel"); setTimeout(() => inputRef.current?.focus(), 50); }} />
          <CategoryCard type="club"       label="Clubs"       sub="Plan your night"
            icon={<SvgIcon3 isActive={false} />}
            onClick={() => { updateFilter("type", "club"); setTimeout(() => inputRef.current?.focus(), 50); }} />
        </div>
      </section>

      {/* Near You */}
      {(isDiscLoading || nearby.length > 0) && (
        <section>
          <SectionHeading
            icon={<MapPin className="w-5 h-5" />}
            title={locationState.location.city ? `Near ${locationState.location.city}` : "Near You"}
            subtitle="Based on your current location"
          />
          <CardRow vendors={nearby} isLoading={isDiscLoading} />
        </section>
      )}

      {/* Trending */}
      <section>
        <SectionHeading
          icon={<TrendingUp className="w-5 h-5" />}
          title="Trending Now"
          subtitle="Most popular bookings right now"
        />
        <CardRow vendors={topRated} isLoading={isDiscLoading} />
      </section>

      {/* Restaurants */}
      {(isDiscLoading || restaurants.length > 0) && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionHeading icon={<Star className="w-5 h-5" />} title="Top Restaurants" subtitle="Highly rated dining experiences" />
            <button onClick={() => updateFilter("type", "restaurant")}
              className="text-xs font-bold text-[#0A6C6D] hover:underline flex items-center gap-1">
              See all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <CardRow vendors={restaurants} isLoading={isDiscLoading} type="restaurant" />
        </section>
      )}

      {/* Hotels */}
      {(isDiscLoading || hotels.length > 0) && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionHeading icon={<Zap className="w-5 h-5" />} title="Featured Hotels" subtitle="Luxury & budget stays" />
            <button onClick={() => updateFilter("type", "hotel")}
              className="text-xs font-bold text-[#0A6C6D] hover:underline flex items-center gap-1">
              See all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <CardRow vendors={hotels} isLoading={isDiscLoading} type="hotel" />
        </section>
      )}

      {/* Clubs */}
      {(isDiscLoading || clubs.length > 0) && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionHeading icon={<Zap className="w-5 h-5" />} title="Tonight's Clubs" subtitle="Plan your perfect night out" />
            <button onClick={() => updateFilter("type", "club")}
              className="text-xs font-bold text-[#0A6C6D] hover:underline flex items-center gap-1">
              See all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <CardRow vendors={clubs} isLoading={isDiscLoading} type="club" />
        </section>
      )}

      {/* Popular quick searches */}
      <section className="text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Popular Searches</p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map(s => (
            <button key={s} onClick={() => submitSearch(s)}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#0A6C6D] hover:text-[#0A6C6D] transition-all font-medium">
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};