import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";

const HotelBookingForm = ({ id, selectedRooms, setSelectedRooms }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load selected rooms from localStorage on mount
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const stored = localStorage.getItem("selectedRooms");
  //     if (stored) {
  //       const parsed = JSON.parse(stored);
  //       if (JSON.stringify(parsed) !== JSON.stringify(selectedRooms)) {
  //         setSelectedRooms(parsed);
  //       }
  //     }
  //   }
  // }, []);

  // Calculate total nights for a room
  const calculateNights = (room) => {
    if (!room.checkInDate || !room.checkOutDate) return 1;
    const checkIn = new Date(room.checkInDate);
    const checkOut = new Date(room.checkOutDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.ceil((checkOut - checkIn) / msPerDay));
  };

  // Calculate total price for selected rooms
  const calculateTotal = () => {
    if (!selectedRooms || selectedRooms.length === 0) return 0;
    return selectedRooms.reduce((total, room) => {
      const discountedPrice =
        room.pricePerNight - room.pricePerNight * (room.discount / 100);
      const nights = calculateNights(room);
      return total + discountedPrice * (room.quantity || 1) * nights;
    }, 0);
  };

  // Get total number of rooms
  const getTotalRooms = () => {
    if (!selectedRooms || selectedRooms.length === 0) return 0;
    return selectedRooms.reduce(
      (total, room) => total + Number(room.quantity || 1),
      0,
    );
  };

  // Get total nights (using max)
  const getTotalNights = () => {
    if (!selectedRooms || selectedRooms.length === 0) return 1;
    return Math.max(...selectedRooms.map((room) => calculateNights(room)));
  };

  // Calculate total guests across all rooms
  const getTotalGuests = () => {
    if (!selectedRooms || selectedRooms.length === 0) return 0;
    return selectedRooms.reduce(
      (total, room) => total + Number(room.guests || 1),
      0,
    );
  };

  // Remove room from selection
  const removeRoom = (roomId) => {
    const newSelection = selectedRooms.filter((r) => r._id !== roomId);
    setSelectedRooms(newSelection);
    localStorage.setItem("selectedRooms", JSON.stringify(newSelection));
    // toast.info("Room removed from selection");
  };
 useEffect(() => {
    removeRoom()
  }, []);

  // Update quantity for a room
const updateQuantity = (roomId, delta) => {
  const updated = selectedRooms.map((room) => {
    if (room._id === roomId) {
      const newQty = Math.max(1, Math.min((room.quantity || 1) + delta, room.totalUnits));

      const newMaxAdults = (room.adultsCapacity || 1) * newQty;
      const newMaxChildren = (room.childrenCapacity || 0) * newQty;
      const newMaxGuests = newMaxAdults + newMaxChildren;

      const updates = { ...room, quantity: newQty };

      // Clamp guests to new max
      if ((room.guests || 1) > newMaxGuests) {
        updates.guests = newMaxGuests;
      }

      // Clamp breakdown too
      if (room.guestBreakdown) {
        const clampedAdults = Math.min(room.guestBreakdown.adults || 1, newMaxAdults);
        const clampedChildren = Math.min(room.guestBreakdown.children || 0, newMaxChildren);
        updates.guestBreakdown = {
          ...room.guestBreakdown,
          adults: clampedAdults,
          children: clampedChildren,
        };
        updates.guests = clampedAdults + clampedChildren + (room.guestBreakdown.infants || 0);
      }

      return updates;
    }
    return room;
  });

  setSelectedRooms(updated);
  localStorage.setItem("selectedRooms", JSON.stringify(updated));
};

  // Update dates for a specific room
  const updateRoomDates = (roomId, field, value) => {
    const updated = selectedRooms.map((room) => {
      if (room._id === roomId) {
        return { ...room, [field]: value };
      }
      return room;
    });
    setSelectedRooms(updated);
    localStorage.setItem("selectedRooms", JSON.stringify(updated));
  };

  // Update guests for a specific room
  const updateRoomGuests = (roomId, value, breakdown) => {
    // ← add breakdown
    const updated = selectedRooms.map((room) => {
      if (room._id === roomId) {
        return { ...room, guests: value, guestBreakdown: breakdown }; // ← store it
      }
      return room;
    });
    setSelectedRooms(updated);
    localStorage.setItem("selectedRooms", JSON.stringify(updated));
  };

  const formatPrice = (price) => `₦${price.toLocaleString()}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRooms || selectedRooms.length === 0) {
      toast.error("Please select at least one room");
      return;
    }

    // Validate all rooms have dates
    for (const room of selectedRooms) {
      if (!room.checkInDate || !room.checkOutDate) {
        toast.error(`Please set check-in and check-out dates for ${room.name}`);
        return;
      }

      const checkIn = new Date(room.checkInDate);
      const checkOut = new Date(room.checkOutDate);
      if (checkOut <= checkIn) {
        toast.error(
          `Check-out date must be after check-in date for ${room.name}`,
        );
        return;
      }
    }

    // Build room data with all **capacity details** for Summary GuestPicker limits
    const roomData = selectedRooms.map((room) => ({
      roomName: room.name,
      roomId: room._id,
      quantity: room.quantity || 1,
      checkInDate: room.checkInDate,
      checkOutDate: room.checkOutDate,
      guests: room.guests || 1,
      nights: calculateNights(room),
      maxAdults: room.adultsCapacity || 1,
      maxChildren: room.childrenCapacity || 0,
          guestBreakdown: room.guestBreakdown || { adults: room.guests || 1, children: 0, infants: 0 },  // ← ADD
      // ✅ Add these so ReservationSummary has fallback data if API fetch fails
      pricePerNight: room.pricePerNight,
      discount: room.discount || 0,
      totalUnits: room.totalUnits || 10,
      adultsCapacity: room.adultsCapacity || 2,
      childrenCapacity: room.childrenCapacity || 2,
    }));

    const params = new URLSearchParams({
      rooms: JSON.stringify(roomData),
    });

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/hotels/${id}/reservations?${params.toString()}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="p-4 rounded-2xl bg-[#ffffff] border border-[#E5E7EB]"
      data-booking-form
    >
      {/* Selected Rooms Summary */}
      {selectedRooms && selectedRooms.length > 0 ? (
        <div className=" w-96 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">
              Selected Rooms ({getTotalRooms()})
            </h3>
            <span className="text-lg font-bold text-[#0A6C6D]">
              {formatPrice(calculateTotal())}
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto mb-3">
            {selectedRooms.map((room) => {
              const nights = calculateNights(room);
              const discountedPrice =
                room.pricePerNight - room.pricePerNight * (room.discount / 100);
              const roomTotal = discountedPrice * (room.quantity || 1) * nights;
              const quantity = room.quantity || 1;

              const maxAdults = room.adultsCapacity * quantity;
              const maxChildren = room.childrenCapacity * quantity;
              const maxGuests = maxAdults + maxChildren;
              console.log(room.adultsCapacity, room);
              return (
                <div
                  key={room._id}
                  className="bg-gray-50 rounded-lg p-3 border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {room.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(discountedPrice)}/night ×{" "}
                        {room.quantity || 1} room × {nights} night
                        {nights !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeRoom(room._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Per-room dates and guests */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <DatePicker
                        title="Check In Date"
                        value={
                          room.checkInDate ? new Date(room.checkInDate) : null
                        }
                        onChange={(date) =>
                          updateRoomDates(room._id, "checkInDate", date)
                        }
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <DatePicker
                        title="Check Out Date"
                        value={
                          room.checkOutDate ? new Date(room.checkOutDate) : null
                        }
                        onChange={(date) =>
                          updateRoomDates(room._id, "checkOutDate", date)
                        }
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 itms-center  justify-between">
                    <div className="flex items-center justify-between -2">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(room._id, -1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                          disabled={(room.quantity || 1) <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {room.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(room._id, 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                          disabled={(room.quantity || 1) >= room.totalUnits}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-gray-500 ml-2">
                          (max: {room.totalUnits})
                        </span>
                      </div>
                    </div>

                    <div>
                      <GuestPicker
                        value={room.guests || 1}
                        breakdown={room.guestBreakdown} // ← ADD
                        onChange={
                          (value, breakdown) =>
                            updateRoomGuests(room._id, value, breakdown) // ← forward breakdown
                        }
                        className="bg-white"
                        maxAdults={maxAdults}
                        maxChildren={maxChildren}
                        maxGuests={maxGuests}
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-200 text-right">
                    <span className="text-sm font-semibold text-[#0A6C6D]">
                      {formatPrice(roomTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#E7F0F0] rounded-lg p-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Total for {getTotalRooms()} room(s), {getTotalGuests()}{" "}
                guest(s), {getTotalNights()} night
                {getTotalNights() !== 1 ? "s" : ""}
              </span>
              <span className="text-lg font-bold text-[#0A6C6D]">
                {formatPrice(calculateTotal())}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">No rooms selected</p>
          <p className="text-xs text-gray-500">
            Go to Rooms tab to select rooms
          </p>
        </div>
      )}

      <div className="w-full justify-start text-zinc-600 text-sm font-bold font-['Inter'] leading-tight">
        Prices includes all fees
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Button
          type="submit"
          disabled={isLoading || !selectedRooms || selectedRooms.length === 0}
          className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Processing...
            </>
          ) : (
            `Reserve ${getTotalRooms()} Room${getTotalRooms() !== 1 ? "s" : ""}`
          )}
        </Button>
      </form>
    </div>
  );
};

export default HotelBookingForm;

export const SvgIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <g clipPath="url(#clip0_96_1657)">
      <path
        fill="#E0B300"
        fillRule="evenodd"
        d="M6.27 1.932a2.67 2.67 0 0 1 3.347-.09l.113.09.25.213c.183.156.404.26.64.3l.12.015.328.027A2.67 2.67 0 0 1 13.5 4.799l.014.133.027.33c.019.238.101.467.24.663l.073.095.215.25a2.666 2.666 0 0 1 .09 3.347l-.09.114-.214.25c-.156.183-.26.404-.3.64l-.015.119-.026.329a2.666 2.666 0 0 1-2.312 2.432l-.134.014-.329.026a1.33 1.33 0 0 0-.664.24l-.094.074-.252.213a2.666 2.666 0 0 1-3.346.092l-.113-.09-.25-.215a1.33 1.33 0 0 0-.64-.3l-.12-.014-.328-.027A2.666 2.666 0 0 1 2.5 11.204l-.014-.134-.027-.33a1.33 1.33 0 0 0-.24-.663l-.074-.095-.214-.251a2.67 2.67 0 0 1-.09-3.347l.09-.112.214-.251c.155-.183.26-.404.3-.64l.014-.119.027-.328A2.67 2.67 0 0 1 4.798 2.5l.133-.014.33-.027c.239-.019.468-.102.664-.24l.094-.074zm3.397 6.735a1 1 0 1 0 0 2 1 1 0 0 0 0-2M9.529 5.53l-4 4a.667.667 0 1 0 .942.943l4-4a.667.667 0 0 0-.942-.943m-3.196-.195a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_96_1657">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
