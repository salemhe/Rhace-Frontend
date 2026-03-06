"use client";
import Footer from "@/components/Footer";
import StarRating from "@/components/ui/starrating";
import Header from "@/components/user/Header";
import HotelBookingPopup from "@/components/user/hotel/BookiingPopup";
import HotelBookingForm from "@/components/user/hotel/BookingForm";
import Images from "@/components/user/ui/Image";
import Images2 from "@/components/user/ui/Image2";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import MapComponent from "@/components/user/ui/mapComponent";
import HotelSaveCopy from "@/components/user/ui/SaveCopy";
import { hotelService } from "@/services/hotel.service";
import { userService } from "@/services/user.service";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import HotelInfo from "../../../components/user/hotel/HotelInfo";

const HotelsPage = () => {
  const [activeTab, setActiveTab] = useState("details");

  const { id } = useParams();
  const [hotel, setHotel] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await userService.getVendor("hotel", id);
        console.log(res);
        setHotel(res.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotel();
    const fetchRooms = async () => {
      try {
        const res = await hotelService.getRoomTypes(id);
        setRooms(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);

  if (isLoading || !rooms)
    return <UniversalLoader fullscreen type="vendor-page" />;
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
                    vendor={hotel}
                    images={hotel?.profileImages ?? []}
                    name={hotel.businessName}
                  />
                  {activeTab === "rooms" && (
                    <div className="hidden md:block">
                      <HotelBookingForm
                        selectedRooms={selectedRooms}
                        setSelectedRooms={setSelectedRooms}
                        id={id}
                        restaurant={hotel}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-cente w-full gap-4">
                    <div className="flex justify-between gap-2 items-center pt-2 md:pt-0 px-4 md:px-0">
                      <h1 className="text-2xl text-[#111827] font-semibold">
                        {hotel.businessName}{" "}
                      </h1>{" "}
                      <span className="px-2 py-0.5 rounded-full border border-[#37703F] bg-[#D1FAE5] text-xs text-[#37703F]">
                        {" "}
                        Open
                      </span>
                    </div>
                    <HotelSaveCopy type="hotels" vendor={hotel} id={id} />
                  </div>
                  <div className="md:flex hidden gap-1 items-center text-xs">
                    <StarRating
                      size={16}
                      rating={Number(hotel.rating)}
                      readOnly
                    />
                    <span className="font-semibold text-lg">
                      {hotel.rating}
                    </span>
                    <span className="text-gray-600">
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
                selectedRooms={selectedRooms}
                setShow={setShow}
                rooms={rooms}
                setSelectedRooms={setSelectedRooms}
              />
            </div>
          </div>
          {/* Hide the right column when activeTab is "rooms" */}

          {activeTab !== "rooms" && (
            <div className="space-y-8 px-4 md:px-0">
              <div className="hidden md:block">
                <HotelBookingForm
                  selectedRooms={selectedRooms}
                  setSelectedRooms={setSelectedRooms}
                  id={id}
                  restaurant={hotel}
                />
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
                    <a href={`tel:${hotel.phone}`} className="hover:underline">
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
        <HotelBookingPopup
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          show={show}
          setShow={setShow}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
          id={id}
        />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};

export default HotelsPage;
