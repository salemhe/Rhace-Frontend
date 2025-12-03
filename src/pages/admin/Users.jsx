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
import { getUsers } from "@/services/admin.service";
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
  const tabs = ["All", "Active", "Inactive", "Suspended"];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { subscribe, unsubscribe, sendMessage } = useWebSocket();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewProfile = () => {
    if (!selectedUser) return;
    // TODO: Implement a user profile modal
    alert(`Viewing profile of ${selectedUser.name}`);
    setShowModal(false);
  };

  const handleSuspendAccount = async () => {
    if (!selectedUser) return;
    try {
      // Assuming a service function `updateUserStatus` exists
      // await updateUserStatus(selectedUser.id, { status: "Suspended" });
      sendMessage("user-updated", { ...selectedUser, status: "Suspended" });
      alert(`Suspended account of ${selectedUser.name}`);
    } catch (e) {
      console.error("Failed to suspend user", e);
    }
    setShowModal(false);
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    // TODO: Implement password reset functionality
    alert(`Resetting password for ${selectedUser.name}`);
    setShowModal(false);
  };

  const handleMarkAsVIP = () => {
    if (!selectedUser) return;
    try {
      // Assuming a service function `updateUser` exists
      // await updateUser(selectedUser.id, { isVip: true });
      sendMessage("user-updated", { ...selectedUser, isVip: true });
      alert(`Marked ${selectedUser.name} as VIP`);
    } catch (e) {
      console.error("Failed to mark as VIP", e);
    }
    setShowModal(false);
  };

  const handleViewReservations = () => {
    if (!selectedUser) return;
    // TODO: Implement navigation to user's reservations
    alert(`Viewing reservations of ${selectedUser.name}`);
    setShowModal(false);
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getUsers({ page: 1, limit: 20 });
        console.log("[Users] API response:", res?.data);
        const payload = res?.data;
        const list = extractArray(payload);
        if (!ignore) setUsers(list);
      } catch (e) {
        console.error("Failed to load users", e);
        if (!ignore) setUsers([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();

    const handleUserUpdate = (updatedUser) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
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
      ignore = true;
    };
  }, [subscribe, unsubscribe]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Hide tabs
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            <Upload className="w-4 h-4 mr-3" />
            Export
          </Button>
        </div>
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
            <Input placeholder="Search by name or email" className="w-64" />
            <Button variant="outline" size="sm">
              Filter by date <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="sm">
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
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground"></th>
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
              ) : users.map((user, i) => (
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
                  <td className="p-3">
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
                  </td>
                  <td className="p-3 text-sm">{user.date || (user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "-")}</td>
                  <td className="p-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={handleViewProfile}>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSuspendAccount}>
              <UserX className="w-4 h-4 mr-2" />
              Suspend Account
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleResetPassword}>
              <KeyRound className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleMarkAsVIP}>
              <Star className="w-4 h-4 mr-2" />
              Mark as VIP
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleViewReservations}>
              <Calendar className="w-4 h-4 mr-2" />
              View Reservations
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}