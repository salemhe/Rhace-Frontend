import { useEffect, useState } from "react";
import { Plus, Upload, SlidersHorizontal, ChevronDown, MoreVertical, Eye, UserX, KeyRound, Star, Calendar, Search, Filter, Download, UserCheck, UserMinus, Users, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers, getUserById, updateUserStatus, toggleUserVIP, exportUsers, getUserReservations, getUserStats, getReservations, getReservationById } from "@/services/admin.service";
import { useWebSocket } from "@/contexts/WebSocketContext";

const extractArray = (p) => {
  if (Array.isArray(p)) return p;
  const candidates = [
    p?.data, p?.items, p?.results, p?.docs, p?.rows, p?.users, p?.list,
    p?.data?.data, p?.data?.items, p?.data?.results, p?.data?.docs, p?.data?.rows, p?.data?.users,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
};

const getUserIdFromReservation = (reservation) => {
  const userId = reservation.guest || reservation.userId || reservation.user?.id || reservation.user?._id;
  return userId;
};

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    status: "", 
    role: "", 
    dateRange: { from: null, to: null } 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { subscribe, unsubscribe, sendMessage, connected } = useWebSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [reservationDetailsOpen, setReservationDetailsOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [reservationDetailsLoading, setReservationDetailsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    vip: 0
  });

  const loadStats = async () => {
    try {
      const statsRes = await getUserStats();
      const statsData = statsRes?.data;

      setStats({
        total: statsData?.total || 0,
        active: statsData?.active || 0,
        inactive: statsData?.inactive || 0,
        suspended: statsData?.suspended || 0,
        vip: statsData?.vip || 0
      });
      setTotalUsers(statsData?.total || 0);
    } catch (e) {
      console.error("Failed to load stats", e);
    }
  };

  const handleViewProfile = async (user) => {
    const userId = user.id || user._id || user.userId;
    if (!userId) {
      console.error("User ID not found", user);
      return;
    }

    setSelectedUser(user);
    setProfileOpen(true);
    setDetailsLoading(true);
    setUserDetails(null);

    try {
      const response = await getUserById(userId);
      setUserDetails({ ...response.data, reservations: user.reservations || 0 });
    } catch (e) {
      console.error("Failed to get user details", e);
      setUserDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSuspendAccount = async (user) => {
    if (!user) return;
    const userId = user.id || user._id || user.userId;
    if (!userId) {
      console.error("User ID not found", user);
      alert("User ID not found");
      return;
    }
    try {
      await updateUserStatus(userId, { status: "Suspended" });
      alert(`User ${user.name || user.email || "account"} has been suspended successfully`);
    } catch (e) {
      console.error("Failed to suspend user", e);
      alert("Failed to suspend user");
    }
  };

  const handleResetPassword = async (user) => {
    if (!user) return;
    const userId = user.id || user._id || user.userId;
    if (!userId) {
      alert("User ID not found");
      return;
    }
    try {
      // TODO: Implement actual password reset API call
      alert(`Password reset initiated for ${user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email || "user"}`);
    } catch (e) {
      console.error("Failed to reset password", e);
      alert("Failed to reset password");
    }
  };

  const handleMarkAsVIP = async (user) => {
    if (!user) return;
    const userId = user.id || user._id || user.userId;
    if (!userId) {
      console.error("User ID not found", user);
      alert("User ID not found");
      return;
    }

    const newVipStatus = !user.isVip;

    // Optimistically update the local state immediately
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId || u._id === userId
          ? { ...u, isVip: newVipStatus }
          : u
      )
    );

    // Update filtered users as well
    setFilteredUsers((prev) =>
      prev.map((u) =>
        u.id === userId || u._id === userId
          ? { ...u, isVip: newVipStatus }
          : u
      )
    );

    try {
      await toggleUserVIP(userId, { isVip: newVipStatus });

      // Send WebSocket message for real-time updates to other clients
      sendMessage("user-updated", { id: userId, isVip: newVipStatus });

      // Reload stats to update VIP count
      await loadStats();

      alert(`VIP status updated successfully for ${user.name || user.email || "user"}`);
    } catch (e) {
      console.error("Failed to toggle VIP status", e);

      // Revert the optimistic update on failure
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId || u._id === userId
            ? { ...u, isVip: !newVipStatus }
            : u
        )
      );

      // Revert filtered users as well
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.id === userId || u._id === userId
            ? { ...u, isVip: !newVipStatus }
            : u
        )
      );

      alert("Failed to update VIP status");
    }
  };

  const refreshUserReservationCounts = async () => {
    try {
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          try {
            const userId = user.id || user._id;
            const reservationsRes = await getUserReservations(userId);
            const reservationsData = extractArray(reservationsRes?.data);
            const reservationCount = reservationsData?.length || 0;
            return {
              ...user,
              reservations: reservationCount
            };
          } catch (error) {
            console.error(`Failed to refresh reservations for user ${user.id || user._id}:`, error);
            return user; // Keep existing data on error
          }
        })
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to refresh reservation counts:", error);
    }
  };

  const handleViewReservations = async (user) => {
    if (!user) return;
    const userId = user.id || user._id || user.userId;
    if (!userId) {
      alert("User ID not found");
      return;
    }
    try {
      setSelectedUser(user);
      setUserReservations([]);
      setReservationsOpen(true);

      // Fetch user reservations
      const response = await getUserReservations(userId);
      const payload = response?.data;
      const reservations = extractArray(payload);
      setUserReservations(Array.isArray(reservations) ? reservations : []);
    } catch (e) {
      console.error("Failed to load reservations", e);
      alert("Failed to load reservations");
    }
  };

  const handleViewReservationDetails = async (reservation) => {
    if (!reservation) return;
    const reservationId = reservation.id || reservation._id;
    if (!reservationId) {
      alert("Reservation ID not found");
      return;
    }
    try {
      setSelectedReservation(reservation);
      setReservationDetails(null);
      setReservationDetailsOpen(true);
      setReservationDetailsLoading(true);

      // Fetch full reservation details
      const response = await getReservationById(reservationId);
      setReservationDetails(response.data);
    } catch (e) {
      console.error("Failed to load reservation details", e);
      // Fallback: Use the reservation data from the list if API call fails
      setReservationDetails({
        ...reservation,
        // Add any additional fields that might be missing
        customer: reservation.customer || reservation.customerName || reservation.user?.name,
        customerEmail: reservation.customerEmail || reservation.user?.email,
        customerPhone: reservation.customerPhone || reservation.user?.phone,
        vendor: reservation.vendor || { name: reservation.vendorName },
        totalAmount: reservation.totalAmount || reservation.amount || reservation.payment?.amount,
        paymentStatus: reservation.paymentStatus || reservation.payment?.status,
        mealPreselected: reservation.mealPreselected || reservation.meal?.preselected,
        specialRequests: reservation.specialRequests || reservation.notes,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt
      });
    } finally {
      setReservationDetailsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportUsers({ status: activeTab !== "all" ? activeTab : undefined });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Failed to export users", e);
      alert("Failed to export users");
    }
  };

  const applyFilters = () => {
    let filtered = users;
    if (searchQuery) {
      filtered = filtered.filter(user =>
        (user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()).toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab !== "all") {
      filtered = filtered.filter(user => (user.status || user.accountStatus || "").toString().toLowerCase() === activeTab);
    }
    if (filters.status) {
      filtered = filtered.filter(user => (user.status || user.accountStatus || "").toString() === filters.status);
    }
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, activeTab, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Fetch current page users
      const usersRes = await getUsers({ page: currentPage, limit: 20 });
      const payload = usersRes?.data;
      const list = extractArray(payload);

      // Normalize VIP field for all users and fetch reservation counts
      const usersWithReservations = await Promise.all(
        list.map(async (user) => {
          try {
            const userId = user.id || user._id;
            const reservationsRes = await getUserReservations(userId); // Get reservations for this specific user
            const reservationsData = extractArray(reservationsRes?.data);
            const reservationCount = reservationsData?.length || 0;

            // Normalize VIP field - API might return isVIP instead of isVip
            const normalizedUser = {
              ...user,
              isVip: user.isVip || user.isVIP || false, // Ensure VIP status is properly set
              reservations: reservationCount
            };

            return normalizedUser;
          } catch (error) {
            console.error(`Failed to fetch reservations for user ${user.id || user._id}:`, error);
            return {
              ...user,
              isVip: user.isVip || user.isVIP || false,
              reservations: 0
            };
          }
        })
      );



      setUsers(usersWithReservations);
      setTotalPages(payload?.totalPages || 1);
      setTotalUsers(payload?.totalDocs || 0);

      await loadStats();
    } catch (e) {
      console.error("Failed to load users", e);
      setUsers([]);
      setTotalUsers(0);
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        suspended: 0,
        vip: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    const handleUserUpdate = (updatedUser) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id || u._id === updatedUser.id ? updatedUser : u))
      );
      loadStats();
    };

    const handleUserActivity = (activityData) => {
      // Update lastActiveAt for the user
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === activityData.userId || u._id === activityData.userId) {
            return {
              ...u,
              lastActiveAt: activityData.lastActiveAt || new Date().toISOString()
            };
          }
          return u;
        })
      );
    };

    const handleUserCreate = (newUser) => {
      setUsers((prev) => {
        // update users list and increment totalUsers for real-time display
        const next = [...prev, newUser];
        setTotalUsers((t) => (Number(t) || 0) + 1);
        return next;
      });
      loadStats();
    };

    const handleUserDelete = (deletedUser) => {
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== deletedUser.id && u._id !== deletedUser.id);
        setTotalUsers((t) => Math.max(0, (Number(t) || 0) - 1));
        return next;
      });
      loadStats();
    };

    const handleReservationUpdate = (updatedReservation) => {
      const userId = getUserIdFromReservation(updatedReservation);

      if (userId) {
        // For updates, we don't change the count, just ensure the reservation modal is updated
        // The count should remain the same unless the reservation was cancelled/completed
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId || u._id === userId
              ? { ...u, reservations: Math.max(0, (u.reservations || 0)) } // Ensure non-negative
              : u
          )
        );
      }

      if (reservationsOpen && selectedUser && (userId === selectedUser.id || userId === selectedUser._id)) {
        setUserReservations((prev) =>
          prev.map((r) => (r.id === updatedReservation.id || r._id === updatedReservation.id ? updatedReservation : r))
        );
      }
    };

    const handleReservationCreate = (newReservation) => {
      const userId = getUserIdFromReservation(newReservation);

      if (userId) {
        // Increment reservation count in users list
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId || u._id === userId
              ? { ...u, reservations: (u.reservations || 0) + 1 }
              : u
          )
        );
      }

      if (reservationsOpen && selectedUser && userId === selectedUser.id || userId === selectedUser._id) {
        setUserReservations((prev) => [newReservation, ...prev]);
      }
    };

    const handleReservationDelete = (deletedReservation) => {
      const userId = getUserIdFromReservation(deletedReservation);

      if (userId) {
        // Decrement reservation count in users list
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId || u._id === userId
              ? { ...u, reservations: Math.max(0, (u.reservations || 0) - 1) }
              : u
          )
        );
      }

      if (reservationsOpen && selectedUser && userId === selectedUser.id || userId === selectedUser._id) {
        setUserReservations((prev) => prev.filter((r) => r.id !== deletedReservation.id && r._id !== deletedReservation.id));
      }
    };

    subscribe("user-updated", handleUserUpdate);
    subscribe("user-created", handleUserCreate);
    subscribe("user-deleted", handleUserDelete);
    subscribe("user-activity", handleUserActivity);
    subscribe("reservation-updated", handleReservationUpdate);
    subscribe("reservation-created", handleReservationCreate);
    subscribe("reservation-deleted", handleReservationDelete);

    return () => {
      unsubscribe("user-updated");
      unsubscribe("user-created");
      unsubscribe("user-deleted");
      unsubscribe("user-activity");
      unsubscribe("reservation-updated");
      unsubscribe("reservation-created");
      unsubscribe("reservation-deleted");
    };
  }, [subscribe, unsubscribe]);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage and monitor all user accounts in your system</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterModal(true)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2 bg-white hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={(stats.total / (stats.total || 1)) * 100} className="mt-4 h-1" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.active.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <Progress value={(stats.active / (stats.total || 1)) * 100} className="mt-4 h-1" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Inactive Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.inactive.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <UserMinus className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <Progress value={(stats.inactive / (stats.total || 1)) * 100} className="mt-4 h-1" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-700">Suspended</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.suspended.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <Shield className="h-6 w-6 text-rose-600" />
                </div>
              </div>
              <Progress value={(stats.suspended / (stats.total || 1)) * 100} className="mt-4 h-1" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">VIP Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.vip.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <Progress value={(stats.vip / (stats.total || 1)) * 100} className="mt-4 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or phone number..."
                    className="pl-9 w-full md:w-[400px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList className="bg-gray-100 p-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white">All Users</TabsTrigger>
                    <TabsTrigger value="active" className="data-[state=active]:bg-white">Active</TabsTrigger>
                    <TabsTrigger value="inactive" className="data-[state=active]:bg-white">Inactive</TabsTrigger>
                    <TabsTrigger value="suspended" className="data-[state=active]:bg-white">Suspended</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">User Directory</CardTitle>
              <CardDescription>{filteredUsers.length} users found</CardDescription>
            </div>
            <Badge variant="outline" className={connected ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
              <Activity className={`h-3 w-3 mr-1 ${connected ? "text-green-600" : "text-red-600"}`} />
              {connected ? "Real-time Connected" : "Real-time Disconnected"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshUserReservationCounts}
              className="gap-2"
            >
              <Activity className="h-3 w-3" />
              Refresh Counts
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">
                    <Checkbox />
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Contact</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Reservations</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Last Active</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">VIP</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50/50">
                      <td className="p-4"><Skeleton className="h-4 w-4" /></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-12 rounded-full" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-8 rounded-md" /></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">No users found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <Checkbox />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                            {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unnamed User"}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone || user.phoneNumber || user.mobile || "-"}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{user.reservationCount ?? user.reservations ?? user.stats?.reservations ?? 0}</div>
                        <div className="text-xs text-gray-500">reservations</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">
                        {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() :
                         user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "Never"}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={user.isVip ? "default" : "outline"} 
                        className={user.isVip 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" 
                          : "bg-gray-100"
                        }
                      >
                        {user.isVip ? "VIP" : "Regular"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Active" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : user.status === "Suspended"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {(user.status || user.accountStatus || "Unknown").toString()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          onClick={() => handleViewProfile(user)}
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <KeyRound className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkAsVIP(user)}>
                              <Star className="h-4 w-4 mr-2" />
                              {user.isVip ? "Remove VIP" : "Mark as VIP"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewReservations(user)}>
                              <Calendar className="h-4 w-4 mr-2" />
                              View Reservations
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleSuspendAccount(user)}
                              className="text-red-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {totalUsers} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
            <DialogDescription>Refine your search with advanced filters</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Role</Label>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" placeholder="From" />
                <Input type="date" placeholder="To" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setFilters({ status: "", role: "", dateRange: { from: null, to: null } });
              setShowFilterModal(false);
            }}>
              Clear Filters
            </Button>
            <Button onClick={() => setShowFilterModal(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed information about the selected user</DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
              <Skeleton className="h-8 w-48 mx-auto" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : userDetails ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                    {userDetails.name?.charAt(0) || userDetails.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-semibold">
                  {userDetails.name || `${userDetails.firstName ?? ""} ${userDetails.lastName ?? ""}`.trim()}
                </h3>
                <p className="text-gray-600">{userDetails.email}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-gray-900">{userDetails.phone || userDetails.phoneNumber || userDetails.mobile || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant="outline" className={
                    userDetails.status === "Active" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : userDetails.status === "Suspended"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }>
                    {userDetails.status || userDetails.accountStatus || "-"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">VIP Status</Label>
                  <Badge variant={userDetails.isVip ? "default" : "outline"}>
                    {userDetails.isVip ? "VIP Member" : "Regular User"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Reservations</Label>
                  <p className="text-gray-900">{userDetails.reservations ?? userDetails.stats?.reservations ?? 0}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Last Active</Label>
                  <p className="text-gray-900">
                    {userDetails.lastActiveAt 
                      ? new Date(userDetails.lastActiveAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No user details available.</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileOpen(false)}>Close</Button>
            <Button onClick={() => {
              handleResetPassword(userDetails);
              setProfileOpen(false);
            }}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reservations Modal */}
      <Dialog open={reservationsOpen} onOpenChange={setReservationsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reservations</DialogTitle>
            <DialogDescription>Reservation history for {selectedUser?.name || selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {userReservations.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userReservations.map((reservation, index) => (
                <Card
                  key={reservation.id || reservation._id || index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewReservationDetails(reservation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">Reservation #{reservation.id || reservation._id || reservation.reference || index + 1}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Date: {reservation.date || reservation.checkInDate || reservation.createdAt}</p>
                          <p>Time: {reservation.time || reservation.checkInTime}</p>
                          <p>Guests: {reservation.guests}</p>
                          <p>Status: {reservation.status || reservation.reservationStatus}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          (reservation.status || reservation.reservationStatus) === "Upcoming"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : (reservation.status || reservation.reservationStatus) === "Completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : (reservation.status || reservation.reservationStatus) === "Cancelled"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {reservation.status || reservation.reservationStatus || "Unknown"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No reservations found</h3>
              <p className="text-gray-500">This user hasn't made any reservations yet.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReservationsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reservation Details Modal */}
      <Dialog open={reservationDetailsOpen} onOpenChange={setReservationDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>Complete details for Reservation #{selectedReservation?.id || selectedReservation?._id || selectedReservation?.reference}</DialogDescription>
          </DialogHeader>
          {reservationDetailsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : reservationDetails ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Reservation ID</Label>
                  <p className="text-gray-900 font-mono">{reservationDetails.id || reservationDetails._id || reservationDetails.reference}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge
                    variant="outline"
                    className={
                      (reservationDetails.status || reservationDetails.reservationStatus) === "Upcoming"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : (reservationDetails.status || reservationDetails.reservationStatus) === "Completed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : (reservationDetails.status || reservationDetails.reservationStatus) === "Cancelled"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    {reservationDetails.status || reservationDetails.reservationStatus || "Unknown"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date</Label>
                  <p className="text-gray-900">{reservationDetails.date || reservationDetails.checkInDate || reservationDetails.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Time</Label>
                  <p className="text-gray-900">{reservationDetails.time || reservationDetails.checkInTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Guests</Label>
                  <p className="text-gray-900">{reservationDetails.guests}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Payment Status</Label>
                  <Badge
                    variant="outline"
                    className={
                      (reservationDetails.paymentStatus || reservationDetails.payment?.status) === "paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : (reservationDetails.paymentStatus || reservationDetails.payment?.status) === "pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {reservationDetails.paymentStatus || reservationDetails.payment?.status || "Unknown"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Meal Preselected</Label>
                  <Badge variant="secondary">
                    {reservationDetails.meal === "Yes" || reservationDetails.mealPreselected || reservationDetails.meal?.preselected ? "✓ Yes" : "✗ No"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                  <p className="text-gray-900 font-semibold">
                    {reservationDetails.totalAmount || reservationDetails.amount || reservationDetails.payment?.amount
                      ? `₦${Number(reservationDetails.totalAmount || reservationDetails.amount || reservationDetails.payment?.amount || 0).toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer Name</Label>
                  <p className="text-gray-900">{reservationDetails.customer || reservationDetails.customerName || reservationDetails.user?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer Email</Label>
                  <p className="text-gray-900">{reservationDetails.customerEmail || reservationDetails.user?.email || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Customer Phone</Label>
                  <p className="text-gray-900">{reservationDetails.customerPhone || reservationDetails.user?.phone || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vendor</Label>
                  <p className="text-gray-900">{reservationDetails.vendor?.name || reservationDetails.vendorName || "N/A"}</p>
                </div>
              </div>

              {reservationDetails.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Special Requests</Label>
                    <p className="text-gray-900 mt-1">{reservationDetails.specialRequests}</p>
                  </div>
                </>
              )}

              {reservationDetails.notes && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Notes</Label>
                    <p className="text-gray-900 mt-1">{reservationDetails.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created At</Label>
                  <p className="text-gray-900">
                    {reservationDetails.createdAt ? new Date(reservationDetails.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="text-gray-900">
                    {reservationDetails.updatedAt ? new Date(reservationDetails.updatedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No reservation details available.</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReservationDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}