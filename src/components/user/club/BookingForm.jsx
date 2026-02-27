import React, { useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import DatePicker from "../ui/datepicker";
import { TimePicker } from "../ui/timepicker";
import { GuestPicker } from "../ui/guestpicker";
import { TablePicker } from "../ui/tablepicker";

const BookingForm = ({ id, tables, loading }) => {
    const [date, setDate] = useState();
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState("1");
    const [table, setTable] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams({
            date: date ? date.toISOString() : "",
            time,
            guests,
            table: table._id
        });
        setIsLoading(true);
        try {
            if (!date || !time) {
                throw new Error("Date and Time are required");
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
            navigate(`/clubs/${id}/reservations?${params.toString()}`);
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

    const handleTable = (v) => {
        console.log(v)
        setTable(v)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row w-full gap-4">
                <DatePicker title="Date" value={date} onChange={setDate} />
                <TimePicker title="Time" value={time} onChange={setTime} slot={['09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM']} />
            </div>
            <TablePicker chevron loading={loading} tables={tables} value={table.name} onChange={(value) => handleTable(value)} />
            <GuestPicker chevron value={guests} onChange={setGuests} />
            <Button
                type="submit"
                disabled={!date || !time || isLoading || !table}
                className="w-full rounded-xl h-10 py-6 bg-[#0A6C6D] hover:bg-[0A6C6D]/50"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" /> Loading
                    </>
                ) : (
                    "Reserve Table"
                )}
            </Button>
        </form>
    );
};

export default BookingForm;
