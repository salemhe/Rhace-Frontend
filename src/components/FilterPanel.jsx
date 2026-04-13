import { MapPin, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import {
  R_CUISINES, R_DIETARY, R_DINING_STYLES, R_SEATING, R_OCCASIONS, R_MEAL_TIMES, R_RESERVATION,
  H_STAR_RATINGS, H_PROPERTY_TYPE, H_AMENITIES, H_MEAL_PLANS, H_CANCEL, H_ACCESSIBILITY,
  C_VENUE_TYPES, C_GENRES, C_PERFORMANCES, C_DRESS_CODES, C_AGE_POLICY, C_TIMES, C_TABLE_TYPES,
  BOOL_KEYS, TYPE_CONFIG,
} from "../utils/constants";
import { buildChips } from "../utils/filterUtils";

// ── Primitives ────────────────────────────────────────────────────────────────
const T = ({ children }) => (
  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{children}</p>
);
const Hr = () => <div className="h-px bg-gray-100" />;

const Radio = ({ val, cur, set, children, count }) => (
  <label onClick={() => set(val)}
    className="flex items-center justify-between cursor-pointer group py-0.5 px-1 rounded hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-2">
      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${cur === val ? "border-[#0A6C6D]" : "border-gray-300 group-hover:border-[#0A6C6D]"}`}>
        {cur === val && <div className="w-1.5 h-1.5 rounded-full bg-[#0A6C6D]" />}
      </div>
      <span className={`text-xs ${cur === val ? "font-semibold text-gray-900" : "text-gray-600"}`}>{children}</span>
    </div>
    {count != null && <span className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">{count}</span>}
  </label>
);

const Pill = ({ val, cur, set, children }) => (
  <button onClick={() => set(cur === val ? "" : val)}
    className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${cur === val ? "bg-[#0A6C6D] border-[#0A6C6D] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#0A6C6D]"}`}>
    {children}
  </button>
);

const MultiPill = ({ val, cur = [], set, children }) => {
  const active = cur.includes(val);
  return (
    <button onClick={() => set(active ? cur.filter(v => v !== val) : [...cur, val])}
      className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${active ? "bg-[#0A6C6D] border-[#0A6C6D] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#0A6C6D]"}`}>
      {children}
    </button>
  );
};

const Toggle = ({ cur, set, children }) => (
  <label onClick={() => set(cur === "true" ? "" : "true")}
    className="flex items-center justify-between cursor-pointer group py-1 px-1 rounded hover:bg-gray-50 transition-colors">
    <span className={`text-xs ${cur === "true" ? "font-semibold text-gray-900" : "text-gray-600"}`}>{children}</span>
    <div className={`w-8 h-4 rounded-full transition-all relative shrink-0 ${cur === "true" ? "bg-[#0A6C6D]" : "bg-gray-200"}`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${cur === "true" ? "left-4" : "left-0.5"}`} />
    </div>
  </label>
);

