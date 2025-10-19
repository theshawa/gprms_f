import { customerBackend } from "@/backend";
import type { Dish } from "@/interfaces/dish";

export class DishesService {
  static async getAll() {
    const { data } = await customerBackend.get<Dish[]>("/menu/dishes");
    return data;
  }

  static async get(dishId: string) {
    const {data} = await customerBackend.get<Dish>(`/menu/dishes/${dishId}`)
    return data;
  }
}
