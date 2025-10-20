import { customerBackend } from "@/backend";
import type { Dish } from "@/interfaces/dish";

export class CustomerDishesService {
  // Get all dishes (general menu)
  static async getAll() {
    const { data } = await customerBackend.get<Dish[]>("/menu/dishes");
    return data;
  }

  // Get specific dish details (general menu)
  static async get(dishId: string) {
    const { data } = await customerBackend.get<Dish>(`/menu/dishes/${dishId}`)
    return data;
  }

  // Get menu items for dine-in (table-specific)
  static async getDineInMenuItems(tableId: number, query?: string) {
    const { data } = await customerBackend.get<Dish[]>(
      `/dine-in/tables/${tableId}/menu-items`, 
      {
        params: { query }
      }
    );
    return data;
  }

  // Get specific dish details for dine-in
  static async getDineInDish(tableId: number, dishId: string) {
    const { data } = await customerBackend.get<Dish>(
      `/dine-in/tables/${tableId}/menu-items/${dishId}`
    );
    return data;
  }

  // Search dishes by category for dine-in
  static async searchDineInDishes(tableId: number, category?: string, searchTerm?: string) {
    const { data } = await customerBackend.get<Dish[]>(
      `/dine-in/tables/${tableId}/menu-items/search`,
      {
        params: { category, q: searchTerm }
      }
    );
    return data;
  }

  // Get recommended dishes for table
  static async getRecommendedDishes(tableId: number, limit: number = 5) {
    const { data } = await customerBackend.get<Dish[]>(
      `/dine-in/tables/${tableId}/recommended-dishes`,
      {
        params: { limit }
      }
    );
    return data;
  }
}
