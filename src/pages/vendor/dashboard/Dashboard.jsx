import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, User, Clock, X, ChevronRight, ExternalLink } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookingsIcon, GuestsIcon, PendingPaymentIcon, PrepaidIcon } from '@/assets/icons/icons';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { reservationService } from '@/services/reservation.service';
import { formatDate, formatTime } from '@/utils/formatDate';

const VendorDashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Weekly');
  const [revenueFilter, setRevenueFilter] = useState('Weekly');
  const [sourceFilter, setSourceFilter] = useState('Weekly');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reservationStats, setReservationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const vendor = useSelector((state) => state.auth.vendor);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Stats data
  const [stats, setStats] = useState([
    {
      title: 'Reservations made today',
      value: 32,
      change: 12,
      changeType: 'positive',
      icon: BookingsIcon,
      iconColors: "#60A5FA",
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Prepaid Reservations',
      value: 16,
      change: 8,
      changeType: 'positive',
      icon: PrepaidIcon,
      iconColors: "#06CD02",
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Expected Guests Today',
      value: 80,
      change: 8,
      changeType: 'positive',
      icon: GuestsIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Pending Payments',
      value: 2546.00,
      change: 5,
      changeType: 'negative',
      icon: PendingPaymentIcon,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    }
  ]);

  // Reservations data
  const [reservations, setReservations] = useState([
    { id: 1, name: 'Emily Johnson', reservationId: '#12345', date: 'June 5, 2025', time: '7:30 pm', guests: 4, status: 'Upcoming', statusColor: 'bg-teal-50 text-teal-700', minutesUntil: 45 },
    { id: 2, name: 'Michael Chen', reservationId: '#12346', date: 'June 5, 2025', time: '8:00 pm', guests: 2, status: 'Upcoming', statusColor: 'bg-teal-50 text-teal-700', minutesUntil: 75 },
    { id: 3, name: 'Sarah Williams', reservationId: '#12347', date: 'June 5, 2025', time: '7:15 pm', guests: 6, status: 'In 30 mins', statusColor: 'bg-yellow-50 text-yellow-700', minutesUntil: 28 },
    { id: 4, name: 'David Brown', reservationId: '#12348', date: 'June 5, 2025', time: '7:20 pm', guests: 3, status: 'In 30 mins', statusColor: 'bg-yellow-50 text-yellow-700', minutesUntil: 18 },
    { id: 5, name: 'Jessica Martinez', reservationId: '#12349', date: 'June 5, 2025', time: '7:10 pm', guests: 5, status: 'In 30 mins', statusColor: 'bg-yellow-50 text-yellow-700', minutesUntil: 8 }
  ]);

  // Chart data based on filter
  const getChartData = () => {
    if (timeFilter === 'Weekly') {
      return [
        { day: 'Mon', value: 25 },
        { day: 'Tues', value: 50 },
        { day: 'Wed', value: 45 },
        { day: 'Thurs', value: 30 },
        { day: 'Fri', value: 75 },
        { day: 'Sat', value: 85 },
        { day: 'Sun', value: 80 }
      ];
    } else {
      return [
        { day: 'Week 1', value: 180 },
        { day: 'Week 2', value: 220 },
        { day: 'Week 3', value: 195 },
        { day: 'Week 4', value: 240 }
      ];
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

  // Revenue data based on filter
  const getRevenueData = () => {
    if (revenueFilter === 'Weekly') {
      return {
        total: 220500,
        change: 8,
        items: [
          { category: 'Main Dish', percentage: 50, amount: 110000, color: 'bg-teal-600' },
          { category: 'Drinks', percentage: 22.7, amount: 50000, color: 'bg-red-500' },
          { category: 'Starters', percentage: 13.6, amount: 30000, color: 'bg-yellow-400' },
          { category: 'Desserts', percentage: 9.3, amount: 20500, color: 'bg-purple-500' },
          { category: 'Sides', percentage: 4.7, amount: 10000, color: 'bg-teal-300' }
        ]
      };
    } else {
      return {
        total: 952000,
        change: 12,
        items: [
          { category: 'Main Dish', percentage: 48, amount: 456960, color: 'bg-teal-600' },
          { category: 'Drinks', percentage: 24, amount: 228480, color: 'bg-red-500' },
          { category: 'Starters', percentage: 15, amount: 142800, color: 'bg-yellow-400' },
          { category: 'Desserts', percentage: 8, amount: 76160, color: 'bg-purple-500' },
          { category: 'Sides', percentage: 5, amount: 47600, color: 'bg-teal-300' }
        ]
      };
    }
  };

  const revenueData = getRevenueData();

  // Customer frequency based on filter
  const getCustomerData = () => {
    if (timeFilter === 'Weekly') {
      return { total: 100, new: 45, returning: 55 };
    } else {
      return { total: 430, new: 180, returning: 250 };
    }
  };

  const customerData = getCustomerData();

  // Reservation source based on filter
  const getSourceData = () => {
    if (sourceFilter === 'Weekly') {
      return {
        total: 100,
        sources: [
          { name: '50 websites', value: 50, color: 'bg-teal-600' },
          { name: '30 mobile', value: 30, color: 'bg-yellow-400' },
          { name: '20 walk-in', value: 20, color: 'bg-blue-400' }
        ]
      };
    } else {
      return {
        total: 430,
        sources: [
          { name: '220 websites', value: 51, color: 'bg-teal-600' },
          { name: '130 mobile', value: 30, color: 'bg-yellow-400' },
          { name: '80 walk-in', value: 19, color: 'bg-blue-400' }
        ]
      };
    }
  };

  const sourceData = getSourceData();

  // Calculate upcoming reservations count
  const upcomingCount = reservations.filter(r => r.minutesUntil <= 30).length;

  // Simulate new reservation
  const addNewReservation = () => {
    const names = ['John Doe', 'Jane Smith', 'Robert Taylor', 'Lisa Anderson', 'Tom Wilson'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomGuests = Math.floor(Math.random() * 6) + 2;
    const newId = Math.max(...reservations.map(r => r.id)) + 1;

    const newReservation = {
      id: newId,
      name: randomName,
      reservationId: `#${12345 + newId}`,
      date: 'June 5, 2025',
      time: '9:00 pm',
      guests: randomGuests,
      status: 'Upcoming',
      statusColor: 'bg-teal-50 text-teal-700',
      minutesUntil: 120
    };

    setReservations([newReservation, ...reservations.slice(0, 4)]);

    // Update stats
    setStats(prevStats => prevStats.map((stat, idx) => {
      if (idx === 0) return { ...stat, value: stat.value + 1 };
      if (idx === 2) return { ...stat, value: stat.value + randomGuests };
      return stat;
    }));
  };

  // Generate donut chart path
  const generateDonutPath = (percentage, offset = 0) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const dashArray = (percentage / 100) * circumference;
    const dashOffset = -offset;

    return { dashArray, dashOffset, circumference };
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await reservationService.getSummary()
        console.log('Summary Data:', res);
        setReservationStats(res.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [])

  if (loading) {
    return (
      <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg animate-pulse">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Alert Banner */}
          {showAlert && upcomingCount > 0 && (
            <div className="bg-yellow-50 border-l-3 border-yellow-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                <p className="text-yellow-800 text-sm font-medium">
                  {upcomingCount} Reservation{upcomingCount > 1 ? 's' : ''} commencing in the next 30 minutes
                </p>
              </div>
              <button onClick={() => setShowAlert(false)} className="text-yellow-600 hover:text-yellow-800">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Joseph!</h1>
              <p className="text-gray-600 mt-1">Here's what is happening today.</p>
            </div>
            {/* <div>
            <button onClick={addNewReservation} className="px-3 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700">Simulate Reservation</button>
          </div> */}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-4 gap-4  rounded-lg border border-gray-200 ">
            {reservationStats.todayStats.map((stat, index) => {
              const Icon = stats[index].icon; // ✅ Extract the component
              return (
                <div key={index} className="flex justify-between p-5">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stats[index].title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {index === 3
                        ? `$${stat.details.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                        : stat.details}
                    </p>
                    <p
                      className={`text-sm flex items-center ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      <span className="mr-1">{stat.change >= 0 ? '↑' : '↓'}</span>
                      {stat.change}% vs last week
                    </p>
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 ${stats[index].bgColor} rounded-lg flex items-center justify-center`}
                    >
                      {/* ✅ Correct component usage */}
                      <Icon
                        className={`w-6 h-6 ${stats[index].iconColor}`}
                        colors={stats[index].iconColors}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Reservations */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Today's Reservation</h3>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                {reservationStats.todaysReservations.map((reservation) => (
                  <div key={reservation._id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{reservation.customerName}</p>
                        <p className="text-xs text-gray-500">ID: #{reservation._id.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{formatDate(reservation.createdAt)}</p>
                        <p className="text-xs text-gray-500">Time: {formatTime(reservation.createdAt)}</p>
                      </div>
                      <div className="text-center min-w-[70px]">
                        <p className="text-sm font-medium text-gray-900">{reservation.guests} Guests</p>
                      </div>
                      <div className="min-w-[90px]">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${reservation.reservationStatus === 'Upcoming' ? 'bg-teal-50 text-teal-700' : reservation.reservationStatus === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>
                          {reservation.reservationStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservations Trends */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reservations Trends</h3>
                <div className="flex items-center gap-3">
                  <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white cursor-pointer"
                  >
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">This {timeFilter.toLowerCase().slice(0, -2)}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Last {timeFilter.toLowerCase().slice(0, -2)}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{chartData.reduce((sum, item) => sum + item.value, 0)}</p>
                <p className="text-sm text-green-600 mb-6 flex items-center">
                  <span className="mr-1">↑</span>
                  8% vs last {timeFilter.toLowerCase().slice(0, -2)}
                </p>

                {/* Bar Chart */}
                <div className="flex items-end justify-between h-40 gap-2">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group">
                      <div className="w-full flex flex-col justify-end relative" style={{ height: '100%' }}>
                        <div
                          className="w-16 mx-auto bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all duration-300 hover:from-teal-700 hover:to-teal-500 cursor-pointer"
                          style={{ height: `${(item.value / maxValue) * 100}%` }}
                          title={`${item.value} reservations`}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Frequency */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Customer Frequency</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white cursor-pointer"
                  >
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Donut Chart + Percentages */}
              <div className="p-5 flex flex-col items-center">
                {(() => {
                  // 🧮 Compute totals and percentages
                  const newCustomers = reservationStats.customerFrequency.new || 0;
                  const returningCustomers = reservationStats.customerFrequency.returning || 0;
                  const total = newCustomers + returningCustomers;

                  const newPercentage =
                    total > 0 ? ((newCustomers / total) * 100).toFixed(1) : 0;
                  const returningPercentage =
                    total > 0 ? ((returningCustomers / total) * 100).toFixed(1) : 0;

                  return (
                    <>
                      {/* Donut Chart */}
                      <div className="relative w-48 h-48 mb-4">
                        <svg className="w-full h-full -rotate-90">
                          {/* New Customers Segment */}
                          <circle
                            cx="96"
                            cy="96"
                            r="70"
                            fill="none"
                            stroke="#14b8a6"
                            strokeWidth="24"
                            strokeDasharray={`${generateDonutPath(newCustomers, total).dashArray
                              } ${generateDonutPath(newCustomers, total).circumference}`}
                          />

                          {/* Returning Customers Segment */}
                          <circle
                            cx="96"
                            cy="96"
                            r="70"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="24"
                            strokeDasharray={`${generateDonutPath(returningCustomers, total).dashArray
                              } ${generateDonutPath(returningCustomers, total).circumference}`}
                            strokeDashoffset={`${generateDonutPath(newCustomers, total).dashOffset
                              }`}
                          />
                        </svg>

                        {/* Center Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-500 mb-1">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Legend - Percentages */}
                      <div className="flex flex-col items-start gap-2">
                        {/* New Customers */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">{newPercentage}%</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            New Customers
                          </span>
                        </div>

                        {/* Returning Customers */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              {returningPercentage}%
                            </span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            Returning Customers
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>


            {/* Revenue (Menu Category) */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Revenue (Menu Category)</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={revenueFilter}
                    onChange={(e) => setRevenueFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white cursor-pointer"
                  >
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">#{revenueData.total.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">↑</span>
                    {revenueData.change}% vs last {revenueFilter.toLowerCase().slice(0, -2)}
                  </p>
                </div>

                {/* Color Bar */}
                <div className="flex h-3 rounded-full overflow-hidden mb-4">
                  {revenueData.items.map((item, index) => (
                    <div
                      key={index}
                      className={`${item.color} transition-all duration-300 hover:opacity-80 cursor-pointer`}
                      style={{ width: `${item.percentage}%` }}
                      title={`${item.category}: ₦${item.amount.toLocaleString()}`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {revenueData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-50 p-1 rounded transition-colors">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-sm ${item.color} mr-2`}></div>
                        <span className="text-gray-900 font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-900 font-medium">{item.percentage}%</span>
                        <span className="text-gray-500">(₦{item.amount.toLocaleString()})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reservation Source */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Reservation Source</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white cursor-pointer"
                  >
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <svg className="w-full h-full -rotate-90">
                    {sourceData.sources.map((source, index) => {
                      const offset = sourceData.sources.slice(0, index).reduce((sum, s) => sum + s.value, 0);
                      const paths = generateDonutPath(source.value, offset);
                      const colors = ['#14b8a6', '#fbbf24', '#60a5fa'];

                      return (
                        <circle
                          key={index}
                          cx="96"
                          cy="96"
                          r="70"
                          fill="none"
                          stroke={colors[index]}
                          strokeWidth="24"
                          strokeDasharray={`${paths.dashArray} ${paths.circumference}`}
                          strokeDashoffset={paths.dashOffset}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500 mb-1">Total Reservation</p>
                    <p className="text-2xl font-bold text-gray-900">{sourceData.total}</p>
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  {sourceData.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded transition-colors">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${source.color} rounded-full mr-2`}></div>
                        <span className="text-sm text-gray-900 font-medium">{source.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;