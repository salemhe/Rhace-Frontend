// import Header from "@/components/user/Header";
// import PaymentCard, {
//   PaymentCardSkeleton,
// } from "@/components/user/ui/paymentcard";
// import { paymentService } from "@/services/payment.service";
// import { useEffect, useMemo, useState } from "react";
// import { Area, AreaChart, ResponsiveContainer } from "recharts";

// const DUMMY_PAYMENTS = [
//   {
//     _id: "1",
//     reference: "TXN-20240101-001",
//     status: "Paid",
//     amountPaid: 15000,
//     paymentMethod: "Card",
//     date: "2024-01-15T10:30:00Z",
//     createdAt: "2024-01-15T10:30:00Z",
//     vendor: {
//       businessName: "Zen Spa & Wellness",
//       vendorType: "Spa",
//       address: "12 Victoria Island, Lagos",
//       profileImages: [
//         "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
//       ],
//     },
//   },
//   {
//     _id: "2",
//     reference: "TXN-20240102-002",
//     status: "Pending",
//     amountPaid: 8500,
//     paymentMethod: "Bank Transfer",
//     date: "2024-01-20T14:00:00Z",
//     createdAt: "2024-01-20T14:00:00Z",
//     vendor: {
//       businessName: "FitLife Gym",
//       vendorType: "Gym",
//       address: "5 Lekki Phase 1, Lagos",
//       profileImages: [
//         "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
//       ],
//     },
//   },
//   {
//     _id: "3",
//     reference: "TXN-20240103-003",
//     status: "Failed",
//     amountPaid: 22000,
//     paymentMethod: "Card",
//     date: "2024-02-01T09:15:00Z",
//     createdAt: "2024-02-01T09:15:00Z",
//     vendor: {
//       businessName: "Gourmet Kitchen",
//       vendorType: "Restaurant",
//       address: "8 Adeola Odeku, Victoria Island",
//       profileImages: [
//         "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
//       ],
//     },
//   },
//   {
//     _id: "4",
//     reference: "TXN-20240104-004",
//     status: "Paid",
//     amountPaid: 5000,
//     paymentMethod: "Wallet",
//     date: "2024-02-10T16:45:00Z",
//     createdAt: "2024-02-10T16:45:00Z",
//     vendor: {
//       businessName: "Urban Barbers",
//       vendorType: "Salon",
//       address: "3 Awolowo Road, Ikoyi",
//       profileImages: [
//         "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
//       ],
//     },
//   },
//   {
//     _id: "5",
//     reference: "TXN-20240105-005",
//     status: "Paid",
//     amountPaid: 31500,
//     paymentMethod: "Card",
//     date: "2024-02-18T11:00:00Z",
//     createdAt: "2024-02-18T11:00:00Z",
//     vendor: {
//       businessName: "Luxe Hotel & Suites",
//       vendorType: "Hotel",
//       address: "22 Ozumba Mbadiwe, Lagos",
//       profileImages: [
//         "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
//       ],
//     },
//   },
// ];
// const PaymentsHistory = () => {
//   const [payments, setPayments] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const filteredPayments = useMemo(() => {
//     return filterStatus === "All"
//       ? payments
//       : payments.filter((p) => p.status === filterStatus);
//   }, [payments, filterStatus]);

//   const totalSpent = useMemo(() => {
//     return payments
//       .filter((p) => p.status === "Paid")
//       .reduce((sum, p) => sum + p.amountPaid, 0);
//   }, [payments]);

//   const chartData = useMemo(() => {
//     return payments
//       .slice()
//       .reverse()
//       .map((p) => ({
//         date: new Date(p.date).toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         }),
//         amountPaid: p.amountPaid,
//       }));
//   }, [payments]);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       //   setIsLoading(true);
//       try {
//         const payments = await paymentService.getPayments();
//         setPayments(payments?.length > 0 ? payments : DUMMY_PAYMENTS);
//         setIsLoading(false);
//       } catch {
//         setPayments(DUMMY_PAYMENTS);
//       }
//     };
//     fetchPayments();
//   }, []);

