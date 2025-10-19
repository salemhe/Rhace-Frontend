import { Users, UserPlus, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/Statcard";
import { useEffect, useState } from "react";
import { getDashboardKPIs, getRecentTransactions, getRevenueTrends, getTodaysReservations, getTopVendors } from "@/services/admin.service";




export default function Dashboard() {
  const formatNaira = (n: any) => {
    const num = Number(n || 0);
    return `₦${num.toLocaleString()}`;
  };

  const [kpis, setKpis] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [todaysReservations, setTodaysReservations] = useState<any[]>([]);
  const [topVendors, setTopVendors] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [k, tx, rev, today, tv] = await Promise.all([
          getDashboardKPIs(),
          getRecentTransactions(),
          getRevenueTrends(),
          getTodaysReservations(),
          getTopVendors().catch(() => ({ data: [] })),
        ]);

        setKpis(k?.data || null);

        const normalizeTx = (t: any) => ({
          type: t.type || t.direction || (t.amount >= 0 ? "received" : "sent"),
          from: t.from || t.payer || t.customerName || t.user?.name || t.vendorName || "Unknown",
          to: t.to || t.payee || t.vendorName || t.recipient?.name || "",
          amount: typeof t.amount === "number" ? formatNaira(t.amount) : (t.amountFormatted || t.amount || ""),
          date: t.date || t.createdAt || "",
        });

        setTransactions(Array.isArray(tx?.data) ? tx.data.map(normalizeTx) : []);
        setRevenueTrends(Array.isArray(rev?.data) ? rev.data : []);

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
  }, []);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const trendList = Array.isArray(revenueTrends) ? revenueTrends : [];
  const chartData = trendList.map((r: any) => ({
    label: (r.monthName || months[((r.month ?? (r._id?.month ?? 1)) - 1)] || "") + (r.year || r._id?.year ? ` ${r.year || r._id?.year}` : ""),
    value: Number(r.totalRevenue ?? r.revenue ?? 0),
  }));
  const recent = chartData.slice(-8);
  const maxVal = Math.max(1, ...recent.map(d => Number(d.value) || 0));
  const lastRevenue = recent.length ? recent[recent.length - 1].value : 0;
  const prevRevenue = recent.length > 1 ? recent[recent.length - 2].value : 0;
  const pctChange = prevRevenue ? ((lastRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const trendUp = pctChange >= 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Welcome Back, Admin!</h1>
        <p className="text-sm text-muted-foreground">Here's what is happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={kpis?.totalBookings != null ? kpis.totalBookings.toLocaleString() : "0"}
          change={kpis?.deltas?.totalBookings || ""}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
        />
        <StatCard
          title={"Today's Reservations"}
          value={kpis?.todaysReservations != null ? kpis.todaysReservations.toLocaleString() : "0"}
          change={kpis?.deltas?.todaysReservations || ""}
          icon={UserPlus}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          trend="up"
        />
        <StatCard
          title="Total Revenue"
          value={kpis?.totalRevenue != null ? `₦${Number(kpis.totalRevenue).toLocaleString()}` : "₦0"}
          change={kpis?.deltas?.totalRevenue || ""}
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-success"
          trend="up"
        />
        <StatCard
          title="Pending Payments"
          value={kpis?.pendingPayments != null ? `₦${Number(kpis.pendingPayments).toLocaleString()}` : "₦0"}
          change={kpis?.deltas?.pendingPayments || ""}
          icon={AlertCircle}
          iconBg="bg-yellow-100"
          iconColor="text-warning"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Transaction</CardTitle>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto">
              View All <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-3">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "received" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {tx.type === "received" ? (
                        <ArrowDownRight className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {tx.type === "received" ? "Payment Received" : "Payout Sent"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.type === "received" ? `From: ${tx.from}` : `To: ${tx.to}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      tx.type === "received" ? "text-success" : "text-destructive"
                    }`}>
                      {tx.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Earnings Trends</CardTitle>
            <div className="flex gap-2">
              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
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
            <div className="h-48 flex items-end gap-2">
              {recent.map((d, i) => (
                <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/30 transition-colors rounded-t" style={{ height: `${Math.max(5, (Number(d.value) / maxVal) * 100)}%` }} title={`${d.label}: ${formatNaira(d.value)}`} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {recent.map((d, i) => (
                <span key={i}>{d.label}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
                  <Badge variant="default" className="bg-success text-success-foreground">
                    {vendor.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}