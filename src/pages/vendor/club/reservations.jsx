import DashboardLayout from '@/components/layout/DashboardLayout';
import {
   Calendar,
   CheckCircle,
   Clock,
   Download,
   Eye,
   Search,
   Users,
   XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

const ClubReservationTable = () => {
   const [reservations, setReservations] = useState([
      {
         id: 'RES-001',
         customerName: 'John Doe',
         vendorName: 'Skyline Lounge',
         date: '2025-10-25',
         time: '19:00',
         guests: 4,
         table: 'VIP-01',
         status: 'confirmed',
         totalAmount: 125000,
         paidAmount: 125000,
         paymentStatus: 'paid',
         specialRequest: 'Birthday celebration',
         comboItems: ['Premium Combo A'],
         bottleItems: ['Hennessy VSOP x2'],
         vipExtras: ['Cake decoration'],
      },
      {
         id: 'RES-002',
         customerName: 'Jane Smith',
         vendorName: 'Ocean View Club',
         date: '2025-10-26',
         time: '20:30',
         guests: 6,
         table: 'REG-05',
         status: 'pending',
         totalAmount: 180000,
         paidAmount: 90000,
         paymentStatus: 'partial',
         specialRequest: 'Vegetarian options needed',
         comboItems: ['Deluxe Combo B'],
         bottleItems: [],
         vipExtras: [],
      },
      {
         id: 'RES-003',
         customerName: 'Michael Johnson',
         vendorName: 'Skyline Lounge',
         date: '2025-10-24',
         time: '18:00',
         guests: 2,
         table: 'REG-12',
         status: 'completed',
         totalAmount: 75000,
         paidAmount: 75000,
         paymentStatus: 'paid',
         specialRequest: '',
         comboItems: [],
         bottleItems: ['Grey Goose x1'],
         vipExtras: [],
      },
      {
         id: 'RES-004',
         customerName: 'Sarah Williams',
         vendorName: 'Diamond Club',
         date: '2025-10-28',
         time: '21:00',
         guests: 8,
         table: 'VIP-03',
         status: 'confirmed',
         totalAmount: 250000,
         paidAmount: 125000,
         paymentStatus: 'partial',
         specialRequest: 'Corporate event',
         comboItems: ['Premium Combo A', 'Deluxe Combo B'],
         bottleItems: ['Moet Chandon x3'],
         vipExtras: ['DJ Service', 'Security'],
      },
      {
         id: 'RES-005',
         customerName: 'David Brown',
         vendorName: 'Ocean View Club',
         date: '2025-10-23',
         time: '19:30',
         guests: 3,
         table: 'REG-08',
         status: 'cancelled',
         totalAmount: 95000,
         paidAmount: 0,
         paymentStatus: 'refunded',
         specialRequest: '',
         comboItems: [],
         bottleItems: [],
         vipExtras: [],
      },
   ]);

   const [searchTerm, setSearchTerm] = useState('');
   const [filterStatus, setFilterStatus] = useState('all');
   const [selectedReservation, setSelectedReservation] = useState(null);

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const reservationsPerPage = 2;

   // Reset page when search/filter changes
   useEffect(() => {
      setCurrentPage(1);
   }, [searchTerm, filterStatus]);

   const getStatusBadge = (status) => {
      const statusStyles = {
         confirmed: 'bg-green-100 text-green-800',
         pending: 'bg-yellow-100 text-yellow-800',
         completed: 'bg-blue-100 text-blue-800',
         cancelled: 'bg-red-100 text-red-800',
      };
      const statusIcons = {
         confirmed: <CheckCircle className="w-3 h-3" />,
         pending: <Clock className="w-3 h-3" />,
         completed: <CheckCircle className="w-3 h-3" />,
         cancelled: <XCircle className="w-3 h-3" />,
      };
      return (
         <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
         >
            {statusIcons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
         </span>
      );
   };

   const getPaymentBadge = (paymentStatus) => {
      const paymentStyles = {
         paid: 'bg-green-100 text-green-800',
         partial: 'bg-orange-100 text-orange-800',
         refunded: 'bg-gray-100 text-gray-800',
      };
      return (
         <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentStyles[paymentStatus]}`}
         >
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
         </span>
      );
   };

   const filteredReservations = reservations.filter((res) => {
      const matchesSearch =
         res.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         res.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         res.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || res.status === filterStatus;
      return matchesSearch && matchesFilter;
   });

   const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);
   const indexOfLast = currentPage * reservationsPerPage;
   const indexOfFirst = indexOfLast - reservationsPerPage;
   const currentReservations = filteredReservations.slice(indexOfFirst, indexOfLast);

   const updateReservationStatus = (id, newStatus) => {
      setReservations((prev) =>
         prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
      );
      setSelectedReservation(null);
   };

   // Pagination helper to display page numbers with ellipsis
   const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 7) {
         for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
         if (currentPage <= 3) {
            pages.push(1, 2, 3, '...', totalPages);
         } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
         } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
         }
      }
      return pages;
   };

   return (
      <DashboardLayout>
         <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
               {/* Header */}
               <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation Management</h1>
                  <p className="text-gray-600">Manage and track all club reservations</p>
               </div>

               {/* Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-gray-600">Total Reservations</p>
                           <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-teal-600" />
                     </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-gray-600">Confirmed</p>
                           <p className="text-2xl font-bold text-green-600">
                              {reservations.filter(r => r.status === 'confirmed').length}
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
                              {reservations.filter(r => r.status === 'pending').length}
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
                              ₦{reservations.reduce((sum, r) => sum + r.paidAmount, 0).toLocaleString()}
                           </p>
                        </div>
                        <Download className="w-8 h-8 text-teal-600" />
                     </div>
                  </div>
               </div>

               {/* Filters and Search */}
               <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                           type="text"
                           placeholder="Search by customer name, vendor, or ID..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                     </div>
                     <div className="flex gap-2">
                        <select
                           value={filterStatus}
                           onChange={(e) => setFilterStatus(e.target.value)}
                           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                           <option value="all">All Status</option>
                           <option value="confirmed">Confirmed</option>
                           <option value="pending">Pending</option>
                           <option value="completed">Completed</option>
                           <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
                           <Download className="w-4 h-4" />
                           Export
                        </button>
                     </div>
                  </div>
               </div>


               {/* Table */}
               <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Customer
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Venue
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Date & Time
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Guests
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Table
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Payment
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                 Actions
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                           {currentReservations.map((reservation) => (
                              <tr key={reservation.id} className="hover:bg-gray-50">
                                 <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {reservation.id}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-900">{reservation.customerName}</td>
                                 <td className="px-6 py-4 text-sm text-gray-600">{reservation.vendorName}</td>
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex flex-col">
                                       <span>
                                          {new Date(reservation.date).toLocaleDateString('en-US', {
                                             month: 'short',
                                             day: 'numeric',
                                             year: 'numeric',
                                          })}
                                       </span>
                                       <span className="text-xs text-gray-500">{reservation.time}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {reservation.guests}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">{reservation.table}</td>
                                 <td className="px-6 py-4">{getPaymentBadge(reservation.paymentStatus)}</td>
                                 <td className="px-6 py-4">{getStatusBadge(reservation.status)}</td>
                                 <td className="px-6 py-4 text-sm">
                                    <button
                                       onClick={() => setSelectedReservation(reservation)}
                                       className="text-teal-600 hover:text-teal-800 flex items-center gap-1"
                                    >
                                       <Eye className="w-4 h-4" />
                                       View
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Modern Pagination */}
                  {totalPages > 1 && (
                     <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                        <p className="text-sm text-gray-600">
                           Page <span className="font-medium">{currentPage}</span> of{' '}
                           <span className="font-medium">{totalPages}</span>
                        </p>

                        <div className="flex items-center gap-2">
                           <button
                              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                              disabled={currentPage === 1}
                              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-gray-700 ${currentPage === 1
                                    ? 'bg-gray-100 cursor-not-allowed'
                                    : 'hover:bg-gray-100'
                                 }`}
                           >
                              ‹
                           </button>

                           {getPageNumbers().map((num, idx) =>
                              num === '...' ? (
                                 <span key={idx} className="px-2 text-gray-500">
                                    ...
                                 </span>
                              ) : (
                                 <button
                                    key={idx}
                                    onClick={() => setCurrentPage(num)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${num === currentPage
                                          ? 'bg-teal-50 text-teal-700 border border-teal-600'
                                          : 'text-gray-700 border hover:bg-gray-100'
                                       }`}
                                 >
                                    {num}
                                 </button>
                              )
                           )}

                           <button
                              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-gray-700 ${currentPage === totalPages
                                    ? 'bg-gray-100 cursor-not-allowed'
                                    : 'hover:bg-gray-100'
                                 }`}
                           >
                              ›
                           </button>
                        </div>
                     </div>
                  )}
               </div>

                {selectedReservation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Reservation Details</h2>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Reservation ID</p>
                      <p className="font-medium">{selectedReservation.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Customer Name</p>
                      <p className="font-medium">{selectedReservation.customerName}</p>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Reservation Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Venue</p>
                      <p className="font-medium">{selectedReservation.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium">{new Date(selectedReservation.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-medium">{selectedReservation.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Table</p>
                      <p className="font-medium">{selectedReservation.table}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Guests</p>
                      <p className="font-medium">{selectedReservation.guests}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedReservation.status)}</div>
                    </div>
                  </div>
                </div>

                {/* Items Ordered */}
                {(selectedReservation.comboItems.length > 0 || 
                  selectedReservation.bottleItems.length > 0 || 
                  selectedReservation.vipExtras.length > 0) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Items Ordered</h3>
                    {selectedReservation.comboItems.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">Premium Combos:</p>
                        <p className="text-sm font-medium">{selectedReservation.comboItems.join(', ')}</p>
                      </div>
                    )}
                    {selectedReservation.bottleItems.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">Premium Bottles:</p>
                        <p className="text-sm font-medium">{selectedReservation.bottleItems.join(', ')}</p>
                      </div>
                    )}
                    {selectedReservation.vipExtras.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">VIP Extras:</p>
                        <p className="text-sm font-medium">{selectedReservation.vipExtras.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Special Request */}
                {selectedReservation.specialRequest && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Special Request</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedReservation.specialRequest}
                    </p>
                  </div>
                )}

                {/* Payment Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">₦{selectedReservation.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Amount</span>
                      <span className="font-medium">₦{selectedReservation.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balance</span>
                      <span className="font-medium">₦{(selectedReservation.totalAmount - selectedReservation.paidAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <div>{getPaymentBadge(selectedReservation.paymentStatus)}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedReservation.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateReservationStatus(selectedReservation.id, 'confirmed')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
                    >
                      Confirm Reservation
                    </button>
                    <button
                      onClick={() => updateReservationStatus(selectedReservation.id, 'cancelled')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
                {selectedReservation.status === 'confirmed' && (
                  <button
                    onClick={() => updateReservationStatus(selectedReservation.id, 'completed')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
            </div>
         </div>
      </DashboardLayout>
   );
};

export default ClubReservationTable;
