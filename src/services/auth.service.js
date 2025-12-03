import api from "@/lib/axios";
class AuthService {
  async login(email, password) {
    const res = await api.post("/users/auth/login", { email, password });
    const { token } = res.data;

    localStorage.setItem("token", token);
    return res.data;
  }

  async register(userData) {
    const res = await api.post("/users/auth/register", userData);
    return res.data;
  }

  async verifyOTP(email, otp) {
    const res = await api.post("/users/auth/verify-otp", { email, otp });
    return res.data;
  }

  async resendOTP(email) {
    const res = await api.post("/users/auth/resend-otp", { email });
    return res.data;
  }

  async vendorLogin(email, password) {
    const res = await api.post("/vendors/auth/login", { email, password });
    const { token } = res.data;
    localStorage.setItem("token", token);
    return res.data;
  }

  async vendorRegister({ businessName, email, password }) {
    const res = await api.post("/vendors/auth/register", {
      businessName,
      email,
      password,
    });
    return res.data;
  }

  async forgotPassword(email) {
    const res = await api.post("/users/auth/forgot-password", { email });
    return res.data;
  }

  async resetPassword(token, password) {
    const res = await api.post("/users/auth/reset-password", {
      token,
      password,
    });
    return res.data;
  }

  async vendorForgotPassword(email) {
    const res = await api.post("/vendors/auth/forgot-password", { email });
    return res.data;
  }

  async vendorResetPassword(token, password) {
    const res = await api.post("/vendors/auth/reset-password", {
      token,
      password,
    });
    return res.data;
  }

  async vendorVerifyOTP(email, otp) {
    const res = await api.post("/vendors/auth/verify-otp", { email, otp });
    return res.data;
  }

  async vendorResendOTP(email) {
    const res = await api.post("/vendors/auth/resend-otp", { email });
    return res.data;
  }

  async vendorOnboard(vendorData) {
    const res = await api.post("/vendors/auth/onboard", vendorData);
    return res.data;
  }

  async adminLogin(email, password) {
    const res = await api.post("/admin/login", { email, password });
    const { token } = res.data;
    localStorage.setItem("token", token);
    return res.data;
  }

  async adminRegister(adminData) {
    const res = await api.post("/auth/register-admin", adminData);
    return res.data;
  }
}

export const authService = new AuthService();