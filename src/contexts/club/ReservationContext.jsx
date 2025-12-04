"use client";

import { userService } from "@/services/user.service";
import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
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
  // const [table, setTable] = useState("");
  const [vendor, setVendor] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [proposedPayment, setProposedPayment] = useState(0)
  const [booking, setBooking] = useState(null);
  const [partPay, setPartPay] = useState(false)
  const user = useSelector((state) => state.auth.user);

  const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Other"];

  const combos = comboItems.filter((item) => item.selected);
  const bottles = bottleItems.filter((item) => item.selected);
  const vipExtras = vipExtraItems.filter((item) => item.selected);

  const totalPrice = vendor ? bottles.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  ) +
    combos.reduce((total, item) => total + (item.setPrice || 0), 0) +
    vipExtras.reduce((total, item) => total + (item.price || 0), 0) +
    (vendor.priceRange * parseInt(guestCount, 10)) : 0

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!date || !guestCount) {
        throw new Error("Please fill in all required fields.");
      }

      const parsedGuestCount = parseInt(guestCount, 10);
      if (!vendor) return;

      const selectedDrinks = bottles.filter(item => item.quantity > 0);


      const reservationData = {
        reservationType: "club",
        customerName: `${user.firstName} ${user.lastName}`.trim(),
        customerEmail: user.email,
        customerId: user._id,
        date: date.toISOString(),
        time,
        guests: parsedGuestCount,
        specialRequest,
        combos: combos.map((item) => item._id),
        drinks: selectedDrinks.map((item) => ({
          drink: item._id,
          quantity: item.quantity || 1,
        })),
        vipExtras: vipExtras.filter((item) => item.selected),
        proposedPayment,
        partPaid: partPay,
        totalAmount: partPay ? totalPrice/2 : totalPrice,
        vendor: vendor?._id,
        businessName: vendor?.businessName,
        // table,
        location: vendor?.address,
        image: vendor?.profileImages?.[0],
      };
      console.log("Reservation Data to be sent:", reservationData);
      const res = await userService.createReservation(reservationData);

      const reservationResponse = res.data;
      console.log("Reservation Response:", reservationResponse);
      toast.success("Reservation submitted successfully!");
      setBooking(reservationResponse);
      return true;
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
        // table,
        // setTable,
        vendor,
        setVendor,
        handleSubmit,
        isLoading,
        totalPrice,
        setProposedPayment,
        proposedPayment,
        booking,
        setPartPay,
        partPay
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
