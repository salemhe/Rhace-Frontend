import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Layouts
import Layout from "./pages/layouts/Layout";
import ReservationLayout from "./pages/layouts/ReservationLayout";
import ClubReservationLayout from "./pages/layouts/ClubReservationLayout";
import HotelReservationLayout from "./pages/layouts/HotelReservationLayout";
import AdminLayout from "./components/layout/AdminLayout";

// User Auth
import Login from "./pages/auth/UserAuth/Login";
import Signup from "./pages/auth/UserAuth/Signup";
import ForgotPassword from "./pages/auth/UserAuth/ForgotPassword";
import ResetPassword from "./pages/auth/UserAuth/ResetPassword";
import Otp from "./pages/auth/UserAuth/Otp";

// Vendor Auth
import VendorLogin from "./pages/auth/VendorAuth/Login";
import VendorSignup from "./pages/auth/VendorAuth/Signup";
import VendorForgotPassword from "./pages/auth/VendorAuth/ForgotPassword";
import VendorResetPassword from "./pages/auth/VendorAuth/ResetPassword";
import VendorOtp from "./pages/auth/VendorAuth/Otp";
import Onboard from "./pages/auth/VendorAuth/Onboard";

// Admin Auth
import AdminLogin from "./pages/auth/AdminAuth/Login";

// User Pages
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
import Favorites from "./pages/user/Favourites";
import AboutRhace from "./pages/user/About";
import ContactRhace from "./pages/user/Contact";
import HelpCenterRhace from "./pages/user/HelpCenter";
import NotFound from "./pages/user/NotFound";

// Vendor Dashboard
import VendorDashboard from "./pages/vendor/dashboard/Dashboard";
import PaymentDashboard from "./pages/vendor/dashboard/PaymentDashboard";
import ReservationDashboard from "./pages/vendor/dashboard/restaurant/ReservationDashboard";
import MenuDashboard from "./pages/vendor/dashboard/restaurant/MenuDashboard";
import CreateReservation from "./pages/vendor/dashboard/restaurant/CreateReservation";
import CreateMenu from "./pages/vendor/dashboard/restaurant/CreateMenu";
import CreateMenuItem from "./pages/vendor/dashboard/restaurant/CreateMenuItem";
import StaffManagementSystem from "./pages/vendor/dashboard/StaffManagement";

// Vendor - Club
import BottleServiceManager from "./pages/vendor/club/AddBottleSet";
import { DrinksTable } from "./pages/vendor/club/DrinksTable";
import ClubDashboard from "./pages/vendor/club/Dashboard";
import ClubReservationTable from "./pages/vendor/club/reservations";
import ClubSettings from "./pages/vendor/club/Settings";

// Vendor - Hotel
import AddRooms from "./pages/vendor/hotel/add-rooms/page";
import BookingManagement from "./pages/vendor/hotel/bookings";
import RoomsManagement from "./pages/vendor/hotel/rooms-management/page";
import HotelDashboard from "./pages/vendor/hotel/Dashboard";
import HotelSettings from "./pages/vendor/hotel/Settings";

// Vendor - Settings
import Settings from "./pages/vendor/settings/settings";
import RestaurantSettings from "./pages/vendor/dashboard/restaurant/Settings";

// Admin Dashboard
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVendors from "./pages/admin/Vendors";
import AdminUsers from "./pages/admin/Users";
import AdminReservations from "./pages/admin/Reservations";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoutes";
import UserProtectedRoute from "./components/UserProtectedRoute";
import VendornHomePage from "./pages/vendor/landingPage/page";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import BookingDetails from "./pages/user/BookingDetails";
import Payments from "./pages/admin/Payments";
import PaymentsHistory from "./pages/user/Payments";
import MenuPage from "./pages/user/restaurant/Menu";

// Route Arrays
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
  ],
  admin: [
    { path: "login", element: <AdminLogin /> },
  ],
};

const restaurantRoutes = [
  { path: "/restaurants/:id", element: <RestaurantsPage /> },
  { path: "/restaurants/completed/:id", element: <CompletedPage /> },
  { path: "/restaurants/confirmation/:id", element: <ConfirmPage /> },
];

const restaurantReservationRoutes = [
  { path: "/restaurants/:id/reservations", element: <Reservation /> },
  { path: "/restaurants/pre-payment/:id", element: <PrePaymentPage /> },
];

