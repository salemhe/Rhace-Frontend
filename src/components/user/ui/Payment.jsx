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
import { RestaurantBooking } from "@/lib/api";
import { useNavigate } from "react-router";

export default function PaymentPage({ type, id, setPopupOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const booking = RestaurantBooking[0];

function calculateSplitPaymentAmount(
  vendorAmountNaira,
  platformPercent = 0.1,
  totalKobo = null,
  attempt = 0,  
  maxAttempts = 50
) {
  // Convert to integer kobo
  const vendorAmount = Math.round(vendorAmountNaira * 100);

  // Constants in kobo
  const paystackPercent = 0.015;
  const paystackFlatFee = 10000; // ₦100 => 10000 kobo
  const flatFeeThreshold = 250000; // ₦2500 => 250000 kobo
  const paystackCap = 200000; // ₦2000 => 200000 kobo

  if (totalKobo === null) {
    // Initial rough guess
    totalKobo = vendorAmount / ((1 - platformPercent) * (1 - paystackPercent));
  }

  // Apply flat fee logic
  const flatFee = totalKobo > flatFeeThreshold ? paystackFlatFee : 0;

  // Paystack fee = 1.5% of total + flat fee (capped)
  const rawPaystackFee = totalKobo * paystackPercent + flatFee;
  const paystackFee = Math.min(rawPaystackFee, paystackCap + flatFee);

  // Platform fee
  const platformFee = totalKobo * platformPercent;

  // What the vendor would actually get
  const vendorCut = totalKobo - paystackFee - platformFee;

  // Difference from expected
  const diff = vendorAmount - vendorCut;

  // If we're accurate to the kobo or max attempts hit, stop
  if (Math.abs(diff) < 1 || attempt >= maxAttempts) {
    return {
      totalAmount: +(totalKobo / 100).toFixed(2),      // in Naira
      paystackFee: +(paystackFee / 100).toFixed(2),    // in Naira
      platformCut: +(platformFee / 100).toFixed(2),    // in Naira
      vendorCut: +(vendorCut / 100).toFixed(2),        // in Naira
      attempts: attempt + 1
    };
  }

  // Adjust total based on difference
  const newTotal = totalKobo + diff;

  // Recurse
  return calculateSplitPaymentAmount(
    vendorAmountNaira,
    platformPercent,
    newTotal,
    attempt + 1,
    maxAttempts
  );
}




  const totalPrice = calculateSplitPaymentAmount(booking.totalPrice, 0.08);

  const navigate = useNavigate();
  
  const handlePayClick = async () => {
      try {
        setIsLoading(true);
        toast.success(`Payed ₦${totalPrice.totalAmount.toLocaleString()} Succesfully!!`)
        navigate(`/${type}/completed/${id}`)
      } catch (error) {
        console.log(error);
        toast.error("Failed to redirect to Paystack");
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen fixed top-0 left-0 w-full z-50 bg-gray-50 px-4 py-4 md:px-6 md:py-6">
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
                    Processing...
                  </div>
                ) : (
                  `Pay ₦${totalPrice.totalAmount.toLocaleString()} now`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
