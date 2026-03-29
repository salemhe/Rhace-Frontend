import { StatCard } from "@/components/dashboard/stats/mainStats";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import {
  Calendar,
  CardPay,
  Cash2,
  Export,
  Eye,
  EyeClose,
  Filter2,
  Group3,
} from "@/components/dashboard/ui/svg";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NoDataFallback from "@/components/NoDataFallback";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { clubService } from "@/services/club.service";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AddDrinkModal } from "./AddDrinkModal";
import { AddTablesModal } from "./AddTablesModal";

const normalizeStatus = (status = "") => {
  const s = status?.toLowerCase() || "";

  if (s === "active" || s === "available") return "Active";
  if (s === "inactive" || s === "unavailable") return "Inactive";
  if (s === "out of stock") return "Out of Stock";
  if (s === "low stock") return "Low Stock";

  return "Active";
};

export function DrinksTable() {
  const [drinks, setDrinks] = useState([]);
  const [tables, setTables] = useState([]);
  const [bottleSets, setBottleSets] = useState([]);
  const [selectedTab, setSelectedTab] = useState("drinks");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [showAddDrinkModal, setShowAddDrinkModal] = useState(false);
  const [showTablesModal, setShowTablesModal] = useState(false);
  const vendor = useSelector((state) => state.auth.vendor);
  const navigate = useNavigate();

  // Filter states
  // const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hideTab, setHideTab] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalDrinks: { count: 0, change: 0 },
    totalSets: { count: 0, change: 0 },
    totalValue: { count: 0, change: 0 },
    activeItems: { count: 0, change: 0 },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > maxVisible) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - maxVisible + 1) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        setIsLoading(true);
        const data = await clubService.getDrinks(vendor._id);
        setDrinks(data.drinks || []);
      } catch (error) {
        console.error("Error fetching drinks:", error);
        toast.error("Failed to fetch drinks");
      }
      setIsLoading(false);
    };

    const fetchTables = async () => {
      try {
        setIsLoading(true);
        const data = await clubService.getTables(vendor._id);
        setTables(data.tables || []);
      } catch (error) {
        console.error("Error fetching tables:", error);
        toast.error("Failed to fetch tables");
      }
      setIsLoading(false);
    };

    const fetchBottleSets = async () => {
      try {
        const data = await clubService.getBottleSet(vendor._id);
        setBottleSets(data.bottleSets || []);
      } catch (error) {
        console.error("Error fetching bottle sets:", error);
        toast.error("Failed to fetch bottle sets");
      }
    };

    fetchDrinks();
    fetchTables();
    fetchBottleSets();
  }, [vendor?._id]);

  // Calculate stats
  useEffect(() => {
    const totalDrinks = drinks.length;
    const totalTables = tables.length;
    const totalSets = bottleSets.length;
    const activeItems = [...drinks, ...bottleSets, ...tables].filter(
      (item) => normalizeStatus(item.status) === "Active"
    ).length;
    const totalValue = [...drinks, ...bottleSets, ...tables].reduce(
      (sum, item) => sum + (item.price || item.setPrice || 0),
      0
    );

    setStats({
      totalDrinks: { count: totalDrinks, change: 0 },
      totalTables: { count: totalTables, change: 0 },
      totalSets: { count: totalSets, change: 0 },
      totalValue: { count: totalValue, change: 0 },
      activeItems: { count: activeItems, change: 0 },
    });
  }, [drinks, bottleSets, tables]);

  // Filter items based on selected tab and filters
  const filterItems = (items, isDrink = true) => {
    return items.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (isDrink &&
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (!isDrink &&
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        selectedStatus === "all" ||
        normalizeStatus(item.status) === selectedStatus;

      const matchesCategory =
        selectedCategory === "all" ||
        (isDrink && item.category === selectedCategory) ||
        (!isDrink && selectedCategory === "Bottle Sets");

      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  const filteredDrinks = filterItems(drinks, true);
  const filteredTables = filterItems(tables, false);
  const filteredSets = filterItems(bottleSets, false);

  const currentData = selectedTab === "drinks" ? filteredDrinks : selectedTab === "sets" ? filteredSets : filteredTables;
  const data = currentData;

  // Update total items based on filtered data
  useEffect(() => {
    setTotalItems(data.length);
    const maxPage = Math.max(1, Math.ceil(data.length / itemsPerPage));
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [data.length, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchTerm, selectedStatus, selectedCategory]);

  // Compute paginated items for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = data.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return <UniversalLoader fullscreen />;
  }

  const getStatusColor = (status) => {
    switch (normalizeStatus(status)) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryOptions = () => {
    const categories = new Set(["all"]);
    drinks.forEach((drink) => {
      if (drink.category) categories.add(drink.category);
    });
    return Array.from(categories).map((cat) => ({
      value: cat,
      label: cat === "all" ? "All Categories" : cat,
    }));
  };

  return (
    <DashboardLayout type="club" section="drinks">
      <div className="min-h-screen bg-gray-50 p-2 md:p-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex justify-between items-center mb-6">
            <h2 className="text-[#111827] font-semibold mb-2">Drinks Management</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
              <DashboardButton
                onClick={() => setHideTab(!hideTab)}
                variant="secondary"
                text={hideTab ? "Open tabs" : "Hide tabs"}
                icon={hideTab ? <Eye /> : <EyeClose />}
              />
              <button
                onClick={() => navigate("/dashboard/club/add-drinks")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} />
                <span>Add Bottle Set</span>
              </button>
              <button
                onClick={() => setShowAddDrinkModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                <Plus size={18} />
                <span>Add New Drink</span>
              </button>
              <button
                onClick={() => setShowTablesModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                <Plus size={18} />
                <span>Add New Table</span>
              </button>
            </div>
          </div>

          {!hideTab && (
            <div className="grid sm:grid-cols-2 divide-neutral-600 divide lg:grid-cols-4 mb-8 rounded-lg bg-white border border-gray-200">
              <div className="flex-1">
                <StatCard
                  title="Total Drinks"
                  value={stats.totalDrinks.count}
                  change={stats.totalDrinks.change}
                  color="blue"
                  IconColor="#60A5FA"
                  icon={<Calendar />}
                  side
                />
              </div>
              <div className="flex-1">
                <StatCard
                  title="Bottle Sets"
                  value={stats.totalSets.count}
                  change={stats.totalSets.change}
                  color="green"
                  IconColor="#06CD02"
                  icon={<CardPay />}
                />
              </div>
              <div className="flex-1">
                <StatCard
                  title="Active Items"
                  value={stats.activeItems.count}
                  change={stats.activeItems.change}
                  color="purple"
                  IconColor="#CD16C3"
                  icon={<Group3 />}
                />
              </div>
              <div className="flex-1">
                <StatCard
                  title="Total Value"
                  value={`₦${stats.totalValue.count.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  change={stats.totalValue.change}
                  color="orange"
                  IconColor="#E1B505"
                  icon={<Cash2 fill="#E1B505" />}
                />
              </div>
            </div>
          )}

          {/* Tabs and Filters */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex md:items-center flex-col-reverse md:flex-row gap-4 justify-between py-4 px-4 border-b border-gray-200">
              <div className="flex flex-1 items-center">
                {["drinks", "sets", "tables"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === tab
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {tab === "drinks"
                      ? "Drinks"
                      : tab === "sets"
                        ? "Drinks Sets"
                        : "Tables"}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="relative items-center flex flex-1">
                  <Search className="absolute left-2 text-[#606368] size-5" />
                  <Input
                    type="text"
                    placeholder={
                      selectedTab === "drinks" ? "Search drinks" : selectedTab === "tables" ? "Search tables" : "Search sets"
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm pl-10 bg-[#F9FAFB] border-[#DAE9E9]"
                  />
                </div>
                <div className="md:flex gap-2 hidden">
                  {/* Status Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-auto text-[#606368]"
                      >
                        {selectedStatus === "all" ? "Status" : selectedStatus}{" "}
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="p-2">
                        <button
                          onClick={() => setSelectedStatus("all")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedStatus === "all"
                            ? "bg-gray-100 font-medium"
                            : ""
                            }`}
                        >
                          All Status
                        </button>
                        <button
                          onClick={() => setSelectedStatus("Active")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedStatus === "Active"
                            ? "bg-gray-100 font-medium"
                            : ""
                            }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedStatus("Inactive")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedStatus === "Inactive"
                            ? "bg-gray-100 font-medium"
                            : ""
                            }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                            Inactive
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedStatus("Out of Stock")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedStatus === "Out of Stock"
                            ? "bg-gray-100 font-medium"
                            : ""
                            }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Out of Stock
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedStatus("Low Stock")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedStatus === "Low Stock"
                            ? "bg-gray-100 font-medium"
                            : ""
                            }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Low Stock
                          </span>
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Category Filter (only for drinks) */}
                  {selectedTab === "drinks" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="ml-auto text-[#606368]"
                        >
                          {selectedCategory === "all"
                            ? "Category"
                            : selectedCategory}{" "}
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <div className="p-2">
                          {getCategoryOptions().map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => setSelectedCategory(cat.value)}
                              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedCategory === cat.value
                                ? "bg-gray-100 font-medium"
                                : ""
                                }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Advanced Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-auto text-[#606368]"
                      >
                        Advanced filter {Filter2}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Price Range
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="number"
                              placeholder="Max"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <button
                            onClick={() => {
                              setSelectedStatus("all");
                              setSelectedCategory("all");
                              setSearchTerm("");
                            }}
                            className="w-full px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-md font-medium"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="md:hidden">
                  <Button variant="outline" size="sm" className="ml-auto">
                    {Filter2}
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            {data.length > 0 ? (
              <div className="overflow-x-auto ">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedTab !== "tables" && (
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                      )}
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      {selectedTab === "drinks" && (
                        <>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Volume
                          </th>
                        </>
                      )}
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (₦)
                      </th>
                      {selectedTab === "drinks" && (
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                      )}
                      {selectedTab !== "drinks" && (
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AddOns
                        </th>
                      )}
                      {selectedTab === "sets" && (
                        <>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Drinks
                          </th>
                        </>
                      )}
                      {selectedTab !== "tables" && (
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      )}
                      <th className="w-12 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        {selectedTab !== "tables" && (<td className="px-4 py-4">
                          <img
                            src={
                              selectedTab === "drinks"
                                ? item.images?.[0]
                                : item.image
                            }
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </td>)}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{item._id?.slice(0, 8) || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        {selectedTab === "drinks" && (
                          <>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {item.category}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {item.volume}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                          ₦{(item.price || item.setPrice || 0).toLocaleString()}
                        </td>
                        {selectedTab === "drinks" && (
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {item.quantity || 0}
                          </td>
                        )}
                        {selectedTab !== "drinks" && (

                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div className="flex flex-wrap gap-1 items-center">
                              {item.addOns?.slice(0, 2).map((addOn, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 rounded text-xs"
                                >
                                  {addOn}
                                </span>
                              ))}
                              {item.addOns?.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{item.addOns.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                        )}
                        {selectedTab === "sets" && (
                          <>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {item.items?.reduce(
                                (acc, i) => acc + (i.quantity || 0),
                                0
                              ) || 0}
                            </td>
                          </>
                        )}
                        {selectedTab === "sets" || selectedTab === "drinks" && (
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {normalizeStatus(item.status)}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <NoDataFallback />
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="absolute hidden md:flex bottom-0 border-t border-[#E5E7EB] left-0 right-0 bg-white">
          <div className="flex items-center w-full px-8 justify-between space-x-2 py-4">
            <div className="text-muted-foreground text-sm">
              Page {currentPage} of {totalPages} ({totalItems} total items)
            </div>
            <div className="flex items-center gap-2">
              {getPageNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={
                    page === "ellipsis-start" || page === "ellipsis-end"
                  }
                  className={`px-3 py-1 rounded-md ${currentPage === page
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200"
                    } ${page === "ellipsis-start" || page === "ellipsis-end"
                      ? "cursor-default"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {page === "ellipsis-start" || page === "ellipsis-end"
                    ? "…"
                    : page}
                </button>
              ))}
            </div>
            <div className="gap-2 flex">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddDrinkModal && (
        <AddDrinkModal
          onClose={() => setShowAddDrinkModal(false)}
          onSuccess={() => {
            // Refresh drinks list
            const fetchDrinks = async () => {
              try {
                const data = await clubService.getDrinks(vendor._id);
                setDrinks(data.drinks || []);
              } catch (error) {
                console.error("Error fetching drinks:", error);
              }
            };
            fetchDrinks();
            setShowAddDrinkModal(false);
          }}
        />
      )}

      {showTablesModal && (
        <AddTablesModal
          onClose={() => setShowTablesModal(false)}
          onSuccess={() => {
            // Refresh drinks list
            const fetchTables = async () => {
              try {
                const data = await clubService.getTables(vendor._id);
                setTables(data.tables || []);
              } catch (error) {
                console.error("Error fetching tables:", error);
              }
            };
            fetchTables();
            setShowTablesModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
