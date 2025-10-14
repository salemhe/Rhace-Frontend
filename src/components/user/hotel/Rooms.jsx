// "use client"
import React, {useState } from 'react';
import { ChevronLeft, ChevronRight, Wifi, Users, Bed, Coffee, Car, Building } from 'lucide-react';
import { RoomsData } from '@/lib/api';

const Rooms =  () => {
  const [activeTab, setActiveTab] = useState('Superior Standard Room');
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const tabs = ['Superior Standard Room', 'Superior Luxury Room', 'Superior Specialty Room'];
  const rooms = RoomsData

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Select Room Type</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-white overflow-auto w-full rounded-lg p-1 ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm text-nowrap font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Image Section */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={room.images[currentImageIndex[room.id] || 0]} 
                  alt={room.name}
                  width={384} height={192}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                <button
                  onClick={() => prevImage(room.id, room.images.length)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => nextImage(room.id, room.images.length)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-1"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Room Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{room.description}</p>

                {/* Amenities */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Wifi className="w-3 h-3 mr-1" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{room.amenities.adults} Adults</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 mr-1" />
                    <span>{room.amenities.bedType}</span>
                  </div>
                  <div className="flex items-center">
                    <Coffee className="w-3 h-3 mr-1" />
                    <span>Free Breakfast</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="w-3 h-3 mr-1" />
                    <span>Free Parking</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-3 h-3 mr-1" />
                    <span>City View</span>
                  </div>
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
                      <span>{room.roomsLeft} rooms left</span>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <p className="text-xs text-gray-600 mb-4">{room.cancellation}</p>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      Price: {formatPrice(room.discountedPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatPrice(room.originalPrice)}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/night</span>
                  </div>
                </div>

                {/* Reserve Button */}
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md mb-2">
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