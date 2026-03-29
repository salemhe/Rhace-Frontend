import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { useReservations } from "@/contexts/hotel/ReservationContext";
import { hotelService } from "@/services/hotel.service";
import { userService } from "@/services/user.service";
import { useIsMobile } from "@/utils/helper";
import { ArrowLeft, MapPin, Minus, Plus, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ReservationHeader from "../../../components/user/hotel/ReservationHeader";
import DatePicker from "../../../components/user/ui/datepicker";
import { GuestPicker } from "../../../components/user/ui/guestpicker";
import PaymentPage from "../../../components/user/ui/Payment";

function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

export default function ReservationSummary() {
  const isMobile = useIsMobile();

  const [popupOpen, setPopupOpen] = useState(false);
  const [next, showNext] = useState(false);
  const showBookingDetails = !isMobile || next === false;
  const showPaymentStep = !isMobile || next === true;

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const {
    specialRequest,
    setSpecialRequest,
    booking,
    handleSubmit,
    vendor,
    setVendor,
    setPartPay,
    partPay,
    calculateTotalPrice,
    getTotalRooms,
    getTotalGuests,
    roomSelections,
    setRoomSelections,
    removeRoomSelection,
    calculateNightsForRoom,
    updateRoomSelection,
  } = useReservations();

  const navigate = useNavigate();

  // Parse rooms from URL
  const parseRoomsFromUrl = () => {
    const roomsParam = searchParams.get("rooms");
    if (roomsParam) {
      try {
        return JSON.parse(roomsParam);
      } catch (error) {
        console.error("Error parsing rooms:", error);
        return [];
      }
    }
    return [];
  };

  console.log(booking);

  useEffect(() => {
    const requestParam = searchParams.get("specialRequest");
    if (requestParam) {
      setSpecialRequest(requestParam);
    }
  }, []);

  const fetchVendorAndRooms = async () => {
    try {
      setLoading(true);

      const response = await userService.getVendor("hotel", id);
      setVendor(response.data[0]);

      const roomsData = parseRoomsFromUrl();

      if (roomsData.length > 0) {
        const roomPromises = roomsData.map(async (roomData) => {
          try {
            const roomResponse = await hotelService.getRoomType(
              id,
              roomData.roomId,
            );

            console.log(
              "Raw room response shape:",
              JSON.stringify(roomResponse, null, 2),
            );
            // ✅ Unwrap the actual room object from the response
            const room = roomResponse?.data || roomResponse;

            return {
              room,
              quantity: roomData.quantity || 1,
              checkInDate: roomData.checkInDate
                ? new Date(roomData.checkInDate)
                : null,
              checkOutDate: roomData.checkOutDate
                ? new Date(roomData.checkOutDate)
                : null,
              guests: roomData.guests || 1,

              guestBreakdown: roomData.guestBreakdown || null,
              maxAdults: room.maxAdults,
              maxChildren: room.maxChildren,
            };
          } catch (error) {
            console.error("Error fetching room:", error);
            // ✅ Fallback uses data passed in URL so name/price aren't lost
            return {
              room: {
                _id: roomData.roomId,
                name: roomData.roomName, // ← from URL
                pricePerNight: roomData.pricePerNight || 0,
                discount: roomData.discount || 0,
                totalUnits: roomData.totalUnits || 10,
                maxAdults: roomData.maxAdults || 2,
                maxChildren: roomData.maxChildren || 2,
              },
              quantity: roomData.quantity || 1,
              checkInDate: roomData.checkInDate
                ? new Date(roomData.checkInDate)
                : null,
              checkOutDate: roomData.checkOutDate
                ? new Date(roomData.checkOutDate)
                : null,
              guests: roomData.guests || 1,
              guestBreakdown: roomData.guestBreakdown || null,
            };
          }
        });

        const selections = await Promise.all(roomPromises);
        setRoomSelections(selections);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVendorAndRooms();
  }, []);
  const handleContinue = async () => {
    if (next === false) {
      showNext(true);
    } else {
      const res = await handleSubmit();
      if (res > 0) {
        console.log("Room selections:", booking, res);
        setPopupOpen(true);
      }
    }
  };

  const formatPrice = (price) => `₦${price.toLocaleString()}`;

  // Remove a room from selection
  const handleRemoveRoom = (roomId) => {
    removeRoomSelection(roomId);
  };

  // Update quantity for a room
 const handleUpdateQuantity = (roomId, delta) => {
  const selection = roomSelections.find((s) => s.room._id === roomId);
  if (selection) {
    const currentQty = selection.quantity || 1;
    const maxQty = selection.room.totalUnits || 10;
    const newQty = Math.max(1, Math.min(currentQty + delta, maxQty));

    const newMaxAdults = selection.room.maxAdults * newQty;
    const newMaxChildren = selection.room.maxChildren * newQty;
    const newMaxGuests = newMaxAdults + newMaxChildren;

    const updates = { quantity: newQty };

    // Clamp guests to new max
    if ((selection.guests || 1) > newMaxGuests) {
      updates.guests = newMaxGuests;
    }

    // Clamp breakdown too
    if (selection.guestBreakdown) {
      const clampedAdults = Math.min(selection.guestBreakdown.adults || 1, newMaxAdults);
      const clampedChildren = Math.min(selection.guestBreakdown.children || 0, newMaxChildren);
      updates.guestBreakdown = {
        ...selection.guestBreakdown,
        adults: clampedAdults,
        children: clampedChildren,
      };
      updates.guests = clampedAdults + clampedChildren + (selection.guestBreakdown.infants || 0);
    }

    updateRoomSelection(roomId, updates);
  }
};

  // Update dates for a room
  const handleUpdateDates = (roomId, field, value) => {
    updateRoomSelection(roomId, { [field]: value });
  };

  // Update guests for a room
  const handleUpdateGuests = (roomId, value, breakdown) => {
    updateRoomSelection(roomId, { guests: value, guestBreakdown: breakdown });
  };
  if (loading) {
    return <UniversalLoader fullscreen />;
  }

  // Calculate total nights (max of all rooms)
  const getTotalNights = () => {
    if (roomSelections.length === 0) return 1;
    return Math.max(...roomSelections.map((s) => calculateNightsForRoom(s)));
  };
  console.log(roomSelections);
  return (
    <div className="min-h-screen mb-[65px] md:mt-0 bg-gray-50">
      <ReservationHeader title="Reservation Details" index={1} />
      <div className="md:hidden flex items-center gap-3 px-4 py-3 mt-4 ">
        <button
          onClick={() =>
            next === true ? showNext(false) : navigate(`/hotels/${id}`)
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2317_1082)">
              <path
                d="M3.03 9.41084C2.87377 9.56711 2.78601 9.77903 2.78601 10C2.78601 10.221 2.87377 10.4329 3.03 10.5892L7.74417 15.3033C7.90133 15.4551 8.11184 15.5391 8.33033 15.5372C8.54883 15.5353 8.75784 15.4477 8.91235 15.2932C9.06685 15.1387 9.1545 14.9297 9.15639 14.7112C9.15829 14.4927 9.0743 14.2822 8.9225 14.125L5.63083 10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56703 17.2559 9.41075C17.0996 9.25447 16.8877 9.16667 16.6667 9.16667H5.63083L8.9225 5.875C9.0743 5.71783 9.15829 5.50733 9.15639 5.28883C9.1545 5.07034 9.06685 4.86133 8.91235 4.70682C8.75784 4.55231 8.54883 4.46467 8.33033 4.46277C8.11184 4.46087 7.90133 4.54487 7.74417 4.69667L3.03 9.41084Z"
                fill="#111827"
              />
            </g>
            <defs>
              <clipPath id="clip0_2317_1082">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        Booking Details
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-15 space-y-6">
        {/* Show vendor info on desktop always, on mobile only when showing booking details (first screen) */}
        {(!isMobile || showBookingDetails) && (
          <div className="max-w-[500px]">
            <div className="flex gap-4">
              <div className="relative size-[64px] md:w-32 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={vendor?.profileImages?.[0] || "/hero-bg.png"}
                  alt="Restaurant interior"
                  className="object-cover size-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-sm md:text-xl font-semibold mb-2">
                  {vendor?.businessName || "Restaurant Name"}
                </h2>
                <div className="flex items-start gap-1 text-gray-600 mb-2">
                  <div>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-[12px] md:text-sm truncate w-[210px] sm:w-full">
                    {vendor?.address || "123 Main St, City, Country"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#F0AE02] text-[#F0AE02]" />
                  <span className="text-[12px] md:text-sm font-medium">
                    {vendor?.rating || "4.8"} (
                    {vendor?.reviews?.toLocaleString() || "1,000"} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {showBookingDetails && (
            <div className="space-y-6 md:col-span-4">
              {/* Room Summary - Multiple Rooms with Individual Dates and Guests */}
              <div className="rounded-2xl bg-white border">
                <div className=" divide-y">
                  <div className="flex p-4 justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Room Summary ({getTotalRooms()} rooms, {getTotalGuests()}{" "}
                      guests)
                    </h3>
                  </div>
                  <div className="space-y-4 p-4">
                    {roomSelections && roomSelections.length > 0 ? (
                      roomSelections.map((selection) => {
                        const {
                          room,
                          checkInDate,
                          checkOutDate,
                          guests = 1,
                        } = selection;
                        const nights = calculateNightsForRoom(selection);
                        console.log(room);
                        const discountedPrice =
                          room.pricePerNight -
                          room.pricePerNight * (room.discount / 100);
                        const quantity = selection.quantity || 1;
                        const roomTotal = discountedPrice * quantity * nights;
                        console.log(guests);
                        const maxAdults = room.adultsCapacity * quantity;
                        const maxChildren = room.childrenCapacity * quantity;
                        const maxGuests = maxAdults + maxChildren;
                        console.log(room);
                        return (
                          <div
                            key={room._id}
                            className="border-b pb-4 last:border-0"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {room.name || "Room"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatPrice(discountedPrice)}/night ×{" "}
                                  {quantity} room × {nights} night
                                  {nights !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveRoom(room._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Individual dates and guests for each room */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div>
                                <DatePicker
                                  title="Check In Date"
                                  value={checkInDate}
                                  onChange={(date) =>
                                    handleUpdateDates(
                                      room._id,
                                      "checkInDate",
                                      date,
                                    )
                                  }
                                  className="bg-white "
                                  edit
                                />
                              </div>
                              <div>
                                <DatePicker
                                  title="Check Out Date"
                                  value={checkOutDate}
                                  onChange={(date) =>
                                    handleUpdateDates(
                                      room._id,
                                      "checkOutDate",
                                      date,
                                    )
                                  }
                                  className="bg-white "
                                  edit
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 justify-between">
                              <div className="flex w-full items-center gap-2">
                                <GuestPicker
                                  value={guests || 1}
                                  breakdown={selection.guestBreakdown} // ← ADD
                                  onChange={
                                    (value, breakdown) =>
                                      handleUpdateGuests(
                                        room._id,
                                        value,
                                        breakdown,
                                      ) // ← forward breakdown
                                  }
                                  className="bg-white"
                                  maxAdults={maxAdults}
                                  maxChildren={maxChildren}
                                  maxGuests={maxGuests}
                                  edit
                                />
                              </div>
                              <div className="flex items-center w-full  justify-between">
                                <span className="text-sm text-gray-500">
                                  Quantity:
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(room._id, -1)
                                    }
                                    className="sm:w-8 sm:h-8 w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                                    disabled={quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="sm:w-8 w-5 text-center text-sm font-medium">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(room._id, 1)
                                    }
                                    className="sm:w-8 sm:h-8 w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                                    disabled={
                                      quantity >= (room.totalUnits || 10)
                                    }
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 text-right">
                              <span className="text-sm font-semibold text-[#0A6C6D]">
                                {formatPrice(roomTotal)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No rooms selected</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#0A6C6D] underline">
                        Free cancellation until 24h before check-in
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 hidden md:block space-y-6">
                <div className="relative">
                  <Label
                    htmlFor="special-request"
                    className="text-sm font-medium mb-2 block"
                  >
                    Special Request (Optional)
                  </Label>
                  <Textarea
                    id="special-request"
                    placeholder="Let us know if you have any special request"
                    value={specialRequest}
                    maxLength={500}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="min-h-[100px] bg-[#FFFFFF] border text-sm border-[#E5E7EB] resize-none rounded-xl"
                  />
                  <p className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {specialRequest.length}/500
                  </p>
                </div>
              </div>
            </div>
          )}

          {showPaymentStep && (
            <div className="md:col-span-3 space-y-6">
              <div className="mb-6 md:hidden space-y-6">
                <div className="relative">
                  <Label
                    htmlFor="special-request"
                    className="text-sm font-medium mb-2 block"
                  >
                    Special Request (Optional)
                  </Label>
                  <Textarea
                    id="special-request"
                    placeholder="Let us know if you have any special request"
                    value={specialRequest}
                    maxLength={500}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="min-h-[100px] bg-[#FFFFFF] border text-sm border-[#E5E7EB] resize-none rounded-xl"
                  />
                  <p className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {specialRequest.length}/500
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white border">
                <div className="divide-y">
                  <div className="flex p-4">
                    <h3 className="text-lg font-semibold">
                      Choose Payment Plan
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="cursor-pointer">
                      <div className=" divide-y">
                        <div
                          className={`flex p-4 rounded-t-2xl gap-2 bg-[#F9FAFB] border justify-between items-center ${!partPay && "border-teal-700"}`}
                          onClick={() => {
                            setPartPay(false);
                          }}
                        >
                          <h3 className="text-sm font-semibold">
                            Pay {formatPrice(calculateTotalPrice())} now
                          </h3>
                          <svg
                            width="20"
                            height="20"
                            className="shrink-0"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                              stroke="#0A6C6D"
                            />
                            {!partPay && (
                              <circle cx="10" cy="10" r="6" fill="#0A6C6D" />
                            )}
                          </svg>
                        </div>
                        <div
                          className={`flex p-4 gap-2 rounded-b-2xl bg-[#F9FAFB] border justify-between items-center ${partPay && "border-teal-700"}`}
                          onClick={() => {
                            setPartPay(true);
                          }}
                        >
                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold">
                              Pay part now, rest later
                            </h3>
                            <p className="text-xs">
                              Pay {formatPrice(calculateTotalPrice() / 2)} now,
                              and {formatPrice(calculateTotalPrice() / 2)} on
                              arrival. No extra fees
                            </p>
                          </div>
                          <svg
                            width="20"
                            height="20"
                            className="shrink-0"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                              stroke="#0A6C6D"
                            />
                            {partPay && (
                              <circle cx="10" cy="10" r="6" fill="#0A6C6D" />
                            )}
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border mb-16 p-4">
                <h3 className="text-lg font-semibold">Your Total</h3>
                <div className=" divide-y">
                  <div className="pb-3 space-y-2 text-sm">
                    <p className="text-[#111827]">Price Details</p>
                    {roomSelections &&
                      roomSelections.map((selection) => {
                        const { room, quantity = 1 } = selection;
                        const nights = calculateNightsForRoom(selection);
                        const discountedPrice =
                          room.pricePerNight -
                          room.pricePerNight * (room.discount / 100);
                        const roomTotal = discountedPrice * quantity * nights;

                        return (
                          <div
                            key={room._id}
                            className="flex items-center justify-between"
                          >
                            <p className="gap-2 flex items-center">
                              <span className="text-sm text-[#111827]">
                                {room.name || "Room"} x{quantity} night
                                {quantity > 1 ? "s" : ""}
                              </span>
                            </p>
                            <p className="text-[#111827]">
                              {formatPrice(roomTotal)}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-lg text-[#111827]">
                    <p>
                      Sub Total ({getTotalNights()} night
                      {getTotalNights() > 1 ? "s" : ""})
                    </p>
                    <p className="font-semibold text-lg text-[#111827]">
                      {partPay
                        ? formatPrice(calculateTotalPrice() / 2)
                        : formatPrice(calculateTotalPrice())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
          <div
            className={`
            ${
              next === false
                ? "flex flex-col sm:flex-row justify-end  sm:justify-between gap-2 items-end"
                : "flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto "
            }  sm:justify-between p-4`}
          >
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="md:flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2 hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Hotel Details Page
            </Button>
            <Button
              className={
                next === false
                  ? "bg-[#0A6C6D] hover:bg-[#0A6C6D]/90 px-8 py-6 w-33 sm:w-full md:max-w-xs rounded-xl cursor-pointer"
                  : "bg-[#0A6C6D] hover:bg-[#0A6C6D]/90 px-8 py-6 w-full  md:max-w-xs rounded-xl cursor-pointer"
              }
              onClick={handleContinue}
              disabled={!roomSelections || roomSelections.length === 0}
              size={"lg"}
            >
              {isMobile && next === false ? "Next" : "Complete Reservations"}
            </Button>
          </div>
        </div>
      </div>
      {popupOpen && (
        <PaymentPage booking={booking} setPopupOpen={setPopupOpen} />
      )}
    </div>
  );
}
