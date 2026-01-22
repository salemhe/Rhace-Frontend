import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import { useSelector } from 'react-redux';

const ReservationContext = createContext(
    undefined
);

export function ReservationsProvider({
    children,
}) {
    const [menuItems, setMenuItems] = useState([]);
    const [additionalNote, setAdditionalNote] = useState("");
    const [guestCount, setGuestCount] = useState("1");
    const [specialRequest, setSpecialRequest] = useState("");
    const [activeTab, setActiveTab] = useState("Starters");
    const [room, setRoom] = useState({});
    const [page, setPage] = useState(0);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [vendor, setVendor] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [booking, setBooking] = useState(null);
    const [roomId, setRoomId] = useState("");
    const user = useSelector((state) => state.auth.user);
    const [partPay, setPartPay] = useState(false)

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = (checkInDate && checkOutDate)
        ? Math.max(
            1,
            Math.ceil(
                ((checkOutDate instanceof Date ? checkOutDate.getTime() : new Date(checkOutDate).getTime())
                - (checkInDate instanceof Date ? checkInDate.getTime() : new Date(checkInDate).getTime()))
                / msPerDay
            )
        )
        : 1;

    const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Other"];


    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validate required fields
            if (!checkInDate || !checkOutDate || !guestCount || !roomId) {
                throw new Error("Please fill in all required fields.");
            }

            if (checkOutDate <= checkInDate) {
                throw new Error("Check-out date must be after check-in date.");
            }

            if (!vendor._id) {
                throw new Error("Vendor information is missing.");
            }

            const parsedGuestCount = parseInt(guestCount, 10);
            if (isNaN(parsedGuestCount) || parsedGuestCount < 1) {
                throw new Error("Please enter a valid number of guests.");
            }

            // Prepare reservation data
            const reservationData = {
                // _id: "1",
                reservationType: "hotel",
                customerName: `${user.firstName} ${user.lastName}`.trim(),
                customerEmail: user.email,
                customerId: user._id,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                guests: parsedGuestCount,
                specialRequest,
                room: roomId,
                partPaid: partPay,
                totalAmount: partPay ? ((room.pricePerNight  - room.pricePerNight * (room.discount / 100))  * nights)/ 2 : (room.pricePerNight  - room.pricePerNight * (room.discount / 100)) * nights,
                vendor: vendor._id,
                location: vendor.address,
                image: vendor.profileImages?.[0],
            };

            const res = await userService.createReservation(reservationData);

            const reservationResponse = res.data;
            setBooking(reservationResponse);


            toast.success("Reservation submitted successfully!");
            return 1

            // Navigate to confirmation page
            // navigate(`/restaurants/completed/${reservationResponse._id}`);

        } catch (error) {
            console.error("Error submitting reservation:", error);

            // Show specific error message
            let errorMessage = "Failed to submit reservation. Please try again.";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error;
                errorMessage = axiosError.response?.data?.message || "Failed to submit reservation. Please try again.";
            }
            toast.error(errorMessage);
            
            // Log detailed error for debugging
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error
                if (axiosError.response?.data) {
                    console.error("Server error details:", axiosError.response.data);
                }
            }
            return 0;
        } finally {
            setIsLoading(false);
        }
    };
    // Simulate fetching menu items

    return (
        <ReservationContext.Provider
            value={{
                room, 
                setRoom,
                menuItems,
                setMenuItems,
                additionalNote,
                setAdditionalNote,
                guestCount,
                setGuestCount,
                specialRequest,
                setSpecialRequest,
                occasions,
                activeTab,
                setRoomId,
                roomId,
                setActiveTab,
                booking,
                page,
                nights,
                setPage,
                checkOutDate, setCheckOutDate,
                checkInDate, setCheckInDate,
                vendor,
                setVendor,
                handleSubmit,
                isLoading,
                setPartPay,
                partPay
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
}

export function useReservations() {
    const context = useContext(ReservationContext);
    if (context === undefined) {
        throw new Error(
            "useReservations must be used within a ReservationsProvider"
        );
    }
    return context;
}
