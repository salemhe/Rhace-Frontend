import { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if location is already stored in local storage
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
      setIsLoading(false);
    }
  }, []);

  // Function to request location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
        setIsLoading(false);
        
        // Optional: Save to local storage if you want to remember it briefly
        localStorage.setItem(
          'userLocation',
          JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        );
      },
      (err) => {
        setError("Unable to retrieve location. Please enable it in browser settings.");
        setIsLoading(false);
      }
    );
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