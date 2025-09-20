"use client";

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const ReservationContext = createContext(
  undefined
);

export function ReservationsProvider({
  children,
}) {
  const [comboItems, setComboItems] = useState([]);
  const [bottleItems, setBottleItems] = useState([]);
  const [vipExtraItems, setVipExtraItems] = useState([]);
  const [guestCount, setGuestCount] = useState("1");
  const [specialRequest, setSpecialRequest] = useState("");
  const [activeTab, setActiveTab] = useState("Starters");
  const [page, setPage] = useState(0);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [table, setTable] = useState("");
  const [vendor, setVendor] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [proposedPayment, setProposedPayment] = useState(0)

  const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Other"];
  const navigate = useNavigate();

  const totalPrice = vendor ? bottleItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0
      ) +
      comboItems.reduce((total, item) => total + (item.price || 0), 0) +
      vipExtraItems.reduce((total, item) => total + (item.price || 0), 0) +
      (vendor.priceRange * parseInt(guestCount, 10)) : 0

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!date || !guestCount) {
        throw new Error("Please fill in all required fields.");
      }

      const parsedGuestCount = parseInt(guestCount, 10);
      const combos = comboItems.filter((item) => item.selected);
      const bottles = bottleItems.filter((item) => item.selected);
      const vipExtras = vipExtraItems.filter((item) => item.selected);
      if (!vendor) return;
      

      const reservationData = {
        reservationType: "club",
        customerEmail: "test@mail.com",
        date: date.toISOString(),
        time,
        guests: parsedGuestCount,
        specialRequest,
        combos: combos.filter((item) => item.selected),
        bottles: bottles.filter((item) => item.selected),
        vipExtras: vipExtras.filter((item) => item.selected),
        proposedPayment,
        totalPrice,
        vendorId: vendor?._id,
        businessName: vendor?.businessName,
        location: vendor?.address,
        customerName: `Wisdom Ofogba`,
        image: vendor?.profileImages?.[0].url,
      };
      console.log("Reservation Data to be sent:", reservationData);
      toast.success("Reservation submitted successfully!");
    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast.error("Failed to submit reservation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Simulate fetching menu items

  return (
    <ReservationContext.Provider
      value={{
        comboItems,
        setComboItems,
        bottleItems,
        setBottleItems,
        vipExtraItems,
        setVipExtraItems,
        guestCount,
        setGuestCount,
        specialRequest,
        setSpecialRequest,
        occasions,
        activeTab,
        setActiveTab,
        page,
        setPage,
        date,
        setDate,
        time,
        setTime,
        table,
        setTable,
        vendor,
        setVendor,
        handleSubmit,
        isLoading,
        totalPrice,
        setProposedPayment,
        proposedPayment,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error(
      "useReservations must be used within a ReservationsProvider"
    );
  }
  return context;
}
