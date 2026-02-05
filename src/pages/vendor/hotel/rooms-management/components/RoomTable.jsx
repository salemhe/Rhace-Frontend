import { Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trimLongString } from "@/utils/helper";

const RoomTable = ({
  rooms,
  onEdit,
  onDelete,
  onViewDetails,
  onViewImages,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const getStatusColor = (isAvailable, maintenanceStatus) => {
    if (maintenanceStatus === "maintenance") {
      return "bg-yellow-100 text-yellow-800";
    }
    return isAvailable
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusText = (isAvailable, maintenanceStatus) => {
    if (maintenanceStatus === "maintenance") {
      return "Maintenance";
    }
    return isAvailable ? "Available" : "Occupied";
  };

  // Define columns for tanstack/react-table
  const columns = [
    {
      accessorKey: "name",
      header: "Room",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "pricePerNight",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          ₦{row.getValue("pricePerNight")?.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="text-gray-500">
            {room.adultsCapacity + room.childrenCapacity} guests
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const room = row.original;
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              room.isAvailable,
              room.maintenanceStatus,
            )}`}
          >
            {getStatusText(room.isAvailable, room.maintenanceStatus)}
          </span>
        );
      },
    },
    {
      accessorKey: "amenities",
      header: "Amenities",
      cell: ({ row }) => {
        const amenities = row.getValue("amenities") || [];
        return (
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 2).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#f4f4f4] border border-[#E5E7EB] text-[#606368] text-xs rounded-[8px]"
              >
                {trimLongString(amenity, 8)}
              </span>
            ))}
            {amenities.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                +{amenities.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => {
        const room = row.original;
        const images = room.images || [];
        return images.length > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewImages(room)}
            className="flex items-center text-gray-600 hover:text-gray-700 p-0"
          >
            <Eye size={18} className="mr-1" />
            {images.length}
          </Button>
        ) : (
          <span className="text-gray-400">No Images</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onViewDetails(room)}>
                  <Eye size={16} className="mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(room)}>
                  <Edit size={16} className="mr-2" />
                  Edit Room
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(room._id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Room
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: rooms,
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto overflow-y-visible">
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader className="bg-[#E6F2F2]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
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
                    No rooms found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view (optional) - if you want to keep responsive design */}
        <div className="md:hidden">
          {rooms.map((room) => (
            <div key={room._id} className="border-b p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{room.name}</div>
                  <div className="text-sm text-gray-500">
                    ₦{room.pricePerNight.toLocaleString()} •{" "}
                    {room.adultsCapacity + room.childrenCapacity} guests
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    room.isAvailable,
                    room.maintenanceStatus,
                  )}`}
                >
                  {getStatusText(room.isAvailable, room.maintenanceStatus)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomTable;
