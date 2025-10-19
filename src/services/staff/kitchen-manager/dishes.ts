import { staffBackend } from "@/backend";
import type { Dish } from "@/interfaces/dish";

export class DishesService {
  static async getAll() {
    const { data } = await staffBackend.get<Dish[]>("/kitchen-manager/dishes");
    return data;
  }
}
