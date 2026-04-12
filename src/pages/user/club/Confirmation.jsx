import { Check, Mail, Clock, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { paymentService } from "@/services/payment.service";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import Success from "@/public/images/success.gif";
import { format } from "date-fns";
import { Edit3 } from "@/public/icons/icons";
import { cn } from "@/lib/utils";

export default function ConfirmPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [state, setState] = useState({
    reservation: null,
    payment: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // 1. Handle missing ID immediately
    if (!id) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "No transaction reference found",
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
          error: null,
        });

        localStorage.removeItem("resData");
        sessionStorage.removeItem("pendingPayment");

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
        const errorMessage =
          err.response?.data?.message || "Failed to confirm reservation";

        setState({
          reservation: null,
          payment: null,
          isLoading: false,
          error: errorMessage,
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

  const { reservation: data } = state;

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
            Your Reservation is confirmed & your payment received
          </h1>
          <p className="text-[#6B7280] text-sm">
            Thank you for completing your booking process. we look forward to
            seeing you
          </p>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
            Reservation Details
          </h2>

          <hr className="border-gray-200 mb-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4 px-4">
            <div
              className={cn(
                "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
              )}
            >
              <div className="gap-2 flex flex-col">
                <div htmlFor="date" className="text-black text-xs">
                  Date
                </div>
                {format(data.date, "do MMM, yyyy")}
              </div>
            </div>
            <div
              className={cn(
                "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
              )}
            >
              <div className="gap-2 flex flex-col">
                <div htmlFor="date" className="text-black text-xs">
                  Time
                </div>
                {data.time}
              </div>
            </div>
            <div
              className={cn(
                "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
              )}
            >
              <div className="gap-2 flex flex-col">
                <div htmlFor="date" className="text-black text-xs">
                  Table
                </div>
                {data.tables.length > 0 ? data.tables[0].tableType.name : "N/A"}{" "}
                {data.tables.length > 0
                  ? `+${data.tables.length - 1} more`
                  : ""}
              </div>
            </div>
            <div
              className={cn(
                "w-full justify-between text-left font-normal md:bg-[#F9FAFB] md:border border-[#E5E7EB] items-center rounded-xl md:px-6! min-w-[150px] flex h-[60px]",
              )}
            >
              <div className="gap-2 flex flex-col">
                <div htmlFor="date" className="text-black text-xs">
                  Guest
                </div>
                {data.guests} People
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl border border-gray-200 mb-6 bg-white">
          <div className="flex p-4 text-black justify-between">
            <h3 className="text-lg font-semibold">Add Ons</h3>
            <button
              className="flex gap-2 font-medium text-[#0A6C6D]"
            >
              <Plus /> Add more
            </button>
          </div>

          <hr className="border-gray-200 mb-4" />
          <div className="space-y-4 px-4 pb-4">
            {/* Combos Section */}
            {data.combos.length > 0 && (
              <div className="space-y-4 px-2 py-2 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex justify-between items-start">
                  <p className="text-sm">Combo Service</p>
                  <button>
                    <X className="text-[#606368] shrink-0" size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-end gap-3">
                  <div className="grid md:flex line-clamp-1 grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
                    {data.combos.slice(0, 4).map((item) => (
                      <span
                        key={item._id}
                        className="text-xs text-[#111827] truncate"
                      >
                        <span className="font-medium">1x </span>
                        {item.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-[#111827] whitespace-nowrap">
                    ₦
                    {data.combos
                      .reduce((sum, i) => sum + (i.setPrice || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Tables Section */}
            {data.tables.length > 0 && (
              <div className="space-y-4 px-2 py-2 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex justify-between items-start">
                  <p className="text-sm">Table Service</p>
                  <button>
                    <X className="text-[#606368] shrink-0" size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-end gap-3">
                  <div className="grid md:flex line-clamp-1 grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
                    {data.tables.slice(0, 4).map((item) => (
                      <span
                        key={item._id}
                        className="text-xs text-[#111827] truncate"
                      >
                        {item.quantity > 0 && (
                          <span className="font-medium">{item.quantity}x </span>
                        )}
                        {item.tableType.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-[#111827] whitespace-nowrap">
                    ₦
                    {data.tables
                      .reduce(
                        (sum, i) =>
                          sum + (i.tableType.price || 0) * (i.quantity || 1),
                        0,
                      )
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Bottles Section */}
            {data.drinks.length > 0 && (
              <div className="space-y-4 px-2 py-2 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
                <div className="flex justify-between items-start">
                  <p className="text-sm">Bottle Service</p>
                  <button>
                    <X className="text-[#606368] shrink-0" size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-end gap-3">
                  <div className="grid md:flex line-clamp-1 grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
                    {data.drinks.slice(0, 4).map((item) => (
                      <span
                        key={item._id}
                        className="text-xs text-[#111827] truncate"
                      >
                        {item.quantity > 0 && (
                          <span className="font-medium">{item.quantity}x </span>
                        )}
                        {item.drink.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-[#111827] whitespace-nowrap">
                    ₦
                    {data.drinks
                      .reduce(
                        (sum, i) =>
                          sum + (i.drink.price || 0) * (i.quantity || 0),
                        0,
                      )
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {data.combos.length === 0 &&
              data.tables.length === 0 &&
              data.drinks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items selected yet. Click "Add more" to add items to your
                  reservation.
                </div>
              )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-2xl p-4 mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 shrink-0" />
              <p className="text-sm">
                You will receive a confirmation email with your reservation
                details
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col md:flex-row w-full gap-3">
          <Button
            onClick={() => navigate("/bookings")}
            className="w-full h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800"
          >
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
