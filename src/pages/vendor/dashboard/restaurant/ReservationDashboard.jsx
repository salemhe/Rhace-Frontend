import { StatCard } from "@/components/dashboard/stats/mainStats";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import {
  Add,
  Calendar,
  CardPay,
  Cash2,
  CheckCircle,
  Copy,
  Export,
  Eye,
  Eye2,
  EyeClose,
  Filter2,
  Group3,
  Pencil,
  Phone,
  Printer,
  XCircle,
} from "@/components/dashboard/ui/svg";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  // ColumnDef,
  // ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  // SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MoreVertical,
  Search,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmReservation, {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userService } from "@/services/user.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
// import { formatCustomDate } from '@/utils/formatDate';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { useWebSocket } from "@/contexts/WebSocketContext";

const categories = ["All", "Upcoming", "Confirmed", "Cancelled", "No Shows"];

const ReservationDashboard = () => {
  const [hideTab, setHideTab] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const vendor = useSelector((state) => state.auth.vendor);
  const [data, setData] = useState([]);
  const [dat, setDat] = useState();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    status: "", // upcoming | confirmed | cancelled | no-show
  });
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState({
    display: false,
    details: {},
  });

  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [resID, setResID] = useState();
  const [confirmingIds, setConfirmingIds] = useState(new Set());
  const reservationStatusOptions = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-[#E7F0F0] text-[#0A6C6D] border-[#B3D1D2]";
      case "confirmed":
        return "bg-[#D1FAE5] text-[#37703F] border-[#B8FFC2]";
      case "cancelled":
        return "bg-[#FCE6E6] text-[#EF4444] border-[#FAE48A]";
      case "no-show":
        return "bg-[#FCE6E6] text-[#EF4444] border-[#FAE48A]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  const socketRef = useRef(null);

  const handleConfirmArrival = useCallback(
    async (booking) => {
      const bookingId = booking._id;
      if (confirmingIds.has(bookingId)) return;

      setConfirmingIds((prev) => new Set(prev).add(bookingId));

      try {
        const resId = booking.resId || booking._id;

        const normalizeStatus = (status) => (status || "").toLowerCase();
        const paymentStatus = normalizeStatus(booking.paymentStatus);
        const isPaid =
          paymentStatus.includes("paid") ||
          paymentStatus.includes("pay_later") ||
          paymentStatus.includes("partly_paid") ||
          paymentStatus.includes("success");

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
          availableKeys: Object.keys(booking).filter(
            (k) =>
              k.includes("pay") ||
              k.includes("ref") ||
              k.includes("resId") ||
              k.includes("payment"),
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

        setData((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, reservationStatus: "confirmed" } : b,
          ),
        );
        toast.success("✅ Arrival confirmed!");
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "";
        if (msg.includes("Missing") && msg.includes("data"))
          toast.error(
            "Backend missing payment data. Admin: Add .populate('payment') to /bookings endpoint.",
          );
        else if (msg.includes("Missing required fields"))
          toast.error("Missing resId or paymentId — check booking data.");
        else if (msg.includes("resId"))
          toast.error(
            `resId mismatch: ${err?.response?.data?.providedResId || msg}`,
          );
        else if (msg.includes("paymentId") || msg.includes("payment"))
          toast.error(
            `Payment issue: ${msg}. Backend needs payment population.`,
          );
        else if (msg.includes("Payment must be successful"))
          toast.error("Payment incomplete.");
        else if (msg.includes("hotelReservation"))
          toast.error("Use hotel-specific flow.");
        else toast.error(msg || "Failed to confirm arrival.");
      } finally {
        setConfirmingIds((prev) => {
          const next = new Set(prev);
          next.delete(bookingId);
          return next;
        });
      }
    },
    [confirmingIds, vendor?._id],
  );

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
      header: "Customer Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {user.customerName
                  .split(" ")
                  .map((i) => i.slice(0, 1).toUpperCase())}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-[#111827] font-medium text-sm">
                {row.getValue("customerName")}
              </span>
              <span className="text-[#606368] text-xs capitalize">
                ID #{user._id.slice(0, 8)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "date_n_time",
      header: "Date & Time",
      cell: ({ row }) => {
        const user = row.original;
        const date = new Date(user.date);
        return (
          <div className="flex flex-col">
            <span className="text-[#111827] font-medium text-sm">
              {date.toISOString().split("T")[0]}
            </span>
            <span className="text-[#606368] text-xs capitalize">
              Time {user.time}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "guests",
      header: () => {
        return <div>No of Guests</div>;
      },
      cell: ({ row }) => <div>{row.getValue("guests")}</div>,
    },
    {
      accessorKey: "mealPreselected",
      header: () => {
        return <div>Meal Preselected</div>;
      },
      cell: ({ row }) => (
        <div
          className={`${row.getValue("mealPreselected") ? "bg-[#D1FAE5] text-[#37703F] border-[#B8FFC2]" : "text-[#EF4444] bg-[#FCE6E6] border-[#ffbbbb]"} flex py-1.5 px-3 w-max items-center border rounded-full`}
        >
          {row.getValue("mealPreselected") ? (
            <Check className="text-[#37703F] size-4" />
          ) : (
            <XIcon className="text-[#EF4444] size-4" />
          )}
          {row.getValue("mealPreselected") ? "Yes" : "No"}
        </div>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: () => {
        return <div>Payment Status</div>;
      },
      cell: ({ row }) => (
        <div
          className={` w-max ${row.getValue("paymentStatus") === "paid" ? "bg-[#D1FAE5] text-[#37703F] border-[#B8FFC2]" : "text-[#EF4444] bg-[#FCE6E6] border-[#ffbbbb]"} flex py-1.5 px-3 border rounded-full`}
        >
          {row.getValue("paymentStatus") === "not_paid"
            ? "Pay at Restaurant"
            : row.getValue("paymentStatus").split("_").join(" ")}
        </div>
      ),
    },
    {
      accessorKey: "reservationStatus",
      header: () => {
        return <div>Reservation Status</div>;
      },
      cell: ({ row }) => (
        <div
          className={`w-max 
            ${reservationStatusOptions(row.getValue("reservationStatus").toLowerCase())} 
              flex py-1.5 px-3 border rounded-full`}
        >
          {row.getValue("reservationStatus").toLowerCase() === "upcoming" && "Upcoming"}
          {row.getValue("reservationStatus").toLowerCase() === "confirmed" && "Confirmed"}
          {row.getValue("reservationStatus").toLowerCase() === "cancelled" && "Cancelled"}
          {row.getValue("reservationStatus").toLowerCase() === "no-show" && "No Show"}
        </div>
      ),
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
                    details: booking,
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
                <span
                  className="relative flex cursor-default items-center gap-2 rounded-sm  py-1.5"
                  onClick={() => {
                    setOpen(true);
                    setSelectedBooking(booking);
                  }}
                >
                  <CheckCircle /> Mark as Completed
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle /> Mark as No-Show
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(booking.id)}
              >
                <Copy /> Dupllicate Reservation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#EF4444]">
                <XCircle /> Cancel Reservation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    if (!vendor?._id) return;

    const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

    const connect = () => {
      const socket = new WebSocket(
        `${VITE_SOCKET_URL}?type=vendor&id=${vendor._id}`,
      );
      socketRef.current = socket;

      socket.onopen = () => {
        // WebSocket connected
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          // Message from server

          if (message.type === "new_reservation") {
            toast.success(
              `🆕 New reservation from ${message.data.customerName}`,
            );
            setData((prev) => [...prev, message.data]);
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

        // Try reconnecting after delay
        // if (e.code !== 1000) {
        //   reconnectTimeout.current = setTimeout(() => {
        //     connect();
        //   }, 3000); // 3 seconds
        // }
      };
    };

    const handleReservationUpdate = (payload) => {
      toast.info(`Reservation updated: ${payload._id?.slice(0,8) || 'ID'}`);
      // Refetch data/stats
      fetchReservations();
      fetchStats();
    };

    // subscribe('reservation-created', handleNewReservation);
    subscribe('reservation-updated', handleReservationUpdate);
    subscribe('reservation-counters-updated', () => fetchStats());

    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
      // if (reconnectTimeout.current) {
      //   clearTimeout(reconnectTimeout.current);
      // }
    };
  }, [vendor?._id, subscribe, unsubscribe]);


  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);

        const res = await userService.fetchReservations({
          vendorId: vendor._id,
          page: query.page,
          limit: query.limit,
          status: query.status,
        });

        setData(res.data);
        setDat(res);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchStats = async () => {
      try {
        const res = await userService.fetchReservationsStats();
        setStats(res.data);
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    if (!vendor?._id) return;
    fetchReservations(page);
    fetchStats();
  }, [vendor?._id, query]);

  // if (isLoading || loading) {
  //   return <UniversalLoader fullscreen type="cards" />;
  // }

  const getVisiblePages = () => {
    const total = dat?.pages || 1;
    const current = query.page;

    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);

    // adjust if near end
    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <DashboardLayout type="restaurant" section="Reservations">
      {isLoading || loading ? (
        <UniversalLoader fullscreen type="dashboard-2" />
      ) : (
        <>
          <div className="md:p-6 md:mb-12 space-y-6">
            <div className="md:flex hidden justify-between items-center">
              <h2 className="text-[#111827] font-semibold">Reservation List</h2>
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
                  onClick={() =>
                    navigate("/dashboard/restaurant/reservation/new")
                  }
                  variant="primary"
                  text="New Reservation"
                  icon={<Add fill="#fff" />}
                />
              </div>
            </div>
            {!hideTab && (
              <div className="hidden md:grid grid-cols-4 border bg-white rounded-2xl">
                <div className="flex h-full items-center">
                  <StatCard
                    title="Reservations made today"
                    value={stats.totalReservations.count}
                    change={stats.totalReservations.change}
                    icon={<Calendar />}
                    color="blue"
                  />
                  <div className="h-3/5 w-[1px] bg-[#E5E7EB]" />
                </div>
                <div className="flex h-full items-center">
                  <StatCard
                    title="Prepaid Reservations"
                    value={stats.prepaidReservations.count}
                    change={stats.prepaidReservations.change}
                    icon={<CardPay />}
                    color="green"
                  />
                  <div className="h-3/5 w-[1px] bg-[#E5E7EB]" />
                </div>
                <div className="flex h-full items-center">
                  <StatCard
                    title="Expected Guests Today"
                    value={stats.expectedGuests.count}
                    change={stats.expectedGuests.change}
                    icon={<Group3 />}
                    color="purple"
                  />
                  <div className="h-3/5 w-[1px] bg-[#E5E7EB]" />
                </div>
                {/* <div className='flex h-full items-center w-full'> */}
                <StatCard
                  title="Pending Payments"
                  value={stats.pendingPayments.count.toLocaleString("en-US")}
                  change={stats.pendingPayments.change}
                  icon={<Cash2 fill="#E1B505" className="text-[#E1B505]" />}
                  color="orange"
                />
                {/* </div> */}
              </div>
            )}
            <div>
              <div className="w-full">
                <div className="flex md:items-center flex-col-reverse md:flex-row gap-4 justify-between py-4">
                  <div className="flex flex-1 items-center">
                    {categories.map((category, i) => (
                      <div
                        onClick={() => {
                          const value =
                            category === "All" ? "" : category.toLowerCase();

                          setActiveCategory(category);

                          setQuery((prev) => ({
                            ...prev,
                            status: value,
                            page: 1, // reset page
                          }));
                        }}
                        className={`p-2 text-xs md:text-sm rounded-lg border font-medium cursor-pointer ${category === activeCategory ? "border-[#B3D1D2] bg-[#E7F0F0] text-[#111827] " : "border-transparent text-[#606368]"}`}
                        key={i}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative items-center flex flex-1">
                      <Search className="absolute left-2 text-[#606368] size-5" />
                      <Input
                        placeholder="Search by guest name or ID"
                        value={
                          table.getColumn("customerName")?.getFilterValue() ??
                          ""
                        }
                        onChange={(event) =>
                          table
                            .getColumn("customerName")
                            ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm pl-10 bg-[#F9FAFB] border-[#DAE9E9] "
                      />
                    </div>
                    <div className="md:flex gap-2 hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="ml-auto text-[#606368]"
                          >
                            Today <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                              return (
                                <DropdownMenuCheckboxItem
                                  key={column.id}
                                  className="capitalize"
                                  checked={column.getIsVisible()}
                                  onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                  }
                                >
                                  {column.id}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="ml-auto text-[#606368]"
                          >
                            Payment Status <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                              return (
                                <DropdownMenuCheckboxItem
                                  key={column.id}
                                  className="capitalize"
                                  checked={column.getIsVisible()}
                                  onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                  }
                                >
                                  {column.id}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="ml-auto text-[#606368]"
                          >
                            Advanced filter <Filter2 fill="black" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                              return (
                                <DropdownMenuCheckboxItem
                                  key={column.id}
                                  className="capitalize"
                                  checked={column.getIsVisible()}
                                  onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                  }
                                >
                                  {column.id}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
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
                                      header.getContext(),
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
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
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
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute hidden md:flex bottom-0 border-t border-[#E5E7EB] left-0 right-0 bg-white">
            <div className="flex items-center w-full px-8 justify-between space-x-2 py-4">
              <div className="text-muted-foreground text-sm">
                Page {dat.page} of {dat.pages}
              </div>
              <div className="flex">
                <Pagination>
                  <PaginationContent>
                    {/* PREV */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() =>
                          query.page > 1 &&
                          setQuery((prev) => ({ ...prev, page: prev.page - 1 }))
                        }
                        className="cursor-pointer"
                      >
                        <ChevronLeft />
                      </PaginationLink>
                    </PaginationItem>

                    {/* FIRST PAGE */}
                    {query.page > 3 && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() =>
                              setQuery((prev) => ({ ...prev, page: 1 }))
                            }
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationEllipsis />
                      </>
                    )}

                    {/* VISIBLE PAGES */}
                    {getVisiblePages().map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={query.page === p}
                          onClick={() =>
                            setQuery((prev) => ({ ...prev, page: p }))
                          }
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* LAST PAGE */}
                    {query.page < (dat?.pages || 1) - 2 && (
                      <>
                        <PaginationEllipsis />
                        <PaginationItem>
                          <PaginationLink
                            onClick={() =>
                              setQuery((prev) => ({
                                ...prev,
                                page: dat.pages,
                              }))
                            }
                          >
                            {dat.pages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    {/* NEXT */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() =>
                          query.page < (dat?.pages || 1) &&
                          setQuery((prev) => ({ ...prev, page: prev.page + 1 }))
                        }
                        className="cursor-pointer"
                      >
                        <ChevronRight />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <div className="gap-2 flex">
                <DashboardButton
                  variant="secondary"
                  icon={<ChevronLeft className="size-5" />}
                  // size="sm"
                  onClick={() => query.page > 1 && setQuery((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={query.page === 1}
                  className="shadow-md"
                />
                <DashboardButton
                  variant="secondary"
                  icon={<ChevronRight className="size-5" />}
                  // size="sm"
                  onClick={() =>
                    query.page < dat.pages &&
                    setQuery((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={query.page === dat.pages}
                  className="shadow-md"
                />
              </div>
            </div>
          </div>
          {showPopup.display && (
            <div className="inset-0 fixed top-0 left-o w-full h-screen overflow-y-auto bg-black/80">
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
                        <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                        <p className="text-base font-medium text-gray-900 mb-1">
                          {showPopup.details.vendor.businessName || "hey"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {showPopup.details.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Reservation ID
                        </p>
                        <p className="font-medium text-gray-900">
                          #{showPopup.details._id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Date & Time
                        </p>
                        <p className="font-medium text-gray-900">
                          {new Date(showPopup.details.date).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}{" "}
                          • {showPopup.details.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Guests</p>
                        <p className="font-medium text-gray-900">
                          {showPopup.details.guests} Guests
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Meal Selection */}
                  {showPopup.details.menus.length > 0 && (
                    <div className="rounded-2xl border border-gray-200 mb-6 bg-white shadow-sm p-5">
                      <div>
                        <h2 className="font-semibold text-gray-900 mb-2">
                          Your Selection ({showPopup.details.menus.length}{" "}
                          {showPopup.details.menus.length > 1
                            ? "items"
                            : "item"}
                          )
                        </h2>
                        <ul className="divide-y divide-gray-100">
                          {showPopup.details.menus.map((item, index) => (
                            <li
                              key={index}
                              className="flex justify-between py-2"
                            >
                              <span className="text-gray-700">
                                {item.quantity}x {item.menu.name}
                              </span>
                              <span className="text-gray-900 font-medium">
                                ₦{item.menu.price.toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-gray-200 my-4"></div>

                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-800">Amount paid</p>
                        <p className="font-semibold text-[#37703F] text-lg">
                          ₦{showPopup.details.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Info Cards - Changed to green background */}
                  <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-2xl p-4 mb-8">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                          You will receive a confirmation email with your
                          reservation details
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
                        <p className="text-sm">Please, arrive 10 mins early</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row w-full gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPopup({ display: false, details: {} });
                      }}
                      className="flex-1 h-10 text-sm rounded-xl font-medium px-6 border-gray-300"
                    >
                      Close
                    </Button>
                    <form
                      action={async () => {
                        setShowPopup({ display: false, details: {} });
                      }}
                      className="flex-1"
                    >
                      <Button
                        type="submit"
                        className="w-full h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800"
                      >
                        Done
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ConfirmReservation
            onConfirm={async () => {
              if (selectedBooking) {
                console.log(
                  "Confirming arrival for booking ID:",
                  selectedBooking._id,
                );
                handleConfirmArrival(selectedBooking);
              }
            }}
            setOpen={setOpen}
            open={open}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default ReservationDashboard;
