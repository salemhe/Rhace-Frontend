import { Button } from "@/components//ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";
import { SvgIcon } from "./BookingForm";

const HotelBookingPopup = ({
  id,
  activeTab,
  show,
  setShow,
  selectedRoom,
  setActiveTab,
}) => {
  const [date, setDate] = useState();
  const [date2, setDate2] = useState();
  const [request, setRequest] = useState("");
  const [guests, setGuests] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: date ? date.toISOString() : "",
      date2: date2 ? date2.toISOString() : "",
      guests,
      // specialRequest: request,
      roomId: selectedRoom._id,
    });
    navigate(`/hotels/${id}/reservations?${params.toString()}`);
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!date) {
        throw new Error("Date and Time are required");
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      if (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred";
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="md:hidden">
      {show && (
        <div className="fixed inset-0 z-50 w-full px-4 bg-[#F9FAFB] pt-10">
          <button
            className="flex items-center gap-2 text-sm"
            onClick={() => setShow(false)}
          >
            <X className="text-gray-600" /> Exit
          </button>
          {selectedRoom._id && (
            <div className="w-full h-7 mt-4 inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-1">
                <div className="justify-start text-[#111827] text-lg font-semiboldbold font-['Inter'] leading-relaxed">
                  ₦{selectedRoom.pricePerNight.toLocaleString()}
                </div>
                <div className="justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-tight">
                  /night
                </div>
              </div>
              {selectedRoom.discount > 0 && (
                <div className="h-7 px-2 rounded-lg  outline-1 outline-offset-[-1px] outline-yellow-500 inline-flex flex-col justify-center items-center gap-2">
                  <div className="inline-flex justify-start items-center gap-1.5">
                    <div className="w-4 h-4 relative overflow-hidden">
                      <SvgIcon />
                    </div>
                    <div className="justify-start text-gray-900 text-xs font-medium font-['Inter'] leading-none tracking-tight">
                      {selectedRoom.discount}% off
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="w-96 justify-start text-[#606368] text-xs font-normal font-['Inter'] leading-tight">
            Prices includes all fees
          </div>
          {!selectedRoom._id && (
            <p className="text-xs">
              Select the room of your choice{" "}
              <span className="text-red-500">*</span>
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row w-full gap-4">
              <DatePicker
                title="Check in Date"
                className="bg-white"
                value={date}
                onChange={setDate}
              />
              <DatePicker
                title="Check out Date"
                className="bg-white"
                value={date2}
                onChange={setDate2}
              />
            </div>
            <GuestPicker
              className="bg-white"
              value={guests}
              onChange={setGuests}
            />
            {/* <div className="flex flex-col gap-y-3">
              <Label htmlFor="special-request">Special Request</Label>
              <Textarea
                id="special-request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g Night Party"
                className="resize-none h-[100px] font-normal bg-white border border-[#E5E7EB] rounded-xl"
              />
            </div> */}
            <div className="flex md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
              <Button
                type="submit"
                disabled={!date || isLoading}
                className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Loading
                  </>
                ) : (
                  "Reserve Room"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
      {activeTab !== "rooms" && (
        <div className="flex fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
          <Button
            className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
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
