"use client";
import React, { useState } from "react";
import ClubInfos from "./ClubInfos";
import RestaurantReviews from "../restaurant/RestaurantReview";

const ClubInfo = ({ data }) => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    {
      name: "Club info",
      tab: "info",
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
            ageLimit={data?.ageLimit ?? ""}
          />
        )}
        {activeTab === "reviews" && <RestaurantReviews restaurantId={data._id} ratings={data.rating} />}
      </div>
    </div>
  );
};

export default ClubInfo;
