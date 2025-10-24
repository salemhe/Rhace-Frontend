import BookingCard from '@/components/BookingCard';
import UserHeader from '@/components/layout/headers/user-header';
import Header from '@/components/user/Header';
import ReservationHeader from '@/components/user/hotel/ReservationHeader';
import { userService } from '@/services/user.service';
import { MoreVertical, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// Dummy data
// const dummyBookings = [
//    {
//       id: 1,
//       property_name: 'Luxury Beach Resort',
//       image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
//       property_type: 'Hotels',
//       check_in: '2025-10-20T14:00:00',
//       check_out: '2025-10-25T11:00:00',
//       location: 'Malibu, California',
//       guests: 2,
//       room_info: '1 King Bed',
//       status: 'Confirmed',
//       is_upcoming: true
//    },
//    {
//       id: 2,
//       property_name: 'Mountain View Cabin',
//       image_url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop',
//       property_type: 'Vacation Rentals',
//       check_in: '2025-11-05T15:00:00',
//       check_out: '2025-11-10T10:00:00',
//       location: 'Aspen, Colorado',
//       guests: 4,
//       room_info: '2 Bedrooms',
//       status: 'Pending',
//       is_upcoming: true
//    },
//    {
//       id: 3,
//       property_name: 'Downtown City Hotel',
//       image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
//       property_type: 'Hotels',
//       check_in: '2025-09-15T14:00:00',
//       check_out: '2025-09-18T12:00:00',
//       location: 'New York, NY',
//       guests: 1,
//       room_info: '1 Queen Bed',
//       status: 'Completed',
//       is_upcoming: false
//    },
//    {
//       id: 4,
//       property_name: 'Seaside Villa',
//       image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
//       property_type: 'Vacation Rentals',
//       check_in: '2025-08-20T16:00:00',
//       check_out: '2025-08-27T11:00:00',
//       location: 'Miami Beach, Florida',
//       guests: 6,
//       room_info: '3 Bedrooms',
//       status: 'Completed',
//       is_upcoming: false
//    },
//    {
//       id: 5,
//       property_name: 'Historic Inn',
//       image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
//       property_type: 'Hotels',
//       check_in: '2025-07-10T13:00:00',
//       check_out: '2025-07-12T11:00:00',
//       location: 'Boston, Massachusetts',
//       guests: 2,
//       room_info: '1 Double Bed',
//       status: 'Cancelled',
//       is_upcoming: false
//    }
// ];



function BookingsPage() {
   const [activeTab, setActiveTab] = useState('upcoming');
   const [bookings, setBookings] = useState([]);
   const user = useSelector((state) => state.auth.user);
   const [isLoading, setIsLoading] = useState(true);

   const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this booking?')) {
         setBookings(bookings.filter((b) => b.id !== id));
      }
   };

   const upcomingBookings = bookings.upcoming;
   const pastBookings = bookings.past;
   const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

   useEffect(() => {
      const fetchBookings = async () => {
         try {
            const res = await userService.fetchReservations({ userId: user._id })
            setBookings(res.data)
         } catch (err) {
            console.log(err)
            toast.error()
         } finally {
            setIsLoading(false)
         }
      }
      fetchBookings();
   }, [])

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
         </div>
      )
   }

   return (
      <div className="min-h-screen ">

         <Header />
         <div className="max-w-7xl mx-auto px-4 mt-28 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className=" overflow-hidden">
               <div className="border rounded-t-2xl  border-gray-200">
                  <div className="flex items-center justify-between px-4 sm:px-6 ">
                     <div className="flex items-center gap-6 overflow-x-auto">
                        <button
                           onClick={() => setActiveTab('upcoming')}
                           className={`flex items-center gap-2 pb-4 pt-4 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upcoming'
                              ? 'border-teal-600 text-teal-600'
                              : 'border-transparent text-gray-600 hover:text-gray-900'
                              }`}
                        >
                           <span className="font-medium">Upcoming Bookings</span>
                           <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === 'upcoming'
                                 ? 'bg-gray-100 text-[#0A6C6D]'
                                 : 'bg-gray-100 text-gray-700'
                                 }`}
                           >
                              {upcomingBookings.length}
                           </span>
                        </button>

                        <button
                           onClick={() => setActiveTab('past')}
                           className={`flex items-center gap-2 pb-4 pt-2 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'past'
                              ? 'border-teal-600 text-teal-600'
                              : 'border-transparent text-gray-600 hover:text-gray-900'
                              }`}
                        >
                           <span className="font-medium">Past Bookings</span>
                           <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === 'past'
                                 ? 'bg-gray-100 text-[#0A6C6D]'
                                 : 'bg-gray-100 text-gray-700'
                                 }`}
                           >
                              {pastBookings.length}
                           </span>
                        </button>

                        <button className="pb-4 pt-2 px-2 text-gray-600 hover:text-gray-900 transition-colors">
                           <MoreVertical className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <button
                           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                           aria-label="Search"
                        >
                           <Search className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                           className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                           aria-label="Filter"
                        >
                           <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                           <span className="hidden sm:inline text-sm font-medium text-gray-700">
                              Filter
                           </span>
                        </button>
                     </div>
                  </div>
               </div>

               <div className=" pt-6">
                  {displayBookings.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-gray-600">No {activeTab} bookings found.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {displayBookings.map((booking) => (
                           <BookingCard
                              key={booking._id}
                              booking={booking}
                              onEdit={(_id) => console.log('Edit', _id)}
                              onDelete={handleDelete}
                           />
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

export default BookingsPage;