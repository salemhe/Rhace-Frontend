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

  /**
   * Get all room types for a hotel
   * @param {string} hotelId
   */
  async getRoomTypes(hotelId) {
    const res = await api.get(`/hotels/${hotelId}/roomtypes`);
    return res.data;
  }

  /**
   * Get a single room type by id for a hotel
   * @param {string} hotelId
   * @param {string} id
   */
  async getRoomType(hotelId, id) {
    const res = await api.get(`/hotels/${hotelId}/roomtypes/${id}`);
    return res.data;
  }
}

export const clubService = new ClubService();
