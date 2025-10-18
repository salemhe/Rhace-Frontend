import api from "@/lib/axios";

class UserService {
  async getVendor(type, id) {
    const res = await api.get(`/vendors?type=${type}&id=${id ? id : ""}`);
    return res.data;
  }

  async createReservation(data) {
    const res = await api.post("/bookings/create", data);
    return res.data;
  }

  async fetchReservations({ vendorId, userId, bookingId }) {
    const res = await api.get(
      `/bookings?vendorId=${vendorId ? vendorId : ""}&userId=${userId ? userId : ""}&bookingId=${bookingId ? bookingId : ""}`
    );
    return res.data;
  }
}

export const userService = new UserService();
