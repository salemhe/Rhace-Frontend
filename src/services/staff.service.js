import api from "@/lib/axios";
class StaffService {
  async createStaff(data) {
    const res = await api.post("/staff", data);
    return res.data;
  }

  async getStaff() {
    const res = await api.get("/staff");
    return res.data;
  }
}

export const staffService = new StaffService();
