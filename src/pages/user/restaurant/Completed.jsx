import { Check, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { RestaurantBooking } from "@/lib/api";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import UniversalLoader from "@/components/user/ui/LogoLoader";

export default function CompletedPage() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true)
  const categories = isLoading ? [] : [...new Set(data.menus.map((meal) => meal.menu.category))];

  useEffect(() => {
    const fetchReservation = async () => {
      try {

        const res = await userService.fetchReservations({ bookingId: id });
        setData(res.data[0])
      } catch (err) {
        toast.error(err.response.data.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReservation()
  }, [])

  if (isLoading) {
    return <UniversalLoader fullscreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
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
            Reservation Completed Successfully
          </h1>
          <p className="text-[#6B7280] text-sm">
            Thank you for completing your reservation process, we look forward
            to seeing you
          </p>
        </div>

        {/* Reservation Details */}
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
                •{" "}
                {data.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Guests</p>
              <p className="font-medium text-gray-900">{data.guests} Guests</p>
            </div>
          </div>
        </div>

        {/* Meal Selection */}
        {data.menus.length > 0 && (
          <div className="bg-white rounded-2xl border p-5 space-y-4 border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-[#111827]">
              Your Meal Selection
            </h2>
            <div className="space-y-6">
              {categories.map((category, i) => (
                <div
                  key={i}
                  className="border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl"
                >
                  <h3 className="text-sm font-medium px-5 py-3 border-b">
                    {category}
                  </h3>
                  <div className="space-y-4 py-4 px-5">
                    {data.menus
                      .filter((meal) => meal.menu.category === category)
                      .map((meal, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center "
                        >
                          <div>
                            <p className="font-medium text-[#111827]">
                              {meal.menu.name}
                            </p>
                            <p className="text-sm text-[#606368]">
                              {meal.specialRequest}
                            </p>
                          </div>
                          <div className="bg-[#E9EBF3] text-sm text-[#111827] font-medium px-3 py-2 rounded-lg">
                            Qty: {meal.quantity}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            {data.specialRequest && (
              <div className="bg-[#FFFBEB] border-[#E0B300] border px-5 py-3 flex gap-2 text-sm items-center rounded-xl text-[#111827]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_328_745)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4C15 4.26522 14.8946 4.51957 14.7071 4.70711C14.5196 4.89464 14.2652 5 14 5H13V6.035C18.44 6.525 22.01 12.167 19.929 17.371C19.8548 17.5567 19.7266 17.7159 19.561 17.8281C19.3954 17.9402 19.2 18.0001 19 18H5C4.80018 17.9999 4.60498 17.9399 4.43957 17.8278C4.27416 17.7157 4.14613 17.5566 4.072 17.371C1.99 12.167 5.56 6.525 11 6.035V5H10C9.73478 5 9.48043 4.89464 9.29289 4.70711C9.10536 4.51957 9 4.26522 9 4ZM11.77 8C7.544 8 4.586 12.053 5.713 16H18.287C19.414 12.053 16.456 8 12.23 8H11.77ZM3 20C3 19.7348 3.10536 19.4804 3.29289 19.2929C3.48043 19.1054 3.73478 19 4 19H20C20.2652 19 20.5196 19.1054 20.7071 19.2929C20.8946 19.4804 21 19.7348 21 20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20Z"
                      fill="#E0B300"
                    />
                  </g>
                </svg>{" "}
                Special Request: {data.specialRequest}
              </div>
            )}
          </div>
        )}

        {/* Info Cards - Changed to green background */}
        <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-2xl p-4 mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                You will receive a confirmation email with your reservation
                details
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className="text-sm">Please, arrive 10 mins early</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row w-full gap-3">
          <Button
            variant="outline"
            className="flex-1 h-10 text-sm rounded-xl font-medium px-6 border-gray-300"
          >
            Get Direction
          </Button>
          <form
            action={async () => {
              navigate(`/restaurants/pre-payment/${id}`);
            }}
            className="flex-1"
          >
            <Button
              type="submit"
              className="w-full h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800"
            >
              Done
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
