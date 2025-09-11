import { Routes, Route } from "react-router-dom";
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
    </Routes>
  );
}

export default App;
