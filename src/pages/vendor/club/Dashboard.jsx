import { BookingsIcon, GuestsIcon, PendingPaymentIcon, PrepaidIcon } from '@/public/icons/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { reservationService } from '@/services/reservation.service';
import { formatDate } from '@/utils/formatDate';
import { capitalize } from '@/utils/helper';
import { ChevronRight, Clock, ExternalLink, ListX, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const DRINK_COLORS = ['bg-teal-600', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];
const COMBO_COLORS = ['bg-purple-600', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-cyan-500'];
const SOURCE_COLORS = ['#14b8a6', '#fbbf24', '#60a5fa'];

const statsConfig = [
  { title: 'Bookings Made Today',    icon: BookingsIcon,       iconColors: '#60A5FA', bgColor: 'bg-blue-50',   iconColor: 'text-blue-600'   },
  { title: 'Prepaid Bookings',       icon: PrepaidIcon,        iconColors: '#06CD02', bgColor: 'bg-green-50',  iconColor: 'text-green-600'  },
  { title: 'Expected Guests Today',  icon: GuestsIcon,                                bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
  { title: 'Pending Payments',       icon: PendingPaymentIcon,                        bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
];

const chartConfig = {
  thisWeek: { label: 'This week', color: '#60A5FA' },
  lastWeek: { label: 'Last week', color: '#0A6C6D' },
};

const ClubDashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Weekly');
  const [revenueFilter, setRevenueFilter] = useState('Weekly');
  const [sourceFilter, setSourceFilter] = useState('Weekly');
  const [reservationStats, setReservationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const vendor = useSelector((state) => state.auth.vendor);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await reservationService.getSummary();
        setReservationStats(res.data);
      } catch (error) {
        console.error('Error fetching summary data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading || !reservationStats) {
    return (
      <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
        <UniversalLoader fullscreen />
      </DashboardLayout>
    );
  }

  // ── Derived data ─────────────────────────────────────────────────────────────

  // Recharts data — same shape as restaurant (thisWeek / lastWeek keys)
  const chartData =
    timeFilter === 'Weekly'
      ? reservationStats.reservationTrends.weekly
      : reservationStats.reservationTrends.monthly;

  const trendTotal = chartData.reduce((s, d) => s + d.thisWeek, 0);
  const trendChange = reservationStats.reservationTrends.trendChange;

  // Revenue from backend revenueData (real paid amounts, not quantity-based)
  const revenueData =
    revenueFilter === 'Weekly'
      ? reservationStats.revenueData.weekly
      : reservationStats.revenueData.monthly;

  // Source
  const sourceData =
    sourceFilter === 'Weekly'
      ? reservationStats.reservationSource.weekly
      : reservationStats.reservationSource.monthly;

  // Donut segment helper
  const generateDonutSegment = (count, total) => {
    const circumference = 2 * Math.PI * 70;
    return { dashArray: total > 0 ? (count / total) * circumference : 0, circumference };
  };

  // Upcoming reservations (within 30 min) for alert banner
  const upcomingReservations = (reservationStats.todaysReservations || []).filter((r) => {
    if (!r.date || !r.time) return false;
    const dt = new Date(`${r.date.split('T')[0]}T${r.time}`);
    const diff = (dt - new Date()) / 60000;
    return diff > 0 && diff <= 30;
  });

  // Drinks — sorted by quantity descending
  const drinks = [...(reservationStats.clubDrinksBreakdown || [])].sort(
    (a, b) => b.quantity - a.quantity,
  );
  const totalDrinkQty = drinks.reduce((s, d) => s + d.quantity, 0);

  // Combos — backend returns `count` (not quantity) for combos
  const combos = [...(reservationStats.clubCombosBreakdown || [])].sort(
    (a, b) => b.count - a.count,
  );
  const totalComboCount = combos.reduce((s, c) => s + c.count, 0);

  // Customer frequency
  const newC = reservationStats.customerFrequency?.new || 0;
  const retC = reservationStats.customerFrequency?.returning || 0;
  const freqTotal = newC + retC;
  const newSeg = generateDonutSegment(newC, freqTotal);
  const retSeg = generateDonutSegment(retC, freqTotal);

  return (
    <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>
      <div className="min-h-screen bg-gray-50 p-2 md:p-6 mb-14">
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back, {capitalize(vendor.businessName)}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what is happening at your club today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border border-gray-200">
            {reservationStats.todayStats.map((stat, index) => {
              const Icon = statsConfig[index].icon;
              return (
                <div key={index} className="flex justify-between p-5 border-b lg:border-b-0 lg:border-r border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{statsConfig[index].title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {index === 3
                        ? `₦${stat.details.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : stat.details}
                    </p>
                    <p className={`text-sm flex items-center ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-1">{stat.change >= 0 ? '↑' : '↓'}</span>
                      {Math.abs(stat.change)}% vs last week
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${statsConfig[index].bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${statsConfig[index].iconColor}`} colors={statsConfig[index].iconColors} />
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
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="p-5 space-y-3">
                {reservationStats.todaysReservations.length > 0
                  ? reservationStats.todaysReservations.slice(0, 5).map((reservation) => (
                      <div key={reservation._id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
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
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                              reservation.reservationStatus === 'upcoming' ? 'bg-teal-50 text-teal-700'
                              : reservation.reservationStatus === 'completed' ? 'bg-green-50 text-green-700'
                              : 'bg-gray-50 text-gray-700'
                            }`}>
                              {reservation.reservationStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  : (
                    <div className="h-48 flex flex-col items-center justify-center gap-2">
                      <ListX className="size-6 text-gray-400" />
                      <p className="text-sm text-gray-500">No bookings for today yet</p>
                    </div>
                  )}
              </div>
            </div>

            {/* Booking Trends — Recharts (same as restaurant) */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
                <div className="flex items-center gap-3">
                  <a href={`/dashboard/${vendor.vendorType}/reservations`} className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
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
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">This {timeFilter === 'Weekly' ? 'week' : 'month'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-600 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">Last {timeFilter === 'Weekly' ? 'week' : 'month'}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{trendTotal}</p>
                <p className={`text-sm mb-6 flex items-center ${trendChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{trendChange >= 0 ? '↑' : '↓'}</span>
                  {Math.abs(trendChange)}% vs last {timeFilter === 'Weekly' ? 'week' : 'month'}
                </p>
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="lastWeek" stackId="a" fill="#0A6C6D" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="thisWeek" stackId="a" fill="#60A5FA" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Customer Frequency */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Customer Frequency</h3>
              </div>
              <div className="p-5 flex flex-col items-center">
                {freqTotal === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-2">
                    <ListX className="size-5 text-gray-400" />
                    <p className="text-sm text-gray-500">No customer data available</p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-48 h-48 mb-4">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="96" cy="96" r="70" fill="none" stroke="#E5E7EB" strokeWidth="24" />
                        <circle cx="96" cy="96" r="70" fill="none" stroke="#14b8a6" strokeWidth="24"
                          strokeDasharray={`${newSeg.dashArray} ${newSeg.circumference}`}
                          strokeDashoffset={0}
                        />
                        <circle cx="96" cy="96" r="70" fill="none" stroke="#fbbf24" strokeWidth="24"
                          strokeDasharray={`${retSeg.dashArray} ${retSeg.circumference}`}
                          strokeDashoffset={-(newSeg.dashArray)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs text-gray-500 mb-1">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-900">{freqTotal.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-teal-500 rounded-full mr-2" />
                          <span className="text-sm text-gray-600">
                            {freqTotal > 0 ? ((newC / freqTotal) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 font-medium">New Customers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2" />
                          <span className="text-sm text-gray-600">
                            {freqTotal > 0 ? ((retC / freqTotal) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 font-medium">Returning Customers</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Popular Drinks */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Popular Drinks</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                {drinks.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-2">
                    <ListX className="size-5 text-gray-400" />
                    <p className="text-sm text-gray-500">No drink sales yet</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">{totalDrinkQty}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="space-y-3">
                      {drinks.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className={`w-3 h-3 rounded-sm ${DRINK_COLORS[i % DRINK_COLORS.length]} mr-2 flex-shrink-0`} />
                            <span className="text-gray-900 font-medium truncate">{item.drinkName}</span>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-gray-600">
                              {totalDrinkQty > 0 ? ((item.quantity / totalDrinkQty) * 100).toFixed(1) : 0}%
                            </span>
                            <span className="text-gray-900 font-medium min-w-[60px] text-right">
                              {item.quantity} sold
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
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
                {combos.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-2">
                    <ListX className="size-5 text-gray-400" />
                    <p className="text-sm text-gray-500">No combo sales yet</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">{totalComboCount}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="space-y-3">
                      {combos.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className={`w-3 h-3 rounded-sm ${COMBO_COLORS[i % COMBO_COLORS.length]} mr-2 flex-shrink-0`} />
                            <span className="text-gray-900 font-medium truncate">{item.comboName}</span>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-gray-600">
                              {totalComboCount > 0 ? ((item.count / totalComboCount) * 100).toFixed(1) : 0}%
                            </span>
                            <span className="text-gray-900 font-medium min-w-[60px] text-right">
                              {item.count} sold
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Revenue Breakdown — from real backend revenueData */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Revenue Breakdown</h3>
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
              {revenueData.items.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center gap-2">
                  <ListX className="size-5 text-gray-400" />
                  <p className="text-sm text-gray-500">No revenue data available</p>
                  <p className="text-xs text-gray-400">Start taking paid bookings to see revenue breakdown</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900">
                      ₦{revenueData.total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-sm mt-1 flex items-center ${revenueData.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-1">{revenueData.change >= 0 ? '↑' : '↓'}</span>
                      {Math.abs(revenueData.change).toFixed(1)}% vs last {revenueFilter === 'Weekly' ? 'week' : 'month'}
                    </p>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden mb-6">
                    {revenueData.items.map((item, i) => (
                      <div
                        key={i}
                        className={`${item.color} transition-all duration-300 hover:opacity-80 cursor-pointer`}
                        style={{ width: `${item.percentage}%` }}
                        title={`${item.category}: ₦${item.amount.toLocaleString()}`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {revenueData.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className={`w-3 h-3 rounded-sm ${item.color} mr-2 flex-shrink-0`} />
                          <span className="text-gray-900 font-medium truncate">{item.category}</span>
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <span className="text-gray-900 font-semibold">
                            ₦{item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-gray-500 text-xs">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reservation Source */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Booking Source</h3>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white cursor-pointer"
              >
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="p-5 flex flex-col items-center">
              {sourceData.total === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center gap-2">
                  <ListX className="size-5 text-gray-400" />
                  <p className="text-sm text-gray-500">No booking data yet</p>
                </div>
              ) : (
                <>
                  <div className="relative w-48 h-48 mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="96" cy="96" r="70" fill="none" stroke="#E5E7EB" strokeWidth="24" />
                      {sourceData.sources.map((source, i) => {
                        const preceding = sourceData.sources.slice(0, i).reduce((s, src) => s + src.count, 0);
                        const seg = generateDonutSegment(source.count, sourceData.total);
                        const prevSeg = generateDonutSegment(preceding, sourceData.total);
                        return (
                          <circle key={i} cx="96" cy="96" r="70" fill="none"
                            stroke={SOURCE_COLORS[i]}
                            strokeWidth="24"
                            strokeDasharray={`${seg.dashArray} ${seg.circumference}`}
                            strokeDashoffset={-(prevSeg.dashArray)}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{sourceData.total}</p>
                    </div>
                  </div>
                  <div className="space-y-2 w-full max-w-xs">
                    {sourceData.sources.map((source, i) => (
                      <div key={i} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded transition-colors">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ background: SOURCE_COLORS[i] }} />
                          <span className="text-sm text-gray-900 font-medium">{source.count} {source.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{source.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClubDashboard;