import api from "@/lib/axios";

class ReservationSerice {
  async getSummary() {
    const res = await api.get(`/bookings/summary`);
    return res.data;
  }

  async getReservationCounters() {
    const res = await api.get('/reservations/counters');
    return res.data;
  }

  async getTodaysReservations() {
    const res = await api.get('/dashboard/todays-reservations');
    return res.data;
  }

  async getBookingTrends() {
    const res = await api.get('/dashboard/booking-trends');
    return res.data;
  }

  async getCustomerFrequency() {
    const res = await api.get('/dashboard/customer-frequency');
    return res.data;
  }

  async getRevenueByCategory() {
    const res = await api.get('/dashboard/revenue-by-category');
    return res.data;
  }

  async getReservationSources() {
    const res = await api.get('/dashboard/reservation-sources');
    return res.data;
  }
}

export const reservationService = new ReservationSerice();