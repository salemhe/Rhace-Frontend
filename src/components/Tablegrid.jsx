import { useCallback, useEffect, useState } from "react";
import { FiChevronRight, FiChevronsDown, FiHeart, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router";
import blueori from "../assets/blue-origin.png";
import blueclub from "../assets/clubs/image2.jpg";
import rest from "../assets/restaurant.jpg";
import { Button } from "./ui/button";


const DUMMY_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Kapaddocia",
  image: rest,
  rating: 4.8,
  reviews: 1000,
  cuisine: "International, Turkish, Contemporary",
  location: "Lagos, Ikeja",
  badge: i % 2 === 0 ? "Guest's Recommended" : undefined,
}));

const DUMMY_HOTEL_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Kapaddocia",
  image: blueori,
  rating: 4.8,
  reviews: 1000,
  cuisine: "International, Turkish, Contemporary",
  location: "Lagos, Ikeja",
  badge: i % 2 === 0 ? "Guest's Recommended" : undefined,
  price: 1000,
  discount: 10,
}));
const DUMMY_CLUB_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Rhythm Lounge",
  image: blueclub,
  rating: 4.8,
  reviews: 1000,
  cuisine: ["Afrobeat", "Live DJ", "Ladies Night"], // <-- array
  location: "Lagos, Ikeja",
  badge: i % 2 === 0 ? "Guest's Recommended" : undefined,
  price: 1000,
  discount: "few slots left",
}));

