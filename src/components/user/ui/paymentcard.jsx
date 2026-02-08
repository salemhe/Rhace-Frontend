import React from 'react';

const PaymentCard = ({ payment, onViewDetails }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const formattedDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(payment.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 hover:border-[#0A6E7D]/20 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img src={payment.vendor.profileImages[0]} alt={payment.vendor.businessName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base text-gray-900 font-semibold truncate group-hover:text-[#0A6E7D] transition-colors flex items-center gap-2">
              {payment.vendor.businessName}
              {payment.vendor.vendorType && (
                <span className="text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-wider inline">
                  {payment.vendor.vendorType}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-gray-400">{formattedDate}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                {payment.createdAt && `@ ${formattedTime}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right flex gap-4">
            <div className="text-[#0A6E7D] font-bold text-base sm:text-lg">
              NGN {payment.amountPaid.toLocaleString('en-NG', { 
                style: 'currency', 
                currency: 'NGN' 
              })}
            </div>
            <div className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-[9px] sm:text-[10px] font-bold border ${getStatusStyle(payment.status)} uppercase tracking-wider`}>
              {payment.status}
            </div>
          </div>

          <button 
            onClick={() => onViewDetails(payment)}
            className="p-2 text-gray-400 hover:text-[#0A6E7D] hover:bg-gray-50 rounded-lg transition-all shrink-0"
            aria-label="View details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
