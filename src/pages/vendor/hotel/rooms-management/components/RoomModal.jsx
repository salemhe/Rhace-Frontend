import { hotelService } from '@/services/hotel.service';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const RoomModal = ({ isOpen, onClose, room, onSave, id }) => {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    roomNumber: room?.roomNumber || '',
    description: room?.description || '',
    pricePerNight: room?.pricePerNight || room?.price || 0,
    adultsCapacity: room?.adultsCapacity || room?.capacity || 2,
    childrenCapacity: room?.childrenCapacity || 0,
    totalAvailableRooms: room?.totalAvailableRooms || 1,
    amenities: room?.amenities || [],
    features: room?.features || [],
    isAvailable: room?.isAvailable ?? true,
    maintenanceStatus: room?.maintenanceStatus || 'available',
    existingImages: room?.images || [], // Keep track of existing images
    newImages: [], // Track new files to upload
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const amenityOptions = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Room Service', 'Safe', 'Smart TV', 'Kitchenette'];
  const featureOptions = ['Ocean View', 'Balcony', 'Living Area', 'Jacuzzi', 'Fireplace', 'Terrace', 'Garden View'];

  const vendor = useSelector((state) => state.auth);

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
      throw error;
    }
  };

  useEffect(() => {
    setFormData({
      name: room?.name || '',
      roomNumber: room?.roomNumber || '',
      description: room?.description || '',
      pricePerNight: room?.pricePerNight || room?.price || 0,
      adultsCapacity: room?.adultsCapacity || room?.capacity || 2,
      childrenCapacity: room?.childrenCapacity || 0,
      totalAvailableRooms: room?.totalAvailableRooms || 1,
      amenities: room?.amenities || [],
      features: room?.features || [],
      isAvailable: room?.isAvailable ?? true,
      maintenanceStatus: room?.maintenanceStatus || 'available',
      existingImages: room?.images || [],
      newImages: [],
    });
    setImagePreviews([]);
  }, [room]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    setImagePreviews(prev => {
      const removed = prev[index];
      URL.revokeObjectURL(removed);
      return prev.filter((_, i) => i !== index);
    });
    
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hotelId = vendor?.vendor?._id;

      // Upload new images to Cloudinary
      const uploadedImageUrls = [];
      for (const file of formData.newImages) {
        try {
          const url = await uploadToCloudinary(file);
          uploadedImageUrls.push(url);
        } catch (error) {
          console.error('Failed to upload image:', error);
          // Continue with other uploads even if one fails
        }
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...formData.existingImages, ...uploadedImageUrls];

      // Prepare payload with all required fields
      const payload = {
        name: formData.name,
        roomNumber: formData.roomNumber,
        description: formData.description,
        pricePerNight: Number(formData.pricePerNight),
        adultsCapacity: Number(formData.adultsCapacity),
        childrenCapacity: Number(formData.childrenCapacity),
        totalAvailableRooms: Number(formData.totalAvailableRooms),
        amenities: formData.amenities,
        features: formData.features,
        isAvailable: formData.isAvailable,
        maintenanceStatus: formData.maintenanceStatus,
        images: allImages,
        totalUnits: formData.amenities.length,
      };

      console.log('Submitting payload:', payload, id);

      // Create or update room type
      let response;
      
        response = await hotelService.updateRoomType(hotelId, payload, id);
      // if (room && room._id) {
      //   // Update existing room
      // } else {
      //   // Create new room
      //   response = await hotelService.createRoomType(hotelId, payload);
      // }

      console.log('Room saved successfully:', response);
      
      // Call onSave callback with response data
      if (onSave) {
        onSave(response);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving room:', error);
      
      // More detailed error logging
      if (error?.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        alert(`Failed to save room: ${error.response.data?.message || 'Unknown error'}`);
      } else {
        alert('Failed to save room. Please check console for details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 hide-scrollbar">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {room ? 'Edit Room' : 'Add New Room'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              placeholder="e.g., Deluxe Ocean View Suite"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Available Rooms *
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalAvailableRooms}
                onChange={(e) => setFormData(prev => ({ ...prev, totalAvailableRooms: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night ($) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerNight}
              onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adults Capacity *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.adultsCapacity}
                onChange={(e) => setFormData(prev => ({ ...prev, adultsCapacity: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Children Capacity
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.childrenCapacity}
                onChange={(e) => setFormData(prev => ({ ...prev, childrenCapacity: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter room description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability Status
              </label>
              <select
                value={formData.isAvailable.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="true">Available</option>
                <option value="false">Occupied</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Status
              </label>
              <select
                value={formData.maintenanceStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="available">Available</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-3 gap-2">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="mr-2"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="grid grid-cols-3 gap-2">
              {featureOptions.map(feature => (
                <label key={feature} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="mr-2"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Images
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            
            {/* Existing Images */}
            {formData.existingImages.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-2">Current Images:</div>
                <div className="flex flex-wrap gap-2">
                  {formData.existingImages.map((img, idx) => (
                    <div key={`existing-${idx}`} className="relative w-20 h-20 rounded overflow-hidden border">
                      <img
                        src={img}
                        alt={`Existing ${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                        onClick={() => handleRemoveExistingImage(idx)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-2">New Images:</div>
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative w-20 h-20 rounded overflow-hidden border border-teal-500">
                      <img
                        src={src}
                        alt={`New ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                        onClick={() => handleRemoveNewImage(i)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : room ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;