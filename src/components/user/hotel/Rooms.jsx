import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalLoader from "../ui/LogoLoader";
import { toast } from "react-toastify";
import { HiPercentBadge } from "react-icons/hi2";
import { capitalize } from "@/utils/helper";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";
import {
  BedFill,
  Building1,
  Car2,
  CheckMark,
  Group3,
  Wifi,
  DishCoverFill,
} from "@/public/icons/icons";

const AMENITY_LIMIT = 5;

const Rooms = ({ setSelectedRooms, setShow, rooms }) => {
  const tabs = [
    { title: "Superior Standard Room", value: "Standard" },
    { title: "Superior Deluxe Room", value: "Deluxe" },
    { title: "Superior Executive Room", value: "Executive" },
    { title: "Superior Presidential Room", value: "Presidential" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [expandedAmenities, setExpandedAmenities] = useState({});
  
  // Track quantity per room
  const [quantities, setQuantities] = useState({});
  
  // Track dates and guests per room
  const [roomDetails, setRoomDetails] = useState({});

  // Initialize selected rooms from localStorage
  const [selectedRooms, setSelectedRoomsLocal] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedRooms');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Get default dates
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { checkInDate: today, checkOutDate: tomorrow };
  };

  // Sync local state to parent and localStorage
  const syncToParent = (roomsData) => {
    setSelectedRoomsLocal(roomsData);
    setSelectedRooms(roomsData);
    localStorage.setItem('selectedRooms', JSON.stringify(roomsData));
  };

  const filteredRooms = rooms.filter((r) => r.category === activeTab.value);

  // Handle quantity change for a room
  const handleQuantityChange = (roomId, delta) => {
    setQuantities(prev => {
      const current = prev[roomId] || 0;
      const room = rooms.find(r => r._id === roomId);
      const maxUnits = room?.totalUnits || 0;
      const newQty = Math.max(0, Math.min(current + delta, maxUnits));
      return { ...prev, [roomId]: newQty };
    });
  };

  // Handle date change for a specific room
  const handleDateChange = (roomId, field, value) => {
    setRoomDetails(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value
      }
    }));
  };

  // Handle guests change for a specific room
  const handleGuestsChange = (roomId, value) => {
    setRoomDetails(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        guests: value
      }
    }));
  };

  // Calculate nights for a room
  const calculateNights = (roomId) => {
    const details = roomDetails[roomId] || getDefaultDates();
    const { checkInDate, checkOutDate } = details;
    if (!checkInDate || !checkOutDate) return 1;
    
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / msPerDay));
  };

  // Add room to selection with quantity, dates, and guests
  const addToSelection = (room) => {
    const qty = quantities[room._id] || 1;
    if (qty < 1) {
      toast.error("Please select at least 1 room");
      return;
    }

    const details = roomDetails[room._id] || getDefaultDates();
    const nights = calculateNights(room._id);
    
    if (nights < 1) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const roomData = {
      ...room,
      quantity: qty,
      checkInDate: details.checkInDate,
      checkOutDate: details.checkOutDate,
      guests: details.guests || 1,
      nights
    };

    const existingIndex = selectedRooms.findIndex(r => r._id === room._id);
    let newSelection;
    
    if (existingIndex >= 0) {
      // Update quantity if already selected
      newSelection = [...selectedRooms];
      newSelection[existingIndex] = roomData;
    } else {
      // Add new room
      newSelection = [...selectedRooms, roomData];
    }
    
    syncToParent(newSelection);
    
    toast.success(`${qty} ${room.name} added to selection.`);
    
    if (window.innerWidth >= 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setShow(true);
  };

  // Remove room from selection
  const removeFromSelection = (roomId) => {
    const newSelection = selectedRooms.filter(r => r._id !== roomId);
    syncToParent(newSelection);
    toast.info("Room removed from selection.");
  };

  // Calculate total price for selected rooms
  const calculateTotal = () => {
    return selectedRooms.reduce((total, room) => {
      const discountedPrice = room.pricePerNight - (room.pricePerNight * (room.discount / 100));
      const nights = room.nights || calculateNights(room._id);
      return total + (discountedPrice * (room.quantity || 1) * nights);
    }, 0);
  };

  // Get total number of rooms selected
  const getTotalRooms = () => {
    return selectedRooms.reduce((total, room) => total + (room.quantity || 1), 0);
  };

  // Get total nights (using the most common or max)
  const getTotalNights = () => {
    if (selectedRooms.length === 0) return 1;
    const nightsSet = new Set(selectedRooms.map(r => r.nights || 1));
    return Math.max(...nightsSet);
  };

  const nextImage = (roomId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (roomId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const formatPrice = (price) => `₦${price.toLocaleString()}`;

  const toggleAmenities = (roomId, e) => {
    e.stopPropagation();
    setExpandedAmenities((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  /**
   * Builds the full amenities list for a room.
   */
  const getAmenitiesList = (room) => {
    const list = [];

    if (room.amenities.includes("Wi-Fi")) {
      list.push(
        <div key="wifi" className="flex items-center">
          <Wifi className="size-5 mr-1" />
          <span>Free WiFi</span>
        </div>
      );
    }

    list.push(
      <div key="adults" className="flex items-center">
        <Group3 className="size-5 mr-1" />
        <span>{room.adultsCapacity} Adults</span>
      </div>
    );

    list.push(
      <div key="bed" className="flex items-center">
        <BedFill className="size-5 mr-1" />
        <span>{room.amenities.bedType || "1 Twin Bed"}</span>
      </div>
    );

    if (room.amenities.includes("Free Breakfast")) {
      list.push(
        <div key="breakfast" className="flex items-center">
          <DishCoverFill className="size-5 mr-1" />
          <span>Free Breakfast</span>
        </div>
      );
    }

    if (room.amenities.includes("Free Parking")) {
      list.push(
        <div key="parking" className="flex items-center">
          <Car2 className="size-5 mr-1" />
          <span>Free Parking</span>
        </div>
      );
    }

    if (room.amenities.includes("City View")) {
      list.push(
        <div key="cityview" className="flex items-center">
          <Building1 className="size-5 mr-1" />
          <span>City View</span>
        </div>
      );
    }

    return list;
  };

  if (!rooms) return <UniversalLoader type="room-cards" size={100} />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="font-semibold mb-2 sm:text-lg text-sm">
            Select Room Types
          </h1>
          {/* Tabs */}
          <div className="flex space-x-1 bg-whit hide-scrollbar overflow-auto w-full rounded-lg py-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm text-nowrap font-medium transition-colors ${
                  activeTab.value === tab.value
                    ? "bg-[#E7F0F0] border border-[#0A6C6D] text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              const allAmenities = getAmenitiesList(room);
              const isExpanded = expandedAmenities[room._id];
              const visibleAmenities = isExpanded
                ? allAmenities
                : allAmenities.slice(0, AMENITY_LIMIT);
              const hasMore = allAmenities.length > AMENITY_LIMIT;
              
              const currentDetails = roomDetails[room._id] || getDefaultDates();
              const nights = calculateNights(room._id);
              const discountedPrice = room.pricePerNight - (room.pricePerNight * (room.discount / 100));
              const qty = quantities[room._id] || 0;

              return (
                <div
                  key={room._id}
                  className="bg-whte rounded-[20px] sm:rounded-lg cursor-pointer shadow- overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative h-48 rounded-[20px] sm:rounded-lg bg-gray-200">
                    <img
                      src={room.images[currentImageIndex[room._id] || 0]}
                      alt={room.name}
                      width={384}
                      height={192}
                      className="w-full h-full rounded-[20px] sm:rounded-lg object-cover"
                    />

                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(room._id, room.images.length)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => nextImage(room._id, room.images.length)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="py-2.5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {capitalize(room.name)}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#606368] mb-4">
                      {capitalize(room.description)}
                    </p>

                    {/* Amenities Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-[#111827]">
                      {visibleAmenities}
                    </div>

                    {/* Show more / Show less toggle */}
                    {hasMore && (
                      <button
                        onClick={(e) => toggleAmenities(room._id, e)}
                        className="font-normal items-center flex sm:font-medium text-xs sm:text-sm mb-4"
                      >
                        <span className="text-[#0A6C6D] underline">
                          {isExpanded ? "Show less" : "Show more amenities"}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-[#606368] transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    )}

                    {/* Discount and Availability */}
                    <div className="flex items-center w-full justify-between mb-4">
                      <div className="flex items-center justify-between w-full space-x-2">
                        <span className="border-[#E0B300] border flex justify-center gap-2 items-center text-[#111827] text-xs px-2 py-1 rounded-lg">
                          <HiPercentBadge className="text-[#E0B300] size-5" />
                          <span>{room.discount}% Discount</span>
                        </span>
                        <div className="flex items-center gap-1.5 text-xs">
                          <CheckMark className="w-5 h-5" />
                          <span className="text-[#111827]">
                            {room.totalUnits} rooms left
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Policy */}
                    <p className="text-xs text-gray-600 mb-4">
                      {room.cancellation}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-center justify-between font-semibold mb-4">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold sm:font-bold text-[#111827]">
                          Price:{" "}
                          <span className="border-b border-[#111827]">
                            {formatPrice(discountedPrice)}
                          </span>
                        </span>
                        {room.discount > 0 && (
                          <span className="text-lg font-semibold sm:font-bold text-[#606368] line-through ml-2">
                            {formatPrice(room.pricePerNight)}
                          </span>
                        )}
                        <span className="text-xs text-[#606368] font-normal ml-1">
                          /night
                        </span>
                      </div>
                    </div>

                   
                    {/* Reserve Button */}
                    <button
                      onClick={() => addToSelection(room)}
                      className="w-full bg-[#0A6C6D] hover:bg-teal-800 text-white font-medium py-2 px-4 rounded-[12px] mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      // disabled={room.totalUnits < 1 || (quantities[room._id] || 0) < 1}
                    >
                      Reserve Room
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      You won&apos;t be charged yet
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-gray-500">No rooms for this category</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;

