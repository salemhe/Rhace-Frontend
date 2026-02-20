import { useFavorites } from '@/hooks/favorites';
import { HeartIcon } from '@/public/icons/icons';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function FavoriteButton({ vendor, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(vendor._id);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation();

    // Pass vendor data for optimistic update
    toggleFavorite(vendor._id, {
      name: vendor.name,
      image: vendor.image || vendor.logo,
      type: vendor.type || vendor.vendorType,
      vendor: vendor
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative transition-colors ${className}`}
      whileTap={{ scale: 0.85 }}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Heart Icon with fill animation */}
      <motion.div
        initial={false}
        animate={{
          scale: isFav ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <HeartIcon
          className={`w-6 h-6 transition-all duration-200 ${isFav
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 fill-white hover:text-red-500'
            }`}
        />
      </motion.div>

      {/* Particle burst effect on like */}
      {isFav && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 3) * 20,
                y: Math.sin((i * Math.PI) / 3) * 20,
              }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}

export function FavoriteButton2({ vendor, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(vendor._id);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation();

    // Pass vendor data for optimistic update
    toggleFavorite(vendor._id, {
      name: vendor.name,
      image: vendor.image || vendor.logo,
      type: vendor.type || vendor.vendorType,
      vendor: vendor
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative transition-colors size-10 rounded-xl bg-white text-black hover:bg-gray-50 flex justify-center border border-[#E5E7EB] items-center gap-2 ${className}`}
      whileTap={{ scale: 0.85 }}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Heart Icon with fill animation */}
      <motion.div
        initial={false}
        animate={{
          scale: isFav ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={`w-6 h-6 transition-all duration-200 ${isFav
            ? 'fill-red-500 text-red-500'
            : 'text-[#111827] hover:text-red-500'
            }`}
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_2317_1077)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.4117 3.1675C17.1575 4.185 18.3858 6.25083 18.3317 8.66083C18.2642 11.6692 15.9233 14.3225 11.9325 16.6925C11.3408 17.0442 10.7175 17.5 10 17.5C9.29585 17.5 8.64585 17.0358 8.06668 16.6917C4.07752 14.3225 1.73585 11.6683 1.66835 8.66083C1.61418 6.25083 2.84252 4.18583 4.58835 3.1675C6.22168 2.21666 8.27335 2.21083 10 3.615C11.7267 2.21083 13.7783 2.21583 15.4117 3.1675ZM14.5725 4.60833C13.4108 3.93166 11.9592 3.95583 10.7025 5.2275C10.6105 5.32017 10.5011 5.39372 10.3805 5.44391C10.2599 5.4941 10.1306 5.51993 10 5.51993C9.86942 5.51993 9.74011 5.4941 9.61955 5.44391C9.49898 5.39372 9.38953 5.32017 9.29752 5.2275C8.04085 3.95583 6.58918 3.93166 5.42752 4.60833C4.22418 5.31 3.29418 6.79833 3.33502 8.625C3.38168 10.7175 5.03502 12.9533 8.91835 15.26C9.25835 15.4625 9.61335 15.7217 10 15.8292C10.3867 15.7217 10.7417 15.4625 11.0817 15.26C14.965 12.9533 16.6183 10.7183 16.665 8.62416C16.7067 6.79916 15.7758 5.31 14.5725 4.60833Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_2317_1077">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </motion.div>

      {/* Particle burst effect on like */}
      {isFav && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 3) * 20,
                y: Math.sin((i * Math.PI) / 3) * 20,
              }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}

export function FavoriteButton3({ vendor, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(vendor._id);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation();

    // Pass vendor data for optimistic update
    toggleFavorite(vendor._id, {
      name: vendor.name,
      image: vendor.image || vendor.logo,
      type: vendor.type || vendor.vendorType,
      vendor: vendor
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative cursor-pointer border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3 ${className}`}
      whileTap={{ scale: 0.85 }}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Heart Icon with fill animation */}
      <motion.div
        initial={false}
        animate={{
          scale: isFav ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Heart className={`w-6 h-6 transition-all duration-200 text-[#111827] ${isFav
          ? 'fill-red-500'
          : ' hover:text-red-500'
          }`} />
      </motion.div>
      Save

      {/* Particle burst effect on like */}
      {isFav && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-5 w-1 h-1 bg-red-500 rounded-full"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 3) * 20,
                y: Math.sin((i * Math.PI) / 3) * 20,
              }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}