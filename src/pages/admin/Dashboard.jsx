import {
  Users,
  UserPlus,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/Statcard";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardKPIs,
  getRecentTransactions,
  getRevenueTrends,
  getTodaysReservations,
  getTopVendors,
  getTopVendorEarnings,
  getVendorsEarnings,
  getUpcomingReservations,
  getBookingTrends,
  getCustomerFrequency,
  getRevenueByCategory,
  getReservationSources,
  getUsers,
} from "@/services/admin.service";
import { useWebSocket } from "@/contexts/WebSocketContext";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import { PendingPaymentIcon, PrepaidIcon } from "@/public/icons/icons";

export default function Dashboard() {
  const navigate = useNavigate();

  const formatNaira = (n) => {
    const num = Number(n || 0);
    return `₦${num.toLocaleString()}`;
  };

  const { subscribe, unsubscribe, connected } = useWebSocket();

  const [kpis, setKpis] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [todaysReservations, setTodaysReservations] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [wsStatus, setWsStatus] = useState("connecting");

  const fetchKPIs = async () => {
    try {
      const kRes = await getDashboardKPIs();
      const k = kRes?.data?.data || kRes?.data || kRes || null;
      setKpis(k);
    } catch (err) {
      console.error("Failed to load KPIs", err);
    }
  };

  useEffect(() => {
    const fetchInitialData = () => {
      Promise.all([
        fetchKPIs(),
        fetchRevenueTrends(),
        fetchTodaysReservations(),
        fetchTransactions(),
        fetchTotalUsers(),
      ]);
      fetchTopVendors();
    };
    fetchInitialData();

    // Poll dashboard data periodically as a fallback for realtime updates
    const polling = setInterval(() => {
      fetchKPIs();
      fetchTotalUsers();
      fetchTodaysReservations();
      fetchTopVendors();
      fetchRevenueTrends();
    }, 30000);

    return () => clearInterval(polling);
  }, []);

  useEffect(() => {
    if (connected) {
      setWsStatus("connected");
      subscribe("new-reservation", (data) => {
        console.log("New reservation received via WebSocket:", data);
        refreshDashboard();
      });
      subscribe("new-transaction", (data) => {
        console.log("New transaction received via WebSocket:", data);
        refreshDashboard();
      });
    } else {
      setWsStatus("disconnected");
    }

    return () => {
      unsubscribe("new-reservation");
      unsubscribe("new-transaction");
    };
  }, [connected, subscribe, unsubscribe]);

  const fetchRevenueTrends = async () => {
    try {
      const rev = await getRevenueTrends();
      setRevenueTrends(Array.isArray(rev?.data) ? rev.data : []);
    } catch (err) {
      console.error("Failed to load revenue trends", err);
    }
  };

  const fetchTodaysReservations = async () => {
    try {
      const today = await getTodaysReservations();
      const normalizeRes = (r) => ({
        name: r.customerName || r.user?.name || r.guestName || "Guest",
        id: r.id || r._id || r.reference || "",
        date: r.date || r.checkInDate || r.createdAt || "",
        time: r.time || r.checkInTime || "",
        venue: r.vendorName || r.vendor?.businessName || r.businessName || "",
        status: r.status || r.reservationStatus || "",
      });
      setTodaysReservations(
        Array.isArray(today?.data) ? today.data.map(normalizeRes) : [],
      );
    } catch (err) {
      console.error("Failed to load today's reservations", err);
    }
  };

  const fetchTopVendors = async () => {
    try {
      console.log("[Dashboard] Fetching top vendor earnings...");
      // Use the correct endpoint for top performing vendors
      const tv = await getTopVendorEarnings({ page: 1, limit: 10 });
      console.log("[Dashboard] Top vendors response:", tv);

      // Handle the new response format from /payments/vendors-earnings
      // Response format: { earnings: [...], pagination: {...} }
      let vendors = [];
      if (tv?.data?.earnings && Array.isArray(tv.data.earnings)) {
        // Transform the data to match the UI expectations
        vendors = tv.data.earnings.map((v) => ({
          businessName: v.vendorName,
          name: v.vendorName,
          totalRevenue: v.totalEarnings,
          revenue: v.totalEarnings,
          totalReservations: v.totalPayments,
          bookings: v.totalPayments,
          vendorId: v.vendorId,
          lastPaymentDate: v.lastPaymentDate,
        }));
      } else if (tv?.data?.data && Array.isArray(tv.data.data)) {
        vendors = tv.data.data;
      } else if (tv?.data && Array.isArray(tv.data)) {
        vendors = tv.data;
      } else if (Array.isArray(tv)) {
        vendors = tv;
      }

      setTopVendors(vendors);
      console.log("[Dashboard] Top vendors set:", vendors.length);
    } catch (err) {
      console.error("[Dashboard] Failed to load top vendors", err);
      // Fallback to old endpoint if new one fails
      try {
        const fallback = await getTopVendors();
        let vendors = [];
        if (fallback?.data?.data && Array.isArray(fallback.data.data)) {
          vendors = fallback.data.data;
        } else if (fallback?.data && Array.isArray(fallback.data)) {
          vendors = fallback.data;
        }
        setTopVendors(vendors);
      } catch (fallbackErr) {
        console.error("[Dashboard] Fallback also failed", fallbackErr);
      }
    }
  };

  const fetchTotalUsers = async () => {
    try {
      // Fetch users with a small limit to get total count from response metadata
      const res = await getUsers({ page: 1, limit: 10 });
      const payload = res?.data || {};
      // Try common shapes for total count
      const total =
        payload?.total ||
        payload?.totalDocs ||
        payload?.totalUsers ||
        payload?.count ||
        payload?.meta?.total ||
        res?.data?.data?.total ||
        null;
      // Some APIs return counts in headers (e.g. x-total-count)
      const headerCount =
        res?.headers?.["x-total-count"] || res?.headers?.["X-Total-Count"];
      const parsedHeader = headerCount ? Number(headerCount) : null;
      if (total != null || parsedHeader != null) {
        const finalTotal = Number(total ?? parsedHeader);
        setTotalUsers(finalTotal);
        console.log("Total users fetched:", finalTotal);
      } else {
        // Don't set if total not provided, fall back to KPIs
        console.log("Total users not provided in response, using KPIs");
      }
    } catch (err) {
      console.error("Failed to load total users", err);
      // Don't set to 0, keep null to fall back to KPIs
    }
  };

  const fetchTransactions = async () => {
    try {
      const tx = await getRecentTransactions();
      const normalizeTx = (t) => ({
        id: t.id || "",
        type: t.type || "vendor",
        amount: t.amount || 0,
        status: t.status || "Pending",
        createdAt: t.createdAt || "",
        guest: t.guest || null,
        entity: t.entity || "",
        method: t.method || "bank_transfer",
      });
      setTransactions(Array.isArray(tx?.data) ? tx.data.map(normalizeTx) : []);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  const refreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchKPIs(),
        fetchTotalUsers(),
        fetchTransactions(),
        fetchRevenueTrends(),
        fetchTodaysReservations(),
        fetchTopVendors(),
      ]);
    } catch (err) {
      console.error("Failed to refresh dashboard", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // WebSocket subscriptions for real-time updates
  useEffect(() => {
    const handleUserCreated = (payload) => {
      // optimistic increment for immediate UX
      setTotalUsers((prev) => (Number(prev) || 0) + 1);
      fetchKPIs();
      // if payload contains authoritative count, use it
      if (payload && (payload.total || payload.count || payload.totalUsers)) {
        const t = payload.total ?? payload.count ?? payload.totalUsers;
        setTotalUsers(Number(t));
      }
    };

    const handleUserDeleted = (payload) => {
      setTotalUsers((prev) => Math.max(0, (Number(prev) || 0) - 1));
      fetchKPIs();
      if (payload && (payload.total || payload.count || payload.totalUsers)) {
        const t = payload.total ?? payload.count ?? payload.totalUsers;
        setTotalUsers(Number(t));
      }
    };

    const handleUserUpdated = (updatedUser) => {
      // If user status changes from active to inactive or vice versa, refetch totals
      fetchKPIs();
      fetchTotalUsers();
    };

    const handleUserCountUpdated = (data) => {
      // some backends emit an explicit count update
      const t = data?.total || data?.count || data?.totalUsers || null;
      if (t != null) setTotalUsers(Number(t));
    };

    const handlePayoutUpdate = (payout) => {
      // Payouts might affect pending payments or revenue
      fetchKPIs();
    };

    const handleReservationCreated = (reservation) => {
      const today = new Date().toISOString().split("T")[0];
      if (reservation.date === today || reservation.checkInDate === today) {
        fetchTodaysReservations();
      }
      fetchKPIs(); // Update totalBookings
      fetchTransactions(); // Update recent transactions
      fetchTopVendors(); // Update top vendors when new reservations are created
    };

    const handleReservationUpdated = (reservation) => {
      fetchTodaysReservations();
      fetchKPIs();
      fetchTransactions();
      fetchTopVendors(); // Update top vendors when reservations are updated
    };

    const handleReservationDeleted = (reservation) => {
      fetchTodaysReservations();
      fetchKPIs(); // Update totalBookings
      fetchTransactions();
      fetchTopVendors(); // Update top vendors when reservations are deleted
    };

    const handlePaymentCreated = (payment) => {
      fetchKPIs();
      fetchTransactions();
      fetchRevenueTrends();
    };

    const handlePaymentUpdated = (payment) => {
      fetchKPIs();
      fetchTransactions();
      fetchRevenueTrends();
    };

    const handleVendorUpdated = (vendor) => {
      fetchTopVendors();
    };

    // Additional events for real-time updates
    const handleReservationStatusChanged = (reservation) => {
      // Update today's reservations and top vendors when reservation status changes
      fetchTodaysReservations();
      fetchTopVendors();
      fetchKPIs();
    };

    const handlePayoutProcessed = (payout) => {
      // Update revenue trends and KPIs when payouts are processed
      fetchRevenueTrends();
      fetchKPIs();
      fetchTransactions();
    };

    const handleVendorEarningsUpdated = (data) => {
      // Update top vendors when earnings change
      fetchTopVendors();
      fetchRevenueTrends();
    };

    subscribe("user-created", handleUserCreated);
    subscribe("user-deleted", handleUserDeleted);
    subscribe("user-updated", handleUserUpdated);
    subscribe("user-count-updated", handleUserCountUpdated);
    subscribe("payout_update", handlePayoutUpdate);
    subscribe("payout-processed", handlePayoutProcessed);
    subscribe("reservation-created", handleReservationCreated);
    subscribe("reservation-updated", handleReservationUpdated);
    subscribe("reservation-deleted", handleReservationDeleted);
    subscribe("reservation-status-changed", handleReservationStatusChanged);
    subscribe("payment-created", handlePaymentCreated);
    subscribe("payment-updated", handlePaymentUpdated);
    subscribe("vendor-updated", handleVendorUpdated);
    subscribe("vendor-earnings-updated", handleVendorEarningsUpdated);

    return () => {
      unsubscribe("user-created");
      unsubscribe("user-deleted");
      unsubscribe("user-updated");
      unsubscribe("user-count-updated");
      unsubscribe("payout_update");
      unsubscribe("payout-processed");
      unsubscribe("reservation-created");
      unsubscribe("reservation-updated");
      unsubscribe("reservation-deleted");
      unsubscribe("reservation-status-changed");
      unsubscribe("payment-created");
      unsubscribe("payment-updated");
      unsubscribe("vendor-updated");
      unsubscribe("vendor-earnings-updated");
    };
  }, [subscribe, unsubscribe]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const trendList = Array.isArray(revenueTrends) ? revenueTrends : [];
  const chartData = trendList.map((r) => ({
    label:
      months[(r._id?.month ?? r.month ?? 1) - 1] +
      ` ${r._id?.year ?? r.year ?? new Date().getFullYear()}`,
    value: Number(r.total ?? r.totalRevenue ?? r.revenue ?? 0),
  }));
  const recent = chartData.slice(-8);
  const maxVal = Math.max(1, ...recent.map((d) => Number(d.value) || 0));
  const lastRevenue = recent.length ? recent[recent.length - 1].value : 0;
  const prevRevenue = recent.length > 1 ? recent[recent.length - 2].value : 0;
  const pctChange = prevRevenue
    ? ((lastRevenue - prevRevenue) / prevRevenue) * 100
    : 0;
  const trendUp = pctChange >= 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome Back, Admin!</h1>
          <p className="text-sm text-muted-foreground">
            Here's what is happening today.
          </p>
        </div>
        <DashboardButton
          onClick={refreshDashboard}
          disabled={isRefreshing}
          variant="secondary"
          text={isRefreshing ? "Refreshing..." : "Refresh"}
          icon={<RefreshCw className={`size-5 ${isRefreshing && "animate-spin"}`} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Payouts"
          value={formatNaira(
            transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
          )}
          change="+0% from last year"
          icon={PrepaidIcon}
          iconBg="bg-green-100"
          iconColor="#06CD02"
          trend="up"
        />
        <StatCard
          title="Pending Payouts"
          value={formatNaira(
            transactions
              .filter((t) => t.status !== "Paid")
              .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
          )}
          change="+0% vs last week"
          icon={PendingPaymentIcon}
          iconBg="bg-yellow-100"
          iconColor="#E1B505"
          trend="up"
        />
        <StatCard
          title="Successful Payouts"
          value={formatNaira(
            transactions
              .filter((t) => t.status === "Paid")
              .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
          )}
          change="+0% vs last week"
          icon={PrepaidIcon}
          iconBg="bg-blue-100"
          iconColor="#0570E1"
          trend="up"
        />
        <StatCard
          title="Last Payout"
          value={
            transactions.length > 0
              ? formatNaira(Number(transactions[0].amount) || 0)
              : "₦0"
          }
          change="-0% vs last week"
          icon={PendingPaymentIcon}
          iconBg="bg-red-100"
          iconColor="#EF4444"
          trend="down"
        />
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Earnings Trends</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="link"
              size="sm"
              className="text-primary p-0 h-auto"
              onClick={() => navigate("/dashboard/admin/reports")}
            >
              View All <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
            <span className="text-xs px-2 py-1 border rounded bg-background">
              Monthly
            </span>
          </div>
        </CardHeader>
        <CardContent className="">
          <div className="mb-4">
            <p className="text-2xl md:text-3xl font-bold">
              {formatNaira(lastRevenue)}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {trendUp ? (
                <span className="text-success flex items-center">
                  ↑ {pctChange.toFixed(1)}% vs previous
                </span>
              ) : (
                <span className="text-destructive flex items-center">
                  ↓ {Math.abs(pctChange).toFixed(1)}% vs previous
                </span>
              )}
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recent}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [formatNaira(value), "Revenue"]}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Today's Reservations
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">
                  Live Updates
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-primary p-0 h-auto hover:text-primary/80 transition-colors"
            onClick={() => navigate("/dashboard/admin/reservations")}
          >
            View All <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-4">
            {todaysReservations.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No reservations for today
                </p>
              </div>
            ) : (
              todaysReservations.slice(0, 5).map((res, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-blue-100 dark:ring-blue-900">
                          <AvatarImage src="" alt={res.name} className="" />
                          <AvatarFallback className="bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold">
                            {res.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {res.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {res.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {res.date}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {res.time}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {res.venue}
                      </p>
                    </div>
                    <Badge
                      variant={
                        res.status === "Active" || res.status === "Confirmed"
                          ? "default"
                          : "secondary"
                      }
                      className={`${
                        res.status === "Active" || res.status === "Confirmed"
                          ? "px-3 py-1 rounded-full text-green-600 border bg-green-100 border-green-300"
                          : "px-3 py-1 rounded-full text-orange-600 border bg-orange-100 border-orange-300"
                      }`}
                    >
                      {res.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Top Performing Vendors
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">
                  Real-time Performance
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-3 py-1 border rounded bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 shadow-sm">
              Monthly
            </span>
            <Button
              variant="link"
              size="sm"
              className="text-primary p-0 h-auto hover:text-primary/80 transition-colors"
              onClick={() => navigate("/dashboard/admin/vendors")}
            >
              View All <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-4">
            {topVendors.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No vendor performance data available
                </p>
              </div>
            ) : (
              topVendors.slice(0, 5).map((vendor, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-none transition-all duration-200 border dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center text-base">
                          {i + 1}
                        </div>
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center font-medium text-lg">
                          {(vendor.businessName ||
                            vendor.name ||
                            "V")[0].toUpperCase()}
                          {(vendor.businessName ||
                            vendor.name ||
                            "V")[1].toUpperCase()}
                        </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {vendor.businessName || vendor.name || "Vendor"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {vendor.vendorType || vendor.type || "Business"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {vendor.totalReservations || vendor.bookings || "0"}{" "}
                        Bookings
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total Bookings
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-lg font-medium">
                        ₦
                        {Number(
                          vendor.totalRevenue || vendor.revenue || 0,
                        ).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Revenue
                      </p>
                    </div>
                    <div
                      variant="default"
                      className="px-3 py-1 rounded-full text-green-600 border bg-green-100 border-green-300"
                    >
                      Active
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
