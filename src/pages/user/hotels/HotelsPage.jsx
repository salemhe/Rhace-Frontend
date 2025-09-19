"use client";
import React, { useState } from "react";
import { Hotel, Mail, MapPin, Phone, Star } from "lucide-react";
import HotelInfo from "../../../components/user/hotel/HotelInfo";
import HotelSaveCopy from "@/components/user/ui/SaveCopy";
import Images from "@/components/user/ui/Image";
import Images2 from "@/components/user/ui/Image2";
import Footer from "@/components/user/Footer";
import { useParams } from "react-router";
import { HotelData } from "@/lib/api";
import HotelBookingForm from "@/components/user/hotel/BookingForm";
import MapComponent from "@/components/user/ui/mapComponent";
import HotelBookingPopup from "@/components/user/hotel/BookiingPopup";
import Header from "@/components/user/Header";

const fetchHotel = () => {
    return HotelData.data[0]
}
 const HotelsPage = () => {
  const [activeTab, setActiveTab] = useState("property_details");

  const { id } = useParams();
  const hotel = fetchHotel();

  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <main className="mx-auto md:mt-[85px] mb-[160px] md:mb-[16px] md:py-8 max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="w-full space-y-4 md:space-y-8">
            <div className="col-span-2">
              <div className="w-full space-y-6">
                <div className="flex md:gap-2">
                  <Images
                    images={hotel?.profileImages ?? []}
                    name={hotel.businessName}
                  />
                  <Images2
                    images={hotel?.profileImages ?? []}
                    name={hotel.businessName}
                  />
                  {activeTab === "rooms" && (
                    <div className="hidden md:block">
                    <HotelBookingForm id={id} restaurant={hotel} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-cente w-full gap-4">
                    <div className="flex gap-2 items-center pt-2 md:pt-0 px-4 md:px-0">
                      <h1 className="text-2xl text-[#111827] font-semibold">
                        {hotel.businessName}{" "}
                      </h1>{" "}
                      <span className="px-2 py-0.5 rounded-full border border-[#37703F] bg-[#D1FAE5] text-xs text-[#37703F]">
                        {" "}
                        Opened
                      </span>
                    </div>
                    <HotelSaveCopy id={id} />
                  </div>
                  <div className="md:flex hidden gap-1 items-center text-xs">
                    <Star className="fill-[#F0AE02] text-[#F0AE02] h-4" />{" "}
                    {hotel.rating}{" "}
                    <span className="text-[#6B7280]">
                      ({hotel.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={activeTab === "rooms" ? "w-full" : "col-span-2"}>
              {/* Pass activeTab and setActiveTab to HotelInfo */}
              <HotelInfo
                id={id}
                data={hotel}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
          {/* Hide the right column when activeTab is "rooms" */}

          {activeTab !== "rooms" && (
            <div className="space-y-8 px-4 md:px-0">
              <div className="hidden md:block">

              <HotelBookingForm id={id} restaurant={hotel} />
              </div>

              <div className="rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] p-1">
                <MapComponent address={hotel.address} />
              </div>
              <div className="max-w-sm w-full p-4 rounded-2xl bg-white space-y-4 text-sm text-gray-800">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-black mt-1" />
                    <p>{hotel.address}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Contact Information
                  </h3>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-black mt-1" />
                    <a
                      href={`tel:${hotel.phone}`}
                      className="hover:underline"
                    >
                      {hotel.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="w-5 h-5 text-black mt-1" />
                    <a
                      href={`mailto:${hotel.email}`}
                      className="hover:underline"
                    >
                      {hotel.email}
                    </a>
                  </div>
                </div>

                <div>
                  <a
                    href="#" // Changed from 'to' to 'href' for Next.js Link
                    className="text-green-700 font-medium underline hover:text-green-900"
                  >
                    Hotel website
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <HotelBookingPopup id={id} />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};


export default HotelsPage;