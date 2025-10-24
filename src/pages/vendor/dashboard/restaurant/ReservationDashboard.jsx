import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useState, useEffect, useRef } from 'react'
import DashboardButton from '@/components/dashboard/ui/DashboardButton'
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
import { ArrowUpDown, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Mail, MoreHorizontal, MoreVertical, Search, XIcon } from "lucide-react"

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
// import { formatCustomDate } from '@/utils/formatDate';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const categories = [
  "All",
  "Upcoming",
  "Completed",
  "Canceled",
  "No Shows",
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
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState({
    display: false,
    details: {}
  });
  // const socketRef = useRef(null);\


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
              <AvatarFallback>{user.customerName.split(" ").map((i) => (i.slice(0, 1).toUpperCase()))}</AvatarFallback>
            </Avatar>

            <div className='flex flex-col'>
              <span className='text-[#111827] font-medium text-sm'>{row.getValue("customerName")}</span>
              <span className='text-[#606368] text-xs capitalize'>ID #{user._id.slice(0, 8)}</span>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "date_n_time",
      header: "Date & Time",
      cell: ({ row }) => {
        const user = row.original
        const date = new Date(user.date)
        return (
          <div className='flex flex-col'>
            <span className='text-[#111827] font-medium text-sm'>{date.toISOString().split('T')[0]}</span>
            <span className='text-[#606368] text-xs capitalize'>Time {user.time}</span>
          </div>
        )
      },
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
      accessorKey: "mealPreselected",
      header: () => {
        return (
          <div
          >
            Meal Preselected
          </div>
        )
      },
      cell: ({ row }) => <div className={`${row.getValue("mealPreselected") ? "bg-[#D1FAE5] text-[#37703F]" : "text-[#EF4444] bg-[#FCE6E6]"} flex py-1.5 px-3 w-max rounded-full`}>
        {row.getValue("mealPreselected") ? <Check className='text-[#37703F] size-5' /> : <XIcon className='text-[#EF4444] size-5' />}{row.getValue("mealPreselected") ? "Yes" : "No"}</div>,
    },
    {
      accessorKey: "paymentStatus",
      header: () => {
        return (
          <div
          >
            Payment Status
          </div>
        )
      },
      cell: ({ row }) => <div className={` w-max ${row.getValue("paymentStatus") === "success" ? "bg-[#D1FAE5] text-[#37703F]" : "text-[#EF4444] bg-[#FCE6E6]"} flex py-1.5 px-3 rounded-full`}>
        {row.getValue("paymentStatus")}</div>,
    },
    {
      accessorKey: "reservationStatus",
      header: () => {
        return (
          <div
          >
            Reservation Status
          </div>
        )
      },
      cell: ({ row }) => <div className={`w-max ${row.getValue("reservationStatus") === "Paid" ? "bg-[#D1FAE5] text-[#37703F]" : "text-[#EF4444] bg-[#FCE6E6]"} flex py-1.5 px-3 rounded-full`}>
        {row.getValue("reservationStatus")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original

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
              <DropdownMenuItem onClick={() => setShowPopup({
                display: true,
                details: booking
              })}><Eye2 /> View Reservation</DropdownMenuItem>
              <DropdownMenuItem><Pencil /> Edit Reservation</DropdownMenuItem>
              <DropdownMenuItem><Phone /> Contact Customer</DropdownMenuItem>
              <DropdownMenuItem><Printer /> Print Receipt</DropdownMenuItem>
              <DropdownMenuItem><CheckCircle /> Mark as Completed</DropdownMenuItem>
              <DropdownMenuItem><CheckCircle /> Mark as No-Show</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}><Copy /> Dupllicate Reservation</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#EF4444]"><XCircle /> Cancel Reservation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]




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
    const reconnectTimeout = useRef(null);
  
    useEffect(() => {
      if (!vendor?._id) return;
  
      const connect = () => {
        const socket = new WebSocket(`wss://rhace-backend-mkne.onrender.com?type=vendor&id=${vendor._id}`);
        socketRef.current = socket;
  
        socket.onopen = () => {
          console.log('✅ WebSocket connected');
        };
  
        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('📩 Message from server:', message);
  
            if (message.type === 'new_reservation') {
              toast.success(`🆕 New reservation from ${message.data.customerName}`);
              setData((prev) => [...prev, message.data]);
            }
          } catch (error) {
            console.error('❌ Failed to parse message:', error);
          }
        };
  
        socket.onerror = (err) => {
          console.error('⚠️ WebSocket error:', err);
        };
  
        socket.onclose = (e) => {
          console.warn(`🔌 WebSocket closed (code: ${e.code})`);
          socketRef.current = null;
  
          // Try reconnecting after delay
          if (e.code !== 1000) {
            reconnectTimeout.current = setTimeout(() => {
              console.log('🔁 Reconnecting WebSocket...');
              connect();
            }, 3000); // 3 seconds
          }
        };
      };
  
      connect();
  
      return () => {
        if (socketRef.current) {
          socketRef.current.close(1000, 'Component unmounted');
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
        const res = await userService.fetchReservations({ vendorId: vendor._id })
        setData(res.data)
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReservations()
  }, [])


  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <p className='animate-pulse text-lg'>Loading...</p>
      </div>
    )
  }

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
                    value={(table.getColumn("customerName")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                      table.getColumn("customerName")?.setFilterValue(event.target.value)
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
      {showPopup.display && (
        <div className='inset-0 fixed top-0 left-o w-full h-screen overflow-y-auto bg-black/80'>
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
                    <p className="text-sm text-gray-600">{showPopup.details.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                    <p className="font-medium text-gray-900">
                      #{showPopup.details._id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(showPopup.details.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      •{" "}
                      {showPopup.details.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Guests</p>
                    <p className="font-medium text-gray-900">{showPopup.details.guests} Guests</p>
                  </div>
                </div>
              </div>

              {/* Meal Selection */}
              {showPopup.details.menus.length > 0 && (
                <div className="rounded-2xl border border-gray-200 mb-6 bg-white shadow-sm p-5">
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-2">
                      Your Selection ({showPopup.details.menus.length} {showPopup.details.menus.length > 1 ? "items" : "item"})
                    </h2>
                    <ul className="divide-y divide-gray-100">
                      {showPopup.details.menus.map((item, index) => (
                        <li key={index} className="flex justify-between py-2">
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
                      You will receive a confirmation email with your reservation
                      details
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
                    setShowPopup({ display: false, details: {} })
                  }}
                  className="flex-1 h-10 text-sm rounded-xl font-medium px-6 border-gray-300"
                >
                  Close
                </Button>
                <form
                  action={async () => {
                    navigate(`/bookings`);
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
    </DashboardLayout>
  )
}

export default ReservationDashboard