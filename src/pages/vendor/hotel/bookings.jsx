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
  CheckCircle,
  Export,
  Eye,
  EyeClose,
  Filter2,
  XCircle,
} from "@/components/dashboard/ui/svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmReservation, {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  CheckCircle2,
  MoreHorizontal,
  ScanLine,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizePaymentStatus = (status = "") => {
  const s = status.toLowerCase();
  if (s === "paid" || s === "success") return "Fully Paid";
  if (s === "part paid") return "Part Paid";
  if (s.includes("not paid")) return "Unpaid";
  return "Unpaid";
};

const getPaymentStatusColor = (status) => {
  const normalized = normalizePaymentStatus(status);
  switch (normalized) {
    case "Fully Paid":  return "bg-green-100 text-green-800 border";
    case "Part Paid":   return "bg-yellow-100 text-yellow-800 border";
    case "Unpaid":      return "bg-gray-100 text-gray-800 border";
    default:            return "bg-gray-100 text-gray-800 border";
  }
};

// ─── BookingManagement ────────────────────────────────────────────────────────
const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState("All");
  const vendor = useSelector((state) => state.auth.vendor);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
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

  // ── Mark as Completed dialog state ─────────────────────────────────────────
  const [open, setOpen] = useState(false);
  // Store the full booking object so handleConfirmArrival has everything it needs
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ── Arrival confirmation state ───────────────────────────────────────────────
  const [confirmingIds, setConfirmingIds] = useState(new Set());

  // ── Confirm arrival handler ──────────────────────────────────────────────────
  // Errors are re-thrown after toasting so ConfirmReservation's try/finally
  // keeps the loader spinner visible for the full duration of the API call.
  const handleConfirmArrival = useCallback(async (booking) => {

    const bookingId = booking._id;
    if (confirmingIds.has(bookingId)) return;

    setConfirmingIds((prev) => new Set(prev).add(bookingId));

    try {
      const resId = booking.resId || booking._id;

      const normalizeStatus = (status) => (status || "").toLowerCase();
      const paymentStatus = normalizeStatus(booking.paymentStatus);
      const isPaid = paymentStatus.includes("paid") || paymentStatus.includes("success");

      let paymentRef = null;
      if (isPaid) {
        paymentRef =
          booking.paymentRef ??
          booking.reference ??
          booking.payment_ref ??
          booking.payment?.id ??
          booking.paymentId ??
          booking.payment?._id;
      }

      console.log("🔍 Confirm attempt:", {
        bookingId,
        resId,
        paymentRef,
        paymentStatus: booking.paymentStatus,
        isPaid,
        availableKeys: Object.keys(booking).filter((k) =>
          k.includes("pay") || k.includes("ref") || k.includes("resId") || k.includes("payment")
        ),
      });

      if (!isPaid) {
        throw new Error("Cannot confirm arrival: Payment not completed");
      }

      await userService.updateReservationStatus({
        reservationId: bookingId,
        vendorId: vendor?._id,
        resId,
        paymentRef,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, reservationStatus: "arrived" } : b
        )
      );
      toast.success("✅ Arrival confirmed!");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "";
      if (msg.includes("Missing") && msg.includes("data"))
        toast.error("Backend missing payment data. Admin: Add .populate('payment') to /bookings endpoint.");
      else if (msg.includes("Missing required fields"))
        toast.error("Missing resId or paymentId — check booking data.");
      else if (msg.includes("resId"))
        toast.error(`resId mismatch: ${err?.response?.data?.providedResId || msg}`);
      else if (msg.includes("paymentId") || msg.includes("payment"))
        toast.error(`Payment issue: ${msg}. Backend needs payment population.`);
      else if (msg.includes("Payment must be successful"))
        toast.error("Payment incomplete.");
      else if (msg.includes("hotelReservation"))
        toast.error("Use hotel-specific flow.");
      else
        toast.error(msg || "Failed to confirm arrival.");
     
    } finally {
      setConfirmingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  }, [confirmingIds, vendor?._id]);

  // ── QR scan confirmation ────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrBookingId = params.get("bookingId");
    if (qrBookingId) {
      handleConfirmArrival({ _id: qrBookingId });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [handleConfirmArrival]);

  // ── Columns ──────────────────────────────────────────────────────────────────
  const columns = useMemo(() => [
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
            {booking.rooms[0]?.roomId.name || "N/A"}
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
            className={`inline-flex px-3 py-2.5 text-xs font-medium rounded-full ${getPaymentStatusColor(paymentStatus)}`}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBooking(booking);
                  setOpen(true);
                }}
              >
                <CheckCircle /> Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#EF4444]">
                <XCircle /> Cancel Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [confirmingIds, handleConfirmArrival]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > maxVisible) pages.push("ellipsis-start");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - maxVisible + 1) pages.push("ellipsis-end");
      pages.push(totalPages);
    }
    return pages;
  };

  const tabs = ["All", "Upcoming", "Completed", "Canceled", "No shows"];

  const socketRef = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    if (!vendor?._id) return;
    let isComponentMounted = true;

    const connect = () => {
      if (!isComponentMounted) return;
      const socket = new WebSocket(
        `wss://rhace-backend-mkne.onrender.com?type=vendor&id=${vendor._id}`
      );
      socketRef.current = socket;

      socket.onopen = () => console.log("✅ WebSocket connected");

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("📩 Message from server:", message);
          if (message.type === "new_reservation") {
            toast.success(`🆕 New reservation from ${message.data.customerName}`);
            setBookings((prev) => [message.data, ...prev]);
          }
        } catch (error) {
          console.error("❌ Failed to parse message:", error);
        }
      };

      socket.onerror = (err) => console.error("⚠️ WebSocket error:", err);

      socket.onclose = (e) => {
        console.warn(`🔌 WebSocket closed (code: ${e.code})`);
        socketRef.current = null;
        if (isComponentMounted && e.code !== 1000) {
          reconnectTimeout.current = setTimeout(() => {
            console.log("🔁 Reconnecting WebSocket...");
            connect();
          }, 5000);
        }
      };
    };

    connect();

    return () => {
      isComponentMounted = false;
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [vendor?._id]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await userService.fetchReservations({ vendorId: vendor._id });
        const data = res?.data || [];
        setBookings(data);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, [vendor?._id]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        !searchTerm ||
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;
      if (activeTab !== "All") {
        const status = (booking.reservationStatus || booking.status || "").toLowerCase();
        switch (activeTab) {
          case "Upcoming":   matchesTab = status === "upcoming"; break;
          case "Completed":  matchesTab = status === "completed" || status === "paid"; break;
          case "Canceled":   matchesTab = status === "canceled" || status === "cancelled"; break;
          case "No shows":   matchesTab = status === "no shows" || status === "no-shows"; break;
          default:           matchesTab = true;
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

      return matchesSearch && matchesTab && matchesPaymentStatus && matchesRoomType && matchesDate;
    });
  }, [bookings, searchTerm, activeTab, selectedPaymentStatus, selectedRoomType, selectedDate]);

  const confirmedCount = useMemo(() => {
    return bookings.filter((b) =>
      ["confirmed", "completed"].includes(
        (b.reservationStatus || b.status || "").toLowerCase()
      )
    ).length;
  }, [bookings]);

  const data = filteredBookings;

  useEffect(() => {
    setTotalItems(filteredBookings.length);
    const maxPage = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [filteredBookings.length, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = data.slice(startIndex, startIndex + itemsPerPage);

  const table = useReactTable({
    data: paginatedBookings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null);
    return useCallback(
      (...args) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => callback(...args), delay);
      },
      [callback, delay]
    );
  };

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce((value) => setSearchTerm(value), 300);

  if (isLoading) return <UniversalLoader fullscreen />;

  return (
    <DashboardLayout type={vendor.vendorType} settings={false} section="bookings">
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
              <DashboardButton variant="secondary" text="Export" icon={<Export />} />
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
              <div className="w-px bg-gray-200 my-4" />
              <div className="flex-1">
                <StatCard
                  title="Confirmed"
                  value={confirmedCount}
                  change={8}
                  color="green"
                  icon={<CardPay />}
                  IconColor="#06CD02"
                />
              </div>
              <div className="w-px bg-gray-200 my-4" />
              <div className="flex-1">
                <StatCard
                  title="Pending"
                  value={bookings.filter((r) => r.reservationStatus === "Upcoming").length}
                  change={8}
                  icon={<Cash2 className="text-[#CD16C3]" />}
                  color="pink"
                  IconColor="#CD16C3"
                />
              </div>
              <div className="w-px bg-gray-200 my-4" />
              <div className="flex-1">
                <StatCard
                  title="Total Revenue"
                  value={`₦ ${bookings
                    .filter((r) => r.paymentStatus === "paid" || r.paymentStatus === "success")
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
          <div>
            <div className="flex md:items-center flex-col-reverse md:flex-row gap-4 justify-between py-4 px-4">
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
                  {/* Date filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
                        {selectedDate === "all" ? "Date" : selectedDate} <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="p-2">
                        {["all", "Today", "This Week", "This Month", "Last 30 Days"].map((d) => (
                          <button
                            key={d}
                            onClick={() => setSelectedDate(d)}
                            className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedDate === d ? "bg-gray-100 font-medium" : ""}`}
                          >
                            {d === "all" ? "All Dates" : d}
                          </button>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Payment status filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
                        {selectedPaymentStatus === "all" ? "Payment Status" : selectedPaymentStatus} <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="p-2">
                        <button onClick={() => setSelectedPaymentStatus("all")} className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedPaymentStatus === "all" ? "bg-gray-100 font-medium" : ""}`}>All Status</button>
                        {[
                          { label: "Fully Paid", color: "bg-green-500" },
                          { label: "Part Paid", color: "bg-yellow-500" },
                          { label: "Unpaid", color: "bg-gray-500" },
                        ].map(({ label, color }) => (
                          <button key={label} onClick={() => setSelectedPaymentStatus(label)} className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${selectedPaymentStatus === label ? "bg-gray-100 font-medium" : ""}`}>
                            <span className="inline-flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${color}`} />
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Advanced filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
                        Advanced filter <Filter2 fill="black" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Room Type</label>
                          <select
                            value={selectedRoomType}
                            onChange={(e) => setSelectedRoomType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="all">All Room Types</option>
                            {Array.from(new Set(bookings.map((b) => b.room?.name).filter(Boolean))).map((roomType) => (
                              <option key={roomType} value={roomType}>{roomType}</option>
                            ))}
                          </select>
                        </div>
                        <div className="pt-2 border-t">
                          <button
                            onClick={() => { setSelectedDate("all"); setSelectedPaymentStatus("all"); setSelectedRoomType("all"); }}
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
              <div className="overflow-hidden hidden md:block rounded-md border mb-4">
                <Table>
                  <TableHeader className="bg-[#E6F2F2]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
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
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
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
                  onClick={() => typeof page === "number" && handlePageChange(page)}
                  disabled={page === "ellipsis-start" || page === "ellipsis-end"}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  } ${page === "ellipsis-start" || page === "ellipsis-end" ? "cursor-default" : "hover:bg-gray-100"}`}
                >
                  {page === "ellipsis-start" || page === "ellipsis-end" ? "…" : page}
                </button>
              ))}
            </div>
            <div className="gap-2 flex">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeft />
              </button>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Completed confirmation dialog — uses original handleConfirmArrival logic */}
      <ConfirmReservation
        onConfirm={async() => {
          if (selectedBooking) {
            handleConfirmArrival(selectedBooking);
          }
        }}
        setOpen={setOpen}
        open={open}
      />
    </DashboardLayout>
  );
};

export default BookingManagement;