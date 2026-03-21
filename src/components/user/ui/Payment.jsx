import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import paystackLogo from "@/public/images/paystack.svg";
import { paymentService } from "@/services/payment.service";
import { AlertTriangle, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PaymentPage({ booking, setPopupOpen, payLater }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const displayAmount = payLater
    ? 1000
    : (booking?.totalAmount ?? booking?.amount ?? 0);
  console.log(booking);
  const handlePayClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    console.log(booking);
    try {
      const roomsPayload = 
      // booking.rooms?.map((room) => (
        {
        roomId: booking.rooms[0].room || booking.rooms[0].roomId,
        checkInDate: booking.rooms[0].checkInDate,
        checkOutDate: booking.rooms[0].checkOutDate,
        guests: booking.rooms[0].guests,
        specialRequest: booking.rooms[0].specialRequest,
      }
    // ));

      const res = await paymentService.initializePayment({
        vendorId: booking.vendor,
        reservationType: booking.reservationType,
        location: booking.location,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        amount: displayAmount,
        payLater,
        partPaid: booking.partPaid,
        resId: booking.resId,
        ...(booking.reservationType === "restaurant" && {
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          mealPreselected: booking.mealPreselected,
          menus: booking.menus?.map((m) => ({
            menuId: m._id,
            quantity: m.quantity,
            specialRequest: m.specialRequest,
          })),
          specialOccasion: booking.specialOccasion,
          seatingPreference: booking.seatingPreference,
          specialRequest: booking.specialRequest,
        }),
        ...(booking.reservationType === "hotel" && {
           roomId: booking.rooms[0].room || booking.rooms[0].roomId || booking.roomId,
        checkInDate: booking.rooms[0].checkInDate || booking.checkInDate,
        checkOutDate: booking.rooms[0].checkOutDate || booking.checkOutDate,
        guests: booking.rooms[0].guests || booking.guests,
        specialRequest: booking.rooms[0].specialRequest || booking.specialRequest,
        }),
        ...(booking.reservationType === "club" && {
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          drinks: booking.drinks?.map((d) => ({
            drink: d.drink,
            quantity: d.quantity,
          })),
          combos: booking.combos?.map((c) => c),
          table: booking.table,
        }),
      });
      window.location.href = res.data.authorization_url;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to initialize payment";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    {
      name: "Paystack",
      logo: paystackLogo,
      description: "Secure payment with cards, bank transfer, or USSD",
    },
  ];

  return (
    <div className="min-h-screen fixed top-0 left-0 w-full flex items-center justify-center z-50 bg-black/60 px-2 md:px-4 py-4">
      <Card className="max-w-md w-full border rounded-2xl border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Secure Payment
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Complete your payment to confirm reservation
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Total Amount</span>
              <span className="text-xl font-semibold text-[#0A6C6D]">
                ₦{displayAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          {payLater && (
            <div className="bg-[#FFFBEB] border border-[#E0B300] rounded-lg p-3">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="size-5 text-[#E0B300] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Reservation Fee</h4>
                  <p className="text-xs text-gray-600">
                    Pay ₦1,000 now to secure your reservation. Meal payment due
                    at venue.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 border-2 cursor-pointer rounded-lg transition-all ${
                    selectedPayment?.name === method.name
                      ? "border-[#0A6C6D] bg-[#0A6C6D]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPayment(method)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 block">
                        {method.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {method.description}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment?.name === method.name
                        ? "border-[#0A6C6D]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPayment?.name === method.name && (
                      <div className="size-3 shrink-0 rounded-full bg-[#0A6C6D]"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Secured by Paystack • PCI DSS Compliant</span>
            <Lock className="w-4 h-4 shrink-0" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="w-1/3 h-11 text-sm font-medium border-gray-300"
              onClick={() => setPopupOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="w-2/3 h-11 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-[#0A6C6D] hover:bg-teal-800"
              onClick={handlePayClick}
              disabled={isLoading || !selectedPayment}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay ₦${displayAmount?.toLocaleString() || 0}`
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 pt-2">
            By proceeding, you agree to our{" "}
            <a href="/terms" className="text-[#0A6C6D] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#0A6C6D] hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}