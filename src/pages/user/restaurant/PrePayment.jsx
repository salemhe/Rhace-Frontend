import { Banknote, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReservationHeader from "@/components/user/restaurant/ReservationHeader";
// import { RestaurantBooking } from "@/lib/api";
import { useState } from "react";
import PaymentPage from "@/components/user/ui/Payment";
// import { toast } from "react-toastify";
// import { userService } from "@/services/user.service";
import { useParams } from "react-router";
// import UniversalLoader from "@/components/user/ui/LogoLoader";

export default function PrePaymentPage() {
    const [popupOpen, setPopupOpen] = useState(false)
    const { id } = useParams();
    const storedData = localStorage.getItem('preferences');
    const data = JSON.parse(storedData);
    const [showConfirm, setShowConfirm] = useState(false);
    const booking = data.find(booking => booking.resId === id);
    const [payLater, setPayLater] = useState(booking ? booking.payLater : false);
    const categories = !booking || !booking.menus ? [] : [...new Set(booking.menus.map((meal) => meal.category))];
    return (
        <div className="min-h-screen bg-gray-50 ">
            <ReservationHeader title="Reservation Details" index={3} />
            <div className="max-w-4xl px-4 py-6 md:px-6 md:py-8 mx-auto">
                {/* Main Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        {booking.payLater ? "Pay for Reservation" : "Thank you for your meal selection"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {booking && booking.payLater ? "You have chosen to pay later for this reservation." : "Your pre-selected meals have been confirmed for your upcoming reservation."}
                    </p>
                </div>

                {/* Pre-payment Info - With background */}
                {!booking.payLater && (
                    <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="">
                                <Banknote className="size-10 text-[#0A6C6D]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xs md:text-base text-gray-900 mb-1">
                                    Would you like to pre-pay for your meal?
                                </h3>
                                <p className="md:text-sm text-xs text-gray-600">
                                    Payment is optional, but helps the restaurant prepare your meal
                                    ahead of time. Your payment is secure & refundable according to
                                    the restaurant&apos;s cancellation policy.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {booking.payLater && (
                    <div className="bg-[#FFFBEB] border border-[#E0B300] rounded-2xl p-4 mb-6">
                        <div className="flex gap-3">
                            <div className="text-[#E0B300]">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-7 md:size-10"
                                >
                                    <g clipPath="url(#clip0_227_468)">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15 6.66667C15 6.22464 15.1756 5.80072 15.4882 5.48816C15.8007 5.17559 16.2246 5 16.6667 5H23.3333C23.7754 5 24.1993 5.17559 24.5118 5.48816C24.8244 5.80072 25 6.22464 25 6.66667C25 7.10869 24.8244 7.53262 24.5118 7.84518C24.1993 8.15774 23.7754 8.33333 23.3333 8.33333H21.6667V10.0583C30.7333 10.875 36.6833 20.2783 33.215 28.9517C33.0913 29.2612 32.8777 29.5265 32.6017 29.7134C32.3257 29.9003 32 30.0001 31.6667 30H8.33333C8.0003 29.9998 7.67496 29.8998 7.39928 29.713C7.1236 29.5261 6.91022 29.2609 6.78667 28.9517C3.31667 20.2783 9.26667 10.875 18.3333 10.0583V8.33333H16.6667C16.2246 8.33333 15.8007 8.15774 15.4882 7.84518C15.1756 7.53262 15 7.10869 15 6.66667ZM19.6167 13.3333C12.5733 13.3333 7.64333 20.0883 9.52167 26.6667H30.4783C32.3567 20.0883 27.4267 13.3333 20.3833 13.3333H19.6167ZM5 33.3333C5 32.8913 5.17559 32.4674 5.48816 32.1548C5.80072 31.8423 6.22464 31.6667 6.66667 31.6667H33.3333C33.7754 31.6667 34.1993 31.8423 34.5118 32.1548C34.8244 32.4674 35 32.8913 35 33.3333C35 33.7754 34.8244 34.1993 34.5118 34.5118C34.1993 34.8244 33.7754 35 33.3333 35H6.66667C6.22464 35 5.80072 34.8244 5.48816 34.5118C5.17559 34.1993 5 33.7754 5 33.3333Z"
                                            fill="#E0B300"
                                        />
                                    </g>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-xs md:text-base mb-1">
                                    You are Paying Reservation
                                </h3>
                                <p className="md:text-sm text-xs text-gray-600">
                                    You are to pay a Reservation fee, since you didnt pre-select a meal.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Options */}
                <Card className="mb-6">
                    <CardContent className="px-6">
                        <div className="">
                            <h3 className="font-semibold text-xs md:text-base text-gray-900 mb-3">
                                Choose your payment option
                            </h3>
                            <p className="text-gray-900 text-sm md:text-base mb-4 font-bold">
                                <span className="">Amount to pay:</span> ₦
                                {booking.totalAmount.toLocaleString()}
                            </p>

                            <div className="flex gap-3 flex-col md:flex-row w-full">
                                <Button
                                    onClick={() => {
                                        setPayLater(!!booking.payLater);
                                        setPopupOpen(true);
                                    }}
                                    className="flex-1 py-3 h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-[#0A6C6D]/80"
                                >
                                    {booking.payLater ? "Pay Fee" : "Prepay Now"}
                                </Button>
                                {!booking.payLater && <Button
                                    onClick={() => {
                                        setPayLater(true);
                                        setShowConfirm(true);
                                    }}
                                    variant="outline"
                                    className="flex-1 h-10 py-3 text-sm font-medium rounded-xl px-6"
                                >
                                    Pay at Restaurant
                                </Button>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                {!booking.payLater && <Card className="mb-6">
                    <CardContent className="px-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

                        {/* Starters with background */}
                        {booking.menus.length > 0 &&
                            categories.map((category, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl border mb-4">
                                    <h4 className="font-medium text-gray-700 p-3">{category}</h4>
                                    <hr className="border-gray-200" />
                                    <div className="space-y-3 p-3">
                                        {booking.menus
                                            .filter((meal) => meal.category === category)
                                            .map((meal, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-start"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {meal.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {meal.specialRequest}
                                                        </p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="font-medium text-gray-900">
                                                            ₦{meal.price.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {meal.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}

                        {/* Special Request */}
                        {booking.specialRequest && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3 mb-4">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                                <p className="text-yellow-800 text-sm">
                                    <span className="font-medium">Special Request:</span>{" "}
                                    {booking.specialRequest}
                                </p>
                            </div>
                        )}

                        {/* Total */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">
                                    Sub Total
                                </span>
                                <span className="text-lg font-semibold text-gray-900">
                                    ₦{booking.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>}
            </div>
            {popupOpen && <PaymentPage type="restaurants" booking={booking} id={booking._id} setPopupOpen={setPopupOpen} payLater={payLater} />}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="rounded-xl p-5 max-w-md mx-4 border bg-[#FFFBEB] border-[#E0B300]">
                        <h2 className="text-lg font-semibold flex items-center"><AlertTriangle className="size-6 inline mr-2 text-[#E0B300]" />Confirm Pay at Restaurant</h2>
                        <p className="text-sm">
                            Are you sure you want to pay at the restaurant? You will be required to pay a reservation fee of ₦1000 to reserve the table.
                        </p>
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 mt-4 h-10 hover:bg-[#E0B300]/150 rounded-xl"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 mt-4 h-10 rounded-xl bg-[#E0B300] hover:bg-[#E0B300]/80"
                                onClick={() => {
                                    setShowConfirm(false);
                                    setPopupOpen(true);
                                    setPayLater(true);
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
