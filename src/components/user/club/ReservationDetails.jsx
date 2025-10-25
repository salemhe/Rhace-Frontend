import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/contexts/club/ReservationContext";
import ReservationHeader from "./ReservationHeader";
import { TimePicker } from "../ui/timepicker";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";
import { TablePicker } from "../ui/tablepicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { Bottles, ClubsData, Combos, VIP } from "@/lib/api";
import { userService } from "@/services/user.service";
import { clubService } from "@/services/club.service";

export default function ReservationDetails({
  id,
  searchQuery,
}) {
  const {
    comboItems,
    setComboItems,
    bottleItems,
    setBottleItems,
    vipExtraItems,
    setVipExtraItems,
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
    setVendor,
    vendor,
    setProposedPayment,
    totalPrice,
  } = useReservations();
  const [loading, setLoading] = useState(true);
  const [comboLoading, setComboLoading] = useState(true);
  const [bottlesLoading, setBottlesLoading] = useState(true);
  const [vipsLoading, setVIPSLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(8);
  const [activeTab, setActiveTab] = useState("All Bottles");
  const navigate = useNavigate();

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await userService.getVendor("club", id);
      setVendor(res.data[0]);
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCombos = async () => {
    try {
      setComboLoading(true);
      const res = await clubService.getBottleSet(id);
      console.log(res)
      setComboItems(res.bottleSets.map((item) => {
        return { ...item, quantity: 0 }
      }));
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setComboLoading(false);
    }
  };
  const fetchBottles = async () => {
    try {
      setBottlesLoading(true);
      const res = await clubService.getDrinks(id);
      console.log(res)
      setBottleItems(res.drinks.map((item) => {
        return { ...item, quantity: 0 }
      }));
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setBottlesLoading(false);
    }
  };
  const fetchVIPS = async () => {
    try {
      setVIPSLoading(true);
      // setVipExtraItems(VIP);
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setVIPSLoading(false);
    }
  };
  const LOAD_MORE_STEP = 4;

  const filteredBottles =
    activeTab === "All Bottles"
      ? bottleItems
      : bottleItems?.filter((item) => item.category === activeTab);

  const displayedItems = filteredBottles?.slice(0, itemsToShow);

  const hasMore = (filteredBottles ? filteredBottles.length : 0) > itemsToShow;

  const handleShowMore = () => {
    setItemsToShow((prev) =>
      Math.min(
        prev + LOAD_MORE_STEP,
        filteredBottles ? filteredBottles.length : 0
      )
    );
  };

  useEffect(() => {
    fetchVendor();
    fetchCombos();
    fetchBottles();
    fetchVIPS();
    setDate(new Date(searchQuery.date));
    setTime(searchQuery.time);
    setTable(searchQuery.table);
    setGuestCount(searchQuery.guests);
  }, []);

  const handleContinue = () => {
    if (!date || !guestCount || !time || !table) {
      toast.error("Fill the required field");
      return;
    }
    setProposedPayment(totalPrice)
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleQuantityChange = (id, change) => {
    setBottleItems(
      bottleItems.map((item) => {
        if (item._id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity, selected: newQuantity > 0 ? true : false };
        }
        return item;
      })
    );
  };

  const handleSelectionChange = (id) => {
    setComboItems(
      comboItems.map((item) => {
        if (item._id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  };

  const handleSelectionVIPChange = (id) => {
    setVipExtraItems(
      vipExtraItems.map((item) => {
        if (item._id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen mb-[65px] mt-[20px] md:mt-0 bg-gray-50">
      <ReservationHeader title="Reservation Details" index={1} />
      <div className="md:hidden flex items-center gap-3 px-4 py-3 ">
        <button onClick={() => navigate(`/clubs/${id}`)}>
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

      <div className="max-w-5xl mx-auto  px-4 py-5 md:py-15 space-y-6">
        <div className="max-w-[500px]">
          <div className="flex gap-4">
            <div className="relative size-[64px] md:w-32 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={vendor?.profileImages?.[0] || "/hero-bg.png"}
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
                  {vendor?.rating || "4.8"} (
                  {vendor?.reviews.toLocaleString() || "1,000"} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border">
          <div className=" divide-y">
            <div className="flex p-4">
              <h3 className="text-lg font-semibold">Reservation Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <DatePicker value={date} onChange={setDate} />
              <TimePicker value={time} onChange={setTime} />
              <TablePicker value={table} onChange={setTable} />
              <GuestPicker value={guestCount} onChange={setGuestCount} />
            </div>
          </div>
        </div>
        <div className="mb-6 space-y-6">
          <div className="mb-6 hidden md:block">
            <h3 className="text-lg font-semibold mb-2">
              Let&apos;s Plan For Your Arrival
            </h3>
            <p className="text-sm text-gray-600">
              Would you like to add any extras to enhance your night?
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-xs md:text-sm text-[#111827]">
                Premium Combos
              </h3>
              <div className="flex gap-6">
                <button
                  disabled
                  className="text-white rounded-full disabled:text-[#606368] bg-[#0A6C6D] disabled:bg-[#E5E7EB] flex items-center justify-center size-[32px]"
                >
                  <ChevronLeft />
                </button>
                <button className="text-white rounded-full disabled:text-[#606368] bg-[#0A6C6D] disabled:bg-[#E5E7EB] flex items-center justify-center size-[32px]">
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="flex overflow-hidden w-full">
              <div className="flex w-max">
                {comboLoading ? (
                  <div>ComboLoader</div>
                ) : comboItems.length === 0 ? (
                  <div>No available Combos</div>
                ) : (
                  comboItems.map((item, i) => (
                    <div
                      key={i}
                      className={`${item.selected
                        ? "bg-[#E7F0F0] border rounded-2xl border-[#B3D1D2]"
                        : "bg-transparent"
                        } p-1 w-[254px]`}
                    >
                      <div className="p-2 w-full space-y-3 rounded-2xl bg-white border border-[#E5E7EB]">
                        <div className="relative w-full overflow-hidden rounded-2xl">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover size-full"
                          />
                          {item.specials && (
                            <div className="absolute bg-[#E5E7EB] rounded-full top-2 left-2 px-3 text-xs font-medium text-[#111827] py-1">
                              {item.specials}
                            </div>
                          )}
                        </div>
                        <div className="px-3 space-y-3">
                          <p className="text-[#111827] text-sm">{item.name}</p>
                          <div className="space-y-2">
                            {item.addOns.slice(0, 4).map((offer, i) => (
                              <div key={i} className="flex items-center gap-2 ">
                                <Check className="text-[#0A6C6D]" />
                                <span className="text-sm text-[#111827]">
                                  {offer}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <p className="text-sm text-[#111827]">
                              #{item.setPrice.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${item.selected
                                  ? "bg-teal-600 border-teal-600 text-white"
                                  : "border-gray-300"
                                  }`}
                                onClick={() => handleSelectionChange(item._id)}
                              >
                                {item.selected && <Check className="h-3 w-3" />}
                              </div>
                              <span className="text-xs text-[#111827]">Add</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm text-[#111827]">Premium Bottles</h3>
              <div className="w-full overflow-auto">
                <div className="flex items-center">
                  {[
                    "All Bottles",
                    "Champagne",
                    "Vodka",
                    "Whiskey",
                    "Cognac",
                    "Tequilla",
                    "Drink Mixers",
                  ].map((item, i) => (
                    <div
                      onClick={() => setActiveTab(item)}
                      className={`${activeTab === item
                        ? "text-white bg-green rounded-full "
                        : "text-[#606368]"
                        } text-sm px-4 py-2`}
                      key={i}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            {bottlesLoading ? (
              <div>bottleLoader</div>
            ) : bottleItems.length === 0 ? (
              <div>No available Bottles</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {displayedItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-2 space-y-3 bg-white rounded-2xl border border-[#E5E7EB]"
                    >
                      <div className="relative w-full h-48 overflow-hidden rounded-2xl">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="object-cover size-full"
                        />
                        {item.specials && (
                          <div className="absolute top-2 left-2 rounded-full px-3 text-xs bg-[#E5E7EB] text-[#111827] py-1">
                            {item.specials}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 md:px-3">
                        <div className="border text-[#606368] bg-[#FDEFDC] w-max border-[#FFE0B5] text-xs py-1.5 px-2 rounded-md">
                          {item.category}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-[#111827]">
                            {item.name}
                          </h4>
                          <p className="text-sm text-[#606368]">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p>#{item.price.toLocaleString()}</p>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleQuantityChange(item._id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleQuantityChange(item._id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-8 w-full text-center">
                    <button
                      onClick={handleShowMore}
                      className="text-[#0A6C6D] hover:underline text-sm cursor-pointer flex items-center gap-2"
                    >
                      Show more{" "}
                      <ChevronDown
                        className="
                            h-4 w-4"
                      />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm text-[#111827]">VIP Extras</h3>
            <div className="flex flex-col md:flex-row gap-4 w-full md:gap-6">
              {vipsLoading ? (
                <div>ComboLoader</div>
              ) : vipExtraItems.length === 0 ? (
                <div>No available Combos</div>
              ) : (
                vipExtraItems.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectionVIPChange(item._id)}
                    className="flex items-center flex-1 px-3 py-3.5 gap-2 justify-between bg-white rounded-2xl border"
                  >
                    <div className="flex gap-2 items-start">
                      <div
                        className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer ${item.selected
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "border-gray-300"
                          }`}
                        onClick={() => handleSelectionChange(item._id)}
                      >
                        {item.selected && <Check className="h-4 w-4" />}
                      </div>
                      <div className="flex items-center">
                        <div className="">
                          <p className="text-[#111827] text-sm">{item.title}</p>
                          <p className="text-[#606368] text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>

                      ₦{item.price}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="relative">
            <Label
              htmlFor="special-request"
              className="text-sm font-medium mb-2 block"
            >
              Special Request (Optional)
            </Label>
            <Textarea
              id="special-request"
              placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
              value={specialRequest}
              maxLength={500}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="min-h-[100px] bg-[#F9FAFB] border text-sm border-[#E5E7EB] resize-none rounded-xl"
            />
            <p className="absolute bottom-2 right-2 text-xs text-gray-400">
              {specialRequest.length}/500
            </p>
          </div>
        </div>
      </div>
      <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto p-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="md:flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2 hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Club Page
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 px-8 w-full max-w-xs rounded-xl cursor-pointer"
            onClick={handleContinue}
            disabled={!date || !guestCount || !time || !table}
          >
            Complete Reservations
          </Button>
        </div>
      </div>
    </div>
  );
}
