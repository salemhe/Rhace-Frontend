import { BookingsIcon, GuestsIcon, PendingPaymentIcon, PrepaidIcon } from '@/public/icons/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { reservationService } from '@/services/reservation.service';
import { formatDate, formatTime } from '@/utils/formatDate';
import { capitalize } from '@/utils/helper';
import { ChevronRight, Clock, ExternalLink, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ClubDashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Daily');
  const [revenueFilter, setRevenueFilter] = useState('Weekly');
  const [reservationStats, setReservationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const vendor = useSelector((state) => state.auth.vendor);

  // Stats configuration for display
  const statsConfig = [
    {
      title: 'Bookings Made Today',
      icon: BookingsIcon,
      iconColors: "#60A5FA",
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Prepaid Bookings',
      icon: PrepaidIcon,
      iconColors: "#06CD02",
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Expected Guests Today',
      icon: GuestsIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Pending Payments',
      icon: PendingPaymentIcon,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    }
  ];

 

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await reservationService.getSummary();
        console.log('Summary Data:', res);
        setReservationStats(res.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        // Use dummy data if backend fails
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Generate chart data from backend trends
  const getChartData = () => {
    if (!reservationStats?.reservationTrends?.daily) return [];
    
    return reservationStats.reservationTrends.daily.map(item => ({
      day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: item.count,
      fullDate: item.date
    }));
  };

  // Generate donut chart path
  const generateDonutPath = (value, total) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const dashArray = (percentage / 100) * circumference;

    return { dashArray, circumference, percentage };
  };

  // Calculate upcoming reservations (within 30 minutes)
  const getUpcomingReservations = () => {
    if (!reservationStats?.todaysReservations) return [];
    
    const now = new Date();
    return reservationStats.todaysReservations.filter(reservation => {
      const reservationDateTime = new Date(`${reservation.date.split('T')[0]}T${reservation.time}`);
      const diffMinutes = (reservationDateTime - now) / (1000 * 60);
      return diffMinutes > 0 && diffMinutes <= 30;
    });
  };

  // Calculate total revenue from drinks and combos
  const calculateTotalRevenue = () => {
    if (!reservationStats) return 0;
    
    const drinksRevenue = (reservationStats.clubDrinksBreakdown || []).reduce(
      (sum, item) => sum + (item.totalRevenue || 0), 0
    );
    const combosRevenue = (reservationStats.clubCombosBreakdown || []).reduce(
      (sum, item) => sum + (item.totalRevenue || 0), 0
    );
    
    return drinksRevenue + combosRevenue;
  };

  // Prepare revenue breakdown data
  const getRevenueBreakdown = () => {
    if (!reservationStats) return { items: [], total: 0 };
    
    const drinks = reservationStats.clubDrinksBreakdown || [];
    const combos = reservationStats.clubCombosBreakdown || [];
    
    const totalRevenue = calculateTotalRevenue();
    
    const items = [
      ...drinks.map(item => ({
        category: item.drinkName,
        amount: item.totalRevenue || 0,
        percentage: totalRevenue > 0 ? ((item.totalRevenue || 0) / totalRevenue * 100).toFixed(1) : 0,
        color: 'bg-teal-600',
        quantity: item.quantity
      })),
      ...combos.map(item => ({
        category: item.comboName,
        amount: item.totalRevenue || 0,
        percentage: totalRevenue > 0 ? ((item.totalRevenue || 0) / totalRevenue * 100).toFixed(1) : 0,
        color: 'bg-yellow-400',
        quantity: item.quantity
      }))
    ].sort((a, b) => b.amount - a.amount);
    
    return { items, total: totalRevenue };
  };

  if (loading) {
    return (
      <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
        <UniversalLoader fullscreen />
      </DashboardLayout>
    );
  }

  const chartData = getChartData();
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 1;
  const upcomingReservations = getUpcomingReservations();
  const revenueData = getRevenueBreakdown();

  return (
    <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
      <div className="min-h-screen bg-gray-50 p-2 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Alert Banner */}
          {showAlert && upcomingReservations.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                <p className="text-yellow-800 text-sm font-medium">
                  {upcomingReservations.length} Booking{upcomingReservations.length > 1 ? 's' : ''} commencing in the next 30 minutes
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
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome Back, {capitalize(vendor.businessName)}!
              </h1>
              <p className="text-gray-600 mt-1">Here's what is happening at your club today.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border border-gray-200">
            {reservationStats.todayStats.map((stat, index) => {
              const Icon = statsConfig[index].icon;
              return (
                <div key={index} className="flex justify-between p-5">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{statsConfig[index].title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {index === 3
                        ? `₦${stat.details.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : stat.details}
                    </p>
                    <p
                      className={`text-sm flex items-center ${
                        stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      <span className="mr-1">{stat.change >= 0 ? '↑' : '↓'}</span>
                      {Math.abs(stat.change)}% vs last week
                    </p>
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 ${statsConfig[index].bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon
                        className={`w-6 h-6 ${statsConfig[index].iconColor}`}
                        colors={statsConfig[index].iconColors}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Bookings */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Today's Bookings</h3>
                <a
                  href={`/dashboard/${vendor.vendorType}/reservations`}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="p-5 space-y-3">
                {reservationStats.todaysReservations.length > 0 ? (
                  reservationStats.todaysReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{reservation.customerName}</p>
                          <p className="text-xs text-gray-500">Code: {reservation.bookingCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{formatDate(reservation.date)}</p>
                          <p className="text-xs text-gray-500">{reservation.time}</p>
                        </div>
                        <div className="text-center min-w-[70px]">
                          <p className="text-sm font-medium text-gray-900">
                            {reservation.guests} Guest{reservation.guests !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="min-w-[90px]">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                              reservation.reservationStatus === 'Upcoming'
                                ? 'bg-teal-50 text-teal-700'
                                : reservation.reservationStatus === 'Completed'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {reservation.reservationStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No bookings for today yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Trends */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Last 7 Days</span>
                </div>
              </div>
              <div className="p-5">
                {chartData.length > 0 ? (
                  <>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Daily Bookings</span>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {reservationStats.reservationTrends.last7Days}
                    </p>
                    <p
                      className={`text-sm mb-6 flex items-center ${
                        reservationStats.reservationTrends.trendChange >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      <span className="mr-1">
                        {reservationStats.reservationTrends.trendChange >= 0 ? '↑' : '↓'}
                      </span>
                      {Math.abs(reservationStats.reservationTrends.trendChange)}% vs previous 7 days
                    </p>

                    {/* Bar Chart */}
                    <div className="flex items-end justify-between h-40 gap-2">
                      {chartData.map((item, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center justify-end h-full group"
                        >
                          <div className="w-full flex flex-col justify-end relative" style={{ height: '100%' }}>
                            <div
                              className="w-full mx-auto bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all duration-300 hover:from-teal-700 hover:to-teal-500 cursor-pointer"
                              style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`, minHeight: item.value > 0 ? '8px' : '0' }}
                              title={`${item.value} bookings`}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 mt-2">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No booking data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Frequency */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Customer Frequency</h3>
              </div>

              <div className="p-5 flex flex-col items-center">
                {(() => {
                  const newCustomers = reservationStats.customerFrequency.new || 0;
                  const returningCustomers = reservationStats.customerFrequency.returning || 0;
                  const total = newCustomers + returningCustomers;

                  const newPercentage = total > 0 ? ((newCustomers / total) * 100).toFixed(1) : 0;
                  const returningPercentage = total > 0 ? ((returningCustomers / total) * 100).toFixed(1) : 0;

                  if (total === 0) {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <p>No customer data available</p>
                      </div>
                    );
                  }

                  const newPath = generateDonutPath(newCustomers, total);
                  const returningPath = generateDonutPath(returningCustomers, total);

                  return (
                    <>
                      <div className="relative w-48 h-48 mb-4">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="70"
                            fill="none"
                            stroke="#14b8a6"
                            strokeWidth="24"
                            strokeDasharray={`${newPath.dashArray} ${newPath.circumference}`}
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="70"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="24"
                            strokeDasharray={`${returningPath.dashArray} ${returningPath.circumference}`}
                            strokeDashoffset={-newPath.dashArray}
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-500 mb-1">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">{newPercentage}%</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">New Customers</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">{returningPercentage}%</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">Returning Customers</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Top Drinks */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Popular Drinks</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                {reservationStats.clubDrinksBreakdown && reservationStats.clubDrinksBreakdown.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {reservationStats.clubDrinksBreakdown.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>

                    <div className="space-y-3">
                      {reservationStats.clubDrinksBreakdown
                        .sort((a, b) => b.quantity - a.quantity)
                        .slice(0, 5)
                        .map((item, index) => {
                          const colors = ['bg-teal-600', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
                          const total = reservationStats.clubDrinksBreakdown.reduce((sum, d) => sum + d.quantity, 0);
                          const percentage = total > 0 ? ((item.quantity / total) * 100).toFixed(1) : 0;
                          
                          return (
                            <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                              <div className="flex items-center flex-1 min-w-0">
                                <div className={`w-3 h-3 rounded-sm ${colors[index % colors.length]} mr-2 flex-shrink-0`}></div>
                                <span className="text-gray-900 font-medium truncate">{item.drinkName}</span>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <span className="text-gray-600">{percentage}%</span>
                                <span className="text-gray-900 font-medium min-w-[50px] text-right">
                                  {item.quantity} sold
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No drink sales yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottle Sets & Combos */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Bottle Sets & Combos</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                {reservationStats.clubCombosBreakdown && reservationStats.clubCombosBreakdown.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {reservationStats.clubCombosBreakdown.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>

                    <div className="space-y-3">
                      {reservationStats.clubCombosBreakdown
                        .sort((a, b) => b.quantity - a.quantity)
                        .slice(0, 5)
                        .map((item, index) => {
                          const colors = ['bg-purple-600', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-cyan-500'];
                          const total = reservationStats.clubCombosBreakdown.reduce((sum, c) => sum + c.quantity, 0);
                          const percentage = total > 0 ? ((item.quantity / total) * 100).toFixed(1) : 0;
                          
                          return (
                            <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                              <div className="flex items-center flex-1 min-w-0">
                                <div className={`w-3 h-3 rounded-sm ${colors[index % colors.length]} mr-2 flex-shrink-0`}></div>
                                <span className="text-gray-900 font-medium truncate">{item.comboName}</span>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <span className="text-gray-600">{percentage}%</span>
                                <span className="text-gray-900 font-medium min-w-[50px] text-right">
                                  {item.quantity} sold
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No combo sales yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Revenue Breakdown - Full Width */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Revenue Breakdown</h3>
            </div>
            <div className="p-5">
              {revenueData.items.length > 0 ? (
                <>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900">
                      ₦{revenueData.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Revenue from Drinks & Combos</p>
                  </div>

                  {/* Color Bar */}
                  <div className="flex h-4 rounded-full overflow-hidden mb-6">
                    {revenueData.items.slice(0, 8).map((item, index) => {
                      const colors = ['bg-teal-600', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
                      return (
                        <div
                          key={index}
                          className={`${colors[index % colors.length]} transition-all duration-300 hover:opacity-80 cursor-pointer`}
                          style={{ width: `${item.percentage}%` }}
                          title={`${item.category}: ₦${item.amount.toLocaleString()}`}
                        />
                      );
                    })}
                  </div>

                  {/* Grid Layout for Revenue Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {revenueData.items.map((item, index) => {
                      const colors = ['bg-teal-600', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <div className={`w-3 h-3 rounded-sm ${colors[index % colors.length]} mr-2 flex-shrink-0`}></div>
                            <span className="text-gray-900 font-medium truncate">{item.category}</span>
                          </div>
                          <div className="flex flex-col items-end ml-4">
                            <span className="text-gray-900 font-semibold">
                              ₦{item.amount.toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {item.percentage}% • {item.quantity} sold
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No revenue data available</p>
                  <p className="text-sm mt-1">Start selling drinks and combos to see revenue breakdown</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClubDashboard;