import { ChevronRight } from "lucide-react";

// interface Vendor {
//   businessName: string;
//   vendorType?: string;
//   profileImages: string[];
// }

// interface Payment {
//   id: string;
//   vendor: Vendor;
//   amountPaid: number;
//   status: 'Success' | 'Pending' | 'Failed';
//   createdAt: string;
// }

// interface PaymentCardProps {
//   payment: Payment;
//   onViewDetails: (payment: Payment) => void;
// }

const PaymentCard = ({ payment, onViewDetails }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Success":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
        };
      case "Pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          dot: "bg-amber-500",
        };
      case "Failed":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          dot: "bg-gray-500",
        };
    }
  };

  const statusConfig = getStatusConfig(payment.status);

  const formattedDate = new Date(payment.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const formattedTime = new Date(payment.createdAt).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const formattedAmount = payment.amountPaid.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      onClick={() => onViewDetails(payment)}
      className="group bg-white rounded-xl border border-gray-200  transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="relative h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={payment.vendor.profileImages[0]}
          alt={payment.vendor.businessName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div
          className={`absolute top-3 right-3 ${statusConfig.bg} ${statusConfig.text} px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md`}
        >
          <div
            className={`w-2 h-2 ${statusConfig.dot} rounded-full animate-pulse`}
          />
          <span className="text-xs font-semibold">{payment.status}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2 flex-1">
              {payment.vendor.businessName}
            </h3>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 shrink-0 mt-0.5" />
          </div>
          {payment.vendor.vendorType && (
            <span className="inline-block text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              {payment.vendor.vendorType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <span>{formattedDate}</span>
          <span className="text-gray-300">•</span>
          <span>{formattedTime}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium mb-1">
                Amount
              </span>
              <span className="text-xl sm:text-2xl font-bold text-teal-700">
                ₦{formattedAmount}
              </span>
            </div>
            <div className="text-xs text-gray-400">View details →</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;

export const PaymentCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-pulse">
      <div className="relative h-32 sm:h-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden" />

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded-md w-3/4" />
              <div className="h-3 bg-gray-200 rounded-md w-1/2" />
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded shrink-0" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 bg-gray-200 rounded-md w-24" />
          <div className="w-1 h-1 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded-md w-16" />
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded-md w-12" />
              <div className="h-6 bg-gray-200 rounded-md w-32" />
            </div>
            <div className="h-3 bg-gray-200 rounded-md w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
