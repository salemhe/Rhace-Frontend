 import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import { Add, Calendar, CardPay, Cash2, CheckCircle, Copy, Export, Eye, Eye2, EyeClose, Filter2, Group3, Pencil, Phone, Printer, XCircle } from '@/components/dashboard/ui/svg';
// Naira icon not available in lucide-react; using Cash2 for Total Revenue
import { StatCard } from '@/components/dashboard/stats/mainStats';
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
  // VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, Check, ChevronDown, ChevronLeft, ChevronRight, EllipsisVertical, MoreHorizontal, MoreVertical, Search, X } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DashboardButton from '@/components/dashboard/ui/DashboardButton';
import FinancialDashboard from '@/components/dashboard/FinancialDashboard';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { formatDate } from '@/utils/formatDate';
import { paymentService } from '@/services/payment.service';

const PaymentDashboard = () => {
  const [hideTab, setHideTab] = useState(false);
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [activeTab, setActiveTab] = useState("Overview")
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [globalFilter, setGlobalFilter] = useState("")
  const [data, setData] = useState([])
  const vendor = useSelector((state) => state.auth.vendor);
  const [stats, setStats] = useState({
    "earnings": {
      "thisYear": 0,
      "lastYear": 0,
      "yearChange": 0,
      "thisWeek": 0,
      "lastWeek": 0,
      "weekChange": 0
    },
    "payments": {
      "completed": {
        "thisWeek": 0,
        "lastWeek": 0,
        "change": 0
      },
      "pending": {
        "thisWeek": 0,
        "lastWeek": 0,
        "change": 0
      }
    }
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [info, setInfo] = useState({
    "bankCode": "N/A",
    "accountNumber": "N/A",
    "subaccountCode": "N/A",
    "bankName": "N/A",
    "accountName": "N/A",
    "bankLogo": "N/A",
    "balance": "N/A"
  })
  const [loading, setLoading] = useState({
    data: true,
    stats: true,
    trend: true,
    info: true
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Status normalizer - fixes "Unknown" issue
  const getPaymentStatus = (payment) => {
    const status = (payment?.paymentStatus || payment?.payment_status || payment?.status || '').toLowerCase().trim();
    if (!status || status === 'unknown') return 'Pending';
    if (['success', 'paid', 'completed'].includes(status)) return 'Success';
    if (['pending', 'processing'].includes(status)) return 'Pending';
    if (['failed', 'cancelled', 'error'].includes(status)) return 'Failed';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper functions for client-side stats
  const isSuccess = (status) => ['success', 'paid', 'completed'].includes(status.toLowerCase());
  const isPending = (status) => ['pending', 'processing'].includes(status.toLowerCase());

  const computeClientStats = (payments) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    const thisWeekPayments = payments.filter(p => new Date(p.createdAt) >= oneWeekAgo);

    const allSuccess = payments.filter(p => isSuccess(getPaymentStatus(p)));
    const weekSuccess = thisWeekPayments.filter(p => isSuccess(getPaymentStatus(p)));
    const weekPending = thisWeekPayments.filter(p => isPending(getPaymentStatus(p)));

    const totalEarnings = allSuccess.reduce((sum, p) => sum + (p.amountPaid || p.amount || 0), 0);
    const earningsThisWeek = weekSuccess.reduce((sum, p) => sum + (p.amountPaid || p.amount || 0), 0);
    const completedThisWeek = earningsThisWeek; // success payments this week
    const pendingThisWeek = weekPending.reduce((sum, p) => sum + (p.amountPaid || p.amount || 0), 0);

    return {
      earnings: {
        thisYear: totalEarnings,
        thisWeek: earningsThisWeek,
        yearChange: 0,
        weekChange: 0
      },
      payments: {
        completed: {
          thisWeek: completedThisWeek,
          lastWeek: 0,
          change: 0
        },
        pending: {
          thisWeek: pendingThisWeek,
          lastWeek: 0,
          change: 0
        }
      }
    };
  };

  const uniqueStatuses = Array.from(new Set(data.map(row => getPaymentStatus(row)))).sort()
  const uniqueDates = Array.from(new Set(data.map(row => row.date))).sort()


  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const user = row.original
        return (
          <span className='text-[#111827] font-medium text-sm'>{formatDate(user.createdAt)}</span>
        )
      },
      filterFn: (row, columnId, value) => {
        return value === "" || row.getValue(columnId) === value
      },
    },
    {
      accessorKey: "Transaction ID",
      header: "Transaction ID",
      cell: ({ row }) => {
        const user = row.original
        return (
          <span className='text-[#111827] font-medium text-sm'>#{user._id.slice(0, 8).toUpperCase()}</span>
        )
      },
    },
    {
      accessorKey: "customer name",
      header: "Customer Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user.customerName.split(" ").map((i) => (i.slice(0, 1).toUpperCase()))}</AvatarFallback>
            </Avatar>
            <span className='text-[#111827] font-medium text-sm'>{user.customerName}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "payment Method",
      header: "Payment Method",
      cell: ({ row }) => {
        const user = row.original
        return (
          <span className='text-[#111827] font-medium text-sm'>
            {user.paymentMethod && user.paymentMethod.split("_").join(" ").toUpperCase()}
          </span>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const user = row.original
        return (
          <span className='text-[#111827] font-medium text-sm'>
            {"\u20A6"}{user.amountPaid.toLocaleString()}
          </span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Payment Status",
      filterFn: (row, columnId, value) => {
        return value === "" || row.getValue(columnId) === value
      },
      cell: ({ row }) => {
        const status = getPaymentStatus(row.original);
        const isSuccess = status.toLowerCase() === 'success';
        return (
          <div className={`flex border py-1.5 px-3 items-center gap-2 rounded-full w-fit ${isSuccess ? "bg-[#D1FAE5] border-[#B8FFC2] text-[#37703F]" : "text-[#EF4444] border-[#FAE48A] bg-[#FCE6E6]"}`}>
            <div className={`${isSuccess ? "bg-[#37703F]" : "bg-[#EF4444]"} size-2 rounded-full`} />
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;
  const handleViewDetails = () => {
      setSelectedPayment(payment);
      setIsDetailsOpen(true);
    };

  const handlePrintReceipt = (payment) => {
    setSelectedPayment(payment);
    setTimeout(() => window.print(), 500);
    toast.success(`Printing receipt for #${payment._id?.slice(0,8)}`);
  };

  return (
    <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye2 className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrintReceipt}>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print Receipt</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]


  const { subscribe, unsubscribe } = useWebSocket();

  const fetchData = () => {
const fetchPayments = async () => {
      try {
        setLoading(prev => ({ ...prev, data: true }));
        const res = await paymentService.getPayments();




        setData(res);
        // Compute total revenue from successful payments
        const revenue = res
          .filter(item => {
            const status = (item.payment_status || item.paymentStatus || item.status || '').toLowerCase();
            const isSuccess = ['success', 'paid', 'completed'].includes(status);

            return isSuccess;
          })
          .reduce((sum, item) => sum + (item.amountPaid || item.amount || 0), 0);


        setTotalRevenue(revenue);

        // COMPUTE CLIENT-SIDE STATS (backend returns 0s)
        const clientStats = computeClientStats(res);

        setStats(clientStats);
      } catch (error) {

        toast.error(error.response?.message || "Failed to fetch payments");
      } finally {
        setLoading(prev => ({ ...prev, data: false }));
      }
    };

const fetchPaymentStats = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true }));
        const res = await paymentService.getPaymentStats();



        // Don't setStats(res) - using client-side instead
      } catch (error) {

        toast.error(error.response?.message || "Failed to fetch payment stats");
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    const fetchPaymentInfo = async () => {
      try {
        setLoading(prev => ({ ...prev, info: true }));
        const res = await paymentService.getPaymentInfo();
        setInfo(res);
      } catch (error) {
        toast.error(error.response?.message || "Failed to fetch payment info");
      } finally {
        setLoading(prev => ({ ...prev, info: false }));
      }
    };

    fetchPayments();
    fetchPaymentStats();
    fetchPaymentInfo();
  };

  useEffect(() => {
    fetchData();

        const handlePaymentUpdate = () => {
      fetchData();
    };

    subscribe("payment-updated", handlePaymentUpdate);
    subscribe("payment-created", handlePaymentUpdate);
    subscribe("payment-deleted", handlePaymentUpdate);

    return () => {
      unsubscribe("payment-updated");
      unsubscribe("payment-created");
      unsubscribe("payment-deleted");
    };
  }, [subscribe, unsubscribe]);



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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const { customerName } = row.original

      const search = filterValue.toLowerCase()
      return (
        customerName.toLowerCase().includes(search)
      )
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })


  return (
    <DashboardLayout type={vendor.vendorType} section="Payments & Earnings">
      <div className='md:p-6 mb-14 space-y-4 md:space-y-6 py-2'>
        <div className='flex justify-between py-1 px-2 items-center'>
          <h2 className='text-[#111827] text-lg md:text-base font-semibold'>Payments & Earnings</h2>
          <button className='md:hidden p-2'>
            <EllipsisVertical />
          </button>
          <div className='md:flex hidden gap-6'>
            <DashboardButton onClick={() => setHideTab(!hideTab)} variant="secondary" text={hideTab ? "View Tabs" : "Hide tabs"} icon={hideTab ? <Eye /> : <EyeClose />} />
            <DashboardButton variant="secondary" text="Export" icon={<Export />} />
          </div>
        </div>
        <div className='flex px-2 md:hidden'>
          {["Overview", "Transaction History"].map((item) => (
            <button onClick={() => setActiveTab(item)} className={`p-2 text-xs rounded-md border ${activeTab === item ? "border-[#B3D1D2] bg-[#E7F0F0] text-[#111827]" : "border-transparent text-[#606368]"}`}>
              {item}
            </button>
          ))}
        </div>
        {activeTab === "Overview" && (
          <>
            {!hideTab && !loading.stats &&
              <div className='px-2'>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 py-4 md:py-6 border w-full bg-white rounded-2xl md:divide-x divide-y md:divide-y-0 [&>div]:pb-0 md:[&>div]:px-2'>
                  <div className='flex h-full items-center'>
                    <StatCard title="Total Revenue" className="py-0" value={`₦${totalRevenue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`} change={0} icon={<Cash2 />} color="indigo" />
                  </div>
                  <div className='flex h-full items-center'>
                    <StatCard title="Total Earnings" className="py-0" value={`₦${stats.earnings.thisYear.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`} change={stats.earnings.yearChange} icon={<Calendar />} color="blue" />
                  </div>
                  <div className='flex h-full items-center'>
                    <StatCard title="Earnings this Week" className="py-0" value={`₦${stats.earnings.thisWeek.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`} change={stats.earnings.weekChange} icon={<CardPay />} color="green" />
                  </div>
                  <div className='flex h-full items-center'>
                    <StatCard title="Completed Payments" className="py-0" value={`₦${stats.payments.completed.thisWeek.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`} change={stats.payments.completed.change} icon={<Cash2 className="text-[#CD16C3]" />} color="purple" />
                  </div>
                  <div className='flex h-full items-center'>
                    <StatCard title="Pending Payments" className="py-0" value={`₦${stats.payments.pending.thisWeek.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`} change={stats.payments.pending.change} icon={<Cash2 className="text-[#E1B505]" />} color="orange" />
                  </div>
                </div>
              </div>
            }
            <FinancialDashboard info={info} />
          </>
        )}
        <div className='hidden md:block px-2'>
          <div className="w-full border bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="flex md:items-center flex-col-reverse md:flex-row gap-4 justify-between p-4">
              <h2 className='flex flex-1 items-center'>
                Transaction History
              </h2>
              <div className='flex items-center justify-between gap-4'>
                <div className='relative items-center flex flex-1'>
                  <Search className='absolute left-2 text-[#606368] size-5' />
                  <Input
                    placeholder="Search transactions"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm pl-10 border-[#DAE9E9] "
                  />
                </div>
                <div className='md:flex gap-2 hidden'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
                        Date <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuRadioGroup
                        value={dateFilter}
                        onValueChange={(value) => {
                          setDateFilter(value)
                          table.setColumnFilters((old) => [
                            ...old.filter(f => f.id !== 'date'),
                            { id: 'date', value }
                          ])
                        }}
                      >
                        <DropdownMenuRadioItem value="">All Dates</DropdownMenuRadioItem>
                        {uniqueDates.map((date) => (
                          <DropdownMenuRadioItem key={date} value={date}>
                            {date}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
                        Status <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuRadioGroup
                        value={statusFilter} // React state for selected status
                        onValueChange={(value) => {
                          setStatusFilter(value)
                          table.setColumnFilters((old) => [
                            ...old.filter(f => f.id !== 'payment_status'),
                            { id: 'payment_status', value }
                          ])
                        }}
                      >
                        <DropdownMenuRadioItem value="">
                          All Statuses
                        </DropdownMenuRadioItem>
                        {uniqueStatuses.map((status) => (
                          <DropdownMenuRadioItem key={status} value={status}>
                            {status}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>

                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
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
                          )
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className='md:hidden'>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Filter2 fill="black" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto hidden md:block border-t">
              <Table className="min-w-[720px]">
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
                        )
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
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        {activeTab === "Transaction History" && (
          <div className='space-y-3 md:hidden w-full px-2'>
            {data.length > 0 ? data.map((item, i) => (
              <div key={i} className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
                <div className='flex items-start gap-3'>
                  <Avatar className="border border-[#60A5FA]">
                    <AvatarFallback>{item.customerName.split(" ").map((j) => j.slice(0, 1).toUpperCase()).join('')}</AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold text-[#111827] truncate'>{item.customerName}</p>
                    <p className='text-xs text-[#606368] truncate'>ID: #{item._id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedPayment(item);
                        setIsDetailsOpen(true);
                      }}>
                        <Eye2 className="mr-2 h-3 w-3" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        toast.success(`Printing receipt #${item._id.slice(0,8)}`);
                      }}>
                        <Printer className="mr-2 h-3 w-3" />
                        Print Receipt
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <div className='space-y-1'>
                    <p className='text-[11px] uppercase tracking-[0.18em] text-[#606368]'>Amount</p>
                    <p className='text-sm font-semibold'>₦{item.amountPaid?.toLocaleString()}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[11px] uppercase tracking-[0.18em] text-[#606368]'>Method</p>
                    <p className='text-sm capitalize'>{item.paymentMethod?.split("_").join(" ") || 'N/A'}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[11px] uppercase tracking-[0.18em] text-[#606368]'>Date</p>
                    <p className='text-sm'>{formatDate(item.createdAt)}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[11px] uppercase tracking-[0.18em] text-[#606368]'>Status</p>
                    <span className='inline-flex rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-medium text-[#111827] capitalize'>{getPaymentStatus(item)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className='py-8 text-center text-sm text-[#606368]'>No transactions found.</div>
            )}
          </div>
        )}

        {/* Payment Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Transaction #{selectedPayment?._id?.slice(0,8) || 'N/A'}
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer</label>
                    <p className="text-lg font-semibold">{selectedPayment.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <p className="text-lg font-semibold">₦{selectedPayment.amountPaid?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Method</label>
                    <p>{selectedPayment.paymentMethod?.split('_').join(' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatus(selectedPayment) === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {getPaymentStatus(selectedPayment)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p>{formatDate(selectedPayment.createdAt)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                    <p className="font-mono text-sm break-all">{selectedPayment._id}</p>
                  </div>
                </div>
                <DialogFooter className="print:hidden">
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedPayment, null, 2));
                    toast.success('Copied to clipboard');
                  }}>
                    Copy Details
                  </Button>
                  <Button onClick={() => handlePrintReceipt(selectedPayment)}>
                    🖨️ Print Receipt
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default PaymentDashboard
