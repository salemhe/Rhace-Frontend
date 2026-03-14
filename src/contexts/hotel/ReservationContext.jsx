import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


export function ReservationsProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [additionalNote, setAdditionalNote] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [activeTab, setActiveTab] = useState("Starters");

  // Changed to array where each room has its own dates and guests
  const [roomSelections, setRoomSelections] = useState([]);

  const [page, setPage] = useState(0);
  const [vendor, setVendor] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [partPay, setPartPay] = useState(false);

  // Calculate nights for a specific room based on its dates
  const calculateNightsForRoom = (roomSelection) => {
    const { checkInDate, checkOutDate } = roomSelection;
    if (!checkInDate || !checkOutDate) return 1;

    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(
      1,
      Math.ceil(
        ((checkOutDate instanceof Date
          ? checkOutDate.getTime()
          : new Date(checkOutDate).getTime()) -
          (checkInDate instanceof Date
            ? checkInDate.getTime()
            : new Date(checkInDate).getTime())) /
          msPerDay,
      ),
    );
  };

  // Calculate total price for all rooms
  const calculateTotalPrice = () => {
    return roomSelections.reduce((total, roomSelection) => {
      const { room, quantity = 1 } = roomSelection;
      const discountedPrice =
        room.pricePerNight - room.pricePerNight * (room.discount / 100);
      const nights = calculateNightsForRoom(roomSelection);
      return total + discountedPrice * quantity * nights;
    }, 0);
  };

  // Calculate total rooms
  const getTotalRooms = () => {
    return roomSelections.reduce(
      (total, roomSelection) => total + Number(roomSelection.quantity || 1),
      0,
    );
  };

  // Calculate total guests across all rooms
  const getTotalGuests = () => {
    return roomSelections.reduce(
      (total, roomSelection) => total + Number(roomSelection.guests || 1),
      0,
    );
  };

  // Update a specific room selection
  const updateRoomSelection = (roomId, updates) => {
    setRoomSelections((prev) =>
      prev.map((selection) =>
        selection.room._id === roomId
          ? { ...selection, ...updates }
          : selection,
      ),
    );
  };

  // Add a room to selections
  const addRoomSelection = (room, quantity = 1) => {
    const existingIndex = roomSelections.findIndex(
      (s) => s.room._id === room._id,
    );

    if (existingIndex >= 0) {
      // Update quantity if already exists
      updateRoomSelection(room._id, { quantity });
    } else {
      // Add new room selection with default dates and guests
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      setRoomSelections((prev) => [
        ...prev,
        {
          room,
          quantity,
          checkInDate: today,
          checkOutDate: tomorrow,
          guests: 1,
        },
      ]);
    }
  };

  // Remove a room from selections
  const removeRoomSelection = (roomId) => {
    setRoomSelections((prev) => prev.filter((s) => s.room._id !== roomId));
  };

  // Clear all selections
  const clearAllSelections = () => {
    setRoomSelections([]);
  };

  const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Other"];

  const generateId = () => {
    return Date.now().toString(36).substring(0, 8).toUpperCase();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate all room selections
      if (roomSelections.length === 0) {
        throw new Error("Please select at least one room.");
      }

      for (const selection of roomSelections) {
        if (!selection.checkInDate || !selection.checkOutDate) {
          throw new Error(
            `Please select check-in and check-out dates for ${selection.room.name}.`,
          );
        }

        if (selection.checkOutDate <= selection.checkInDate) {
          throw new Error(
            `Check-out date must be after check-in date for ${selection.room.name}.`,
          );
        }

        if (!selection.guests || selection.guests < 1) {
          throw new Error(
            `Please select number of guests for ${selection.room.name}.`,
          );
        }
      }

      if (!vendor?._id) {
        throw new Error("Vendor information is missing.");
      }

      const totalAmount = calculateTotalPrice();

      // Prepare reservation data with multiple rooms, each having own dates and guests
      const reservationData = {
        resId: generateId(),
        reservationType: "hotel",
        customerName: `${user.firstName} ${user.lastName}`.trim(),
        customerEmail: user.email,
        customerId: user._id,
        specialRequest,
        rooms: roomSelections.map((selection) => {
          const {
            room,
            quantity = 1,
            checkInDate,
            checkOutDate,
            guests,
          } = selection;
          const discountedPrice =
            room.pricePerNight - room.pricePerNight * (room.discount / 100);
          const nights = calculateNightsForRoom(selection);

          return {
            roomId: room._id,
            quantity,
            pricePerNight: discountedPrice,
            name: room.name,
            category: room.category,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
            guests,
            nights,
            subtotal: discountedPrice * quantity * nights,
          };
        }),
        partPaid: partPay,
        totalAmount: partPay ? totalAmount / 2 : totalAmount,
        vendor: vendor._id,
        location: vendor.address,
        image: vendor.profileImages?.[0],
      };

      setBooking(reservationData);
      const resDatas = JSON.parse(localStorage.getItem("resData") || "[]");
      localStorage.setItem(
        "resData",
        JSON.stringify([...resDatas, reservationData]),
      );

      return 1;
    } catch (error) {
      console.error("Error submitting reservation:", error);

      let errorMessage = "Failed to submit reservation. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error;
        errorMessage =
          axiosError.response?.data?.message ||
          "Failed to submit reservation. Please try again.";
      }
      toast.error(errorMessage);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error;
        if (axiosError.response?.data) {
          console.error("Server error details:", axiosError.response.data);
        }
      }
      return 0;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        roomSelections,
        setRoomSelections,
        addRoomSelection,
        updateRoomSelection,
        removeRoomSelection,
        clearAllSelections,
        calculateNightsForRoom,
        menuItems,
        setMenuItems,
        additionalNote,
        setAdditionalNote,
        specialRequest,
        setSpecialRequest,
        occasions,
        activeTab,
        setActiveTab,
        booking,
        setBooking,
        page,
        setPage,
        vendor,
        setVendor,
        handleSubmit,
        isLoading,
        setPartPay,
        partPay,
        calculateTotalPrice,
        getTotalRooms,
        getTotalGuests,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}
const ReservationContext = createContext(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export function useReservations() {
    const context = useContext(ReservationContext);
    if (context === undefined) {
        throw new Error(
            "useReservations must be used within a ReservationsProvider"
        );
    }
    return context;
}