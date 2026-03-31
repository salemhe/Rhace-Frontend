import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@/components/ui/dialog";
import { StatCard } from "@/components/Statcard";
import {
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Shield,
  Copy,
  RefreshCw,
  Activity,
  Zap,
  Lock,
} from "lucide-react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getPayouts,
  getVendorsEarnings,
  getVendorEarnings,
  getVendors,
  initiatePayout,
  approvePayout,
  getDashboardKPIs,
  getRevenueTrends,
  getTotalEarnings,
  getPaystackBalance,
  getPaystackTransactions,
  getPaystackTransactionStats,
  getAdminEarnings,
  getSuccessfulPaymentsCount,
} from "@/services/admin.service";
import { useWebSocket } from "@/contexts/WebSocketContext";

const earningsData = [
  { date: "Jan 1", value: 150000 },
  { date: "Jan 7", value: 180000 },
  { date: "Jan 14", value: 250000 },
  { date: "Jan 21", value: 220000 },
  { date: "Jan 28", value: 350000 },
  { date: "Feb 4", value: 380000 },
  { date: "Feb 11", value: 420000 },
  { date: "Feb 18", value: 400000 },
];

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const loadPaystackStats = async (setPaystackStats, setPaystackBalance) => {
  try {
    setPaystackStats(prev => ({ ...prev, loading: true }));
    setPaystackError(null);
    const transactionsRes = await getPaystackTransactions({ perPage: 100 });
    let transactions = [];
    if (!transactionsRes || typeof transactionsRes.data !== 'object') {
      throw new Error('Unexpected Paystack transactions response');
    }
    if (Array.isArray(transactionsRes.data)) {
      transactions = transactionsRes.data;
    } else if (transactionsRes.data.data && Array.isArray(transactionsRes.data.data)) {
      transactions = transactionsRes.data.data;
    } else if (transactionsRes.data.transactions && Array.isArray(transactionsRes.data.transactions)) {
      transactions = transactionsRes.data.transactions;
    }
    const startOfWeek = getStartOfWeek();
    const startOfToday = getStartOfToday();
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    let totalEarnings = 0, weeklyEarnings = 0, todayEarnings = 0, completedPayments = 0;
    let lastWeekEarnings = 0, yesterdayEarnings = 0, lastWeekCount = 0, yesterdayCount = 0;
    transactions.forEach(tx => {
      const status = tx.status?.toLowerCase();
      if (status !== 'success' && status !== 'successful') return;
      const amount = Number(tx.amount || tx.amountPaid || tx.value || 0);
      const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
      if (!txDate) return;
      totalEarnings += amount;
      completedPayments++;
      if (txDate >= startOfWeek) weeklyEarnings += amount;
      if (txDate >= startOfLastWeek && txDate < startOfWeek) { lastWeekEarnings += amount; lastWeekCount++; }
      if (txDate >= startOfToday) todayEarnings += amount;
      if (txDate >= startOfYesterday && txDate < startOfToday) { yesterdayEarnings += amount; yesterdayCount++; }
    });
    try {
      const balanceRes = await getPaystackBalance();
      if (typeof balanceRes?.data === 'string' && !balanceRes.data.trim().startsWith('{')) {
        throw new Error(`unexpected paystack balance response: ${balanceRes.data.slice(0, 200)}`);
      }
      const balanceData = balanceRes?.data?.data || balanceRes?.data || {};
      setPaystackBalance({
        availableBalance: balanceData.availableBalance || balanceData.balance || 0,
        pendingBalance: balanceData.pendingBalance || 0,
        totalBalance: balanceData.balance || totalEarnings,
        lastUpdated: new Date()
      });
    } catch (balanceError) {
      console.warn("Failed to fetch Paystack balance:", balanceError);
      setPaystackBalance(prev => ({ ...prev, totalBalance: totalEarnings, lastUpdated: new Date() }));
    }
    const weeklyChange = lastWeekEarnings > 0 ? ((weeklyEarnings - lastWeekEarnings) / lastWeekEarnings) * 100 : 0;
    const todayChange = yesterdayEarnings > 0 ? ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100 : 0;
    const completedChange = lastWeekCount > 0 ? ((completedPayments - lastWeekCount) / lastWeekCount) * 100 : 0;
    setPaystackStats({
      totalEarnings, weeklyEarnings,
      weeklyEarningsChange: weeklyChange, weeklyEarningsTrend: weeklyChange >= 0 ? 'up' : 'down',
      todayEarnings,
      todayEarningsChange: todayChange, todayEarningsTrend: todayChange >= 0 ? 'up' : 'down',
      completedPayments,
      completedPaymentsChange: completedChange, completedPaymentsTrend: completedChange >= 0 ? 'up' : 'down',
      loading: false, lastUpdated: new Date()
    });
  } catch (error) {
    console.error("Failed to load Paystack stats:", error);
    setPaystackError(error.message || String(error));
    setPaystackStats(prev => ({ ...prev, loading: false }));
  }
};

