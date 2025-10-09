import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import ImageGalleryModal from './ImageGalleryModal';
import RoomCard from './RoomCard';
import RoomDetailsModal from './RoomDetailsModal';
import RoomModal from './RoomModal';
import RoomTable from './RoomTable';
import ViewToggle from './ViewToggle';
import { useNavigate } from 'react-router';


const RoomsManagementComponent = () => {
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState('grid');
  const [viewImages, setViewImages] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(undefined);
  const navigate = useNavigate();

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsEditModalOpen(true);
  };

  const handleAddRoom = () => {
    setEditingRoom(undefined);
    navigate('/hotel/addrooms');
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        setRooms(prev => prev.filter(room => room._id !== roomId));
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
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

  useEffect(() => {
    const dummyRooms = [
      {
        _id: "1",
        roomNumber: "101",
        roomType: "single",
        type: "standard",
        price: 50,
        capacity: 1,
        amenities: ["WiFi", "AC"],
        features: ["Balcony"],
        description: "Cozy single room with a balcony.",
        isAvailable: true,
        maintenanceStatus: "available",
        images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "2",
        roomNumber: "202",
        roomType: "double",
        type: "deluxe",
        price: 120,
        capacity: 2,
        amenities: ["WiFi", "Mini Bar", "TV"],
        features: ["Ocean View", "Terrace"],
        description: "Deluxe double room with ocean view.",
        isAvailable: false,
        maintenanceStatus: "available",
        images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "3",
        roomNumber: "303",
        roomType: "suite",
        type: "premium",
        price: 250,
        capacity: 4,
        amenities: ["WiFi", "AC", "Room Service", "Smart TV"],
        features: ["Jacuzzi", "Living Area", "Garden View"],
        description: "Luxury suite with jacuzzi and living area.",
        isAvailable: true,
        maintenanceStatus: "maintenance",
        images: ["https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "4",
        roomNumber: "104",
        roomType: "double",
        type: "standard",
        price: 80,
        capacity: 2,
        amenities: ["WiFi", "AC", "TV"],
        features: ["City View"],
        description: "Comfortable double room with city view.",
        isAvailable: true,
        maintenanceStatus: "available",
        images: ["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "5",
        roomNumber: "205",
        roomType: "family",
        type: "deluxe",
        price: 180,
        capacity: 5,
        amenities: ["WiFi", "AC", "Mini Bar", "Smart TV", "Safe"],
        features: ["Two Bedrooms", "Living Area", "Balcony"],
        description: "Spacious family room with separate bedrooms.",
        isAvailable: true,
        maintenanceStatus: "available",
        images: ["https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "6",
        roomNumber: "306",
        roomType: "suite",
        type: "premium",
        price: 300,
        capacity: 3,
        amenities: ["WiFi", "AC", "Mini Bar", "Smart TV", "Room Service", "Safe"],
        features: ["Ocean View", "Terrace", "Living Area", "Kitchenette"],
        description: "Premium suite with stunning ocean view and kitchenette.",
        isAvailable: false,
        maintenanceStatus: "available",
        images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setRooms(dummyRooms);
  }, []);

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

        {view === 'grid' ? (
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
        />

        {viewImages && (
          <ImageGalleryModal
            images={viewImages}
            onClose={handleCloseViewImages}
          />
        )}
      </div>
    </div>
  );
};

export default RoomsManagementComponent;