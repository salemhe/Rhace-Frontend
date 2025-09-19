import { ArrowLeft, MapPin, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/contexts/club/ReservationContext";
import ReservationHeader from "../../../components/user/hotel/ReservationHeader";
import DatePicker from "../../../components/user/ui/datepicker";
import { GuestPicker } from "../../../components/user/ui/guestpicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { useState } from "react";
import PaymentPage from "../../../components/user/ui/Payment";

export default function ReservationSummary() {
  const [popupOpen, setPopupOpen] = useState(false)
  const {
    guestCount,
    setSpecialRequest,
    specialRequest,
    setGuestCount,
    setPage,
    date,
    setDate,
    vendor,
    totalPrice,
    setProposedPayment,
    proposedPayment,
    handleSubmit
  } = useReservations();
  const navigate = useNavigate();

  const handleContinue = () => {
    handleSubmit
    setPopupOpen(true)
  }

  return (
    <div className="min-h-screen mb-[65px] mt-[20px] md:mt-0 bg-gray-50">
      <ReservationHeader title="Reservation Details" index={2} />
      <div className="md:hidden flex items-center gap-3 px-4 py-3 ">
        <button onClick={() => setPage(0)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_2317_1082)">
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
        <div className="max-w-[500px]">
          <div className="flex gap-4">
            <div className="relative size-[64px] md:w-32 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={vendor?.profileImages?.[0]?.url || "/hero-bg.png"}
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
                  {vendor?.reviews.toLocaleString() || "1,000"} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="space-y-6 md:col-span-4">
            <div className="rounded-2xl bg-white border">
              <div className=" divide-y">
                <div className="flex p-4">
                  <h3 className="text-lg font-semibold">Booking Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                  <DatePicker value={date} onChange={setDate} />
                  <DatePicker value={date} onChange={setDate} />
                  <GuestPicker value={guestCount} onChange={setGuestCount} />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white border">
              <div className=" divide-y">
                <div className="flex p-4">
                  <h3 className="text-lg font-semibold">Room Summary</h3>
                </div>
                <div className="space-y-4 p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Room Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        Superion Deluxe Room
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Price per Night</p>
                      <p className="text-sm font-medium text-gray-900">
                        #150,000
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Bed Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        1 master bed
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Guests Allowed</p>
                      <p className="text-sm font-medium text-gray-900">
                        2
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-[#0A6C6D] underline">Free cancellation until 24h before check-in</div>
                </div>
              </div>
            </div>
            <div className="mb-6 space-y-6">
              <div className="relative">
                <Label
                  htmlFor="special-request"
                  className="text-sm font-medium mb-2 block"
                >
                  Special Request (Optional)
                </Label>
                <Textarea
                  id="special-request"
                  placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                  value={specialRequest}
                  maxLength={500}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="min-h-[100px] bg-[#F9FAFB] border text-sm border-[#E5E7EB] resize-none rounded-xl"
                />
                <p className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {specialRequest.length}/500
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 space-y-6">
            <div className="rounded-2xl bg-white border">
              <div className=" divide-y">
                <div className="flex p-4">
                  <h3 className="text-lg font-semibold">Reservation Details</h3>
                </div>
                <div className="p-4">
                  <div className="rounded-2xl bg-white border">
                    <div className=" divide-y">
                      <div
                        className={`flex p-4 rounded-t-2xl justify-between items-center ${proposedPayment === totalPrice
                          ? "border border-red-500"
                          : ""
                          }`}
                        onClick={() => {
                          setProposedPayment(totalPrice);
                        }}
                      >
                        <h3 className="text-lg font-semibold">
                          Pay #150,000 now
                        </h3>
                        <div></div>
                      </div>
                      <div
                        className={`flex p-4 rounded-b-2xl justify-between items-center`}
                        onClick={() => {
                          setProposedPayment(totalPrice / 2);
                        }}
                      >
                        <div className="space-y-1">
                          <h3 className="text-[#111827]">
                            Pay part now, rest later
                          </h3>
                          <p>
                            Pay #75,000 now, and #75,000 on{" "}
                            {date
                              ? format(date, "do MMM, yyyy")
                              : "the day of your arrival"}
                            . No extra fees
                          </p>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white border p-4">
              <h3 className="text-lg font-semibold">Your Total</h3>
              <div className=" divide-y">
                <div className="mb-3 space-y-2 text-sm">
                  <p className="text-[#111827]">Price Details</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#606368]">#150,000 / 2 nights</p>
                    <p className="text-[#111827]">
                      #300,000
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-lg text-[#111827]">
                  <p>Sub Total</p>
                  <p>#300,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto p-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="md:flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2 hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hotel Details Page
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 px-8 w-full max-w-xs rounded-xl cursor-pointer"
            onClick={handleContinue}
            disabled={!date || !guestCount}
          >
            Complete Reservations
          </Button>
        </div>
      </div>
      {popupOpen &&
        <PaymentPage id={"1"} type="clubs" setPopupOpen={setPopupOpen} />
      }
    </div>
  );
}
