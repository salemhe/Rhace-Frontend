import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Header from "@/components/user/Header";
import { useFavorites } from "@/hooks/favorites";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";

// Enhanced dummy data with multiple images
const restaurantsData = [
  {
    _id: "r1",
    businessName: "The Golden Spoon",
    profileImages: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    ],
    rating: 4.8,
    reviews: 245,
    cuisines: ["Fine Dining", "Italian Cuisine", "Wine Bar"],
    address: "123 Main Street, Downtown",
    isFavorite: true,
    badge: "Popular",
  },
  {
    _id: "r2",
    businessName: "Sushi Paradise",
    profileImages: [
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800",
      "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800",
    ],
    rating: 4.6,
    reviews: 189,
    cuisines: ["Japanese", "Sushi Bar", "Asian Fusion"],
    address: "456 Ocean Ave, Waterfront",
    isFavorite: true,
    offer: "20% off",
  },
  {
    _id: "r3",
    businessName: "Burger Haven",
    profileImages: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    ],
    rating: 4.5,
    reviews: 312,
    cuisines: ["American", "Burgers", "Casual Dining"],
    address: "789 Park Lane, Central District",
    isFavorite: true,
  },
  {
    _id: "r4",
    businessName: "Spice Route",
    profileImages: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800",
    ],
    rating: 4.7,
    reviews: 198,
    cuisines: ["Indian", "Vegetarian Options", "Takeaway"],
    address: "321 Curry Street, Little India",
    isFavorite: true,
    offer: "15% off",
  },
  {
    _id: "r5",
    businessName: "La Petite Bistro",
    profileImages: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800",
    ],
    rating: 4.9,
    reviews: 267,
    cuisines: ["French Cuisine", "Brunch", "Romantic Setting"],
    address: "555 Boulevard St, Arts Quarter",
    isFavorite: true,
  },
  {
    _id: "r6",
    businessName: "Taco Fiesta",
    profileImages: [
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800",
      "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800",
      "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800",
    ],
    rating: 4.4,
    reviews: 421,
    cuisines: ["Mexican", "Tacos", "Margaritas"],
    address: "888 Fiesta Road, South Side",
    isFavorite: true,
    badge: "Trending",
  },
];

const clubsData = [
  {
    _id: "c1",
    businessName: "Velvet Lounge",
    profileImages: [
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
      "https://images.unsplash.com/photo-1571266028243-d220c98a7313?w=800",
    ],
    rating: 4.5,
    reviews: 178,
    categories: ["Nightclub", "Live DJ", "VIP Tables"],
    address: "100 Night Street, Entertainment District",
    isFavorite: true,
    priceRange: "50,000",
    offer: "VIP Access",
  },
  {
    _id: "c2",
    businessName: "Pulse Nightclub",
    profileImages: [
      "https://images.unsplash.com/photo-1571266028243-d220c98a7313?w=800",
      "https://images.unsplash.com/photo-1598387846786-a41de1034d39?w=800",
    ],
    rating: 4.6,
    reviews: 294,
    categories: ["EDM Music", "Late Night", "Dance Floor"],
    address: "234 Beat Avenue, Party Zone",
    isFavorite: true,
    priceRange: "35,000",
    offer: "Free Entry",
  },
];

const hotelsData = [
  {
    _id: "h1",
    businessName: "Grand Palace Hotel",
    profileImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    ],
    rating: 4.9,
    reviews: 542,
    cuisines: ["5-Star", "Spa", "Fine Dining", "Pool"],
    address: "1 Royal Drive, City Center",
    isFavorite: true,
    priceRange: "120,000",
    offer: "Breakfast Included",
  },
  {
    _id: "h2",
    businessName: "Seaside Resort",
    profileImages: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    rating: 4.7,
    reviews: 389,
    cuisines: ["Beach Access", "Water Sports", "All-Inclusive"],
    address: "50 Ocean View Road, Coastal Area",
    isFavorite: true,
    priceRange: "95,000",
    offer: "Free Upgrade",
  },
];

