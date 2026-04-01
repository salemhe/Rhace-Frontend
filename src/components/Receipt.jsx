import { Check, Mail, Clock, Download, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import SuccessGif from "@/public/images/success.gif";

const Receipt = ({ 
  reservation, 
  payment, 
  type = "hotel", // hotel|restaurant|club
  onClose 
}) => {
  const navigate = useNavigate();
  const { room } = reservation || {};
  const isPayLater = reservation?.payLater;

  const formatPrice = (price) => `₦${Number(price || 0).toLocaleString()}`;
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const handleViewBookings = () => {
    navigate('/bookings');
    onClose?.();
  };

  const handlePrintReceipt = () => {
    window.print();
    toast.success('Print dialog opened - Receipt ready to print');
  };

  const handleDownloadReceipt = () => {
    // Future: Generate PDF or copy to clipboard
    navigator.clipboard.writeText(JSON.stringify({ reservation, payment }, null, 2));
    toast.success('Receipt details copied to clipboard!');
  };

  if (!reservation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 md:px-6 print:bg-white print:shadow-none print:backdrop-blur-none">
      <div className="max-w-4xl mx-auto print:max-w-[8.5in] print:mx-0"> 
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center relative mb-8">
            <div className="w-24 h-24 bg-green-50/80 backdrop-blur-sm rounded-3xl flex items-center justify-center p-2 mx-auto relative">
              <img src={SuccessGif} alt="Success" className="w-20 h-20 absolute z-0" />
              <div className="w-16 h-16 bg-[#37703F] rounded-2xl z-10 flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Reservation Confirmed!
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            {isPayLater 
              ? "Your booking is secured. Pay remaining balance on arrival." 
              : "Payment successful! Your reservation details below."
            }
          </p>
        </div>

        {/* Key Details Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Location</h3>
                <p className="text-sm text-gray-600">{reservation.location}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-[#0A6C6D]">{reservation.resId}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Reservation ID</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Dates</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Check-in: {formatDate(reservation.checkInDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Check-out: {formatDate(reservation.checkOutDate)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Guests</h3>
            <p className="text-3xl font-bold text-[#0A6C6D]">{reservation.guests}</p>
            <p className="text-sm text-gray-600">{type === 'hotel' ? 'Guests' : 'People'}</p>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl overflow-hidden mb-12">
          <div className="divide-y divide-gray-100">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0A6C6D] to-teal-700 rounded-2xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Booking Summary</h2>
                  <p className="text-gray-600">Review your confirmed reservation</p>
                </div>
              </div>

              {type === 'hotel' && room && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50/50 rounded-2xl">
                  <div>
                    <h4 className="font-semibold mb-3">Room Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Type:</span>
                        <span className="font-medium">{room.name || 'Standard Room'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span>{room.adultsCapacity || reservation.guests} guests</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price/Night:</span>
                        <span className="font-semibold text-[#0A6C6D]">
                          {formatPrice(room.pricePerNight * (1 - (room.discount || 0)/100))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Payment</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Total Amount:</span>
                        <span className="font-semibold">{formatPrice(reservation.totalAmount)}</span>
                      </div>
                      {isPayLater && (
                        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-xl">
                          💳 Balance due on arrival
                        </div>
                      )}
                      {!isPayLater && payment && (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                          ✅ Paid via Paystack - Ref: {payment.reference?.slice(-8)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info & Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-3xl border border-teal-100">
            <h3 className="font-semibold text-xl text-[#0A6C6D] mb-4">Next Steps</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-2xl">
                <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 shrink-0" />
                <span>Confirmation email sent to {reservation.customerEmail}</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-2xl">
                <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 shrink-0" />
                <span>Arrive 15 minutes early for smooth check-in</span>
              </div>
              {isPayLater && (
                <div className="flex items-start gap-3 p-3 bg-orange-50/50 rounded-2xl border border-orange-200">
                  <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                  <span>Balance payment required at venue</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 shadow-xl">
            <h3 className="font-semibold text-lg mb-6">Need Help?</h3>
            <div className="space-y-4 print:hidden">
              <Button 
                onClick={handlePrintReceipt}
                variant="outline" 
                className="w-full justify-start h-12 border-2 border-gray-200 hover:border-gray-300"
              >
                <Printer className="w-4 h-4 mr-2" />
                🖨️ Print Receipt
              </Button>
              <Button 
                onClick={handleDownloadReceipt}
                variant="outline" 
                className="w-full justify-start h-12 border-2 border-gray-200 hover:border-gray-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Copy Details
              </Button>
              <Button 
                onClick={handleViewBookings}
                className="w-full h-12 bg-[#0A6C6D] hover:bg-teal-800 text-white shadow-lg"
              >
                View My Bookings
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 py-8 border-t border-gray-200">
          <p>Managed by Rhace • Secure &amp; Verified Payments</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;

