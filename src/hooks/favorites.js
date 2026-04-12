import { userService } from "@/services/user.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFav, setIsLoadingFav] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user favorites
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getFavorites();
      const res = response.favorites || response.data || response;

      let favoritesArray = [];
      if (Array.isArray(res)) {
        favoritesArray = res;
      } else if (res?.data) {
        if (Array.isArray(res.data)) {
          favoritesArray = res.data;
        } else if (Array.isArray(res.data.favorites)) {
          favoritesArray = res.data.favorites;
        }
      }

      setFavorites(favoritesArray);
      return favoritesArray;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // INSTANT toggle with optimistic updates
  const toggleFavorite = async (vendorId, vendorData = {}) => {
    if (!vendorId) return;

    const vendorType = vendorData.type || vendorData.vendorType || "restaurant";
    
    // Check current status
    const isCurrentlyFavorite = favorites.some(
      (fav) =>
        fav.vendor?._id === vendorId ||
        fav.vendorId === vendorId ||
        fav._id === vendorId
    );

    // ⚡ INSTANT UI UPDATE (no waiting!)
    if (isCurrentlyFavorite) {
      // Remove immediately
      setFavorites((prev) =>
        prev.filter((fav) => {
          const favId = fav.vendor?._id || fav.vendorId || fav._id;
          return favId !== vendorId;
        })
      );
    } else {
      // Add immediately with optimistic data
      const optimisticFavorite = {
        _id: `temp-${vendorId}`,
        vendor: vendorData.vendor || {
          _id: vendorId,
          name: vendorData.name,
          image: vendorData.image,
          ...vendorData
        },
        vendorId: vendorId,
        vendorType: vendorType,
        createdAt: new Date().toISOString()
      };
      
      setFavorites((prev) => [...prev, optimisticFavorite]);
    }

    // 🔄 Background sync (user doesn't wait for this)
    try {
      setIsLoadingFav(vendorId);

      if (isCurrentlyFavorite) {
        await userService.removeFromFavorites(vendorId);
      } else {
        await userService.addToFavorites(vendorId, vendorType);
      }

      // Silently sync with server to get complete data
      await fetchFavorites();
    } catch (error) {
      console.error("Error syncing favorite:", error);
      
      // ⚠️ Revert on error
      toast.error(
        isCurrentlyFavorite 
          ? "Couldn't remove from favorites" 
          : "Couldn't add to favorites"
      );
      
      // Refetch to restore correct state
      await fetchFavorites();
    } finally {
      setIsLoadingFav("");
    }
  };

  // Check if a venue is favorite
  const isFavorite = (vendorId) => {
    if (!vendorId || !Array.isArray(favorites)) return false;

    return favorites.some((fav) => {
      const favId = fav.vendor?._id || fav.vendorId || fav._id;
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
    isLoadingFav,
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
  const user = useSelector((state) => state.auth.user);

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
          const res = await userService.getVendors(vendorType, user ? user.user?._id : "");
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
