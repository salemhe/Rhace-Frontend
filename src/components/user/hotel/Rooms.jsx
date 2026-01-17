// "use client"
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Wifi, Users, Bed, Coffee, Car, Building } from 'lucide-react';
// import { RoomsData } from '@/lib/api';
import { hotelService } from '@/services/hotel.service';
import UniversalLoader from '../ui/LogoLoader';
import { toast } from 'sonner';

const Rooms = ({ id, setSelectedRoom, setShow }) => {
  const tabs = [
    { title: 'Superior Standard Room', value: "Standard"},
    { title: 'Superior Deluxe Room',  value: "Deluxe"},
    { title: 'Superior Executive Room', value: "Executive"},
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  console.log(filteredRooms)

  const nextImage = (roomId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (roomId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  useEffect(() => {
    setFilteredRooms(rooms.filter(r => r.category === activeTab.value))
  }, [activeTab])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await hotelService.getRoomTypes(id);
        setRooms(res)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchRooms();
  }, [])

    if (isLoading) return <UniversalLoader />

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Select Room Type</h1>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white overflow-auto w-full rounded-lg p-1 ">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm text-nowrap font-medium transition-colors ${activeTab.value === tab.value
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms && filteredRooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Image Section */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={room.images[currentImageIndex[room._id] || 0]}
                  alt={room.name}
                  width={384} height={192}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(room._id, room.images.length)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                    onClick={() => nextImage(room._id, room.images.length)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Room Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{room.description}</p>

                {/* Amenities */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
                  {room.amenities.includes("Wi-Fi") && (
                    <div className="flex items-center">
                      <Wifi className="w-3 h-3 mr-1" />
                      <span>Free WiFi</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{room.adultsCapacity} Adults</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 mr-1" />
                    <span>{room.amenities.bedType || "1 Twin Bed"}</span>
                  </div>
                  {room.amenities.includes("Free Breakfast") && (
                    <div className="flex items-center">
                    <Coffee className="w-3 h-3 mr-1" />
                    <span>Free Breakfast</span>
                  </div>
                  )}
                  {room.amenities.includes("Free Parking") && (
                    <div className="flex items-center">
                    <Car className="w-3 h-3 mr-1" />
                    <span>Free Parking</span>
                  </div>
                  )}
                  {room.amenities.includes("City View") && (
                    <div className="flex items-center">
                    <Building className="w-3 h-3 mr-1" />
                    <span>City View</span>
                  </div>
                  )}
                </div>

                {/* Show more amenities link */}
                <a href="#" className="text-teal-600 text-sm underline mb-4 inline-block">
                  Show more amenities
                </a>

                {/* Discount and Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      {room.discount}% Discount
                    </span>
                    <div className="flex items-center text-teal-600 text-xs">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mr-1"></div>
                      <span>{room.totalUnits} rooms left</span>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <p className="text-xs text-gray-600 mb-4">{room.cancellation}</p>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      Price: {formatPrice(room.pricePerNight - room.pricePerNight * (room.discount / 100))}
                    </span>
                    {room.discount > 0 &&
                        <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(room.pricePerNight)}
                      </span>
                    }
                    <span className="text-xs text-gray-500 ml-1">/night</span>
                  </div>
                </div>

                {/* Reserve Button */}
                <button onClick={() => {
                   setSelectedRoom({...room, pricePerNight: room.pricePerNight  - room.pricePerNight * (room.discount / 100)})
                   toast.success(`Successfully selected ${room.name} room.`)
                  if (window.innerWidth >= 768) window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShow(true)
                }} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md mb-2">
                  Reserve Room
                </button>

                {/* No Charge Note */}
                <p className="text-xs text-gray-500 text-center">You won&apos;t be charged yet</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;