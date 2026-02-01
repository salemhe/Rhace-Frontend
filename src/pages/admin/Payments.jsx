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
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const { subscribe, unsubscribe } = useWebSocket();

  const load = async () => {
    try {
      setLoadingEarnings(true);
      const earningsRes = await getVendorsEarnings();
      
      // FIX: Access the 'earnings' property from the response data
      const earnings = earningsRes?.data?.earnings || [];

      const vendorsWithEarnings = earnings.map((vendor) => {
        const totalEarnings = vendor.totalEarnings || 0;
        const totalPayments = vendor.totalPayments || 0;
        const amountDue = totalEarnings - totalPayments;
        const hasRecentPayout = vendor.lastPaymentDate && new Date(vendor.lastPaymentDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

        // Determine status based on payment logic
        let status = "Pending";
        if (amountDue <= 0) {
          status = "Paid";
        } else if (hasRecentPayout) {
          status = "Partially Paid";
        } else if (vendor.status) {
          status = vendor.status; // Use API status if available
        }

        return {
          id: vendor.vendorId || vendor._id,
          name: vendor.vendorName || vendor.businessName || vendor.name,
          totalEarned: totalEarnings
            ? `₦${totalEarnings.toLocaleString()}`
            : "₦0",
          commission: totalPayments
            ? `₦${totalPayments.toLocaleString()}`
            : "₦0",
          amountDue: amountDue > 0
            ? `₦${amountDue.toLocaleString()}`
            : "₦0",
          lastPayout: vendor.lastPaymentDate
            ? new Date(vendor.lastPaymentDate).toLocaleDateString()
            : "-",
          status: status,
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
      // Validate bank details before proceeding
      if (!bankDetails.accountNumber || bankDetails.accountNumber.includes('•')) {
        alert("Please update your bank account details with a valid account number before initiating a payout.");
        return;
      }

      // Include bank details if available
      const payoutData = {
        vendorId,
        amount: parseFloat(amount),
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName
      };

      await initiatePayout(payoutData);
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

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setDetailsModalOpen(true);
  };

  const handlePeriodChange = async (value) => {
    setSelectedPeriod(value);
    // Reload revenue trends with the new period
    await loadRevenueTrends(value);
  };

  const loadRevenueTrends = async (period = selectedPeriod) => {
    try {
      const trendsRes = await getRevenueTrends({ period });
      let trends = [];

      // Handle different response formats
      if (Array.isArray(trendsRes?.data)) {
        trends = trendsRes.data;
      } else if (trendsRes?.data?.data && Array.isArray(trendsRes.data.data)) {
        trends = trendsRes.data.data;
      } else if (trendsRes?.data && Array.isArray(trendsRes.data)) {
        trends = trendsRes.data;
      }

      // Ensure data has the correct format for the chart
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
    if (savedBankDetails) {
      setBankDetails(JSON.parse(savedBankDetails));
    }
    let ignore = false;

    const loadKPIs = async () => {
      try {
        setLoadingKPIs(true);
        const kpisRes = await getDashboardKPIs();
        const kpis = kpisRes?.data?.data || kpisRes?.data || kpisRes || {};
        if (!ignore) {
          // Exclude earnings-related keys to prevent overwriting data from getTotalEarnings
          const earningsKeys = [
            'totalEarnings', 'totalEarningsChange', 'totalEarningsTrend',
            'weeklyEarnings', 'weeklyEarningsChange', 'weeklyEarningsTrend',
            'completedPayments', 'completedPaymentsChange', 'completedPaymentsTrend',
            'availableBalance', 'lastPaymentDate'
          ];
          const filteredKpis = Object.keys(kpis).reduce((acc, key) => {
            if (!earningsKeys.includes(key)) {
              acc[key] = kpis[key];
            }
            return acc;
          }, {});
          setDashboardKPIs(prev => ({ ...prev, ...filteredKpis }));
        }
    } catch (e) {
      console.error("Failed to load KPIs", e);
      // Don't clear KPIs on error to preserve earnings data set by loadEarnings
    } finally {
        if (!ignore) setLoadingKPIs(false);
      }
    };

    const loadRevenueTrends = async () => {
      try {
        const trendsRes = await getRevenueTrends({ period: selectedPeriod });
        let trends = [];

        // Handle different response formats
        if (Array.isArray(trendsRes?.data)) {
          trends = trendsRes.data;
        } else if (trendsRes?.data?.data && Array.isArray(trendsRes.data.data)) {
          trends = trendsRes.data.data;
        } else if (trendsRes?.data && Array.isArray(trendsRes.data)) {
          trends = trendsRes.data;
        }

        // Ensure data has the correct format for the chart
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
            // today's earnings not in response, keeping existing
          }));
        }
      } catch (e) {
        console.error("Failed to load earnings KPIs", e);
      }
    };

    load();
    loadPayouts();
    loadEarnings()
    loadKPIs();
    loadRevenueTrends();

  const handlePaymentUpdate = async (payload) => {
    console.log("Payment update received in Payments component:", payload);
    load();
    loadPayouts();

    // Reload earnings KPIs for real-time updates
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
      console.error("Failed to reload earnings KPIs on payment update", e);
    }

    // Also reload KPIs and revenue trends for real-time updates
    // Exclude earnings-related keys to prevent overwriting data from getTotalEarnings
    const earningsKeys = [
      'totalEarnings', 'totalEarningsChange', 'totalEarningsTrend',
      'weeklyEarnings', 'weeklyEarningsChange', 'weeklyEarningsTrend',
      'completedPayments', 'completedPaymentsChange', 'completedPaymentsTrend',
      'availableBalance', 'lastPaymentDate'
    ];
    try {
      const kpisRes = await getDashboardKPIs();
      const kpis = kpisRes?.data?.data || kpisRes?.data || kpisRes || {};
      setDashboardKPIs(prev => {
        const updated = { ...prev };
        Object.keys(kpis).forEach(key => {
          if (kpis[key] !== undefined && !earningsKeys.includes(key)) {
            updated[key] = kpis[key];
          }
        });
        return updated;
      });
    } catch (e) {
      console.error("Failed to reload KPIs on payment update", e);
    }

    try {
      const trendsRes = await getRevenueTrends({ period: selectedPeriod });
      const trends = Array.isArray(trendsRes?.data)
        ? trendsRes.data
        : trendsRes?.data?.data || [];
      setRevenueTrends(trends);
    } catch (e) {
      console.error("Failed to reload revenue trends on payment update", e);
    }
  };

  const handleVendorEarningsUpdate = (payload) => {
    console.log("Vendor earnings update received:", payload);
    load(); // Reload vendor earnings data
  };

  const handleEarningsUpdate = (payload) => {
    console.log("Earnings update received:", payload);
    load(); // Reload vendors earnings and KPIs for real-time updates
  };

    subscribe("payment_update", handlePaymentUpdate);
    subscribe("payout_update", handlePaymentUpdate);
    subscribe("vendor-earnings-updated", handleVendorEarningsUpdate);
    subscribe("earnings-updated", handleEarningsUpdate);

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
                    <SelectTrigger className="w-32 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
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
                  <LineChart
                    data={revenueTrends.length > 0 ? revenueTrends : earningsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#8b5cf6"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke="#f1f5f9"
                      strokeWidth={1}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                      }}
                      labelStyle={{ color: '#374151', fontWeight: '600' }}
                      formatter={(value) => [`₦${value.toLocaleString()}`, 'Earnings']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="none"
                      fill="url(#earningsGradient)"
                      strokeWidth={0}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                      activeDot={{
                        r: 6,
                        fill: '#3b82f6',
                        stroke: '#ffffff',
                        strokeWidth: 2,
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                      }}
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
                  {loadingEarnings ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-sm text-muted-foreground">Loading earnings...</TableCell>
                    </TableRow>
                  ) : vendorsEarnings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-sm text-muted-foreground text-center py-8">No vendors with earnings found</TableCell>
                    </TableRow>
                  ) : (
                    vendorsEarnings.map((vendor) => (
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
                              <DropdownMenuItem onClick={() => handleViewDetails(vendor)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleInitiatePayout(vendor.id, vendor.amountDue.replace('₦', '').replace(/,/g, ''))}>Initiate Payout</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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

      {/* Vendor Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vendor Earnings Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Vendor Name</Label>
                  <p className="text-sm mt-1">{selectedVendor.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vendor ID</Label>
                  <p className="text-sm mt-1">{selectedVendor.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Earned</Label>
                  <p className="text-sm mt-1 font-semibold text-green-600">{selectedVendor.totalEarned}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Commission Earned</Label>
                  <p className="text-sm mt-1 font-semibold text-blue-600">{selectedVendor.commission}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount Due</Label>
                  <p className="text-sm mt-1 font-semibold text-orange-600">{selectedVendor.amountDue}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Payout Date</Label>
                  <p className="text-sm mt-1">{selectedVendor.lastPayout}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedVendor.status === "Paid" ? "default" : "secondary"} className="mt-1">
                    {selectedVendor.status}
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
                    <p className="text-xs text-muted-foreground">Pending Payment</p>
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
