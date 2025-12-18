import { useEffect, useState, useCallback } from "react";
import { Plus, Upload, SlidersHorizontal, ChevronDown, MoreVertical, Calendar, DollarSign, Users, AlertCircle, Edit, Save, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWebSocket } from "@/contexts/WebSocketContext";


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
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editForm, setEditForm] = useState({
    guests: "",
    date: "",
    time: "",
    status: "",
    paymentStatus: "",
  });
  const [dateFilter, setDateFilter] = useState("Today");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const { subscribe, unsubscribe, sendMessage } = useWebSocket();

  const fetchReservations = useCallback(async (extra = {}) => {
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
  }, [filters]);

  useEffect(() => {
    fetchReservations();

    const handleReservationUpdate = (updatedReservation) => {
      setReservations((prev) =>
        prev.map((r) => (r.id === updatedReservation.id ? updatedReservation : r))
      );
      fetchCounters();
    };

    const handleReservationCreate = (newReservation) => {
      setReservations((prev) => [newReservation, ...prev]);
      fetchCounters();
    };

    const handleReservationDelete = (deletedReservation) => {
      setReservations((prev) => prev.filter((r) => r.id !== deletedReservation.id));
      fetchCounters();
    };

    subscribe("reservation-updated", handleReservationUpdate);
    subscribe("reservation-created", handleReservationCreate);
    subscribe("reservation-deleted", handleReservationDelete);

    return () => {
      unsubscribe("reservation-updated");
      unsubscribe("reservation-created");
      unsubscribe("reservation-deleted");
    };
  }, [subscribe, unsubscribe, fetchReservations]);

  const fetchCounters = async () => {
    try {
      const countersRes = await getReservationCounters();
      const c = countersRes?.data || {};
      setCounters({
        todays: c.todays ?? c.todaysReservations ?? 0,
        prepaid: c.prepaid ?? c.prepaidReservations ?? 0,
        expectedGuests: c.expectedGuests ?? 0,
        pendingPayments: c.pendingPayments ?? 0,
      });
    } catch (e) {
      console.error("Failed to load reservation counters", e);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);
  
  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setDetailsModalOpen(true);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setEditForm({
      guests: reservation.guests || "",
      date: reservation.date || reservation.checkInDate || "",
      time: reservation.time || reservation.checkInTime || "",
      status: reservation.status || reservation.reservationStatus || "",
      paymentStatus: reservation.paymentStatus || reservation.payment?.status || "",
    });
    setEditModalOpen(true);
  };

  const handleCancel = async (reservation) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }
    try {
      sendMessage("reservation-updated", { ...reservation, status: "Cancelled" });
    } catch (e) {
      console.error("Failed to cancel reservation", e);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedReservation) return;
    try {
      const updatedReservation = {
        ...selectedReservation,
        guests: editForm.guests,
        date: editForm.date,
        time: editForm.time,
        status: editForm.status,
        paymentStatus: editForm.paymentStatus,
      };
      sendMessage("reservation-updated", updatedReservation);
      setEditModalOpen(false);
      setSelectedReservation(null);
    } catch (e) {
      console.error("Failed to update reservation", e);
    }
  };

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

          <div className="flex gap-4 items-start">
            <Input placeholder="Search by guest name or ID" className="flex-1 min-w-[200px]" />
            <div className="flex flex-col gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-[120px]">
                    {dateFilter} <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDateFilter("Today")}>Today</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("Tomorrow")}>Tomorrow</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("This Week")}>This Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("This Month")}>This Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("All")}>All</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-[140px]">
                    {paymentFilter} <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setPaymentFilter("All")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("Paid")}>Paid</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("Pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("Failed")}>Failed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(res)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(res)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCancel(res)}>Cancel</DropdownMenuItem>
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

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm">{selectedReservation.customer || selectedReservation.customerName || selectedReservation.user?.name || "Guest"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm">{selectedReservation.id || selectedReservation._id || selectedReservation.reference}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{selectedReservation.date || selectedReservation.checkInDate || selectedReservation.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time</Label>
                  <p className="text-sm">{selectedReservation.time || selectedReservation.checkInTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Guests</Label>
                  <p className="text-sm">{selectedReservation.guests}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="secondary">{selectedReservation.status || selectedReservation.reservationStatus}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment</Label>
                  <Badge variant="secondary">{selectedReservation.payment || selectedReservation.paymentStatus || selectedReservation.payment?.status || "-"}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Meal</Label>
                  <Badge variant="secondary">{selectedReservation.meal === "Yes" || selectedReservation.mealPreselected || selectedReservation.meal?.preselected ? "✓ Yes" : "✗ No"}</Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-guests">Guests</Label>
                <Input
                  id="edit-guests"
                  type="number"
                  value={editForm.guests}
                  onChange={(e) => setEditForm(f => ({ ...f, guests: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm(f => ({ ...f, time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm(f => ({ ...f, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No-show">No-show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-payment">Payment Status</Label>
                <Select value={editForm.paymentStatus} onValueChange={(value) => setEditForm(f => ({ ...f, paymentStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
