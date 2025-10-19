import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/Statcard";
import { Wallet, TrendingUp, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, MoreVertical, Search, SlidersHorizontal, Edit, Plus, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getPayouts, getVendorEarnings } from "@/services/admin.service";

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



export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("earning");
  const [historyFilter, setHistoryFilter] = useState("All");
  const [vendorsEarnings, setVendorsEarnings] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [loadingPayouts, setLoadingPayouts] = useState(false);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoadingEarnings(true);
        // If admin-wide earnings endpoint exists, replace vendorId or implement list
        // For now, we'll just leave empty or expect backend to provide a list endpoint.
      } finally {
        if (!ignore) setLoadingEarnings(false);
      }
    };

    const loadPayouts = async () => {
      try {
        setLoadingPayouts(true);
        const res = await getPayouts({ page: 1, limit: 20 });
        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : (payload?.data || payload?.items || payload?.results || []);
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
    return () => { ignore = true; };
  }, []);

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
                value="₦2,567,456.00"
                change="+12% from last year"
                trend="up"
                icon={Wallet}
                iconBg="bg-blue-500/10"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Earnings this Week"
                value="₦525,345.00"
                change="+6% vs last week"
                trend="up"
                icon={TrendingUp}
                iconBg="bg-success/10"
                iconColor="text-success"
              />
              <StatCard
                title="Completed Payments"
                value="₦372,556.00"
                change="+8% vs last week"
                trend="up"
                icon={CheckCircle}
                iconBg="bg-purple-500/10"
                iconColor="text-purple-500"
              />
              <StatCard
                title="Today's Earnings"
                value="₦152,789.00"
                change="-5% vs last week"
                trend="down"
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
                  <h3 className="text-2xl md:text-3xl font-bold mt-1">₦567,456.00</h3>
                  <p className="text-xs text-muted-foreground mt-1">Last payment processed on May 31st, 2025</p>
                </div>
              </div>

              <Button className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Initiate Payout
              </Button>

              <Card className="bg-gradient-to-br from-primary/90 to-primary text-white p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-sm font-medium">Zenith Bank</span>
                    </div>
                    <p className="text-xs opacity-90 mt-1">Verified Account</p>
                  </div>
                  <Button size="sm" variant="secondary" className="h-8">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="pt-4">
                  <p className="text-xl tracking-wider">••••••123456</p>
                  <p className="text-sm mt-2">Joseph Eyebiokun</p>
                </div>
              </Card>

              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-semibold">Earnings Trends</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold">104</span>
                    <span className="text-sm text-success flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      8% vs last week
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
                <LineChart data={earningsData}>
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
                            <DropdownMenuItem>Initiate Payout</DropdownMenuItem>
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
              value="₦2,567,456.00"
              change="+12% from last year"
              trend="up"
              icon={Wallet}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
            <StatCard
              title="Pending Payouts"
              value="₦525,345.00"
              change="+2% vs last week"
              trend="up"
              icon={Clock}
              iconBg="bg-warning/10"
              iconColor="text-warning"
            />
            <StatCard
              title="Successful Payouts"
              value="₦372,556.00"
              change="+8% vs last week"
              trend="up"
              icon={CheckCircle}
              iconBg="bg-success/10"
              iconColor="text-success"
            />
            <StatCard
              title="Last Payout"
              value="₦152,789.00"
              change="-5% vs last week"
              trend="down"
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
                    <TableRow key={index}>
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