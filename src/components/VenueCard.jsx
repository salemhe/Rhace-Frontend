import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { FavoriteButton } from "@/components/user/ui/favoritebutton";
import { TYPE_CONFIG, PRICE_LABELS, PRICE_DESC } from "../utils/constants";

export const VenueCard = ({ vendor, activeType }) => {
  const navigate = useNavigate();
  const type = vendor.vendorType || activeType;
  const cfg  = TYPE_CONFIG[type] || TYPE_CONFIG.restaurant;
  const photo = vendor.profileImages?.[0];

  const tags =
    type === "restaurant" ? vendor.cuisines || [] :
    type === "club"       ? vendor.musicGenres || vendor.categories || [] :
    (vendor.amenities || []).slice(0, 3);

  return (
    <div
      onClick={() => navigate(`/${cfg.path}/${vendor._id}`)}
      className="group cursor-pointer p-2 flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.11)] transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-36 sm:h-44 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 shrink-0">
        {photo ? (
          <img src={photo} alt={vendor.businessName} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl font-black text-gray-300 select-none">
              {vendor.businessName?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {type === "club" && vendor.entryFee != null && (
          <span className="absolute bottom-2 right-2 bg-violet-600/80 backdrop-blur-sm text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {vendor.entryFee === 0 ? "Free Entry" : `₦${vendor.entryFee?.toLocaleString()}`}
          </span>
        )}
        {vendor.offer && (
          <span className="absolute top-2 right-7 bg-amber-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full max-w-[90px] truncate">
            {vendor.offer}
          </span>
        )}
        <div className="absolute top-2 right-2 text-white cursor-pointer text-base sm:text-lg transition-all duration-300 hover:scale-110 drop-shadow-md">
          <FavoriteButton vendor={vendor} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col p-2.5 sm:p-3 flex-1 gap-1.5">
        <div className="flex flex-col items-start gap-1.5">
          {vendor.rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <FaStar className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-sm font-medium text-gray-900">{vendor.rating.toFixed(1)}</span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1">
                ({vendor.reviews?.toLocaleString() || 0} reviews)
              </span>
            </div>
          )}
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-1 flex-1">
            {vendor.businessName}
          </h3>
        </div>

        {vendor.vendorTypeCategory && vendor.vendorTypeCategory !== "General" && (
          <p className="text-[10px] text-gray-400 capitalize leading-none">{vendor.vendorTypeCategory}</p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-gray-500 text-[10px] font-medium py-0.5 rounded capitalize">
                {tag.replace(/-/g, " ")}{i < Math.min(tags.length, 2) - 1 && ","}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0.5 rounded">+{tags.length - 2}</span>
            )}
          </div>
        )}

        {type === "restaurant" && vendor.diningStyles?.length > 0 && (
          <p className="text-[10px] text-gray-400 capitalize">
            {vendor.diningStyles.slice(0, 2).join(" · ")}
          </p>
        )}
        {type === "hotel" && vendor.mealPlan && vendor.mealPlan !== "room-only" && (
          <p className="text-[10px] text-emerald-600 font-medium capitalize">
            {vendor.mealPlan.replace(/-/g, " ")} included
          </p>
        )}
        {type === "club" && vendor.dressCode && (
          <p className="text-[10px] text-gray-400 capitalize">👔 {vendor.dressCode}</p>
        )}

        <div className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-[11px] mt-auto pt-1">
          <FiMapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="line-clamp-1">{vendor.address || "Location not set"}</span>
        </div>
      </div>
    </div>
  );
};

// ── Skeleton loading card ─────────────────────────────────────────────────────
const shimmerStyle = {
  background: "linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s ease-in-out infinite",
};
const Shimmer = ({ className = "" }) => <div className={className} style={shimmerStyle} />;

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