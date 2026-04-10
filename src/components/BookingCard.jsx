import { useState } from "react";
import { Building2, Calendar, Download, Edit, Eye, Home, Loader, Loader2, MapPin, MoreVertical, Trash2, Users, X } from 'lucide-react';
import { useNavigate } from "react-router";
import { SvgIcon, SvgIcon2, SvgIcon3 } from "@/public/icons/icons";

function BookingCard({ booking, onEdit, onCancel }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'paid':
  //       return 'bg-green-100 text-green-800 border-green-200';
  //     case 'not_paid':
  //       return 'bg-amber-100 text-amber-800 border-amber-200';
  //     case 'cancelled':
  //       return 'bg-red-100 text-red-800 border-red-200';
  //     case 'part_paid':
  //       return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 border-gray-200';
  //   }
  // };

  // Temporary normalization added because backend paymentStatus values 
  // are not yet standardized (case/format mismatch).
  // Once backend aligns paymentStatus to consistent values 
  // like: 'paid', 'part_paid', 'not_paid', this logic can be simplified.
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

    const normalized = status.toLowerCase();

    switch (normalized) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-800';

      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700 border-yellow-800';

      case 'no_show':
        return 'bg-amber-100 text-amber-700 border-amber-800';

      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-800';

      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  //Switch betweek proper Icons 
  const getReservationIcon = (type) => {
    if (!type) return <Home className="w-4 h-4 flex-shrink-0" />;

    const normalized = type.toLowerCase();

    if (normalized.includes('hotel')) {
      return <SvgIcon2 className="w-4 h-4 flex-shrink-0 text-black" />;
    }

    if (normalized.includes('restaurant')) {
      return <SvgIcon className="w-4 h-4 flex-shrink-0 text-black" />;
    }

    if (normalized.includes('club')) {
      return <SvgIcon3 className="w-4 h-4 flex-shrink-0 text-black" />;
    }

    return <Home className="w-4 h-4 flex-shrink-0" />;
  };

  const getButtonText = (status) => {
    if (status === 'confirmed' || status === 'cancelled') {
      return 'Leave Review';
    }
    return 'View Details';
  };


  const handleDownloadInvoice = () => {
    console.log('Download invoice:', booking.id);
    setShowDropdown(false);
  };

  const handleCancelBooking = async () => {
      setCancelLoading(true);
      try {
        console.log('Cancelling booking with ID:', booking._id);
        await onCancel(booking._id);
      } catch (err) {
          console.log(err);
        } finally {
          setCancelLoading(false);
          setShowCancel(false);
        }
  };

  //Capitalize Vendor type 
  const formatReservationType = (type) => {
    if (!type) return '';

    const normalized = type.toLowerCase();

    if (normalized.includes('hotel')) return 'Hotel';
    if (normalized.includes('restaurant')) return 'Restaurant';
    if (normalized.includes('club')) return 'Club';

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
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
              {/* {getReservationIcon(booking.reservationType)} */}
              <span className="text-sm">
                {/* {booking.reservationType.split("R")[0]} */}
                {formatReservationType(booking.reservationType)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                {booking.reservationType.toLowerCase().includes('hotel') && booking.rooms?.length > 0
                  ? `${formatDate(booking.rooms[0].checkInDate)} - ${formatDate(booking.rooms[0].checkOutDate)}`
                  : formatDate(booking.date)
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
            booking.reservationStatus
          )}`}
        >
          {booking.reservationStatus.split("_").join(" ")}
        </span>

        <button
          className="px-6 py-3 rounded-full text-sm font-medium transition-colors w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white"
          onClick={() => {
            if (getButtonText(booking.reservationStatus) === 'Leave Review') {
              navigate(`/${booking.reservationType.slice(0, booking.reservationType.indexOf("Reservation")).toLowerCase()}s/${booking.vendor._id}#reviews`)
            }
            else {
              navigate(`/bookings/${booking._id}`)
            }
          }}
        >
          {getButtonText(booking.reservationStatus)}
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
        {/* <button
          onClick={() => onDelete?.(booking._id)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Delete booking"
        >
          <Trash2 className="w-5 h-5 text-gray-600" />
        </button> */}
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
                    onClick={setShowCancel}
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
      {showCancel && (
        <div className="absolute top-0 inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="bg-white relative rounded-lg p-4 w-full max-w-sm">
            <button
              onClick={() => setShowCancel(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="font-semibold mb-2">Confirm Cancellation</h2>
            <p className="mb-4 text-sm">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end gap-2">
              <button
                disabled={cancelLoading}
                onClick={() => setShowCancel(false)}
                className="px-3 py-1 text-sm rounded-md hover:text-gray-600 transition-colors"
              >
                No, Keep It
              </button>
              <button
                disabled={cancelLoading}
                onClick={handleCancelBooking}
                className="px-3 py-2 text-sm rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                {cancelLoading ? <><Loader2 className="animate-spin" /></> : "Yes, Cancel It"}
              </button>
            </div>
          </div>
        </div> 
      )}
    </div>
  );
}

export default BookingCard;



