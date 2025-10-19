import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Layouts
import Layout from "./pages/layouts/Layout";
import ReservationLayout from "./pages/layouts/ReservationLayout";
import ClubReservationLayout from "./pages/layouts/ClubReservationLayout";
import HotelReservationLayout from "./pages/layouts/HotelReservationLayout";
import AdminLayout from "./components/layout/AdminLayout";

// User Auth
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Auth - User
import Login from "./pages/auth/UserAuth/Login";
import Signup from "./pages/auth/UserAuth/Signup";
import ForgotPassword from "./pages/auth/UserAuth/ForgotPassword";
import ResetPassword from "./pages/auth/UserAuth/ResetPassword";
import Otp from "./pages/auth/UserAuth/Otp";

// Auth - Vendor
import VendorLogin from "./pages/auth/VendorAuth/Login";
import VendorSignup from "./pages/auth/VendorAuth/Signup";
import VendorForgotPassword from "./pages/auth/VendorAuth/ForgotPassword";
import VendorResetPassword from "./pages/auth/VendorAuth/ResetPassword";
import VendorOtp from "./pages/auth/VendorAuth/Otp";
import Onboard from "./pages/auth/VendorAuth/Onboard";

// Layouts
import Layout from "./pages/layouts/Layout";
import ReservationLayout from "./pages/layouts/ReservationLayout";
import ClubReservationLayout from "./pages/layouts/ClubReservationLayout";

// User Pages - Restaurant
import RestaurantsPage from "./pages/user/restaurant/RestaurantPage";
import Reservation from "./pages/user/restaurant/Reservation";
import VendorResetPassword from "./pages/auth/VendorAuth/ResetPassword";
import Onboard from "./pages/auth/VendorAuth/Onboard";

// Pages
import ReservationHomePage from "./pages/user/ReservationHomePage";
import RestaurantsPage from "./pages/user/restaurant/RestaurantPage";
import Reservation from "./pages/user/restaurant/Reservation";
import PrePaymentPage from "./pages/user/restaurant/PrePayment";
import CompletedPage from "./pages/user/restaurant/Completed";
import ConfirmPage from "./pages/user/restaurant/Confirmation";
import ClubPage from "./pages/user/club/ClubPage";
import ClubReservation from "./pages/user/club/Reservation";

// User Pages - Hotel
import HotelsPage from "./pages/user/hotels/HotelsPage";
import HotelReservation from "./pages/user/hotels/ReservationSummary";

// User Pages - General
import ReservationHomePage from "./pages/user/ReservationHomePage";
import BookingsPage from "./pages/user/Bookings";
import SearchContent from "./pages/user/Search";
import NotFound from "./pages/user/NotFound";

// Dashboard - Restaurant
import PaymentDashboard from "./pages/dashboard/PaymentDashboard";
import HotelReservation from "./pages/user/hotels/ReservationSummary";
import BookingsPage from "./pages/user/Bookings";
import SearchContent from "./pages/user/Search";
import NotFound from "./pages/user/NotFound";

// Vendor Dashboard
import VendorDashboard from "./pages/dashboard/Dashboard";
import PaymentDashboard from "./pages/dashboard/PaymentDashboard";
import ReservationDashboard from "./pages/dashboard/restaurant/ReservationDashboard";
import MenuDashboard from "./pages/dashboard/restaurant/MenuDashboard";
import CreateReservation from "./pages/dashboard/restaurant/CreateReservation";
import CreateMenu from "./pages/dashboard/restaurant/CreateMenu";

// Vendor - Club
import BottleServiceManager from "./pages/vendor/club/AddBottleSet";
import { DrinksTable } from "./pages/vendor/club/DrinksTable";

// Vendor - Hotel
import AddRooms from "./pages/vendor/hotel/add-rooms/page";
import BookingManagement from "./pages/vendor/hotel/bookings";
import RoomsManagement from "./pages/vendor/hotel/rooms-management/page";

// Vendor - Settings

// Settings
import Settings from "./pages/vendor/settings/settings";
import VendorDashboard from "./pages/dashboard/Dashboard";
import ClubDashboard from "./pages/vendor/club/Dashboard";
import HotelDashboard from "./pages/vendor/hotel/Dashboard";
import ClubReservationTable from "./pages/vendor/club/reservations";

