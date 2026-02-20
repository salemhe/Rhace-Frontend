import { Button } from "@/components//ui/button";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";
import { SvgIcon } from "./BookingForm";
import * as SelectPrimitive from "@radix-ui/react-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const HotelBookingPopup = ({
  id,
  activeTab,
  show,
  setShow,
  selectedRoom,
  setSelectedRoom,
  rooms,
  setActiveTab,
}) => {
  const [date, setDate] = useState();
  const [date2, setDate2] = useState();
  const [guests, setGuests] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const category = [
    {
      name: "Standard",
      rooms: rooms && rooms.filter((r) => r.category === "Standard")
    },
    {
      name: "Deluxe",
      rooms: rooms && rooms.filter((r) => r.category === "Deluxe")
    },
    {
      name: "Executive",
      rooms: rooms && rooms.filter((r) => r.category === "Executive")
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: date ? date.toISOString() : "",
      date2: date2 ? date2.toISOString() : "",
      guests,
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
  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
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
          {selectedRoom && (
            <div className="w-full h-7 mt-4 inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-1">
                <div className="justify-start text-[#111827] text-lg font-semiboldbold font-['Inter'] leading-relaxed">
                  {formatPrice(
                    selectedRoom.pricePerNight -
                    selectedRoom.pricePerNight * (selectedRoom.discount / 100),
                  )}
                </div>
                <div className="justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-tight">
                  /night
                </div>
              </div>
              {selectedRoom.discount > 0 && (
                <div className="h-7 px-2 rounded-lg  outline-1 -outline-offset-1 outline-yellow-500 inline-flex flex-col justify-center items-center gap-2">
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
          {!selectedRoom && (
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
            <Select disabled={!rooms} onValueChange={(value) => setSelectedRoom(rooms.find(r => r._id === value))} >
              <SelectPrimitive.Trigger asChild className="w-full">
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border gap-2 border-[#E5E7EB] flex-col items-start rounded-xl px-6 min-w-[150px] flex h-[60px]",
                    !selectedRoom && "text-muted-foreground"
                  )}
                >
                  <Label className="text-black">
                    Room Type
                  </Label>
                  {selectedRoom ? `${selectedRoom.name}` : "Select Room types"}
                </Button>
              </SelectPrimitive.Trigger>
              <SelectContent>
                {category.map((item, i) => (
                  <SelectGroup key={i}>
                    <SelectLabel>{item.name}</SelectLabel>
                    {
                      item.rooms && item.rooms.map((room, idx) => (
                        <SelectItem key={idx} value={room._id}>{room.name}</SelectItem>
                      ))
                    }
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <div className="flex md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
              <Button
                type="submit"
                disabled={!date || !date2 || isLoading || !selectedRoom}
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
