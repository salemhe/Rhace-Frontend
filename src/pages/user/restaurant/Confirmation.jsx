import { Check, Mail, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { paymentService } from "@/services/payment.service";
import { formatCustomDate } from "@/utils/formatDate";
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
        // 1. Handle missing ID immediately
        if (!id) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: "No transaction reference found"
            }));
            return;
        }

        let isMounted = true;
        let timeoutId; // We use timeout, not interval
        let pollCount = 0;
        const MAX_POLLS = 10;

        const completeReservation = async () => {
            try {
                const result = await paymentService.completeReservation(id);

                // If component unmounted, stop everything
                if (!isMounted) return;

                // SUCCESS: Update state
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
                // Note: We simply don't call setTimeout here, so polling stops.

            } catch (err) {
                if (!isMounted) return;

                // POLLING LOGIC: Only retry if 404 and under limit
                if (err.response?.status === 404 && pollCount < MAX_POLLS) {
                    pollCount++;
                    console.log(`Polling attempt ${pollCount}/${MAX_POLLS}...`);

                    // Schedule the NEXT attempt only after this one failed
                    timeoutId = setTimeout(completeReservation, 2000);
                    return;
                }

                // FATAL ERROR LOGIC
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

        // Start the first attempt
        completeReservation();

        // Cleanup
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

    const { reservation: data, payment } = state;

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 px-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                            <p className="text-base font-medium text-gray-900 mb-1">
                                {data.vendor.businessName || data.vendor.name}
                            </p>
                            <p className="text-sm text-gray-600">{data.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                            <p className="font-medium text-gray-900">
                                {data.bookingCode}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
                        {data.date && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(data.date).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}{" "}
                                    {data.time && `• ${data.time}`}
                                </p>
                            </div>
                        )}
                        {data.checkInDate && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Check-in / Check-out</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(data.checkInDate).toLocaleDateString()} - {new Date(data.checkOutDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Guests</p>
                            <p className="font-medium text-gray-900">{data.guests} Guests</p>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="rounded-2xl border border-gray-200 mb-6 bg-white p-4">
                    {data.menus.length > 0 && (
                        <div>
                            <h2 className="font-semibold text-gray-900 mb-2">
                                Your Selection ({data.menus.length} {data.menus.length > 1 ? "items" : "item"})
                            </h2>
                            <ul className="divide-y divide-gray-100">
                                {data.menus.map((item, index) => (
                                    <li key={index} className="flex justify-between py-2">
                                        <span className="text-gray-700">
                                            {item.quantity}x {item.menu.name}
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                            ₦{item.menu.price.toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-800">Amount paid</p>
                        <p className="font-semibold text-[#37703F] text-lg">
                            ₦{data.totalAmount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                        {!data.payLater ? (
                            <>
                                <span className="inline-flex items-center justify-center shrink-0 size-7 bg-[#37703F] text-white rounded-full">
                                    <Check className="size-5 shrink-0" />
                                </span>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-[#37703F]">Paid</span> • Payment
                                    made at {formatCustomDate(payment.paid_at)}
                                </p>
                            </>
                        ) : (
                            <>
                                <span className="inline-flex items-center justify-center shrink-0 size-7 text-[#E0B300] rounded-full">
                                    <Clock className="size-5 shrink-0" />
                                </span>
                                <p className="text-sm font-medium text-[#E0B300]">
                                    Pay at Restaurant
                                </p>
                            </>
                        )}
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