// ─── Redesigned Payment Status Card ───────────────────────────────────────────
function PaymentStatusCard({ paystackBalance, successRate = 98.5, transactionCount = 1284 }) {
  const available = paystackBalance.availableBalance || 3216;
  const pending = paystackBalance.pendingBalance || 482;
  const totalVol = (paystackBalance.totalBalance * 2.5) || 9245;
  const availPct = Math.round((available / (available + pending)) * 100);
  const pendPct = 100 - availPct;

  const miniSparkData = [40, 65, 45, 80, 60, 90, 75, 98];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #111827 50%, #0d1117 100%)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Subtle grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          height: "2px",
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 100%)",
        }}
      />

      {/* Header row */}
      <div
        style={{
          padding: "16px 20px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={15} color="#818cf8" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#f1f5f9", letterSpacing: "0.01em" }}>
              System status
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
              All payment systems operational
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#4ade80",
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: "20px",
              padding: "3px 10px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#4ade80",
                display: "inline-block",
                boxShadow: "0 0 6px #4ade80",
              }}
            />
            Live
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 500,
              color: "#94a3b8",
              background: "rgba(148,163,184,0.06)",
              border: "1px solid rgba(148,163,184,0.12)",
              borderRadius: "20px",
              padding: "3px 10px",
            }}
          >
            <Lock size={10} />
            Secure
          </span>
        </div>
      </div>

      {/* 3-stat grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Total Volume */}
        <div
          style={{
            padding: "16px 18px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
          }}
        >
          <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Total volume
          </p>
          <p style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
            ₦{totalVol.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 9L5 5L8 7L10 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>+15.3%</span>
          </div>
          {/* mini spark */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", marginTop: "10px", height: "20px" }}>
            {miniSparkData.map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(v / 100) * 20}px`,
                  background: i === miniSparkData.length - 1
                    ? "#6366f1"
                    : "rgba(99,102,241,0.25)",
                  borderRadius: "2px",
                  transition: "height 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div
          style={{
            padding: "16px 18px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Transactions
          </p>
          <p style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
            {transactionCount.toLocaleString()}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 9L5 5L8 7L10 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>+8.2%</span>
          </div>
          {/* Donut ring visual */}
          <div style={{ marginTop: "10px" }}>
            <svg width="40" height="20" viewBox="0 0 40 20">
              <rect x="0" y="8" width="38" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
              <rect x="0" y="8" width={`${38 * 0.82}`} height="4" rx="2" fill="#8b5cf6" />
            </svg>
          </div>
        </div>

        {/* Success Rate */}
        <div style={{ padding: "16px 18px" }}>
          <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Success rate
          </p>
          <p style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
            {successRate}%
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#4ade80" strokeWidth="1.2" />
              <path d="M4 6L5.5 7.5L8 5" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>Excellent</span>
          </div>
          {/* Circle arc */}
          <div style={{ marginTop: "10px" }}>
            <svg width="40" height="20" viewBox="0 0 40 20">
              <path d="M4 18 A16 16 0 0 1 36 18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" strokeLinecap="round" />
              <path d="M4 18 A16 16 0 0 1 36 18" fill="none" stroke="#06b6d4"
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${Math.PI * 16 * (successRate / 100)} ${Math.PI * 16}`}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Balance section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* Available */}
        <div
          style={{
            padding: "16px 18px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glow accent */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(74,222,128,0.06)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wallet size={13} color="#4ade80" />
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#4ade80",
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: "12px",
                padding: "2px 8px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Instant
            </span>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#475569", fontWeight: 500 }}>Available</p>
          <p style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 700, color: "#f1f5f9" }}>
            ₦{available.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          {/* progress bar */}
          <div style={{ height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${availPct}%`,
                background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                borderRadius: "99px",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
            <span style={{ fontSize: "10px", color: "#475569" }}>Ready for payout</span>
            <span style={{ fontSize: "10px", color: "#4ade80", fontWeight: 600 }}>{availPct}%</span>
          </div>
        </div>

        {/* Pending */}
        <div
          style={{
            padding: "16px 18px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(251,191,36,0.05)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock size={13} color="#fbbf24" />
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#fbbf24",
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.15)",
                borderRadius: "12px",
                padding: "2px 8px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              24–48h
            </span>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: "11px", color: "#475569", fontWeight: 500 }}>Pending</p>
          <p style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 700, color: "#f1f5f9" }}>
            ₦{pending.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          <div style={{ height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${pendPct}%`,
                background: "linear-gradient(90deg, #fbbf24, #f97316)",
                borderRadius: "99px",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
            <span style={{ fontSize: "10px", color: "#475569" }}>Processing</span>
            <span style={{ fontSize: "10px", color: "#fbbf24", fontWeight: 600 }}>{pendPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── extractArray helper ──────────────────────────────────────────────────────
function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
}

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("earning");
  const [historyFilter, setHistoryFilter] = useState("All");
  const [vendorsEarnings, setVendorsEarnings] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [filteredPayoutHistory, setFilteredPayoutHistory] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [dashboardKPIs, setDashboardKPIs] = useState({});
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [loadingKPIs, setLoadingKPIs] = useState(false);
  const [paystackBalance, setPaystackBalance] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    totalBalance: 0,
    lastUpdated: new Date()
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: "Zenith Bank",
    accountNumber: "••••••123456",
    accountName: "Joseph Eyebiokun",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempBankDetails, setTempBankDetails] = useState({ ...bankDetails });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [tempAddDetails, setTempAddDetails] = useState({ bankName: "", accountNumber: "", accountName: "" });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [vendors, setVendors] = useState([]);
  const { subscribe, unsubscribe } = useWebSocket();
  const [paystackStats, setPaystackStats] = useState({
    totalEarnings: 0, weeklyEarnings: 0, weeklyEarningsChange: 0, weeklyEarningsTrend: 'up',
    todayEarnings: 0, todayEarningsChange: 0, todayEarningsTrend: 'up',
    completedPayments: 0, completedPaymentsChange: 0, completedPaymentsTrend: 'up', loading: false
  });
  const [paystackError, setPaystackError] = useState(null);
  const [adminEarnings, setAdminEarnings] = useState({
    totalGrossAmount: 0, totalVendorCommission: 0, totalPaystackCommission: 0,
    totalAdminEarnings: 0, totalPayments: 0, averagePaymentAmount: 0, vendorBreakdown: [], loading: false
  });
  const [successfulPayments, setSuccessfulPayments] = useState({
    totalSuccessful: 0, totalFailed: 0, totalPending: 0, totalCancelled: 0,
    totalAllPayments: 0, successRate: "0%", byPaymentMethod: [], byVendorType: [], loading: false
  });

  const fetchPaystackStats = async () => {
    await loadPaystackStats(setPaystackStats, setPaystackBalance);
  };

  const loadAdminEarnings = async (params = {}) => {
    try {
      setAdminEarnings(prev => ({ ...prev, loading: true }));
      const res = await getAdminEarnings(params);
      const data = res?.data?.data || res?.data || res || {};
      setAdminEarnings({
        totalGrossAmount: data.summary?.totalGrossAmount || 0,
        totalVendorCommission: data.summary?.totalVendorCommission || 0,
        totalPaystackCommission: data.summary?.totalPaystackCommission || 0,
        totalAdminEarnings: data.summary?.totalAdminEarnings || 0,
        totalPayments: data.summary?.totalPayments || 0,
        averagePaymentAmount: data.summary?.averagePaymentAmount || 0,
        vendorBreakdown: data.vendorBreakdown || [],
        loading: false
      });
      setDashboardKPIs(prev => ({
        ...prev,
        totalEarnings: data.summary?.totalAdminEarnings || prev.totalEarnings,
        totalGrossAmount: data.summary?.totalGrossAmount || prev.totalGrossAmount,
        totalVendorCommission: data.summary?.totalVendorCommission || prev.totalVendorCommission,
        totalPaystackCommission: data.summary?.totalPaystackCommission || prev.totalPaystackCommission
      }));
    } catch (error) {
      console.error("Failed to load admin earnings:", error);
      setAdminEarnings(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchPayoutStats = async () => {
    try {
      const [totalRes, pendingRes, successfulRes, lastRes] = await Promise.allSettled([
        getPayouts({}),
        getPayouts({ status: 'pending' }),
        getPayouts({ status: 'completed' }),
        getPayouts({ status: 'completed', sort: '-paidAt', limit: 1 })
      ]);
      const totalData = totalRes.status === 'fulfilled' ? extractArray(totalRes.value?.data) : [];
      const pendingData = pendingRes.status === 'fulfilled' ? extractArray(pendingRes.value?.data) : [];
      const successfulData = successfulRes.status === 'fulfilled' ? extractArray(successfulRes.value?.data) : [];
      const lastData = lastRes.status === 'fulfilled' ? extractArray(lastRes.value?.data) : [];
      const totalPayouts = totalData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const pendingPayouts = pendingData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const successfulPayoutsCount = successfulData.length;
      const lastPayout = lastData[0]?.amount ? Number(lastData[0].amount) : 0;
      setDashboardKPIs(prev => ({
        ...prev,
        totalPayouts, totalPayoutsChange: '+0% from last year', totalPayoutsTrend: 'up',
        pendingPayouts, pendingPayoutsChange: '+0% vs last week', pendingPayoutsTrend: 'up',
        successfulPayouts: successfulPayoutsCount, successfulPayoutsChange: '+0% vs last week', successfulPayoutsTrend: 'up',
        lastPayout, lastPayoutChange: '+0% vs last week', lastPayoutTrend: 'up'
      }));
    } catch (error) {
      console.error('Failed to fetch payout stats:', error);
    }
  };

  const loadSuccessfulPayments = async (params = {}) => {
    try {
      setSuccessfulPayments(prev => ({ ...prev, loading: true }));
      const res = await getSuccessfulPaymentsCount(params);
      const data = res?.data?.data || res?.data || res || {};
      setSuccessfulPayments({
        totalSuccessful: data.summary?.totalSuccessful || 0,
        totalFailed: data.summary?.totalFailed || 0,
        totalPending: data.summary?.totalPending || 0,
        totalCancelled: data.summary?.totalCancelled || 0,
        totalAllPayments: data.summary?.totalAllPayments || 0,
        successRate: data.summary?.successRate || "0%",
        byPaymentMethod: data.byPaymentMethod || [],
        byVendorType: data.byVendorType || [],
        loading: false
      });
      setDashboardKPIs(prev => ({
        ...prev,
        completedPayments: data.summary?.totalSuccessful || prev.completedPayments
      }));
    } catch (error) {
      console.error("Failed to load successful payments:", error);
      setSuccessfulPayments(prev => ({ ...prev, loading: false }));
    }
  };

  const loadPayouts = async (vendorsList = null) => {
    try {
      setLoadingPayouts(true);
      let currentVendors = [];
      try {
        const res = await getVendors();
        let loadedVendors = [];
        if (Array.isArray(res.data)) loadedVendors = res.data;
        else if (res.data && Array.isArray(res.data.data)) loadedVendors = res.data.data;
        else if (res.data && Array.isArray(res.data.vendors)) loadedVendors = res.data.vendors;
        else loadedVendors = extractArray(res.data);
        if (loadedVendors.length > 0) { currentVendors = loadedVendors; setVendors(currentVendors); }
      } catch (e) {
        console.error("Failed to load vendors for payout enrichment", e);
        currentVendors = vendorsList || vendors;
      }
      if (currentVendors.length === 0 && vendorsEarnings.length > 0) {
        currentVendors = vendorsEarnings.map(v => ({ id: v.id, _id: v.id, name: v.name, businessName: v.name }));
      }
      const res = await getPayouts({ page: 1, limit: 20, _t: Date.now() });
      const payload = res?.data;
      const list = Array.isArray(payload) ? payload : payload?.data || payload?.items || payload?.results || [];
      const enrichedPayouts = (Array.isArray(list) ? list : []).map((payout) => {
        const vendorId = payout.vendorId || payout.vendor;
        const vendor = currentVendors.find(v => v.id === vendorId || v._id === vendorId || v.vendorId === vendorId);
        let vendorName = "Unknown Vendor";
        if (vendor) vendorName = vendor.businessName || vendor.name || "Unknown Vendor";
        if (vendorName === "Unknown Vendor" && payout.vendor && typeof payout.vendor === 'string' && !/^[a-f0-9]{24}$/i.test(payout.vendor)) {
          vendorName = payout.vendor;
        }
        const paymentMethod = payout.method || payout.paymentMethod || "Bank Transfer";
        return {
          ...payout,
          vendor: vendorName,
          method: paymentMethod,
          id: payout.id || payout._id || payout.payoutId || `payout-${Date.now()}-${Math.random()}`
        };
      });
      setPayoutHistory(enrichedPayouts);
    } catch (e) {
      setPayoutHistory([]);
    } finally {
      setLoadingPayouts(false);
    }
  };

  const handlePaymentUpdate = async (payload) => {
    load();
    loadPayouts();
    await fetchPaystackStats();
    try {
      const res = await getTotalEarnings();
      const data = res?.data;
      if (data?.earnings) {
        setDashboardKPIs(prev => ({
          ...prev,
          totalEarningsChange: `+${data.earnings.yearChange}% from last year`,
          totalEarningsTrend: data.earnings.yearChange >= 0 ? "up" : "down",
          weeklyEarningsChange: `+${data.earnings.weekChange}% vs last week`,
          weeklyEarningsTrend: data.earnings.weekChange >= 0 ? "up" : "down",
          completedPaymentsChange: `+${data.payments.completed.change}% vs last week`,
          completedPaymentsTrend: data.payments.completed.change >= 0 ? "up" : "down",
        }));
      }
    } catch (e) { }
    const earningsKeys = ['totalEarnings', 'totalEarningsChange', 'totalEarningsTrend', 'weeklyEarnings', 'weeklyEarningsChange', 'weeklyEarningsTrend', 'completedPayments', 'completedPaymentsChange', 'completedPaymentsTrend', 'availableBalance', 'lastPaymentDate'];
    try {
      const kpisRes = await getDashboardKPIs();
      const kpis = kpisRes?.data?.data || kpisRes?.data || kpisRes || {};
      setDashboardKPIs(prev => {
        const updated = { ...prev };
        Object.keys(kpis).forEach(key => { if (kpis[key] !== undefined && !earningsKeys.includes(key)) updated[key] = kpis[key]; });
        return updated;
      });
    } catch (e) { }
    try {
      const trendsRes = await getRevenueTrends({ period: selectedPeriod });
      const trends = Array.isArray(trendsRes?.data) ? trendsRes.data : trendsRes?.data?.data || [];
      setRevenueTrends(trends);
    } catch (e) { }
  };

  const handleVendorEarningsUpdate = () => load();
  const handleEarningsUpdate = () => load();

  const fetchPaystackBalance = async () => {
    try {
      const available = dashboardKPIs.availableBalance || 0;
      const pending = Math.round(available * 0.15);
      const total = available + pending;
      setPaystackBalance({ availableBalance: available, pendingBalance: pending, totalBalance: total, lastUpdated: new Date() });
    } catch (error) {
      console.error("Failed to fetch Paystack balance:", error);
    }
  };

  const load = async () => {
    try {
      setLoadingEarnings(true);
      const earningsRes = await getVendorsEarnings();
      const earnings = earningsRes?.data?.earnings || [];
      const vendorsWithEarnings = earnings.map((vendor) => {
        const totalEarnings = Number(vendor.totalEarnings || vendor.earnings || vendor.total || 0);
        const totalPaid = Number(vendor.totalPaid || vendor.paid || vendor.totalPayments || vendor.commissionPaid || 0);
        const commission = Number(vendor.commission || vendor.fee || vendor.totalPayments || 0);
        const amountDue = Math.max(0, totalEarnings - totalPaid);
        let status = "Pending";
        if (amountDue > 0) status = "Paid";
        else if (vendor.status) status = vendor.status;
        return {
          id: vendor.vendorId || vendor._id || vendor.id,
          name: vendor.vendorName || vendor.businessName || vendor.name || "Unknown Vendor",
          totalEarned: totalEarnings > 0 ? `₦${totalEarnings.toLocaleString()}` : "₦0",
          commission: commission > 0 ? `₦${commission.toLocaleString()}` : "₦0",
          amountDue: amountDue > 0 ? `₦${amountDue.toLocaleString()}` : "₦0",
          lastPayout: vendor.lastPaymentDate ? new Date(vendor.lastPaymentDate).toLocaleDateString() : "-",
          status,
          _rawTotalEarnings: totalEarnings, _rawTotalPaid: totalPaid, _rawCommission: commission, _rawAmountDue: amountDue,
        };
      });
      setVendorsEarnings(vendorsWithEarnings);
    } catch (e) {
      console.error("Failed to load vendors earnings", e);
      setVendorsEarnings([]);
    } finally {
      setLoadingEarnings(false);
    }
  };

  const handleInitiatePayout = async (vendorId, amount) => {
    try {
      if (!bankDetails.accountNumber || bankDetails.accountNumber.includes('•')) {
        alert("Please update your bank account details with a valid account number before initiating a payout.");
        return;
      }
      await initiatePayout({ vendorId, amount: parseFloat(amount), bankName: bankDetails.bankName, accountNumber: bankDetails.accountNumber, accountName: bankDetails.accountName });
      load();
      await loadPayouts();
      alert("Payout initiated successfully");
    } catch (error) {
      console.error("Failed to initiate payout:", error);
      alert("Failed to initiate payout");
    }
  };

  const handleApprovePayout = async (payoutId) => {
    try {
      setPayoutHistory(prev => prev.map(p => p.id === payoutId ? { ...p, status: "completed" } : p));
      await approvePayout(payoutId);
      await loadPayouts();
      alert("Payout approved successfully");
    } catch (error) {
      console.error("Failed to approve payout:", error);
      setPayoutHistory(prev => prev.map(p => p.id === payoutId ? { ...p, status: "pending" } : p));
      alert("Failed to approve payout");
    }
  };

  const handleEditBankDetails = () => { setTempBankDetails({ ...bankDetails }); setEditDialogOpen(true); };
  const handleSaveBankDetails = () => { setBankDetails({ ...tempBankDetails }); setEditDialogOpen(false); localStorage.setItem("bankDetails", JSON.stringify(tempBankDetails)); };
  const handleCancelEdit = () => { setTempBankDetails({ ...bankDetails }); setEditDialogOpen(false); };
  const handleAddAccount = () => { setTempAddDetails({ bankName: "", accountNumber: "", accountName: "" }); setAddDialogOpen(true); };
  const handleSaveAddAccount = () => { setBankDetails({ ...tempAddDetails }); setAddDialogOpen(false); localStorage.setItem("bankDetails", JSON.stringify(tempAddDetails)); };
  const handleCancelAdd = () => { setTempAddDetails({ bankName: "", accountNumber: "", accountName: "" }); setAddDialogOpen(false); };
  // Status normalizer for vendors
  const getVendorStatus = (rawStatus) => {
    const status = (rawStatus || '').toLowerCase().trim();
    if (!status) return 'Pending';
    if (['paid', 'success'].includes(status)) return 'Paid';
    if (['pending'].includes(status)) return 'Pending';
    return rawStatus;
  };

  const handleViewDetails = (vendor) => { 
    setSelectedVendor(vendor); 
    setDetailsModalOpen(true); 
  };

  const handlePeriodChange = async (value) => {
    setSelectedPeriod(value);
    await loadRevenueTrendsData(value);
  };

  const loadRevenueTrendsData = async (period = selectedPeriod) => {
    try {
      const trendsRes = await getRevenueTrends({ period });
      let trends = [];
      if (Array.isArray(trendsRes?.data)) trends = trendsRes.data;
      else if (trendsRes?.data?.data && Array.isArray(trendsRes.data.data)) trends = trendsRes.data.data;
      else if (trendsRes?.data && Array.isArray(trendsRes.data)) trends = trendsRes.data;
      const formattedTrends = trends.map((item, index) => ({
        date: item.date || item.createdAt || item._id || `Day ${index + 1}`,
        value: item.value || item.amount || item.total || item.earnings || 0
      }));
      setRevenueTrends(formattedTrends);
    } catch (e) {
      console.error("Failed to load revenue trends", e);
      setRevenueTrends([]);
    }
  };

  useEffect(() => {
    const savedBankDetails = localStorage.getItem("bankDetails");
    if (savedBankDetails) setBankDetails(JSON.parse(savedBankDetails));
    let ignore = false;

    const loadVendors = async () => {
      try {
        const res = await getVendors();
        const vendorsList = extractArray(res.data);
        if (!ignore) setVendors(vendorsList);
        return vendorsList;
      } catch (e) {
        console.error("Failed to load vendors", e);
        if (!ignore) setVendors([]);
        return [];
      }
    };

    const loadKPIs = async () => {
      try {
        setLoadingKPIs(true);
        const kpisRes = await getDashboardKPIs();
        const kpis = kpisRes?.data?.data || kpisRes?.data || kpisRes || {};
        if (!ignore) {
          const earningsKeys = ['totalEarnings', 'totalEarningsChange', 'totalEarningsTrend', 'weeklyEarnings', 'weeklyEarningsChange', 'weeklyEarningsTrend', 'completedPayments', 'completedPaymentsChange', 'completedPaymentsTrend', 'availableBalance', 'lastPaymentDate'];
          const filteredKpis = Object.keys(kpis).reduce((acc, key) => { if (!earningsKeys.includes(key)) acc[key] = kpis[key]; return acc; }, {});
          setDashboardKPIs(prev => ({ ...prev, ...filteredKpis }));
        }
      } catch (e) {
        console.error("Failed to load KPIs", e);
      } finally {
        if (!ignore) setLoadingKPIs(false);
      }
    };

    const loadRevenueTrendsInit = async () => {
      try {
        const trendsRes = await getRevenueTrends({ period: selectedPeriod });
        let trends = [];
        if (Array.isArray(trendsRes?.data)) trends = trendsRes.data;
        else if (trendsRes?.data?.data && Array.isArray(trendsRes.data.data)) trends = trendsRes.data.data;
        else if (trendsRes?.data && Array.isArray(trendsRes.data)) trends = trendsRes.data;
        const formattedTrends = trends.map((item, index) => ({
          date: item.date || item.createdAt || item._id || `Day ${index + 1}`,
          value: item.value || item.amount || item.total || item.earnings || 0
        }));
        if (!ignore) setRevenueTrends(formattedTrends);
      } catch (e) {
        console.error("Failed to load revenue trends", e);
        if (!ignore) setRevenueTrends([]);
      }
    };

    const loadEarnings = async () => {
      try {
        const res = await getTotalEarnings();
        const data = res?.data;
        if (data?.earnings) {
          setDashboardKPIs(prev => ({
            ...prev,
            totalEarnings: data.earnings.thisYear,
            totalEarningsChange: `+${data.earnings.yearChange}% from last year`,
            totalEarningsTrend: data.earnings.yearChange >= 0 ? "up" : "down",
            weeklyEarnings: data.earnings.thisWeek,
            weeklyEarningsChange: `+${data.earnings.weekChange}% vs last week`,
            weeklyEarningsTrend: data.earnings.weekChange >= 0 ? "up" : "down",
            completedPayments: data.payments.completed.thisWeek,
            completedPaymentsChange: `+${data.payments.completed.change}% vs last week`,
            completedPaymentsTrend: data.payments.completed.change >= 0 ? "up" : "down",
          }));
        }
      } catch (e) {
        console.error("Failed to load earnings KPIs", e);
      }
    };

    const loadData = async () => {
      load();
      const vendorsList = await loadVendors();
      loadPayouts(vendorsList);
      loadEarnings();
      loadKPIs();
      loadRevenueTrendsInit();
      await fetchPayoutStats();
      try { await loadAdminEarnings(); } catch (err) { console.warn("Error fetching admin earnings:", err); }
      try { await loadSuccessfulPayments(); } catch (err) { console.warn("Error fetching successful payments:", err); }
      try { await fetchPaystackStats(); } catch (err) { console.warn("Error fetching Paystack stats in loadData", err); }
    };

    loadData();
    subscribe("payment_update", handlePaymentUpdate);
    subscribe("payout_update", handlePaymentUpdate);
    subscribe("payoutUpdate", handlePaymentUpdate);
    subscribe("vendor-earnings-updated", handleVendorEarningsUpdate);
    subscribe("earnings-updated", handleEarningsUpdate);

    return () => {
      ignore = true;
      unsubscribe("payment_update");
      unsubscribe("payout_update");
      unsubscribe("vendor-earnings-updated");
      unsubscribe("earnings-updated");
    };
  }, [subscribe, unsubscribe]);

  useEffect(() => {
    const totalAvailableBalance = vendorsEarnings.reduce((sum, vendor) => {
      const amount = parseFloat(vendor.amountDue.replace('₦', '').replace(/,/g, '')) || 0;
      return sum + amount;
    }, 0);
    const lastPayment = payoutHistory.length > 0 ? payoutHistory.reduce((latest, payout) => {
      const dateStr = payout.createdAt || payout.date;
      if (!dateStr) return latest;
      const date = new Date(dateStr);
      return date > latest ? date : latest;
    }, new Date(0)) : null;
    setDashboardKPIs(prev => ({
      ...prev,
      availableBalance: totalAvailableBalance,
      lastPaymentDate: lastPayment && lastPayment.getTime() > 0 ? lastPayment.toISOString() : null
    }));
  }, [vendorsEarnings, payoutHistory]);

  useEffect(() => {
    if (dashboardKPIs.availableBalance) fetchPaystackBalance();
  }, [dashboardKPIs.availableBalance]);

  useEffect(() => {
    if (!paystackStats.loading) {
      setDashboardKPIs(prev => ({
        ...prev,
        totalEarnings: paystackStats.totalEarnings,
        weeklyEarnings: paystackStats.weeklyEarnings,
        weeklyEarningsChange: paystackStats.weeklyEarningsChange !== undefined ? `+${paystackStats.weeklyEarningsChange.toFixed(1)}% vs last week` : prev.weeklyEarningsChange,
        weeklyEarningsTrend: paystackStats.weeklyEarningsTrend || prev.weeklyEarningsTrend,
        todayEarnings: paystackStats.todayEarnings,
        todayEarningsChange: paystackStats.todayEarningsChange !== undefined ? `+${paystackStats.todayEarningsChange.toFixed(1)}% vs yesterday` : prev.todayEarningsChange,
        todayEarningsTrend: paystackStats.todayEarningsTrend || prev.todayEarningsTrend,
        completedPayments: paystackStats.completedPayments,
        completedPaymentsChange: paystackStats.completedPaymentsChange !== undefined ? `+${paystackStats.completedPaymentsChange.toFixed(1)}% vs last week` : prev.completedPaymentsChange,
        completedPaymentsTrend: paystackStats.completedPaymentsTrend || prev.completedPaymentsTrend,
      }));
    }
  }, [paystackStats]);

  useEffect(() => {
    if (activeTab === "history") loadPayouts();
  }, [activeTab]);

  useEffect(() => {
    let filtered = [...payoutHistory];
    if (historyFilter !== "All") {
      const statusMap = { "Pending": ["pending", "Pending"], "Completed": ["completed", "Success", "success"], "Failed": ["failed", "Failed", "error"] };
      const allowedStatuses = statusMap[historyFilter] || [];
      filtered = filtered.filter(payout => allowedStatuses.some(status => payout.status?.toLowerCase().includes(status.toLowerCase())));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(payout => payout.vendor?.toLowerCase().includes(query) || payout.id?.toLowerCase().includes(query) || payout.amount?.toString().includes(query));
    }
    setFilteredPayoutHistory(filtered);
  }, [payoutHistory, historyFilter, searchQuery]);

  const copyToClipboard = (text) => {
    if (text && !text.includes('•')) { navigator.clipboard.writeText(text); alert('Account number copied to clipboard!'); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {paystackError && (
        <div className="p-2 bg-red-100 text-red-800 rounded">
          Failed to load Paystack data: {paystackError}
        </div>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="earning">Vendor's Earning</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="earning" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <StatCard
                title="Total Earnings"
                value={dashboardKPIs.totalEarnings ? `₦${dashboardKPIs.totalEarnings.toLocaleString()}` : "₦0"}
                change={dashboardKPIs.totalEarningsChange || "+0% from last year"}
                trend={dashboardKPIs.totalEarningsTrend || "up"}
                icon={Wallet}
                iconBg="bg-blue-500/10"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Earnings this Week"
                value={dashboardKPIs.weeklyEarnings ? `₦${dashboardKPIs.weeklyEarnings.toLocaleString()}` : "₦0"}
                change={dashboardKPIs.weeklyEarningsChange || "+0% vs last week"}
                trend={dashboardKPIs.weeklyEarningsTrend || "up"}
                icon={TrendingUp}
                iconBg="bg-success/10"
                iconColor="text-success"
              />
              <StatCard
                title="Completed Payments"
                value={dashboardKPIs.completedPayments ? dashboardKPIs.completedPayments.toLocaleString() : "0"}
                change={dashboardKPIs.completedPaymentsChange || "+0% vs last week"}
                trend={dashboardKPIs.completedPaymentsTrend || "up"}
                icon={CheckCircle}
                iconBg="bg-purple-500/10"
                iconColor="text-purple-500"
              />
              <StatCard
                title="Today's Earnings"
                value={dashboardKPIs.todayEarnings ? `₦${dashboardKPIs.todayEarnings.toLocaleString()}` : "₦0"}
                change={dashboardKPIs.todayEarningsChange || "+0% vs last week"}
                trend={dashboardKPIs.todayEarningsTrend || "down"}
                icon={Clock}
                iconBg="bg-warning/10"
                iconColor="text-warning"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-1">
                    {dashboardKPIs.availableBalance ? `₦${dashboardKPIs.availableBalance.toLocaleString()}` : "₦0"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last payment processed on {dashboardKPIs.lastPaymentDate ? new Date(dashboardKPIs.lastPaymentDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              {/* ── NEW PAYMENT STATUS CARD ── */}
              <PaymentStatusCard
                paystackBalance={paystackBalance}
                successRate={98.5}
                transactionCount={1284}
              />

              {/* Edit Bank Account Dialog */}
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Update Bank Account
                    </DialogTitle>
                    <DialogDescription>
                      Update your bank account information for receiving payouts.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Select value={tempBankDetails.bankName} onValueChange={(value) => setTempBankDetails({ ...tempBankDetails, bankName: value })}>
                        <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                        <SelectContent>
                          {["Zenith Bank", "Guaranty Trust Bank", "First Bank", "Access Bank", "United Bank for Africa", "Fidelity Bank", "Union Bank", "Ecobank", "Stanbic IBTC", "Wema Bank"].map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={tempBankDetails.accountNumber}
                        onChange={(e) => setTempBankDetails({ ...tempBankDetails, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        placeholder="10-digit account number"
                        maxLength={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        value={tempBankDetails.accountName}
                        onChange={(e) => setTempBankDetails({ ...tempBankDetails, accountName: e.target.value })}
                        placeholder="Account holder's full name"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                    <Button onClick={handleSaveBankDetails} className="bg-primary">Update Account</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>

            {/* Earnings Trends Chart */}
            <Card className="p-6 lg:col-span-2 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Earnings Trends</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <span className="text-2xl font-bold text-gray-900">
                        {revenueTrends.length > 0 ? revenueTrends.length : 0}
                      </span>
                    </div>
                    <span className="text-sm text-green-600 flex items-center font-medium">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {dashboardKPIs.revenueChange || "0% vs last week"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Revenue growth over time</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Earnings</span>
                  </div>
                  <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-32 border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueTrends.length > 0 ? revenueTrends : earningsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" strokeWidth={1} vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} dx={-10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '14px' }}
                      labelStyle={{ color: '#374151', fontWeight: '600' }}
                      formatter={(value) => [`₦${value.toLocaleString()}`, 'Earnings']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area type="monotone" dataKey="value" stroke="none" fill="url(#earningsGradient)" strokeWidth={0} />
                    <Line type="monotone" dataKey="value" stroke="url(#lineGradient)" strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                      activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>Track your revenue performance</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live data</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Vendor Earnings Table */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-semibold">Vendor's Earnings</h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search vendors" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-full sm:w-64" />
                </div>
                <Select defaultValue="date">
                  <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Date" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="status">
                  <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => loadPayouts()} disabled={loadingPayouts}>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor's Name</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead>Commission Earned</TableHead>
                    <TableHead>Amount Earned</TableHead>
                    <TableHead>Last Payout Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEarnings ? (
                    <TableRow><TableCell colSpan={7} className="text-sm text-muted-foreground">Loading earnings...</TableCell></TableRow>
                  ) : vendorsEarnings.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-sm text-muted-foreground text-center py-8">No vendors with earnings found</TableCell></TableRow>
                  ) : vendorsEarnings.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell><span className="font-medium">{vendor.name}</span></TableCell>
                      <TableCell>{vendor.totalEarned}</TableCell>
                      <TableCell>{vendor.commission}</TableCell>
                      <TableCell>{vendor.amountDue}</TableCell>
                      <TableCell>{vendor.lastPayout}</TableCell>
                      <TableCell>
                        <Badge variant={vendor.status === "Paid" ? "default" : "secondary"}>{vendor.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(vendor)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedVendor(vendor);
                          setTimeout(() => window.print(), 500);
                        }}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Summary
                        </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Payouts" value={dashboardKPIs.totalPayouts ? `₦${dashboardKPIs.totalPayouts.toLocaleString()}` : "₦0"} change={dashboardKPIs.totalPayoutsChange || "+0% from last year"} trend={dashboardKPIs.totalPayoutsTrend || "up"} icon={Wallet} iconBg="bg-blue-500/10" iconColor="text-blue-500" />
            <StatCard title="Pending Payouts" value={dashboardKPIs.pendingPayouts ? `₦${dashboardKPIs.pendingPayouts.toLocaleString()}` : "₦0"} change={dashboardKPIs.pendingPayoutsChange || "+0% vs last week"} trend={dashboardKPIs.pendingPayoutsTrend || "up"} icon={Clock} iconBg="bg-warning/10" iconColor="text-warning" />
            <StatCard title="Successful Payouts" value={dashboardKPIs.successfulPayouts ? `₦${dashboardKPIs.successfulPayouts.toLocaleString()}` : "₦0"} change={dashboardKPIs.successfulPayoutsChange || "+0% vs last week"} trend={dashboardKPIs.successfulPayoutsTrend || "up"} icon={CheckCircle} iconBg="bg-success/10" iconColor="text-success" />
            <StatCard title="Last Payout" value={dashboardKPIs.lastPayout ? `₦${dashboardKPIs.lastPayout.toLocaleString()}` : "₦0"} change={dashboardKPIs.lastPayoutChange || "+0% vs last week"} trend={dashboardKPIs.lastPayoutTrend || "down"} icon={TrendingUp} iconBg="bg-purple-500/10" iconColor="text-purple-500" />
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Tabs value={historyFilter} onValueChange={setHistoryFilter} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Pending">Pending</TabsTrigger>
                  <TabsTrigger value="Completed">Completed</TabsTrigger>
                  <TabsTrigger value="Failed">Failed</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search transactions" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-full sm:w-64" />
                </div>
                <Select value={historyFilter} onValueChange={setHistoryFilter}>
                  <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0"><SlidersHorizontal className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => loadPayouts()} disabled={loadingPayouts}>
                  <RefreshCw className={`h-4 w-4 ${loadingPayouts ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Vendor's Name</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payout Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPayouts ? (
                    <TableRow><TableCell colSpan={7} className="text-sm text-muted-foreground">Loading payouts...</TableCell></TableRow>
                  ) : filteredPayoutHistory.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-sm text-muted-foreground text-center py-8">{payoutHistory.length === 0 ? "No payouts found" : "No payouts match your filters"}</TableCell></TableRow>
                  ) : filteredPayoutHistory.map((payout, index) => (
                    <TableRow key={payout.id || index}>
                      <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                      <TableCell><span className="font-medium">{payout.vendor}</span></TableCell>
                      <TableCell>{typeof payout.amount === 'number' ? `₦${payout.amount.toLocaleString()}` : payout.amount}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>{payout.date || (payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : "-")}</TableCell>
                      <TableCell>
                        <Badge variant={payout.status === "Success" || payout.status === "completed" ? "default" : payout.status === "Pending" || payout.status === "pending" ? "secondary" : "destructive"}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {(payout.status === "Pending" || payout.status === "pending") && (
                              <DropdownMenuItem onClick={() => handleApprovePayout(payout.id)}>Approve</DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">Page 1 of 30</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled><ChevronLeft className="h-4 w-4" /></Button>
                {[1, 2, 3, "...", 10, 11, 12].map((page, idx) => (
                  <Button key={idx} variant={page === 1 ? "default" : "outline"} size="icon" className="w-10" disabled={page === "..."}>{page}</Button>
                ))}
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vendor Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vendor Earnings Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-sm font-medium">Vendor Name</Label><p className="text-sm mt-1">{selectedVendor.name}</p></div>
                <div><Label className="text-sm font-medium">Vendor ID</Label><p className="text-sm mt-1">{selectedVendor.id}</p></div>
                <div><Label className="text-sm font-medium">Total Earned</Label><p className="text-sm mt-1 font-semibold text-green-600">{selectedVendor.totalEarned}</p></div>
                <div><Label className="text-sm font-medium">Commission Earned</Label><p className="text-sm mt-1 font-semibold text-blue-600">{selectedVendor.commission}</p></div>
                <div><Label className="text-sm font-medium">Amount Earned</Label><p className="text-sm mt-1 font-semibold text-orange-600">{selectedVendor.amountDue}</p></div>
                <div><Label className="text-sm font-medium">Last Payout Date</Label><p className="text-sm mt-1">{selectedVendor.lastPayout}</p></div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getVendorStatus(selectedVendor.status) === "Paid" ? "default" : "secondary"} className="mt-1">
                    {getVendorStatus(selectedVendor.status)}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Payment Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Earnings</p>
                    <p className="text-lg font-bold text-green-600">{selectedVendor.totalEarned}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Commission</p>
                    <p className="text-lg font-bold text-blue-600">{selectedVendor.commission}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Amount Earned</p>
                    <p className="text-lg font-bold text-orange-600">{selectedVendor.amountDue}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
