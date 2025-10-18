import { Check, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { paymentService } from "@/services/payment.service";
import { formatCustomDate } from "@/utils/formatDate";

export default function ConfirmPage() {
    const navigate = useNavigate()
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const trxref = query.get('trxref');
    const { id } = useParams();
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const [isVerifying, setIsVerifying] = useState(true)
    const [payment, setPayment] = useState();

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const res = await userService.fetchReservations({ bookingId: id });
                setData(res.data[0])
            } catch (err) {
                toast.error(err.response.data.message)
            } finally {
                setIsLoading(false)
            }
        }
        const verifyPayment = async () => {
            try {
                const res = await paymentService.verifyPayment(trxref);
                setPayment(res)
            } catch (err) {
                toast.error(err.response.data.message)
            } finally {
                setIsVerifying(false)
            }
        }
        fetchReservation();
        verifyPayment();
    }, [])

    if (isLoading || isVerifying) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#37703F1A] rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#37703F] rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Main Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold text-[#111827] mb-2">
                        Your reservation is confirmed & your meal has been paid
                    </h1>
                    <p className="text-[#6B7280] text-sm">
                        Your pre-selected meals have been confirmed for your upcoming reservation
                    </p>
                </div>

                {/* Reservation Details */}
                <div className="bg-white rounded-2xl border border-gray-200 mb-6">
                    <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                        Reservation Details
                    </h2>

                    {/* HR tag after Reservation Details */}
                    <hr className="border-gray-200 mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 px-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                            <p className="text-base font-medium text-gray-900 mb-1">
                                {data.vendor.businessName || "hey"}
                            </p>
                            <p className="text-sm text-gray-600">{data.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                            <p className="font-medium text-gray-900">
                                #{data._id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                            <p className="font-medium text-gray-900">
                                {new Date(data.date).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}{" "}
                                •{" "}
                                {data.time}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Guests</p>
                            <p className="font-medium text-gray-900">{data.guests} Guests</p>
                        </div>
                    </div>
                </div>

                {/* Meal Selection */}
                {data.menus.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 mb-6 bg-white shadow-sm p-5">
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

                        <div className="border-t border-gray-200 my-4"></div>

                        <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-800">Amount paid</p>
                            <p className="font-semibold text-[#37703F] text-lg">
                                ₦{data.totalAmount.toLocaleString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                            {payment.status === "success" ? (
                                <>
                                    <span className="inline-flex items-center justify-center size-7 bg-[#37703F] text-white rounded-full">
                                        <Check className="size-5" />
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-[#37703F]">Paid</span> • Payment
                                        made at {formatCustomDate(payment.paid_at)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-red-500 font-medium">Not Paid</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Cards - Changed to green background */}
                <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-2xl p-4 mb-8">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                                You will receive a confirmation email with your reservation
                                details
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
                            <p className="text-sm">Please, arrive 10 mins early</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row w-full gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 h-10 text-sm rounded-xl font-medium px-6 border-gray-300"
                    >
                        Get Direction
                    </Button>
                    <form
                        action={async () => {
                            navigate(`/bookings`);
                        }}
                        className="flex-1"
                    >
                        <Button
                            type="submit"
                            className="w-full h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800"
                        >
                            Done
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
