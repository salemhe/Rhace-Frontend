import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search, X, Clock, TrendingUp, SlidersHorizontal,
  ChevronLeft, ChevronRight, ArrowUpRight, Loader2,
  AlertCircle, RotateCcw, MapPin,
} from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { SvgIcon, SvgIcon2, SvgIcon3 } from "@/public/icons/icons";
import UserHeader from "@/components/layout/headers/user-header";
import Footer from "@/components/Footer";
import api from "@/lib/axios";

const TYPE_CONFIG = {
  restaurant: {
    label: "Restaurants", singular: "Restaurant",
    bg: "bg-emerald-600", light: "bg-emerald-50 text-emerald-700",
    path: "restaurants",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  },
  hotel: {
    label: "Hotels", singular: "Hotel",
    bg: "bg-blue-600", light: "bg-blue-50 text-blue-700",
    path: "hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  club: {
    label: "Clubs", singular: "Club",
    bg: "bg-violet-600", light: "bg-violet-50 text-violet-700",
    path: "clubs",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  },
};

const PRICE_LABELS = { 1: "₦", 2: "₦₦", 3: "₦₦₦", 4: "₦₦₦₦" };
const PRICE_DESC = { 1: "Budget", 2: "Moderate", 3: "Upscale", 4: "Luxury" };
const DEBOUNCE_MS = 320;
const LS_RECENT = "rhace_recent_searches";
const MAX_RECENT = 8;

const R_CUISINES = [["nigerian", "Nigerian"], ["continental", "Continental"], ["chinese", "Chinese"], ["italian", "Italian"], ["indian", "Indian"], ["japanese", "Japanese"], ["lebanese", "Lebanese"], ["mexican", "Mexican"], ["american", "American"], ["french", "French"], ["mediterranean", "Mediterranean"], ["fast-food", "Fast Food"], ["seafood", "Seafood"], ["grills", "Grills"], ["pastry", "Pastry"], ["vegetarian", "Vegetarian"], ["fusion", "Fusion"]];
const R_DIETARY = [["halal", "Halal"], ["vegetarian", "Vegetarian"], ["vegan", "Vegan"], ["gluten-free", "Gluten-free"], ["kosher", "Kosher"], ["dairy-free", "Dairy-free"], ["nut-free", "Nut-free"]];
const R_DINING_STYLES = [["", "Any"], ["dine-in", "Dine-in"], ["takeout", "Takeout"], ["delivery", "Delivery"], ["buffet", "Buffet"], ["fine-dining", "Fine Dining"], ["casual", "Casual"]];
const R_SEATING = [["outdoor", "Outdoor"], ["bar-seating", "Bar Seating"], ["private-room", "Private Room"], ["high-chair", "High Chair"], ["rooftop", "Rooftop"], ["booth", "Booth"]];
const R_OCCASIONS = [["romantic", "Romantic"], ["birthday", "Birthday"], ["business", "Business"], ["group", "Group"], ["date-night", "Date Night"], ["family", "Family"], ["brunch", "Brunch"], ["celebrations", "Celebrations"]];
const R_MEAL_TIMES = [["breakfast", "Breakfast"], ["brunch", "Brunch"], ["lunch", "Lunch"], ["dinner", "Dinner"], ["late-night", "Late Night"], ["all-day", "All Day"]];
const R_RESERVATION = [["", "Any"], ["free", "Free"], ["deposit", "Deposit"], ["prepay", "Prepay"], ["walk-in-only", "Walk-in only"]];

const H_STAR_RATINGS = [["", "Any"], ["5", "★★★★★"], ["4", "★★★★"], ["3", "★★★"], ["2", "★★"]];
const H_PROPERTY_TYPE = [["", "Any"], ["hotel", "Hotel"], ["boutique", "Boutique"], ["resort", "Resort"], ["serviced-apartment", "Serviced Apt"], ["motel", "Motel"], ["guesthouse", "Guesthouse"]];
const H_AMENITIES = [["wifi", "WiFi"], ["pool", "Pool"], ["gym", "Gym"], ["spa", "Spa"], ["parking", "Parking"], ["restaurant", "Restaurant"], ["bar", "Bar"], ["airport-shuttle", "Airport Shuttle"], ["ac", "AC"], ["hot-tub", "Hot Tub"], ["room-service", "Room Service"], ["laundry", "Laundry"], ["business-center", "Business Center"], ["beach-access", "Beach Access"]];
const H_MEAL_PLANS = [["", "Any"], ["room-only", "Room Only"], ["breakfast", "Breakfast Incl."], ["half-board", "Half Board"], ["full-board", "Full Board"], ["all-inclusive", "All Inclusive"]];
const H_CANCEL = [["", "Any"], ["free", "Free Cancellation"], ["partial", "Partial Refund"], ["non-refundable", "Non-refundable"]];
const H_ACCESSIBILITY = [["step-free", "Step-free"], ["elevator", "Elevator"], ["wheelchair", "Wheelchair"], ["grab-bars", "Grab Bars"], ["visual-aids", "Visual Aids"]];

