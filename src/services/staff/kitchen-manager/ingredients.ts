import { staffBackend } from "@/backend";
import type { Ingredient } from "@/interfaces/ingredient";

export class IngredientsService {
  static async getAll() {
    const { data } = await staffBackend.get<Ingredient[]>("/kitchen-manager/ingredients");
    return data;
  }
}
