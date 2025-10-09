import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ChevronDown,
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedBookings, setSelectedBookings] = useState([]);

  const tabs = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];

  const bookings = [
    { id: 1, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 4, paymentStatus: 'Fully Paid' },
    { id: 2, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 3, paymentStatus: 'Partly paid' },
    { id: 3, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 2, paymentStatus: 'Fully Paid' },
    { id: 4, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Fully Paid' },
    { id: 5, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Fully Paid' },
    { id: 6, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Fully Paid' },
    { id: 7, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Partly paid' },
    { id: 8, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 1, paymentStatus: 'Partly paid' },
    { id: 9, name: 'Emily Johnson', bookingId: '#12345', checkIn: 'June 5, 2025', checkOut: 'June 7, 2025', roomType: 'Superion Luxury', guests: 2, paymentStatus: 'Partly paid' },
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBookings(bookings.map(b => b.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectBooking = (id, checked) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, id]);
    } else {
      setSelectedBookings(selectedBookings.filter(bookingId => bookingId !== id));
    }
  };

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
   <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">All Bookings</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Eye size={16} />
              Show tabs
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              <Plus size={16} />
              New Booking
            </button>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === bookings.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
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
                {bookings.map((booking) => (
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
                          <span className="text-sm font-medium text-teal-700">EJ</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{booking.name}</div>
                          <div className="text-sm text-gray-500">ID: {booking.bookingId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{booking.checkIn}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{booking.checkOut}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{booking.roomType}</td>
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

          {/* Pagination */}
         </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default BookingManagement;