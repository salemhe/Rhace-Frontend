// import BookingCard from '@/components/BookingCard';
// import Footer from '@/components/Footer';
// import UserHeader from '@/components/layout/headers/user-header';
// import Header from '@/components/user/Header';
// import ReservationHeader from '@/components/user/hotel/ReservationHeader';
// import UniversalLoader from '@/components/user/ui/LogoLoader';
// import { userService } from '@/services/user.service';
// import { MoreVertical, Search, SlidersHorizontal } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';

// // Dummy data
// // const dummyBookings = [
// //    {
// //       id: 1,
// //       property_name: 'Luxury Beach Resort',
// //       image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
// //       property_type: 'Hotels',
// //       check_in: '2025-10-20T14:00:00',
// //       check_out: '2025-10-25T11:00:00',
// //       location: 'Malibu, California',
// //       guests: 2,
// //       room_info: '1 King Bed',
// //       status: 'Confirmed',
// //       is_upcoming: true
// //    },
// //    {
// //       id: 2,
// //       property_name: 'Mountain View Cabin',
// //       image_url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop',
// //       property_type: 'Vacation Rentals',
// //       check_in: '2025-11-05T15:00:00',
// //       check_out: '2025-11-10T10:00:00',
// //       location: 'Aspen, Colorado',
// //       guests: 4,
// //       room_info: '2 Bedrooms',
// //       status: 'Pending',
// //       is_upcoming: true
// //    },
// //    {
// //       id: 3,
// //       property_name: 'Downtown City Hotel',
// //       image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
// //       property_type: 'Hotels',
// //       check_in: '2025-09-15T14:00:00',
// //       check_out: '2025-09-18T12:00:00',
// //       location: 'New York, NY',
// //       guests: 1,
// //       room_info: '1 Queen Bed',
// //       status: 'Completed',
// //       is_upcoming: false
// //    },
// //    {
// //       id: 4,
// //       property_name: 'Seaside Villa',
// //       image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
// //       property_type: 'Vacation Rentals',
// //       check_in: '2025-08-20T16:00:00',
// //       check_out: '2025-08-27T11:00:00',
// //       location: 'Miami Beach, Florida',
// //       guests: 6,
// //       room_info: '3 Bedrooms',
// //       status: 'Completed',
// //       is_upcoming: false
// //    },
// //    {
// //       id: 5,
// //       property_name: 'Historic Inn',
// //       image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
// //       property_type: 'Hotels',
// //       check_in: '2025-07-10T13:00:00',
// //       check_out: '2025-07-12T11:00:00',
// //       location: 'Boston, Massachusetts',
// //       guests: 2,
// //       room_info: '1 Double Bed',
// //       status: 'Cancelled',
// //       is_upcoming: false
// //    }
// // ];



// function BookingsPage() {
//    const [activeTab, setActiveTab] = useState('upcoming');
//    const [bookings, setBookings] = useState([]);
//    const user = useSelector((state) => state.auth.user);
//    const [isLoading, setIsLoading] = useState(true);

//    const handleDelete = (id) => {
//       if (window.confirm('Are you sure you want to delete this booking?')) {
//          setBookings(bookings.filter((b) => b.id !== id));
//       }
//    };

//    const upcomingBookings = bookings.upcoming;
//    const pastBookings = bookings.past;
//    const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

//    useEffect(() => {
//       const fetchBookings = async () => {
//          try {
//             const res = await userService.fetchReservations({ userId: user._id })
//             setBookings(res.data)
//          } catch (err) {
//             console.log(err)
//             toast.error()
//          } finally {
//             setIsLoading(false)
//          }
//       }
//       fetchBookings();
//    }, [])

//    if (isLoading) {
//       return (
//          <UniversalLoader fullscreen />
//       )
//    }

//    return (
//       <div className="min-h-screen ">

