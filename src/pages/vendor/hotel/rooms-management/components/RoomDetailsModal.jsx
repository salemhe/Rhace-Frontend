// import { Edit, Eye, Trash2, X } from 'lucide-react';
// import { useState } from 'react';


// const RoomDetailsModal = ({ room, isOpen, onClose, onEdit, onDelete,  onViewImages }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   if (!isOpen || !room) return null;

//   const getStatusColor = (isAvailable, maintenanceStatus) => {
//     if (maintenanceStatus === 'maintenance') {
//       return 'bg-yellow-100 text-yellow-800';
//     }
//     return isAvailable
//       ? 'bg-green-100 text-green-800'
//       : 'bg-red-100 text-red-800';
//   };

//   const getStatusText = (isAvailable, maintenanceStatus) => {
//     if (maintenanceStatus === 'maintenance') {
//       return 'Maintenance';
//     }
//     return isAvailable ? 'Available' : 'Occupied';
//   };

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? (room.images?.length || 0) - 1 : prev - 1
//     );
//   };

//   const handleNextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === (room.images?.length || 0) - 1 ? 0 : prev + 1
//     );
//   };
// console.log(room._id)
//   return (
//     <div className="fixed inset-0 bg-black/60  flex items-center justify-center p-4 z-50 hide-scrollbar"> 
//       <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
//           <h2 className="text-2xl font-bold text-gray-900">Room Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="p-6">
//           {room.images && room.images.length > 0 && (
//             <div className="mb-6">
//               <div className="relative h-96 rounded-xl overflow-hidden bg-gray-100">
//                 <img
//                   src={room.images[currentImageIndex]}
//                   alt={`${room.roomNumber} - Image ${currentImageIndex + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//                 {room.images.length > 1 && (
//                   <>
//                     <button
//                       onClick={handlePrevImage}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={handleNextImage}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </button>
//                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//                       {room.images.map((_, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => setCurrentImageIndex(idx)}
//                           className={`w-2 h-2 rounded-full transition-all ${
//                             idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <div className="mb-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h3 className="text-3xl font-bold text-gray-900">{room.roomNumber}</h3>
//                     <p className="text-gray-600 mt-1">
//                       {room.category} {room.name.charAt(0).toUpperCase() + room.name.slice(1)} Room - {room.name.charAt(0).toUpperCase() + room.name.slice(1)}
//                     </p>
//                   </div>
//                   {/* <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.isAvailable, room.maintenanceStatus)}`}>
//                     {getStatusText(room.isAvailable, room.maintenanceStatus)}
//                   </span> */}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
//                   <div className="flex justify-between items-center">
//                     <span className="text-teal-900 font-medium">Price per Night</span>
//                     <span className="text-3xl font-bold text-teal-600">₦{room.pricePerNight.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
//                   <div className="flex justify-between items-center">
//                     <span className="text-teal-900 font-medium">Discount</span>
//                     <span className="text-3xl font-bold text-teal-600">{room.discount}%</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Capacity</h4>
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                   </svg>
//                   <span className="text-lg font-medium">{room.adultsCapacity} Guests</span>
//                 </div>
//               </div>

//               {room.description && (
//                 <div className="mb-6">
//                   <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Description</h4>
//                   <p className="text-gray-600 leading-relaxed">{room.description}</p>
//                 </div>
//               )}
//               <div className="flex gap-2">
//             {room.images && room.images.length > 0 && (
//               <button
//                 onClick={() => {onViewImages(room); onClose()}}
//                 className="p-2 text-teal-600 hover:bg-blue-50 rounded-lg  transition-colors"
//                 title="View Images"
//               >
//                 <Eye size={18} />
//               </button>
//             )}
//             <button
//               onClick={() => {onEdit(room); onClose()}}
//               className="p-2 text-teal-600 hover:bg-blue-50 rounded-lg transition-colors"
//               title="Edit Room"
//             >
//               <Edit size={18} />
//             </button>
//             <button
//               onClick={() => {onDelete(room._id); onClose()}}
//               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="Delete Room"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>
//             </div>

//             <div>
//               <div className="mb-6">
//                 <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Amenities</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {room.amenities.map((amenity) => (
//                     <span
//                       key={amenity}
//                       className="px-3 py-2 bg-[#F4F4F4] text-[#606368]text-sm font-medium rounded-[8px] border border-[#E5E7EB]"
//                     >
//                       {amenity}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* <div className="mb-6">
//                 <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Features</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {room.features.map((feature) => (
//                     <span
//                       key={feature}
//                       className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200"
//                     >
//                       {feature}
//                     </span>
//                   ))}
//                 </div>
//               </div> */}

//               {(room.createdAt || room.updatedAt) && (
//                 <div className="pt-6 border-t border-gray-200">
//                   <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Information</h4>
//                   <div className="space-y-2 text-sm text-gray-600">
//                     {room.createdAt && (
//                       <div className="flex justify-between">
//                         <span>Created:</span>
//                         <span className="font-medium">{new Date(room.createdAt).toLocaleDateString()}</span>
//                       </div>
//                     )}
//                     {room.updatedAt && (
//                       <div className="flex justify-between">
//                         <span>Last Updated:</span>
//                         <span className="font-medium">{new Date(room.updatedAt).toLocaleDateString()}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="w-full px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoomDetailsModal;

