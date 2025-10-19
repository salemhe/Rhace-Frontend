import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Layouts
import Layout from "./pages/layouts/Layout";
import ReservationLayout from "./pages/layouts/ReservationLayout";
import ClubReservationLayout from "./pages/layouts/ClubReservationLayout";
import HotelReservationLayout from "./pages/layouts/HotelReservationLayout";
import AdminLayout from "./components/layout/AdminLayout";

// User Auth
import Signup from "./pages/auth/UserAuth/Signup";
import Login from "./pages/auth/UserAuth/Login";
import ForgotPassword from "./pages/auth/UserAuth/ForgotPassword";
import ResetPassword from "./pages/auth/UserAuth/ResetPassword";
import Otp from "./pages/auth/UserAuth/Otp";

// Vendor Auth
import VendorSignup from "./pages/auth/VendorAuth/Signup";
import VendorLogin from "./pages/auth/VendorAuth/Login";
import VendorForgotPassword from "./pages/auth/VendorAuth/ForgotPassword";
import VendorOtp from "./pages/auth/VendorAuth/Otp";
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
import HotelsPage from "./pages/user/hotels/HotelsPage";
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

// Vendor Hotel
import BookingManagement from "./pages/vendor/hotel/bookings";
import AddRooms from "./pages/vendor/hotel/add-rooms/page";
import RoomsManagement from "./pages/vendor/hotel/rooms-management/page";

// Settings
import Settings from "./pages/vendor/settings/settings";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVendors from "./pages/admin/Vendors";
import AdminUsers from "./pages/admin/Users";
import AdminReservations from "./pages/admin/Reservations";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* User Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<ReservationHomePage />} />
          <Route path="/search" element={<SearchContent />} />
          <Route path="/bookings" element={<BookingsPage />} />

          {/* Auth Routes */}
          <Route path="/auth/user/signup" element={<Signup />} />
          <Route path="/auth/user/login" element={<Login />} />
          <Route path="/auth/user/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/user/reset-password" element={<ResetPassword />} />
          <Route path="/auth/user/otp" element={<Otp />} />

          <Route path="/auth/vendor/signup" element={<VendorSignup />} />
          <Route path="/auth/vendor/login" element={<VendorLogin />} />
          <Route path="/auth/vendor/forgot-password" element={<VendorForgotPassword />} />
          <Route path="/auth/vendor/reset-password" element={<VendorResetPassword />} />
          <Route path="/auth/vendor/otp" element={<VendorOtp />} />
          <Route path="/auth/vendor/onboarding" element={<Onboard />} />

          {/* Restaurant */}
          <Route path="/restaurants/:id" element={<RestaurantsPage />} />
          <Route path="/restaurants/completed/:id" element={<CompletedPage />} />
          <Route path="/restaurants/confirmation/:id" element={<ConfirmPage />} />
          <Route element={<ReservationLayout />}>
            <Route path="/restaurants/:id/reservations" element={<Reservation />} />
            <Route path="/restaurants/pre-payment/:id" element={<PrePaymentPage />} />
          </Route>

          {/* Club */}
          <Route path="/clubs/:id" element={<ClubPage />} />
          <Route element={<ClubReservationLayout />}>
            <Route path="/clubs/:id/reservations" element={<ClubReservation />} />
          </Route>

          {/* Hotel */}
          <Route path="/hotels/:id" element={<HotelsPage />} />
          <Route element={<HotelReservationLayout />}>
            <Route path="/hotels/:id/reservations" element={<HotelReservation />} />
          </Route>

          {/* Vendor Dashboard */}
          <Route path="/dashboard" element={<VendorDashboard />} />
          <Route path="/dashboard/payments" element={<PaymentDashboard />} />
          <Route path="/dashboard/restaurant/reservation" element={<ReservationDashboard />} />
          <Route path="/dashboard/restaurant/reservation/new" element={<CreateReservation />} />
          <Route path="/dashboard/restaurant/menu" element={<MenuDashboard />} />
          <Route path="/dashboard/restaurant/menu/new" element={<CreateMenu />} />

          {/* Hotel Vendor */}
          <Route path="/hotel/dashboard" element={<VendorDashboard />} />
          <Route path="/hotel/bookings" element={<BookingManagement />} />
          <Route path="/hotel/addrooms" element={<AddRooms />} />
          <Route path="/hotel/rooms" element={<RoomsManagement />} />
          <Route path="/hotel/payments" element={<PaymentDashboard />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/hotel/settings" element={<Settings />} />
          <Route path="/clubs/settings" element={<Settings />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
