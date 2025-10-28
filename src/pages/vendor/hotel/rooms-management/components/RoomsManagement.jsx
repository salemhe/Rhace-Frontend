import { fetchRoomTypes, selectRoomTypes } from '@/redux/slices/vendorSlice';
import { hotelService } from '@/services/hotel.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import DeleteConfirmationModal from './DeleteRoom';
import ImageGalleryModal from './ImageGalleryModal';
import RoomCard from './RoomCard';
import RoomDetailsModal from './RoomDetailsModal';
import RoomModal from './RoomModal';
import RoomTable from './RoomTable';
import ViewToggle from './ViewToggle';
import NoDataFallback from '@/components/NoDataFallback';

const RoomsManagementComponent = () => {
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState('grid');
  const [viewImages, setViewImages] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  // All hooks must come before any conditional returns
  const dispatch = useDispatch();
  const roomTypesState = useSelector(selectRoomTypes);
  const vendor = useSelector((state) => state.auth.vendor);

  // Fetch room types on mount
  useEffect(() => {
    const fetchRoomTypesData = async () => {
      try {
        const res = await hotelService.getRoomTypes(vendor._id);
        console.log(res);
        setRooms(res);
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomTypesData();
  }, [vendor._id]);

  // Fetch from Redux when needed
  useEffect(() => {
    const hotelId = vendor?.vendor?._id;

    // only fetch when we actually have a hotelId and status is idle
    if (hotelId && roomTypesState.status === 'idle') {
      dispatch(fetchRoomTypes(hotelId));
    }
  }, [dispatch, roomTypesState.status, vendor]);

  // Map Redux room types to component state
  useEffect(() => {
    if (roomTypesState.status === 'succeeded' && Array.isArray(roomTypesState.items) && roomTypesState.items.length > 0) {
      // map backend room type fields into the rooms shape expected by UI
      const mapped = roomTypesState.items.map((rt, idx) => ({
        _id: rt._id || `rt-${idx}`,
        // no explicit roomNumber from backend, use index as fallback
        roomNumber: rt.roomNumber || String(idx + 1),
        // display name/type from backend
        roomType: rt.name || `Room ${idx + 1}`,
        type: rt.name || 'standard',
        // backend uses pricePerNight
        price: rt.pricePerNight || rt.price || 0,
        // guests capacity: prefer adultsCapacity, fall back to sum of adults+children if both present
        capacity: rt.adultsCapacity || ((rt.adultsCapacity || 0) + (rt.childrenCapacity || 0)) || 1,
        // pass amenities through (may be names or ids)
        amenities: Array.isArray(rt.amenities) ? rt.amenities : [],
        // backend doesn't provide 'features' separately — keep empty array
        features: [],
        description: rt.description || '',
        // availability not provided; assume available unless totalUnits is 0
        isAvailable: (typeof rt.totalUnits === 'number') ? rt.totalUnits > 0 : true,
        maintenanceStatus: 'available',
        images: Array.isArray(rt.images) ? rt.images : [],
        createdAt: rt.createdAt,
        updatedAt: rt.updatedAt,
      }));
      setRooms(mapped);
    }
    if (roomTypesState.status === 'failed') {
      console.error('Failed to load room types:', roomTypesState.error);
    }
  }, [roomTypesState]);

  // Event handlers
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    console.log(editingRoom)
    setIsEditModalOpen(true);
  };

  const handleAddRoom = () => {
    setEditingRoom(undefined);
    navigate('/dashboard/hotel/addrooms');
  };

  const handleDeleteRoom = (roomId) => {
    // Instead of confirming immediately, show the modal
    setRoomToDelete(roomId);
    setIsDeleteModalOpen(true);
  };


  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;
    const hotelId = vendor._id;

    try {
      setRooms(prev => prev.filter(room => room._id !== roomToDelete));
      await hotelService.deleteRoomType(hotelId, roomToDelete);
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Failed to delete room:', error);
      toast.error('Failed to delete room');
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
      setRooms(prev => prev.map(room =>
        room._id === editingRoom._id ? { ...room, ...roomData } : room
      ));
    } else {
      const newRoom = {
        _id: String(Date.now()),
        ...roomData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRooms(prev => [...prev, newRoom]);
    }
    setIsEditModalOpen(false);
  };

  // NOW conditional return can happen after all hooks
  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <p className='animate-pulse text-lg'>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-0">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <div className="flex items-center gap-3">
            <ViewToggle view={view} onViewChange={setView} />
            <button
              onClick={handleAddRoom}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Add Room
            </button>
          </div>
        </div>

        {rooms.length === 0 ? (
          <NoDataFallback
            title="No Rooms Found"
            message="You haven’t added any rooms yet. Click the button below to create your first room."
            actionLabel="Add Room"
            onAction={handleAddRoom}
          />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <RoomTable
            rooms={rooms}
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