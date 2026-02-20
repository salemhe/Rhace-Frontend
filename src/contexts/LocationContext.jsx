import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom'; // or your router

const LocationContext = createContext();

// Constants
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const MOVEMENT_THRESHOLD_M = 500; // 500 meters
const STORAGE_KEY = 'userLocation';

// Pages where location is needed
const LOCATION_ENABLED_PAGES = ['/search', '/']; 

export const LocationProvider = ({ children }) => {
  const routerLocation = useRouterLocation();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Haversine distance formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Get cached location from localStorage
  const getCachedLocation = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      const age = Date.now() - parsed.timestamp;

      return age < CACHE_EXPIRY_MS ? parsed : null;
    } catch {
      return null;
    }
  };

  // Save location to localStorage
  const saveLocation = (lat, lng) => {
    const data = { lat, lng, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLocation({ lat, lng });
  };

  // Fetch fresh GPS location
  const fetchLocation = (cachedData = null) => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Check if user moved significantly
        if (cachedData) {
          const distance = calculateDistance(
            cachedData.lat,
            cachedData.lng,
            latitude,
            longitude
          );

          if (distance < MOVEMENT_THRESHOLD_M) {
            console.log(`Movement: ${Math.round(distance)}m - keeping cache`);
            setIsLoading(false);
            return;
          }
        }

        saveLocation(latitude, longitude);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        
        // User denied permission or GPS failed
        if (err.code === 1) {
          setError('Location permission denied');
        } else {
          setError('Unable to retrieve location');
        }
        
        // Keep cached data if available
        if (!cachedData) {
          setLocation({ lat: null, lng: null });
        }
        
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // Accept 5-minute-old position
      }
    );
  };

  // Check if current page needs location
  const isLocationPage = LOCATION_ENABLED_PAGES.some(path => 
    routerLocation.pathname === path || routerLocation.pathname.startsWith(path)
  );

  // Auto-fetch location when navigating to enabled pages
  useEffect(() => {
    if (!isLocationPage) {
      return; // Don't do anything on other pages
    }

    const cached = getCachedLocation();

    if (cached) {
      // Use cache immediately for instant UX
      setLocation({ lat: cached.lat, lng: cached.lng });
      
      // Silently verify in background
      fetchLocation(cached);
    } else {
      // No cache - fetch fresh location (shows loading)
      fetchLocation(null);
    }
  }, [isLocationPage, routerLocation.pathname]);

  // Manual refresh (for "Update Location" buttons)
  const refreshLocation = () => {
    fetchLocation(null);
  };

  return (
    <LocationContext.Provider 
      value={{ 
        location, 
        error, 
        isLoading, 
        refreshLocation,
        hasLocation: !!(location.lat && location.lng)
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within LocationProvider');
  }
  return context;
};