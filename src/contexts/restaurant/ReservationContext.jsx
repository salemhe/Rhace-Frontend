"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const ReservationContext = createContext(
  undefined
);

export function ReservationsProvider({
  children,
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [additionalNote, setAdditionalNote] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [seatingPreference, setSeatingPreference] = useState("indoor");
  const [guestCount, setGuestCount] = useState("1");
  const [specialRequest, setSpecialRequest] = useState("");
  const [activeTab, setActiveTab] = useState("Starters");
  const [page, setPage] = useState(0);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [vendor, setVendor] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Other"];


  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!date || !seatingPreference || !guestCount || !time) {
        throw new Error("Please fill in all required fields.");
      }

      if (!vendor._id) {
        throw new Error("Vendor information is missing.");
      }

      const parsedGuestCount = parseInt(guestCount, 10);
      if (isNaN(parsedGuestCount) || parsedGuestCount < 1) {
        throw new Error("Please enter a valid number of guests.");
      }

      const selectedMeals = menuItems.filter(item => item.selected && item.quantity > 0);

      // Calculate total price
      const totalPrice = selectedMeals.reduce(
        (total, item) => total + ((item.price || 0) * (item.quantity || 1)),
        0
      );

      // Prepare reservation data
      const reservationData = {
        _id: "1",
        reservationType: "restaurant",
        customerEmail: "testmail@mail.com",
        customerName: `${"Wisdom"} ${"Ofogba"}`.trim() || "testmail@mail.com",
        date: date.toISOString(),
        time,
        guests: parsedGuestCount,
        seatingPreference,
        specialOccasion: selectedOccasion || "other",
        specialRequest,
        additionalNote,
        meals: selectedMeals.map(item => ({
          id: item._id,
          name: item.dishName,
          price: item.price || 0,
          quantity: item.quantity || 1,
          specialRequest: item.specialRequest || "",
          category: item.category,
        })),
        totalPrice,
        vendorId: vendor._id,
        businessName: vendor.businessName,
        location: vendor.address,
        image: vendor.profileImages?.[0]?.url,
      };
      toast.success("Reservation submitted successfully!");

      // Navigate to confirmation page
      navigate(`/restaurants/completed/${reservationData._id}`);

    } catch (error) {
      console.error("Error submitting reservation:", error);

      // Show specific error message
      let errorMessage = "Failed to submit reservation. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error;
        errorMessage = axiosError.response?.data?.message || "Failed to submit reservation. Please try again.";
      }
      toast.error(errorMessage);

      // Log detailed error for debugging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error
        if (axiosError.response?.data) {
          console.error("Server error details:", axiosError.response.data);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Simulate fetching menu items

  return (
    <ReservationContext.Provider
      value={{
        menuItems,
        setMenuItems,
        additionalNote,
        setAdditionalNote,
        selectedOccasion,
        setSelectedOccasion,
        seatingPreference,
        setSeatingPreference,
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
        vendor,
        setVendor,
        handleSubmit,
        isLoading,
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
