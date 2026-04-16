import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { FavoriteButton } from "@/components/user/ui/favoritebutton";
import { TYPE_CONFIG, PRICE_LABELS, PRICE_DESC } from "../utils/constants";
import { ArrowUpRight, Clock } from "lucide-react";

// ── Existing grid card (kept for SearchResults) ────────────────────────────────
export const VenueCard = ({ vendor, activeType }) => {
  const navigate = useNavigate();
  const type = vendor.vendorType || activeType;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.restaurant;
  const photo = vendor.profileImages?.[0];

  const tags =
    type === "restaurant"
      ? vendor.cuisines || []
      : type === "club"
        ? vendor.musicGenres || vendor.categories || []
        : (vendor.amenities || []).slice(0, 3);

  return (
    <div
      onClick={() => navigate(`/${cfg.path}/${vendor._id}`)}
      className="group cursor-pointer flex gap-3 sm:gap-4 border-gray-200 transition-all duration-300"
    >
      {/* Image (LEFT) */}
      <div className="relative h-42 w-36 overflow-hidden bg-gray-100 shrink-0">
        {photo ? (
          <img
            src={photo}
            alt={vendor.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-2xl font-bold text-gray-400">
              {vendor.businessName?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}

        {/* Favorite */}
        <div className="absolute top-2 right-2 text-white">
          <FavoriteButton vendor={vendor} />
        </div>
      </div>

      {/* Content (RIGHT) */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top row */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
              {vendor.businessName}
            </h3>

            {vendor.vendorTypeCategory &&
              vendor.vendorTypeCategory !== "General" && (
                <p className="text-xs text-gray-400 capitalize">
                  {vendor.vendorTypeCategory}
                </p>
              )}
          </div>

          {/* Rating */}
          {vendor.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <FaStar className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-medium">
                {vendor.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] text-gray-500 capitalize">
                {tag.replace(/-/g, " ")}
                {i < Math.min(tags.length, 3) - 1 && ","}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {vendor.description || "Discover great experiences at this location."}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <FiMapPin className="w-3 h-3 shrink-0" />
          <span className="line-clamp-1">
            {vendor.address || "Location not set"}
          </span>
        </div>
        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${cfg.path}/${vendor._id}`);
            }}
            className="w-full py-2 text-center rounded-full items-center gap-1 text-xs text-white font-medium bg-[#0A6C6D] hover:bg-[#0A6C6D]/90 transition-colors flex justify-center"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Discovery list card (horizontal, with description + Book button) ───────────
export const DiscoveryListCard = ({ vendor, activeType, navigate: nav }) => {
  const navigate = nav || useNavigate();
  const type = vendor.vendorType || activeType;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.restaurant;
  const photo = vendor.profileImages?.[0];

  const isOpen = vendor.isOpen !== false; // default to open if not specified
  const isClosed = vendor.isOpen === false;

  const tags =
    type === "restaurant"
      ? vendor.cuisines || []
      : type === "club"
        ? vendor.musicGenres || vendor.categories || []
        : (vendor.amenities || []).slice(0, 2);

  // Short description: use vendor.description, or build from tags/type
  const description =
    vendor.businessDescription ||
    vendor.shortDescription ||
    (tags.length
      ? tags.slice(0, 3).join(", ")
      : type === "restaurant"
        ? "Dine in experience"
        : type === "hotel"
          ? "Comfortable accommodations"
          : "Night entertainment");

  const ctaLabel =
    type === "hotel"
      ? "Book Stay"
      : type === "club"
        ? "Book now"
        : "Reserve now";

  const handleClick = () => navigate(`/${cfg.path}/${vendor._id}`);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/80 transition-colors duration-150 ${isClosed ? "opacity-60" : ""}`}
    >
      {/* Thumbnail */}
      <div
        onClick={handleClick}
        className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
      >
        {photo ? (
          <img
            src={photo}
            alt={vendor.businessName}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-black text-xl"
            style={{
              background: `hsl(${((vendor.businessName?.charCodeAt(0) || 65) * 5) % 360}, 60%, 50%)`,
            }}
          >
            {vendor.businessName?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className="flex-1 min-w-0"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="flex items-start gap-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1 flex-1">
            {vendor.businessName}
          </h3>
          {vendor.offer && (
            <span className="shrink-0 text-[9px] font-bold bg-amber-400 text-gray-900 px-1.5 py-0.5 rounded-full">
              {vendor.offer}
            </span>
          )}
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-0.5">
              <FaStar className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-xs font-semibold text-gray-800">
                {vendor.rating.toFixed(1)}
              </span>
                <span className="text-[10px] text-gray-400 ml-0.5">
                  ({vendor.reviews?.toLocaleString()})
                </span >
            </div>
          {vendor.deliveryTime && (
            <>
              <span className="text-gray-200 text-xs">·</span>
              <div className="flex items-center gap-0.5 text-[10px] text-gray-500">
                <Clock className="w-2.5 h-2.5" />
                {vendor.deliveryTime} min
              </div>
            </>
          )}
        </div>

        {/* Description / tags */}
        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 capitalize leading-tight">
          {isClosed ? (
            <span className="text-red-400 font-medium">
              Closed until tomorrow
            </span>
          ) : (
            description
          )}
        </p>

        {/* Address */}
        <div className="flex items-center gap-0.5 mt-0.5 text-[10px] text-gray-400">
          <FiMapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="line-clamp-1">
            {vendor.address || "Location not set"}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="text-white cursor-pointer transition-all duration-200 hover:scale-110">
          <FavoriteButton vendor={vendor} />
        </div>
        {!isClosed && (
          <button
            onClick={handleClick}
            className="text-[11px] font-bold hover:text-[#0A6C6D] border hover:border-[#0A6C6D]/30 bg-[#0A6C6D] hover:bg-white text-white rounded-lg px-2.5 py-1 transition-all duration-200 whitespace-nowrap"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Skeleton loading card (grid) ───────────────────────────────────────────────
const shimmerStyle = {
  background: "linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s ease-in-out infinite",
};
const Shimmer = ({ className = "" }) => (
  <div className={className} style={shimmerStyle} />
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <Shimmer className="h-36 sm:h-44 w-full" />
    <div className="p-2.5 sm:p-3 space-y-2">
      <div className="flex justify-between gap-2">
        <Shimmer className="h-3.5 rounded w-2/3" />
        <Shimmer className="h-3.5 rounded w-8" />
      </div>
      <Shimmer className="h-3 rounded w-1/3" />
      <div className="flex gap-1">
        <Shimmer className="h-4 rounded w-12" />
        <Shimmer className="h-4 rounded w-14" />
      </div>
      <Shimmer className="h-3 rounded w-3/4" />
    </div>
  </div>
);

// ── Skeleton list card (for DiscoveryHome) ─────────────────────────────────────
export const DiscoverySkeletonList = () => (
  <div className="flex items-center gap-3 px-4 py-3.5">
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <Shimmer className="w-16 h-16 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-3.5 rounded w-3/4" />
      <Shimmer className="h-3 rounded w-1/3" />
      <Shimmer className="h-3 rounded w-1/2" />
    </div>
    <div className="flex flex-col gap-2 shrink-0">
      <Shimmer className="h-4 w-4 rounded-full" />
      <Shimmer className="h-6 w-16 rounded-lg" />
    </div>
  </div>
);