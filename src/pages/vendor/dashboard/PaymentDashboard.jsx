import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import { Add, Calendar, CardPay, Cash2, CheckCircle, Copy, Export, Eye, Eye2, EyeClose, Filter2, Group3, Pencil, Phone, Printer, XCircle } from '@/components/dashboard/ui/svg';
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
import { ArrowUpDown, Check, ChevronDown, ChevronLeft, ChevronRight, EllipsisVertical, MoreHorizontal, MoreVertical, Search, XIcon } from "lucide-react"

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
import { paymentService } from '@/services/payment.service';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { formatDate } from '@/utils/formatDate';

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
  })

  const uniqueStatuses = Array.from(new Set(data.map(row => row.payment_status))).sort()
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
            {user.paymentMethod.split("_").join(" ").toUpperCase()}
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
      cell: ({ row }) => <div className={`${row.getValue("status") === "Paid" ? "bg-[#D1FAE5] border-[#B8FFC2] text-[#37703F]" : "text-[#EF4444] border-[#FAE48A] bg-[#FCE6E6]"} flex border py-1.5 px-3 items-center gap-2 rounded-full w-fit`}>
        <div className={`${row.getValue("status") === "Paid" ? "bg-[#37703F]" : "bg-[#EF4444]"} size-2 rounded-full bg-[#37703F]`} />
        {row.getValue("status")}</div>
    },
    {
      id: "actions",
      enableHiding: false,
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Eye2 /> View Details</DropdownMenuItem>
              <DropdownMenuItem><Printer /> Print Receipt</DropdownMenuItem>
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
      } catch (error) {
        console.error(error);
        toast.error(error.response?.message || "Failed to fetch payments");
      } finally {
        setLoading(prev => ({ ...prev, data: false }));
      }
    };

    const fetchPaymentStats = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true }));
        const res = await paymentService.getPaymentStats();
        setStats(res);
      } catch (error) {
        console.error(error);
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
        console.error(error);
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
                <div className='grid md:grid-cols-2 md:py-4 divide-y md:divide-x md:divide-y-0 border w-full bg-white rounded-2xl'>
                  <div className='grid grid-cols-2 divide-x py-4 md:py-0'>
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
                  </div>
                  <div className='grid grid-cols-2 divide-x py-4 md:py-0'>
                    <div className='flex h-full items-center'>
                      <StatCard title="Completed Payments" className="py-0" value={`₦${stats.payments.completed.thisWeek.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`} change={stats.payments.completed.change} icon={<Cash2 className="text-[#CD16C3]" />} color="purple" />
                    </div>
                    <div className='flex w-full'>
                      <StatCard title="Pending Payments" className="py-0" value={`₦${stats.payments.pending.thisWeek.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`} change={stats.payments.pending.change} icon={<Cash2 className="text-[#E1B505]" />} color="orange" />
                    </div>
                  </div>
                </div>
              </div>
            }
            <FinancialDashboard info={info} />
          </>
        )}
        <div className='hidden md:block px-2'>
          <div className="w-full border bg-white rounded-2xl">
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
            <div className="overflow-hidden hidden md:block border-t">
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
          <div className='divide-y md:hidden w-full'>
            {data.length > 0 ? data.map((item, i) => (
              <div key={i} className='py-4 px-2 flex gap-2 justify-between items-center bg-white border'>
                <div className='flex gap-3 justify-between w-full items-center'>
                  <div className='flex gap-2 items-center'>
                    <Avatar className="border border-[#60A5FA]">
                      <AvatarFallback>{item.customerName.split(" ").map((i) => (i.slice(0, 1).toUpperCase()))}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-xs text-[#606368]'>ID: {item._id.slice(0, 8)}</p>
                      <p className='text-[#111827] text-sm'>{item.customerName}</p>
                    </div>
                  </div>
                  <div>
                    <p className='capitalize text-[#606368] text-xs'>{item.paymentMethod.split("_").join(" ")}</p>
                    <p className='text-[#111827] text-sm'>{"\u20A6"}{item.amount.toLocaleString()}</p>
                  </div>
                  <p className='text-[#606368] text-sm'>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className='text-[#111827] text-6'>
                  <EllipsisVertical />
                </button>
              </div>
            )) : (
              <div>

              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PaymentDashboard