import { Edit, Eye, Trash2, X, Users, Tag, CalendarDays, RefreshCw, BedDouble, Percent, Wrench, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

const RoomDetailsModal = ({ room, isOpen, onClose, onEdit, onDelete, onViewImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !room) return null;

  const totalCapacity = (room.adultsCapacity || 0) + (room.childrenCapacity || 0);

  const statusLabel =
    room.maintenanceStatus === 'maintenance'
      ? 'Maintenance'
      : room.isAvailable
      ? 'Available'
      : 'Occupied';

  const statusStyle =
    room.maintenanceStatus === 'maintenance'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : room.isAvailable
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-red-50 text-red-600 border-red-200';

  const StatusIcon =
    room.maintenanceStatus === 'maintenance'
      ? Wrench
      : room.isAvailable
      ? CheckCircle2
      : XCircle;

  const handlePrevImage = () =>
    setCurrentImageIndex((p) => (p === 0 ? (room.images?.length || 1) - 1 : p - 1));

  const handleNextImage = () =>
    setCurrentImageIndex((p) => (p === (room.images?.length || 1) - 1 ? 0 : p + 1));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* ── Header ── */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{room.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              {room.type && (
                <span className="text-xs text-gray-400 capitalize">{room.type} room</span>
              )}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle}`}>
                <StatusIcon className="w-2.5 h-2.5" />
                {statusLabel}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Image carousel ── */}
          {room.images && room.images.length > 0 ? (
            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={room.images[currentImageIndex]}
                alt={`${room.name} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {room.images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {room.images.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-200 ${idx === currentImageIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
                      />
                    ))}
                  </div>
                  <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {room.images.length}
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="h-40 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 text-sm">
              No images available
            </div>
          )}

          {/* ── Price + Discount ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f0fafa] border border-[#cce8e8] rounded-xl px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0A6C6D]/60 mb-1">Price / Night</p>
              <p className="text-2xl font-extrabold text-[#0A6C6D]">
                ₦{(room.pricePerNight || 0).toLocaleString()}
              </p>
              {room.discount > 0 && (
                <p className="text-xs text-[#0A6C6D]/60 mt-0.5 line-through">
                  ₦{Math.round((room.pricePerNight || 0) / (1 - room.discount / 100)).toLocaleString()}
                </p>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Discount</p>
              <p className="text-2xl font-extrabold text-gray-800">
                {room.discount ?? 0}
                <span className="text-base font-semibold text-gray-400 ml-0.5">%</span>
              </p>
            </div>
          </div>

          {/* ── Key stats grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Capacity */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#0A6C6D]/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-[#0A6C6D]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Capacity</p>
                <p className="text-sm font-bold text-gray-800">{totalCapacity} guests</p>
              </div>
            </div>

            {/* Adults */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#0A6C6D]/10 flex items-center justify-center flex-shrink-0">
                <BedDouble className="w-4 h-4 text-[#0A6C6D]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Adults</p>
                <p className="text-sm font-bold text-gray-800">{room.adultsCapacity ?? 0}</p>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#0A6C6D]/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-[#0A6C6D]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Children</p>
                <p className="text-sm font-bold text-gray-800">{room.childrenCapacity ?? 0}</p>
              </div>
            </div>

            {/* Total units */}
            {room.totalUnits !== undefined && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#0A6C6D]/10 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-[#0A6C6D]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Units</p>
                  <p className="text-sm font-bold text-gray-800">{room.totalUnits}</p>
                </div>
              </div>
            )}

            {/* Room type */}
            {(room.roomType || room.type) && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#0A6C6D]/10 flex items-center justify-center flex-shrink-0">
                  <BedDouble className="w-4 h-4 text-[#0A6C6D]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Room Type</p>
                  <p className="text-sm font-bold text-gray-800 capitalize">{room.roomType || room.type}</p>
                </div>
              </div>
            )}

            {/* Maintenance status */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#0A6C6D]/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-4 h-4 text-[#0A6C6D]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Status</p>
                <p className="text-sm font-bold text-gray-800 capitalize">{room.maintenanceStatus || 'Available'}</p>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          {room.description && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                {room.description}
              </p>
            </div>
          )}

          {/* ── Amenities ── */}
          {room.amenities && room.amenities.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Amenities <span className="text-gray-300 font-normal ml-1">({room.amenities.length})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span key={amenity} className="px-3 py-1.5 bg-[#f0fafa] text-[#0A6C6D] text-xs font-medium rounded-full border border-[#cce8e8]">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Timestamps ── */}
          {(room.createdAt || room.updatedAt) && (
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              {room.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Created {new Date(room.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
              {room.updatedAt && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Updated {new Date(room.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {room.images && room.images.length > 0 && (
              <button
                onClick={() => { onViewImages(room); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-[#0A6C6D] hover:bg-[#f0fafa] border border-gray-200 hover:border-[#cce8e8] rounded-lg transition-all"
              >
                <Eye size={14} /> Photos
              </button>
            )}
            <button
              onClick={() => { onEdit(room); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-[#0A6C6D] hover:bg-[#f0fafa] border border-gray-200 hover:border-[#cce8e8] rounded-lg transition-all"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => { onDelete(room._id); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0A6C6D] hover:bg-[#085a5a] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;