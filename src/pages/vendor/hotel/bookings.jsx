import DashboardButton from '@/components/dashboard/ui/DashboardButton';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NoDataFallback from '@/components/NoDataFallback';
import { StatCard } from '@/components/Statcard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Add, Calendar, CardPay, Cash2, Export, Eye, EyeClose, Group3 } from '@/components/dashboard/ui/svg';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { userService } from '@/services/user.service';
import { formatDate } from '@/utils/formatDate';
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedBookings, setSelectedBookings] = useState([]);
  const vendor = useSelector((state) => state.auth.vendor);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 12 items per page (3x4 grid)
  const [totalItems, setTotalItems] = useState(0);

  const [hideTab, setHideTab] = useState(false);
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > maxVisible) {
        pages.push('ellipsis-start');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - maxVisible + 1) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const tabs = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];

  // const bookings = [
  //   { id: 1, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 4, paymentStatus: 'Fully Paid' },
  //   { id: 2, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 3, paymentStatus: 'Partly paid' },
  //   { id: 3, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 2, paymentStatus: 'Fully Paid' },
  //   { id: 4, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Fully Paid' },
  //   { id: 5, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Fully Paid' },
  //   { id: 6, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Fully Paid' },
  //   { id: 7, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Partly paid' },
  //   { id: 8, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Partly paid' },
  //   { id: 9, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 2, paymentStatus: 'Partly paid' },
  // ];

  // ...existing code... (selection helpers defined below)

  const handleSelectBooking = (id, checked) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, id]);
    } else {
      setSelectedBookings(selectedBookings.filter(bookingId => bookingId !== id));
    }
  };


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
            setBookings((prev) => [...prev, message.data]);
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
        const data = res?.data || [];
        setBookings(data)
        setTotalItems(data.length)
        // ensure current page is within bounds after load
        setCurrentPage((prev) => {
          const maxPage = Math.max(1, Math.ceil(data.length / itemsPerPage));
          return Math.min(prev, maxPage);
        })
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReservations()
  }, [vendor?._id, itemsPerPage])

  // compute paginated bookings for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

  // Toggle selection for visible page items (merge when selecting, remove when deselecting)
  const handleToggleSelectPage = (checked) => {
    const pageIds = paginatedBookings.map(b => b.id);
    if (checked) {
      setSelectedBookings(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelectedBookings(prev => prev.filter(id => !pageIds.includes(id)));
    }
  }

  if (isLoading) {
    return <UniversalLoader fullscreen />
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Fully Paid':
        return 'bg-green-100 text-green-800';
      case 'Partly paid':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout type="hotel" section="bookings">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className='md:flex hidden justify-between items-center mb-6'>
            <h2 className='text-[#111827] font-semibold'>All Bookings</h2>
            <div className='flex gap-6'>
              <DashboardButton onClick={() => setHideTab(!hideTab)} variant="secondary" text={hideTab ? "Open tabs" : "Hide tabs"} icon={hideTab ? <Eye /> : <EyeClose />} />
              <DashboardButton variant="secondary" text="Export" icon={<Export />} />
              {/* <DashboardButton onClick={() => navigate("/dashboard/restaurant/reservation/new")} variant="primary" text="New Reservation" icon={<Add fill="#fff" />} /> */}
            </div>
          </div>
          {!hideTab &&
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                             <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                   <div>
                                      <p className="text-sm text-gray-600">Total Reservations</p>
                                      <p className="text-2xl font-bold text-gray-900">{bookings?.length}</p>
                                   </div>
                                   <Calendar className="w-8 h-8 text-teal-600" />
                                </div>
                             </div>
                             <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                   <div>
                                      <p className="text-sm text-gray-600">Confirmed</p>
                                      <p className="text-2xl font-bold text-green-600">
                                         {bookings?.filter(r => r.status === 'confirmed').length}
                                      </p>
                                   </div>
                                   <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                             </div>
                             <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                   <div>
                                      <p className="text-sm text-gray-600">Pending</p>
                                      <p className="text-2xl font-bold text-yellow-600">
                                         {bookings.filter(r => r.reservationStatus === 'Upcoming').length}
                                      </p>
                                   </div>
                                   <Clock className="w-8 h-8 text-yellow-600" />
                                </div>
                             </div>
                             <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                   <div>
                                      <p className="text-sm text-gray-600">Total Revenue</p>
                                      <p className="text-2xl font-bold text-teal-600">
                                         ₦{bookings
                                            .filter(r => r.paymentStatus === 'paid' || r.paymentStatus === 'success')
                                            .reduce((sum, r) => sum + (r.totalAmount || 0), 0)
                                            .toLocaleString()}
                                      </p>
                                   </div>
                                   <Download className="w-8 h-8 text-teal-600" />
                                </div>
                             </div>
                          </div>
          }
          {/* Tabs and Filters */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-2 text-sm font-medium rounded-md ${activeTab === tab
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by guest name or ID"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Today
                  <ChevronDown size={16} />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Payment Status
                  <ChevronDown size={16} />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <SlidersHorizontal size={16} />
                  Advanced filter
                </button>
              </div>
            </div>

            {/* Table */}
            {
              totalItems > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={paginatedBookings.length > 0 && paginatedBookings.every(b => selectedBookings.includes(b.id))}
                            onChange={(e) => handleToggleSelectPage(e.target.checked)}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            disabled={paginatedBookings.length === 0}
                          />
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer name
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-In Date
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-Out Date
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room Type
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No of Guests
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                        <th className="w-12 px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedBookings.includes(booking.id)}
                              onChange={(e) => handleSelectBooking(booking.id, e.target.checked)}
                              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-teal-700">
                                  <Avatar>
                                    <AvatarFallback>
                                      {booking.customerName.split(" ").map((i) => (i.slice(0, 1).toUpperCase()))}
                                    </AvatarFallback>
                                  </Avatar>
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{booking.customerName}</div>
                                <div className="text-sm text-gray-500">ID: #{booking._id.slice(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">{formatDate(booking.checkInDate)}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{formatDate(booking.checkOutDate)}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{booking.room.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{booking.guests}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <NoDataFallback />
              )
            }

            {/* Pagination */}
          </div>
        </div>
      </div>
      {totalItems > 0 && (
        <div className='absolute hidden md:flex bottom-0 border-t border-[#E5E7EB] left-0 right-0  bg-white'>
          <div className="flex items-center w-full px-8 justify-between space-x-2 py-4">
            <div className="text-muted-foreground text-sm">
              Page {currentPage} of {totalPages} ({totalItems} total items)
            </div>
            <div className='flex items-center gap-2'>
              {getPageNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === 'ellipsis-start' || page === 'ellipsis-end'}
                  className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 border border-gray-200'} ${page === 'ellipsis-start' || page === 'ellipsis-end' ? 'cursor-default' : 'hover:bg-gray-100'}`}
                >
                  {page === 'ellipsis-start' || page === 'ellipsis-end' ? '…' : page}
                </button>
              ))}
            </div>
            <div className="gap-2 flex">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BookingManagement;