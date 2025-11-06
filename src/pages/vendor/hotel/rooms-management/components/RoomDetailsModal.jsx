import { Edit, Eye, Trash2, X } from 'lucide-react';
import { useState } from 'react';


const RoomDetailsModal = ({ room, isOpen, onClose, onEdit, onDelete,  onViewImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !room) return null;

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (room.images?.length || 0) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (room.images?.length || 0) - 1 ? 0 : prev + 1
    );
  };
console.log(room._id)
  return (
    <div className="fixed inset-0 bg-black/60  flex items-center justify-center p-4 z-50 hide-scrollbar"> 
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">Room Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {room.images && room.images.length > 0 && (
            <div className="mb-6">
              <div className="relative h-96 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={room.images[currentImageIndex]}
                  alt={`${room.roomNumber} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {room.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{room.roomNumber}</h3>
                    <p className="text-gray-600 mt-1">
                      {room.name.charAt(0).toUpperCase() + room.name.slice(1)} Room - {room.name.charAt(0).toUpperCase() + room.name.slice(1)}
                    </p>
                  </div>
                  {/* <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.isAvailable, room.maintenanceStatus)}`}>
                    {getStatusText(room.isAvailable, room.maintenanceStatus)}
                  </span> */}
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                  <div className="flex justify-between items-center">
                    <span className="text-teal-900 font-medium">Price per Night</span>
                    <span className="text-3xl font-bold text-teal-600">#{room.pricePerNight.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Capacity</h4>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-lg font-medium">{room.adultsCapacity} Guests</span>
                </div>
              </div>

              {room.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{room.description}</p>
                </div>
              )}
              <div className="flex gap-2">
            {room.images && room.images.length > 0 && (
              <button
                onClick={() => {onViewImages(room); onClose()}}
                className="p-2 text-teal-600 hover:bg-blue-50 rounded-lg  transition-colors"
                title="View Images"
              >
                <Eye size={18} />
              </button>
            )}
            <button
              onClick={() => {onEdit(room); onClose()}}
              className="p-2 text-teal-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Room"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => {onDelete(room._id); onClose()}}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Room"
            >
              <Trash2 size={18} />
            </button>
          </div>
            </div>

            <div>
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-2 bg-[#F4F4F4] text-[#606368]text-sm font-medium rounded-[8px] border border-[#E5E7EB]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div> */}

              {(room.createdAt || room.updatedAt) && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {room.createdAt && (
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-medium">{new Date(room.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {room.updatedAt && (
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">{new Date(room.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;