// ==================== APP COMPONENT ====================
import ConfirmPage from "./pages/user/restaurant/Confirmation";
import AdminLayout from "./components/layout/AdminLayout";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVendors from "./pages/admin/Vendors";
import AdminUsers from "./pages/admin/Users";
import AdminReservations from "./pages/admin/Reservations";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
// ==================== ROUTE CONFIGURATION ====================

const authRoutes = {
  user: [
    { path: "signup", element: <Signup /> },
    { path: "login", element: <Login /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "reset-password", element: <ResetPassword /> },
    { path: "otp", element: <Otp /> },
  ],
  vendor: [
    { path: "signup", element: <VendorSignup /> },
    { path: "login", element: <VendorLogin /> },
    { path: "forgot-password", element: <VendorForgotPassword /> },
    { path: "reset-password", element: <VendorResetPassword /> },
    { path: "otp", element: <VendorOtp /> },
    { path: "onboarding", element: <Onboard /> },
  ],
};

const restaurantRoutes = [
  { path: "/restaurants/:id", element: <RestaurantsPage /> },
  { path: "/restaurants/completed/:id", element: <CompletedPage /> },
];

const restaurantReservationRoutes = [
  { path: "/restaurants/:id/reservations", element: <Reservation /> },
  { path: "/restaurants/pre-payment/:id", element: <PrePaymentPage /> },
];

const clubRoutes = [
  { path: "/clubs/:id", element: <ClubPage /> },
];

const clubReservationRoutes = [
  { path: "/clubs/:id/reservations", element: <ClubReservation /> },
  { path: "/hotels/:id/reservations", element: <HotelReservation /> },
];

const hotelRoutes = [
  { path: "/hotels/:id", element: <HotelsPage /> },
];

const userGeneralRoutes = [
  { path: "/bookings", element: <BookingsPage /> },
  { path: "/search", element: <SearchContent /> },
];

const dashboardRestaurantRoutes = [
  { path: "", element: <VendorDashboard /> },
  { path: "restaurant/payments", element: <PaymentDashboard /> },
  { path: "restaurant/reservation", element: <ReservationDashboard /> },
  { path: "restaurant/reservation/new", element: <CreateReservation /> },
  { path: "restaurant/menu", element: <MenuDashboard /> },
  { path: "restaurant/menu/new", element: <CreateMenu /> },
  { path: "restaurant/settings", element: <Settings /> },
];

const hotelVendorRoutes = [
  { path: "/hotel/dashboard", element: <HotelDashboard /> },
  { path: "/hotel/bookings", element: <BookingManagement /> },
  { path: "/hotel/addrooms", element: <AddRooms /> },
  { path: "/hotel/rooms", element: <RoomsManagement /> },
  { path: "/hotel/payments", element: <PaymentDashboard /> },
  { path: "/hotel/settings", element: <Settings /> },
];

const clubVendorRoutes = [
  { path: "/club/dashboard", element: <ClubDashboard /> },
  { path: "/club/drinks", element: <DrinksTable /> },
  { path: "/club/reservations", element: <ClubReservationTable /> },
  { path: "/club/payments", element: <PaymentDashboard /> },
  { path: "/club/add-drinks", element: <BottleServiceManager /> },
  { path: "/club/settings", element: <Settings /> },
];



function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* User Layout */}
        <Route element={<Layout />}>
          {/* Home */}
          <Route path="/" element={<ReservationHomePage />} />

          {/* Authentication */}
          <Route path="/auth">
            <Route path="user">
              {authRoutes.user.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
            <Route path="vendor">
              {authRoutes.vendor.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* Restaurants */}
          {restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route element={<ReservationLayout />}>
            {restaurantReservationRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Clubs */}
          {clubRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Hotels */}
          {hotelRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Club & Hotel Reservations */}
          <Route element={<ClubReservationLayout />}>
            {clubReservationRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* User General */}
          {userGeneralRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Dashboard - Restaurant */}
          <Route path="/dashboard">
            {dashboardRestaurantRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Vendor - Hotel */}
          {hotelVendorRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Vendor - Club */}
          {clubVendorRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;