// ── Type-specific filter panels ───────────────────────────────────────────────
const RestaurantFilters = ({ f, onChange }) => (
  <>
    <div><T>Cuisine</T><p className="text-[11px] text-gray-500 mb-3">Filter by cuisine or any menu item.</p>
      <div className="flex flex-wrap gap-1.5">{R_CUISINES.map(([v,l]) => <MultiPill key={v} val={v} cur={f.cuisines} set={x => onChange("cuisines",x)}>{l}</MultiPill>)}</div>
    </div><Hr />
    <div><T>Dietary Options</T><div className="flex flex-wrap gap-1.5">{R_DIETARY.map(([v,l]) => <MultiPill key={v} val={v} cur={f.dietaryOptions} set={x => onChange("dietaryOptions",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Dining Style</T><div className="space-y-0.5">{R_DINING_STYLES.map(([v,l]) => <Radio key={v} val={v} cur={f.diningStyle} set={x => onChange("diningStyle",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Seating</T><div className="flex flex-wrap gap-1.5">{R_SEATING.map(([v,l]) => <MultiPill key={v} val={v} cur={f.seatOptions} set={x => onChange("seatOptions",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Occasion</T><div className="flex flex-wrap gap-1.5">{R_OCCASIONS.map(([v,l]) => <MultiPill key={v} val={v} cur={f.occasionTags} set={x => onChange("occasionTags",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Meal Time</T><div className="flex flex-wrap gap-1.5">{R_MEAL_TIMES.map(([v,l]) => <MultiPill key={v} val={v} cur={f.mealTimes} set={x => onChange("mealTimes",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Reservation Policy</T><div className="space-y-0.5">{R_RESERVATION.map(([v,l]) => <Radio key={v} val={v} cur={f.reservationPolicy} set={x => onChange("reservationPolicy",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Extras</T><div className="space-y-0.5">
      <Toggle cur={f.hasParking} set={v => onChange("hasParking",v)}>Has Parking</Toggle>
      <Toggle cur={f.hasOutdoorSeating} set={v => onChange("hasOutdoorSeating",v)}>Outdoor Seating</Toggle>
      <Toggle cur={f.openNow} set={v => onChange("openNow",v)}>Open Now</Toggle>
    </div></div>
  </>
);

const HotelFilters = ({ f, onChange }) => (
  <>
    <div><T>Star Rating</T><div className="space-y-0.5">{H_STAR_RATINGS.map(([v,l]) => <Radio key={v} val={v} cur={f.starRating} set={x => onChange("starRating",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Property Type</T><div className="space-y-0.5">{H_PROPERTY_TYPE.map(([v,l]) => <Radio key={v} val={v} cur={f.propertyType} set={x => onChange("propertyType",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Amenities</T><div className="flex flex-wrap gap-1.5">{H_AMENITIES.map(([v,l]) => <MultiPill key={v} val={v} cur={f.amenities} set={x => onChange("amenities",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Meal Plan</T><div className="space-y-0.5">{H_MEAL_PLANS.map(([v,l]) => <Radio key={v} val={v} cur={f.mealPlan} set={x => onChange("mealPlan",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Cancellation</T><div className="space-y-0.5">{H_CANCEL.map(([v,l]) => <Radio key={v} val={v} cur={f.cancellationPolicy} set={x => onChange("cancellationPolicy",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Accessibility</T><div className="flex flex-wrap gap-1.5">{H_ACCESSIBILITY.map(([v,l]) => <MultiPill key={v} val={v} cur={f.accessibilityFeatures} set={x => onChange("accessibilityFeatures",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Extras</T><div className="space-y-0.5">
      <Toggle cur={f.instantBook} set={v => onChange("instantBook",v)}>Instant Book</Toggle>
      <Toggle cur={f.petFriendly} set={v => onChange("petFriendly",v)}>Pet Friendly</Toggle>
      <Toggle cur={f.openNow} set={v => onChange("openNow",v)}>Open Now</Toggle>
    </div></div>
  </>
);

const ClubFilters = ({ f, onChange }) => (
  <>
    <div><T>Venue Type</T><div className="space-y-0.5">{C_VENUE_TYPES.map(([v,l]) => <Radio key={v} val={v} cur={f.venueType} set={x => onChange("venueType",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Music Genre</T><div className="flex flex-wrap gap-1.5">{C_GENRES.map(([v,l]) => <MultiPill key={v} val={v} cur={f.musicGenres} set={x => onChange("musicGenres",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Live Performances</T><div className="flex flex-wrap gap-1.5">{C_PERFORMANCES.map(([v,l]) => <MultiPill key={v} val={v} cur={f.livePerformanceTypes} set={x => onChange("livePerformanceTypes",x)}>{l}</MultiPill>)}</div></div><Hr />
    <div><T>Dress Code</T><div className="space-y-0.5">{C_DRESS_CODES.map(([v,l]) => <Radio key={v} val={v} cur={f.dressCode} set={x => onChange("dressCode",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Age Policy</T><div className="space-y-0.5">{C_AGE_POLICY.map(([v,l]) => <Radio key={v} val={v} cur={f.agePolicy} set={x => onChange("agePolicy",x)}>{l}</Radio>)}</div></div><Hr />
    <div><T>Entry Fee</T><div className="flex flex-wrap gap-1.5">
      {[["","Any"],["0","Free Entry"],["paid","Paid Entry"]].map(([v,l]) => <Pill key={v} val={v} cur={f.entryFee} set={x => onChange("entryFee",x)}>{l}</Pill>)}
    </div></div><Hr />
    <div><T>Time Slot</T><div className="flex flex-wrap gap-1.5">{C_TIMES.map(([v,l]) => <Pill key={v} val={v} cur={f.clubTime} set={x => onChange("clubTime",x)}>{l}</Pill>)}</div></div><Hr />
    <div><T>Table Type</T><div className="flex flex-wrap gap-1.5">{C_TABLE_TYPES.map(([v,l]) => <Pill key={v} val={v} cur={f.tableType} set={x => onChange("tableType",x)}>{l}</Pill>)}</div></div><Hr />
    <div><T>Extras</T><div className="space-y-0.5">
      <Toggle cur={f.hasVIPTables}  set={v => onChange("hasVIPTables",v)}>VIP Tables</Toggle>
      <Toggle cur={f.hasGuestlist}  set={v => onChange("hasGuestlist",v)}>Guestlist Available</Toggle>
      <Toggle cur={f.hasOutdoorArea} set={v => onChange("hasOutdoorArea",v)}>Outdoor Area</Toggle>
      <Toggle cur={f.openNow}       set={v => onChange("openNow",v)}>Open Now</Toggle>
    </div></div>
  </>
);

// ── FilterPanel ───────────────────────────────────────────────────────────────
export const FilterPanel = ({ filters: f, onChange, onClear, facets, hasFilters, onClose }) => {
  const typeCount = t => facets?.byType?.find(x => x._id === t)?.count;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
          <span className="font-bold text-gray-900 text-sm">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={onClear} className="text-[11px] font-bold text-[#0A6C6D] hover:underline flex items-center gap-0.5">
              <RotateCcw className="w-2.5 h-2.5" /> Clear
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded border border-gray-200 text-gray-400 hover:text-gray-700">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {!f.type && (
        <>
          <div><T>Type</T>
            <div className="space-y-0.5">
              <Radio val="" cur={f.type} set={v => onChange("type",v)}>All Types</Radio>
              <Radio val="restaurant" cur={f.type} set={v => onChange("type",v)} count={typeCount("restaurant")}>Restaurants</Radio>
              <Radio val="hotel" cur={f.type} set={v => onChange("type",v)} count={typeCount("hotel")}>Hotels</Radio>
              <Radio val="club" cur={f.type} set={v => onChange("type",v)} count={typeCount("club")}>Clubs</Radio>
            </div>
          </div><Hr />
        </>
      )}

      <div><T>Sort By</T>
        <div className="space-y-0.5">
          {[["rating","Top Rated"],["price_asc","Price: Low → High"],["price_desc","Price: High → Low"],["newest","Newest"]].map(([v,l]) =>
            <Radio key={v} val={v} cur={f.sort} set={x => onChange("sort",x)}>{l}</Radio>
          )}
        </div>
      </div><Hr />

      {f.type === "restaurant" && <RestaurantFilters f={f} onChange={onChange} />}
      {f.type === "hotel"      && <HotelFilters f={f} onChange={onChange} />}
      {f.type === "club"       && <ClubFilters  f={f} onChange={onChange} />}

      <Hr />
      <div><T>City</T>
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input type="text" placeholder="Lagos, Abuja, PH…" value={f.city}
            onChange={e => onChange("city", e.target.value)}
            className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0A6C6D] focus:ring-1 focus:ring-[#0A6C6D] transition-all" />
        </div>
      </div>
    </div>
  );
};

// ── FilterChips ───────────────────────────────────────────────────────────────
export const FilterChips = ({ filters, onChange, onClear }) => {
  const chips = buildChips(filters, onChange);
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3">
      {chips.map(chip => (
        <span key={chip.key}
          className="inline-flex items-center gap-1 bg-[#0A6C6D]/10 text-[#0A6C6D] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#0A6C6D]/20">
          {chip.label}
          <button onClick={chip.clear}><X className="w-2.5 h-2.5" /></button>
        </span>
      ))}
      <button onClick={onClear} className="text-[11px] text-gray-400 hover:text-gray-600 underline">Clear all</button>
    </div>
  );
};