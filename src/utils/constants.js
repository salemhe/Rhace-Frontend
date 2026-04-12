// ─── Type Config ──────────────────────────────────────────────────────────────
export const TYPE_CONFIG = {
  restaurant: {
    label: "Restaurants",
    singular: "Restaurant",
    bg: "bg-emerald-600",
    light: "bg-emerald-50 text-emerald-700",
    path: "restaurants",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    searchPlaceholder: "Search restaurants, cuisines, dishes...",
    discoveryTitle: "Top Restaurants Near You",
    sections: ["Near You", "Trending", "Top Rated", "Date Night", "Affordable Eats"],
  },
  hotel: {
    label: "Hotels",
    singular: "Hotel",
    bg: "bg-blue-600",
    light: "bg-blue-50 text-blue-700",
    path: "hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    searchPlaceholder: "Search hotels, resorts, locations...",
    discoveryTitle: "Hotels Available Near You",
    sections: ["Near You", "Best Deals", "Luxury Stays", "Budget Friendly"],
  },
  club: {
    label: "Clubs",
    singular: "Club",
    bg: "bg-violet-600",
    light: "bg-violet-50 text-violet-700",
    path: "clubs",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    searchPlaceholder: "Search clubs, lounges, events...",
    discoveryTitle: "Happening Tonight",
    sections: ["Tonight's Hot Spots", "VIP Clubs", "Near You", "Trending"],
  },
};

// ─── Price ────────────────────────────────────────────────────────────────────
export const PRICE_LABELS = { 1: "₦", 2: "₦₦", 3: "₦₦₦", 4: "₦₦₦₦" };
export const PRICE_DESC   = { 1: "Budget", 2: "Moderate", 3: "Upscale", 4: "Luxury" };

// ─── Search config ────────────────────────────────────────────────────────────
export const DEBOUNCE_MS = 320;
export const LS_RECENT   = "rhace_recent_searches";
export const MAX_RECENT  = 8;

// ─── Popular quick-searches ───────────────────────────────────────────────────
export const POPULAR_SEARCHES = [
  "Lagos Restaurants", "Abuja Hotels", "Victoria Island",
  "Lekki", "PH Clubs", "Fine Dining", "Suya", "Rooftop Bar",
];

// ─── Restaurant filter options ────────────────────────────────────────────────
export const R_CUISINES = [
  ["nigerian","Nigerian"],["continental","Continental"],["chinese","Chinese"],
  ["italian","Italian"],["indian","Indian"],["japanese","Japanese"],
  ["lebanese","Lebanese"],["mexican","Mexican"],["american","American"],
  ["french","French"],["mediterranean","Mediterranean"],["fast-food","Fast Food"],
  ["seafood","Seafood"],["grills","Grills"],["pastry","Pastry"],
  ["vegetarian","Vegetarian"],["fusion","Fusion"],
];
export const R_DIETARY = [
  ["halal","Halal"],["vegetarian","Vegetarian"],["vegan","Vegan"],
  ["gluten-free","Gluten-free"],["kosher","Kosher"],
  ["dairy-free","Dairy-free"],["nut-free","Nut-free"],
];
export const R_DINING_STYLES = [
  ["","Any"],["dine-in","Dine-in"],["takeout","Takeout"],
  ["delivery","Delivery"],["buffet","Buffet"],
  ["fine-dining","Fine Dining"],["casual","Casual"],
];
export const R_SEATING = [
  ["outdoor","Outdoor"],["bar-seating","Bar Seating"],["private-room","Private Room"],
  ["high-chair","High Chair"],["rooftop","Rooftop"],["booth","Booth"],
];
export const R_OCCASIONS = [
  ["romantic","Romantic"],["birthday","Birthday"],["business","Business"],
  ["group","Group"],["date-night","Date Night"],["family","Family"],
  ["brunch","Brunch"],["celebrations","Celebrations"],
];
export const R_MEAL_TIMES = [
  ["breakfast","Breakfast"],["brunch","Brunch"],["lunch","Lunch"],
  ["dinner","Dinner"],["late-night","Late Night"],["all-day","All Day"],
];
export const R_RESERVATION = [
  ["","Any"],["free","Free"],["deposit","Deposit"],
  ["prepay","Prepay"],["walk-in-only","Walk-in only"],
];

