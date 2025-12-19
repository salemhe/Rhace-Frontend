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
} from "lucide-react";
import {
  LineChart,
  Line,
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
} from "@/services/admin.service";
import { useWebSocket } from "@/contexts/WebSocketContext";
import placeholderLogo from "@/public/images/Rhace-11.png";

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

const bankLogos = {
  "Zenith Bank": placeholderLogo,
  "Guaranty Trust Bank": placeholderLogo,
  "First Bank": placeholderLogo,
  "Access Bank": placeholderLogo,
  "United Bank for Africa": placeholderLogo,
  "Fidelity Bank": placeholderLogo,
  "Union Bank": placeholderLogo,
  "Ecobank": placeholderLogo,
  "Stanbic IBTC": placeholderLogo,
  "Wema Bank": placeholderLogo,
  Default: placeholderLogo,
};

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("earning");
  const [historyFilter, setHistoryFilter] = useState("All");
  const [vendorsEarnings, setVendorsEarnings] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [dashboardKPIs, setDashboardKPIs] = useState({});
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [loadingKPIs, setLoadingKPIs] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "Zenith Bank",
    accountNumber: "••••••123456",
    accountName: "Joseph Eyebiokun",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempBankDetails, setTempBankDetails] = useState({ ...bankDetails });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [tempAddDetails, setTempAddDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const { subscribe, unsubscribe } = useWebSocket();

  const load = async () => {
    try {
      setLoadingEarnings(true);
      const earningsRes = await getVendorsEarnings();
      console.log("Earnings API response:", earningsRes);

      const earnings = Array.isArray(earningsRes?.data)
        ? earningsRes.data
        : earningsRes?.data?.data || earningsRes?.data?.items || [];

      console.log("Processed earnings array:", earnings);

      const vendorsWithEarnings = earnings.map((vendor) => ({
        id: vendor.id,
        name: vendor.businessName || vendor.name,
        totalEarned: vendor.totalEarned
          ? `₦${vendor.totalEarned.toLocaleString()}`
          : "₦0",
        commission: vendor.commission
          ? `₦${vendor.commission.toLocaleString()}`
          : "₦0",
        amountDue: vendor.amountDue
          ? `₦${vendor.amountDue.toLocaleString()}`
          : "₦0",
        lastPayout: vendor.lastPayout
          ? new Date(vendor.lastPayout).toLocaleDateString()
          : "-",
        status: vendor.status || "Pending",
      }));

      console.log("Vendors with earnings:", vendorsWithEarnings);
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
      await initiatePayout({ vendorId, amount: parseFloat(amount) });
      // Refresh data after successful payout initiation
      load();
      alert("Payout initiated successfully");
    } catch (error) {
      console.error("Failed to initiate payout:", error);
      alert("Failed to initiate payout");
    }
  };

  const handleApprovePayout = async (payoutId) => {
    try {
      await approvePayout(payoutId);
      // Refresh payout history after approval
      const loadPayouts = async () => {
        const res = await getPayouts({ page: 1, limit: 20 });
        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.data || payload?.items || payload?.results || [];
        setPayoutHistory(Array.isArray(list) ? list : []);
      };
      loadPayouts();
      alert("Payout approved successfully");
    } catch (error) {
      console.error("Failed to approve payout:", error);
      alert("Failed to approve payout");
    }
  };

  const handleEditBankDetails = () => {
    setTempBankDetails({ ...bankDetails });
    setEditDialogOpen(true);
  };

  const handleSaveBankDetails = () => {
    setBankDetails({ ...tempBankDetails });
    setEditDialogOpen(false);
    // Optionally save to localStorage or API
    localStorage.setItem("bankDetails", JSON.stringify(tempBankDetails));
  };

  const handleCancelEdit = () => {
    setTempBankDetails({ ...bankDetails });
    setEditDialogOpen(false);
  };

  const handleAddAccount = () => {
    setTempAddDetails({
      bankName: "",
      accountNumber: "",
      accountName: "",
    });
    setAddDialogOpen(true);
  };

  const handleSaveAddAccount = () => {
    setBankDetails({ ...tempAddDetails });
    setAddDialogOpen(false);
    localStorage.setItem("bankDetails", JSON.stringify(tempAddDetails));
  };

  const handleCancelAdd = () => {
    setTempAddDetails({
      bankName: "",
      accountNumber: "",
      accountName: "",
    });
    setAddDialogOpen(false);
  };

  useEffect(() => {
    const savedBankDetails = localStorage.getItem("bankDetails");
    if (savedBankDetails) {
      setBankDetails(JSON.parse(savedBankDetails));
    }
    let ignore = false;

    const loadKPIs = async () => {
      try {
        setLoadingKPIs(true);
const kpisRes = await getDashboardKPIs();
        if (!ignore) setDashboardKPIs(kpisRes?.data || {});
      } catch (e) {
        console.error("Failed to load KPIs", e);
        if (!ignore) setDashboardKPIs({});
      } finally {
        if (!ignore) setLoadingKPIs(false);
      }
    };

    const loadRevenueTrends = async () => {
      try {
        const trendsRes = await getRevenueTrends();
        const trends = Array.isArray(trendsRes?.data)
          ? trendsRes.data
          : trendsRes?.data?.data || [];
        if (!ignore) setRevenueTrends(trends);
      } catch (e) {
        console.error("Failed to load revenue trends", e);
        if (!ignore) setRevenueTrends([]);
      }
    };

    const loadPayouts = async () => {
      try {
        setLoadingPayouts(true);
        const res = await getPayouts({ page: 1, limit: 20 });
        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.data || payload?.items || payload?.results || [];
        if (!ignore) setPayoutHistory(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Failed to load payouts", e);
        if (!ignore) setPayoutHistory([]);
      } finally {
        if (!ignore) setLoadingPayouts(false);
      }
    };

    load();
    loadPayouts();
    loadKPIs();
    loadRevenueTrends();

    const handlePaymentUpdate = (payload) => {
      console.log("Payment update received in Payments component:", payload);
      load();
      loadPayouts();
    };

    subscribe("payment_update", handlePaymentUpdate);
    subscribe("payout_update", handlePaymentUpdate);

    return () => {
      ignore = true;
      unsubscribe("payment_update");
      unsubscribe("payout_update");
    };
  }, [subscribe, unsubscribe]);

  // Compute available balance and last payment date from loaded data
  useEffect(() => {
    const totalAvailableBalance = vendorsEarnings.reduce((sum, vendor) => {
      const amountStr = vendor.amountDue;
      const amount = parseFloat(amountStr.replace('₦', '').replace(/,/g, '')) || 0;
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

  return (
    <div className="p-4 md:p-6 space-y-6">
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
                value={dashboardKPIs.completedPayments ? `₦${dashboardKPIs.completedPayments.toLocaleString()}` : "₦0"}
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
                  <h3 className="text-2xl md:text-3xl font-bold mt-1">{dashboardKPIs.availableBalance ? `₦${dashboardKPIs.availableBalance.toLocaleString()}` : "₦0"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Last payment processed on {dashboardKPIs.lastPaymentDate ? new Date(dashboardKPIs.lastPaymentDate).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>

              <Button className="w-full" onClick={() => alert('Please select a vendor from the table below to initiate a payout')}>
                <Wallet className="mr-2 h-4 w-4" />
                Initiate Payout
              </Button>

              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{bankDetails.bankName}</span>
                      </div>
                      <p className="text-xs opacity-90 mt-1">Verified Account</p>
                    </div>
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" className="h-8" onClick={handleEditBankDetails}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Bank Details</DialogTitle>
                          <DialogDescription>
                            Update your bank account information for payouts.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bankName" className="text-right">
                              Bank Name
                            </Label>
                            <Input
                              id="bankName"
                              value={tempBankDetails.bankName}
                              onChange={(e) => setTempBankDetails({ ...tempBankDetails, bankName: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="accountNumber" className="text-right">
                              Account Number
                            </Label>
                            <Input
                              id="accountNumber"
                              value={tempBankDetails.accountNumber}
                              onChange={(e) => setTempBankDetails({ ...tempBankDetails, accountNumber: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="accountName" className="text-right">
                              Account Name
                            </Label>
                            <Input
                              id="accountName"
                              value={tempBankDetails.accountName}
                              onChange={(e) => setTempBankDetails({ ...tempBankDetails, accountName: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveBankDetails}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="pt-4">
                    <p className="text-xl tracking-wider">{bankDetails.accountNumber}</p>
                    <p className="text-sm mt-2">{bankDetails.accountName}</p>
                  </div>
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full" onClick={handleAddAccount}>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>

              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Bank Account</DialogTitle>
                    <DialogDescription>
                      Add a new bank account for receiving payouts.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="addBankName" className="text-right">
                        Bank Name
                      </Label>
                      <Input
                        id="addBankName"
                        value={tempAddDetails.bankName}
                        onChange={(e) => setTempAddDetails({ ...tempAddDetails, bankName: e.target.value })}
                        className="col-span-3"
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="addAccountNumber" className="text-right">
                        Account Number
                      </Label>
                      <Input
                        id="addAccountNumber"
                        value={tempAddDetails.accountNumber}
                        onChange={(e) => setTempAddDetails({ ...tempAddDetails, accountNumber: e.target.value })}
                        className="col-span-3"
                        placeholder="Enter account number"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="addAccountName" className="text-right">
                        Account Name
                      </Label>
                      <Input
                        id="addAccountName"
                        value={tempAddDetails.accountName}
                        onChange={(e) => setTempAddDetails({ ...tempAddDetails, accountName: e.target.value })}
                        className="col-span-3"
                        placeholder="Enter account name"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelAdd}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAddAccount}>
                      Add Account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-semibold">Earnings Trends</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold">{revenueTrends.length > 0 ? revenueTrends.length : 0}</span>
                    <span className="text-sm text-success flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {dashboardKPIs.revenueChange || "0% vs last week"}
                    </span>
                  </div>
                </div>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueTrends.length > 0 ? revenueTrends : earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary))" fillOpacity={0.1} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-semibold">Vendor's Earnings</h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select defaultValue="date">
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="status">
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
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
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Last Payout Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(loadingEarnings ? [] : vendorsEarnings).map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">K</span>
                          </div>
                          <span className="font-medium">{vendor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.totalEarned}</TableCell>
                      <TableCell>{vendor.commission}</TableCell>
                      <TableCell>{vendor.amountDue}</TableCell>
                      <TableCell>{vendor.lastPayout}</TableCell>
                      <TableCell>
                        <Badge variant={vendor.status === "Paid" ? "default" : "secondary"}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInitiatePayout(vendor.id, vendor.amountDue.replace('₦', '').replace(/,/g, ''))}>Initiate Payout</DropdownMenuItem>
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

        <TabsContent value="history" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Payouts"
              value={dashboardKPIs.totalPayouts ? `₦${dashboardKPIs.totalPayouts.toLocaleString()}` : "₦0"}
              change={dashboardKPIs.totalPayoutsChange || "+0% from last year"}
              trend={dashboardKPIs.totalPayoutsTrend || "up"}
              icon={Wallet}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
            <StatCard
              title="Pending Payouts"
              value={dashboardKPIs.pendingPayouts ? `₦${dashboardKPIs.pendingPayouts.toLocaleString()}` : "₦0"}
              change={dashboardKPIs.pendingPayoutsChange || "+0% vs last week"}
              trend={dashboardKPIs.pendingPayoutsTrend || "up"}
              icon={Clock}
              iconBg="bg-warning/10"
              iconColor="text-warning"
            />
            <StatCard
              title="Successful Payouts"
              value={dashboardKPIs.successfulPayouts ? `₦${dashboardKPIs.successfulPayouts.toLocaleString()}` : "₦0"}
              change={dashboardKPIs.successfulPayoutsChange || "+0% vs last week"}
              trend={dashboardKPIs.successfulPayoutsTrend || "up"}
              icon={CheckCircle}
              iconBg="bg-success/10"
              iconColor="text-success"
            />
            <StatCard
              title="Last Payout"
              value={dashboardKPIs.lastPayout ? `₦${dashboardKPIs.lastPayout.toLocaleString()}` : "₦0"}
              change={dashboardKPIs.lastPayoutChange || "+0% vs last week"}
              trend={dashboardKPIs.lastPayoutTrend || "down"}
              icon={TrendingUp}
              iconBg="bg-purple-500/10"
              iconColor="text-purple-500"
            />
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
                  <Input
                    placeholder="Search transactions"
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select defaultValue="date">
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="status">
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
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
                    <TableRow>
                      <TableCell colSpan={7} className="text-sm text-muted-foreground">Loading payouts...</TableCell>
                    </TableRow>
                  ) : payoutHistory.map((payout, index) => (
                    <TableRow key={payout.id || index}>
                      <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">K</span>
                          </div>
                          <span className="font-medium">{payout.vendor}</span>
                        </div>
                      </TableCell>
                      <TableCell>{typeof payout.amount === 'number' ? `₦${payout.amount.toLocaleString()}` : payout.amount}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>{payout.date || (payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : "-")}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            payout.status === "Success" || payout.status === "completed" ? "default" : 
                            payout.status === "Pending" || payout.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
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
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {[1, 2, 3, "...", 10, 11, 12].map((page, idx) => (
                  <Button
                    key={idx}
                    variant={page === 1 ? "default" : "outline"}
                    size="icon"
                    className="w-10"
                    disabled={page === "..."}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}