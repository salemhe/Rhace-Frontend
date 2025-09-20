"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import DashboardLoader from "../components/DashboardLoader";
import { AuthService, UserProfile } from "@/app/lib/api/services/auth.service";

const UserContext = createContext();

export function VendorProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const id = await AuthService.getId();
      if (!id) {
        throw new Error("User ID not found");
      }
      const userData = await AuthService.fetchMyProfile(id, 'vendor');
      if (userData) {
        setUser(userData);
        setError(null);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetchUser: fetchUser,
        mutate: fetchUser,
      }}
    >
      {loading ? <DashboardLoader /> : children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}