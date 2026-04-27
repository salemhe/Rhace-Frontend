import api from "@/lib/axios";
import { format } from "date-fns";
import {
  ArrowUpRight,
  Clock,
  Loader2,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import { DateDropdown } from "./DateDropdown";
import { GuestDropdown } from "./GuestDropdown";
import { TimeDropdown } from "./TimeDropdown";

// ─── constants (mirror SearchPage) ───────────────────────────────────────────
const DEBOUNCE_MS = 500;
const LS_RECENT = "rhace_recent_searches";
const MAX_RECENT = 8;

const TYPE_CONFIG = {
  restaurant: {
    label: "Restaurants",
    singular: "Restaurant",
    path: "restaurants",
  },
  hotel: { label: "Hotels", singular: "Hotel", path: "hotels" },
  club: { label: "Clubs", singular: "Club", path: "clubs" },
};

// ─── local-storage helpers ────────────────────────────────────────────────────
const getRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_RECENT)) || [];
  } catch {
    return [];
  }
};
const saveRecent = (t) => {
  if (!t?.trim() || t.trim().length < 2) return;
  localStorage.setItem(
    LS_RECENT,
    JSON.stringify(
      [
        t.trim(),
        ...getRecent().filter((s) => s.toLowerCase() !== t.toLowerCase()),
      ].slice(0, MAX_RECENT),
    ),
  );
};
const delRecent = (t) =>
  localStorage.setItem(
    LS_RECENT,
    JSON.stringify(getRecent().filter((s) => s !== t)),
  );

// ─── normalise whatever the API returns ──────────────────────────────────────
const normalizeSuggestion = (item, fallbackType) => {
  if (!item) return null;
  if (typeof item === "string")
    return {
      _id: item,
      businessName: item,
      vendorType: fallbackType || "restaurant",
      profileImages: [],
      address: "",
      rating: 0,
    };
  return {
    _id: item._id || item.id || item.businessName || item.name || "",
    businessName:
      item.businessName || item.name || item.title || item.value || "",
    vendorType: item.vendorType || item.type || fallbackType || "restaurant",
    profileImages: item.profileImages || item.images || [],
    address: item.address || item.location || "",
    rating: item.rating || 0,
    vendorTypeCategory: item.vendorTypeCategory || item.category || "",
  };
};

// ─── search service (same logic as SearchPage) ───────────────────────────────
const searchSvc = {
  suggestions: async (q, type, location) => {
    if (!q) return [];
    const params = new URLSearchParams();
    params.set("search", q);
    if (type) params.set("type", type);
    // if (location?.lat != null && location?.lng != null) {
    //   params.set("latitude",  String(location.lat));
    //   params.set("longitude", String(location.lng));
    // }
    try {
      const res = await api.get(`/search/suggestions?${params}`);
      const raw = res.data?.suggestions
      return raw;
    } catch {
      /* fall through */
    }
    try {
      const fp = new URLSearchParams(params);
      fp.set("limit", "5");
      const res = await api.get(`/search?${fp}`);
      const data = res.data;
      const items = Array.isArray(data) ? data : data?.data || [];
      return items
    } catch {
      return [];
    }
  },
  trending: (type) =>
    api
      .get(`/search/trending${type ? `?type=${type}` : ""}`)
      .then((r) => r.data.trending || []),
};

