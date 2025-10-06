"use client";
import React, { useEffect, useRef, useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router';
import DashboardLayout from '@/components/layout/DashboardLayout';
// import { AuthService } from '@/app/lib/api/services/auth.service';

// import API from "@/app/lib/api/axios";
// import { AxiosResponse } from 'axios';

import blueori from "../../../../assets/blue-origin.png";
import blueclub from "../../../../assets/clubs/image2.jpg";



// const mockUser= {
//   id: '1',
//   role: 'Admin',
//   name: 'John Doe'
// };

// const imageBaseUrl = "/uploads/rooms/"; // Change to your actual base path for images, or receive from API/config

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState();
 
    // const user = AuthService.getUser();
  // const [loading, setLoading] = useState(true);
  const [viewImages, setViewImages] = useState(null);
  const navigate = useNavigate();

  // const canEdit = user && ['Super Admin', 'Admin'].includes(user.role );

  // const handleAddRoom = () => {
  //   setEditingRoom(undefined);
  //   setIsModalOpen(true);
  // };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        // await API.delete(`/api/vendors/rooms/${roomId}`);
        setRooms(prev => prev.filter(room => room._id !== roomId));
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

//    const fetchRooms = async () => {
//   try {
//     setLoading(true);
//     // Get the user data from AuthService
//     if (!user) {
//       console.warn("No user found in storage");
//       setLoading(false);
//       return;
//     }
//     // Get the token
//     const token = AuthService.getToken();
//     if (!token) {
//       console.warn("No token found");
//       setLoading(false);
//       return;
//     }
//     // Fetch rooms data
//     const response = await API.get(`/api/vendors/rooms?vendorId=${user.id}`);
    
//     // Updated to match your actual API response structure
//     if (response.data && Array.isArray(response.data.availableRooms)) {
//       // Map the API response to match your Room interface
     

//       const mappedRooms = (response.data.availableRooms).map((room) => ({
//         ...room,
//         _id: room._id,
//         roomNumber: room.roomNumber,
//         roomType: room.roomType,
//         type: room.roomType, // Assuming type should be the same as roomType
//         price: room.price,
//         capacity: room.capacity,
//         amenities: room.amenities || [],
//         features: room.features || [],
//         images: room.roomImages || [], // Map roomImages to images
//         description: room.roomDescription || '', // Map roomDescription to description
//         isAvailable: room.isAvailable,
//         maintenanceStatus: room.maintenanceStatus,
//         createdAt: room.createdAt,
//         updatedAt: room.updatedAt
//       }));
      
//       setRooms(mappedRooms);
//       console.log("Rooms loaded:", mappedRooms);
//     } else {
//       console.warn("Invalid room data format", response.data);
//       setRooms([]);
//     }
//   } catch (error) {
//     console.error("Failed to fetch room data:", error);
//     if (error && typeof error === 'object' && 'response' in error) {
//       const apiError = error ;
//       console.error("Error response:", apiError.response.status, apiError.response.data);
//     }
//     setRooms([]); // Set empty array on error to prevent undefined issues
//   } finally {
//     setLoading(false);
//   }
// };
//   useEffect(() => {
//     fetchRooms();
//   }, []);

console.log(editingRoom?._id)
  // const handleSaveRoom = async (roomData) => {
  //   try {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     let response;
  //     if (editingRoom) {
  //       // If there are new images, upload them first
  //       if (roomData.images && roomData.images.length > 0) {
  //         const formData = new FormData();
  //         (roomData.images).forEach((img) => formData.append("images", img));
  //         await API.post(`/api/vendors/rooms/${editingRoom._id}/images`, formData, {
  //           headers: {
  //             "Content-Type": "multipart/form-data"
  //           }
  //         });
  //       }
  //       // Update existing room (excluding images)
  //       response = await API.put(`/api/vendors/rooms/${editingRoom._id}`, {
  //         ...roomData,
  //         images: undefined // Don't send images array as part of normal data
  //       });
  //       setRooms(prev => prev.map(room => 
  //         room._id === editingRoom._id ? response.data : room
  //       ));
  //     } else {
  //       // Add new room with images
  //       const formData = new FormData();
  //       Object.entries(roomData).forEach(([key, val]) => {
  //         if (key === "images" && Array.isArray(val)) {
  //           (val ).forEach((img) => formData.append("images", img));
  //         } else if (typeof val === "object" && Array.isArray(val)) {
  //           formData.append(key, JSON.stringify(val));
  //         } else {
  //           formData.append(key, String(val));
  //         }
  //       });
  //       response = await API.post('/api/vendors/rooms', formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data"
  //         }
  //       });
  //       setRooms(prev => [...prev, response.data]);
  //     }
  //     fetchRooms(); // Refresh the list
  //   } catch (error) {
  //     console.error('Failed to save room:', error);
  //   }
  // };

  useEffect(() => {
  // Dummy data for testing
  const dummyRooms = [
    {
      _id: "1",
      roomNumber: "101",
      roomType: "single",
      type: "standard",
      price: 50,
      capacity: 1,
      amenities: ["WiFi", "AC"],
      features: ["Balcony"],
      description: "Cozy single room with a balcony.",
      isAvailable: true,
      maintenanceStatus: "available",
      images: [blueori, blueclub],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "2",
      roomNumber: "202",
      roomType: "double",
      type: "deluxe",
      price: 120,
      capacity: 2,
      amenities: ["WiFi", "Mini Bar", "TV"],
      features: ["Ocean View", "Terrace"],
      description: "Deluxe double room with ocean view.",
      isAvailable: false,
      maintenanceStatus: "available",
      images: [blueori],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "3",
      roomNumber: "303",
      roomType: "suite",
      type: "premium",
      price: 250,
      capacity: 4,
      amenities: ["WiFi", "AC", "Room Service", "Smart TV"],
      features: ["Jacuzzi", "Living Area", "Garden View"],
      description: "Luxury suite with jacuzzi and living area.",
      isAvailable: true,
      maintenanceStatus: "maintenance",
      images: [blueori],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  setRooms(dummyRooms);
}, []);


  const getStatusColor = (isAvailable, maintenanceStatus) => {
    if (maintenanceStatus === 'maintenance') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return isAvailable 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isAvailable, maintenanceStatus) => {
    if (maintenanceStatus === 'maintenance') {
      return 'Maintenance';
    }
    return isAvailable ? 'Available' : 'Occupied';
  };

 


  // View images modal
  const handleViewImages = (room) => {
    setViewImages(room.images && room.images.length > 0 ? room.images : []);
  };

  const handleCloseViewImages = () => setViewImages(null);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-lg">Loading rooms...</div>
  //     </div>
  //   );
  // }

  return (
    <DashboardLayout>
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          {/* {canEdit && ( */}
            <button
              onClick={() => {
                navigate("/hotel/addrooms");
              }}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <Plus size={20} className="mr-2" />
              Add Room
            </button>
          {/* )} */}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amenities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  {/* {canEdit && ( */}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  {/* )} */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.roomNumber }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.type} ({room.roomType})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${room.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.capacity} guests
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.isAvailable, room.maintenanceStatus)}`}>
                        {getStatusText(room.isAvailable, room.maintenanceStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map(amenity => (
                          <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {room.features.map(feature => (
                          <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.images && room.images.length > 0 ? (
                        <button
                          type="button"
                          title="View Images"
                          onClick={() => handleViewImages(room)}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Eye size={18} className="mr-1" />
                          {room.images.length}
                        </button>
                      ) : (
                        <span className="text-gray-400">No Images</span>
                      )}
                    </td>
                    {/* {canEdit && ( */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    {/* )} */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <RoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          room={editingRoom}
          onSave={() => {}}
        />

        {viewImages && (
          <ImageGalleryModal
            images={viewImages}
            onClose={handleCloseViewImages}
          />
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default RoomsManagement;

// Modal for Add/Edit Room
const RoomModal = ({ isOpen, onClose, room, onSave }) => {
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || '',
    roomType: room?.roomType || 'single',
    type: room?.type || 'deluxe',
    price: room?.price || 0,
    capacity: room?.capacity || 1,
    amenities: room?.amenities || [],
    features: room?.features || [],
    description: room?.description || '',
    isAvailable: room?.isAvailable ?? true,
    maintenanceStatus: room?.maintenanceStatus || 'available',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const amenityOptions = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Room Service', 'Safe', 'Smart TV', 'Kitchenette'];
  const featureOptions = ['Ocean View', 'Balcony', 'Living Area', 'Jacuzzi', 'Fireplace', 'Terrace', 'Garden View'];

  // For preview of newly selected images
  const handleImageChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files,
    }));
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  // Reset form data when room changes
  useEffect(() => {
    setFormData({
      roomNumber: room?.roomNumber || '',
      roomType: room?.roomType || 'single',
      type: room?.type || 'deluxe',
      price: room?.price || 0,
      capacity: room?.capacity || 1,
      amenities: room?.amenities || [],
      features: room?.features || [],
      description: room?.description || '',
      isAvailable: room?.isAvailable ?? true,
      maintenanceStatus: room?.maintenanceStatus || 'available',
      images: [],
    });
    setImagePreviews([]);
  }, [room]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="family">Family</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Category
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (guests)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Images Section */}
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
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {/* Preview newly selected images */}
            {imagePreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded overflow-hidden border">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="object-cover w-full h-full"
                     
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                      onClick={() => {
                        setImagePreviews(p => p.filter((_, j) => j !== i));
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, j) => j !== i)
                        }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Show previously uploaded images for edit */}
            {room && room.images && room.images.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <div className="mb-1">Current Images:</div>
                <div className="flex flex-wrap gap-2">
                  {room.images.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded overflow-hidden border">
                      <img
                        src={img.startsWith("http") ? img : img}
                        alt={`Room image ${idx + 1}`}
                        className="object-cover w-full h-full"
                        
                      />
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {room ? 'Update' : 'Add'} Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for viewing images
const ImageGalleryModal = ({
  images,
  onClose,
}) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="relative max-w-lg w-full bg-white rounded-lg p-4">
        <button
          className="absolute top-2 right-2 z-10 text-gray-700 hover:text-gray-900 bg-white rounded-full p-1"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center">
          <img
            src={images[current].startsWith("http") ? images[current] :  images[current]}
            alt={`Room Image ${current + 1}`}
            className="max-h-96 rounded shadow"
           
          />
          <div className="flex items-center justify-center gap-2 mt-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-12 h-12 rounded border-2 ${
                  idx === current ? "border-blue-500" : "border-transparent"
                } overflow-hidden`}
              >
                <img
                  src={img.startsWith("http") ? img :  img}
                  alt={`Preview ${idx + 1}`}
                  className="object-cover w-full h-full"
                  
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};