import { Edit, Eye, Trash2 } from "lucide-react";
import { FaAnglesRight } from "react-icons/fa6";

const RoomCard = ({ room, onViewDetails }) => {
  const getStatusColor = (isAvailable, maintenanceStatus) => {
    if (maintenanceStatus === "maintenance") {
      return "bg-yellow-100 text-yellow-800";
    }
    return isAvailable
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusText = (isAvailable, maintenanceStatus) => {
    if (maintenanceStatus === "maintenance") {
      return "Maintenance";
    }
    return isAvailable ? "Available" : "Occupied";
  };

  return (
  <div className="bg-white rounded-2xl border border-[#CDEAE6] shadow-sm p-2.5">

    {/* Image */}
    <div className="h-45 rounded-xl overflow-hidden bg-gray-200">
      {room.images && room.images.length > 0 ? (
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}
    </div>

    {/* Content */}
    <div className="pt-4">

      {/* Title Row */}
      <div className="flex justify-between items-start">
        <h3 className="text-mb font-normal text-[#111827]">
          {room.name}
        </h3>

        <button
          onClick={() => onViewDetails(room)}
          className="text-sm text-teal-700 hover:text-teal-700 font-sm underline"
        >
          View Details
        </button>
      </div>

      {/* Description */}
       <p className="text-[13px] text-black leading-snug mt-2">
           {room.description
             ? room.description.length > 72
             ? room.description.slice(0, 72) + "…"
               : room.description
             : `Sleeps ${(room.adultsCapacity || 0) + (room.childrenCapacity || 0)} guests · ${room.totalUnits ?? "–"} unit${room.totalUnits !== 1 ? "s" : ""} available`}
         </p>
      <p className="text-sm text-black mt-2 leading-relaxed">
        Capacity: <span className="font-bold">{room.adultsCapacity + room.childrenCapacity}</span> guests, {" "}
        <span className="font-bold">{room.totalUnits} </span>units available
      </p>

      {/* Bottom Row (Price + Arrow link) */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-normal font-normal text-[#111827]">
          ₦{room.pricePerNight.toLocaleString()}
          <span className="text-xs font-normal text-gray-400 ml-1">/ night</span>
        </p>

        <button
          onClick={() => onViewDetails(room)}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          <FaAnglesRight />
          <span>View details</span>
        </button>
      </div>
    </div>
  </div>
);
};

export default RoomCard;


