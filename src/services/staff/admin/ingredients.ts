import { staffBackend } from "@/backend";
import type { Ingredient } from "@/interfaces/ingredient";
import type { IngredientStockMovement } from "@/interfaces/ingredient-stock-movement";

export class IngredientsService {
  static async create(payload: {
    name: string;
    description: string;
    costPerUnit: number;
    unit: string;
    initialQuantity: number;
    lowStockThreshold: number;
  }) {
    const { data } = await staffBackend.post<Ingredient>(
      "/admin/ingredients",
      payload
    );
    return data;
  }

  static async getAll() {
    const { data } = await staffBackend.get<Ingredient[]>("/admin/ingredients");
    return data;
  }

  static async update(
    id: number,
    payload: {
      name: string;
      description: string;
      costPerUnit: number;
      unit: string;
      lowStockThreshold: number;
    }
  ) {
    const { data } = await staffBackend.put<Ingredient>(
      `/admin/ingredients/${id}`,
      payload
    );
    return data;
  }

  static async delete(id: number) {
    await staffBackend.delete(`/admin/ingredients/${id}`);
  }

  static async getStockMovements(
    id: number,
    page: number = 1,
    perPage: number = 10
  ) {
    const { data } = await staffBackend.get<{
      movements: IngredientStockMovement[];
      totalCount: number;
    }>(`/admin/ingredients/stock-movements/${id}`, {
      params: { page, perPage },
    });

    return data;
  }

  static async createStockMovement(
    ingredientId: number,
    quantity: number,
    reason: string
  ) {
    const { data } = await staffBackend.post<IngredientStockMovement>(
      `/admin/ingredients/stock-movements`,
      {
        ingredientId,
        quantity,
        reason,
      }
    );

    return data;
  }

  static async clearStockMovements(ingredientId: number) {
    await staffBackend.delete<{
      success: boolean;
    }>(`/admin/ingredients/stock-movements/${ingredientId}`);
  }
}
