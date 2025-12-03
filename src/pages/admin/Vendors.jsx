import { useEffect, useState } from "react";
import { Plus, Upload, SlidersHorizontal, ChevronDown, MoreVertical } from "lucide-react";
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
import { getVendors, getVendorById, updateVendorStatus } from "@/services/admin.service";
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
  const [loading, setLoading] = useState(false);
  const { subscribe, unsubscribe, sendMessage } = useWebSocket();

  const loadVendors = async () => {
    setLoading(true);
    try {
      const res = await getVendors({ page: 1, limit: 20 });
      const payload = res?.data;
      const list = extractArray(payload);
      setVendors(list);
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
        prev.map((v) => (v.id === updatedVendor.id ? updatedVendor : v))
      );
    };

    const handleVendorCreate = (newVendor) => {
      setVendors((prev) => [...prev, newVendor]);
    };

    const handleVendorDelete = (deletedVendor) => {
      setVendors((prev) => prev.filter((v) => v.id !== deletedVendor.id));
    };

    subscribe("vendor-updated", handleVendorUpdate);
    subscribe("vendor-created", handleVendorCreate);
    subscribe("vendor-deleted", handleVendorDelete);

    return () => {
      unsubscribe("vendor-updated");
      unsubscribe("vendor-created");
      unsubscribe("vendor-deleted");
    };
  }, [subscribe, unsubscribe]);

  const handleViewDetails = async (vendor) => {
    // TODO: Implement a modal to show vendor details
    const detailed = await getVendorById(vendor.id);
    alert(JSON.stringify(detailed.data, null, 2));
  };

  const handleEdit = async (vendor) => {
    // TODO: Implement a modal or inline editing for vendors
    alert(`Edit vendor ${vendor.id}`);
  };

  const handleDelete = async (vendor) => {
    if (!window.confirm(`Are you sure you want to delete vendor ${vendor.id}?`)) {
      return;
    }
    try {
      await updateVendorStatus(vendor.id, { status: "Deleted" });
      sendMessage("vendor-deleted", { id: vendor.id });
    } catch (e) {
      console.error(`Failed to delete vendor ${vendor.id}`, e);
      alert("Failed to delete vendor");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendor's List</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Hide tabs
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            <Upload className="w-4 h-4 mr-2" />
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
              ) : vendors.map((vendor, i) => (
                <tr key={i} className="border-b hover:bg-accent/50">
                  <td className="p-3">
                    <Checkbox />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{vendor.businessName?.charAt(0) || 'V'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{vendor.businessName || vendor.name || "-"}</p>
                        <p className="text-xs text-muted-foreground">{vendor.category || vendor.type || ""}</p>
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
                    <Badge variant={vendor.status === "Active" ? "default" : "outline"}>
                      {vendor.status || "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewDetails(vendor)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(vendor)}>
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
    </div>
  );
}
