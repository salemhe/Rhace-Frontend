import { Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const RoomTable = ({ rooms, onEdit, onDelete, onViewDetails, onViewImages }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const toggleDropdown = (roomId) => {
    setOpenDropdown(openDropdown === roomId ? null : roomId);
  };

  const handleAction = (action, room) => {
    setOpenDropdown(null);
    action(room);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto overflow-y-visible hide-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Amenities
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {rooms.map((room) => (
              <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {room.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  ${room.pricePerNight.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {room.adultsCapacity + room.childrenCapacity} guests
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.isAvailable, room.maintenanceStatus)}`}>
                    {getStatusText(room.isAvailable, room.maintenanceStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 2).map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-[#f4f4f4] border border-[#E5E7EB] text-[#606368] text-xs rounded-[8px]">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        +{room.amenities.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {room.images && room.images.length > 0 ? (
                    <button
                      type="button"
                      title="View Images"
                      onClick={() => onViewImages(room)}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Eye size={18} className="mr-1" />
                      {room.images.length}
                    </button>
                  ) : (
                    <span className="text-gray-400">No Images</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <div className="relative inline-block text-left">
    {/* Action trigger */}
    <button
      onClick={() => toggleDropdown(room._id)}
      className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      title="Actions"
    >
      <MoreHorizontal size={18} />
    </button>

    {/* Dropdown menu with smooth animation */}
    <div
      className={`absolute right-0 z-20 mt-2 w-48 rounded-lg shadow-lg bg-white transform transition-all duration-200 ease-out origin-top-right
        ${
          openDropdown === room._id
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
    >
      <div className="py-1">
        <button
          onClick={() => handleAction(onViewDetails, room)}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Eye size={16} className="mr-3" />
          View Details
        </button>
        <button
          onClick={() => handleAction(onEdit, room)}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Edit size={16} className="mr-3" />
          Edit Room
        </button>
        <button
          onClick={() => {
            setOpenDropdown(null);
            onDelete(room._id);
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} className="mr-3" />
          Delete Room
        </button>
      </div>
    </div>

    {/* Overlay for click-away close */}
    {openDropdown === room._id && (
      <div
        className="fixed inset-0 z-10"
        onClick={() => setOpenDropdown(null)}
      />
    )}
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;