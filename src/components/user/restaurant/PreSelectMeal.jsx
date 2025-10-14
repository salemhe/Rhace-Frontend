import { useEffect, useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservationHeader from "./ReservationHeader";
import { useReservations } from "@/contexts/restaurant/ReservationContext";
import { toast } from "sonner";
import { MenusData } from "@/lib/api";
import { useNavigate } from "react-router";
import { menuService } from "@/services/menu.service";
export default function PreSelectMeal({ id }) {
  const {
    activeTab,
    setActiveTab,
    additionalNote,
    setAdditionalNote,
    menuItems,
    setMenuItems,
    vendor,
    time,
    guestCount,
    date,
    handleSubmit,
    isLoading,
  } = useReservations();
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    {
      name: "Starters",
      value: "Starters",
    },
    {
      name: "Main Course",
      value: "Main Dish ",
    },
    {
      name: "Appetizers",
      value: "Appetizer",
    },
    {
      name: "Desserts",
      value: "Dessert",
    },
    {
      name: "Drinks",
      value: "Drinks",
    },
  ];

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const data = await menuService.getMenuItems(id);
      console.log(data)
      setMenuItems(
        data.menuItems.map((item) => ({
          ...item,
          selected: false,
          quantity: 0,
          specialRequest: "",
        }))
      );
      if (data.length === 0) {
        toast.info("No menu items available at the moment.");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);
  const menuFiltered = menuItems.filter((a) => a.category === activeTab);

  // const router = useRouter();
  const handleQuantityChange = (id, change, type) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item._id === id) {
          if (type === "input") {
            const newQuantity = change;
            return { ...item, quantity: newQuantity, selected: newQuantity > 0 ? true : false };
          } else {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity, selected: newQuantity > 0 ? true : false };
          }
        }
        return item;
      })
    );
  };

  const handleSpecialRequestChange = (id, value) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item._id === id) {
          return { ...item, specialRequest: value };
        }
        return item;
      })
    );
  };

  const handleSelectionChange = (id) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item._id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    setVisibleCount(3);
  }, [activeTab]);

  const selectedItems = menuItems.filter((item) => item.selected);

  const calculateSubtotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleClick = () => {
    navigate(`/restaurants/completed/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading menu items...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ReservationHeader title="Pre-Select your Meal" index={2} />
      <div className="bg-gray-100  w-full">
        <div className="max-w-4xl mx-auto rounded-md mb-6 p-4">
          <div className="text-xs md:text-sm text-gray-600 mb-1">
            Reservation Completed
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm">
            <span className="font-medium">
              {vendor?.businessName || "Restaurant Name"}
            </span>
            <span className="flex items-center">
              <span className="md:size-2 size-1 bg-black rounded-full mx-2"></span>
              {date
                ? date
                  .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                  .replace(
                    /^(\d{1,2})/,
                    (d) =>
                      d +
                      (["1", "21", "31"].includes(d)
                        ? "st"
                        : ["2", "22"].includes(d)
                          ? "nd"
                          : ["3", "23"].includes(d)
                            ? "rd"
                            : "th")
                  )
                : "N/A"}
            </span>
            <span className="flex items-center">
              <span className="md:size-2 size-1 bg-black rounded-full mx-2"></span>
              {time
                ? (() => {
                  const [hourStr, minuteStr] = time.split(":");
                  let hour = parseInt(hourStr, 10);
                  const minute = minuteStr || "00";
                  hour = hour % 12 || 12;
                  return `${hour}:${minute}`;
                })()
                : "N/A"}
            </span>
            <span className="flex items-center">
              <span className="md:size-2 size-1 bg-black rounded-full mx-2"></span>
              {guestCount || "N/A"} Guest
              {guestCount && parseInt(guestCount) > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-15 py-2">
        <div className="bg-[#FFFBEB] border border-[#E0B300] rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            <div className="text-[#E0B300]">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-[28px] md:size-[40px]"
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
              <h3 className="font-medium text-xs md:text-md mb-1">
                Want to pre-select your meal?
              </h3>
              <p className="md:text-sm text-xs text-gray-600">
                Pre-selecting your meal helps the restaurant prepare faster and
                ensures your favorite dishes are available. You can always make
                changes later
              </p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6 overflow-auto"
        >
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
            {tabs.map((tab, i) => (
              <TabsTrigger
                key={i}
                value={tab.value}
                className={`px-4 py-2 text-xs md:text-sm rounded-full shadow-none! cursor-pointer ${activeTab === tab.value
                  ? "bg-[#0A6C6D]! text-white!"
                  : "text-[#6B7280] bg-gray-100"
                  }`}
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-4 mb-6">
          {menuFiltered.length > 0
            ? menuFiltered.slice(0, visibleCount).map((item) => (
              <Card
                key={item._id}
                className={`overflow-hidden shadow-none md:shadow-md border-0 md:border bg-transparent md:bg-white rounded-none md:rounded-[20px] p-0 ${item.selected ? "border-[#1E3A8A]" : ""
                  }`}
              >
                <CardContent className="p-0 border-none md:border">
                  <div className={`md:p-2 ${item.selected && "md:bg-[#E9EBF3]"}`}>
                    <div
                      className={`flex flex-col md:items-center md:border md:flex-row md:p-4 bg-transparent md:bg-white rounded-none md:rounded-[16px] md:gap-4 ${item.selected
                        ? "border-[#B9C2DB]"
                        : "border-transparent"
                        }`}
                    >
                      <div className="flex gap-2">
                        <div className={`relative h-24 w-32 sm:h-32 flex-shrink-0 `}>
                          <img
                            src={item.coverImage || "/placeholder.svg"}
                            alt={item.dishName}
                            className={`object-cover rounded-2xl size-full border-3 md:border-0 ${item.selected ? "border-[#1E3A8A]" : "border-transparent"}`}
                          />
                        </div>
                        <div className="md:hidden flex-1 min-w-0">
                          <h3 className="font-medium">{item.dishName}</h3>
                          <p className="text-sm truncate text-gray-600 mt-1">
                            {item.description}
                          </p>
                          <p className="font-medium mt-2">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="hidden md:block">
                            <h3 className="font-medium">{item.dishName}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                            <p className="font-medium mt-2">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-md border hidden md:flex items-center justify-center cursor-pointer ${item.selected
                              ? "bg-[#0A6C6D] border-[#0A6C6D] text-white"
                              : "border-gray-300"
                              }`}
                            onClick={() => handleSelectionChange(item._id)}
                          >
                            {item.selected && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3.33301 9.33301C3.33301 9.33301 4.66634 9.66634 5.66634 11.6663C5.66634 11.6663 9.37221 5.55523 12.6663 4.33301"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex sm:items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-6 md:size-8 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
                              onClick={() =>
                                handleQuantityChange(item._id, -1)
                              }
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-12 text-center">
                              <Input
                                type="number"
                                value={item.quantity}
                                min={0}
                                max={20}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                onWheel={(e) =>
                                  (e.target).blur()
                                }
                                onChange={(e) => {
                                  let value = Number(e.target.value);
                                  if (value < 1) value = 1;
                                  handleQuantityChange(
                                    item._id,
                                    value,
                                    "input"
                                  );
                                }}
                              />
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-6 md:size-8 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
                              onClick={() =>
                                handleQuantityChange(item._id, 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Special request (e.g. no garlic)"
                              value={item.specialRequest}
                              onChange={(e) =>
                                handleSpecialRequestChange(
                                  item._id,
                                  e.target.value
                                )
                              }
                              className="h-8 text-sm bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            : `not found any ${activeTab} items`}
        </div>

        {menuFiltered.length > 3 && menuFiltered.length > visibleCount && (
          <div className="flex justify-center mb-6">
            <Button
              variant="ghost"
              className="text-teal-600 flex items-center gap-1"
              onClick={() =>
                setVisibleCount((prev) => {
                  // Reset visibleCount when tab changes
                  const filteredLength = menuItems.filter(
                    (a) => a.category === activeTab
                  ).length;
                  if (visibleCount >= filteredLength) return prev;
                  return prev + 3;
                })
              }
            >
              Show more{" "}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_268_3498)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.29279 6.29259C6.48031 6.10512 6.73462 5.99981 6.99979 5.99981C7.26495 5.99981 7.51926 6.10512 7.70679 6.29259L11.9998 10.5856L16.2928 6.29259C16.385 6.19708 16.4954 6.1209 16.6174 6.06849C16.7394 6.01608 16.8706 5.9885 17.0034 5.98734C17.1362 5.98619 17.2678 6.01149 17.3907 6.06177C17.5136 6.11205 17.6253 6.18631 17.7192 6.2802C17.8131 6.37409 17.8873 6.48574 17.9376 6.60864C17.9879 6.73154 18.0132 6.86321 18.012 6.99599C18.0109 7.12877 17.9833 7.25999 17.9309 7.382C17.8785 7.504 17.8023 7.61435 17.7068 7.70659L12.7068 12.7066C12.5193 12.8941 12.265 12.9994 11.9998 12.9994C11.7346 12.9994 11.4803 12.8941 11.2928 12.7066L6.29279 7.70659C6.10532 7.51907 6 7.26476 6 6.99959C6 6.73443 6.10532 6.48012 6.29279 6.29259ZM6.29279 12.2926C6.48031 12.1051 6.73462 11.9998 6.99979 11.9998C7.26495 11.9998 7.51926 12.1051 7.70679 12.2926L11.9998 16.5856L16.2928 12.2926C16.4814 12.1104 16.734 12.0096 16.9962 12.0119C17.2584 12.0142 17.5092 12.1194 17.6946 12.3048C17.88 12.4902 17.9852 12.741 17.9875 13.0032C17.9897 13.2654 17.8889 13.518 17.7068 13.7066L12.7068 18.7066C12.5193 18.8941 12.265 18.9994 11.9998 18.9994C11.7346 18.9994 11.4803 18.8941 11.2928 18.7066L6.29279 13.7066C6.10532 13.5191 6 13.2648 6 12.9996C6 12.7344 6.10532 12.4801 6.29279 12.2926Z"
                    fill="#0A6C6D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_268_3498">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Button>
          </div>
        )}

        <Card className="bg-[#E9EBF3] rounded-2xl border-[#E5E7EB] mb-6">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">
              Your Selection ({selectedItems.length} items)
            </h3>

            <div className="space-y-3 mb-4">
              {selectedItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.dishName}
                  </span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-medium border-t border-[#D2D3D7] pt-3">
              <span>Sub Total</span>
              <span>₦{calculateSubtotal().toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:block mb-6">
          <p className="text-sm font-medium mb-2">
            Additional note for the restaurant
          </p>
          <Textarea
            placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            className="min-h-[100px] resize-none rounded-2xl p-4"
          />
        </div>
      </div>
      <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
        <div className="flex justify-between gap-2 items-center max-w-4xl mx-auto p-4">
          <div className="hidden md:flex justify-between items-center w-full">
            <Button
              onClick={handleClick}
              variant="ghost"
              className="text-teal-600"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedItems.length || isLoading}
              className="bg-[#0A6C6D] rounded-xl px-8 w-full max-w-xs hidden md:inline-flex"
            >
              {isLoading ? (
                <span className="flex gap-2">
                  <Loader2 className="animate-spin" /> Confirming
                </span>
              ) : (
                "Confirm Meal Selection"
              )}
            </Button>
          </div>
          <div className="md:hidden w-full flex justify-between items-center gap-2">
            {selectedItems.length > 0 ? (
              <Button onClick={handleSubmit} className="flex items-center justify-between rounded-xl bg-[#0A6C6D] px-8 w-full">
                <span>Checkout ({selectedItems.length} items)</span>
                <span>₦{calculateSubtotal().toLocaleString()}</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleClick}
                  variant="ghost"
                  className="text-teal-600"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedItems.length || isLoading}
                  className="bg-[#0A6C6D] rounded-xl px-8 w-full max-w-[170px] md:hidden"
                >
                  {isLoading ? (
                    <span className="flex gap-2">
                      <Loader2 className="animate-spin" /> Confirming
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
