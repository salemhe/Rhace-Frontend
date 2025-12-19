import api from "@/lib/axios";

class UserService {
  async getVendor(type, id) {
    const res = await api.get(`/vendors?type=${type}&id=${id ? id : ""}`);
    return res.data;
  }

  async getOffers(id) {
    const res = await api.get(`/vendors/offers?id=${id ? id : ""}`);
    return res.data;
  }
  
  async getNearest({ longitude, latitude, type }) {
    const res = await api.get(`/vendors/nearest?longitude=${longitude || ""}&latitude=${latitude || ""}&type=${type || ""}`);
    return res.data;
  }

  async createReservation(data) {
    const res = await api.post("/bookings/create", data);
    return res.data;
  }

  async fetchReservationsStats() {
    const res = await api.get(
      `/bookings/stats`
    );
    return res.data
  }

  async fetchReservations({ vendorId, userId, bookingId }) {
    const res = await api.get(
      `/bookings?vendorId=${vendorId ? vendorId : ""}&userId=${userId ? userId : ""}&bookingId=${bookingId ? bookingId : ""}`
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
