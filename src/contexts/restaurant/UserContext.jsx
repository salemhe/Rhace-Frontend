"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import DashboardLoader from "../components/DashboardLoader";
import { AuthService, UserProfile } from "@/app/lib/api/services/userAuth.service";


interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  mutate: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const id = await AuthService.getId();
      if (!id) {
        throw new Error("User ID not found");
      }
      const userData = await AuthService.fetchMyProfile(id);
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
