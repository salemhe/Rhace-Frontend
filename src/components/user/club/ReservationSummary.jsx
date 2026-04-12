import { ArrowLeft, MapPin, Plus, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/contexts/club/ReservationContext";
import ReservationHeader from "./ReservationHeader";
import { TimePicker } from "../ui/timepicker";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
import PaymentPage from "../ui/Payment";
import { TablePicker } from "../ui/tablepicker";
import ScrollToTop from "@/components/ScrollToTop";
import { useIsMobile } from "@/utils/helper";

export default function ReservationSummary() {
  const isMobile = useIsMobile();
  const [popupOpen, setPopupOpen] = useState(false);
  const [next, showNext] = useState(false);
  const showBookingDetails = !isMobile || next === false;
  const showPaymentStep = !isMobile || next === true;
  const {
    comboItems,
    setBottleItems,
    setComboItems,
    bottleItems,
    vipExtraItems,
    guestCount,
    setSpecialRequest,
    specialRequest,
    setGuestCount,
    setPage,
    date,
    setDate,
    time,
    setTime,
    table,
    setTable,
    vendor,
    handleSubmit,
    booking,
    isLoading,
    setPartPay,
    partPay,
    loading,
  } = useReservations();
  const navigate = useNavigate();

  // Calculate totals correctly
  const calculatedTotals = useMemo(() => {
    // Calculate tables total
    const tablesTotal = table
      .filter((item) => item.selected)
      .reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0,
      );

    // Calculate combos total
    const combosTotal = comboItems
      .filter((item) => item.selected)
      .reduce((total, item) => total + (item.setPrice || 0), 0);

    // Calculate bottles total
    const bottlesTotal = bottleItems
      .filter((item) => item.quantity > 0)
      .reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0,
      );

    // Calculate VIP extras total
    const vipTotal = vipExtraItems.reduce(
      (total, item) => total + (item.price || 0),
      0,
    );

    const grandTotal = tablesTotal + combosTotal + bottlesTotal + vipTotal;

    return {
      tablesTotal,
      combosTotal,
      bottlesTotal,
      vipTotal,
      grandTotal,
    };
  }, [table, comboItems, bottleItems, vipExtraItems]);

  const handleContinue = async () => {
    if (next === false && isMobile) {
      showNext(true);
    } else {
      const canPay = await handleSubmit();
      if (canPay) {
        setPopupOpen(true);
      }
    }
  };

  const handleTable = (v) => {
    setTable(
      table.map((item) => ({
        ...item,
        selected: item._id === v._id ? !item.selected : item.selected,
      })),
    );
  };

  // Format selected tables for display
  const getSelectedTablesText = () => {
    const selectedTables = table.filter((t) => t.selected);
    if (selectedTables.length === 0) return "";
    if (selectedTables.length === 1) {
      const table = selectedTables[0];
      return table.quantity > 1
        ? `${table.name} (${table.quantity})`
        : table.name;
    }
    const totalCount = selectedTables.reduce(
      (sum, t) => sum + (t.quantity || 1),
      0,
    );
    return `${selectedTables.length} table types (${totalCount} total)`;
  };

  // Handle removing individual table
  const handleRemoveTable = (id) => {
    setTable(
      table.map((item) => {
        if (item._id === id) {
          return { ...item, quantity: 0, selected: false };
        }
        return item;
      }),
    );
  };

  // Handle removing individual combo
  const handleRemoveCombo = (id) => {
    setComboItems(
      comboItems.map((item) => {
        if (item._id === id) {
          return { ...item, selected: false };
        }
        return item;
      }),
    );
  };

  // Handle removing individual bottle
  const handleRemoveBottle = (id) => {
    setBottleItems(
      bottleItems.map((item) => {
        if (item._id === id) {
          return { ...item, quantity: 0, selected: false };
        }
        return item;
      }),
    );
  };

  return (
    <div className="min-h-screen mb-[65px] md:mt-0 bg-gray-50">
      <ScrollToTop />
      <ReservationHeader title="Reservation Details" index={2} />
      <div className="md:hidden flex items-center gap-3 px-4 py-3 ">
        <button
          onClick={() => {
            next === true ? showNext(false) : setPage(0);
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2317_1082)">
              <path
                d="M3.03 9.41084C2.87377 9.56711 2.78601 9.77903 2.78601 10C2.78601 10.221 2.87377 10.4329 3.03 10.5892L7.74417 15.3033C7.90133 15.4551 8.11184 15.5391 8.33033 15.5372C8.54883 15.5353 8.75784 15.4477 8.91235 15.2932C9.06685 15.1387 9.1545 14.9297 9.15639 14.7112C9.15829 14.4927 9.0743 14.2822 8.9225 14.125L5.63083 10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56703 17.2559 9.41075C17.0996 9.25447 16.8877 9.16667 16.6667 9.16667H5.63083L8.9225 5.875C9.0743 5.71783 9.15829 5.50733 9.15639 5.28883C9.1545 5.07034 9.06685 4.86133 8.91235 4.70682C8.75784 4.55231 8.54883 4.46467 8.33033 4.46277C8.11184 4.46087 7.90133 4.54487 7.74417 4.69667L3.03 9.41084Z"
                fill="#111827"
              />
            </g>
            <defs>
              <clipPath id="clip0_2317_1082">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        Reservation Details
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 md:py-15 space-y-6">
        {/* Show vendor info on desktop always, on mobile only when showing booking details (first screen) */}
        {(!isMobile || showBookingDetails) && (
          <div className="max-w-[500px]">
            <div className="flex gap-4">
              <div className="relative size-[64px] md:w-32 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={vendor?.profileImages[0] || "/hero-bg.png"}
                  alt="Restaurant interior"
                  className="object-cover size-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-sm md:text-xl font-semibold mb-2">
                  {vendor?.businessName || "Restaurant Name"}
                </h2>
                <div className="flex items-start gap-1 text-gray-600 mb-2">
                  <div>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-[12px] md:text-sm truncate w-[210px] sm:w-full">
                    {vendor?.address || "123 Main St, City, Country"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#F0AE02] text-[#F0AE02]" />
                  <span className="text-[12px] md:text-sm font-medium">
                    {vendor?.rating || "5.8"} (
                    {vendor?.reviews.toLocaleString() || "1,000"} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {showBookingDetails && (
            <div className="space-y-6 md:col-span-4">
              <ScrollToTop />
              <div className="rounded-2xl bg-white border">
                <div className=" divide-y">
                  <div className="flex p-4">
                    <h3 className="text-lg font-semibold">
                      Reservation Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                    <DatePicker
                      title="Date"
                      edit
                      value={date}
                      onChange={setDate}
                    />
                    <TimePicker
                      title="Time"
                      edit
                      value={time}
                      onChange={setTime}
                      slot={[
                        "09:00 PM",
                        "09:30 PM",
                        "10:00 PM",
                        "10:30 PM",
                        "11:00 PM",
                        "11:30 PM",
                        "12:00 AM",
                        "12:30 AM",
                        "01:00 AM",
                        "01:30 AM",
                        "02:00 AM",
                        "02:30 AM",
                        "03:00 AM",
                      ]}
                    />
                    <TablePicker
                      edit
                      loading={loading}
                      tables={table}
                      value={getSelectedTablesText()}
                      onChange={(value) => handleTable(value)}
                    />
                    <GuestPicker
                      hideChildren
                      hideInfants
                      value={guestCount}
                      onChange={setGuestCount}
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white border">
                <div className=" divide-y">
                  <div className="flex p-4 text-black justify-between">
                    <h3 className="text-lg font-semibold">Add Ons</h3>
                    <button
                      onClick={() => setPage(0)}
                      className="flex gap-2 font-medium text-[#0A6C6D]"
                    >
                      <Plus /> Add more
                    </button>
                  </div>
                  <div className="space-y-4 p-4">
                    {/* Combos Section */}
                    {comboItems.filter((item) => item.selected).length > 0 && (
                      <div className="space-y-4 px-2 py-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
                        <div className="flex justify-between items-start">
                          <p className="text-sm">Combo Service</p>
                          <button
                            onClick={() =>
                              comboItems
                                .filter((i) => i.selected)
                                .forEach((i) => handleRemoveCombo(i._id))
                            }
                          >
                            <X className="text-[#606368] shrink-0" size={20} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end gap-3">
                          <div className="grid md:flex line-clamp-1 grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
                            {comboItems
                              .filter((item) => item.selected)
                              .slice(0, 4)
                              .map((item) => (
                                <span
                                  key={item._id}
                                  className="text-xs text-[#111827] truncate"
                                >
                                  {item.quantity > 1 && (
                                    <span className="font-medium">
                                      {item.quantity}x{" "}
                                    </span>
                                  )}
                                  {item.name}
                                </span>
                              ))}
                          </div>
                          <p className="text-sm font-medium text-[#111827] whitespace-nowrap">
                            ₦
                            {comboItems
                              .filter((i) => i.selected)
                              .reduce((sum, i) => sum + (i.setPrice || 0), 0)
                              .toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tables Section */}
                    {table.filter((item) => item.selected).length > 0 && (
                      <div className="space-y-4 px-2 py-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
                        <div className="flex justify-between items-start">
                          <p className="text-sm">Table Service</p>
                          <button
                            onClick={() =>
                              table
                                .filter((i) => i.selected)
                                .forEach((i) => handleRemoveTable(i._id))
                            }
                          >
                            <X className="text-[#606368] shrink-0" size={20} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end gap-3">
                          <div className="grid md:flex line-clamp-1 grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
                            {table
                              .filter((item) => item.selected)
                              .slice(0, 4)
                              .map((item) => (
                                <span
                                  key={item._id}
                                  className="text-xs text-[#111827] truncate"
                                >
                                  {item.quantity > 1 && (
                                    <span className="font-medium">
                                      {item.quantity}x{" "}
                                    </span>
                                  )}
                                  {item.name}
                                </span>
                              ))}
                          </div>
                          <p className="text-sm font-medium text-[#111827] whitespace-nowrap">
                            ₦
                            {table
                              .filter((i) => i.selected)
                              .reduce(
                                (sum, i) =>
                                  sum + (i.price || 0) * (i.quantity || 1),
                                0,
                              )
                              .toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bottles Section */}
                    {bottleItems.filter((item) => item.quantity > 0).length >
                      0 && (
                      <div className="space-y-4 px-2 py-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
                        <div className="flex justify-between items-start">
                          <p className="text-sm">Bottles</p>
                          <button
                            onClick={() =>
                              bottleItems
                                .filter((i) => i.quantity > 0)
                                .forEach((i) => handleRemoveBottle(i._id))
                            }
                          >
                            <X className="text-[#606368] shrink-0" size={20} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end gap-3">
                          <div className="grid md:flex line-clamp-1 grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
                            {bottleItems
                              .filter((item) => item.quantity > 0)
                              .slice(0, 4)
                              .map((item) => (
                                <span
                                  key={item._id}
                                  className="text-xs text-[#111827] truncate"
                                >
                                  {item.quantity > 1 && (
                                    <span className="font-medium">
                                      {item.quantity}x{" "}
                                    </span>
                                  )}
                                  {item.name}
                                </span>
                              ))}
                          </div>
                          <p className="text-sm font-medium text-[#111827] whitespace-nowrap">
                            ₦
                            {bottleItems
                              .filter((i) => i.quantity > 0)
                              .reduce(
                                (sum, i) =>
                                  sum + (i.price || 0) * (i.quantity || 0),
                                0,
                              )
                              .toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {comboItems.filter((item) => item.selected).length === 0 &&
                      table.filter((item) => item.selected).length === 0 &&
                      bottleItems.filter((item) => item.quantity > 0).length ===
                        0 &&
                      vipExtraItems.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No items selected yet. Click "Add more" to add items
                          to your reservation.
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-6">
                <div className="relative">
                  <Label
                    htmlFor="special-request"
                    className="text-sm font-medium mb-2 block"
                  >
                    Special Request (Optional)
                  </Label>
                  <Textarea
                    id="special-request"
                    placeholder="Let us know if you have any special request"
                    value={specialRequest}
                    maxLength={500}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="min-h-[100px] bg-white border text-sm border-[#E5E7EB] resize-none rounded-xl"
                  />
                  <p className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {specialRequest.length}/500
                  </p>
                </div>
              </div>
            </div>
          )}
          {showPaymentStep && (
            <div className="md:col-span-3 space-y-6">
              <ScrollToTop />
              <div className="mb-6 md:hidden space-y-6">
                <div className="relative">
                  <Label
                    htmlFor="special-request"
                    className="text-sm font-medium mb-2 block"
                  >
                    Special Request (Optional)
                  </Label>
                  <Textarea
                    id="special-request"
                    placeholder="Let us know if you have any special request"
                    value={specialRequest}
                    maxLength={500}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="min-h-[100px] bg-[#FFFFFF] border text-sm border-[#E5E7EB] resize-none rounded-xl"
                  />
                  <p className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {specialRequest.length}/500
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border">
                <div className=" divide-y">
                  <div className="flex p-4">
                    <h3 className="text-lg font-semibold">
                      Choose Payment Plan
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="cursor-pointer">
                      <div className="divide-y">
                        <div
                          className={`flex p-4 rounded-t-2xl bg-[#F9FAFB] border gap-2 justify-between items-center ${!partPay ? "border-teal-700" : ""}`}
                          onClick={() => setPartPay(false)}
                        >
                          <h3 className="text-sm font-semibold">
                            Pay ₦{calculatedTotals.grandTotal.toLocaleString()}{" "}
                            now
                          </h3>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            className="shrink-0"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                              stroke="#0A6C6D"
                            />
                            {!partPay && (
                              <circle cx="10" cy="10" r="6" fill="#0A6C6D" />
                            )}
                          </svg>
                        </div>
                        <div
                          className={`flex p-4 rounded-b-2xl bg-[#F9FAFB] border gap-2 justify-between items-center ${partPay ? "border-teal-700" : ""}`}
                          onClick={() => setPartPay(true)}
                        >
                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold">
                              Pay part now, rest later
                            </h3>
                            <p className="text-xs">
                              Pay ₦
                              {Math.round(
                                calculatedTotals.grandTotal / 2,
                              ).toLocaleString()}{" "}
                              now, and ₦
                              {Math.round(
                                calculatedTotals.grandTotal / 2,
                              ).toLocaleString()}{" "}
                              on{" "}
                              {date
                                ? format(date, "do MMM, yyyy")
                                : "the day of your arrival"}
                              . No extra fees
                            </p>
                          </div>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            className="shrink-0"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="19"
                              height="19"
                              rx="9.5"
                              stroke="#0A6C6D"
                            />
                            {partPay && (
                              <circle cx="10" cy="10" r="6" fill="#0A6C6D" />
                            )}
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white border p-4">
                <h3 className="text-lg font-semibold mb-2">Your Total</h3>
                <div className="divide-y">
                  <div className="pb-3 space-y-2 text-sm">
                    <p className="text-[#111827]">Price Details</p>

                    {/* Tables */}
                    {table.filter((item) => item.selected).length > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-[#606368]">Tables</p>
                        <p className="text-[#111827] font-medium">
                          ₦{calculatedTotals.tablesTotal.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Combos */}
                    {comboItems.filter((item) => item.selected).length > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-[#606368]">Premium Combos</p>
                        <p className="text-[#111827] font-medium">
                          ₦{calculatedTotals.combosTotal.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Bottles */}
                    {bottleItems.filter((item) => item.quantity > 0).length >
                      0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-[#606368]">Premium Bottles</p>
                        <p className="text-[#111827] font-medium">
                          ₦{calculatedTotals.bottlesTotal.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* VIP Extras */}
                    {vipExtraItems.length > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-[#606368]">VIP Extras</p>
                        <p className="text-[#111827] font-medium">
                          ₦{calculatedTotals.vipTotal.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-lg text-[#111827] pt-3">
                    <p className="font-semibold">Sub Total</p>
                    <p className="font-semibold text-[#111827]">
                      ₦
                      {partPay
                        ? Math.round(
                            calculatedTotals.grandTotal / 2,
                          ).toLocaleString()
                        : calculatedTotals.grandTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
        <div
          className={`
            ${
              next === false
                ? "flex flex-col sm:flex-row justify-end sm:justify-between gap-2 items-end"
                : "flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto "
            } sm:justify-between p-4`}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="md:flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2 hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Club Page
          </Button>
          <Button
            className={
              next === false
                ? "bg-[#0A6C6D] hover:bg-[#0A6C6D]/90 px-8 h-10 py-6 w-33 sm:w-full md:max-w-xs rounded-xl cursor-pointer"
                : "bg-[#0A6C6D] hover:bg-[#0A6C6D]/90 px-8 h-10 py-6 w-full md:max-w-xs rounded-xl cursor-pointer"
            }
            onClick={handleContinue}
            disabled={!date || !guestCount || !time || isLoading}
          >
            {isMobile && next === false
              ? "Next"
              : isLoading
                ? "Processing..."
                : "Continue to Payment"}
          </Button>
        </div>
      </div>
      {popupOpen && (
        <PaymentPage booking={booking} setPopupOpen={setPopupOpen} />
      )}
    </div>
  );
}

//WISDOM KINDLY FIX UP THE PAYMENT TOTAL FOR THIS..
