import { Users, UserPlus, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight, ExternalLink, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/Statcard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardKPIs,
  getRecentTransactions,
  getRevenueTrends,
  getTodaysReservations,
  getTopVendors,
  getVendorsEarnings,
  getUpcomingReservations,
  getBookingTrends,
  getCustomerFrequency,
  getRevenueByCategory,
  getReservationSources,
  getUsers
} from "@/services/admin.service";
import { useWebSocket } from "@/contexts/WebSocketContext";




export default function Dashboard() {
  const navigate = useNavigate();

  const formatNaira = (n: any) => {
    const num = Number(n || 0);
    return `₦${num.toLocaleString()}`;
  };

  const { subscribe, unsubscribe } = useWebSocket();

  const [kpis, setKpis] = useState<any>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [todaysReservations, setTodaysReservations] = useState<any[]>([]);
  const [topVendors, setTopVendors] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchKPIs = async () => {
    try {
      const kRes = await getDashboardKPIs();
      const k = kRes?.data?.data || kRes?.data || kRes || null;
      setKpis(k);
    } catch (err) {
      console.error("Failed to load KPIs", err);
    }
  };

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
      const normalizeRes = (r: any) => ({
        name: r.customerName || r.user?.name || r.guestName || "Guest",
        id: r.id || r._id || r.reference || "",
        date: r.date || r.checkInDate || r.createdAt || "",
        time: r.time || r.checkInTime || "",
        venue: r.vendorName || r.vendor?.businessName || r.businessName || "",
        status: r.status || r.reservationStatus || "",
      });
      setTodaysReservations(Array.isArray(today?.data) ? today.data.map(normalizeRes) : []);
    } catch (err) {
      console.error("Failed to load today's reservations", err);
    }
  };

  const fetchTopVendors = async () => {
    try {
      const tv = await getTopVendors();
      setTopVendors(Array.isArray(tv?.data) ? tv.data : []);
    } catch (err) {
      console.error("Failed to load top vendors", err);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      // Fetch users with a small limit to get total count from response metadata
      const res = await getUsers({ page: 1, limit: 10 });
      const payload = res?.data || {};
      // Try common shapes for total count
      const total = payload?.total || payload?.totalDocs || payload?.totalUsers || payload?.count || payload?.meta?.total || res?.data?.data?.total || null;
      // Some APIs return counts in headers (e.g. x-total-count)
      const headerCount = res?.headers?.['x-total-count'] || res?.headers?.['X-Total-Count'];
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
      const normalizeTx = (t: any) => ({
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tx, today, tv] = await Promise.all([
          getRecentTransactions(),
          getTodaysReservations(),
          getTopVendors().catch(() => ({ data: [] })),
        ]);

        const normalizeTx = (t: any) => ({
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

        const normalizeRes = (r: any) => ({
          name: r.customerName || r.user?.name || r.guestName || "Guest",
          id: r.id || r._id || r.reference || "",
          date: r.date || r.checkInDate || r.createdAt || "",
          time: r.time || r.checkInTime || "",
          venue: r.vendorName || r.vendor?.businessName || r.businessName || "",
          status: r.status || r.reservationStatus || "",
        });

        setTodaysReservations(Array.isArray(today?.data) ? today.data.map(normalizeRes) : []);
        setTopVendors(Array.isArray(tv?.data) ? tv.data : []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchAll();
    fetchKPIs();
    fetchTotalUsers();
    fetchRevenueTrends();

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

  // WebSocket subscriptions for real-time updates
  useEffect(() => {
    const handleUserCreated = (payload?: any) => {
      // optimistic increment for immediate UX
      setTotalUsers((prev) => (Number(prev) || 0) + 1);
      fetchKPIs();
      // if payload contains authoritative count, use it
      if (payload && (payload.total || payload.count || payload.totalUsers)) {
        const t = payload.total ?? payload.count ?? payload.totalUsers;
        setTotalUsers(Number(t));
      }
    };

    const handleUserDeleted = (payload?: any) => {
      setTotalUsers((prev) => Math.max(0, (Number(prev) || 0) - 1));
      fetchKPIs();
      if (payload && (payload.total || payload.count || payload.totalUsers)) {
        const t = payload.total ?? payload.count ?? payload.totalUsers;
        setTotalUsers(Number(t));
      }
    };

    const handleUserUpdated = (updatedUser: any) => {
      // If user status changes from active to inactive or vice versa, refetch totals
      fetchKPIs();
      fetchTotalUsers();
    };

    const handleUserCountUpdated = (data: any) => {
      // some backends emit an explicit count update
      const t = data?.total || data?.count || data?.totalUsers || null;
      if (t != null) setTotalUsers(Number(t));
    };

    const handlePayoutUpdate = (payout: any) => {
      // Payouts might affect pending payments or revenue
      fetchKPIs();
    };

    const handleReservationCreated = (reservation: any) => {
      const today = new Date().toISOString().split('T')[0];
      if (reservation.date === today || reservation.checkInDate === today) {
        fetchTodaysReservations();
      }
      fetchKPIs(); // Update totalBookings
      fetchTransactions(); // Update recent transactions
    };

    const handleReservationUpdated = (reservation: any) => {
      fetchTodaysReservations();
      fetchKPIs();
      fetchTransactions();
    };

    const handleReservationDeleted = (reservation: any) => {
      fetchTodaysReservations();
      fetchKPIs(); // Update totalBookings
      fetchTransactions();
    };

    const handlePaymentCreated = (payment: any) => {
      fetchKPIs();
      fetchTransactions();
      fetchRevenueTrends();
    };

    const handlePaymentUpdated = (payment: any) => {
      fetchKPIs();
      fetchTransactions();
      fetchRevenueTrends();
    };

    const handleVendorUpdated = (vendor: any) => {
      fetchTopVendors();
    };

    // Additional events for real-time updates
    const handleReservationStatusChanged = (reservation: any) => {
      // Update today's reservations and top vendors when reservation status changes
      fetchTodaysReservations();
      fetchTopVendors();
      fetchKPIs();
    };

    const handlePayoutProcessed = (payout: any) => {
      // Update revenue trends and KPIs when payouts are processed
      fetchRevenueTrends();
      fetchKPIs();
      fetchTransactions();
    };

    const handleVendorEarningsUpdated = (data: any) => {
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

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const trendList = Array.isArray(revenueTrends) ? revenueTrends : [];
  const chartData = trendList.map((r: any) => ({
    label: months[((r._id?.month ?? r.month ?? 1) - 1)] + ` ${r._id?.year ?? r.year ?? new Date().getFullYear()}`,
    value: Number(r.total ?? r.totalRevenue ?? r.revenue ?? 0),
  }));
  const recent = chartData.slice(-8);
  const maxVal = Math.max(1, ...recent.map(d => Number(d.value) || 0));
  const lastRevenue = recent.length ? recent[recent.length - 1].value : 0;
  const prevRevenue = recent.length > 1 ? recent[recent.length - 2].value : 0;
  const pctChange = prevRevenue ? ((lastRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const trendUp = pctChange >= 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome Back, Admin!</h1>
          <p className="text-sm text-muted-foreground">Here's what is happening today.</p>
        </div>
        <Button
          onClick={refreshDashboard}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Payouts"
          value={formatNaira(transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0))}
          change="+0% from last year"
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-success"
          trend="up"
        />
        <StatCard
          title="Pending Payouts"
          value={formatNaira(transactions.filter(t => t.status !== "Paid").reduce((sum, t) => sum + (Number(t.amount) || 0), 0))}
          change="+0% vs last week"
          icon={AlertCircle}
          iconBg="bg-yellow-100"
          iconColor="text-warning"
          trend="up"
        />
        <StatCard
          title="Successful Payouts"
          value={formatNaira(transactions.filter(t => t.status === "Paid").reduce((sum, t) => sum + (Number(t.amount) || 0), 0))}
          change="+0% vs last week"
          icon={TrendingUp}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
        />
        <StatCard
          title="Last Payout"
          value={transactions.length > 0 ? formatNaira(Number(transactions[0].amount) || 0) : "₦0"}
          change="-0% vs last week"
          icon={ArrowDownRight}
          iconBg="bg-red-100"
          iconColor="text-destructive"
          trend="down"
        />
      </div>

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Earnings Trends</CardTitle>
          <div className="flex gap-2">
            <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={() => navigate('/dashboard/admin/reports')}>
              View All <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
            <span className="text-xs px-2 py-1 border rounded bg-background">Monthly</span>
          </div>
        </CardHeader>
        <CardContent className="">
          <div className="mb-4">
            <p className="text-2xl md:text-3xl font-bold">{formatNaira(lastRevenue)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {trendUp ? (
                <span className="text-success flex items-center">↑ {pctChange.toFixed(1)}% vs previous</span>
              ) : (
                <span className="text-destructive flex items-center">↓ {Math.abs(pctChange).toFixed(1)}% vs previous</span>
              )}
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recent}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: any) => [formatNaira(value), 'Revenue']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
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

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Today's Reservations</CardTitle>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={() => navigate('/dashboard/admin/vendors')}>
              View All <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-3">
            {todaysReservations.map((res, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage className="" src="" alt={res.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">EJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{res.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {res.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{res.date}</p>
                  <p className="text-xs text-muted-foreground">Time: {res.time}</p>
                </div>
                <p className="text-sm hidden md:block">{res.venue}</p>
                <Badge
                  variant={res.status === "Active" ? "default" : "secondary"}
                  className={
                    res.status === "Active"
                      ? "bg-success text-success-foreground"
                      : "bg-warning text-warning-foreground"
                  }
                >
                  {res.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Top Performing Vendors</CardTitle>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 border rounded bg-background">Monthly</span>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
              View All <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-3">
            {topVendors.map((vendor, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <span className="font-semibold">K</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{vendor.name || vendor.businessName || vendor.vendorName || "Vendor"}</p>
                    <p className="text-xs text-muted-foreground">{vendor.type || vendor.category || ""}</p>
                  </div>
                </div>
                <p className="text-sm hidden md:block">{vendor.bookings || (vendor.totalBookings != null ? `${vendor.totalBookings} Bookings` : "")}</p>
                <p className="text-sm font-semibold">{vendor.revenue || (vendor.totalRevenue != null ? `₦${Number(vendor.totalRevenue).toLocaleString()}` : "")}</p>
                <Badge
                  variant={vendor.status === "Active" ? "default" : "secondary"}
                  className={
                    vendor.status === "Active"
                      ? "bg-success text-success-foreground"
                      : "bg-warning text-warning-foreground"
                  }
                >
                  {vendor.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}