//          <Header />
//          <div className="max-w-7xl mx-auto px-4 mt-28 sm:px-6 lg:px-8 py-6 sm:py-8">
//             <div className=" overflow-hidden">
//                <div className="border rounded-t-2xl  border-gray-200">
//                   <div className="flex items-center justify-between px-4 sm:px-6 ">
//                      <div className="flex items-center gap-6 overflow-x-auto">
//                         <button
//                            onClick={() => setActiveTab('upcoming')}
//                            className={`flex items-center gap-2 pb-4 pt-4 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upcoming'
//                               ? 'border-teal-600 text-teal-600'
//                               : 'border-transparent text-gray-600 hover:text-gray-900'
//                               }`}
//                         >
//                            <span className="font-medium">Upcoming Bookings</span>
//                            <span
//                               className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === 'upcoming'
//                                  ? 'bg-gray-100 text-[#0A6C6D]'
//                                  : 'bg-gray-100 text-gray-700'
//                                  }`}
//                            >
//                               {upcomingBookings.length}
//                            </span>
//                         </button>

//                         <button
//                            onClick={() => setActiveTab('past')}
//                            className={`flex items-center gap-2 pb-4 pt-2 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'past'
//                               ? 'border-teal-600 text-teal-600'
//                               : 'border-transparent text-gray-600 hover:text-gray-900'
//                               }`}
//                         >
//                            <span className="font-medium">Past Bookings</span>
//                            <span
//                               className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === 'past'
//                                  ? 'bg-gray-100 text-[#0A6C6D]'
//                                  : 'bg-gray-100 text-gray-700'
//                                  }`}
//                            >
//                               {pastBookings.length}
//                            </span>
//                         </button>

//                 <button className="pb-4 pt-2 px-2 text-gray-600 hover:text-gray-900 transition-colors">
//                   <MoreVertical className="w-5 h-5" />
//                 </button>
//               </div>

//                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
//                         <button
//                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                            aria-label="Search"
//                         >
//                            <Search className="w-5 h-5 text-gray-600" />
//                         </button>
//                         <button
//                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
//                            aria-label="Filter"
//                         >
//                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
//                            <span className="hidden sm:inline text-sm font-medium text-gray-700">
//                               Filter
//                            </span>
//                         </button>
//                      </div>
//                   </div>
//                </div>

//                <div className=" pt-6">
//                   {displayBookings.length === 0 ? (
//                      <div className="text-center py-12">
//                         <p className="text-gray-600">No {activeTab} bookings found.</p>
//                      </div>
//                   ) : (
//                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                         {displayBookings.map((booking) => (
//                            <BookingCard
//                               key={booking._id}
//                               booking={booking}
//                               onEdit={(_id) => console.log('Edit', _id)}
//                               onDelete={handleDelete}
//                            />
//                         ))}
//                      </div>
//                   )}
//                </div>
//             </div>
//          </div>
//          <Footer/>
//       </div>
//    );
// }

// export default BookingsPage;

import BookingCard from '@/components/BookingCard';
import Footer from '@/components/Footer';
import Header from '@/components/user/Header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SvgIcon, SvgIcon2, SvgIcon3 } from '@/public/icons/icons';
import { userService } from '@/services/user.service';
import {
   ArrowLeft, MoreVertical, Search, SlidersHorizontal,
   CalendarX, Sparkles, X, Calendar, Building2
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';


import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Home,
  User,
} from "lucide-react";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const normaliseType = (type) => {
   if (!type) return '';
   const t = type.toLowerCase();
   if (t.includes('hotel')) return 'Hotel';
   if (t.includes('restaurant')) return 'Restaurant';
   if (t.includes('club')) return 'Club';
   return type;
};

const getBookingDate = (booking) => {
   const raw = booking.checkInDate || booking.date;
   return raw ? new Date(raw) : null;
};

const formatDateShort = (dateStr) => {
   if (!dateStr) return '';
   return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
   });
};

// SvgIcon=Restaurant | SvgIcon2=Hotel | SvgIcon3=Club
const TYPE_ICON = {
   Hotel:      <SvgIcon2 className="w-4 h-4 flex-shrink-0 text-black" />,
   Restaurant: <SvgIcon  className="w-4 h-4 flex-shrink-0 text-black" />,
   Club:       <SvgIcon3 className="w-4 h-4 flex-shrink-0 text-black" />,
};


// ─── Skeleton Components ──────────────────────────────────────────────────────

