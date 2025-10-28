import { Button } from '@/components/ui/button';
import { hotelService } from '@/services/hotel.service';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import AddRoomType from './components/add-rooms';
import { BookingPolicyForm } from './components/booking-policy';
import HotelBookingInterface from './components/rooms-confirmation';
import { SetupSteps } from './components/setup-steps';
import { useNavigate } from 'react-router';


export default function AddRooms () {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading]= useState(false);

  // Unified state for all form data (hotelInfo removed from workflow)
  const [completeFormData, setCompleteFormData] = useState({
    roomTypes: [
      {
        id: '1',
        name: 'Room Type 1',
        description: '',
        pricePerNight: 100000,
        adultsCapacity: 2,
        childrenCapacity: 2,
        totalAvailableRooms: 2,
        amenities: ['Wi-Fi', 'TV', 'AC'],
        images: []
      }
    ],
    bookingPolicy: {}
  });

  const [openAccordion, setOpenAccordion] = useState('room-1');

  const vendor = useSelector((state) => state.auth);
  // Handle booking policy form submission
  const handleBookingPolicySubmit = (data) => {
    console.log('Booking policy data:', data);
    setCompleteFormData(prev => ({
      ...prev,
      bookingPolicy: data
    }));
    // Auto advance to next step
    setCurrentStep(3);
  };

  // Handle room type operations
  const handleAddRoomType = () => {
    const newRoomId = `${completeFormData.roomTypes.length + 1}`;
    const newRoom = {
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

  const handleInputChange = useCallback(
    (roomId, field, value) => {
      setCompleteFormData((prev) => ({
        ...prev,
        roomTypes: prev.roomTypes.map((room) =>
          room.id === roomId ? { ...room, [field]: value } : room
        ),
      }));
    },
    [setCompleteFormData]
  );

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

  // Helper function to upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  // Helper function to process images - upload Files to Cloudinary
  const processImages = async (images) => {
    const processedImages = [];

    for (const image of images) {
      if (typeof image === 'string') {
        // Already a string URL
        processedImages.push(image);
      } else if (image instanceof File) {
        // Upload File to Cloudinary
        try {
          const uploadedUrl = await uploadToCloudinary(image);
          if (uploadedUrl) {
            processedImages.push(uploadedUrl);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }

    return processedImages;
  };

const navigate = useNavigate()
  // Final form submission
  const handleFinalSubmit = async () => {
    setLoading(true)
    // Validate that all required data is present
    if (!completeFormData.bookingPolicy) {
      alert('Please complete booking policy setup');
      setCurrentStep(2);
      return;
    }

    if (completeFormData.roomTypes.length === 0) {
      alert('Please add at least one room type');
      setCurrentStep(1);
      return;
    }

    // Submit the complete form data
    console.log('Complete Hotel Data:', completeFormData);

    // Use a hardcoded hotel ID or get it from another source
    const hotelId = vendor?.vendor?._id;
    try {
      const created = [];

      for (const room of completeFormData.roomTypes) {
        // Process images to ensure they're all strings
        const processedImages = await processImages(room.images || []);

        // Transform local room shape to API payload as needed
        const payload = {
          name: room.name,
          description: room.description,
          pricePerNight: room.pricePerNight,
          adultsCapacity: room.adultsCapacity,
          childrenCapacity: room.childrenCapacity,
          totalAvailableRooms: room.totalAvailableRooms,
          amenities: room.amenities,
          images: processedImages,
          // include booking policy from the unified form data
          bookingPolicy: completeFormData.bookingPolicy,
          totalUnits:  room.amenities.length,

        };

        // Create room type
        const res = await hotelService.createRoomType(hotelId, payload);
        created.push(res);
      }

      console.log('Created room types:', created);
      
    setLoading(false);
      navigate("/dashboard/hotel/rooms")
    } catch (err) {
      // More detailed error logging for debugging 403 responses
      if (err?.response) {
        console.error('Error creating room types - response:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
      } else if (err?.request) {
        console.error('Error creating room types - no response received', err.request);
      } else {
        console.error('Error creating room types -', err.message || err);
      }

      // Log the token currently in localStorage (if any) to help diagnose auth issues
      try {
        console.log('Stored tokens:', {
          token: localStorage.getItem('token'),
          auth_token: localStorage.getItem('auth_token'),
          vendor_token: localStorage.getItem('vendor-token') || localStorage.getItem('vendor_token'),
        });
      } catch {
        // ignore
      }

      alert('An error occurred while creating room types. See console for details.');
    }
    setLoading(false);
  };

  // Save as draft functionality
  const handleSaveDraft = () => {
    console.log('Saving draft:', completeFormData);
    localStorage.setItem('hotelSetupDraft', JSON.stringify(completeFormData));
    alert('Draft saved successfully!');
  };

  // Validation function to check if current step can proceed
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return completeFormData.roomTypes.length > 0;
      case 2:
        return completeFormData.bookingPolicy !== null;
      default:
        return true;
    }
  };

  const handleContinue = () => {
    if (currentStep === 3) {
      handleFinalSubmit();
    } else if (canProceedToNextStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      alert('Please complete the current step before continuing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto pt-24 px-6">
        {/* Progress Steps */}
        <SetupSteps currentStep={currentStep} />

        {/* Form Container */}
        <div className="">
          {currentStep === 1 && (
            <AddRoomType
              onSubmit={(data) => {
                console.log('Room configuration data:', data);
                setCurrentStep(2);
              }}
              handleDeleteRoomType={handleDeleteRoomType}
              roomTypes={completeFormData.roomTypes}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              handleInputChange={handleInputChange}
              handleAmenityToggle={handleAmenityToggle}
            />
          )}

          {currentStep === 2 && (
            <div className="">
              <BookingPolicyForm
                onSubmit={handleBookingPolicySubmit}
                formData={
                  completeFormData.bookingPolicy
                }
                setFormData={(update) =>
                  setCompleteFormData((prev) => ({
                    ...prev,
                    bookingPolicy:
                      typeof update === "function"
                        ? update(prev.bookingPolicy)
                        : update,
                  }))
                }
                initialData={completeFormData.bookingPolicy}
              />
            </div>
          )}

          {currentStep === 3 && (
            <HotelBookingInterface
              onEditStep={(step) => setCurrentStep(step)}
              completeData={completeFormData}
              onFinalSubmit={handleFinalSubmit}
            />
          )}
        </div>
      </div>

      <div className="flex flex-row items-center justify-between px-10 py-2 bg-white mt-8">
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
            onClick={currentStep === 1 ? handleAddRoomType : handleSaveDraft}
            className="gap-2"
          >
            {currentStep === 1 ? (
              <>
                <Plus className="h-4 w-4" />
                <span>Add Another Room Type</span>
              </>
            ) : (
              <span>Save Draft</span>
            )}
          </Button>

          <Button
            variant="secondary"
            size="default"
            className='bg-[#0a6c6d] text-white hover:bg-teal-700'
            onClick={handleContinue}
            disabled={!canProceedToNextStep()}
          >
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}