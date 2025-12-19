import { useState } from "react";

import { Building2, Calendar, Download, Edit, Eye, Home, MapPin, MoreVertical, Trash2, Users, X } from 'lucide-react';
import { useNavigate } from "react-router";
function BookingCard ({ booking, onEdit, onDelete }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getButtonText = (status) => {
    if (status === 'success' || status === 'Cancelled') {
      return 'Leave Review';
    }
    return 'View Details';
  };


  const handleDownloadInvoice = () => {
    console.log('Download invoice:', booking.id);
    setShowDropdown(false);
  };

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      onDelete(booking.id);
      setShowDropdown(false);
    }
  };

  return (
    <div className="bg-white rounded-xl relative shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
        <div className="w-full sm:w-40 h-40 sm:h-32 flex-shrink-0">
          <img
            src={booking.vendor.profileImages[0]}
            alt={booking.vendor.businessName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 relative  min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {booking.vendor.businessName}
            </h3>

          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              {booking.reservationType === 'Hotels' ? (
                <Building2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <Home className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-sm">{booking.reservationType.split("R")[0]}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                {booking.reservationType.split("R")[0] === "restaurant" ? formatDate(booking.date) : booking.reservationType.split("R")[0] === "hotel" ? 
                `${formatDate(booking.checkInDate)} - ${formatDate(booking.checkOutDate)}` : formatDate(booking.date)
                }
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{booking.location}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                {booking.guests} Guest{booking.guests > 1 ? 's' : ''}, {booking.room_info}
              </span>
            </div>
          </div>
        </div>

      </div>
      <div className="flex flex-col border-t p-2  sm:flex-row items-start sm:items-center justify-between gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                booking.paymentStatus
              )}`}
            >
              {booking.paymentStatus}
            </span>

            <button
              className="px-6 py-2 rounded-full text-sm font-medium transition-colors w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white"
              onClick={() => {
                navigate(`/bookings/${booking._id}`)
              }}
            >
              {getButtonText(booking.paymentStatus)}
            </button>
          </div>
      <div className="flex border border-[#B9C2DB] items-center bg-[#E9EBF3] absolute top-0 right-0 rounded-bl-xl gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit?.(booking._id)}
          className="p-2 hover:bg-gray-100 rounded-bl-lg transition-colors"
          aria-label="Edit booking"
        >
          <Edit className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => onDelete?.(booking._id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Delete booking"
        >
          <Trash2 className="w-5 h-5 text-gray-600" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded-tr-lg transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-20">
                <div className="py-2">
                 

                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Download Invoice</span>
                  </button>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={handleCancelBooking}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                  >
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Cancel Booking</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCard;