import api from "@/lib/axios";

const extractArray = (p) => {
  if (Array.isArray(p)) return p;
  const candidates = [
    p?.data, p?.items, p?.results, p?.docs, p?.rows, p?.vendors, p?.users, p?.reservations, p?.list,
    p?.data?.data, p?.data?.items, p?.data?.results, p?.data?.docs, p?.data?.rows, p?.data?.vendors, p?.data?.users, p?.data?.reservations,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
};

export const getDashboardKPIs = () => api.get("/dashboard/kpis");
export const getRecentTransactions = () => api.get("/dashboard/recent-transactions");
export const getRevenueTrends = (params = {}) => api.get("/dashboard/revenue-trends", { params });
export const getTodaysReservations = () => api.get("/dashboard/todays-reservations");
export const getTopVendors = () => api.get("/dashboard/top-vendors");
export const getVendorsEarnings = () => api.get("/dashboard/vendors-earnings");
export const getUpcomingReservations = () => api.get("/dashboard/upcoming-reservations");
export const getBookingTrends = () => api.get("/dashboard/booking-trends");
export const getCustomerFrequency = () => api.get("/dashboard/customer-frequency");
export const getRevenueByCategory = () => api.get("/dashboard/revenue-by-category");
export const getReservationSources = () => api.get("/dashboard/reservation-sources");

export const getVendors = (params) => api.get("/vendors", { params }).then(response => {
  if (response.data) {
    if (response.data.message && typeof response.data.message === 'string') {
      response.data.message = response.data.message.replace('Fetched undefined vendor Succesfully!', 'Vendors fetched successfully!');
    } else if (typeof response.data === 'string') {
      response.data = response.data.replace(/undefined vendor/g, 'vendors').replace(/Succesfully/g, 'successfully');
    }
  }
  return response;
});
export const getVendorById = (id) => api.get(`/vendors/${id}`).then(response => {
  if (response.data) {
    if (response.data.message && typeof response.data.message === 'string') {
      response.data.message = response.data.message.replace('Fetched undefined vendor Succesfully!', 'Vendor fetched successfully!');
    } else if (typeof response.data === 'string') {
      response.data = response.data.replace(/undefined vendor/g, 'vendor').replace(/Succesfully/g, 'successfully');
    }
  }
  return response;
});
export const getVendorStats = () => api.get("/vendors/stats");
export const approveVendor = (id, data) => api.patch(`/vendors/${id}/approval`, data);
export const updateVendorStatus = (id, data) => api.patch(`/vendors/${id}/status`, data);
export const updateVendor = (id, data) => api.put(`/vendors/${id}`, data);
export const deleteVendor = (id) => api.delete(`/vendors/${id}`);
export const updateVendorCommission = (id, data) => api.patch(`/vendors/${id}/commission`, data);
export const bulkUpdateVendors = (data) => api.post("/vendors/bulk-update", data);
export const submitVendorKYC = (id, data) => api.post(`/vendors/${id}/kyc`, data);
export const verifyVendorKYC = (id, data) => api.patch(`/vendors/${id}/kyc/verify`, data);
export const addVendorBankAccount = (id, data) => api.post(`/vendors/${id}/bank-account`, data);
export const verifyVendorBankAccount = (id, data) => api.patch(`/vendors/${id}/bank-account/verify`, data);
export const exportVendors = (params) => api.get("/vendors/export", { params, responseType: 'blob', headers: { Accept: 'application/octet-stream' } });
export const getPublicVendors = () => api.get("/vendors/public");

export const getReservations = (params) => {
  return api.get("/reservations", { params }).then(response => {
    return response;
  }).catch(error => {
    console.error("Error fetching reservations:", error.response || error.message);
    throw error;
  });
};

export const getUserReservations = (userId, params = {}) => {
  // Try to use user-specific endpoint first, fallback to filtering all reservations
  return api.get(`/reservations/user/${userId}`, { params })
    .then(response => {
      // Check if response contains actual reservation data or just a welcome message
      if (typeof response.data === 'string' && response.data.includes('Welcome to Rhace Backend API')) {
        throw new Error('Endpoint not implemented');
      }

      return response;
    })
    .catch((error) => {
      // Fallback: fetch all reservations and filter client-side
      return api.get("/reservations", {
        params: {
          limit: 1000, // Reduced limit for better performance
          ...params
        }
      }).then(response => {
        // Filter reservations for this specific user
        const allReservations = extractArray(response?.data) || [];

        const userReservations = allReservations.filter(reservation => {
          const resUserId = reservation.customerId || reservation.guest || reservation.userId || reservation.user?.id || reservation.user?._id || reservation.customer?.id || reservation.customer?.email;
          return resUserId === userId;
        });

        return {
          ...response,
          data: userReservations
        };
      });
    });
};
export const getReservationById = (id) => api.get(`/reservations/${id}`);
export const updateReservationStatus = (id, data) => api.patch(`/reservations/${id}/status`, data);
export const addReservationMeals = (id, data) => api.post(`/reservations/${id}/meals`, data);
export const waiveReservationPenalty = (id, data) => api.patch(`/reservations/${id}/penalty/waive`, data);
export const getReservationCounters = () => {
  return api.get("/reservations/counters").then(response => {
    // Normalize counters payload to be easier for callers to consume
    const payload = response?.data;
    const normalized = payload?.data || payload || {};
    return { data: normalized };
  }).catch(error => {
    console.error("Error fetching counters:", error.response || error.message);
    throw error;
  });
};
export const exportReservations = (params) => api.get("/reservations/export", { params, responseType: 'blob', headers: { Accept: 'application/octet-stream' } });

export const getTotalEarnings = () => api.get("/payments/stats")
export const getVendorEarnings = (vendorId) => api.get(`/payments/vendor-earnings/${vendorId}`);
export const initiatePayout = (data) => api.post("/payments/payouts", data);
export const getPayouts = (params) => api.get("/payments/payouts", { params });
export const getPayoutById = (id) => api.get(`/payments/payouts/${id}`);
export const getVendorPayouts = (vendorId) => api.get(`/payments/payouts/vendor/${vendorId}`);
export const approvePayout = (id, data) => api.patch(`/payments/payouts/${id}/approve`, data);
export const getPayoutReceipt = (id) => api.get(`/payments/payouts/${id}/receipt`, { responseType: 'blob', headers: { Accept: 'application/octet-stream' } });

export const getUsers = (params) => api.get("/users", { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUserStats = () => api.get("/users/stats");
export const updateUserStatus = (id, data) => api.patch(`/users/${id}/status`, data);
export const updateUserRole = (id, data) => api.patch(`/users/${id}/role`, data);
export const toggleUserVIP = (id, data) => api.patch(`/users/${id}/vip`, data);
export const bulkUpdateUsers = (data) => api.post("/users/bulk-update", data);
export const exportUsers = (params) => api.get("/users/export", { params, responseType: 'blob', headers: { Accept: 'application/octet-stream' } });

export const getSettings = () => api.get("/settings");
export const updateSettings = (data) => api.put("/settings", data);
export const getAccountSettings = () => api.get("/settings/account");
export const updateAccountSettings = (data) => api.put("/settings/account", data);

export const generateVendorEarningsReport = (data) => api.post("/reports/vendor-earnings", data);
export const generateReservationsReport = (data) => api.post("/reports/reservations", data);
export const generatePaymentsReport = (data) => api.post("/reports/payments", data);
export const generateUsersReport = (data) => api.post("/reports/users", data);
export const generateVendorsReport = (data) => api.post("/reports/vendors", data);
export const getReportStatus = (id) => api.get(`/reports/${id}/status`);
export const downloadReport = (id) => api.get(`/reports/${id}/download`, { responseType: 'blob', headers: { Accept: 'application/octet-stream' } });

export const getPayments = (params) => api.get("/payments", { params });