import api from "@/lib/axios";

class PaymentService {
  async getPayments() {
    const res = await api.get("/payments");
    return res.data;
  }

  async getPaymentStats() {
    const res = await api.get("/payments/stats")
    return res.data;
  }

  async getTrends({ range }) {
    const res = await api.get(`/payments/earnings-trend?range=${range}`)
    return res.data;
  }

  async getPaymentInfo() {
    const res = await api.get("/payments/payment-info")
    return res.data;
  }

  async initializePayment({ amount, email, vendorId, bookingId, customerName, type, payLater }) {
    const res = await api.post("/payments/initialize", { amount, email, vendorId, bookingId, customerName, type, payLater })
    return res.data;
  }

  async verifyPayment(reference) {
    const res = await api.post("/payments/verify", { reference})
    return res.data;
  }
}

export const paymentService = new PaymentService();