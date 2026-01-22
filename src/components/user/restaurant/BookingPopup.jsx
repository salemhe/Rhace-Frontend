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
import { useSelector } from "react-redux";
import { userService } from "@/services/user.service";

const BookingPopup = ({ id, menu = false, reservation }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [request, setRequest] = useState("");
  const [guests, setGuests] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const parsedGuestCount = parseInt(guests, 10);
  if (isNaN(parsedGuestCount) || parsedGuestCount < 1) {
    throw new Error("Please enter a valid number of guests.");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: date ? date.toISOString() : "",
      time,
      guests,
      specialRequest: request,
    });
    navigate(`/restaurants/${id}/reservations?${params.toString()}`);
    e.preventDefault();
    setIsLoading(true);
    try {
      if (menu) {
      const vendor = reservation.vendor;
      if (!user) {
        navigate(`/auth/user/login?redirect=/menus/${id}`);
      }

      if (!date || !guests || !time) {
        throw new Error("Please fill in all required fields.");
      }

      if (!vendor._id) {
        throw new Error("Vendor information is missing.");
      }

      const parsedGuestCount = parseInt(guests, 10);
      if (isNaN(parsedGuestCount) || parsedGuestCount < 1) {
        throw new Error("Please enter a valid number of guests.");
      }

      const selectedMeals = reservation.selected.filter(item => item.quantity > 0);

      // Calculate total price
      const totalPrice = selectedMeals.reduce(
        (total, item) => total + ((item.price || 0) * (item.quantity || 1)),
        0
      );

      // Prepare reservation data
      const reservationData = {
        // _id: "1",
        reservationType: "restaurant",
        customerName: `${user.firstName} ${user.lastName}`.trim(),
        customerEmail: user.email,
        customerId: user._id,
        date: date.toISOString(),
        time,
        guests: parsedGuestCount,
        request,
        mealPreselected: selectedMeals.length > 0,
        // additionalNote,
        menus: selectedMeals.map(item => ({
          menu: item._id,
          quantity: item.quantity || 1,
          specialRequest: item.specialRequest || "",
        })),
        totalAmount: totalPrice + 1000,
        vendor: vendor._id,
        location: vendor.address,
        image: vendor.profileImages?.[0],
      };

      const res = await userService.createReservation(reservationData);

      const reservationResponse = res.data;


      toast.success("Reservation submitted successfully!");

      // Navigate to confirmation page
      navigate(`/restaurants/completed/${reservationResponse._id}`);
    } else {
      if (!date || !time) {
        throw new Error("Date and Time are required");
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate(`/restaurants/${id}/reservations?${params.toString()}`);
    }
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
            <TimePicker
              className="bg-white"
              value={time}
              onChange={setTime}
              slot={[
                '09:00 AM', '09:30 AM',
                '10:00 AM', '10:30 AM',
                '11:00 AM', '11:30 AM',
                '12:00 PM', '12:30 PM',
                '01:00 PM', '01:30 PM',
                '02:00 PM', '02:30 PM',
                '03:00 PM', '03:30 PM',
                '04:00 PM', '04:30 PM',
                '05:00 PM', '05:30 PM',
                '06:00 PM', '06:30 PM',
                '07:00 PM', '07:30 PM',
                '08:00 PM', '08:30 PM',
              ]}
            />
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
