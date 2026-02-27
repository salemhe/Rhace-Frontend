import React, { useState } from "react";
import { Button } from "@/components//ui/button";
import DatePicker from "../ui/datepicker";
import { TimePicker } from "../ui/timepicker";
import { GuestPicker } from "../ui/guestpicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { TablePicker } from "../ui/tablepicker";

const BookingPopup = ({ id, tables, loading }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [table, setTable] = useState("");
  const [guests, setGuests] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date: date ? date.toISOString() : "",
      time,
      guests,
      table: table._id,
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

  const handleTable = (v) => {
    setTable(v)
  }

  return (
    <div className="md:hidden">
      {show && (
        <div className="fixed inset-0 z-50 w-full px-4 bg-[#F9FAFB] pt-10">
          <button className="flex items-center gap-2 text-sm" onClick={() => setShow(false)}>
            <X className="text-gray-600" /> Exit
          </button>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row w-full gap-4">
              <DatePicker chevron title="Date" className="bg-white" value={date} onChange={setDate} />
              <TimePicker chevron title="Time" className="bg-white" value={time} onChange={setTime} slot={['09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM']} />
            </div>
            <TablePicker chevron className="bg-white" loading={loading} tables={tables} value={table.name} onChange={(value) => handleTable(value)} />
            <GuestPicker chevron className="bg-white" value={guests} onChange={setGuests} />
            <div className="flex md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
              <Button
                type="submit"
                disabled={!date || !time || isLoading}
                className="w-full rounded-xl bg-[#0A6C6D] py-6 h-10 hover:bg-[0A6C6D]/50"
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
        </div >
      )}
      <div className="flex fixed bottom-0 left-0 w-full bg-white p-4 border-t border-[#E5E7EB]">
        <Button
          className="w-full rounded-xl bg-[#0A6C6D] py-6 h-10 hover:bg-[0A6C6D]/50"
          onClick={handlePopup}
        >
          Reserve Table
        </Button>
      </div>
    </div >
  );
};

export default BookingPopup;