// ─── Shared inline dropdown ───────────────────────────────────────────────────
const SearchDropdown = ({
  inputValue,
  isFocused,
  activeType,
  userLocation,
  onSelect,
  onSubmit,
  onDeleteRecent,
  onClearRecent,
  recentSearches,
  setRecentSearches,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isSugLoading, setIsSugLoading] = useState(false);
  const [trending, setTrending] = useState([]);
  const [isTrendLoad, setIsTrendLoad] = useState(false);
  const debounceRef = useRef(null);

  // Trending
  useEffect(() => {
    setIsTrendLoad(true);
    searchSvc
      .trending(activeType || undefined)
      .then(setTrending)
      .catch(() => {})
      .finally(() => setIsTrendLoad(false));
  }, [activeType]);

  // Suggestions
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (inputValue.trim().length < 1) {
      setSuggestions([]);
      setIsSugLoading(false);
      return;
    }
    setIsSugLoading(true);
    debounceRef.current = setTimeout(() => {
      searchSvc
        .suggestions(inputValue, activeType || undefined, userLocation)
        .then((data) => {
          setSuggestions(data)
        })
        .catch(() => setSuggestions([]))
        .finally(() => setIsSugLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue, activeType, userLocation?.lat, userLocation?.lng]);

  if (!isFocused) return null;

  const showRecent =
    inputValue.trim().length === 0 && recentSearches.length > 0;
  const showTrending = inputValue.trim().length === 0 && !showRecent;
  const showSuggestions = inputValue.trim().length >= 1;

  return (
    <div className="absolute left-0 right-0 top-full w-full md:w-88 bg-white rounded-2xl shadow-2xl z-[999] max-h-80 overflow-y-auto">
      {/* ── Recent ── */}
      {showRecent && (
        <div>
          <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Recent
            </span>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                localStorage.removeItem(LS_RECENT);
                setRecentSearches([]);
              }}
              className="text-[10px] font-bold text-[#0A6C6D]"
            >
              Clear all
            </button>
          </div>
          {recentSearches.map((term) => (
            <div
              key={term}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(term)}
              className="flex items-center gap-2.5 px-4 py-4 hover:bg-gray-50 cursor-pointer group"
            >
              <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className="text-sm text-start line-clamp-1 text-gray-700 flex-1 truncate">
                {term}
              </span>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRecent(term);
                }}
                className="text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Trending ── */}
      {showTrending && (
        <div>
          <div className="flex items-center gap-1.5 px-4 pt-2.5 pb-1">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Trending
            </span>
          </div>
          {isTrendLoad ? (
            <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
            </div>
          ) : (
            trending.slice(0, 6).map((v) => {
              const cfg = TYPE_CONFIG[v.vendorType];
              return (
                <div
                  key={v._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect(v.businessName)}
                  className="flex items-cente gap-2.5 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {v.profileImages?.[0] ? (
                      <img
                        src={v.profileImages[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-300">
                        {v.businessName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1  justify-items-start min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {v.businessName}
                    </p>
                    <p className="text-[11px] text-gray-400 capitalize">
                      {cfg?.singular} · {v.address?.split(",")[0]}
                    </p>
                  </div>
                  {v.rating > 0 && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <FaStar className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-xs font-bold text-gray-700">
                        {v.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Suggestions ── */}
      {showSuggestions && (
        <div>
          <div className="px-4 pt-2.5 pb-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Suggestions
            </span>
          </div>
          {isSugLoading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((v) => {
              const cfg = TYPE_CONFIG[v.vendorType];
              return (
                <div
                  key={v._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect(v.text)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-300">
                        {v.text[0]}
                      </div>
                  </div>
                  <div className="flex-1  justify-items-start min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {v.text}
                    </p>
                    <p className="text-[11px] text-gray-400 capitalize">
                      {cfg?.singular}
                      {v.label &&
                      v.label !== "General"
                        ? `${v.label}`
                        : ""}
                      {/* {v.address ? ` · ${v.address.split(",")[0]}` : ""} */}
                    </p>
                  </div>
                  {v.rating > 0 && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <FaStar className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-xs font-bold text-gray-700">
                        {v.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <ArrowUpRight className="w-3 h-3 text-gray-200 group-hover:text-gray-400 shrink-0" />
                </div>
              );
            })
          ) : (
            <p className="px-3 py-4 text-center text-sm text-gray-400">
              No results for "{inputValue}"
            </p>
          )}
          {inputValue.trim() && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSubmit(inputValue)}
              className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50 cursor-pointer text-[#0A6C6D]"
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
  );
};

// ─── helper: build search URL ─────────────────────────────────────────────────
const buildSearchUrl = ({ q, type, date, time, guests }) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type)  params.set("type", type);
  if (date) params.set("date", date);
  if (time) params.set("time", time);
  if (guests && guests > 0) params.set("guests", String(guests));
  params.set("page", "1");
  return `/search?${params.toString()}`;
};

// map tab label → vendorType key used in SearchPage
const TAB_TO_TYPE = {
  restaurants: "restaurant",
  hotels: "hotel",
  clubs: "club",
};

// ─── getUserLocation (best-effort) ───────────────────────────────────────────
const getUserLocation = () => {
  try {
    const raw = localStorage.getItem("userLocation");
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMARY SearchSection  (used on the homepage hero)
// ═══════════════════════════════════════════════════════════════════════════════
const SearchSection = ({ activeTab, onSearch }) => {
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(getRecent);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const vendorType = TAB_TO_TYPE[activeTab] || "restaurant";
  const userLocation = getUserLocation();

  // close dropdown on outside click
  useEffect(() => {
    const handle = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setIsFocused(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const submit = useCallback(
    (term) => {
      const q = (term !== undefined ? term : inputValue).trim();
      saveRecent(q);
      setRecentSearches(getRecent());
      setInputValue(q);
      setIsFocused(false);

      const totalGuests = guests.adults + guests.children + guests.infants;
      const url = buildSearchUrl({
        q,
        type: vendorType,
        date: date ? format(date, "yyyy-MM-dd") : undefined,
        time: time || undefined,
        guests: totalGuests,
      });
      console.log(url)

      if (onSearch)
        onSearch({ query: q, tab: activeTab, date, time, guests: totalGuests });
      navigate(url);
    },
    [inputValue, guests, date, time, vendorType, activeTab, navigate, onSearch],
  );

  const timeSlots = {
    restaurants: [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "01:00 PM",
      "01:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
      "05:00 PM",
      "05:30 PM",
      "06:00 PM",
      "06:30 PM",
      "07:00 PM",
      "07:30 PM",
      "08:00 PM",
      "08:30 PM",
    ],
    hotels: [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "11:30 AM",
      "01:00 PM",
      "02:00 PM",
      "04:00 PM",
      "04:30 PM",
      "05:00 PM",
      "06:00 PM",
      "06:30 PM",
      "07:30 PM",
      "08:00 PM",
      "09:00 PM",
    ],
    clubs: [
      "09:00 PM",
      "09:30 PM",
      "10:00 PM",
      "10:30 PM",
      "11:00 PM",
      "11:30 PM",
      "12:00 AM",
      "12:30 AM",
      "01:00 AM",
      "01:30 AM",
      "02:00 AM",
      "02:30 AM",
      "03:00 AM",
    ],
  };

  const placeholder =
    activeTab === "restaurants"
      ? "Enter Restaurant or Cuisine"
      : activeTab === "hotels"
        ? "Enter Hotel name or area"
        : "Enter Club name or area";

  return (
    <div className="bg-white z-50 absolute top-6 sm:top-15 w-full sm:w-full mx-auto left-0 right-0 rounded-2xl lg:rounded-full justify-center mb-8 shadow-[0px_34px_10px_0px_rgba(122,122,122,0.00)] outline-2 outline-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* ── Search input with live dropdown ── */}
        <div
          className="flex flex-col border-b py-2 sm:py-4 px-4 sm:px-6 sm:border-b-0 sm:border-r border-gray-200 col-span-1 sm:col-span-2 lg:col-span-1 relative"
          ref={wrapperRef}
        >
          <label className="text-xs text-text-secondary text-left">
            {activeTab === "restaurants"
              ? "Restaurant/Cuisine"
              : activeTab === "hotels"
                ? "Hotels"
                : "Clubs"}
          </label>

          <div className={`flex items-center gap-1.5 transition-colors `}>
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              spellCheck="false"
              value={inputValue}
              placeholder={placeholder}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
                if (e.key === "Escape") setIsFocused(false);
              }}
              className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base bg-transparent py-1"
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
          </div>

          {/* Live dropdown — same as SearchPage */}
          <SearchDropdown
            inputValue={inputValue}
            isFocused={isFocused}
            activeType={vendorType}
            userLocation={userLocation}
            recentSearches={recentSearches}
            setRecentSearches={setRecentSearches}
            onSelect={(term) => submit(term)}
            onSubmit={(term) => submit(term)}
            onDeleteRecent={(term) => {
              delRecent(term);
              setRecentSearches(getRecent());
            }}
            onClearRecent={() => {
              localStorage.removeItem(LS_RECENT);
              setRecentSearches([]);
            }}
          />
        </div>

        {/* ── Date + Time ── */}
        <div className="grid grid-cols-2 col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex flex-col justify-center py-2 sm:py-4 px-4 sm:px-6 border-b sm:border-b-0 border-r border-gray-200">
            <label className="text-xs text-text-secondary text-left">
              Date
            </label>
            <DateDropdown selectedDate={date} onChange={setDate} />
          </div>

          {/* Time */}
          <div className="flex flex-col z-50 justify-center py-2 sm:py-4 px-4 sm:px-6 border-b sm:border-b-0 lg:border-r border-gray-200">
            <label className="text-xs text-text-secondary text-left">
              Time
            </label>
            <TimeDropdown
              selectedTime={time}
              slots={timeSlots[activeTab] || timeSlots.restaurants}
              onChange={setTime}
            />
          </div>
        </div>

        {/* ── Guests + Search button ── */}
        <div className="grid grid-cols-2 col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex flex-col justify-center py-2 sm:py-4 px-4 sm:px-6 sm:border-b-0 border-r border-gray-200">
            <label className="text-xs text-text-secondary text-left">
              Guests
            </label>
            <GuestDropdown onChange={(counts) => setGuests(counts)} />
          </div>
          <div className="flex items-center justify-center py-2 sm:py-1 px-4 sm:px-1 sm:justify-end w-full">
            <button
              type="button"
              onClick={() => submit()}
              className={`flex items-center gap-2 cursor-pointer text-white rounded-full px-6 sm:h-full py-3 transition w-full sm:w-auto justify-center ${
                activeTab === "restaurants"
                  ? "bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]"
                  : "bg-gradient-to-b from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600"
              }`}
            >
              <FiSearch className="w-5 h-5" />
              <span className="text-sm sm:text-base">Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;

// ═══════════════════════════════════════════════════════════════════════════════
// SECONDARY SearchSectionTwo  (compact bar on inner pages)
// ═══════════════════════════════════════════════════════════════════════════════
export const SearchSectionTwo = ({ onSearch, searchData, activeTab }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [recentSearches, setRecentSearches] = useState(getRecent);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const wrapperRef = useRef(null);
  const vendorType = TAB_TO_TYPE[activeTab] || "restaurant";
  const userLocation = getUserLocation();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // hydrate from prop or localStorage
  useEffect(() => {
    const src =
      searchData ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("searchData"));
        } catch {
          return null;
        }
      })();
    if (!src) return;
    if (src.query) setInputValue(src.query);
    if (src.date) setDate(new Date(src.date));
    if (src.time) setTime(src.time);
    if (src.guests)
      setGuests({
        adults: parseInt(src.guests, 10) || 2,
        children: 0,
        infants: 0,
      });
  }, [searchData]);

  // close on outside click
  useEffect(() => {
    const handle = (e) => {
      const outsideForm =
        formRef.current && !formRef.current.contains(e.target);
      const outsideWrapper =
        wrapperRef.current && !wrapperRef.current.contains(e.target);
      if (outsideForm) {
        if (isExpanded && isMobile) setIsExpanded(false);
      }
      if (outsideWrapper) setIsFocused(false);
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [isExpanded, isMobile]);

  const submit = useCallback(
    (term) => {
      const q = (term !== undefined ? term : inputValue).trim();
      if (!q) return;
      saveRecent(q);
      setRecentSearches(getRecent());
      setInputValue(q);
      setIsFocused(false);
      if (isMobile) setIsExpanded(false);

      const totalGuests = guests.adults + guests.children + guests.infants;
      const newData = {
        query: q,
        tab: activeTab || "restaurants",
        date: date ? format(date, "yyyy-MM-dd") : undefined,
        time: time || undefined,
        guests: String(totalGuests),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("searchData", JSON.stringify(newData));

      if (onSearch) {
        onSearch(newData);
      } else {
        navigate(
          buildSearchUrl({
            q,
            type: vendorType,
            date: newData.date,
            time: newData.time,
            guests: totalGuests,
          }),
        );
      }
    },
    [
      inputValue,
      guests,
      date,
      time,
      vendorType,
      activeTab,
      isMobile,
      navigate,
      onSearch,
    ],
  );

  const placeholder =
    activeTab === "restaurants"
      ? "Search restaurants or cuisines"
      : activeTab === "hotels"
        ? "Search hotels"
        : "Search clubs";

  // ── Desktop ──────────────────────────────────────────────────────────────
  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* Desktop */}
      <div className="hidden sm:block relative" ref={wrapperRef}>
        <div
          className={`h-16 bg-white rounded-full justify-between shadow-lg flex items-center px-2 sm:px-4 gap-2 sm:gap-0 border-2 transition-colors ${isFocused ? "border-[#0A6C6D]" : "border-transparent"}`}
        >
          <div className="flex flex-col flex-1 justify-center h-full px-4 border-r border-gray-200 min-w-0 w-1/4 relative">
            <label className="text-xs text-text-secondary text-left mb-1">
              {activeTab === "restaurants"
                ? "Restaurant/Cuisine"
                : activeTab === "hotels"
                  ? "Hotels"
                  : "Clubs"}
            </label>
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                value={inputValue}
                placeholder={placeholder}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                  if (e.key === "Escape") setIsFocused(false);
                }}
                className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm sm:text-base bg-transparent"
              />
              {inputValue && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setInputValue("")}
                  className="text-gray-400 hover:text-gray-700 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <SearchDropdown
              inputValue={inputValue}
              isFocused={isFocused}
              activeType={vendorType}
              userLocation={userLocation}
              recentSearches={recentSearches}
              setRecentSearches={setRecentSearches}
              onSelect={submit}
              onSubmit={submit}
              onDeleteRecent={(t) => {
                delRecent(t);
                setRecentSearches(getRecent());
              }}
              onClearRecent={() => {
                localStorage.removeItem(LS_RECENT);
                setRecentSearches([]);
              }}
            />
          </div>

          <div className="flex items-center justify-center pl-2 pr-1">
            <button
              type="submit"
              className="flex items-center gap-2 cursor-pointer text-white rounded-full px-6 py-2 transition bg-gradient-to-r from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 focus:outline-none shadow-md"
            >
              <FiSearch className="w-5 h-5" />
              <span className="text-sm sm:text-base">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile – collapsed */}
      <div className="sm:hidden">
        {!isExpanded && (
          <div
            onClick={() => setIsExpanded(true)}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 cursor-pointer">
              <FiSearch className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (!isExpanded) setIsExpanded(true);
                }}
                placeholder={placeholder}
                className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm bg-transparent"
                onFocus={() => setIsExpanded(true)}
                readOnly={!isExpanded}
                style={{
                  WebkitUserSelect: "text",
                  userSelect: "text",
                  touchAction: "manipulation",
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile – expanded */}
        {isExpanded && (
          <div className="flex items-start justify-center" ref={wrapperRef}>
            <div className="bg-white rounded-2xl w-full shadow-xl animate-in slide-in-from-bottom-5 duration-200">
              <div className="p-4">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col mb-4 pb-4 border-b border-gray-200">
                  <label className="text-xs text-text-secondary text-left mb-2">
                    {activeTab === "restaurants"
                      ? "Restaurant/Cuisine"
                      : activeTab === "hotels"
                        ? "Hotels"
                        : "Clubs"}
                  </label>
                  <div
                    className={`flex items-center gap-1 border-b-2 pb-1 transition-colors ${isFocused ? "border-[#0A6C6D]" : "border-gray-200"}`}
                  >
                    <input
                      ref={inputRef}
                      autoFocus
                      type="text"
                      autoComplete="off"
                      value={inputValue}
                      placeholder={placeholder}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          submit();
                        }
                        if (e.key === "Escape") setIsFocused(false);
                      }}
                      className="w-full focus:outline-none text-text-primary placeholder:text-text-secondary text-sm bg-transparent"
                    />
                    {inputValue && (
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setInputValue("")}
                        className="text-gray-400 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <SearchDropdown
                    inputValue={inputValue}
                    isFocused={isFocused}
                    activeType={vendorType}
                    userLocation={userLocation}
                    recentSearches={recentSearches}
                    setRecentSearches={setRecentSearches}
                    onSelect={submit}
                    onSubmit={submit}
                    onDeleteRecent={(t) => {
                      delRecent(t);
                      setRecentSearches(getRecent());
                    }}
                    onClearRecent={() => {
                      localStorage.removeItem(LS_RECENT);
                      setRecentSearches([]);
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-800 to-violet-500 hover:from-blue-900 hover:to-violet-600 text-white rounded-xl transition font-medium"
                  >
                    <FiSearch className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