//   return (
//     <>
//       <Header />
//       <div className="p-4 mt-24 container mx-auto">
//         <div className="flex-1 relative">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-semibold sm:font-bold text-gray-900">
//                 Payment History
//               </h1>
//               <p className="text-gray-500 mt-1">
//                 Review your recent lifestyle transactions
//               </p>
//             </div>

//             <div className="hidden sm:block">
//               <div className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-4">
//                 <div className="text-left">
//                   <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
//                     Total Spent (Monthly)
//                   </div>
//                   <div className="text-2xl font-bold text-[#0A6E7D]">
//                     NGN {totalSpent.toLocaleString()}
//                   </div>
//                 </div>
//                 <div className="w-24 h-12">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={chartData}>
//                       <Area
//                         type="monotone"
//                         dataKey="amountPaid"
//                         stroke="#0A6E7D"
//                         fill="#0A6E7D33"
//                         strokeWidth={2}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
//             {["All", "Paid", "Pending", "Failed"].map((status, i) => (
//               <button
//                 key={i}
//                 onClick={() => setFilterStatus(status)}
//                 className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
//                   filterStatus === status
//                     ? "bg-[#0A6E7D] text-white shadow-md"
//                     : "bg-white text-gray-500 border border-gray-200 hover:border-[#0A6E7D] hover:text-[#0A6E7D]"
//                 }`}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>

//           {/* Payment List */}
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {isLoading === true
//                 ? Array.from({ length: 6 }).map((_, i) => (
//                     <PaymentCardSkeleton key={i} />
//                   ))
//                 : filteredPayments.map((payment) => (
//                     <PaymentCard
//                       key={payment._id}
//                       payment={payment}
//                       onViewDetails={setSelectedPayment}
//                     />
//                   ))}
//             </div>
//             {filteredPayments.length === 0 && (
//               <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
//                 <div className="text-gray-400 mb-2">
//                   No payments found for this filter
//                 </div>
//                 <button
//                   onClick={() => setFilterStatus("All")}
//                   className="text-[#0A6E7D] font-semibold underline"
//                 >
//                   View all history
//                 </button>
//               </div>
//             )}
//           </div>
//           {selectedPayment && (
//             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
//               <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
//                 <div className="relative h-40 flex-shrink-0">
//                   <img
//                     src={selectedPayment.vendor.profileImages[0]}
//                     alt={selectedPayment.vendor.businessName}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
//                   <button
//                     onClick={() => setSelectedPayment(null)}
//                     className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                   <div className="absolute bottom-4 left-6">
//                     <div className="flex items-center gap-2">
//                       <h2 className="text-2xl font-bold text-white">
//                         {selectedPayment.vendor.businessName}
//                       </h2>
//                       {selectedPayment.vendor.vendorType && (
//                         <span className="bg-[#0A6E7D] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
//                           {selectedPayment.vendor.vendorType}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-gray-300 text-sm">
//                       {selectedPayment.vendor.address}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
//                   <div className="flex justify-between items-start mb-6">
//                     <div>
//                       <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
//                         Total Payment
//                       </div>
//                       <div className="text-3xl font-extrabold text-[#0A6E7D]">
//                         NGN
//                         {selectedPayment.amountPaid.toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                         })}
//                       </div>
//                     </div>
//                     <div
//                       className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest ${
//                         selectedPayment.status === "Paid"
//                           ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//                           : selectedPayment.status === "Pending"
//                             ? "bg-amber-50 text-amber-700 border-amber-100"
//                             : "bg-rose-50 text-rose-700 border-rose-100"
//                       }`}
//                     >
//                       {selectedPayment.status}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
//                     <div>
//                       <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
//                         Date & Time
//                       </div>
//                       <div className="text-xs font-semibold text-gray-800">
//                         {new Date(selectedPayment.createdAt).toLocaleString()}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
//                         Reference
//                       </div>
//                       <div className="text-xs font-semibold text-gray-800 uppercase tracking-tighter">
//                         {selectedPayment.reference}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
//                         Payment Method
//                       </div>
//                       <div className="text-xs font-semibold text-gray-800">
//                         {selectedPayment.paymentMethod}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-4">
//                     <button className="flex-1 bg-[#0A6E7D] text-white py-3.5 rounded-2xl font-bold hover:bg-[#085a66] transition-all shadow-lg shadow-[#0A6E7D]/20">
//                       Download PDF Receipt
//                     </button>
//                     <button className="px-5 py-3.5 border border-gray-200 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all">
//                       Support
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentsHistory;

import Header from "@/components/user/Header";
import PaymentPage from "@/components/user/ui/Payment";
import { hotelService } from "@/services/hotel.service";
import { paymentService } from "@/services/payment.service";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Smartphone,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AreaChart, ResponsiveContainer, Tooltip } from "recharts";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  Paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    glow: "shadow-emerald-100",
    dot: "#10b981",
    icon: CheckCircle2,
    gradient: "from-emerald-50 to-white",
    pill: "bg-emerald-500",
  },
  Pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    glow: "shadow-amber-100",
    dot: "#f59e0b",
    icon: Clock,
    gradient: "from-amber-50 to-white",
    pill: "bg-amber-400",
  },
  Failed: {
    label: "Failed",
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    glow: "shadow-rose-100",
    dot: "#f43f5e",
    icon: XCircle,
    gradient: "from-rose-50 to-white",
    pill: "bg-rose-500",
  },
};

