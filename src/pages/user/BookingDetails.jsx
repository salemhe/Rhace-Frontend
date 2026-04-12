import { Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { toast } from "react-toastify";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Edit3 } from "@/public/icons/icons";

export default function BookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await userService.fetchReservations({ bookingId: id });
        setData(res.data[0]);
      } catch (err) {
        toast.error(err.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservation();
  }, []);

  if (isLoading) {
    return <UniversalLoader fullscreen />;
  }

  return (
    <div className="min-h-screen relative bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div>
        <X
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => navigate("/bookings")}
        />
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#37703F1A] rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#37703F] rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#111827] mb-2">
            {data.reservationType === "resraurantReservation"
              ? "Your reservation is confirmed & your meal has been paid"
              : "Your Reservation is confirmed & your payment received!"}
          </h1>
          <p className="text-[#6B7280] text-sm max-w-[300px] md:max-w-full text-center mx-auto">
            {data.reservationType === "resraurantReservation"
              ? "Your pre-selected meals have been confirmed for your upcoming reservation"
              : "Thank you for completing your booking process. we look forward to seeing you"}
          </p>
        </div>

        {/* Reservation Details */}
        {data.reservationType === "restaurantReservation" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                Reservation Details
              </h2>

              {/* HR tag after Reservation Details */}
              <hr className="border-gray-200 mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 px-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                  <p className="text-base font-medium text-gray-900 mb-1">
                    {data.vendor.businessName || "hey"}
                  </p>
                  <p className="text-sm text-gray-600">{data.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                  <p className="font-medium text-gray-900">
                    #{data._id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(data.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    • {data.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Guests</p>
                  <p className="font-medium text-gray-900">
                    {data.guests} Guests
                  </p>
                </div>
              </div>
            </div>

            {/* Meal Selection */}
            {data.vendor.vendorType === "restaurant" &&
              data.menus.length > 0 && (
                <div className="rounded-2xl border border-gray-200 mb-6 bg-white shadow-sm p-5">
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-2">
                      Your Selection ({data.menus.length}{" "}
                      {data.menus.length > 1 ? "items" : "item"})
                    </h2>
                    <ul className="divide-y divide-gray-100">
                      {data.menus.map((item, index) => (
                        <li key={index} className="flex justify-between py-2">
                          <span className="text-gray-700">
                            {item.quantity}x {item.menu.name}
                          </span>
                          <span className="text-gray-900 font-medium">
                            ₦{item.menu.price.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">Amount paid</p>
                    <p className="font-semibold text-[#37703F] text-lg">
                      ₦{data.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
          </>
        )}
        {data.reservationType === "hotelReservation" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                Reservation Details
              </h2>

              <hr className="border-gray-200 mb-2" />
              <div className=" divide-y px-4">
                {data.rooms.length > 0 &&
                  data.rooms.map((item, index) => (
                    <div key={index} className="py-2">
                      <div className="mb-2 text-xs text-medium">
                        Superion{" "}
                        {item.roomId.category || item.roomId.roomCategory}{" "}
                        {item.roomId.name}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Check In Date
                          </p>
                          <p className="font-medium text-gray-900">
                            {new Date(item.checkInDate).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Check Out Date
                          </p>
                          <p className="font-medium text-gray-900">
                            {new Date(item.checkOutDate).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Guests Allowed
                          </p>
                          <p className="font-medium text-gray-900">
                            {item.guests} Guests
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 mb-6">
              <div className=" divide-y">
                <div className="flex p-4 justify-between items-center">
                  <h3 className="text-lg font-semibold">Room Summary</h3>
                </div>
                <div className="divide-y px-4">
                  {data.rooms.length > 0 &&
                    data.rooms.map((room, index) => (
                      <div key={index} className="grid grid-cols-2 py-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">Room Name</p>
                          <p className="text-sm  line-clamp-1 font-medium text-gray-900">
                            Superion {room.roomId.category} {room.roomId.name}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">
                            Price per Night
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            ₦
                            {(
                              room.roomId.pricePerNight -
                              room.roomId.pricePerNight *
                                (room.roomId.discount / 100)
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">Bed Type</p>
                          <p className="text-sm font-medium text-gray-900">
                            {room.roomId.bedType} Bed
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">
                            Guests Allowed
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {room.roomId.adultsCapacity}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
        {data.reservationType === "clubReservation" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                Reservation Details
              </h2>

              <hr className="border-gray-200 mb-4" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4 px-4">
                <div
                  className={cn(
                    "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
                  )}
                >
                  <div className="gap-2 flex flex-col">
                    <div htmlFor="date" className="text-black text-xs">
                      Date
                    </div>
                    {format(data.date, "do MMM, yyyy")}
                  </div>
                </div>
                <div
                  className={cn(
                    "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
                  )}
                >
                  <div className="gap-2 flex flex-col">
                    <div htmlFor="date" className="text-black text-xs">
                      Time
                    </div>
                    {data.time}
                  </div>
                </div>
                <div
                  className={cn(
                    "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
                  )}
                >
                  <div className="gap-2 flex flex-col">
                    <div htmlFor="date" className="text-black text-xs">
                      Table
                    </div>
                    {data.tables.length > 0
                      ? data.tables[0].tableType.name
                      : "N/A"}{" "}
                    {data.tables.length > 0
                      ? `+${data.tables.length - 1} more`
                      : ""}
                  </div>
                </div>
                <div
                  className={cn(
                    "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
                  )}
                >
                  <div className="gap-2 flex flex-col">
                    <div htmlFor="date" className="text-black text-xs">
                      Guest
                    </div>
                    {data.guests} People
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 mb-6 bg-white">
              <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                Add Ons
              </h2>

              <hr className="border-gray-200 mb-4" />
              <div className="py-4 px-5 space-y-4">
                {data.combos.map((item, i) => (
                  <div
                    key={i}
                    className="space-y-4 px-2 py-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#111827]">{item.name}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-[#111827]">
                        {item.addOns.join(" ")}
                      </p>
                      <p className="text-sm text-[#111827]">
                        ₦{item.setPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {data.tables.length > 0 &&
                  data.tables.map((item, i) => (
                    <div
                      key={i}
                      className="space-y-4 px-2 py-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-[#111827]">
                          {item.tableType.name}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-[#111827]">
                          ₦{item.tableType.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {data.drinks.map((item, i) => (
                  <div
                    key={i}
                    className="space-y-4 px-2 py-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#111827]">
                        {item.drink.name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-[#111827]">
                        {item.drink.volume}ml x {item.quantity}
                      </p>
                      <p className="text-sm text-[#111827]">
                        ₦{item.drink.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
