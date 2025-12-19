import DashboardLayout from "@/components/layout/DashboardLayout";
import UniversalLoader from "@/components/user/ui/LogoLoader";
import { reservationService } from "@/services/reservation.service";
import { formatDate } from "@/utils/formatDate";
import { capitalize } from "@/utils/helper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  Users,
  DollarSign,
  User,
  Clock,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  BookingsIcon,
  GuestsIcon,
  PendingPaymentIcon,
  PrepaidIcon,
} from "@/public/icons/icons";
import { cn } from "@/lib/utils";

const HotelDashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [timeFilter, setTimeFilter] = useState("Weekly");
  const [revenueFilter, setRevenueFilter] = useState("Weekly");
  const [sourceFilter, setSourceFilter] = useState("Weekly");
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

  // Stats data configuration
  const statsConfig = [
    {
      title: "Reservations made today",
      icon: BookingsIcon,
      iconColors: "#60A5FA",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Prepaid Reservations",
      icon: PrepaidIcon,
      iconColors: "#06CD02",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Expected Guests Today",
      icon: GuestsIcon,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Payments",
      icon: PendingPaymentIcon,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ];

  // Filter only hotel reservations
  const getHotelReservations = () => {
    if (!reservationStats?.todaysReservations) return [];
    return reservationStats.todaysReservations.filter(
      (reservation) => reservation.reservationType === "hotelReservation"
    );
  };

  // Calculate hotel-specific stats
  const getHotelStats = () => {
    const hotelReservations = getHotelReservations();

    const totalReservations = hotelReservations.length;
    const prepaidReservations = hotelReservations.filter(
      (r) => r.paymentStatus === "Paid"
    ).length;
    const totalGuests = hotelReservations.reduce(
      (sum, r) => sum + (r.guests || 0),
      0
    );
    const pendingPayments = hotelReservations
      .filter((r) => r.paymentStatus !== "Paid")
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

    return [
      {
        details: totalReservations,
        change: reservationStats.todayStats[0]?.change || 0,
      },
      {
        details: prepaidReservations,
        change: reservationStats.todayStats[1]?.change || 0,
      },
      {
        details: totalGuests,
        change: reservationStats.todayStats[2]?.change || 0,
      },
      {
        details: pendingPayments,
        change: reservationStats.todayStats[3]?.change || 0,
      },
    ];
  };

  const hotelStats = reservationStats ? getHotelStats() : [];

  // Chart data based on filter - hotel reservations only
  const getChartData = () => {
    if (!reservationStats?.reservationTrends?.daily) return [];

    if (timeFilter === "Weekly") {
      return reservationStats.reservationTrends.daily.map((item) => ({
        day: new Date(item.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        value: item.count,
      }));
    } else {
      return reservationStats.reservationTrends.daily.map((item, index) => ({
        day: `Week ${Math.floor(index / 7) + 1}`,
        value: item.count,
      }));
    }
  };

  const chartData = getChartData();
  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 1;

  // Revenue data for hotel reservations only
  const getRevenueData = () => {
    const hotelReservations = getHotelReservations();

    if (hotelReservations.length === 0) {
      return {
        total: 0,
        change: 0,
        items: [],
      };
    }

    // Calculate revenue by room type or category
    const revenueByRoom = {};
    let totalRevenue = 0;

    hotelReservations.forEach((reservation) => {
      // Use room ID or type as category
      const roomType = reservation.room || "Standard Room";
      const amount = reservation.totalAmount || 0;

      if (!revenueByRoom[roomType]) {
        revenueByRoom[roomType] = 0;
      }
      revenueByRoom[roomType] += amount;
      totalRevenue += amount;
    });

    // Convert to array and calculate percentages
    const items = Object.entries(revenueByRoom).map(([room, amount], index) => {
      const colors = [
        "bg-teal-600",
        "bg-red-500",
        "bg-yellow-400",
        "bg-purple-500",
        "bg-teal-300",
      ];

      return {
        category:
          typeof room === "string" && room.length > 20 ? "Room Type" : room,
        percentage:
          totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0,
        amount: amount,
        color: colors[index % colors.length],
      };
    });

    return {
      total: totalRevenue,
      change: reservationStats.reservationTrends?.trendChange || 0,
      items: items,
    };
  };

  const revenueData = getRevenueData();

  // Customer frequency for hotel guests only
  const getCustomerData = () => {
    if (!reservationStats?.customerFrequency) {
      return { total: 0, new: 0, returning: 0 };
    }

    const newCount = reservationStats.customerFrequency.new || 0;
    const returningCount = reservationStats.customerFrequency.returning || 0;

    return {
      total: newCount + returningCount,
      new: newCount,
      returning: returningCount,
    };
  };

  const customerData = getCustomerData();

  // Reservation source for hotel reservations only
  const getSourceData = () => {
    const hotelReservations = getHotelReservations();
    const total = hotelReservations.length;

    return {
      total: total,
      sources: [
        { name: `${total} bookings`, value: 100, color: "bg-teal-600" },
      ],
    };
  };

  const sourceData = getSourceData();

  // Calculate upcoming hotel reservations (within 30 minutes)
  const getUpcomingCount = () => {
    const hotelReservations = getHotelReservations();

    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);

    return hotelReservations.filter((reservation) => {
      const reservationDate = new Date(reservation.checkInDate);
      return reservationDate >= now && reservationDate <= thirtyMinutesFromNow;
    }).length;
  };

  const upcomingCount = reservationStats ? getUpcomingCount() : 0;

  // Generate donut chart path
  const generateDonutPath = (value, total) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const dashArray = (percentage / 100) * circumference;

    return { dashArray, circumference, percentage };
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await reservationService.getSummary();
        console.log("Summary Data:", res);
        setReservationStats(res.data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <DashboardLayout
        type={vendor.vendorType}
        section="dashboard"
        settings={false}
      >
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!reservationStats) {
    return (
      <DashboardLayout
        type={vendor.vendorType}
        section="dashboard"
        settings={false}
      >
        <UniversalLoader fullscreen />
      </DashboardLayout>
    );
  }

  const hotelReservations = getHotelReservations();

  return (
    <DashboardLayout
      type={vendor.vendorType}
      section="dashboard"
      settings={false}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Alert Banner */}
          {showAlert && upcomingCount > 0 && (
            <div className="bg-yellow-50 border-l-3 border-yellow-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                <p className="text-yellow-800 text-sm font-medium">
                  {upcomingCount} Hotel Check-in{upcomingCount > 1 ? "s" : ""}{" "}
                  in the next 30 minutes
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="text-yellow-600 hover:text-yellow-800"
              >
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
              <p className="text-gray-600 mt-1">
                Here's what is happening with your hotel today.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border border-gray-200">
            {hotelStats.map((stat, index) => {
              const Icon = statsConfig[index].icon;
              return (
                <div key={index} className="flex justify-between p-5">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {statsConfig[index].title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {index === 3
                        ? `₦${stat.details.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : stat.details}
                    </p>
                    <p
                      className={`text-sm flex items-center ${
                        stat.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span className="mr-1">
                        {stat.change >= 0 ? "↑" : "↓"}
                      </span>
                      {stat.change}% vs last week
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
            {/* Today's Hotel Reservations */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Hotel Reservations
                </h3>
                <a
                  href={`/dashboard/${vendor.vendorType}/bookings`}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                >
                  View All
                </a>
              </div>
              <div className="p-5 space-y-3">
                {hotelReservations.length > 0 ? (
                  hotelReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">
                            {reservation.customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Check-in: {formatDate(reservation.checkInDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-900">
                            {formatDate(reservation.checkOutDate)}
                          </p>
                          <p className="text-xs text-gray-500">Check-out</p>
                        </div>
                        <div className="text-center min-w-[70px]">
                          <p className="text-sm font-medium text-gray-900">
                            {reservation.guests} Guest
                            {reservation.guests > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="min-w-[90px]">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                              reservation.reservationStatus === "Upcoming"
                                ? "bg-teal-50 text-teal-700"
                                : reservation.reservationStatus === "Completed"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-50 text-gray-700"
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
                    No hotel reservations today
                  </div>
                )}
              </div>
            </div>

            {/* Reservations Trends */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Hotel Booking Trends
                </h3>
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
                    <span className="text-sm text-gray-600">
                      This {timeFilter.toLowerCase().slice(0, -2)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Last {timeFilter.toLowerCase().slice(0, -2)}
                    </span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {hotelReservations.length}
                </p>
                <p className="text-sm text-green-600 mb-6 flex items-center">
                  <span className="mr-1">↑</span>
                  {reservationStats.reservationTrends?.trendChange || 0}% vs
                  last {timeFilter.toLowerCase().slice(0, -2)}
                </p>

                {/* Bar Chart */}
                {chartData.length > 0 ? (
                  <div className="flex items-end justify-between h-40 gap-2">
                    {chartData.map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center justify-end h-full group"
                      >
                        <div
                          className="w-full flex flex-col justify-end relative"
                          style={{ height: "100%" }}
                        >
                          <div
                            className="w-16 mx-auto bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all duration-300 hover:from-teal-700 hover:to-teal-500 cursor-pointer"
                            style={{
                              height: `${(item.value / maxValue) * 100}%`,
                            }}
                            title={`${item.value} reservations`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No trend data available
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
                <h3 className="text-base font-semibold text-gray-900">
                  Guest Frequency
                </h3>
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

              <div className="p-5 flex flex-col items-center">
                {(() => {
                  const newCustomers = customerData.new;
                  const returningCustomers = customerData.returning;
                  const total = customerData.total;

                  const newPaths = generateDonutPath(newCustomers, total);
                  const returningPaths = generateDonutPath(
                    returningCustomers,
                    total
                  );

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
                            strokeDasharray={`${newPaths.dashArray} ${newPaths.circumference}`}
                            strokeDashoffset="0"
                          />

                          {/* Returning Customers Segment */}
                          <circle
                            cx="96"
                            cy="96"
                            r="70"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="24"
                            strokeDasharray={`${returningPaths.dashArray} ${returningPaths.circumference}`}
                            strokeDashoffset={`-${newPaths.dashArray}`}
                          />
                        </svg>

                        {/* Center Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs text-gray-500 mb-1">
                            Total Guests
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              {newPaths.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            New Guests
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              {returningPaths.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            Returning Guests
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Revenue (Room Category) */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Revenue (Room Category)
                </h3>
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
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{revenueData.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">↑</span>
                    {revenueData.change}% vs last{" "}
                    {revenueFilter.toLowerCase().slice(0, -2)}
                  </p>
                </div>

                {revenueData.items.length > 0 ? (
                  <>
                    {/* Color Bar */}
                    <div className="flex h-3 rounded-full overflow-hidden mb-4">
                      {revenueData.items.map((item, index) => (
                        <div
                          key={index}
                          className={`${item.color} transition-all duration-300 hover:opacity-80 cursor-pointer`}
                          style={{ width: `${item.percentage}%` }}
                          title={`${
                            item.category
                          }: ₦${item.amount.toLocaleString()}`}
                        />
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="space-y-2">
                      {revenueData.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm hover:bg-gray-50 p-1 rounded transition-colors"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-sm ${item.color} mr-2`}
                            ></div>
                            <span className="text-gray-900 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-900 font-medium">
                              {item.percentage}%
                            </span>
                            <span className="text-gray-500">
                              (₦{item.amount.toLocaleString()})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No revenue data available
                  </div>
                )}
              </div>
            </div>

            {/* Reservation Source */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Booking Source
                </h3>
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
                      const paths = generateDonutPath(source.value, 100);
                      const colors = ["#14b8a6", "#fbbf24", "#60a5fa"];

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
                          strokeDashoffset="0"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {sourceData.total}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  {sourceData.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between hover:bg-gray-50 p-1 rounded transition-colors"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 ${source.color} rounded-full mr-2`}
                        ></div>
                        <span className="text-sm text-gray-900 font-medium">
                          {source.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {source.value}%
                      </span>
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

export default HotelDashboard;
