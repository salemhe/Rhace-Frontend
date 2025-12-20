import { StatCard } from "@/components/dashboard/stats/mainStats";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NoDataFallback from "@/components/NoDataFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";

import {
  Calendar,
  CardPay,
  Cash2,
  Export,
  Eye,
  EyeClose,
  Filter2,
} from "@/components/dashboard/ui/svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { userService } from "@/services/user.service";
import { formatDate } from "@/utils/formatDate";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const normalizePaymentStatus = (status = "") => {
  const s = status.toLowerCase();

  if (s === "paid") return "Fully Paid";
  if (s === "part paid") return "Part Paid";
  if (s.includes("not paid")) return "Unpaid";

  return "Unpaid";
};
const getPaymentStatusColor = (status) => {
  const normalized = normalizePaymentStatus(status);
  switch (normalized) {
    case "Fully Paid":
      return "bg-green-100 text-green-800";
    case "Part Paid":
      return "bg-yellow-100 text-yellow-800";
    case "Unpaid":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="bg-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Customer name",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {booking.customerName
                ?.split(" ")
                .map((i) => i.slice(0, 1).toUpperCase()) || "N/A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">
              {booking.customerName || "Unknown"}
            </div>
            <div className="text-sm text-gray-500">
              ID: #{booking._id?.slice(0, 8) || "N/A"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In Date",
    cell: ({ row }) => (
      <div className="text-sm text-gray-900">
        {formatDate(row.getValue("checkInDate"))}
      </div>
    ),
  },
  {
    accessorKey: "checkOutDate",
    header: "Check-Out Date",
    cell: ({ row }) => (
      <div className="text-sm text-gray-900">
        {formatDate(row.getValue("checkOutDate"))}
      </div>
    ),
  },
  {
    accessorKey: "room.name",
    header: "Room Type",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="text-sm text-gray-900">
          {booking.room?.name || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "guests",
    header: "No of Guests",
    cell: ({ row }) => (
      <div className="text-sm text-gray-900">{row.getValue("guests")}</div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus");
      return (
        <span
          className={`inline-flex px-3 py-2.5 text-xs font-medium rounded-full ${getPaymentStatusColor(
            paymentStatus
          )}`}
        >
          {normalizePaymentStatus(paymentStatus)}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={() => {
            // Handle view/edit actions
            console.log("View booking:", booking._id);
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      );
    },
  },
];
const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBookings, setSelectedBookings] = useState([]);
  const vendor = useSelector((state) => state.auth.vendor);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 12 items per page (3x4 grid)
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedRoomType, setSelectedRoomType] = useState("all");

  const [hideTab, setHideTab] = useState(false);

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
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > maxVisible) {
        pages.push("ellipsis-start");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - maxVisible + 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const tabs = ["All", "Upcoming", "Completed", "Canceled", "No shows"];

  const handleSelectBooking = (id, checked) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, id]);
    } else {
      setSelectedBookings(
        selectedBookings.filter((bookingId) => bookingId !== id)
      );
    }
  };

  const socketRef = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    if (!vendor?._id) return;

    let isComponentMounted = true; // Add mount check

    const connect = () => {
      if (!isComponentMounted) return; // Don't connect if unmounted

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
            setBookings((prev) => [message.data, ...prev]); // Add to front
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

        // Only reconnect if component is still mounted and close wasn't intentional
        if (isComponentMounted && e.code !== 1000) {
          reconnectTimeout.current = setTimeout(() => {
            console.log("🔁 Reconnecting WebSocket...");
            connect();
          }, 5000); // Increase to 5 seconds
        }
      };
    };

    connect();

    return () => {
      isComponentMounted = false; // Prevent reconnection after unmount
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [vendor?._id]); // Remove bookings dependency
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await userService.fetchReservations({
          vendorId: vendor._id,
        });
        const data = res?.data || [];
        setBookings(data);
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, [vendor?._id]);

  // Filter bookings based on search term and active tab

  // Replace the filteredBookings calculation with:
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        !searchTerm ||
        booking.customerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking._id?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;
      if (activeTab !== "All") {
        const status = (
          booking.reservationStatus ||
          booking.status ||
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
          case "No shows":
            matchesTab = status === "no shows" || status === "no-shows";
            break;
          default:
            matchesTab = true;
        }
      }

      const matchesPaymentStatus =
        selectedPaymentStatus === "all" ||
        normalizePaymentStatus(booking.paymentStatus) === selectedPaymentStatus;

      const matchesRoomType =
        selectedRoomType === "all" || booking.room?.name === selectedRoomType;

      let matchesDate = true;
      if (selectedDate !== "all") {
        const checkInDate = new Date(booking.checkInDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate === "Today") {
          checkInDate.setHours(0, 0, 0, 0);
          matchesDate = checkInDate.getTime() === today.getTime();
        }

        if (selectedDate === "This Week") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = checkInDate >= weekStart && checkInDate <= weekEnd;
        }

        if (selectedDate === "This Month") {
          matchesDate =
            checkInDate.getMonth() === today.getMonth() &&
            checkInDate.getFullYear() === today.getFullYear();
        }

        if (selectedDate === "Last 30 Days") {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          matchesDate = checkInDate >= thirtyDaysAgo;
        }
      }

      return (
        matchesSearch &&
        matchesTab &&
        matchesPaymentStatus &&
        matchesRoomType &&
        matchesDate
      );
    });
  }, [
    bookings,
    searchTerm,
    activeTab,
    selectedPaymentStatus,
    selectedRoomType,
    selectedDate,
  ]);

  const data = filteredBookings;
  // Update total items based on filtered bookings
  useEffect(() => {
    setTotalItems(filteredBookings.length);
    // Ensure current page is within bounds
    const maxPage = Math.max(
      1,
      Math.ceil(filteredBookings.length / itemsPerPage)
    );
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [filteredBookings.length, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // compute paginated bookings for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = data.slice(startIndex, startIndex + itemsPerPage);

  // Toggle selection for visible page items (merge when selecting, remove when deselecting)
  const handleToggleSelectPage = (checked) => {
    const pageIds = paginatedBookings.map((b) => b.id);
    if (checked) {
      setSelectedBookings((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelectedBookings((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const table = useReactTable({
    data: paginatedBookings, // Use paginated data instead of all data
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // Remove getPaginationRowModel - we're handling pagination manually
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true, // Add this
    pageCount: totalPages, // Add this
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Add this helper at the top of your component
  const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null);

    return useCallback(
      (...args) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );
  };

  // In your component:
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce((value) => {
    setSearchTerm(value);
  }, 300);

  if (isLoading) {
    return <UniversalLoader fullscreen />;
  }

  return (
    <DashboardLayout
      type={vendor.vendorType}
      settings={false}
      section="bookings"
    >
      <div className="min-h-screen bg-gray-50 p-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex hidden justify-between items-center mb-6">
            <h2 className="text-[#111827] font-semibold">All Bookings</h2>
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
              {/* <DashboardButton onClick={() => navigate("/dashboard/restaurant/reservation/new")} variant="primary" text="New Reservation" icon={<Add fill="#fff" />} /> */}
            </div>
          </div>
          {!hideTab && (
            <div className="flex mb-8 rounded-lg bg-white border border-gray-200">
              <div className="flex-1">
                <StatCard
                  title="Total Reservations"
                  value={bookings?.length}
                  change={12}
                  color="blue"
                  IconColor="#60A5FA"
                  icon={<Calendar />}
                />
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-200 my-4"></div>

              <div className="flex-1">
                <StatCard
                  title="Confirmed"
                  value={
                    bookings?.filter((r) => r.status === "confirmed").length
                  }
                  change={8}
                  color="green"
                  icon={<CardPay />}
                  IconColor="#06CD02"
                />
              </div>

              <div className="w-px bg-gray-200 my-4"></div>

              <div className="flex-1">
                <StatCard
                  title="Pending"
                  value={
                    bookings.filter((r) => r.reservationStatus === "Upcoming")
                      .length
                  }
                  change={8}
                  icon={<Cash2 className="text-[#CD16C3]" />}
                  color="pink"
                  IconColor="#CD16C3"
                />
              </div>

              <div className="w-px bg-gray-200 my-4"></div>

              <div className="flex-1">
                <StatCard
                  title="Total Revenue"
                  value={` ₦ ${bookings
                    .filter(
                      (r) =>
                        r.paymentStatus === "paid" ||
                        r.paymentStatus === "success"
                    )
                    .reduce((sum, r) => sum + (r.totalAmount || 0), 0)
                    .toLocaleString()}`}
                  change={-5}
                  color="green"
                  IconColor="#E1B505"
                  icon={<Cash2 className="text-[#06CD02]" />}
                />
              </div>
            </div>
          )}
          {/* Tabs and Filters */}
          <div className="">
            <div className="flex md:items-center flex-col-reverse md:flex-row gap-4 justify-between py-4 px-4 borde ">
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
                    placeholder="Search by guest name or ID"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      debouncedSearch(e.target.value);
                    }}
                    className="max-w-sm pl-10 bg-[#F9FAFB] border-[#DAE9E9]"
                  />
                </div>
                <div className="md:flex gap-2 hidden">
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

                  {/* Payment Status Filter Dropdown */}
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
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Advanced Filter Dropdown - Room Type & Guest Count */}
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
                            Room Type
                          </label>
                          <select
                            value={selectedRoomType}
                            onChange={(e) =>
                              setSelectedRoomType(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="all">All Room Types</option>
                            {Array.from(
                              new Set(
                                bookings
                                  .map((b) => b.room?.name)
                                  .filter(Boolean)
                              )
                            ).map((roomType) => (
                              <option key={roomType} value={roomType}>
                                {roomType}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="pt-2 border-t">
                          <button
                            onClick={() => {
                              setSelectedDate("all");
                              setSelectedPaymentStatus("all");
                              setSelectedRoomType("all");
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
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="hover:bg-gray-50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <NoDataFallback />
            )}

            {/* Pagination */}
          </div>
        </div>
      </div>
      {totalItems > 0 && (
        <div className="absolute hidden md:flex bottom-0 border-t border-[#E5E7EB] left-0 right-0  bg-white">
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
    </DashboardLayout>
  );
};

export default BookingManagement;
