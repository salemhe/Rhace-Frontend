import { useEffect, useState } from "react";
import { Plus, Upload, SlidersHorizontal, ChevronDown, MoreVertical, Eye, UserX, KeyRound, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { getUsers, getUserById, updateUserStatus, toggleUserVIP, exportUsers } from "@/services/admin.service";
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


export default function Users() {
  const [activeTab, setActiveTab] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hideTabs, setHideTabs] = useState(false);
  const tabs = ["All", "Active", "Inactive", "Suspended"];
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [filters, setFilters] = useState({ status: "", role: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { subscribe, unsubscribe, sendMessage } = useWebSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const [userReservations, setUserReservations] = useState([]);

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
      setUserDetails(response.data);
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
      // WebSocket will handle the real-time update
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
      // For now, just show success message
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
    try {
      await toggleUserVIP(userId, { isVip: !user.isVip });
      // Update local state immediately
      setUsers((prev) =>
        prev.map((u) => (u.id === userId || u._id === userId ? { ...u, isVip: !user.isVip } : u))
      );
      // Send WebSocket message for real-time updates
      sendMessage("user-updated", { id: userId, isVip: !user.isVip });
      alert(`VIP status updated successfully for ${user.name || user.email || "user"}`);
    } catch (e) {
      console.error("Failed to toggle VIP status", e);
      alert("Failed to update VIP status");
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
      // TODO: Implement actual reservations fetch API call
      setSelectedUser(user);
      setUserReservations([]); // Placeholder for actual reservations data
      setReservationsOpen(true);
      // For now, just show the modal with placeholder content
    } catch (e) {
      console.error("Failed to load reservations", e);
      alert("Failed to load reservations");
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportUsers({ status: activeTab !== "All" ? activeTab : undefined });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
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
    if (activeTab !== "All") {
      filtered = filtered.filter(user => (user.status || user.accountStatus || "").toString() === activeTab);
    }
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.createdAt || user.lastActiveAt);
        return userDate >= dateRange.from && userDate <= dateRange.to;
      });
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
  }, [users, searchQuery, activeTab, dateRange, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page: currentPage, limit: 20 });
      console.log("[Users] API response:", res?.data);
      const payload = res?.data;
      const list = extractArray(payload);
      setUsers(list);
      setTotalPages(payload?.totalPages || 1);
    } catch (e) {
      console.error("Failed to load users", e);
      setUsers([]);
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
    };

    const handleUserCreate = (newUser) => {
      setUsers((prev) => [...prev, newUser]);
    };

    const handleUserDelete = (deletedUser) => {
      setUsers((prev) => prev.filter((u) => u.id !== deletedUser.id));
    };

    subscribe("user-updated", handleUserUpdate);
    subscribe("user-created", handleUserCreate);
    subscribe("user-deleted", handleUserDelete);

    return () => {
      unsubscribe("user-updated");
      unsubscribe("user-created");
      unsubscribe("user-deleted");
    };
  }, [subscribe, unsubscribe]);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setHideTabs(!hideTabs)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Hide tabs
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground" onClick={handleExport}>
            <Upload className="w-4 h-4 mr-3" />
            Export
          </Button>
        </div>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-accent/30">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  <Checkbox />
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Vendor's Name</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Phone number</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Reservations</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">VIP</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-3 text-sm text-muted-foreground" colSpan={8}>Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="p-3 text-sm text-muted-foreground" colSpan={8}>No users found.</td>
                </tr>
              ) : filteredUsers.map((user, i) => (
                <tr key={i} className="border-b hover:bg-accent/50">
                  <td className="p-3">
                    <Checkbox />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">K</span>
                      </div>
                      <span className="text-sm font-medium">{user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email || "-"}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 text-sm">{user.phone || user.phoneNumber || user.mobile || "-"}</td>
                  <td className="p-3 text-sm text-center">{user.reservations ?? user.stats?.reservations ?? 0}</td>
                  <td className="p-3 text-sm">{user.date || (user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "-")}</td>
                  <td className="p-3">
                    <Badge variant={user.isVip ? "default" : "secondary"}>
                      {user.isVip ? "VIP" : "Regular"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={user.status === "Active" ? "default" : "secondary"}
                        className={
                          user.status === "Active"
                            ? "bg-success text-success-foreground"
                            : "bg-warning text-warning-foreground"
                        }
                      >
                        {(user.status || user.accountStatus || "").toString()}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspendAccount(user)}>
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                            <KeyRound className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkAsVIP(user)}>
                            <Star className="w-4 h-4 mr-2" />
                            {user.isVip ? "Remove VIP" : "Mark as VIP"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewReservations(user)}>
                            <Calendar className="w-4 h-4 mr-2" />
                            View Reservations
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleViewProfile(selectedUser)}>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleSuspendAccount(selectedUser)}>
              <UserX className="w-4 h-4 mr-2" />
              Suspend Account
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleResetPassword(selectedUser)}>
              <KeyRound className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleMarkAsVIP(selectedUser)}>
              <Star className="w-4 h-4 mr-2" />
              Mark as VIP
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleViewReservations(selectedUser)}>
              <Calendar className="w-4 h-4 mr-2" />
              View Reservations
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {detailsLoading ? (
            <p>Loading...</p>
          ) : userDetails ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p>{userDetails.name || `${userDetails.firstName ?? ""} ${userDetails.lastName ?? ""}`.trim() || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p>{userDetails.email || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p>{userDetails.phone || userDetails.phoneNumber || userDetails.mobile || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <p>{userDetails.status || userDetails.accountStatus || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">VIP</label>
                <p>{userDetails.isVip ? "Yes" : "No"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Reservations</label>
                <p>{userDetails.reservations ?? userDetails.stats?.reservations ?? 0}</p>
              </div>
            </div>
          ) : (
            <p>No user details available.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reservationsOpen} onOpenChange={setReservationsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Reservations</DialogTitle>
          </DialogHeader>
          {userReservations.length > 0 ? (
            <div className="space-y-2">
              {userReservations.map((reservation, index) => (
                <div key={index} className="border p-2 rounded">
                  <p>Reservation {index + 1}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reservations found.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
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
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <option value="">All</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
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