"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { paymentService } from "@/services/payment.service";
import paystackLogo from "@/public/images/paystack.svg";
import { AlertTriangle } from "lucide-react";

export default function PaymentPage({ booking, setPopupOpen, payLater }) {
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState(null);


  booking.totalAmount = payLater ? 1000 : booking.totalAmount;
  const handlePayClick = async () => {
    try {
      setIsLoading(true);
      if (!payment)
        return;
      const res = await paymentService.initializePayment({ amount: booking.totalAmount, email: booking.customerEmail, vendorId: booking.vendor, bookingId: booking.resId, customerName: booking.customerName, type: booking.reservationType, payLater });

      window.location.href = res.data.authorization_url;
    } catch (error) {
      console.log(error);
      toast.error("Failed to redirect to Paystack");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethod = [
    {
      name: "Paystack",
      logo: paystackLogo,
    }
  ]

  return (
    <div className="min-h-screen fixed top-0 left-0 w-full flex items-center justify-center z-50 bg-black/60 px-4 py-4 md:px-6 md:py-6">
      <div className="max-w-md w-full mx-auto">
        <Card className="border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Make Payment
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <div>
              <h3 className="font-semibold text-gray-900">
                Payment Details
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Select a payment method to proceed with your reservation.
              </p>
              <div className="space-y-4">
                {paymentMethod.map((method, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 border-2 cursor-pointer rounded-md ${payment?.name === method.name ? "border-[#0A6C6D] " : "hover:border-gray-500"
                      }`}
                    onClick={() => setPayment(method)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={method.logo} alt={method.name} className="w-6 h-6" />
                      <span className="text-sm font-medium text-gray-700">
                        {method.name}
                      </span>
                    </div>
                    <svg width="20" height="20" className="shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#0A6C6D" />
                      {payment && <circle cx="10" cy="10" r="6" fill="#0A6C6D" />}
                    </svg>
                  </div>
                ))}
              </div>
            </div>
            
            {payLater && <div className="bg-[#FFFBEB] border border-[#E0B300] rounded-lg p-2">
              <div className="flex gap-2 items-center">
                  <AlertTriangle className="size-5 text-[#E0B300] shrink-0" />
                <h3 className="text-sm font-light">
                  You are Paying a Reservation Fee of 1000 naira.
                </h3>
              </div>
            </div>}
            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                className="w-1/3 h-11 text-sm font-medium border-gray-300"
                onClick={() => {
                  setPopupOpen(false)
                }}
              >
                Exit
              </Button>
              <Button
                className="w-2/3 h-11 text-sm font-medium disabled:cursor-not-allowed bg-[#0A6C6D] hover:bg-teal-800"
                onClick={handlePayClick}
                disabled={isLoading || !payment}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 cursor-progress border-b-2 border-white"></div>
                    Redirecting...
                  </div>
                ) : (
                  `Pay ₦${booking.totalAmount.toLocaleString()} now`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
