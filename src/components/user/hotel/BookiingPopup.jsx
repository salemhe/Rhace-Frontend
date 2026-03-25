import { Button } from "@/components//ui/button";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";

const HotelBookingPopup = ({
  id,
  activeTab,
  show,
  setShow,
  selectedRooms,
  setSelectedRooms,
  setActiveTab,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load selected rooms from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedRooms");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (JSON.stringify(parsed) !== JSON.stringify(selectedRooms)) {
          setSelectedRooms(parsed);
        }
      }
    }
  }, []);

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
      (total, room) => total + (room.quantity || 1),
      0,
    );
  };

  // Get total nights (using max)
  const getTotalNights = () => {
    if (!selectedRooms || selectedRooms.length === 0) return 1;
    return Math.max(...selectedRooms.map((room) => calculateNights(room)));
  };

  // Remove room from selection
  const removeRoom = (roomId) => {
    const newSelection = selectedRooms.filter((r) => r._id !== roomId);
    setSelectedRooms(newSelection);
    localStorage.setItem("selectedRooms", JSON.stringify(newSelection));
    toast.info("Room removed from selection");
  };

  // Update quantity for a room
  const updateQuantity = (roomId, delta) => {
    const updated = selectedRooms.map((room) => {
      if (room._id === roomId) {
        const newQty = Math.max(
          1,
          Math.min((room.quantity || 1) + delta, room.totalUnits),
        );
        return { ...room, quantity: newQty };
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
  const updateRoomGuests = (roomId, value) => {
    const updated = selectedRooms.map((room) => {
      if (room._id === roomId) {
        return { ...room, guests: value };
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

    // Build room data with all details
    const roomData = selectedRooms.map((room) => ({
      roomId: room._id,
      quantity: room.quantity || 1,
      checkInDate: room.checkInDate,
      checkOutDate: room.checkOutDate,
      guests: room.guests || 1,
      nights: calculateNights(room),
    }));

    const params = new URLSearchParams({
      rooms: JSON.stringify(roomData),
    });

    setIsLoading(true);
    try {
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
    <div className="md:hidden">
      {show && (
        <div className="fixed inset-0 z-50 w-full px-4 bg-[#F9FAFB] pt-10 overflow-y-auto pb-20">
          <button
            className="flex items-center gap-2 text-sm"
            onClick={() => setShow(false)}
          >
            <X className="text-gray-600" /> Exit/Select more rooms
          </button>

          {/* Selected Rooms Summary */}
          {selectedRooms && selectedRooms.length > 0 ? (
            <div className="mt-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">
                  Selected Rooms ({getTotalRooms()})
                </h3>
                <span className="text-lg font-bold text-[#0A6C6D]">
                  {formatPrice(calculateTotal())}
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
                {selectedRooms.map((room) => {
                  const nights = calculateNights(room);
                  const discountedPrice =
                    room.pricePerNight -
                    room.pricePerNight * (room.discount / 100);
                  const roomTotal =
                    discountedPrice * (room.quantity || 1) * nights;

                  return (
                    <div
                      key={room._id}
                      className="bg-white rounded-lg p-3 border"
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

                      {/* Per-room dates and guests - compact for mobile */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <DatePicker
                            title="Check In Date"
                            value={
                              room.checkInDate
                                ? new Date(room.checkInDate)
                                : null
                            }
                            onChange={(date) =>
                              updateRoomDates(room._id, "checkInDate", date)
                            }
                            className="bg-white "
                            chevron
                          />
                        </div>
                        <div>
                          <DatePicker
                            title="Check Out Date"
                            value={
                              room.checkOutDate
                                ? new Date(room.checkOutDate)
                                : null
                            }
                            onChange={(date) =>
                              updateRoomDates(room._id, "checkOutDate", date)
                            }
                            className="bg-white "
                            chevron
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <button
                            onClick={() => updateQuantity(room._id, -1)}
                            className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                            disabled={(room.quantity || 1) <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {room.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(room._id, 1)}
                            className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                            disabled={(room.quantity || 1) >= room.totalUnits}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <GuestPicker
                            value={room.guests || 1}
                            onChange={(value) =>
                              updateRoomGuests(room._id, value)
                            }
                            className="bg-white "
                            maxAdults={room.adultsCapacity}
                            maxChildren={room.childrenCapacity}
                            maxGuests={
                              room.adultsCapacity + room.childrenCapacity
                            }
                            chevron
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
                    Total ({getTotalRooms()} rooms, {getTotalNights()} nights)
                  </span>
                  <span className="text-lg font-bold text-[#0A6C6D]">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 mb-4">
              <p className="text-sm text-gray-600">No rooms selected</p>
            </div>
          )}

          <div className="w-full justify-start text-[#606368] text-xs font-normal font-['Inter'] leading-tight">
            Prices includes all fees
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Button
              type="submit"
              disabled={
                isLoading || !selectedRooms || selectedRooms.length === 0
              }
              className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[#0A6C6D]/50 py-6"
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
      )}
      {activeTab !== "rooms" && (
        <div className="flex fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
          <Button
            className="w-full  py-6 rounded-xl bg-[#0A6C6D] hover:bg-[#0A6C6D]/50"
            onClick={() => setActiveTab("rooms")}
          >
            Reserve Room
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelBookingPopup;
