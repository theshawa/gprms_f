import { staffBackend } from "@/backend";
import type { Dish } from "@/interfaces/dish";

export class DishesService {
  static async create(
    payload: Omit<Omit<Dish, "id">, "ingredients"> & {
      ingredients: { id: number; quantity: number }[];
    }
  ) {
    const { data } = await staffBackend.post<Dish>("/admin/dishes", payload);

    return data;
  }

  static async getAll() {
    const { data } = await staffBackend.get<Dish[]>("/admin/dishes");
    return data;
  }

  static async update(
    id: number,
    payload: Omit<Omit<Dish, "id">, "ingredients"> & {
      ingredients: { id: number; quantity: number }[];
    }
  ) {
    const { data } = await staffBackend.put<Dish>(
      `/admin/dishes/${id}`,
      payload
    );
    return data;
  }

  static async delete(id: number) {
    await staffBackend.delete(`/admin/dishes/${id}`);
  }
}
