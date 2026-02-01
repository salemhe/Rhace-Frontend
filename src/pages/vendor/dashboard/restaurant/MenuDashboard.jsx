import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import DashboardButton from '@/components/dashboard/ui/DashboardButton'
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
import { menuService } from '@/services/menu.service';
import { toast } from 'react-toastify';
import { Switch } from '@/components/ui/switch';
import { useSelector } from 'react-redux';
import UniversalLoader from '@/components/user/ui/LogoLoader';

const categories = [
  "All Menu",
  "All Menu Items"
]

const MenuDashboard = () => {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [activeCategory, setActiveCategory] = useState("All Menu")
  const [menus, setMenus] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const vendor = useSelector(state => state.auth.vendor)
  const [showPopup, setShowPopup] = useState({
    display: false,
    details: {},
    item: false
  })





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
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const m = row.original
        return (
          <div className='rounded-full overflow-hidden relative size-9'>
            <img src={m.coverImage} alt={m.name} className='size-full object-cover' />
          </div>
        )
      }
    },
    {
      accessorKey: "menu_name",
      header: "Menu Name",
      cell: ({ row }) => {
        const m = row.original
        return (
          <span className='text-[#111827] font-medium text-sm'>{m.name}</span>
        )
      }
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className='text-[#111827] font-medium text-sm'>₦{row.getValue("price")}</span>
      )
    },
    {
      accessorKey: "meal_type",
      header: "Meal Type",
      cell: ({ row }) => {
        const m = row.original
        return (
          <div>{m.menuType.join(", ")}</div>
        )
      },
    },
    {
      accessorKey: "meal_times",
      header: "Meal Times",
      cell: ({ row }) => {
        const m = row.original
        return (
          <div>{m.mealTimes.join(", ")}</div>
        )
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <span className='text-[#111827] font-medium text-sm'>{row.getValue("items").length}</span>
      )
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        return (
          <div className='flex gap-1'>
            {row.getValue("tags").slice(0, 3).map((tag, i) => (
              <div key={i} className='text-xs bg-[#E6F2F2] text-[#0A6C6D] px-2 py-1 rounded-full'>{tag}</div>
            ))}
          </div>
        )
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const rowId = row.original._id; // or whatever uniquely identifies the row

        const handleToggle = (checked) => {
          setMenus(prev =>
            prev.map(item =>
              item._id === rowId
                ? { ...item, status: checked ? "active" : "inactive" }
                : item
            )
          );
        };

        return (
          <div className="flex gap-1">
            <Switch
              checked={row.getValue("status") === "active"}
              onCheckedChange={handleToggle}
              aria-label="Toggle status"
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: () => {
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
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const m = row.original
        return (
          <div className='rounded-full overflow-hidden relative size-9'>
            <img src={m.coverImage} alt={m.name} className='size-full object-cover' />
          </div>
        )
      }
    },
    {
      accessorKey: "menu_name",
      header: "Menu Name",
      cell: ({ row }) => {
        const m = row.original
        return (
          <span className='text-[#111827] font-medium text-sm'>{m.name}</span>
        )
      }
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className='text-[#111827] font-medium text-sm'>₦{row.getValue("price")}</span>
      )
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className='text-[#111827] font-medium text-sm'>{row.getValue("category")}</span>
      )
    },
    {
      accessorKey: "menu_assigned",
      header: "Menu Assigned",
      cell: ({ row }) => {
        const m = row.original
        const menuAssigned = menus
          .filter(i => m.assignedMenus && m.assignedMenus.includes(i._id))
          .map(i => i.name);
        return (
          <div>{menuAssigned.join(", ")}</div>
        )
      },
    },
    {
      accessorKey: "meal_times",
      header: "Meal Times",
      cell: ({ row }) => {
        const m = row.original
        return (
          <div>{m.mealTimes.join(", ")}</div>
        )
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        return (
          <div className='flex gap-1 items-center'>
            <div className='flex gap-2'>
              {row.getValue("tags").slice(0, 3).map((tag, i) => (
                <div key={i} className='text-xs bg-[#F4F4F4] text-[#606368] border border-[#E5E7EB] p-2 rounded-md'>{tag}</div>
              ))}
            </div>
            {row.getValue("tags").length > 3 && (
              <span>
                +{row.getValue("tags").length - 3} more
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const rowId = row.original._id; // or whatever uniquely identifies the row

        const handleToggle = (checked) => {
          setMenuItems(prev =>
            prev.map(item =>
              item._id === rowId
                ? { ...item, status: checked ? "active" : "inactive" }
                : item
            )
          );
        };

        return (
          <div className="flex gap-1">
            <Switch
              checked={row.getValue("status") === "active"}
              onCheckedChange={handleToggle}
              aria-label="Toggle status"
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: () => {
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

  const data = activeCategory === "All Menu Items" ? menuItems : menus
  const columns = activeCategory === "All Menu Items" ? menuItemColumns : menuColumns


  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await menuService.deleteMenu(id, type);
      alert("Item deleted successfully!");
      setShowPopup({ display: false, details: {} });
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete item.");
    }
  };


  useEffect(() => {
    async function fetchMenus() {
      try {
        setIsLoading(true)
        const items = await menuService.getMenus(vendor._id);
        setMenus(items.menus)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch menus")
      } finally {
        setIsLoading(false)
      }
    }
    async function fetchMenuItems() {
      try {
        setIsLoading(true)
        const items = await menuService.getMenuItems(vendor._id)
        setMenuItems(items.menuItems)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch menu items")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMenus()
    fetchMenuItems()
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) return <UniversalLoader fullscreen />


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
                      value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                      onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
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
                        <ListCheck3 className="group-data-[state=active]:text-[#111827] text-[#606368] size-4" />
                      </TabsTrigger>
                      <TabsTrigger value="grid" className="group">
                        <LayoutGrid className="group-data-[state=active]:text-[#111827] text-[#606368] size-4" />
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
                  {data && data.map((item, i) => (
                    <div key={i} className='p-1 bg-white border rounded-xl h-full'>
                      <div className='relative rounded-xl h-[178px] overflow-hidden'>
                        <img src={item.coverImage} alt={item.name || "N/A"} className='size-full object-cover hover:scale-105 transition-transform duration-200' />
                      </div>
                      <div className='p-2'>
                        {activeCategory === "All Menu Items" ? (
                          <div className='space-y-2'>
                            <div className='flex justify-between w-full'>
                              <span>{item.name}</span>
                              <button onClick={() => setShowPopup({
                                details: item,
                                display: true,
                                item: true
                              })} className='text-xs underline text-[#0A6C6D]'>View Menu</button>
                            </div>
                            <div className='text-sm'>
                              {item.description}
                            </div>
                          </div>
                        ) : (
                          <div className='space-y-2'>
                            <div className='flex justify-between w-full'>
                              <span>{item.name}</span>
                              <button onClick={() => setShowPopup({
                                details: item,
                                display: true,
                              })} className='text-xs underline text-[#0A6C6D]'>View Menu</button>
                            </div>
                            <div className='text-sm'>
                              <span>Menu Item:</span>{" "} {item.menuType.join(", ")}
                            </div>
                            <div className='flex items-center justify-between w-full'>
                              <span>{item.items.length} {item.items.length > 0 ? "items" : "item"}</span>
                              <span>Updated {item.date} ago</span>
                            </div>
                          </div>
                        )}
                        <div className='flex w-full justify-between'>
                          <span>₦{item.price.toLocaleString()}</span>
                          <button onClick={() => setShowPopup({
                            details: item,
                            display: true,
                          })} className='flex gap-2 items-center text-[#0A6C6D]'><ArrowsRight /> view details</button>
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
      {showPopup.display && (
        <div className='inset-0 fixed top-0 left-0 w-full h-screen overflow-y-auto bg-black/80'>
          <div className="bg-gray-50 px-4 max-w-4xl mx-auto rounded-lg my-10 py-6 md:px-6 md:py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold text-[#111827] py-4 px-5">
                  Menu Details
                </h2>

                <hr className="border-gray-200 mb-4" />
                <div className="p-5">
                  {showPopup.details.coverImage && (
                    <div className="mb-4">
                      <img
                        src={showPopup.details.coverImage}
                        alt={showPopup.details.name}
                        className="rounded-xl w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <ul className="divide-y divide-gray-100">
                      <li className="flex justify-between py-2">
                        <span className="text-gray-700 font-medium">Name</span>
                        <span className="text-gray-900 font-semibold">
                          {showPopup.details.name}
                        </span>
                      </li>
                      <li className="flex justify-between py-2">
                        <span className="text-gray-700 font-medium">Price</span>
                        <span className="text-gray-900 font-semibold">
                          ₦{showPopup.details.price?.toLocaleString()}
                        </span>
                      </li>
                      {showPopup.details.description && (
                        <li className="py-2">
                          <span className="text-gray-700 font-medium block">Description</span>
                          <p className="text-gray-600 mt-1">{showPopup.details.description}</p>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    {showPopup.details.category && (
                      <p>
                        <span className="font-medium">Category:</span> {showPopup.details.category}
                      </p>
                    )}
                    {showPopup.details.menuType && (
                      <p>
                        <span className="font-medium">Menu Type:</span>{" "}
                        {Array.isArray(showPopup.details.menuType)
                          ? showPopup.details.menuType.join(", ")
                          : showPopup.details.menuType}
                      </p>
                    )}
                    {showPopup.details.mealTimes && (
                      <p>
                        <span className="font-medium">Meal Times:</span>{" "}
                        {showPopup.details.mealTimes.join(", ")}
                      </p>
                    )}
                    {showPopup.details.tags?.length > 0 && (
                      <p>
                        <span className="font-medium">Tags:</span> {showPopup.details.tags.join(", ")}
                      </p>
                    )}
                    {showPopup.details.status && (
                      <p>
                        <span className="font-medium">Status:</span> {showPopup.details.status}
                      </p>
                    )}
                    {showPopup.details.published !== undefined && (
                      <p>
                        <span className="font-medium">Published:</span>{" "}
                        {showPopup.details.published ? "Yes" : "No"}
                      </p>
                    )}
                    {showPopup.details.addOns !== undefined && (
                      <p>
                        <span className="font-medium">Add-ons:</span>{" "}
                        {showPopup.details.addOns ? "Available" : "Not available"}
                      </p>
                    )}
                    {showPopup.details.availability !== undefined && (
                      <p>
                        <span className="font-medium">Availability:</span>{" "}
                        {showPopup.details.availability ? "Available" : "Unavailable"}
                      </p>
                    )}
                    {showPopup.details.discount && (
                      <p>
                        <span className="font-medium">Discount Price:</span> ₦
                        {showPopup.details.discountPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row w-full gap-3 mt-5">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(showPopup.details._id, showPopup.item ? "item" : "menu")}
                      className="flex-1 h-10 text-sm rounded-xl font-medium px-6 bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPopup({ display: false, details: {} })
                      }}
                      className="flex-1 h-10 text-sm rounded-xl font-medium px-6 border-gray-300"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}

export default MenuDashboard