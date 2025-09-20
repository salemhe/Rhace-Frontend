import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DatePicker from "../ui/datepicker";
import { TimePicker } from "../ui/timepicker";
import { GuestPicker } from "../ui/guestpicker";

const BookingForm = ({ id }) => {
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row w-full gap-4">
                <DatePicker value={date} onChange={setDate} />
                <TimePicker value={time} onChange={setTime} />
            </div>
            <GuestPicker value={guests} onChange={setGuests} />
            <div className="flex flex-col gap-y-3">
                <Label htmlFor="special-request">Special Request</Label>
                <Textarea
                    id="special-request"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="e.g Birthday Celebration"
                    className="resize-none h-[100px] font-normal bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl"
                />
            </div>
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
        </form>
    );
};

export default BookingForm;