const normaliseStatus = (s) => {
  if (!s) return "Pending";
  const t = s.toLowerCase().trim();
  if (t === "success") return "Paid";
  if (t === "failed" || t === "fail") return "Failed";
  return "Pending";
};

const getStatus = (s) => STATUS[normaliseStatus(s)] ?? STATUS.Pending;

// ─── Payment method icon ──────────────────────────────────────────────────────
const MethodIcon = ({ method }) => {
  const m = (method || "").toLowerCase();
  if (m.includes("card")) return <CreditCard className="w-3.5 h-3.5" />;
  if (m.includes("bank") || m.includes("transfer"))
    return <Building2 className="w-3.5 h-3.5" />;
  if (m.includes("wallet")) return <Wallet className="w-3.5 h-3.5" />;
  return <Smartphone className="w-3.5 h-3.5" />;
};

// ─── Dummy data ───────────────────────────────────────────────────────────────
const DUMMY_PAYMENTS = [
  {
    _id: "1",
    reference: "TXN-20240101-001",
    status: "Paid",
    amount: 15000,
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
    amount: 8500,
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
    amount: 22000,
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
    amount: 5000,
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
    amount: 31500,
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

// Group payments by date label
const groupByDate = (payments) => {
  const groups = {};
  payments.forEach((p) => {
    const key = fmtDate(p.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });
  return Object.entries(groups);
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 animate-pulse">
      <div className="w-11 h-11 rounded-2xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 bg-gray-100 rounded-full" />
        <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-3.5 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-12 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

// ─── Transaction row ──────────────────────────────────────────────────────────
function TxRow({ payment, onClick, index }) {
  const s = getStatus(payment.status);
  const Icon = s.icon;

  return (
    <button
      onClick={() => onClick(payment)}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50/80 active:bg-gray-100/80 transition-colors duration-150 text-left group"
      style={{ animationDelay: `${index * 35}ms` }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-2xl overflow-hidden ring-1 ring-black/5">
          <img
            src={payment.vendor.profileImages[0]}
            alt={payment.vendor.businessName}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Tiny status dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: s.dot }}
        />
      </div>

      {/* Middle */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-gray-800 truncate leading-tight">
          {payment.vendor.businessName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-gray-400">
            {payment.vendor.vendorType}
          </span>
          <span className="text-gray-200">·</span>
          <span className="text-[11px] text-gray-400">
            {fmtTime(payment.createdAt)}
          </span>
          <span className="text-gray-200">·</span>
          <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
            <MethodIcon method={payment.paymentMethod} />
            <span className="ml-0.5">{payment.paymentMethod}</span>
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[14px] font-bold text-gray-900 tabular-nums">
          {fmt(payment.amount)}
        </span>
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}
        >
          <Icon className="w-2.5 h-2.5" />
          {s.label}
        </span>
      </div>
    </button>
  );
}

// ─── Hero summary strip ───────────────────────────────────────────────────────
function SummaryStrip({ totalSpent, counts, chartData }) {
  return (
    <div
      className="mx-4 mb-4 rounded-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0A6C6D 0%, #0d8f90 60%, #0A6C6D 100%)",
      }}
    >
      {/* Top section */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-1">
          Total Spent
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[28px] font-extrabold text-white tracking-tight leading-none">
              {fmt(totalSpent)}
            </p>
            <p className="text-[12px] text-white/50 mt-1">
              Across all paid transactions
            </p>
          </div>
          {/* Mini chart */}
          <div className="w-28 h-12 opacity-70">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.7)",
                    border: "none",
                    color: "#fff",
                  }}
                  formatter={(v) => [fmt(v), ""]}
                  labelFormatter={() => ""}
                />
                {/* <Area type="monotone" dataKey="amountPaid" stroke="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.15)" strokeWidth={2} dot={false} /> */}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom stat pills */}
      <div className="flex border-t border-white/10">
        {[
          { label: "Paid", count: counts.Paid, color: "#10b981" },
          { label: "Pending", count: counts.Pending, color: "#f59e0b" },
          { label: "Failed", count: counts.Failed, color: "#f43f5e" },
        ].map((item, i) => (
          <div
            key={item.label}
            className={`flex-1 flex flex-col items-center py-3 ${i < 2 ? "border-r border-white/10" : ""}`}
          >
            <span className="text-[18px] font-bold text-white">
              {item.count}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-white/50 font-medium">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
function FilterTabs({ active, onChange }) {
  const tabs = ["All", "Paid", "Pending", "Failed"];
  return (
    <div className="flex items-center gap-2 px-4 mb-4 overflow-x-auto pb-0.5">
      {tabs.map((t) => {
        const s = STATUS[t];
        const isActive = active === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? t === "All"
                  ? "bg-[#0A6C6D] text-white border-[#0A6C6D] shadow-md shadow-[#0A6C6D]/20"
                  : `${s.bg} ${s.text} ${s.border} shadow-sm`
                : "bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600"
            }`}
          >
            {s && isActive && <s.icon className="w-3 h-3" />}
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ─── Detail drawer ────────────────────────────────────────────────────────────
function DetailDrawer({ payment, onClose, setPopopen }) {
  const s = getStatus(payment.status);
  const Icon = s.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "drawerUp 0.35s cubic-bezier(.32,1.25,.64,1) forwards",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Vendor hero */}
        <div className="relative h-36 flex-shrink-0 mx-4 mt-2 rounded-2xl overflow-hidden">
          <img
            src={payment.vendor.profileImages[0]}
            alt={payment.vendor.businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white font-bold text-base leading-tight">
              {payment.vendor.businessName}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {payment.vendor.address}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6">
          {/* Amount + status */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Amount
              </p>
              <p className="text-[32px] font-extrabold text-gray-900 leading-none tracking-tight">
                {fmt(payment.amount)}
              </p>
            </div>
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border mt-1 ${s.bg} ${s.text} ${s.border}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </span>
          </div>

          {/* Detail tiles */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[
              { label: "Date", value: fmtDate(payment.createdAt) },
              { label: "Time", value: fmtTime(payment.createdAt) },
              { label: "Method", value: payment.paymentMethod },
              { label: "Type", value: payment.vendor.vendorType },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-2xl px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  {label}
                </p>
                <p className="text-[13px] font-semibold text-gray-800">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Reference */}
          <div className="bg-gray-50 rounded-2xl px-3.5 py-3 mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Reference
            </p>
            <p className="text-[12px] font-semibold text-gray-700 font-mono tracking-tight">
              {payment.reference}
            </p>
          </div>

          {/* Actions */}
          <div
            className={`grid ${s.label === "Pending" ? "grid-cols-2" : "grid-cols-1"} gap-2.5`}
          >
            <button className="px-2 flex items-center justify-center gap-2 bg-[#0A6C6D] hover:bg-[#085a66] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-[#0A6C6D]/25">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>

            {s.label === "Pending" && (
              <button
                onClick={() => {
                  setPopopen();
                  // onClose();
                }}
                className="px-2 flex items-center justify-center gap-2 border border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-500 py-3.5 rounded-2xl font-bold text-sm transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Make Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [paymentForCheckout, setPaymentForCheckout] = useState(null);
  const [popopen, setPopopen] = useState(false);
  const navigate = useNavigate();

  // ── All backend logic preserved unchanged ──
  const filteredPayments = useMemo(() => {
    return filterStatus === "All"
      ? payments
      : payments.filter((p) => normaliseStatus(p.status) === filterStatus);
  }, [payments, filterStatus]);

  const totalSpent = useMemo(() => {
    return payments
      .filter((p) => normaliseStatus(p.status) === "Paid")
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const counts = useMemo(
    () => ({
      Paid: payments.filter((p) => normaliseStatus(p.status) === "Paid").length,
      Pending: payments.filter((p) => normaliseStatus(p.status) === "Pending")
        .length,
      Failed: payments.filter((p) => normaliseStatus(p.status) === "Failed")
        .length,
    }),
    [payments],
  );

  const chartData = useMemo(() => {
    return payments
      .slice()
      .reverse()
      .map((p) => ({
        date: fmtDate(p.date),
        amountPaid: p.amount,
      }));
  }, [payments]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const result = await paymentService.getPayments();
        setPayments(result?.length > 0 ? result : DUMMY_PAYMENTS);
        setIsLoading(false);
      } catch {
        setPayments(DUMMY_PAYMENTS);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchRoomTypesData = async () => {
      try {
        const res = await hotelService.getpayment();
        console.log(res);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to fetch rooms");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomTypesData();
  }, []);
  const grouped = useMemo(
    () => groupByDate(filteredPayments),
    [filteredPayments],
  );
  console.log(selectedPayment);
  return (
    <>
      <style>{`
        @keyframes drawerUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowFade {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .row-anim { animation: rowFade 0.25s ease forwards; opacity: 0; }
      `}</style>

      <Header />

      <div className="min-h-screen bg-[#f5f6f8]">
        <div className="max-w-lg mx-auto pt-24 pb-20">
          {/* ── Page header ── */}
          <div className="flex items-center gap-3 px-4 mb-6 mt-5">
            <button
              onClick={() => navigate("/")}
              className="w-9 h-9 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-2xl" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 leading-tight">
                Payment History
              </h1>
              <p className="text-[12px] text-gray-400 leading-tight">
                Your lifestyle transactions
              </p>
            </div>
          </div>

          {/* ── Summary ── */}
          <SummaryStrip
            totalSpent={totalSpent}
            counts={counts}
            chartData={chartData}
          />

          {/* ── Filters ── */}
          <FilterTabs active={filterStatus} onChange={setFilterStatus} />

          {/* ── Transaction groups ── */}
          <div className="mx-4">
            {isLoading ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 flex flex-col items-center text-center px-6">
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <XCircle className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  No transactions found
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  Try a different filter
                </p>
                <button
                  onClick={() => setFilterStatus("All")}
                  className="text-[#0A6C6D] font-semibold text-sm hover:underline"
                >
                  View all
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {grouped.map(([dateLabel, items]) => (
                  <div
                    key={dateLabel}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Date header */}
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        {dateLabel}
                      </p>
                    </div>
                    {/* Rows */}
                    <div className="divide-y divide-gray-50/80">
                      {items.map((payment, i) => (
                        <div
                          key={payment._id}
                          className="row-anim"
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <TxRow
                            payment={payment}
                            onClick={setSelectedPayment}
                            index={i}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail drawer ── */}
      {selectedPayment && (
        <DetailDrawer
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          setPopopen={() =>{
            setPopopen(true) 
  setPaymentForCheckout(selectedPayment)}
}
        />
      )}
      {popopen && paymentForCheckout && (
  <PaymentPage
    booking={paymentBookingAdapter(paymentForCheckout)}
    setPopupOpen={setPopopen}
  />
)}
    </>
  );
};

export default PaymentsHistory;

const paymentBookingAdapter = (p) => ({
  vendor: p?.metadata?.vendorId || p?.vendor?._id,
  reservationType: p?.metadata?.reservationType,
  location: p?.metadata?.location,
  customerName: p?.metadata?.customerName || p?.customerName,
  customerEmail: p?.metadata?.customerEmail || p?.email,
  customerPhone: p?.metadata?.customerPhone,
  amount: p?.amount,
  totalAmount: p?.amount,
  resId: p?.booking,
  partPaid: p?.partPaid,
  payLater: p?.payLater,
});