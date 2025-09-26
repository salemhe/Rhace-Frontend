"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type MenuItem = {
  name: string;
  note?: string;
  price: number;
  quantity: number;
  category?: "starters" | "main" | "desserts";
};

type ReservationData = {
  restaurant: {
    name: string;
    address: string;
  };
  reservationId: string;
  meals: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  date: string;
  time: string;
  guests: number;
  items: MenuItem[];
  specialRequest?: string;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "not paid";
  paymentDate?: string;
};

export type CardDetails = {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  email: string;
  saveCard: boolean;
};

const defaultReservationData: ReservationData = {
  restaurant: {
    name: "Kapadoccia Restaurant",
    address: "16, Idowu Taylor Street, Victoria Island 101241 Nigeria",
  },
  reservationId: "#RES12345",
  date: "May 29, 2025",
  time: "7:30 PM",
  guests: 4,
  items: [],
  meals: [
    {
      id: "",
      name: "",
      price: 0,
      quantity: 0,
    },
  ],
  specialRequest: "One guest is allergic to garlic. Please consider this",
  totalAmount: 0,
  paymentStatus: "paid",
  paymentDate: "8:00 am, May 28, 2025",
};

type ReservationContextType = {
  reservationData: ReservationData;
  isLoading: boolean;
  error: string | null;
  updateReservationData: (data: Partial<ReservationData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  processPayment: (cardDetails: CardDetails) => Promise<void>;
};

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservationData, setReservationData] = useState<ReservationData>(
    defaultReservationData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReservationData = (data: Partial<ReservationData>) => {
    setReservationData((prev) => ({ ...prev, ...data }));
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) setError(null);
  };

  const processPayment = async (cardDetails: CardDetails) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Validate card details
      if (cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
        throw new Error("Invalid card number");
      }

      if (cardDetails.cvv.length < 3) {
        throw new Error("Invalid CVV");
      }

      // Update payment status
      updateReservationData({
        paymentStatus: "paid",
        paymentDate: new Date().toLocaleString(),
      });

      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Payment failed");
      setLoading(false);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        reservationData,
        isLoading,
        error,
        updateReservationData,
        setLoading,
        setError,
        processPayment,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}