const C_VENUE_TYPES = [["", "Any"], ["club", "Club"], ["lounge", "Lounge"], ["rooftop", "Rooftop"], ["sports-bar", "Sports Bar"], ["cocktail-bar", "Cocktail Bar"], ["karaoke", "Karaoke"], ["jazz-bar", "Jazz Bar"], ["pool-bar", "Pool Bar"]];
const C_GENRES = [["afrobeats", "Afrobeats"], ["amapiano", "Amapiano"], ["house", "House"], ["rnb", "R&B"], ["hiphop", "Hip-Hop"], ["edm", "EDM"], ["reggae", "Reggae"], ["highlife", "Highlife"], ["dancehall", "Dancehall"], ["live-band", "Live Band"], ["mixed", "Mixed"]];
const C_PERFORMANCES = [["dj", "DJ"], ["live-band", "Live Band"], ["standup", "Stand-up"], ["karaoke", "Karaoke"], ["spoken-word", "Spoken Word"]];
const C_DRESS_CODES = [["", "Any"], ["smart-casual", "Smart Casual"], ["formal", "Formal"], ["casual", "Casual"], ["none", "No Code"]];
const C_AGE_POLICY = [["", "Any"], ["18+", "18+"], ["21+", "21+"], ["all-ages", "All Ages"]];

const ARRAY_KEYS = ["cuisines", "dietaryOptions", "seatOptions", "occasionTags", "mealTimes", "amenities", "accessibilityFeatures", "musicGenres", "livePerformanceTypes"];
const BOOL_KEYS = ["hasParking", "hasOutdoorSeating", "instantBook", "petFriendly", "hasVIPTables", "hasGuestlist", "hasOutdoorArea", "openNow"];

const CHIP_LABEL_MAPS = {
  cuisines: Object.fromEntries(R_CUISINES),
  dietaryOptions: Object.fromEntries(R_DIETARY),
  seatOptions: Object.fromEntries(R_SEATING),
  occasionTags: Object.fromEntries(R_OCCASIONS),
  mealTimes: Object.fromEntries(R_MEAL_TIMES),
  amenities: Object.fromEntries(H_AMENITIES),
  accessibilityFeatures: Object.fromEntries(H_ACCESSIBILITY),
  musicGenres: Object.fromEntries(C_GENRES),
  livePerformanceTypes: Object.fromEntries(C_PERFORMANCES),
};

const DEFAULT_FILTERS = {
  type: "", city: "", minRating: "", minPrice: "", maxPrice: "", sort: "rating",
  cuisines: [], dietaryOptions: [], diningStyle: "", seatOptions: [], occasionTags: [],
  mealTimes: [], reservationPolicy: "", hasParking: "", hasOutdoorSeating: "",
  starRating: "", propertyType: "", amenities: [], mealPlan: "",
  cancellationPolicy: "", instantBook: "", petFriendly: "", accessibilityFeatures: [],
  venueType: "", musicGenres: [], livePerformanceTypes: [], dressCode: "",
  agePolicy: "", hasVIPTables: "", hasGuestlist: "", hasOutdoorArea: "",
  entryFee: "", openNow: "",
};

const TYPE_SPECIFIC_KEYS = [
  ...ARRAY_KEYS, ...BOOL_KEYS,
  "diningStyle", "reservationPolicy", "starRating", "propertyType", "mealPlan",
  "cancellationPolicy", "instantBook", "petFriendly", "venueType", "dressCode", "agePolicy", "entryFee",
];

const getRecent = () => { try { return JSON.parse(localStorage.getItem(LS_RECENT)) || []; } catch { return []; } };
const saveRecent = (t) => { if (!t?.trim() || t.trim().length < 2) return; localStorage.setItem(LS_RECENT, JSON.stringify([t.trim(), ...getRecent().filter(s => s.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT))); };
const delRecent = (t) => localStorage.setItem(LS_RECENT, JSON.stringify(getRecent().filter(s => s !== t)));
const arrFromParam = (sp, key) => sp.get(key) ? sp.get(key).split(",").filter(Boolean) : [];

const filtersFromParams = (sp) => ({
  type: sp.get("type") || "",
  city: sp.get("city") || "",
  minRating: sp.get("minRating") || "",
  minPrice: sp.get("minPrice") || "",
  maxPrice: sp.get("maxPrice") || "",
  sort: sp.get("sort") || "rating",
  cuisines: arrFromParam(sp, "cuisines"),
  dietaryOptions: arrFromParam(sp, "dietaryOptions"),
  diningStyle: sp.get("diningStyle") || "",
  seatOptions: arrFromParam(sp, "seatOptions"),
  occasionTags: arrFromParam(sp, "occasionTags"),
  mealTimes: arrFromParam(sp, "mealTimes"),
  reservationPolicy: sp.get("reservationPolicy") || "",
  hasParking: sp.get("hasParking") || "",
  hasOutdoorSeating: sp.get("hasOutdoorSeating") || "",
  starRating: sp.get("starRating") || "",
  propertyType: sp.get("propertyType") || "",
  amenities: arrFromParam(sp, "amenities"),
  mealPlan: sp.get("mealPlan") || "",
  cancellationPolicy: sp.get("cancellationPolicy") || "",
  instantBook: sp.get("instantBook") || "",
  petFriendly: sp.get("petFriendly") || "",
  accessibilityFeatures: arrFromParam(sp, "accessibilityFeatures"),
  venueType: sp.get("venueType") || "",
  musicGenres: arrFromParam(sp, "musicGenres"),
  livePerformanceTypes: arrFromParam(sp, "livePerformanceTypes"),
  dressCode: sp.get("dressCode") || "",
  agePolicy: sp.get("agePolicy") || "",
  hasVIPTables: sp.get("hasVIPTables") || "",
  hasGuestlist: sp.get("hasGuestlist") || "",
  hasOutdoorArea: sp.get("hasOutdoorArea") || "",
  entryFee: sp.get("entryFee") || "",
  openNow: sp.get("openNow") || "",
});

const searchSvc = {
  suggestions: (q, type) =>
    api.get(`/search/suggestions?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ""}`).then(r => r.data.suggestions || []),
  search: (params) => {
    const cleaned = {};
    Object.entries(params).forEach(([k, v]) => {
      if (Array.isArray(v)) { if (v.length) cleaned[k] = v.join(","); }
      else if (v !== "" && v != null) cleaned[k] = v;
    });
    return api.get(`/search?${new URLSearchParams(cleaned)}`).then(r => r.data);
  },
  trending: (type) =>
    api.get(`/search/trending${type ? `?type=${type}` : ""}`).then(r => r.data.trending || []),
};

const shimmerStyle = {
  background: "linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s ease-in-out infinite",
};
const Shimmer = ({ className = "" }) => <div className={className} style={shimmerStyle} />;

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <Shimmer className="h-36 sm:h-44 w-full" />
    <div className="p-2.5 sm:p-3 space-y-2">
      <div className="flex justify-between gap-2">
        <Shimmer className="h-3.5 rounded w-2/3" />
        <Shimmer className="h-3.5 rounded w-8" />
      </div>
      <Shimmer className="h-3 rounded w-1/3" />
      <div className="flex gap-1"><Shimmer className="h-4 rounded w-12" /><Shimmer className="h-4 rounded w-14" /></div>
      <Shimmer className="h-3 rounded w-3/4" />
      <Shimmer className="h-7 rounded-lg w-full" />
    </div>
  </div>
);

