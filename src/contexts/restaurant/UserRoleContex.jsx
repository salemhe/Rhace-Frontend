"use client"
import { createContext, useContext } from "react";
// import type { UserRole } from "../types/roles";

// User and user role types for hotel dashboard

export type UserRole = "super-admin" | "admin" | "hotel-owner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Add more fields as needed (e.g., associatedHotelId for hotel-owner)
}

export const UserRoleContext = createContext<UserRole>("hotel-owner");
export const useUserRole = () => useContext(UserRoleContext);

// Usage: <UserRoleContext.Provider value="admin">{children}</UserRoleContext.Provider>