function SkeletonCard() {
   return (
      <div className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
         <div className="flex">
            <div className="w-36 sm:w-44 h-44 bg-gray-200 flex-shrink-0" />
            <div className="flex flex-col justify-between flex-1 p-4">
               <div className="space-y-3">
                  <div className="flex justify-between items-start">
                     <div className="h-4 w-32 bg-gray-200 rounded-md" />
                     <div className="flex gap-2">
                        <div className="w-7 h-7 bg-gray-200 rounded-md" />
                        <div className="w-7 h-7 bg-gray-200 rounded-md" />
                        <div className="w-7 h-7 bg-gray-200 rounded-md" />
                     </div>
                  </div>
                  <div className="h-3 w-20 bg-gray-200 rounded-md" />
                  <div className="h-3 w-40 bg-gray-200 rounded-md" />
                  <div className="h-3 w-28 bg-gray-200 rounded-md" />
                  <div className="h-3 w-24 bg-gray-200 rounded-md" />
               </div>
               <div className="flex items-center justify-between mt-4">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  <div className="h-9 w-28 bg-gray-200 rounded-full" />
               </div>
            </div>
         </div>
      </div>
   );
}

function SkeletonTabToggle() {
   return (
      <div className="mb-6 flex justify-center">
         <div className="flex gap-2 bg-white border border-gray-200 rounded-full px-2 py-2 animate-pulse">
            <div className="h-9 w-28 bg-gray-200 rounded-full" />
            <div className="h-9 w-28 bg-gray-200 rounded-full" />
         </div>
      </div>
   );
}

function SkeletonTabBar() {
   return (
      <div className="border rounded-t-2xl border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between animate-pulse">
         <div className="flex gap-6">
            <div className="h-4 w-36 bg-gray-200 rounded-md" />
            <div className="h-4 w-28 bg-gray-200 rounded-md" />
         </div>
         <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-20 h-8 bg-gray-200 rounded-lg" />
         </div>
      </div>
   );
}

function BookingsSkeleton() {
   return (
      <>
         <SkeletonTabToggle />
         <div className="overflow-hidden">
            <SkeletonTabBar />
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
               {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
         </div>
      </>
   );
}


// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ type, isFiltered }) {
   if (isFiltered) {
      return (
         <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
               <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs leading-relaxed text-sm">
               Try a different vendor name, type, or date.
            </p>
         </div>
      );
   }
   return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
         <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center mb-6">
            {type === 'upcoming'
               ? <Search className="w-10 h-10 text-teal-600" />
               : <CalendarX className="w-10 h-10 text-gray-400" />}
         </div>
         {type === 'upcoming' ? (
            <>
               <h3 className="text-xl font-semibold text-gray-900 mb-2">Your next adventure awaits</h3>
               <p className="text-gray-500 max-w-xs mb-6 leading-relaxed">
                  You have no upcoming bookings. Thousands of hotels, restaurants & clubs are ready for you.
               </p>
            </>
         ) : (
            <>
               <h3 className="text-xl font-semibold text-gray-900 mb-2">No past trips yet</h3>
               <p className="text-gray-500 max-w-xs leading-relaxed">
                  Once you complete a stay, it'll show up here. Start building your travel memories!
               </p>
            </>
         )}
      </div>
   );
}


// ─── Search Panel ─────────────────────────────────────────────────────────────

function buildSuggestions(bookings) {
   const names = [...new Set(
      bookings.map(b => b.vendor?.businessName).filter(Boolean)
   )].map(n => ({ label: n, kind: 'vendor', value: n }));

   const types = [...new Set(
      bookings.map(b => normaliseType(b.reservationType)).filter(Boolean)
   )].map(t => ({ label: t, kind: 'type', value: t }));

   return [...names, ...types];
}

// Icon shown in the suggestion row
function SuggestionRowIcon({ kind, label }) {
   if (kind === 'type') {
      // Use your custom SVG icons for Hotel/Restaurant/Club
      return (
         <span className="flex items-center justify-center">
            {TYPE_ICON[label] ?? <SlidersHorizontal className="w-4 h-4" />}
         </span>
      );
   }
   // Vendor rows get a generic building icon
   return <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />;
}

