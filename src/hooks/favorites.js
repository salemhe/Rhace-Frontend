import { userService } from "@/services/user.service";
import { useEffect, useState } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user favorites
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getFavorites();
      const res = response.favorites || response.data || response;
      console.log("Favorites API response:", res);

      // Handle different response structures
      let favoritesArray = [];

      if (Array.isArray(res)) {
        favoritesArray = res;
      } else if (res && Array.isArray(res.data)) {
        favoritesArray = res.data;
      } else if (res && res.data && typeof res.data === "object") {
        if (Array.isArray(res.data.items)) {
          favoritesArray = res.data.items;
        } else if (Array.isArray(res.data.results)) {
          favoritesArray = res.data.results;
        } else if (Array.isArray(res.data.favorites)) {
          favoritesArray = res.data.favorites;
        } else {
          favoritesArray = Object.values(res.data);
        }
      } else if (res && typeof res === "object") {
        favoritesArray = Object.values(res);
      }

      if (!Array.isArray(favoritesArray)) {
        favoritesArray = [];
      }

      console.log("Processed favorites array:", favoritesArray);
      setFavorites(favoritesArray);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError(error.message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status - IMPROVED ERROR HANDLING
  const toggleFavorite = async (vendorId, vendorType = "restaurant") => {
    if (!vendorId) {
      console.error("toggleFavorite called with invalid vendorId:", vendorId);
      setError("Invalid vendor ID");
      return;
    }

    // Ensure vendorType is ALWAYS set and valid
    const finalVendorType = vendorType || "restaurant";

    // Validate vendorType
    const allowedTypes = ["restaurant", "hotel", "club", "other"]; // Add your valid types
    if (!allowedTypes.includes(finalVendorType)) {
      console.error("Invalid vendorType:", finalVendorType);
      setError("Invalid vendor type");
      return;
    }

    console.log(`Toggling favorite for ${vendorId}, type: ${finalVendorType}`);

    try {
      setError(null);

      const isCurrentlyFavorite =
        Array.isArray(favorites) &&
        favorites.some(
          (fav) =>
            fav.vendor?._id === vendorId ||
            fav.vendorId === vendorId ||
            fav._id === vendorId ||
            (fav && typeof fav === "object" && fav.vendor === vendorId)
        );

      console.log(
        `Toggling favorite for ${vendorId}, type: ${finalVendorType}, currently favorite: ${isCurrentlyFavorite}`
      );

      if (isCurrentlyFavorite) {
        // Remove from favorites
        await userService.removeFromFavorites(vendorId);

        // Update state by filtering out the vendor
        setFavorites((prev) =>
          Array.isArray(prev)
            ? prev.filter((fav) => {
                const favId =
                  fav.vendor?._id || fav.vendorId || fav._id || fav.vendor;
                return favId !== vendorId;
              })
            : []
        );

        console.log(`Successfully removed ${vendorId} from favorites`);
      } else {
        // Add to favorites
        console.log(
          `Adding ${vendorId} to favorites with type: ${finalVendorType}`
        );
        const result = await userService.addToFavorites(
          vendorId,
          finalVendorType
        );
        console.log("Add to favorites result:", result);

        // Refetch to get complete data from server
        await fetchFavorites();

        console.log(`Successfully added ${vendorId} to favorites`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to toggle favorite";
      setError(errorMessage);

      // Revert optimistic update on error by refetching
      fetchFavorites();
    }
  };

  // Check if a venue is favorite
  const isFavorite = (vendorId) => {
    if (!vendorId) return false;

    if (!Array.isArray(favorites)) {
      console.warn("favorites is not an array:", favorites);
      return false;
    }

    return favorites.some((fav) => {
      const favId = fav.vendor?._id || fav.vendorId || fav._id || fav.vendor;
      return favId === vendorId;
    });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
};

// Common carousel logic hook
export const useCarouselLogic = () => {
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
export const useRestaurantData = (vendorType, type) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        if (type && type === "nearby") {
          const location = localStorage.getItem("userLocation");
          const loc = JSON.parse(location);
          const res = await userService.getNearest({
            longitude: loc.lng,
            latitude: loc.lat,
            type: vendorType,
          });
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
  }, [vendorType, type]);

  return { restaurants, isLoading };
};

// Common image handling functions
export const getImagesForRestaurant = (restaurant) => {
  if (restaurant?.profileImages && restaurant?.profileImages?.length > 1) {
    return restaurant?.profileImages?.map((image) =>
      typeof image === "string" ? image : image.url
    );
  }
  return restaurant.image ? [restaurant.image] : ["/placeholder.jpg"];
};

export const hasMultipleImages = (restaurant) => {
  const images = getImagesForRestaurant(restaurant);
  return images.length > 1;
};

// Common cuisine color palette
export const cuisineColorPalette = [
  "bg-orange-100 outline-orange-200",
  "bg-green-100 outline-green-200",
  "bg-blue-100 outline-blue-200",
  "bg-purple-100 outline-purple-200",
  "bg-pink-100 outline-pink-200",
  "bg-yellow-100 outline-yellow-200",
  "bg-teal-100 outline-teal-200",
];

// Image handling functions
export const getImagesForVenue = (venue) => {
  if (venue?.profileImages && venue?.profileImages?.length > 1) {
    return venue.profileImages;
  }
  return venue.profileImages?.[0]
    ? [venue.profileImages[0]]
    : ["/restaurant.jpg"];
};
