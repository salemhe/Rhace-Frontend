import api from "@/lib/axios";

class ReservationSerice {
  async getSummary() {
    const vendorId = localStorage.getItem('vendorId') || 'current';
    const res = await api.get(`/bookings/summary`);
    return res.data;
  }

  async getReservationCounters() {
    const vendorId = localStorage.getItem('vendorId') || 'current';
    const res = await api.get(`/vendors/${vendorId}/reservations/counters`);
    return res.data;
  }

  async getTodaysReservations() {
    const vendorId = localStorage.getItem('vendorId') || 'current';
    const res = await api.get(`/vendors/${vendorId}/dashboard/todays-reservations`);
    return res.data;
  }

  async getBookingTrends() {
    const vendorId = localStorage.getItem('vendorId') || 'current';
    const res = await api.get(`/vendors/${vendorId}/dashboard/booking-trends`);
    return res.data;
  }

  async getCustomerFrequency() {
    const vendorId = localStorage.getItem('vendorId') || 'current';
    const res = await api.get(`/vendors/${vendorId}/dashboard/customer-frequency`);
    return res.data;
  }

  async getRevenueByCategory() {
    const vendorId = localStorage.getItem('vendorId') || 'current';
    const res = await api.get(`/vendors/${vendorId}/dashboard/revenue-by-category`);
    return res.data;
  }

  async getReservationSources() {
    const vendorId = localStorage.getItem('vendorId') || 'current';
    const res = await api.get(`/vendors/${vendorId}/dashboard/reservation-sources`);
    return res.data;
  }
}

export const reservationService = new ReservationSerice();