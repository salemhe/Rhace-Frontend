import { userService } from "@/services/user.service";
import { useEffect, useState } from "react";
import {
  FiChevronRight,
  FiChevronsDown,
  FiHeart,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import UniversalLoader from "./user/ui/LogoLoader";
import { FaStar } from "react-icons/fa6";
import { Bike, Heart, Star } from "lucide-react";

// Common carousel logic hook
const useCarouselLogic = () => {
  const [currentIndices, setCurrentIndices] = useState({});
  const [intervalIds, setIntervalIds] = useState({});

  const startImageRotation = (restaurantId, images) => {
    // Clear any existing interval for this restaurant
    if (intervalIds[restaurantId]) {
      clearInterval(intervalIds[restaurantId]);
    }

    // Start new interval to rotate images every 2 seconds
    const intervalId = setInterval(() => {
      setCurrentIndices((prev) => {
        const currentIndex = prev[restaurantId] || 0;
        const nextIndex = (currentIndex + 1) % images.length;
        return { ...prev, [restaurantId]: nextIndex };
      });
    }, 1500); // Change image every 1.5 seconds

    setIntervalIds((prev) => ({
      ...prev,
      [restaurantId]: intervalId,
    }));
  };

  const stopImageRotation = (restaurantId) => {
    if (intervalIds[restaurantId]) {
      clearInterval(intervalIds[restaurantId]);
      setIntervalIds((prev) => {
        const newIntervals = { ...prev };
        delete newIntervals[restaurantId];
        return newIntervals;
      });
    }
  };

  const handleMouseEnter = (
    restaurantId,
    restaurant,
    getImagesForRestaurant,
    hasMultipleImages
  ) => {
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    const images = getImagesForRestaurant(restaurant);
    if (images.length <= 1) return;

    // Reset to first image when hover starts
    setCurrentIndices((prev) => ({
      ...prev,
      [restaurantId]: 0,
    }));

    // Start rotating images
    startImageRotation(restaurantId, images);
  };

  const handleMouseLeave = (restaurantId) => {
    stopImageRotation(restaurantId);

    // Reset to first image when hover ends
    setCurrentIndices((prev) => ({
      ...prev,
      [restaurantId]: 0,
    }));
  };

  // Manual navigation for dots
  const handleDotClick = (restaurantId, index, e) => {
    e.stopPropagation(); // Prevent card click event
    stopImageRotation(restaurantId);
    setCurrentIndices((prev) => ({
      ...prev,
      [restaurantId]: index,
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalIds).forEach((intervalId) =>
        clearInterval(intervalId)
      );
    };
  }, [intervalIds]);

  return {
    currentIndices,
    handleMouseEnter,
    handleMouseLeave,
    handleDotClick,
  };
};

// Common restaurant data fetching hook
const useRestaurantData = (vendorType, type) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        if (type && type === "nearby") {
          const location = localStorage.getItem("userLocation");
          const loc = JSON.parse(location);
          const res = await userService.getNearest({ longitude: loc.lng, latitude: loc.lat, type: vendorType});
          setRestaurants(res.data);
        } else {
          const res = await userService.getVendor(vendorType);
          setRestaurants(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, [vendorType]);

  return { restaurants, isLoading };
};

// Common image handling functions
const getImagesForRestaurant = (restaurant) => {
  if (restaurant?.profileImages && restaurant?.profileImages?.length > 1) {
    return restaurant?.profileImages?.map((image) =>
      typeof image === "string" ? image : image.url
    );
  }
  return restaurant.image ? [restaurant.image] : ["/placeholder.jpg"];
};

const hasMultipleImages = (restaurant) => {
  const images = getImagesForRestaurant(restaurant);
  return images.length > 1;
};

// Common cuisine color palette
const cuisineColorPalette = [
  "bg-orange-100 outline-orange-200",
  "bg-green-100 outline-green-200",
  "bg-blue-100 outline-blue-200",
  "bg-purple-100 outline-purple-200",
  "bg-pink-100 outline-pink-200",
  "bg-yellow-100 outline-yellow-200",
  "bg-teal-100 outline-teal-200",
];

const TableGrid = ({ title, type }) => {
  const { currentIndices, handleMouseEnter, handleMouseLeave, handleDotClick } =
    useCarouselLogic();
  const { restaurants, isLoading } = useRestaurantData("restaurant", type);
  const navigate = useNavigate();

  
  if (isLoading) return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} class="rounded-2xl bg-white shadow-md overflow-hidden">
          <div class="h-44 w-full bg-gray-200 animate-pulse"></div>
          <div class="p-4 space-y-4">
            <div class="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          <div class="flex gap-2">
            <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
  ))};
    </div>
  );

  if (!restaurants || restaurants.length === 0) return null;

  let limit = 4;

  return (
    <div className="mb-12 md:mb-20 lg:mb-[92px] px-4 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        className="flex cursor-pointer justify-between items-center mb-4 sm:mb-6 w-auto text-gray-900 text-sm sm:text-base font-medium leading-none"
      >
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1 sm:ml-2" />
      </Button>

      {/* Responsive grid container */}
      <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide sm:scrollbar-default pb-4 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        {restaurants?.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const restaurantId = restaurant._id || String(restaurant.id);
          const currentIndex = currentIndices[restaurantId] || 0;
          const multipleImages = hasMultipleImages(restaurant);
          const cuisinesArray = Array.isArray(restaurant.cuisines)
            ? restaurant.cuisines
            : restaurant.cuisines
                ?.split(",")
                .map((c) => c.trim())
                .filter(Boolean) || [];

          return (
            <div
              key={restaurantId}
              className="snap-start min-w-[280px] sm:min-w-0 w-[280px] sm:w-auto h-auto sm:h-full flex-shrink-0 sm:flex-shrink cursor-pointer pt-2 pb-4 flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
              onMouseEnter={() =>
                handleMouseEnter(
                  restaurantId,
                  restaurant,
                  getImagesForRestaurant,
                  hasMultipleImages
                )
              }
              onMouseLeave={() => handleMouseLeave(restaurantId)}
            >
              {/* Image Section */}
              <div className="relative h-40 sm:h-44 w-full px-2 cursor-pointer aspect-video">
                <div className="relative h-full w-full overflow-hidden rounded-lg sm:rounded-xl bg-gray-100">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={restaurant.businessName}
                      className={`absolute size-full object-cover transition-all duration-500 ease-in-out ${
                        index === currentIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                      style={{
                        transform:
                          index === currentIndex
                            ? "translateX(0) scale(1)"
                            : "translateX(100%) scale(1.05)",
                      }}
                    />
                  ))}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {(restaurant.badge || restaurant.offer) && (
                  <span className="absolute top-2 left-2 bg-yellow-500/95 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white whitespace-nowrap">
                    {restaurant.badge || restaurant.offer}
                  </span>
                )}

                <button className="absolute top-2 right-4 text-white cursor-pointer text-base sm:text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleDotClick(restaurantId, index, e)}
                        className={`block rounded-full transition-all duration-300 ease-out cursor-pointer focus:outline-none ${
                          index === currentIndex
                            ? "bg-white scale-125 w-4 sm:w-6 h-1.5 sm:h-2 shadow-md"
                            : "bg-white/70 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-white/90"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="pt-3 px-2 sm:px-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex w-full justify-between">
                    <h3 className="text-base sm:text-lg font-semibold capitalize text-gray-900 leading-tight line-clamp-1">
                      {restaurant.businessName}
                    </h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1 text-sm sm:text-base" />
                      <span className="text-sm font-semibold text-gray-900">
                        {restaurant.rating?.toFixed(1)}
                      </span>
                      {/* <span className="text-xs sm:text-sm text-gray-500 ml-1">
                        ({restaurant.reviews?.toLocaleString() || 0} reviews)
                      </span> */}
                    </div>
                  </div>

                  {cuisinesArray.length > 0 && (
                    <div className="inline-flex flex-wrap gap-1.5  sm:gap-2 mt-2">
                      {(Array.isArray(restaurant.cuisines)
                        ? restaurant.cuisines
                        : restaurant.cuisines
                            ?.split(",")
                            .map((c) => c.trim()) || []
                      )
                        .slice(0, 3)
                        .map((category, index) => {
                          const classes =
                            cuisineColorPalette[
                              index % cuisineColorPalette.length
                            ];
                          return (
                            <div
                              key={index}
                              className={`px-3 py-2 ${classes} rounded-full bg-gray-200 text-xs text-zinc-600 font-medium leading-none whitespace-nowrap`}
                            >
                              {category}
                            </div>
                          );
                        })}
                      {restaurant.cuisines &&
                        (Array.isArray(restaurant.cuisines)
                          ? restaurant.cuisines.length
                          : restaurant.cuisines.split(",").length) > 3 && (
                          <div className="px-2 py-1 rounded-sm bg-gray-100 outline-1 outline-gray-200 text-xs text-gray-500 font-medium leading-none">
                            +
                            {Math.max(
                              0,
                              (Array.isArray(restaurant.cuisines)
                                ? restaurant.cuisines.length
                                : restaurant.cuisines.split(",").length) - 3
                            )}
                          </div>
                        )}
                    </div>
                  )}
                  <div className="flex  mt-4 items-center gap-1 sm:text-sm text-xs  text-gray-500 ">
                    <FiMapPin />
                    <p className="line-clamp-1 ">
                      <span>{restaurant.address}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 w-full flex justify-ed items-ed-safe">
                  <Button
                    onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    className="
                      w-full text-sm font-semibold 
                      rounded-full py-3 tracking-wide 
                      text-white hover:cursor-pointer
                      bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]
                      
                      transition-all duration-200 shadow-sm"
                  >
                    Reserve Table
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more - responsive */}
      {(restaurants.length > limit && (
        <div className="mt-6 sm:mt-8 text-center">
        <button onClick={() => {
          limit += 4
        }} className="text-teal-700 hover:underline flex items-center justify-center mx-auto transition-colors duration-200 text-sm sm:text-base font-medium">
          <span>Show more offers</span>
          <FiChevronsDown className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      ))}
    </div>
  );
};

export const TableGridTwo = ({ title, type }) => {
  const { currentIndices, handleMouseEnter, handleMouseLeave, handleDotClick } =
    useCarouselLogic();
  const { restaurants, isLoading } = useRestaurantData("hotel", type);
  const navigate = useNavigate();

  if (isLoading) return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} class="rounded-2xl bg-white shadow-md overflow-hidden">
          <div class="h-44 w-full bg-gray-200 animate-pulse"></div>
          <div class="p-4 space-y-4">
            <div class="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          <div class="flex gap-2">
            <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
  ))};
    </div>
  );

  if (!restaurants || restaurants.length === 0) return null;

  let limit = 4;

  return (
    <div className="mb-12 md:mb-20 lg:mb-[92px] px-4 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        className="flex justify-between items-center mb-4 sm:mb-6 w-auto text-gray-900 text-sm sm:text-base font-medium leading-none"
      >
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1 sm:ml-2" />
      </Button>

      {/* Responsive grid container */}
      <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide sm:scrollbar-default pb-4 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        {restaurants?.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const restaurantId = restaurant._id || String(restaurant.id);
          const currentIndex = currentIndices[restaurantId] || 0;
          const multipleImages = hasMultipleImages(restaurant);
          const cuisinesArray = Array.isArray(restaurant.cuisines)
            ? restaurant.cuisines
            : restaurant.cuisines
                ?.split(",")
                .map((c) => c.trim())
                .filter(Boolean) || [];
          return (
            <div
              key={restaurantId}
              className="snap-start min-w-[280px] sm:min-w-0 w-[280px] sm:w-auto h-auto sm:h-full flex-shrink-0 sm:flex-shrink cursor-pointer pt-2 pb-4 flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
              onMouseEnter={() =>
                handleMouseEnter(
                  restaurantId,
                  restaurant,
                  getImagesForRestaurant,
                  hasMultipleImages
                )
              }
              onMouseLeave={() => handleMouseLeave(restaurantId)}
            >
              {/* Image Section */}
              <div className="relative h-40 sm:h-44 w-full  cursor-pointer aspect-video">
                <div className="relative h-full w-full overflow-hidden rounded-t-lg sm:rounded-t-xl bg-gray-100">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={restaurant.businessName}
                      className={`absolute size-full object-cover transition-all duration-500 ease-in-out ${
                        index === currentIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                      style={{
                        transform:
                          index === currentIndex
                            ? "translateX(0) scale(1)"
                            : "translateX(100%) scale(1.05)",
                      }}
                    />
                  ))}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {(restaurant.badge || restaurant.offer) && (
                  <span className="absolute top-2 left-2 bg-yellow-500/95 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white whitespace-nowrap">
                    {restaurant.badge || restaurant.offer}
                  </span>
                )}
                <button className="absolute top-2 right-4 text-white cursor-pointer text-base sm:text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleDotClick(restaurantId, index, e)}
                        className={`block rounded-full  transition-all duration-300 ease-out cursor-pointer focus:outline-none ${
                          index === currentIndex
                            ? "bg-white scale-125 w-4 sm:w-6 h-1.5 sm:h-2 shadow-md"
                            : "bg-white/70 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-white/90"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="pt-3 px-2 sm:px-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex w-full justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 capitalize leading-tight line-clamp-1">
                      {restaurant.businessName}
                    </h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1 text-sm sm:text-base" />
                      <span className="text-sm font-semibold text-gray-900">
                        {restaurant.rating?.toFixed(1)}
                      </span>
                      {/* <span className="text-xs sm:text-sm text-gray-500 ml-1">
                        ({restaurant.reviews?.toLocaleString() || 0} reviews)
                      </span> */}
                    </div>
                  </div>

                  {cuisinesArray.length > 0 && (
                    <div className="inline-flex flex-wrap gap-1.5  sm:gap-2 mt-2">
                      {(Array.isArray(restaurant.cuisines)
                        ? restaurant.cuisines
                        : restaurant.cuisines
                            ?.split(",")
                            .map((c) => c.trim()) || []
                      )
                        .slice(0, 3)
                        .map((category, index) => {
                          const classes =
                            cuisineColorPalette[
                              index % cuisineColorPalette.length
                            ];
                          return (
                            <div
                              key={index}
                              className={`px-3 py-2 ${classes} rounded-full bg-gray-200 text-xs text-zinc-600 font-medium leading-none whitespace-nowrap`}
                            >
                              {category}
                            </div>
                          );
                        })}
                      {restaurant.cuisines &&
                        (Array.isArray(restaurant.cuisines)
                          ? restaurant.cuisines.length
                          : restaurant.cuisines.split(",").length) > 3 && (
                          <div className="px-2 py-1 rounded-sm bg-gray-100 outline-1 outline-gray-200 text-xs text-gray-500 font-medium leading-none">
                            +
                            {Math.max(
                              0,
                              (Array.isArray(restaurant.cuisines)
                                ? restaurant.cuisines.length
                                : restaurant.cuisines.split(",").length) - 3
                            )}
                          </div>
                        )}
                    </div>
                  )}

                  <div className="flex  mt-4 items-center gap-1 sm:text-sm text-xs  text-gray-500 ">
                    <FiMapPin />
                    <p className="line-clamp-1 ">
                      <span>{restaurant.address}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex text-black justify-start items-center gap-1">
                      <div className="text-lg font-bold leading-none">
                        ₦{restaurant.priceRange}
                      </div>
                      <div className="text-xs font-normal leading-none">
                        /night
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 w-full flex ">
                    <Button
                      onClick={() => navigate(`/hotels/${restaurant._id}`)}
                      className="
    w-full text-sm font-semibold 
    rounded-full py-3 tracking-wide 
    text-white cursor-pointer
    transition-all duration-200 shadow-sm"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more - responsive */}
      {(restaurants.length > limit && (
        <div className="mt-6 sm:mt-8 text-center">
        <button onClick={() => {
          limit += 4
        }} className="text-teal-700 hover:underline flex items-center justify-center mx-auto transition-colors duration-200 text-sm sm:text-base font-medium">
          <span>Show more offers</span>
          <FiChevronsDown className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      ))}
    </div>
  );
};

export const TableGridThree = ({ title, type }) => {
  const { currentIndices, handleMouseEnter, handleMouseLeave, handleDotClick } =
    useCarouselLogic();
  const { restaurants, isLoading } = useRestaurantData("club", type);
  const navigate = useNavigate();

  if (isLoading) return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} class="rounded-2xl bg-white shadow-md overflow-hidden">
          <div class="h-44 w-full bg-gray-200 animate-pulse"></div>
          <div class="p-4 space-y-4">
            <div class="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          <div class="flex gap-2">
            <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
  ))};
    </div>
  );

  if (!restaurants || restaurants.length === 0) return null;

  let limit = 4;

  return (
    <div className="mb-12 md:mb-20 lg:mb-[92px] px-4 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        className="flex justify-between items-center mb-4 sm:mb-6 w-auto text-gray-900 text-sm sm:text-base font-medium leading-none"
      >
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1 sm:ml-2" />
      </Button>

      {/* Responsive grid container */}
      <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide sm:scrollbar-default pb-4 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
        {restaurants?.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const restaurantId = restaurant._id || String(restaurant.id);
          const currentIndex = currentIndices[restaurantId] || 0;
          const multipleImages = hasMultipleImages(restaurant);
          const categories = Array.isArray(restaurant.categories)
            ? restaurant.categories
            : restaurant.categories
                ?.split(",")
                .map((c) => c.trim())
                .filter(Boolean) || [];

          return (
            <div
              key={restaurantId}
              className="snap-start min-w-[280px] sm:min-w-0 w-[280px] sm:w-auto h-auto sm:h-full flex-shrink-0 sm:flex-shrink cursor-pointer pt- pb-4 flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
              onMouseEnter={() =>
                handleMouseEnter(
                  restaurantId,
                  restaurant,
                  getImagesForRestaurant,
                  hasMultipleImages
                )
              }
              onMouseLeave={() => handleMouseLeave(restaurantId)}
            >
              {/* Image Section */}
              <div className="relative h-40 sm:h-44 w-full  cursor-pointer aspect-video">
                <div className="relative h-full w-full overflow-hidden rounded-t-lg sm:rounded-t-xl bg-gray-100">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={restaurant.businessName}
                      className={`absolute size-full object-cover transition-all duration-500 ease-in-out ${
                        index === currentIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                      style={{
                        transform:
                          index === currentIndex
                            ? "translateX(0) scale(1)"
                            : "translateX(100%) scale(1.05)",
                      }}
                    />
                  ))}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.offer && (
                  <span className="absolute top-2 left-4 bg-yellow-500/95 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white whitespace-nowrap">
                    {restaurant.offer}
                  </span>
                )}

                <button className="absolute top-2 right-4 text-white cursor-pointer text-base sm:text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleDotClick(restaurantId, index, e)}
                        className={`block rounded-full transition-all duration-300 ease-out cursor-pointer focus:outline-none ${
                          index === currentIndex
                            ? "bg-white scale-125 w-4 sm:w-6 h-1.5 sm:h-2 shadow-md"
                            : "bg-white/70 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-white/90"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="pt-3 px-2 sm:px-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex w-full justify-between">
                    <h3 className="text-base sm:text-lg font-semibold capitalize  text-gray-900 leading-tight line-clamp-1">
                      {restaurant.businessName}
                    </h3>

                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1 text-sm sm:text-base" />
                      <span className="text-sm font-semibold text-gray-900">
                        {restaurant.rating?.toFixed(1)}
                      </span>
                      {/* <span className="text-xs sm:text-sm text-gray-500 ml-1">
                        ({restaurant.reviews?.toLocaleString() || 0} reviews)
                      </span> */}
                    </div>
                  </div>

                  {categories.length > 0 && (
                    <div className="inline-flex flex-wrap gap-1.5 sm:gap-2 ">
                      {categories.slice(0, 3).map((category, index) => {
                        const classes =
                          cuisineColorPalette[
                            index % cuisineColorPalette.length
                          ];
                        return (
                          <div
                            key={index}
                            className={`px-3 py-2 ${classes} rounded-full bg-gray-200 text-xs text-zinc-600 font-medium leading-none whitespace-nowrap`}
                          >
                            {category}
                          </div>
                        );
                      })}

                      {categories.length > 3 && (
                        <div className="px-2 py-1 rounded-sm bg-gray-100 outline-1 outline-gray-200 text-xs text-gray-500 font-medium leading-none">
                          +{categories.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex  mt-4 items-center gap-1 sm:text-sm text-xs  text-gray-500 ">
                    <FiMapPin />
                    <p className="line-clamp-1 ">
                      <span>{restaurant.address}</span>
                    </p>
                  </div>

                  <div className="flex text-black mt-4 justify-start items-center gap-1">
                    <div className="font-bold leading-none">
                      Table from
                    </div>
                    <div className="font-bold leading-none">
                      ₦{restaurant.priceRange}
                    </div>
                  </div>
                </div>

                <div className="mt-4 w-full cursor-pointer flex ">
                  <Button
                    onClick={() => navigate(`/clubs/${restaurant._id}`)}
                    className="
    w-full text-sm font-semibold 
    rounded-full py-3 tracking-wide 
    text-white cursor-pointer                      bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]
    transition-all duration-200 shadow-sm
  "
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more - responsive */}
      {(restaurants.length > limit && (
        <div className="mt-6 sm:mt-8 text-center">
        <button onClick={() => {
          limit += 4
        }} className="text-teal-700 hover:underline flex items-center justify-center mx-auto transition-colors duration-200 text-sm sm:text-base font-medium">
          <span>Show more offers</span>
          <FiChevronsDown className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      ))}
    </div>
  );
};

export default TableGrid;



export const TableGridFour = ({ title }) => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getOffers();
        setMenus(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl bg-white shadow-md overflow-hidden">
          <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
          <div className="p-4 space-y-4">
            <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!menus || menus.length === 0) return null;

  let limit = 4;

  return (
    <div className="mb-12 md:mb-20 lg:mb-[92px] px-4 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        className="flex justify-between items-center mb-4 sm:mb-6 w-full sm:w-auto text-gray-900 text-sm sm:text-base font-medium leading-none"
      >
        <h2>{title}</h2>
        <FiChevronRight className="ml-1 sm:ml-2" />
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {menus.slice(0, limit)?.map((menu) => (
          <div
            key={menu._id}
            onClick={() => navigate(`/restaurants/${menu.vendor._id}`)}
            className="group cursor-pointer bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden h-full flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-gray-100">
              <img
                src={menu.coverImage}
                alt={menu.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Badge */}
              <div className="absolute top-3 left-3 bg-orange-500/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                {menu.mealTimes?.[0] || 'Special'}
              </div>

              {/* Heart Button */}
              <button className="absolute top-3 right-3 text-white cursor-pointer text-lg transition-all duration-300 hover:scale-110 drop-shadow-md bg-black/20 rounded-full p-2 hover:bg-black/40">
                <Heart size={18} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Dish Name */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                  {menu.name}
                </h3>

                {/* Restaurant Info */}
                <div className="flex items-center gap-2">
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {menu.vendor.businessName}
                  </div>
                  {menu.vendor.rating && (
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500 text-xs" />
                      <span className="text-xs font-semibold text-gray-700">
                        {menu.vendor.rating?.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {menu.menuType && menu.menuType.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {menu.menuType.slice(0, 2).map((type, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price and Button */}
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₦{menu.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">{menu.pricingModel}</span>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/restaurants/${menu.vendor._id}`);
                  }}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-full transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95"
                >
                  Order Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more */}
      {(menus.length > limit && (
        <div className="mt-6 sm:mt-8 text-center">
        <button onClick={() => {
          limit += 4
        }} className="text-teal-700 hover:underline flex items-center justify-center mx-auto transition-colors duration-200 text-sm sm:text-base font-medium">
          <span>Show more offers</span>
          <FiChevronsDown className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      ))}
    </div>
  );
};
