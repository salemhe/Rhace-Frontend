import api from "@/lib/axios";

class ReservationSerice {
  async getSummary() {
    const res = await api.get(`/bookings/summary`);
    return res.data;
  }
}

export const reservationService = new ReservationSerice();
