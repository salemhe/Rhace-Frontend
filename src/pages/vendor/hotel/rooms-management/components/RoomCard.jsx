import { Edit, Eye, Trash2 } from 'lucide-react';
import { FaAnglesRight } from "react-icons/fa6";

const RoomCard = ({ room,  onViewDetails, }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.roomNumber}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {/* <div className="absolute top-2 right-2">
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.isAvailable, room.maintenanceStatus)}`}>
            {getStatusText(room.isAvailable, room.maintenanceStatus)}
          </span>
        </div> */}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-500">{room.adultsCapacity + room.childrenCapacity} guests</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
         <div className="text-left">
            <p className="text-xl font-bold text-[#111827]">#{room.pricePerNight.toLocaleString()}</p>
          </div>
          <button
            onClick={() => onViewDetails(room)}
            className="text-teal-600 items-center justify-center hover:text-teal-700 text-sm font-medium flex gap-2 "
          >
           <FaAnglesRight /> <p>View Details</p> 
          </button>
          
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
