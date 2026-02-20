import { BookingsIcon, GuestsIcon, PendingPaymentIcon, PrepaidIcon } from '@/public/icons/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { reservationService } from '@/services/reservation.service';
import { formatDate, formatTime } from '@/utils/formatDate';
import { capitalize } from '@/utils/helper';
import { ChevronRight, Clock, ExternalLink, ListX, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StatCard } from '@/components/dashboard/stats/mainStats';
import { Calendar, CardPay, Cash2, Group3 } from '@/components/dashboard/ui/svg';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const VendorDashboard = () => {
  // const [showAlert, setShowAlert] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Weekly');
  const [revenueFilter, setRevenueFilter] = useState('Weekly');
  const [sourceFilter, setSourceFilter] = useState('Weekly');
  const [counters, setCounters] = useState(null);
  const [todaysReservations, setTodaysReservations] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [customerFrequency, setCustomerFrequency] = useState(null);
  const [revenueByCategory, setRevenueByCategory] = useState(null);
  const [reservationSources, setReservationSources] = useState(null);
  const [loading, setLoading] = useState(true);
  const vendor = useSelector((state) => state.auth.vendor);

  // Update current time every minute
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          countersRes,
          todaysReservationsRes,
          bookingTrendsRes,
          customerFrequencyRes,
          revenueByCategoryRes,
          reservationSourcesRes,
        ] = await Promise.all([
          reservationService.getReservationCounters(),
          reservationService.getTodaysReservations(),
          reservationService.getBookingTrends(),
          reservationService.getCustomerFrequency(),
          reservationService.getRevenueByCategory(),
          reservationService.getReservationSources(),
        ]);

        setCounters(countersRes);
        setTodaysReservations(todaysReservationsRes);
        setBookingTrends(bookingTrendsRes);
        setCustomerFrequency(customerFrequencyRes);
        setRevenueByCategory(revenueByCategoryRes);
        setReservationSources(reservationSourcesRes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats data
  const stats = [
    {
      title: 'Reservations made today',
      value: counters?.reservationsToday || 0,
      change: counters?.reservationsTodayChange || 0,
      changeType: (counters?.reservationsTodayChange || 0) >= 0 ? 'positive' : 'negative',
      icon: BookingsIcon,
      iconColors: '#60A5FA',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Prepaid Reservations',
      value: counters?.prepaidReservations || 0,
      change: counters?.prepaidReservationsChange || 0,
      changeType: (counters?.prepaidReservationsChange || 0) >= 0 ? 'positive' : 'negative',
      icon: PrepaidIcon,
      iconColors: '#06CD02',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Expected Guests Today',
      value: counters?.expectedGuestsToday || 0,
      change: counters?.expectedGuestsTodayChange || 0,
      changeType: (counters?.expectedGuestsTodayChange || 0) >= 0 ? 'positive' : 'negative',
      icon: GuestsIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Pending Payments',
      value: counters?.pendingPayments || 0,
      change: counters?.pendingPaymentsChange || 0,
      changeType: (counters?.pendingPaymentsChange || 0) >= 0 ? 'positive' : 'negative',
      icon: PendingPaymentIcon,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  // Chart data based on filter
  const currentBookingTrends = (timeFilter === 'Weekly' ? bookingTrends?.weekly : bookingTrends?.monthly) || [];

  const chartData = currentBookingTrends.map(item => ({
    day: item.day || item.week, // Assuming 'day' for weekly, 'week' for monthly
    this: item.value || 0, // Assuming 'value' is the current period's data
    last: item.previousValue || 0 // Assuming 'previousValue' exists for comparison, default to 0 if not
  }));

  // Calculate maxValue for the chart (considering both 'this' and 'last' values)
  const maxValue = Math.max(
    ...chartData.flatMap(item => [item.this || 0, item.last || 0]),
    0
  );
  
  // Calculate booking trends percentage change
  const thisTotalBookings = chartData.reduce((sum, item) => sum + (item.this || 0), 0);
  const lastTotalBookings = chartData.reduce((sum, item) => sum + (item.last || 0), 0);
  const bookingTrendsChange = lastTotalBookings > 0 
    ? (((thisTotalBookings - lastTotalBookings) / lastTotalBookings) * 100).toFixed(0)
    : 0;
  
  const chartConfig = {
    this: {
      label: "This week",
      color: "#60A5FA",
    },
    last: {
      label: "Last week",
      color: "#0A6C6D",
    },
  }

  // Revenue data based on filter
  const revenueData =
    (revenueFilter === 'Weekly' ? revenueByCategory?.weekly : revenueByCategory?.monthly) || {
      total: 0,
      change: 0,
      items: [],
    };

  // Reservation source based on filter
  const sourceData =
    (sourceFilter === 'Weekly' ? reservationSources?.weekly : reservationSources?.monthly) || {
      total: 0,
      sources: [],
    };

  // Generate donut chart path
  const generateDonutPath = (percentage, offset = 0) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const dashArray = (percentage / 100) * circumference;
    const dashOffset = -offset;

    return { dashArray, dashOffset, circumference };
  };

  if (loading) {
    return (
      <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
        <UniversalLoader fullscreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
      <div className="min-h-screen mb-14 bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {capitalize(vendor.businessName)}!</h1>
              <p className="text-gray-600 mt-1">Here's what is happening today.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border border-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between p-5">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {index === 3
                      ? `₦${stat.value.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : stat.value}
                  </p>
                  <p
                    className={`text-xs flex items-center ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <span className="mr-1">{stat.changeType === 'positive' ? '↑' : '↓'}</span>
                    {Math.abs(stat.change)}% vs last week
                  </p>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} colors={stat.iconColors} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Reservations */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Today's Reservation</h3>
                <a href={`/dashboard/${vendor.vendorType}/reservation`} className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="p-5 space-y-3">
                {todaysReservations.length > 0 ? todaysReservations.slice(0, 5).map((reservation) => (
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
                )) : (
                  <div className='w-full h-[336px] flex items-center justify-center'>
                    <div className='flex items-center flex-col'>
                      <ListX className='size-6' />
                      <p>No Reservations for today</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reservations Trends */}
            <div className="bg-white rounded-lg border w-full hidden md:block border-gray-200">
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
              <div className="p-5 w-full">
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
                <p className="text-3xl font-bold text-gray-900 mb-1">{thisTotalBookings}</p>
                <p className={`text-sm mb-6 flex items-center ${bookingTrendsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{bookingTrendsChange >= 0 ? '↑' : '↓'}</span>
                  {Math.abs(bookingTrendsChange)}% vs last {timeFilter.toLowerCase().slice(0, -2)}
                </p>

                {/* Bar Chart */}
                <div className="">
                  <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar
                        dataKey="last"
                        stackId="a"
                        fill="#0A6C6D"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="this"
                        stackId="a"
                        fill="#60A5FA"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
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
                  const newCustomers = customerFrequency?.new || 0;
                  const returningCustomers = customerFrequency?.returning || 0;
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
                            strokeDasharray={`${generateDonutPath(newPercentage, total).dashArray
                              } ${generateDonutPath(newPercentage, total).circumference}`}
                          />

                          {/* Returning Customers Segment */}
                          <circle
                            cx="96"
                            cy="96"
                            r="70"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="24"
                            strokeDasharray={`${generateDonutPath(returningPercentage, total).dashArray
                              } ${generateDonutPath(returningPercentage, total).circumference}`}
                            strokeDashoffset={`${-generateDonutPath(newPercentage, total).dashArray
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
                            <span className="text-sm text-gray-600">{returningPercentage}%</span>
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

            {/* Revenue by Category */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Revenue by Category</h3>
                <select
                  value={revenueFilter}
                  onChange={(e) => setRevenueFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white cursor-pointer"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="p-5">
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  ₦{revenueData.total.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mb-4 flex items-center">
                  <span className="mr-1">↑</span>
                  {revenueData.change}% vs last {revenueFilter.toLowerCase().slice(0, -2)}
                </p>
                <div className="space-y-3">
                  {revenueData.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          ₦{item.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-teal-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reservation Source - Updated to match the donut chart style */}
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
                      const offset = sourceData.sources.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                      const paths = generateDonutPath(source.percentage, offset);
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
                  {sourceData.sources.map((source, index) => {
                    const colors = ['bg-teal-600', 'bg-yellow-400', 'bg-blue-400'];
                    return (
                      <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded transition-colors">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 ${colors[index]} rounded-full mr-2`}></div>
                          <span className="text-sm text-gray-900 font-medium">{source.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{source.percentage}%</span>
                      </div>
                    );
                  })}
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