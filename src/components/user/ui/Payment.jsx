"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { paymentService } from "@/services/payment.service";

export default function PaymentPage({ booking, setPopupOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  
  const handlePayClick = async () => {
      try {
        setIsLoading(true);
        const res = await paymentService.initializePayment({ amount: booking.totalAmount, email: booking.customerEmail, vendorId: booking.vendor, bookingId: booking._id, customerName: booking.customerName, type: booking.reservationType });

        window.location.href = res.data.authorization_url;
      } catch (error) {
        console.log(error);
        toast.error("Failed to redirect to Paystack");
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen fixed top-0 left-0 w-full z-50 bg-black/60 px-4 py-4 md:px-6 md:py-6">
      <div className="max-w-md mx-auto">
        <Card className="border border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Make Payment
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Payment Details
              </h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    You will be redirected to Paystack to complete your payment.
                  </p>
                </div>
            </div>
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
                className="w-2/3 h-11 text-sm font-medium bg-[#0A6C6D] hover:bg-teal-800"
                onClick={handlePayClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
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
