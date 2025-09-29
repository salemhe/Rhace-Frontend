"use client";

import { Plus } from 'lucide-react';
import { useState } from 'react';
import Header from './components/Header';
import { AddRoomType } from './components/add-rooms';
import { BookingPolicyForm } from './components/booking-policy';
import { HotelSetupForm } from './components/hotel-setup-form';
import HotelBookingInterface from './components/rooms-confirmation';
import { SetupSteps } from './components/setup-steps';
import { Button } from '@/components/ui/button';


export default function AddRooms() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Unified state for all form data
  const [completeFormData, setCompleteFormData] = useState({
    hotelInfo: null,
    roomTypes: [
      {
        id: '1',
        name: 'Luxury Room',
        description: '',
        pricePerNight: 100000,
        adultsCapacity: 2,
        childrenCapacity: 2,
        totalAvailableRooms: 2,
        amenities: ['Wi-Fi', 'TV', 'AC'],
        images: []
      }
    ],
    bookingPolicy: null
  });

  const [openAccordion, setOpenAccordion] = useState('room-1');

  // Handle hotel setup form submission
  // const handleHotelSetupSubmit = (data: HotelFormData) => {
  //   console.log('Hotel setup data:', data);
  //   setCompleteFormData(prev => ({
  //     ...prev,
  //     hotelInfo: data
  //   }));
  //   // Auto advance to next step
  //   // setCurrentStep(2);
  // };

  // Handle booking policy form submission
  const handleBookingPolicySubmit = (data) => {
    console.log('Booking policy data:', data);
    setCompleteFormData(prev => ({
      ...prev,
      bookingPolicy: data
    }));
    // Auto advance to next step
    setCurrentStep(4);
  };

  // Handle room type operations
  const handleAddRoomType = () => {
    const newRoomId = `${completeFormData.roomTypes.length + 1}`;
    const newRoom= {
      id: newRoomId,
      name: `Room Type ${completeFormData.roomTypes.length + 1}`,
      description: '',
      pricePerNight: 100000,
      adultsCapacity: 2,
      childrenCapacity: 2,
      totalAvailableRooms: 2,
      amenities: ['Wi-Fi', 'TV', 'AC'],
      images: []
    };
    
    setCompleteFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, newRoom]
    }));
    setOpenAccordion(`room-${newRoomId}`);
  };

  const handleDeleteRoomType = (roomId) => {
    if (completeFormData.roomTypes.length > 1) {
      setCompleteFormData(prev => ({
        ...prev,
        roomTypes: prev.roomTypes.filter(room => room.id !== roomId)
      }));
      
      // Handle accordion state
      if (openAccordion === `room-${roomId}`) {
        const remainingRooms = completeFormData.roomTypes.filter(room => room.id !== roomId);
        if (remainingRooms.length > 0) {
          setOpenAccordion(`room-${remainingRooms[0].id}`);
        }
      }
    }
  };

  const handleInputChange = (
    roomId,
    field,
    value
  ) => {
    setCompleteFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.map(room => 
        room.id === roomId ? { ...room, [field]: value } : room
      )
    }));
  };

  const handleAmenityToggle = (roomId, amenity) => {
    setCompleteFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.map(room => 
        room.id === roomId ? {
          ...room,
          amenities: room.amenities.includes(amenity)
            ? room.amenities.filter(a => a !== amenity)
            : [...room.amenities, amenity]
        } : room
      )
    }));
  };

  // Final form submission
  const handleFinalSubmit = () => {
    // Validate that all required data is present
    if (!completeFormData.hotelInfo) {
      alert('Please complete hotel setup first');
      setCurrentStep(1);
      return;
    }

    if (!completeFormData.bookingPolicy) {
      alert('Please complete booking policy setup');
      setCurrentStep(3);
      return;
    }

    if (completeFormData.roomTypes.length === 0) {
      alert('Please add at least one room type');
      setCurrentStep(2);
      return;
    }

    // Submit the complete form data
    console.log('Complete Hotel Data:', completeFormData);
    
    // Here you would typically send this to your API
    // Example:
    // await submitHotelData(completeFormData);
    
    alert('Hotel setup completed successfully!');
  };

  // Save as draft functionality
  const handleSaveDraft = () => {
    console.log('Saving draft:', completeFormData);
    // Here you would save to localStorage or send to API
    localStorage.setItem('hotelSetupDraft', JSON.stringify(completeFormData));
    alert('Draft saved successfully!');
  };

  // Load draft functionality (you can call this on component mount)
  // const loadDraft = () => {
  //   const savedDraft = localStorage.getItem('hotelSetupDraft');
  //   if (savedDraft) {
  //     const parsedDraft = JSON.parse(savedDraft);
  //     setCompleteFormData(parsedDraft);
  //   }
  // };

  // Validation function to check if current step can proceed
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return completeFormData.hotelInfo !== null;
      case 2:
        return completeFormData.roomTypes.length > 0;
      case 3:
        return completeFormData.bookingPolicy !== null;
      default:
        return true;
    }
  };

  const handleContinue = () => {
    if (currentStep === 4) {
      handleFinalSubmit();
    } else if (canProceedToNextStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      alert('Please complete the current step before continuing');
    }
  };

  console.log(completeFormData.hotelInfo);

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Header />
      <div className="max-w-6xl mx-auto  pt-24 px-6">
        {/* Progress Steps */}
        <SetupSteps currentStep={currentStep} />
        
        {/* Form Container */}
        <div className="">
          {currentStep === 1 && (
            <HotelSetupForm 
    formData={completeFormData.hotelInfo || {
      hotelName: '',
      phoneNumber: '',
      countryCode: '+234',
      emailAddress: '',
      address: '',
      additionalAddressDetail: '',
      branchCode: `HTL-${Math.floor(Math.random() * 100000)}`,
      hotelType: 'Apartment',
      hotelCategory: 'Standard',
      images: []
    }}
    setFormData={(data) => {
      setCompleteFormData(prev => ({
        ...prev,
        hotelInfo: data
      }));
    }}
    // onSubmit={handleHotelSetupSubmit}
  />
          )}

          {currentStep === 2 && (
            <AddRoomType
              onSubmit={(data) => {
                console.log('Room configuration data:', data);
                // Room data is already being managed in state
                setCurrentStep(3);
              }}
              handleDeleteRoomType={handleDeleteRoomType}
              roomTypes={completeFormData.roomTypes}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              handleInputChange={handleInputChange}
              handleAmenityToggle={handleAmenityToggle}
            />
          )}

          {currentStep === 3 && (
            <div className=" ">
              <BookingPolicyForm
  onSubmit={handleBookingPolicySubmit}
  formData={
    completeFormData.bookingPolicy || {
      checkInTime: "2:00 PM",
      roomTypeName: "e.g Luxury room",
      advanceBookingHours: 24,
      cancellationType: "2",
      freeCancellationHours: 48,
      customPolicyNote: "",
      paymentOptions: {
        fullPaymentRequired: true,
        allowPartPayment: true,
        payAtHotel: false,
      },
      paymentInstructions: "",
    }
  }
  setFormData={(update) =>
    setCompleteFormData((prev) => ({
      ...prev,
      bookingPolicy:
        typeof update === "function"
          ? update(prev.bookingPolicy )
          : update,
    }))
  }
  initialData={completeFormData.bookingPolicy}
/>

            </div>
          )}

          {currentStep === 4 && (
            <HotelBookingInterface onEditStep={(step) => setCurrentStep(step)} 
              completeData={completeFormData}
              onFinalSubmit={handleFinalSubmit}
            />
          )}
        </div>
        
      </div>
      
      <div className="flex flex-row items-center justify-between px-10 py-2 bg-white mt-8 ">
        <Button
          variant="outline"
          size="default"
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          disabled={currentStep === 1}
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>

        {/* Add Another Room Type / Save Draft Button */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 3 || currentStep === 4 ? handleSaveDraft : handleAddRoomType}
            className={`gap-2 ${currentStep === 1 ? 'hidden' : 'flex'}`}
          >
            {currentStep === 3 || currentStep === 4 ? (
              <span>Save Draft</span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add Another Room Type</span>
              </>
            )}
          </Button>
        
          <Button
            variant="secondary"
            size="default"
            className='bg-[#0a6c6d] text-white hover:bg-teal-700'
            onClick={handleContinue}
            disabled={!canProceedToNextStep()}
          >
            {currentStep === 4 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}