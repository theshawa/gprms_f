import type { Ingredient } from "./ingredient";

export interface IngredientStockMovement {
  id: number;
  ingredientId: number;
  quantity: number;
  reason: string;
  createdAt: string;
  ingredient: Ingredient;
}