const clubRoutes = [{ path: "/clubs/:id", element: <ClubPage /> }];

const clubReservationRoutes = [
  { path: "/clubs/:id/reservations", element: <ClubReservation /> },
];

const hotelRoutes = [{ path: "/hotels/:id", element: <HotelsPage /> }];

const hotelReservationRoutes = [
  { path: "/hotels/:id/reservations", element: <HotelReservation /> },
];

const userGeneralRoutes = [
  { path: "/bookings", element: <BookingsPage /> },
  { path: "/search", element: <SearchContent /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/bookings/:id", element: <BookingDetails /> },
  { path: "/payments", element: <PaymentsHistory />}
];

const adminDashboardRoutes = [
  { path: "", element: <AdminDashboard /> },
  { path: "vendors", element: <ErrorBoundary><AdminVendors /></ErrorBoundary> },
  { path: "users", element: <AdminUsers /> },
  { path: "reservations", element: <AdminReservations /> },
  { path: "payments", element: <AdminPayments /> },
  { path: "reports", element: <AdminReports /> },
  { path: "settings", element: <AdminSettings /> },
];

const dashboardRestaurantRoutes = [
  { path: "restaurant", element: <VendorDashboard /> },
  { path: "restaurant/payments", element: <PaymentDashboard /> },
  { path: "restaurant/staffs", element: <StaffManagementSystem /> },
  { path: "restaurant/reservation", element: <ReservationDashboard /> },
  { path: "restaurant/reservation/new", element: <CreateReservation /> },
  { path: "restaurant/menu", element: <MenuDashboard /> },
  { path: "restaurant/menu/new", element: <CreateMenu /> },
  { path: "restaurant/menu/item/new", element: <CreateMenuItem /> },
  { path: "restaurant/settings", element: <RestaurantSettings /> },
];

const hotelVendorRoutes = [
  { path: "hotel", element: <HotelDashboard /> },
  { path: "hotel/bookings", element: <BookingManagement /> },
  { path: "hotel/addrooms", element: <AddRooms /> },
  { path: "hotel/rooms", element: <RoomsManagement /> },
  { path: "hotel/payments", element: <PaymentDashboard /> },
  { path: "hotel/staffs", element: <StaffManagementSystem /> },
  { path: "hotel/settings", element: <HotelSettings /> },
];

const clubVendorRoutes = [
  { path: "club", element: <ClubDashboard /> },
  { path: "club/drinks", element: <DrinksTable /> },
  { path: "club/reservations", element: <ClubReservationTable /> },
  { path: "club/payments", element: <PaymentDashboard /> },
  { path: "club/staffs", element: <StaffManagementSystem /> },
  { path: "club/add-drinks", element: <BottleServiceManager /> },
  { path: "club/settings", element: <ClubSettings /> },
];

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Main Layout */}
        <Route element={<Layout />}>
          {/* Home / Info Pages */}
          <Route path="/" element={<ReservationHomePage />} />
          <Route path="/about" element={<AboutRhace />} />
          <Route path="/contact" element={<ContactRhace />} />
          <Route path="/faq" element={<HelpCenterRhace />} />
          <Route path="/partner" element={<VendornHomePage />} />

          {/* Authentication Routes */}
          <Route path="/auth">
            {/* User */}
            <Route path="user">
              {authRoutes.user.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>

            {/* Vendor */}
            <Route path="vendor">
              {authRoutes.vendor.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>

            {/* Admin */}
            <Route path="admin">
              {authRoutes.admin.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          <Route path="/menus/:id" element={<MenuPage />} />
          {/* Restaurants */}
          {restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {/* Clubs */}
          {clubRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Hotels */}
          {hotelRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Protected User Routes */}
          <Route element={<UserProtectedRoute />}>
            <Route element={<HotelReservationLayout />}>
              {hotelReservationRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
            <Route element={<ClubReservationLayout />}>
              {clubReservationRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
            <Route element={<ReservationLayout />}>
              {restaurantReservationRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
            {userGeneralRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Vendor Onboarding */}
            <Route path="/auth/vendor/onboarding" element={<Onboard />} />

            {/* Vendor Dashboards */}
            <Route path="/dashboard">
              {hotelVendorRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            {dashboardRestaurantRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {hotelVendorRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {clubVendorRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            </Route>
          </Route>

          {/* Admin Dashboard - Separate Protection */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/dashboard/admin" element={<AdminLayout />}>
              {adminDashboardRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
