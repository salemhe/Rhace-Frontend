import api from "@/lib/axios";

class UserService {
  async getFavorites(params = {}) {
    const response = await api.get("/users/favorites", { params });
    return response.data;
  }

  // Add to favorites - FIXED: removed trailing slash and added error handling
  async addToFavorites(vendorId, vendorType = "restaurant") {
    try {
      // Validate inputs
      if (!vendorId) {
        throw new Error("vendorId is required");
      }

      // Ensure vendorType is valid
      const validVendorType = vendorType || "restaurant";
      const allowedTypes = ["restaurant", "hotel", "club", "other"];
      if (!allowedTypes.includes(validVendorType)) {
        throw new Error(
          `Invalid vendorType: ${validVendorType}. Must be one of: ${allowedTypes.join(
            ", "
          )}`
        );
      }

      const payload = {
        vendorId: vendorId,
        vendorType: vendorType,
      };

      console.log("Sending payload to backend:", payload);
      console.log("Payload stringified:", JSON.stringify(payload));

      const response = await api.post("/users/favorites", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Backend response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in addToFavorites:",
        error.response?.data || error.message,
        "Status:",
        error.response?.status
      );
      throw error;
    }
  }
  // Remove from favorites - FIXED: removed trailing slash
  async removeFromFavorites(vendorId) {
    try {
      if (!vendorId) {
        throw new Error("vendorId is required");
      }

      const response = await api.delete("/users/favorites", {
        data: { vendorId },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error in removeFromFavorites:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getVendor(type, id) {
    const res = await api.get(`/vendors?type=${type}&id=${id ? id : ""}`);
    return res.data;
  }

  async getOffers(id) {
    const res = await api.get(`/vendors/offers?id=${id ? id : ""}`);
    return res.data;
  }

  async getTopRated({ type }) {
    const res = await api.get(`/vendors/top-rated?type=${type || ""}`);
    return res.data;
  }
  
  async getNearest({ longitude, latitude, type }) {
    const res = await api.get(
      `/vendors/nearest?longitude=${longitude || ""}&latitude=${
        latitude || ""
      }&type=${type || ""}`
    );
    return res.data;
  }

  async createReservation(data) {
    const res = await api.post("/bookings/create", data);
    return res.data;
  }

  async fetchReservationsStats() {
    const res = await api.get(`/bookings/stats`);
    return res.data;
  }

  async fetchReservations({ vendorId, userId, bookingId }) {
    const res = await api.get(
      `/bookings?vendorId=${vendorId ? vendorId : ""}&userId=${
        userId ? userId : ""
      }&bookingId=${bookingId ? bookingId : ""}`
    );
    return res.data;
  }

  async getReviews(id) {
    const res = await api.get(`/reviews/${id}`);
    return res.data;
  }

  async createReview(data) {
    const res = await api.post(`/reviews/create`, data);
    return res.data;
  }
}

export const userService = new UserService();
