import api from  "@/lib/axios"

class UserService {
    async getVendor(type, id) {
        const res = await api.get(`/vendors?type=${type}&id=${id}`);
        return res.data;
    }
}

export const userService = new UserService();