const QUICK_CHIPS = {
  restaurant: [
    { label: 'Open now',        key: 'openNow',         val: 'true' },
    { label: 'Top rated 4+',   key: 'minRating',        val: '4' },
    { label: 'Nigerian',        key: 'cuisines',         val: 'nigerian',    multi: true },
    { label: 'Continental',     key: 'cuisines',         val: 'continental', multi: true },
    { label: 'Fast food',       key: 'cuisines',         val: 'fast-food',   multi: true },
    { label: 'Seafood',         key: 'cuisines',         val: 'seafood',     multi: true },
    { label: 'Grills',          key: 'cuisines',         val: 'grills',      multi: true },
    { label: 'Halal',           key: 'dietaryOptions',   val: 'halal',       multi: true },
    { label: 'Fine dining',     key: 'diningStyle',      val: 'fine-dining' },
    { label: 'Delivery',        key: 'diningStyle',      val: 'delivery' },
    { label: 'Has parking',     key: 'hasParking',       val: 'true' },
    { label: 'Outdoor seating', key: 'hasOutdoorSeating',val: 'true' },
    { label: 'Romantic',        key: 'occasionTags',     val: 'romantic',    multi: true },
    { label: 'Budget ₦',        key: 'minPrice',         val: '1' },
  ],
  hotel: [
    { label: 'Open now',        key: 'openNow',           val: 'true' },
    { label: 'Top rated 4+',   key: 'minRating',          val: '4' },
    { label: '5 stars',         key: 'starRating',         val: '5' },
    { label: 'Resort',          key: 'propertyType',       val: 'resort' },
    { label: 'Boutique',        key: 'propertyType',       val: 'boutique' },
    { label: 'Pool',            key: 'amenities',          val: 'pool',        multi: true },
    { label: 'Spa',             key: 'amenities',          val: 'spa',         multi: true },
    { label: 'WiFi',            key: 'amenities',          val: 'wifi',        multi: true },
    { label: 'Breakfast incl.', key: 'mealPlan',           val: 'breakfast' },
    { label: 'All inclusive',   key: 'mealPlan',           val: 'all-inclusive' },
    { label: 'Free cancel',     key: 'cancellationPolicy', val: 'free' },
    { label: 'Instant book',    key: 'instantBook',        val: 'true' },
    { label: 'Pet friendly',    key: 'petFriendly',        val: 'true' },
    { label: 'Luxury ₦₦₦₦',    key: 'minPrice',           val: '4' },
  ],
  club: [
    { label: 'Open now',      key: 'openNow',              val: 'true' },
    { label: 'Afrobeats',     key: 'musicGenres',          val: 'afrobeats',  multi: true },
    { label: 'Amapiano',      key: 'musicGenres',          val: 'amapiano',   multi: true },
    { label: 'Hip-Hop',       key: 'musicGenres',          val: 'hiphop',     multi: true },
    { label: 'R&B',           key: 'musicGenres',          val: 'rnb',        multi: true },
    { label: 'Free entry',    key: 'entryFee',             val: '0' },
    { label: 'VIP tables',    key: 'hasVIPTables',         val: 'true' },
    { label: 'Guestlist',     key: 'hasGuestlist',         val: 'true' },
    { label: 'Rooftop',       key: 'venueType',            val: 'rooftop' },
    { label: 'Lounge',        key: 'venueType',            val: 'lounge' },
    { label: 'Live band',     key: 'livePerformanceTypes', val: 'live-band',  multi: true },
    { label: 'Smart casual',  key: 'dressCode',            val: 'smart-casual' },
    { label: '18+',           key: 'agePolicy',            val: '18+' },
  ],
};

export const QuickFilterChips = ({ activeType, filters, onChange }) => {
  const chips = QUICK_CHIPS[activeType] || [];
  if (!chips.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-3">
      {chips.map((chip) => {
        const isActive = chip.multi
          ? (filters[chip.key] || []).includes(chip.val)
          : filters[chip.key] === chip.val;
        return (
          <button
            key={`${chip.key}-${chip.val}`}
            onClick={() => {
              if (chip.multi) {
                const arr = filters[chip.key] || [];
                onChange(chip.key, isActive ? arr.filter(v => v !== chip.val) : [...arr, chip.val]);
              } else {
                onChange(chip.key, isActive ? '' : chip.val);
              }
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
              isActive
                ? 'bg-[#0A6C6D] border-[#0A6C6D] text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#0A6C6D] hover:text-[#0A6C6D]'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};