// Common carousel logic hook (same as TableGrid)
const useCarouselLogic = () => {
  const [currentIndices, setCurrentIndices] = useState({});
  const [intervalIds, setIntervalIds] = useState({});

  const startImageRotation = (venueId, images) => {
    if (intervalIds[venueId]) {
      clearInterval(intervalIds[venueId]);
    }

    const intervalId = setInterval(() => {
      setCurrentIndices((prev) => {
        const currentIndex = prev[venueId] || 0;
        const nextIndex = (currentIndex + 1) % images.length;
        return { ...prev, [venueId]: nextIndex };
      });
    }, 1500);

    setIntervalIds((prev) => ({
      ...prev,
      [venueId]: intervalId,
    }));
  };

  const stopImageRotation = (venueId) => {
    if (intervalIds[venueId]) {
      clearInterval(intervalIds[venueId]);
      setIntervalIds((prev) => {
        const newIntervals = { ...prev };
        delete newIntervals[venueId];
        return newIntervals;
      });
    }
  };

  const handleMouseEnter = (
    venueId,
    venue,
    getImagesForVenue,
    hasMultipleImages
  ) => {
    if (!venue || !hasMultipleImages(venue)) return;

    const images = getImagesForVenue(venue);
    if (images.length <= 1) return;

    setCurrentIndices((prev) => ({
      ...prev,
      [venueId]: 0,
    }));

    startImageRotation(venueId, images);
  };

  const handleMouseLeave = (venueId) => {
    stopImageRotation(venueId);
    setCurrentIndices((prev) => ({
      ...prev,
      [venueId]: 0,
    }));
  };

  const handleDotClick = (venueId, index, e) => {
    e.stopPropagation();
    stopImageRotation(venueId);
    setCurrentIndices((prev) => ({
      ...prev,
      [venueId]: index,
    }));
  };

  useEffect(() => {
    return () => {
      Object.values(intervalIds).forEach((intervalId) =>
        clearInterval(intervalId as number)
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

// Common image handling functions
const getImagesForVenue = (venue) => {
  if (venue?.profileImages && venue?.profileImages?.length > 1) {
    return venue.profileImages;
  }
  return venue.profileImages?.[0]
    ? [venue.profileImages[0]]
    : ["/placeholder.jpg"];
};

const hasMultipleImages = (venue) => {
  const images = getImagesForVenue(venue);
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

const Favorites: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "restaurants" | "clubs" | "hotels"
  >("restaurants");
  const { currentIndices, handleMouseEnter, handleMouseLeave, handleDotClick } =
    useCarouselLogic();

  const { favorites, loading, fetchFavorites, toggleFavorite, isFavorite } =
    useFavorites();
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const hotel = favorites.filter((fav) => fav.vendorType === "hotel");
  const restaurant = favorites.filter((fav) => fav.vendorType === "restaurant");
  const club = favorites.filter((fav) => fav.vendorType === "club");
  
  // Filter favorites by type
  useEffect(() => {
    if (favorites.length > 0) {
      const filtered = (activeTab === "restaurants") ? restaurant :
        (activeTab === "clubs") ? club :
        (activeTab === "hotels") && hotel;
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites([]);
    }
  }, [favorites, activeTab]);
  const getCurrentData = () => {
    switch (activeTab) {
      case "restaurants":
        return restaurantsData;
      case "clubs":
        return clubsData;
      case "hotels":
        return hotelsData;
      default:
        return restaurantsData;
    }
  };

  const venues = filteredFavorites;

  const getCategories = (venue) => {
    if (activeTab === "restaurants" || activeTab === "hotels") {
      return venue.cuisines || [];
    }
    return venue.categories || [];
  };

  const handleClick = (venueId) => {
    const basePath =
      activeTab === "restaurants"
        ? "/restaurants"
        : activeTab === "clubs"
        ? "/clubs"
        : "/hotels";
    console.log(`Navigate to: ${basePath}/${venueId}`);
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "restaurants":
        return "Reserve Table";
      case "clubs":
        return "Book now";
      case "hotels":
        return "Book now";
      default:
        return "View details";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mt-24 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex  mt-28 flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide sm:scrollbar-default pb-4 sm:pb-0 -mx-4 sm:mx-0 px-2 sm:px-0 gap-6 m-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white shadow-md  snap-start min-w-[185px] sm:min-w-0 w-[185px] sm:w-auto h-auto sm:h-full flex flex-col sm:rounded-2xl overflow-hidden transition-all duration-300"
              >
                <div className="h-30 sm:h-44 w-full bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-4">
                  <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
            ;
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mt-24 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("restaurants")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "restaurants"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Restaurants
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                  {restaurant.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("clubs")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "clubs"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Clubs
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                  {club.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("hotels")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "hotels"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Hotels
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                  {hotel.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {venues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-20 h-20 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mt-6">
              No favorites yet
            </h2>
            <p className="text-gray-500 mt-2 max-w-sm">
              When you add restaurants, clubs, or hotels to your favorites,
              they'll appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-nowrap sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide sm:scrollbar-default pb-4 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
            {venues.map((venue) => {
              const images = getImagesForVenue(venue.vendor);
              const venueId = venue.vendor._id;
              const currentIndex = currentIndices[venueId] || 0;
              const multipleImages = hasMultipleImages(venue.vendor);
              const categories = getCategories(venue.vendor);

              return (
                <div
                  key={venueId}
                  className="snap-start min-w-[185px] sm:min-w-0 w-[185px] sm:w-auto h-auto sm:h-full flex-shrink-0 sm:flex-shrink cursor-pointer  pb-2 sm:pb-4 flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
                  onMouseEnter={() =>
                    handleMouseEnter(
                      venueId,
                      venue,
                      getImagesForVenue,
                      hasMultipleImages
                    )
                  }
                  onMouseLeave={() => handleMouseLeave(venueId)}
                >
                  {/* Image Section */}
                  <div className="relative pt-2 px-2  h-30 sm:h-44 w-full px- cursor-pointer aspect-video">
                    <div className="relative h-full w-full overflow-hidden rounded-lg sm:rounded-xl bg-gray-100">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${venue.vendor.businessName} - Image ${index + 1}`}
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

                    {(venue.vendor.badge || venue.vendor.offer) && (
                      <span className="absolute top-4 left-4 bg-gray-100/95 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white whitespace-nowrap">
                        {venue.vendor.badge || venue.vendor.offer}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(venue._id);
                      }}
                      className="absolute top-4 right-4 text-white cursor-pointer text-base sm:text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md"
                    >
                      <FiHeart className="fill-red-500 text-red-500" />
                    </button>

                    {multipleImages && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => handleDotClick(venueId, index, e)}
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
                    <div className="">
                      <div className="flex w-full flex-col-reverse justify-between">
                        <h3 className="text-base sm:text-lg font-semibold capitalize text-gray-900 leading-tight line-clamp-1">
                          {venue.businessName}
                        </h3>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-500 mr-1 text-sm sm:text-base" />
                          <span className="text-sm font-semibold text-gray-900">
                            {venue.vendor.rating?.toFixed(1)}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 ml-1">
                            ({venue.vendor.reviews?.toLocaleString() || 0} reviews)
                          </span>
                        </div>
                      </div>

                      {categories.length > 0 && (
                        <div className="inline-flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                          {categories.slice(0, 2).map((category, index) => {
                            const classes =
                              cuisineColorPalette[
                                index % cuisineColorPalette.length
                              ];
                            return (
                              <div
                                key={index}
                                className={`px3 py2 rounded-full text-xs text-zinc-600 font-medium leading-none whitespace-nowrap`}
                              >
                                {category},
                              </div>
                            );
                          })}

                          {/* {categories.length > 2 && (
                            <div className="px-2 py-1 rounded-sm bg-gray-100 outline-1 outline-gray-200 text-xs text-gray-500 font-medium leading-none">
                              +{categories.length - 2}
                            </div>
                          )} */}
                        </div>
                      )}

                      <div className="flex  mt- items-center gap-1 sm:text-sm text-xs  text-gray-500 ">
                        {/* <FiMapPin /> */}
                        <p className="line-clamp-1 ">
                          <span>{venue.vendor.address}</span>
                        </p>
                      </div>

                      {(activeTab === "clubs" || activeTab === "hotels") &&
                        venue.vendor.priceRange && (
                          <div className="flex justify-start text-xl mt-4 text-black items-center gap-1">
                            {activeTab === "clubs" && (
                              <div className="text-zinc-00 text-sm font-bold leading-none">
                                Table from
                              </div>
                            )}
                            <div className=" text-sm font-bold leading-none">
                              ₦{venue.vendor.priceRange}
                            </div>
                            {activeTab === "hotels" && (
                              <div className="text-zinc-00 text-xs font-normal leading-none">
                                /night
                              </div>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="mt-2 sm:mt-4 w-full flex justify- items-en-safe">
                      <Button
                        variant={"primary"}
                        size={"big"}
                        onClick={() => handleClick(venueId)}
                        className=" hidden sm:flex
                      w-full text-xs sm:text-sm font-semibold 
                      rounded-full py-1 sm:py-3 tracking-wide 
                      text-white hover:cursor-pointer
                      bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]
                      
                      transition-all duration-200 shadow-sm"
                      >
                        {getButtonText()}
                      </Button>
                      <Button
                        variant={"primary"}
                        size={"small"}
                        onClick={() => handleClick(venueId)}
                        className=" flex sm:hidden
                      w-full text-[10px] sm:text-sm font-medium
                      rounded-full py-1.5 sm:py-3 tracking-wide 
                      text-white hover:cursor-pointer
                      bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:from-[#084F4F] hover:to-[#064E5C]
                      
                      transition-all duration-200 shadow-sm"
                      >
                        {getButtonText()}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
