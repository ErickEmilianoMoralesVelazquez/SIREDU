import { apiService } from "./api.js";

class FavoritesService {
  async add(itemId) {
    return apiService.post(`/items/${itemId}/favorite`);
  }
  async remove(itemId) {
    return apiService.delete(`/items/${itemId}/favorite`);
  }
  async list() {
    return apiService.get(`/favorites`);
  }
  async isFavorite(itemId) {
    return apiService.get(`/items/${itemId}/favorite`);
  }
  async mostFavorited(limit = 10) {
    return apiService.get(`/favorites/most-favorited?limit=${limit}`);
  }
}

export const favoritesService = new FavoritesService();
