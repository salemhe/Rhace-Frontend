import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Constants
  const CACHE_EXPIRY = 1000 * 60 * 30; // 30 Minutes
  const MOVEMENT_THRESHOLD = 500;      // 500 Meters

  // Helper: Calculate distance (Haversine Formula)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lat2) return 0;
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const saveLocation = (lat, lng) => {
    const data = { lat, lng, timestamp: Date.now() };
    localStorage.setItem('userLocation', JSON.stringify(data));
    setLocation({ lat, lng });
  };

  const fetchFreshLocation = (cachedData = null) => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // CHECK: If we have cached data, did user move far enough to care?
        if (cachedData) {
          const dist = getDistance(cachedData.lat, cachedData.lng, latitude, longitude);
          if (dist < MOVEMENT_THRESHOLD) {
            console.log(`User only moved ${Math.round(dist)}m. Keeping cached data.`);
            setIsLoading(false);
            return; // Exit: No need to update state/re-render
          }
        }

        // Update if no cache OR user moved > 500m
        console.log("📍 Updating location to fresh GPS coords");
        saveLocation(latitude, longitude);
        setIsLoading(false);
      },
      (err) => {
        console.warn("GPS lookup failed, falling back to cache if available");
        // If GPS fails but we have cache, keep using cache. 
        // Only error if we have NOTHING.
        if (!cachedData) setError(err.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: false, timeout: 5000 } // Low accuracy is faster/battery friendly
    );
  };

  // INITIALIZATION LOGIC
  useEffect(() => {
    const stored = localStorage.getItem('userLocation');
    
    if (stored) {
      const parsed = JSON.parse(stored);
      const isFresh = (Date.now() - parsed.timestamp) < CACHE_EXPIRY;

      if (isFresh) {
        // 1. Use Cache Immediately (Instant UI)
        setLocation({ lat: parsed.lat, lng: parsed.lng });
        setIsLoading(false); // Stop loading skeleton
        
        // 2. Silently verify in background (Check if they moved)
        fetchFreshLocation(parsed); 
      } else {
        // Cache is too old (e.g. from yesterday). Ignore it.
        fetchFreshLocation(null);
      }
    } else {
      // No data at all. Wait for user input or explicit request.
      setIsLoading(false);
    }
  }, []);

  // Manual Trigger (e.g. from your Modal)
  const requestLocation = () => {
    setIsLoading(true);
    fetchFreshLocation(null);
  };

  return (
    <LocationContext.Provider value={{ location, error, isLoading, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};


export function useUserLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useUserLocation must be used within a LocationProvider");
  }
  return context;
}