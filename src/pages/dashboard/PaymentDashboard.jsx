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
import { ArrowUpDown, Check, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, MoreVertical, Search, XIcon } from "lucide-react"

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
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';

const PaymentDashboard = () => {
  const [hideTab, setHideTab] = useState(false);
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState(
    []
  )
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
  const [trend, setTrends] = useState({ "trends": [], "totalEarnings": 0, "percentChange": 0 });
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
          <span className='text-[#111827] font-medium text-sm'>{user.date}</span>
        )
      },
      filterFn: (row, columnId, value) => {
        return value === "" || row.getValue(columnId) === value
      },
    },
    {
      accessorKey: "trxn_id",
      header: "Transaction ID",
      cell: ({ row }) => {
        const user = row.original
        return (
          <span className='text-[#111827] font-medium text-sm'>#{user._id.slice(0, 8).toUpperCase()}</span>
        )
      },
    },
    {
      accessorKey: "customer_name",
      header: "Customer Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user.customer_name.split(" ").map((i) => (i.slice(0, 1).toUpperCase()))}</AvatarFallback>
            </Avatar>
            <span className='text-[#111827] font-medium text-sm'>{user.customer_name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => (
        <span className='text-[#111827] font-medium text-sm'>{row.getValue("paymentMethod").split("_").join(" ").toUpperCase()}</span>
      ),
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
      cell: ({ row }) => {
        // const payment = row.original

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
              <DropdownMenuItem><Eye2 /> View Reservation</DropdownMenuItem>
              <DropdownMenuItem><Pencil /> Edit Reservation</DropdownMenuItem>
              <DropdownMenuItem><Phone /> Contact Customer</DropdownMenuItem>
              <DropdownMenuItem><Printer /> Print Receipt</DropdownMenuItem>
              <DropdownMenuItem><CheckCircle /> Mark as Completed</DropdownMenuItem>
              <DropdownMenuItem><CheckCircle /> Mark as No-Show</DropdownMenuItem>
              <DropdownMenuItem><Copy /> Dupllicate Reservation</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#EF4444]"><XCircle /> Cancel Reservation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading({
          data: true
        })
        const res = await paymentService.getPayments();
        setData(res)
      } catch (error) {
        console.error(error)
        toast.error(error.response.message)
      } finally {
        setLoading({
          data: false
        })
      }
    }
    const fetchPaymentStats = async () => {
      try {
        setLoading({
          stats: true
        })
        const res = await paymentService.getPaymentStats();
        setStats(res)
      } catch (error) {
        console.error(error)
        toast.error(error.response.message)
      } finally {
        setLoading({
          stats: false
        })
      }
    }
    const fetchTrends = async () => {
      try {
        setLoading({
          trend: true
        })
        const res = await paymentService.getTrends();
        setTrends(res)
      } catch (error) {
        console.error(error)
        toast.error(error.response.message)
      } finally {
        setLoading({
          trend: false
        })
      }
    }
    const fetchPaymentInfo = async () => {
      try {
        setLoading({
          info: true
        })
        const res = await paymentService.getPaymentInfo();
        setInfo(res)
      } catch (error) {
        console.error(error)
        toast.error(error.response.message)
      } finally {
        setLoading({
          info: false
        })
      }
    }


    fetchPayments()
    fetchPaymentStats()
    fetchTrends()
    fetchPaymentInfo()
  }, [])


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
      const { customer_name } = row.original

      const search = filterValue.toLowerCase()
      return (
        customer_name.toLowerCase().includes(search)
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
    <DashboardLayout type={vendor.vendorType} section="Payments $ Earnings">
      <div className='md:p-6 md:mb-12 space-y-6'>
        <div className='md:flex hidden justify-between items-center'>
          <h2 className='text-[#111827] font-semibold'>Payments & Earnings</h2>
          <div className='flex gap-6'>
            <DashboardButton onClick={() => setHideTab(!hideTab)} variant="secondary" text={hideTab ? "View Tabs" : "Hide tabs"} icon={hideTab ? <Eye /> : <EyeClose />} />
            <DashboardButton variant="secondary" text="Export" icon={<Export />} />
          </div>
        </div>
        {!hideTab && !loading.stats &&
          <div className='hidden md:grid grid-cols-4 border w-full rounded-2xl'>
            <div className='flex h-full items-center'>
              <StatCard title="Total Earnings" value={`#${stats.earnings.thisYear.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`} change={stats.earnings.yearChange} icon={<Calendar />} color="blue" />
              <div className='h-3/5 w-[1px] bg-[#E5E7EB]' />
            </div>
            <div className='flex h-full items-center'>
              <StatCard title="Earnings this Week" value={`#${stats.earnings.thisWeek.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`} change={stats.earnings.weekChange} icon={<CardPay />} color="green" />
              <div className='h-3/5 w-[1px] bg-[#E5E7EB]' />
            </div>
            <div className='flex h-full items-center'>
              <StatCard title="Completed Payments" value={`#${stats.payments.completed.thisWeek.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`} change={stats.payments.completed.change} icon={<Cash2 className="text-[#CD16C3]" />} color="purple" />
              <div className='h-3/5 w-[1px] bg-[#E5E7EB]' />
            </div>
            <div className='flex w-full'>
              <StatCard title="Pending Payments" value={`#${stats.payments.pending.thisWeek.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`} change={stats.payments.pending.change} icon={<Cash2 className="text-[#E1B505]" />} color="orange" />
            </div>
          </div>
        }
        <FinancialDashboard info={info} trend={trend} />
        <div>
          <div className="w-full border rounded-2xl">
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
      </div>
    </DashboardLayout>
  )
}

export default PaymentDashboard