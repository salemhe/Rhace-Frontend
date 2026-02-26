import Header from "@/components/user/Header";
import PaymentCard, {
  PaymentCardSkeleton,
} from "@/components/user/ui/paymentcard";
import { paymentService } from "@/services/payment.service";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const DUMMY_PAYMENTS = [
  {
    _id: "1",
    reference: "TXN-20240101-001",
    status: "Paid",
    amountPaid: 15000,
    paymentMethod: "Card",
    date: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-15T10:30:00Z",
    vendor: {
      businessName: "Zen Spa & Wellness",
      vendorType: "Spa",
      address: "12 Victoria Island, Lagos",
      profileImages: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
      ],
    },
  },
  {
    _id: "2",
    reference: "TXN-20240102-002",
    status: "Pending",
    amountPaid: 8500,
    paymentMethod: "Bank Transfer",
    date: "2024-01-20T14:00:00Z",
    createdAt: "2024-01-20T14:00:00Z",
    vendor: {
      businessName: "FitLife Gym",
      vendorType: "Gym",
      address: "5 Lekki Phase 1, Lagos",
      profileImages: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      ],
    },
  },
  {
    _id: "3",
    reference: "TXN-20240103-003",
    status: "Failed",
    amountPaid: 22000,
    paymentMethod: "Card",
    date: "2024-02-01T09:15:00Z",
    createdAt: "2024-02-01T09:15:00Z",
    vendor: {
      businessName: "Gourmet Kitchen",
      vendorType: "Restaurant",
      address: "8 Adeola Odeku, Victoria Island",
      profileImages: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      ],
    },
  },
  {
    _id: "4",
    reference: "TXN-20240104-004",
    status: "Paid",
    amountPaid: 5000,
    paymentMethod: "Wallet",
    date: "2024-02-10T16:45:00Z",
    createdAt: "2024-02-10T16:45:00Z",
    vendor: {
      businessName: "Urban Barbers",
      vendorType: "Salon",
      address: "3 Awolowo Road, Ikoyi",
      profileImages: [
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
      ],
    },
  },
  {
    _id: "5",
    reference: "TXN-20240105-005",
    status: "Paid",
    amountPaid: 31500,
    paymentMethod: "Card",
    date: "2024-02-18T11:00:00Z",
    createdAt: "2024-02-18T11:00:00Z",
    vendor: {
      businessName: "Luxe Hotel & Suites",
      vendorType: "Hotel",
      address: "22 Ozumba Mbadiwe, Lagos",
      profileImages: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      ],
    },
  },
];
const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPayments = useMemo(() => {
    return filterStatus === "All"
      ? payments
      : payments.filter((p) => p.status === filterStatus);
  }, [payments, filterStatus]);

  const totalSpent = useMemo(() => {
    return payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amountPaid, 0);
  }, [payments]);

  const chartData = useMemo(() => {
    return payments
      .slice()
      .reverse()
      .map((p) => ({
        date: new Date(p.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amountPaid: p.amountPaid,
      }));
  }, [payments]);

  useEffect(() => {
    const fetchPayments = async () => {
      //   setIsLoading(true);
      try {
        const payments = await paymentService.getPayments();
        setPayments(payments?.length > 0 ? payments : DUMMY_PAYMENTS);
        setIsLoading(false);
      } catch {
        setPayments(DUMMY_PAYMENTS);
      }
    };
    fetchPayments();
  }, []);

  return (
    <>
      <Header />
      <div className="p-4 mt-24 container mx-auto">
        <div className="flex-1 relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment History
              </h1>
              <p className="text-gray-500 mt-1">
                Review your recent lifestyle transactions
              </p>
            </div>

            <div className="hidden sm:block">
              <div className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-4">
                <div className="text-left">
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Total Spent (Monthly)
                  </div>
                  <div className="text-2xl font-bold text-[#0A6E7D]">
                    NGN {totalSpent.toLocaleString()}
                  </div>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <Area
                        type="monotone"
                        dataKey="amountPaid"
                        stroke="#0A6E7D"
                        fill="#0A6E7D33"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {["All", "Paid", "Pending", "Failed"].map((status, i) => (
              <button
                key={i}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filterStatus === status
                    ? "bg-[#0A6E7D] text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#0A6E7D] hover:text-[#0A6E7D]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Payment List */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {isLoading === true
                ? Array.from({ length: 6 }).map((_, i) => (
                    <PaymentCardSkeleton key={i} />
                  ))
                : filteredPayments.map((payment) => (
                    <PaymentCard
                      key={payment._id}
                      payment={payment}
                      onViewDetails={setSelectedPayment}
                    />
                  ))}
            </div>
            {filteredPayments.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="text-gray-400 mb-2">
                  No payments found for this filter
                </div>
                <button
                  onClick={() => setFilterStatus("All")}
                  className="text-[#0A6E7D] font-semibold underline"
                >
                  View all history
                </button>
              </div>
            )}
          </div>
          {selectedPayment && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                <div className="relative h-40 flex-shrink-0">
                  <img
                    src={selectedPayment.vendor.profileImages[0]}
                    alt={selectedPayment.vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-6">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">
                        {selectedPayment.vendor.businessName}
                      </h2>
                      {selectedPayment.vendor.vendorType && (
                        <span className="bg-[#0A6E7D] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                          {selectedPayment.vendor.vendorType}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">
                      {selectedPayment.vendor.address}
                    </p>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
                        Total Payment
                      </div>
                      <div className="text-3xl font-extrabold text-[#0A6E7D]">
                        NGN
                        {selectedPayment.amountPaid.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest ${
                        selectedPayment.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : selectedPayment.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {selectedPayment.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Date & Time
                      </div>
                      <div className="text-xs font-semibold text-gray-800">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Reference
                      </div>
                      <div className="text-xs font-semibold text-gray-800 uppercase tracking-tighter">
                        {selectedPayment.reference}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Payment Method
                      </div>
                      <div className="text-xs font-semibold text-gray-800">
                        {selectedPayment.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 bg-[#0A6E7D] text-white py-3.5 rounded-2xl font-bold hover:bg-[#085a66] transition-all shadow-lg shadow-[#0A6E7D]/20">
                      Download PDF Receipt
                    </button>
                    <button className="px-5 py-3.5 border border-gray-200 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all">
                      Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentsHistory;
