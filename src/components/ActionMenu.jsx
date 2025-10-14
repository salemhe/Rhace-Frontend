

import { Eye, Download, X } from 'lucide-react';
import { useEffect } from 'react';



export function ActionMenu({
  isOpen,
  onClose,
  onViewDetails,
  onDownloadInvoice,
  onCancelBooking,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
          <div className="p-6 space-y-3">
            <button
              onClick={onViewDetails}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-lg font-medium text-gray-900">View Details</span>
            </button>

            <button
              onClick={onDownloadInvoice}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-lg font-medium text-gray-900">Download Invoice</span>
            </button>

            <button
              onClick={onCancelBooking}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-lg font-medium text-red-600">Cancel Booking</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