const TableGrid = ({ title, restaurants = DUMMY_DATA }) => {
  const [currentIndices, setCurrentIndices] = useState({});
  const [resetTimeouts, setResetTimeouts] = useState({});
  const [isHovering, setIsHovering] = useState({});
  const navigate = useNavigate();

  const getImagesForRestaurant = (restaurant) => {
    if (restaurant?.profileImages && restaurant?.profileImages?.length > 1) {
      return restaurant?.profileImages?.map(image => image.url);
    }
    // Only return single image if there's only one or no profile images
    return restaurant.image ? [restaurant.image] : ['/placeholder.jpg'];
  };

  const hasMultipleImages = useCallback((restaurant) => {
    const images = getImagesForRestaurant(restaurant);
    return images.length > 1;
  }, []);

  const handleMouseEnter = (restaurantId) => {
    const restaurant = restaurants.find(r => (r._id || String(r.id)) === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: true }));
    
    if (resetTimeouts[restaurantId]) {
      clearTimeout(resetTimeouts[restaurantId]);
      setResetTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[restaurantId];
        return newTimeouts;
      });
    }
  };

  const handleMouseMove = useCallback((e, restaurantId) => {
    const restaurant = restaurants.find(r => (r._id || String(r.id)) === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const images = getImagesForRestaurant(restaurant);
    const imageIndex = Math.min(Math.max(Math.floor(xPercent / (100 / images.length)), 0), images.length - 1);
    
    setCurrentIndices(prev => ({
      ...prev,
      [restaurantId]: imageIndex
    }));
  }, [restaurants, hasMultipleImages]);

  const handleMouseLeave = useCallback((restaurantId) => {
    const restaurant = restaurants.find(r => (r._id || String(r.id)) === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: false }));

    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [restaurantId]: 0
      }));
    }, 300); // Reduced timeout for smoother experience

    setResetTimeouts(prev => ({
      ...prev,
      [restaurantId]: timeout
    }));
  }, [restaurants, hasMultipleImages]);

  useEffect(() => {
    return () => {
      Object.values(resetTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [resetTimeouts]);
  return (
    <div className="mb-[92px]">
      <Button
        variant="outline"
        className="flex justify-between items-center mb-6 text-gray-900 text-sm font-medium leading-none"
      >
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1" />
      </Button>

      {/* Desktop grid */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const restaurantId = restaurant._id || String(restaurant.id);
          const currentIndex = currentIndices[restaurantId] || 0;
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurantId];

          return (
            <div
              key={restaurantId}
              onClick={() => {
                navigate(`/restaurants/${restaurant._id}`);
              }}
              className="h-80 px-2 cursor-pointer pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image Section */}
              <div
                className="relative h-52 w-full cursor-pointer"
                onMouseEnter={() => handleMouseEnter(restaurantId)}
                onMouseMove={
                  multipleImages ? (e) => handleMouseMove(e, restaurantId) : undefined
                }
                onMouseLeave={() => handleMouseLeave(restaurantId)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages
                          ? `will-change-transform ${hovering ? "brightness-105" : ""}`
                          : "hover:scale-105"
                      }`}
                      style={
                        multipleImages
                          ? {
                              transform: `translateX(${(index - currentIndex) * 100}%)`,
                              transition: hovering
                                ? "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease"
                                : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease",
                            }
                          : {
                              transition: "transform 0.3s ease, brightness 0.3s ease",
                            }
                      }
                    />
                  ))}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full transition-all duration-300 ease-out ${
                          index === currentIndex
                            ? "bg-white scale-125 w-6 h-2 shadow-md"
                            : "bg-white/70 w-2 h-2 hover:bg-white/90"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant?.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-sm text-gray-500">{restaurant.location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile scroll */}
      <div className="flex sm:hidden gap-4 overflow-x-auto scrollbar-hide">
        {restaurants.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const restaurantId = restaurant._id || String(restaurant.id);
          const currentIndex = currentIndices[restaurantId] || 0;
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurantId];

          return (
            <div
              key={restaurantId}
              onClick={() => {
                navigate(`/restaurants/${restaurant._id}`);
              }}
              className="min-w-[260px] max-w-[260px] h-72 px-2 cursor-pointer pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Same content inside box, no cutoff */}
              <div
                className="relative h-44 w-full cursor-pointer"
                onMouseEnter={() => handleMouseEnter(restaurantId)}
                onMouseMove={
                  multipleImages ? (e) => handleMouseMove(e, restaurantId) : undefined
                }
                onMouseLeave={() => handleMouseLeave(restaurantId)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages
                          ? `will-change-transform ${hovering ? "brightness-105" : ""}`
                          : "hover:scale-105"
                      }`}
                      style={
                        multipleImages
                          ? {
                              transform: `translateX(${(index - currentIndex) * 100}%)`,
                              transition: hovering
                                ? "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease"
                                : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease",
                            }
                          : {
                              transition: "transform 0.3s ease, brightness 0.3s ease",
                            }
                      }
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full ${
                          index === currentIndex
                            ? "bg-white scale-125 w-6 h-2"
                            : "bg-white/70 w-2 h-2"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant?.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-xs text-gray-500">{restaurant.location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more (hidden on mobile) */}
      <div className="mt-6 text-center hidden sm:block">
        <button className="text-teal-700 mb-6 hover:underline flex items-center justify-center mx-auto transition-colors duration-200">
          <span className="text-sm font-medium">Show more</span>
          <FiChevronsDown className="text-center w-6 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TableGrid;

export const TableGridTwo = ({ title, restaurants = DUMMY_HOTEL_DATA }) => {
  const [currentIndices, setCurrentIndices] = useState({});
  const [resetTimeouts, setResetTimeouts] = useState({});
  const [isHovering, setIsHovering] = useState({});
  const navigate = useNavigate();
  
  const getImagesForRestaurant = (restaurant) => {
    if (restaurant?.profileImages && restaurant?.profileImages?.length > 1) {
      return restaurant?.profileImages;
    }
    // Only return single image if there's only one or no profile images
    return restaurant.image ? [restaurant.image] : ['/placeholder.jpg'];
  };

  const hasMultipleImages = useCallback((restaurant) => {
    const images = getImagesForRestaurant(restaurant);
    return images.length > 1;
  }, []);

  const handleMouseEnter = (restaurantId) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: true }));
    
    if (resetTimeouts[restaurantId]) {
      clearTimeout(resetTimeouts[restaurantId]);
      setResetTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[restaurantId];
        return newTimeouts;
      });
    }
  };

  const handleMouseMove = useCallback((e, restaurantId) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const images = getImagesForRestaurant(restaurant);
    const imageIndex = Math.min(Math.max(Math.floor(xPercent / (100 / images.length)), 0), images.length - 1);
    
    setCurrentIndices(prev => ({
      ...prev,
      [restaurantId]: imageIndex
    }));
  }, [hasMultipleImages]);

  const handleMouseLeave = useCallback((restaurantId) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: false }));

    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [restaurantId]: 0
      }));
    }, 300);

    setResetTimeouts(prev => ({
      ...prev,
      [restaurantId]: timeout
    }));
  }, [hasMultipleImages]);

  useEffect(() => {
    return () => {
      Object.values(resetTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [resetTimeouts]);

  return (
    <div className="mb-[92px]">
      <Button variant="outline" className="flex justify-between items-center mb-6 text-gray-900 text-sm font-medium leading-none">
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1" />
      </Button>

      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants?.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const currentIndex = currentIndices[restaurant.id || 0];
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurant.id || 0];

          return (
            <div
              key={restaurant.id}
              onClick={() => {
                navigate(`/hotels/${restaurant._id}`);
              }}
              className="h-80 px-2 pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div 
                className={`relative h-52 w-full  cursor-pointer`}
                onMouseEnter={() => handleMouseEnter(restaurant.id || 0)}
                onMouseMove={multipleImages ? (e) => handleMouseMove(e, restaurant.id || 0) : undefined}
                onMouseLeave={() => handleMouseLeave(restaurant.id || 0)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={typeof image === 'string' ? image : image.url}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages 
                          ? `will-change-transform ${hovering ? 'brightness-105' : ''}` 
                          : 'hover:scale-105'
                      }`}
                      style={multipleImages ? {
                        transform: `translateX(${(index - currentIndex) * 100}%)`,
                        transition: hovering 
                          ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                          : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                      } : {
                        transition: 'transform 0.3s ease, brightness 0.3s ease'
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>
{/* 
                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full transition-all duration-300 ease-out ${
                          index === currentIndex 
                            ? 'bg-white scale-125 w-6 h-2 shadow-md' 
                            : 'bg-white/70 w-2 h-2 hover:bg-white/90'
                        }`}
                      />
                    ))}
                  </div>
                )} */}

                {/* {multipleImages && hovering && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
                    <div 
                      className="h-full bg-white/80 transition-all duration-200 ease-out"
                      style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                    />
                  </div>
                )} */}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-sm text-gray-500">{restaurant.location}</p>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex justify-start items-center gap-1">
                      <div className="justify-start text-gray-900 text-sm font-medium font-['Inter'] leading-none">${restaurant.price}</div>
                      <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-none">/night</div>
                    </div>
                    <div className="h-7 px-2 rounded-lg outline-1 outline-offset-[-1px] outline-yellow-500 inline-flex flex-col justify-center items-center gap-2">
                      <div className="inline-flex justify-start items-center gap-1.5">
                        <div className="w-4 h-4 relative overflow-hidden">
                          <div className="w-4 h-4 left-0 top-0 absolute">
                            <img 
                              width={100}
                              height={100} src="/sale_fill.svg" alt="discount"
                             />
                                  </div>
                        </div>
                        <div className="justify-start text-gray-900 text-xs font-medium font-['Inter'] leading-none tracking-tight">{restaurant.discount}% off</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

       {/* Mobile scroll */}
      <div className="flex sm:hidden gap-4 overflow-x-auto scrollbar-hide">
        {restaurants.map((restaurant) => {
         const images = getImagesForRestaurant(restaurant);
          const currentIndex = currentIndices[restaurant.id || 0];
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurant.id || 0];

          return (
            <div
              key={restaurant.id}
              onClick={() => {
                navigate(`/hotels/${restaurant._id}`);
              }}
              className="min-w-[260px] max-w-[260px] h-72 px-2 cursor-pointer pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Same content inside box, no cutoff */}
              <div
                className="relative h-44 w-full cursor-pointer"
                onMouseEnter={() => handleMouseEnter(restaurant.id || 0)}
                onMouseMove={
                  multipleImages ? (e) => handleMouseMove(e, restaurant.id || 0) : undefined
                }
                onMouseLeave={() => handleMouseLeave(restaurant.id || 0)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <img
                      key={index}
                       src={typeof image === 'string' ? image : image.url}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages
                          ? `will-change-transform ${hovering ? "brightness-105" : ""}`
                          : "hover:scale-105"
                      }`}
                      style={
                        multipleImages
                          ? {
                              transform: `translateX(${(index - currentIndex) * 100}%)`,
                              transition: hovering
                                ? "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease"
                                : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease",
                            }
                          : {
                              transition: "transform 0.3s ease, brightness 0.3s ease",
                            }
                      }
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full ${
                          index === currentIndex
                            ? "bg-white scale-125 w-6 h-2"
                            : "bg-white/70 w-2 h-2"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant?.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-xs text-gray-500">{restaurant.location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="text-teal-700 mb-6 hover:underline flex items-center justify-center mx-auto transition-colors duration-200">
          <span className="text-sm font-medium">Show more</span>
          <FiChevronsDown className="text-center w-6 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};
export const TableGridThree = ({ title, restaurants = DUMMY_CLUB_DATA }) => {
  const [currentIndices, setCurrentIndices] = useState({});
  const [resetTimeouts, setResetTimeouts] = useState({});
  const [isHovering, setIsHovering] = useState({});
  const navigate = useNavigate();
  
  const getImagesForRestaurant = (restaurant) => {
    if (restaurant?.profileImages && restaurant?.profileImages?.length > 1) {
      return restaurant?.profileImages;
    }
    // Only return single image if there's only one or no profile images
    return restaurant.image ? [restaurant.image] : ['/placeholder.jpg'];
  };

  const hasMultipleImages = useCallback((restaurant) => {
    const images = getImagesForRestaurant(restaurant);
    return images.length > 1;
  }, []);

  const handleMouseEnter = (restaurantId) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: true }));
    
    if (resetTimeouts[restaurantId]) {
      clearTimeout(resetTimeouts[restaurantId]);
      setResetTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[restaurantId];
        return newTimeouts;
      });
    }
  };
const cuisineColorPalette = [
  "bg-orange-100  outline-orange-200",
  "bg-green-100 outline-green-200",
  "bg-blue-100  outline-blue-200",
  "bg-purple-100  outline-purple-200",
  "bg-pink-100  outline-pink-200",
  "bg-yellow-100  outline-yellow-200",
  "bg-teal-100  outline-teal-200",
];

  const handleMouseMove = useCallback((e, restaurantId) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const images = getImagesForRestaurant(restaurant);
    const imageIndex = Math.min(Math.max(Math.floor(xPercent / (100 / images.length)), 0), images.length - 1);
    
    setCurrentIndices(prev => ({
      ...prev,
      [restaurantId]: imageIndex
    }));
  }, [hasMultipleImages]);

  const handleMouseLeave = useCallback((restaurantId) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: false }));

    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [restaurantId]: 0
      }));
    }, 300);

    setResetTimeouts(prev => ({
      ...prev,
      [restaurantId]: timeout
    }));
  }, [hasMultipleImages]);

  useEffect(() => {
    return () => {
      Object.values(resetTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [resetTimeouts]);

  return (
    <div className="mb-[92px]">
      <Button variant="outline" className="flex justify-between items-center mb-6 text-gray-900 text-sm font-medium leading-none">
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1" />
      </Button>

      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants?.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const currentIndex = currentIndices[restaurant.id || 0];
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurant.id || 0];

          return (
            <div
              key={restaurant.id}
              onClick={() => {
                navigate(`/hotels/${restaurant._id}`);
              }}
              className="h-80 px-2 pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div 
                className={`relative h-52 w-full  cursor-pointer`}
                onMouseEnter={() => handleMouseEnter(restaurant.id || 0)}
                onMouseMove={multipleImages ? (e) => handleMouseMove(e, restaurant.id || 0) : undefined}
                onMouseLeave={() => handleMouseLeave(restaurant.id || 0)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={typeof image === 'string' ? image : image.url}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages 
                          ? `will-change-transform ${hovering ? 'brightness-105' : ''}` 
                          : 'hover:scale-105'
                      }`}
                      style={multipleImages ? {
                        transform: `translateX(${(index - currentIndex) * 100}%)`,
                        transition: hovering 
                          ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                          : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                      } : {
                        transition: 'transform 0.3s ease, brightness 0.3s ease'
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>
{/* 
                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full transition-all duration-300 ease-out ${
                          index === currentIndex 
                            ? 'bg-white scale-125 w-6 h-2 shadow-md' 
                            : 'bg-white/70 w-2 h-2 hover:bg-white/90'
                        }`}
                      />
                    ))}
                  </div>
                )} */}

                {/* {multipleImages && hovering && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
                    <div 
                      className="h-full bg-white/80 transition-all duration-200 ease-out"
                      style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                    />
                  </div>
                )} */}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-900 text-sm font-medium font-['Inter'] leading-none">
                    {restaurant.name}
                  </h3>
              

                  <div className="inline-flex flex-wrap gap-2 mt-2">
  {(Array.isArray(restaurant.cuisine) 
    ? restaurant.cuisine 
    : restaurant.cuisine.split(",").map(c => c.trim())
  ).map((cuisine, index) => {
    const classes = cuisineColorPalette[index % cuisineColorPalette.length];
    return (
      <div
        key={index}
        className={`px-2 py-1 rounded-sm outline-1  ${classes} text-xs text-zinc-600  font-medium font-['Inter'] leading-none`}
      >
        {cuisine}
      </div>
    );
  })}
</div>


                </div>
                <div className="mt-2 justify-between flex">
                  
                  <p className="text-sm text-gray-500">{restaurant.location}</p>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex justify-start items-center gap-1">
                      <div className="text-zinc-600 text-sm font-medium font-['Inter'] leading-none">Table from</div>
                      <div className="justify-start text-gray-900 text-sm font-medium  leading-none">${restaurant.price}</div>
                      
                    </div>
                    <div className="h-7 px-2 flex-col  bg-zinc-100 rounded-lg outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-2">
                      <div className="inline-flex justify-start items-center gap-1.5">
                       
                        <div className="justify-start text-gray-900 text-xs font-medium font-['Inter'] leading-none tracking-tight">{restaurant.discount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

       {/* Mobile scroll */}
      <div className="flex sm:hidden gap-4 overflow-x-auto scrollbar-hide">
        {restaurants.map((restaurant) => {
         const images = getImagesForRestaurant(restaurant);
          const currentIndex = currentIndices[restaurant.id || 0];
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurant.id || 0];

          return (
            <div
              key={restaurant.id}
              onClick={() => {
                navigate(`/hotels/${restaurant._id}`);
              }}
              className="min-w-[260px] max-w-[260px] h-72 px-2 cursor-pointer pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Same content inside box, no cutoff */}
              <div
                className="relative h-44 w-full cursor-pointer"
                onMouseEnter={() => handleMouseEnter(restaurant.id || 0)}
                onMouseMove={
                  multipleImages ? (e) => handleMouseMove(e, restaurant.id || 0) : undefined
                }
                onMouseLeave={() => handleMouseLeave(restaurant.id || 0)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <img
                      key={index}
                       src={typeof image === 'string' ? image : image.url}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages
                          ? `will-change-transform ${hovering ? "brightness-105" : ""}`
                          : "hover:scale-105"
                      }`}
                      style={
                        multipleImages
                          ? {
                              transform: `translateX(${(index - currentIndex) * 100}%)`,
                              transition: hovering
                                ? "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease"
                                : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease",
                            }
                          : {
                              transition: "transform 0.3s ease, brightness 0.3s ease",
                            }
                      }
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full ${
                          index === currentIndex
                            ? "bg-white scale-125 w-6 h-2"
                            : "bg-white/70 w-2 h-2"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  
                  <h3 className="text-gray-900 text-sm font-medium font-['Inter'] leading-none">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant?.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-xs text-gray-500">{restaurant.location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="text-teal-700 mb-6 hover:underline flex items-center justify-center mx-auto transition-colors duration-200">
          <span className="text-sm font-medium">Show more</span>
          <FiChevronsDown className="text-center w-6 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};