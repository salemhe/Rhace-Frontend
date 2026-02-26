import { Check, Mail, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { paymentService } from "@/services/payment.service";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import Success from "@/public/images/success.gif";

export default function ConfirmPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [state, setState] = useState({
        reservation: null,
        payment: null,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        if (!id) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: "No transaction reference found"
            }));
            return;
        }

        let isMounted = true;
        let timeoutId;
        let pollCount = 0;
        const MAX_POLLS = 10;

        const completeReservation = async () => {
            try {
                const result = await paymentService.completeReservation(id);

                if (!isMounted) return;

                setState({
                    reservation: result.reservation,
                    payment: result.payment,
                    isLoading: false,
                    error: null
                });

                localStorage.removeItem('resData');
                sessionStorage.removeItem('pendingPayment');

                if (result.isNewBooking) {
                    toast.success("Reservation confirmed successfully!");
                }

            } catch (err) {
                if (!isMounted) return;

                if (err.response?.status === 404 && pollCount < MAX_POLLS) {
                    pollCount++;
                    console.log(`Polling attempt ${pollCount}/${MAX_POLLS}...`);

                    timeoutId = setTimeout(completeReservation, 2000);
                    return;
                }

                const errorMessage = err.response?.data?.message || "Failed to confirm reservation";

                setState({
                    reservation: null,
                    payment: null,
                    isLoading: false,
                    error: errorMessage
                });
                toast.error(errorMessage);
            }
        };

        completeReservation();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [id]);

    if (state.isLoading) {
        return (
            <div className="min-h-screen">
                <div className="h-[90vh] w-full flex items-center justify-center">
                    <div className="flex items-center flex-col gap-4">
                        <UniversalLoader />
                        <p className="text-gray-600">Processing your reservation...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="h-[90vh] w-full flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <X className="w-8 h-8 text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Reservation Failed
                        </h2>
                        <p className="text-gray-600 mb-6">{state.error}</p>
                        <Button
                            onClick={() => navigate(0)}
                            className="bg-[#0A6C6D] hover:bg-teal-800"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const { reservation: data } = state;
    const room = data.room;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Icon */}
                <div className="flex justify-center relative mb-6">
                    <div className="w-16 h-16 bg-[#37703F1A] rounded-full flex items-center justify-center">
                        <img src={Success} alt="Success" className="absolute z-0" />
                        <div className="w-12 h-12 bg-[#37703F] rounded-full z-10 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Main Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold text-[#111827] mb-2">
                        Your reservation is confirmed!
                    </h1>
                    <p className="text-[#6B7280] text-sm">
                        {data.payLater
                            ? "Your table is reserved. Pay the balance at the restaurant."
                            : "Your payment is confirmed and your reservation is all set!"
                        }
                    </p>
                </div>

                {/* Reservation Details */}
                <div className="bg-white rounded-2xl border border-gray-200 mb-6">
                    <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                        Reservation Details
                    </h2>

                    <hr className="border-gray-200 mb-4" />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Check In Date</p>
                            <p className="font-medium text-gray-900">
                                {new Date(data.checkInDate).toLocaleDateString('en-NG', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Check Out Date</p>
                            <p className="font-medium text-gray-900">
                                {new Date(data.checkInDate).toLocaleDateString('en-NG', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Guests Allowed</p>
                            <p className="font-medium text-gray-900">{data.guests} Guests</p>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="rounded-2xl bg-white border border-gray-200 mb-6">
                    <div className=" divide-y">
                        <div className="flex p-4 justify-between items-center">
                            <h3 className="text-lg font-semibold">Room Summary</h3>
                        </div>
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-600">Room Name</p>
                                    <p className="text-sm  line-clamp-1 font-medium text-gray-900">
                                        Superion {room.category} {room.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-600">Price per Night</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        ₦
                                        {(
                                            room.pricePerNight -
                                            room.pricePerNight * (room.discount / 100)
                                        ).toLocaleString()}
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
                                        {room.adultsCapacity}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-[#0A6C6D] underline">
                                    Free cancellation until 24h before check-in
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-2xl p-4 mb-8">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 shrink-0" />
                            <p className="text-sm">
                                You will receive a confirmation email with your reservation details
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 shrink-0" />
                            <p className="text-sm">Please arrive 10 minutes early</p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col md:flex-row w-full gap-3">
                    <Button
                        onClick={() => navigate('/bookings')}
                        className="w-full h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800"
                    >
                        View My Bookings
                    </Button>
                </div>
            </div>
        </div>
    );
}