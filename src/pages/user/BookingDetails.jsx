import { Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import UniversalLoader from "@/components/user/ui/LogoLoader";

export default function BookingDetails() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true)

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
        fetchReservation();
    }, [])

    if (isLoading) {
        return <UniversalLoader fullscreen />
    }


    return (
        <div className="min-h-screen relative bg-gray-50 px-4 py-6 md:px-6 md:py-8">
            <div><X className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => navigate('/bookings')} /></div>
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
                {data.vendor.vendorType === "restaurant" && data.menus.length > 0 && (
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
                    </div>
                )}
            </div>
        </div>
    );
}
