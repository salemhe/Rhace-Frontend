// "use client"
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";
// import { RoomsData } from '@/lib/api';
import { hotelService } from "@/services/hotel.service";
import UniversalLoader from "../ui/LogoLoader";
import { toast } from "react-toastify";
import { HiPercentBadge } from "react-icons/hi2";
import { MdCheckBox } from "react-icons/md";
import { capitalize } from "@/utils/helper";
import {
  Breakfast,
  Car,
  City,
  FoodIcon,
  PeopleIcon,
  TwinBed,
  UsersIcon,
} from "@/public/icons/icons";
import { FaWifi } from "react-icons/fa6";

const Rooms = ({ id, setSelectedRoom, setShow }) => {
  const tabs = [
    { title: "Superior Standard Room", value: "Standard" },
    { title: "Superior Deluxe Room", value: "Deluxe" },
    { title: "Superior Executive Room", value: "Executive" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [expandedAmenities, setExpandedAmenities] = useState({});

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

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const toggleAmenities = (roomId, e) => {
    e.stopPropagation();
    setExpandedAmenities((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const getDisplayedAmenities = (room) => {
    const amenitiesList = [];

    if (room.amenities.includes("Wi-Fi")) {
      amenitiesList.push({
        icon: <FaWifi className="w-4 items-center h-4 text-[#606368] mr-2" />,
        text: "Free WiFi",
      });
    }

    amenitiesList.push({
      icon: (
        <span className="w-3 h-3 mr-3">
          <PeopleIcon />
        </span>
      ),
      text: `${room.adultsCapacity} Adults`,
    });

    amenitiesList.push({
      icon: (
        <span className="w-3 h-3 mr-3">
          <TwinBed />
        </span>
      ),
      text: room.amenities.bedType || "1 Twin Bed",
    });

    if (room.amenities.includes("Free Breakfast")) {
      amenitiesList.push({
        icon: <Breakfast className="w-3 h-3 mr-4" />,
        text: "Free Breakfast",
      });
    }

    if (room.amenities.includes("Free Parking")) {
      amenitiesList.push({
        icon: <Car className="w-3 h-3 mr-8" />,
        text: "Free Parking",
      });
    }

    if (room.amenities.includes("City View")) {
      amenitiesList.push({
        icon: <City className="w-3 h-3 mr-6" />,
        text: "City View",
      });
    }

    return amenitiesList;
  };

  useEffect(() => {
    setFilteredRooms(rooms.filter((r) => r.category === activeTab.value));
  }, [activeTab, rooms]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await hotelService.getRoomTypes(id);
        setRooms(res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleReserve = (room) => {
    setSelectedRoom({
      ...room,
      pricePerNight:
        room.pricePerNight - room.pricePerNight * (room.discount / 100),
    });
    toast.success(`Successfully selected ${room.name} room.`);
    if (window.innerWidth >= 768)
      window.scrollTo({ top: 0, behavior: "smooth" });
    setShow(true);
  };

  if (isLoading) return <UniversalLoader type="cards" />;

  return (
    <div className="min-h-screen py-">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 ">
          <h1 className="font-semibold mb-2 sm:text-lg text-sm">
            Select Room Type
          </h1>

          {/* Tabs */}
          <div className="flex space-x-1 bg-whit hide-scrollbar overflow-auto w-full rounded-lg py-1 ">
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
          {filteredRooms &&
            filteredRooms.map((room) => (
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

                  {/* Image Navigation */}
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
                  {/* Room Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {capitalize(room.name)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#606368]  mb-4">
                    {capitalize(room.description)}
                  </p>

                  {/* Amenities */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
                    {getDisplayedAmenities(room)
                      .slice(0, expandedAmenities[room._id] ? undefined : 3)
                      .map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          {amenity.icon}
                          <span className="font-normal text-xs sm:text-sm">
                            {amenity.text}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Show more amenities link */}
                  {getDisplayedAmenities(room).length > 3 && (
                    <button
                      onClick={(e) => toggleAmenities(room._id, e)}
                      className="font-normal items-center flex sm:font-medium text-xs sm:text-sm mb-4"
                    >
                      <span className="text-[#0A6C6D] underline">
                        {expandedAmenities[room._id]
                          ? "Show less amenities"
                          : "Show more amenities"}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-[#606368] transition-transform ${
                          expandedAmenities[room._id] ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )}

                  {/* Discount and Availability */}
                  <div className="flex items-center w-full justify-between mb-4">
                    <div className="flex items-center justify-between w-full space-x-2">
                      <span className="border-[#E0B300] border flex justify-center gap-2 items-center text-[#111827] text-xs px-2 py-1 rounded-lg">
                        <HiPercentBadge className="text-[#E0B300]" />
                        <span>{room.discount}% Discount</span>
                      </span>
                      <div className="flex items-center gap-1.5 text-teal-600 text-xs">
                        {/* <div className="w-2 h-2 bg-teal-600 rounded-full mr-1"></div> */}
                        <MdCheckBox className="text-teal-600 w-5 h-5" />
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-semibold   sm:font-bold text-gray-900">
                        Price:{" "}
                        <span className="underline">
                          {formatPrice(
                            room.pricePerNight -
                              room.pricePerNight * (room.discount / 100),
                          )}
                        </span>
                      </span>
                      {room.discount > 0 && (
                        <span className="text-lg font-semibold   sm:font-bold  text-[#606368] line-through ml-2">
                          {formatPrice(room.pricePerNight)}
                        </span>
                      )}
                      <span className="text-xs text-[#606368] ml-1">
                        /night
                      </span>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReserve(room);
                    }}
                    className="w-full bg-[#0A6C6D] hover:bg-teal-800 text-white font-medium py-2 px-4 rounded-[12px] mb-2"
                  >
                    Reserve Room
                  </button>

                  {/* No Charge Note */}
                  <p className="text-xs text-gray-500 text-center">
                    You won&apos;t be charged yet
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
