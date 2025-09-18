"use client";

import { createContext, useContext, useState } from "react";

type BookingsContextType = {
  setActiveTab: (value: "bookings" | "reservations") => void,
  activeTab: "bookings" | "reservations"
  setActiveType: (value: "upcoming" | "past") => void,
  activeType: "upcoming" | "past"
};

const BookingsContext = createContext<BookingsContextType | undefined>(
  undefined
);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<"bookings" | "reservations">(
    "bookings"
  );
  const [activeType, setActiveType] = useState<"upcoming" | "past">(
    "past"
  )

  return (
    <BookingsContext.Provider
      value={{ setActiveTab, activeTab, activeType, setActiveType }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingsProvider");
  }
  return context;
}