function SearchPanel({ query, onQueryChange, onClose, allBookings, onApply }) {
   const inputRef = useRef(null);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const suggestions = buildSuggestions(allBookings);

   useEffect(() => { inputRef.current?.focus(); }, []);

   const filtered = query.trim().length > 0
      ? suggestions.filter(s => s.label.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
      : suggestions.slice(0, 7);

   const highlight = (text) => {
      if (!query.trim()) return text;
      const idx = text.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) return text;
      return (
         <>
            {text.slice(0, idx)}
            <span className="font-semibold text-[#0A6C6D]">{text.slice(idx, idx + query.length)}</span>
            {text.slice(idx + query.length)}
         </>
      );
   };

   return (
      <div className="relative border-b border-gray-200">
         <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gray-50">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
               ref={inputRef}
               type="text"
               value={query}
               onChange={e => { onQueryChange(e.target.value); setShowSuggestions(true); }}
               onFocus={() => setShowSuggestions(true)}
               onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
               placeholder="Search by vendor name or type..."
               className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            {query && (
               <button onClick={() => onQueryChange('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
               </button>
            )}
            <button onClick={onClose} className="ml-1 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors">
               Cancel
            </button>
         </div>

         {showSuggestions && filtered.length > 0 && (
            <div className="absolute left-0 right-0 bg-white border border-gray-200 border-t-0 rounded-b-xl shadow-lg z-30 overflow-hidden cards-enter">
               <p className="px-4 pt-2.5 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Suggestions
               </p>
               {filtered.map((s, i) => (
                  <button
                     key={i}
                     onMouseDown={() => { onApply(s); setShowSuggestions(false); }}
                     className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors text-left group"
                  >
                     {/* Icon badge */}
                     <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-teal-100 transition-colors flex-shrink-0">
                        <SuggestionRowIcon kind={s.kind} label={s.label} />
                     </span>
                     {/* Name only — no sub-label */}
                     <span className="text-sm text-gray-800">{highlight(s.label)}</span>
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}


// ─── Filter Panel ─────────────────────────────────────────────────────────────

const RESERVATION_TYPES = ['All', 'Hotel', 'Restaurant', 'Club'];

function FilterPanel({ typeFilter, onTypeChange, dateFrom, dateTo, onDateFrom, onDateTo, onReset }) {
   const hasActive = typeFilter !== 'All' || dateFrom || dateTo;

   return (
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 space-y-4 cards-enter">
         {/* Reservation type */}
         <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Reservation type</p>
            <div className="flex flex-wrap gap-2">
               {RESERVATION_TYPES.map(t => {
                  const isActive = typeFilter === t;
                  return (
                     <button
                        key={t}
                        onClick={() => onTypeChange(t)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 ${
                           isActive
                              ? 'bg-[#0A6C6D] text-white border-[#0A6C6D]'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-[#0A6C6D] hover:text-[#0A6C6D]'
                        }`}
                     >
                        {t !== 'All' && (
                           <span className={`flex items-center ${isActive ? '[&_svg]:text-black' : ''}`}>
                              {/* {TYPE_ICON[t]} */}
                           </span>
                        )}
                        {t}
                     </button>
                  );
               })}
            </div>
         </div>

         {/* Date range */}
         <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date range</p>
            <div className="flex items-center gap-3 flex-wrap">
               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-black" />
                  <input
                     type="date"
                     value={dateFrom}
                     onChange={e => onDateFrom(e.target.value)}
                     className="text-sm text-gray-700 outline-none bg-transparent"
                  />
               </div>
               <span className="text-gray-400 text-sm">to</span>
               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-black" />
                  <input
                     type="date"
                     value={dateTo}
                     min={dateFrom}
                     onChange={e => onDateTo(e.target.value)}
                     className="text-sm text-gray-700 outline-none bg-transparent"
                  />
               </div>
               {hasActive && (
                  <button onClick={onReset} className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">
                     Clear all
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}


// ─── Main Page ────────────────────────────────────────────────────────────────

function BookingsPage() {
   const [activeTab, setActiveTab] = useState('upcoming');
   const [topTab, setTopTab] = useState('bookings');
   const [bookings, setBookings] = useState({});
   const user = useSelector((state) => state.auth.user);
   const [isLoading, setIsLoading] = useState(true);
   const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [searchVendor, setSearchVendor] = useState('');
   const [searchType, setSearchType] = useState('');
   const [typeFilter, setTypeFilter] = useState('All');
   const [dateFrom, setDateFrom] = useState('');
   const [dateTo, setDateTo] = useState('');
   const [showSearch, setShowSearch] = useState(false);
   const [showFilter, setShowFilter] = useState(false);

   const upcomingBookings = bookings.upcoming ?? [];
   const pastBookings     = bookings.past ?? [];
   const allBookings      = [...upcomingBookings, ...pastBookings];
   const rawBookings      = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

   const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this booking?')) {
         setBookings((prev) => ({
            ...prev,
            upcoming: prev.upcoming?.filter((b) => b._id !== id),
            past:     prev.past?.filter((b) => b._id !== id),
         }));
      }
   };

   const handleSuggestionApply = (suggestion) => {
      setSearchQuery(suggestion.label);
      if (suggestion.kind === 'vendor') {
         setSearchVendor(suggestion.value);
         setSearchType('');
      } else if (suggestion.kind === 'type') {
         setSearchType(suggestion.value);
         setSearchVendor('');
         setTypeFilter(suggestion.value);
      }
   };

   const handleQueryChange = (val) => {
      setSearchQuery(val);
      if (!val) { setSearchVendor(''); setSearchType(''); }
   };

   const handleCloseSearch = () => {
      setShowSearch(false);
      setSearchQuery('');
      setSearchVendor('');
      setSearchType('');
   };

   const displayBookings = rawBookings.filter((booking) => {
      const vendorName      = booking.vendor?.businessName?.toLowerCase() ?? '';
      const matchesVendor   = !searchVendor || vendorName === searchVendor.toLowerCase();
      const q               = (!searchVendor && !searchType) ? searchQuery.toLowerCase().trim() : '';
      const matchesFreeText = !q || vendorName.includes(q) ||
         normaliseType(booking.reservationType).toLowerCase().includes(q);
      const effectiveType   = searchType || (typeFilter !== 'All' ? typeFilter : '');
      const matchesType     = !effectiveType ||
         normaliseType(booking.reservationType).toLowerCase() === effectiveType.toLowerCase();
      const bookingDate     = getBookingDate(booking);
      const matchesFrom     = !dateFrom || (bookingDate && bookingDate >= new Date(dateFrom));
      const matchesTo       = !dateTo   || (bookingDate && bookingDate <= new Date(dateTo + 'T23:59:59'));
      return matchesVendor && matchesFreeText && matchesType && matchesFrom && matchesTo;
   });

   const isFiltered = searchQuery.trim() !== '' || typeFilter !== 'All' || dateFrom !== '' || dateTo !== '';

   const activeFilterCount = [
      searchQuery.trim() !== '',
      typeFilter !== 'All',
      dateFrom !== '' || dateTo !== '',
   ].filter(Boolean).length;

   const resetFilters = () => { setTypeFilter('All'); setDateFrom(''); setDateTo(''); };

   useEffect(() => {
      setSearchQuery(''); setSearchVendor(''); setSearchType('');
      setTypeFilter('All'); setDateFrom(''); setDateTo('');
      setShowSearch(false); setShowFilter(false);
   }, [activeTab]);

   useEffect(() => {
      const fetchBookings = async () => {
         try {
            const res = await userService.fetchReservations({ userId: user._id });
            setBookings(res.data);
         } catch (err) {
            console.log(err);
            toast.error('Failed to fetch bookings');
         } finally {
            setIsLoading(false);
         }
      };
      fetchBookings();
   }, []);
     const navigates = (path) => {
       navigate(path);
     };
   
     useEffect(() => {
       const fetchUserData = async () => {
         try {
           setIsLoading(true);
           if (user.isAuthenticated) {
             setProfile(user.user);
           }
         } catch (error) {
           console.log(error);
         } finally {
           setIsLoading(false);
         }
       };
       fetchUserData();
     }, [user]);
   
     const handleLogout = async () => {
       console.log("Attempting to logout");
       dispatch(logout());
       setProfile(null);
     };
   
     useEffect(() => {
       const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
           setIsMenuOpen(false);
         }
       };
       if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
       return () => document.removeEventListener("mousedown", handleClickOutside);
     }, [isMenuOpen]);
   
 const footer = [
    {
      title: "Home",
      icon: <Home />,
      link: "/",
    },
    {
      title: "Moments",
      icon: <CalendarClock />,
      link: "/bookings",
    },
    {
      title: "Search",
      icon: <Search />,
      link: "/search",
    },
    {
      title: "Profile",
      icon: (
        <div className="relative text-gray-700" ref={dropdownRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center space-x-1`}
          >
            {isLoading ? (
              <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
            ) : (
              <>
                {profile ? (
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={profile.profilePic}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="text-xs">
                      {profile.firstName[0].toUpperCase()}
                      {profile.lastName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="w-6 h-6 text-gray-400 bg-gray-200 rounded-full p-1" />
                )}
              </>
            )}
            {isMenuOpen ? (
              <ChevronUp className={`w-5 h-5 text-gray-700`} />
            ) : (
              <ChevronDown className={`w-5 h-5 text-gray-700`} />
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-full right-0 mt-2 w-72 z-50">
              <UserProfileMenu
                onClose={() => setIsMenuOpen(false)}
                navigate={navigates}
                isAuthenticated={user.isAuthenticated}
                handleLogout={handleLogout}
                user={profile}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

   return (
      <div className="min-h-screen">
         <Header />

         <style>{`
            @keyframes fadeSlideIn {
               from { opacity: 0; transform: translateY(8px); }
               to   { opacity: 1; transform: translateY(0); }
            }
            .cards-enter { animation: fadeSlideIn 0.3s ease forwards; }
         `}</style>

         <div className="max-w-7xl mx-auto px-4 mt-28 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* Back + Title */}
            <div className="mb-10">
               <button
                  onClick={() => navigate('/')}
                  className="group flex items-center gap-3 text-gray-900 transition-colors"
               >
                  <ArrowLeft className="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-1" />
                  <h1 className="text-xl sm:text-2xl font-normal sm:font-semibold tracking-tight">
                     Reservations History
                  </h1>
               </button>
            </div>

            {isLoading ? (
               <BookingsSkeleton />
            ) : (
               <>
                  {/* Top toggle */}
                  <Tabs
                     value={topTab}
                     onValueChange={(value) => {
                        setTopTab(value);
                        setActiveTab(value === 'bookings' ? 'upcoming' : 'past');
                     }}
                     className="mb-6 flex justify-center items-center"
                  >
                     <TabsList className="relative bg-white rounded-full border border-gray-300 px-1.5 py-2 h-auto gap-1 mb-2">
                        <TabsTrigger
                           value="bookings"
                           className="relative rounded-full px-6 py-5 text-sm font-medium
                              transition-all duration-300 ease-in-out text-gray-500
                              data-[state=active]:text-gray-900 data-[state=active]:bg-blue-100
                              data-[state=active]:border-blue-400 data-[state=active]:shadow-sm
                              data-[state=active]:scale-[1.03]"
                        >
                           Bookings
                        </TabsTrigger>
                        <TabsTrigger
                           value="reservation"
                           className="relative rounded-full px-6 py-5 text-sm font-medium
                              transition-all duration-300 ease-in-out text-gray-500
                              data-[state=active]:text-gray-900 data-[state=active]:bg-blue-100
                              data-[state=active]:border-blue-400 data-[state=active]:shadow-sm
                              data-[state=active]:scale-[1.03]"
                        >
                           Reservation
                        </TabsTrigger>
                     </TabsList>
                  </Tabs>

                  <div className="overflow-visible">
                     <div className="border rounded-t-2xl border-gray-200">
                        <div className="flex items-center justify-between px-4 sm:px-6">
                           <div className="flex items-center gap-6 overflow-x-auto">
                              <button
                                 onClick={() => setActiveTab('upcoming')}
                                 className={`flex items-center gap-2 pb-4 pt-4 px-2 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                                    activeTab === 'upcoming'
                                       ? 'border-[#0A6C6D] text-[#0A6C6D]'
                                       : 'border-transparent text-gray-600 hover:text-gray-900'
                                 }`}
                              >
                                 <span className="font-medium">Upcoming Bookings</span>
                                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    activeTab === 'upcoming' ? 'bg-gray-100 text-[#0A6C6D]' : 'bg-gray-100 text-gray-700'
                                 }`}>{upcomingBookings.length}</span>
                              </button>

                              <button
                                 onClick={() => setActiveTab('past')}
                                 className={`flex items-center gap-2 pb-4 pt-2 px-2 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                                    activeTab === 'past'
                                       ? 'border-[#0A6C6D] text-[#0A6C6D]'
                                       : 'border-transparent text-gray-600 hover:text-gray-900'
                                 }`}
                              >
                                 <span className="font-medium">Past Bookings</span>
                                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    activeTab === 'past' ? 'bg-gray-100 text-[#0A6C6D]' : 'bg-gray-100 text-gray-700'
                                 }`}>{pastBookings.length}</span>
                              </button>

                              <button className="pb-4 pt-2 px-2 text-gray-600 hover:text-gray-900 transition-colors">
                                 <MoreVertical className="w-5 h-5" />
                              </button>
                           </div>

                           <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                              <button
                                 onClick={() => { setShowSearch(p => !p); setShowFilter(false); }}
                                 className={`p-2 rounded-lg transition-colors ${
                                    showSearch || searchQuery
                                       ? 'bg-teal-50 text-[#0A6C6D]'
                                       : 'hover:bg-gray-100 text-gray-600'
                                 }`}
                              >
                                 <Search className="w-5 h-5" />
                              </button>

                              <button
                                 onClick={() => { setShowFilter(p => !p); setShowSearch(false); }}
                                 className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    showFilter || activeFilterCount > 0
                                       ? 'bg-teal-50 text-[#0A6C6D]'
                                       : 'hover:bg-gray-100 text-gray-600'
                                 }`}
                              >
                                 <SlidersHorizontal className="w-5 h-5" />
                                 <span className="hidden sm:inline text-sm font-medium">Filter</span>
                                 {activeFilterCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0A6C6D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                       {activeFilterCount}
                                    </span>
                                 )}
                              </button>
                           </div>
                        </div>

                        {showSearch && (
                           <SearchPanel
                              query={searchQuery}
                              onQueryChange={handleQueryChange}
                              onClose={handleCloseSearch}
                              allBookings={allBookings}
                              onApply={handleSuggestionApply}
                           />
                        )}

                        {showFilter && (
                           <FilterPanel
                              typeFilter={typeFilter}
                              onTypeChange={setTypeFilter}
                              dateFrom={dateFrom}
                              dateTo={dateTo}
                              onDateFrom={setDateFrom}
                              onDateTo={setDateTo}
                              onReset={resetFilters}
                           />
                        )}
                     </div>

                     {/* Active filter chips */}
                     {isFiltered && (
                        <div className="flex flex-wrap gap-2 pt-3 pb-1 cards-enter">
                           {searchQuery && (
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-[#0A6C6D] text-xs font-medium rounded-full border border-teal-200">
                                 <Search className="w-3 h-3" /> {searchQuery}
                                 <button onClick={() => { setSearchQuery(''); setSearchVendor(''); setSearchType(''); }}>
                                    <X className="w-3 h-3" />
                                 </button>
                              </span>
                           )}
                           {typeFilter !== 'All' && (
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-[#0A6C6D] text-xs font-medium rounded-full border border-teal-200">
                                 <span className="flex items-center [&_svg]:w-3 [&_svg]:h-3">{TYPE_ICON[typeFilter]}</span>
                                 {typeFilter}
                                 <button onClick={() => { setTypeFilter('All'); setSearchType(''); if (searchType) setSearchQuery(''); }}>
                                    <X className="w-3 h-3" />
                                 </button>
                              </span>
                           )}
                           {(dateFrom || dateTo) && (
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-[#0A6C6D] text-xs font-medium rounded-full border border-teal-200">
                                 <Calendar className="w-3 h-3" />
                                 {dateFrom ? formatDateShort(dateFrom) : '…'} → {dateTo ? formatDateShort(dateTo) : '…'}
                                 <button onClick={() => { setDateFrom(''); setDateTo(''); }}>
                                    <X className="w-3 h-3" />
                                 </button>
                              </span>
                           )}
                        </div>
                     )}

                     {/* Booking cards */}
                     <div key={`${activeTab}-${searchQuery}-${typeFilter}-${dateFrom}-${dateTo}`} className="pt-4 cards-enter">
                        {displayBookings.length === 0 ? (
                           <EmptyState type={activeTab} isFiltered={isFiltered} />
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
               </>
            )}
         </div>

         <div className={`${profile && "hidden"} md:block`}>
                <Footer />
              </div>
              {profile && (
                <div className="fixed bottom-0 left-0 w-full bg-white py-2 flex items-center justify-center gap-12 border-t md:hidden z-50">
                  {footer.map((item, i) => (
                    <button
                      onClick={() => item.link && navigate(item.link)}
                      key={i}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <div className="flex items-center gap-1 flex-col ">
                        <div>{item.icon}</div>
                        <span className="text-xs">{item.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
      </div>
   );
}

export default BookingsPage;