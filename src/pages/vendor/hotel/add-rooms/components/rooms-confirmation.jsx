'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Bed,
  Building,
  Camera,
  Car,
  Coffee,
  Edit,
  Home,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Users,
  Wifi
} from 'lucide-react';
import { useState } from 'react';


const amenityIcons= {
  "Free Breakfast": <Coffee className="w-4 h-4" />,
  "Breakfast": <Coffee className="w-4 h-4" />,
  "Free Parking": <Car className="w-4 h-4" />,
  "Parking": <Car className="w-4 h-4" />,
  "City View": <Building className="w-4 h-4" />,
  "Free WiFi": <Wifi className="w-4 h-4" />,
  "Wi-Fi": <Wifi className="w-4 h-4" />,
  "WiFi": <Wifi className="w-4 h-4" />
};

export default function HotelBookingInterface({ 
  completeData, 
  onFinalSubmit, 
  onEditStep 
}) {
  const [confirmed, setConfirmed] = useState(false);

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleFinalSubmit = () => {
    if (!confirmed) {
      alert('Please confirm that all hotel details are correct before proceeding.');
      return;
    }
    onFinalSubmit();
  };

  // Helper function to get payment method labels
  const getPaymentMethodLabel = (key) => {
    const labels = {
      fullPaymentRequired: 'Full Payment Required',
      allowPartPayment: 'Part Payment Allowed',
      payAtHotel: 'Pay at Hotel'
    };
    return labels[key] || key;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Hotel Information Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b space-y-0 pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">Hotel Information</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-teal-600 hover:text-teal-700"
              onClick={() => onEditStep(1)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {completeData.hotelInfo ? (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {completeData.hotelInfo.hotelName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {completeData.hotelInfo.hotelCategory}
                  </p>
                  
                  <div className="flex flex-wrap gap-y-4 gap-x-14">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hotel Type</label>
                      <p className="text-sm text-gray-900">{completeData.hotelInfo.hotelType}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Branch Code</label>
                      <p className="text-sm text-gray-900">{completeData.hotelInfo.branchCode}</p>
                    </div>
                  
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Email</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {completeData.hotelInfo.contactEmail}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {completeData.hotelInfo.contactPhone}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {completeData.hotelInfo.location}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{completeData.hotelInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Hotel information not completed</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => onEditStep(1)}
                >
                  Complete Hotel Information
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Room Type Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">
              Room Types ({completeData.roomTypes.length})
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-teal-600 hover:text-teal-700"
              onClick={() => onEditStep(2)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {completeData.roomTypes.length > 0 ? (
              completeData.roomTypes.map((room) => (
                <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-20 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex-shrink-0 overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded flex items-center">
                        <Camera className="w-3 h-3 mr-1" />
                        +{room.images.length} photos
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{room.name}</h4>
                          <p className="text-sm text-gray-600">{room.description || 'No description provided'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">{formatPrice(room.pricePerNight)}</p>
                          <p className="text-sm text-gray-500">/night</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {room.adultsCapacity} Adults
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {room.childrenCapacity} Children
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                          <Home className="w-4 h-4 mr-1" />
                          {room.totalAvailableRooms} rooms
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                              {amenityIcons[amenity] || <Home className="w-4 h-4" />}
                              <span className="ml-1">{amenity}</span>
                            </Badge>
                          ))}
                          {room.amenities.length > 4 && (
                            <Badge variant="outline" className="text-gray-600">
                              <MoreHorizontal className="w-4 h-4 mr-1" />
                              +{room.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No room types configured</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => onEditStep(2)}
                >
                  Add Room Types
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking & Policy Settings Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center border-b justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">Booking & Policy Settings</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-teal-600 hover:text-teal-700"
              onClick={() => onEditStep(3)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {completeData.bookingPolicy ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Check-In Time</label>
                      <p className="text-sm text-gray-900 mt-1">{completeData.bookingPolicy.checkInTime}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Booking Lead Time</label>
                      <p className="text-sm text-gray-900 mt-1">
                        At least {completeData.bookingPolicy.advanceBookingHours} hours in advance
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Room Type Name</label>
                      <p className="text-sm text-gray-900 mt-1">{completeData.bookingPolicy.roomTypeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Free Cancellation Period</label>
                      <p className="text-sm text-gray-900 mt-1">
                        Up to {completeData.bookingPolicy.freeCancellationHours} hours before check-in
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Cancellation Policy</label>
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {completeData.bookingPolicy.customPolicyNote || 
                     `Free cancellation up to ${completeData.bookingPolicy.freeCancellationHours} hours before check-in. Cancellation Type: ${completeData.bookingPolicy.cancellationType}`}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-3 block">Payment Options</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {Object.entries(completeData.bookingPolicy.paymentOptions)
                      .filter(([enabled]) => enabled)
                      .map(([option]) => (
                        <Badge key={option} variant="outline" className="px-3 py-1.5 flex items-center justify-center text-sm">
                          {option === "payAtHotel" && <Amenities color="#067463"/>}
                          {getPaymentMethodLabel(option)}
                        </Badge>
                      ))}
                  </div>
                </div>
                
                {completeData.bookingPolicy.paymentInstructions && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Payment Instructions</label>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {completeData.bookingPolicy.paymentInstructions}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Booking policy not configured</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => onEditStep(3)}
                >
                  Configure Booking Policy
                </Button>
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-start space-x-3 p-4 rounded-lg border">
              <Checkbox
                id="confirmDetails"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked)}
              />
              <Label htmlFor="confirmDetails" className="text-sm text-gray-700">
                I confirm all hotel details are correct and I understand that once published, this hotel will be visible to customers for booking.
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Final Submit Button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleFinalSubmit}
            disabled={!confirmed}
            className="bg-[#0a6c6d] text-white hover:bg-teal-700 px-8 py-2"
            size="lg"
          >
            Publish Hotel
          </Button>
        </div>
      </div>
    </div>
  );
}