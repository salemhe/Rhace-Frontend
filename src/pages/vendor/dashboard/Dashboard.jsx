import DashboardLayout from '@/components/layout/DashboardLayout';
import UniversalLoader from '@/components/user/ui/LogoLoader';
import { reservationService } from '@/services/reservation.service';
import { formatDate, formatTime } from '@/utils/formatDate';
import { capitalize } from '@/utils/helper';
import { ChevronRight, ExternalLink, ListX, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StatCard } from '@/components/dashboard/stats/mainStats';
import { Calendar, CardPay, Cash2, Group3 } from '@/components/dashboard/ui/svg';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const VendorDashboard = () => {
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
        <UniversalLoader type='dashboard-1' />
      </DashboardLayout>
    );
  }

  // ── Derived data from API ──────────────────────────────────────────────────

  // Trends chart — backend now returns weekly[] and monthly[] arrays directly
  const chartData =
    timeFilter === 'Weekly'
      ? reservationStats.reservationTrends.weekly
      : reservationStats.reservationTrends.monthly;

  const chartConfig = {
    thisWeek: { label: 'This week', color: '#60A5FA' },
    lastWeek: { label: 'Last week', color: '#0A6C6D' },
  };

  const trendTotal = chartData.reduce((s, d) => s + d.thisWeek, 0);
  const trendChange = reservationStats.reservationTrends.trendChange;

  // Revenue — backend returns revenueData.weekly / .monthly
  const revenueData =
    revenueFilter === 'Weekly'
      ? reservationStats.revenueData.weekly
      : reservationStats.revenueData.monthly;

  // Source — backend returns reservationSource.weekly / .monthly
  const sourceData =
    sourceFilter === 'Weekly'
      ? reservationStats.reservationSource.weekly
      : reservationStats.reservationSource.monthly;

  // Donut segment helper
  const generateDonutSegment = (count, total) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const pct = total > 0 ? count / total : 0;
    return { dashArray: pct * circumference, circumference };
  };

  // Source donut colours (index-stable)
  const SOURCE_COLORS = ['#14b8a6', '#fbbf24', '#60a5fa'];

  return (
    <DashboardLayout type={vendor.vendorType} section="dashboard" settings={false}>

      <div className="bg-gray-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome Back, {capitalize(vendor.businessName)}!
              </h1>
              <p className="text-gray-600 mt-1">Here's what is happening today.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border bg-white rounded-2xl">
            <div className="flex h-full items-center">
              <StatCard
                title="Reservations made today"
                value={reservationStats.todayStats[0].details}
                change={reservationStats.todayStats[0].change}
                icon={<Calendar />}
                color="blue"
              />
              <div className="h-3/5 w-[1px] bg-[#E5E7EB]" />
            </div>
            <div className="flex h-full items-center">
              <StatCard
                title="Prepaid Reservations"
                value={reservationStats.todayStats[1].details}
                change={reservationStats.todayStats[1].change}
                icon={<CardPay />}
                color="green"
              />
              <div className="h-3/5 w-[1px] bg-[#E5E7EB]" />
            </div>
            <div className="flex h-full items-center">
              <StatCard
                title="Expected Guests Today"
                value={reservationStats.todayStats[2].details}
                change={reservationStats.todayStats[2].change}
                icon={<Group3 />}
                color="purple"
              />
              <div className="h-3/5 w-[1px] bg-[#E5E7EB]" />
            </div>
            <StatCard
              title="Pending Payments"
              value={reservationStats.todayStats[3].details.toLocaleString('en-NG')}
              change={reservationStats.todayStats[3].change}
              icon={<Cash2 fill="#E1B505" className="text-[#E1B505]" />}
              color="orange"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Today's Reservations */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Today's Reservation</h3>
                <a
                  href={`/dashboard/${vendor.vendorType}/reservation`}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="p-5 space-y-3">
                {reservationStats.todaysReservations.length > 0
                  ? reservationStats.todaysReservations.slice(0, 5).map((reservation) => (
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
                            <p className="text-xs text-gray-500">ID: #{reservation._id.slice(0, 8)}...</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-900">{formatDate(reservation.createdAt)}</p>
                            <p className="text-xs text-gray-500">Time: {formatTime(reservation.createdAt)}</p>
                          </div>
                          <div className="text-center min-w-[70px]">
                            <p className="text-sm font-medium text-gray-900">
                              {reservation.guests} Guests
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
                  : (
                    <div className="w-full h-[336px] flex items-center justify-center">
                      <div className="flex items-center flex-col gap-2">
                        <ListX className="size-6 text-gray-400" />
                        <p className="text-gray-500 text-sm">No Reservations for today</p>
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
                  <a
                    href={`/dashboard/${vendor.vendorType}/reservation`}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
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
                    <span className="text-sm text-gray-600">
                      This {timeFilter === 'Weekly' ? 'week' : 'month'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-600 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">
                      Last {timeFilter === 'Weekly' ? 'week' : 'month'}
                    </span>
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
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
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
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Customer Frequency</h3>
                <div className="flex items-center gap-2">
                  {/* Note: customerFrequency uses a fixed 30-day window on the backend.
                      This filter is UI-only for now; wire up separate endpoints if
                      you need true weekly vs monthly switching here. */}
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
              <div className="p-5 flex flex-col items-center">
                {(() => {
                  const newC = reservationStats.customerFrequency.new || 0;
                  const retC = reservationStats.customerFrequency.returning || 0;
                  const total = newC + retC;
                  const newPct = total > 0 ? ((newC / total) * 100).toFixed(1) : 0;
                  const retPct = total > 0 ? ((retC / total) * 100).toFixed(1) : 0;
                  const newSeg = generateDonutSegment(newC, total);
                  const retSeg = generateDonutSegment(retC, total);

                  return (
                    <>
                      <div className="relative w-48 h-48 mb-4">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="96" cy="96" r="70" fill="none" stroke="#E5E7EB" strokeWidth="24" />
                          <circle
                            cx="96" cy="96" r="70" fill="none" stroke="#14b8a6" strokeWidth="24"
                            strokeDasharray={`${newSeg.dashArray} ${newSeg.circumference}`}
                            strokeDashoffset={0}
                          />
                          <circle
                            cx="96" cy="96" r="70" fill="none" stroke="#fbbf24" strokeWidth="24"
                            strokeDasharray={`${retSeg.dashArray} ${retSeg.circumference}`}
                            strokeDashoffset={-(newSeg.dashArray)}
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
                            <div className="w-3 h-3 bg-teal-500 rounded-full mr-2" />
                            <span className="text-sm text-gray-600">{newPct}%</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">New Customers</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2" />
                            <span className="text-sm text-gray-600">{retPct}%</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">Returning Customers</span>
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
                <h3 className="text-base font-semibold text-gray-900">Revenue (by type)</h3>
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
                {revenueData.items.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center gap-2">
                    <ListX className="size-5 text-gray-400" />
                    <p className="text-sm text-gray-500">No revenue data yet</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ₦{revenueData.total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-sm flex items-center ${revenueData.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="mr-1">{revenueData.change >= 0 ? '↑' : '↓'}</span>
                        {Math.abs(revenueData.change).toFixed(1)}% vs last {revenueFilter === 'Weekly' ? 'week' : 'month'}
                      </p>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden mb-4">
                      {revenueData.items.map((item, i) => (
                        <div
                          key={i}
                          className={`${item.color} transition-all duration-300 hover:opacity-80 cursor-pointer`}
                          style={{ width: `${item.percentage}%` }}
                          title={`${item.category}: ₦${item.amount.toLocaleString()}`}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {revenueData.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm hover:bg-gray-50 p-1 rounded transition-colors">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-sm ${item.color} mr-2`} />
                            <span className="text-gray-900 font-medium">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-900 font-medium">{item.percentage}%</span>
                            <span className="text-gray-500">
                              (₦{item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })})
                            </span>
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
                {sourceData.total === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-2">
                    <ListX className="size-5 text-gray-400" />
                    <p className="text-sm text-gray-500">No reservation data yet</p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-48 h-48 mb-4">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="96" cy="96" r="70" fill="none" stroke="#E5E7EB" strokeWidth="24" />
                        {sourceData.sources.map((source, i) => {
                          const precedingCount = sourceData.sources
                            .slice(0, i)
                            .reduce((s, src) => s + src.count, 0);
                          const seg = generateDonutSegment(source.count, sourceData.total);
                          const prevSeg = generateDonutSegment(precedingCount, sourceData.total);
                          return (
                            <circle
                              key={i}
                              cx="96" cy="96" r="70" fill="none"
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
                    <div className="space-y-2 w-full">
                      {sourceData.sources.map((source, i) => (
                        <div key={i} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded transition-colors">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ background: SOURCE_COLORS[i] }}
                            />
                            <span className="text-sm text-gray-900 font-medium">
                              {source.count} {source.name}
                            </span>
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
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;