const VenueCard = ({ vendor, activeType }) => {
  const navigate = useNavigate();
  const type = vendor.vendorType || activeType;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.restaurant;
  const photo = vendor.profileImages?.[0];
  const tags = type === "restaurant" ? (vendor.cuisines || [])
    : type === "club" ? (vendor.musicGenres || vendor.categories || [])
      : (vendor.amenities || []).slice(0, 3);

  return (
    <div onClick={() => navigate(`/${cfg.path}/${vendor._id}`)}
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.11)] transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative h-36 sm:h-44 overflow-hidden bg-gray-100 shrink-0">
        {photo
          ? <img src={photo} alt={vendor.businessName} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl font-black text-gray-300 select-none">{vendor.businessName?.[0]?.toUpperCase() || "?"}</span>
          </div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        <span className={`absolute top-2 left-2 ${cfg.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>{cfg.singular}</span>
        {type === "hotel" && vendor.starRating > 0
          ? <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-amber-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">{"★".repeat(vendor.starRating)}</span>
          : vendor.priceRange > 0
            ? <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">{PRICE_LABELS[vendor.priceRange]} · {PRICE_DESC[vendor.priceRange]}</span>
            : null
        }
        {type === "club" && vendor.entryFee != null && (
          <span className="absolute bottom-2 right-2 bg-violet-600/80 backdrop-blur-sm text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {vendor.entryFee === 0 ? "Free Entry" : `₦${vendor.entryFee?.toLocaleString()}`}
          </span>
        )}
        {vendor.isVerified && <span className="absolute top-2 right-7 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">✓ Verified</span>}
        {vendor.offer && !vendor.isVerified && (
          <span className="absolute top-2 right-7 bg-amber-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full max-w-[90px] truncate">{vendor.offer}</span>
        )}
        <button onClick={e => e.stopPropagation()} className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:text-red-400 transition-colors">
          <FiHeart className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="flex flex-col flex-1 p-2.5 sm:p-3 gap-1.5">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-1 flex-1">{vendor.businessName}</h3>
          {vendor.rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <FaStar className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-xs font-bold text-gray-900">{vendor.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        {vendor.vendorTypeCategory && vendor.vendorTypeCategory !== "General" && (
          <p className="text-[10px] text-gray-400 capitalize leading-none">{vendor.vendorTypeCategory}</p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, i) => <span key={i} className="bg-gray-100 text-gray-500 text-[10px] font-medium px-1.5 py-0.5 rounded capitalize">{tag}</span>)}
            {tags.length > 2 && <span className="bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0.5 rounded">+{tags.length - 2}</span>}
          </div>
        )}
        {type === "restaurant" && vendor.diningStyles?.length > 0 && (
          <p className="text-[10px] text-gray-400 capitalize">{vendor.diningStyles.slice(0, 2).join(" · ")}</p>
        )}
        {type === "hotel" && vendor.mealPlan && vendor.mealPlan !== "room-only" && (
          <p className="text-[10px] text-emerald-600 font-medium capitalize">{vendor.mealPlan.replace(/-/g, " ")} included</p>
        )}
        {type === "club" && vendor.dressCode && (
          <p className="text-[10px] text-gray-400 capitalize">👔 {vendor.dressCode}</p>
        )}
        <div className="flex items-center gap-1 text-gray-400 text-[10px] sm:text-[11px] mt-auto pt-1">
          <FiMapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="line-clamp-1">{vendor.address || "Location not set"}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); navigate(`/${cfg.path}/${vendor._id}`); }}
          className="w-full mt-1 py-1.5 sm:py-2 rounded-lg text-white text-[11px] sm:text-xs font-semibold bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:opacity-90 transition-opacity">
          {type === "restaurant" ? "Reserve Table" : "Book Now"}
        </button>
      </div>
    </div>
  );
};

const T = ({ children }) => <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{children}</p>;
const Hr = () => <div className="h-px bg-gray-100" />;

const Radio = ({ val, cur, set, children, count }) => (
  <label onClick={() => set(val)} className="flex items-center justify-between cursor-pointer group py-0.5 px-1 rounded hover:bg-gray-50 transition-colors">
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
  <label onClick={() => set(cur === "true" ? "" : "true")} className="flex items-center justify-between cursor-pointer group py-1 px-1 rounded hover:bg-gray-50 transition-colors">
    <span className={`text-xs ${cur === "true" ? "font-semibold text-gray-900" : "text-gray-600"}`}>{children}</span>
    <div className={`w-8 h-4 rounded-full transition-all relative shrink-0 ${cur === "true" ? "bg-[#0A6C6D]" : "bg-gray-200"}`}>
      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${cur === "true" ? "left-4" : "left-0.5"}`} />
    </div>
  </label>
);

