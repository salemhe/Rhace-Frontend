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

  async getTrends() {
    const res = await api.get("/payments/earnings-trend")
    return res.data;
  }

  async getPaymentInfo() {
    const res = await api.get("/payments/payment-info")
    return res.data;
  }
}

export const paymentService = new PaymentService();