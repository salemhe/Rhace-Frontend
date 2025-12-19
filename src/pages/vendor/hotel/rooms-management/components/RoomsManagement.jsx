import { fetchRoomTypes, selectRoomTypes } from "@/redux/slices/vendorSlice";
import { hotelService } from "@/services/hotel.service";
import { Plus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import DeleteConfirmationModal from "./DeleteRoom";
import ImageGalleryModal from "./ImageGalleryModal";
import RoomCard from "./RoomCard";
import RoomDetailsModal from "./RoomDetailsModal";
import RoomModal from "./RoomModal";
import RoomTable from "./RoomTable";
import ViewToggle from "./ViewToggle";
import NoDataFallback from "@/components/NoDataFallback";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import RoomFilter from "./RoomFilter";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import { Add } from "@/components/dashboard/ui/svg";

const RoomsManagementComponent = ({
  currentPage = 1,
  itemsPerPage = 12,
  onTotalItemsChange,
}) => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [activeFilters, setActiveFilters] = useState(null);
  const [view, setView] = useState("grid");
  const [viewImages, setViewImages] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  // Ref to access RoomFilter methods
  const filterRef = useRef();

  const dispatch = useDispatch();
  const roomTypesState = useSelector(selectRoomTypes);
  const vendor = useSelector((state) => state.auth.vendor);

  useEffect(() => {
    if (onTotalItemsChange) {
      onTotalItemsChange(
        Array.isArray(filteredRooms) ? filteredRooms.length : 0
      );
    }
  }, [filteredRooms, onTotalItemsChange]);
  // Apply filters function
  const applyFilters = (filters, roomsToFilter) => {
    if (!Array.isArray(roomsToFilter)) {
      return [];
    }
    if (!filters) {
      return roomsToFilter;
    }

    let filtered = [...roomsToFilter];

    // Search filter - search in room name/type and description
    if (filters.search && filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter((room) => {
        const name = (room.name || room.roomType || "").toLowerCase();
        const description = (room.description || "").toLowerCase();
        const roomNumber = (room.roomNumber || "").toString().toLowerCase();

        return (
          name.includes(searchLower) ||
          description.includes(searchLower) ||
          roomNumber.includes(searchLower)
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((room) => {
        const roomType = (room.type || room.roomType || "").toLowerCase();
        return roomType.includes(filters.category.toLowerCase());
      });
    }

    // Price range filter
    if (filters.priceRange?.min && filters.priceRange.min !== "") {
      const minPrice = parseFloat(filters.priceRange.min);
      filtered = filtered.filter((room) => {
        const price = room.pricePerNight || room.price || 0;
        return price >= minPrice;
      });
    }

    if (filters.priceRange?.max && filters.priceRange.max !== "") {
      const maxPrice = parseFloat(filters.priceRange.max);
      filtered = filtered.filter((room) => {
        const price = room.pricePerNight || room.price || 0;
        return price <= maxPrice;
      });
    }

    // Capacity filter
    if (filters.capacity && filters.capacity !== "") {
      const minCapacity = parseInt(filters.capacity);
      filtered = filtered.filter((room) => {
        const totalCapacity =
          (room.adultsCapacity || 0) + (room.childrenCapacity || 0);
        return totalCapacity >= minCapacity;
      });
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((room) => {
        if (filters.status === "available") {
          return room.isAvailable && room.maintenanceStatus !== "maintenance";
        } else if (filters.status === "occupied") {
          return !room.isAvailable && room.maintenanceStatus !== "maintenance";
        } else if (filters.status === "maintenance") {
          return room.maintenanceStatus === "maintenance";
        }
        return true;
      });
    }

    // Amenities filter - room must have ALL selected amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((room) => {
        const roomAmenities = room.amenities || [];
        return filters.amenities.every((amenity) =>
          roomAmenities.some((ra) => ra.toLowerCase() === amenity.toLowerCase())
        );
      });
    }

    return filtered;
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    console.log("Filters applied:", filters);
    setActiveFilters(filters);
    const filtered = applyFilters(filters, rooms);
    setFilteredRooms(filtered);
  };

  // Clear all filters
  const handleClearFilters = () => {
    filterRef.current?.resetFilters();
    setActiveFilters(null);
    setFilteredRooms(rooms);
  };

  // Fetch room types on mount
  useEffect(() => {
    const fetchRoomTypesData = async () => {
      try {
        const res = await hotelService.getRoomTypes(vendor._id);
        console.log("Fetched rooms:", res);
        setRooms(res);
        setFilteredRooms(res); // Initialize filtered rooms
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to fetch rooms");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomTypesData();
  }, [vendor._id]);

  // Fetch from Redux when needed
  useEffect(() => {
    const hotelId = vendor?.vendor?._id;

    if (hotelId && roomTypesState.status === "idle") {
      dispatch(fetchRoomTypes(hotelId));
    }
  }, [dispatch, roomTypesState.status, vendor]);

  // Map Redux room types to component state
  useEffect(() => {
    if (
      roomTypesState.status === "succeeded" &&
      Array.isArray(roomTypesState.items) &&
      roomTypesState.items.length > 0
    ) {
      const mapped = roomTypesState.items.map((rt, idx) => ({
        _id: rt._id || `rt-${idx}`,
        roomNumber: rt.roomNumber || String(idx + 1),
        name: rt.name || `Room ${idx + 1}`,
        roomType: rt.name || `Room ${idx + 1}`,
        type: rt.name || "standard",
        pricePerNight: rt.pricePerNight || rt.price || 0,
        price: rt.pricePerNight || rt.price || 0,
        adultsCapacity: rt.adultsCapacity || 0,
        childrenCapacity: rt.childrenCapacity || 0,
        capacity: (rt.adultsCapacity || 0) + (rt.childrenCapacity || 0),
        amenities: Array.isArray(rt.amenities) ? rt.amenities : [],
        features: [],
        description: rt.description || "",
        isAvailable:
          typeof rt.totalUnits === "number" ? rt.totalUnits > 0 : true,
        maintenanceStatus: rt.maintenanceStatus || "available",
        images: Array.isArray(rt.images) ? rt.images : [],
        createdAt: rt.createdAt,
        updatedAt: rt.updatedAt,
      }));
      setRooms(mapped);
      // Reapply filters if any are active
      if (activeFilters) {
        setFilteredRooms(applyFilters(activeFilters, mapped));
      } else {
        setFilteredRooms(mapped);
      }
    }
    if (roomTypesState.status === "failed") {
      console.error("Failed to load room types:", roomTypesState.error);
    }
  }, [roomTypesState]);

  // Update filtered rooms when rooms change (after add/edit/delete)
  useEffect(() => {
    if (activeFilters) {
      setFilteredRooms(applyFilters(activeFilters, rooms));
    } else {
      setFilteredRooms(rooms);
    }
  }, [rooms]);

  // Update total items count whenever filtered rooms change
  useEffect(() => {
    if (onTotalItemsChange) {
      onTotalItemsChange(filteredRooms.length);
    }
  }, [filteredRooms.length, onTotalItemsChange]);

  // Calculate paginated rooms from filtered results
  // Calculate paginated rooms from filtered results
  const getPaginatedRooms = () => {
    // Ensure filteredRooms is an array
    if (!Array.isArray(filteredRooms)) {
      return [];
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRooms.slice(startIndex, endIndex);
  };

  const paginatedRooms = getPaginatedRooms();

  // Event handlers
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsEditModalOpen(true);
  };

  const handleAddRoom = () => {
    setEditingRoom(undefined);
    navigate("/dashboard/hotel/addrooms");
  };

  const handleDeleteRoom = (roomId) => {
    setRoomToDelete(roomId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;
    const hotelId = vendor._id;

    try {
      setRooms((prev) => prev.filter((room) => room._id !== roomToDelete));
      await hotelService.deleteRoomType(hotelId, roomToDelete);
      toast.success("Room deleted successfully");
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    } finally {
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleViewImages = (room) => {
    setViewImages(room.images && room.images.length > 0 ? room.images : []);
  };

  const handleCloseViewImages = () => setViewImages(null);

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedRoom(null);
    setIsDetailsModalOpen(false);
  };

  const handleSaveRoom = (roomData) => {
    if (editingRoom) {
      setRooms((prev) =>
        prev.map((room) =>
          room._id === editingRoom._id ? { ...room, ...roomData } : room
        )
      );
    } else {
      const newRoom = {
        _id: String(Date.now()),
        ...roomData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return <UniversalLoader fullscreen />;
  }

  // Check if filters are active
  const hasActiveFilters =
    activeFilters &&
    ((activeFilters.search && activeFilters.search.trim() !== "") ||
      (activeFilters.category && activeFilters.category !== "all") ||
      (activeFilters.priceRange?.min && activeFilters.priceRange.min !== "") ||
      (activeFilters.priceRange?.max && activeFilters.priceRange.max !== "") ||
      (activeFilters.capacity && activeFilters.capacity !== "") ||
      (activeFilters.status && activeFilters.status !== "all") ||
      (activeFilters.amenities && activeFilters.amenities.length > 0));

  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-0">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Room Management</h1>
          <div className="flex items-center gap-3">
            {/* <ViewToggle view={view} onViewChange={setView} /> */}
            <DashboardButton
              onClick={handleAddRoom}
              variant="primary"
              text="Add Room"
              icon={<Add fill="#fff" />}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            />
          </div>
        </div>

        <RoomFilter
          ref={filterRef}
          onFilterChange={handleFilterChange}
          view={view}
          setView={setView}
        />

        {/* Filter Results Info */}
        {hasActiveFilters && filteredRooms.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-blue-700 text-sm font-medium">
                Found {filteredRooms.length} room
                {filteredRooms.length !== 1 ? "s" : ""} matching your filters
              </p>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {rooms.length === 0 ? (
          <NoDataFallback
            title="No Rooms Found"
            message="You haven't added any rooms yet. Click the button below to create your first room."
            actionLabel="Add Room"
            onAction={handleAddRoom}
          />
        ) : filteredRooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No rooms match your filters
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filter criteria to see more results.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <RoomTable
            rooms={paginatedRooms}
            onEdit={handleEditRoom}
            onDelete={handleDeleteRoom}
            onViewDetails={handleViewDetails}
            onViewImages={handleViewImages}
          />
        )}

        <RoomDetailsModal
          room={selectedRoom}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
          onViewImages={handleViewImages}
        />

        <RoomModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          room={editingRoom}
          onSave={handleSaveRoom}
          id={editingRoom?._id}
        />

        {viewImages && (
          <ImageGalleryModal
            images={viewImages}
            onClose={handleCloseViewImages}
          />
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRoomToDelete(null);
        }}
        onConfirm={confirmDeleteRoom}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
      />
    </div>
  );
};

export default RoomsManagementComponent;
