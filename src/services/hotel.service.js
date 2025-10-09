import api from "@/lib/axios";

class HotelService {
  /**
   * Create a new room type for a hotel
   * @param {string} hotelId
   * @param {object} roomData
   */
  async createRoomType(hotelId, roomData) {
    const res = await api.post(`/hotels/${hotelId}/roomtypes`, roomData);
    return res.data;
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

export const hotelService = new HotelService();
