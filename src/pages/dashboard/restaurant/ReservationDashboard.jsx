import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useState, useRef, useEffect } from 'react'
import DashboardButton from '../../../components/dashboard/ui/DashboardButton'
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';

const data = [
  {
    customer_name: {
      customer_Id: "1829622",
      customer_name: "Wisdom ofogba",
      // customer_image: "/jjss.png"
    },
    guests: 4,
    date_n_time: {

      date: "June 5, 2025",
      time: "11:00am",
    },
    meal_preselected: "Yes",
    payment_status: "Paid",
    reservation_status: "Upcoming",
  },
]

const categories = [
  "All",
  "Upcoming",
  "Completed",
  "Canceled",
  "No Shows",
]

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
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className='rounded-full overflow-hidden relative size-9'>
          <img src={row.getValue("customer_name").customer_image} alt={row.getValue("customer_name").customer_name} className='size-full object-cover' />
        </div>
        <div className='flex flex-col'>
          <span className='text-[#111827] font-medium text-sm'>{row.getValue("customer_name").customer_name}</span>
          <span className='text-[#606368] text-xs capitalize'>ID #{row.getValue("customer_name").customer_Id}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date_n_time",
    header: "Date & Time",
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='text-[#111827] font-medium text-sm'>{row.getValue("date_n_time").date}</span>
        <span className='text-[#606368] text-xs capitalize'>Time {row.getValue("date_n_time").time}</span>
      </div>
    ),
  },
  {
    accessorKey: "guests",
    header: () => {
      return (
        <div
        >
          No of Guests
        </div>
      )
    },
    cell: ({ row }) => <div>{row.getValue("guests")}</div>,
  },
  {
    accessorKey: "meal_preselected",
    header: () => {
      return (
        <div
        >
          Meal Preselected
        </div>
      )
    },
    cell: ({ row }) => <div className={`${row.getValue("meal_preselected") === "Yes" ? "bg-[#D1FAE5] text-[#37703F]" : "text-[#EF4444] bg-[#FCE6E6]"} flex py-1.5 px-3 rounded-full`}>
      {row.getValue("meal_preselected") === "Yes" ? <Check className='text-[#37703F] size-5' /> : <XIcon className='text-[#EF4444] size-5' />}{row.getValue("meal_preselected")}</div>,
  },
  {
    accessorKey: "payment_status",
    header: () => {
      return (
        <div
        >
          Payment Status
        </div>
      )
    },
    cell: ({ row }) => <div className={`${row.getValue("payment_status") === "Paid" ? "bg-[#D1FAE5] text-[#37703F]" : "text-[#EF4444] bg-[#FCE6E6]"} flex py-1.5 px-3 rounded-full`}>
      {row.getValue("payment_status")}</div>,
  },
  {
    accessorKey: "reservation_status",
    header: () => {
      return (
        <div
        >
          Reservation Status
        </div>
      )
    },
    cell: ({ row }) => <div className={`${row.getValue("reservation_status") === "Paid" ? "bg-[#D1FAE5] text-[#37703F]" : "text-[#EF4444] bg-[#FCE6E6]"} flex py-1.5 px-3 rounded-full`}>
      {row.getValue("reservation_status")}</div>,
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


const ReservationDashboard = () => {
  const [hideTab, setHideTab] = useState(false);
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [activeCategory, setActiveCategory] = useState("All")
  const navigate = useNavigate()
  const vendor = useSelector((state) => state.auth.vendor);
  // const socketRef = useRef(null);


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
  })

  const socketRef = useRef(null);

  useEffect(() => {
    const vendorId = vendor._id; // Replace with real vendor ID
    const socket = new WebSocket(`ws://localhost:5000?type=vendor&id=${vendorId}`);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📩 Message from server:', message);

        if (message.type === 'new_reservation') {
          // Show toast, update state, or refetch data here
          alert(`New reservation from ${message.data.customerName}`);
        }
      } catch (error) {
        console.error('❌ Failed to parse message:', error);
      }
    };

    socket.onerror = (err) => {
      console.error('⚠️ WebSocket error:', err);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await userService.fetchReservations({ vendorId: vendor._id })
        console.log(res)
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message)
      }
    }
    fetchReservations()
  })



  return (
    <DashboardLayout type="restaurant" section="Reservations">
      <div className='md:p-6 md:mb-12 space-y-6'>
        <div className='md:flex hidden justify-between items-center'>
          <h2 className='text-[#111827] font-semibold'>Reservation List</h2>
          <div className='flex gap-6'>
            <DashboardButton onClick={() => setHideTab(!hideTab)} variant="secondary" text={hideTab ? "Open tabs" : "Hide tabs"} icon={hideTab ? <Eye /> : <EyeClose />} />
            <DashboardButton variant="secondary" text="Export" icon={<Export />} />
            <DashboardButton onClick={() => navigate("/dashboard/restaurant/reservation/new")} variant="primary" text="New Reservation" icon={<Add fill="#fff" />} />
          </div>
        </div>
        {!hideTab &&
          <div className='hidden md:grid grid-cols-4 border rounded-2xl'>
            <div className='flex h-full items-center'>
              <StatCard title="Reservations made today" value={32} change={12} icon={<Calendar />} color="blue" />
              <div className='h-3/5 w-[1px] bg-[#E5E7EB]' />
            </div>
            <div className='flex h-full items-center'>
              <StatCard title="Prepaid Reservations" value={16} change={8} icon={<CardPay />} color="green" />
              <div className='h-3/5 w-[1px] bg-[#E5E7EB]' />
            </div>
            <div className='flex h-full items-center'>
              <StatCard title="Expected Guests Today" value={80} change={8} icon={<Group3 />} color="purple" />
              <div className='h-3/5 w-[1px] bg-[#E5E7EB]' />
            </div>
            {/* <div className='flex h-full items-center w-full'> */}
            <StatCard title="Pending Payments" value={(2456).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} change={-5} icon={<Cash2 fill="#E1B505" />} color="orange" />
            {/* </div> */}
          </div>
        }
        <div>
          <div className="w-full">
            <div className="flex md:items-center flex-col-reverse md:flex-row gap-4 justify-between py-4">
              <div className='flex flex-1 items-center'>
                {categories.map((category, i) => (
                  <div onClick={() => setActiveCategory(category)} className={`p-2 text-xs md:text-sm rounded-lg border font-medium cursor-pointer ${category === activeCategory ? "border-[#B3D1D2] bg-[#E7F0F0] text-[#111827] " : "border-transparent text-[#606368]"}`} key={i}>
                    {category}
                  </div>
                ))}
              </div>
              <div className='flex items-center justify-between gap-4'>
                <div className='relative items-center flex flex-1'>
                  <Search className='absolute left-2 text-[#606368] size-5' />
                  <Input
                    placeholder="Search by guest name or ID"
                    value={(table.getColumn("customer_name")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                      table.getColumn("customer_name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm pl-10 bg-[#F9FAFB] border-[#DAE9E9] "
                  />
                </div>
                <div className='md:flex gap-2 hidden'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
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
                          )
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto text-[#606368]">
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
                          )
                        })}
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
      <div className='absolute hidden md:flex bottom-0 border-t border-[#E5E7EB] left-0 right-0 bg-white'>
        <div className="flex items-center w-full px-8 justify-between space-x-2 py-4">
          <div className="text-muted-foreground text-sm">
            Page {" "}
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length}
          </div>
          <div className='flex'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    11
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">12</PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="gap-2 flex">
            <DashboardButton
              variant="secondary"
              icon={<ChevronLeft className='size-5' />}
              // size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="shadow-md" />
            <DashboardButton
              variant="secondary"
              icon={<ChevronRight className='size-5' />}
              // size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="shadow-md" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ReservationDashboard