const RestaurantFilters = ({ f, onChange }) => (
  <>
    <div><T>Cuisine</T><div className="flex flex-wrap gap-1.5">{R_CUISINES.map(([val, label]) => <MultiPill key={val} val={val} cur={f.cuisines} set={v => onChange("cuisines", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Dietary Options</T><div className="flex flex-wrap gap-1.5">{R_DIETARY.map(([val, label]) => <MultiPill key={val} val={val} cur={f.dietaryOptions} set={v => onChange("dietaryOptions", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Dining Style</T><div className="space-y-0.5">{R_DINING_STYLES.map(([val, label]) => <Radio key={val} val={val} cur={f.diningStyle} set={v => onChange("diningStyle", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Seating</T><div className="flex flex-wrap gap-1.5">{R_SEATING.map(([val, label]) => <MultiPill key={val} val={val} cur={f.seatOptions} set={v => onChange("seatOptions", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Occasion</T><div className="flex flex-wrap gap-1.5">{R_OCCASIONS.map(([val, label]) => <MultiPill key={val} val={val} cur={f.occasionTags} set={v => onChange("occasionTags", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Meal Time</T><div className="flex flex-wrap gap-1.5">{R_MEAL_TIMES.map(([val, label]) => <MultiPill key={val} val={val} cur={f.mealTimes} set={v => onChange("mealTimes", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Reservation Policy</T><div className="space-y-0.5">{R_RESERVATION.map(([val, label]) => <Radio key={val} val={val} cur={f.reservationPolicy} set={v => onChange("reservationPolicy", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Extras</T><div className="space-y-0.5">
      <Toggle cur={f.hasParking} set={v => onChange("hasParking", v)}>Has Parking</Toggle>
      <Toggle cur={f.hasOutdoorSeating} set={v => onChange("hasOutdoorSeating", v)}>Outdoor Seating</Toggle>
      <Toggle cur={f.openNow} set={v => onChange("openNow", v)}>Open Now</Toggle>
    </div></div>
  </>
);

const HotelFilters = ({ f, onChange }) => (
  <>
    <div><T>Star Rating</T><div className="space-y-0.5">{H_STAR_RATINGS.map(([val, label]) => <Radio key={val} val={val} cur={f.starRating} set={v => onChange("starRating", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Property Type</T><div className="space-y-0.5">{H_PROPERTY_TYPE.map(([val, label]) => <Radio key={val} val={val} cur={f.propertyType} set={v => onChange("propertyType", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Amenities</T><div className="flex flex-wrap gap-1.5">{H_AMENITIES.map(([val, label]) => <MultiPill key={val} val={val} cur={f.amenities} set={v => onChange("amenities", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Meal Plan</T><div className="space-y-0.5">{H_MEAL_PLANS.map(([val, label]) => <Radio key={val} val={val} cur={f.mealPlan} set={v => onChange("mealPlan", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Cancellation</T><div className="space-y-0.5">{H_CANCEL.map(([val, label]) => <Radio key={val} val={val} cur={f.cancellationPolicy} set={v => onChange("cancellationPolicy", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Accessibility</T><div className="flex flex-wrap gap-1.5">{H_ACCESSIBILITY.map(([val, label]) => <MultiPill key={val} val={val} cur={f.accessibilityFeatures} set={v => onChange("accessibilityFeatures", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Extras</T><div className="space-y-0.5">
      <Toggle cur={f.instantBook} set={v => onChange("instantBook", v)}>Instant Book</Toggle>
      <Toggle cur={f.petFriendly} set={v => onChange("petFriendly", v)}>Pet Friendly</Toggle>
      <Toggle cur={f.openNow} set={v => onChange("openNow", v)}>Open Now</Toggle>
    </div></div>
  </>
);

const ClubFilters = ({ f, onChange }) => (
  <>
    <div><T>Venue Type</T><div className="space-y-0.5">{C_VENUE_TYPES.map(([val, label]) => <Radio key={val} val={val} cur={f.venueType} set={v => onChange("venueType", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Music Genre</T><div className="flex flex-wrap gap-1.5">{C_GENRES.map(([val, label]) => <MultiPill key={val} val={val} cur={f.musicGenres} set={v => onChange("musicGenres", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Live Performances</T><div className="flex flex-wrap gap-1.5">{C_PERFORMANCES.map(([val, label]) => <MultiPill key={val} val={val} cur={f.livePerformanceTypes} set={v => onChange("livePerformanceTypes", v)}>{label}</MultiPill>)}</div></div>
    <Hr />
    <div><T>Dress Code</T><div className="space-y-0.5">{C_DRESS_CODES.map(([val, label]) => <Radio key={val} val={val} cur={f.dressCode} set={v => onChange("dressCode", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Age Policy</T><div className="space-y-0.5">{C_AGE_POLICY.map(([val, label]) => <Radio key={val} val={val} cur={f.agePolicy} set={v => onChange("agePolicy", v)}>{label}</Radio>)}</div></div>
    <Hr />
    <div><T>Entry Fee</T><div className="flex flex-wrap gap-1.5">
      {[["", "Any"], ["0", "Free Entry"], ["paid", "Paid Entry"]].map(([val, label]) => <Pill key={val} val={val} cur={f.entryFee} set={v => onChange("entryFee", v)}>{label}</Pill>)}
    </div></div>
    <Hr />
    <div><T>Extras</T><div className="space-y-0.5">
      <Toggle cur={f.hasVIPTables} set={v => onChange("hasVIPTables", v)}>VIP Tables</Toggle>
      <Toggle cur={f.hasGuestlist} set={v => onChange("hasGuestlist", v)}>Guestlist Available</Toggle>
      <Toggle cur={f.hasOutdoorArea} set={v => onChange("hasOutdoorArea", v)}>Outdoor Area</Toggle>
      <Toggle cur={f.openNow} set={v => onChange("openNow", v)}>Open Now</Toggle>
    </div></div>
  </>
);

const FilterPanel = ({ filters: f, onChange, onClear, facets, hasFilters, onClose }) => {
  const typeCount = t => facets?.byType?.find(x => x._id === t)?.count;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
          <span className="font-bold text-gray-900 text-sm">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && <button onClick={onClear} className="text-[11px] font-bold text-[#0A6C6D] hover:underline flex items-center gap-0.5"><RotateCcw className="w-2.5 h-2.5" /> Clear</button>}
          {onClose && <button onClick={onClose} className="p-1 rounded border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors"><X className="w-3 h-3" /></button>}
        </div>
      </div>

      {!f.type && (
        <>
          <div><T>Type</T><div className="space-y-0.5">
            <Radio val="" cur={f.type} set={v => onChange("type", v)}>All Types</Radio>
            <Radio val="restaurant" cur={f.type} set={v => onChange("type", v)} count={typeCount("restaurant")}>Restaurants</Radio>
            <Radio val="hotel" cur={f.type} set={v => onChange("type", v)} count={typeCount("hotel")}>Hotels</Radio>
            <Radio val="club" cur={f.type} set={v => onChange("type", v)} count={typeCount("club")}>Clubs</Radio>
          </div></div>
          <Hr />
        </>
      )}

      <div><T>Sort By</T><div className="space-y-0.5">
        {[["rating", "Top Rated"], ["price_asc", "Price: Low → High"], ["price_desc", "Price: High → Low"], ["newest", "Newest"]].map(([val, label]) => (
          <Radio key={val} val={val} cur={f.sort} set={v => onChange("sort", v)}>{label}</Radio>
        ))}
      </div></div>
      <Hr />

      <div><T>Min Rating</T><div className="flex flex-wrap gap-1.5">
        {[["", "Any"], ["4.5", "4.5+"], ["4", "4.0+"], ["3", "3.0+"]].map(([val, label]) => (
          <Pill key={val} val={val} cur={f.minRating} set={v => onChange("minRating", v)}>{label}</Pill>
        ))}
      </div></div>
      <Hr />

      <div><T>Price Range</T><div className="grid grid-cols-2 gap-1.5">
        {[["", "All"], ["1", "₦ Budget"], ["2", "₦₦ Moderate"], ["3", "₦₦₦ Upscale"], ["4", "₦₦₦₦ Luxury"]].map(([val, label]) => (
          <Pill key={val} val={val} cur={f.minPrice} set={v => { onChange("minPrice", v); onChange("maxPrice", v); }}>{label}</Pill>
        ))}
      </div></div>
      <Hr />

      {f.type === "restaurant" && <RestaurantFilters f={f} onChange={onChange} />}
      {f.type === "hotel" && <HotelFilters f={f} onChange={onChange} />}
      {f.type === "club" && <ClubFilters f={f} onChange={onChange} />}

      <Hr />
      <div><T>City</T>
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input type="text" placeholder="Lagos, Abuja, PH..." value={f.city} onChange={e => onChange("city", e.target.value)}
            className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0A6C6D] focus:ring-1 focus:ring-[#0A6C6D] transition-all" />
        </div>
      </div>
    </div>
  );
};

const buildChips = (f, onChange) => {
  const chips = [];
  if (f.type) chips.push({ key: "type", label: TYPE_CONFIG[f.type]?.label, clear: () => onChange("type", "") });
  if (f.city) chips.push({ key: "city", label: `📍 ${f.city}`, clear: () => onChange("city", "") });
  if (f.minRating) chips.push({ key: "minRating", label: `${f.minRating}+ ⭐`, clear: () => onChange("minRating", "") });
  if (f.minPrice) chips.push({ key: "price", label: PRICE_LABELS[f.minPrice] || "₦", clear: () => { onChange("minPrice", ""); onChange("maxPrice", ""); } });
  if (f.sort !== "rating") chips.push({ key: "sort", label: { price_asc: "Price ↑", price_desc: "Price ↓", newest: "Newest" }[f.sort], clear: () => onChange("sort", "rating") });
  if (f.diningStyle) chips.push({ key: "diningStyle", label: f.diningStyle, clear: () => onChange("diningStyle", "") });
  if (f.reservationPolicy) chips.push({ key: "reservationPolicy", label: f.reservationPolicy, clear: () => onChange("reservationPolicy", "") });
  if (f.starRating) chips.push({ key: "starRating", label: "★".repeat(Number(f.starRating)), clear: () => onChange("starRating", "") });
  if (f.propertyType) chips.push({ key: "propertyType", label: f.propertyType, clear: () => onChange("propertyType", "") });
  if (f.mealPlan) chips.push({ key: "mealPlan", label: f.mealPlan, clear: () => onChange("mealPlan", "") });
  if (f.cancellationPolicy) chips.push({ key: "cancellationPolicy", label: f.cancellationPolicy, clear: () => onChange("cancellationPolicy", "") });
  if (f.venueType) chips.push({ key: "venueType", label: f.venueType, clear: () => onChange("venueType", "") });
  if (f.dressCode) chips.push({ key: "dressCode", label: f.dressCode, clear: () => onChange("dressCode", "") });
  if (f.agePolicy) chips.push({ key: "agePolicy", label: f.agePolicy, clear: () => onChange("agePolicy", "") });
  if (f.entryFee !== "") chips.push({ key: "entryFee", label: f.entryFee === "0" ? "Free Entry" : "Paid Entry", clear: () => onChange("entryFee", "") });
  BOOL_KEYS.forEach(k => {
    if (f[k] === "true") chips.push({ key: k, label: k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()), clear: () => onChange(k, "") });
  });
  ARRAY_KEYS.forEach(k => {
    (f[k] || []).forEach(v => chips.push({ key: `${k}-${v}`, label: CHIP_LABEL_MAPS[k]?.[v] || v, clear: () => onChange(k, (f[k] || []).filter(x => x !== v)) }));
  });
  return chips;
};

const FilterChips = ({ filters, onChange, onClear }) => {
  const chips = buildChips(filters, onChange);
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3">
      {chips.map(chip => (
        <span key={chip.key} className="inline-flex items-center gap-1 bg-[#0A6C6D]/10 text-[#0A6C6D] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#0A6C6D]/20">
          {chip.label}<button onClick={chip.clear}><X className="w-2.5 h-2.5" /></button>
        </span>
      ))}
      <button onClick={onClear} className="text-[11px] text-gray-400 hover:text-gray-600 underline">Clear all</button>
    </div>
  );
};

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
      <p className="text-xs text-gray-500 order-2 sm:order-1"><span className="font-semibold text-gray-800">{totalCount}</span> results · Page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button disabled={!hasPrevPage} onClick={() => onPage(currentPage - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft className="w-3.5 h-3.5" /></button>
        {deduped.map((p, i) => p === "..."
          ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">…</span>
          : <button key={p} onClick={() => onPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold border transition-all ${p === currentPage ? "bg-[#0A6C6D] border-[#0A6C6D] text-white" : "border-gray-200 text-gray-600 hover:border-gray-800"}`}>{p}</button>
        )}
        <button disabled={!hasNextPage} onClick={() => onPage(currentPage + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSugLoading, setIsSugLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(getRecent());
  const [trending, setTrending] = useState([]);
  const [isTrendLoading, setIsTrendLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false });
  const [facets, setFacets] = useState({});
  const [activeQuery, setActiveQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  const hasActiveSearch = !!searchParams.get("q");
  const hasResults = results.length > 0;
  const hasFilters = Object.entries(filters).some(([k, v]) => {
    if (k === "type" || k === "sort") return false;
    return Array.isArray(v) ? v.length > 0 : (v !== "" && v != null);
  }) || filters.sort !== "rating";

  const activeFilterCount = [
    filters.city, filters.minRating, filters.minPrice,
    filters.sort !== "rating" ? 1 : null,
    filters.diningStyle, filters.reservationPolicy, filters.starRating, filters.propertyType,
    filters.mealPlan, filters.cancellationPolicy, filters.venueType, filters.dressCode,
    filters.agePolicy, filters.entryFee !== "" ? 1 : null,
    ...ARRAY_KEYS.map(k => filters[k]?.length ? 1 : null),
    ...BOOL_KEYS.map(k => filters[k] === "true" ? 1 : null),
  ].filter(Boolean).length;

  const showRecent = isFocused && inputValue.trim().length < 2 && recentSearches.length > 0;
  const showTrending = isFocused && inputValue.trim().length < 2 && !showRecent;
  const showSuggestions = isFocused && inputValue.trim().length >= 2;
  const showDropdown = isFocused && (showRecent || showTrending || showSuggestions);

  useEffect(() => {
    setIsTrendLoading(true);
    searchSvc.trending(filters.type || undefined).then(setTrending).catch(() => { }).finally(() => setIsTrendLoading(false));
  }, [filters.type]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (inputValue.trim().length < 2) { setSuggestions([]); setIsSugLoading(false); return; }
    setIsSugLoading(true);
    debounceRef.current = setTimeout(() => {
      searchSvc.suggestions(inputValue, filters.type || undefined)
        .then(setSuggestions).catch(() => setSuggestions([])).finally(() => setIsSugLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue, filters.type]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q) { setResults([]); setActiveQuery(""); return; }
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setIsLoading(true); setError(null);
    const parsed = filtersFromParams(searchParams);
    setFilters(parsed);
    searchSvc.search({ q, page: searchParams.get("page") || "1", limit: "12", ...parsed })
      .then(data => { setResults(data.data || []); setPagination(data.pagination || {}); setFacets(data.facets || {}); setActiveQuery(q); })
      .catch(err => { if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") return; setError("Search failed. Please try again."); setResults([]); })
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  const submitSearch = useCallback((term) => {
    const q = (term !== undefined ? term : inputValue).trim();
    if (!q) return;
    saveRecent(q); setRecentSearches(getRecent());
    setInputValue(q); setIsFocused(false); setSuggestions([]);
    const next = new URLSearchParams(searchParams);
    next.set("q", q); next.set("page", "1");
    setSearchParams(next);
  }, [inputValue, searchParams, setSearchParams]);

  const updateFilter = useCallback((key, value) => {
    const next = new URLSearchParams(searchParams);
    if (Array.isArray(value)) {
      value.length ? next.set(key, value.join(",")) : next.delete(key);
    } else {
      value !== "" && value != null ? next.set(key, String(value)) : next.delete(key);
    }
    if (key === "type") {
      TYPE_SPECIFIC_KEYS.forEach(k => next.delete(k));
      setFilters(prev => ({ ...DEFAULT_FILTERS, type: value, sort: prev.sort, city: prev.city, minRating: prev.minRating, minPrice: prev.minPrice, maxPrice: prev.maxPrice }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    next.set("page", "1");
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    const q = searchParams.get("q");
    const type = filters.type;
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (type) next.set("type", type);
    setFilters({ ...DEFAULT_FILTERS, type });
    setSearchParams(next);
  }, [searchParams, setSearchParams, filters.type]);

  const goToPage = useCallback((page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen mt-24 bg-gray-50">
      <UserHeader />

      <div className="z-40 relative bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">

          <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto scrollbar-hide pb-px">
            {[
              { val: "", label: "All", icon: <Search className="w-3 h-3" /> },
              { val: "restaurant", label: "Restaurants", icon: <figure className="w-3 h-3 flex items-center shrink-0"><SvgIcon isActive={filters.type !== "restaurant"} /></figure> },
              { val: "hotel", label: "Hotels", icon: <figure className="w-3 h-3 flex items-center shrink-0"><SvgIcon2 isActive={filters.type !== "hotel"} /></figure> },
              { val: "club", label: "Clubs", icon: <figure className="w-3 h-3 flex items-center shrink-0"><SvgIcon3 isActive={filters.type !== "club"} /></figure> },
            ].map(({ val, label, icon }) => (
              <button key={val} onClick={() => updateFilter("type", val)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${filters.type === val ? "bg-[#0A6C6D] text-white border-[#0A6C6D]" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#0A6C6D] hover:text-[#0A6C6D]"
                  }`}>{icon} {label}
              </button>
            ))}
          </div>

          <div className="flex z-10 gap-2">
            <div className="flex-1 relative">
              <div className={`flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2.5 transition-all ${showDropdown ? "border-[#0A6C6D] ring-2 ring-[#0A6C6D]/10 rounded-b-none" : "border-gray-200 hover:border-gray-400"
                }`}>
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input ref={inputRef} type="text" autoComplete="off" spellCheck="false"
                  placeholder={filters.type ? `Search ${TYPE_CONFIG[filters.type]?.label.toLowerCase()}...` : "Search hotels, restaurants, clubs, cuisines..."}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 160)}
                  onKeyDown={e => { if (e.key === "Enter") submitSearch(); if (e.key === "Escape") setIsFocused(false); }}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 min-w-0"
                />
                {inputValue && (
                  <button onMouseDown={e => e.preventDefault()} onClick={() => setInputValue("")} className="text-gray-400 hover:text-gray-700 shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {showDropdown && (
                <div className="absolute left-0 right-0 top-full bg-white border-2 border-[#0A6C6D] border-t-0 rounded-b-xl shadow-2xl z-[999] max-h-80 sm:max-h-96 overflow-y-auto">
                  {showRecent && (
                    <div>
                      <div className="flex items-center justify-between px-3 sm:px-4 pt-2.5 pb-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent</span>
                        <button onMouseDown={e => e.preventDefault()} onClick={() => { localStorage.removeItem(LS_RECENT); setRecentSearches([]); }} className="text-[10px] font-bold text-[#0A6C6D]">Clear all</button>
                      </div>
                      {recentSearches.map(term => (
                        <div key={term} onMouseDown={e => e.preventDefault()} onClick={() => submitSearch(term)} className="flex items-center gap-2.5 px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer group">
                          <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          <span className="text-sm text-gray-700 flex-1 truncate">{term}</span>
                          <button onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); delRecent(term); setRecentSearches(getRecent()); }} className="text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showTrending && (
                    <div>
                      <div className="flex items-center gap-1.5 px-3 sm:px-4 pt-2.5 pb-1">
                        <TrendingUp className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trending</span>
                      </div>
                      {isTrendLoading
                        ? <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</div>
                        : trending.slice(0, 6).map(v => {
                          const cfg = TYPE_CONFIG[v.vendorType];
                          return (
                            <div key={v._id} onMouseDown={e => e.preventDefault()} onClick={() => submitSearch(v.businessName)} className="flex items-center gap-2.5 px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                {v.profileImages?.[0] ? <img src={v.profileImages[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-300">{v.businessName?.[0]}</div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{v.businessName}</p>
                                <p className="text-[11px] text-gray-400 capitalize">{cfg?.singular} · {v.address?.split(",")[0]}</p>
                              </div>
                              {v.rating > 0 && <div className="flex items-center gap-0.5 shrink-0"><FaStar className="w-2.5 h-2.5 text-amber-400" /><span className="text-xs font-bold text-gray-700">{v.rating.toFixed(1)}</span></div>}
                            </div>
                          );
                        })
                      }
                    </div>
                  )}

                  {showSuggestions && (
                    <div>
                      <div className="px-3 sm:px-4 pt-2.5 pb-1"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suggestions</span></div>
                      {isSugLoading
                        ? <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...</div>
                        : suggestions.length > 0
                          ? suggestions.map(v => {
                            const cfg = TYPE_CONFIG[v.vendorType];
                            return (
                              <div key={v._id} onMouseDown={e => e.preventDefault()} onClick={() => submitSearch(v.businessName)} className="flex items-center gap-2.5 px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer group">
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                  {v.profileImages?.[0] ? <img src={v.profileImages[0]} alt="" className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-xs font-black ${cfg?.light || "text-gray-400"}`}>{v.businessName?.[0]}</div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{v.businessName}</p>
                                  <p className="text-[11px] text-gray-400 capitalize">{cfg?.singular}{v.vendorTypeCategory && v.vendorTypeCategory !== "General" ? ` · ${v.vendorTypeCategory}` : ""}{v.address ? ` · ${v.address.split(",")[0]}` : ""}</p>
                                </div>
                                {v.rating > 0 && <div className="flex items-center gap-0.5 shrink-0"><FaStar className="w-2.5 h-2.5 text-amber-400" /><span className="text-xs font-bold text-gray-700">{v.rating.toFixed(1)}</span></div>}
                                <ArrowUpRight className="w-3 h-3 text-gray-200 group-hover:text-gray-400 shrink-0" />
                              </div>
                            );
                          })
                          : <p className="px-3 py-4 text-center text-sm text-gray-400">No results for "{inputValue}"</p>
                      }
                      {inputValue.trim() && (
                        <div onMouseDown={e => e.preventDefault()} onClick={() => submitSearch(inputValue)} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50 cursor-pointer text-[#0A6C6D]">
                          <Search className="w-3.5 h-3.5" />
                          <span className="text-sm font-semibold">Search "<strong>{inputValue}</strong>"</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => submitSearch()} className="px-3 sm:px-5 py-2.5 bg-[#0A6C6D] text-white text-sm font-semibold rounded-xl hover:bg-[#084F4F] transition-colors shrink-0">
              <span className="hidden sm:inline">Search</span><Search className="w-4 h-4 sm:hidden" />
            </button>

            <button onClick={() => setIsFilterOpen(true)} className="lg:hidden relative px-2.5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 transition-colors shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0A6C6D] text-white text-[9px] font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {hasActiveSearch ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex gap-5 items-start">
            <aside className="hidden lg:block w-56 shrink-0 sticky top-[106px] max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <FilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} facets={facets} hasFilters={hasFilters} />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {!isLoading && (
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <p className="text-sm text-gray-600">
                    {pagination.totalCount > 0
                      ? <><span className="font-bold text-gray-900">{pagination.totalCount}</span> results for "<span className="font-semibold text-[#0A6C6D]">{activeQuery}</span>"</>
                      : <>No results for "<span className="font-semibold">{activeQuery}</span>"</>}
                  </p>
                  <select value={filters.sort} onChange={e => updateFilter("sort", e.target.value)} className="hidden sm:block text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:border-[#0A6C6D] cursor-pointer shrink-0">
                    <option value="rating">Top Rated</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              )}

              <FilterChips filters={filters} onChange={updateFilter} onClear={clearFilters} />

              {error && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <AlertCircle className="w-9 h-9 text-red-400" />
                  <p className="text-red-600 font-semibold text-sm">{error}</p>
                  <button onClick={() => submitSearch(activeQuery)} className="px-4 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors">Try Again</button>
                </div>
              )}

              {isLoading && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {!isLoading && hasResults && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {results.map(v => <VenueCard key={v._id} vendor={v} activeType={filters.type} />)}
                </div>
              )}

              {!isLoading && !error && hasActiveSearch && !hasResults && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center"><Search className="w-6 h-6 text-gray-300" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">No vendors found</h3>
                    <p className="text-gray-500 text-sm">Try different keywords or adjust filters</p>
                  </div>
                  {hasFilters && <button onClick={clearFilters} className="px-4 py-2 bg-[#0A6C6D] text-white text-sm font-semibold rounded-xl hover:bg-[#084F4F] transition-colors">Clear Filters</button>}
                </div>
              )}

              {!isLoading && hasResults && <Pagination pagination={pagination} onPage={goToPage} />}
            </div>
          </div>
        </div>

      ) : (
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-14">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1">Discover Vendors</h2>
            <p className="text-gray-400 text-sm">Find and book the best spots near you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { type: "restaurant", label: "Restaurants", sub: "Reserve your table", icon: <SvgIcon isActive={false} /> },
              { type: "hotel", label: "Hotels", sub: "Book your stay", icon: <SvgIcon2 isActive={false} /> },
              { type: "club", label: "Clubs", sub: "Plan your night", icon: <SvgIcon3 isActive={false} /> },
            ].map(({ type, label, sub, icon }) => {
              const cfg = TYPE_CONFIG[type];
              return (
                <button key={type} onClick={() => { updateFilter("type", type); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="group relative h-32 sm:h-40 overflow-hidden rounded-lg text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
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
            })}
          </div>

          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Popular</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Lagos Restaurants", "Abuja Hotels", "Victoria Island", "Lekki", "PH Clubs", "Fine Dining", "Suya", "Rooftop Bar"].map(s => (
                <button key={s} onClick={() => submitSearch(s)} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#0A6C6D] hover:text-[#0A6C6D] transition-all font-medium">{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
            <div className="pt-3 pb-1 flex justify-center shrink-0"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <FilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} facets={facets} hasFilters={hasFilters} onClose={() => setIsFilterOpen(false)} />
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
              <button onClick={() => setIsFilterOpen(false)} className="w-full py-2.5 bg-[#0A6C6D] text-white text-sm font-semibold rounded-xl hover:bg-[#084F4F] transition-colors">
                Show {pagination.totalCount > 0 ? `${pagination.totalCount} Results` : "Results"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SearchPage;