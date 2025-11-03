"use client";
import React from "react";
import Rooms from "./Rooms";
import RestaurantReviews from "../restaurant/RestaurantReview";
import HotelOverview from "./HotelOverview";
// import HotelAvalableSlot from "./HotelAvailableSlot";
// import HotelOverview from "./HotelOverview";

const HotelInfo = ({
  data,
  setShow,
  activeTab,
  setActiveTab,
  id,
  selectedRoom, setSelectedRoom,
}) => {
  const tabs = [
    {
      name: "Property Details",
      tab: "property_details",
    },
    {
      name: "Rooms",
      tab: "rooms",
    },
    {
      name: "Policies",
      tab: "policies",
    },
    {
      name: "Reviews",
      tab: "reviews",
    },
  ];


  return (
    <div>
      <div className="border-[#E5E7EB] border-b  overflow-auto w-full">
        <div className="w-max flex-nowrap flex">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab.tab)}
              className={`p-3 w-max cursor-pointer font-semibold ${
                activeTab === tab.tab ?
                "border-b-2 text-[#0A6C6D] border-[#0A6C6D]" : "text-[#606368]"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 px-4 md:px-0">
        {activeTab === "property_details" && <HotelOverview desc={data.businessDescription} />}
        {/* {activeTab === "menu" && <HotelMenu id={data._id} />} */}
        {activeTab === "rooms" && <Rooms setShow={setShow} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} id={id} />}
        {activeTab === "reviews" && <RestaurantReviews restaurantId={id} />}
      </div>
    </div>
  );
};

export default HotelInfo;
