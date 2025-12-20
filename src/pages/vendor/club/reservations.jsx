import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NoDataFallback from "@/components/NoDataFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/stats/mainStats";
import { Users } from "lucide-react";
import {
  Calendar,
  CardPay,
  Cash2,
  Export,
  Eye,
  EyeClose,
  Filter2,
  Add,
  Eye2,
  Pencil,
  Phone,
  Printer,
  CheckCircle,
  Copy,
  XCircle,
  Group3,
} from "@/components/dashboard/ui/svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { userService } from "@/services/user.service";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Search,
  XIcon,
  Check,
  Mail,
  Clock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const normalizePaymentStatus = (status = "") => {
  const s = status?.toLowerCase() || "";

  if (s === "paid" || s === "success") return "Fully Paid";
  if (s === "partial" || s === "part paid") return "Part Paid";
  if (s.includes("refunded")) return "Refunded";
  if (s.includes("unpaid") || s.includes("not paid")) return "Unpaid";

  return "Pending";
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper function to extract time from date
const extractTime = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function to calculate total items (combos + drinks)
const calculateTotalItems = (reservation) => {
  const comboCount = reservation.combos?.length || 0;
  const drinkCount = reservation.drinks?.length || 0;
  return comboCount + drinkCount;
};

// Helper function to calculate total quantity of drinks
const calculateTotalDrinksQuantity = (reservation) => {
  if (!reservation.drinks || !Array.isArray(reservation.drinks)) return 0;

  return reservation.drinks.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

const ClubReservationTable = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);
  const vendor = useSelector((state) => state.auth.vendor);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalReservations: { count: 0, change: 0 },
    prepaidReservations: { count: 0, change: 0 },
    expectedGuests: { count: 0, change: 0 },
    pendingPayments: { count: 0, change: 0 },
  });

  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedTable, setSelectedTable] = useState("all");

  const [hideTab, setHideTab] = useState(false);
  const [showPopup, setShowPopup] = useState({
    display: false,
    details: {},
  });
  const navigate = useNavigate();

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

  const tabs = ["All", "Upcoming", "Completed", "Canceled", "No Shows"];

  const handleSelectReservation = (id, checked) => {
    if (checked) {
      setSelectedReservations([...selectedReservations, id]);
    } else {
      setSelectedReservations(
        selectedReservations.filter((reservationId) => reservationId !== id)
      );
    }
  };

  const socketRef = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    if (!vendor?._id) return;

    const connect = () => {
      const socket = new WebSocket(
        `wss://rhace-backend-mkne.onrender.com?type=vendor&id=${vendor._id}`
      );
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("📩 Message from server:", message);

          if (message.type === "new_reservation") {
            toast.success(
              `🆕 New reservation from ${message.data.customerName}`
            );
            setReservations((prev) => [...prev, message.data]);
          }
        } catch (error) {
          console.error("❌ Failed to parse message:", error);
        }
      };

      socket.onerror = (err) => {
        console.error("⚠️ WebSocket error:", err);
      };

      socket.onclose = (e) => {
        console.warn(`🔌 WebSocket closed (code: ${e.code})`);
        socketRef.current = null;

        if (e.code !== 1000) {
          reconnectTimeout.current = setTimeout(() => {
            console.log("🔁 Reconnecting WebSocket...");
            connect();
          }, 3000);
        }
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [vendor?._id]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log("Fetching reservations for vendor:", vendor._id);
        const res = await userService.fetchReservations({
          vendorId: vendor._id,
        });
        setReservations(res.data || []);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch reservations"
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await userService.fetchReservationsStats();
        setStats(res.data || {});
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch stats");
      }
    };

    fetchReservations();
    fetchStats();
  }, [vendor?._id]);

  // Calculate stats from reservations
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalReservations = reservations.length;

    const prepaidReservations = reservations.filter(
      (res) => normalizePaymentStatus(res.paymentStatus) === "Fully Paid"
    ).length;

    const todayReservations = reservations.filter((res) => {
      const resDate = new Date(res.date);
      resDate.setHours(0, 0, 0, 0);
      return resDate.getTime() === today.getTime();
    });

    const expectedGuestsToday = todayReservations.reduce(
      (sum, res) => sum + (res.guests || 0),
      0
    );

    const pendingPayments = reservations
      .filter(
        (res) =>
          normalizePaymentStatus(res.paymentStatus) === "Unpaid" ||
          normalizePaymentStatus(res.paymentStatus) === "Part Paid"
      )
      .reduce((sum, res) => sum + (res.totalAmount || 0), 0);

    setStats({
      totalReservations: { count: totalReservations, change: 0 },
      prepaidReservations: { count: prepaidReservations, change: 0 },
      expectedGuests: { count: expectedGuestsToday, change: 0 },
      pendingPayments: { count: pendingPayments, change: 0 },
    });
  }, [reservations]);

  // Filter reservations based on search term and active tab
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      !searchTerm ||
      reservation.customerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.bookingCode
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (reservation.vendor?.businessName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab !== "All") {
      const status = (
        reservation.reservationStatus ||
        reservation.status ||
        ""
      ).toLowerCase();

      switch (activeTab) {
        case "Upcoming":
          matchesTab = status === "upcoming";
          break;
        case "Completed":
          matchesTab = status === "completed" || status === "paid";
          break;
        case "Canceled":
          matchesTab = status === "canceled" || status === "cancelled";
          break;
        case "No Shows":
          matchesTab = status === "no shows" || status === "no-shows";
          break;
        default:
          matchesTab = true;
      }
    }

    const matchesPaymentStatus =
      selectedPaymentStatus === "all" ||
      normalizePaymentStatus(reservation.paymentStatus) ===
        selectedPaymentStatus;

    const matchesTable =
      selectedTable === "all" || reservation.table === selectedTable;

    let matchesDate = true;
    if (selectedDate !== "all") {
      const reservationDate = new Date(reservation.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate === "Today") {
        reservationDate.setHours(0, 0, 0, 0);
        matchesDate = reservationDate.getTime() === today.getTime();
      }

      if (selectedDate === "This Week") {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        matchesDate =
          reservationDate >= weekStart && reservationDate <= weekEnd;
      }

      if (selectedDate === "This Month") {
        matchesDate =
          reservationDate.getMonth() === today.getMonth() &&
          reservationDate.getFullYear() === today.getFullYear();
      }

      if (selectedDate === "Last 30 Days") {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesDate = reservationDate >= thirtyDaysAgo;
      }
    }

    return (
      matchesSearch &&
      matchesTab &&
      matchesPaymentStatus &&
      matchesTable &&
      matchesDate
    );
  });

  const data = filteredReservations;

  // Update total items based on filtered reservations
  useEffect(() => {
    setTotalItems(filteredReservations.length);
    const maxPage = Math.max(
      1,
      Math.ceil(filteredReservations.length / itemsPerPage)
    );
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [filteredReservations.length, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    searchTerm,
    selectedDate,
    selectedPaymentStatus,
    selectedTable,
  ]);

  // compute paginated reservations for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = data.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Toggle selection for visible page items
  const handleToggleSelectPage = (checked) => {
    const pageIds = paginatedReservations.map((r) => r._id);
    if (checked) {
      setSelectedReservations((prev) =>
        Array.from(new Set([...prev, ...pageIds]))
      );
    } else {
      setSelectedReservations((prev) =>
        prev.filter((id) => !pageIds.includes(id))
      );
    }
  };

  if (isLoading) {
    return <UniversalLoader fullscreen />;
  }

  const getPaymentStatusColor = (status) => {
    switch (normalizePaymentStatus(status)) {
      case "Fully Paid":
        return "bg-[#D1FAE5] text-[#37703F]";
      case "Part Paid":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "Unpaid":
        return "bg-gray-100 text-gray-800";
      case "Refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReservationStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "confirmed" || s === "upcoming") {
      return "bg-[#D1FAE5] text-[#37703F]";
    } else if (s === "pending") {
      return "bg-[#FEF3C7] text-[#92400E]";
    } else if (s === "completed") {
      return "bg-[#DBEAFE] text-[#1E40AF]";
    } else if (s === "cancelled" || s === "canceled") {
      return "bg-[#FEE2E2] text-[#991B1B]";
    } else if (s === "no shows" || s === "no-shows") {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout type="club" section="Reservations">
      <div className="min-h-screen bg-gray0 p-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex hidden justify-between items-center mb-6">
            <h2 className="text-[#111827] font-semibold">
              Club Reservation Management
            </h2>
            <div className="flex gap-6">
              <DashboardButton
                onClick={() => setHideTab(!hideTab)}
                variant="secondary"
                text={hideTab ? "Open tabs" : "Hide tabs"}
                icon={hideTab ? <Eye /> : <EyeClose />}
              />
              <DashboardButton
                variant="secondary"
                text="Export"
                icon={<Export />}
              />
              <DashboardButton
                onClick={() => navigate("/dashboard/club/reservation/new")}
                variant="primary"
                text="New Reservation"
                icon={<Add fill="#fff" />}
              />
            </div>
          </div>
          {!hideTab && (
            <div className="flex mb-8 rounded-lg bg-white border border-gray-200">
              <div className="flex-1">
                <StatCard
                  title="Total Reservations"
                  value={stats.totalReservations.count}
                  change={stats.totalReservations.change}
                  color="blue"
                  IconColor="#60A5FA"
                  icon={<Calendar />}
                />
              </div>
              <div className="w-px bg-gray-200 my-4"></div>
              <div className="flex-1">
                <StatCard
                  title="Prepaid Reservations"
                  value={stats.prepaidReservations.count}
                  change={stats.prepaidReservations.change}
                  color="green"
                  IconColor="#06CD02"
                  icon={<CardPay />}
                />
              </div>
              <div className="w-px bg-gray-200 my-4"></div>
              <div className="flex-1">
                <StatCard
                  title="Expected Guests Today"
                  value={stats.expectedGuests.count}
                  change={stats.expectedGuests.change}
                  color="purple"
                  IconColor="#CD16C3"
                  icon={<Group3 />}
                />
              </div>
              <div className="w-px bg-gray-200 my-4"></div>
              <div className="flex-1">
                <StatCard
                  title="Pending Payments"
                  value={`₦${stats.pendingPayments.count.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }
                  )}`}
                  change={stats.pendingPayments.change}
                  color="orange"
                  IconColor="#E1B505"
                  icon={<Cash2 fill="#E1B505" />}
                />
              </div>
            </div>
          )}

          {/* Tabs and Filters */}
          <div className="bg-white rounded-g borde border-gray-0">
            <div className="flex md:items-center flex-col-reverse md:flex-row gap-4 justify-between py-4 px-4 border- border-gray-200">
              <div className="flex flex-1 items-center">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`p-2 text-xs md:text-sm rounded-lg border font-medium cursor-pointer ${
                      activeTab === tab
                        ? "border-[#B3D1D2] bg-[#E7F0F0] text-[#111827]"
                        : "border-transparent text-[#606368]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="relative items-center flex flex-1">
                  <Search className="absolute left-2 text-[#606368] size-5" />
                  <Input
                    type="text"
                    placeholder="Search by guest name, ID, booking code or venue"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm pl-10 bg-[#F9FAFB] border-[#DAE9E9]"
                  />
                </div>
                <div className="md:flex gap-2 hidden">
                  {/* Date Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-auto text-[#606368]"
                      >
                        {selectedDate === "all" ? "Date" : selectedDate}{" "}
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="p-2">
                        <button
                          onClick={() => setSelectedDate("all")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedDate === "all"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          All Dates
                        </button>
                        <button
                          onClick={() => setSelectedDate("Today")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedDate === "Today"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setSelectedDate("This Week")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedDate === "This Week"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => setSelectedDate("This Month")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedDate === "This Month"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          This Month
                        </button>
                        <button
                          onClick={() => setSelectedDate("Last 30 Days")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedDate === "Last 30 Days"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          Last 30 Days
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Payment Status Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-auto text-[#606368]"
                      >
                        {selectedPaymentStatus === "all"
                          ? "Payment Status"
                          : selectedPaymentStatus}{" "}
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="p-2">
                        <button
                          onClick={() => setSelectedPaymentStatus("all")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedPaymentStatus === "all"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          All Status
                        </button>
                        <button
                          onClick={() => setSelectedPaymentStatus("Fully Paid")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedPaymentStatus === "Fully Paid"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Fully Paid
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedPaymentStatus("Part Paid")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedPaymentStatus === "Part Paid"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Partly Paid
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedPaymentStatus("Unpaid")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedPaymentStatus === "Unpaid"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                            Unpaid
                          </span>
                        </button>
                        <button
                          onClick={() => setSelectedPaymentStatus("Refunded")}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                            selectedPaymentStatus === "Refunded"
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Refunded
                          </span>
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Advanced Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-auto text-[#606368]"
                      >
                        Advanced filter <Filter2 fill="black" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Table
                          </label>
                          <select
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="all">All Tables</option>
                            {Array.from(
                              new Set(
                                reservations.map((r) => r.table).filter(Boolean)
                              )
                            ).map((table) => (
                              <option key={table} value={table}>
                                {table}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Guest Count
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
                              setSelectedDate("all");
                              setSelectedPaymentStatus("all");
                              setSelectedTable("all");
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
                    <Filter2 fill="black" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            {data.length > 0 ? (
              <div className="overflow-hidden hidden md:block rounded-md border">
                <Table>
                  <TableHeader className="bg-[#E6F2F2]">
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            paginatedReservations.length > 0 &&
                            paginatedReservations.every((r) =>
                              selectedReservations.includes(r._id)
                            )
                          }
                          onChange={(e) =>
                            handleToggleSelectPage(e.target.checked)
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          disabled={paginatedReservations.length === 0}
                        />
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer name
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guests
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total (₦)
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </TableHead>
                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reservation Status
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReservations.length > 0 ? (
                      paginatedReservations.map((reservation) => (
                        <TableRow
                          key={reservation._id}
                          className="hover:bg-gray-50"
                          data-state={
                            selectedReservations.includes(reservation._id) &&
                            "selected"
                          }
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedReservations.includes(
                                reservation._id
                              )}
                              onChange={(e) =>
                                handleSelectReservation(
                                  reservation._id,
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {reservation.customerName
                                    ?.split(" ")
                                    .map((i) => i.slice(0, 1).toUpperCase()) ||
                                    "N/A"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {reservation.customerName || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: #{reservation._id?.slice(0, 8) || "N/A"}
                                  <div className="text-xs">
                                    {reservation.bookingCode}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-900">
                                {formatDate(reservation.date) || "N/A"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {extractTime(reservation.date)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {/* <Users className="w-4 h-4 text-gray-400" /> */}
                              <span className="text-sm text-gray-900">
                                {reservation.guests || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">
                              {reservation.table || "Not assigned"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-600">
                                Combos: {reservation.combos?.length || 0}
                              </span>
                              <span className="text-xs text-gray-600">
                                Drinks:{" "}
                                {calculateTotalDrinksQuantity(reservation)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900 font-medium">
                              ₦
                              {reservation.totalAmount?.toLocaleString() || "0"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                                reservation.paymentStatus
                              )}`}
                            >
                              {normalizePaymentStatus(
                                reservation.paymentStatus
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getReservationStatusColor(
                                reservation.reservationStatus
                              )}`}
                            >
                              {(reservation.reservationStatus || "Pending")
                                .charAt(0)
                                .toUpperCase() +
                                (
                                  reservation.reservationStatus || "Pending"
                                ).slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {/* <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() =>
                                setShowPopup({
                                  display: true,
                                  details: reservation,
                                })
                              }
                            >
                              <Eye size={16} />
                            </button> */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem> */}
                                <DropdownMenuItem
                                  onClick={() =>
                                    setShowPopup({
                                      display: true,
                                      details: reservation,
                                    })
                                  }
                                >
                                  <Eye2 /> View Reservation
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pencil /> Edit Reservation
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone /> Contact Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer /> Print Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle /> Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle /> Mark as No-Show
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      reservation.id
                                    )
                                  }
                                >
                                  <Copy /> Dupllicate Reservation
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-[#EF4444]">
                                  <XCircle /> Cancel Reservation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          No reservations found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
              Page {currentPage} of {totalPages} ({totalItems} total
              reservations)
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
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  } ${
                    page === "ellipsis-start" || page === "ellipsis-end"
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

      {/* Popup Modal */}
      {showPopup.display && (
        <div className="inset-0 fixed top-0 left-0 w-full h-screen overflow-y-auto bg-black/80 z-50">
          <div className="bg-gray-50 px-4 max-w-4xl mx-auto rounded-lg my-10 py-6 md:px-6 md:py-8">
            <div className="max-w-4xl mx-auto">
              {/* Reservation Details */}
              <div className="bg-white rounded-2xl border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                  Reservation Details
                </h2>

                {/* HR tag after Reservation Details */}
                <hr className="border-gray-200 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 px-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Club</p>
                    <p className="text-base font-medium text-gray-900 mb-1">
                      {showPopup.details.vendor?.businessName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {showPopup.details.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                    <p className="font-medium text-gray-900">
                      #
                      {showPopup.details._id?.slice(0, 8).toUpperCase() ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {showPopup.details.date
                        ? new Date(showPopup.details.date).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}{" "}
                      • {extractTime(showPopup.details.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Guests</p>
                    <p className="font-medium text-gray-900">
                      {showPopup.details.guests || 0} Guests
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Table</p>
                    <p className="font-medium text-gray-900">
                      {showPopup.details.table || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking Code</p>
                    <p className="font-medium text-gray-900">
                      {showPopup.details.bookingCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                    <p className="font-medium text-gray-900">
                      {showPopup.details.customerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <div className="mt-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getReservationStatusColor(
                          showPopup.details.reservationStatus
                        )}`}
                      >
                        {(showPopup.details.reservationStatus || "Pending")
                          .charAt(0)
                          .toUpperCase() +
                          (
                            showPopup.details.reservationStatus || "Pending"
                          ).slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Selection - Combos & Drinks */}
              {(showPopup.details.combos?.length > 0 ||
                showPopup.details.drinks?.length > 0) && (
                <div className="rounded-2xl border border-gray-200 mb-6 bg-white shadow-sm p-5">
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-2">
                      Order Items ({calculateTotalItems(showPopup.details)}{" "}
                      {calculateTotalItems(showPopup.details) > 1
                        ? "items"
                        : "item"}
                      )
                    </h2>

                    {/* Combos */}
                    {showPopup.details.combos?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Combos
                        </h3>
                        <ul className="divide-y divide-gray-100">
                          {showPopup.details.combos.map((combo, index) => (
                            <li key={index} className="py-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {combo.name}
                                  </span>
                                  {combo.addOns?.length > 0 && (
                                    <div className="mt-1">
                                      <p className="text-xs text-gray-500 mb-1">
                                        Add-ons:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {combo.addOns
                                          .slice(0, 3)
                                          .map((addOn, idx) => (
                                            <span
                                              key={idx}
                                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                            >
                                              {addOn}
                                            </span>
                                          ))}
                                        {combo.addOns.length > 3 && (
                                          <span className="text-xs text-gray-500">
                                            +{combo.addOns.length - 3} more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-900">
                                  ₦{combo.setPrice?.toLocaleString() || "0"}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Drinks */}
                    {showPopup.details.drinks?.length > 0 && (
                      <div>
                        {showPopup.details.combos?.length > 0 && (
                          <div className="border-t border-gray-200 my-4"></div>
                        )}
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Drinks
                        </h3>
                        <ul className="divide-y divide-gray-100">
                          {showPopup.details.drinks.map((drinkItem, index) => (
                            <li
                              key={index}
                              className="flex justify-between py-3"
                            >
                              <span className="text-gray-700">
                                {drinkItem.quantity || 1}x{" "}
                                {drinkItem.drink?.name || "Unknown Drink"}
                                <span className="text-xs text-gray-500 block">
                                  {drinkItem.drink?.category || "N/A"} •{" "}
                                  {drinkItem.drink?.volume || "N/A"}
                                </span>
                              </span>
                              <span className="text-gray-900 font-medium">
                                ₦
                                {(
                                  (drinkItem.drink?.price || 0) *
                                  (drinkItem.quantity || 1)
                                ).toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">Total Amount</p>
                    <p className="font-semibold text-[#37703F] text-lg">
                      ₦{showPopup.details.totalAmount?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                          showPopup.details.paymentStatus
                        )}`}
                      >
                        {normalizePaymentStatus(
                          showPopup.details.paymentStatus
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Cards - Changed to green background */}
              <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-2xl p-4 mb-8">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Customer Contact
                      </p>
                      <p className="text-sm text-gray-700">
                        {showPopup.details.customerEmail || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Please remind guests to arrive 15 mins early for VIP
                      processing
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row w-full gap-3">
                <button
                  onClick={() => {
                    setShowPopup({ display: false, details: {} });
                  }}
                  className="flex-1 h-10 text-sm rounded-xl font-medium px-6 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (
                      showPopup.details.bookingCode ||
                      showPopup.details._id
                    ) {
                      navigator.clipboard.writeText(
                        showPopup.details.bookingCode || showPopup.details._id
                      );
                      toast.success("Booking code copied to clipboard");
                    }
                  }}
                  className="flex-1 h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800 text-white transition-colors"
                >
                  Copy Booking Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClubReservationTable;
