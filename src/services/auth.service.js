import api from "@/lib/axios";
class AuthService {
  async login(email, password) {
    const res = await api.post("/users/auth/login", { email, password });
    const { accessToken } = res.data;

    localStorage.setItem("token", accessToken);
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
    console.log('vendorLogin called with:', { email });
    try {
      const res = await api.post("/vendors/auth/login", { email, password });
      console.log('vendorLogin response:', res.data);
      const token = res.data.accessToken || res.data.token;
      if (!token) {
        console.error('No token in response:', res.data);
        throw new Error('Login response missing token');
      }
      localStorage.setItem("vendor_token", token);
      console.log('vendor_token stored:', token ? token.slice(0,20) + '...' : 'null');
      return res.data;
    } catch (err) {
      console.log('vendorLogin error:', err.response?.status, err.response?.data);
      throw err;
    }
  }

  async vendorUpdate(formData) {
    const res = await api.put("/vendors", formData);
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

  async googleLogin(code) {
    const res = await api.post("/users/auth/login/google", {
      code,
    });
    const { accessToken } = res.data;

    localStorage.setItem("token", accessToken);
    return res.data;
  }

  async googleRegister(code) {
    const res = await api.post("/users/auth/register/google", {
      code,
    })
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
    console.log('🔑 adminLogin request');
    const res = await api.post("/admin/login", { email, password });
    console.log('🔑 adminLogin response:', res.data);
    
    let token = res.data.accessToken || res.data.token;
    if (!token) throw new Error('No admin token');
    
    localStorage.setItem("token", token);
    return res.data;
  }

  async vendorRefresh() {
    const res = await api.post("/vendors/auth/refresh");
    const token = res.data.accessToken || res.data.token;
    if (token) {
      localStorage.setItem("vendor_token", token);
    }
    return res.data;
  }

  async adminRegister(adminData) {
    const res = await api.post("/auth/register-admin", adminData);
    return res.data;
  }

async getVendorProfile() {
    try {
      const res = await api.get("/vendors/profile");
      console.log('Vendor profile fetched:', res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch vendor profile:', error.response?.data || error.message);
      throw error; // Don't fallback - let ProtectedRoute handle auth failure
    }
  }
}

export const authService = new AuthService();
