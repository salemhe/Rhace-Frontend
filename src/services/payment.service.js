import api from "@/lib/axios";

class PaymentService {
  async getPayments() {
    const res = await api.get("/payments");
    return res.data;
  }

  async getPaymentStats() {
    const res = await api.get("/payments/stats");
    return res.data;
  }

  async getKpis() {
    const res = await api.get("/dashboard/kpis");
    return res.data;
  }

  async getTrends({ range }) {
    const res = await api.get(`/payments/earnings-trend?range=${range}`);
    return res.data;
  }

  async getPaymentInfo() {
    const res = await api.get("/payments/payment-info");
    return res.data;
  }

  async verifyPayment(reference) {
    const res = await api.post("/payments/verify", { reference });
    return res.data;
  }

  async initializePayment(bookingData) {
    const response = await api.post("/payments/initialize", bookingData);
    return response.data;
  }

  async completeReservation(trxref) {
    const response = await api.post("/bookings/complete-payment", {
      trxref,
    });
    return response.data;
  }
}

export const paymentService = new PaymentService();
