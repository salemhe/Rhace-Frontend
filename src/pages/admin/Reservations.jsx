import { useEffect, useState } from "react";
import { Plus, Upload, SlidersHorizontal, ChevronDown, MoreVertical, Calendar, DollarSign, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/Statcard";
import { getReservations, getReservationCounters } from "@/services/admin.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function Reservations() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Upcoming", "Completed", "Cancelled", "No shows"];
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counters, setCounters] = useState({ todays: 0, prepaid: 0, expectedGuests: 0, pendingPayments: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    fromDate: "",
    toDate: "",
    hasMeals: "",
  });

  const fetchReservations = async (extra = {}) => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 20,
        status: filters.status || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        hasMeals: filters.hasMeals || undefined,
        ...extra,
      };
      const listRes = await getReservations(params);
      const payload = listRes?.data;
      const list = Array.isArray(payload) ? payload : (payload?.data || payload?.items || payload?.results || []);
      setReservations(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load reservations", e);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const [_, countersRes] = await Promise.all([
          fetchReservations(),
          getReservationCounters(),
        ]);
        const c = countersRes?.data || {};
        if (!ignore) setCounters({
          todays: c.todays ?? c.todaysReservations ?? 0,
          prepaid: c.prepaid ?? c.prepaidReservations ?? 0,
          expectedGuests: c.expectedGuests ?? 0,
          pendingPayments: c.pendingPayments ?? 0,
        });
      } catch (e) {
        console.error("Failed to load reservations", e);
        if (!ignore) {
          setReservations([]);
          setCounters({ todays: 0, prepaid: 0, expectedGuests: 0, pendingPayments: 0 });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reservation List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Reservations made today"
          value={counters.todays?.toString() || "0"}
          change=""
          icon={Calendar}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
        />
        <StatCard
          title="Prepaid Reservations"
          value={counters.prepaid?.toString() || "0"}
          change=""
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-success"
          trend="up"
        />
        <StatCard
          title="Expected Guests Today"
          value={counters.expectedGuests?.toString() || "0"}
          change=""
          icon={Users}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          trend="up"
        />
        <StatCard
          title="Pending Payments"
          value={`₦${Number(counters.pendingPayments || 0).toLocaleString()}`}
          change=""
          icon={AlertCircle}
          iconBg="bg-yellow-100"
          iconColor="text-warning"
          trend="down"
        />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Search by guest name or ID" className="w-64" />
            <Button variant="outline" size="sm">
              Today <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="sm">
              Payment Status <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Advanced filter" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-accent/30">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  <Checkbox />
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Customer name</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">No of Guests</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Meal Preselected</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Payment Status</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Reservation Status</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3 text-sm text-muted-foreground" colSpan={8}>Loading reservations...</td>
                </tr>
              ) : reservations.map((res, i) => (
                <tr key={i} className="border-b hover:bg-accent/50">
                  <td className="p-3">
                    <Checkbox />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback>EJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{res.customer || res.customerName || res.user?.name || "Guest"}</p>
                        <p className="text-xs text-muted-foreground">ID: {res.id || res._id || res.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{res.date || res.checkInDate || res.createdAt}</p>
                    <p className="text-xs text-muted-foreground">Time: {res.time || res.checkInTime}</p>
                  </td>
                  <td className="p-3 text-sm text-center">{res.guests}</td>
                  <td className="p-3">
                    <Badge 
                      variant="secondary"
                      className={res.meal === "Yes" || res.mealPreselected || res.meal?.preselected ? "bg-green-100 text-success" : "bg-red-100 text-destructive"}
                    >
                      {(res.meal === "Yes" || res.mealPreselected || res.meal?.preselected) ? "✓ Yes" : "✗ No"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge 
                      variant="secondary"
                      className={(res.payment === "Paid" || res.paymentStatus === "paid" || res.payment?.status === "paid") ? "bg-green-100 text-success" : "bg-red-100 text-destructive"}
                    >
                      {res.payment || res.paymentStatus || res.payment?.status || "-"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge 
                      variant="secondary"
                      className={
                        (res.status || res.reservationStatus) === "Upcoming" 
                          ? "bg-blue-100 text-info" 
                          : "bg-yellow-100 text-warning"
                      }
                    >
                      {res.status || res.reservationStatus}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">Page 1 of 30</p>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 10, 11, 12].map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 text-sm rounded ${
                  page === 1 ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Advanced Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)}>Close</Button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select className="w-full border rounded px-2 py-1" value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No-show</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Payment Status</label>
                  <select className="w-full border rounded px-2 py-1" value={filters.paymentStatus} onChange={(e) => setFilters(f => ({ ...f, paymentStatus: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">From Date</label>
                  <input type="date" className="w-full border rounded px-2 py-1" value={filters.fromDate} onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">To Date</label>
                  <input type="date" className="w-full border rounded px-2 py-1" value={filters.toDate} onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Meal Preselected</label>
                <select className="w-full border rounded px-2 py-1" value={filters.hasMeals} onChange={(e) => setFilters(f => ({ ...f, hasMeals: e.target.value }))}>
                  <option value="">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => { setFilters({ status: "", paymentStatus: "", fromDate: "", toDate: "", hasMeals: "" }); }}>Reset</Button>
              <Button onClick={() => { setFiltersOpen(false); fetchReservations(); }}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}