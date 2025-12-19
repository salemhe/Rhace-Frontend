import React, { useState } from "react";
import { Button } from "@/components//ui/button";
import DatePicker from "../ui/datepicker";
import { TimePicker } from "../ui/timepicker";
import { GuestPicker } from "../ui/guestpicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const BookingPopup = ({ id }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [request, setRequest] = useState("");
  const [guests, setGuests] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: date ? date.toISOString() : "",
      time,
      guests,
      specialRequest: request,
    });
    navigate(`/clubs/${id}/reservations?${params.toString()}`);
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!date || !time) {
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
  const handlePopup = () => {
    setShow(true);
  };

  return (
    <div className="md:hidden">
      {show && (
        <div className="fixed inset-0 z-50 w-full px-4 bg-[#F9FAFB] pt-10">
            <button className="flex items-center gap-2 text-sm" onClick={() => setShow(false)}>
               <X className="text-gray-600" /> Exit
            </button>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row w-full gap-4">
              <DatePicker className="bg-white" value={date} onChange={setDate} />
              <TimePicker value={time} onChange={setTime} slot={['09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM']} />
            </div>
            <GuestPicker className="bg-white" value={guests} onChange={setGuests} />
            <div className="flex flex-col gap-y-3">
              <Label htmlFor="special-request">Special Request</Label>
              <Textarea
                id="special-request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g Birthday Celebration"
                className="resize-none h-[100px] font-normal bg-white border border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div className="flex md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
              <Button
                type="submit"
                disabled={!date || !time || isLoading}
                className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Loading
                  </>
                ) : (
                  "Reserve Table"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
      <div className="flex fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
        <Button
          className="w-full rounded-xl bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
          onClick={handlePopup}
        >
          Reserve Table
        </Button>
      </div>
    </div>
  );
};

export default BookingPopup;
