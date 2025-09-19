import { Routes, Route } from "react-router-dom";
import ReservationHomePage from "./pages/user/ReservationHomePage";
import NotFound from "./pages/user/NotFound";
import Signup from "./pages/auth/UserAuth/Signup";
import Login from "./pages/auth/UserAuth/Login";
import ForgotPassword from "./pages/auth/UserAuth/ForgotPassword";
import Otp from "./pages/auth/UserAuth/Otp";
import VendorSignup from "./pages/auth/VendorAuth/Signup";
import VendorLogin from "./pages/auth/VendorAuth/Login";
import VendorForgotPassword from "./pages/auth/VendorAuth/ForgotPassword";
import VendorOtp from "./pages/auth/VendorAuth/Otp";
import Onboarding from "./pages/auth/UserAuth/Onboarding";
import RestaurantsPage from "./pages/user/restaurant/RestaurantPage";
import Reservation from "./pages/user/restaurant/Reservation";
import ClubReservation from "./pages/user/club/Reservation";
import HotelReservation from "./pages/user/hotels/ReservationSummary";
import ReservationLayout from "./pages/layouts/ReservationLayout";
import ClubReservationLayout from "./pages/layouts/ClubReservationLayout";
import PrePaymentPage from "./pages/user/restaurant/PrePayment";
import CompletedPage from "./pages/user/restaurant/Completed";
import ClubPage from "./pages/user/club/ClubPage";
import HotelsPage from "./pages/user/hotels/HotelsPage";

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />

      <Route path="/auth">
        <Route path="user">
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="otp" element={<Otp />} />
          <Route path="onboarding" element={<Onboarding />} />
        </Route>
        <Route path="vendor">
          <Route path="signup" element={<VendorSignup />} />
          <Route path="login" element={<VendorLogin />} />
          <Route path="forgot-password" element={<VendorForgotPassword />} />
          <Route path="otp" element={<VendorOtp />} />
        </Route>
      </Route>

      <Route path="/" element={<ReservationHomePage />} />
      <Route path="/restaurants/:id" element={<RestaurantsPage />} />
      <Route element={<ReservationLayout />}>
        <Route path="/restaurants/:id/reservations" element={<Reservation />} />
        <Route path="/restaurants/pre-payment/:id" element={<PrePaymentPage />} />
      </Route>
      <Route path="/restaurants/completed/:id" element={<CompletedPage />} />
      <Route path="/clubs/:id" element={<ClubPage />} />
      <Route element={<ClubReservationLayout />}>
        <Route path="/clubs/:id/reservations" element={<ClubReservation />} />
        <Route path="/hotels/:id/reservations" element={<HotelReservation />} />
      </Route>
      <Route path="/hotels/:id" element={<HotelsPage />} />
    </Routes>
  );
}

export default App;
