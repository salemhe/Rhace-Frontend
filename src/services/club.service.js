import api from "@/lib/axios";

class ClubService {
  /**
   * Create a new room type for a hotel
   * @param {string} hotelId
   * @param {object} drinksData
   */
  async createDrinkType(drinksData) {
    try {
      const res = await api.post(`/drinks/`, drinksData);
      return res.data;
    } catch (error) {
      // Surface more useful debugging information for 4xx/5xx responses
      if (error.response) {
        // Backend responded with a status code outside 2xx
        // Log status and body to help diagnose 403 forbidden reasons
        // (e.g. missing/invalid token, insufficient permissions)
  console.error('[hotel.service] createRoomType failed', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // No response received
  console.error('[hotel.service] createRoomType no response received', error.request);
      } else {
        // Something happened setting up the request
  console.error('[hotel.service] createRoomType error', error.message);
      }
      throw error;
    }
  }

  async createBottleSet(data) {
    const res = await api.post("/bottle-sets", data)
    return res.data;
  }

  async getBottleSet(clubId) {
    const res = await api.get(`/bottle-sets?clubId=${clubId}`);
    return res.data;
  }

  async getDrinks(clubId) {
    const res = await api.get(`/drinks?clubId=${clubId}`);
    return res.data;
  }
}

export const clubService = new ClubService();
