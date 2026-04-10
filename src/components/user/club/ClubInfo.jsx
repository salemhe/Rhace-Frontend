"use client";
import React, { useState } from "react";
import ClubInfos from "./ClubInfos";
import RestaurantReviews from "../restaurant/RestaurantReview";
import ComingSoonIcon from "@/public/images/coming-soon_icon.png";
import ClubTable from "./ClubTable";
import { useLocation } from "react-router";

const ClubInfo = ({ data }) => {
  const location = useLocation();
  const section = location.hash ? location.hash.substring(1) : "info";
  const [activeTab, setActiveTab] = useState(section);

  const tabs = [
    {
      name: "Info",
      tab: "info",
    },
    {
      name: "Bookings",
      tab: "bookings",
    },
    {
      name: "Reviews",
      tab: "reviews",
    },
    {
      name: "Upcoming events",
      tab: "events",
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
                activeTab === tab.tab
                  ? "border-b-2 text-[#0A6C6D] border-[#0A6C6D]"
                  : "text-[#606368]"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 px-4 md:px-0">
        {activeTab === "info" && (
          <ClubInfos
            address={data.address}
            openingTime={data.openingTime}
            closingTime={data.closingTime}
            dressCode={data.dressCode}
            desc={data.businessDescription}
            ageLimit={data?.agePolicy ?? ""}
          />
        )}
        {activeTab === "bookings" && <ClubTable id={data._id} />}
        {activeTab === "reviews" && (
          <RestaurantReviews restaurantId={data._id} ratings={data.rating} />
        )}
        {activeTab === "events" && (
          <div className="w-full h-[200px]">
            <div className="mx-auto max-w-3xs flex flex-col items-center gap-4">
              <img src={ComingSoonIcon} alt="Coming Soon" className="w-24" />
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700">
                  Coming Soon
                </h2>
                <p className="text-sm text-gray-500">Stay tuned for updates!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubInfo;
