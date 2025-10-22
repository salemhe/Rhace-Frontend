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
import { getVendors } from "@/services/admin.service";

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

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getVendors({ page: 1, limit: 20 });
        console.log("[Vendors] API response:", res?.data);
        const payload = res?.data;
        const list = extractArray(payload);
        if (!ignore) setVendors(list);
      } catch (e) {
        console.error("Failed to load vendors", e);
        if (!ignore) setVendors([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, []);

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
                        <span className="text-sm font-semibold">K</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{vendor.businessName || vendor.name || "-"}</p>
                        <p className="text-xs text-muted-foreground">{vendor.category || vendor.type || ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-sm">{vendor.contactPerson || vendor.contactName || vendor.ownerName || "-"}</p>
                    <p className="text-xs text-muted-foreground">{vendor.email || vendor.contactEmail || vendor.user?.email || "-"}</p>
                  </td>
                  <td className="p-3 text-sm">{vendor.branchesCount ?? vendor.branches?.length ?? 0}</td>
                  <td className="p-3 text-sm">{vendor.reservationsCount ?? vendor.stats?.reservations ?? vendor.reservationStats?.total ?? 0}</td>
                  <td className="p-3">
                    <Badge 
                      variant={vendor.status === "Active" ? "default" : "secondary"}
                      className={
                        vendor.status === "Active" 
                          ? "bg-success text-success-foreground" 
                          : "bg-warning text-warning-foreground"
                      }
                    >
                      {(vendor.status || vendor.approvalStatus || "").toString()}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm">{vendor.date || (vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "-")}</td>
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
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
