import Header from "@/components/user/Header";
import PaymentPage from "@/components/user/ui/Payment";
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
import { useCallback, useEffect, useMemo, useState } from "react";
// import { useWebSocket } from "@/contexts/WebSocketContext";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  if (t === "success" || t === "paid") return "Paid";
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
      <div className="w-11 h-11 rounded-2xl bg-gray-100 shrink-0" />
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
      <div className="relative shrink-0">
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
      <div className="flex flex-col items-end gap-1 shrink-0">
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
function DetailDrawer({ payment, onClose, openCheckout }) {
  const s = getStatus(payment.status);
  const Icon = s.icon;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm rounded-t-4xl sm:rounded-[2rem] overflow-hidden shadow-2xl max-h-[88vh] flex flex-col"
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
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
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
              { label: "Method", value: payment.paymentMethod || "Not specified" },
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
              {payment.paystackReference ? payment.paystackReference.toUpperCase() : "Not specified"}
            </p>
          </div>

          {/* Actions */}
          <div
            className={`grid ${s.label === "Pending" ? "grid-cols-2" : "grid-cols-1"} gap-2.5`}
          >
            <button
              className={` ${s.label === "Pending" ? "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-500" : "bg-[#0A6C6D] hover:bg-[#085a66] text-white shadow-[#0A6C6D]/25"} flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg `}
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            {s.label === "Pending" && (
              <button
                onClick={() => openCheckout(payment)}
                className="bg-[#0A6C6D] hover:bg-[#085a66] text-white shadow-[#0A6C6D]/25 px-2 flex items-center justify-center gap-2 border py-3.5 rounded-2xl font-bold text-sm transition-all"
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
  const [paymentForCheckout, setPaymentForCheckout] = useState(null);
  const [popopen, setPopopen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
        date: fmtDate(p.createdAt),
        amountPaid: p.amount,
      }));
  }, [payments]);

  const fetchPayments = useCallback(async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      const result = await paymentService.getPayments();
      setPayments(result);
    } catch (error) {
      console.error('Payments fetch failed:', error);
//     toast.error('Failed to refresh payments');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  // Polling + WebSocket
  useEffect(() => {
    fetchPayments(); // Initial load

    const interval = setInterval(fetchPayments, 300000); // 5-minute poll

    return () => {
      clearInterval(interval);
    };
  }, [fetchPayments]);

  const grouped = useMemo(
    () => groupByDate(filteredPayments),
    [filteredPayments],
  );
  const openCheckout = (payment) => {
    setPaymentForCheckout(payment);
    setSelectedPayment(null); // close drawer
    setPopopen(true); // open payment modal
  };
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
              className="w-9 h-9 p-3 border rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 shrink-0 h-4 text-2xl" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] font-bold text-gray-900 leading-tight">
                Payment History
              </h1>
              <p className="text-[12px] text-gray-400 leading-tight">
                Your lifestyle transactions {isRefreshing && '(refreshing...)'}
              </p>
            </div>
            <button
              onClick={fetchPayments}
              disabled={isRefreshing}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#0A6C6D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Refresh payments"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
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
          openCheckout={openCheckout}
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
  roomId: p?.metadata?.roomId,
  checkInDate: p?.metadata?.checkInDate,
  checkOutDate: p?.metadata?.checkOutDate,
  guests: p?.metadata?.guests,

  amount: p?.amount,
  totalAmount: p?.amount,
  resId: p?.booking,
  partPaid: p?.partPaid,
  payLater: p?.payLater,
});
