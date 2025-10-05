import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useState } from 'react'
import DashboardButton from '../../../components/dashboard/ui/DashboardButton'
import { Add, ArrowsRight, Calendar, CardPay, Cash2, CheckCircle, Copy, Export, Eye, Eye2, EyeClose, Filter2, Group3, LayoutGrid, ListCheck3, Pencil, Phone, Printer, XCircle } from '@/components/dashboard/ui/svg';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const menuData = [
  {
    customer_name: {
      customer_Id: "1829622",
      customer_name: "Wisdom ofogba",
      // customer_image: "/jjss.png"
    },
    guests: 5,
    date_n_time: {

      date: "June 5, 2025",
      time: "11:00am",
    },
    meal_preselected: "Yes",
    payment_status: "Paid",
    reservation_status: "Upcoming",
    price: 35000,
    type: ["A la carte", "Brunch"],
  }
]

const menuItemData = [
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
    price: 35000,
  }
]

const categories = [
  "All Menu",
  "All Menu Items"
]

const menuColumns = [
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

const menuItemColumns = [
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


const MenuDashboard = () => {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [activeCategory, setActiveCategory] = useState("All Menu")
  const navigate = useNavigate()

  const data = activeCategory === "All Menu Items" ? menuItemData : menuData
  const columns = activeCategory === "All Menu Items" ? menuItemColumns : menuColumns

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


  return (
    <DashboardLayout type="restaurant" section="Reservations">
      <div className='md:p-6 md:mb-12 space-y-6'>
        <div className='md:flex hidden justify-between items-center'>
          <h2 className='text-[#111827] font-semibold'>Menu Management</h2>
          <div className='flex gap-6'>
            <DashboardButton variant="secondary" text="Export" icon={<Export />} />
            <DashboardButton onClick={() => navigate("/dashboard/restaurant/menu/item/new")} variant="secondary" text="Add Menu Item" icon={<Add fill="#000" />} />
            <DashboardButton onClick={() => navigate("/dashboard/restaurant/menu/new")} variant="primary" text="Add Menu" icon={<Add fill="#fff" />} />
          </div>
        </div>
        <div>
          <div className="w-full">
            <Tabs defaultValue="grid">

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
                      className="max-w-sm pl-10 border-[#DAE9E9] "
                    />
                  </div>
                  <div className='md:flex gap-2 h-full hidden'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto text-[#606368]">
                          All Category <ChevronDown />
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
                    <div className='my-1 w-0.5 bg-[#E5E7EB]' />
                    <TabsList className="bg-[#E5E7EB]">
                      <TabsTrigger value="list" className="group">
                        <ListCheck3 className="group-data-[state=active]:text-[#111827] text-[#606368] size-5" />
                      </TabsTrigger>
                      <TabsTrigger value="grid" className="group">
                        <LayoutGrid className="group-data-[state=active]:text-[#111827] text-[#606368] size-5" />
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className='md:hidden'>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Filter2 fill="black" />
                    </Button>
                  </div>
                </div>
              </div>
              <TabsContent value="list">
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
              </TabsContent>
              <TabsContent value="grid">
                <div className='grid md:grid-cols-3 gap-6 lg:grid-cols-4'>
                  {data.map((item, i) => (
                    <div key={i} className='p-1 bg-white border rounded-xl h-full'>
                      <div className='relative rounded-xl h-[178px] overflow-hidden'>
                        <img src={item.image} alt={item.title || "N/A"} className='size-full object-cover' />
                      </div>
                      <div className='p-2'>
                        {activeCategory === "All Menu Items" ? (
                          <div className='space-y-2'>
                            <div className='flex justify-between w-full'>
                              <span>{item.title}</span>
                              <a className='text-xs underline text-[#0A6C6D]' href={`/dashboard/restaurant/menu/${item.id}`}>View Menu</a>
                            </div>
                            <div className='text-sm'>
                              {item.detail}
                            </div>
                          </div>
                        ) : (
                          <div className='space-y-2'>
                            <div className='flex justify-between w-full'>
                              <span>{item.title}</span>
                              <a className='text-xs underline text-[#0A6C6D]' href={`/dashboard/restaurant/menu/${item.id}`}>View Menu</a>
                            </div>
                            <div className='text-sm'>
                              <span>Menu Item:</span>{" "} {item.type.join(", ")}
                            </div>
                            <div className='flex items-center justify-between w-full'>
                              <span>{item.noOfItems} {item.noOfItems > 0 ? "items" : "item"}</span>
                              <span>Updated {item.date} ago</span>
                            </div>
                          </div>
                        )}
                        <div className='flex w-full justify-between'>
                          <span>#{item.price.toLocaleString()}</span>
                          <a href={`/dashboard/restaurant/menu/${item.id}`} className='flex gap-2 items-center text-[#0A6C6D]'><ArrowsRight /> view details</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
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

export default MenuDashboard