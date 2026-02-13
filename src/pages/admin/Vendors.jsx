import { useEffect, useState } from "react";
import { Plus, Upload, SlidersHorizontal, ChevronDown, MoreVertical, Eye, UserX, KeyRound, Star, Calendar, Mail, Phone, MapPin, Building, CreditCard, Globe, Clock, DollarSign, FileText, Award, CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getVendors, getVendorById, updateVendorStatus, deleteVendor, exportVendors, getUsers, getVendorStats, getTopVendors, getReservations } from "@/services/admin.service";
import { toast } from "react-toastify";
import { useWebSocket } from "@/contexts/WebSocketContext";

const extractArray = (p) => {
  if (Array.isArray(p)) return p;
  const candidates = [
    p?.data, p?.items, p?.results, p?.docs, p?.rows, p?.vendors, p?.list,
    p?.data?.data, p?.data?.items, p?.data?.results, p?.data?.docs, p?.data?.rows, p?.data?.vendors,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
};

export default function Vendors() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Active", "Inactive", "Pending"];
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [hideTabs, setHideTabs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [editingVendor, setEditingVendor] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [totalVendors, setTotalVendors] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    suspended: 0
  });
  const { subscribe, unsubscribe, sendMessage } = useWebSocket();

  const calculateStatsFromVendors = (vendorList) => {
    const stats = {
      total: vendorList.length,
      active: 0,
      inactive: 0,
      pending: 0,
      suspended: 0
    };

    vendorList.forEach(vendor => {
      const status = vendor.status || 'Active';
      if (status === 'Active') stats.active++;
      else if (status === 'Inactive') stats.inactive++;
      else if (status === 'Pending') stats.pending++;
      else if (status === 'Suspended') stats.suspended++;
    });

    return stats;
  };

  const loadStats = async () => {
    try {
      const statsRes = await getVendorStats();
      const statsData = statsRes?.data;

      // Only use API data if it contains meaningful values (not all zeros)
      if (statsData && typeof statsData === 'object' &&
          (statsData.total > 0 || statsData.active > 0 || statsData.inactive > 0 || statsData.pending > 0 || statsData.suspended > 0)) {
        setStats({
          total: statsData.total || 0,
          active: statsData.active || 0,
          inactive: statsData.inactive || 0,
          pending: statsData.pending || 0,
          suspended: statsData.suspended || 0
        });
        setTotalVendors(statsData.total || 0);
      } else {
        // API returned empty/invalid data, keep current calculated stats
        console.warn("API stats empty or invalid, keeping current stats");
      }
    } catch (e) {
      console.error("Failed to load stats from API, keeping current stats", e);
      // Don't override with calculated stats here, let the useEffect handle it
    }
  };

  const loadVendors = async () => {
    setLoading(true);
    try {
      // Fetch current page vendors and all reservations in parallel
      const [vendorsRes, reservationsRes] = await Promise.all([
        getVendors({ page: currentPage, limit: 20 }),
        getReservations({ limit: 1000 }).catch(() => ({ data: [] })) // Fetch all reservations with high limit
      ]);

      const payload = vendorsRes?.data;
      const list = extractArray(payload);
      const reservationsData = extractArray(reservationsRes?.data);

      // Create a map of vendor reservation counts from all reservations
      const vendorReservationsMap = {};
      reservationsData.forEach(reservation => {
        const vendorId = reservation.vendorId || reservation.vendor?.id || reservation.vendor?._id;
        if (vendorId) {
          vendorReservationsMap[vendorId] = (vendorReservationsMap[vendorId] || 0) + 1;
        }
      });



      // Process vendors to set status based on last seen (active by default, inactive after 1 month)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const processedVendors = list.map(vendor => {
        const lastSeen = vendor.lastSeen || vendor.lastActivity || vendor.updatedAt;
        const lastSeenDate = lastSeen ? new Date(lastSeen) : null;
        vendor.status = lastSeenDate ? (lastSeenDate > oneMonthAgo ? 'Active' : 'Inactive') : 'Active';
        // Use reservation count from all reservations data
        vendor.reservations = vendorReservationsMap[vendor.id || vendor._id] || 0;
        return vendor;
      });

      setVendors(processedVendors);
      setTotalPages(payload?.totalPages || 1);
      // Set totalVendors from the API response total, fallback to list length
      setTotalVendors(payload?.total || processedVendors.length);

    } catch (e) {
      console.error("Failed to load vendors", e);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();

    const handleVendorUpdate = (updatedVendor) => {
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id === updatedVendor.id || v._id === updatedVendor.id) {
            // Merge existing vendor data with updated data to preserve fields not included in update
            // Ensure contact person fields are properly updated
            const updatedContactPerson = updatedVendor.contactPerson || updatedVendor.contactName || updatedVendor.ownerName;
            const mergedVendor = { ...v, ...updatedVendor, reservations: v.reservations };
            if (updatedContactPerson) {
              mergedVendor.contactPerson = updatedContactPerson;
            }
            return mergedVendor;
          }
          return v;
        })
      );
      // Stats will be recalculated automatically by useEffect
    };

    const handleVendorCreate = (newVendor) => {
      setVendors((prev) => {
        const next = [...prev, newVendor];
        setTotalVendors((t) => (Number(t) || 0) + 1);
        return next;
      });
      // Stats will be recalculated automatically by useEffect
    };

    const handleVendorDelete = (deletedVendor) => {
      setVendors((prev) => {
        const next = prev.filter((v) => v.id !== deletedVendor.id && v._id !== deletedVendor.id);
        setTotalVendors((t) => Math.max(0, (Number(t) || 0) - 1));
        return next;
      });
      // Stats will be recalculated automatically by useEffect
    };

    const handleReservationCreated = (reservation) => {
      if (reservation.vendorId) {
        setVendors((prev) =>
          prev.map((v) =>
            (v.id === reservation.vendorId || v._id === reservation.vendorId)
              ? { ...v, reservations: (v.reservations || 0) + 1 }
              : v
          )
        );
      }
    };

    const handleReservationUpdated = (reservation) => {
      // For proper handling of vendor changes in reservation updates,
      // we reload reservation counts to ensure accuracy
      loadVendors();
    };

    const handleReservationDeleted = (reservation) => {
      if (reservation.vendorId) {
        setVendors((prev) =>
          prev.map((v) =>
            (v.id === reservation.vendorId || v._id === reservation.vendorId)
              ? { ...v, reservations: Math.max(0, (v.reservations || 0) - 1) }
              : v
          )
        );
      }
    };

    subscribe("vendor-updated", handleVendorUpdate);
    subscribe("vendor-created", handleVendorCreate);
    subscribe("vendor-deleted", handleVendorDelete);
    subscribe("reservation-created", handleReservationCreated);
    subscribe("reservation-updated", handleReservationUpdated);
    subscribe("reservation-deleted", handleReservationDeleted);

    return () => {
      unsubscribe("vendor-updated");
      unsubscribe("vendor-created");
      unsubscribe("vendor-deleted");
      unsubscribe("reservation-created");
      unsubscribe("reservation-updated");
      unsubscribe("reservation-deleted");
    };
  }, []);

  const applyFilters = () => {
    let filtered = [...vendors];
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        (vendor.businessName || vendor.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.contactPerson || vendor.contactName || vendor.ownerName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab !== "All") {
      filtered = filtered.filter(vendor => (vendor.status || "").toString() === activeTab);
    }
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(vendor => {
        const vendorDate = new Date(vendor.createdAt);
        return vendorDate >= dateRange.from && vendorDate <= dateRange.to;
      });
    }
    if (filters.status) {
      filtered = filtered.filter(vendor => (vendor.status || "").toString() === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(vendor => vendor.category === filters.category);
    }
    setFilteredVendors(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [vendors, searchQuery, activeTab, dateRange, filters]);

  // Recalculate stats whenever vendors change
  useEffect(() => {
    if (vendors.length > 0) {
      const calculatedStats = calculateStatsFromVendors(vendors);
      setStats(calculatedStats);
      setTotalVendors(calculatedStats.total);
    }
  }, [vendors]);



  const handleExport = async () => {
    try {
      const response = await exportVendors({ status: activeTab !== "All" ? activeTab : undefined });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vendors.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Failed to export vendors", e);
      alert("Failed to export vendors");
    }
  };

  const handleViewDetails = async (vendor) => {
    setSelectedVendor(vendor);
    setVendorDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    setDetailsOpen(true);
    try {
      const vendorId = vendor.id || vendor._id;
      if (!vendorId) {
        throw new Error('Vendor ID is missing');
      }
      const response = await getVendorById(vendorId);
      const data = response.data.data || response.data;

      // Check if we got a valid vendor object
      if (typeof data === 'string' || !data || (typeof data === 'object' && !data.businessName && !data.name && !data.email)) {
        throw new Error('Invalid vendor data received from server. The API may be returning a welcome message instead of vendor data.');
      }

      // Include the reservation count from the vendor list data
      setVendorDetails({ ...data, reservations: vendor.reservations || 0 });
    } catch (e) {
      console.error("Failed to load vendor details", e);
      const errorMessage = e.message || "Failed to load vendor details";
      setDetailsError(errorMessage);
      toast.error(errorMessage);
      // Keep dialog open to show error
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setEditOpen(true);
  };

  const handleDelete = async (vendor) => {
    if (!window.confirm(`Are you sure you want to delete ${vendor.businessName || vendor.name}?`)) return;
    try {
      await deleteVendor(vendor.id || vendor._id);
      toast.success("Vendor deleted successfully");
      // The WebSocket will handle the real-time update
    } catch (e) {
      console.error("Failed to delete vendor", e);
      toast.error("Failed to delete vendor");
    }
  };

  const handleUpdateVendor = async (vendor) => {
    try {
      // Only send fields that are allowed to be updated
      const allowedUpdates = {
        businessName: vendor.businessName,
        contactPerson: vendor.contactPerson,
        businessDescription: vendor.businessDescription,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        website: vendor.website,
        priceRange: vendor.priceRange,
        vendorTypeCategory: vendor.vendorTypeCategory,
        profileImages: vendor.profileImages,
        percentageCharge: vendor.percentageCharge,
        status: vendor.status,
        isVisible: vendor.isVisible
      };

      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key =>
        allowedUpdates[key] === undefined && delete allowedUpdates[key]
      );

      await updateVendor(vendor.id || vendor._id, allowedUpdates);
      toast.success("Vendor updated successfully");
      setEditOpen(false);
      setEditingVendor(null);
      // Trigger real-time update by reloading vendors
      loadVendors();
    } catch (e) {
      console.error("Failed to update vendor", e);
      toast.error("Failed to update vendor");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vendor Management</h1>
            <p className="text-gray-600 mt-2">Manage and monitor all vendor accounts in your system</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setHideTabs(!hideTabs)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Hide tabs
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Upload className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{totalVendors.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={(totalVendors / (totalVendors || 1)) * 100} className="mt-4 h-1" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Active Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <Progress value={(stats.active / (stats.total || 1)) * 100} className="mt-4 h-1" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Inactive Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inactive.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <XCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <Progress value={(stats.inactive / (stats.total || 1)) * 100} className="mt-4 h-1" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-700">Suspended Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{stats.suspended.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Shield className="h-6 w-6 text-rose-600" />
              </div>
            </div>
            <Progress value={(stats.suspended / (stats.total || 1)) * 100} className="mt-4 h-1" />
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!hideTabs && (
            <div className="flex gap-2" key={activeTab}>
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
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Search by name or email"
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline" size="sm" onClick={() => setShowFilterModal(true)}>
              Filter by date <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowFilterModal(true)}>
              Advanced filter <SlidersHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  <Checkbox />
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Vendor</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Contact Person</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Branches</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Reservations</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date Joined</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3 text-sm text-muted-foreground" colSpan={8}>Loading vendors...</td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td className="p-3 text-sm text-muted-foreground" colSpan={8}>No vendors found.</td>
                </tr>
              ) : filteredVendors.map((vendor, i) => (
                <tr key={vendor.id || vendor._id} className="border-b hover:bg-accent/50 transition-colors">
                  <td className="p-3">
                    <Checkbox />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{vendor.businessName?.charAt(0) || 'V'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{String(vendor.businessName || vendor.name || "-")}</p>
                        <p className="text-xs text-muted-foreground">{String(vendor.category || vendor.type || "")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{vendor.contactPerson || vendor.contactName || vendor.ownerName || "-"}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{vendor.branches || 1}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{vendor.reservations || 0}</p>
                  </td>
                  <td className="p-3">
                    <Badge variant={vendor.status === "Active" ? "default" : "outline"} className={vendor.status === "Active" ? "bg-green-100 text-green-800" : ""}>
                      {vendor.status || "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-accent">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(vendor)} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(vendor)} className="cursor-pointer">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(vendor)} className="cursor-pointer text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">Loading vendors...</div>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">No vendors found.</div>
            </div>
          ) : filteredVendors.map((vendor, i) => (
            <Card key={vendor.id || vendor._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox />
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{vendor.businessName?.charAt(0) || 'V'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{String(vendor.businessName || vendor.name || "-")}</p>
                    <p className="text-xs text-muted-foreground">{String(vendor.category || vendor.type || "")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{vendor.contactPerson || vendor.contactName || vendor.ownerName || "-"}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-accent">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(vendor)} className="cursor-pointer">
                      <Eye className="w-4 h-4 mr-2" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(vendor)} className="cursor-pointer">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(vendor)} className="cursor-pointer text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Badge variant={vendor.status === "Active" ? "default" : "outline"} className={vendor.status === "Active" ? "bg-green-100 text-green-800" : ""}>
                    {vendor.status || "Inactive"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Branches: {vendor.branches || 1}</p>
                  <p className="text-xs text-muted-foreground">
                  Reservations: {vendor.reservations || 0}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded ${
                  page === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Vendor Details
            </DialogTitle>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading vendor details...</div>
            </div>
          ) : vendorDetails && typeof vendorDetails !== 'string' ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold">
                    {(vendorDetails.businessName || vendorDetails.name || "V").charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {String(vendorDetails.businessName || vendorDetails.name || "Unknown Vendor")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {String(vendorDetails.category || vendorDetails.type || "No category")}
                  </p>
                  <Badge variant={vendorDetails.status === "Active" ? "default" : "outline"} className="mt-1">
                    {vendorDetails.status || "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {String(vendorDetails.contactPerson || vendorDetails.contactName || vendorDetails.ownerName || "Not specified")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {String(vendorDetails.email || "Not provided")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {String(vendorDetails.phone || "Not provided")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {String(vendorDetails.address || "Not provided")}
                      </span>
                    </div>
                    {vendorDetails.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {String(vendorDetails.website)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Business Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {vendorDetails.branches || 1} Branch{vendorDetails.branches > 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">
                        {vendorDetails.reservations || 0} Reservations
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Joined {vendorDetails.createdAt ? new Date(vendorDetails.createdAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        ID: {vendorDetails.id || vendorDetails._id || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              {(vendorDetails.operatingHours || vendorDetails.hours) && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Operating Hours
                  </h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {String(vendorDetails.operatingHours || vendorDetails.hours || "")}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {(vendorDetails.paymentMethods || vendorDetails.paymentDetails || vendorDetails.accountNumber || vendorDetails.bankDetails) && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Payment Information
                  </h4>
                  <div className="space-y-3">
                    {vendorDetails.paymentMethods && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Methods: {Array.isArray(vendorDetails.paymentMethods) ? vendorDetails.paymentMethods.join(", ") : vendorDetails.paymentMethods}
                        </span>
                      </div>
                    )}

                    {vendorDetails.accountNumber && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Account: {vendorDetails.accountNumber}
                        </span>
                      </div>
                    )}
                    {vendorDetails.bankDetails && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Bank: {String(vendorDetails.bankDetails?.bankName || (typeof vendorDetails.bankDetails === 'object' ? JSON.stringify(vendorDetails.bankDetails) : vendorDetails.bankDetails) || 'Bank details available')}
                        </span>
                      </div>
                    )}
                    {vendorDetails.paymentDetails && (
                      <div className="space-y-2">
                        {vendorDetails.paymentDetails.accountName && (
                          <p className="text-sm">
                            Account Name: {vendorDetails.paymentDetails.accountName}
                          </p>
                        )}
                        {vendorDetails.paymentDetails.accountNumber && (
                          <p className="text-sm">
                            Account Number: {vendorDetails.paymentDetails.accountNumber}
                          </p>
                        )}
                        {vendorDetails.paymentDetails.bankName && (
                          <p className="text-sm">
                            Bank Name: {vendorDetails.paymentDetails.bankName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(vendorDetails.licenseNumber || vendorDetails.registrationNumber) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Registration
                    </h4>
                    <div className="space-y-2">
                      {vendorDetails.licenseNumber && (
                        <p className="text-sm">License: {vendorDetails.licenseNumber}</p>
                      )}
                      {vendorDetails.registrationNumber && (
                        <p className="text-sm">Registration: {vendorDetails.registrationNumber}</p>
                      )}
                    </div>
                  </div>
                )}

                {(vendorDetails.rating || vendorDetails.reviews) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Ratings & Reviews
                    </h4>
                    <div className="space-y-2">
                      {vendorDetails.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{vendorDetails.rating} stars</span>
                        </div>
                      )}
                      {vendorDetails.reviews && (
                        <p className="text-sm">{vendorDetails.reviews} reviews</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              {vendorDetails.description && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Description
                  </h4>
                  <p className="text-sm">{String(vendorDetails.description || "")}</p>
                </div>
              )}

              {/* Raw JSON for debugging */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                  Raw Data (JSON)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(vendorDetails, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Failed to load vendor details</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          {editingVendor && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={editingVendor.businessName || editingVendor.name || ""}
                    onChange={(e) => setEditingVendor({ ...editingVendor, businessName: e.target.value })}
                    placeholder="Enter business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={editingVendor.contactPerson || editingVendor.contactName || editingVendor.ownerName || ""}
                    onChange={(e) => setEditingVendor({ ...editingVendor, contactPerson: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingVendor.email || ""}
                    onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingVendor.phone || ""}
                    onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editingVendor.website || ""}
                    onChange={(e) => setEditingVendor({ ...editingVendor, website: e.target.value })}
                    placeholder="Enter website URL"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editingVendor.address || ""}
                  onChange={(e) => setEditingVendor({ ...editingVendor, address: e.target.value })}
                  placeholder="Enter business address"
                />
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description</Label>
                <textarea
                  id="businessDescription"
                  className="w-full p-3 border rounded-md resize-none"
                  rows={3}
                  value={editingVendor.businessDescription || ""}
                  onChange={(e) => setEditingVendor({ ...editingVendor, businessDescription: e.target.value })}
                  placeholder="Enter business description"
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorTypeCategory">Category</Label>
                  <Select
                    value={editingVendor.vendorTypeCategory || editingVendor.category || ""}
                    onValueChange={(value) => setEditingVendor({ ...editingVendor, vendorTypeCategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Club">Club</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingVendor.status || "Inactive"}
                    onValueChange={(value) => setEditingVendor({ ...editingVendor, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing and Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Select
                    value={editingVendor.priceRange || ""}
                    onValueChange={(value) => setEditingVendor({ ...editingVendor, priceRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentageCharge">Commission (%)</Label>
                  <Input
                    id="percentageCharge"
                    type="number"
                    min="0"
                    max="100"
                    value={editingVendor.percentageCharge || ""}
                    onChange={(e) => setEditingVendor({ ...editingVendor, percentageCharge: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter commission percentage"
                  />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={editingVendor.isVisible !== false}
                  onChange={(e) => setEditingVendor({ ...editingVendor, isVisible: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isVisible">Visible to customers</Label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateVendor(editingVendor)} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Vendors</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Hotel">Hotel</option>
                <option value="Service">Service</option>
                <option value="Retail">Retail</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowFilterModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowFilterModal(false)}>
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