// ─── Hotel filter options ─────────────────────────────────────────────────────
export const H_STAR_RATINGS   = [["","Any"],["5","★★★★★"],["4","★★★★"],["3","★★★"],["2","★★"]];
export const H_PROPERTY_TYPE  = [
  ["","Any"],["hotel","Hotel"],["boutique","Boutique"],["resort","Resort"],
  ["serviced-apartment","Serviced Apt"],["motel","Motel"],["guesthouse","Guesthouse"],
];
export const H_AMENITIES = [
  ["wifi","WiFi"],["pool","Pool"],["gym","Gym"],["spa","Spa"],
  ["parking","Parking"],["restaurant","Restaurant"],["bar","Bar"],
  ["airport-shuttle","Airport Shuttle"],["ac","AC"],["hot-tub","Hot Tub"],
  ["room-service","Room Service"],["laundry","Laundry"],
  ["business-center","Business Center"],["beach-access","Beach Access"],
];
export const H_MEAL_PLANS = [
  ["","Any"],["room-only","Room Only"],["breakfast","Breakfast Incl."],
  ["half-board","Half Board"],["full-board","Full Board"],["all-inclusive","All Inclusive"],
];
export const H_CANCEL = [
  ["","Any"],["free","Free Cancellation"],
  ["partial","Partial Refund"],["non-refundable","Non-refundable"],
];
export const H_ACCESSIBILITY = [
  ["step-free","Step-free"],["elevator","Elevator"],["wheelchair","Wheelchair"],
  ["grab-bars","Grab Bars"],["visual-aids","Visual Aids"],
];

// ─── Club filter options ──────────────────────────────────────────────────────
export const C_VENUE_TYPES = [
  ["","Any"],["club","Club"],["lounge","Lounge"],["rooftop","Rooftop"],
  ["sports-bar","Sports Bar"],["cocktail-bar","Cocktail Bar"],
  ["karaoke","Karaoke"],["jazz-bar","Jazz Bar"],["pool-bar","Pool Bar"],
];
export const C_GENRES = [
  ["afrobeats","Afrobeats"],["amapiano","Amapiano"],["house","House"],
  ["rnb","R&B"],["hiphop","Hip-Hop"],["edm","EDM"],["reggae","Reggae"],
  ["highlife","Highlife"],["dancehall","Dancehall"],["live-band","Live Band"],["mixed","Mixed"],
];
export const C_PERFORMANCES = [
  ["dj","DJ"],["live-band","Live Band"],["standup","Stand-up"],
  ["karaoke","Karaoke"],["spoken-word","Spoken Word"],
];
export const C_DRESS_CODES = [
  ["","Any"],["smart-casual","Smart Casual"],["formal","Formal"],["casual","Casual"],["none","No Code"],
];
export const C_AGE_POLICY = [["","Any"],["18+","18+"],["21+","21+"],["all-ages","All Ages"]];
export const C_TIMES = [
  ["","Any time"],["14:00","2:00 PM"],["15:00","3:00 PM"],
  ["22:00","10:00 PM"],["01:00","1:00 AM"],
];
export const C_TABLE_TYPES = [
  ["","Any Table"],["standard","Standard"],["vip","VIP"],["booth","Booth"],["outdoor","Outdoor"],
];

// ─── Filter key groups ────────────────────────────────────────────────────────
export const ARRAY_KEYS = [
  "cuisines","dietaryOptions","seatOptions","occasionTags","mealTimes",
  "amenities","accessibilityFeatures","musicGenres","livePerformanceTypes",
];
export const BOOL_KEYS = [
  "hasParking","hasOutdoorSeating","instantBook","petFriendly",
  "hasVIPTables","hasGuestlist","hasOutdoorArea","openNow",
];
export const TYPE_SPECIFIC_KEYS = [
  ...ARRAY_KEYS, ...BOOL_KEYS,
  "diningStyle","reservationPolicy","starRating","propertyType","mealPlan",
  "cancellationPolicy","instantBook","petFriendly","venueType","dressCode",
  "agePolicy","entryFee","clubTime","tableType",
];

export const CHIP_LABEL_MAPS = {
  cuisines:             Object.fromEntries(R_CUISINES),
  dietaryOptions:       Object.fromEntries(R_DIETARY),
  seatOptions:          Object.fromEntries(R_SEATING),
  occasionTags:         Object.fromEntries(R_OCCASIONS),
  mealTimes:            Object.fromEntries(R_MEAL_TIMES),
  amenities:            Object.fromEntries(H_AMENITIES),
  accessibilityFeatures:Object.fromEntries(H_ACCESSIBILITY),
  musicGenres:          Object.fromEntries(C_GENRES),
  livePerformanceTypes: Object.fromEntries(C_PERFORMANCES),
};

export const DEFAULT_FILTERS = {
  type: "", city: "", minRating: "", minPrice: "", maxPrice: "", sort: "rating",
  cuisines: [], dietaryOptions: [], diningStyle: "", seatOptions: [],
  occasionTags: [], mealTimes: [], reservationPolicy: "",
  hasParking: "", hasOutdoorSeating: "",
  starRating: "", propertyType: "", amenities: [], mealPlan: "",
  cancellationPolicy: "", instantBook: "", petFriendly: "",
  accessibilityFeatures: [],
  venueType: "", musicGenres: [], livePerformanceTypes: [],
  dressCode: "", agePolicy: "", hasVIPTables: "", hasGuestlist: "",
  hasOutdoorArea: "", entryFee: "", clubTime: "", tableType: "", openNow: "",
};